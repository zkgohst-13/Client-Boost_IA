import { mysqlTable, serial, varchar, datetime } from "drizzle-orm/mysql-core";
import { sql } from "drizzle-orm";

export const users = mysqlTable("users", {
  id: serial("id").primaryKey(),

  nom: varchar("nom", { length: 255 })    .notNull(),

  prenom: varchar("prenom", { length: 255 })
    .notNull(),

  email: varchar("email", { length: 255 })
    .unique()
    .notNull(),

  password: varchar("password", { length: 255 })
    .notNull(),

  createdAt: datetime("created_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),

  updatedAt: datetime("updated_at")
    .default(sql`CURRENT_TIMESTAMP`)
    .$onUpdate(() => sql`CURRENT_TIMESTAMP`)
    .notNull(),
})

