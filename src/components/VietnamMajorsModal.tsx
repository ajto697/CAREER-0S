import React, { useState } from 'react';
import { VIETNAM_MAJORS_CATALOG, TOTAL_MAJORS_COUNT } from '../data/vietnamMajorsData';
import { playSound } from '../utils/audio';
import { Settings, CareerId } from '../types';
import { BookOpen, Search, X, Layers, ChevronRight, GraduationCap, PlayCircle, Sparkles } from 'lucide-react';

interface Props {
  settings: Settings;
  onClose: () => void;
  onSelectRoleplay?: (careerId: CareerId) => void;
}

export const VietnamMajorsModal: React.FC<Props> = ({ settings, onClose, onSelectRoleplay }) => {
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | 'all'>('all');

  // Filter categories and majors based on search query and selected category
  const filteredCatalog = VIETNAM_MAJORS_CATALOG.filter(category => {
    if (selectedCategoryId !== 'all' && category.id !== selectedCategoryId) {
      return false;
    }
    if (!searchQuery.trim()) return true;

    const query = searchQuery.toLowerCase().trim();
    const matchesCategoryName = category.name.toLowerCase().includes(query);
    const matchesMajors = category.groups.some(group =>
      group.subCategory.toLowerCase().includes(query) ||
      group.majors.some(m => m.toLowerCase().includes(query))
    );

    return matchesCategoryName || matchesMajors;
  });

  const totalMatchingMajors = filteredCatalog.reduce((acc, cat) => {
    return acc + cat.groups.reduce((gAcc, group) => {
      const matchingInGroup = group.majors.filter(m => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase().trim();
        return m.toLowerCase().includes(query) || group.subCategory.toLowerCase().includes(query) || cat.name.toLowerCase().includes(query);
      });
      return gAcc + matchingInGroup.length;
    }, 0);
  }, 0);

  const handleLaunchSimulation = (careerId: CareerId) => {
    playSound.click(settings.retroSound);
    onClose();
    if (onSelectRoleplay) {
      onSelectRoleplay(careerId);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 flex items-center justify-center p-3 sm:p-5 font-mono text-[#00ff41] select-none">
      <div className="w-full max-w-5xl h-[88vh] bg-[#0c0c0c] border-4 border-[#00ff41] p-4 sm:p-6 shadow-2xl flex flex-col justify-between relative">
        
        {/* Header */}
        <div className="border-b-2 border-[#00ff41] pb-3 space-y-2 shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-[#ff00ff]" />
              <h2 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-[#00ff41]">
                TRA CỨU 376 NGÀNH ĐÀO TẠO BỘ GD&ĐT (23 LĨNH VỰC - CÓ MÔ PHỎNG NHẬP VAI)
              </h2>
            </div>

            <button
              onClick={() => { playSound.click(settings.retroSound); onClose(); }}
              className="p-1.5 border border-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c] transition-all flex items-center gap-1 font-bold text-xs"
            >
              <X className="w-4 h-4" />
              <span className="hidden sm:inline">ĐÓNG</span>
            </button>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <p className="opacity-80 text-[11px]">
              Danh mục chuẩn hóa cấp 4 BỘ GD&ĐT — Bấm vào bất kỳ ngành nào để chọn & kích hoạt Mô Phỏng Nhập Vai Thực Tế 8 Tuần.
            </p>
            <div className="bg-[#111] px-2.5 py-1 border border-[#00ff41] text-[#ff00ff] font-bold text-[11px] shrink-0 uppercase">
              TỔNG SỐ: {TOTAL_MAJORS_COUNT} NGÀNH // KHỚP: {totalMatchingMajors}
            </div>
          </div>
        </div>

        {/* Filter Controls Bar */}
        <div className="py-3 flex flex-col sm:flex-row gap-2 shrink-0 border-b border-[#00ff41]/30">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#00ff41] opacity-70" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Nhập tên ngành, nhóm ngành (ví dụ: Công nghệ thông tin, Sư phạm, Luật, Y khoa)..."
              className="w-full bg-[#111] text-[#00ff41] border border-[#00ff41] pl-9 pr-3 py-1.5 text-xs focus:outline-none focus:bg-[#181818] font-mono"
            />
          </div>

          {/* Category Dropdown */}
          <div className="sm:w-72">
            <select
              value={selectedCategoryId}
              onChange={(e) => {
                playSound.click(settings.retroSound);
                setSelectedCategoryId(e.target.value === 'all' ? 'all' : Number(e.target.value));
              }}
              className="w-full bg-[#111] text-[#00ff41] border border-[#00ff41] px-2.5 py-1.5 text-xs focus:outline-none font-mono"
            >
              <option value="all">TẤT CẢ 23 LĨNH VỰC (BỘ GD&ĐT)</option>
              {VIETNAM_MAJORS_CATALOG.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Scrollable Majors Catalog Feed */}
        <div className="flex-1 overflow-y-auto my-3 pr-2 space-y-4 custom-scrollbar">
          {filteredCatalog.length === 0 ? (
            <div className="text-center py-16 opacity-60 text-xs">
              [ KHÔNG TÌM THẤY NGÀNH NÀO KHỚP VỚI TỪ KHÓA "{searchQuery}" ]
            </div>
          ) : (
            filteredCatalog.map(category => (
              <div key={category.id} className="bg-[#111] border border-[#00ff41]/50 p-3.5 space-y-3">
                {/* Category Header with Roleplay Action Button */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#00ff41]/30 pb-2.5 gap-2">
                  <div className="flex items-center gap-2 font-bold text-xs uppercase text-[#00ff41]">
                    <Layers className="w-4 h-4 text-[#ff00ff]" />
                    <span>{category.name}</span>
                    <span className="text-[10px] bg-[#000] px-2 py-0.5 border border-[#00ff41]/40 text-[#ff00ff] font-bold">
                      MÃ: {category.code}
                    </span>
                  </div>

                  {/* Direct Roleplay Simulation Launch Button for this Category */}
                  {onSelectRoleplay && (
                    <button
                      onClick={() => handleLaunchSimulation(category.relatedCareerId)}
                      className="bg-[#000] hover:bg-[#00ff41] text-[#00ff41] hover:text-[#0c0c0c] border border-[#00ff41] px-3 py-1 text-[11px] font-bold uppercase transition-all flex items-center gap-1.5 shrink-0 shadow-[0_0_10px_rgba(0,255,65,0.2)]"
                      title={category.simulationToolName}
                    >
                      <PlayCircle className="w-3.5 h-3.5 text-[#ff00ff]" />
                      <span>NHẬP VAI MÔ PHỎNG TRỰC TIẾP</span>
                      <Sparkles className="w-3 h-3 text-[#ff00ff]" />
                    </button>
                  )}
                </div>

                <div className="text-[11px] text-[#00ff41]/80 italic bg-[#000]/60 p-1.5 border-l-2 border-[#ff00ff] flex items-center gap-2">
                  <span>🎮 Công cụ nhập vai:</span>
                  <span className="text-white font-semibold not-italic">{category.simulationToolName}</span>
                </div>

                {/* Subgroups & Majors Grid */}
                <div className="space-y-3">
                  {category.groups.map((group, gIdx) => {
                    const matchingMajors = group.majors.filter(m => {
                      if (!searchQuery.trim()) return true;
                      const q = searchQuery.toLowerCase().trim();
                      return m.toLowerCase().includes(q) || group.subCategory.toLowerCase().includes(q) || category.name.toLowerCase().includes(q);
                    });

                    if (matchingMajors.length === 0) return null;

                    return (
                      <div key={gIdx} className="bg-[#000] p-2.5 border border-[#00ff41]/30 space-y-2">
                        <div className="text-[11px] font-bold text-[#ff00ff] uppercase flex items-center gap-1">
                          <ChevronRight className="w-3.5 h-3.5 text-[#00ff41]" />
                          <span>{group.subCategory} ({matchingMajors.length} ngành)</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 text-xs pt-1">
                          {matchingMajors.map((major, mIdx) => (
                            <div
                              key={mIdx}
                              onClick={() => {
                                if (onSelectRoleplay) {
                                  handleLaunchSimulation(category.relatedCareerId);
                                }
                              }}
                              className="bg-[#111] p-2 border border-[#00ff41]/40 hover:border-[#00ff41] hover:bg-[#00ff41]/10 hover:text-[#ff00ff] transition-all flex items-center justify-between gap-1.5 cursor-pointer group"
                            >
                              <div className="flex items-center gap-1.5 min-w-0">
                                <GraduationCap className="w-3.5 h-3.5 text-[#00ff41] shrink-0 group-hover:text-[#ff00ff]" />
                                <span className="font-semibold leading-tight truncate">{major}</span>
                              </div>
                              {onSelectRoleplay && (
                                <span className="text-[9px] bg-[#000] text-[#00ff41] group-hover:bg-[#ff00ff] group-hover:text-[#000] px-1.5 py-0.5 border border-[#00ff41]/40 uppercase shrink-0 font-mono font-bold">
                                  VÀO
                                </span>
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="pt-2 border-t-2 border-[#00ff41] flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs">
          <div className="text-[11px] opacity-80">
            💡 Bấm vào bất kỳ ngành nào trong 23 nhóm ngành để kích hoạt ngay môi trường nhập vai thực tế.
          </div>

          <button
            onClick={() => { playSound.click(settings.retroSound); onClose(); }}
            className="w-full sm:w-auto px-6 py-2 bg-[#00ff41] text-[#0c0c0c] font-bold text-xs uppercase border-2 border-[#00ff41] hover:bg-[#00e53a] transition-all"
          >
            ĐÓNG BẢNG TRA CỨU
          </button>
        </div>

      </div>
    </div>
  );
};
