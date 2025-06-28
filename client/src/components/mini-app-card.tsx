import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Star } from "lucide-react";
import { MiniApp } from "@shared/schema";

interface MiniAppCardProps {
  miniApp: MiniApp;
  onLaunch?: (appId: number) => void;
}

export default function MiniAppCard({ miniApp, onLaunch }: MiniAppCardProps) {
  const renderStars = (rating: number) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />);
    }
    
    if (hasHalfStar) {
      stars.push(<Star key="half" className="w-4 h-4 fill-yellow-400/50 text-yellow-400" />);
    }
    
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="w-4 h-4 text-gray-300" />);
    }
    
    return stars;
  };

  return (
    <Card className="shadow-lg hover:shadow-xl transition-shadow traditional-shadow">
      <CardContent className="p-6">
        <div className="w-16 h-16 bhutan-gradient rounded-xl flex items-center justify-center mb-4">
          <i className={`${miniApp.iconClass} text-white text-2xl`}></i>
        </div>
        <h4 className="font-bold text-foreground mb-2">{miniApp.name}</h4>
        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">
          {miniApp.description}
        </p>
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-yellow-500">
            {renderStars(Number(miniApp.rating))}
            <span className="ml-2 text-muted-foreground text-sm">
              {Number(miniApp.rating).toFixed(1)}
            </span>
          </div>
          <span className="text-xs text-muted-foreground">
            {miniApp.userCount.toLocaleString()} users
          </span>
        </div>
        <Button 
          onClick={() => onLaunch?.(miniApp.id)}
          className="w-full bg-primary hover:bg-primary/90"
        >
          Launch App
        </Button>
      </CardContent>
    </Card>
  );
}
