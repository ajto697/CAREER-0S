import React, { useState, useEffect } from 'react';
import { UserProgress, Settings } from '../types';
import { Volume2, VolumeX, Tv, Users, Compass, Sparkles, Settings as SettingsIcon, X, Sliders, ShieldCheck, BookOpen, Save } from 'lucide-react';
import { playSound } from '../utils/audio';

interface Props {
  progress: UserProgress;
  settings: Settings;
  onUpdateSettings: (s: Settings) => void;
  onNavigateGate: (gate: UserProgress['currentGate']) => void;
  onOpenDashboard: () => void;
  onResetData: () => void;
  onOpenMajorsModal?: () => void;
  onOpenSaveLoadModal?: () => void;
}

export const NavbarHeader: React.FC<Props> = ({
  progress,
  settings,
  onUpdateSettings,
  onNavigateGate,
  onOpenDashboard,
  onResetData,
  onOpenMajorsModal,
  onOpenSaveLoadModal,
}) => {

  const [timeStr, setTimeStr] = useState<string>('09:41:00');
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setTimeStr(now.toTimeString().split(' ')[0]);
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const toggleSound = () => {
    const updated = { ...settings, retroSound: !settings.retroSound };
    onUpdateSettings(updated);
    playSound.click(updated.retroSound);
  };

  const toggleCRT = () => {
    const updated = { ...settings, crtScanlines: !settings.crtScanlines };
    onUpdateSettings(updated);
    playSound.click(settings.retroSound);
  };

  const toggleZodiac = () => {
    const updated = { ...settings, showZodiac: !settings.showZodiac };
    onUpdateSettings(updated);
    playSound.click(settings.retroSound);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#0c0c0c] border-b-2 border-[#00ff41] px-3 py-2 text-[#00ff41] font-mono select-none">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Brand & Status */}
        <div 
          onClick={() => onNavigateGate('welcome')} 
          className="flex items-center gap-3 cursor-pointer group"
        >
          <div className="bg-[#00ff41] text-[#0c0c0c] px-2.5 py-1 font-bold text-base sm:text-lg tracking-wider">
            CAREER-OS V5.0
          </div>
          <div className="text-xs hidden sm:block text-[#00ff41] opacity-80 uppercase tracking-tight">
            STATUS: OPTIMAL // WEEK 0{progress.currentWeek || 1} OF 08
          </div>
        </div>

        {/* Center: Navigation Gates */}
        <nav className="flex items-center gap-2">
          <button
            onClick={() => { playSound.click(settings.retroSound); onNavigateGate('quiz_gate'); }}
            className={`px-3 py-1 font-bold text-xs uppercase transition-all flex items-center gap-1.5 border-2 ${
              progress.currentGate === 'quiz_gate'
                ? 'bg-[#00ff41] text-[#0c0c0c] border-[#00ff41]'
                : 'border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c]'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            <span>CỔNG A: TRẮC NGHIỆM</span>
          </button>

          <button
            onClick={() => { playSound.click(settings.retroSound); onNavigateGate('city_map'); }}
            className={`px-3 py-1 font-bold text-xs uppercase transition-all flex items-center gap-1.5 border-2 ${
              progress.currentGate === 'city_map' || progress.currentGate === 'internship'
                ? 'bg-[#00ff41] text-[#0c0c0c] border-[#00ff41]'
                : 'border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>CỔNG B: BẢN ĐỒ 5 NGÀNH</span>
          </button>
        </nav>

        {/* Right: Telemetry & Actions */}
        <div className="flex items-center gap-2 text-xs uppercase">
          {/* User Code Tag */}
          <div className="hidden lg:flex items-center gap-2 border border-[#00ff41] px-2 py-1 text-[11px] bg-[#111]">
            <span>{progress.name || 'PLAYER_01'}</span>
            <span className="text-[#ff00ff] font-bold">[{progress.hollandCode}]</span>
          </div>

          <div className="hidden xl:block text-[11px] opacity-70">
            {timeStr}
          </div>

          {/* 376 MOET Majors Lookup Button */}
          {onOpenMajorsModal && (
            <button
              onClick={() => { playSound.click(settings.retroSound); onOpenMajorsModal(); }}
              className="border border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-[#0c0c0c] px-2 py-1 font-bold text-xs flex items-center gap-1 transition-colors"
              title="Tra cứu 376 Ngành Đào Tạo Đại Học Bộ GD&ĐT"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">376 NGÀNH BỘ GD&ĐT</span>
            </button>
          )}

          {/* Save/Load Game Button */}
          {onOpenSaveLoadModal && (
            <button
              onClick={() => { playSound.click(settings.retroSound); onOpenSaveLoadModal(); }}
              className="bg-[#00ff41] text-[#000] hover:bg-[#00e53a] px-2.5 py-1 font-bold text-xs flex items-center gap-1 transition-all border border-[#00ff41] shadow-md"
              title="Mở Quản Lý Lưu & Tải Game (Save/Load Slots)"
            >
              <Save className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">LƯU / TẢI GAME</span>
            </button>
          )}

          {/* Teacher Dashboard Button */}
          <button
            onClick={() => { playSound.click(settings.retroSound); onOpenDashboard(); }}
            className="border border-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c] px-2 py-1 font-bold text-xs flex items-center gap-1 transition-colors"
            title="Bảng điều khiển Giáo Viên & Xuất CSV"
          >
            <Users className="w-3.5 h-3.5" />
            <span className="hidden md:inline">GIÁO VIÊN</span>
          </button>

          {/* Quick Sound Toggle Button */}
          <button
            onClick={toggleSound}
            className={`px-2 py-1 border font-bold text-xs flex items-center gap-1 transition-colors ${
              settings.retroSound
                ? 'bg-[#00ff41] text-[#0c0c0c] border-[#00ff41]'
                : 'border-[#ff4444] text-[#ff4444] bg-[#000]'
            }`}
            title={settings.retroSound ? 'Bật âm thanh 8-bit' : 'Tắt âm thanh 8-bit'}
          >
            {settings.retroSound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{settings.retroSound ? 'AUDIO: ON' : 'AUDIO: OFF'}</span>
          </button>

          {/* Settings Panel Button */}
          <button
            onClick={() => { playSound.click(settings.retroSound); setIsSettingsOpen(true); }}
            className="p-1.5 border border-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c] transition-colors flex items-center gap-1"
            title="Mở Bảng Cài Đặt Hệ Thống"
          >
            <SettingsIcon className="w-3.5 h-3.5" />
            <span className="hidden lg:inline text-xs font-bold">CÀI ĐẶT</span>
          </button>
        </div>
      </div>

      {/* SETTINGS PANEL MODAL */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 font-mono text-[#00ff41]">
          <div className="w-full max-w-lg bg-[#0c0c0c] border-4 border-[#00ff41] p-6 shadow-2xl space-y-5 relative">
            
            {/* Header */}
            <div className="flex items-center justify-between border-b-2 border-[#00ff41] pb-3">
              <div className="flex items-center gap-2">
                <Sliders className="w-5 h-5 text-[#00ff41]" />
                <h3 className="text-base font-bold uppercase tracking-wider text-[#00ff41]">
                  CÀI ĐẶT HỆ THỐNG (SYSTEM SETTINGS)
                </h3>
              </div>

              <button
                onClick={() => { playSound.click(settings.retroSound); setIsSettingsOpen(false); }}
                className="p-1 border border-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c] transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Settings Options List */}
            <div className="space-y-4 text-xs">
              
              {/* 1. AUDIO 8-BIT SETTING TOGGLE */}
              <div className="p-3.5 bg-[#111] border border-[#00ff41]/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#00ff41]">
                    {settings.retroSound ? <Volume2 className="w-4 h-4 text-[#00ff41]" /> : <VolumeX className="w-4 h-4 text-[#ff4444]" />}
                    <span>ÂM THANH 8-BIT SFX (AUDIO EFFECTS)</span>
                  </div>

                  <button
                    onClick={toggleSound}
                    className={`px-3 py-1.5 font-bold text-xs uppercase border-2 transition-all flex items-center gap-1.5 ${
                      settings.retroSound
                        ? 'bg-[#00ff41] text-[#0c0c0c] border-[#00ff41]'
                        : 'bg-[#000] text-[#ff4444] border-[#ff4444]'
                    }`}
                  >
                    {settings.retroSound ? 'BẬT [ AUDIO ON ]' : 'TẮT [ AUDIO OFF ]'}
                  </button>
                </div>
                <p className="text-[11px] opacity-80 leading-relaxed">
                  Bật hoặc tắt toàn bộ hiệu ứng âm thanh 8-bit retro (click chuột, hoàn thành task, âm thanh chúc mừng, lỗi sai) trên toàn ứng dụng.
                </p>
              </div>

              {/* 2. CRT SCANLINES TOGGLE */}
              <div className="p-3.5 bg-[#111] border border-[#00ff41]/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#00ff41]">
                    <Tv className="w-4 h-4 text-[#00ff41]" />
                    <span>HIỆU ỨNG MÀN HÌNH CRT (SCANLINES)</span>
                  </div>

                  <button
                    onClick={toggleCRT}
                    className={`px-3 py-1.5 font-bold text-xs uppercase border-2 transition-all ${
                      settings.crtScanlines
                        ? 'bg-[#00ff41] text-[#0c0c0c] border-[#00ff41]'
                        : 'bg-[#000] text-[#00ff41] border-[#00ff41]/40'
                    }`}
                  >
                    {settings.crtScanlines ? 'BẬT [ CRT ON ]' : 'TẮT [ CRT OFF ]'}
                  </button>
                </div>
                <p className="text-[11px] opacity-80 leading-relaxed">
                  Bật hoặc tắt lớp phủ sọc quét ngang phong cách máy game Arcade retro năm 1990.
                </p>
              </div>

              {/* 3. ACADEMIC STRICT / ZODIAC MODE */}
              <div className="p-3.5 bg-[#111] border border-[#00ff41]/50 space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 font-bold text-sm text-[#00ff41]">
                    <ShieldCheck className="w-4 h-4 text-[#ff00ff]" />
                    <span>CHẾ ĐỘ HOÀNG ĐẠO HỌC THUẬT (ZODIAC)</span>
                  </div>

                  <button
                    onClick={toggleZodiac}
                    className={`px-3 py-1.5 font-bold text-xs uppercase border-2 transition-all ${
                      settings.showZodiac
                        ? 'bg-[#ff00ff] text-[#0c0c0c] border-[#ff00ff]'
                        : 'bg-[#000] text-[#00ff41] border-[#00ff41]/40'
                    }`}
                  >
                    {settings.showZodiac ? 'ZODIAC_ON' : 'STRICT_MODE'}
                  </button>
                </div>
                <p className="text-[11px] opacity-80 leading-relaxed">
                  Bật phân tích tham chiếu Hoàng Đạo Học Thuật bổ sung cho hồ sơ hướng nghiệp Holland.
                </p>
              </div>

              {/* 4. TRA CỨU 376 NGÀNH GD&ĐT */}
              {onOpenMajorsModal && (
                <div className="p-3.5 bg-[#111] border border-[#ff00ff]/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 font-bold text-sm text-[#ff00ff]">
                      <BookOpen className="w-4 h-4 text-[#ff00ff]" />
                      <span>TRA CỨU 376 NGÀNH BỘ GD&ĐT</span>
                    </div>

                    <button
                      onClick={() => {
                        playSound.click(settings.retroSound);
                        setIsSettingsOpen(false);
                        onOpenMajorsModal();
                      }}
                      className="px-3 py-1.5 font-bold text-xs uppercase bg-[#ff00ff] text-[#0c0c0c] border-2 border-[#ff00ff] hover:bg-[#d900d9] transition-all"
                    >
                      MỞ TRA CỨU
                    </button>
                  </div>
                  <p className="text-[11px] opacity-80 leading-relaxed">
                    Xem danh mục chuẩn hóa 376 ngành đại học phân theo 23 lĩnh vực đào tạo tại Việt Nam.
                  </p>
                </div>
              )}

              {/* 4. RESET DATA DANGER ZONE */}
              <div className="p-3 bg-[#111] border border-[#ff4444]/50 flex items-center justify-between gap-2 text-xs">
                <div>
                  <div className="font-bold text-[#ff4444] uppercase">XÓA DỮ LIỆU THỰC TẬP (RESET DATA)</div>
                  <div className="text-[10px] opacity-70">Xóa toàn bộ tiến trình & làm lại từ đầu</div>
                </div>

                <button
                  onClick={() => {
                    if (window.confirm('Bạn có chắc chắn muốn xóa toàn bộ tiến trình thực tập để bắt đầu lại từ đầu?')) {
                      playSound.click(settings.retroSound);
                      onResetData();
                      setIsSettingsOpen(false);
                    }
                  }}
                  className="px-3 py-1.5 bg-[#ff4444] text-[#0c0c0c] font-bold uppercase text-xs border border-[#ff4444] hover:bg-[#ff2222]"
                >
                  RESET DATA
                </button>
              </div>

            </div>

            {/* Footer close button */}
            <div className="pt-2">
              <button
                onClick={() => { playSound.click(settings.retroSound); setIsSettingsOpen(false); }}
                className="w-full py-2.5 bg-[#00ff41] text-[#0c0c0c] font-bold text-xs uppercase border-2 border-[#00ff41] hover:bg-[#00e53a] transition-all"
              >
                ĐÓNG BẢNG CÀI ĐẶT
              </button>
            </div>

          </div>
        </div>
      )}
    </header>
  );
};

