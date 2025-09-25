// Cybersecurity Assessment Data Structure
// Based on the Greek cybersecurity self-assessment tool

export interface Answer {
  value: number;
  label: string;
}

export interface Question {
  id: string;
  question: string;
  answers: Answer[];
  weight: number;
  isPolicyQuestion?: boolean;
  comments?: string;
  selectedAnswer?: number;
}

export interface Section {
  id: string;
  title: string;
  questions: Question[];
}

// Standard answers for most questions (0-3 points)
export const standardAnswers: Answer[] = [
  { value: 0, label: "Δεν απαντήθηκε" },
  { value: 0, label: "Όχι / Δεν υλοποιείται" },
  { value: 1, label: "Εν μέρει / Υλοποιείται σε κάποια συστήματα" },
  { value: 2, label: "Σε μεγάλο βαθμό / Υλοποιείται στα περισσότερα συστήματα" },
  { value: 3, label: "Ναι / Πλήρως / Υλοποιείται σε όλα τα συστήματα" }
];

// Policy-specific answers (0-4 points)
export const policyAnswers: Answer[] = [
  { value: 0, label: "Δεν απαντήθηκε" },
  { value: 0, label: "Δεν υπάρχει πολιτική ασφάλειας" },
  { value: 1, label: "Η πολιτική ασφάλειας ασκείται εμπειρικά" },
  { value: 2, label: "Υπάρχει μερικώς γραπτή πολιτική ασφάλειας" },
  { value: 3, label: "Υπάρχει γραπτή πολιτική ασφάλειας" },
  { value: 4, label: "Η πολιτική ασφάλειας είναι γραπτή και εγκεκριμένη" }
];

