import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { QuestionCard } from "./QuestionCard";
import { Section, calculateSectionScore, getRiskLevel } from "@/data/assessmentData";
import { ArrowLeft, ArrowRight, BarChart3, Download } from "lucide-react";

interface QuestionSectionProps {
  section: Section;
  onAnswerChange: (questionId: string, value: number) => void;
  onCommentChange: (questionId: string, comment: string) => void;
  onBack: () => void;
}

export function QuestionSection({ 
  section, 
  onAnswerChange, 
  onCommentChange, 
  onBack 
}: QuestionSectionProps) {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  
  const currentQuestion = section.questions[currentQuestionIndex];
  const { currentScore, maxScore, percentage } = calculateSectionScore(section.questions);
  const riskLevel = getRiskLevel(percentage);
  
  // Count answered questions
  const answeredQuestions = section.questions.filter(q => q.selectedAnswer !== undefined).length;
  const isComplete = answeredQuestions === section.questions.length;
  
  const nextQuestion = () => {
    if (currentQuestionIndex < section.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };
  
  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-security text-white p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-4">
            <Button
              variant="ghost"
              onClick={onBack}
              className="text-white hover:bg-white/20"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Επιστροφή
            </Button>
            
            {isComplete && (
              <Badge 
                className="text-white border-white/30"
                style={{ backgroundColor: `hsl(var(--${riskLevel.color}))` }}
              >
                <BarChart3 className="h-4 w-4 mr-1" />
                {riskLevel.label} - {percentage}%
              </Badge>
            )}
          </div>
          
          <h1 className="text-2xl font-bold mb-2">{section.title}</h1>
          <p className="text-white/90 mb-4">
            Ερώτηση {currentQuestionIndex + 1} από {section.questions.length}
          </p>
          
          {/* Progress bar */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Πρόοδος ενότητας</span>
              <span>{answeredQuestions}/{section.questions.length} απαντημένες</span>
            </div>
            <Progress 
              value={(answeredQuestions / section.questions.length) * 100}
              className="h-2 bg-white/20 [&>div]:bg-white"
            />
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="max-w-4xl mx-auto p-6">
        <QuestionCard
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          totalQuestions={section.questions.length}
          onAnswerChange={onAnswerChange}
          onCommentChange={onCommentChange}
        />

        {/* Navigation */}
        <div className="flex justify-between items-center mt-6">
          <Button
            variant="outline"
            onClick={prevQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Προηγούμενη
          </Button>

          {/* Question navigator dots */}
          <div className="flex gap-2 mx-4">
            {section.questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestionIndex(index)}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentQuestionIndex
                    ? 'bg-primary'
                    : section.questions[index].selectedAnswer !== undefined
                    ? 'bg-primary/50'
                    : 'bg-muted'
                }`}
                title={`Ερώτηση ${index + 1}`}
              />
            ))}
          </div>

          <Button
            onClick={nextQuestion}
            disabled={currentQuestionIndex === section.questions.length - 1}
          >
            Επόμενη
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </div>

        {/* Section completion summary */}
        {isComplete && (
          <Card className="mt-8 p-6 bg-gradient-to-r from-muted/50 to-background border-l-4"
               style={{ borderLeftColor: `hsl(var(--${riskLevel.color}))` }}>
            <div className="text-center space-y-4">
              <div className="flex items-center justify-center gap-2">
                <BarChart3 className="h-6 w-6 text-primary" />
                <h3 className="text-xl font-semibold">Ενότητα Ολοκληρωμένη!</h3>
              </div>
              
              <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary">{percentage}%</div>
                  <div className="text-sm text-muted-foreground">Βαθμολογία</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold" style={{ color: `hsl(var(--${riskLevel.color}))` }}>
                    {currentScore}
                  </div>
                  <div className="text-sm text-muted-foreground">από {maxScore} πόντους</div>
                </div>
                <div className="text-center">
                  <div 
                    className="text-sm font-medium px-3 py-1 rounded-full text-white"
                    style={{ backgroundColor: `hsl(var(--${riskLevel.color}))` }}
                  >
                    {riskLevel.label}
                  </div>
                  <div className="text-sm text-muted-foreground mt-1">Επίπεδο Κινδύνου</div>
                </div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}