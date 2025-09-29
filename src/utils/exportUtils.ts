import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Section, calculateSectionScore, getRiskLevel } from '@/data/fullAssessmentData';

export function exportToExcel(sections: Section[]) {
  // Create workbook
  const workbook = XLSX.utils.book_new();
  
  // Main data sheet
  const worksheetData: any[][] = [];
  
  // Header
  worksheetData.push([
    'Θεματική Ενότητα',
    'Α/Α', 
    'Ερώτηση',
    'Απάντηση',
    'Πόντοι',
    'Βαρύτητα',
    'Σκορ',
    'Παρατηρήσεις'
  ]);
  
  sections.forEach(section => {
    section.questions.forEach(question => {
      const selectedAnswer = question.answers.find(a => a.value === question.selectedAnswer);
      const score = question.selectedAnswer !== undefined ? question.selectedAnswer * question.weight : 0;
      
      worksheetData.push([
        section.title,
        question.id,
        question.question,
        selectedAnswer?.label || 'Δεν απαντήθηκε',
        question.selectedAnswer || 0,
        question.weight,
        score,
        question.comments || ''
      ]);
    });
  });
  
  const worksheet = XLSX.utils.aoa_to_sheet(worksheetData);
  
  // Set column widths
  worksheet['!cols'] = [
    { width: 40 }, // Section title
    { width: 8 },  // ID
    { width: 80 }, // Question
    { width: 30 }, // Answer
    { width: 8 },  // Points
    { width: 10 }, // Weight
    { width: 8 },  // Score
    { width: 40 }  // Comments
  ];
  
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Αποτελέσματα');
  
  // Summary sheet
  const summaryData: any[][] = [];
  summaryData.push(['Περίληψη Αποτελεσμάτων']);
  summaryData.push([]);
  summaryData.push(['Θεματική Ενότητα', 'Τρέχον Σκορ', 'Μέγιστο Σκορ', 'Ποσοστό (%)', 'Επίπεδο Κινδύνου']);
  
  let totalCurrentScore = 0;
  let totalMaxScore = 0;
  
  sections.forEach(section => {
    const { currentScore, maxScore, percentage } = calculateSectionScore(section.questions);
    const riskLevel = getRiskLevel(percentage);
    
    totalCurrentScore += currentScore;
    totalMaxScore += maxScore;
    
    summaryData.push([
      section.title,
      currentScore,
      maxScore,
      percentage,
      riskLevel.label
    ]);
  });
  
  summaryData.push([]);
  const overallPercentage = totalMaxScore > 0 ? Math.round((totalCurrentScore / totalMaxScore) * 100) : 0;
  const overallRisk = getRiskLevel(overallPercentage);
  
  summaryData.push([
    'ΣΥΝΟΛΙΚΟ',
    totalCurrentScore,
    totalMaxScore,
    overallPercentage,
    overallRisk.label
  ]);
  
  const summarySheet = XLSX.utils.aoa_to_sheet(summaryData);
  summarySheet['!cols'] = [
    { width: 40 },
    { width: 15 },
    { width: 15 },
    { width: 12 },
    { width: 20 }
  ];
  
  XLSX.utils.book_append_sheet(workbook, summarySheet, 'Περίληψη');
  
  // Generate and download
  const fileName = `Cybersecurity_Assessment_${new Date().toISOString().split('T')[0]}.xlsx`;
  XLSX.writeFile(workbook, fileName);
}

