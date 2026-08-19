import React from 'react';
import { TeacherState } from '../types';
import { Sparkles, Heart, Shield, Users, AlertTriangle, GraduationCap, UserCheck, Award, MessageSquare } from 'lucide-react';
import { PixelCharacterSprite, PixelShibaSprite } from './pixel/PixelArtSprites';

interface Props {
  week: number;
  teacherState: TeacherState;
  selectedStyle?: 'friendly' | 'strict' | 'balanced';
  isEvaluating?: boolean;
  minhLeaderAssigned?: boolean;
}

export const ClassroomAnimationScene: React.FC<Props> = ({
  week,
  teacherState,
  selectedStyle = 'balanced',
  isEvaluating = false,
  minhLeaderAssigned = false
}) => {
  // Get week-specific scene configuration
  const getSceneConfig = () => {
    switch (week) {
      case 1:
        return {
          title: 'TUẦN 1: RA MẮT LỚP 10A3 — THPT NGUYỄN TRÃI',
          boardText: 'KÍNH CHÀO CÔ LAN MENTOR & TẬP THỂ LỚP 10A3',
          teacherDialogue: `Xin chào cả lớp! Thầy/cô rất vui được đồng hành cùng 10A3 trong 8 tuần thực tập. Phong cách chủ nhiệm: ${selectedStyle.toUpperCase()}.`,
          mentorDialogue: 'Cô Lan: "Hãy chú ý giữ nhịp lớp học và quan sát tâm lý các em ngay từ tuần đầu."',
          ducStatus: 'Tò mò, đang bấm điện thoại dưới gầm bàn',
          minhStatus: 'Khép kín, chưa dám ngẩng mặt giao tiếp',
          hoaStatus: 'Ghi chép bài đầy đủ, chăm chỉ',
          bgColor: 'from-[#061a0b] to-[#0d0d0d]'
        };
      case 2:
        return {
          title: 'TUẦN 2: KẾ HOẠCH HỖ TRỢ TÂM LÝ EM MINH',
          boardText: 'CHUYÊN ĐỀ HỌC TẬP — HỖ TRỢ TỰ TIN PHÁT BIỂU',
          teacherDialogue: 'Minh ơi, thầy/cô thấy ý kiến của em rất hay. Em sẵn sàng chia sẻ cho cả nhóm cùng nghe nhé!',
          mentorDialogue: 'Cô Lan: "Phương pháp tiếp cận nhẹ nhàng của em đã giúp Minh bớt căng thẳng đấy."',
          ducStatus: 'Quan sát thầy/cô nói chuyện với Minh',
          minhStatus: teacherState.moraleMinh >= 55 ? 'Đã gật đầu, mỉm cười nhẹ giơ tay' : 'Vẫn rụt rè, tay ôm chặt quyển vở',
          hoaStatus: 'Tích cực làm bài tập cá nhân',
          bgColor: 'from-[#0d1b2a] to-[#0d0d0d]'
        };
      case 3:
        return {
          title: 'TUẦN 3: XỬ LÝ VI PHẠM KỶ LUẬT & EM ĐỨC',
          boardText: 'SỔ LIÊN LẠC ĐIỆN TỬ & QUY TẮC LỚP HỌC 10A3',
          teacherDialogue: 'Thầy/cô sẽ gửi thư trao đổi riêng với Bố Đức để cùng phối hợp động viên em.',
          mentorDialogue: 'Cô Lan: "Cần giữ thái độ sư phạm chuẩn mực, không trách phạt tiêu cực trước mặt lớp."',
          ducStatus: teacherState.moraleDuc >= 55 ? 'Đã cất tai nghe, tập trung nghe giảng' : 'Đeo tai nghe, xếp máy bay giấy',
          minhStatus: 'Đang theo dõi bài giảng',
          hoaStatus: 'Ghi chép bài cẩn thận',
          bgColor: 'from-[#2b0909] to-[#0d0d0d]'
        };
      case 4:
        return {
          title: 'TUẦN 4: HỘI GIẢNG GIỮA KỲ CẤP TRƯỜNG (CÔ LAN & THẦY HÙNG)',
          boardText: '🏆 HỘI GIẢNG THỰC TẬP SƯ PHẠM — BÀI DẠY 45 PHÚT 🏆',
          teacherDialogue: 'Tiết học hôm nay chúng ta sẽ cùng thảo luận nhóm và ứng dụng thực hành ngay tại lớp!',
          mentorDialogue: 'Thầy Hùng (Hiệu trưởng): "Tác phong sư phạm và giáo án 45 phút rất chặt chẽ!"',
          ducStatus: 'Hợp tác thảo luận nhóm tích cực',
          minhStatus: 'Xung phong phát biểu ý kiến nhóm',
          hoaStatus: 'Đại diện nhóm trình bày kết quả',
          bgColor: 'from-[#1a092b] to-[#0d0d0d]'
        };
      case 5:
        return {
          title: 'TUẦN 5: BẢO VỆ LIÊM CHÍNH & ĐẠO ĐỨC NHÀ GIÁO',
          boardText: 'ĐÁNH GIÁ CÔNG BẰNG & PHÁT TRIỂN NĂNG LỰC HỌC SINH',
          teacherDialogue: 'Thưa phụ huynh em Hoa, em rất chăm chỉ. Nhưng điểm số cần phản ánh đúng năng lực thực tế để em tiếp tục phấn đấu.',
          mentorDialogue: 'Cô Lan: "Rất bản lĩnh! Liêm chính sư phạm là phẩm chất quý giá nhất của nhà giáo."',
          ducStatus: 'Luyện tập bài tập ứng dụng',
          minhStatus: 'Hỏi bài thầy/cô sau giờ học',
          hoaStatus: 'Thấu hiểu và tiếp tục tự giác ôn luyện',
          bgColor: 'from-[#1f1a09] to-[#0d0d0d]'
        };
      case 6:
        return {
          title: 'TUẦN 6: HOẠT ĐỘNG TRẢI NGHIỆM HƯỚNG NGHIỆP (HOLLAND RIASEC)',
          boardText: '🎪 TRẠM TRẢI NGHIỆM HƯỚNG NGHIỆP LỚP 10A3 🎪',
          teacherDialogue: minhLeaderAssigned
            ? 'Minh sẽ đảm nhận vai trò Nhóm trưởng Trạm Kỹ thuật & Sáng tạo nhé!'
            : 'Mỗi em hãy khám phá nhóm sở thích Holland phù hợp với ước mơ của mình!',
          mentorDialogue: 'Cô Lan: "Hoạt động trải nghiệm rất sinh động và cuốn hút toàn bộ học sinh!"',
          ducStatus: 'Hào hứng tham gia trắc nghiệm nghề nghiệp',
          minhStatus: minhLeaderAssigned ? 'Tự tin làm Nhóm trưởng dẫn dắt cả trạm' : 'Tích cực trao đổi cùng các bạn',
          hoaStatus: 'Hào hứng khám phá nhóm Quản lý',
          bgColor: 'from-[#061a1a] to-[#0d0d0d]'
        };
      case 7:
        return {
          title: 'TUẦN 7: KHỦNG HOẢNG SƯ PHẠM — CAN THIỆP GIỮ HỌC SINH',
          boardText: '🔴 KẾ HOẠCH HỖ TRỢ TOÀN DIỆN: QUỸ HỌC BỔNG + PHỤ ĐẠO',
          teacherDialogue: 'Bác yên tâm, thầy/cô và nhà trường sẽ có quỹ hỗ trợ và phụ đạo riêng để Đức tiếp tục đến trường!',
          mentorDialogue: 'Cô Lan: "Hành động kịp thời của em đã cứu rỗi tương lai của một học trò nghèo."',
          ducStatus: 'Xúc động, hứa cố gắng học tập',
          minhStatus: 'Ủng hộ và chia sẻ với Đức',
          hoaStatus: 'Quyên góp sách vở hỗ trợ bạn',
          bgColor: 'from-[#2b1709] to-[#0d0d0d]'
        };
      default:
        return {
          title: 'TUẦN 8: LỄ TỔNG KẾT & TỰ PHẢN TƯ SƯ PHẠM 8 TUẦN',
          boardText: '🎓 LỄ CHIA TAY 8 TUẦN THỰC TẬP — CẢM ƠN THẦY CÔ 🎓',
          teacherDialogue: 'Cảm ơn tập thể 10A3 và Cô Lan đã cho thầy/cô một hành trình thực tập vô cùng ý nghĩa!',
          mentorDialogue: 'Cô Lan: "Chúc mừng em đã hoàn thành xuất sắc kỳ thực tập và trở thành một nhà giáo chân chính!"',
          ducStatus: 'Tặng thầy/cô bức tranh tự vẽ',
          minhStatus: 'Đại diện lớp đọc lời tri ân xúc động',
          hoaStatus: 'Gửi tặng cuốn sổ lưu bút tập thể 10A3',
          bgColor: 'from-[#1a061a] to-[#0d0d0d]'
        };
    }
  };

  const scene = getSceneConfig();

  return (
    <div className={`bg-gradient-to-b ${scene.bgColor} border-2 border-[#00ff41] p-4 space-y-4 shadow-[0_0_25px_rgba(0,255,65,0.2)] font-mono text-[#00ff41] pixelated`}>
      {/* Scene Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#00ff41]/40 pb-2 gap-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#ff00ff] shrink-0" />
          <h3 className="text-xs sm:text-sm font-pixel font-bold uppercase tracking-wider text-[#00ff41]">
            {scene.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] shrink-0">
          <span className="bg-[#111] text-[#ff00ff] border border-[#ff00ff] px-2 py-0.5 font-bold font-pixel text-[9px]">
            THPT NGUYỄN TRÃI 10A3
          </span>
          {isEvaluating && (
            <span className="bg-[#00ff41] text-[#000] px-2 py-0.5 font-bold animate-pulse font-pixel text-[9px]">
              ĐANG ĐÁNH GIÁ...
            </span>
          )}
        </div>
      </div>

      {/* Classroom Chalkboard Representation with 8-Bit Pixel Characters */}
      <div className="bg-[#041207] border-4 border-[#166534] p-4 shadow-inner space-y-3 relative overflow-hidden">
        {/* Chalkboard Frame & Header */}
        <div className="text-center font-bold text-xs sm:text-sm text-[#86efac] tracking-wider border-b border-[#166534] pb-2 flex items-center justify-center gap-2 font-pixel">
          <Sparkles className="w-4 h-4 text-[#ff00ff]" />
          <span>{scene.boardText}</span>
        </div>

        {/* Teacher & Mentor Animated Pixel Dialogue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Teacher Speech with Pixel Avatar */}
          <div className="bg-[#000]/90 border-2 border-[#00ff41] p-3 text-xs flex gap-3 items-start">
            <PixelCharacterSprite type="teacher_lan" size={44} mood="proud" />
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-1.5 text-[#00ff41] font-pixel text-[10px] font-bold">
                <span>BẠN (GIÁO VIÊN THỰC TẬP):</span>
              </div>
              <p className="text-white italic leading-relaxed text-xs">
                "{scene.teacherDialogue}"
              </p>
            </div>
          </div>

          {/* Mentor Speech with Pixel Avatar */}
          <div className="bg-[#000]/90 border-2 border-[#ff00ff] p-3 text-xs flex gap-3 items-start">
            {week === 4 ? (
              <PixelCharacterSprite type="principal_hung" size={44} mood="proud" />
            ) : (
              <PixelCharacterSprite type="teacher_lan" size={44} mood="happy" />
            )}
            <div className="space-y-1 flex-1">
              <div className="flex items-center gap-1.5 text-[#ff00ff] font-pixel text-[10px] font-bold">
                <span>{week === 4 ? 'THẦY HÙNG (HIỆU TRƯỞNG):' : 'CÔ LAN (MENTOR HƯỚNG DẪN):'}</span>
              </div>
              <p className="text-white/90 italic leading-relaxed text-xs">
                "{scene.mentorDialogue}"
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Student Desks 8-Bit Pixel Character Grid */}
      <div className="space-y-2">
        <div className="text-[11px] font-pixel font-bold uppercase text-white flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#ff00ff]" />
          <span>BÀN HỌC SINH & TRẠNG THÁI LỚP 10A3:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* EM ĐỨC */}
          <div className="bg-[#111] border-2 border-[#ff4444]/70 p-3 space-y-2 hover:border-[#ff4444] transition-all">
            <div className="flex items-center justify-between border-b border-[#ff4444]/30 pb-1.5">
              <div className="flex items-center gap-1.5">
                <PixelCharacterSprite 
                  type="student_duc" 
                  size={36} 
                  mood={teacherState.moraleDuc >= 55 ? 'happy' : 'angry'} 
                />
                <span className="font-pixel text-[10px] text-[#ff4444]">
                  EM ĐỨC
                </span>
              </div>
              <span className="text-[10px] bg-[#000] px-1.5 py-0.5 text-white border border-[#ff4444]/40 font-mono">
                {teacherState.moraleDuc}% Tự giác
              </span>
            </div>
            <p className="text-[11px] text-white/90 leading-tight bg-black/60 p-1.5 border border-white/10">
              {scene.ducStatus}
            </p>
          </div>

          {/* EM MINH */}
          <div className="bg-[#111] border-2 border-[#00e5ff]/70 p-3 space-y-2 hover:border-[#00e5ff] transition-all">
            <div className="flex items-center justify-between border-b border-[#00e5ff]/30 pb-1.5">
              <div className="flex items-center gap-1.5">
                <PixelCharacterSprite 
                  type="student_minh" 
                  size={36} 
                  mood={teacherState.moraleMinh >= 55 ? 'happy' : 'thinking'} 
                />
                <span className="font-pixel text-[10px] text-[#00e5ff]">
                  EM MINH
                </span>
              </div>
              <span className="text-[10px] bg-[#000] px-1.5 py-0.5 text-white border border-[#00e5ff]/40 font-mono">
                {teacherState.moraleMinh}% Tự tin
              </span>
            </div>
            <p className="text-[11px] text-white/90 leading-tight bg-black/60 p-1.5 border border-white/10">
              {scene.minhStatus}
            </p>
          </div>

          {/* EM HOA */}
          <div className="bg-[#111] border-2 border-[#ffea00]/70 p-3 space-y-2 hover:border-[#ffea00] transition-all">
            <div className="flex items-center justify-between border-b border-[#ffea00]/30 pb-1.5">
              <div className="flex items-center gap-1.5">
                <PixelCharacterSprite 
                  type="student_hoa" 
                  size={36} 
                  mood={teacherState.moraleHoa >= 70 ? 'happy' : 'worried'} 
                />
                <span className="font-pixel text-[10px] text-[#ffea00]">
                  EM HOA
                </span>
              </div>
              <span className="text-[10px] bg-[#000] px-1.5 py-0.5 text-white border border-[#ffea00]/40 font-mono">
                {teacherState.moraleHoa}% Tâm lý
              </span>
            </div>
            <p className="text-[11px] text-white/90 leading-tight bg-black/60 p-1.5 border border-white/10">
              {scene.hoaStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
