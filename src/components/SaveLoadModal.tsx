import React, { useState, useEffect } from 'react';
import { UserProgress, Settings, SaveSlot } from '../types';
import { playSound } from '../utils/audio';
import {
  getAllSaveSlots,
  saveToSlot,
  loadFromSlot,
  deleteSaveSlot,
  exportProgressJSON,
  importProgressJSON
} from '../utils/storage';
import { Save, Download, Upload, Trash2, RotateCcw, X, Sparkles, CheckCircle2, AlertTriangle, ShieldCheck, Gamepad2, FileJson } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  progress: UserProgress;
  settings: Settings;
  isOpen: boolean;
  onClose: () => void;
  onLoadProgress: (newProgress: UserProgress) => void;
}

export const SaveLoadModal: React.FC<Props> = ({
  progress,
  settings,
  isOpen,
  onClose,
  onLoadProgress
}) => {
  const [slots, setSlots] = useState<Record<string, SaveSlot>>({});
  const [slotNamesInput, setSlotNamesInput] = useState<Record<string, string>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [lastSavedAlert, setLastSavedAlert] = useState<{
    slotIndex: string;
    slotTitle: string;
    timestamp: string;
  } | null>(null);

  const slotIds = ['auto', 'slot_1', 'slot_2', 'slot_3', 'slot_4', 'slot_5'];

  useEffect(() => {
    if (isOpen) {
      refreshSlots();
    }
  }, [isOpen]);

  const refreshSlots = () => {
    const allSlots = getAllSaveSlots();
    setSlots(allSlots);
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  if (!isOpen) return null;

  const handleSaveToSlot = (slotId: string) => {
    playSound.click(settings.retroSound);
    const customTitle = slotNamesInput[slotId] || undefined;
    const savedSlot = saveToSlot(slotId, progress, customTitle);
    refreshSlots();
    
    const slotIdx = slotId === 'auto' ? 'Auto-Save' : `Slot 0${slotIds.indexOf(slotId)}`;
    const timestamp = savedSlot.timestamp || new Date().toLocaleString('vi-VN');

    setLastSavedAlert({
      slotIndex: slotIdx,
      slotTitle: savedSlot.title,
      timestamp
    });

    showToast(`✅ Đã lưu thành công vào ${slotIdx} [${timestamp}]!`);
    confetti({ particleCount: 40, spread: 50, origin: { y: 0.6 } });
  };

  const handleLoadFromSlot = (slotId: string) => {
    playSound.click(settings.retroSound);
    const loaded = loadFromSlot(slotId);
    if (loaded) {
      onLoadProgress(loaded);
      showToast(`📂 Đã tải thành công bản lưu [${slots[slotId]?.title || slotId}]!`);
      onClose();
    } else {
      showToast(`❌ Không tìm thấy bản lưu ở ô này!`);
    }
  };

  const handleDeleteSlot = (slotId: string) => {
    playSound.click(settings.retroSound);
    if (window.confirm(`Bạn có chắc chắn muốn xóa bản lưu ở [${slots[slotId]?.title || slotId}]?`)) {
      deleteSaveSlot(slotId);
      refreshSlots();
      showToast(`🗑️ Đã xóa bản lưu [${slotId}]!`);
    }
  };

  const handleExportJSON = () => {
    playSound.click(settings.retroSound);
    exportProgressJSON(progress);
    showToast(`📥 Đã tải xuống file sao lưu (.json)!`);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const jsonText = event.target?.result as string;
        const imported = importProgressJSON(jsonText);
        onLoadProgress(imported);
        playSound.click(settings.retroSound);
        showToast(`🎉 Khôi phục game từ file thành công!`);
        confetti({ particleCount: 80, spread: 60 });
        onClose();
      } catch (err) {
        alert('File lưu game (.json) không hợp lệ hoặc bị hỏng!');
      }
    };
    reader.readAsText(file);
  };

  const careerNameMap: Record<string, string> = {
    edtech: 'EdTech / Lập Trình Viên',
    healthcare: 'Y Tế / Cấp Cứu',
    education: 'Giáo Dục / Giáo Viên',
    humanities: 'Báo Chí / Truyền Thông',
    science: 'Sinh Học / Lab Tech'
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-6 font-mono text-[#00ff41] select-none">
      
      {/* Toast Banner */}
      {toastMessage && (
        <div className="fixed top-5 left-1/2 -translate-x-1/2 z-50 bg-[#00ff41] text-[#000] font-black px-6 py-3 border-2 border-[#000] shadow-[0_0_30px_#00ff41] flex items-center gap-2 text-xs uppercase animate-bounce">
          <Sparkles className="w-4 h-4" />
          <span>{toastMessage}</span>
        </div>
      )}

      <div className="w-full max-w-4xl bg-[#080d08] border-4 border-[#00ff41] p-4 sm:p-6 space-y-5 shadow-[0_0_60px_rgba(0,255,65,0.25)] relative max-h-[92vh] overflow-y-auto">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#00ff41] pb-3 gap-2">
          <div className="flex items-center gap-2">
            <Gamepad2 className="w-6 h-6 text-[#00ff41]" />
            <div>
              <h2 className="text-base sm:text-lg font-black uppercase text-white tracking-wider flex items-center gap-2">
                <span>QUẢN LÝ LƯU & TẢI GAME (SAVE / LOAD SYSTEM)</span>
                <span className="text-xs bg-[#00ff41] text-[#000] px-2 py-0.5 font-extrabold">RETRO V5</span>
              </h2>
              <p className="text-[11px] text-[#00ff41]/80">
                Lưu tiến trình thực tập 8 tuần vào các ô Save Slot hoặc xuất file .JSON để chuyển máy
              </p>
            </div>
          </div>

          <button
            onClick={() => { playSound.click(settings.retroSound); onClose(); }}
            className="p-1.5 border-2 border-[#00ff41] text-[#00ff41] hover:bg-[#00ff41] hover:text-[#000] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Current Active Character Banner */}
        <div className="bg-[#000] border-2 border-[#ff00ff] p-3 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#ff00ff] text-[#000] font-black text-xl flex items-center justify-center shrink-0">
              🎮
            </div>
            <div>
              <span className="text-[10px] text-[#ff00ff] font-bold uppercase block">
                NHÂN VẬT HIỆN TẠI (ACTIVE SESSION)
              </span>
              <div className="text-sm font-black text-white uppercase">
                {progress.name} // {progress.school} ({progress.className})
              </div>
              <div className="text-xs text-[#00ff41]">
                Cổng: <span className="uppercase text-white font-bold">{progress.currentGate}</span> | Tuần: <span className="text-[#ff00ff] font-bold">{progress.currentWeek}/8</span> | Ngành: <span className="text-white font-bold">{progress.chosenCareer ? careerNameMap[progress.chosenCareer] : 'Chưa chọn'}</span>
              </div>
            </div>
          </div>

          <button
            onClick={handleExportJSON}
            className="bg-[#ff00ff] text-[#000] hover:bg-[#d900d9] px-4 py-2 font-black text-xs uppercase flex items-center gap-1.5 border border-[#ff00ff] shadow-md transition-all"
          >
            <FileJson className="w-4 h-4" />
            <span>XUẤT FILE SAO LƯU (.JSON)</span>
          </button>
        </div>

        {/* Save Confirmation Alert Notification Banner */}
        {lastSavedAlert && (
          <div className="bg-[#00ff41]/10 border-2 border-[#00ff41] p-3.5 flex items-center justify-between gap-3 text-xs font-mono text-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.2)] animate-pulse">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#00ff41] shrink-0" />
              <div>
                <div className="font-black uppercase text-white flex items-center gap-2">
                  <span>XÁC NHẬN ĐÃ LƯU TRẠNG THÁI THÀNH CÔNG</span>
                  <span className="bg-[#00ff41] text-[#000] px-1.5 py-0.5 font-extrabold text-[10px]">
                    {lastSavedAlert.slotIndex}
                  </span>
                </div>
                <p className="text-[11px] text-[#00ff41]/90">
                  Dữ liệu hiện tại của <span className="text-white font-bold">{progress.name}</span> đã được ghi vào bản lưu <span className="text-white font-bold">[{lastSavedAlert.slotTitle}]</span> lúc <span className="text-[#ff00ff] font-bold">{lastSavedAlert.timestamp}</span>.
                </p>
              </div>
            </div>

            <button
              onClick={() => setLastSavedAlert(null)}
              className="text-xs text-white/80 hover:text-white px-2.5 py-1 border border-[#00ff41]/60 hover:bg-[#00ff41] hover:text-[#000] transition-colors shrink-0"
            >
              ĐÓNG
            </button>
          </div>
        )}

        {/* Save Slots List Grid */}
        <div className="space-y-3">
          <div className="text-xs font-black uppercase text-[#00ff41] flex items-center gap-2">
            <Save className="w-4 h-4" />
            <span>DANH SÁCH CÁC Ô LƯU (SAVE SLOTS)</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {slotIds.map((slotId, index) => {
              const isAuto = slotId === 'auto';
              const slot = slots[slotId];
              const hasData = !!slot;

              return (
                <div
                  key={slotId}
                  className={`p-3.5 border-2 relative space-y-2.5 transition-all ${
                    isAuto
                      ? 'bg-[#0f190f] border-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.15)]'
                      : hasData
                      ? 'bg-[#111] border-[#00ff41]/80 hover:border-[#00ff41]'
                      : 'bg-[#050505] border-[#00ff41]/30 hover:border-[#00ff41]/60'
                  }`}
                >
                  {/* Slot Label Bar */}
                  <div className="flex items-center justify-between border-b border-[#00ff41]/30 pb-2">
                    <span className={`text-xs font-black uppercase px-2 py-0.5 ${
                      isAuto ? 'bg-[#00ff41] text-[#000]' : 'bg-[#222] text-[#00ff41] border border-[#00ff41]/50'
                    }`}>
                      {isAuto ? '⚡ AUTO-SAVE SLOT' : `SLOT 0${index}`}
                    </span>

                    <span className="text-[10px] text-white/60">
                      {hasData ? slot.timestamp : '[ Ô MÁY TRỐNG ]'}
                    </span>
                  </div>

                  {/* Slot Content Data */}
                  {hasData ? (
                    <div className="space-y-1.5 text-xs">
                      <div className="font-bold text-white text-sm truncate">
                        {slot.title}
                      </div>

                      <div className="grid grid-cols-2 gap-2 text-[11px] text-[#00ff41]/90 bg-[#000] p-2 border border-[#00ff41]/30">
                        <div>
                          👤 <span className="text-white font-bold">{slot.summary.playerName}</span>
                        </div>
                        <div>
                          🏛️ <span className="text-white">{slot.summary.school}</span>
                        </div>
                        <div>
                          🎯 Tuần: <span className="text-[#ff00ff] font-bold">{slot.summary.week}/8</span>
                        </div>
                        <div>
                          💼 Mã: <span className="text-[#00ff41] font-bold">{slot.summary.hollandCode}</span>
                        </div>
                      </div>

                      {/* Control Buttons */}
                      <div className="flex items-center gap-2 pt-1">
                        <button
                          onClick={() => handleLoadFromSlot(slotId)}
                          className="flex-1 py-1.5 bg-[#00ff41] text-[#000] font-black text-xs uppercase hover:bg-[#00e53a] flex items-center justify-center gap-1 border border-[#00ff41]"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>TẢI BẢN LƯU</span>
                        </button>

                        {!isAuto && (
                          <button
                            onClick={() => handleSaveToSlot(slotId)}
                            className="py-1.5 px-3 bg-[#000] text-[#00ff41] border border-[#00ff41] font-bold text-xs uppercase hover:bg-[#00ff41] hover:text-[#000]"
                            title="Ghi đè ô lưu này"
                          >
                            <Save className="w-3.5 h-3.5" />
                          </button>
                        )}

                        {!isAuto && (
                          <button
                            onClick={() => handleDeleteSlot(slotId)}
                            className="py-1.5 px-2.5 bg-[#111] text-[#ff4444] border border-[#ff4444] font-bold text-xs hover:bg-[#ff4444] hover:text-[#000]"
                            title="Xóa ô này"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    /* Empty Slot View */
                    <div className="py-4 text-center space-y-2">
                      <div className="text-xs text-white/50 italic">
                        Ô lưu này chưa có dữ liệu
                      </div>

                      <button
                        onClick={() => handleSaveToSlot(slotId)}
                        className="px-4 py-2 bg-[#00ff41]/20 text-[#00ff41] border border-[#00ff41] font-black text-xs uppercase hover:bg-[#00ff41] hover:text-[#000] transition-all"
                      >
                        💾 LƯU TIẾN TRÌNH VÀO Ô NÀY
                      </button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* File Import Section */}
        <div className="bg-[#111] border-2 border-[#00ff41]/50 p-4 space-y-2 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <div className="text-xs font-bold text-white uppercase flex items-center gap-1.5">
              <Upload className="w-4 h-4 text-[#00ff41]" />
              <span>KHÔI PHỤC GAME TỪ FILE BACKUP METADATA (.JSON)</span>
            </div>
            <p className="text-[11px] text-[#00ff41]/70">
              Bạn có thể tải file `.json` đã xuất trước đó từ thiết bị khác để tiếp tục màn chơi.
            </p>
          </div>

          <label className="cursor-pointer bg-[#00ff41] text-[#000] hover:bg-[#00e53a] px-4 py-2 font-black text-xs uppercase flex items-center gap-2 border border-[#00ff41] shrink-0">
            <Upload className="w-4 h-4" />
            <span>TẢI FILE SAVE (.JSON) UP</span>
            <input
              type="file"
              accept=".json"
              onChange={handleFileUpload}
              className="hidden"
            />
          </label>
        </div>

        {/* Footer Close Button */}
        <div className="pt-2">
          <button
            onClick={() => { playSound.click(settings.retroSound); onClose(); }}
            className="w-full py-3 bg-[#00ff41] text-[#000] font-black text-xs uppercase border-2 border-[#00ff41] hover:bg-[#00e53a] transition-all"
          >
            ĐÓNG BẢNG QUẢN LÝ SAVE/LOAD
          </button>
        </div>

      </div>
    </div>
  );
};
