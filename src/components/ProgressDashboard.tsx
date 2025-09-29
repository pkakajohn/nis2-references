import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Section, calculateSectionScore, getRiskLevel } from "@/data/fullAssessmentData";
import { Shield, TrendingUp, AlertTriangle, CheckCircle2 } from "lucide-react";

interface ProgressDashboardProps {
  sections: Section[];
}

export function ProgressDashboard({ sections }: ProgressDashboardProps) {
  // Calculate overall statistics
  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = sections.reduce((sum, section) => 
    sum + section.questions.filter(q => q.selectedAnswer !== undefined).length, 0
  );
  
  // Calculate overall score
  let totalCurrentScore = 0;
  let totalMaxScore = 0;
  
  sections.forEach(section => {
    const { currentScore, maxScore } = calculateSectionScore(section.questions);
    totalCurrentScore += currentScore;
    totalMaxScore += maxScore;
  });
  
  const overallPercentage = totalMaxScore > 0 ? Math.round((totalCurrentScore / totalMaxScore) * 100) : 0;
  const overallRisk = getRiskLevel(overallPercentage);
  
  // Calculate policy questions score
  const policyQuestions = sections.flatMap(section => 
    section.questions.filter(q => q.isPolicyQuestion)
  );
  
  let policyCurrentScore = 0;
  let policyMaxScore = 0;
  
  policyQuestions.forEach(question => {
    if (question.selectedAnswer !== undefined) {
      policyCurrentScore += question.selectedAnswer * question.weight;
    }
    policyMaxScore += 4 * question.weight; // Policy questions max is 4
  });
  
  const policyPercentage = policyMaxScore > 0 ? Math.round((policyCurrentScore / policyMaxScore) * 100) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center space-y-2">
        <h2 className="text-2xl font-bold bg-gradient-security bg-clip-text text-transparent">
          Dashboard Αξιολόγησης Κυβερνοασφάλειας
        </h2>
        <p className="text-muted-foreground">
          Παρακολουθήστε την πρόοδο και τα αποτελέσματα της αυτοαξιολόγησής σας
        </p>
      </div>

      {/* Overall Progress */}
      <Card className="p-6 border-l-4 border-l-primary">
        <div className="flex items-center gap-4 mb-6">
          <div className="p-3 rounded-lg bg-gradient-primary">
            <TrendingUp className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="text-xl font-semibold">Συνολική Πρόοδος</h3>
            <p className="text-muted-foreground">
              {answeredQuestions} από {totalQuestions} ερωτήσεις απαντήθηκαν
            </p>
          </div>
        </div>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <span className="text-sm font-medium">Ολοκλήρωση Αξιολόγησης</span>
            <span className="text-2xl font-bold text-primary">
              {Math.round((answeredQuestions / totalQuestions) * 100)}%
            </span>
          </div>
          <Progress 
            value={(answeredQuestions / totalQuestions) * 100} 
            className="h-3"
          />
        </div>
      </Card>

      {/* Overall Security Score */}
      {answeredQuestions > 0 && (
        <Card className="p-6 border-l-4" style={{ borderLeftColor: `hsl(var(--${overallRisk.color}))` }}>
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-4">
              <div 
                className="p-3 rounded-lg text-white"
                style={{ backgroundColor: `hsl(var(--${overallRisk.color}))` }}
              >
                <Shield className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-xl font-semibold">Συνολικό Επίπεδο Ασφάλειας</h3>
                <p className="text-muted-foreground">
                  Βασισμένο στις απαντημένες ερωτήσεις
                </p>
              </div>
            </div>
            <Badge 
              className="text-white border-0 text-sm py-2 px-4"
              style={{ backgroundColor: `hsl(var(--${overallRisk.color}))` }}
            >
              {overallRisk.label}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Συνολική Βαθμολογία</span>
              <span className="text-3xl font-bold" style={{ color: `hsl(var(--${overallRisk.color}))` }}>
                {overallPercentage}%
              </span>
            </div>
            <Progress 
              value={overallPercentage} 
              className="h-3"
              style={{ 
                '--progress-background': `hsl(var(--${overallRisk.color}))` 
              } as React.CSSProperties}
            />
            <div className="text-xs text-muted-foreground">
              {totalCurrentScore} από {totalMaxScore} πόντους συνολικά
            </div>
          </div>
        </Card>
      )}

      {/* Policy Maturity */}
      {policyQuestions.some(q => q.selectedAnswer !== undefined) && (
        <Card className="p-6 border-l-4 border-l-secondary">
          <div className="flex items-center gap-4 mb-6">
            <div className="p-3 rounded-lg bg-secondary">
              <CheckCircle2 className="h-6 w-6 text-secondary-foreground" />
            </div>
            <div>
              <h3 className="text-xl font-semibold">Ωριμότητα Πολιτικών Ασφάλειας</h3>
              <p className="text-muted-foreground">
                Αξιολόγηση των πολιτικών και διαδικασιών ασφάλειας
              </p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Βαθμός Ωριμότητας</span>
              <span className="text-2xl font-bold text-secondary">
                {policyPercentage}%
              </span>
            </div>
            <Progress 
              value={policyPercentage} 
              className="h-3 [&>div]:bg-secondary"
            />
            <div className="text-xs text-muted-foreground">
              {policyCurrentScore} από {policyMaxScore} πόντους για πολιτικές ασφάλειας
            </div>
          </div>
        </Card>
      )}

      {/* Section Breakdown */}
      <Card className="p-6">
        <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
          <AlertTriangle className="h-5 w-5" />
          Ανάλυση ανά Θεματική Ενότητα
        </h3>
        
        <div className="space-y-4">
          {sections.map((section) => {
            const { percentage } = calculateSectionScore(section.questions);
            const riskLevel = getRiskLevel(percentage);
            const answeredInSection = section.questions.filter(q => q.selectedAnswer !== undefined).length;
            const isComplete = answeredInSection === section.questions.length;
            
            return (
              <div key={section.id} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium truncate flex-1 mr-4">
                    {section.title}
                  </span>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-muted-foreground">
                      {answeredInSection}/{section.questions.length}
                    </span>
                    {isComplete && (
                      <Badge 
                        className="text-xs text-white border-0"
                        style={{ backgroundColor: `hsl(var(--${riskLevel.color}))` }}
                      >
                        {percentage}%
                      </Badge>
                    )}
                  </div>
                </div>
                <Progress 
                  value={isComplete ? percentage : (answeredInSection / section.questions.length) * 100}
                  className="h-2"
                  style={isComplete ? { 
                    '--progress-background': `hsl(var(--${riskLevel.color}))` 
                  } as React.CSSProperties : {}}
                />
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}