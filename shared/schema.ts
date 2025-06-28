import { pgTable, text, serial, integer, boolean, timestamp, jsonb, varchar, decimal } from "drizzle-orm/pg-core";
import { relations } from "drizzle-orm";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Users table
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").notNull().unique(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  password: text("password").notNull(),
  profileImageUrl: text("profile_image_url"),
  browniePoints: integer("brownie_points").notNull().default(0),
  tierLevel: integer("tier_level").notNull().default(1),
  isDigitalResident: boolean("is_digital_resident").notNull().default(false),
  nftId: text("nft_id"), // Mock NFT ID
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Residency applications
export const residencyApplications = pgTable("residency_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  firstName: text("first_name").notNull(),
  lastName: text("last_name").notNull(),
  email: text("email").notNull(),
  countryOfOrigin: text("country_of_origin").notNull(),
  reasonForResidency: text("reason_for_residency").notNull(),
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  reviewedBy: integer("reviewed_by").references(() => users.id),
  reviewedAt: timestamp("reviewed_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Businesses
export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  licenseNumber: text("license_number"),
  businessNftId: text("business_nft_id"), // Mock business NFT
  status: text("status").notNull().default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
});

// Jobs
export const jobs = pgTable("jobs", {
  id: serial("id").primaryKey(),
  businessId: integer("business_id").references(() => businesses.id),
  postedBy: integer("posted_by").references(() => users.id).notNull(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  category: text("category").notNull(),
  experienceLevel: text("experience_level").notNull(),
  location: text("location").notNull(),
  employmentType: text("employment_type").notNull(), // full-time, part-time, contract
  skills: text("skills").array().notNull().default([]),
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Job applications
export const jobApplications = pgTable("job_applications", {
  id: serial("id").primaryKey(),
  jobId: integer("job_id").references(() => jobs.id).notNull(),
  applicantId: integer("applicant_id").references(() => users.id).notNull(),
  coverLetter: text("cover_letter"),
  resumeUrl: text("resume_url"),
  status: text("status").notNull().default("pending"), // pending, reviewed, accepted, rejected
  appliedAt: timestamp("applied_at").defaultNow(),
});

// Marketplace products
export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  sellerId: integer("seller_id").references(() => users.id).notNull(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  imageUrl: text("image_url"),
  category: text("category").notNull(),
  browniePointsReward: integer("brownie_points_reward").notNull().default(0),
  inStock: boolean("in_stock").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// Cultural activities/quizzes
export const culturalActivities = pgTable("cultural_activities", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  type: text("type").notNull(), // quiz, learning_module, contribution
  content: jsonb("content").notNull(), // Quiz questions, learning materials, etc.
  pointsReward: integer("points_reward").notNull(),
  imageUrl: text("image_url"),
  difficulty: text("difficulty").notNull().default("beginner"), // beginner, intermediate, advanced
  isActive: boolean("is_active").notNull().default(true),
  createdAt: timestamp("created_at").defaultNow(),
});

// User activity completions
export const userActivities = pgTable("user_activities", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  activityId: integer("activity_id").references(() => culturalActivities.id).notNull(),
  score: integer("score"), // For quizzes
  pointsEarned: integer("points_earned").notNull(),
  completedAt: timestamp("completed_at").defaultNow(),
});

// Mini apps
export const miniApps = pgTable("mini_apps", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  developer: text("developer").notNull(),
  version: text("version").notNull().default("1.0.0"),
  price: decimal("price", { precision: 10, scale: 2 }).notNull().default("0.00"),
  rating: decimal("rating", { precision: 3, scale: 2 }).notNull().default("0.00"),
  downloads: integer("downloads").notNull().default(0),
  active: boolean("active").notNull().default(true),
  codeHash: text("code_hash").notNull(),
  permissions: jsonb("permissions").notNull().default('[]'),
  verified: boolean("verified").notNull().default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Blockchain transactions
export const blockchainTransactions = pgTable("blockchain_transactions", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id),
  transactionHash: text("transaction_hash").notNull().unique(),
  transactionType: text("transaction_type").notNull(), // nft_mint, token_transfer, app_purchase
  fromAddress: text("from_address"),
  toAddress: text("to_address"),
  amount: text("amount"),
  currency: text("currency"), // NUBUCK, AVAX
  status: text("status").notNull().default("pending"), // pending, confirmed, failed
  blockNumber: integer("block_number"),
  gasUsed: text("gas_used"),
  metadata: jsonb("metadata"),
  createdAt: timestamp("created_at").defaultNow(),
  confirmedAt: timestamp("confirmed_at"),
});

// NFTs
export const nfts = pgTable("nfts", {
  id: serial("id").primaryKey(),
  tokenId: text("token_id").notNull().unique(),
  contractAddress: text("contract_address").notNull(),
  ownerId: integer("owner_id").references(() => users.id).notNull(),
  tokenType: text("token_type").notNull(), // residency, business, credential
  metadata: jsonb("metadata").notNull(),
  isSoulbound: boolean("is_soulbound").notNull().default(false),
  mintedAt: timestamp("minted_at").defaultNow(),
  transactionHash: text("transaction_hash"),
});

// Soulbound credentials
export const soulboundCredentials = pgTable("soulbound_credentials", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  nftId: integer("nft_id").references(() => nfts.id).notNull(),
  credentialType: integer("credential_type").notNull(), // 1-6 per enum
  issuer: text("issuer").notNull(),
  issuedAt: timestamp("issued_at").defaultNow(),
  revokedAt: timestamp("revoked_at"),
  metadata: jsonb("metadata").notNull(),
  verified: boolean("verified").notNull().default(true),
});

