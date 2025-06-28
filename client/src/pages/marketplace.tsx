import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Languages, Coins, Sprout, Star } from "lucide-react";

export default function Marketplace() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Digital Marketplace
          </h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Discover authentic Bhutanese products, services, and experiences.
            Support local artisans and businesses.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {[
            {
              name: "Traditional Kira",
              price: 245,
              points: 50,
              icon: "👘",
            },
            {
              name: "Singing Bowl Set",
              price: 89,
              points: 25,
              icon: "🎵",
            },
            {
              name: "Prayer Flag Set",
              price: 32,
              points: 15,
              icon: "🎌",
            },
            {
              name: "Himalayan Tea",
              price: 28,
              points: 12,
              icon: "🍵",
            },
          ].map((product, index) => (
            <Card
              key={index}
              className="shadow-lg overflow-hidden border border-gray-200"
            >
              <div className="aspect-video bg-gradient-to-br from-orange-100 to-yellow-100 flex items-center justify-center text-4xl">
                {product.icon}
              </div>
              <CardContent className="p-6">
                <h4 className="font-bold text-foreground mb-2">
                  {product.name}
                </h4>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-primary">
                    ${product.price}
                  </span>
                  <Badge className="bg-yellow-500 text-white">
                    +{product.points} Points
                  </Badge>
                </div>
                <Button className="w-full">
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Mini-App Store Preview */}
        <Card className="bg-gradient-to-br from-orange-50 to-yellow-50 border border-orange-200">
          <CardContent className="p-8">
            <div className="text-center mb-8">
              <h3 className="text-3xl font-bold text-foreground mb-4">
                Mini-App Store
              </h3>
              <p className="text-xl text-muted-foreground">
                Discover mini-applications that enhance your Digital Bhutan
                experience
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {[
                {
                  name: "Learn Dzongkha",
                  icon: Languages,
                  rating: 4.9,
                  users: "2.3k",
                },
                {
                  name: "NuBuck Wallet",
                  icon: Coins,
                  rating: 4.7,
                  users: "1.8k",
                },
                {
                  name: "Carbon Tracker",
                  icon: Sprout,
                  rating: 4.2,
                  users: "956",
                },
              ].map((app, index) => (
                <Card key={index} className="shadow-lg">
                  <CardContent className="p-6">
                    <div className="w-16 h-16 bhutan-gradient rounded-xl flex items-center justify-center mb-4">
                      <app.icon className="text-white w-8 h-8" />
                    </div>
                    <h4 className="font-bold text-foreground mb-2">
                      {app.name}
                    </h4>
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center text-yellow-500">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="ml-1 text-muted-foreground text-sm">
                          {app.rating}
                        </span>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {app.users} users
                      </span>
                    </div>
                    <Button className="w-full" size="sm">
                      Launch App
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}