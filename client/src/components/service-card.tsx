import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";

interface ServiceCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  features: string[];
  gradient?: "orange" | "yellow";
}

export default function ServiceCard({ title, description, icon: Icon, features, gradient }: ServiceCardProps) {
  const gradientClass = gradient === "orange" 
    ? "from-orange-500/5 to-yellow-500/5 border-orange-500/20" 
    : "from-yellow-500/5 to-orange-500/5 border-yellow-500/20";

  const iconBg = gradient === "orange" ? "bg-orange-500" : "bg-yellow-500";

  return (
    <Card className={`bg-gradient-to-br ${gradientClass} hover:shadow-lg transition-shadow traditional-shadow`}>
      <CardContent className="p-8">
        <div className={`w-16 h-16 ${iconBg} rounded-lg flex items-center justify-center mb-6`}>
          <Icon className="text-white text-2xl w-8 h-8" />
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-4">{title}</h3>
        <p className="text-muted-foreground mb-6">{description}</p>
        <ul className="space-y-2">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center text-sm text-foreground">
              <Check className={`w-4 h-4 mr-2 ${gradient === "orange" ? "text-orange-500" : "text-yellow-600"}`} />
              {feature}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
