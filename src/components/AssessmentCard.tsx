import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, CheckCircle2, AlertTriangle, XCircle } from "lucide-react";
import { Section, calculateSectionScore, getRiskLevel } from "@/data/assessmentData";

interface AssessmentCardProps {
  section: Section;
  onClick: () => void;
}

export function AssessmentCard({ section, onClick }: AssessmentCardProps) {
  const { percentage } = calculateSectionScore(section.questions);
  const riskLevel = getRiskLevel(percentage);
  
  // Count answered questions
  const answeredQuestions = section.questions.filter(q => q.selectedAnswer !== undefined).length;
  const totalQuestions = section.questions.length;
  const isComplete = answeredQuestions === totalQuestions;

  // Risk level icon and styling
  const getRiskIcon = () => {
    switch (riskLevel.level) {
      case "critical":
        return <XCircle className="h-5 w-5" />;
      case "high":
        return <AlertTriangle className="h-5 w-5" />;
      case "medium":
        return <Shield className="h-5 w-5" />;
      case "low":
        return <CheckCircle2 className="h-5 w-5" />;
    }
  };

  return (
    <Card 
      className="group cursor-pointer transition-all duration-300 hover:shadow-security border-l-4"
      style={{ borderLeftColor: `hsl(var(--${riskLevel.color}))` }}
      onClick={onClick}
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-primary">
              <Shield className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <h3 className="font-semibold text-lg mb-1 group-hover:text-primary transition-colors">
                {section.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {answeredQuestions} από {totalQuestions} ερωτήσεις
              </p>
            </div>
          </div>
          
          {isComplete && (
            <Badge 
              className="flex items-center gap-1 text-white border-0"
              style={{ backgroundColor: `hsl(var(--${riskLevel.color}))` }}
            >
              {getRiskIcon()}
              {riskLevel.label}
            </Badge>
          )}
        </div>

        <div className="space-y-3">
          {/* Progress bar */}
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span className="text-muted-foreground">Πρόοδος</span>
              <span className="font-medium">{answeredQuestions}/{totalQuestions}</span>
            </div>
            <div className="h-2 bg-muted rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-primary transition-all duration-500"
                style={{ width: `${(answeredQuestions / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Score display */}
          {isComplete && (
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Επίπεδο Ασφάλειας</span>
                <span className="font-medium">{percentage}%</span>
              </div>
              <div className="h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="h-full transition-all duration-500"
                  style={{ 
                    width: `${percentage}%`,
                    backgroundColor: `hsl(var(--${riskLevel.color}))`
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}