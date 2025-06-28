import {
  users,
  residencyApplications,
  businesses,
  jobs,
  jobApplications,
  products,
  culturalActivities,
  userActivities,
  miniApps,
  type User,
  type InsertUser,
  type ResidencyApplication,
  type InsertResidencyApplication,
  type Business,
  type InsertBusiness,
  type Job,
  type InsertJob,
  type JobApplication,
  type InsertJobApplication,
  type Product,
  type InsertProduct,
  type CulturalActivity,
  type UserActivity,
  type MiniApp,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, sql, count } from "drizzle-orm";
import bcrypt from "bcrypt";

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUserPoints(userId: number, points: number): Promise<void>;
  updateUserTier(userId: number, tier: number): Promise<void>;
  
  // Auth operations
  verifyPassword(plaintext: string, hash: string): Promise<boolean>;
  hashPassword(password: string): Promise<string>;
  
  // Residency operations
  createResidencyApplication(application: InsertResidencyApplication & { userId: number }): Promise<ResidencyApplication>;
  getResidencyApplicationsByUser(userId: number): Promise<ResidencyApplication[]>;
  getAllResidencyApplications(): Promise<ResidencyApplication[]>;
  updateResidencyApplicationStatus(id: number, status: string, reviewerId?: number): Promise<void>;
  
  // Business operations
  createBusiness(business: InsertBusiness & { ownerId: number }): Promise<Business>;
  getBusinessesByOwner(ownerId: number): Promise<Business[]>;
  getAllBusinesses(): Promise<Business[]>;
  updateBusinessStatus(id: number, status: string): Promise<void>;
  
  // Job operations
  createJob(job: InsertJob & { postedBy: number; businessId?: number }): Promise<Job>;
  getAllJobs(): Promise<Job[]>;
  getJobById(id: number): Promise<Job | undefined>;
  searchJobs(filters: { category?: string; experienceLevel?: string; keywords?: string }): Promise<Job[]>;
  applyToJob(application: InsertJobApplication & { applicantId: number; jobId: number }): Promise<JobApplication>;
  getJobApplicationsByUser(userId: number): Promise<JobApplication[]>;
  getJobApplicationsByJob(jobId: number): Promise<JobApplication[]>;
  
  // Product operations
  createProduct(product: InsertProduct & { sellerId: number }): Promise<Product>;
  getAllProducts(): Promise<Product[]>;
  getProductsByCategory(category: string): Promise<Product[]>;
  getProductsBySeller(sellerId: number): Promise<Product[]>;
  
  // Cultural activities
  getAllCulturalActivities(): Promise<CulturalActivity[]>;
  getCulturalActivityById(id: number): Promise<CulturalActivity | undefined>;
  completeActivity(userId: number, activityId: number, score?: number): Promise<UserActivity>;
  getUserActivities(userId: number): Promise<UserActivity[]>;
  
  // Mini apps
  getAllMiniApps(): Promise<MiniApp[]>;
  
  // Analytics
  getDashboardStats(): Promise<{
    totalResidents: number;
    totalBusinesses: number;
    totalBrowniePoints: number;
    satisfactionRate: number;
  }>;
}

