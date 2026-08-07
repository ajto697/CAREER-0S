import React from 'react';
import { UserProgress, Settings } from '../types';
import { exportClassDataCSV } from '../utils/storage';
import { playSound } from '../utils/audio';
import { Users, ShieldCheck, X, FileSpreadsheet } from 'lucide-react';

interface Props {
  progress: UserProgress;
  settings: Settings;
  onClose: () => void;
}

export const TeacherDashboardModal: React.FC<Props> = ({ progress, settings, onClose }) => {
  const handleDownloadCSV = () => {
    playSound.click(settings.retroSound);
    const csvContent = exportClassDataCSV(progress);
    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `CareerOS_Lop_${progress.className}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4 font-mono text-[#00ff41] select-none">
      <div className="bg-[#0c0c0c] border-4 border-[#00ff41] p-6 max-w-2xl w-full space-y-5 shadow-2xl relative">
        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#00ff41] pb-3">
          <div className="flex items-center gap-2 font-bold text-sm uppercase text-[#00ff41]">
            <Users className="w-5 h-5 text-[#00ff41]" />
            <span>BẢNG ĐIỀU KHIỂN BÁO CÁO GIÁO VIÊN (DASHBOARD P4)</span>
          </div>

          <button
            onClick={() => { playSound.click(settings.retroSound); onClose(); }}
            className="p-1 bg-[#111] text-[#00ff41] border border-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c]"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Privacy Notice P4 */}
        <div className="p-3 bg-[#111] border border-[#ff00ff] text-xs flex items-start gap-2.5">
          <ShieldCheck className="w-5 h-5 text-[#ff00ff] shrink-0 mt-0.5" />
          <div>
            <strong className="text-[#ff00ff] uppercase block text-[11px]">BẢO MẬT & BẢO VỆ DỮ LIỆU VỊ THÀNH NIÊN (P4 PRIVACY):</strong>
            <span className="opacity-90">
              Toàn bộ dữ liệu điểm trắc nghiệm, kết quả 8 tuần thực tập và nhật ký phản tư được lưu trữ tuyệt đối an toàn ngay tại trình duyệt (`localStorage`). Không truyền gửi qua bất kỳ máy chủ trung gian nào.
            </span>
          </div>
        </div>

        {/* Student Data Summary Card */}
        <div className="bg-[#111] p-4 border border-[#00ff41]/50 space-y-3 text-xs">
          <div className="font-bold uppercase text-[11px] text-[#00ff41]">THÔNG TIN DỮ LIỆU LỚP DỰ KIẾN XUẤT CSV:</div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            <div className="bg-[#000] p-2.5 border border-[#00ff41]/40">
              <div className="text-[10px] opacity-70">HỌ VÀ TÊN</div>
              <div className="font-bold">{progress.name}</div>
            </div>

            <div className="bg-[#000] p-2.5 border border-[#00ff41]/40">
              <div className="text-[10px] opacity-70">TRƯỜNG / LỚP</div>
              <div className="font-bold text-[#ff00ff]">{progress.school} - {progress.className}</div>
            </div>

            <div className="bg-[#000] p-2.5 border border-[#00ff41]/40">
              <div className="text-[10px] opacity-70">MÃ HOLLAND</div>
              <div className="font-bold text-[#00ff41]">{progress.hollandCode}</div>
            </div>

            <div className="bg-[#000] p-2.5 border border-[#00ff41]/40">
              <div className="text-[10px] opacity-70">TUẦN THỰC TẬP</div>
              <div className="font-bold">Tuần {progress.currentWeek}/8</div>
            </div>

            <div className="bg-[#000] p-2.5 border border-[#00ff41]/40">
              <div className="text-[10px] opacity-70">ĐIỂM PHẢN TƯ (SP)</div>
              <div className="font-bold text-[#ff00ff]">{progress.reflectionPoints} SP</div>
            </div>

            <div className="bg-[#000] p-2.5 border border-[#00ff41]/40">
              <div className="text-[10px] opacity-70">DANH HIỆU</div>
              <div className="font-bold truncate">{progress.badges.join(', ')}</div>
            </div>
          </div>
        </div>

        {/* Action Button: Download CSV */}
        <div className="pt-2">
          <button
            onClick={handleDownloadCSV}
            className="w-full py-3 bg-[#00ff41] text-[#0c0c0c] font-bold text-xs uppercase flex items-center justify-center gap-2 border-2 border-[#00ff41] hover:bg-[#00e53a] transition-all"
          >
            <FileSpreadsheet className="w-5 h-5" />
            <span>XUẤT FILE BÁO CÁO CSV DÀNH CHO GIÁO VIÊN (EXCEL)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
