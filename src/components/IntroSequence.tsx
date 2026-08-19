import React, { useState, useEffect, useRef } from 'react';
import { Settings } from '../types';
import { playSound, playCinematicTheme, stopCinematicTheme } from '../utils/audio';
import { 
  Sparkles, Terminal, Volume2, VolumeX, ArrowRight, Play, Pause, 
  SkipForward, ShieldCheck, Zap, Video, Film, Eye, Maximize2, 
  GraduationCap, Award, Compass, BookOpen, Flame
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  settings: Settings;
  onComplete: () => void;
}

interface VideoChannel {
  id: string;
  name: string;
  url: string;
  backupUrl?: string;
  theme: string;
  description: string;
}

const VIDEO_CHANNELS: VideoChannel[] = [
  {
    id: 'school_quest',
    name: 'Thước Phim 1: Khát Vọng Tri Thức & Trường Học 2026',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-students-studying-in-a-library-4841-large.mp4',
    backupUrl: 'https://assets.mixkit.co/videos/preview/mixkit-teacher-giving-a-lecture-to-students-4838-large.mp4',
    theme: 'Giáo Dục & Sứ Mệnh',
    description: 'Thư viện tri thức, tinh thần tự học và định hướng ngành nghề cho thế hệ trẻ.'
  },
  {
    id: 'cyber_matrix',
    name: 'Thước Phim 2: Kỷ Nguyên Số & AI Giáo Dục 2026',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-digital-animation-of-screens-with-charts-31912-large.mp4',
    backupUrl: 'https://assets.mixkit.co/videos/preview/mixkit-hands-of-a-man-working-on-a-computer-43301-large.mp4',
    theme: 'Công Nghệ & Dữ Liệu O*NET',
    description: 'Hệ thống mô phỏng 8 tuần thực tập số hóa giải mã năng lực nghề nghiệp.'
  },
  {
    id: 'pedagogy_torch',
    name: 'Thước Phim 3: Ngọn Đuốc Sư Phạm & Lớp Học Chân Thực',
    url: 'https://assets.mixkit.co/videos/preview/mixkit-teacher-giving-a-lecture-to-students-4838-large.mp4',
    backupUrl: 'https://assets.mixkit.co/videos/preview/mixkit-top-view-of-a-person-writing-on-a-notebook-42777-large.mp4',
    theme: 'Tâm Huyết Nhà Giáo',
    description: 'Đứng trước 40 học sinh lớp 10A3 — thắp sáng ước mơ và bảo vệ tương lai học trò.'
  }
];