export class DatabaseStorage implements IStorage {
  async getUser(id: number): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const hashedPassword = await this.hashPassword(insertUser.password);
    const [user] = await db
      .insert(users)
      .values({
        ...insertUser,
        password: hashedPassword,
        nftId: `nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Mock NFT ID
      })
      .returning();
    return user;
  }

  async updateUserPoints(userId: number, points: number): Promise<void> {
    await db
      .update(users)
      .set({ browniePoints: sql`${users.browniePoints} + ${points}` })
      .where(eq(users.id, userId));
    
    // Update tier based on points
    const [user] = await db.select({ browniePoints: users.browniePoints }).from(users).where(eq(users.id, userId));
    if (user) {
      const newTier = Math.floor(user.browniePoints / 1000) + 1;
      await this.updateUserTier(userId, Math.min(newTier, 5));
    }
  }

  async updateUserTier(userId: number, tier: number): Promise<void> {
    await db
      .update(users)
      .set({ tierLevel: tier })
      .where(eq(users.id, userId));
  }

  async verifyPassword(plaintext: string, hash: string): Promise<boolean> {
    return bcrypt.compare(plaintext, hash);
  }

  async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 10);
  }

  async createResidencyApplication(application: InsertResidencyApplication & { userId: number }): Promise<ResidencyApplication> {
    const [app] = await db
      .insert(residencyApplications)
      .values(application)
      .returning();
    return app;
  }

  async getResidencyApplicationsByUser(userId: number): Promise<ResidencyApplication[]> {
    return db.select().from(residencyApplications).where(eq(residencyApplications.userId, userId));
  }

  async getAllResidencyApplications(): Promise<ResidencyApplication[]> {
    return db.select().from(residencyApplications).orderBy(desc(residencyApplications.createdAt));
  }

  async updateResidencyApplicationStatus(id: number, status: string, reviewerId?: number): Promise<void> {
    await db
      .update(residencyApplications)
      .set({ 
        status, 
        reviewedBy: reviewerId,
        reviewedAt: new Date()
      })
      .where(eq(residencyApplications.id, id));
    
    // If approved, update user to digital resident
    if (status === 'approved') {
      const [app] = await db.select().from(residencyApplications).where(eq(residencyApplications.id, id));
      if (app) {
        await db
          .update(users)
          .set({ isDigitalResident: true })
          .where(eq(users.id, app.userId));
      }
    }
  }

  async createBusiness(business: InsertBusiness & { ownerId: number }): Promise<Business> {
    const [biz] = await db
      .insert(businesses)
      .values({
        ...business,
        businessNftId: `biz_nft_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`, // Mock business NFT
      })
      .returning();
    return biz;
  }

  async getBusinessesByOwner(ownerId: number): Promise<Business[]> {
    return db.select().from(businesses).where(eq(businesses.ownerId, ownerId));
  }

  async getAllBusinesses(): Promise<Business[]> {
    return db.select().from(businesses).orderBy(desc(businesses.createdAt));
  }

  async updateBusinessStatus(id: number, status: string): Promise<void> {
    await db
      .update(businesses)
      .set({ status })
      .where(eq(businesses.id, id));
  }

  async createJob(job: InsertJob & { postedBy: number; businessId?: number }): Promise<Job> {
    const [newJob] = await db
      .insert(jobs)
      .values(job)
      .returning();
    return newJob;
  }

  async getAllJobs(): Promise<Job[]> {
    return db.select().from(jobs).where(eq(jobs.isActive, true)).orderBy(desc(jobs.createdAt));
  }

  async getJobById(id: number): Promise<Job | undefined> {
    const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
    return job;
  }

  async searchJobs(filters: { category?: string; experienceLevel?: string; keywords?: string }): Promise<Job[]> {
    let query = db.select().from(jobs).where(eq(jobs.isActive, true));
    
    const conditions = [eq(jobs.isActive, true)];
    
    if (filters.category && filters.category !== 'All Categories') {
      conditions.push(eq(jobs.category, filters.category));
    }
    
    if (filters.experienceLevel && filters.experienceLevel !== 'Any Experience') {
      conditions.push(eq(jobs.experienceLevel, filters.experienceLevel));
    }
    
    if (filters.keywords) {
      conditions.push(sql`${jobs.title} ILIKE ${'%' + filters.keywords + '%'}`);
    }
    
    return db.select().from(jobs).where(and(...conditions)).orderBy(desc(jobs.createdAt));
  }

  async applyToJob(application: InsertJobApplication & { applicantId: number; jobId: number }): Promise<JobApplication> {
    const [app] = await db
      .insert(jobApplications)
      .values(application)
      .returning();
    return app;
  }

  async getJobApplicationsByUser(userId: number): Promise<JobApplication[]> {
    return db.select().from(jobApplications).where(eq(jobApplications.applicantId, userId));
  }

  async getJobApplicationsByJob(jobId: number): Promise<JobApplication[]> {
    return db.select().from(jobApplications).where(eq(jobApplications.jobId, jobId));
  }

  async createProduct(product: InsertProduct & { sellerId: number }): Promise<Product> {
    const [newProduct] = await db
      .insert(products)
      .values(product)
      .returning();
    return newProduct;
  }

  async getAllProducts(): Promise<Product[]> {
    return db.select().from(products).where(eq(products.inStock, true)).orderBy(desc(products.createdAt));
  }

  async getProductsByCategory(category: string): Promise<Product[]> {
    return db.select().from(products).where(and(eq(products.category, category), eq(products.inStock, true)));
  }

  async getProductsBySeller(sellerId: number): Promise<Product[]> {
    return db.select().from(products).where(eq(products.sellerId, sellerId));
  }

  async getAllCulturalActivities(): Promise<CulturalActivity[]> {
    return db.select().from(culturalActivities).where(eq(culturalActivities.isActive, true));
  }

  async getCulturalActivityById(id: number): Promise<CulturalActivity | undefined> {
    const [activity] = await db.select().from(culturalActivities).where(eq(culturalActivities.id, id));
    return activity;
  }

  async completeActivity(userId: number, activityId: number, score?: number): Promise<UserActivity> {
    // Get activity to determine points
    const activity = await this.getCulturalActivityById(activityId);
    if (!activity) {
      throw new Error('Activity not found');
    }

    const [completion] = await db
      .insert(userActivities)
      .values({
        userId,
        activityId,
        score,
        pointsEarned: activity.pointsReward,
      })
      .returning();

    // Update user points
    await this.updateUserPoints(userId, activity.pointsReward);

    return completion;
  }

  async getUserActivities(userId: number): Promise<UserActivity[]> {
    return db.select().from(userActivities).where(eq(userActivities.userId, userId));
  }

  async getAllMiniApps(): Promise<MiniApp[]> {
    return db.select().from(miniApps).where(eq(miniApps.active, true));
  }

  async getDashboardStats(): Promise<{
    totalResidents: number;
    totalBusinesses: number;
    totalBrowniePoints: number;
    satisfactionRate: number;
  }> {
    const [residentCount] = await db.select({ count: count() }).from(users).where(eq(users.isDigitalResident, true));
    const [businessCount] = await db.select({ count: count() }).from(businesses).where(eq(businesses.status, 'approved'));
    const [pointsSum] = await db.select({ sum: sql`COALESCE(SUM(${users.browniePoints}), 0)` }).from(users);

    return {
      totalResidents: residentCount.count || 0,
      totalBusinesses: businessCount.count || 0,
      totalBrowniePoints: Number(pointsSum.sum) || 0,
      satisfactionRate: 94, // Mock satisfaction rate
    };
  }
}

export const storage = new DatabaseStorage();
