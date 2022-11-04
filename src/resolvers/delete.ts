import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { slotsCollection } from "../db/mongo.ts";
import { helpers } from "https://deno.land/x/oak@v11.1.0/mod.ts";
import { getQuery } from "https://deno.land/x/oak@v11.1.0/helpers.ts";
import { SlotSchema } from "../db/schemas.ts";

type DeleteSlotContext = RouterContext<
  "/removeSlot",
  Record<string | number, string | undefined>,
  Record<string, any>,
  
>;

export const removeSlot = async (context: DeleteSlotContext) => {
  console.log(1)
  try {
    const params = getQuery(context, { mergeParams: true });
    if (!params?.day || !params?.month || !params?.year || !params?.hour) {
      context.response.status = 400;
      return;
    }
    const slot: SlotSchema | undefined = await slotsCollection.findOne({ day: Number(params.day),month:Number(params.month),year: Number(params.year)});
    console.log(slot?.avaliable)
    if(slot){
      if(slot.avaliable)
      {
      await slotsCollection.deleteOne({
            _id: slot._id
          });
          context.response.status = 200;
        } else{
          context.response.status = 409;
          context.response.body = { message: "no se puede borrar una cita ocupada" };
        }
      } else {
          context.response.status = 400;
          context.response.body = { message: "slot not found" };
        }
      } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};
