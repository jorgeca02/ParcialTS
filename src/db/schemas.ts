import { ObjectId } from "https://deno.land/x/mongo@v0.31.1/mod.ts";
import { Slot } from "../types.ts";

export type SlotSchema = Omit<Slot, "id"> & {
  _id: ObjectId;
};