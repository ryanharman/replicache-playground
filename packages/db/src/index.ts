import "dotenv/config";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";

import * as schema from "./schema";
import * as core from "./core";

const connection = connect({
  host: process.env.DATABASE_HOST,
  username: process.env.DATABASE_USERNAME,
  password: process.env.DATABASE_PASSWORD,
});

const db = drizzle(connection, {
  schema,
  logger: process.env.DRIZZLE_LOG === "true",
});

type SchemaNames = keyof typeof schema;

export { db, schema, core };
export type { SchemaNames };
export * from "drizzle-orm";
