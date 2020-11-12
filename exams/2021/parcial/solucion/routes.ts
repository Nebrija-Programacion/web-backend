import { Router } from "https://deno.land/x/oak@v6.3.2/mod.ts";

import { postClient } from "./controllers/postClient.ts"
import { postInvoice } from "./controllers/postInvoice.ts";
import { postProduct } from "./controllers/postProduct.ts";

const router = new Router();

router.get("/status", (ctx) => {
  ctx.response.body= "OK" ;
  ctx.response.status = 200;
});

router.post("/client", postClient);
router.post("/product", postProduct);
router.post("/invoice", postInvoice);
router.get("/invoice/:ID", getInvoice);

export {router as default};