import { bigint, char, int } from "drizzle-orm/mysql-core";
import { timestamps, mysqlTable } from "../helpers";

// https://doc.replicache.dev/strategies/per-space-version

const replicache_space = mysqlTable("replicache_space", {
  id: char("id", { length: 36 }).notNull().primaryKey(),
  version: int("version").notNull(),
  ...timestamps,
});

const space_id = {
  get space_id() {
    return char("space_id", { length: 36 })
      .references(() => replicache_space.id)
      .notNull();
  },
};

const replicache_client_group = mysqlTable("replicache_client_group", {
  id: char("id", { length: 36 }).notNull().primaryKey(),
  // TODO: Hook to a user type as and when it is defined
  userID: char("user_id", { length: 36 }).notNull(),
  ...space_id,
  ...timestamps,
});

const replicache_client = mysqlTable("replicache_client", {
  id: char("id", { length: 36 }).notNull().primaryKey(),
  clientGroupID: char("client_group_id", { length: 36 }).notNull(),
  lastMutationID: bigint("last_mutation_id", {
    mode: "number",
  })
    .default(0)
    .notNull(),
  lastModifiedVersion: int("last_modified_version").notNull(),
  ...timestamps,
});

export {
  replicache_space,
  space_id,
  replicache_client_group,
  replicache_client,
};
