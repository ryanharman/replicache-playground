import z from "zod";
import { zod } from "../utils/zod";
import { db } from "../index";
import { todo } from "../schema";

const upsertTodo = zod(
  z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean(),
    spaceId: z.string(),
  }),
  async (input) =>
    await db
      .insert(todo)
      .values({
        id: input.id,
        title: input.title,
        completed: input.completed,
        space_id: input.spaceId,
      })
      .onConflictDoUpdate({
        target: [todo.id],
        set: {
          title: input.title,
          completed: input.completed,
          space_id: input.spaceId,
        },
      }),
);

export { upsertTodo };
