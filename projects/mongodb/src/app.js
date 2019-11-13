import { MongoClient, ObjectID } from "mongodb";
import "babel-polyfill";

const uri =
  "mongodb+srv://avalero:123456abc@cluster0-e8ug9.mongodb.net/test?retryWrites=true&w=majority";
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

console.log(1);
const promise = new Promise((resolve, reject) => {
  setTimeout(() => resolve("hola"), 2000);
});

promise.then(message => console.log(message));

console.log(2);
// const databaseName = "blog";
// const id = new ObjectID();
// console.log(id);
// console.log(id.getTimestamp());

// client.connect(async err => {
//   if (err) {
//     return console.log(`Error connecting to ${uri}`);
//   }
//   console.log("Connected!");
//   const db = client.db(databaseName);
//   const collection = db.collection("authors");
//   const result = await collection.insertOne({
//     name: "Alberto",
//     age: 41
//   });

//   console.log(result.ops);

//   // perform actions on the collection object
//   client.close();
// });