// Government services
export const governmentServices = pgTable("government_services", {
  id: serial("id").primaryKey(),
  serviceName: text("service_name").notNull().unique(),
  description: text("description").notNull(),
  department: text("department").notNull(),
  contractAddress: text("contract_address"),
  isActive: boolean("is_active").notNull().default(true),
  requiredCredentials: jsonb("required_credentials").default('[]'),
  processingTime: text("processing_time"),
  fee: decimal("fee", { precision: 10, scale: 2 }).default("0.00"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Service applications
export const serviceApplications = pgTable("service_applications", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  serviceId: integer("service_id").references(() => governmentServices.id).notNull(),
  applicationData: jsonb("application_data").notNull(),
  status: text("status").notNull().default("submitted"), // submitted, under_review, approved, rejected
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
  reviewedBy: integer("reviewed_by").references(() => users.id),
  notes: text("notes"),
  transactionHash: text("transaction_hash"),
});

// Wallet balances
export const walletBalances = pgTable("wallet_balances", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  walletAddress: text("wallet_address").notNull(),
  nubuckBalance: text("nubuck_balance").notNull().default("0"),
  avaxBalance: text("avax_balance").notNull().default("0"),
  lastUpdated: timestamp("last_updated").defaultNow(),
});

// Gamification rewards
export const gamificationRewards = pgTable("gamification_rewards", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  activityType: text("activity_type").notNull(), // quiz, module, project
  activityId: integer("activity_id"),
  pointsEarned: integer("points_earned").notNull(),
  nubucksEarned: text("nubucks_earned").notNull().default("0"),
  verified: boolean("verified").notNull().default(false),
  verificationHash: text("verification_hash"),
  earnedAt: timestamp("earned_at").defaultNow(),
});

