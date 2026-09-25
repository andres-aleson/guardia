import { pgSchema } from "drizzle-orm/pg-core";

// Every Guardia table lives in this schema; other apps share the database.
export const guardia = pgSchema("guardia");