export async function exportToPDF(sections: Section[]) {
  const pdf = new jsPDF('p', 'mm', 'a4');
  
  // Add Greek font support
  pdf.setDocumentProperties({
    creator: 'Cybersecurity Assessment Tool',
    subject: 'Αποτελέσματα Αξιολόγησης Κυβερνοασφάλειας'
  });
  
  const pageWidth = pdf.internal.pageSize.getWidth();
  const margin = 20;
  let yPosition = margin;
  
  // Helper function to add text with word wrapping and Greek support
  const addText = (text: string, x: number, y: number, maxWidth: number, fontSize = 10) => {
    pdf.setFontSize(fontSize);
    // Use 'helvetica' for better Greek character support
    pdf.setFont('helvetica', 'normal');
    
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
  
  // Title
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Αποτελέσματα Αξιολόγησης Κυβερνοασφάλειας', pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 15;
  
  // Date
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Ημερομηνία: ${new Date().toLocaleDateString('el-GR')}`, pageWidth / 2, yPosition, { align: 'center' });
  yPosition += 20;
  
  // Overall summary
  let totalCurrentScore = 0;
  let totalMaxScore = 0;
  
  sections.forEach(section => {
    const { currentScore, maxScore } = calculateSectionScore(section.questions);
    totalCurrentScore += currentScore;
    totalMaxScore += maxScore;
  });
  
  const overallPercentage = totalMaxScore > 0 ? Math.round((totalCurrentScore / totalMaxScore) * 100) : 0;
  const overallRisk = getRiskLevel(overallPercentage);
  
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Συνολικό Επίπεδο Ασφάλειας', margin, yPosition);
  yPosition += 10;
  
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Συνολική Βαθμολογία: ${overallPercentage}%`, margin, yPosition);
  yPosition += 5;
  pdf.text(`Επίπεδο Κινδύνου: ${overallRisk.label}`, margin, yPosition);
  yPosition += 15;
  
  // Section details
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Ανάλυση ανά Θεματική Ενότητα', margin, yPosition);
  yPosition += 10;
  
  sections.forEach((section) => {
    const { currentScore, maxScore, percentage } = calculateSectionScore(section.questions);
    const riskLevel = getRiskLevel(percentage);
    
    if (yPosition > pdf.internal.pageSize.getHeight() - 40) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'bold');
    yPosition = addText(section.title, margin, yPosition, pageWidth - 2 * margin, 12);
    
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Βαθμολογία: ${percentage}% (${currentScore}/${maxScore})`, margin + 5, yPosition);
    yPosition += 5;
    pdf.text(`Επίπεδο Κινδύνου: ${riskLevel.label}`, margin + 5, yPosition);
    yPosition += 10;
  });
  
  // Questions and answers
  pdf.addPage();
  yPosition = margin;
  
  pdf.setFontSize(16);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Αναλυτικές Απαντήσεις', margin, yPosition);
  yPosition += 15;
  
  sections.forEach((section) => {
    if (yPosition > pdf.internal.pageSize.getHeight() - 30) {
      pdf.addPage();
      yPosition = margin;
    }
    
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    yPosition = addText(section.title, margin, yPosition, pageWidth - 2 * margin, 14);
    yPosition += 5;
    
    section.questions.forEach((question) => {
      if (yPosition > pdf.internal.pageSize.getHeight() - 50) {
        pdf.addPage();
        yPosition = margin;
      }
      
      const selectedAnswer = question.answers.find(a => a.value === question.selectedAnswer);
      const score = question.selectedAnswer !== undefined ? question.selectedAnswer * question.weight : 0;
      
      pdf.setFontSize(10);
      pdf.setFont('helvetica', 'bold');
      pdf.text(`${question.id}:`, margin + 5, yPosition);
      yPosition += 5;
      
      pdf.setFont('helvetica', 'normal');
      yPosition = addText(question.question, margin + 5, yPosition, pageWidth - 2 * margin - 10, 10);
      
      pdf.setFont('helvetica', 'italic');
      pdf.text(`Απάντηση: ${selectedAnswer?.label || 'Δεν απαντήθηκε'} (${score} πόντοι)`, margin + 5, yPosition);
      yPosition += 5;
      
      if (question.comments) {
        pdf.text(`Παρατηρήσεις: ${question.comments}`, margin + 5, yPosition);
        yPosition += 5;
      }
      
      yPosition += 3;
    });
    
    yPosition += 5;
  });
  
  // Save the PDF
  const fileName = `Cybersecurity_Assessment_${new Date().toISOString().split('T')[0]}.pdf`;
  pdf.save(fileName);
}

export async function exportDashboardToPDF(elementId: string) {
  const element = document.getElementById(elementId);
  if (!element) return;
  
  try {
    const canvas = await html2canvas(element, {
      scale: 2,
      useCORS: true,
      allowTaint: true
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    
    const imgWidth = 210;
    const pageHeight = 295;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    let heightLeft = imgHeight;
    let position = 0;
    
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;
    
    while (heightLeft >= 0) {
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }
    
    const fileName = `Cybersecurity_Dashboard_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
  } catch (error) {
    console.error('Error exporting dashboard to PDF:', error);
  }
}