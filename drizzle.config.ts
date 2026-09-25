import { loadEnvConfig } from "@next/env";
import { defineConfig } from "drizzle-kit";

loadEnvConfig(process.cwd());

export default defineConfig({
  dialect: "postgresql",
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dbCredentials: { url: process.env.DATABASE_URL! },
  schemaFilter: ["guardia"],
  // The app role can only create objects in the guardia schema, so keep
  // Drizzle's migration journal there instead of its default "drizzle" schema.
  migrations: { schema: "guardia" },
});
