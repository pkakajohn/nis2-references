import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Section } from "@/data/fullAssessmentData";
import { nis2Requirements, calculateComplianceStatus, complianceStatusLabels, complianceStatusColors } from "@/data/nis2Requirements";
import { generateComplianceReportDOC, generateComplianceReportPDF, ComplianceReportData } from "@/utils/complianceReportUtils";
import { FileText, Download, Shield, AlertTriangle, CheckCircle2, XCircle, AlertCircle } from "lucide-react";
import { toast } from "sonner";

interface ComplianceReportGeneratorProps {
  sections: Section[];
}

export function ComplianceReportGenerator({ sections }: ComplianceReportGeneratorProps) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [reportData, setReportData] = useState({
    organizationName: '',
    assessmentPeriod: new Date().getFullYear().toString(),
    preparedBy: '',
    approvedBy: ''
  });

  // Calculate compliance status for all requirements
  const complianceResults = nis2Requirements.map(requirement => 
    calculateComplianceStatus(requirement, sections)
  );

  // Calculate overall compliance metrics
  const totalRequirements = nis2Requirements.length;
  const compliantRequirements = complianceResults.filter(r => r.status === 'compliant').length;
  const partialRequirements = complianceResults.filter(r => r.status === 'partial').length;
  const nonCompliantRequirements = complianceResults.filter(r => r.status === 'non-compliant').length;
  const notAssessedRequirements = complianceResults.filter(r => r.status === 'not-assessed').length;

  const overallCompliancePercentage = Math.round((compliantRequirements / totalRequirements) * 100);

  const handleGenerateReport = async (format: 'doc' | 'pdf') => {
    if (!reportData.organizationName.trim()) {
      toast.error('Παρακαλώ εισάγετε το όνομα του οργανισμού');
      return;
    }

    const fullReportData: ComplianceReportData = {
      ...reportData,
      reportDate: new Date().toLocaleDateString('el-GR'),
      sections,
      complianceResults
    };

    try {
      if (format === 'doc') {
        await generateComplianceReportDOC(fullReportData);
        toast.success('Η αναφορά συμμόρφωσης σε DOC format δημιουργήθηκε επιτυχώς!');
      } else {
        generateComplianceReportPDF(fullReportData);
        toast.success('Η αναφορά συμμόρφωσης σε PDF format δημιουργήθηκε επιτυχώς!');
      }
      setIsDialogOpen(false);
    } catch (error) {
      toast.error(`Σφάλμα κατά τη δημιουργία της αναφοράς: ${error}`);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'compliant':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'partial':
        return <AlertTriangle className="h-4 w-4" />;
      case 'non-compliant':
        return <XCircle className="h-4 w-4" />;
      case 'not-assessed':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <Card className="p-6 bg-gradient-to-r from-primary/5 to-secondary/5 border-l-4 border-l-primary">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-lg bg-primary text-primary-foreground">
              <Shield className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-bold">Αναφορά Συμμόρφωσης Ν. 5160/2024</h2>
              <p className="text-muted-foreground">
                Παραγωγή επίσημων αναφορών συμμόρφωσης με την Οδηγία NIS2
              </p>
            </div>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-primary hover:bg-primary-hover">
                <Download className="h-4 w-4 mr-2" />
                Δημιουργία Αναφοράς
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle>Στοιχεία Αναφοράς Συμμόρφωσης</DialogTitle>
              </DialogHeader>
              
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="org-name">Όνομα Οργανισμού *</Label>
                  <Input
                    id="org-name"
                    value={reportData.organizationName}
                    onChange={(e) => setReportData(prev => ({ ...prev, organizationName: e.target.value }))}
                    placeholder="π.χ. ACME Corporation"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="period">Περίοδος Αξιολόγησης</Label>
                  <Input
                    id="period"
                    value={reportData.assessmentPeriod}
                    onChange={(e) => setReportData(prev => ({ ...prev, assessmentPeriod: e.target.value }))}
                    placeholder="π.χ. 2024"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="prepared-by">Συντάχθηκε από</Label>
                  <Input
                    id="prepared-by"
                    value={reportData.preparedBy}
                    onChange={(e) => setReportData(prev => ({ ...prev, preparedBy: e.target.value }))}
                    placeholder="π.χ. Ιωάννης Παπαδόπουλος, CISO"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="approved-by">Εγκρίθηκε από</Label>
                  <Input
                    id="approved-by"
                    value={reportData.approvedBy}
                    onChange={(e) => setReportData(prev => ({ ...prev, approvedBy: e.target.value }))}
                    placeholder="π.χ. Μαρία Γεωργίου, CEO"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <Button 
                  onClick={() => handleGenerateReport('doc')}
                  className="flex-1"
                  variant="outline"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  DOC
                </Button>
                <Button 
                  onClick={() => handleGenerateReport('pdf')}
                  className="flex-1"
                >
                  <FileText className="h-4 w-4 mr-2" />
                  PDF
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </Card>

      {/* Compliance Overview */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Συνολική Εικόνα Συμμόρφωσης</h3>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="text-center">
            <div className="text-2xl font-bold text-low-risk">{compliantRequirements}</div>
            <div className="text-sm text-muted-foreground">Συμμορφούμενος</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-medium-risk">{partialRequirements}</div>
            <div className="text-sm text-muted-foreground">Μερική Συμμόρφωση</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-high-risk">{nonCompliantRequirements}</div>
            <div className="text-sm text-muted-foreground">Μη Συμμορφούμενος</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-critical-risk">{notAssessedRequirements}</div>
            <div className="text-sm text-muted-foreground">Μη Αξιολογημένος</div>
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Συνολική Συμμόρφωση</span>
            <span className="font-medium">{overallCompliancePercentage}%</span>
          </div>
          <Progress value={overallCompliancePercentage} className="h-3" />
        </div>
      </Card>

      {/* Requirements Detail */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Ανάλυση Υποχρεώσεων Ν. 5160/2024</h3>
        
        <div className="space-y-4">
          {complianceResults.map((result, index) => {
            const requirement = nis2Requirements[index];
            const percentage = result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0;
            
            return (
              <div 
                key={requirement.id}
                className="border rounded-lg p-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <Badge 
                        className="text-white border-0"
                        style={{ backgroundColor: `hsl(var(--${complianceStatusColors[result.status]}))` }}
                      >
                        {getStatusIcon(result.status)}
                        {complianceStatusLabels[result.status]}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {requirement.category}
                      </Badge>
                    </div>
                    
                    <h4 className="font-medium mb-1">{requirement.title}</h4>
                    <p className="text-sm text-muted-foreground mb-2">
                      {requirement.legalReference}
                    </p>
                    <p className="text-sm mb-3">
                      {requirement.description}
                    </p>
                    
                    {result.gaps.length > 0 && (
                      <div className="text-sm">
                        <span className="font-medium text-destructive">Κυριότερα Κενά:</span>
                        <ul className="mt-1 ml-4 list-disc text-muted-foreground">
                          {result.gaps.slice(0, 3).map((gap, gapIndex) => (
                            <li key={gapIndex} className="text-xs">{gap}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  
                  <div className="text-right">
                    <div className="text-lg font-bold" style={{ color: `hsl(var(--${complianceStatusColors[result.status]}))` }}>
                      {percentage}%
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {result.score}/{result.maxScore} πόντοι
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </Card>

      {/* Info Card */}
      <Card className="p-4 bg-blue-50 border-blue-200">
        <div className="flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-blue-600 mt-0.5" />
          <div className="text-sm">
            <p className="font-medium text-blue-900 mb-1">Σημείωση για Ελέγχους Αρχών</p>
            <p className="text-blue-800">
              Οι παραγόμενες αναφορές συμμόρφωσης αποτελούν επίσημα έγγραφα που μπορούν να χρησιμοποιηθούν 
              ως στοιχεία τεκμηρίωσης της συμμόρφωσης με τον Ν. 5160/2024 κατά τη διάρκεια ελέγχων από τις αρμόδιες αρχές.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}