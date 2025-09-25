// NIS2 Directive Requirements based on Greek Law 5160/2024
// Κατάλογος βασικών υποχρεώσεων σύμφωνα με τον ν. 5160/2024

export interface NIS2Requirement {
  id: string;
  title: string;
  description: string;
  legalReference: string;
  mandatory: boolean;
  category: 'technical' | 'organizational' | 'governance' | 'operational';
  relatedQuestions: string[]; // Question IDs that relate to this requirement
}

export const nis2Requirements: NIS2Requirement[] = [
  {
    id: 'governance-1',
    title: 'Διορισμός Υπεύθυνου Ασφάλειας Συστημάτων Πληροφορικής και Επικοινωνιών (Υ.Α.Σ.Π.Ε.)',
    description: 'Ο οργανισμός υποχρεούται να ορίσει ένα αρμόδιο στέλεχός του, ανάλογων προσόντων και εμπειρογνωμοσύνης, ως Υπεύθυνο Ασφάλειας Συστημάτων Πληροφορικής και Επικοινωνιών.',
    legalReference: 'Άρθρο 15, παρ. 1α, ν. 5160/2024',
    mandatory: true,
    category: 'governance',
    relatedQuestions: ['1.2', '1.3']
  },
  {
    id: 'governance-2',
    title: 'Ενιαία Πολιτική Κυβερνοασφάλειας',
    description: 'Τήρηση ενιαίας πολιτικής κυβερνοασφάλειας που περιλαμβάνει το σύνολο των επιμέρους μέτρων, πολιτικών και διαδικασιών για τα ελάχιστα τεχνικά και οργανωτικά μέτρα συμμόρφωσης.',
    legalReference: 'Άρθρο 15, παρ. 1β, ν. 5160/2024',
    mandatory: true,
    category: 'governance',
    relatedQuestions: ['1.8', '1.9', '1.10']
  },
  {
    id: 'governance-3',
    title: 'Καταγραφή Πληροφοριακών και Επικοινωνιακών Αγαθών',
    description: 'Συνολική καταγραφή των υλικών και άυλων πληροφοριακών και επικοινωνιακών αγαθών, ιεραρχημένα βάσει της κρισιμότητάς τους.',
    legalReference: 'Άρθρο 15, παρ. 1γ, ν. 5160/2024',
    mandatory: true,
    category: 'organizational',
    relatedQuestions: ['2.1', '2.2']
  },
  {
    id: 'risk-1',
    title: 'Πολιτικές και Διαδικασίες Ανάλυσης Κινδύνου',
    description: 'Πολιτικές και διαδικασίες για την ανάλυση κινδύνου και την ασφάλεια των πληροφοριακών συστημάτων με ενίσχυση της λογοδοσίας του ανώτατου οργάνου διοίκησης.',
    legalReference: 'Άρθρο 16, παρ. 1α, ν. 5160/2024',
    mandatory: true,
    category: 'governance',
    relatedQuestions: ['1.14', '1.15', '1.16', '1.17', '1.18']
  },
  {
    id: 'incident-1',
    title: 'Διαχείριση Περιστατικών',
    description: 'Υλοποίηση διαδικασιών διαχείρισης περιστατικών κυβερνοασφάλειας.',
    legalReference: 'Άρθρο 16, παρ. 1β, ν. 5160/2024',
    mandatory: true,
    category: 'operational',
    relatedQuestions: ['18.1', '18.2', '18.3']
  },
  {
    id: 'continuity-1',
    title: 'Επιχειρησιακή Συνέχεια',
    description: 'Διαχείριση αντιγράφων ασφαλείας και αποκατάσταση έπειτα από καταστροφή, καθώς και διαχείριση των κρίσεων.',
    legalReference: 'Άρθρο 16, παρ. 1γ, ν. 5160/2024',
    mandatory: true,
    category: 'operational',
    relatedQuestions: ['17.1', '17.2', '17.3', '19.1', '19.2']
  },
  {
    id: 'supply-chain-1',
    title: 'Ασφάλεια Αλυσίδας Εφοδιασμού',
    description: 'Ασφάλεια της αλυσίδας εφοδιασμού, συμπεριλαμβανομένων των σχετικών με την ασφάλεια πτυχών που αφορούν τις σχέσεις μεταξύ κάθε οντότητας και των άμεσων προμηθευτών ή παρόχων υπηρεσιών της.',
    legalReference: 'Άρθρο 16, παρ. 1δ, ν. 5160/2024',
    mandatory: true,
    category: 'organizational',
    relatedQuestions: ['14.1', '14.2', '14.3']
  },
  {
    id: 'system-security-1',
    title: 'Ασφάλεια στην Απόκτηση, Ανάπτυξη και Συντήρηση Συστημάτων',
    description: 'Ασφάλεια στην απόκτηση, ανάπτυξη και συντήρηση συστημάτων δικτύου και πληροφοριακών συστημάτων, συμπεριλαμβανομένων του χειρισμού και της γνωστοποίησης ευπαθειών.',
    legalReference: 'Άρθρο 16, παρ. 1ε, ν. 5160/2024',
    mandatory: true,
    category: 'technical',
    relatedQuestions: ['3.1', '3.2', '4.1', '4.2']
  },
  {
    id: 'assessment-1',
    title: 'Αξιολόγηση Αποτελεσματικότητας Μέτρων',
    description: 'Πολιτικές και διαδικασίες για την αξιολόγηση της αποτελεσματικότητας των μέτρων διαχείρισης κινδύνων στον τομέα της κυβερνοασφάλειας.',
    legalReference: 'Άρθρο 16, παρ. 1στ, ν. 5160/2024',
    mandatory: true,
    category: 'governance',
    relatedQuestions: ['1.19', '1.20']
  },
  {
    id: 'training-1',
    title: 'Βασικές Πρακτικές Κυβερνοϋγιεινής και Κατάρτιση',
    description: 'Βασικές πρακτικές κυβερνοϋγιεινής και κατάρτιση στην κυβερνοασφάλεια.',
    legalReference: 'Άρθρο 16, παρ. 1ζ, ν. 5160/2024',
    mandatory: true,
    category: 'organizational',
    relatedQuestions: ['13.1', '13.2', '13.3']
  },
  {
    id: 'crypto-1',
    title: 'Πολιτικές Κρυπτογραφίας',
    description: 'Πολιτικές και διαδικασίες σχετικά με τη χρήση κρυπτογραφίας και, κατά περίπτωση, κρυπτογράφησης, σε συνεργασία με την εθνική αρχή CRYPTO, όπου απαιτείται.',
    legalReference: 'Άρθρο 16, παρ. 1η, ν. 5160/2024',
    mandatory: true,
    category: 'technical',
    relatedQuestions: ['12.1', '12.2', '12.3']
  },
  {
    id: 'hr-security-1',
    title: 'Ασφάλεια Ανθρώπινων Πόρων και Έλεγχος Πρόσβασης',
    description: 'Ασφάλεια ανθρώπινων πόρων, πολιτικές ελέγχου πρόσβασης και διαχείριση πάγιων στοιχείων.',
    legalReference: 'Άρθρο 16, παρ. 1θ, ν. 5160/2024',
    mandatory: true,
    category: 'organizational',
    relatedQuestions: ['5.1', '5.2', '5.9', '5.10', '5.11']
  },
  {
    id: 'mfa-1',
    title: 'Πολυπαραγοντική Επαλήθευση Ταυτότητας',
    description: 'Χρήση λύσεων πολυπαραγοντικής επαλήθευσης ταυτότητας ή συνεχούς επαλήθευσης ταυτότητας, ασφαλών φωνητικών επικοινωνιών, επικοινωνιών βίντεο και κειμένου και ασφαλών συστημάτων επικοινωνιών έκτακτης ανάγκης εντός της οντότητας.',
    legalReference: 'Άρθρο 16, παρ. 1ι, ν. 5160/2024',
    mandatory: true,
    category: 'technical',
    relatedQuestions: ['6.3', '6.4', '6.5', '6.9', '6.10']
  }
];

