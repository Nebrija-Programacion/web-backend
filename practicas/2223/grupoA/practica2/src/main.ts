import { Application, Router } from "oak";

import { removeCar } from "./resolvers/delete.ts";
import { getCar } from "./resolvers/get.ts";
import { postAddCar } from "./resolvers/post.ts";
import { putAskCar, putReleaseCar } from "./resolvers/put.ts";

const router = new Router();

router
  .get("/car/:id", getCar)
  .post("/addCar", postAddCar)
  .delete("/removeCar/:id", removeCar)
  .put("/askCar", putAskCar)
  .put("/releaseCar/:id", putReleaseCar);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