// Language settings
export const userLanguageSettings = pgTable("user_language_settings", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").references(() => users.id).notNull(),
  primaryLanguage: text("primary_language").notNull().default("en"),
  secondaryLanguage: text("secondary_language").default("dz"),
  autoTranslate: boolean("auto_translate").notNull().default(false),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Relations
export const usersRelations = relations(users, ({ many }) => ({
  residencyApplications: many(residencyApplications),
  businesses: many(businesses),
  jobsPosted: many(jobs),
  jobApplications: many(jobApplications),
  products: many(products),
  activities: many(userActivities),
}));

export const residencyApplicationsRelations = relations(residencyApplications, ({ one }) => ({
  user: one(users, {
    fields: [residencyApplications.userId],
    references: [users.id],
  }),
  reviewer: one(users, {
    fields: [residencyApplications.reviewedBy],
    references: [users.id],
  }),
}));

export const businessesRelations = relations(businesses, ({ one, many }) => ({
  owner: one(users, {
    fields: [businesses.ownerId],
    references: [users.id],
  }),
  jobs: many(jobs),
}));

export const jobsRelations = relations(jobs, ({ one, many }) => ({
  business: one(businesses, {
    fields: [jobs.businessId],
    references: [businesses.id],
  }),
  poster: one(users, {
    fields: [jobs.postedBy],
    references: [users.id],
  }),
  applications: many(jobApplications),
}));

export const jobApplicationsRelations = relations(jobApplications, ({ one }) => ({
  job: one(jobs, {
    fields: [jobApplications.jobId],
    references: [jobs.id],
  }),
  applicant: one(users, {
    fields: [jobApplications.applicantId],
    references: [users.id],
  }),
}));

export const productsRelations = relations(products, ({ one }) => ({
  seller: one(users, {
    fields: [products.sellerId],
    references: [users.id],
  }),
}));

export const culturalActivitiesRelations = relations(culturalActivities, ({ many }) => ({
  userActivities: many(userActivities),
}));

export const userActivitiesRelations = relations(userActivities, ({ one }) => ({
  user: one(users, {
    fields: [userActivities.userId],
    references: [users.id],
  }),
  activity: one(culturalActivities, {
    fields: [userActivities.activityId],
    references: [culturalActivities.id],
  }),
}));

// Insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  browniePoints: true,
  tierLevel: true,
  isDigitalResident: true,
  nftId: true,
  createdAt: true,
  updatedAt: true,
});

export const insertResidencyApplicationSchema = createInsertSchema(residencyApplications).omit({
  id: true,
  userId: true,
  status: true,
  reviewedBy: true,
  reviewedAt: true,
  createdAt: true,
});

export const insertBusinessSchema = createInsertSchema(businesses).omit({
  id: true,
  ownerId: true,
  licenseNumber: true,
  businessNftId: true,
  status: true,
  createdAt: true,
});

export const insertJobSchema = createInsertSchema(jobs).omit({
  id: true,
  postedBy: true,
  isActive: true,
  createdAt: true,
});

export const insertProductSchema = createInsertSchema(products).omit({
  id: true,
  sellerId: true,
  createdAt: true,
});

export const insertJobApplicationSchema = createInsertSchema(jobApplications).omit({
  id: true,
  applicantId: true,
  status: true,
  appliedAt: true,
});

// Types
export type User = typeof users.$inferSelect;
export type InsertUser = z.infer<typeof insertUserSchema>;
export type ResidencyApplication = typeof residencyApplications.$inferSelect;
export type InsertResidencyApplication = z.infer<typeof insertResidencyApplicationSchema>;
export type Business = typeof businesses.$inferSelect;
export type InsertBusiness = z.infer<typeof insertBusinessSchema>;
export type Job = typeof jobs.$inferSelect;
export type InsertJob = z.infer<typeof insertJobSchema>;
export type JobApplication = typeof jobApplications.$inferSelect;
export type InsertJobApplication = z.infer<typeof insertJobApplicationSchema>;
export type Product = typeof products.$inferSelect;
export type InsertProduct = z.infer<typeof insertProductSchema>;
export type CulturalActivity = typeof culturalActivities.$inferSelect;
export type UserActivity = typeof userActivities.$inferSelect;
export type MiniApp = typeof miniApps.$inferSelect;
export type BlockchainTransaction = typeof blockchainTransactions.$inferSelect;
export type NFT = typeof nfts.$inferSelect;
export type SoulboundCredential = typeof soulboundCredentials.$inferSelect;
export type GovernmentService = typeof governmentServices.$inferSelect;
export type ServiceApplication = typeof serviceApplications.$inferSelect;
export type WalletBalance = typeof walletBalances.$inferSelect;
export type GamificationReward = typeof gamificationRewards.$inferSelect;
export type UserLanguageSetting = typeof userLanguageSettings.$inferSelect;
