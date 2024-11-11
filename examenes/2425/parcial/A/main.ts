// main.ts

import { MongoClient, ObjectId } from "mongodb";
import { PersonModel } from "./types.ts";
import { checkFriendsExist, fromModelToPerson } from "./utils.ts";

// Fetch the MongoDB connection URL from environment variables
const MONGO_URL = Deno.env.get("MONGO_URL");

// Check if MONGO_URL exists; if not, log an error and exit
if (!MONGO_URL) {
  console.error("MONGO_URL is not set");
  Deno.exit(1);
}

// Create a new MongoDB client and connect to the server
const client = new MongoClient(MONGO_URL);
await client.connect();
console.info("Connected to MongoDB");

// Select the 'agenda' database and the 'users' collection
const db = client.db("agenda");
const usersCollection = db.collection<PersonModel>("users");

// Main handler function to manage incoming HTTP requests
const handler = async (req: Request): Promise<Response> => {
  const method = req.method; // Get HTTP method (GET, POST, etc.)
  const url = new URL(req.url); // Parse the URL of the request
  const path = url.pathname; // Get the path from the URL

  // Handle different HTTP methods
  if (method === "GET") {
    if (path === "/personas") {
      // Handle listing people, with optional filtering by 'name'
      const name = url.searchParams.get("nombre"); // Get 'nombre' parameter if it exists
      const query = name ? { name } : {}; // Build query object
      const usersDB = await usersCollection.find(query).toArray(); // Fetch users from the database

      // Convert user data to a response-friendly format
      const users = await Promise.all(
        usersDB.map((user) => fromModelToPerson(user, usersCollection))
      );

      // Return the list of users as JSON
      return new Response(JSON.stringify(users), {
        headers: { "Content-Type": "application/json" },
      });
    } else if (path === "/persona") {
      // Handle retrieving a single person by email
      const email = url.searchParams.get("email"); // Get the 'email' parameter
      if (!email) {
        // Return an error if email is missing
        return new Response(JSON.stringify({ error: "Email is required" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Find the user by email
      const userDB = await usersCollection.findOne({ email });
      if (!userDB) {
        // If user is not found, return a 404 response
        return new Response(
          JSON.stringify({ error: "Persona no encontrada" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      // Convert the user data to a friendly format
      const user = await fromModelToPerson(userDB, usersCollection);

      // Return the user data as JSON
      return new Response(JSON.stringify(user), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } else if (method === "POST") {
    if (path === "/personas") {
      // Handle creating a new person
      const data = await req.json(); // Parse request body as JSON
      const { name, email, phone, friends } = data; // Destructure required fields

      // Check if any required field is missing
      if (!name || !email || !phone || !friends) {
        return new Response(
          JSON.stringify({
            error: "Name, email, phone and friends are required",
          }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Check if email is already in use
      const emailExists = await usersCollection.findOne({ email });
      if (emailExists) {
        return new Response(
          JSON.stringify({ error: "El email ya está registrado." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Check if phone number is already in use
      const phoneExists = await usersCollection.findOne({ phone });
      if (phoneExists) {
        return new Response(
          JSON.stringify({ error: "El teléfono ya está registrado." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Check if all friends exist in the database
      const friendsExist = await checkFriendsExist(friends, usersCollection);
      if (!friendsExist) {
        return new Response(
          JSON.stringify({ error: "Amigos no encontrados." }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      // Convert friend IDs to ObjectIds
      const friendIds = friends.map((id: string) => new ObjectId(id));

      // Insert the new person into the collection
      const insertResult = await usersCollection.insertOne({
        name,
        email,
        phone,
        friends: friendIds,
      });

      // Retrieve the inserted user
      const insertedUser = await usersCollection.findOne({
        _id: insertResult,
      });

      // Create a response with a success message and the created person data
      const response = {
        message: "Persona creada exitosamente",
        persona: await fromModelToPerson(insertedUser!, usersCollection),
      };

      return new Response(JSON.stringify(response), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    }
  } else if (method === "PUT") {
    if (path === "/persona") {
      // Handle updating a person's information
      const data = await req.json(); // Parse request body
      const { name, email, phone, friends } = data; // Destructure required fields

      // Check if any required field is missing
      if (!name || !email || !phone || !friends) {
        return new Response(JSON.stringify({ error: "Faltan datos" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Check if the person exists
      const user = await usersCollection.findOne({ email });
      if (!user) {
        return new Response(
          JSON.stringify({ error: "Persona no encontrada" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      // Check if the phone number is associated with another user
      const phoneExists = await usersCollection.findOne({
        phone,
        email: { $ne: email },
      });
      if (phoneExists) {
        return new Response(
          JSON.stringify({ error: "El teléfono ya está registrado." }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      // Check if all friends exist in the database
      const friendsExist = await checkFriendsExist(friends, usersCollection);
      if (!friendsExist) {
        return new Response(
          JSON.stringify({ error: "Amigos no encontrados." }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      // Convert friend IDs to ObjectIds
      const friendIds = friends.map((id: string) => new ObjectId(id));

      // Update the user's information
      await usersCollection.updateOne(
        { email },
        { $set: { name, phone, friends: friendIds } }
      );

      // Retrieve the updated user
      const updatedUser = await usersCollection.findOne({ email });

      const response = {
        message: "Persona actualizada exitosamente",
        persona: await fromModelToPerson(updatedUser!, usersCollection),
      };

      return new Response(JSON.stringify(response), {
        headers: { "Content-Type": "application/json" },
      });
    }
  } else if (method === "DELETE") {
    if (path === "/persona") {
      // Handle deletion of a person by email
      const data = await req.json(); // Parse request body
      const { email } = data; // Destructure 'email' from the request body

      // Check if email is provided
      if (!email) {
        return new Response(JSON.stringify({ error: "Email es requerido" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Find the user by email
      const user = await usersCollection.findOne({ email });
      if (!user) {
        return new Response(
          JSON.stringify({ error: "Persona no encontrada" }),
          { status: 404, headers: { "Content-Type": "application/json" } }
        );
      }

      // Delete the user
      await usersCollection.deleteOne({ email });

      // Remove the user from friends lists of other users
      await usersCollection.updateMany(
        { friends: user._id },
        { $pull: { friends: user._id } }
      );

      const response = { message: "Persona eliminada exitosamente" };

      return new Response(JSON.stringify(response), {
        headers: { "Content-Type": "application/json" },
      });
    }
  }

  // If no matching route is found, return a 404 response
  return new Response("Not found", { status: 404 });
};

// Start the server on port 3000 and use the handler function to process requests
Deno.serve({ port: 3000 }, handler);
