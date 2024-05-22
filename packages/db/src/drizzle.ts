import { drizzle } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";

import * as schema from "./schema";
import { env } from "process";

const pool = neon(env.DATABASE_URL!);

const db = drizzle(pool, {
  schema,
  logger: process.env.DRIZZLE_LOG === "true",
});

type SchemaNames = keyof typeof schema;

export { db };
export type { SchemaNames };
