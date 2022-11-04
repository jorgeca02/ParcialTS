
import { Application, Router } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { removeSlot } from "./resolvers/delete.ts";
import { postAddSlot } from "./resolvers/post.ts";
import { bookSlot } from "./resolvers/put.ts";


const router = new Router();
router
  .post("/addSlot", postAddSlot)
  .put("/bookSlot", bookSlot)
  .delete("/removeSlot", removeSlot)

const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 7777 });