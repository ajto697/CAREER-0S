import React, { useState, useEffect } from 'react';
import { TeacherState, CareerId } from '../types';
import { Sparkles, Heart, Shield, Users, AlertTriangle, GraduationCap, Flame, Smile, Frown, Meh, Zap, Award, Activity, MessageSquare, RefreshCw } from 'lucide-react';

interface Props {
  week: number;
  careerId: CareerId;
  teacherState?: TeacherState;
  isEvaluating?: boolean;
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
  isEvaluating = false
}) => {
  const [pulseTick, setPulseTick] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setPulseTick(prev => (prev + 1) % 100);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  // Helper to get character mood emoji & badge based on score
  const getMoodBadge = (score: number) => {
    if (score >= 75) {
      return { icon: <Smile className="w-3.5 h-3.5 text-[#00ff41]" />, label: 'Hào hứng', color: 'text-[#00ff41] border-[#00ff41]', bg: 'bg-[#00ff41]/10' };
    }
    if (score >= 50) {
      return { icon: <Meh className="w-3.5 h-3.5 text-yellow-400" />, label: 'Ổn định', color: 'text-yellow-400 border-yellow-400', bg: 'bg-yellow-400/10' };
    }
    return { icon: <Frown className="w-3.5 h-3.5 text-[#ff4444]" />, label: 'Báo động', color: 'text-[#ff4444] border-[#ff4444]', bg: 'bg-[#ff4444]/10' };
  };

  // Week-specific situation details for Pedagogy (Education)
  const getPedagogySituation = () => {
    switch (week) {
      case 1:
        return {
          title: 'TUẦN 1: RA MẮT LỚP 10A3 — TẠO LỰC HÚT BAN ĐẦU',
          icons: ['🏫', '👋', '📋', '✨'],
          eventDesc: 'Lớp 10A3 tò mò về giáo viên mới. Đức bấm máy chơi game, Minh rụt rè cuối lớp.',
          ducExpression: teacherState.moraleDuc >= 50 ? '😏 Lắng nghe dè dặt' : '📱 Đang chơi game ngầm',
          minhExpression: teacherState.moraleMinh >= 50 ? '🙈 Rụt rè ngẩng đầu' : '🫣 Cúi mặt tránh ánh mắt',
          hoaExpression: '✍️ Ghi chép bài nghiêm túc'
        };
      case 2:
        return {
          title: 'TUẦN 2: CHUYÊN ĐỀ PHÁT BIỂU — TIẾP SỨC EM MINH',
          icons: ['🙋‍♂️', '💬', '💖', '⭐'],
          eventDesc: 'Minh lúng túng khi được gọi tên. Cần chiến thuật đặt câu hỏi phân tầng để tiếp sức.',
          ducExpression: '🤨 Quan sát cách giáo viên đối xử với Minh',
          minhExpression: teacherState.moraleMinh >= 60 ? '🌟 Dũng cảm giơ tay phát biểu' : '😰 Căng thẳng ôm chặt vở',
          hoaExpression: '👍 Khích lệ bạn Minh'
        };
      case 3:
        return {
          title: 'TUẦN 3: SỔ LIÊN LẠC & TÌNH HUỐNG EM ĐỨC VI PHẠM',
          icons: ['🎧', '✈️', '✉️', '⚠️'],
          eventDesc: 'Đức đeo tai nghe, ném máy bay giấy trong giờ. Bạn chọn gửi thư Zalo hay phê bình?',
          ducExpression: teacherState.moraleDuc >= 60 ? '🎧 Cất tai nghe, tập trung bài' : '✈️ Ném máy bay giấy trêu bạn',
          minhExpression: '👀 Theo dõi tình huống',
          hoaExpression: '😤 Hơi khó chịu vì làm phiền giờ học'
        };
      case 4:
        return {
          title: 'TUẦN 4: HỘI GIẢNG GIỮA KỲ CẤP TRƯỜNG',
          icons: ['🏆', '👨‍🏫', '⏱️', '💯'],
          eventDesc: 'Thầy Hùng Hiệu Trưởng & Cô Lan Mentor dự giờ. Lớp học sôi nổi thảo luận 45 phút.',
          ducExpression: teacherState.moraleDuc >= 60 ? '🤝 Thảo luận nhóm sôi nổi' : '😑 Ngồi im trong nhóm',
          minhExpression: teacherState.moraleMinh >= 60 ? '🗣️ Trình bày ý kiến nhóm' : '✍️ Ghi chép cho nhóm',
          hoaExpression: '🌟 Nhóm trưởng xuất sắc'
        };
      case 5:
        return {
          title: 'TUẦN 5: LIÊM CHÍNH SƯ PHẠM — BÁO CÁO EM HOA',
          icons: ['⚖️', '📩', '🛡️', '🏅'],
          eventDesc: 'Phụ huynh em Hoa gửi tin nhắn nhờ nâng điểm 9.5. Quyết định giữ vững liêm chính sư phạm.',
          ducExpression: '🫡 Thừa nhận điểm số công bằng',
          minhExpression: 'Tự tin với điểm số thật',
          hoaExpression: teacherState.moraleHoa >= 70 ? '😊 Hiểu ra và tự hào với thực lực' : '😔 Hơi buồn nhưng cố gắng hơn'
        };
      case 6:
        return {
          title: 'TUẦN 6: HOẠT ĐỘNG TRẢI NGHIỆM HƯỚNG NGHIỆP',
          icons: ['🎪', '🗺️', '🎯', '🚀'],
          eventDesc: '6 Trạm trải nghiệm Holland RIASEC. Minh được trao cơ hội làm Nhóm trưởng Trạm Kỹ thuật.',
          ducExpression: '🛠️ Hào hứng tham gia trạm Kỹ thuật',
          minhExpression: teacherState.moraleMinh >= 65 ? '👑 Nhóm trưởng tự tin điều hành' : '🤝 Hợp tác vui vẻ với nhóm',
          hoaExpression: '💼 Khám phá trạm Quản lý'
        };
      case 7:
        return {
          title: 'TUẦN 7: KHỦNG HOẢNG — BỐ ĐỨC XIN RÚT HỒ SƠ',
          icons: ['🌧️', '💔', '🤝', '🔥'],
          eventDesc: 'Bố Đức gặp giáo viên xin cho con nghỉ học làm công nhân. Kế hoạch can thiệp toàn diện!',
          ducExpression: teacherState.moraleDuc >= 60 ? '🥹 Xúc động muốn tiếp tục đi học' : '😔 Lo lắng hoàn cảnh gia đình',
          minhExpression: '🤝 Sẵn sàng phụ đạo bài cho Đức',
          hoaExpression: '📚 Quyên góp sách vở cho bạn'
        };
      default:
        return {
          title: 'TUẦN 8: LỄ TỔNG KẾT & LƯU BÚT TRI ÂN 10A3',
          icons: ['🎓', '💐', '💌', '👑'],
          eventDesc: 'Buổi chia tay đong đầy nước mắt tri ân. 8 tuần thực tập ghi dấu sự trưởng thành trọn vẹn.',
          ducExpression: '🎨 Tặng thầy/cô bức tranh tự vẽ',
          minhExpression: '📜 Đại diện lớp đọc thư tri ân',
          hoaExpression: '📖 Gửi tặng cuốn sổ lưu bút'
        };
    }
  };

  // General career layout info
  const pedSituation = getPedagogySituation();

  return (
    <div className="bg-[#080d08] border-2 border-[#00ff41] p-3 sm:p-4 space-y-3 font-mono text-[#00ff41] shadow-xl relative overflow-hidden">
      {/* Top Header Bar with Animated 8-Bit Pixel Pulse */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#00ff41]/40 pb-2 gap-2">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            {pedSituation.icons.map((icon, idx) => (
              <span
                key={idx}
                className={`text-base sm:text-lg inline-block transition-transform duration-300 ${
                  (pulseTick + idx) % 3 === 0 ? 'scale-125 -translate-y-1' : 'scale-100'
                }`}
              >
                {icon}
              </span>
            ))}
          </div>
          <span className="text-xs font-black uppercase text-[#00ff41] tracking-wide">
            SIMULATION ANIMATOR // TUẦN {week}
          </span>
        </div>

        <div className="flex items-center gap-2 text-[10px]">
          <span className="bg-[#111] text-[#ff00ff] border border-[#ff00ff] px-2 py-0.5 font-bold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#ff00ff] animate-ping" />
            LIVE STATE ENGINE
          </span>
          {isEvaluating && (
            <span className="bg-[#00ff41] text-[#000] px-2 py-0.5 font-bold animate-pulse">
              ĐANG ĐÁNH GIÁ...
            </span>
          )}
        </div>
      </div>

      {/* Main Situation Banner */}
      <div className="bg-[#000] border border-[#00ff41]/60 p-3 relative space-y-2">
        <div className="text-xs font-bold text-[#ff00ff] uppercase flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>{pedSituation.title}</span>
        </div>
        <p className="text-xs text-white/90 leading-relaxed font-mono">
          {pedSituation.eventDesc}
        </p>
      </div>

      {/* 8-Bit Character Avatars & Emotion Indicators Grid */}
      {careerId === 'education' && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 pt-1">
          {/* CHAR 1: EM ĐỨC */}
          {(() => {
            const mood = getMoodBadge(teacherState.moraleDuc);
            return (
              <div className={`p-2.5 border ${mood.color} ${mood.bg} space-y-1.5 transition-all`}>
                <div className="flex items-center justify-between border-b border-[#00ff41]/20 pb-1">
                  <span className="font-extrabold text-[11px] uppercase flex items-center gap-1 text-white">
                    <span>👦 EM ĐỨC</span>
                  </span>
                  <div className={`flex items-center gap-1 text-[10px] font-bold border px-1.5 py-0.5 ${mood.color}`}>
                    {mood.icon}
                    <span>{teacherState.moraleDuc}%</span>
                  </div>
                </div>
                <div className="text-[11px] text-white font-mono leading-tight">
                  {pedSituation.ducExpression}
                </div>
              </div>
            );
          })()}

          {/* CHAR 2: EM MINH */}
          {(() => {
            const mood = getMoodBadge(teacherState.moraleMinh);
            return (
              <div className={`p-2.5 border ${mood.color} ${mood.bg} space-y-1.5 transition-all`}>
                <div className="flex items-center justify-between border-b border-[#00ff41]/20 pb-1">
                  <span className="font-extrabold text-[11px] uppercase flex items-center gap-1 text-white">
                    <span>🧒 EM MINH</span>
                  </span>
                  <div className={`flex items-center gap-1 text-[10px] font-bold border px-1.5 py-0.5 ${mood.color}`}>
                    {mood.icon}
                    <span>{teacherState.moraleMinh}%</span>
                  </div>
                </div>
                <div className="text-[11px] text-white font-mono leading-tight">
                  {pedSituation.minhExpression}
                </div>
              </div>
            );
          })()}

          {/* CHAR 3: EM HOA */}
          {(() => {
            const mood = getMoodBadge(teacherState.moraleHoa);
            return (
              <div className={`p-2.5 border ${mood.color} ${mood.bg} space-y-1.5 transition-all`}>
                <div className="flex items-center justify-between border-b border-[#00ff41]/20 pb-1">
                  <span className="font-extrabold text-[11px] uppercase flex items-center gap-1 text-white">
                    <span>👧 EM HOA</span>
                  </span>
                  <div className={`flex items-center gap-1 text-[10px] font-bold border px-1.5 py-0.5 ${mood.color}`}>
                    {mood.icon}
                    <span>{teacherState.moraleHoa}%</span>
                  </div>
                </div>
                <div className="text-[11px] text-white font-mono leading-tight">
                  {pedSituation.hoaExpression}
                </div>
              </div>
            );
          })()}
        </div>
      )}

      {/* Non-pedagogy careers 8-bit status indicators */}
      {careerId !== 'education' && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] pt-1">
          <div className="bg-[#000] border border-[#00ff41]/50 p-2 text-center space-y-1">
            <span className="text-base block">⚙️</span>
            <span className="text-[#00ff41] font-bold block uppercase">HỆ THỐNG</span>
            <span className="text-white text-[10px]">Đang vận hành</span>
          </div>
          <div className="bg-[#000] border border-[#00ff41]/50 p-2 text-center space-y-1">
            <span className="text-base block">🎯</span>
            <span className="text-[#00ff41] font-bold block uppercase">MỤC TIÊU W{week}</span>
            <span className="text-white text-[10px]">Đang giải quyết</span>
          </div>
          <div className="bg-[#000] border border-[#00ff41]/50 p-2 text-center space-y-1">
            <span className="text-base block">🛡️</span>
            <span className="text-[#00ff41] font-bold block uppercase">ĐẠO ĐỨC</span>
            <span className="text-white text-[10px]">Tuân thủ 100%</span>
          </div>
          <div className="bg-[#000] border border-[#00ff41]/50 p-2 text-center space-y-1">
            <span className="text-base block">🌟</span>
            <span className="text-[#00ff41] font-bold block uppercase">SỨ MỆNH</span>
            <span className="text-white text-[10px]">Đạt chuẩn O*NET</span>
          </div>
        </div>
      )}
    </div>
  );
};
