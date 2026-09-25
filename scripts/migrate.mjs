// Applies drizzle-kit migrations from ./drizzle.
//
// Drizzle's stock migrator always runs `CREATE SCHEMA IF NOT EXISTS`, which
// needs database-level CREATE. guardia_app is deliberately limited to the
// guardia schema, so this runner does the same work without that step,
// keeping Drizzle's journal format in guardia.__drizzle_migrations.
import nextEnv from "@next/env";
import { readMigrationFiles } from "drizzle-orm/migrator";
import pg from "pg";

nextEnv.loadEnvConfig(process.cwd());

const JOURNAL = `"guardia"."__drizzle_migrations"`;
const migrations = readMigrationFiles({ migrationsFolder: "./drizzle" });
const client = new pg.Client({ connectionString: process.env.DATABASE_URL });

await client.connect();
try {
  await client.query("BEGIN");
  // Serialize concurrent runs (e.g. two deploys at once).
  await client.query("SELECT pg_advisory_xact_lock(hashtext('guardia_migrations'))");
  await client.query(`CREATE TABLE IF NOT EXISTS ${JOURNAL} (
    id SERIAL PRIMARY KEY,
    hash text NOT NULL,
    created_at bigint
  )`);
  const { rows } = await client.query(
    `SELECT created_at FROM ${JOURNAL} ORDER BY created_at DESC LIMIT 1`,
  );
  const lastApplied = rows[0] ? Number(rows[0].created_at) : -1;

  let applied = 0;
  for (const migration of migrations) {
    if (migration.folderMillis <= lastApplied) continue;
    for (const statement of migration.sql) await client.query(statement);
    await client.query(
      `INSERT INTO ${JOURNAL} (hash, created_at) VALUES ($1, $2)`,
      [migration.hash, migration.folderMillis],
    );
    applied++;
  }
  await client.query("COMMIT");
  console.log(`Applied ${applied} migration(s); ${migrations.length} total.`);
} catch (error) {
  await client.query("ROLLBACK");
  console.error("Migration failed:", error.message);
  process.exitCode = 1;
} finally {
  await client.end();
}
