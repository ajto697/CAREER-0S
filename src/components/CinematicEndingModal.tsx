import React, { useState, useEffect, useRef } from 'react';
import { UserProgress, Settings, CareerId } from '../types';
import { getCareerById } from '../data/careerData';
import { playSound, playCinematicTheme, stopCinematicTheme } from '../utils/audio';
import { 
  Award, Sparkles, GraduationCap, Volume2, VolumeX, ArrowRight, 
  RotateCcw, Play, Pause, X, FileText, CheckCircle2, Heart, 
  Trophy, ShieldCheck, Compass, Users, Star, Flame, Film, Video
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  progress: UserProgress;
  settings: Settings;
  isOpen: boolean;
  onClose: () => void;
  onViewCertificate: () => void;
}

interface EndingVideoTrack {
  id: string;
  title: string;
  url: string;
  backupUrl?: string;
  theme: string;
}

const ENDING_VIDEO_TRACKS: EndingVideoTrack[] = [
  {
    id: 'graduation_caps',
    title: 'Lễ Tốt Nghiệp & Tung Mũ Cử Nhân Rực Rỡ',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-graduating-students-throwing-their-caps-in-the-air-4844-large.mp4',
    backupUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-clapping-at-an-event-4848-large.mp4',
    theme: 'Vinh Quang & Trưởng Thành'
  },
  {
    id: 'school_triumph',
    title: 'Những Tràng Pháo Tay Tri Ân Sư Phạm',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-hands-clapping-at-an-event-4848-large.mp4',
    backupUrl: 'https://assets.mixkit.co/videos/preview/mixkit-sun-shining-over-a-modern-city-skyline-42995-large.mp4',
    theme: 'Tri Ân Thầy Cô'
  },
  {
    id: 'sunrise_future',
    title: 'Bình Minh Trên Đô Thị Tương Lai & Cơ Hội 2026',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-sun-shining-over-a-modern-city-skyline-42995-large.mp4',
    backupUrl: 'https://assets.mixkit.co/videos/preview/mixkit-students-studying-in-a-library-4841-large.mp4',
    theme: 'Khát Vọng Tương Lai'
  }
];

