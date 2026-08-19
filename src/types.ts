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

export interface SoftwareState {
  systemStability: number;    // 0-100, Độ ổn định & Uptime của hệ thống EdTech
  techDebt: number;           // 0-100, Nợ kỹ thuật (càng cao càng dễ crash khi chịu tải lớn)
  teamMorale: number;         // 0-100, Tinh thần làm việc của team Dev & QA
  userTrust: number;          // 0-100, Niềm tin của học sinh & phụ huynh sử dụng ứng dụng
  productVelocity: number;    // 0-100, Tốc độ bàn giao tính năng trước áp lực deadline
  securityCompliance: number; // 0-100, Mức độ tuân thủ bảo mật & quyền riêng tư dữ liệu
  mentorTrustVu: number;      // 0-100, Lòng tin của Tech Lead Trần Vũ
  flags: string[];            // ví dụ: "architect_strict", "nam_overworked", "free_tier_protected"
}

export interface HealthcareState {
  patientSurvivalRate: number; // 0-100, Tỷ lệ an toàn & cứu sống bệnh nhân cấp cứu
  bedCapacity: number;         // 0-100, Mức độ chịu tải & kiểm soát quá tải giường bệnh
  staffBurnout: number;        // 0-100, Mức độ kiệt sức của kíp trực bác sĩ & điều dưỡng
  medicalEthics: number;       // 0-100, Chuẩn mực y đức & sự công bằng trong phân loại Triage
  diagnosticAccuracy: number;  // 0-100, Độ chính xác lâm sàng trong chẩn đoán & phác đồ
  hospitalReputation: number;  // 0-100, Uy tín của bệnh viện trước thân nhân & dư luận
  mentorTrustBacSiTruong: number; // 0-100, Lòng tin của Bác sĩ Trưởng khoa BS. Lê Hùng
  flags: string[];             // ví dụ: "triage_fair", "vip_rejected", "mai_overtime_supported"
}

export interface JournalismState {
  truthAccuracy: number;       // 0-100, Độ xác thực & chuẩn mực kiểm chứng đa nguồn tin
  publicImpact: number;        // 0-100, Sức lan tỏa & tầm ảnh hưởng xã hội của bài viết
  legalRisk: number;           // 0-100, Rủi ro pháp lý bản quyền & nguy cơ bị khởi kiện
  editorialIntegrity: number;  // 0-100, Liêm chính tòa soạn, kiên quyết chống giật gân/câu view
  sourceTrust: number;         // 0-100, Niềm tin & sự an toàn của mạng lưới người cung cấp tin mật
  sponsorPressure: number;     // 0-100, Áp lực thỏa hiệp từ nhãn hàng & nhà tài trợ lớn
  editorTrustThanh: number;    // 0-100, Lòng tin của Tổng biên tập Nhà báo Minh Thanh
  flags: string[];             // ví dụ: "source_protected", "clickbait_rejected", "thu_vindicated"
}

export interface ScienceState {
  dataIntegrity: number;       // 0-100, Liêm chính khoa học, tuyệt đối không xào nấu số liệu ngoại lai
  labSafety: number;           // 0-100, An toàn sinh học, kiểm soát rò rỉ hóa chất & cháy nổ
  yieldEfficiency: number;     // 0-100, Hiệu suất phản ứng & tỷ lệ thu hồi sản phẩm thí nghiệm
  grantFunding: number;        // 0-100, Tiến độ giải ngân & mức độ hài lòng của quỹ tài trợ quốc tế
  peerReviewTrust: number;     // 0-100, Uy tín học thuật trước hội đồng bình duyệt khoa học quốc tế
  samplePreservation: number;  // 0-100, Độ tinh sạch & điều kiện bảo quản mẫu vật quý hiếm
  mentorTrustGiaoSuTrinh: number; // 0-100, Lòng tin của GS. Đặng Quang Trình (Chủ nhiệm Viện)
  flags: string[];             // ví dụ: "repeat_reproduced", "waste_properly_disposed", "grant_honest"
}

