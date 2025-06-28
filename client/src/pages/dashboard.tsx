import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import StatsCard from "@/components/stats-card";
import { 
  Users, 
  Building, 
  Coins, 
  TrendingUp, 
  Star, 
  Award, 
  CheckCircle, 
  Lock,
  Calendar,
  Briefcase,
  ShoppingBag,
  BookOpen
} from "lucide-react";
import { Link } from "wouter";
import { formatBrowniePoints, getTierName, getTierBenefits } from "@/lib/utils";
import { BuddhaFace, Stupa, LotusPattern } from "@/components/cultural-patterns";

export default function Dashboard() {
  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  // Mock user data for demo
  const mockUser = {
    id: 1,
    firstName: "Tenzin",
    lastName: "Norbu", 
    email: "tenzin@example.com",
    browniePoints: 2480,
    tierLevel: 3,
    isDigitalResident: true,
    nftId: "nft_1234567890_abc123def"
  };

  const tierProgress = (mockUser.browniePoints % 1000) / 10; // Progress within current tier
  const tierBenefits = getTierBenefits(mockUser.tierLevel);

  const quickActions = [
    {
      title: "Apply for Residency",
      description: "Start your digital residency application",
      icon: Users,
      href: "/residency",
      color: "bg-orange-500"
    },
    {
      title: "Find Jobs",
      description: "Browse available positions",
      icon: Briefcase,
      href: "/jobs", 
      color: "bg-yellow-500"
    },
    {
      title: "Shop Marketplace",
      description: "Explore Bhutanese products",
      icon: ShoppingBag,
      href: "/marketplace",
      color: "bg-green-500"
    },
    {
      title: "Learn Culture",
      description: "Earn points through cultural activities",
      icon: BookOpen,
      href: "/cultural",
      color: "bg-blue-500"
    }
  ];

  const recentActivities = [
    { activity: "Completed Dzongkha Language Quiz", points: 150, time: "2 hours ago" },
    { activity: "Applied to Software Developer position", points: 0, time: "1 day ago" },
    { activity: "Purchased Traditional Kira", points: 50, time: "3 days ago" },
    { activity: "Completed Festival Traditions module", points: 200, time: "1 week ago" }
  ];

  if (statsLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
      {/* Buddhist Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <BuddhaFace className="absolute top-20 right-20 w-48 h-48 text-orange-400/8" />
        <Stupa className="absolute top-1/4 left-16 w-24 h-32 text-yellow-400/12" />
        <LotusPattern className="absolute bottom-32 right-1/3 w-40 h-40 text-orange-400/6" />
        <BuddhaFace className="absolute bottom-20 left-1/4 w-32 h-32 text-yellow-400/10" />
        <Stupa className="absolute top-32 right-1/4 w-20 h-28 text-orange-400/8" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Welcome back, {mockUser.firstName}! 🏔️
          </h1>
          <p className="text-muted-foreground">
            Continue your journey as a Digital Resident of Bhutan
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            title="Total Residents"
            value={stats?.totalResidents || 0}
            subtitle="Digital citizens"
            icon={Users}
          />
          <StatsCard
            title="Active Businesses" 
            value={stats?.totalBusinesses || 0}
            subtitle="Registered companies"
            icon={Building}
          />
          <StatsCard
            title="Brownie Points"
            value={formatBrowniePoints(stats?.totalBrowniePoints || 0)}
            subtitle="Community rewards"
            icon={Coins}
          />
          <StatsCard
            title="Satisfaction Rate"
            value={`${stats?.satisfactionRate || 0}%`}
            subtitle="User happiness"
            icon={TrendingUp}
          />
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Profile & Progress */}
          <div className="space-y-6">
            {/* Profile Card */}
            <Card className="border-l-4 border-primary">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary" />
                  Your Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <h3 className="font-semibold text-lg">{mockUser.firstName} {mockUser.lastName}</h3>
                    <p className="text-muted-foreground">{mockUser.email}</p>
                    {mockUser.isDigitalResident && (
                      <Badge className="mt-2 bg-green-500">
                        <CheckCircle className="w-3 h-3 mr-1" />
                        Digital Resident
                      </Badge>
                    )}
                  </div>
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-medium">NFT ID</span>
                    </div>
                    <p className="text-xs text-muted-foreground font-mono bg-gray-100 p-2 rounded">
                      {mockUser.nftId}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Progress Card */}
            <Card className="bhutan-gradient text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2" />
                  Your Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm opacity-90">Cultural Knowledge</span>
                      <span className="text-sm font-semibold">
                        {getTierName(mockUser.tierLevel)}
                      </span>
                    </div>
                    <Progress value={tierProgress} className="bg-white/20" />
                  </div>
                  
                  <div className="pt-4 border-t border-white/20">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {formatBrowniePoints(mockUser.browniePoints)}
                      </div>
                      <div className="text-sm opacity-90">Brownie Points</div>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-white/20">
                    <h4 className="font-semibold mb-2">Current Benefits</h4>
                    <ul className="space-y-1 text-sm">
                      {tierBenefits.slice(0, 3).map((benefit, index) => (
                        <li key={index} className="flex items-center opacity-90">
                          <CheckCircle className="w-3 h-3 mr-2" />
                          {benefit}
                        </li>
                      ))}
                      {tierBenefits.length > 3 && (
                        <li className="text-xs opacity-75">
                          +{tierBenefits.length - 3} more benefits
                        </li>
                      )}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {quickActions.map((action, index) => (
                    <Link key={index} href={action.href}>
                      <Card className="hover:shadow-md transition-shadow cursor-pointer">
                        <CardContent className="p-4 text-center">
                          <div className={`w-12 h-12 ${action.color} rounded-lg flex items-center justify-center mx-auto mb-3`}>
                            <action.icon className="w-6 h-6 text-white" />
                          </div>
                          <h4 className="font-semibold text-sm mb-1">{action.title}</h4>
                          <p className="text-xs text-muted-foreground">{action.description}</p>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {recentActivities.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <p className="font-medium text-sm">{item.activity}</p>
                        <p className="text-xs text-muted-foreground">{item.time}</p>
                      </div>
                      {item.points > 0 && (
                        <Badge className="bg-yellow-500 text-white">
                          +{item.points} pts
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recommendations */}
            <Card>
              <CardHeader>
                <CardTitle>Recommended for You</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border border-orange-200 rounded-lg bg-orange-50">
                    <div>
                      <h4 className="font-semibold">Complete Business Registration</h4>
                      <p className="text-sm text-muted-foreground">Start your business journey in Bhutan</p>
                    </div>
                    <Button size="sm" variant="outline">
                      Learn More
                    </Button>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 border border-yellow-200 rounded-lg bg-yellow-50">
                    <div>
                      <h4 className="font-semibold">Take Advanced Cultural Quiz</h4>
                      <p className="text-sm text-muted-foreground">Earn 300 Brownie Points</p>
                    </div>
                    <Link href="/cultural">
                      <Button size="sm" variant="outline">
                        Start Quiz
                      </Button>
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
