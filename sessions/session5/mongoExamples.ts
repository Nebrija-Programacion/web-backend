import {
  MongoClient,
  ObjectId,
} from "https://deno.land/x/mongo@v0.12.1/mod.ts";

const client = new MongoClient();
client.connectWithUri("mongodb://localhost:27017");

// Defining schema interface
interface UserSchema {
  _id: { $oid: string };
  username: string;
  password: string;
}

try {
  //select database
  const db = client.database("test");
  const users = db.collection<UserSchema>("users");

  // insert user with mongo generated id
  const insertUser1 = await users.insertOne({
    username: "user1",
    password: "pass1",
  });

  console.log(insertUser1); // returns objectid: { "$oid": "5f85b594006a29e100dw9054" }

  const insertMany = await users.insertMany([
    {
      username: "user2",
      password: "pass2",
    },
    {
      username: "user3",
      password: "pass3",
    },
  ]);

  console.log(insertMany); // returns array of objectid: [ { "$oid": "5f85b8bf0028a70d009d905e" }, { "$oid": "5f85b8bf005a3f1e009d905d" } ]

  // return first document matching the criteria
  const foundUser = await users.findOne({ username: "user1" });
  if (foundUser) {
    console.log(foundUser); // returns full document (if found) { _id: { "$oid": "5f85b594006a29e1009d9053" }, username: "user1", password: "pass1" }
  }

  const notFoundUser = await users.findOne({ username: "user5" });
  console.log(notFoundUser); // null

  const manyFound = await users.find({ username: { $regex: ".*user.*" } });
  if (manyFound.length > 0) {
    console.log(manyFound);
  } else {
    console.log("No result matching your criteria");
  }
} catch (e) {
  console.error(e);
}