export const CinematicEndingModal: React.FC<Props> = ({
  progress,
  settings,
  isOpen,
  onClose,
  onViewCertificate
}) => {
  const career = getCareerById(progress.chosenCareer || 'pedagogy');
  const [currentSection, setCurrentSection] = useState<number>(0);
  const [typedText, setTypedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(settings.retroSound);
  const [videoIndex, setVideoIndex] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [showCreditsRoll, setShowCreditsRoll] = useState<boolean>(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const playerName = progress.name || 'Thực Tập Sinh';
  const playerSchool = progress.school || 'Trường THPT Trọng Điểm';
  const playerClass = progress.className || '10A3';

  // Specific narrative chapters for Ending
  const endingChapters = [
    {
      id: 1,
      tag: 'CHƯƠNG I // KẾT THÚC 8 TUẦN THỬ THÁCH',
      title: 'LỄ BẾ MẠC & KHẮC TÊN VÀO BẢNG VÀNG SỰ NGHIỆP',
      videoIdx: 0,
      text: `8 tuần thực tập mô phỏng chính thức khép lại! Vượt qua bao đêm thức trắng chuẩn bị, đối mặt với những tình huống khủng hoảng thực tế và áp lực chuyên môn cao độ, ${playerName} (${playerClass} - ${playerSchool}) đã hoàn thành xuất sắc sứ mệnh với bản lĩnh vững vàng.`,
      quote: '🏆 "Thành quả lớn nhất không chỉ là điểm số — mà là sự trưởng thành vượt bậc trong nhận thức và trách nhiệm."',
      speaker: 'HỘI ĐỒNG BAN GIÁM HIỆU & HƯỚNG NGHIỆP GDPT'
    },
    {
      id: 2,
      tag: 'CHƯƠNG II // LỜI TRI ÂN SƯ PHẠM ĐẦY XÚC ĐỘNG',
      title: 'KHOẢNH KHẮC CHIA TAY & LƯU BÚT TRI ÂN',
      videoIdx: 1,
      text: `Tiếng trống bế mạc vang lên. Cô Lan (Mentor hướng dẫn) trao cho bạn cái ôm siết chặt đầy tự hào. Các em học sinh (Đức, Minh, Hoa) cùng tập thể lớp chuyền tay nhau cuốn lưu bút đong đầy kỷ niệm: "Cảm ơn Thầy/Cô đã lắng nghe, không bao giờ bỏ rơi chúng em và dạy cho chúng em bài học làm người quý giá nhất!"`,
      quote: '❤️ "Người thầy trung bình chỉ biết nói. Người thầy giỏi biết giải thích. Người thầy xuất chúng biết truyền cảm hứng!" — William A. Ward',
      speaker: 'CÔ LAN (MENTOR) & TẬP THỂ LỚP ĐỒNG HÀNH'
    },
    {
      id: 3,
      tag: 'CHƯƠNG III // NGỌN ĐUỐC TƯƠNG LAI 2026 - 2030',
      title: 'HÀNH TRANG VỮNG CHẮC BƯỚC VÀO ĐẠI HỌC',
      videoIdx: 2,
      text: `Từ đây, cánh cửa 376 ngành đào tạo Đại học và 23 Tòa Cao Ốc Bộ GD&ĐT không còn là mê cung xa lạ. Bạn đã sở hữu Sơ đồ Radar O*NET Holland cá nhân hóa, chứng chỉ thực tập được công nhận và ngọn lửa đam mê chân chính để tự tin lựa chọn nguyện vọng đại học đúng đắn nhất!`,
      quote: '🚀 "Tương lai thuộc về những ai tin tưởng vào vẻ đẹp của ước mơ và dám dấn thân hành động."',
      speaker: 'HỆ THỐNG CAREER-OS MATRIX VIỆT NAM'
    }
  ];

  const currentData = endingChapters[currentSection];

  // Play cinematic audio on open
  useEffect(() => {
    if (isOpen && soundEnabled) {
      playCinematicTheme('ending', true);
      confetti({ particleCount: 150, spread: 90, origin: { y: 0.5 } });
    }
    return () => {
      stopCinematicTheme();
    };
  }, [isOpen, soundEnabled]);

  // Video track update
  useEffect(() => {
    if (currentData) {
      setVideoIndex(currentData.videoIdx);
      if (videoRef.current) {
        videoRef.current.currentTime = 0;
        videoRef.current.play().catch(() => {});
      }
    }
  }, [currentSection]);

  // Typewriter effect
  useEffect(() => {
    if (!isOpen) return;
    setIsTyping(true);
    setTypedText('');
    let index = 0;
    const fullText = currentData?.text || '';

    const timer = setInterval(() => {
      if (index < fullText.length) {
        setTypedText(prev => prev + fullText.charAt(index));
        index++;
        if (soundEnabled && index % 4 === 0) {
          playSound.click(true);
        }
      } else {
        setIsTyping(false);
        clearInterval(timer);
      }
    }, 20);

    return () => clearInterval(timer);
  }, [currentSection, isOpen, soundEnabled]);

  // Golden particle canvas
  useEffect(() => {
    if (!isOpen) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || 800);
    let height = (canvas.height = canvas.offsetHeight || 500);

    const particles: Array<{ x: number; y: number; speed: number; size: number; alpha: number; color: string }> = [];
    const colors = ['#ffea00', '#00ff41', '#ff00ff', '#ffffff', '#00ffff'];

    for (let i = 0; i < 50; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.4 + Math.random() * 0.9,
        size: 1.5 + Math.random() * 3,
        alpha: 0.3 + Math.random() * 0.7,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      particles.forEach(p => {
        p.y -= p.speed;
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }

        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      });

      ctx.globalAlpha = 1;
      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const currentVideo = ENDING_VIDEO_TRACKS[videoIndex] || ENDING_VIDEO_TRACKS[0];

  const handleNextSection = () => {
    playSound.click(soundEnabled);
    if (isTyping) {
      setTypedText(currentData.text);
      setIsTyping(false);
      return;
    }

    if (currentSection < endingChapters.length - 1) {
      setCurrentSection(prev => prev + 1);
    } else {
      setShowCreditsRoll(true);
    }
  };

  const handlePrevSection = () => {
    playSound.click(soundEnabled);
    if (currentSection > 0) {
      setCurrentSection(prev => prev - 1);
    }
  };

  const handleRestartEnding = () => {
    playSound.click(soundEnabled);
    setShowCreditsRoll(false);
    setCurrentSection(0);
    playCinematicTheme('ending', soundEnabled);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black flex flex-col justify-between p-2 sm:p-4 md:p-6 overflow-hidden font-mono text-[#00ff41] select-none animate-fadeIn">
      
      {/* 2.39:1 Cinematic Letterbox Header */}
      <div className="bg-black/95 border-b-2 border-[#ffea00]/40 px-3 sm:px-6 py-2.5 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-[#1a1500] px-2.5 py-1 border border-[#ffea00]">
            <Trophy className="w-4 h-4 text-[#ffea00]" />
            <span className="text-[10px] sm:text-xs font-black text-[#ffea00] uppercase tracking-wider">
              CINEMATIC GRADUATION EPILOGUE [4K FILM]
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-white/80 font-bold hidden md:inline">
            // TỐT NGHIỆP THỰC TẬP 8 TUẦN
          </span>
        </div>

        {/* Video Track Selector */}
        <div className="hidden lg:flex items-center gap-1.5">
          {ENDING_VIDEO_TRACKS.map((track, tIdx) => (
            <button
              key={track.id}
              onClick={() => {
                playSound.click(soundEnabled);
                setVideoIndex(tIdx);
              }}
              className={`text-[10px] px-2.5 py-1 border transition-all cursor-pointer ${
                videoIndex === tIdx
                  ? 'bg-[#ffea00] text-black font-black border-white shadow-[0_0_10px_#ffea00]'
                  : 'bg-black text-[#ffea00]/70 border-[#ffea00]/30 hover:border-[#ffea00]'
              }`}
            >
              THƯỚC PHIM {tIdx + 1}: {track.theme}
            </button>
          ))}
        </div>

        {/* Action buttons on header */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playCinematicTheme('ending', true);
              else stopCinematicTheme();
            }}
            className="text-[10px] sm:text-xs text-white hover:text-[#ffea00] border border-[#ffea00]/50 px-2.5 py-1 flex items-center gap-1 bg-black cursor-pointer"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#ffea00]" /> : <VolumeX className="w-3.5 h-3.5 text-white/50" />}
            <span className="hidden sm:inline">{soundEnabled ? 'NHẠC TỐT NGHIỆP ON' : 'TẮT ÂM'}</span>
          </button>

          <button
            onClick={() => {
              playSound.click(soundEnabled);
              stopCinematicTheme();
              onClose();
            }}
            className="p-1.5 bg-[#ff0055] text-white hover:bg-[#ff3377] border border-white cursor-pointer"
            title="Đóng thước phim [ESC]"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Viewport Stage with Video Background */}
      <div className="relative flex-1 my-2 border-2 sm:border-4 border-[#ffea00] bg-black overflow-hidden flex flex-col justify-between shadow-[0_0_50px_rgba(255,234,0,0.3)]">
        
        {/* HTML5 Video Player */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <video
            ref={videoRef}
            src={currentVideo.url}
            autoPlay
            loop
            muted
            playsInline
            onError={() => {
              if (currentVideo.backupUrl && videoRef.current) {
                videoRef.current.src = currentVideo.backupUrl;
              }
            }}
            className="w-full h-full object-cover opacity-50 brightness-95 contrast-125 filter transition-opacity duration-700"
          />

          {/* Golden Celebration Particles */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-1"
          />

          {/* Film Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/45 to-black/75 z-2 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 z-2 pointer-events-none" />
          
          {/* Scanlines Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] pointer-events-none z-3" />
        </div>

        {/* Regular Narrative View OR Cinematic Credits Roll */}
        {!showCreditsRoll ? (
          <>
            {/* Top Stage Information */}
            <div className="relative z-10 p-3 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="bg-[#ffea00] text-black font-black text-[10px] sm:text-xs px-2 py-0.5 uppercase">
                    VINH DANH TỐT NGHIỆP
                  </span>
                  <span className="text-xs text-[#ff00ff] font-bold uppercase tracking-widest">
                    {currentData.tag}
                  </span>
                </div>
                <h1 className="text-base sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
                  {currentData.title}
                </h1>
              </div>

              <div className="flex items-center gap-2 self-start sm:self-auto bg-black/80 p-1.5 border border-[#ffea00]/40 backdrop-blur-md">
                <button
                  onClick={() => {
                    if (!videoRef.current) return;
                    if (videoRef.current.paused) {
                      videoRef.current.play();
                      setIsVideoPlaying(true);
                    } else {
                      videoRef.current.pause();
                      setIsVideoPlaying(false);
                    }
                  }}
                  className="p-1 text-[#ffea00] hover:text-white cursor-pointer"
                >
                  {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                </button>
                <div className="text-[10px] text-[#ffea00] font-mono pr-2 truncate max-w-[220px]">
                  {currentVideo.title}
                </div>
              </div>
            </div>

            {/* Subtitle Dialogue Container */}
            <div className="relative z-10 p-3 sm:p-6 max-w-4xl mx-auto w-full space-y-3">
              <div 
                onClick={handleNextSection}
                className="bg-[#0c0f05]/95 border-2 border-[#ffea00] p-4 sm:p-6 space-y-3.5 backdrop-blur-md shadow-[0_0_35px_rgba(0,0,0,0.85)] cursor-pointer hover:border-white transition-all group"
              >
                {/* Speaker Tag */}
                <div className="flex items-center justify-between border-b border-[#ffea00]/30 pb-2">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-[#ffea00]" />
                    <span className="text-[11px] font-bold text-[#ffea00] uppercase tracking-wider">
                      [{currentData.speaker}]
                    </span>
                  </div>
                  <span className="text-[10px] text-white/60 font-mono">
                    CHƯƠNG 0{currentSection + 1} / 0{endingChapters.length}
                  </span>
                </div>

                {/* Narrative text with typewriter */}
                <p className="text-xs sm:text-base text-white font-medium leading-relaxed tracking-wide min-h-[70px]">
                  {typedText}
                  {isTyping && <span className="inline-block w-2.5 h-4 bg-[#ffea00] ml-1.5 animate-pulse" />}
                </p>

                {/* Educational Quote */}
                {currentData.quote && (
                  <div className="bg-[#151500] border-l-4 border-[#00ff41] p-3 text-xs sm:text-sm font-semibold text-[#ffea00] italic leading-snug">
                    {currentData.quote}
                  </div>
                )}

                <div className="text-[10px] text-right text-[#ffea00]/70 group-hover:text-[#ffea00] pt-1">
                  [ Nhấp chuột hoặc bấm Phím Space / Enter để tiếp tục ]
                </div>
              </div>
            </div>
          </>
        ) : (
          /* =========================================================
             CINEMATIC ENDING CREDITS ROLL VIEW
             ========================================================= */
          <div className="relative z-10 flex-1 flex flex-col items-center justify-center p-4 sm:p-8 text-center overflow-y-auto space-y-6 max-w-2xl mx-auto">
            <div className="space-y-2 animate-fadeIn">
              <div className="w-16 h-16 mx-auto bg-[#ffea00] text-black rounded-full flex items-center justify-center shadow-[0_0_30px_#ffea00]">
                <GraduationCap className="w-9 h-9" />
              </div>
              <span className="text-xs text-[#ff00ff] font-bold tracking-widest uppercase">
                BẢN DANH ĐỀ TỐT NGHIỆP CHÍNH THỨC
              </span>
              <h2 className="text-xl sm:text-3xl font-black text-white uppercase">
                CAREER-OS MATRIX // 2026
              </h2>
            </div>

            {/* Scrolling Credits Info Box */}
            <div className="bg-black/90 border-2 border-[#ffea00] p-6 space-y-4 text-xs sm:text-sm text-gray-200 text-left w-full shadow-2xl">
              <div className="border-b border-[#ffea00]/30 pb-2 flex justify-between items-center">
                <span className="text-[#ffea00] font-bold">THỰC TẬP SINH:</span>
                <span className="text-white font-black text-sm">{playerName}</span>
              </div>
              <div className="border-b border-[#ffea00]/30 pb-2 flex justify-between items-center">
                <span className="text-[#ffea00] font-bold">ĐƠN VỊ & LỚP HỌC:</span>
                <span className="text-white">{playerClass} • {playerSchool}</span>
              </div>
              <div className="border-b border-[#ffea00]/30 pb-2 flex justify-between items-center">
                <span className="text-[#ffea00] font-bold">LĨNH VỰC THỰC TẬP:</span>
                <span className="text-[#00ff41] font-bold">{career.name}</span>
              </div>
              <div className="border-b border-[#ffea00]/30 pb-2 flex justify-between items-center">
                <span className="text-[#ffea00] font-bold">CỐ VẤN CHUYÊN MÔN:</span>
                <span className="text-[#ff00ff]">Cô Lan (Mentor Sư Phạm) & Ban Giám Hiệu</span>
              </div>
              <div className="border-b border-[#ffea00]/30 pb-2 flex justify-between items-center">
                <span className="text-[#ffea00] font-bold">TẬP THỂ HỌC SINH ĐỒNG HÀNH:</span>
                <span className="text-white">Em Đức, Em Minh, Em Hoa (10A3)</span>
              </div>
              <div className="pt-2 text-center text-xs text-[#00ffff] italic">
                "Kính chúc quý thầy cô giáo luôn giữ vững ngọn lửa nhiệt huyết, chúc các bạn học sinh tự tin làm chủ con đường tương lai!"
              </div>
            </div>

            {/* Action Buttons for Credits Roll */}
            <div className="flex flex-wrap items-center justify-center gap-3 w-full">
              <button
                onClick={handleRestartEnding}
                className="px-4 py-2.5 bg-black text-[#ffea00] border border-[#ffea00] hover:bg-[#ffea00]/20 text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>XEM LẠI THƯỚC PHIM</span>
              </button>

              <button
                onClick={() => {
                  playSound.pass(soundEnabled);
                  stopCinematicTheme();
                  onClose();
                  onViewCertificate();
                }}
                className="px-6 py-3 bg-[#00ff41] text-black font-black text-xs sm:text-sm uppercase flex items-center gap-2 border-2 border-white hover:bg-[#00e53a] shadow-[0_0_20px_#00ff41] cursor-pointer"
              >
                <FileText className="w-4 h-4" />
                <span>MỞ BÁO CÁO & CHỨNG NHẬN TỐT NGHIỆP</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* 2.39:1 Cinematic Letterbox Footer */}
      {!showCreditsRoll && (
        <div className="bg-black/95 border-t border-[#ffea00]/40 px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 z-20 shrink-0">
          {/* Chapter Indicators */}
          <div className="flex items-center gap-2">
            {endingChapters.map((_, idx) => (
              <button
                key={idx}
                onClick={() => {
                  playSound.click(soundEnabled);
                  setCurrentSection(idx);
                }}
                className={`h-2.5 transition-all cursor-pointer ${
                  idx === currentSection
                    ? 'w-10 bg-[#ffea00] shadow-[0_0_10px_#ffea00]'
                    : 'w-3 bg-[#ffea00]/30 hover:bg-[#ffea00]/60'
                }`}
                title={`Chuyển đến Chương ${idx + 1}`}
              />
            ))}
          </div>

          {/* Navigation Action Buttons */}
          <div className="flex items-center gap-3 w-full sm:w-auto">
            {currentSection > 0 && (
              <button
                onClick={handlePrevSection}
                className="px-4 py-2 bg-black text-[#ffea00] border border-[#ffea00]/60 hover:border-[#ffea00] text-xs font-bold uppercase cursor-pointer"
              >
                QUAY LẠI
              </button>
            )}

            <button
              onClick={handleNextSection}
              className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#ffea00] text-black font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 border-2 border-white hover:bg-yellow-400 shadow-[0_0_20px_rgba(255,234,0,0.6)] cursor-pointer transition-all active:scale-[0.98]"
            >
              <span>
                {isTyping
                  ? 'HIỂN THỊ HẾT CHỮ'
                  : currentSection === endingChapters.length - 1
                  ? 'TIẾN VÀO CUỘN DANH ĐỀ TỐT NGHIỆP (CREDITS)'
                  : 'TIẾP TỤC CHƯƠNG KẾ TIẾP'}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
