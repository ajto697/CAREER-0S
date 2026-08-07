import React, { useState, useEffect } from 'react';
import { Settings } from '../types';
import { playSound } from '../utils/audio';
import { Sparkles, Terminal, Volume2, VolumeX, ArrowRight, Play, FastForward, SkipForward, ShieldCheck, Zap } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  settings: Settings;
  onComplete: () => void;
}

export const IntroSequence: React.FC<Props> = ({ settings, onComplete }) => {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [typedText, setTypedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [isCrtFadingOut, setIsCrtFadingOut] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(settings.retroSound);

  const narrativeScenes = [
    {
      id: 1,
      tag: 'SCENE 01 // BƯỚC NGOẶT 2026',
      subtitle: 'KÍCH HOẠT HỆ THỐNG CAREER-OS V2.6',
      text: 'Năm 2026. Làn sóng Trí tuệ Nhân tạo (AI) và Chương trình GDPT 2018 tạo nên bước chuyển dịch lịch sử. Đứng trước hàng trăm ngã rẽ nghề nghiệp Cấp 3 và Đại học, học sinh THPT không thể tiếp tục chọn ngành bằng những câu hỏi trắc nghiệm suông trên giấy...',
      highlight: '💡 "Bạn cần trải nghiệm áp lực thật, công việc thật và giá trị thật trước khi đưa ra quyết định!"',
      avatar: 'CAREER_OS_BOOT'
    },
    {
      id: 2,
      tag: 'SCENE 02 // KHÔNG GIAN THỰC TẬP MÔ PHỎNG',
      title: 'NHẬP VAI 8 TUẦN THỰC TẬP CHÂN THỰC',
      text: 'Trạm kết nối CAREER-OS Matrix mở ra cánh cửa dẫn trực tiếp vào 5 khối ngành trọng điểm: Công nghệ EdTech, Y tế Cấp cứu, Báo chí Fact-Check, Lab Công nghệ Sinh học và Sư phạm GDPT. Tại đây, bạn không còn là người quan sát — bạn chính là nhân sự chủ chốt điều hành dự án!',
      highlight: '🛠️ Tự tay giải quyết task trên công cụ thực tế: Soạn giáo án 45 phút, xử lý ca cấp cứu, kiểm chứng tin giả, code logic.',
      avatar: 'MATRIX_GATE'
    },
    {
      id: 3,
      tag: 'SCENE 03 // BÁO CÁO RADAR O*NET & TƯƠNG LAI',
      title: 'TÍCH LŨY SƠ ĐỒ O*NET HOLLAND 6 NHÓM',
      text: 'Mọi quyết định sư phạm, thao tác kỹ thuật và bài nhật ký phản tư của bạn đều tự động tích lũy vào Sơ Đồ Radar Holland 6 nhóm (Kiên cường, Phân tích, Sáng tạo, Cảm thông, Lãnh đạo, Kỷ luật). Điểm số minh bạch, lưu trữ bảo mật 100% trên thiết bị của bạn.',
      highlight: '📊 Hoàn thành 8 tuần thực tập để mở khóa Chứng Nhận Tốt Nghiệp và Báo Cáo Xuất Sắc gửi Ban Giám Hiệu!',
      avatar: 'RADAR_SYSTEM'
    }
  ];

  const sceneData = narrativeScenes[currentScene];

  // Typewriter effect logic
  useEffect(() => {
    setIsTyping(true);
    setTypedText('');
    let index = 0;
    const fullText = sceneData.text;

    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(prev => prev + fullText.charAt(index));
        index++;
        if (soundEnabled && index % 3 === 0) {
          playSound.click(true);
        }
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 22);

    return () => clearInterval(timer);
  }, [currentScene, soundEnabled]);

  const handleNext = () => {
    playSound.click(soundEnabled);
    if (isTyping) {
      // Instant reveal current paragraph
      setTypedText(sceneData.text);
      setIsTyping(false);
      return;
    }

    if (currentScene < narrativeScenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else {
      handleFinishSequence();
    }
  };

  const handleFinishSequence = () => {
    playSound.click(soundEnabled);
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.6 } });
    setIsCrtFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 400);
  };

  const handleSkip = () => {
    playSound.click(soundEnabled);
    setIsCrtFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  return (
    <div className={`fixed inset-0 z-50 bg-[#000] flex items-center justify-center p-3 sm:p-6 overflow-hidden font-mono text-[#00ff41] select-none transition-opacity duration-300 ${isCrtFadingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      
      {/* Inline CRT Power-On Keyframe Animations */}
      <style>{`
        @keyframes crtTurnOn {
          0% {
            transform: scale(0.02, 0.005);
            filter: brightness(5) contrast(3);
            opacity: 0.2;
          }
          50% {
            transform: scale(1, 0.008);
            filter: brightness(3) contrast(2);
            opacity: 0.8;
          }
          80% {
            transform: scale(1, 1.05);
            filter: brightness(1.5) contrast(1.2);
            opacity: 0.95;
          }
          100% {
            transform: scale(1, 1);
            filter: brightness(1) contrast(1);
            opacity: 1;
          }
        }
        @keyframes crtFlicker {
          0% { opacity: 0.97; }
          50% { opacity: 1; }
          100% { opacity: 0.98; }
        }
        .crt-container {
          animation: crtTurnOn 0.6s cubic-bezier(0.23, 1, 0.32, 1) forwards, crtFlicker 0.15s infinite;
        }
        .crt-scanline-bg {
          background: linear-gradient(
            rgba(18, 16, 16, 0) 50%, 
            rgba(0, 0, 0, 0.3) 50%
          ), linear-gradient(
            90deg,
            rgba(255, 0, 0, 0.03),
            rgba(0, 255, 0, 0.01),
            rgba(0, 0, 255, 0.03)
          );
          background-size: 100% 3px, 6px 100%;
        }
      `}</style>

      {/* Main CRT Frame Box */}
      <div className="crt-container w-full max-w-3xl bg-[#080d08] border-4 border-[#00ff41] p-5 sm:p-8 space-y-6 shadow-[0_0_50px_rgba(0,255,65,0.25)] relative rounded-none crt-scanline-bg overflow-hidden">
        
        {/* Glow Corner Accents */}
        <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-[#00ff41]" />
        <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-[#00ff41]" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-[#00ff41]" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-[#00ff41]" />

        {/* Top Header Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#00ff41]/60 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#00ff41] animate-ping" />
            <span className="bg-[#00ff41] text-[#000] px-2 py-0.5 font-black text-xs uppercase tracking-widest">
              CRT CINEMATIC INTRO
            </span>
            <span className="text-xs text-[#ff00ff] font-bold uppercase">
              {sceneData.tag}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className="text-xs text-white hover:text-[#00ff41] border border-[#00ff41]/50 px-2 py-1 flex items-center gap-1 transition-colors"
              title="Bật/Tắt Âm Thanh"
            >
              {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#00ff41]" /> : <VolumeX className="w-3.5 h-3.5 text-white/60" />}
              <span>{soundEnabled ? 'SFX ON' : 'SFX OFF'}</span>
            </button>

            <button
              onClick={handleSkip}
              className="text-xs bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff] hover:bg-[#ff00ff] hover:text-[#000] px-3 py-1 font-bold uppercase flex items-center gap-1 transition-all shadow-md"
            >
              <span>SKIP INTRO</span>
              <SkipForward className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Scene Title & Subtitle */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-[#00ff41]/30 pb-3">
            <div className="w-10 h-10 bg-[#00ff41] text-[#000] font-black text-lg flex items-center justify-center shrink-0 shadow-lg">
              0{currentScene + 1}
            </div>
            <div>
              <span className="text-[10px] text-[#ff00ff] font-bold uppercase tracking-wider block">
                SYSTEM MODULE: [{sceneData.avatar}]
              </span>
              <h2 className="text-base sm:text-xl font-black text-white uppercase tracking-wide">
                {sceneData.subtitle || sceneData.tag}
              </h2>
            </div>
          </div>

          {/* Typewriter Narrative Content Box */}
          <div
            onClick={handleNext}
            className="bg-[#000]/90 border-2 border-[#00ff41] p-5 space-y-4 min-h-[170px] relative shadow-inner cursor-pointer hover:border-[#00ff41] transition-all group"
          >
            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-mono tracking-wide">
              {typedText}
              {isTyping && <span className="inline-block w-2.5 h-4 bg-[#00ff41] ml-1 animate-pulse" />}
            </p>

            {/* Highlighted Quote / Rule */}
            <div className="bg-[#111] border-l-4 border-[#ff00ff] p-3 text-xs font-bold text-[#00ff41] italic">
              {sceneData.highlight}
            </div>

            <div className="text-[10px] text-right text-[#00ff41]/60 group-hover:text-[#00ff41] pt-1">
              [ Click hoặc nhấn Enter để tiếp tục ]
            </div>
          </div>
        </div>

        {/* Footer Navigation Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#00ff41]/40">
          {/* Progress Indicator Dots */}
          <div className="flex items-center gap-2">
            {narrativeScenes.map((_, idx) => (
              <div
                key={idx}
                onClick={() => { playSound.click(soundEnabled); setCurrentScene(idx); }}
                className={`h-2.5 transition-all cursor-pointer ${
                  idx === currentScene ? 'w-8 bg-[#00ff41]' : 'w-2.5 bg-[#00ff41]/30 hover:bg-[#00ff41]/60'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              onClick={handleNext}
              className="w-full sm:w-auto px-6 py-2.5 bg-[#00ff41] text-[#000] font-black text-xs flex items-center justify-center gap-2 border-2 border-[#00ff41] hover:bg-[#00e53a] uppercase shadow-lg transition-all"
            >
              <span>
                {isTyping
                  ? 'HIỂN THỊ HẾT CHỮ'
                  : currentScene === narrativeScenes.length - 1
                  ? 'BẮT ĐẦU VÀO GAME (PRESS START)'
                  : 'TIẾP THEO'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
