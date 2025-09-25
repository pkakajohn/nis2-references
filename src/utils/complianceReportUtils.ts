import { Document, Packer, Paragraph, HeadingLevel, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';
import jsPDF from 'jspdf';
import { Section, calculateSectionScore, getRiskLevel } from '@/data/assessmentData';
import { nis2Requirements, calculateComplianceStatus, complianceStatusLabels, NIS2Requirement, ComplianceStatus } from '@/data/nis2Requirements';

export interface ComplianceReportData {
  organizationName: string;
  reportDate: string;
  assessmentPeriod: string;
  preparedBy: string;
  approvedBy: string;
  sections: Section[];
  complianceResults: ComplianceStatus[];
}

export async function generateComplianceReportDOC(reportData: ComplianceReportData) {
  const { organizationName, reportDate, assessmentPeriod, preparedBy, approvedBy, sections, complianceResults } = reportData;
  
  // Calculate overall statistics
  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = sections.reduce((sum, section) => 
    sum + section.questions.filter(q => q.selectedAnswer !== undefined).length, 0
  );
  
  let totalCurrentScore = 0;
  let totalMaxScore = 0;
  
  sections.forEach(section => {
    const { currentScore, maxScore } = calculateSectionScore(section.questions);
    totalCurrentScore += currentScore;
    totalMaxScore += maxScore;
  });
  
  const overallPercentage = totalMaxScore > 0 ? Math.round((totalCurrentScore / totalMaxScore) * 100) : 0;
  const overallRisk = getRiskLevel(overallPercentage);

  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Title Page
        new Paragraph({
          text: "ΑΝΑΦΟΡΑ ΣΥΜΜΟΡΦΩΣΗΣ",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "ΚΥΒΕΡΝΟΑΣΦΑΛΕΙΑΣ",
          heading: HeadingLevel.TITLE,
          alignment: AlignmentType.CENTER,
          spacing: { after: 400 }
        }),
        new Paragraph({
          text: "Σύμφωνα με τον Ν. 5160/2024",
          heading: HeadingLevel.HEADING_2,
          alignment: AlignmentType.CENTER,
          spacing: { after: 600 }
        }),
        
        // Organization Info
        new Paragraph({
          children: [
            new TextRun({ text: "Οργανισμός: ", bold: true }),
            new TextRun({ text: organizationName })
          ],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Ημερομηνία Αναφοράς: ", bold: true }),
            new TextRun({ text: reportDate })
          ],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Περίοδος Αξιολόγησης: ", bold: true }),
            new TextRun({ text: assessmentPeriod })
          ],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Συντάχθηκε από: ", bold: true }),
            new TextRun({ text: preparedBy })
          ],
          spacing: { after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "Εγκρίθηκε από: ", bold: true }),
            new TextRun({ text: approvedBy })
          ],
          spacing: { after: 400 }
        }),

        // Executive Summary
        new Paragraph({
          text: "ΣΥΝΟΠΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),
        new Paragraph({
          text: `Η παρούσα αναφορά παρουσιάζει τα αποτελέσματα της αυτοαξιολόγησης κυβερνοασφάλειας του οργανισμού σύμφωνα με τις απαιτήσεις του Ν. 5160/2024 για την εφαρμογή της Οδηγίας NIS2.`,
          spacing: { after: 200 }
        }),
        
        // Key Metrics
        new Paragraph({
          text: "ΒΑΣΙΚΟΙ ΔΕΙΚΤΕΣ:",
          heading: HeadingLevel.HEADING_2,
          spacing: { before: 300, after: 200 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Συνολική Βαθμολογία: ", bold: true }),
            new TextRun({ text: `${overallPercentage}% (${totalCurrentScore}/${totalMaxScore} πόντοι)` })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Επίπεδο Κινδύνου: ", bold: true }),
            new TextRun({ text: overallRisk.label })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Απαντημένες Ερωτήσεις: ", bold: true }),
            new TextRun({ text: `${answeredQuestions}/${totalQuestions} (${Math.round((answeredQuestions/totalQuestions)*100)}%)` })
          ],
          spacing: { after: 100 }
        }),
        new Paragraph({
          children: [
            new TextRun({ text: "• Θεματικές Ενότητες: ", bold: true }),
            new TextRun({ text: `${sections.length}` })
          ],
          spacing: { after: 300 }
        }),

        // Compliance Summary
        new Paragraph({
          text: "ΣΥΝΟΨΗ ΣΥΜΜΟΡΦΩΣΗΣ ΜΕ ΤΟΝ Ν. 5160/2024",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),

        ...complianceResults.map(result => {
          const requirement = nis2Requirements.find(req => req.id === result.requirementId)!;
          const percentage = result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0;
          
          return [
            new Paragraph({
              text: requirement.title,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Νομική Αναφορά: ", bold: true }),
                new TextRun({ text: requirement.legalReference })
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Κατάσταση Συμμόρφωσης: ", bold: true }),
                new TextRun({ text: complianceStatusLabels[result.status] })
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Βαθμολογία: ", bold: true }),
                new TextRun({ text: `${percentage}% (${result.score}/${result.maxScore} πόντοι)` })
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: "Περιγραφή:",
              spacing: { after: 100 }
            }),
            new Paragraph({
              text: requirement.description,
              spacing: { after: 200 }
            }),
            ...(result.evidence.length > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: "Στοιχεία Συμμόρφωσης:", bold: true })],
                spacing: { after: 100 }
              }),
              ...result.evidence.map(evidence => 
                new Paragraph({
                  text: `• ${evidence}`,
                  spacing: { after: 50 }
                })
              )
            ] : []),
            ...(result.gaps.length > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: "Εντοπισμένα Κενά:", bold: true })],
                spacing: { after: 100 }
              }),
              ...result.gaps.slice(0, 5).map(gap => 
                new Paragraph({
                  text: `• ${gap}`,
                  spacing: { after: 50 }
                })
              )
            ] : []),
            ...(result.recommendations.length > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: "Συστάσεις:", bold: true })],
                spacing: { after: 100 }
              }),
              ...result.recommendations.slice(0, 3).map(rec => 
                new Paragraph({
                  text: `• ${rec}`,
                  spacing: { after: 50 }
                })
              )
            ] : [])
          ];
        }).flat(),

        // Section Analysis
        new Paragraph({
          text: "ΑΝΑΛΥΣΗ ΑΝΑ ΘΕΜΑΤΙΚΗ ΕΝΟΤΗΤΑ",
          heading: HeadingLevel.HEADING_1,
          spacing: { before: 400, after: 200 }
        }),

        ...sections.map(section => {
          const { currentScore, maxScore, percentage } = calculateSectionScore(section.questions);
          const riskLevel = getRiskLevel(percentage);
          const answeredInSection = section.questions.filter(q => q.selectedAnswer !== undefined).length;
          
          return [
            new Paragraph({
              text: section.title,
              heading: HeadingLevel.HEADING_2,
              spacing: { before: 300, after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Βαθμολογία: ", bold: true }),
                new TextRun({ text: `${percentage}% (${currentScore}/${maxScore} πόντοι)` })
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Επίπεδο Κινδύνου: ", bold: true }),
                new TextRun({ text: riskLevel.label })
              ],
              spacing: { after: 100 }
            }),
            new Paragraph({
              children: [
                new TextRun({ text: "Απαντημένες Ερωτήσεις: ", bold: true }),
                new TextRun({ text: `${answeredInSection}/${section.questions.length}` })
              ],
              spacing: { after: 200 }
            })
          ];
        }).flat(),

        // Footer
        new Paragraph({
          text: "Η παρούσα αναφορά συντάχθηκε βάσει των απαντήσεων στο εργαλείο αυτοαξιολόγησης κυβερνοασφάλειας και αποτελεί εσωτερικό έγγραφο του οργανισμού για σκοπούς αξιολόγησης της συμμόρφωσης με τον Ν. 5160/2024.",
          spacing: { before: 400 },
          alignment: AlignmentType.JUSTIFIED
        })
      ]
    }]
  });

  const buffer = await Packer.toBuffer(doc);
  const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Αναφορα_Συμμορφωσης_Κυβερνοασφαλειας_${reportData.reportDate.replace(/\//g, '-')}.docx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

export function generateComplianceReportPDF(reportData: ComplianceReportData) {
  const { organizationName, reportDate, assessmentPeriod, preparedBy, approvedBy, sections, complianceResults } = reportData;
  
  const pdf = new jsPDF('p', 'mm', 'a4');
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;

  // Helper function to add text with word wrapping
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10, isBold = false) => {
    pdf.setFontSize(fontSize);
    pdf.setFont('helvetica', isBold ? 'bold' : 'normal');
    const lines = pdf.splitTextToSize(text, maxWidth);
    
    lines.forEach((line: string, index: number) => {
      if (y + (index * 5) > pdf.internal.pageSize.getHeight() - margin) {
        pdf.addPage();
        y = margin;
      }
      pdf.text(line, x, y + (index * 5));
    });
    
    return y + (lines.length * 5) + 5;
  };

  // Check if new page needed
  const checkNewPage = (neededHeight: number) => {
    if (yPosition + neededHeight > pdf.internal.pageSize.getHeight() - margin) {
      pdf.addPage();
      yPosition = margin;
    }
  };

  // Title Page
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ΑΝΑΦΟΡΑ ΣΥΜΜΟΡΦΩΣΗΣ ΚΥΒΕΡΝΟΑΣΦΑΛΕΙΑΣ', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  
  pdf.setFontSize(14);
  pdf.text('Σύμφωνα με τον Ν. 5160/2024', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;

  // Organization details
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  yPosition = addText(`Οργανισμός: ${organizationName}`, margin, yPosition, pageWidth - 2 * margin, 12);
  yPosition = addText(`Ημερομηνία Αναφοράς: ${reportDate}`, margin, yPosition, pageWidth - 2 * margin, 12);
  yPosition = addText(`Περίοδος Αξιολόγησης: ${assessmentPeriod}`, margin, yPosition, pageWidth - 2 * margin, 12);
  yPosition = addText(`Συντάχθηκε από: ${preparedBy}`, margin, yPosition, pageWidth - 2 * margin, 12);
  yPosition = addText(`Εγκρίθηκε από: ${approvedBy}`, margin, yPosition, pageWidth - 2 * margin, 12);
  yPosition += 10;

  // Executive Summary
  checkNewPage(30);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ΣΥΝΟΠΤΙΚΗ ΠΑΡΟΥΣΙΑΣΗ', margin, yPosition);
  yPosition += 10;

  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  yPosition = addText(
    'Η παρούσα αναφορά παρουσιάζει τα αποτελέσματα της αυτοαξιολόγησης κυβερνοασφάλειας του οργανισμού σύμφωνα με τις απαιτήσεις του Ν. 5160/2024 για την εφαρμογή της Οδηγίας NIS2.',
    margin, yPosition, pageWidth - 2 * margin, 12
  );

  // Calculate overall statistics
  const totalQuestions = sections.reduce((sum, section) => sum + section.questions.length, 0);
  const answeredQuestions = sections.reduce((sum, section) => 
    sum + section.questions.filter(q => q.selectedAnswer !== undefined).length, 0
  );
  
  let totalCurrentScore = 0;
  let totalMaxScore = 0;
  
  sections.forEach(section => {
    const { currentScore, maxScore } = calculateSectionScore(section.questions);
    totalCurrentScore += currentScore;
    totalMaxScore += maxScore;
  });
  
  const overallPercentage = totalMaxScore > 0 ? Math.round((totalCurrentScore / totalMaxScore) * 100) : 0;
  const overallRisk = getRiskLevel(overallPercentage);

  // Key metrics
  yPosition += 5;
  pdf.setFont('helvetica', 'bold');
  pdf.text('ΒΑΣΙΚΟΙ ΔΕΙΚΤΕΣ:', margin, yPosition);
  yPosition += 7;
  
  pdf.setFont('helvetica', 'normal');
  yPosition = addText(`• Συνολική Βαθμολογία: ${overallPercentage}% (${totalCurrentScore}/${totalMaxScore} πόντοι)`, margin, yPosition, pageWidth - 2 * margin);
  yPosition = addText(`• Επίπεδο Κινδύνου: ${overallRisk.label}`, margin, yPosition, pageWidth - 2 * margin);
  yPosition = addText(`• Απαντημένες Ερωτήσεις: ${answeredQuestions}/${totalQuestions} (${Math.round((answeredQuestions/totalQuestions)*100)}%)`, margin, yPosition, pageWidth - 2 * margin);
  yPosition = addText(`• Θεματικές Ενότητες: ${sections.length}`, margin, yPosition, pageWidth - 2 * margin);

  // Compliance results
  yPosition += 10;
  checkNewPage(20);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ΣΥΝΟΨΗ ΣΥΜΜΟΡΦΩΣΗΣ ΜΕ ΤΟΝ Ν. 5160/2024', margin, yPosition);
  yPosition += 15;

  complianceResults.forEach(result => {
    const requirement = nis2Requirements.find(req => req.id === result.requirementId)!;
    const percentage = result.maxScore > 0 ? Math.round((result.score / result.maxScore) * 100) : 0;
    
    checkNewPage(40);
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    yPosition = addText(requirement.title, margin, yPosition, pageWidth - 2 * margin, 14, true);
    
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    yPosition = addText(`Νομική Αναφορά: ${requirement.legalReference}`, margin, yPosition, pageWidth - 2 * margin, 10);
    yPosition = addText(`Κατάσταση: ${complianceStatusLabels[result.status]} (${percentage}%)`, margin, yPosition, pageWidth - 2 * margin, 10);
    
    if (result.gaps.length > 0) {
      yPosition = addText(`Κυριότερα Κενά: ${result.gaps.slice(0, 2).join('; ')}`, margin, yPosition, pageWidth - 2 * margin, 10);
    }
    
    yPosition += 5;
  });

  // Section analysis summary
  checkNewPage(30);
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ΣΥΝΟΨΗ ΑΝΑΛΥΣΗΣ ΑΝΑ ΕΝΟΤΗΤΑ', margin, yPosition);
  yPosition += 15;

  sections.forEach(section => {
    const { currentScore, maxScore, percentage } = calculateSectionScore(section.questions);
    const riskLevel = getRiskLevel(percentage);
    
    checkNewPage(15);
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    yPosition = addText(section.title, margin, yPosition, pageWidth - 2 * margin, 12, true);
    
    pdf.setFont('helvetica', 'normal');
    yPosition = addText(`Βαθμολογία: ${percentage}% - ${riskLevel.label}`, margin + 5, yPosition, pageWidth - 2 * margin - 5, 10);
    yPosition += 3;
  });

  // Footer
  checkNewPage(20);
  yPosition += 10;
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'italic');
  yPosition = addText(
    'Η παρούσα αναφορά συντάχθηκε βάσει των απαντήσεων στο εργαλείο αυτοαξιολόγησης κυβερνοασφάλειας και αποτελεί εσωτερικό έγγραφο του οργανισμού για σκοπούς αξιολόγησης της συμμόρφωσης με τον Ν. 5160/2024.',
    margin, yPosition, pageWidth - 2 * margin, 10
  );

  // Save the PDF
  const fileName = `Αναφορα_Συμμορφωσης_Κυβερνοασφαλειας_${reportDate.replace(/\//g, '-')}.pdf`;
  pdf.save(fileName);
}