export const assessmentSections: Section[] = [
  {
    id: "governance",
    title: "1. Διοίκηση κυβερνοασφάλειας και διαχείριση επικινδυνότητας",
    questions: [
      {
        id: "1.1",
        question: "Ο Οργανισμός διαθέτει διακριτή οργανική μονάδα αρμόδια για την ασφάλεια των πληροφοριακών συστημάτων.",
        answers: standardAnswers,
        weight: 3
      },
      {
        id: "1.2",
        question: "Ο Οργανισμός έχει ορίσει στέλεχός του ως υπεύθυνο ασφάλειας πληροφοριακών συστημάτων (CISO), με βασικές αρμοδιότητες την παροχή στρατηγικού επιπέδου οδηγιών για θέματα κυβερνοασφάλειας.",
        answers: standardAnswers,
        weight: 3
      },
      {
        id: "1.3",
        question: "Ο Οργανισμός παρέχει στον CISO όλους τους απαραίτητους υλικοτεχνικούς, οικονομικούς και ανθρώπινους πόρους για την άσκηση των καθηκόντων του.",
        answers: standardAnswers,
        weight: 3
      },
      {
        id: "1.4",
        question: "Ο Οργανισμός έχει ορίσει πρόσωπο ως υπεύθυνο προστασίας δεδομένων (data protection officer), με σκοπό την εξασφάλιση επαρκούς προστασίας της ιδιωτικότητας.",
        answers: standardAnswers,
        weight: 1
      },
      {
        id: "1.5",
        question: "Ο Οργανισμός έχει εγκαθιδρύσει με ξεκάθαρο τρόπο ρόλους και ευθύνες όσον αφορά στην κυβερνοασφάλεια για το σύνολο του προσωπικού, καθώς και για τους προμηθευτές και παρόχους υπηρεσιών.",
        answers: standardAnswers,
        weight: 2
      },
      {
        id: "1.6",
        question: "Ο Οργανισμός δεσμεύει ποσό στον ετήσιο προϋπολογισμό του που αφορά αποκλειστικά στη διαχείριση και υλοποίηση έργων κυβερνοασφάλειας.",
        answers: standardAnswers,
        weight: 2
      },
      {
        id: "1.7",
        question: "Η οργανωτική προσέγγيση και διαχείριση των ζητημάτων κυβερνοασφάλειας υποστηρίζεται και καθοδηγείται ενεργά από το ανώτατο επίπεδο ηγεσίας του Οργανισμού.",
        answers: standardAnswers,
        weight: 2
      },
      {
        id: "1.8",
        question: "Ο Οργανισμός έχει εκπονήσει καταγεγραμμένη και εγκεκριμένη πολιτική ασφάλειας, η οποία περιγράφει τη διαχειριστική του προσέγγιση ως προς την ασφάλεια των συστημάτων δικτύου και πληροφοριών.",
        answers: policyAnswers,
        weight: 3,
        isPolicyQuestion: true
      },
      {
        id: "1.9",
        question: "Η πολιτική ασφάλειας του Οργανισμού έχει λάβει την έγκριση της ανώτατης διοίκησης.",
        answers: policyAnswers,
        weight: 3,
        isPolicyQuestion: true
      },
      {
        id: "1.10",
        question: "Η πολιτική ασφάλειας του Οργανισμού παραπέμπει και σε άλλες πολιτικές και διαδικασίες, οι οποίες εξειδικεύουν σε θεματικά πεδία τον τρόπο εφαρμογής τεχνικών και οργανωτικών μέτρων προστασίας.",
        answers: policyAnswers,
        weight: 3,
        isPolicyQuestion: true
      }
    ]
  },
  {
    id: "inventory",
    title: "2. Καταγραφή υλικού και λογισμικού",
    questions: [
      {
        id: "2.1",
        question: "Ο Οργανισμός τηρεί ενημερωμένο απογραφικό κατάλογο όλων των φυσικών συσκευών και συστημάτων εντός του δικτύου του.",
        answers: standardAnswers,
        weight: 3
      },
      {
        id: "2.2",
        question: "Ο Οργανισμός τηρεί ενημερωμένο απογραφικό κατάλογο όλων των εγκατεστημένων λογισμικών εφαρμογών.",
        answers: standardAnswers,
        weight: 3
      },
      {
        id: "2.3",
        question: "Ο Οργανισμός χρησιμοποιεί εργαλεία ανίχνευσης μη εξουσιοδοτημένου υλικού εντός του δικτύου του.",
        answers: standardAnswers,
        weight: 2
      },
      {
        id: "2.4",
        question: "Ο Οργανισμός χρησιμοποιεί εργαλεία ανίχνευσης μη εξουσιοδοτημένου λογισμικού.",
        answers: standardAnswers,
        weight: 2
      }
    ]
  },
  {
    id: "configuration",
    title: "3. Ασφαλής παραμετροποίηση εξοπλισμού και εφαρμογών",
    questions: [
      {
        id: "3.1",
        question: "Ο Οργανισμός εφαρμόζει σταθερές και ασφαλείς παραμετροποιήσεις (secure configuration standards) για λειτουργικά συστήματα και εφαρμογές λογισμικού.",
        answers: standardAnswers,
        weight: 3
      },
      {
        id: "3.2",
        question: "Ο Οργανισμός εφαρμόζει διαδικασίες διαχείρισης αλλαγών, που διασφαλίζουν ότι οι παραμετροποιήσεις ασφάλειας διατηρούνται σε περίπτωση αναβαθμίσεων ή αλλαγών στα συστήματα.",
        answers: policyAnswers,
        weight: 2,
        isPolicyQuestion: true
      }
    ]
  }
];

export interface RiskLevel {
  level: "critical" | "high" | "medium" | "low";
  label: string;
  color: string;
  minPercentage: number;
  maxPercentage: number;
}

export const riskLevels: RiskLevel[] = [
  {
    level: "critical",
    label: "Critical Risk",
    color: "critical-risk",
    minPercentage: 0,
    maxPercentage: 25
  },
  {
    level: "high",
    label: "High Risk", 
    color: "high-risk",
    minPercentage: 26,
    maxPercentage: 50
  },
  {
    level: "medium",
    label: "Medium Risk",
    color: "medium-risk", 
    minPercentage: 51,
    maxPercentage: 75
  },
  {
    level: "low",
    label: "Low Risk",
    color: "low-risk",
    minPercentage: 76,
    maxPercentage: 100
  }
];

export function getRiskLevel(percentage: number): RiskLevel {
  return riskLevels.find(risk => 
    percentage >= risk.minPercentage && percentage <= risk.maxPercentage
  ) || riskLevels[0];
}

export function calculateSectionScore(questions: Question[]): {
  currentScore: number;
  maxScore: number;
  percentage: number;
} {
  let currentScore = 0;
  let maxScore = 0;

  questions.forEach(question => {
    if (question.selectedAnswer !== undefined) {
      currentScore += question.selectedAnswer * question.weight;
    }
    const maxAnswerValue = question.isPolicyQuestion ? 4 : 3;
    maxScore += maxAnswerValue * question.weight;
  });

  const percentage = maxScore > 0 ? Math.round((currentScore / maxScore) * 100) : 0;

  return {
    currentScore,
    maxScore,
    percentage
  };
}