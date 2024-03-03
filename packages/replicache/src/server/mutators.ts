import { upsertTodo } from "@playground/db";
import { Server } from "./server";

const serverMutators = new Server().expose("upsertTodo", upsertTodo);

// This type is used to generate type safe client mutations
// that share the same names and args as the server mutations
// when used alongside the client framework `./framework/client.ts`
type ServerType = typeof serverMutators;

export { serverMutators };
export type { ServerType };
