import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Building } from "lucide-react";
import { Job } from "@shared/schema";
import { formatDate } from "@/lib/utils";

interface JobCardProps {
  job: Job;
  onApply?: (jobId: number) => void;
}

export default function JobCard({ job, onApply }: JobCardProps) {
  const borderColors = ["border-orange-500", "border-yellow-500"];
  const borderColor = borderColors[job.id % borderColors.length];

  return (
    <Card className={`shadow-lg border-l-4 ${borderColor} hover:shadow-xl transition-shadow traditional-shadow`}>
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex-1">
            <h4 className="text-xl font-bold text-foreground mb-2">{job.title}</h4>
            <p className="text-primary font-semibold flex items-center">
              <Building className="w-4 h-4 mr-1" />
              {job.businessId ? `Business ID: ${job.businessId}` : "Government Position"}
            </p>
            <p className="text-muted-foreground text-sm flex items-center mt-1">
              <MapPin className="w-4 h-4 mr-1" />
              {job.location}
            </p>
          </div>
          <Badge 
            variant={job.employmentType === "full-time" ? "default" : job.employmentType === "contract" ? "secondary" : "outline"}
            className="capitalize"
          >
            {job.employmentType}
          </Badge>
        </div>
        
        <p className="text-foreground mb-4 line-clamp-3">{job.description}</p>
        
        <div className="flex items-center gap-2 mb-4 flex-wrap">
          {job.skills.slice(0, 4).map((skill, index) => (
            <Badge key={index} variant="outline" className="text-xs">
              {skill}
            </Badge>
          ))}
          {job.skills.length > 4 && (
            <Badge variant="outline" className="text-xs">
              +{job.skills.length - 4} more
            </Badge>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="text-sm text-muted-foreground flex items-center">
            <Clock className="w-4 h-4 mr-1" />
            Posted {formatDate(job.createdAt!)}
          </div>
          <Button 
            onClick={() => onApply?.(job.id)}
            className="bg-primary hover:bg-primary/90"
          >
            Apply Now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
