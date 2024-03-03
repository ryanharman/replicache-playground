import { type ServerType } from "../server/mutators";
import { Client } from "./client";

const mutators = new Client<ServerType>()
  .mutation("upsertTodo", async (tx, args) => {
    return await tx.set("todo", args);
  })
  .build();

type Mutators = typeof mutators;

export { mutators };
export type { Mutators };
