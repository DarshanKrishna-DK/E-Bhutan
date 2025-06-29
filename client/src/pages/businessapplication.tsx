import { useState } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Shield, Globe, Lock, Globe2 } from "lucide-react";

const formSchema = z.object({
  proposedBusinessName: z.string().min(1, "Proposed business name is required"),
  digitalBusinessType: z.string().min(1, "Business type is required"),
  primaryActivity: z.string().min(1, "Primary activity description is required"),
  eCitizenId: z.string().min(1, "E-citizen ID is required"),
  businessWallet: z.string().min(1, "Business wallet address is required"),
  businessName: z.string().min(1, "Business name is required"),
  businessType: z.string().min(1, "Business type is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
  ownerName: z.string().min(1, "Owner name is required"),
  address: z.string().min(1, "Business address is required"),
  phone: z.string().min(1, "Phone number is required"),
  description: z.string().min(1, "Business description is required"),
  documentFile: z.any().refine((file) => file instanceof File || (file && file.length > 0), "Supporting document is required"),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the terms and conditions",
  }),
});

export default function BusinessApplication() {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 4;

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proposedBusinessName: "",
      digitalBusinessType: "",
      primaryActivity: "",
      eCitizenId: "",
      businessWallet: "",
      businessName: "",
      businessType: "",
      registrationNumber: "",
      ownerName: "",
      address: "",
      phone: "",
      description: "",
      documentFile: undefined,
      agreeTerms: false,
    },
  });

  const nextStep = () => setCurrentStep((s) => Math.min(s + 1, totalSteps));
  const prevStep = () => setCurrentStep((s) => Math.max(s - 1, 1));

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    // Handle submission logic here
    alert("Business application submitted!");
  };

  return (
    <div className="flex justify-center py-12">
      <div className="w-full max-w-4xl space-y-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Business License Registration</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Register your digital business in e-Bhutan and unlock global, blockchain-secured opportunities for your enterprise.
          </p>
        </div>

        {/* Business Benefits Cards */}
        <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50 border-blue-200 dark:border-blue-800">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Shield className="w-6 h-6 text-blue-600" />
              <span>Business Benefits in e-Bhutan</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center mt-1">
                  <Shield className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Immutable Registration</h3>
                  <p className="text-sm text-muted-foreground">
                    Immutable and verifiable business registration directly on the e-Bhutan blockchain.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center mt-1">
                  <Globe className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Global Accessibility</h3>
                  <p className="text-sm text-muted-foreground">
                    Unrestricted global accessibility for conducting business as an e-citizen.
                  </p>
                </div>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-yellow-500 rounded-lg flex items-center justify-center mt-1">
                  <Lock className="w-4 h-4 text-white" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Secured Legal Governance</h3>
                  <p className="text-sm text-muted-foreground">
                    Clear, cryptographically secured legal governance for your digital enterprise.
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Application Form Card */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle>Business License Application</CardTitle>
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
                    <h3 className="text-lg font-semibold">Digital Business Details</h3>
                    <FormField
                      control={form.control}
                      name="proposedBusinessName"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Proposed Business Name *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter proposed business name" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="digitalBusinessType"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Digital Business Type *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Select digital business type" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="sole_propietory">Sole Propietory</SelectItem>
                              <SelectItem value="digital_collective">Digital collective</SelectItem>
                              <SelectItem value="dao_ready">DAO-ready structure</SelectItem>
                              <SelectItem value="digital_enterprise">Digital enterprise</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="primaryActivity"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Primary Activity Description *</FormLabel>
                          <FormControl>
                            <Input placeholder="Describe main business activity" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="eCitizenId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>E-citizen ID *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter your E-citizen ID" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="businessWallet"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Designated Business Wallet Address *</FormLabel>
                          <FormControl>
                            <Input placeholder="Enter wallet address" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                {currentStep === 2 && (
                  <div className="space-y-8">
                    <h3 className="text-lg font-semibold">Authenticate with e-citizenship</h3>
                    <Button
                      type="button"
                      className="bhutan-gradient text-white"
                      onClick={() => {
                        // Add your wallet connection and e-citizenship verification logic here
                        alert("Connect crypto wallet and verify e-citizenship (demo)");
                      }}
                    >
                      Connect crypto wallet and verify e-citizenship
                    </Button>
                  </div>
                )}

                {currentStep === 3 && (
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold">Agree to e-Bhutan Terms</h3>
                    <p className="text-muted-foreground">
                      The e-citizen meticulously reviews the official e-Bhutanese digital business laws and terms of service, which govern all digital enterprises within the nation. They digitally approve these terms using their e-Citizenship NFT, typically by cryptographically signing a message with their connected wallet, thereby linking their verified e-identity to the agreement.
                    </p>
                    <FormField
                      control={form.control}
                      name="agreeTerms"
                      render={({ field }) => (
                        <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                          <FormControl>
                            <input
                              type="checkbox"
                              checked={field.value}
                              onChange={e => field.onChange(e.target.checked)}
                              className="mt-1"
                            />
                          </FormControl>
                          <div className="space-y-1 leading-none">
                            <FormLabel>
                              I agree to the e-Bhutanese Digital Business Laws and Terms of Service.
                            </FormLabel>
                          </div>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      className="bhutan-gradient text-white"
                      onClick={() => {
                        // Add NFT signature logic here
                        alert("Approve terms with e-citizenship NFT (demo)");
                      }}
                      disabled={!form.watch("agreeTerms")}
                    >
                      Approve terms with e-citizenship NFT
                    </Button>
                  </div>
                )}

                {currentStep === 4 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Pay Digital registration fee (with platform fee)</h3>
                    <p className="text-muted-foreground">
                      A mandatory state fee for business registration, denominated in e-Bhutan's native token or a supported stablecoin, is displayed. The system prompts the e-citizen to initiate a crypto payment from their connected wallet. Crucially, the smart contract governing the registration automatically deducts a designated platform fee for the e-Bhutan government's digital treasury from this payment, ensuring sustainability of the digital nation's infrastructure, before forwarding the remainder to the main registration smart contract or a temporary holding address.
                    </p>
                    <p className="font-medium">
                      Digital Registration Fee: 100 eB-Token (+ Platform Fee)
                    </p>
                    <Button
                      type="button"
                      className="bhutan-gradient text-white"
                      onClick={() => {
                        // Add payment logic here
                        alert("Proceed to Secure Digital Payment (demo)");
                      }}
                    >
                      Proceed to Secure Digital Payment
                    </Button>
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
                    <Button type="submit" className="bhutan-gradient text-white">
                      Submit Application
                    </Button>
                  )}
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}