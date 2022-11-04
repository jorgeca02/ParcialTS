import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { slotsCollection } from "../db/mongo.ts";
import { SlotSchema } from "../db/schemas.ts";

type BookSlotContext = RouterContext<
  "/bookSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;
export const bookSlot = async (context: BookSlotContext) => {

  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;
    if (!value?.day || !value?.month || !value?.year || !value?.hour ||!value?.dni) {
      context.response.status = 400;
      return;
    }
      const slot: SlotSchema | undefined = await slotsCollection.findOne({ day: value.day,month: value.month,year: value.year});
      if (slot) {
        if (!slot.avaliable) {
          context.response.status = 409;
          context.response.body = { message: "cita ya esta ocupada" };
          return;
        } else {
          context.response.status = 200;
          await slotsCollection.updateOne(
            {
              _id: slot._id,
            },
            {
              $set: {
                avaliable: false,
                dni:value.dni,
              },
            }
          );
          context.response.body = { message: "cita reservada de forma correcta" };
        }
      } else {
        context.response.status = 404;
        context.response.body = { message: "la cita no existe" };
      }
    }catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};