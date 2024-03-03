import z from "zod";
import { zod } from "../utils/zod";
import { db } from "../index";
import { todo } from "../schema";
import { createId } from "@paralleldrive/cuid2";

const upsertTodo = zod(
  z.object({
    id: z.string().optional(),
    title: z.string(),
    completed: z.boolean(),
    spaceId: z.string(),
  }),
  async (input) =>
    await db
      .insert(todo)
      .values({
        id: input.id ?? createId(),
        title: input.title,
        completed: input.completed,
        space_id: input.spaceId,
      })
      .onDuplicateKeyUpdate({
        set: {
          title: input.title,
          completed: input.completed,
          space_id: input.spaceId,
        },
      }),
);

export { upsertTodo };
