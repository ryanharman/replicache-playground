import { relations } from "drizzle-orm";
import { mysqlTable, timestamps, id, space_id } from "../utils/schema-helpers";
import { text, boolean } from "drizzle-orm/mysql-core";
import { replicache_space } from "./replicache";

const todo = mysqlTable("todo", {
  ...id,
  ...timestamps,
  ...space_id,
  title: text("title").notNull(),
  completed: boolean("completed").notNull().default(false),
});

const todo_relations = relations(todo, ({ many }) => ({
  client_space: many(replicache_space),
}));

export { todo, todo_relations };
