import { type ServerType } from "../server/mutators";
import { createClientMutations } from "./client";

const mutators = createClientMutations<ServerType>({
  upsertTodo: async (tx, args) => {
    return await tx.set("todo", args);
  },
});

type Mutators = typeof mutators;

export { mutators };
export type { Mutators };