export interface PixelAvatarConfig {
  gender: 'male' | 'female' | 'cyber';
  skinTone: 'fair' | 'tan' | 'warm' | 'dark' | 'cyber_neon' | 'golden';
  hairStyle: 'spiky' | 'side_part' | 'ponytail' | 'curly' | 'cyber_bob' | 'short_fade' | 'long_flow';
  hairColor: 'black' | 'brown' | 'blond' | 'red' | 'cyan' | 'magenta' | 'emerald' | 'silver';
  outfit: 
    | 'school_uniform' 
    | 'ao_dai_trad' 
    | 'ao_ba_ba' 
    | 'ao_doan_tn' 
    | 'hoc_sinh_khan_quang' 
    | 'viet_phuc_nhat_binh' 
    | 'ao_co_do_sao_vang' 
    | 'cyber_hoodie' 
    | 'doctor_scrubs' 
    | 'teacher_blazer' 
    | 'lab_coat' 
    | 'streetwear';
  outfitColor: 'green' | 'blue' | 'magenta' | 'yellow' | 'red' | 'slate' | 'white';
  accessory: 
    | 'none' 
    | 'glasses' 
    | 'cyber_visor' 
    | 'shades' 
    | 'mask' 
    | 'scouter' 
    | 'khan_ran_co';
  headgear: 
    | 'none' 
    | 'non_la' 
    | 'non_coi' 
    | 'man_truyen_thong' 
    | 'khan_ran_head' 
    | 'bang_ron_vietnam' 
    | 'grad_cap' 
    | 'headphones' 
    | 'cap_back' 
    | 'cat_ears' 
    | 'crown' 
    | 'beret';
  heldItem: 
    | 'none' 
    | 'banh_mi' 
    | 'ca_phe_phin' 
    | 'co_to_quoc' 
    | 'hoa_sen' 
    | 'but_vo_hongha' 
    | 'dan_bau' 
    | 'quat_mo' 
    | 'laptop' 
    | 'tablet' 
    | 'stethoscope' 
    | 'flask' 
    | 'certificate' 
    | 'coffee' 
    | 'gameboy';
  companion: 
    | 'none' 
    | 'trau_vang' 
    | 'cho_phu_quoc' 
    | 'meo_muop' 
    | 'chim_lac' 
    | 'shiba' 
    | 'drone' 
    | 'pixel_cat' 
    | 'robot_owl';
  title: string;
  expression: 'smile' | 'cool' | 'wink' | 'focus' | 'triumph';
}

export interface SkillTreeNode {
  id: string;
  name: string;
  shortName: string;
  iconName: string;
  tier: 1 | 2 | 3;
  cost: number;
  description: string;
  specialToolName: string;
  specialToolIcon: string;
  effectDescription: string;
  careerId: CareerId;
  prerequisites: string[]; // ids of required skills
}

// ==========================================
// NPC GUIDANCE SYSTEM INTERFACES
// ==========================================

export interface NpcDialogOption {
  question: string;
  answer: string;
  category: 'technical' | 'ethics' | 'workflow' | 'career_advice';
  statImpactHint?: string;
}

export interface NpcWeeklyAdvice {
  week: number;
  mood: 'idle' | 'happy' | 'thinking' | 'serious' | 'proud' | 'worried';
  dialogue: string;
  technicalTip: string;
  ethicsWarning: string;
  dialogOptions: NpcDialogOption[];
}

export interface BaseNpcProfile {
  id: string;
  name: string;
  role: string;
  department: string;
  careerId: CareerId;
  spriteType: string;
  relationType: 'mentor' | 'colleague' | 'stakeholder' | 'beneficiary';
  badgeColor: string;
  personality: string;
  signatureQuote: string;
  weeklyAdvice: Record<number, NpcWeeklyAdvice>;
  generalDialogs: NpcDialogOption[];
}

export interface IndustryMentor extends BaseNpcProfile {
  relationType: 'mentor';
  companyOrOrg: string;
  yearsExperience: number;
  mentorshipStyle: 'strict_standards' | 'supportive_coach' | 'academic_rigor' | 'ethical_guardian';
  specialty: string;
  evaluationFocus: string;
  keyAchievements: string[];
}

export interface PeerColleague extends BaseNpcProfile {
  relationType: 'colleague';
  colleagueType: 'senior_peer' | 'equal_peer' | 'cross_functional';
  collaborationStyle: string;
  friendshipBond: number; // 0 - 100
  supportTip: string;
  banterQuotes: string[];
}

export interface CareerNpcRoster {
  careerId: CareerId;
  mentor: IndustryMentor;
  colleagues: PeerColleague[];
  stakeholders?: BaseNpcProfile[];
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
  softwareState?: SoftwareState;
  healthcareState?: HealthcareState;
  journalismState?: JournalismState;
  scienceState?: ScienceState;
  customAvatar?: PixelAvatarConfig;
  skillPoints?: number; // Điểm Kỹ Năng (SP)
  unlockedSkills?: Record<CareerId, string[]>; // Danh sách skill ID đã mở khóa theo từng ngành
  equippedTool?: Record<CareerId, string>; // ID của công cụ chuyên dụng đang kích hoạt
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

