import { Router } from "https://deno.land/x/oak@v6.3.1/mod.ts";
import getCharacters from "./controllers/getCharacters.ts"
import getCharacter from "./controllers/getCharacter.ts";
import putSwitchStatus from "./controllers/putSwitchStatus.ts";
import deleteCharacter from "./controllers/deleteCharacter.ts";

const router = new Router();

router.get("/status", (ctx) => {
  ctx.response.body = "OK";
  ctx.response.status = 200;
});

router.get("/characters", getCharacters);
router.get("/characters/:id", getCharacter);
router.put("/switchStatus/:id", putSwitchStatus);
router.delete("/character/:id", deleteCharacter);

export { router as default };
