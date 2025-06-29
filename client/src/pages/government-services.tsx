import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { 
  Building2, 
  FileText, 
  Shield, 
  Clock, 
  CheckCircle,
  AlertCircle,
  Coins,
  ExternalLink,
  User,
  GraduationCap,
  Briefcase,
  Home,
  CreditCard,
  Settings,
  Globe
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { DzongRoof, BuddhaFace, Stupa } from "@/components/cultural-patterns";
import { useLocation } from "wouter";

const serviceApplicationSchema = z.object({
  serviceName: z.string().min(1, "Service is required"),
  applicationData: z.record(z.any()),
  notes: z.string().optional(),
});

interface GovernmentService {
  id: number;
  serviceName: string;
  description: string;
  department: string;
  processingTime: string;
  fee: string;
  requiredCredentials: string[];
  isActive: boolean;
  contractAddress?: string;
  applyUrl?: string; // <-- Add this field
}

const mockServices: GovernmentService[] = [
  {
    id: 1,
    serviceName: "Digital Residency Application",
    description: "Apply for official digital residency status in the Kingdom of Bhutan with blockchain-verified credentials",
    department: "Ministry of Home Affairs",
    processingTime: "5-7 business days",
    fee: "50",
    requiredCredentials: ["identity_verification", "background_check"],
    isActive: true,
    contractAddress: "0x1234567890123456789012345678901234567890",
    applyUrl: "/residency"
  },
  {
    id: 2,
    serviceName: "Business License Registration",
    description: "Register and obtain official business license with NFT certification for operating in Bhutan",
    department: "Ministry of Economic Affairs",
    processingTime: "10-14 business days",
    fee: "100",
    requiredCredentials: ["digital_residency", "business_plan"],
    isActive: true,
    contractAddress: "0x2345678901234567890123456789012345678901",
    applyUrl: "/businessapplication"
  },
  {
    id: 3,
    serviceName: "Cultural Heritage Certificate",
    description: "Obtain official certification for cultural learning achievements and traditional skill mastery",
    department: "Ministry of Education",
    processingTime: "3-5 business days",
    fee: "25",
    requiredCredentials: ["cultural_assessment", "community_endorsement"],
    isActive: true,
    contractAddress: "0x3456789012345678901234567890123456789012",
    applyUrl: "/culturalheritage"
  },
  {
    id: 4,
    serviceName: "Employment Verification",
    description: "Get blockchain-verified employment credentials for job applications and professional validation",
    department: "Ministry of Labour",
    processingTime: "2-3 business days",
    fee: "20",
    requiredCredentials: ["digital_residency", "employer_confirmation"],
    isActive: true,
    contractAddress: "0x4567890123456789012345678901234567890123"
  },
  {
    id: 5,
    serviceName: "Educational Credential Verification",
    description: "Verify and digitize educational qualifications with soulbound NFT certificates",
    department: "Ministry of Education",
    processingTime: "7-10 business days",
    fee: "30",
    requiredCredentials: ["academic_transcripts", "institution_verification"],
    isActive: true,
    contractAddress: "0x5678901234567890123456789012345678901234"
  },
  {
    id: 6,
    serviceName: "Tax Registration & Compliance",
    description: "Register for tax obligations and maintain compliance with automated blockchain reporting",
    department: "Ministry of Finance",
    processingTime: "5-7 business days",
    fee: "40",
    requiredCredentials: ["business_license", "financial_records"],
    isActive: true,
    contractAddress: "0x6789012345678901234567890123456789012345"
  }
];

export default function GovernmentServices() {
  const { toast } = useToast();
  const [selectedService, setSelectedService] = useState<GovernmentService | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [, navigate] = useLocation();

  const { data: services = mockServices } = useQuery<GovernmentService[]>({
    queryKey: ["government-services"],
  });

  const form = useForm<z.infer<typeof serviceApplicationSchema>>({
    resolver: zodResolver(serviceApplicationSchema),
    defaultValues: {
      serviceName: "",
      applicationData: {},
      notes: ""
    }
  });

  const submitMutation = useMutation({
    mutationFn: async (data: z.infer<typeof serviceApplicationSchema>) => {
      setIsSubmitting(true);
      
      // Simulate blockchain interaction
      if (selectedService?.contractAddress) {
        // Mock blockchain interaction for demo
        await new Promise(resolve => setTimeout(resolve, 2000));
      }
      
      return { success: true, applicationId: Math.random().toString(36).substr(2, 9) };
    },
    onSuccess: (result) => {
      toast({
        title: "Application Submitted",
        description: `Application ID: ${result.applicationId}. You will receive updates via blockchain notifications.`,
      });
      form.reset();
      setSelectedService(null);
    },
    onError: (error: any) => {
      toast({
        title: "Submission Failed",
        description: error.message,
        variant: "destructive",
      });
    },
    onSettled: () => {
      setIsSubmitting(false);
    }
  });

  const getServiceIcon = (serviceName: string) => {
    if (serviceName.includes("Residency")) return User;
    if (serviceName.includes("Business")) return Briefcase;
    if (serviceName.includes("Cultural")) return GraduationCap;
    if (serviceName.includes("Employment")) return Building2;
    if (serviceName.includes("Educational")) return GraduationCap;
    if (serviceName.includes("Tax")) return CreditCard;
    return FileText;
  };

  const getDepartmentColor = (department: string) => {
    switch (department) {
      case "Ministry of Home Affairs": return "bg-blue-500";
      case "Ministry of Economic Affairs": return "bg-green-500";
      case "Ministry of Education": return "bg-purple-500";
      case "Ministry of Labour": return "bg-orange-500";
      case "Ministry of Finance": return "bg-red-500";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
      {/* Buddhist Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-20 right-20 w-64 h-64 opacity-6">
          <DzongRoof className="w-full h-full text-orange-400" />
        </div>
        <div className="absolute bottom-40 left-20 w-48 h-48 opacity-8">
          <BuddhaFace className="w-full h-full text-yellow-400" />
        </div>
        <div className="absolute top-1/2 right-10 w-32 h-32 opacity-10">
          <Stupa className="w-full h-full text-orange-300" />
        </div>
        <div className="absolute bottom-20 right-1/3 w-40 h-40 opacity-7">
          <Shield className="w-full h-full text-blue-300" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Government Services</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Access official government services with blockchain verification and NFT credentials
          </p>
          <div className="flex items-center justify-center mt-4 space-x-2">
            <Badge className="bg-green-500">
              <Shield className="w-3 h-3 mr-1" />
              Blockchain Verified
            </Badge>
            <Badge className="bg-blue-500">
              <Globe className="w-3 h-3 mr-1" />
              Digital First
            </Badge>
          </div>
        </div>

        <Tabs defaultValue="services" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="services">Available Services</TabsTrigger>
            <TabsTrigger value="applications">My Applications</TabsTrigger>
            <TabsTrigger value="credentials">Digital Credentials</TabsTrigger>
          </TabsList>

          <TabsContent value="services" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => {
                const Icon = getServiceIcon(service.serviceName);
                return (
                  <Card key={service.id} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`p-2 rounded-lg ${getDepartmentColor(service.department)}`}>
                            <Icon className="w-5 h-5 text-white" />
                          </div>
                          <div>
                            <CardTitle className="text-lg">{service.serviceName}</CardTitle>
                            <p className="text-sm text-muted-foreground">{service.department}</p>
                          </div>
                        </div>
                        {service.isActive ? (
                          <Badge className="bg-green-500">Active</Badge>
                        ) : (
                          <Badge variant="secondary">Maintenance</Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                      
                      <div className="space-y-2 text-xs">
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            <Clock className="w-3 h-3 mr-1" />
                            Processing Time:
                          </span>
                          <span className="font-medium">{service.processingTime}</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="flex items-center">
                            <Coins className="w-3 h-3 mr-1" />
                            Fee:
                          </span>
                          <span className="font-medium">{service.fee} NuBucks</span>
                        </div>
                      </div>

                      <div className="mt-4">
                        <p className="text-xs font-medium mb-2">Required Credentials:</p>
                        <div className="flex flex-wrap gap-1">
                          {service.requiredCredentials.map((cred, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {cred.replace(/_/g, ' ')}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <Button
                        className="w-full mt-4 bg-gradient-to-r from-orange-500 to-yellow-500"
                        disabled={!service.isActive}
                        onClick={() => {
                          if (service.applyUrl) {
                            navigate(service.applyUrl);
                          }
                        }}
                      >
                        Apply Now
                      </Button>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="applications" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>My Service Applications</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No applications found</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your submitted applications will appear here with real-time blockchain status updates
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="credentials" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Shield className="w-5 h-5 mr-2" />
                  Digital Credentials & NFTs
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <Shield className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-muted-foreground">No credentials issued yet</p>
                  <p className="text-sm text-muted-foreground mt-2">
                    Your blockchain-verified credentials and soulbound NFTs will be displayed here
                  </p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => window.open("https://snowtrace.io/", "_blank")}
                  >
                    <ExternalLink className="w-4 h-4 mr-2" />
                    View on Avalanche Explorer
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Information Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <Card className="bg-gradient-to-r from-blue-500 to-purple-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Shield className="w-8 h-8 mr-3" />
                <h3 className="text-lg font-semibold">Blockchain Security</h3>
              </div>
              <p className="text-blue-100">
                All government services are secured by Avalanche blockchain technology with immutable records and transparent verification.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-green-500 to-teal-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <CheckCircle className="w-8 h-8 mr-3" />
                <h3 className="text-lg font-semibold">Instant Verification</h3>
              </div>
              <p className="text-green-100">
                Digital credentials can be instantly verified by employers, institutions, and other government agencies worldwide.
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white">
            <CardContent className="p-6">
              <div className="flex items-center mb-4">
                <Coins className="w-8 h-8 mr-3" />
                <h3 className="text-lg font-semibold">NuBuck Payments</h3>
              </div>
              <p className="text-orange-100">
                Pay for all government services using NuBucks, Bhutan's official digital currency, with transparent and auditable transactions.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}