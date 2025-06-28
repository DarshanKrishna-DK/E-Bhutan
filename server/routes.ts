import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertUserSchema, 
  insertResidencyApplicationSchema,
  insertBusinessSchema,
  insertJobSchema,
  insertProductSchema,
  insertJobApplicationSchema
} from "@shared/schema";
import { z } from "zod";

// Enhanced schemas for validation
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const jobSearchSchema = z.object({
  category: z.string().optional(),
  experienceLevel: z.string().optional(),
  keywords: z.string().optional(),
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth routes
  app.post("/api/auth/register", async (req, res) => {
    try {
      const userData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByEmail(userData.email);
      if (existingUser) {
        return res.status(400).json({ message: "User already exists" });
      }
      
      const user = await storage.createUser(userData);
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Registration error:", error);
      res.status(400).json({ message: "Invalid user data" });
    }
  });

  app.post("/api/auth/login", async (req, res) => {
    try {
      const { email, password } = loginSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const isValidPassword = await storage.verifyPassword(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid credentials" });
      }
      
      const { password: _, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Login error:", error);
      res.status(400).json({ message: "Invalid login data" });
    }
  });

  // Dashboard stats
  app.get("/api/dashboard/stats", async (req, res) => {
    try {
      const stats = await storage.getDashboardStats();
      res.json(stats);
    } catch (error) {
      console.error("Dashboard stats error:", error);
      res.status(500).json({ message: "Failed to fetch dashboard stats" });
    }
  });

  // Residency routes
  app.post("/api/residency/apply", async (req, res) => {
    try {
      const applicationData = insertResidencyApplicationSchema.parse(req.body);
      const userId = req.body.userId || 1; // Mock user ID for demo
      
      const application = await storage.createResidencyApplication({
        ...applicationData,
        userId,
      });
      res.json(application);
    } catch (error) {
      console.error("Residency application error:", error);
      res.status(400).json({ message: "Invalid application data" });
    }
  });

  app.get("/api/residency/applications", async (req, res) => {
    try {
      const applications = await storage.getAllResidencyApplications();
      res.json(applications);
    } catch (error) {
      console.error("Fetch applications error:", error);
      res.status(500).json({ message: "Failed to fetch applications" });
    }
  });

  app.patch("/api/residency/applications/:id/status", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const { status, reviewerId } = req.body;
      
      await storage.updateResidencyApplicationStatus(id, status, reviewerId);
      res.json({ message: "Status updated successfully" });
    } catch (error) {
      console.error("Update application status error:", error);
      res.status(500).json({ message: "Failed to update status" });
    }
  });

  // Business routes
  app.post("/api/businesses", async (req, res) => {
    try {
      const businessData = insertBusinessSchema.parse(req.body);
      const ownerId = req.body.ownerId || 1; // Mock owner ID for demo
      
      const business = await storage.createBusiness({
        ...businessData,
        ownerId,
      });
      res.json(business);
    } catch (error) {
      console.error("Business creation error:", error);
      res.status(400).json({ message: "Invalid business data" });
    }
  });

  app.get("/api/businesses", async (req, res) => {
    try {
      const businesses = await storage.getAllBusinesses();
      res.json(businesses);
    } catch (error) {
      console.error("Fetch businesses error:", error);
      res.status(500).json({ message: "Failed to fetch businesses" });
    }
  });

  // Job routes
  app.post("/api/jobs", async (req, res) => {
    try {
      const jobData = insertJobSchema.parse(req.body);
      const postedBy = req.body.postedBy || 1; // Mock poster ID for demo
      
      const job = await storage.createJob({
        title: jobData.title,
        category: jobData.category,
        experienceLevel: jobData.experienceLevel,
        description: jobData.description,
        location: jobData.location,
        employmentType: jobData.employmentType,
        skills: jobData.skills,
        postedBy,
        businessId: jobData.businessId ? Number(jobData.businessId) : undefined,
      });
      res.json(job);
    } catch (error) {
      console.error("Job creation error:", error);
      res.status(400).json({ message: "Invalid job data" });
    }
  });

  app.get("/api/jobs", async (req, res) => {
    try {
      const filters = jobSearchSchema.parse(req.query);
      const jobs = await storage.searchJobs(filters);
      res.json(jobs);
    } catch (error) {
      console.error("Fetch jobs error:", error);
      res.status(500).json({ message: "Failed to fetch jobs" });
    }
  });

  app.get("/api/jobs/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const job = await storage.getJobById(id);
      if (!job) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.json(job);
    } catch (error) {
      console.error("Fetch job error:", error);
      res.status(500).json({ message: "Failed to fetch job" });
    }
  });

  app.post("/api/jobs/:id/apply", async (req, res) => {
    try {
      const jobId = parseInt(req.params.id);
      const applicationData = insertJobApplicationSchema.parse(req.body);
      const applicantId = req.body.applicantId || 1; // Mock applicant ID for demo
      
      const application = await storage.applyToJob({
        ...applicationData,
        jobId,
        applicantId,
      });
      res.json(application);
    } catch (error) {
      console.error("Job application error:", error);
      res.status(400).json({ message: "Invalid application data" });
    }
  });

  // Product routes
  app.get("/api/products", async (req, res) => {
    try {
      const products = await storage.getAllProducts();
      res.json(products);
    } catch (error) {
      console.error("Fetch products error:", error);
      res.status(500).json({ message: "Failed to fetch products" });
    }
  });

  app.post("/api/products", async (req, res) => {
    try {
      const productData = insertProductSchema.parse(req.body);
      const sellerId = req.body.sellerId || 1; // Mock seller ID for demo
      
      const product = await storage.createProduct({
        ...productData,
        sellerId,
      });
      res.json(product);
    } catch (error) {
      console.error("Product creation error:", error);
      res.status(400).json({ message: "Invalid product data" });
    }
  });

  // Cultural activities routes
  app.get("/api/cultural/activities", async (req, res) => {
    try {
      const activities = await storage.getAllCulturalActivities();
      res.json(activities);
    } catch (error) {
      console.error("Fetch activities error:", error);
      res.status(500).json({ message: "Failed to fetch cultural activities" });
    }
  });

  app.post("/api/cultural/activities/:id/complete", async (req, res) => {
    try {
      const activityId = parseInt(req.params.id);
      const { userId, score } = req.body;
      const actualUserId = userId || 1; // Mock user ID for demo
      
      const completion = await storage.completeActivity(actualUserId, activityId, score);
      res.json(completion);
    } catch (error) {
      console.error("Complete activity error:", error);
      res.status(400).json({ message: "Failed to complete activity" });
    }
  });

  // Mini apps routes
  app.get("/api/mini-apps", async (req, res) => {
    try {
      const miniApps = await storage.getAllMiniApps();
      res.json(miniApps);
    } catch (error) {
      console.error("Fetch mini apps error:", error);
      res.status(500).json({ message: "Failed to fetch mini apps" });
    }
  });

  // User routes
  app.get("/api/users/:id", async (req, res) => {
    try {
      const id = parseInt(req.params.id);
      const user = await storage.getUser(id);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      const { password, ...userWithoutPassword } = user;
      res.json(userWithoutPassword);
    } catch (error) {
      console.error("Fetch user error:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
