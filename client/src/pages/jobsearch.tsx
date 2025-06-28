import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, MapPin, Clock } from "lucide-react";
import { Link } from "wouter";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";

export default function JobSearch() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedJob, setSelectedJob] = useState<any>(null);

  const form = useForm({
    defaultValues: {
      name: "",
      phone: "",
      resume: undefined,
    },
  });

  const handleApplyClick = (job: any) => {
    setSelectedJob(job);
    setIsDialogOpen(true);
    form.reset(); // Reset form fields each time dialog opens
  };

  const onSubmit = (data: any) => {
    // You can handle the form data here (e.g., send to backend)
    setIsDialogOpen(false);
    alert("Application submitted!");
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-foreground mb-4">Digital Job Portal</h2>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Connect talented individuals with businesses across Bhutan. Post jobs, apply for positions, and build your career in the digital kingdom.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div>
            <Card className="shadow-lg">
              <CardContent className="p-6">
                <h3 className="text-xl font-bold text-foreground mb-6">Find Your Perfect Job</h3>
                <div className="space-y-4 mb-6">
                  <Input placeholder="e.g. Software Developer" disabled />
                  <Select disabled>
                    <SelectTrigger>
                      <SelectValue placeholder="All Categories" />
                    </SelectTrigger>
                  </Select>
                </div>
                <Button className="w-full mb-4">
                  <Search className="w-4 h-4 mr-2" />
                  Search Jobs
                </Button>
                <Button variant="secondary" className="w-full">
                  <Plus className="w-4 h-4 mr-2" />
                  Post a Job
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="lg:col-span-2 space-y-6">
            {[
              {
                title: "Senior Software Developer",
                company: "Digital Bhutan Initiative",
                location: "Thimphu, Bhutan",
                type: "Full-time",
                skills: ["React", "Node.js", "Blockchain", "Avalanche"],
                posted: "2 days ago"
              },
              {
                title: "Tourism Marketing Specialist", 
                company: "Bhutan Tourism Board",
                location: "Paro, Bhutan",
                type: "Contract",
                skills: ["Digital Marketing", "Content Strategy", "Social Media"],
                posted: "1 week ago"
              },
              {
                title: "Dzongkha Language Teacher",
                company: "Royal Academy",
                location: "Punakha, Bhutan",
                type: "Full-time",
                skills: ["Dzongkha", "Teaching", "Curriculum Development"],
                posted: "3 days ago"
              },
              {
                title: "Bhutanese Cuisine Chef",
                company: "Himalayan Flavors Restaurant",
                location: "Thimphu, Bhutan",
                type: "Part-time",
                skills: ["Cooking", "Bhutanese Cuisine", "Teamwork"],
                posted: "5 days ago"
              },
              {
                title: "Eco-Tour Guide",
                company: "Green Bhutan Tours",
                location: "Bumthang, Bhutan",
                type: "Seasonal",
                skills: ["Ecotourism", "English", "Local Knowledge"],
                posted: "1 day ago"
              },
              {
                title: "Handicraft Sales Associate",
                company: "Bhutan Handicrafts Collective",
                location: "Paro, Bhutan",
                type: "Full-time",
                skills: ["Sales", "Customer Service", "Bhutanese Handicrafts"],
                posted: "4 days ago"
              }
            ].map((job, index) => (
              <Card key={index} className="shadow-lg border-l-4 border-primary">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="text-xl font-bold text-foreground mb-2">{job.title}</h4>
                      <p className="text-primary font-semibold">{job.company}</p>
                      <p className="text-muted-foreground text-sm">
                        <MapPin className="inline w-4 h-4 mr-1" />
                        {job.location}
                      </p>
                    </div>
                    <Badge variant="outline" className="rounded-md">
                      {job.type}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {job.skills.map((skill, index) => (
                      <Badge key={index} className="text-sm">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    Posted {job.posted} 
                    <Clock className="inline w-4 h-4 mx-1" />
                  </p>
                  <Button size="sm" onClick={() => handleApplyClick(job)}>
                    Apply
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>
                Apply for {selectedJob ? selectedJob.title : "Job"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-4"
              >
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="phone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="Your Phone Number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="resume"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Resume</FormLabel>
                      <FormControl>
                        <Input
                          type="file"
                          accept=".pdf,.doc,.docx"
                          onChange={e => field.onChange(e.target.files?.[0])}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex justify-end">
                  <Button type="submit">Submit Application</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>
    </section>
  );
}