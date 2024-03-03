import "dotenv/config";
import { drizzle } from "drizzle-orm/planetscale-serverless";
import { connect } from "@planetscale/database";

import * as schema from "./schema";

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

export { db };
export type { SchemaNames };