export interface ComplianceStatus {
  requirementId: string;
  status: 'compliant' | 'partial' | 'non-compliant' | 'not-assessed';
  score: number;
  maxScore: number;
  evidence: string[];
  gaps: string[];
  recommendations: string[];
}

export function calculateComplianceStatus(
  requirement: NIS2Requirement,
  sections: any[]
): ComplianceStatus {
  let totalScore = 0;
  let maxScore = 0;
  const evidence: string[] = [];
  const gaps: string[] = [];
  const recommendations: string[] = [];

  // Find related questions and calculate scores
  requirement.relatedQuestions.forEach(questionId => {
    sections.forEach(section => {
      const question = section.questions.find((q: any) => q.id === questionId);
      if (question) {
        const maxAnswerValue = question.isPolicyQuestion ? 4 : 3;
        maxScore += maxAnswerValue * question.weight;
        
        if (question.selectedAnswer !== undefined) {
          totalScore += question.selectedAnswer * question.weight;
          
          // Add evidence
          const selectedAnswer = question.answers.find((a: any) => a.value === question.selectedAnswer);
          if (selectedAnswer && question.selectedAnswer > 0) {
            evidence.push(`${questionId}: ${selectedAnswer.label}`);
          }
          
          // Identify gaps
          if (question.selectedAnswer < maxAnswerValue) {
            gaps.push(`${questionId}: ${question.question}`);
            
            // Add recommendations based on the gap
            if (question.selectedAnswer === 0) {
              recommendations.push(`Υλοποιήστε πλήρως: ${question.question}`);
            } else {
              recommendations.push(`Βελτιώστε την υλοποίηση: ${question.question}`);
            }
          }
        } else {
          gaps.push(`${questionId}: Δεν έχει απαντηθεί - ${question.question}`);
          recommendations.push(`Απαντήστε και υλοποιήστε: ${question.question}`);
        }
      }
    });
  });

  const percentage = maxScore > 0 ? (totalScore / maxScore) * 100 : 0;
  
  let status: 'compliant' | 'partial' | 'non-compliant' | 'not-assessed';
  if (percentage >= 90) {
    status = 'compliant';
  } else if (percentage >= 50) {
    status = 'partial';
  } else if (percentage > 0) {
    status = 'non-compliant';
  } else {
    status = 'not-assessed';
  }

  return {
    requirementId: requirement.id,
    status,
    score: totalScore,
    maxScore,
    evidence,
    gaps,
    recommendations
  };
}

export const complianceStatusLabels = {
  'compliant': 'Συμμορφούμενος',
  'partial': 'Μερική Συμμόρφωση',
  'non-compliant': 'Μη Συμμορφούμενος',
  'not-assessed': 'Μη Αξιολογημένος'
};

export const complianceStatusColors = {
  'compliant': 'low-risk',
  'partial': 'medium-risk', 
  'non-compliant': 'high-risk',
  'not-assessed': 'critical-risk'
};