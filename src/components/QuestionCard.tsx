import { Card } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/data/assessmentData";
import { MessageSquare, Weight } from "lucide-react";

interface QuestionCardProps {
  question: Question;
  questionIndex: number;
  totalQuestions: number;
  onAnswerChange: (questionId: string, value: number) => void;
  onCommentChange: (questionId: string, comment: string) => void;
}

export function QuestionCard({ 
  question, 
  questionIndex, 
  totalQuestions,
  onAnswerChange,
  onCommentChange
}: QuestionCardProps) {
  return (
    <Card className="p-6 mb-6 border-l-4 border-l-primary/30 hover:border-l-primary transition-colors">
      <div className="space-y-6">
        {/* Question header */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-3">
              <Badge variant="outline" className="text-xs font-mono">
                {question.id}
              </Badge>
              <Badge variant="secondary" className="text-xs flex items-center gap-1">
                <Weight className="h-3 w-3" />
                Βαρύτητα: {question.weight}
              </Badge>
              {question.isPolicyQuestion && (
                <Badge className="text-xs bg-secondary text-secondary-foreground">
                  Πολιτική Ασφάλειας
                </Badge>
              )}
            </div>
            <h3 className="text-lg font-medium leading-relaxed text-foreground">
              {question.question}
            </h3>
          </div>
          <div className="text-sm text-muted-foreground font-medium">
            {questionIndex + 1} / {totalQuestions}
          </div>
        </div>

        {/* Answer options */}
        <div className="space-y-4">
          <Label className="text-base font-medium">Επιλέξτε απάντηση:</Label>
          
          <RadioGroup
            value={question.selectedAnswer?.toString() || ""}
            onValueChange={(value) => onAnswerChange(question.id, parseInt(value))}
            className="space-y-3"
          >
            {question.answers.map((answer, index) => (
              <div 
                key={index} 
                className="flex items-start space-x-3 p-3 rounded-lg hover:bg-muted/50 transition-colors"
              >
                <RadioGroupItem 
                  value={answer.value.toString()} 
                  id={`${question.id}-${index}`}
                  className="mt-1"
                />
                <Label 
                  htmlFor={`${question.id}-${index}`}
                  className="text-sm leading-relaxed cursor-pointer flex-1"
                >
                  <span className="inline-flex items-center gap-2">
                    <Badge variant="outline" className="text-xs font-mono">
                      {answer.value} πόντοι
                    </Badge>
                    {answer.label}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Comments section */}
        <div className="space-y-3 pt-4 border-t border-border">
          <Label className="text-sm font-medium flex items-center gap-2">
            <MessageSquare className="h-4 w-4" />
            Παρατηρήσεις / Σχόλια (προαιρετικό)
          </Label>
          <Textarea
            placeholder="Προσθέστε τυχόν παρατηρήσεις ή επεξηγήσεις για την απάντησή σας..."
            value={question.comments || ""}
            onChange={(e) => onCommentChange(question.id, e.target.value)}
            className="min-h-[80px] resize-none"
          />
        </div>
      </div>
    </Card>
  );
}