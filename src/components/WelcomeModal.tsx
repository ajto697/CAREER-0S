import React, { useState } from 'react';
import { UserProgress, Settings } from '../types';
import { playSound } from '../utils/audio';
import { IntroSequence } from './IntroSequence';
import { GameIntroCutscene } from './GameIntroCutscene';
import { Compass, Sparkles, ArrowRight, BookOpen, Play, ChevronLeft, ChevronRight, Terminal, Award, ShieldCheck, Zap, Laptop, HeartPulse, Newspaper, FlaskConical, GraduationCap, Palette } from 'lucide-react';
import { PixelShibaSprite, PixelCustomAvatarSprite } from './pixel/PixelArtSprites';

interface Props {
  progress: UserProgress;
  settings: Settings;
  onStartQuizGate: (info: { name: string; school: string; className: string }) => void;
  onStartCityMapGate: (info: { name: string; school: string; className: string }) => void;
  onOpenAvatarStudio?: () => void;
}

type Mode = 'start_screen' | 'intro_story' | 'profile_setup';

export const WelcomeModal: React.FC<Props> = ({
  progress,
  settings,
  onStartQuizGate,
  onStartCityMapGate,
  onOpenAvatarStudio
}) => {
  const [mode, setMode] = useState<Mode>('start_screen');
  const [storyStep, setStoryStep] = useState<number>(0);

  const [name, setName] = useState(progress.name || 'HỌC SINH_01');
  const [school, setSchool] = useState(progress.school || 'THPT CHUYÊN');
  const [className, setClassName] = useState(progress.className || '12A1');

  const info = { name: name.trim() || 'HỌC SINH', school: school.trim() || 'THPT', className: className.trim() || '12A1' };

  // Story Slides Definition
  const storySlides = [
    {
      title: 'THÁCH THỨC CHỌN NGÀNH THỜI ĐẠI MỚI',
      tag: '01 // BỐI CẢNH GDPT 2018',
      avatar: 'SYSTEM_AI',
      icon: Terminal,
      content: 'Chào mừng bạn đến với CAREER-OS! Lựa chọn khối ngành học Cấp 3 và ngành nghề Đại học là một trong những quyết định lớn nhất của học sinh THPT. Tuy nhiên, các bài test chọn A/B/C trên giấy thường quá lý thuyết, chưa cho bạn hình dung công việc thực tế ra sao.',
      highlight: '👉 Bạn cần trải nghiệm làm thật trên công cụ thực tế trước khi đưa ra lựa chọn!'
    },
    {
      title: 'MÔ PHỎNG 8 TUẦN THỰC TẬP TRÊN CÔNG CỤ THẬT',
      tag: '02 // GIẢI PHÁP THỰC TẬP',
      avatar: 'CAREER_OS',
      icon: Zap,
      content: 'CAREER-OS đưa bạn nhập vai vào 1 trong 5 ngành trọng điểm: Công nghệ EdTech, Y tế Cấp cứu, Báo chí Fact-Check, Lab Công nghệ sinh học và Sư phạm. Bạn sẽ trải qua 8 tuần thực tập giải quyết các task nghiệp vụ chân thực trên công cụ tương tác thật.',
      highlight: '🛠️ Tự tay viết code JavaScript, phân loại bệnh nhân cấp cứu, kiểm tra tin giả, kiểm soát phản ứng sinh học và thiết kế giáo án 45 phút.'
    },
    {
      title: 'SƠ ĐỒ NĂNG LỰC RADAR & ĐẠO ĐỨC NGHỀ NGHIỆP',
      tag: '03 // ĐIỂM SỐ & DỮ LIỆU THẬT',
      avatar: 'RADAR_ENGINE',
      icon: ShieldCheck,
      content: 'Mọi kết quả công việc và bài viết nhật ký phản tư của bạn sẽ lập tức tích lũy vào Sơ Đồ Radar 6 nhóm Holland O*NET (Kiên cường, Phân tích, Sáng tạo, Cảm thông, Lãnh đạo, Kỷ luật). Điểm số hoàn toàn minh bạch, bảo mật 100% trên thiết bị của bạn.',
      highlight: '📊 Tích lũy điểm thật từ công việc thật, không có sự phỏng đoán hay giả lập hời hợt!'
    },
    {
      title: 'CHỨNG NHẬN TỐT NGHIỆP & LỘ TRÌNH ĐẠI HỌC',
      tag: '04 // HÀNH TRANG TƯƠNG LAI',
      avatar: 'GRADUATION_CAP',
      icon: Award,
      content: 'Sau 8 tuần hoàn thành thực tập, bạn sẽ mở khóa Chứng Nhận Tốt Nghiệp CAREER-OS chính thức kèm Báo cáo lộ trình: Môn học GDPT 2018 cần tập trung, Top trường Đại học đào tạo hàng đầu tại Việt Nam và mức lương tham chiếu thực tế.',
      highlight: '🎓 Thiết lập hồ sơ học sinh thi đua ngay bây giờ và bắt đầu hành trình chinh phục tương lai!'
    }
  ];

  return (
    <div className="max-w-4xl mx-auto my-6 bg-[#0c0c0c] border-4 border-[#00ff41] p-5 sm:p-8 shadow-[0_0_40px_rgba(0,255,65,0.3)] space-y-6 font-mono text-[#00ff41] relative select-none pixelated">
      
      {/* MODE 1: MAIN START SCREEN */}
      {mode === 'start_screen' && (
        <div className="space-y-6 text-center">
          {/* Top Arcade ASCII Header Banner */}
          <div className="border-2 border-[#00ff41] p-4 bg-[#111] space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-center gap-3">
              <PixelShibaSprite size={36} mood="triumph" accessory="grad_cap" />
              <div className="inline-block bg-[#00ff41] text-[#0c0c0c] font-pixel font-bold text-xs px-3 py-1 uppercase tracking-widest">
                ARCADE BOOT // CAREER-OS V5.0
              </div>
              <PixelShibaSprite size={36} mood="happy" accessory="cyber_visor" />
            </div>

            <pre className="text-[8px] sm:text-[10px] leading-tight text-[#00ff41] font-bold overflow-x-auto py-2 font-mono">
{`██████╗ █████╗ ██████╗ ███████╗███████╗██╗  ██╗   ██████╗ ███████╗
██╔════╝██╔══██╗██╔══██╗██╔════╝██╔════╝██║  ██║  ██╔═══██╗██╔════╝
██║     ███████║██████╔╝█████╗  █████╗  ███████║  ██║   ██║███████╗
██║     ██╔══██╗██╔══██╗██╔══╝  ██╔══╝  ██╔══██║  ██║   ██║╚════██║
╚██████╗██║  ██║██║  ██║███████╗███████╗██║  ██║  ╚██████╔╝███████║`}
            </pre>

            <h1 className="text-sm sm:text-xl font-pixel font-bold uppercase tracking-wider text-[#00ff41]">
              HỆ ĐIỀU HÀNH 8-BIT THỰC TẬP HƯỚNG NGHIỆP
            </h1>
            <p className="text-xs text-white/90 max-w-xl mx-auto font-mono">
              "Năng lực từ việc làm thật, không phải từ chọn A/B/C" — Trải nghiệm thực tập sinh 5 ngành nghề trên công cụ nghiệp vụ thực tế!
            </p>
          </div>

          {/* 5 Careers Badge Feed */}
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
            <div className="p-2.5 bg-[#111] border border-[#00ff41] flex flex-col items-center gap-1">
              <Laptop className="w-5 h-5 text-[#00ff41]" />
              <span className="font-bold text-[10px] uppercase">1. EDTECH DEV</span>
            </div>
            <div className="p-2.5 bg-[#111] border border-[#00ff41] flex flex-col items-center gap-1">
              <HeartPulse className="w-5 h-5 text-[#ff00ff]" />
              <span className="font-bold text-[10px] uppercase text-[#ff00ff]">2. Y TẾ CẤP CỨU</span>
            </div>
            <div className="p-2.5 bg-[#111] border border-[#00ff41] flex flex-col items-center gap-1">
              <Newspaper className="w-5 h-5 text-[#00ff41]" />
              <span className="font-bold text-[10px] uppercase">3. BÁO CHÍ FACT-CHECK</span>
            </div>
            <div className="p-2.5 bg-[#111] border border-[#00ff41] flex flex-col items-center gap-1">
              <FlaskConical className="w-5 h-5 text-[#ff00ff]" />
              <span className="font-bold text-[10px] uppercase text-[#ff00ff]">4. LAB SINH HỌC</span>
            </div>
            <div className="p-2.5 bg-[#111] border border-[#00ff41] flex flex-col items-center gap-1 col-span-2 sm:col-span-1">
              <GraduationCap className="w-5 h-5 text-[#00ff41]" />
              <span className="font-bold text-[10px] uppercase">5. SƯ PHẠM 45M</span>
            </div>
          </div>

          {/* Intro Story Teaser Box */}
          <div className="bg-[#111] p-4 border border-[#00ff41]/50 text-left space-y-2 text-xs">
            <div className="flex items-center justify-between text-[#00ff41] font-bold text-xs uppercase border-b border-[#00ff41]/30 pb-1.5">
              <span className="flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 text-[#ff00ff]" />
                TẠI SAO BẠN CẦN THAM GIA CAREER-OS SIMULATOR?
              </span>
              <span className="text-[10px] text-[#ff00ff]">[MỚI V5.0]</span>
            </div>
            <p className="opacity-90 leading-relaxed text-xs">
              Thực tập sinh sẽ trực tiếp tương tác với các công cụ nghiệp vụ thật, giải quyết bài toán thực tế, tích lũy điểm trên sơ đồ Radar O*NET và xuất báo cáo CSV cho giáo viên hướng nghiệp.
            </p>
          </div>

          {/* Primary Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
            <button
              onClick={() => { playSound.click(settings.retroSound); setMode('intro_story'); setStoryStep(0); }}
              className="py-3.5 bg-[#111] text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c] font-bold text-xs flex items-center justify-center gap-2 border-2 border-[#00ff41] transition-all uppercase"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>🎬 XEM INTRO CÂU CHUYỆN GAME</span>
            </button>

            <button
              onClick={() => { playSound.click(settings.retroSound); setMode('profile_setup'); }}
              className="py-3.5 bg-[#00ff41] text-[#0c0c0c] font-bold text-xs flex items-center justify-center gap-2 border-2 border-[#00ff41] hover:bg-[#00e53a] transition-all uppercase shadow-lg"
            >
              <Zap className="w-4 h-4" />
              <span>⚡ BẮT ĐẦU VÀO GAME (PRESS START)</span>
            </button>
          </div>
        </div>
      )}

      {/* MODE 2: INTERACTIVE STORY CINEMA INTRO */}
      {mode === 'intro_story' && (
        <IntroSequence
          settings={settings}
          onComplete={() => setMode('profile_setup')}
        />
      )}

      {/* MODE 3: STUDENT PROFILE CREATION & GATE ENTRY */}
      {mode === 'profile_setup' && (
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between border-b-2 border-[#00ff41] pb-3">
            <div>
              <div className="inline-block bg-[#00ff41] text-[#0c0c0c] font-bold text-xs px-2 py-0.5 uppercase">
                THIẾT LẬP HỒ SƠ HỌC SINH
              </div>
              <h2 className="text-xl font-bold uppercase text-[#00ff41] pt-1">
                LỰA CHỌN CỔNG VÀO CAREER-OS
              </h2>
            </div>

            <button
              onClick={() => { playSound.click(settings.retroSound); setMode('start_screen'); }}
              className="text-xs text-[#00ff41] underline hover:text-[#ff00ff] font-bold uppercase"
            >
              [ ↺ XEM LẠI INTRO ]
            </button>
          </div>

          {/* Profile Input Form with Custom Avatar Preview */}
          <div className="bg-[#111] p-5 border-2 border-[#00ff41] space-y-4 text-xs">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#00ff41]/30 pb-2">
              <div className="text-[#00ff41] font-bold uppercase text-[11px] flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-[#00ff41]" />
                <span>[ THÔNG TIN HỌC SINH & NHÂN VẬT PIXEL ]</span>
              </div>
              {onOpenAvatarStudio && (
                <button
                  onClick={() => { playSound.click(settings.retroSound); onOpenAvatarStudio(); }}
                  className="px-3 py-1 bg-[#ff00ff] text-black hover:bg-[#ff44ff] font-pixel font-bold text-[10px] uppercase flex items-center gap-1.5 shadow-[0_0_10px_rgba(255,0,255,0.4)] transition-all"
                >
                  <Palette className="w-3.5 h-3.5" />
                  <span>🎨 TÙY CHỈNH NHÂN VẬT PIXEL</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Avatar Preview Box */}
              <div className="sm:col-span-4 bg-[#080d09] border border-[#00ff41]/50 p-3 flex flex-col items-center justify-center space-y-2 rounded">
                <PixelCustomAvatarSprite
                  config={progress.customAvatar || {
                    gender: 'male',
                    skinTone: 'warm',
                    hairStyle: 'spiky',
                    hairColor: 'black',
                    outfit: 'cyber_hoodie',
                    outfitColor: 'green',
                    accessory: 'cyber_visor',
                    headgear: 'none',
                    heldItem: 'laptop',
                    companion: 'shiba',
                    title: 'Thực Tập Sinh',
                    expression: 'smile'
                  }}
                  size={68}
                  animate={true}
                  showCompanion={true}
                  showTitle={true}
                />
                {onOpenAvatarStudio && (
                  <button
                    onClick={() => { playSound.click(settings.retroSound); onOpenAvatarStudio(); }}
                    className="text-[9px] text-[#00ff41] underline hover:text-[#ff00ff] font-bold uppercase"
                  >
                    [ SỬA NGOẠI HÌNH & THÚ CƯNG ]
                  </button>
                )}
              </div>

              {/* Form Fields */}
              <div className="sm:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="sm:col-span-3 sm:grid sm:grid-cols-3 sm:gap-3 space-y-3 sm:space-y-0">
                  <div>
                    <label className="text-[10px] text-[#00ff41] opacity-70 block mb-1 font-bold">HỌ VÀ TÊN</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#000] text-[#00ff41] border border-[#00ff41] px-3 py-2 text-xs focus:bg-[#111] focus:outline-none font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#00ff41] opacity-70 block mb-1 font-bold">TRƯỜNG THPT</label>
                    <input
                      type="text"
                      value={school}
                      onChange={(e) => setSchool(e.target.value)}
                      className="w-full bg-[#000] text-[#00ff41] border border-[#00ff41] px-3 py-2 text-xs focus:bg-[#111] focus:outline-none font-mono font-bold"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] text-[#00ff41] opacity-70 block mb-1 font-bold">LỚP HỌC</label>
                    <input
                      type="text"
                      value={className}
                      onChange={(e) => setClassName(e.target.value)}
                      className="w-full bg-[#000] text-[#00ff41] border border-[#00ff41] px-3 py-2 text-xs focus:bg-[#111] focus:outline-none font-mono font-bold"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Two Entry Gate Selection Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Gate A */}
            <div className="bg-[#111] p-5 border-2 border-[#00ff41] space-y-3 flex flex-col justify-between hover:bg-[#161616] transition-all">
              <div className="space-y-1">
                <span className="text-[10px] font-bold bg-[#00ff41] text-[#0c0c0c] px-2 py-0.5 uppercase">
                  CỔNG A // KHUYÊN DÙNG
                </span>
                <h3 className="text-base font-bold uppercase text-[#00ff41]">Cổng A: Trắc Nghiệm Holland</h3>
                <p className="text-xs text-[#00ff41] opacity-70 leading-relaxed">
                  Bộ 60 câu trắc nghiệm Holland O*NET Short Form. Tìm ra Mã Holland chuẩn xác & nhận gợi ý ngành nghề thích hợp nhất.
                </p>
              </div>

              <button
                onClick={() => { playSound.click(settings.retroSound); onStartQuizGate(info); }}
                className="w-full py-3 bg-[#00ff41] text-[#0c0c0c] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#00e53a] transition-all border-2 border-[#00ff41] uppercase"
              >
                <Compass className="w-4 h-4" />
                <span>VÀO CỔNG A: TRẮC NGHIỆM</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Gate B */}
            <div className="bg-[#111] p-5 border-2 border-[#00ff41] space-y-3 flex flex-col justify-between hover:bg-[#161616] transition-all">
              <div className="space-y-1">
                <span className="text-[10px] font-bold bg-[#ff00ff] text-[#0c0c0c] px-2 py-0.5 uppercase">
                  CỔNG B // TỰ CHỌN
                </span>
                <h3 className="text-base font-bold uppercase text-[#00ff41]">Cổng B: Bản Đồ 5 Ngành Tự Chọn</h3>
                <p className="text-xs text-[#00ff41] opacity-70 leading-relaxed">
                  Bỏ qua bài trắc nghiệm, trực tiếp khám phá thành phố 5 ngành nghề & bắt đầu ngay 8 tuần thực tập.
                </p>
              </div>

              <button
                onClick={() => { playSound.click(settings.retroSound); onStartCityMapGate(info); }}
                className="w-full py-3 bg-[#111] text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c] font-bold text-xs flex items-center justify-center gap-2 transition-all border-2 border-[#00ff41] uppercase"
              >
                <Sparkles className="w-4 h-4" />
                <span>VÀO CỔNG B: BẢN ĐỒ THÀNH PHỐ</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
