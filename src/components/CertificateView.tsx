import React from 'react';
import { UserProgress, Settings, WeeklyResult, TeacherState } from '../types';
import { getCareerById } from '../data/careerData';
import { playSound } from '../utils/audio';
import { Award, Sparkles, BookOpen, DollarSign, ArrowLeft, GraduationCap, UserCheck, Shield, Heart, Users, CheckCircle2, AlertTriangle, Bookmark, MessageSquare } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  progress: UserProgress;
  settings: Settings;
  onBackToMap: () => void;
}

export const CertificateView: React.FC<Props> = ({ progress, settings, onBackToMap }) => {
  const career = getCareerById(progress.chosenCareer || 'pedagogy');
  const teacherState = progress.teacherState;

  let totalScore = 0;
  let completedWeeks = 0;

  (Object.values(progress.weeklyResults) as WeeklyResult[]).forEach(res => {
    if (res.careerId === career.id) {
      totalScore += res.score;
      if (res.passed) completedWeeks++;
    }
  });

  let tierName = 'CẦN CỐ GẤNG';
  let tierColor = 'text-[#ff4444] border-[#ff4444] bg-[#111]';
  let tierDesc = 'Bạn cần cố gắng thêm để làm chủ đầy đủ kỹ năng nghiệp vụ.';

  if (totalScore >= 120) {
    tierName = 'XUẤT SẮC (EXCELLENCE)';
    tierColor = 'text-[#ff00ff] border-[#ff00ff] bg-[#111]';
    tierDesc = 'Chúc mừng! Bạn xuất sắc đạt danh hiệu Thực Tập Sinh Xuất Sắc & Mở Khóa Chuyên Ngành Ẩn!';
  } else if (totalScore >= 60) {
    tierName = 'ĐẠT (PASSED)';
    tierColor = 'text-[#00ff41] border-[#00ff41] bg-[#111]';
    tierDesc = 'Bạn đã hoàn thành tốt chương trình thực tập 8 tuần với kết quả đạt chuẩn.';
  }

  const handleTriggerConfetti = () => {
    playSound.confetti(settings.retroSound);
    confetti({ particleCount: 120, spread: 90, origin: { y: 0.6 } });
  };

  // Ending Generator Logic for Pedagogy Internship
  const generatePedagogyEnding = (ts: TeacherState) => {
    const flags = ts.flags || [];
    const isLoved = ts.moraleDuc >= 60 && ts.moraleMinh >= 60 && !flags.includes('ethics_compromised');
    const isRigid = ts.reputation >= 60 && ts.trustMentor >= 60 && !isLoved && !flags.includes('ethics_compromised');
    const hasEthicsIssue = flags.includes('ethics_compromised');

    let title = '';
    let badge = '';
    let color = '';
    let mainStory = '';
    let mentorQuote = '';

    if (isLoved) {
      title = '🏆 KẾT CỤC 1: NGƯỜI THẦY TRUYỀN CẢM HỨNG & THAY ĐỔI SỐ PHẬN';
      badge = 'Nhà Giáo Ưu Tú 10A3';
      color = 'border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]';
      mainStory = 'Hành trình 8 tuần thực tập rực rỡ! Bằng sự chân thành, thấu hiểu và phương pháp sư phạm kiên nhẫn, bạn đã chạm tới trái tim từng học trò. Em Đức không bỏ học mà vươn lên đạt học sinh khá, tích cực giúp đỡ gia đình. Em Minh xóa bỏ tự ti, tự tin dẫn chương trình Lễ tổng kết. Em Hoa giải tỏa áp lực thành tích từ phụ huynh. Lớp 10A3 chuyền tay nhau cuốn sổ lưu bút đong đầy nước mắt tri ân gửi tặng bạn.';
      mentorQuote = 'Cô Lan (Mentor): "Em sinh ra để làm nhà giáo! Sự thấu hiểu và bao dung của em đã giữ lại một tương lai cho trò nghèo và thắp sáng niềm tin cho tập thể 10A3."';
    } else if (isRigid) {
      title = '🎖️ KẾT CỤC 2: NHÀ GIÁO VỮNG CHUYÊN MÔN & KỶ LUẬT CHUẨN MỰC';
      badge = 'Giáo Viên Cốt Cán Học Thuật';
      color = 'border-[#ff00ff] bg-[#ff00ff]/10 text-[#ff00ff]';
      mainStory = 'Bạn hoàn thành xuất sắc các tiết dạy hội giảng với giáo án 45 phút chuẩn mực, tác phong sư phạm nghiêm túc. Thầy Hùng Hiệu trưởng và Cô Lan đánh giá rất cao năng lực truyền thụ tri thức chuyên môn của bạn. Học sinh 10A3 nể phục sự công tâm và kỷ luật của bạn, dù khoảng cách giữa thầy/cô và các em học sinh có hoàn cảnh đặc biệt vẫn còn đôi chút dè dặt.';
      mentorQuote = 'Thầy Hùng (Hiệu trưởng): "Thầy rất ấn tượng với tác phong sư phạm vững vàng và tính nguyên tắc của em. Em sẽ là một giáo viên cốt cán giỏi chuyên môn."';
    } else if (hasEthicsIssue) {
      title = '⚠️ KẾT CỤC 3: BÀI HỌC SƯ PHẠM SÂU SẮC VỀ ĐẠO ĐỨC NHÀ GIÁO';
      badge = 'Nhà Giáo Tập Sự Trưởng Thành';
      color = 'border-[#ff4444] bg-[#ff4444]/10 text-[#ff4444]';
      mainStory = '8 tuần thực tập đầy sóng gió đã cho bạn những bài học đắt giá. Việc thỏa hiệp trước áp lực điểm số đã ảnh hưởng tới uy tín sư phạm. Nhưng chính trải nghiệm này giúp bạn nhận ra: Danh dự, sự công bằng và tính trung thực mới là nền tảng cốt lõi nhất nâng đỡ ngọn đuốc nhà giáo.';
      mentorQuote = 'Cô Lan (Mentor): "Nghề giáo có những cám dỗ và áp lực rất lớn. Hãy coi đây là bài học xương máu để vững vàng hơn trên con đường tương lai."';
    } else {
      title = '🌱 KẾT CỤC 4: BÀI HỌC SƯ PHẠM VỀ LÒNG KIÊN NHẪN & BẢN LĨNH';
      badge = 'Nhà Giáo Tập Sự Tâm Huyết';
      color = 'border-yellow-400 bg-yellow-400/10 text-yellow-400';
      mainStory = '8 tuần đồng hành cùng 10A3 mang lại nhiều trải nghiệm thực tế quý báu. Dù còn đôi lúc lúng túng trước các tình huống khủng hoảng học đường, lòng nhiệt huyết của bạn đã để lại nhiều kỷ niệm đẹp trong lòng tập thể lớp.';
      mentorQuote = 'Cô Lan (Mentor): "Giáo án hay chỉ là một nửa tiết học, nửa còn lại là sự nhẫn nại và tình yêu thương. Cố lên em nhé!"';
    }

    const ducStatus = ts.moraleDuc >= 65
      ? 'Đã vượt qua nghịch cảnh, vươn lên học sinh khá & tiếp tục đi học.'
      : ts.moraleDuc >= 45
      ? 'Tâm lý ổn định hơn, chưa thực sự bứt phá nhưng không bỏ học.'
      : 'Còn nhiều vướng mắc tâm lý, nguy cơ chán học cao.';

    const minhStatus = ts.moraleMinh >= 65
      ? 'Xóa bỏ tự ti, tự tin phát biểu & tự tin làm Nhóm trưởng.'
      : ts.moraleMinh >= 45
      ? 'Có tiến bộ nhỏ, đã bớt rụt rè trong giờ học.'
      : 'Vẫn khép kín và tự ti trước tập thể.';

    const hoaStatus = ts.moraleHoa >= 65
      ? 'Giải tỏa áp lực gia đình, giữ vững tinh thần tự giác.'
      : 'Vẫn chịu nhiều áp lực từ kỳ vọng thành tích của phụ huynh.';

    return {
      title,
      badge,
      color,
      mainStory,
      mentorQuote,
      ducStatus,
      minhStatus,
      hoaStatus
    };
  };

  const pedagogyEnding = teacherState ? generatePedagogyEnding(teacherState) : null;

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-mono text-[#00ff41] select-none">
      {/* Top Controls */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => { playSound.click(settings.retroSound); onBackToMap(); }}
          className="px-4 py-2 border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c] text-xs font-bold uppercase flex items-center gap-2 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>VỀ BẢN ĐỒ 5 NGÀNH</span>
        </button>

        <button
          onClick={handleTriggerConfetti}
          className="px-4 py-2 bg-[#00ff41] text-[#0c0c0c] font-bold text-xs uppercase flex items-center gap-2 border-2 border-[#00ff41] hover:bg-[#00e53a] transition-all"
        >
          <Sparkles className="w-4 h-4" />
          <span>BẮN PHÁO HOA ĂN MỪNG 🎉</span>
        </button>
      </div>

      {/* Official Certificate Card Container */}
      <div className="bg-[#0c0c0c] border-4 border-[#00ff41] p-8 shadow-2xl relative text-center space-y-6">
        <div className="absolute top-6 right-6 opacity-15 pointer-events-none">
          <Award className="w-36 h-36 text-[#00ff41]" />
        </div>

        {/* Certificate Header */}
        <div className="space-y-2">
          <div className="inline-block bg-[#00ff41] text-[#0c0c0c] font-bold text-xs px-3 py-1 uppercase">
            HỆ ĐIỀU HÀNH HƯỚNG NGHIỆP CAREEROS V5.0 GDPT 2018
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold uppercase tracking-wider text-[#00ff41] pt-1">
            CHỨNG NHẬN HOÀN THÀNH THỰC TẬP
          </h1>
          <p className="text-xs opacity-70 uppercase tracking-widest">
            CERTIFICATE OF COMPLETED CAREER INTERNSHIP
          </p>
        </div>

        {/* Student Name & Info */}
        <div className="space-y-1 py-3 border-y-2 border-[#00ff41]/50 max-w-xl mx-auto">
          <div className="text-xs opacity-70 uppercase">CHỨNG NHẬN HỌC SINH</div>
          <div className="text-2xl sm:text-3xl font-extrabold text-[#00ff41] uppercase tracking-wide">
            {progress.name}
          </div>
          <div className="text-xs text-[#ff00ff] font-bold">
            TRƯỜNG: {progress.school} — LỚP: {progress.className} | MÃ HOLLAND: {progress.hollandCode}
          </div>
        </div>

        {/* Career & Tier Accomplishment */}
        <div className="space-y-2">
          <p className="text-xs sm:text-sm">
            Đã hoàn thành xuất sắc chương trình mô phỏng <strong className="text-[#ff00ff]">{completedWeeks}/8 Tuần thực tập làm thật</strong> thuộc ngành:
          </p>
          <div className="text-xl font-bold uppercase text-[#00ff41]">
            {career.name}
          </div>

          <div className={`inline-block px-5 py-2 border-2 text-sm font-bold uppercase shadow-lg ${tierColor}`}>
            MỨC XẾP LOẠI: {tierName} ({totalScore} ĐIỂM THỰC TẬP)
          </div>
          <p className="text-xs opacity-80 max-w-lg mx-auto">{tierDesc}</p>
        </div>

        {/* Seal Stamp */}
        <div className="pt-4 flex items-center justify-center gap-8 text-xs text-[#00ff41] opacity-90">
          <div>
            <div className="text-[10px] opacity-70">NGÀY CẤP CHỨNG NHẬN</div>
            <div className="font-bold">{new Date().toLocaleDateString('vi-VN')}</div>
          </div>

          <div className="w-16 h-16 bg-[#111] border-2 border-[#00ff41] flex items-center justify-center font-bold text-[10px] uppercase rotate-6 text-[#ff00ff]">
            CAREEROS SEAL
          </div>

          <div>
            <div className="text-[10px] opacity-70">MÃ XÁC THỰC LƯU MÁY</div>
            <div className="font-bold">#OS5-8W-{career.id.toUpperCase()}</div>
          </div>
        </div>
      </div>

      {/* Pedagogy Internship Ending & Performance Report */}
      {pedagogyEnding && teacherState && (
        <div className="bg-[#0c0c0c] border-4 border-[#00ff41] p-6 space-y-5 shadow-2xl relative">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#00ff41]/50 pb-3 gap-2">
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-[#ff00ff] shrink-0" />
              <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#00ff41]">
                BÁO CÁO KẾT QUẢ THỰC TẬP SƯ PHẠM (10A3 - THPT NGUYỄN TRÃI)
              </h2>
            </div>
            <span className="bg-[#111] text-[#ff00ff] border border-[#ff00ff] px-3 py-1 text-xs font-bold uppercase shrink-0">
              {pedagogyEnding.badge}
            </span>
          </div>

          {/* Graduation Outcome Box */}
          <div className={`p-4 border-2 space-y-2 ${pedagogyEnding.color}`}>
            <h3 className="text-sm font-black uppercase tracking-wide">
              {pedagogyEnding.title}
            </h3>
            <p className="text-xs leading-relaxed text-white">
              {pedagogyEnding.mainStory}
            </p>
            <div className="bg-[#000]/80 p-2.5 border-l-4 border-[#ff00ff] text-xs font-semibold italic text-[#00ff41] mt-2">
              💬 {pedagogyEnding.mentorQuote}
            </div>
          </div>

          {/* Teacher State Metrics Grid */}
          <div className="space-y-2">
            <h4 className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
              <Users className="w-4 h-4 text-[#ff00ff]" />
              CHỈ SỐ TÍCH LŨY SƯ PHẠM SỰ NGHIỆP (TEACHER STATE REPORT):
            </h4>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
              <div className="bg-[#111] p-2.5 border border-[#00ff41]/50 space-y-1">
                <span className="text-[10px] opacity-70 text-white block">TIN TƯỞNG CÔ LAN</span>
                <span className="text-base font-black text-[#00ff41]">{teacherState.trustMentor} / 100</span>
              </div>
              <div className="bg-[#111] p-2.5 border border-[#00ff41]/50 space-y-1">
                <span className="text-[10px] opacity-70 text-white block">UY TÍN BAN GIÁM HIỆU</span>
                <span className="text-base font-black text-[#00ff41]">{teacherState.reputation} / 100</span>
              </div>
              <div className="bg-[#111] p-2.5 border border-[#00ff41]/50 space-y-1">
                <span className="text-[10px] opacity-70 text-white block">KHÔNG KHÍ LỚP 10A3</span>
                <span className="text-base font-black text-[#00ff41]">{teacherState.classAtmosphere} / 100</span>
              </div>
              <div className="bg-[#111] p-2.5 border border-[#00ff41]/50 space-y-1">
                <span className="text-[10px] opacity-70 text-white block">NIỀM TIN PHỤ HUYNH ĐỨC</span>
                <span className="text-base font-black text-[#00ff41]">{teacherState.parentTrustDuc} / 100</span>
              </div>
            </div>
          </div>

          {/* 3 Core Students Status */}
          <div className="bg-[#111] p-4 border border-[#00ff41]/50 space-y-3">
            <h4 className="text-xs font-bold uppercase text-[#00ff41] flex items-center gap-1.5">
              <Heart className="w-4 h-4 text-[#ff00ff]" />
              SỐ PHẬN 3 HỌC SINH TRỤC CHÍNH SAU 8 TUẦN:
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="bg-[#000] p-3 border border-[#ff4444]/60 space-y-1">
                <div className="font-bold text-[#ff4444] flex items-center justify-between">
                  <span>EM ĐỨC (CÁ BIỆT)</span>
                  <span className="text-[10px] text-white">{teacherState.moraleDuc}% Tự giác</span>
                </div>
                <p className="text-[11px] text-white/90 leading-tight">
                  {pedagogyEnding.ducStatus}
                </p>
              </div>

              <div className="bg-[#000] p-3 border border-[#ff00ff]/60 space-y-1">
                <div className="font-bold text-[#ff00ff] flex items-center justify-between">
                  <span>EM MINH (TỰ TI)</span>
                  <span className="text-[10px] text-white">{teacherState.moraleMinh}% Tự tin</span>
                </div>
                <p className="text-[11px] text-white/90 leading-tight">
                  {pedagogyEnding.minhStatus}
                </p>
              </div>

              <div className="bg-[#000] p-3 border border-yellow-400/60 space-y-1">
                <div className="font-bold text-yellow-400 flex items-center justify-between">
                  <span>EM HOA (ÁP LỰC)</span>
                  <span className="text-[10px] text-white">{teacherState.moraleHoa}% Tâm lý</span>
                </div>
                <p className="text-[11px] text-white/90 leading-tight">
                  {pedagogyEnding.hoaStatus}
                </p>
              </div>
            </div>
          </div>

          {/* Decision Flags Audit */}
          {teacherState.flags && teacherState.flags.length > 0 && (
            <div className="bg-[#111] p-3 border border-[#00ff41]/40 space-y-1.5 text-xs">
              <span className="text-[11px] font-bold uppercase text-white">NHẬT KÝ QUYẾT ĐỊNH QUAN TRỌNG TÍCH LŨY:</span>
              <div className="flex flex-wrap gap-1.5 pt-1">
                {teacherState.flags.map((flag, idx) => (
                  <span key={idx} className="bg-[#000] text-[#00ff41] px-2 py-0.5 border border-[#00ff41] text-[10px]">
                    #{flag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Real Career Pathway & Salary Roadmap in Vietnam */}
      <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-6 space-y-4 shadow-xl">
        <div className="flex items-center gap-2 font-bold text-base uppercase text-[#00ff41]">
          <GraduationCap className="w-5 h-5" />
          <span>LỘ TRÌNH PHÁT TRIỂN SỰ NGHIỆP THẬT (VIETNAM ROADMAP)</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 text-xs">
          {/* Môn Học Cấp 3 & Trường Đại Học */}
          <div className="bg-[#111] p-4 border border-[#00ff41]/50 space-y-2">
            <div className="font-bold uppercase flex items-center gap-1.5 text-[#00ff41]">
              <BookOpen className="w-4 h-4" />
              <span>MÔN HỌC CẤP 3 & TRƯỜNG ĐẠI HỌC TOP</span>
            </div>
            <p className="leading-relaxed opacity-90">
              Các môn học GDPT 2018 cần tập trung: <strong className="text-[#ff00ff]">{career.subjects.join(', ')}</strong>.
            </p>
            <div className="pt-1">
              <span className="opacity-70 block text-[11px] mb-1">TRƯỜNG ĐẠI HỌC HÀNG ĐẦU:</span>
              <div className="flex flex-wrap gap-1.5">
                {career.topSchools.map(sch => (
                  <span key={sch} className="bg-[#000] text-[#00ff41] px-2 py-0.5 border border-[#00ff41]/40">
                    {sch}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Mức Lương Junior / Senior */}
          <div className="bg-[#111] p-4 border border-[#00ff41]/50 space-y-2">
            <div className="font-bold uppercase flex items-center gap-1.5 text-[#00ff41]">
              <DollarSign className="w-4 h-4" />
              <span>MỨC LƯƠNG THAM CHIẾU TẠI VIỆT NAM</span>
            </div>
            <div className="space-y-1">
              <div>• <strong>JUNIOR (0-2 năm):</strong> <span className="text-[#00ff41] font-bold">{career.salaryJunior}</span></div>
              <div>• <strong>SENIOR (3-5+ năm):</strong> <span className="text-[#ff00ff] font-bold">{career.salarySenior}</span></div>
            </div>
          </div>
        </div>

        {/* Step-by-Step Milestones */}
        <div className="bg-[#111] p-4 border border-[#00ff41]/50 space-y-2 text-xs">
          <div className="font-bold uppercase text-[#00ff41]">CÁC CỘT MỐC LỘ TRÌNH TỪ CẤP 3 TỚI CHUYÊN GIA:</div>
          <div className="space-y-2 pt-1">
            {career.roadmap.map((step, i) => (
              <div key={i} className="flex items-start gap-2 text-xs opacity-90">
                <span className="w-5 h-5 bg-[#00ff41] text-[#0c0c0c] font-bold flex items-center justify-center text-[10px] shrink-0">
                  {i + 1}
                </span>
                <span>{step}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
