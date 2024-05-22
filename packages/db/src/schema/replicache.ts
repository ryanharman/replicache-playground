import { bigint, char, integer } from "drizzle-orm/pg-core";
import { timestamps, pgTable, space_id } from "../utils/schema-helpers";
import { relations } from "drizzle-orm";

// https://doc.replicache.dev/strategies/per-space-version

const replicache_space = pgTable("replicache_space", {
  id: char("id", { length: 36 }).primaryKey(),
  version: integer("version").notNull().default(0),
  ...timestamps,
});

const replicache_client_group = pgTable("replicache_client_group", {
  id: char("id", { length: 36 }).primaryKey(),
  // TODO: Hook to a user type as and when it is defined
  userID: char("user_id", { length: 36 }).notNull(),
  ...space_id,
  ...timestamps,
});

const replicache_client = pgTable("replicache_client", {
  id: char("id", { length: 36 }).primaryKey(),
  clientGroupID: char("client_group_id", { length: 36 }).notNull(),
  lastMutationID: bigint("last_mutation_id", {
    mode: "number",
  })
    .default(0)
    .notNull(),
  lastModifiedVersion: integer("last_modified_version").notNull(),
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
