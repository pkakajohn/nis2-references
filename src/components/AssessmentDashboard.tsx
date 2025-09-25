import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AssessmentCard } from "./AssessmentCard";
import { QuestionSection } from "./QuestionSection";
import { ProgressDashboard } from "./ProgressDashboard";
import { Section, assessmentSections } from "@/data/assessmentData";
import { exportToExcel, exportToPDF, exportDashboardToPDF } from "@/utils/exportUtils";
import { Shield, Download, FileSpreadsheet, FileText, BarChart3, RotateCcw } from "lucide-react";
import { toast } from "sonner";

type View = 'overview' | 'section' | 'dashboard';

export function AssessmentDashboard() {
  const [sections, setSections] = useState<Section[]>(assessmentSections);
  const [currentView, setCurrentView] = useState<View>('overview');
  const [selectedSection, setSelectedSection] = useState<Section | null>(null);

  // Load saved data from localStorage
  useEffect(() => {
    const savedData = localStorage.getItem('cybersecurity-assessment');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        setSections(parsed);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  // Save data to localStorage whenever sections change
  useEffect(() => {
    localStorage.setItem('cybersecurity-assessment', JSON.stringify(sections));
  }, [sections]);

  const handleAnswerChange = (questionId: string, value: number) => {
    setSections(prev => prev.map(section => ({
      ...section,
      questions: section.questions.map(question =>
        question.id === questionId 
          ? { ...question, selectedAnswer: value }
          : question
      )
    })));
  };

  const handleCommentChange = (questionId: string, comment: string) => {
    setSections(prev => prev.map(section => ({
      ...section,
      questions: section.questions.map(question =>
        question.id === questionId 
          ? { ...question, comments: comment }
          : question
      )
    })));
  };

  const handleSectionSelect = (section: Section) => {
    setSelectedSection(section);
    setCurrentView('section');
  };

  const handleBack = () => {
    setCurrentView('overview');
    setSelectedSection(null);
  };

  const handleReset = () => {
    if (confirm('Είστε βέβαιοι ότι θέλετε να επαναφέρετε όλες τις απαντήσεις; Αυτή η ενέργεια δεν μπορεί να αναιρεθεί.')) {
      setSections(assessmentSections);
      setCurrentView('overview');
      setSelectedSection(null);
      toast.success('Οι απαντήσεις επαναφέρθηκαν επιτυχώς');
    }
  };

  const handleExportExcel = () => {
    try {
      exportToExcel(sections);
      toast.success('Η εξαγωγή Excel ολοκληρώθηκε επιτυχώς');
    } catch (error) {
      toast.error('Σφάλμα κατά την εξαγωγή Excel');
    }
  };

  const handleExportPDF = () => {
    try {
      exportToPDF(sections);
      toast.success('Η εξαγωγή PDF ολοκληρώθηκε επιτυχώς');
    } catch (error) {
      toast.error('Σφάλμα κατά την εξαγωγή PDF');
    }
  };

  const handleExportDashboardPDF = () => {
    try {
      exportDashboardToPDF('dashboard-content');
      toast.success('Η εξαγωγή Dashboard PDF ολοκληρώθηκε επιτυχώς');
    } catch (error) {
      toast.error('Σφάλμα κατά την εξαγωγή Dashboard PDF');
    }
  };

  // Count overall progress
  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = sections.reduce((sum, section) => 
    sum + section.questions.filter(q => q.selectedAnswer !== undefined).length, 0
  );

  if (currentView === 'section' && selectedSection) {
    return (
      <QuestionSection
        section={selectedSection}
        onAnswerChange={handleAnswerChange}
        onCommentChange={handleCommentChange}
        onBack={handleBack}
      />
    );
  }

  if (currentView === 'dashboard') {
    return (
      <div className="min-h-screen bg-background">
        {/* Header */}
        <div className="bg-gradient-security text-white p-6">
          <div className="max-w-6xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <Button
                variant="ghost"
                onClick={() => setCurrentView('overview')}
                className="text-white hover:bg-white/20"
              >
                <Shield className="h-4 w-4 mr-2" />
                Επιστροφή στις Ενότητες
              </Button>
              
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  onClick={handleExportDashboardPDF}
                  className="text-white hover:bg-white/20"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Εξαγωγή Dashboard PDF
                </Button>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold">Dashboard Αποτελεσμάτων</h1>
            <p className="text-white/90">
              Επισκόπηση της προόδου και των αποτελεσμάτων της αξιολόγησης
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto p-6" id="dashboard-content">
          <ProgressDashboard sections={sections} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Header */}
      <div className="bg-gradient-hero text-white">
        <div className="max-w-6xl mx-auto px-6 py-12">
          <div className="text-center space-y-6">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
                <Shield className="h-12 w-12" />
              </div>
            </div>
            
            <h1 className="text-4xl font-bold mb-4">
              Εργαλείο Αυτοαξιολόγησης Κυβερνοασφάλειας
            </h1>
            
            <p className="text-xl text-white/90 max-w-3xl mx-auto leading-relaxed">
              Αξιολογήστε το επίπεδο κυβερνοασφάλειας του οργανισμού σας με 234 σημεία ελέγχου 
              χωρισμένα σε 19 θεματικές ενότητες
            </p>

            <div className="flex items-center justify-center gap-8 text-sm">
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  {answeredQuestions}/{totalQuestions}
                </Badge>
                <span>Ερωτήσεις Απαντημένες</span>
              </div>
              <div className="flex items-center gap-2">
                <Badge className="bg-white/20 text-white border-white/30">
                  19
                </Badge>
                <span>Θεματικές Ενότητες</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex gap-3">
              <Button
                onClick={() => setCurrentView('dashboard')}
                className="bg-primary hover:bg-primary-hover"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Dashboard Αποτελεσμάτων
              </Button>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleExportExcel}>
                <FileSpreadsheet className="h-4 w-4 mr-2" />
                Εξαγωγή Excel
              </Button>
              <Button variant="outline" onClick={handleExportPDF}>
                <FileText className="h-4 w-4 mr-2" />
                Εξαγωγή PDF
              </Button>
              <Button variant="outline" onClick={handleReset}>
                <RotateCcw className="h-4 w-4 mr-2" />
                Επαναφορά
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">Θεματικές Ενότητες</h2>
          <p className="text-muted-foreground">
            Επιλέξτε μια ενότητα για να ξεκινήσετε την αξιολόγηση
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {sections.map((section) => (
            <AssessmentCard
              key={section.id}
              section={section}
              onClick={() => handleSectionSelect(section)}
            />
          ))}
        </div>

        {/* Quick stats */}
        <Card className="mt-8 p-6 bg-gradient-to-r from-muted/50 to-background">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            <div>
              <div className="text-2xl font-bold text-primary">{sections.length}</div>
              <div className="text-sm text-muted-foreground">Θεματικές Ενότητες</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">{totalQuestions}</div>
              <div className="text-sm text-muted-foreground">Συνολικές Ερωτήσεις</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-secondary">{answeredQuestions}</div>
              <div className="text-sm text-muted-foreground">Απαντημένες</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-primary">
                {Math.round((answeredQuestions / totalQuestions) * 100)}%
              </div>
              <div className="text-sm text-muted-foreground">Πρόοδος</div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}