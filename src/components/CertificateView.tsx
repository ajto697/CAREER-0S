import React, { useState } from 'react';
import { UserProgress, Settings, WeeklyResult, TeacherState, CareerId } from '../types';
import { getCareerById } from '../data/careerData';
import { playSound } from '../utils/audio';
import { 
  Award, Sparkles, BookOpen, DollarSign, ArrowLeft, GraduationCap, 
  UserCheck, Shield, Heart, Users, CheckCircle2, AlertTriangle, Bookmark, 
  MessageSquare, Compass, RefreshCw, Download, Share2, Star, Zap, Trophy,
  FileText, Check, Film
} from 'lucide-react';
import { PixelCustomAvatarSprite, PixelShibaSprite } from './pixel/PixelArtSprites';
import { CinematicEndingModal } from './CinematicEndingModal';
import confetti from 'canvas-confetti';

interface Props {
  progress: UserProgress;
  settings: Settings;
  onBackToMap: () => void;
  onRestartGame?: () => void;
}

export const CertificateView: React.FC<Props> = ({ progress, settings, onBackToMap, onRestartGame }) => {
  const career = getCareerById(progress.chosenCareer || 'pedagogy');
  const teacherState = progress.teacherState;
  const [activeTab, setActiveTab] = useState<'certificate' | 'ending_story' | 'radar_review' | 'career_roadmap'>('certificate');
  const [isCinematicEndingOpen, setIsCinematicEndingOpen] = useState<boolean>(true);

  let totalScore = 0;
  let completedWeeks = 0;

  (Object.values(progress.weeklyResults) as WeeklyResult[]).forEach(res => {
    if (res.careerId === career.id) {
      totalScore += res.score;
      if (res.passed) completedWeeks++;
    }
  });

  let tierName = 'CẦN CỐ GẮNG';
  let tierColor = 'text-[#ff4444] border-[#ff4444] bg-[#111]';
  let tierDesc = 'Bạn cần cố gắng thêm để làm chủ đầy đủ kỹ năng nghiệp vụ.';

  if (totalScore >= 120) {
    tierName = 'XUẤT SẮC (EXCELLENCE)';
    tierColor = 'text-[#ff00ff] border-[#ff00ff] bg-[#111]';
    tierDesc = 'Chúc mừng! Bạn xuất sắc đạt danh hiệu Thực Tập Sinh Xuất Sắc & Mở Khóa Đầy Đủ Năng Lực!';
  } else if (totalScore >= 60) {
    tierName = 'ĐẠT (PASSED)';
    tierColor = 'text-[#00ff41] border-[#00ff41] bg-[#111]';
    tierDesc = 'Bạn đã hoàn thành tốt chương trình thực tập 8 tuần với kết quả đạt chuẩn nghề nghiệp.';
  }

  const handleTriggerConfetti = () => {
    playSound.confetti(settings.retroSound);
    confetti({ particleCount: 150, spread: 100, origin: { y: 0.5 } });
  };

  // Multiple Dynamic Endings Generator for ALL 5 Careers
  const generateCareerEnding = (careerId: CareerId, score: number, ts?: TeacherState) => {
    switch (careerId) {
      case 'education': {
        const state = ts || {
          trustMentor: 75,
          reputation: 75,
          moraleDuc: 70,
          moraleMinh: 70,
          moraleHoa: 70,
          parentTrustDuc: 70,
          classAtmosphere: 80,
          flags: []
        };
        const flags = state.flags || [];
        const isLoved = state.moraleDuc >= 60 && state.moraleMinh >= 60 && !flags.includes('ethics_compromised');
        const isRigid = state.reputation >= 60 && state.trustMentor >= 60 && !isLoved && !flags.includes('ethics_compromised');
        const hasEthicsIssue = flags.includes('ethics_compromised');

        if (isLoved) {
          return {
            title: '🏆 KẾT CỤC 1: NGƯỜI THẦY TRUYỀN CẢM HỨNG & THAY ĐỔI SỐ PHẬN',
            badge: 'Nhà Giáo Ưu Tú 10A3',
            color: 'border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]',
            mainStory: 'Hành trình 8 tuần thực tập rực rỡ! Bằng sự chân thành, thấu hiểu và phương pháp sư phạm kiên nhẫn, bạn đã chạm tới trái tim từng học trò. Em Đức không bỏ học mà vươn lên đạt học sinh khá, tích cực giúp đỡ gia đình. Em Minh xóa bỏ tự ti, tự tin dẫn chương trình Lễ tổng kết. Em Hoa giải tỏa áp lực thành tích từ phụ huynh. Lớp 10A3 chuyền tay nhau cuốn sổ lưu bút đong đầy nước mắt tri ân gửi tặng bạn.',
            mentorQuote: 'Cô Lan (Mentor): "Em sinh ra để làm nhà giáo! Sự thấu hiểu và bao dung của em đã giữ lại một tương lai cho trò nghèo và thắp sáng niềm tin cho tập thể 10A3."',
            specialStat: 'Tập thể 10A3 đạt danh hiệu Lớp Xuất Sắc Nhất Khối 10'
          };
        } else if (isRigid) {
          return {
            title: '🎖️ KẾT CỤC 2: NHÀ GIÁO VỮNG CHUYÊN MÔN & KỶ LUẬT CHUẨN MỰC',
            badge: 'Giáo Viên Cốt Cán Học Thuật',
            color: 'border-[#ff00ff] bg-[#ff00ff]/10 text-[#ff00ff]',
            mainStory: 'Bạn hoàn thành xuất sắc các tiết dạy hội giảng với giáo án 45 phút chuẩn mực, tác phong sư phạm nghiêm túc. Thầy Hùng Hiệu trưởng và Cô Lan đánh giá rất cao năng lực truyền thụ tri thức chuyên môn của bạn. Học sinh 10A3 nể phục sự công tâm và kỷ luật của bạn.',
            mentorQuote: 'Thầy Hùng (Hiệu trưởng): "Thầy rất ấn tượng với tác phong sư phạm vững vàng và tính nguyên tắc của em. Em sẽ là một giáo viên cốt cán giỏi chuyên môn."',
            specialStat: '100% Học sinh đạt chuẩn kiến thức trọng tâm kỳ thi khảo sát'
          };
        } else if (hasEthicsIssue) {
          return {
            title: '⚠️ KẾT CỤC 3: BÀI HỌC SƯ PHẠM SÂU SẮC VỀ ĐẠO ĐỨC NHÀ GIÁO',
            badge: 'Nhà Giáo Tập Sự Trưởng Thành',
            color: 'border-[#ff4444] bg-[#ff4444]/10 text-[#ff4444]',
            mainStory: '8 tuần thực tập đầy sóng gió đã cho bạn những bài học đắt giá. Việc thỏa hiệp trước áp lực điểm số đã ảnh hưởng tới uy tín sư phạm. Nhưng chính trải nghiệm này giúp bạn nhận ra: Danh dự, sự công bằng và tính trung thực mới là nền tảng cốt lõi nhất nâng đỡ ngọn đuốc nhà giáo.',
            mentorQuote: 'Cô Lan (Mentor): "Nghề giáo có những cám dỗ và áp lực rất lớn. Hãy coi đây là bài học xương máu để vững vàng hơn trên con đường tương lai."',
            specialStat: 'Tích lũy bài học danh dự và đạo đức nghề nghiệp sâu sắc'
          };
        } else {
          return {
            title: '🌱 KẾT CỤC 4: BÀI HỌC SƯ PHẠM VỀ LÒNG KIÊN NHẪN & BẢN LĨNH',
            badge: 'Nhà Giáo Tập Sự Tâm Huyết',
            color: 'border-yellow-400 bg-yellow-400/10 text-yellow-400',
            mainStory: '8 tuần đồng hành cùng 10A3 mang lại nhiều trải nghiệm thực tế quý báu. Dù còn đôi lúc lúng túng trước các tình huống khủng hoảng học đường, lòng nhiệt huyết của bạn đã để lại nhiều kỷ niệm đẹp trong lòng tập thể lớp.',
            mentorQuote: 'Cô Lan (Mentor): "Giáo án hay chỉ là một nửa tiết học, nửa còn lại là sự nhẫn nại và tình yêu thương. Cố lên em nhé!"',
            specialStat: 'Được học sinh bình chọn Thầy/Cô Thực Tập Thân Thiện Nhất'
          };
        }
      }

      case 'edtech': {
        if (score >= 120) {
          return {
            title: '🏆 KẾT CỤC 1: KIẾN TRÚC SƯ CÔNG NGHỆ AI & LEAD DEVELOPER ĐỘT PHÁ',
            badge: 'Lead Software Architect',
            color: 'border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]',
            mainStory: 'Bạn đã hoàn thiện xuất sắc nền tảng EdTech Core với thuật toán tối ưu, vượt qua bài kiểm thử tải hàng triệu người dùng đồng thời. CTO công ty ký quyết định trao học bổng tài trợ tài năng trẻ và mời bạn vào vị trí Kỹ Sư Phát Triển Chính thức ngay khi tốt nghiệp!',
            mentorQuote: 'Anh Hải (Tech Lead): "Code sạch, tư duy hệ thống mạch lạc và khả năng giải quyết bug xuất sắc. Em chính là thế hệ kỹ sư công nghệ tương lai của Việt Nam!"',
            specialStat: 'Tối ưu hiệu năng hệ thống đạt 99.99% Uptime & Phục vụ 100,000+ Học sinh'
          };
        } else if (score >= 60) {
          return {
            title: '🎖️ KẾT CỤC 2: KỸ SƯ LẬP TRÌNH PHẦN MỀM VỮNG CHẮC & ĐÁNG TIN CẬY',
            badge: 'Fullstack Software Engineer',
            color: 'border-[#38bdf8] bg-[#38bdf8]/10 text-[#38bdf8]',
            mainStory: '8 tuần thực tập giúp bạn làm chủ quy trình phát triển phần mềm chuẩn Agile/Scrum. Bạn đã đóng góp nhiều module quan trọng cho nền tảng học trực tuyến, xử lý trơn tru các pull request phức tạp.',
            mentorQuote: 'Anh Hải (Tech Lead): "Kỹ năng lập trình tốt, tinh thần học hỏi cao và luôn hoàn thành đúng deadline. Rất tự hào về em!"',
            specialStat: 'Đóng góp 48 Pull Requests và giải quyết 100% bug tồn đọng'
          };
        } else {
          return {
            title: '🌱 KẾT CỤC 3: LẬP TRÌNH VIÊN TẬP SỰ TRƯỞNG THÀNH TỪ THỬ THÁCH',
            badge: 'Junior Code Explorer',
            color: 'border-yellow-400 bg-yellow-400/10 text-yellow-400',
            mainStory: 'Môi trường công nghệ đòi hỏi tính chính xác tuyệt đối. Dù gặp nhiều thử thách ở các bài toán thuật toán nâng cao, bạn đã tích lũy được nền tảng tư duy lập trình vững chắc để sẵn sàng bứt phá.',
            mentorQuote: 'Anh Hải (Tech Lead): "Lập trình là hành trình vấp ngã và gỡ lỗi không ngừng. Đừng nản lòng, em đang đi đúng hướng!"',
            specialStat: 'Tích lũy 120 giờ rèn luyện tư duy thuật toán và gỡ lỗi'
          };
        }
      }

      case 'healthcare': {
        if (score >= 120) {
          return {
            title: '🏆 KẾT CỤC 1: BÁC SĨ TRƯỞNG TRẠM CẤP CỨU VÀNG & BÀN TAY HY VỌNG',
            badge: 'Bác Sĩ Lâm Sàng Xuất Sắc',
            color: 'border-[#ff3366] bg-[#ff3366]/10 text-[#ff3366]',
            mainStory: 'Tại phòng Cấp cứu hồi sức căng thẳng, bạn luôn giữ được cái đầu lạnh và trái tim ấm nóng. Các quyết định phân loại Triage và xử trí sốc phản vệ chính xác đã cứu sống nhiều bệnh nhân nguy kịch.',
            mentorQuote: 'Bác sĩ Trưởng Khoa Tuấn: "Em có phản xạ lâm sàng tuyệt vời và y đức sáng ngời. Ngành y tế nước nhà rất cần những bác sĩ như em!"',
            specialStat: 'Cứu chữa thành công 100% ca cấp cứu phức tạp tại Trạm Triage'
          };
        } else if (score >= 60) {
          return {
            title: '🎖️ KẾT CỤC 2: Y BÁC SĨ VỮNG TAY NGHỀ & TẬN TÂM VÌ NGƯỜI BỆNH',
            badge: 'Bác Sĩ Thực Hành Chuẩn Mực',
            color: 'border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]',
            mainStory: 'Bạn hoàn thành tốt các ca trực cấp cứu, nắm vững phác đồ điều trị và quy trình thăm khám bệnh nhân. Tinh thần trách nhiệm cao của bạn nhận được sự tin tưởng tuyệt đối từ đồng nghiệp và bệnh nhân.',
            mentorQuote: 'Bác sĩ Tuấn: "Thao tác chuẩn xác, chu đáo với từng người bệnh. Em đã sẵn sàng cho giảng đường Đại học Y Dược!"',
            specialStat: 'Hoàn thành 80 ca trực và lập bệnh án lâm sàng chuẩn Bộ Y Tế'
          };
        } else {
          return {
            title: '🌱 KẾT CỤC 3: BÀI HỌC VỀ ÁP LỰC VÀ SỨ MỆNH ÁO BLOUSE TRẮNG',
            badge: 'Y Sinh Tập Sự Kiên Cường',
            color: 'border-yellow-400 bg-yellow-400/10 text-yellow-400',
            mainStory: 'Áp lực ngàn cân tại phòng cấp cứu cho bạn hiểu sâu sắc giá trị của sự sống và cái giá của mỗi quyết định y khoa. Trải nghiệm này trui rèn bản lĩnh để bạn không bao giờ bỏ cuộc.',
            mentorQuote: 'Bác sĩ Tuấn: "Ngành y không có chỗ cho sự vội vàng. Hãy luôn kiên nhẫn và trau dồi tri thức mỗi ngày."',
            specialStat: 'Tích lũy bài học quý báu về kiểm soát khủng hoảng và tâm lý phòng cấp cứu'
          };
        }
      }

      case 'humanities': {
        if (score >= 120) {
          return {
            title: '🏆 KẾT CỤC 1: NHÀ BÁO ĐIỀU TRA XUẤT SẮC & CÂY BÚT BẢO VỆ CHÂN LÝ',
            badge: 'Nhà Báo Điều Tra Vàng',
            color: 'border-[#facc15] bg-[#facc15]/10 text-[#facc15]',
            mainStory: 'Loạt phóng sự điều tra và kiểm chứng tin giả (Fact-Check) của bạn đã vạch trần đường dây lừa đảo công nghệ cao, bảo vệ hàng vạn người dân. Tòa soạn trao tặng bạn giải thưởng Ngòi Bút Vàng Thực Tập Sinh!',
            mentorQuote: 'Tổng Biên Tập Thanh: "Sắc bén, dũng cảm và liêm chính. Ngòi bút của em đã mang lại ánh sáng chân lý cho cộng đồng!"',
            specialStat: 'Bài viết đạt 500,000 lượt đọc & Được trao Giải Ngòi Bút Trẻ Xuất Sắc'
          };
        } else if (score >= 60) {
          return {
            title: '🎖️ KẾT CỤC 2: PHÓNG VIÊN ĐA PHƯƠNG TIỆN SẮC SẢO & CHUYÊN NGHIỆP',
            badge: 'Phóng Viên Đa Phương Tiện',
            color: 'border-[#ff00ff] bg-[#ff00ff]/10 text-[#ff00ff]',
            mainStory: 'Bạn thể hiện năng lực sản xuất tin tức đa nền tảng xuất sắc từ phỏng vấn hiện trường, thu âm nhân chứng đến kiểm chứng pháp lý. Các bài viết luôn giữ vững tính khách quan và trung thực.',
            mentorQuote: 'Tổng Biên Tập Thanh: "Tốc độ đưa tin nhanh, tư duy phản biện tốt và tôn trọng sự thật. Rất triển vọng!"',
            specialStat: 'Xuất bản 16 tuyến bài điều tra và phỏng vấn chất lượng cao'
          };
        } else {
          return {
            title: '🌱 KẾT CỤC 3: CÂY BÚT TRẺ TRƯỞNG THÀNH TỪ ĐẠO ĐỨC TRUYỀN THÔNG',
            badge: 'Phóng Viên Tập Sự Trách Nhiệm',
            color: 'border-yellow-400 bg-yellow-400/10 text-yellow-400',
            mainStory: 'Thực tập tại tòa soạn báo chí giúp bạn nhận thức rõ sức mạnh và trách nhiệm của từng con chữ. Bạn hiểu rằng một ngòi bút có trách nhiệm quan trọng gấp trăm lần những dòng tin giật gân.',
            mentorQuote: 'Tổng Biên Tập Thanh: "Chân lý luôn cần thời gian để kiểm chứng. Hãy giữ cho ngòi bút luôn sáng và trái tim luôn trong."',
            specialStat: 'Tích lũy nền tảng đạo đức báo chí và kỹ năng thẩm tra nguồn tin'
          };
        }
      }

      case 'science':
      default: {
        if (score >= 120) {
          return {
            title: '🏆 KẾT CỤC 1: NHÀ KHOA HỌC TRẺ ĐỘT PHÁ & PHÁT MINH SINH HỌC',
            badge: 'Nhà Nghiên Cứu Đột Phá',
            color: 'border-[#00e5ff] bg-[#00e5ff]/10 text-[#00e5ff]',
            mainStory: 'Công trình giải trình tự gen và tối ưu hóa phản ứng sinh học của bạn tại phòng Lab đã mở ra hướng đi mới trong việc tổng hợp hợp chất kháng khuẩn tự nhiên. Hội Đồng Khoa Học đề cử công trình tham dự Hội nghị Khoa học Trẻ Quốc tế!',
            mentorQuote: 'Tiến sĩ Minh (Lab Director): "Sự tỉ mỉ, kiên định và tư duy nghiên cứu của em đạt chuẩn của một nhà khoa học thực thụ!"',
            specialStat: 'Phát hiện hoạt chất kháng khuẩn sinh học đạt hiệu suất 98.6%'
          };
        } else if (score >= 60) {
          return {
            title: '🎖️ KẾT CỤC 2: CHUYÊN VIÊN PHÒNG THÍ NGHIỆM CHUẨN MỰC & ĐỘC LẬP',
            badge: 'Kỹ Thuật Viên Lab Chuẩn Mực',
            color: 'border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]',
            mainStory: 'Bạn đã làm chủ đầy đủ các thiết bị phân tích hiện đại từ sắc ký TLC đến kính hiển vi quang học 1000x, thực hiện các thí nghiệm với độ chính xác cao và tuân thủ nghiêm ngặt an toàn sinh học.',
            mentorQuote: 'Tiến sĩ Minh: "Kỹ năng thực hành phòng lab rất vững và ghi chép nhật ký khoa học chuẩn mực. Tương lai nghiên cứu rộng mở!"',
            specialStat: 'Hoàn thành 32 quy trình thí nghiệm không sai số và chuẩn hóa báo cáo'
          };
        } else {
          return {
            title: '🌱 KẾT CỤC 3: BÀI HỌC VỀ TÍNH CHÍNH XÁC & KIÊN TRÌ KHOA HỌC',
            badge: 'Nhà Nghiên Cứu Trẻ Kiên Trì',
            color: 'border-yellow-400 bg-yellow-400/10 text-yellow-400',
            mainStory: 'Khoa học là con đường đòi hỏi sự kiên nhẫn vô hạn qua hàng trăm lần thử nghiệm thất bại để tìm ra một kết quả đúng. 8 tuần qua đã trui rèn cho bạn đức tính cẩn trọng của người làm khoa học.',
            mentorQuote: 'Tiến sĩ Minh: "Thất bại trong thí nghiệm chính là người thầy dạy ta quy luật tự nhiên. Đừng dừng bước nhé!"',
            specialStat: 'Tích lũy 100 giờ quan sát vi sinh vật và phương pháp kiểm chứng khoa học'
          };
        }
      }
    }
  };

  const careerEnding = generateCareerEnding(career.id, totalScore, teacherState);

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-mono text-[#00ff41] select-none pb-16">
      
      {/* Top Header: Màn Kết Thúc & Lễ Tốt Nghiệp Trao Bằng */}
      <div className="bg-[#080d08] border-2 border-[#00ff41] p-4 sm:p-5 relative overflow-hidden shadow-[0_0_30px_rgba(0,255,65,0.3)]">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#00ff41] text-[#0c0c0c] font-black text-xs px-2.5 py-0.5 uppercase tracking-wide">
                MÀN KẾT THÚC // HỒI KẾT & ĐẠI LỄ TỐT NGHIỆP TRAO BẰNG
              </span>
              <span className="text-xs text-[#ff00ff] bg-[#111] px-2 py-0.5 border border-[#ff00ff]/50 font-bold">
                8/8 TUẦN HOÀN TẤT
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider mt-2 flex items-center gap-2">
              <span>ĐẠI LỄ TỐT NGHIỆP CAREEROS V5.0</span>
              <Sparkles className="w-6 h-6 text-[#ffea00] animate-bounce" />
            </h2>
            <p className="text-xs text-[#00ff41] opacity-80 mt-1 max-w-2xl leading-relaxed">
              Xin chúc mừng! Bạn đã hoàn thành xuất sắc toàn bộ 8 tuần thực tập sinh làm thật.
              Hồ sơ năng lực, điểm số O*NET Holland và các quyết định nghề nghiệp của bạn đã được ghi nhận vào Chứng Nhận Chính Thức!
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              onClick={() => {
                playSound.click(settings.retroSound);
                setIsCinematicEndingOpen(true);
              }}
              className="px-4 py-2.5 bg-[#ffea00] text-black font-black text-xs uppercase flex items-center gap-2 border-2 border-white hover:bg-yellow-400 transition-all shadow-[0_0_20px_rgba(255,234,0,0.8)] cursor-pointer animate-pulse"
            >
              <Film className="w-4 h-4 text-black" />
              <span>🎬 XEM THƯỚC PHIM KẾT THÚC ĐIỆN ẢNH (VIDEO)</span>
            </button>

            <button
              onClick={handleTriggerConfetti}
              className="px-4 py-2.5 bg-[#00ff41] text-[#0c0c0c] font-black text-xs uppercase flex items-center gap-2 border-2 border-white hover:bg-[#00e53a] transition-all shadow-[0_0_15px_rgba(0,255,65,0.6)] cursor-pointer"
            >
              <Sparkles className="w-4 h-4 fill-current" />
              <span>BẮN PHÁO HOA 🎉</span>
            </button>

            <button
              onClick={() => { playSound.click(settings.retroSound); onBackToMap(); }}
              className="px-3.5 py-2.5 border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c] text-xs font-bold uppercase flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>VỀ BẢN ĐỒ ĐÔ THỊ</span>
            </button>
          </div>
        </div>

        {/* Tab Navigation in Ending Ceremony */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#00ff41]/30">
          <button
            onClick={() => { playSound.click(settings.retroSound); setActiveTab('certificate'); }}
            className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 border transition-all cursor-pointer ${
              activeTab === 'certificate'
                ? 'bg-[#00ff41] text-black border-white shadow-[0_0_10px_#00ff41]'
                : 'bg-black text-[#00ff41] border-[#00ff41]/50 hover:border-[#00ff41]'
            }`}
          >
            <Award className="w-4 h-4" />
            <span>1. BẰNG CHỨNG NHẬN CHÍNH THỨC</span>
          </button>

          <button
            onClick={() => { playSound.click(settings.retroSound); setActiveTab('ending_story'); }}
            className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 border transition-all cursor-pointer ${
              activeTab === 'ending_story'
                ? 'bg-[#ff00ff] text-black border-white shadow-[0_0_10px_#ff00ff]'
                : 'bg-black text-[#ff00ff] border-[#ff00ff]/50 hover:border-[#ff00ff]'
            }`}
          >
            <Trophy className="w-4 h-4" />
            <span>2. KẾT CỤC CỐT TRUYỆN (DYNAMIC ENDING)</span>
          </button>

          <button
            onClick={() => { playSound.click(settings.retroSound); setActiveTab('radar_review'); }}
            className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 border transition-all cursor-pointer ${
              activeTab === 'radar_review'
                ? 'bg-[#00ffff] text-black border-white shadow-[0_0_10px_#00ffff]'
                : 'bg-black text-[#00ffff] border-[#00ffff]/50 hover:border-[#00ffff]'
            }`}
          >
            <Zap className="w-4 h-4" />
            <span>3. ĐIỂM SỐ NĂNG LỰC & CÂY KỸ NĂNG</span>
          </button>

          <button
            onClick={() => { playSound.click(settings.retroSound); setActiveTab('career_roadmap'); }}
            className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-1.5 border transition-all cursor-pointer ${
              activeTab === 'career_roadmap'
                ? 'bg-[#ffea00] text-black border-white shadow-[0_0_10px_#ffea00]'
                : 'bg-black text-[#ffea00] border-[#ffea00]/50 hover:border-[#ffea00]'
            }`}
          >
            <GraduationCap className="w-4 h-4" />
            <span>4. LỘ TRÌNH ĐẠI HỌC & THỊ TRƯỜNG</span>
          </button>
        </div>
      </div>

      {/* TAB 1: OFFICIAL GRADUATION CERTIFICATE */}
      {activeTab === 'certificate' && (
        <div className="bg-[#0c0c0c] border-4 border-[#00ff41] p-6 sm:p-10 shadow-2xl relative text-center space-y-6">
          <div className="absolute top-6 right-6 opacity-10 pointer-events-none">
            <Award className="w-44 h-44 text-[#00ff41]" />
          </div>

          {/* Certificate Header */}
          <div className="space-y-2">
            <div className="inline-block bg-[#00ff41] text-[#0c0c0c] font-black text-xs px-4 py-1 uppercase tracking-wider">
              HỆ ĐIỀU HÀNH HƯỚNG NGHIỆP CAREEROS V5.0 • CHUẨN BỘ GD&ĐT VIỆT NAM
            </div>
            <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-wider text-[#00ff41] pt-1">
              CHỨNG NHẬN HOÀN THÀNH THỰC TẬP NGHỀ NGHIỆP
            </h1>
            <p className="text-xs opacity-70 uppercase tracking-widest text-[#00ff41]">
              OFFICIAL CERTIFICATE OF CAREER INTERNSHIP EXCELLENCE
            </p>
          </div>

          {/* Student Name & Info with 8-Bit Pixel Character */}
          <div className="py-6 border-y-2 border-[#00ff41]/50 max-w-3xl mx-auto flex flex-col sm:flex-row items-center justify-center gap-6 bg-[#060a07] p-4">
            {/* Custom Avatar Sprite with Graduation Cap */}
            <div className="shrink-0 p-2 border-2 border-[#00ff41] bg-[#000] shadow-[0_0_20px_rgba(0,255,65,0.4)]">
              <PixelCustomAvatarSprite
                config={progress.customAvatar || {
                  gender: 'male',
                  skinTone: 'warm',
                  hairStyle: 'spiky',
                  hairColor: 'black',
                  outfit: 'school_uniform',
                  outfitColor: 'green',
                  accessory: 'none',
                  headgear: 'grad_cap',
                  heldItem: 'certificate',
                  companion: 'shiba',
                  title: 'Thực Tập Sinh Xuất Sắc',
                  expression: 'triumph'
                }}
                size={84}
                animate={true}
                showCompanion={true}
                showTitle={true}
                actionPose="triumph"
              />
            </div>

            <div className="space-y-1.5 text-center sm:text-left">
              <div className="text-[10px] opacity-70 uppercase tracking-wider text-[#00ff41]">THỰC TẬP SINH TỐT NGHIỆP</div>
              <div className="text-2xl sm:text-3xl font-black text-[#00ff41] uppercase tracking-wide">
                {progress.name || 'HỌC SINH THPT'}
              </div>
              <div className="text-xs text-[#ff00ff] font-bold">
                TRƯỜNG: {progress.school || 'THPT'} — LỚP: {progress.className || '12A1'}
              </div>
              <div className="text-[11px] text-[#00e5ff] font-bold">
                MÃ HOLLAND: [{progress.hollandCode || 'RIASEC'}] — DANH HIỆU: {progress.customAvatar?.title || careerEnding.badge}
              </div>
            </div>
          </div>

          {/* Career & Tier Accomplishment */}
          <div className="space-y-2.5">
            <p className="text-xs sm:text-sm">
              Đã hoàn thành xuất sắc chương trình mô phỏng <strong className="text-[#ff00ff]">{completedWeeks}/8 Tuần thực tập làm thật</strong> thuộc ngành:
            </p>
            <div className="text-xl sm:text-2xl font-black uppercase text-[#00ff41]">
              {career.name}
            </div>

            <div className={`inline-block px-6 py-2.5 border-2 text-sm font-bold uppercase shadow-lg ${tierColor}`}>
              MỨC XẾP LOẠI: {tierName} ({totalScore} ĐIỂM NGHIỆP VỤ)
            </div>
            <p className="text-xs opacity-80 max-w-lg mx-auto leading-relaxed">{tierDesc}</p>
          </div>

          {/* Seal Stamp & Verification */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-8 text-xs text-[#00ff41] opacity-90 border-t border-[#00ff41]/30">
            <div>
              <div className="text-[10px] opacity-70">NGÀY CẤP CHỨNG NHẬN</div>
              <div className="font-bold text-white">{new Date().toLocaleDateString('vi-VN')}</div>
            </div>

            <div className="w-20 h-20 bg-[#111] border-2 border-[#00ff41] flex flex-col items-center justify-center font-bold text-[9px] uppercase rotate-6 text-[#ff00ff] shadow-[0_0_15px_rgba(255,0,255,0.4)]">
              <span>CAREEROS</span>
              <span className="text-[#00ff41]">V5.0</span>
              <span className="text-[8px] text-white">VERIFIED</span>
            </div>

            <div>
              <div className="text-[10px] opacity-70">MÃ XÁC THỰC LƯU MÁY</div>
              <div className="font-bold text-[#00ffff]">#OS5-8W-{career.id.toUpperCase()}-{Math.floor(Math.random()*9000+1000)}</div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: DYNAMIC MULTIPLE CAREER ENDING STORY */}
      {activeTab === 'ending_story' && (
        <div className="space-y-6">
          <div className="bg-[#0c0c0c] border-4 border-[#00ff41] p-6 space-y-5 shadow-2xl relative">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#00ff41]/50 pb-3 gap-2">
              <div className="flex items-center gap-2">
                <Trophy className="w-6 h-6 text-[#ff00ff] shrink-0" />
                <h2 className="text-base sm:text-lg font-black uppercase tracking-wider text-[#00ff41]">
                  BÁO CÁO HỒI KẾT THỰC TẬP: {career.name.toUpperCase()}
                </h2>
              </div>
              <span className="bg-[#111] text-[#ff00ff] border border-[#ff00ff] px-3 py-1 text-xs font-bold uppercase shrink-0">
                {careerEnding.badge}
              </span>
            </div>

            {/* Ending Cutscene Box */}
            <div className={`p-5 border-2 space-y-3 ${careerEnding.color}`}>
              <h3 className="text-base font-black uppercase tracking-wide">
                {careerEnding.title}
              </h3>
              <p className="text-xs sm:text-sm leading-relaxed text-white">
                {careerEnding.mainStory}
              </p>
              
              <div className="bg-[#000]/80 p-3 border-l-4 border-[#ff00ff] text-xs font-semibold italic text-[#00ff41]">
                {careerEnding.mentorQuote}
              </div>

              <div className="pt-2 text-xs font-bold text-[#ffea00] flex items-center gap-1.5">
                <Star className="w-4 h-4 fill-current" />
                <span>THÀNH TÍCH ĐẶC BIỆT: {careerEnding.specialStat}</span>
              </div>
            </div>

            {/* Specific Pedagogy Student Follow-ups if applicable */}
            {career.id === 'education' && teacherState && (
              <div className="space-y-4 pt-2">
                <h4 className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                  <Users className="w-4 h-4 text-[#ff00ff]" />
                  CHỈ SỐ SƯ PHẠM VÀ SỐ PHẬN 3 HỌC TRÒ 10A3:
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
                    <span className="text-[10px] opacity-70 text-white block">NIỀM TIN PHỤ HUYNH</span>
                    <span className="text-base font-black text-[#00ff41]">{teacherState.parentTrustDuc} / 100</span>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                  <div className="bg-[#000] p-3 border border-[#ff4444]/60 space-y-1">
                    <div className="font-bold text-[#ff4444] flex items-center justify-between">
                      <span>EM ĐỨC (CÁ BIỆT)</span>
                      <span className="text-[10px] text-white">{teacherState.moraleDuc}% Tự giác</span>
                    </div>
                    <p className="text-[11px] text-white/90 leading-tight">
                      {teacherState.moraleDuc >= 60 ? 'Vượt qua nghịch cảnh, vươn lên đạt học sinh khá & tiếp tục đến trường.' : 'Còn nhiều vướng mắc tâm lý nhưng không bỏ học.'}
                    </p>
                  </div>

                  <div className="bg-[#000] p-3 border border-[#ff00ff]/60 space-y-1">
                    <div className="font-bold text-[#ff00ff] flex items-center justify-between">
                      <span>EM MINH (TỰ TI)</span>
                      <span className="text-[10px] text-white">{teacherState.moraleMinh}% Tự tin</span>
                    </div>
                    <p className="text-[11px] text-white/90 leading-tight">
                      {teacherState.moraleMinh >= 60 ? 'Xóa bỏ tự ti, tự tin phát biểu & làm MC Lễ bế giảng.' : 'Có tiến bộ rõ rệt trong các giờ thảo luận nhóm.'}
                    </p>
                  </div>

                  <div className="bg-[#000] p-3 border border-yellow-400/60 space-y-1">
                    <div className="font-bold text-yellow-400 flex items-center justify-between">
                      <span>EM HOA (ÁP LỰC)</span>
                      <span className="text-[10px] text-white">{teacherState.moraleHoa}% Tâm lý</span>
                    </div>
                    <p className="text-[11px] text-white/90 leading-tight">
                      {teacherState.moraleHoa >= 60 ? 'Giải tỏa áp lực thành tích gia đình, giữ vững tinh thần tự giác.' : 'Tâm lý ổn định hơn và hòa nhập tốt với lớp.'}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 3: RADAR TRAITS & SKILL TREE REVIEW */}
      {activeTab === 'radar_review' && (
        <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-6 space-y-5 shadow-xl">
          <div className="flex items-center justify-between border-b border-[#00ff41]/40 pb-3">
            <h3 className="text-base font-bold uppercase text-[#00ff41] flex items-center gap-2">
              <Zap className="w-5 h-5 text-[#ffea00]" />
              <span>SƠ ĐỒ NĂNG LỰC RADAR HOLLAND & ĐIỂM KỸ NĂNG (SP)</span>
            </h3>
            <span className="text-xs text-[#00ff41] bg-black px-2 py-0.5 border border-[#00ff41]">
              ĐIỂM SP TÍCH LŨY: {progress.skillPoints || 0} SP
            </span>
          </div>

          {/* 6 Holland Traits Breakdown */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 text-xs">
            <div className="bg-[#111] p-3 border border-[#00ff41]/40 text-center space-y-1">
              <span className="text-[10px] text-white/60 block">KIÊN CƯỜNG (R)</span>
              <span className="text-lg font-black text-[#00ff41]">{progress.radarTraits.kiencuong}</span>
            </div>
            <div className="bg-[#111] p-3 border border-[#00ff41]/40 text-center space-y-1">
              <span className="text-[10px] text-white/60 block">PHÂN TÍCH (I)</span>
              <span className="text-lg font-black text-[#00ffff]">{progress.radarTraits.phantich}</span>
            </div>
            <div className="bg-[#111] p-3 border border-[#00ff41]/40 text-center space-y-1">
              <span className="text-[10px] text-white/60 block">SÁNG TẠO (A)</span>
              <span className="text-lg font-black text-[#ff00ff]">{progress.radarTraits.sangtao}</span>
            </div>
            <div className="bg-[#111] p-3 border border-[#00ff41]/40 text-center space-y-1">
              <span className="text-[10px] text-white/60 block">CẢM THÔNG (S)</span>
              <span className="text-lg font-black text-[#ffea00]">{progress.radarTraits.camthong}</span>
            </div>
            <div className="bg-[#111] p-3 border border-[#00ff41]/40 text-center space-y-1">
              <span className="text-[10px] text-white/60 block">LÃNH ĐẠO (E)</span>
              <span className="text-lg font-black text-[#f97316]">{progress.radarTraits.lanhdao}</span>
            </div>
            <div className="bg-[#111] p-3 border border-[#00ff41]/40 text-center space-y-1">
              <span className="text-[10px] text-white/60 block">KỶ LUẬT (C)</span>
              <span className="text-lg font-black text-[#38bdf8]">{progress.radarTraits.kyluat}</span>
            </div>
          </div>

          {/* Reflections and Weekly Progress */}
          <div className="bg-[#111] p-4 border border-[#00ff41]/40 space-y-2 text-xs">
            <h4 className="font-bold text-white uppercase">TỔNG HỢP 8 BÀI THỰC TẬP & NHẬT KÝ PHẢN TƯ:</h4>
            <div className="space-y-1.5 pt-1 max-h-48 overflow-y-auto pr-1">
              {Array.from({ length: 8 }).map((_, wIdx) => {
                const weekNum = wIdx + 1;
                const result = progress.weeklyResults[`${career.id}_w${weekNum}`];
                const reflection = progress.reflections[`${career.id}_w${weekNum}`];

                return (
                  <div key={weekNum} className="p-2 bg-black border border-[#00ff41]/30 flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-[11px]">
                    <div className="flex items-center gap-2">
                      <span className="text-[#00ff41] font-bold">TUẦN {weekNum}:</span>
                      <span className="text-white">{result ? `Hoàn thành (${result.score} điểm)` : 'Chưa thực hiện'}</span>
                    </div>
                    {reflection && (
                      <span className="text-white/70 italic truncate sm:max-w-md">"{reflection}"</span>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: REAL CAREER PATHWAY & SALARY ROADMAP */}
      {activeTab === 'career_roadmap' && (
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
                <span className="opacity-70 block text-[11px] mb-1">TRƯỜNG ĐẠI HỌC HÀNG ĐẦU TẠI VIỆT NAM:</span>
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
      )}

      {/* Bottom Actions Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t border-[#00ff41]/30">
        <button
          onClick={() => { playSound.click(settings.retroSound); onBackToMap(); }}
          className="px-4 py-2.5 bg-[#111] border border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-black font-bold text-xs uppercase transition-all flex items-center gap-2 cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>QUAY LẠI BẢN ĐỒ THÀNH PHỐ ĐỂ THỰC TẬP NGÀNH KHÁC</span>
        </button>

        {onRestartGame && (
          <button
            onClick={onRestartGame}
            className="px-4 py-2.5 bg-[#ff00ff]/20 border border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black font-bold text-xs uppercase transition-all flex items-center gap-2 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            <span>CHƠI LẠI TỪ MÀN MỞ ĐẦU</span>
          </button>
        )}
      </div>

      {/* Cinematic Ending Modal */}
      <CinematicEndingModal
        progress={progress}
        settings={settings}
        isOpen={isCinematicEndingOpen}
        onClose={() => setIsCinematicEndingOpen(false)}
        onViewCertificate={() => {
          setIsCinematicEndingOpen(false);
          setActiveTab('certificate');
        }}
      />

    </div>
  );
};
