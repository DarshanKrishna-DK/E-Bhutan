import { useState } from "react";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { FileText, CheckCircle, Clock, X, User, Calendar } from "lucide-react";
import { getStatusColor, formatDate } from "@/lib/utils";
import { z } from "zod";
import { BuddhaFace, Stupa, LotusPattern } from "@/components/cultural-patterns";
import { Progress } from "@/components/ui/progress";
import { ethers } from "ethers";

// Update schema to match new fields
const formSchema = z.object({
  email: z.string().email("Valid email is required"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  occupation: z.string().min(1, "Occupation is required"),
  reason: z.string().min(1, "Reason is required"),
  wallet: z.string().min(1, "Wallet address is required"),
});

type FormData = z.infer<typeof formSchema>;

// Replace with your NFT contract address and ABI
const NFT_CONTRACT_ADDRESS = "YOUR_NFT_CONTRACT_ADDRESS";
const NFT_ABI = [
  // Minimal ERC721 ABI for minting
  "function mint(address to, uint256 tokenId) public",
];

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
      email: "",
      password: "",
      occupation: "",
      reason: "",
      wallet: "",
    },
  });

  const { data: applications = [] } = useQuery<any[]>({
    queryKey: ["/api/residency/applications"],
  });

  // Approval popup state
  const [showApproval, setShowApproval] = useState(false);
  const [pendingData, setPendingData] = useState<FormData | null>(null);

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

  // Connect wallet and set address in form
  const connectWallet = async () => {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
      form.setValue("wallet", accounts[0]);
    } else {
      toast({
        title: "MetaMask not found",
        description: "Please install MetaMask to connect your wallet.",
        variant: "destructive",
      });
    }
  };

  // Mint NFT function
  async function mintNFT(toAddress: string, uniqueId: string) {
    if (!window.ethereum) {
      alert("MetaMask is not installed.");
      return;
    }
    const provider = new ethers.BrowserProvider(window.ethereum);
    const signer = await provider.getSigner();
    const contract = new ethers.Contract(NFT_CONTRACT_ADDRESS, NFT_ABI, signer);

    // Use a unique tokenId (for demo, use Date.now(); in production, use a better unique value)
    const tokenId = Date.now();
    const tx = await contract.mint(toAddress, tokenId);
    await tx.wait();
    toast({
      title: "NFT Minted",
      description: `NFT with ID ${tokenId} minted to ${toAddress}`,
    });
  }

  // Show approval popup on submit
  const onSubmit = (data: FormData) => {
    setPendingData(data);
    setShowApproval(true);
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
                              <p className="text-sm font-medium text-muted-foreground">Occupation</p>
                              <p className="text-foreground">{form.getValues("occupation")}</p>
                            </div>
                          </div>
                          <div className="grid md:grid-cols-2 gap-4">
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Email</p>
                              <p className="text-foreground">{form.getValues("email")}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-muted-foreground">Password</p>
                              <p className="text-foreground">{"*".repeat(form.getValues("password")?.length || 0)}</p>
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
                          <div>
                            <p className="text-sm font-medium text-muted-foreground">Wallet Address</p>
                            <p className="text-foreground">{form.getValues("wallet")}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Wallet connect button */}
                    {currentStep === 4 && (
                      <div className="flex items-center gap-2">
                        <Button type="button" onClick={connectWallet}>
                          Connect MetaMask
                        </Button>
                        <span className="text-xs text-muted-foreground">
                          {form.getValues("wallet") ? `Connected: ${form.getValues("wallet")}` : "No wallet connected"}
                        </span>
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

        {/* Approval Popup */}
        {showApproval && pendingData && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-8 shadow-lg max-w-md w-full">
              <h2 className="text-xl font-bold mb-4">Approve Residency Application</h2>
              <p>Do you want to approve this application and mint an NFT?</p>
              <div className="flex justify-end gap-4 mt-6">
                <Button variant="outline" onClick={() => setShowApproval(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={async () => {
                    setShowApproval(false);
                    await mintNFT(pendingData.wallet, pendingData.email);
                    applyMutation.mutate(pendingData);
                  }}
                >
                  Approve & Mint NFT
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}