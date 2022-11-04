// deno-lint-ignore-file
import { RouterContext } from "https://deno.land/x/oak@v11.1.0/router.ts";
import { SlotSchema } from "../db/schemas.ts";
import { Slot } from "../types.ts";
import { slotsCollection } from "../db/mongo.ts";

type PostSlotContext = RouterContext<
  "/addSlot",
  Record<string | number, string | undefined>,
  Record<string, any>
>;

export const postAddSlot = async (context: PostSlotContext) => {
  try {
    const result = context.request.body({ type: "json" });
    const value = await result.value;
    if (!value?.day || !value?.month || !value?.year || !value?.hour) {
      context.response.status = 400;
      return;
    }
    //check if date is correct
    if(value.year<=2022||(value.year<=2022&&value.month<11)||(value.year<=2022&&value.month<=11&&value.day<4)){
      context.response.status = 400;
      return;
    }
    let maxDay;
    switch(value.month){
      case 1:maxDay=31;
      break;
      case 2:maxDay=28;
      break;
      case 3:maxDay=31;
      break;
      case 4:maxDay=30;
      break;
      case 5:maxDay=31;
      break;
      case 6:maxDay=30;
      break;
      case 7:maxDay=31;
      break;
      case 8:maxDay=31;
      break;
      case 9:maxDay=30;
      break;
      case 10:maxDay=31;
      break;
      case 11:maxDay=30;
      break;
      case 12:maxDay=31;
      break;
    }
    if(!maxDay){
      context.response.status = 400;
      return;
    }
    if(value.day<1||value.day>maxDay)
    {
      context.response.status = 400;
      return;
    }
    const slot: Partial<Slot> = {
      ...value,
      avaliable: true,
    };
    //check if slot already in db
    const found = await slotsCollection.findOne({ day: value.day,month: value.month,year: value.year });
    console.log(found)
    if (found) {
      if(!found.avaliable){
        context.response.status=409;
        context.response.body = "error: la cita existe y esta ocupada";
        return;
      }
      context.response.body = "la cita ya esta en la base de datos y sigue libre";
      context.response.status=200;
      return;
    }
    await slotsCollection.insertOne(slot as SlotSchema);
    context.response.body = slot;
  } catch (e) {
    console.error(e);
    context.response.status = 500;
  }
};