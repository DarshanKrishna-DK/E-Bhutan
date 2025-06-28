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
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  gender: z.string().min(1, "Gender is required"),
  placeOfBirth: z.string().min(1, "Place of birth is required"),
  nationality: z.string().min(1, "Nationality is required"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Current address is required"),
  occupation: z.string().min(1, "Occupation is required"),
  reason: z.string().min(1, "Reason is required"),
  documentType: z.string().min(1, "Document type is required"),
  documentNumber: z.string().min(1, "Document number is required"),
  issuingCountry: z.string().min(1, "Issuing country is required"),
  dateOfIssue: z.string().min(1, "Date of issue is required"),
  photoTitle: z.string().min(1, "Photo title is required"),
  photoFile: z
    .any()
    .refine((file) => file instanceof File || (file && file.length > 0), "Photo is required"),
  purpose: z.string().min(1, "Purpose is required"),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
  declareTruth: z.boolean().refine((val) => val === true, {
    message: "You must declare the information is true",
  }),
  cardNumber: z.string().min(1, "Card number is required"),
  cardName: z.string().min(1, "Name on card is required"),
  cardExpiry: z.string().min(1, "Expiry date is required"),
  cardCvc: z.string().min(1, "CVV/CVC is required"),
});

type FormData = z.infer<typeof formSchema>;

export default function Residency() {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<"apply" | "status">("apply");

  // Stepper state
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;
  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
      dateOfBirth: "",
      gender: "",
      placeOfBirth: "",
      nationality: "",
      phone: "",
      address: "",
      occupation: "",
      reason: "",
      documentType: "",
      documentNumber: "",
      issuingCountry: "",
      dateOfIssue: "",
      photoTitle: "",
      photoFile: undefined,
      purpose: "",
      agreeTerms: false,
      declareTruth: false,
      cardNumber: "",
      cardName: "",
      cardExpiry: "",
      cardCvc: "",
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
                        <h3 className="text-lg font-semibold">Account Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Email *</FormLabel>
                                <FormControl>
                                  <Input type="email" placeholder="Enter your email" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Password *</FormLabel>
                                <FormControl>
                                  <Input type="password" placeholder="Enter a password" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {currentStep === 2 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Personal Information</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="firstName"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>First Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your first name" {...field} />
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
                                <FormLabel>Last Name *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your last name" {...field} />
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
                          <FormField
                            control={form.control}
                            name="gender"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Gender *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select gender" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="male">Male</SelectItem>
                                    <SelectItem value="female">Female</SelectItem>
                                    <SelectItem value="other">Other</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="placeOfBirth"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Place of Birth *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your place of birth" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="nationality"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Nationality *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your nationality" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="phone"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Phone Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter your phone number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Current Address *</FormLabel>
                              <FormControl>
                                <Textarea placeholder="Enter your current address" className="min-h-[80px]" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {currentStep === 3 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Identity Document</h3>
                        <div className="grid md:grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="documentType"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Document Type *</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue placeholder="Select document type" />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    <SelectItem value="passport">Passport</SelectItem>
                                    <SelectItem value="eu_identity_card">EU identity card</SelectItem>
                                    <SelectItem value="national_id_card">National ID card</SelectItem>
                                    <SelectItem value="driving_license">Driving license</SelectItem>
                                  </SelectContent>
                                </Select>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="documentNumber"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Document Number *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter document number" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="issuingCountry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Issuing Country *</FormLabel>
                                <FormControl>
                                  <Input placeholder="Enter issuing country" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="dateOfIssue"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Date of Issue *</FormLabel>
                                <FormControl>
                                  <Input type="date" {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>
                    )}

                    {currentStep === 4 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Digital Photo</h3>
                        <FormField
                          control={form.control}
                          name="photoFile"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Choose File *</FormLabel>
                              <FormControl>
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => field.onChange(e.target.files?.[0])}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <p className="text-xs text-muted-foreground">
                          Upload a recent (within 6 months) passport-size photo of your face, on a neutral background. This will be used for biometric verification.
                        </p>
                      </div>
                    )}

                    {currentStep === 5 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Final Declarations</h3>
                        <FormField
                          control={form.control}
                          name="purpose"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Purpose of Application *</FormLabel>
                              <FormControl>
                                <Textarea
                                  placeholder="Describe your purpose for applying. You may write a long essay here."
                                  className="min-h-[120px]"
                                  {...field}
                                />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="agreeTerms"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I explicitly agree to e-Bhutan's terms and conditions and, including how my personal data will be processed for identity verification and e-Residency issuance.
                                </FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="declareTruth"
                          render={({ field }) => (
                            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                              <FormControl>
                                <Checkbox
                                  checked={field.value}
                                  onCheckedChange={field.onChange}
                                />
                              </FormControl>
                              <div className="space-y-1 leading-none">
                                <FormLabel>
                                  I declare that all information provided in this application is true, accurate, and complete to the best of my knowledge
                                </FormLabel>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      </div>
                    )}

                    {currentStep === 6 && (
                      <div className="space-y-4">
                        <h3 className="text-lg font-semibold">Payment</h3>
                        <p className="text-sm text-muted-foreground">
                          A state fee of [Insert Fee Amount, e.g., €150] is required to process your application. Your application will not be processed until this payment is successfully completed.
                        </p>
                        <FormField
                          control={form.control}
                          name="cardNumber"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Card Number *</FormLabel>
                              <FormControl>
                                <Input placeholder="1234 5678 9012 3456" maxLength={19} {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <FormField
                          control={form.control}
                          name="cardName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Name on Card *</FormLabel>
                              <FormControl>
                                <Input placeholder="Name as shown on card" {...field} />
                              </FormControl>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                        <div className="grid grid-cols-2 gap-4">
                          <FormField
                            control={form.control}
                            name="cardExpiry"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>Expiry Date *</FormLabel>
                                <FormControl>
                                  <Input placeholder="MM/YY" maxLength={5} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                          <FormField
                            control={form.control}
                            name="cardCvc"
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>CVV/CVC *</FormLabel>
                                <FormControl>
                                  <Input placeholder="123" maxLength={4} {...field} />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
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
