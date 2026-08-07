export type HollandTrait = 'R' | 'I' | 'A' | 'S' | 'E' | 'C';

export interface RadarTraits {
  kiencuong: number;  // R - Realistic
  phantich: number;   // I - Investigative
  sangtao: number;    // A - Artistic
  camthong: number;   // S - Social
  lanhdao: number;    // E - Enterprising
  kyluat: number;     // C - Conventional
}

export interface Question {
  id: number;
  text: string;
  category: HollandTrait;
  categoryLabel: string;
}

export type CareerId = 'edtech' | 'healthcare' | 'education' | 'humanities' | 'science';

export interface CareerFloor {
  floorNumber: number;
  subMajorName: string;
  code: string;
  description: string;
  keySkills: string[];
  careerRole: string;
  moetMajorMatch: string;
}

export interface CareerInfo {
  id: CareerId;
  name: string;
  shortName: string;
  icon: string;
  hollandCode: string;
  subjects: string[];
  color: string;
  bgGradient: string;
  description: string;
  salaryJunior: string;
  salarySenior: string;
  roadmap: string[];
  topSchools: string[];
  ethicsTopic: string;
  floors?: CareerFloor[];
}

export interface TaskEvaluationResult {
  passed: boolean;
  score: number; // 0 - 100
  feedback: string;
  details?: string[];
}

export interface WeekTask {
  week: number;
  title: string;
  storyContext: string;
  ethicalDilemma?: string;
  taskType: 'code_test' | 'triage_station' | 'lesson_planner' | 'text_factcheck' | 'lab_experiment';
  taskData: any;
  traitBonus: Partial<RadarTraits>;
}

export interface WeeklyResult {
  week: number;
  careerId: CareerId;
  score: number;
  passed: boolean;
  userAnswer?: any;
  feedback: string;
  date: string;
  reflection?: string;
  traitsEarned: Partial<RadarTraits>;
}

export interface TraitHistoryItem {
  date: string;
  source: string;
  traitsAdded: Partial<RadarTraits>;
}

export interface TeacherState {
  trustMentor: number;        // 0-100, cô Lan tin tưởng
  reputation: number;         // 0-100, uy tín với Ban Giám Hiệu (Thầy Hùng)
  moraleDuc: number;          // 0-100, tinh thần em Đức
  moraleMinh: number;         // 0-100, tinh thần em Minh
  moraleHoa: number;          // 0-100, tinh thần em Hoa
  parentTrustDuc: number;     // 0-100, niềm tin phụ huynh em Đức
  classAtmosphere: number;    // 0-100, không khí lớp 10A3
  flags: string[];            // ví dụ: "style_friendly", "minh_helped_w2", "ethics_compromised"
}

export interface UserProgress {
  name: string;
  school: string;
  className: string;
  currentGate: 'welcome' | 'quiz_gate' | 'city_map' | 'internship' | 'certificate' | 'dashboard';
  quizScores: Record<HollandTrait, number>; // 0 - 40 each
  quizAnswers: Record<number, number>; // questionId -> 0-4
  quizCompleted: boolean;
  hollandCode: string;
  chosenCareer: CareerId | null;
  currentWeek: number; // 1 - 8
  weeklyResults: Record<string, WeeklyResult>; // key: `${careerId}_w${week}`
  reflections: Record<string, string>; // key: `${careerId}_w${week}`
  radarTraits: RadarTraits;
  badges: string[];
  reflectionPoints: number;
  traitHistory: TraitHistoryItem[];
  zodiacSign?: string;
  teacherState?: TeacherState;
}

export interface Settings {
  crtScanlines: boolean;
  retroSound: boolean;
  showZodiac: boolean;
  volume: number;
}

export interface SaveSlotSummary {
  playerName: string;
  school: string;
  className: string;
  gate: string;
  week: number;
  career: CareerId | null;
  hollandCode: string;
  totalScore: number;
  badgeCount: number;
  savedAt: string;
}

export interface SaveSlot {
  id: string;
  title: string;
  timestamp: string;
  progress: UserProgress;
  summary: SaveSlotSummary;
}

