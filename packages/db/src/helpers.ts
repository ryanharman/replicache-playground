import { char, timestamp, mysqlTableCreator } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

const mysqlTable = mysqlTableCreator((name) => `replicache_${name}`);

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
    .default(sql`CURRENT_TIMESTAMP`)
    .onUpdateNow(),
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

export { mysqlTable, id, cuid, timestamps };
