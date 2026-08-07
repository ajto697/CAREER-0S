import React, { useState, useEffect } from 'react';
import { UserProgress, Settings } from '../types';
import { playSound } from '../utils/audio';
import { Sparkles, X, ChevronRight, HelpCircle, Save, Award, Search, BookOpen, Cpu, Terminal, Users, ShieldCheck, Gamepad2, Volume2, Sliders, CheckCircle2 } from 'lucide-react';

interface Props {
  progress: UserProgress;
  settings: Settings;
  onOpenSaveLoadModal?: () => void;
  onOpenDashboard?: () => void;
  onOpenMajorsModal?: () => void;
  onNavigateGate?: (gate: UserProgress['currentGate']) => void;
}

export const DogMascotGuide: React.FC<Props> = ({
  progress,
  settings,
  onOpenSaveLoadModal,
  onOpenDashboard,
  onOpenMajorsModal,
  onNavigateGate
}) => {
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [speechBubbleText, setSpeechBubbleText] = useState<string>('');
  const [showBubble, setShowBubble] = useState<boolean>(true);
  const [barkTick, setBarkTick] = useState<number>(0);

  // Wagging / Bark animation tick
  useEffect(() => {
    const interval = setInterval(() => {
      setBarkTick(prev => (prev + 1) % 100);
    }, 800);
    return () => clearInterval(interval);
  }, []);

  // Update contextual dialogue based on game state
  useEffect(() => {
    switch (progress.currentGate) {
      case 'welcome':
        setSpeechBubbleText('Gâu gâu! Tớ là Shiba Cyber Bot! Bấm BẮT ĐẦU HÀNH TRÌNH để làm trắc nghiệm RIASEC nhé!');
        break;
      case 'quiz':
        setSpeechBubbleText(`Gâu! Trắc nghiệm Holland (${Object.keys(progress.quizAnswers || {}).length}/36 câu). Hãy chọn chân thực nhất!`);
        break;
      case 'city_map':
        setSpeechBubbleText('Gâu gâu! Mã Holland của cậu là [' + progress.hollandCode + ']. Chọn 1 trong 5 ngành để vào Workspace!');
        break;
      case 'workspace':
        setSpeechBubbleText(`Gâu! Đang ở Tuần ${progress.currentWeek}/8. Hãy thao tác công cụ và bấm CHẠY MÔ PHỎNG để chấm điểm nhé!`);
        break;
      case 'certificate':
        setSpeechBubbleText('Gâu gâu! Xuất sắc quá! Cậu đã tốt nghiệp 8 tuần thực tập và nhận Bằng Tốt Nghiệp!');
        break;
      default:
        setSpeechBubbleText('Gâu gâu! Tớ là trợ lý Shiba, cần tớ hướng dẫn tính năng nào không?');
    }
  }, [progress.currentGate, progress.currentWeek, progress.hollandCode, progress.quizAnswers]);

  const featureGuides = [
    {
      id: 'quiz',
      category: 'start',
      title: '1. CỔNG A: TRẮC NGHIỆM HOLLAND (RIASEC)',
      icon: Terminal,
      summary: '36 câu hỏi trắc nghiệm đánh giá 6 nhóm tính cách nghề nghiệp chuẩn O*NET.',
      details: [
        'Truy cập Cổng A bằng cách bấm Bắt Đầu ở màn hình chào.',
        'Đánh giá từng câu hỏi theo thang điểm 1-5 (Không thích -> Rất thích).',
        'Hệ thống tự động phân tích và tính Mã Holland 3 ký tự (Ví dụ: IRS, SEC, RAE).'
      ],
      actionLabel: 'Đến Cổng Trắc Nghiệm',
      action: () => onNavigateGate?.('quiz')
    },
    {
      id: 'city_map',
      category: 'start',
      title: '2. CỔNG B: BẢN ĐỒ NGÀNH & CHỌN MÔ HÌNH THỰC TẬP',
      icon: Users,
      summary: 'Khám phá 5 tòa nhà thực tập chuyên sâu với lộ trình 8 tuần simulated.',
      details: [
        '5 Ngành thực tập: EdTech (Lập trình), Y Tế (Cấp cứu/Triage), Sư Phạm (Giáo viên 10A3), Báo Chí (Truyền thông), Sinh Học (Phòng Lab).',
        'Mỗi ngành có mentor hướng dẫn, tình huống đạo đức riêng và 8 tuần thử thách.',
        'Bạn có thể đổi ngành bất kỳ lúc nào từ Bản Đồ Thành Phố.'
      ],
      actionLabel: 'Mở Bản Đồ Thành Phố',
      action: () => onNavigateGate?.('city_map')
    },
    {
      id: 'workspace',
      category: 'gameplay',
      title: '3. KHU VỰC THỰC HÀNH WORKSPACE & TÌNH HUỐNG SỐNG ĐỘNG',
      icon: Cpu,
      summary: 'Mô phỏng công cụ thực chiến 8-bit và tình huống tương tác thực tế.',
      details: [
        'Đọc kỹ yêu cầu nhiệm vụ tuần và tình huống diễn biến từ SituationAnimator.',
        'Sử dụng công cụ chuyên ngành (Soạn code, Triage bệnh nhân, Soạn giáo án, Kiểm tra tin tức, Thí nghiệm).',
        'Điền Nhật ký phản tư (Reflection) để đổi thêm điểm thưởng SP.'
      ],
      actionLabel: 'Vào Workspace Tuần ' + progress.currentWeek,
      action: () => onNavigateGate?.('workspace')
    },
    {
      id: 'evaluation',
      category: 'gameplay',
      title: '4. CHẠY MÔ PHỎNG & AI CHẤM ĐIỂM TỰ ĐỘNG',
      icon: Sparkles,
      summary: 'Nút Chạy Test Case / Mô Phỏng giúp nhận ngay điểm và phản hồi Passed/Failed.',
      details: [
        'Sau khi hoàn thành bài làm trong Workspace, bấm nút "CHẠY MÔ PHỎNG".',
        'Nếu đạt tiêu chuẩn Passed, hệ thống sẽ cộng điểm vào 6 trục Radar Năng Lực.',
        'Nếu Failed, hãy đọc kỹ gợi ý từ Mentor và thử lại không giới hạn số lần!'
      ]
    },
    {
      id: 'saveload',
      category: 'system',
      title: '5. HỆ THỐNG LƯU & TẢI GAME (SAVE / LOAD SLOTS)',
      icon: Save,
      summary: 'Quản lý 5 Slot lưu game, Auto-Save tự động và Xuất/Nhập file `.JSON`.',
      details: [
        'Bấm nút LƯU / TẢI GAME trên thanh Navbar trên cùng.',
        'Hệ thống tự động Auto-Save sau mỗi màn chơi vào Slot Auto.',
        'Bạn có thể tự chọn Slot 1 - Slot 5 để lưu mốc quan trọng hoặc bấm "Xuất File Backup (.json)" để đem sang máy khác chơi tiếp.'
      ],
      actionLabel: 'Mở Bảng Save/Load',
      action: () => onOpenSaveLoadModal?.()
    },
    {
      id: 'dashboard',
      category: 'system',
      title: '6. BẢNG ĐIỀU KHIỂN GIÁO VIÊN (TEACHER DASHBOARD)',
      icon: ShieldCheck,
      summary: 'Theo dõi chỉ số học sinh, lịch sử thuộc tính và xuất báo cáo CSV.',
      details: [
        'Bấm biểu tượng BẢNG GIÁO VIÊN trên Navbar.',
        'Xem chi tiết điểm số 6 trục Radar, danh sách danh hiệu Badges đạt được.',
        'Xuất file dữ liệu CSV để nộp báo cáo thực tập cho thầy cô giáo hướng dẫn.'
      ],
      actionLabel: 'Mở Bảng Giáo Viên',
      action: () => onOpenDashboard?.()
    },
    {
      id: 'majors',
      category: 'utility',
      title: '7. TRA CỨU NGÀNH HỌC VIỆT NAM (HOLLAND HUB)',
      icon: BookOpen,
      summary: 'Tra cứu hàng trăm ngành đại học tại Việt Nam khớp với Mã Holland.',
      details: [
        'Bấm nút TRA CỨU NGÀNH HỌC trên Navbar.',
        'Lọc các ngành học theo mã RIASEC (Ví dụ: R, I, A, S, E, C).',
        'Xem điểm chuẩn, tổ hợp xét tuyển A00, B00, C00, D01 và cơ hội việc làm thực tế.'
      ],
      actionLabel: 'Mở Tra Cứu Ngành Học',
      action: () => onOpenMajorsModal?.()
    },
    {
      id: 'radar',
      category: 'utility',
      title: '8. SƠ ĐỒ RADAR 6 TRỤC & BẰNG TỐT NGHIỆP',
      icon: Award,
      summary: 'Sơ đồ năng lực 6 trục (Kiên cường, Phân tích, Sáng tạo, Cảm thông, Lãnh đạo, Kỷ luật).',
      details: [
        'Xem biểu đồ Radar trực quan cập nhật theo thời gian thực.',
        'Tích lũy đủ 8 tuần thực tập để mở khóa Chứng Chỉ Tốt Nghiệp Thực Tập chuyên nghiệp.',
        'Chứng chỉ có thể in ấn hoặc chia sẻ lên hồ sơ cá nhân.'
      ],
      actionLabel: 'Xem Chứng Chỉ (Nếu Tuần 8)',
      action: () => onNavigateGate?.('certificate')
    }
  ];

  const filteredGuides = activeCategory === 'all'
    ? featureGuides
    : featureGuides.filter(g => g.category === activeCategory);

  return (
    <>
      {/* FLOATING CORNER WIDGET: MASCOT DOG */}
      <div className="fixed bottom-4 right-4 z-40 flex items-end gap-2 font-mono select-none pointer-events-auto">
        
        {/* Dialogue Bubble */}
        {showBubble && (
          <div className="bg-[#000] border-2 border-[#00ff41] p-3 max-w-xs shadow-[0_0_20px_rgba(0,255,65,0.3)] relative animate-fade-in text-xs text-[#00ff41] space-y-1">
            <div className="flex items-center justify-between text-[10px] text-[#ff00ff] font-extrabold uppercase border-b border-[#00ff41]/30 pb-1">
              <span className="flex items-center gap-1">
                <span>🐕 SHIBA BOT (MASCOT)</span>
              </span>
              <button
                onClick={() => setShowBubble(false)}
                className="text-white/60 hover:text-white"
              >
                ✕
              </button>
            </div>

            <p className="text-white font-bold text-[11px] leading-snug">
              {speechBubbleText}
            </p>

            <button
              onClick={() => { playSound.click(settings.retroSound); setIsOpenModal(true); }}
              className="mt-1 w-full py-1 bg-[#00ff41] text-[#000] font-black text-[10px] uppercase hover:bg-[#00e53a] flex items-center justify-center gap-1"
            >
              <HelpCircle className="w-3 h-3" />
              <span>XEM HƯỚNG DẪN TẤT CẢ TÍNH NĂNG</span>
            </button>

            {/* Bubble Tail */}
            <div className="absolute -bottom-2 right-6 w-3 h-3 bg-[#000] border-r-2 border-b-2 border-[#00ff41] rotate-45"></div>
          </div>
        )}

        {/* Dog Avatar Trigger Button */}
        <button
          onClick={() => { playSound.click(settings.retroSound); setIsOpenModal(true); setShowBubble(true); }}
          className={`group relative p-2 bg-[#0c0c0c] border-2 border-[#00ff41] text-[#00ff41] shadow-[0_0_25px_rgba(0,255,65,0.4)] hover:bg-[#00ff41] hover:text-[#000] transition-all transform hover:scale-110 active:scale-95 ${
            barkTick % 2 === 0 ? '-translate-y-1' : 'translate-y-0'
          }`}
          title="Gọi Mascot Chó Hướng Dẫn"
        >
          {/* Animated Dog SVG Icon */}
          <div className="w-10 h-10 flex items-center justify-center text-2xl relative">
            <span>🐕</span>
            {/* Animated Status Pulse Dot */}
            <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-[#ff00ff] rounded-full border border-[#000] animate-ping" />
          </div>

          <span className="text-[9px] font-black uppercase block text-center mt-0.5 bg-[#00ff41] text-[#000] group-hover:bg-[#000] group-hover:text-[#00ff41] px-1 py-0.2">
            HELP BOT
          </span>
        </button>
      </div>

      {/* FULL FEATURE GUIDE MODAL BY MASCOT DOG */}
      {isOpenModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 font-mono text-[#00ff41] select-none">
          <div className="w-full max-w-4xl bg-[#080d08] border-4 border-[#00ff41] p-4 sm:p-6 space-y-5 shadow-[0_0_60px_rgba(0,255,65,0.3)] relative max-h-[92vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#00ff41] pb-3 gap-2">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-[#00ff41] text-[#000] font-black text-2xl flex items-center justify-center border-2 border-[#000] shrink-0">
                  🐕
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-base sm:text-lg font-black uppercase text-white tracking-wider">
                      CẨM NANG HƯỚNG DẪN CAREEROS V5
                    </h2>
                    <span className="bg-[#ff00ff] text-[#000] text-[10px] px-2 py-0.5 font-black uppercase">
                      MASCOT SHIBA GUIDANCE
                    </span>
                  </div>
                  <p className="text-xs text-[#00ff41]/80">
                    "Gâu gâu! Dưới đây là hướng dẫn chi tiết cách dùng tất cả tính năng trong game!"
                  </p>
                </div>
              </div>

              <button
                onClick={() => { playSound.click(settings.retroSound); setIsOpenModal(false); }}
                className="p-1.5 border-2 border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-[#000] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Category Filter Tabs */}
            <div className="flex flex-wrap items-center gap-2 border-b border-[#00ff41]/30 pb-2 text-xs font-bold">
              {[
                { id: 'all', label: 'TẤT CẢ TÍNH NĂNG (8)' },
                { id: 'start', label: 'CỔNG A & B (BẮT ĐẦU)' },
                { id: 'gameplay', label: 'WORKSPACE & MÔ PHỎNG' },
                { id: 'system', label: 'SAVE/LOAD & BẢNG GIÁO VIÊN' },
                { id: 'utility', label: 'TRA CỨU NGÀNH & RADAR' }
              ].map(cat => (
                <button
                  key={cat.id}
                  onClick={() => { playSound.click(settings.retroSound); setActiveCategory(cat.id); }}
                  className={`px-3 py-1.5 border text-xs font-black uppercase transition-all ${
                    activeCategory === cat.id
                      ? 'bg-[#00ff41] text-[#000] border-[#00ff41] shadow-[0_0_10px_#00ff41]'
                      : 'bg-[#000] text-[#00ff41] border-[#00ff41]/40 hover:border-[#00ff41]'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>

            {/* Feature Guides Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredGuides.map((guide) => {
                const IconComponent = guide.icon;
                return (
                  <div
                    key={guide.id}
                    className="bg-[#000] border-2 border-[#00ff41]/60 p-4 space-y-3 hover:border-[#00ff41] transition-all flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 border-b border-[#00ff41]/30 pb-2">
                        <span className="p-1.5 bg-[#00ff41] text-[#000] shrink-0 font-bold">
                          <IconComponent className="w-4 h-4" />
                        </span>
                        <h3 className="font-extrabold text-xs text-white uppercase leading-snug">
                          {guide.title}
                        </h3>
                      </div>

                      <p className="text-xs text-[#00ff41] font-bold">
                        {guide.summary}
                      </p>

                      <ul className="space-y-1.5 pt-1 text-[11px] text-white/90 list-disc list-inside">
                        {guide.details.map((detail, idx) => (
                          <li key={idx} className="leading-relaxed">
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>

                    {guide.actionLabel && guide.action && (
                      <div className="pt-2">
                        <button
                          onClick={() => {
                            playSound.click(settings.retroSound);
                            setIsOpenModal(false);
                            guide.action?.();
                          }}
                          className="w-full py-1.5 bg-[#00ff41]/20 hover:bg-[#00ff41] hover:text-[#000] text-[#00ff41] border border-[#00ff41] text-xs font-black uppercase flex items-center justify-center gap-1.5 transition-all"
                        >
                          <span>{guide.actionLabel}</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Mascot Tip Footer */}
            <div className="bg-[#111] border-2 border-[#ff00ff] p-3 flex items-center gap-3 text-xs">
              <span className="text-2xl shrink-0">🐶</span>
              <div className="space-y-0.5">
                <span className="text-[10px] font-black text-[#ff00ff] uppercase block">
                  MẸO TỪ SHIBA BOT:
                </span>
                <p className="text-white text-[11px] leading-relaxed">
                  Cậu có thể gọi tớ bất cứ lúc nào bằng cách bấm biểu tượng Chó 🐕 ở góc phải dưới màn hình. Chúc cậu thực tập may mắn và đạt điểm cao!
                </p>
              </div>
            </div>

            {/* Close Button */}
            <button
              onClick={() => { playSound.click(settings.retroSound); setIsOpenModal(false); }}
              className="w-full py-2.5 bg-[#00ff41] text-[#000] font-black text-xs uppercase hover:bg-[#00e53a] transition-all"
            >
              ĐÓNG CẨM NANG HƯỚNG DẪN
            </button>

          </div>
        </div>
      )}
    </>
  );
};
