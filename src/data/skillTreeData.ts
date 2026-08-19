import { SkillTreeNode, CareerId } from '../types';

export const CAREER_SKILL_TREES: Record<CareerId, SkillTreeNode[]> = {
  // =========================================================================
  // 1. EDTECH / KỸ THUẬT PHẦN MỀM (Code Terminal & Developer Toolkit)
  // =========================================================================
  edtech: [
    {
      id: 'ide_linter',
      name: 'Trình Linter & Gợi ý Cú pháp',
      shortName: 'Linter Pro',
      iconName: 'Code',
      tier: 1,
      cost: 1,
      description: 'Hệ thống tự động phát hiện lỗi cú pháp và thiếu dấu ngoặc trước khi biên dịch.',
      specialToolName: 'Terminal Linter Pro',
      specialToolIcon: 'Bug',
      effectDescription: 'Mở khóa nút [Kiểm tra Cú pháp]: Tự động cảnh báo trước nếu có lỗi thiếu biến hay cú pháp sai.',
      careerId: 'edtech',
      prerequisites: []
    },
    {
      id: 'git_versioning',
      name: 'Hệ thống Nhánh Git & Khôi phục',
      shortName: 'Git Terminal',
      iconName: 'GitBranch',
      tier: 1,
      cost: 1,
      description: 'Quản lý lịch sử chỉnh sửa mã nguồn với các commit và branch an toàn.',
      specialToolName: 'Git Version Controller',
      specialToolIcon: 'GitFork',
      effectDescription: 'Cho phép khôi phục mã nguồn ban đầu hoặc tạo bản nháp thử nghiệm mà không mất tiến trình.',
      careerId: 'edtech',
      prerequisites: []
    },
    {
      id: 'ci_cd_pipeline',
      name: 'Đường ống Tự động CI/CD Cloud',
      shortName: 'Cloud CI/CD',
      iconName: 'Layers',
      tier: 2,
      cost: 2,
      description: 'Mô phỏng quy trình kiểm thử tự động trên cụm máy chủ phân tán.',
      specialToolName: 'Máy chủ Cloud Test Runner',
      specialToolIcon: 'Cpu',
      effectDescription: 'Hiển thị chi tiết thời gian thực thi (ms) và mức tiêu thụ RAM, tăng +15% điểm đánh giá code tối ưu.',
      careerId: 'edtech',
      prerequisites: ['ide_linter']
    },
    {
      id: 'debugger_ast',
      name: 'Máy Phân tích AST & Gỡ lỗi Sâu',
      shortName: 'AST Inspector',
      iconName: 'Search',
      tier: 2,
      cost: 2,
      description: 'Phân tích cây cú pháp trừu tượng (Abstract Syntax Tree) để phát hiện logic ngầm.',
      specialToolName: 'Trình Gỡ lỗi Sâu AST',
      specialToolIcon: 'Terminal',
      effectDescription: 'Ở các tuần 5-8: Tự động chỉ ra vị trí logic điều kiện sai sót trong bài toán.',
      careerId: 'edtech',
      prerequisites: ['git_versioning']
    },
    {
      id: 'ai_quantum_copilot',
      name: 'Siêu máy tính AI Quantum Copilot',
      shortName: 'AI Copilot',
      iconName: 'Sparkles',
      tier: 3,
      cost: 3,
      description: 'Hệ thống trợ lý lập trình lượng tử thông minh thế hệ mới nhất.',
      specialToolName: 'Siêu máy tính AI Copilot Pro',
      specialToolIcon: 'Zap',
      effectDescription: 'Mở khóa nút [Kích hoạt AI Copilot]: Hỗ trợ tự động giải thích thuật toán tối ưu và cộng +20 điểm đồ án tốt nghiệp Tuần 8!',
      careerId: 'edtech',
      prerequisites: ['ci_cd_pipeline', 'debugger_ast']
    }
  ],

  // =========================================================================
  // 2. HEALTHCARE / Y TẾ & CẤP CỨU (Hospital Triage & ICU Station)
  // =========================================================================
  healthcare: [
    {
      id: 'digital_stethoscope',
      name: 'Ống nghe Điện tử Khuếch đại Âm',
      shortName: 'Ống nghe Số',
      iconName: 'Stethoscope',
      tier: 1,
      cost: 1,
      description: 'Khuếch đại âm thanh nhịp tim và tiếng rên rít phế quản để chẩn đoán sơ bộ.',
      specialToolName: 'Ống nghe Digital Auscultation',
      specialToolIcon: 'HeartPulse',
      effectDescription: 'Tự động phát hiện nhịp tim nhanh (>120bpm) hoặc chậm (<60bpm) và cảnh báo bằng âm thanh.',
      careerId: 'healthcare',
      prerequisites: []
    },
    {
      id: 'pulse_oximeter_pro',
      name: 'Máy đo Nồng độ Oxy SpO2 Pro',
      shortName: 'SpO2 Monitor',
      iconName: 'Activity',
      tier: 1,
      cost: 1,
      description: 'Đo độ bão hòa oxy trong máu và hiển thị biểu đồ sóng Plethysmogram.',
      specialToolName: 'Máy đo SpO2 Cầm tay',
      specialToolIcon: 'Activity',
      effectDescription: 'Lập tức nhấp nháy viền đỏ cảnh báo khi bệnh nhân có chỉ số SpO2 nguy kịch (<90%).',
      careerId: 'healthcare',
      prerequisites: []
    },
    {
      id: 'auto_defibrillator_aed',
      name: 'Máy Khử rung tim Tự động AED',
      shortName: 'Máy Sốc điện AED',
      iconName: 'Zap',
      tier: 2,
      cost: 2,
      description: 'Hệ thống phân tích nhịp tim và phóng điện khử rung tự động khi có rung thất.',
      specialToolName: 'Trạm Sốc điện AED Di động',
      specialToolIcon: 'Zap',
      effectDescription: 'Ở các tuần 5-8: Cho phép kích hoạt sốc điện cấp cứu tức thì để ổn định bệnh nhân nguy kịch.',
      careerId: 'healthcare',
      prerequisites: ['digital_stethoscope']
    },
    {
      id: 'glasgow_coma_calculator',
      name: 'Thước đo Thần kinh Glasgow GCS',
      shortName: 'Thang GCS',
      iconName: 'ShieldAlert',
      tier: 2,
      cost: 2,
      description: 'Đánh giá mức độ tổn thương ý thức qua đáp ứng mắt, lời nói và vận động (3-15 điểm).',
      specialToolName: 'Bảng điện tử Glasgow Coma Scale',
      specialToolIcon: 'ShieldAlert',
      effectDescription: 'Hiển thị chính xác mức độ tổn thương não bộ, giảm 100% tỷ lệ phân loại sai ở ca tai biến và chấn thương.',
      careerId: 'healthcare',
      prerequisites: ['pulse_oximeter_pro']
    },
    {
      id: 'holo_icu_diagnostics',
      name: 'Trạm Hồi sức ICU Hologram & AI',
      shortName: 'Holo-ICU AI',
      iconName: 'Sparkles',
      tier: 3,
      cost: 3,
      description: 'Hệ sinh thái chẩn đoán hình ảnh Hologram 3D và gợi ý phác đồ cấp cứu thông minh.',
      specialToolName: 'Màn hình Holo-ICU Hologram',
      specialToolIcon: 'HeartPulse',
      effectDescription: 'Mở khóa nút [AI Phân tích Phác đồ]: Tự động gợi ý mức độ cấp cứu chuẩn và nhân đôi điểm Radar Y đức!',
      careerId: 'healthcare',
      prerequisites: ['auto_defibrillator_aed', 'glasgow_coma_calculator']
    }
  ],

  // =========================================================================
  // 3. EDUCATION / SƯ PHẠM & GIÁO DỤC (Classroom & Pedagogical Studio)
  // =========================================================================
  education: [
    {
      id: 'smart_whiteboard_4k',
      name: 'Bảng Tương tác Cảm ứng 4K',
      shortName: 'SmartBoard 4K',
      iconName: 'Tv',
      tier: 1,
      cost: 1,
      description: 'Hệ thống bảng trình chiếu thông minh tích hợp sơ đồ tư duy và video trực quan.',
      specialToolName: 'Bảng Cảm ứng SmartBoard 4K',
      specialToolIcon: 'Tv',
      effectDescription: 'Tăng +10 điểm Không khí Lớp học và hứng thú học tập của cả 3 học sinh ngay từ đầu tiết.',
      careerId: 'education',
      prerequisites: []
    },
    {
      id: 'gamified_quiz_clickers',
      name: 'Bộ Clicker Trắc nghiệm Game',
      shortName: 'Bộ Remote Clicker',
      iconName: 'Bookmark',
      tier: 1,
      cost: 1,
      description: 'Bộ remote tương tác cầm tay giúp 100% học sinh tham gia bỏ phiếu trả lời câu hỏi.',
      specialToolName: 'Bộ Remote Clicker Lớp học',
      specialToolIcon: 'CheckCircle2',
      effectDescription: 'Thu hút em Minh và em Đức xung phong tham gia phát biểu trong hoạt động Khởi động.',
      careerId: 'education',
      prerequisites: []
    },
    {
      id: 'student_psychology_dossier',
      name: 'Hồ sơ Tâm lý Sư phạm Chuyên sâu',
      shortName: 'Sổ Tâm lý AI',
      iconName: 'Users',
      tier: 2,
      cost: 2,
      description: 'Phân tích hồ sơ tâm lý gia đình và diễn biến cảm xúc của từng học sinh cá biệt.',
      specialToolName: 'Sổ tay Tâm lý Học đường AI',
      specialToolIcon: 'Heart',
      effectDescription: 'Ở tuần 5-8: Mở khóa các tùy chọn can thiệp sư phạm nhạy bén, tăng mạnh tinh thần em Minh & Đức.',
      careerId: 'education',
      prerequisites: ['smart_whiteboard_4k']
    },
    {
      id: 'parent_zalo_bridge',
      name: 'Cổng Trao đổi Trực tuyến Phụ huynh',
      shortName: 'Kênh Phụ Huynh',
      iconName: 'Mail',
      tier: 2,
      cost: 2,
      description: 'Kênh liên lạc sư phạm 2 chiều giúp gắn kết chặt chẽ giữa nhà trường và phụ huynh.',
      specialToolName: 'Kênh Liên lạc Sư phạm Trực tiếp',
      specialToolIcon: 'MessageSquare',
      effectDescription: 'Tăng +20 điểm Niềm tin Phụ huynh của em Đức và em Hoa, hóa giải áp lực nâng điểm trái quy chế.',
      careerId: 'education',
      prerequisites: ['gamified_quiz_clickers']
    },
    {
      id: 'vr_metaverse_classroom',
      name: 'Phòng học Thực tế ảo VR 3D',
      shortName: 'Kính VR Giáo dục',
      iconName: 'Sparkles',
      tier: 3,
      cost: 3,
      description: 'Không gian học tập không biên giới đưa học sinh thám hiểm thực tế ảo sinh động.',
      specialToolName: 'Kính VR Giáo dục 3D Metaverse',
      specialToolIcon: 'GraduationCap',
      effectDescription: 'Mở khóa kịch bản [Bài giảng Metaverse 3D]: Hóa giải 100% nguy cơ bỏ học của em Đức ở tuần 7 và mở khóa kết cục vinh danh Nhà Giáo Xuất Sắc!',
      careerId: 'education',
      prerequisites: ['student_psychology_dossier', 'parent_zalo_bridge']
    }
  ],

  // =========================================================================
  // 4. HUMANITIES / BÁO CHÍ & TRUYỀN THÔNG (Newsroom & Fact-Checker Desk)
  // =========================================================================
  humanities: [
    {
      id: 'press_badge_mic',
      name: 'Micro Phóng viên & Lọc ồn Chuyên dụng',
      shortName: 'Mic Studio Pro',
      iconName: 'Mic',
      tier: 1,
      cost: 1,
      description: 'Ghi âm phát biểu và phỏng vấn trực tiếp hiện trường với độ chân thực tuyệt đối.',
      specialToolName: 'Máy ghi âm Studio Pro',
      specialToolIcon: 'FileText',
      effectDescription: 'Thu thập trích dẫn chính xác, loại bỏ 100% nguy cơ trích dẫn sai lời phỏng vấn.',
      careerId: 'humanities',
      prerequisites: []
    },
    {
      id: 'dslr_telephoto_lens',
      name: 'Máy ảnh Báo chí Ống kính Tele',
      shortName: 'Máy ảnh Báo chí',
      iconName: 'Camera',
      tier: 1,
      cost: 1,
      description: 'Ghi lại các khoảnh khắc tư liệu phóng sự chân thực sắc nét.',
      specialToolName: 'Máy ảnh Báo chí Chuyên dụng',
      specialToolIcon: 'Search',
      effectDescription: 'Tăng +15 điểm Phong thái Tác nghiệp và uy tín tòa soạn đối với độc giả.',
      careerId: 'humanities',
      prerequisites: []
    },
    {
      id: 'osint_cross_verifier',
      name: 'Radar Dữ liệu Nguồn mở OSINT',
      shortName: 'Radar OSINT',
      iconName: 'Globe',
      tier: 2,
      cost: 2,
      description: 'Tự động đối chiếu thông tin với cơ sở dữ liệu Bộ GD&ĐT, UNESCO và Viện Thống kê.',
      specialToolName: 'Hệ thống OSINT Fact-Check Engine',
      specialToolIcon: 'ShieldCheck',
      effectDescription: 'Ở các tuần 5-8: Tự động gắn cờ 1 câu phát biểu ngụy biện hoặc tin giả trôi nổi.',
      careerId: 'humanities',
      prerequisites: ['press_badge_mic']
    },
    {
      id: 'sentiment_bias_scanner',
      name: 'Trình Quét Định kiến & Câu view',
      shortName: 'Quét Định kiến',
      iconName: 'AlertTriangle',
      tier: 2,
      cost: 2,
      description: 'Phát hiện các từ ngữ mang tính xúc phạm, phóng đại giật gân hoặc thương mại hóa nỗi đau.',
      specialToolName: 'Trình quét Định kiến Văn bản',
      specialToolIcon: 'Edit3',
      effectDescription: 'Cảnh báo từ ngữ câu view độc hại, bảo vệ quyền riêng tư và danh dự của nhân vật bài viết.',
      careerId: 'humanities',
      prerequisites: ['dslr_telephoto_lens']
    },
    {
      id: 'satellite_broadcast_van',
      name: 'Trạm Vệ tinh Phát sóng Báo chí 4K',
      shortName: 'Trạm Vệ tinh 4K',
      iconName: 'Sparkles',
      tier: 3,
      cost: 3,
      description: 'Hệ thống truyền dẫn tin tức vệ tinh trực tiếp tới hàng triệu độc giả toàn quốc.',
      specialToolName: 'Trạm Vệ tinh Phát sóng Báo chí',
      specialToolIcon: 'Newspaper',
      effectDescription: 'Mở khóa nút [Xuất bản Độc quyền Toàn quốc]: Đạt điểm Niềm Tin Độc Giả tuyệt đối 100% và nhận huy hiệu Nhà Báo Xuất Sắc!',
      careerId: 'humanities',
      prerequisites: ['osint_cross_verifier', 'sentiment_bias_scanner']
    }
  ],

  // =========================================================================
  // 5. NATURAL SCIENCE / KHOA HỌC & LAB SINH HÓA (Lab Simulation & Reactor)
  // =========================================================================
  science: [
    {
      id: 'micro_pipette_precision',
      name: 'Pipet Vi lượng Điện tử',
      shortName: 'Pipet Điện tử',
      iconName: 'TestTube',
      tier: 1,
      cost: 1,
      description: 'Định lượng dung tích hóa chất với độ chính xác đến từng micro-lít (µL).',
      specialToolName: 'Pipet Định lượng Điện tử',
      specialToolIcon: 'TestTube',
      effectDescription: 'Tăng độ nhạy điều chỉnh thông số, giảm 50% sai số nồng độ dung tích.',
      careerId: 'science',
      prerequisites: []
    },
    {
      id: 'safety_ppe_suit',
      name: 'Bộ Đồ Bảo hộ Phòng Lab Cấp độ 3',
      shortName: 'Bộ Đồ PPE Cấp 3',
      iconName: 'ShieldCheck',
      tier: 1,
      cost: 1,
      description: 'Găng tay chịu hóa chất, kính chống giọt bắn và mặt nạ lọc độc tiêu chuẩn quốc tế.',
      specialToolName: 'Bộ Bảo hộ Phòng thí nghiệm',
      specialToolIcon: 'ShieldAlert',
      effectDescription: 'Bảo vệ an toàn 100%, tự động vô hiệu hóa nguy cơ tai nạn trào hóa chất trong phòng thí nghiệm.',
      careerId: 'science',
      prerequisites: []
    },
    {
      id: 'ftir_spectrometer',
      name: 'Máy Quang phổ Hồng ngoại FTIR',
      shortName: 'Quang phổ FTIR',
      iconName: 'Activity',
      tier: 2,
      cost: 2,
      description: 'Nhận diện liên kết hóa học và cấu trúc phân tử thông qua phổ hấp thụ hồng ngoại.',
      specialToolName: 'Máy Quang phổ FTIR Phân tử',
      specialToolIcon: 'Activity',
      effectDescription: 'Hiển thị đường cong hiệu suất thời gian thực, giúp canh đúng điểm tối ưu 90-100% cực kỳ dễ dàng.',
      careerId: 'science',
      prerequisites: ['micro_pipette_precision']
    },
    {
      id: 'magnetic_chiller_stirrer',
      name: 'Bếp Khuấy từ Điều nhiệt Kỹ thuật số',
      shortName: 'Bếp Khuấy từ',
      iconName: 'Thermometer',
      tier: 2,
      cost: 2,
      description: 'Kiểm soát nhiệt độ và tốc độ xoáy từ trường không tạo bọt khí hỗn loạn.',
      specialToolName: 'Bếp Khuấy từ Kỹ thuật số',
      specialToolIcon: 'Thermometer',
      effectDescription: 'Ở các tuần 5-8: Giữ nhiệt độ và áp suất ổn định, ngăn chặn hiện tượng trào bọt nổ dung dịch.',
      careerId: 'science',
      prerequisites: ['safety_ppe_suit']
    },
    {
      id: 'ai_bioreactor_nanolab',
      name: 'Trạm Bioreactor AI Tự hành',
      shortName: 'Lò Phản ứng AI',
      iconName: 'Sparkles',
      tier: 3,
      cost: 3,
      description: 'Lò phản ứng sinh học công nghệ nano tự động cân bằng các biến số vật lý & sinh hóa.',
      specialToolName: 'Trạm Bioreactor AI Tự hành',
      specialToolIcon: 'FlaskConical',
      effectDescription: 'Mở khóa nút [Tự động Ổn định Quang phổ]: Mở rộng biên độ an toàn phản ứng thêm 20%, đảm bảo 100% thành công đồ án tốt nghiệp Tuần 8!',
      careerId: 'science',
      prerequisites: ['ftir_spectrometer', 'magnetic_chiller_stirrer']
    }
  ]
};

export function getSkillTreeForCareer(careerId: CareerId): SkillTreeNode[] {
  return CAREER_SKILL_TREES[careerId] || CAREER_SKILL_TREES.edtech;
}

export function getUnlockedSkillsForCareer(unlockedSkills: Record<CareerId, string[]> | undefined, careerId: CareerId): string[] {
  if (!unlockedSkills || !unlockedSkills[careerId]) {
    return [];
  }
  return unlockedSkills[careerId];
}
