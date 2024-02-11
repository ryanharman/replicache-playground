import { space_id } from "./replicache";
import { mysqlTable, timestamps, id } from "../helpers";
import { char, boolean } from "drizzle-orm/mysql-core";

const todo = mysqlTable("todo", {
  ...id,
  ...timestamps,
  ...space_id,
  title: char("title", { length: 256 }).notNull(),
  completed: boolean("completed").notNull().default(false),
});

export { todo };
