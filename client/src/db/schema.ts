import { mysqlTable, varchar, int, boolean, json, timestamp } from "drizzle-orm/mysql-core";

export const users = mysqlTable("users", {
  id: int("id").primaryKey().autoincrement(),
  name: varchar("name", { length: 255 }).notNull(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  password: varchar("password", { length: 255 }).notNull(),
  img: varchar("img", { length: 500 }),
});

export const projects = mysqlTable("projects", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  height: int("height").notNull(),
  width: int("width").notNull(),
  thumbnail: varchar("thumbnail", { length: 500 }),
  json: json("json").notNull(),
  userType: varchar("userType", { length: 100 }).notNull(),
  isPro: boolean("isPro").default(false),
  prize: int("prize"),
  isTemplate: boolean("isTemplate").default(false),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export const subscriptions = mysqlTable("subscriptions", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  price: int("price").notNull(),
  status: varchar("status", { length: 50 }).notNull(),
  currentPeriodEnd: timestamp("currentPeriodEnd").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export const downloads = mysqlTable("downloads", {
  id: int("id").primaryKey().autoincrement(),
  userId: int("userId").notNull(),
  projectId: int("projectId").notNull(),
  createdAt: timestamp("createdAt").defaultNow(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow(),
});

export const schema = { users, projects, subscriptions, downloads };
