import { bigint, char, int } from "drizzle-orm/mysql-core";
import { timestamps, mysqlTable, space_id } from "../helpers";
import { relations } from "drizzle-orm";

// https://doc.replicache.dev/strategies/per-space-version

const replicache_space = mysqlTable("replicache_space", {
  id: char("id", { length: 36 }).notNull().primaryKey(),
  version: int("version").notNull().default(0),
  ...timestamps,
});

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

const replicache_client_relations = relations(replicache_client, ({ one }) => ({
  clientGroup: one(replicache_client_group, {
    fields: [replicache_client.clientGroupID],
    references: [replicache_client_group.id],
  }),
}));

export {
  replicache_space,
  replicache_client_group,
  replicache_client,
  replicache_client_relations,
};
