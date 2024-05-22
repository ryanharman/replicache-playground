import { relations } from "drizzle-orm";
import { pgTable, timestamps, id, space_id } from "../utils/schema-helpers";
import { text, boolean } from "drizzle-orm/pg-core";
import { replicache_space } from "./replicache";

const todo = pgTable("todo", {
  ...id,
  ...timestamps,
  ...space_id,
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
});

const todo_relations = relations(todo, ({ one }) => ({
  space_id: one(replicache_space, {
    fields: [todo.space_id],
    references: [replicache_space.id],
    relationName: "space",
  }),
}));

export { todo, todo_relations };
