import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { insertResidencyApplicationSchema } from "@shared/schema";
import { FileText, CheckCircle, Clock, X, User, Calendar } from "lucide-react";
import { getStatusColor, formatDate } from "@/lib/utils";
import { z } from "zod";
import { BuddhaFace, Stupa, LotusPattern } from "@/components/cultural-patterns";
import { Progress } from "@/components/ui/progress";

// Update schema to match new fields
const formSchema = z.object({
  fullName: z.string().min(1, "Full Name is required"),
  dateOfBirth: z.string().min(1, "Date of Birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  occupation: z.string().min(1, "Occupation is required"),
  reason: z.string().min(1, "Reason is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function Residency() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"apply" | "status">("apply");

  // Stepper state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;
  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      dateOfBirth: "",
      nationality: "",
      occupation: "",
      reason: "",
    },
  });

  const { data: applications = [] } = useQuery<any[]>({
    queryKey: ["/api/residency/applications"],
  });

  const applyMutation = useMutation({
    mutationFn: async (data: FormData) => {
      await apiRequest("POST", "/api/residency/apply", {
        ...data,
        userId: 1, // Mock user ID
      });
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your residency application has been submitted successfully!",
      });
      form.reset();
      setCurrentStep(1);
    },
    onError: (error: any) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: FormData) => {
    applyMutation.mutate(data);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
      {/* Buddhist Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <BuddhaFace className="absolute top-14 right-14 w-60 h-60 text-orange-400/8" />
        <Stupa className="absolute top-1/4 left-10 w-28 h-36 text-yellow-400/12" />
        <LotusPattern className="absolute bottom-32 right-1/3 w-48 h-48 text-orange-400/6" />
        <BuddhaFace className="absolute bottom-14 left-1/4 w-36 h-36 text-yellow-400/10" />
        <Stupa className="absolute top-20 right-1/4 w-22 h-30 text-orange-400/8" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Digital Residency</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Join the digital transformation of Bhutan. Apply for residency and receive your blockchain-verified digital identity.
          </p>
        </div>

        {/* Tabs */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-lg p-1 shadow-sm border">
            <Button
              variant={activeTab === "apply" ? "default" : "ghost"}
              onClick={() => setActiveTab("apply")}
              className="flex items-center"
            >
              <FileText className="w-4 h-4 mr-2" />
              Apply
            </Button>
            <Button
              variant={activeTab === "status" ? "default" : "ghost"}
              onClick={() => setActiveTab("status")}
              className="flex items-center"
            >
              <Clock className="w-4 h-4 mr-2" />
              Check Status
            </Button>
          </div>
        </div>

        {activeTab === "apply" && (
          <div className="flex flex-col lg:flex-row gap-12 items-stretch mb-8">
            {/* Process Steps (left) */}
            <Card className="flex-1 min-w-0 h-[550px] self-stretch">
              <CardHeader>
                <CardTitle>Application Process</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-muted-foreground mb-8">
                  Follow these simple steps to become a Digital Resident of Bhutan.
                </p>
                <div className="space-y-6">
                  {[
                    {
                      step: 1,
                      title: "Submit Application",
                      description: "Complete our comprehensive residency application form with your personal details and motivation.",
                      icon: FileText,
                    },
                    {
                      step: 2,
                      title: "Government Review",
                      description: "Our review team will verify your information and assess your application within 5-7 business days.",
                      icon: User,
                    },
                    {
                      step: 3,
                      title: "Receive NFT ID",
                      description: "Upon approval, receive your unique Soulbound NFT digital identity card on the Avalanche blockchain.",
                      icon: CheckCircle,
                    },
                  ].map((item) => (
                    <div key={item.step} className="flex items-start space-x-4">
                      <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center text-white font-bold flex-shrink-0">
                        {item.step}
                      </div>
                      <div>
                        <div className="flex items-center mb-2">
                          <item.icon className="w-5 h-5 text-primary mr-2" />
                          <h4 className="font-semibold text-foreground">{item.title}</h4>
                        </div>
                        <p className="text-muted-foreground">{item.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Requirements & Timeline (right) */}
            <div className="flex flex-col gap-6 w-full max-w-xs h-[600px]">
              {/* Requirements Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Requirements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Valid Identity</p>
                      <p className="text-xs text-muted-foreground">Government-issued ID or passport</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Wallet Connection</p>
                      <p className="text-xs text-muted-foreground">MetaMask or compatible wallet</p>
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-600 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium">Cultural Commitment</p>
                      <p className="text-xs text-muted-foreground">Willingness to learn about Bhutanese culture</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              {/* Timeline Card */}
              <Card>
                <CardHeader>
                  <CardTitle>Processing Timeline</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">1</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Application Submitted</p>
                      <p className="text-xs text-muted-foreground">Immediate</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">2</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Under Review</p>
                      <p className="text-xs text-muted-foreground">1-3 business days</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-yellow-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">3</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Approval & NFT Minting</p>
                      <p className="text-xs text-muted-foreground">1-2 hours</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-sm font-bold">4</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Digital Citizenship Active</p>
                      <p className="text-xs text-muted-foreground">Access granted</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {activeTab === "apply" && (
          <div className="mt-12">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Application Form</CardTitle>
                  <div className="text-sm text-muted-foreground">
                    Step {currentStep} of {totalSteps}
                  </div>
                </div>
                <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    {currentStep === 1 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="fullName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Full Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your full name" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="dateOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date of Birth *</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>

                        <FormField
                          control={form.control}
                          name="nationality"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Nationality *</FormLabel>
                              <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select your nationality" />
                                  </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                  <SelectItem value="us">United States</SelectItem>
                                  <SelectItem value="uk">United Kingdom</SelectItem>
                                  <SelectItem value="ca">Canada</SelectItem>
                                  <SelectItem value="au">Australia</SelectItem>
                                  <SelectItem value="de">Germany</SelectItem>
                                  <SelectItem value="fr">France</SelectItem>
                                  <SelectItem value="jp">Japan</SelectItem>
                                  <SelectItem value="in">India</SelectItem>
                                  <SelectItem value="other">Other</SelectItem>
                                </SelectContent>
                              </Select>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Professional Information</h3>
                        <FormField
                          control={form.control}
                          name="occupation"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Occupation *</FormLabel>
                              <FormControl>
                                <Input placeholder="e.g., Software Developer, Teacher, Student" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Application Statement</h3>
                        <FormField
                          control={form.control}
                          name="reason"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Why do you want to become a Digital Bhutan resident? *</FormLabel>
                              <FormControl>
                                <Textarea 
                                  placeholder="Please explain your motivation for joining Digital Bhutan and how you plan to contribute to the community..."
                                  className="min-h-[120px]"
                                  {...field} 
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Review & Submit</h3>
                        <div className="bg-muted rounded-lg p-4 space-y-3">
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Full Name</p>
                              <p className="text-foreground">{form.getValues("fullName")}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Date of Birth</p>
                              <p className="text-foreground">{form.getValues("dateOfBirth")}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Nationality</p>
                              <p className="text-foreground">{form.getValues("nationality")}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Occupation</p>
                              <p className="text-foreground">{form.getValues("occupation")}</p>
                            </div>
                          </div>
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Application Statement</p>
                            <p className="text-foreground">{form.getValues("reason")}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-between pt-6">
                      <Button 
                        type="button" 
                        variant="outline" 
                        onClick={prevStep}
                        disabled={currentStep === 1}
                      >
                        Previous
                      </Button>
                      
                      {currentStep < totalSteps ? (
                        <Button type="button" onClick={nextStep}>
                          Next
                        </Button>
                      ) : (
                        <Button 
                          type="submit" 
                          disabled={applyMutation.isPending}
                          className="bhutan-gradient text-white"
                        >
                          {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                        </Button>
                      )}
                    </div>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
