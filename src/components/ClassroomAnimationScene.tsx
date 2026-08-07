import React from 'react';
import { TeacherState } from '../types';
import { Sparkles, Heart, Shield, Users, AlertTriangle, GraduationCap, UserCheck, Award, MessageSquare } from 'lucide-react';

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
          minhStatus: minhLeaderAssigned ? '🌟 Tự tin làm Nhóm trưởng dẫn dắt cả trạm' : 'Tích cực trao đổi cùng các bạn',
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
    <div className={`bg-gradient-to-b ${scene.bgColor} border-2 border-[#00ff41] p-4 space-y-4 shadow-2xl font-mono text-[#00ff41]`}>
      {/* Scene Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#00ff41]/40 pb-2 gap-2">
        <div className="flex items-center gap-2">
          <GraduationCap className="w-5 h-5 text-[#ff00ff] shrink-0" />
          <h3 className="text-xs sm:text-sm font-black uppercase tracking-wider text-[#00ff41]">
            {scene.title}
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[11px] shrink-0">
          <span className="bg-[#111] text-[#ff00ff] border border-[#ff00ff] px-2 py-0.5 font-bold">
            THPT NGUYỄN TRÃI
          </span>
          {isEvaluating && (
            <span className="bg-[#00ff41] text-[#000] px-2 py-0.5 font-bold animate-pulse">
              ĐANG ĐÁNH GIÁ...
            </span>
          )}
        </div>
      </div>

      {/* Classroom Chalkboard Representation */}
      <div className="bg-[#041207] border-2 border-[#00ff41]/80 p-4 rounded shadow-inner space-y-2 relative overflow-hidden">
        <div className="text-center font-bold text-xs sm:text-sm text-[#00ff41] tracking-wider border-b border-[#00ff41]/30 pb-2 flex items-center justify-center gap-2">
          <Sparkles className="w-4 h-4 text-[#ff00ff]" />
          <span>{scene.boardText}</span>
        </div>

        {/* Teacher & Mentor Dialogue Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
          {/* Teacher Speech */}
          <div className="bg-[#000]/80 border-l-4 border-[#00ff41] p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#00ff41] font-bold">
              <UserCheck className="w-3.5 h-3.5 text-[#00ff41]" />
              <span>BẠN (GIÁO VIÊN THỰC TẬP):</span>
            </div>
            <p className="text-white italic leading-relaxed">
              "{scene.teacherDialogue}"
            </p>
          </div>

          {/* Mentor Speech */}
          <div className="bg-[#000]/80 border-l-4 border-[#ff00ff] p-3 text-xs space-y-1">
            <div className="flex items-center gap-1.5 text-[#ff00ff] font-bold">
              <Award className="w-3.5 h-3.5 text-[#ff00ff]" />
              <span>CÔ LAN (MENTOR HƯỚNG DẪN):</span>
            </div>
            <p className="text-white/90 italic leading-relaxed">
              "{scene.mentorDialogue}"
            </p>
          </div>
        </div>
      </div>

      {/* Student Desks Vector Avatars Grid */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase text-white flex items-center gap-1.5">
          <Users className="w-4 h-4 text-[#ff00ff]" />
          <span>TRẠNG THÁI LỚP HỌC & 3 HỌC SINH TRỌNG TÂM:</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {/* EM ĐỨC */}
          <div className="bg-[#111] border border-[#ff4444]/60 p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-[#ff4444]/30 pb-1.5">
              <span className="font-bold text-xs text-[#ff4444] flex items-center gap-1">
                <AlertTriangle className="w-3.5 h-3.5" />
                EM ĐỨC (CÁ BIỆT)
              </span>
              <span className="text-[10px] bg-[#000] px-1.5 py-0.5 text-white border border-[#ff4444]/40">
                {teacherState.moraleDuc}% Tự giác
              </span>
            </div>
            <p className="text-[11px] text-white/90 leading-tight">
              {scene.ducStatus}
            </p>
          </div>

          {/* EM MINH */}
          <div className="bg-[#111] border border-[#ff00ff]/60 p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-[#ff00ff]/30 pb-1.5">
              <span className="font-bold text-xs text-[#ff00ff] flex items-center gap-1">
                <Heart className="w-3.5 h-3.5" />
                EM MINH (TỰ TI)
              </span>
              <span className="text-[10px] bg-[#000] px-1.5 py-0.5 text-white border border-[#ff00ff]/40">
                {teacherState.moraleMinh}% Tự tin
              </span>
            </div>
            <p className="text-[11px] text-white/90 leading-tight">
              {scene.minhStatus}
            </p>
          </div>

          {/* EM HOA */}
          <div className="bg-[#111] border border-yellow-400/60 p-3 space-y-2">
            <div className="flex items-center justify-between border-b border-yellow-400/30 pb-1.5">
              <span className="font-bold text-xs text-yellow-400 flex items-center gap-1">
                <Shield className="w-3.5 h-3.5" />
                EM HOA (ÁP LỰC)
              </span>
              <span className="text-[10px] bg-[#000] px-1.5 py-0.5 text-white border border-yellow-400/40">
                {teacherState.moraleHoa}% Tâm lý
              </span>
            </div>
            <p className="text-[11px] text-white/90 leading-tight">
              {scene.hoaStatus}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
