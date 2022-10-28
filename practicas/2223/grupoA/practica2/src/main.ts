import { Application, Router } from "oak";

import { removeCar } from "./resolvers/delete.ts";
import { getCar, getAskCar } from "./resolvers/get.ts";
import { postAddCar } from "./resolvers/post.ts";
import { putReleaseCar } from "./resolvers/put.ts";

const router = new Router();

router
  .get("/car/:id", getCar)
  .post("/addCar", postAddCar)
  .delete("/removeCar/:id", removeCar)
  .put("/askCar", getAskCar)
  .put("/releaseCar/:id", putReleaseCar);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
