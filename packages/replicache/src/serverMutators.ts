import { upsertTodo } from "@playground/db/src/core";
import { Server } from "./framework/server";

const serverMutators = new Server().expose("upsertTodo", upsertTodo);
type ServerType = typeof serverMutators;

export { serverMutators };
export type { ServerType };
