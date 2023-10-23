import express from "npm:express@4.18.2";
import getCharacter from "./resolvers/getCharacter.ts";

const app = express();

app.get("/character/:id", getCharacter);

app.listen(3000, () => {
  console.log("Server listening on port 3000");
});
