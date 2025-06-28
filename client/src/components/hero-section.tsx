import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, UserPlus, Shield, Coins } from "lucide-react";
import { Link } from "wouter";

export default function HeroSection() {
  return (
    <section className="relative bhutan-gradient text-white py-20">
      {/* Background Pattern */}
      <div className="absolute inset-0 bhutan-pattern"></div>
      
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Welcome to<br />
              <span className="text-yellow-200">Digital Bhutan</span>
            </h1>
            <p className="text-xl mb-8 opacity-90">
              The world's first blockchain-powered nation. Get your digital residency, earn cultural rewards, and be part of Bhutan's digital transformation.
            </p>
                {/* Key Features */}
              <div className="grid sm:grid-cols-2 gap-4">
                <Card className="bg-white text-black shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bhutan-gradient rounded-lg flex items-center justify-center">
                        <Shield className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">NFT Digital ID</h3>
                        <p className="text-sm text-muted-foreground">Soulbound identity tokens</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="bg-white text-black shadow-lg">
                  <CardContent className="p-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-yellow-500 to-yellow-600 rounded-lg flex items-center justify-center">
                        <Coins className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-foreground">NuBuck Currency</h3>
                        <p className="text-sm text-muted-foreground">Avalanche-powered tokens</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            <div className="h-8" />
            <div className="flex flex-col sm:flex-row gap-4">
              <Link href="/residency">
                <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                  <UserPlus className="w-5 h-5 mr-2" />
                  Apply for Residency
                </Button>
              </Link>
              <Button size="lg" variant="secondary" className="bg-white text-primary hover:bg-gray-100">
                <Play className="w-5 h-5 mr-2" />
                Watch Demo
              </Button>
            </div>
          </div>
          
          <div className="hidden md:block">
            <Card className="bg-white/10 backdrop-blur-sm border-white/20">
              <CardContent className="p-6">
                <div className="text-center mb-6">
                  <h3 className="text-2xl font-bold mb-2">Quick Stats</h3>
                  <p className="opacity-80">Digital transformation in progress</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-200">1,247</div>
                    <div className="text-sm opacity-80">Digital Residents</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-200">856</div>
                    <div className="text-sm opacity-80">Active Businesses</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-200">2.3M</div>
                    <div className="text-sm opacity-80">Brownie Points Earned</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-yellow-200">94%</div>
                    <div className="text-sm opacity-80">Satisfaction Rate</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Cultural Pattern Border */}
      <div className="absolute bottom-0 left-0 right-0 h-4 bg-gradient-to-r from-yellow-300 via-white to-orange-300 opacity-30"></div>
    </section>
  );
}
