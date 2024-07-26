import { createKysely } from "@vercel/postgres-kysely";

import type { DB } from "./prisma/types";

export { jsonArrayFrom, jsonObjectFrom } from "kysely/helpers/postgres";

export * from "./prisma/types";
export * from "./prisma/enums";
export * from "@prisma/adapter-neon";
export * from "@neondatabase/serverless";

export const db = createKysely<DB>();
