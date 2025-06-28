import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import JobCard from "@/components/job-card";
import { insertJobSchema, insertJobApplicationSchema } from "@shared/schema";
import { Search, Plus, Filter, Briefcase, MapPin } from "lucide-react";
import { z } from "zod";
import { BuddhaFace, Stupa, LotusPattern } from "@/components/cultural-patterns";

const jobFormSchema = insertJobSchema.extend({
  skills: z.array(z.string()).min(1, "At least one skill is required"),
});

const applicationFormSchema = insertJobApplicationSchema;

type JobFormData = z.infer<typeof jobFormSchema>;
type ApplicationFormData = z.infer<typeof applicationFormSchema>;

export default function Jobs() {
  const { toast } = useToast();
  const [searchFilters, setSearchFilters] = useState({
    keywords: "",
    category: "",
    experienceLevel: "",
  });
  const [isJobDialogOpen, setIsJobDialogOpen] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState<number | null>(null);
  const [isApplicationDialogOpen, setIsApplicationDialogOpen] = useState(false);

  const jobForm = useForm<JobFormData>({
    resolver: zodResolver(jobFormSchema),
    defaultValues: {
      title: "",
      description: "",
      category: "",
      experienceLevel: "",
      location: "",
      employmentType: "",
      skills: [],
    },
  });

  const applicationForm = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationFormSchema),
    defaultValues: {
      coverLetter: "",
      resumeUrl: "",
    },
  });

  const { data: jobs, isLoading } = useQuery({
    queryKey: ["/api/jobs", searchFilters],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchFilters.keywords) params.append("keywords", searchFilters.keywords);
      if (searchFilters.category) params.append("category", searchFilters.category);
      if (searchFilters.experienceLevel) params.append("experienceLevel", searchFilters.experienceLevel);
      
      const response = await fetch(`/api/jobs?${params.toString()}`);
      if (!response.ok) throw new Error("Failed to fetch jobs");
      return response.json();
    },
  });

  const createJobMutation = useMutation({
    mutationFn: async (data: JobFormData) => {
      await apiRequest("POST", "/api/jobs", {
        ...data,
        postedBy: 1, // Mock user ID
      });
    },
    onSuccess: () => {
      toast({
        title: "Job Posted",
        description: "Your job posting has been created successfully!",
      });
      setIsJobDialogOpen(false);
      jobForm.reset();
      queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const applyJobMutation = useMutation({
    mutationFn: async (data: ApplicationFormData) => {
      if (!selectedJobId) throw new Error("No job selected");
      await apiRequest("POST", `/api/jobs/${selectedJobId}/apply`, {
        ...data,
        applicantId: 1, // Mock user ID
      });
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your job application has been submitted successfully!",
      });
      setIsApplicationDialogOpen(false);
      setSelectedJobId(null);
      applicationForm.reset();
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleSearch = () => {
    queryClient.invalidateQueries({ queryKey: ["/api/jobs"] });
  };

  const handleApply = (jobId: number) => {
    setSelectedJobId(jobId);
    setIsApplicationDialogOpen(true);
  };

  const categories = ["Technology", "Tourism", "Agriculture", "Education", "Healthcare", "Government"];
  const experienceLevels = ["Entry Level", "Mid Level", "Senior Level"];
  const employmentTypes = ["full-time", "part-time", "contract"];

  const onJobSubmit = (data: JobFormData) => {
    createJobMutation.mutate(data);
  };

  const onApplicationSubmit = (data: ApplicationFormData) => {
    applyJobMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
      {/* Buddhist Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <BuddhaFace className="absolute top-16 right-16 w-56 h-56 text-orange-400/8" />
        <Stupa className="absolute top-1/3 left-12 w-28 h-36 text-yellow-400/12" />
        <LotusPattern className="absolute bottom-24 right-1/4 w-44 h-44 text-orange-400/6" />
        <BuddhaFace className="absolute bottom-16 left-1/3 w-36 h-36 text-yellow-400/10" />
        <Stupa className="absolute top-24 right-1/3 w-20 h-28 text-orange-400/8" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Digital Job Portal</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect talented individuals with businesses across Bhutan. Post jobs, apply for positions, and build your career in the digital kingdom.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Search & Filters */}
          <div>
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Search className="w-5 h-5 mr-2" />
                  Find Your Perfect Job
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Job Title or Keywords
                  </label>
                  <Input
                    placeholder="e.g. Software Developer"
                    value={searchFilters.keywords}
                    onChange={(e) => setSearchFilters(prev => ({ ...prev, keywords: e.target.value }))}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Category</label>
                  <Select
                    value={searchFilters.category}
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">All Categories</SelectItem>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">
                    Experience Level
                  </label>
                  <Select
                    value={searchFilters.experienceLevel}
                    onValueChange={(value) => setSearchFilters(prev => ({ ...prev, experienceLevel: value }))}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Any Experience" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="">Any Experience</SelectItem>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <Button onClick={handleSearch} className="w-full">
                  <Search className="w-4 h-4 mr-2" />
                  Search Jobs
                </Button>

                <div className="pt-4 border-t">
                  <Dialog open={isJobDialogOpen} onOpenChange={setIsJobDialogOpen}>
                    <DialogTrigger asChild>
                      <Button variant="secondary" className="w-full">
                        <Plus className="w-4 h-4 mr-2" />
                        Post a Job
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-2xl">
                      <DialogHeader>
                        <DialogTitle>Post a New Job</DialogTitle>
                      </DialogHeader>
                      <Form {...jobForm}>
                        <form onSubmit={jobForm.handleSubmit(onJobSubmit)} className="space-y-4">
                          <FormField
                            control={jobForm.control}
                            name="title"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Title</FormLabel>
                                <FormControl>
                                  <Input placeholder="e.g. Senior Software Developer" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={jobForm.control}
                            name="description"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Job Description</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder="Describe the role, responsibilities, and requirements..."
                                    className="h-32"
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={jobForm.control}
                              name="category"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Category</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {categories.map((category) => (
                                        <SelectItem key={category} value={category}>
                                          {category}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={jobForm.control}
                              name="experienceLevel"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Experience Level</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select level" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {experienceLevels.map((level) => (
                                        <SelectItem key={level} value={level}>
                                          {level}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <FormField
                              control={jobForm.control}
                              name="location"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Location</FormLabel>
                                  <FormControl>
                                    <Input placeholder="e.g. Thimphu, Bhutan" {...field} />
                                  </FormControl>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />

                            <FormField
                              control={jobForm.control}
                              name="employmentType"
                              render={({ field }) => (
                                <FormItem>
                                  <FormLabel>Employment Type</FormLabel>
                                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                      <SelectTrigger>
                                        <SelectValue placeholder="Select type" />
                                      </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                      {employmentTypes.map((type) => (
                                        <SelectItem key={type} value={type}>
                                          {type.charAt(0).toUpperCase() + type.slice(1)}
                                        </SelectItem>
                                      ))}
                                    </SelectContent>
                                  </Select>
                                  <FormMessage />
                                </FormItem>
                              )}
                            />
                          </div>

                          <FormField
                            control={jobForm.control}
                            name="skills"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Required Skills</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder="Enter skills separated by commas (e.g. React, Node.js, TypeScript)"
                                    value={field.value.join(", ")}
                                    onChange={(e) =>
                                      field.onChange(
                                        e.target.value.split(",").map((skill) => skill.trim()).filter(Boolean)
                                      )
                                    }
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <div className="flex justify-end space-x-2">
                            <Button
                              type="button"
                              variant="outline"
                              onClick={() => setIsJobDialogOpen(false)}
                            >
                              Cancel
                            </Button>
                            <Button type="submit" disabled={createJobMutation.isPending}>
                              {createJobMutation.isPending ? "Posting..." : "Post Job"}
                            </Button>
                          </div>
                        </form>
                      </Form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Job Listings */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="space-y-6">
                {[1, 2, 3].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-16 bg-gray-200 rounded mb-4"></div>
                      <div className="flex gap-2">
                        <div className="h-6 bg-gray-200 rounded w-16"></div>
                        <div className="h-6 bg-gray-200 rounded w-20"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : jobs?.length ? (
              <div className="space-y-6">
                {jobs.map((job: any) => (
                  <JobCard key={job.id} job={job} onApply={handleApply} />
                ))}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <Briefcase className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Jobs Found</h3>
                  <p className="text-muted-foreground mb-4">
                    Try adjusting your search criteria or check back later for new opportunities.
                  </p>
                  <Button variant="outline" onClick={() => setSearchFilters({ keywords: "", category: "", experienceLevel: "" })}>
                    Clear Filters
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Job Application Dialog */}
        <Dialog open={isApplicationDialogOpen} onOpenChange={setIsApplicationDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Apply for Position</DialogTitle>
            </DialogHeader>
            <Form {...applicationForm}>
              <form onSubmit={applicationForm.handleSubmit(onApplicationSubmit)} className="space-y-4">
                <FormField
                  control={applicationForm.control}
                  name="coverLetter"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cover Letter</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us why you're interested in this position and what makes you a great fit..."
                          className="h-32"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={applicationForm.control}
                  name="resumeUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resume URL (Optional)</FormLabel>
                      <FormControl>
                        <Input placeholder="https://your-resume-link.com" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end space-x-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsApplicationDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={applyJobMutation.isPending}>
                    {applyJobMutation.isPending ? "Submitting..." : "Submit Application"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
