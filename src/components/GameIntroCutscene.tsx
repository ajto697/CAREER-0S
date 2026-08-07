import React, { useState, useEffect } from 'react';
import { Settings } from '../types';
import { playSound } from '../utils/audio';
import { Sparkles, Terminal, Play, Pause, ChevronRight, ChevronLeft, ArrowRight, ShieldCheck, Zap, Award, GraduationCap, Volume2, VolumeX, Flame } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  settings: Settings;
  onCompleteIntro: (playerOath?: string) => void;
  onSkipIntro: () => void;
}

export const GameIntroCutscene: React.FC<Props> = ({
  settings,
  onCompleteIntro,
  onSkipIntro
}) => {
  const [currentChapter, setCurrentChapter] = useState<number>(0);
  const [typedText, setTypedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [selectedOath, setSelectedOath] = useState<string>('Tận Tụy - Liêm Chính - Bứt Phá');
  const [audioMuted, setAudioMuted] = useState<boolean>(!settings.retroSound);

  const chapters = [
    {
      id: 1,
      tag: 'CHƯƠNG I // NĂM 2026 & BƯỚC NGOẶT THỜI ĐẠI',
      title: 'BẢN BÁO CÁO TỪ TƯƠNG LAI',
      bgGradient: 'from-[#00ff41]/20 via-[#000] to-[#0d0d0d]',
      text: 'Năm 2026. Làn sóng trí tuệ nhân tạo (AI) và chương trình GDPT 2018 đòi hỏi mỗi học sinh Cấp 3 phải tự làm chủ lộ trình nghề nghiệp của mình. Những bài trắc nghiệm A/B/C trên giấy không còn đủ để bạn hình dung áp lực thật, niềm vui thật và giá trị thật của một ngành nghề...',
      quote: '"Năng lực không sinh ra từ suy đoán — năng lực chỉ nảy mầm qua hành động!"',
      avatar: 'SYSTEM_AI_2026'
    },
    {
      id: 2,
      tag: 'CHƯƠNG II // CỔNG KẾT NỐI CAREER-OS MATRIX',
      title: 'LỐI VÀO KHÔNG GIAN THỰC TẬP MÔ PHỎNG',
      bgGradient: 'from-[#ff00ff]/20 via-[#000] to-[#0d0d0d]',
      text: 'Một thiết bị mang tên CAREER-OS bất ngờ khởi động. Nó mở ra cổng không gian đưa bạn nhập vai thẳng vào 8 TUẦN THỰC TẬP CHÂN THỰC: từ đứng trước 40 học sinh lớp 10A3, phân loại bệnh nhân cấp cứu, kiểm tra tin giả báo chí, điều khiển phản ứng sinh học cho tới viết code hệ thống EdTech...',
      quote: '⚡ "Bạn không còn là người quan sát. Bạn chính là nhân sự chủ chốt của dự án!"',
      avatar: 'PORTAL_GATE'
    },
    {
      id: 3,
      tag: 'CHƯƠNG III // LỜI TUYÊN THỆ SỨ MỆNH SỰ NGHIỆP',
      title: 'CHỌN LỜI TUYÊN THỆ NHẬP VAI',
      bgGradient: 'from-yellow-500/20 via-[#000] to-[#0d0d0d]',
      text: 'Trước khi khoác lên mình tấm thẻ Thực tập sinh, hãy chọn Lời Tuyên Thệ kim chỉ nam sẽ dẫn đường cho bạn vượt qua những thử thách đạo đức và khủng hoảng nghề nghiệp sắp tới:',
      quote: '🎯 "Kim chỉ nam sẽ khắc sâu vào Báo Báo Sự Nghiệp & Sơ Đồ Radar Holland của bạn."',
      avatar: 'OATH_SELECTION'
    },
    {
      id: 4,
      tag: 'CHƯƠNG IV // SẴN SÀNG XUẤT PHÁT',
      title: 'THẺ THỰC TẬP SINH ĐÃ KÍCH HOẠT',
      bgGradient: 'from-[#00ffff]/20 via-[#000] to-[#0d0d0d]',
      text: 'Cô Lan (Mentor Hướng dẫn) và Ban giám hiệu đã sẵn sàng đón bạn tại đơn vị thực tập. 8 tuần phía trước sẽ ghi dấu sự trưởng thành, bản lĩnh và quyết định tương lai của bạn. Chúc bạn có một hành trình rực rỡ!',
      quote: '🚀 "PRESS START — SỨ MỆNH THỰC TẬP 8 TUẦN CHÍNH THỨC BẮT ĐẦU!"',
      avatar: 'MENTOR_LAN'
    }
  ];

  const currentData = chapters[currentChapter];

  // Typewriter Effect logic
  useEffect(() => {
    setIsTyping(true);
    setTypedText('');
    let index = 0;
    const fullText = currentData.text;

    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(prev => prev + fullText.charAt(index));
        index++;
        if (!audioMuted && index % 4 === 0) {
          playSound.click(true);
        }
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [currentChapter, audioMuted]);

  const handleNext = () => {
    playSound.click(!audioMuted);
    if (currentChapter < chapters.length - 1) {
      setCurrentChapter(prev => prev + 1);
    } else {
      confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
      onCompleteIntro(selectedOath);
    }
  };

  const handlePrev = () => {
    playSound.click(!audioMuted);
    if (currentChapter > 0) {
      setCurrentChapter(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#000] flex items-center justify-center p-3 sm:p-6 overflow-y-auto font-mono text-[#00ff41] select-none">
      {/* Background CRT Glitch Effect Frame */}
      <div className={`w-full max-w-4xl bg-gradient-to-b ${currentData.bgGradient} border-4 border-[#00ff41] p-5 sm:p-8 space-y-6 shadow-2xl relative rounded-none`}>
        
        {/* Top Header Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b-2 border-[#00ff41]/60 pb-3 gap-2">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#00ff41] animate-ping" />
            <span className="bg-[#00ff41] text-[#000] px-2 py-0.5 font-black text-xs uppercase tracking-widest">
              CINEMATIC PROLOGUE
            </span>
            <span className="text-xs text-[#ff00ff] font-bold uppercase">
              {currentData.tag}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setAudioMuted(!audioMuted)}
              className="text-xs text-white hover:text-[#00ff41] border border-[#00ff41]/40 px-2 py-1 flex items-center gap-1"
            >
              {audioMuted ? <VolumeX className="w-3.5 h-3.5" /> : <Volume2 className="w-3.5 h-3.5 text-[#00ff41]" />}
              <span>{audioMuted ? 'MUTE' : 'SOUND ON'}</span>
            </button>

            <button
              onClick={onSkipIntro}
              className="text-xs text-[#00ff41] underline hover:text-[#ff00ff] font-bold uppercase"
            >
              [ BỎ QUA INTRO ⏭ ]
            </button>
          </div>
        </div>

        {/* Chapter Title & Avatar Box */}
        <div className="space-y-4">
          <div className="flex items-center gap-3 border-b border-[#00ff41]/30 pb-3">
            <div className="w-12 h-12 bg-[#00ff41] text-[#000] font-black text-xl flex items-center justify-center shrink-0 shadow-lg">
              0{currentChapter + 1}
            </div>
            <div>
              <span className="text-[10px] text-[#ff00ff] font-bold uppercase tracking-wider">
                SOURCE: [{currentData.avatar}]
              </span>
              <h1 className="text-lg sm:text-2xl font-black text-white uppercase tracking-wide">
                {currentData.title}
              </h1>
            </div>
          </div>

          {/* Typewriter Narration Box */}
          <div className="bg-[#080d08] border-2 border-[#00ff41] p-5 space-y-4 min-h-[160px] relative shadow-inner">
            <p className="text-xs sm:text-sm text-white/95 leading-relaxed font-mono">
              {typedText}
              {isTyping && <span className="inline-block w-2 h-4 bg-[#00ff41] ml-1 animate-pulse" />}
            </p>

            <div className="bg-[#000]/90 border-l-4 border-[#ff00ff] p-3 text-xs font-bold text-[#00ff41] italic">
              {currentData.quote}
            </div>
          </div>

          {/* Chapter 3 Interactive Oath Selection */}
          {currentChapter === 2 && (
            <div className="bg-[#111] border border-[#00ff41]/60 p-4 space-y-3">
              <span className="text-xs font-bold text-[#ff00ff] uppercase block flex items-center gap-1.5">
                <Flame className="w-4 h-4 text-yellow-400" />
                CHỌN LỜI TUYÊN THỆ TÂM HUYẾT CỦA BẠN:
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                {[
                  { title: 'Tận Tụy & Liêm Chính', desc: 'Đặt đạo đức nghề nghiệp và sự công bằng lên hàng đầu.' },
                  { title: 'Truyền Cảm Hứng & Bao Dung', desc: 'Thấu hiểu, kiên nhẫn và không bao giờ bỏ rơi học trò/bệnh nhân.' },
                  { title: 'Sáng Tạo & Đổi Mới', desc: 'Dũng cảm áp dụng công nghệ mới để bứt phá giới hạn.' }
                ].map((oathItem, idx) => (
                  <div
                    key={idx}
                    onClick={() => { playSound.click(!audioMuted); setSelectedOath(oathItem.title); }}
                    className={`p-3 border cursor-pointer text-xs space-y-1 transition-all ${
                      selectedOath === oathItem.title
                        ? 'border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41] font-bold shadow-md'
                        : 'border-[#00ff41]/30 bg-[#000] text-white/80 hover:border-[#00ff41]'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="uppercase text-[11px] font-extrabold">{oathItem.title}</span>
                      {selectedOath === oathItem.title && <Sparkles className="w-3.5 h-3.5 text-[#ff00ff]" />}
                    </div>
                    <p className="text-[10px] opacity-70 font-normal leading-tight">{oathItem.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation & Chapter Progress Dots */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 border-t border-[#00ff41]/40">
          {/* Chapter Dots */}
          <div className="flex items-center gap-2">
            {chapters.map((_, idx) => (
              <div
                key={idx}
                onClick={() => { playSound.click(!audioMuted); setCurrentChapter(idx); }}
                className={`h-2.5 transition-all cursor-pointer ${
                  idx === currentChapter ? 'w-8 bg-[#00ff41]' : 'w-2.5 bg-[#00ff41]/30 hover:bg-[#00ff41]/60'
                }`}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <button
              disabled={currentChapter === 0}
              onClick={handlePrev}
              className="flex-1 sm:flex-initial px-4 py-2.5 bg-[#111] text-[#00ff41] border border-[#00ff41] disabled:opacity-30 hover:bg-[#00ff41] hover:text-[#000] font-bold text-xs flex items-center justify-center gap-1 uppercase"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>LÙI LAI</span>
            </button>

            <button
              onClick={handleNext}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#00ff41] text-[#000] font-black text-xs flex items-center justify-center gap-2 border-2 border-[#00ff41] hover:bg-[#00e53a] uppercase shadow-lg"
            >
              <span>{currentChapter === chapters.length - 1 ? 'XUẤT PHÁT VÀO GAME' : 'CHƯƠNG TIẾP'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
