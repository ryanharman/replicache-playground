import { char, timestamp } from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { pgTableCreator } from "drizzle-orm/pg-core";

const pgTable = pgTableCreator((name) => `replicache_${name}`);

const timestamps = {
  timeCreated: timestamp("time_created", {
    mode: "string",
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  timeUpdated: timestamp("time_updated", {
    mode: "string",
  })
    .notNull()
    .default(sql`CURRENT_TIMESTAMP`),
  timeDeleted: timestamp("time_deleted", {
    mode: "string",
  }),
};

const cuid = (name: string) => char(name, { length: 24 });

const id = {
  get id() {
    return cuid("id").primaryKey().notNull();
  },
};

const space_id = {
  get space_id() {
    return char("space_id", { length: 36 }).notNull();
  },
};

export { pgTable, id, cuid, timestamps, space_id };
