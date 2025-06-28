import { Card, CardContent } from "@/components/ui/card";
import { LucideIcon } from "lucide-react";

interface StatsCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: LucideIcon;
  gradient?: boolean;
}

export default function StatsCard({ title, value, subtitle, icon: Icon, gradient = false }: StatsCardProps) {
  return (
    <Card className={gradient ? "bhutan-gradient text-white" : "cultural-card"}>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-sm opacity-90">{title}</h3>
          <Icon className="w-5 h-5 opacity-75" />
        </div>
        <div className="space-y-1">
          <div className="text-3xl font-bold">{value}</div>
          <div className="text-sm opacity-75">{subtitle}</div>
        </div>
      </CardContent>
    </Card>
  );
}