export const IntroSequence: React.FC<Props> = ({ settings, onComplete }) => {
  const [currentScene, setCurrentScene] = useState<number>(0);
  const [typedText, setTypedText] = useState<string>('');
  const [isTyping, setIsTyping] = useState<boolean>(true);
  const [isCrtFadingOut, setIsCrtFadingOut] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(settings.retroSound);
  const [selectedVideoChannel, setSelectedVideoChannel] = useState<number>(0);
  const [isVideoPlaying, setIsVideoPlaying] = useState<boolean>(true);
  const [videoLoaded, setVideoLoaded] = useState<boolean>(false);
  const [selectedOath, setSelectedOath] = useState<string>('Tận Tụy Sư Phạm - Liêm Chính Nghề Nghiệp - Sáng Tạo Bứt Phá');
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const narrativeScenes = [
    {
      id: 1,
      tag: 'HỒI I // BƯỚC NGOẶT GIÁO DỤC 2026',
      title: 'BƯỚC CHUYỂN DỊCH GDPT 2018 & LÀN SÓNG AI',
      channelIndex: 0,
      text: 'Năm 2026. Làn sóng Trí tuệ Nhân tạo (AI) và chuyển đổi số đặt nền giáo dục Việt Nam trước bước ngoặt chưa từng có. Đứng trước 376 ngành nghề Đại học và ma trận thông tin, học sinh THPT không thể tiếp tục chọn tương lai qua những tờ phiếu trắc nghiệm khô khan trên giấy...',
      quote: '💡 "Giáo dục không phải là đổ đầy một chiếc bình, mà là thắp lên một ngọn lửa!" — William Butler Yeats',
      speaker: 'HỆ THỐNG ĐIỀU HÀNH CAREER-OS V2.6',
      badge: 'BỐI CẢNH LỊCH SỬ'
    },
    {
      id: 2,
      tag: 'HỒI II // KHÔNG GIAN THỰC HÀNH MÔ PHỎNG',
      title: 'CỔNG KẾT NỐI 8 TUẦN THỰC TẬP CHÂN THỰC',
      channelIndex: 1,
      text: 'Cổng CAREER-OS Matrix mở ra không gian mô phỏng nghề nghiệp đa tầng: từ bục giảng 40 học sinh lớp 10A3, phòng cấp cứu bệnh viện, tòa soạn thẩm định tin tức, phòng thí nghiệm sinh học đến tổng hành dinh EdTech. Bạn sẽ trực tiếp giải quyết khủng hoảng thật, soạn giáo án thật và nếm trải trách nhiệm thật!',
      quote: '⚡ "Bạn không còn là người quan sát bên lề. Bạn là nhân tố chủ chốt định hình tương lai!"',
      speaker: 'CỐ VẤN CHUYÊN MÔN CÔ LAN & BGH',
      badge: 'NHẬP VAI NGHỀ NGHIỆP'
    },
    {
      id: 3,
      tag: 'HỒI III // LỜI TUYÊN THỆ NHẬP VAI',
      title: 'CHỌN KIM CHỈ NAM TRƯỚC GIỜ XUẤT PHÁT',
      channelIndex: 2,
      text: 'Trước khi nhận Thẻ Thực Tập Sinh và bước vào 8 tuần thử thách, hãy xác lập Lời Tuyên Thệ sẽ dẫn lối cho bạn qua những áp lực điểm số, cám dỗ nghề nghiệp và các tình huống đạo đức cam go:',
      quote: '🎯 "Mọi quyết định của bạn sẽ tự động tích lũy vào Sơ Đồ Radar O*NET Holland và Báo Cáo Tốt Nghiệp."',
      speaker: 'HỘI ĐỒNG SỰ NGHIỆP & TƯ VẤN GDPT',
      badge: 'TUYÊN THỆ SỨ MỆNH'
    }
  ];

  const currentSceneData = narrativeScenes[currentScene];

  // Start background cinematic synthesizer on mount
  useEffect(() => {
    if (soundEnabled) {
      playCinematicTheme('intro', true);
    }
    return () => {
      stopCinematicTheme();
    };
  }, [soundEnabled]);

  // Sync Video with Scene Channel
  useEffect(() => {
    setSelectedVideoChannel(currentSceneData.channelIndex);
    if (videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {});
    }
  }, [currentScene]);

  // Typewriter effect
  useEffect(() => {
    setIsTyping(true);
    setTypedText('');
    let index = 0;
    const fullText = currentSceneData.text;

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
  }, [currentScene, soundEnabled]);

  // Particle Fallback & Cinematic Lens Canvas Animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let width = (canvas.width = canvas.offsetWidth || 800);
    let height = (canvas.height = canvas.offsetHeight || 500);

    const particles: Array<{ x: number; y: number; speed: number; size: number; alpha: number; color: string }> = [];
    const colors = ['#00ff41', '#00ffff', '#ff00ff', '#ffea00'];

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        speed: 0.3 + Math.random() * 0.8,
        size: 1 + Math.random() * 2.5,
        alpha: 0.2 + Math.random() * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)]
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle grid
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.04)';
      ctx.lineWidth = 1;
      const step = 40;
      for (let x = 0; x < width; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y < height; y += step) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw floating knowledge particles
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

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleNext = () => {
    playSound.click(soundEnabled);
    if (isTyping) {
      setTypedText(currentSceneData.text);
      setIsTyping(false);
      return;
    }

    if (currentScene < narrativeScenes.length - 1) {
      setCurrentScene(prev => prev + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrev = () => {
    playSound.click(soundEnabled);
    if (currentScene > 0) {
      setCurrentScene(prev => prev - 1);
    }
  };

  const handleFinish = () => {
    playSound.confetti(soundEnabled);
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    stopCinematicTheme();
    setIsCrtFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 450);
  };

  const handleSkip = () => {
    playSound.click(soundEnabled);
    stopCinematicTheme();
    setIsCrtFadingOut(true);
    setTimeout(() => {
      onComplete();
    }, 300);
  };

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsVideoPlaying(true);
    } else {
      videoRef.current.pause();
      setIsVideoPlaying(false);
    }
  };

  const currentChannel = VIDEO_CHANNELS[selectedVideoChannel] || VIDEO_CHANNELS[0];

  return (
    <div className={`fixed inset-0 z-50 bg-[#000] flex flex-col justify-between p-2 sm:p-4 md:p-6 overflow-hidden font-mono text-[#00ff41] select-none transition-all duration-500 ${isCrtFadingOut ? 'opacity-0 scale-95' : 'opacity-100 scale-100'}`}>
      
      {/* 2.39:1 Cinematic Letterbox Header Bar */}
      <div className="bg-black/95 border-b border-[#00ff41]/40 px-3 sm:px-6 py-2.5 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex items-center gap-1.5 bg-[#0a180a] px-2.5 py-1 border border-[#00ff41]">
            <span className="w-2.5 h-2.5 rounded-full bg-[#ff0055] animate-ping" />
            <span className="text-[10px] sm:text-xs font-black text-white uppercase tracking-wider">
              CINEMATIC PROLOGUE [4K 24FPS]
            </span>
          </div>
          <span className="text-[10px] sm:text-xs text-[#00ffff] font-bold hidden md:inline">
            // GIÁO DỤC HƯỚNG NGHIỆP 2026
          </span>
        </div>

        {/* Channels Switcher Pills */}
        <div className="hidden lg:flex items-center gap-1.5">
          {VIDEO_CHANNELS.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => {
                playSound.click(soundEnabled);
                setSelectedVideoChannel(idx);
              }}
              className={`text-[10px] px-2.5 py-1 border transition-all cursor-pointer ${
                selectedVideoChannel === idx
                  ? 'bg-[#00ff41] text-black font-bold border-white shadow-[0_0_10px_#00ff41]'
                  : 'bg-black text-[#00ff41]/70 border-[#00ff41]/30 hover:border-[#00ff41]'
              }`}
            >
              KÊNH {idx + 1}: {ch.theme}
            </button>
          ))}
        </div>

        {/* Sound & Skip Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) playCinematicTheme('intro', true);
              else stopCinematicTheme();
            }}
            className="text-[10px] sm:text-xs text-white hover:text-[#00ff41] border border-[#00ff41]/50 px-2.5 py-1 flex items-center gap-1 bg-black cursor-pointer transition-colors"
          >
            {soundEnabled ? <Volume2 className="w-3.5 h-3.5 text-[#00ff41]" /> : <VolumeX className="w-3.5 h-3.5 text-white/50" />}
            <span className="hidden sm:inline">{soundEnabled ? 'NHẠC ĐIỆN ẢNH ON' : 'TẮT ÂM'}</span>
          </button>

          <button
            onClick={handleSkip}
            className="text-[10px] sm:text-xs bg-[#ff00ff]/20 text-[#ff00ff] border border-[#ff00ff] hover:bg-[#ff00ff] hover:text-black px-3 py-1 font-bold uppercase flex items-center gap-1 transition-all cursor-pointer shadow-md"
          >
            <span>BỎ QUA INTRO</span>
            <SkipForward className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main Cinematic Viewport Stage with Video Background */}
      <div className="relative flex-1 my-2 border-2 sm:border-4 border-[#00ff41] bg-black overflow-hidden flex flex-col justify-between shadow-[0_0_50px_rgba(0,255,65,0.25)]">
        
        {/* Real HTML5 Background Video Player with Loop */}
        <div className="absolute inset-0 z-0 overflow-hidden bg-black">
          <video
            ref={videoRef}
            src={currentChannel.url}
            autoPlay
            loop
            muted
            playsInline
            onLoadedData={() => setVideoLoaded(true)}
            onError={() => {
              // Switch to backup URL if primary has network issue
              if (currentChannel.backupUrl && videoRef.current) {
                videoRef.current.src = currentChannel.backupUrl;
              }
            }}
            className="w-full h-full object-cover opacity-45 brightness-90 contrast-125 filter transition-opacity duration-700"
          />
          
          {/* Animated Canvas Particle Overlay */}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full pointer-events-none z-1"
          />

          {/* Dark Film Gradient Vignette */}
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black/70 z-2 pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 z-2 pointer-events-none" />
          
          {/* Scanlines Effect */}
          <div className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px] pointer-events-none z-3" />
        </div>

        {/* Upper Stage HUD Layer: Scene Tag & Video Player Control */}
        <div className="relative z-10 p-3 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-[#00ff41] text-black font-black text-[10px] sm:text-xs px-2 py-0.5 uppercase">
                {currentSceneData.badge}
              </span>
              <span className="text-xs text-[#ff00ff] font-bold uppercase tracking-widest">
                {currentSceneData.tag}
              </span>
            </div>
            <h1 className="text-base sm:text-2xl md:text-3xl font-black text-white uppercase tracking-wider drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              {currentSceneData.title}
            </h1>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto bg-black/80 p-1.5 border border-[#00ff41]/40 backdrop-blur-md">
            <button
              onClick={toggleVideoPlay}
              className="p-1 text-[#00ff41] hover:text-white cursor-pointer"
              title={isVideoPlaying ? 'Tạm dừng video' : 'Phát video'}
            >
              {isVideoPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <div className="text-[10px] text-white/80 font-mono pr-2 truncate max-w-[200px]">
              {currentChannel.name}
            </div>
          </div>
        </div>

        {/* Lower Stage: Dramatic Typewriter Subtitles & Narrative Box */}
        <div className="relative z-10 p-3 sm:p-6 max-w-4xl mx-auto w-full space-y-3">
          
          {/* Subtitle Dialogue Container */}
          <div 
            onClick={handleNext}
            className="bg-[#050a05]/95 border-2 border-[#00ff41] p-4 sm:p-6 space-y-3.5 backdrop-blur-md shadow-[0_0_30px_rgba(0,0,0,0.8)] cursor-pointer hover:border-white transition-all group"
          >
            {/* Speaker Tag */}
            <div className="flex items-center justify-between border-b border-[#00ff41]/30 pb-2">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-[#00ff41]" />
                <span className="text-[11px] font-bold text-[#00ffff] uppercase tracking-wider">
                  [{currentSceneData.speaker}]
                </span>
              </div>
              <span className="text-[10px] text-white/60 font-mono">
                HỒI 0{currentScene + 1} / 0{narrativeScenes.length}
              </span>
            </div>

            {/* Narrative text with typewriter */}
            <p className="text-xs sm:text-base text-white font-medium leading-relaxed tracking-wide min-h-[70px]">
              {typedText}
              {isTyping && <span className="inline-block w-2.5 h-4 bg-[#00ff41] ml-1.5 animate-pulse" />}
            </p>

            {/* Educational Quote Card */}
            {currentSceneData.quote && (
              <div className="bg-[#0c140c] border-l-4 border-[#ff00ff] p-3 text-xs sm:text-sm font-semibold text-[#00ff41] italic leading-snug">
                {currentSceneData.quote}
              </div>
            )}

            {/* Oath Selector on Final Scene */}
            {currentScene === 2 && (
              <div className="pt-2 border-t border-[#00ff41]/30 space-y-2">
                <div className="text-[11px] text-[#ffea00] font-bold uppercase flex items-center gap-1">
                  <Flame className="w-3.5 h-3.5 text-[#ffea00]" />
                  <span>CHỌN LỜI TUYÊN THỆ SỰ NGHIỆP CỦA BẠN:</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {[
                    'Tận Tụy Sư Phạm - Liêm Chính Nghề Nghiệp',
                    'Sáng Tạo Đột Phá - Làm Chủ Công Nghệ',
                    'Cảm Thông Y Đức - Dấn Thân Phục Vụ'
                  ].map((oath, oIdx) => (
                    <button
                      key={oIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        playSound.click(soundEnabled);
                        setSelectedOath(oath);
                      }}
                      className={`p-2 text-left text-[11px] border transition-all cursor-pointer ${
                        selectedOath === oath
                          ? 'bg-[#00ff41] text-black font-black border-white shadow-[0_0_10px_#00ff41]'
                          : 'bg-black text-[#00ff41] border-[#00ff41]/40 hover:border-[#00ff41]'
                      }`}
                    >
                      ✓ {oath}
                    </button>
                  ))}
                </div>
              </div>
            )}

            <div className="text-[10px] text-right text-[#00ff41]/70 group-hover:text-[#00ff41] pt-1">
              [ Nhấp chuột hoặc bấm Phím Space / Enter để tiếp tục ]
            </div>
          </div>
        </div>
      </div>

      {/* 2.39:1 Cinematic Letterbox Footer Bar */}
      <div className="bg-black/95 border-t border-[#00ff41]/40 px-3 sm:px-6 py-3 flex flex-col sm:flex-row items-center justify-between gap-3 z-20 shrink-0">
        {/* Step Progress Dots */}
        <div className="flex items-center gap-2">
          {narrativeScenes.map((_, idx) => (
            <button
              key={idx}
              onClick={() => {
                playSound.click(soundEnabled);
                setCurrentScene(idx);
              }}
              className={`h-2.5 transition-all cursor-pointer ${
                idx === currentScene
                  ? 'w-10 bg-[#00ff41] shadow-[0_0_10px_#00ff41]'
                  : 'w-3 bg-[#00ff41]/30 hover:bg-[#00ff41]/60'
              }`}
              title={`Chuyển đến Hồi ${idx + 1}`}
            />
          ))}
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex items-center gap-3 w-full sm:w-auto">
          {currentScene > 0 && (
            <button
              onClick={handlePrev}
              className="px-4 py-2 bg-black text-[#00ff41] border border-[#00ff41]/60 hover:border-[#00ff41] text-xs font-bold uppercase cursor-pointer"
            >
              QUAY LẠI
            </button>
          )}

          <button
            onClick={handleNext}
            className="flex-1 sm:flex-initial px-6 py-2.5 bg-[#00ff41] text-black font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 border-2 border-white hover:bg-[#00e53a] shadow-[0_0_20px_rgba(0,255,65,0.6)] cursor-pointer transition-all active:scale-[0.98]"
          >
            <span>
              {isTyping
                ? 'HIỂN THỊ HẾT CHỮ'
                : currentScene === narrativeScenes.length - 1
                ? 'KÍCH HOẠT CAREER-OS (BẮT ĐẦU NGAY)'
                : 'TIẾP TỤC HỒI KẾ TIẾP'}
            </span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
