import { Pool } from "pg";

// Connects as a role whose search_path is the "guardia" schema, so
// unqualified table names resolve there.
let pool: Pool | null = null;

export function getDb(): Pool {
  if (!pool) {
    const connectionString = process.env.DATABASE_URL;
    if (!connectionString) throw new Error("DATABASE_URL is not set");
    pool = new Pool({ connectionString, max: 5 });
  }
  return pool;
}
