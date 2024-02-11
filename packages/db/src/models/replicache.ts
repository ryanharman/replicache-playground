import { bigint, char, int } from "drizzle-orm/mysql-core";
import { timestamps, mysqlTable } from "../helpers";

const replicache_version = mysqlTable("replicache_version", {
  id: char("id", { length: 36 }).notNull().primaryKey(),
  version: int("version").notNull(),
  ...timestamps,
});

const replicache_client = mysqlTable("replicache_client", {
  id: char("id", { length: 36 }).notNull().primaryKey(),
  mutationID: bigint("mutation_id", {
    mode: "number",
  })
    .default(0)
    .notNull(),
  ...timestamps,
  clientGroupID: char("client_group_id", { length: 36 }).notNull(),
  clientVersion: int("client_version").notNull(),
});

export { replicache_client, replicache_version };
