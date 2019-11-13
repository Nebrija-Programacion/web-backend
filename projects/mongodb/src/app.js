import { MongoClient, ObjectID } from "mongodb";
import "babel-polyfill";

const uri =
  "mongodb+srv://avalero:123456abc@cluster0-e8ug9.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

const databaseName = "blog";
const id = new ObjectID();
console.log(id);
console.log(id.getTimestamp());

client.connect(async err => {
  if (err) {
    return console.log(`Error connecting to ${uri}`);
  }
  console.log("Connected!");
  const db = client.db(databaseName);
  const collection = db.collection("authors");

  const result = await collection.insertOne({
    name: "Alberto",
    age: 41
  });

  console.log(result.ops);

  const _id = result.ops._id;

  const result2 = await collection.insertOne({
    name: "Pedro",
    age: 41
  });

  const updateOne = await collection.updateOne(
    { _id },
    { $set: { name: "Andres" } }
  );
  console.log(`update result: ${updateOne.result.ok}`);

  const updateMany = await collection.updateMany(
    { name: "Alberto" },
    { $set: { name: "Luis" } }
  );

  console.log(`update many: ${updateMany.result.nModified}`);

  const remove = collection.deleteMany({ name: "Luis" });

  // perform actions on the collection object
  client.close();
});
