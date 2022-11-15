import { Application, Router } from "oak";
import { getBookings, getCars } from "./resolvers/get.ts";

const router = new Router();

router
  .get("/test", (context) => (context.response.body = "Hello World"))
  .get("/bookings", getBookings)
  .get("/cars", getCars);

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });
