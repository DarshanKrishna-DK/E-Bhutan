import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { 
  Star, 
  BookOpen, 
  Users, 
  Award, 
  Trophy,
  CheckCircle,
  Lock,
  Play,
  Calendar,
  Target
} from "lucide-react";
import { formatBrowniePoints, getTierName, getTierBenefits } from "@/lib/utils";
import { BuddhaFace, Stupa, LotusPattern } from "@/components/cultural-patterns";

export default function CulturalLearning() {
  const { toast } = useToast();
  const [selectedActivity, setSelectedActivity] = useState<any>(null);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, string>>({});
  const [isQuizDialogOpen, setIsQuizDialogOpen] = useState(false);

  // Mock user data
  const mockUser = {
    browniePoints: 2480,
    tierLevel: 3,
    completedActivities: [1, 3],
  };

  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/cultural/activities"],
  });

  const completeActivityMutation = useMutation({
    mutationFn: async ({ activityId, score }: { activityId: number; score?: number }) => {
      await apiRequest("POST", `/api/cultural/activities/${activityId}/complete`, {
        userId: 1, // Mock user ID
        score,
      });
    },
    onSuccess: () => {
      toast({
        title: "Activity Completed!",
        description: "Congratulations! You've earned Brownie Points.",
      });
      setIsQuizDialogOpen(false);
      setSelectedActivity(null);
      setQuizAnswers({});
      queryClient.invalidateQueries({ queryKey: ["/api/cultural/activities"] });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleStartActivity = (activity: any) => {
    if (activity.type === "quiz") {
      setSelectedActivity(activity);
      setIsQuizDialogOpen(true);
    } else {
      completeActivityMutation.mutate({ activityId: activity.id });
    }
  };

  const handleSubmitQuiz = () => {
    if (!selectedActivity) return;

    const questions = selectedActivity.content.questions || [];
    let correctAnswers = 0;

    questions.forEach((question: any, index: number) => {
      if (quizAnswers[index] === question.correctAnswer) {
        correctAnswers++;
      }
    });

    const score = Math.round((correctAnswers / questions.length) * 100);
    completeActivityMutation.mutate({ 
      activityId: selectedActivity.id, 
      score 
    });
  };

  const tierProgress = (mockUser.browniePoints % 1000) / 10;
  const tierBenefits = getTierBenefits(mockUser.tierLevel);

  const activityTypes = [
    { type: "quiz", label: "Quizzes", icon: BookOpen, color: "bg-blue-500" },
    { type: "learning_module", label: "Learning", icon: Star, color: "bg-green-500" },
    { type: "contribution", label: "Projects", icon: Users, color: "bg-purple-500" },
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 relative overflow-hidden">
      {/* Buddhist Background Elements */}
      <div className="fixed inset-0 pointer-events-none">
        <BuddhaFace className="absolute top-16 right-16 w-64 h-64 text-orange-400/8" />
        <Stupa className="absolute top-1/3 left-12 w-32 h-40 text-yellow-400/12" />
        <LotusPattern className="absolute bottom-20 right-1/4 w-56 h-56 text-orange-400/6" />
        <BuddhaFace className="absolute bottom-16 left-1/3 w-40 h-40 text-yellow-400/10" />
        <Stupa className="absolute top-24 right-1/3 w-24 h-32 text-orange-400/8" />
        <LotusPattern className="absolute top-1/2 left-1/2 w-48 h-48 text-yellow-400/5 -translate-x-1/2 -translate-y-1/2" />
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">Cultural Learning & Rewards</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Earn Brownie Points by engaging with Bhutanese culture, completing quizzes, and contributing to the community.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Progress & Profile */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card className="bhutan-gradient text-white">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Trophy className="w-5 h-5 mr-2" />
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
                  
                  <div>
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm opacity-90">Community Engagement</span>
                      <span className="text-sm font-semibold">Level 2</span>
                    </div>
                    <Progress value={40} className="bg-white/20" />
                  </div>
                  
                  <div className="pt-4 border-t border-white/20">
                    <div className="text-center">
                      <div className="text-3xl font-bold">
                        {formatBrowniePoints(mockUser.browniePoints)}
                      </div>
                      <div className="text-sm opacity-90">Brownie Points</div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Benefits Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Award className="w-5 h-5 mr-2 text-primary" />
                  Current Benefits
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  {tierBenefits.slice(0, 4).map((benefit, index) => (
                    <li key={index} className="flex items-center text-green-600">
                      <CheckCircle className="w-4 h-4 mr-2" />
                      {benefit}
                    </li>
                  ))}
                  {mockUser.tierLevel < 5 && (
                    <>
                      <li className="flex items-center text-gray-400 pt-2 border-t">
                        <Lock className="w-4 h-4 mr-2" />
                        Government service priority (Level 4)
                      </li>
                      <li className="flex items-center text-gray-400">
                        <Lock className="w-4 h-4 mr-2" />
                        Premium mini-apps access (Level 5)
                      </li>
                    </>
                  )}
                </ul>
              </CardContent>
            </Card>

            {/* Activity Types */}
            <Card>
              <CardHeader>
                <CardTitle>Activity Types</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activityTypes.map((type) => (
                    <div key={type.type} className="flex items-center space-x-3">
                      <div className={`w-10 h-10 ${type.color} rounded-lg flex items-center justify-center`}>
                        <type.icon className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{type.label}</h4>
                        <p className="text-xs text-muted-foreground">
                          {activities?.filter((a: any) => a.type === type.type).length || 0} available
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Learning Activities */}
          <div className="lg:col-span-2">
            {isLoading ? (
              <div className="grid md:grid-cols-2 gap-6">
                {[1, 2, 3, 4].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardContent className="p-6">
                      <div className="h-4 bg-gray-200 rounded mb-2"></div>
                      <div className="h-32 bg-gray-200 rounded mb-4"></div>
                      <div className="h-8 bg-gray-200 rounded"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : activities?.length ? (
              <div className="grid md:grid-cols-2 gap-6">
                {activities.map((activity: any) => {
                  const isCompleted = mockUser.completedActivities.includes(activity.id);
                  const difficultyColors = {
                    beginner: "bg-green-100 text-green-800",
                    intermediate: "bg-yellow-100 text-yellow-800", 
                    advanced: "bg-red-100 text-red-800",
                  };

                  return (
                    <Card 
                      key={activity.id} 
                      className={`border border-gray-200 hover:shadow-lg transition-shadow ${
                        isCompleted ? "bg-green-50 border-green-200" : ""
                      }`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <h4 className="font-bold text-foreground">{activity.title}</h4>
                          <div className="flex items-center space-x-2">
                            {isCompleted && (
                              <CheckCircle className="w-5 h-5 text-green-500" />
                            )}
                            <Badge className="bg-yellow-500 text-white">
                              +{activity.pointsReward} Points
                            </Badge>
                          </div>
                        </div>

                        {activity.imageUrl ? (
                          <img 
                            src={activity.imageUrl} 
                            alt={activity.title}
                            className="w-full h-32 object-cover rounded-lg mb-4"
                          />
                        ) : (
                          <div className="w-full h-32 bg-gradient-to-br from-orange-100 to-yellow-100 rounded-lg mb-4 flex items-center justify-center text-4xl">
                            {activity.type === "quiz" && "🏛️"}
                            {activity.type === "learning_module" && "📚"}
                            {activity.type === "contribution" && "🌱"}
                          </div>
                        )}

                        <p className="text-muted-foreground text-sm mb-4">
                          {activity.description}
                        </p>

                        <div className="flex items-center justify-between mb-4">
                          <Badge className={difficultyColors[activity.difficulty as keyof typeof difficultyColors]}>
                            {activity.difficulty.charAt(0).toUpperCase() + activity.difficulty.slice(1)}
                          </Badge>
                          <span className="text-xs text-muted-foreground flex items-center">
                            <Users className="w-3 h-3 mr-1" />
                            {Math.floor(Math.random() * 500) + 100} completed
                          </span>
                        </div>

                        <Button 
                          onClick={() => handleStartActivity(activity)}
                          className="w-full"
                          disabled={isCompleted || completeActivityMutation.isPending}
                        >
                          {isCompleted ? (
                            "Completed"
                          ) : activity.type === "quiz" ? (
                            <>
                              <Play className="w-4 h-4 mr-2" />
                              Start Quiz
                            </>
                          ) : (
                            <>
                              <BookOpen className="w-4 h-4 mr-2" />
                              Start Learning
                            </>
                          )}
                        </Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            ) : (
              <Card className="text-center py-12">
                <CardContent>
                  <BookOpen className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-foreground mb-2">No Activities Available</h3>
                  <p className="text-muted-foreground">
                    Cultural learning activities are being prepared. Check back soon!
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Quiz Dialog */}
        <Dialog open={isQuizDialogOpen} onOpenChange={setIsQuizDialogOpen}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{selectedActivity?.title}</DialogTitle>
            </DialogHeader>
            
            {selectedActivity?.content?.questions && (
              <div className="space-y-6">
                {selectedActivity.content.questions.map((question: any, index: number) => (
                  <div key={index} className="space-y-3">
                    <h4 className="font-medium text-foreground">
                      {index + 1}. {question.question}
                    </h4>
                    <RadioGroup
                      value={quizAnswers[index] || ""}
                      onValueChange={(value) => 
                        setQuizAnswers(prev => ({ ...prev, [index]: value }))
                      }
                    >
                      {question.options.map((option: string, optionIndex: number) => (
                        <div key={optionIndex} className="flex items-center space-x-2">
                          <RadioGroupItem value={option} id={`q${index}-o${optionIndex}`} />
                          <Label htmlFor={`q${index}-o${optionIndex}`}>{option}</Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>
                ))}

                <div className="flex justify-end space-x-2 pt-4 border-t">
                  <Button
                    variant="outline"
                    onClick={() => setIsQuizDialogOpen(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitQuiz}
                    disabled={
                      Object.keys(quizAnswers).length !== selectedActivity?.content?.questions?.length ||
                      completeActivityMutation.isPending
                    }
                  >
                    {completeActivityMutation.isPending ? "Submitting..." : "Submit Quiz"}
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}
