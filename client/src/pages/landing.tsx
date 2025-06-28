import { useQuery } from "@tanstack/react-query";
import HeroSection from "@/components/hero-section";
import ServiceCard from "@/components/service-card";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  IdCard, 
  Building, 
  Star, 
  Calendar,
  MapPin,
  Clock,
  Users,
  Search,
  Plus,
  ShoppingCart,
  Coins,
  Sprout,
  Languages,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mountain,
  Briefcase,
  Globe,
  UserCheck,
  Smartphone
} from "lucide-react";
import { CulturalPattern, DzongRoof, BuddhaFace, Stupa, LotusPattern } from "@/components/cultural-patterns";
import { Link } from "wouter";

export default function Landing() {
  const { data: stats } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: products } = useQuery({
    queryKey: ["/api/products"],
  });

  const { data: miniApps } = useQuery({
    queryKey: ["/api/mini-apps"],
  });

  const services = [
    {
      title: "Digital Identity",
      description: "Secure blockchain-based identity system with NFT residency cards and comprehensive KYC verification.",
      icon: IdCard,
      features: ["Soulbound NFT ID Cards", "Residency Application Portal", "Secure Authentication"],
      gradient: "orange" as const,
    },
    {
      title: "Business Hub", 
      description: "Complete business registration, licensing, and management platform with blockchain verification.",
      icon: Building,
      features: ["Digital Registration", "License Management", "Business NFT Certificates"],
      gradient: "yellow" as const,
    },
    {
      title: "Cultural Rewards",
      description: "Gamified system rewarding cultural learning and community participation with Brownie Points.",
      icon: Star,
      features: ["Cultural Quizzes", "Learning Modules", "Tiered Benefits System"],
      gradient: "orange" as const,
    },
  ];

  return (
    <div className="min-h-screen bg-background relative overflow-hidden">
      {/* Buddhist Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <BuddhaFace className="absolute top-10 right-10 w-64 h-64 text-orange-400/10" />
        <Stupa className="absolute top-1/3 left-10 w-32 h-40 text-yellow-400/15" />
        <LotusPattern className="absolute bottom-20 right-1/4 w-48 h-48 text-orange-400/8" />
        <BuddhaFace className="absolute bottom-10 left-1/3 w-40 h-40 text-yellow-400/12" />
        <Stupa className="absolute top-20 right-1/3 w-24 h-32 text-orange-400/10" />
        <LotusPattern className="absolute top-1/2 left-1/2 w-56 h-56 text-yellow-400/6 -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      {/* Content */}
      <div className="relative z-10">
        {/* Hero Section */}
        <HeroSection />

        {/* Core Services Section */}
        <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Core Digital Services</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Streamlined government services, business registration, and cultural engagement all in one unified platform.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Residency Application Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold text-foreground mb-6">Become a Digital Resident</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Join the digital transformation of Bhutan. Apply for residency and receive your blockchain-verified digital identity.
              </p>
              
              <div className="space-y-6">
                {[
                  { step: 1, title: "Submit Application", desc: "Complete our comprehensive residency application form." },
                  { step: 2, title: "Verification Process", desc: "Government review and blockchain identity verification." },
                  { step: 3, title: "Receive NFT ID", desc: "Get your unique Soulbound NFT digital identity card." }
                ].map((item) => (
                  <div key={item.step} className="flex items-start space-x-4">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white font-bold text-sm">
                      {item.step}
                    </div>
                    <div>
                      <h4 className="font-semibold text-foreground">{item.title}</h4>
                      <p className="text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <Link href="/residency">
                <Button className="mt-8" size="lg">
                  <Calendar className="w-5 h-5 mr-2" />
                  Start Application
                </Button>
              </Link>
            </div>

            <Card className="shadow-xl border-t-4 border-primary">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-foreground mb-6">Quick Application Preview</h3>
                
                <div className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">First Name</label>
                      <Input placeholder="Enter first name" disabled />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-foreground mb-2">Last Name</label>
                      <Input placeholder="Enter last name" disabled />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Email Address</label>
                    <Input type="email" placeholder="your@email.com" disabled />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Country of Origin</label>
                    <Select disabled>
                      <SelectTrigger>
                        <SelectValue placeholder="Select country..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="us">United States</SelectItem>
                        <SelectItem value="uk">United Kingdom</SelectItem>
                        <SelectItem value="ca">Canada</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Reason for Residency</label>
                    <Textarea 
                      placeholder="Tell us why you want to become a digital resident of Bhutan..." 
                      className="h-24" 
                      disabled 
                    />
                  </div>
                  
                  <Link href="/residency">
                    <Button className="w-full">
                      Complete Full Application
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Cultural Learning Preview Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Cultural Learning & Rewards</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Earn Brownie Points by engaging with Bhutanese culture, completing quizzes, and contributing to the community.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Progress Preview */}
            <div>
              <Card className="bhutan-gradient text-white">
                <CardContent className="p-6">
                  <h3 className="text-xl font-bold mb-4">Sample Progress</h3>
                  <div className="space-y-4">
                    <div>
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm opacity-90">Cultural Knowledge</span>
                        <span className="text-sm font-semibold">Level 3</span>
                      </div>
                      <div className="w-full bg-white/20 rounded-full h-3">
                        <div className="bg-white rounded-full h-3 w-[65%]"></div>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-white/20">
                      <div className="text-center">
                        <div className="text-3xl font-bold">2,480</div>
                        <div className="text-sm opacity-90">Brownie Points</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sample Learning Modules */}
            <div className="lg:col-span-2">
              <div className="grid md:grid-cols-2 gap-6">
                {[
                  { title: "Dzongkha Language Quiz", points: 150, users: 247, icon: "🏛️" },
                  { title: "Festival Traditions", points: 200, users: 189, icon: "🎭" },
                  { title: "Bhutan History", points: 175, users: 312, icon: "🏔️" },
                  { title: "Community Project", points: 300, users: 89, icon: "🌱" }
                ].map((module, index) => (
                  <Card key={index} className="border border-gray-200 hover:shadow-lg transition-shadow">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h4 className="font-bold text-foreground">{module.title}</h4>
                        <Badge className="bg-yellow-500 text-white">+{module.points} Points</Badge>
                      </div>
                      <div className="text-4xl mb-4 text-center">{module.icon}</div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground">
                          <Users className="inline w-3 h-3 mr-1" />
                          {module.users} completed
                        </span>
                        <Button size="sm">Start</Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link href="/cultural">
              <Button size="lg" variant="outline">
                Explore All Cultural Activities
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Job Portal Preview */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Digital Job Portal</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Empowering Bhutan's workforce and businesses through a unified digital platform for job seekers and employers.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="group relative overflow-hidden border-0 shadow-xl transition-transform hover:-translate-y-2 bg-white">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-orange-100 opacity-20 blur-2xl group-hover:scale-110 transition-transform" />
              <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                <Briefcase className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-foreground mb-2 text-xl">Find Opportunities</h4>
                <p className="text-muted-foreground">
                  Explore a wide range of job openings across Bhutan, from tech to tourism, and discover your next career move.
                </p>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden border-0 shadow-xl transition-transform hover:-translate-y-2 bg-white">
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-yellow-100 opacity-20 blur-2xl group-hover:scale-110 transition-transform" />
              <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                <Globe className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-foreground mb-2 text-xl">Connect Digitally</h4>
                <p className="text-muted-foreground">
                  Seamlessly connect with employers and candidates through a secure, blockchain-powered digital ecosystem.
                </p>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden border-0 shadow-xl transition-transform hover:-translate-y-2 bg-white">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-orange-100 opacity-20 blur-2xl group-hover:scale-110 transition-transform" />
              <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                <UserCheck className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-foreground mb-2 text-xl">Verified Talent & Employers</h4>
                <p className="text-muted-foreground">
                  All users are verified, ensuring trust and authenticity for both job seekers and businesses.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/jobs">
              <Button size="lg" variant="outline">
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Marketplace & Mini-Apps Preview */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-foreground mb-4">Marketplace & Mini-Apps</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Discover, trade, and interact with authentic Bhutanese products and digital tools. Empower local artisans, businesses, and your own digital journey.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-12">
            <Card className="group relative overflow-hidden border-0 shadow-xl transition-transform hover:-translate-y-2 bg-white">
              <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-orange-100 opacity-20 blur-2xl group-hover:scale-110 transition-transform" />
              <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                <ShoppingCart className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-foreground mb-2 text-xl">Support Local Artisans</h4>
                <p className="text-muted-foreground">
                  Purchase unique crafts, textiles, and goods directly from Bhutanese creators, helping preserve culture and empower communities.
                </p>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden border-0 shadow-xl transition-transform hover:-translate-y-2 bg-white">
              <div className="absolute -bottom-10 -left-10 w-32 h-32 rounded-full bg-yellow-100 opacity-20 blur-2xl group-hover:scale-110 transition-transform" />
              <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                <Sprout className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-foreground mb-2 text-xl">Earn & Redeem Brownie Points</h4>
                <p className="text-muted-foreground">
                  Engage in the marketplace and mini-apps to earn Brownie Points, which can be redeemed for rewards, discounts, and special experiences.
                </p>
              </CardContent>
            </Card>
            <Card className="group relative overflow-hidden border-0 shadow-xl transition-transform hover:-translate-y-2 bg-white">
              <div className="absolute -bottom-10 -right-10 w-32 h-32 rounded-full bg-orange-100 opacity-20 blur-2xl group-hover:scale-110 transition-transform" />
              <CardContent className="p-8 flex flex-col items-center text-center relative z-10">
                <Smartphone className="w-12 h-12 text-primary mb-4 group-hover:scale-110 transition-transform" />
                <h4 className="font-bold text-foreground mb-2 text-xl">Access Powerful Mini-Apps</h4>
                <p className="text-muted-foreground">
                  Use digital tools for learning, finance, and culture—like language apps, digital wallets, and eco-trackers—right inside the platform.
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/marketplace">
              <Button size="lg" variant="outline">
                Go to Marketplace
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-foreground text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-2 mb-6">
                <div className="w-10 h-10 bhutan-gradient rounded-lg flex items-center justify-center">
                  <Mountain className="text-white w-5 h-5" />
                </div>
                <span className="text-xl font-bold">Digital Bhutan</span>
              </div>
              <p className="text-gray-300 mb-6 max-w-md">
                Transforming the Kingdom of Bhutan into a digital-first nation through innovative blockchain technology, cultural preservation, and sustainable development.
              </p>
              <div className="flex space-x-4">
                {[Twitter, Facebook, Instagram, Linkedin].map((Icon, index) => (
                  <Icon key={index} className="w-5 h-5 text-gray-300 hover:text-primary cursor-pointer transition-colors" />
                ))}
              </div>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Services</h4>
              <ul className="space-y-2 text-gray-300">
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Digital Identity</Link></li>
                <li><Link href="/residency" className="hover:text-primary transition-colors">Residency</Link></li>
                <li><Link href="/jobs" className="hover:text-primary transition-colors">Job Portal</Link></li>
                <li><Link href="/marketplace" className="hover:text-primary transition-colors">Marketplace</Link></li>
                <li><Link href="/cultural" className="hover:text-primary transition-colors">Cultural Learning</Link></li>
              </ul>
            </div>
            
            <div>
              <h4 className="font-bold mb-4">Support</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-primary transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Documentation</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Terms of Service</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-700 mt-12 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-300 text-sm">
                © 2024 Digital Bhutan Initiative. All rights reserved.
              </p>
              <p className="text-gray-300 text-sm mt-4 md:mt-0">
                Built with ❤️ for the Kingdom of Bhutan
              </p>
            </div>
          </div>
        </div>

        {/* Cultural Pattern */}
        <div className="mt-8">
          <CulturalPattern className="w-full h-8 text-primary" />
        </div>
      </footer>
      </div>
    </div>
  );
}
