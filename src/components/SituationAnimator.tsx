import React, { useState, useEffect } from 'react';
import { TeacherState, CareerId } from '../types';
import { 
  Sparkles, Smile, Frown, Meh, Users, MessageSquare, 
  ShieldCheck, Activity, Cpu, Stethoscope, Newspaper, FlaskConical, GraduationCap,
  AlertCircle, CheckCircle2
} from 'lucide-react';
import { PixelCharacterSprite, PixelShibaSprite } from './pixel/PixelArtSprites';
import { getIndustryMentor, getPeerColleagues, getNpcsForCareer } from '../data/npcGuidanceData';

interface Props {
  week: number;
  careerId: CareerId;
  teacherState?: TeacherState;
  isEvaluating?: boolean;
  onOpenNpcModal?: (npcId?: string) => void;
}

export const SituationAnimator: React.FC<Props> = ({
  week,
  careerId,
  teacherState = {
    trustMentor: 75,
    reputation: 80,
    moraleDuc: 50,
    moraleMinh: 50,
    moraleHoa: 75,
    parentTrustDuc: 60,
    classAtmosphere: 70,
    flags: []
  },
  isEvaluating = false,
  onOpenNpcModal
}) => {
  const [pulseTick, setPulseTick] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTick(prev => (prev + 1) % 100);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  const mentor = getIndustryMentor(careerId);
  const colleagues = getPeerColleagues(careerId);
  const allNpcs = getNpcsForCareer(careerId);
  const mainColleague = colleagues[0] || allNpcs.find(n => n.relationType === 'colleague') || allNpcs[1];
  const thirdNpc = allNpcs.find(n => n.relationType === 'beneficiary' || n.relationType === 'stakeholder') || colleagues[1] || allNpcs[2] || allNpcs[0];

  // Helper to get character mood emoji & badge based on score
  const getMoodBadge = (score: number) => {
    if (score >= 75) {
      return { 
        icon: <Smile className="w-3.5 h-3.5 text-[#00ff41]" />, 
        label: 'TỐT / TỰ TIN', 
        color: 'text-[#00ff41] border-[#00ff41]', 
        bg: 'bg-[#00ff41]/10',
        pixelMood: 'happy' as const
      };
    }
    if (score >= 50) {
      return { 
        icon: <Meh className="w-3.5 h-3.5 text-yellow-400" />, 
        label: 'TẬP TRUNG', 
        color: 'text-yellow-400 border-yellow-400', 
        bg: 'bg-yellow-400/10',
        pixelMood: 'idle' as const
      };
    }
    return { 
      icon: <Frown className="w-3.5 h-3.5 text-[#ff4444]" />, 
      label: 'CẦN HỖ TRỢ', 
      color: 'text-[#ff4444] border-[#ff4444]', 
      bg: 'bg-[#ff4444]/10',
      pixelMood: 'worried' as const
    };
  };

  // Career and Week specific situation narrative generator
  const getIndustrySituation = () => {
    switch (careerId) {
      case 'edtech':
        return {
          title: `TUẦN ${week}: EDTECH DEV HUB — KIỂM THỬ VÀ TỐI ƯU HỆ THỐNG`,
          icon: <Cpu className="w-4 h-4 text-cyan-400" />,
          eventDesc: week === 1 
            ? 'Phòng Kỹ thuật EduCore: Tech Lead Trần Vũ yêu cầu kiểm tra triệt để toán tử so sánh type coercion để bảo vệ học bạ 250.000 học sinh.'
            : week <= 4
            ? `Tuần ${week}: Junior Dev Nam đang gấp rút giải thuật tối ưu $O(N)$ và tích hợp bộ nhớ đệm cache.`
            : `Tuần ${week}: Nâng cao tường lửa bảo mật, vá lỗ hổng truy vấn và mở rộng gói tài nguyên cho học sinh vùng khó khăn.`,
          char1: {
            name: mentor?.name || 'Trần Vũ',
            role: 'TECH LEAD',
            sprite: mentor?.spriteType || 'tech_lead_vu',
            id: mentor?.id,
            mood: 'serious' as const,
            status: week <= 3 ? 'Đang duyệt Pull Request Clean Code' : 'Giám sát chịu tải 500k CCU',
            score: teacherState.trustMentor
          },
          char2: {
            name: mainColleague?.name || 'Hoàng Nam',
            role: 'JUNIOR FRONTEND',
            sprite: mainColleague?.spriteType || 'junior_dev_nam',
            id: mainColleague?.id,
            mood: (teacherState.trustMentor >= 60 ? 'happy' : 'worried') as any,
            status: week === 1 ? 'Đã đổi sang toán tử === an toàn' : 'Tối ưu bundle giảm độ trễ 3G',
            score: 70
          },
          char3: {
            name: thirdNpc?.name || 'Lê Thảo (QA)',
            role: thirdNpc?.role || 'QA AUDITOR',
            sprite: thirdNpc?.spriteType || 'student_hoa',
            id: thirdNpc?.id,
            mood: 'idle' as const,
            status: 'Kiểm thử 100% Edge Cases trên thiết bị cũ',
            score: 85
          }
        };

      case 'healthcare':
        return {
          title: `TUẦN ${week}: KHOA HỒI SỨC CẤP CỨU — PHÂN LOẠI TRIAGE & ĐIỀU TRỊ`,
          icon: <Stethoscope className="w-4 h-4 text-red-400" />,
          eventDesc: week === 1
            ? 'Phòng Cấp cứu tiếp nhận liên tục ca bệnh. Trưởng khoa Lê Trường yêu cầu phân loại Triage Đỏ/Vàng/Xanh đúng chuẩn sinh hiệu.'
            : week <= 4
            ? `Tuần ${week}: Thính chẩn phân biệt rales nổ, đo ECG phát hiện nhồi máu cơ tim trong khung giờ vàng can thiệp.`
            : `Tuần ${week}: Giữ vững y đức kê đơn thuốc BHYT hợp lý, bảo vệ quyền lợi và sinh mạng người bệnh nghèo.`,
          char1: {
            name: mentor?.name || 'BS. CKII Lê Trường',
            role: 'TRƯỞNG KHOA CẤP CỨU',
            sprite: mentor?.spriteType || 'doctor_truong',
            id: mentor?.id,
            mood: 'serious' as const,
            status: 'Giám sát thứ tự Triage Đỏ < 5 phút',
            score: teacherState.trustMentor
          },
          char2: {
            name: mainColleague?.name || 'ĐD. Mai',
            role: 'ĐIỀU DƯỠNG TRƯỞNG',
            sprite: mainColleague?.spriteType || 'nurse_mai',
            id: mainColleague?.id,
            mood: 'happy' as const,
            status: 'Quy tắc 5 Đúng khi dùng thuốc',
            score: 80
          },
          char3: {
            name: thirdNpc?.name || 'Bác Ba (Bệnh nhân)',
            role: 'CA CẤP CỨU',
            sprite: thirdNpc?.spriteType || 'student_minh',
            id: thirdNpc?.id,
            mood: (teacherState.trustMentor >= 60 ? 'happy' : 'idle') as any,
            status: 'Sinh hiệu SpO2 và huyết áp ổn định',
            score: 75
          }
        };

      case 'humanities':
        return {
          title: `TUẦN ${week}: TÒA SOẠN BÁO TIẾNG DÂN — KIỂM CHỨNG & ĐIỀU TRA`,
          icon: <Newspaper className="w-4 h-4 text-amber-400" />,
          eventDesc: week === 1
            ? 'Ban Thư ký Tòa soạn tiếp nhận tin đồn mạng xã hội. Tổng Biên tập Minh Thanh chỉ đạo kiểm chứng 2 nguồn độc lập trước khi đăng.'
            : week <= 4
            ? `Tuần ${week}: Phóng viên Hoàng Long phối hợp thu thập vi bằng, metadata hình ảnh và kiểm tra bản quyền số.`
            : `Tuần ${week}: Loạt bài điều tra bảo vệ lẽ phải, kiên quyết từ chối áp lực gỡ bài từ các nhóm lợi ích.`,
          char1: {
            name: mentor?.name || 'Nhà Báo Minh Thanh',
            role: 'TỔNG BIÊN TẬP',
            sprite: mentor?.spriteType || 'chief_editor_thanh',
            id: mentor?.id,
            mood: 'serious' as const,
            status: 'Duyệt bài theo chuẩn 2 nguồn độc lập',
            score: teacherState.trustMentor
          },
          char2: {
            name: mainColleague?.name || 'PV. Hoàng Long',
            role: 'PHÓNG VIÊN ĐIỀU TRA',
            sprite: mainColleague?.spriteType || 'reporter_long',
            id: mainColleague?.id,
            mood: 'idle' as const,
            status: 'Xác minh vi bằng & kiểm tra metadata',
            score: 75
          },
          char3: {
            name: thirdNpc?.name || 'Cô Thu (Nhân vật)',
            role: 'NHÂN VẬT THỰC ĐỊA',
            sprite: thirdNpc?.spriteType || 'student_hoa',
            id: thirdNpc?.id,
            mood: 'happy' as const,
            status: 'Minh bạch hóa đơn VietGAP 100%',
            score: 80
          }
        };

      case 'science':
        return {
          title: `TUẦN ${week}: PHÒNG THÍ NGHIỆM TRỌNG ĐIỂM — NGHIÊN CỨU & THỰC NGHIỆM`,
          icon: <FlaskConical className="w-4 h-4 text-purple-400" />,
          eventDesc: week === 1
            ? 'Viện Nghiên cứu Hóa Dược: GS. Trịnh Xuân Bách yêu cầu kiểm soát nhiệt độ chiết 65°C và tính toán hiệu suất Yield trung thực.'
            : week <= 4
            ? `Tuần ${week}: Nghiên cứu sinh Hà My vận hành máy quang phổ UV-Vis và FTIR, kiểm tra mẫu trắng trừ nền chuẩn xác.`
            : `Tuần ${week}: Thẩm định độc lập tính lặp lại (Reproducibility), hoàn thiện báo cáo khoa học xuất sắc.`,
          char1: {
            name: mentor?.name || 'GS. TS. Trịnh Xuân Bách',
            role: 'VIỆN TRƯỞNG',
            sprite: mentor?.spriteType || 'professor_trinh',
            id: mentor?.id,
            mood: 'serious' as const,
            status: 'Đảm bảo tính lặp lại thực nghiệm $\\ge 5$ lần',
            score: teacherState.trustMentor
          },
          char2: {
            name: mainColleague?.name || 'NCS. Hà My',
            role: 'NGHIÊN CỨU SINH',
            sprite: mainColleague?.spriteType || 'bio_scientist',
            id: mainColleague?.id,
            mood: 'happy' as const,
            status: 'Hiệu chuẩn đường chuẩn $R^2 > 0.999$',
            score: 85
          },
          char3: {
            name: thirdNpc?.name || 'KTV. Quốc Bảo',
            role: 'KỸ THUẬT VIÊN LAB',
            sprite: thirdNpc?.spriteType || 'student_duc',
            id: thirdNpc?.id,
            mood: 'idle' as const,
            status: 'Đạt chuẩn an toàn hóa chất BSL-3',
            score: 75
          }
        };

      case 'education':
      default:
        return {
          title: `TUẦN ${week}: LỚP SƯ PHẠM 10A3 — GIẢNG DẠY & ĐỒNG HÀNH`,
          icon: <GraduationCap className="w-4 h-4 text-emerald-400" />,
          eventDesc: week === 1
            ? 'Lớp 10A3 chào đón giáo sinh mới. Cô Lan dặn dò quan sát kỹ tâm lý từng em để thiết kế phương pháp dạy học phân hóa.'
            : week <= 4
            ? `Tuần ${week}: Tiếp sức cho em Minh tự tin phát biểu và điều hướng năng lượng sáng tạo của em Đức vào dự án nhóm.`
            : `Tuần ${week}: Giữ vững liêm chính sư phạm, hoàn thành hội giảng giữa kỳ và lễ tổng kết tri ân xúc động.`,
          char1: {
            name: mentor?.name || 'Cô Lan',
            role: 'GIÁO VIÊN HƯỚNG DẪN',
            sprite: mentor?.spriteType || 'teacher_lan',
            id: mentor?.id,
            mood: 'happy' as const,
            status: 'Phương pháp GDPT 2018 lấy học sinh làm trung tâm',
            score: teacherState.trustMentor
          },
          char2: {
            name: 'Em Đức',
            role: 'HỌC SINH NĂNG ĐỘNG',
            sprite: 'student_duc',
            id: 'npc_edu_duc',
            mood: (teacherState.moraleDuc >= 50 ? 'happy' : 'worried') as any,
            status: teacherState.moraleDuc >= 60 ? 'Tập trung sáng tạo poster bài học' : 'Cần đổi phương pháp trực quan',
            score: teacherState.moraleDuc
          },
          char3: {
            name: 'Em Minh',
            role: 'HỌC SINH RỤT RÈ',
            sprite: 'student_minh',
            id: 'npc_edu_minh',
            mood: (teacherState.moraleMinh >= 50 ? 'happy' : 'worried') as any,
            status: teacherState.moraleMinh >= 60 ? 'Tự tin xung phong phát biểu' : 'Cần câu hỏi gợi mở tiếp sức',
            score: teacherState.moraleMinh
          }
        };
    }
  };

  const situation = getIndustrySituation();

  return (
    <div className="bg-[#050905] border-2 border-[#00ff41] p-3 sm:p-4 space-y-3 font-mono text-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.15)] relative overflow-hidden pixelated">
      {/* Top Header Bar with Animated 8-Bit Pixel Pulse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#00ff41]/40 pb-2 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5">
            <PixelShibaSprite size={22} mood="happy" accessory="cyber_visor" />
            <span className="text-xs font-bold uppercase text-[#00ff41] tracking-wide flex items-center gap-1.5">
              <span>MÔ PHỎNG TUẦN {week} // ĐỘI NGŨ CHUYÊN MÔN</span>
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="bg-[#111] text-[#ff00ff] border border-[#ff00ff] px-2 py-0.5 font-bold flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff00ff] animate-ping" />
            8-BIT NPC ENGINE
          </span>
          {isEvaluating && (
            <span className="bg-[#00ff41] text-[#000] px-2 py-0.5 font-bold animate-pulse">
              ĐANG ĐÁNH GIÁ...
            </span>
          )}
        </div>
      </div>

      {/* Main Situation Banner */}
      <div className="bg-[#000] border-2 border-[#00ff41]/60 p-3 relative space-y-1.5">
        <div className="text-xs font-bold text-[#ff00ff] uppercase flex items-center gap-2">
          {situation.icon}
          <span>{situation.title}</span>
        </div>
        <p className="text-xs text-white/90 leading-relaxed font-mono">
          {situation.eventDesc}
        </p>
      </div>

      {/* 3 Dedicated Character Squad (Industry Mentor, Peer Colleague, Beneficiary/Stakeholder) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
        {/* CHARACTER 1: INDUSTRY MENTOR */}
        {(() => {
          const char = situation.char1;
          const mood = getMoodBadge(char.score);
          return (
            <div 
              onClick={() => onOpenNpcModal && onOpenNpcModal(char.id)}
              className={`p-2.5 border-2 ${mood.color} ${mood.bg} space-y-2 transition-all hover:scale-[1.02] cursor-pointer group shadow-sm`}
              title="Bấm để trao đổi trực tiếp với Mentor"
            >
              <div className="flex items-center justify-between border-b border-[#00ff41]/20 pb-1">
                <div className="flex items-center gap-1.5">
                  <PixelCharacterSprite character={char.sprite as any} size={34} mood={char.mood || mood.pixelMood} />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white group-hover:text-[#00ff41] transition-colors block">
                      {char.name}
                    </span>
                    <span className="text-[9px] text-[#38bdf8] font-bold block">
                      {char.role}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold border px-1.5 py-0.5 ${mood.color}`}>
                  {mood.icon}
                  <span>{char.score}%</span>
                </div>
              </div>
              <div className="text-[11px] text-white font-mono leading-tight bg-black/60 p-1.5 border border-white/10 flex items-center justify-between gap-1">
                <span className="truncate">{char.status}</span>
                <MessageSquare className="w-3 h-3 text-[#00ff41] shrink-0 opacity-80 group-hover:opacity-100" />
              </div>
            </div>
          );
        })()}

        {/* CHARACTER 2: PEER COLLEAGUE */}
        {(() => {
          const char = situation.char2;
          const mood = getMoodBadge(char.score);
          return (
            <div 
              onClick={() => onOpenNpcModal && onOpenNpcModal(char.id)}
              className={`p-2.5 border-2 ${mood.color} ${mood.bg} space-y-2 transition-all hover:scale-[1.02] cursor-pointer group shadow-sm`}
              title="Bấm để trao đổi trực tiếp với Đồng nghiệp"
            >
              <div className="flex items-center justify-between border-b border-[#00ff41]/20 pb-1">
                <div className="flex items-center gap-1.5">
                  <PixelCharacterSprite character={char.sprite as any} size={34} mood={char.mood || mood.pixelMood} />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white group-hover:text-[#00ff41] transition-colors block">
                      {char.name}
                    </span>
                    <span className="text-[9px] text-[#34d399] font-bold block">
                      {char.role}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold border px-1.5 py-0.5 ${mood.color}`}>
                  {mood.icon}
                  <span>{char.score}%</span>
                </div>
              </div>
              <div className="text-[11px] text-white font-mono leading-tight bg-black/60 p-1.5 border border-white/10 flex items-center justify-between gap-1">
                <span className="truncate">{char.status}</span>
                <MessageSquare className="w-3 h-3 text-[#34d399] shrink-0 opacity-80 group-hover:opacity-100" />
              </div>
            </div>
          );
        })()}

        {/* CHARACTER 3: BENEFICIARY / STAKEHOLDER */}
        {(() => {
          const char = situation.char3;
          const mood = getMoodBadge(char.score);
          return (
            <div 
              onClick={() => onOpenNpcModal && onOpenNpcModal(char.id)}
              className={`p-2.5 border-2 ${mood.color} ${mood.bg} space-y-2 transition-all hover:scale-[1.02] cursor-pointer group shadow-sm`}
              title="Bấm để xem phản hồi từ nhân vật"
            >
              <div className="flex items-center justify-between border-b border-[#00ff41]/20 pb-1">
                <div className="flex items-center gap-1.5">
                  <PixelCharacterSprite character={char.sprite as any} size={34} mood={char.mood || mood.pixelMood} />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-white group-hover:text-[#00ff41] transition-colors block">
                      {char.name}
                    </span>
                    <span className="text-[9px] text-[#fbbf24] font-bold block truncate max-w-[110px]">
                      {char.role}
                    </span>
                  </div>
                </div>
                <div className={`flex items-center gap-1 text-[10px] font-bold border px-1.5 py-0.5 ${mood.color}`}>
                  {mood.icon}
                  <span>{char.score}%</span>
                </div>
              </div>
              <div className="text-[11px] text-white font-mono leading-tight bg-black/60 p-1.5 border border-white/10 flex items-center justify-between gap-1">
                <span className="truncate">{char.status}</span>
                <MessageSquare className="w-3 h-3 text-[#fbbf24] shrink-0 opacity-80 group-hover:opacity-100" />
              </div>
            </div>
          );
        })()}
      </div>
    </div>
  );
};

