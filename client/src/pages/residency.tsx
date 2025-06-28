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

const formSchema = insertResidencyApplicationSchema.extend({
  agreeToTerms: z.boolean().refine(val => val === true, "You must agree to the terms"),
});

type FormData = z.infer<typeof formSchema>;

export default function Residency() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"apply" | "status">("apply");

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      countryOfOrigin: "",
      reasonForResidency: "",
      agreeToTerms: false,
    },
  });

  const { data: applications = [] } = useQuery<any[]>({
    queryKey: ["/api/residency/applications"],
  });

  const applyMutation = useMutation({
    mutationFn: async (data: FormData) => {
      const { agreeToTerms, ...applicationData } = data;
      await apiRequest("POST", "/api/residency/apply", {
        ...applicationData,
        userId: 1, // Mock user ID
      });
    },
    onSuccess: () => {
      toast({
        title: "Application Submitted",
        description: "Your residency application has been submitted successfully!",
      });
      form.reset();
    },
    onError: (error) => {
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

  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "India", "China", "Japan", 
    "Germany", "France", "Italy", "Spain", "Netherlands", "Switzerland", "Sweden", "Other"
  ];

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
            <Card className="shadow-xl border-t-4 border-primary">
              <CardHeader>
                <CardTitle className="text-2xl">Residency Application</CardTitle>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <FormField
                        control={form.control}
                        name="firstName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>First Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter first name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="lastName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Last Name</FormLabel>
                            <FormControl>
                              <Input placeholder="Enter last name" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="your@email.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="countryOfOrigin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Country of Origin</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select your country" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {countries.map((country) => (
                                <SelectItem key={country} value={country}>
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="reasonForResidency"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Reason for Digital Residency</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Tell us why you want to become a digital resident of Bhutan. What interests you about our culture and digital transformation journey?"
                              className="h-32"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="agreeToTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel className="text-sm">
                              I agree to the terms and conditions of Digital Bhutan residency
                            </FormLabel>
                            <FormMessage />
                          </div>
                        </FormItem>
                      )}
                    />

                    <Button
                      type="submit"
                      className="w-full"
                      size="lg"
                      disabled={applyMutation.isPending}
                    >
                      {applyMutation.isPending ? "Submitting..." : "Submit Application"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>
          </div>
        )}

        {activeTab === "status" && (
          <div className="max-w-4xl mx-auto">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="w-5 h-5 mr-2" />
                  Application Status
                </CardTitle>
              </CardHeader>
              <CardContent>
                {applications?.length ? (
                  <div className="space-y-4">
                    {applications.map((app: any) => (
                      <Card key={app.id} className="border-l-4 border-primary">
                        <CardContent className="p-6">
                          <div className="flex items-start justify-between mb-4">
                            <div>
                              <h3 className="font-semibold text-lg">
                                {app.firstName} {app.lastName}
                              </h3>
                              <p className="text-muted-foreground">{app.email}</p>
                              <p className="text-sm text-muted-foreground">
                                From: {app.countryOfOrigin}
                              </p>
                            </div>
                            <Badge className={getStatusColor(app.status)}>
                              {app.status === "pending" && <Clock className="w-3 h-3 mr-1" />}
                              {app.status === "approved" && <CheckCircle className="w-3 h-3 mr-1" />}
                              {app.status === "rejected" && <X className="w-3 h-3 mr-1" />}
                              {app.status.charAt(0).toUpperCase() + app.status.slice(1)}
                            </Badge>
                          </div>
                          
                          <p className="text-sm text-muted-foreground mb-4 italic">
                            "{app.reasonForResidency}"
                          </p>
                          
                          <div className="flex items-center justify-between text-sm text-muted-foreground">
                            <span>Applied: {formatDate(app.createdAt)}</span>
                            {app.reviewedAt && (
                              <span>Reviewed: {formatDate(app.reviewedAt)}</span>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">No Applications Found</h3>
                    <p className="text-muted-foreground">
                      You haven't submitted any residency applications yet.
                    </p>
                    <Button
                      onClick={() => setActiveTab("apply")}
                      className="mt-4"
                    >
                      Start Application
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}
