import { sql } from "drizzle-orm";
import z from "zod";
import { zod } from "../utils/zod";
import { db } from "../index";
import { todo } from "../schema";

const updateTodo = zod(
  z.object({
    id: z.string(),
    title: z.string(),
    completed: z.boolean(),
  }),
  async (input) =>
    await db
      .update(todo)
      .set({
        title: input.title,
        completed: input.completed,
      })
      .where(sql`id = ${input.id}`),
);

export { updateTodo };
