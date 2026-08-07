import React, { useState } from 'react';
import { TaskEvaluationResult, Settings } from '../../types';
import { playSound } from '../../utils/audio';
import { Newspaper, CheckCircle2, XCircle, Search, Edit3, ShieldCheck, AlertTriangle, FileText, Globe } from 'lucide-react';

interface ArticleLine {
  id: string;
  text: string;
  isError: boolean;
  correction?: string;
  errorCategory?: 'clickbait' | 'fake_news' | 'no_citation' | 'bias';
}

interface Props {
  taskData: {
    title: string;
    storyContext: string;
    articleLines: ArticleLine[];
  };
  settings: Settings;
  onEvaluateResult: (res: TaskEvaluationResult) => void;
}

export const FactCheckerTool: React.FC<Props> = ({ taskData, settings, onEvaluateResult }) => {
  const [activeTab, setActiveTab] = useState<'editor' | 'source_inspector'>('editor');
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [selectedVerdicts, setSelectedVerdicts] = useState<Record<string, string>>({});
  const [evalResult, setEvalResult] = useState<TaskEvaluationResult | null>(null);

  const toggleFlag = (id: string) => {
    playSound.click(settings.retroSound);
    setFlaggedIds(prev => 
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleSelectVerdict = (id: string, verdict: string) => {
    playSound.click(settings.retroSound);
    setSelectedVerdicts(prev => ({ ...prev, [id]: verdict }));
  };

  // Reader Trust Metric
  const totalErrors = taskData.articleLines.filter(l => l.isError).length;
  const correctlyFlagged = flaggedIds.filter(id => taskData.articleLines.find(l => l.id === id)?.isError).length;
  const trustScore = Math.min(100, Math.max(20, Math.round(50 + (correctlyFlagged * 25) - ((flaggedIds.length - correctlyFlagged) * 15))));

  const handleVerifyFactCheck = () => {
    playSound.click(settings.retroSound);
    let correctCount = 0;
    const details: string[] = [];

    taskData.articleLines.forEach(line => {
      const isFlagged = flaggedIds.includes(line.id);

      if (line.isError && isFlagged) {
        correctCount++;
        details.push(`[SỰ THẬT ĐƯỢC BẢO VỆ] Phát hiện lỗi tin giả/ngụy biện: "${line.text.slice(0, 35)}..." ➔ Đề xuất: ${line.correction || 'Đã sửa đổi đúng quy chuẩn.'}`);
      } else if (line.isError && !isFlagged) {
        details.push(`[LỖI SƠ SUẤT BÁO CHÍ] Bỏ sót câu thông tin giật gân/sai lệch: "${line.text.slice(0, 35)}..."`);
      } else if (!line.isError && isFlagged) {
        details.push(`[CẢNH BÁO MẠO NHẦM] Đánh dấu nhầm câu thông tin hoàn toàn chuẩn xác: "${line.text.slice(0, 35)}..."`);
      }
    });

    const isPassed = correctCount === totalErrors && flaggedIds.length === totalErrors;
    const score = isPassed ? 100 : Math.round((correctCount / totalErrors) * 70);

    const result: TaskEvaluationResult = {
      passed: isPassed,
      score,
      feedback: isPassed
        ? `Xuất sắc! Bàn biên tập đã làm sạch 100% tin giả & ngụy biện. Chỉ số niềm tin độc giả đạt tuyệt đối ${trustScore}%.`
        : `Bài báo chưa đạt quy chuẩn xuất bản (${correctCount}/${totalErrors} lỗi được xử lý). Hãy kiểm tra kỹ bản thảo.`,
      details
    };

    setEvalResult(result);
    if (isPassed) playSound.pass(settings.retroSound);
    else playSound.fail(settings.retroSound);

    onEvaluateResult(result);
  };

  return (
    <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-4 space-y-4 font-mono text-[#00ff41] select-none">
      {/* Header */}
      <div className="bg-[#111] p-3.5 border border-[#00ff41]/50 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black uppercase text-[#00ff41]">
            <Newspaper className="w-5 h-5 text-[#ff00ff]" />
            <span>TRÌNH BÀN BIÊN TẬP & XUYÊN SÂU FACT-CHECKING BÁO CHÍ</span>
          </div>
          <div className="px-2.5 py-1 bg-[#000] border border-[#ff00ff] text-[#ff00ff] font-bold text-[10px] uppercase flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>NIỀM TIN ĐỘC GIẢ: {trustScore}%</span>
          </div>
        </div>
        <p className="opacity-90 text-xs">
          Soi chiếu từng phát biểu trong bài báo, kiểm tra độ tin cậy của nguồn tin, gắn cờ các câu vi phạm và đưa ra kết luận sửa đổi xuất bản.
        </p>
      </div>

      {/* Tabs Selector */}
      <div className="flex gap-2 border-b border-[#00ff41]/40 pb-2">
        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('editor'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'editor'
              ? 'bg-[#00ff41] text-[#0c0c0c] border-white shadow-[0_0_10px_rgba(0,255,65,0.6)]'
              : 'bg-[#111] text-[#00ff41] border-[#00ff41]/40 hover:border-[#00ff41]'
          }`}
        >
          <FileText className="w-3.5 h-3.5" />
          <span>1. BẢN THẢO BÀI BÁO ({taskData.articleLines.length} CÂU)</span>
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('source_inspector'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'source_inspector'
              ? 'bg-[#ff00ff] text-[#0c0c0c] border-white shadow-[0_0_10px_rgba(255,0,255,0.6)]'
              : 'bg-[#111] text-[#ff00ff] border-[#ff00ff]/40 hover:border-[#ff00ff]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>2. SOI NGUỒN TIN & METADATA EXIF</span>
        </button>
      </div>

      {/* Tab 1: Editorial Manuscript Inspector */}
      {activeTab === 'editor' && (
        <div className="bg-[#111] border border-[#00ff41]/50 p-4 space-y-3 text-xs">
          <div className="text-[11px] font-bold uppercase flex items-center justify-between text-[#00ff41]">
            <span>BẢN THẢO BIÊN TẬP THỰC TẬP</span>
            <span className="text-[#ff00ff] font-black">ĐÃ GẮN CỜ LỖI: {flaggedIds.length} CÂU</span>
          </div>

          <div className="space-y-3">
            {taskData.articleLines.map((line, idx) => {
              const isFlagged = flaggedIds.includes(line.id);

              return (
                <div
                  key={line.id}
                  className={`p-3.5 border transition-all text-xs leading-relaxed space-y-2.5 ${
                    isFlagged
                      ? 'bg-[#000] border-[#ff00ff] text-[#ff00ff] shadow-[0_0_15px_rgba(255,0,255,0.2)]'
                      : 'bg-[#000] border-[#00ff41]/40 text-[#00ff41] hover:border-[#00ff41]'
                  }`}
                >
                  <div 
                    onClick={() => toggleFlag(line.id)}
                    className="flex items-start justify-between gap-3 cursor-pointer"
                  >
                    <div className="flex gap-2.5">
                      <span className="opacity-70 font-black text-sm">#{idx + 1}</span>
                      <span className={`text-xs font-mono ${isFlagged ? 'line-through text-[#ff00ff] font-bold' : 'text-white'}`}>
                        {line.text}
                      </span>
                    </div>

                    <div className="shrink-0 text-[10px]">
                      {isFlagged ? (
                        <span className="bg-[#ff00ff] text-[#0c0c0c] px-2 py-1 font-black uppercase shadow">
                          🚩 CỜ SAI PHẠM
                        </span>
                      ) : (
                        <span className="bg-[#111] border border-[#00ff41]/50 text-[#00ff41] px-2 py-1 hover:bg-[#00ff41] hover:text-[#0c0c0c]">
                          GẮN CỜ LỖI
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Flagged Error Correction Suite */}
                  {isFlagged && (
                    <div className="bg-[#111] p-3 border border-[#ff00ff]/60 space-y-2 text-xs font-mono">
                      <div className="text-[10px] text-[#00ff41] font-bold uppercase flex items-center gap-1.5">
                        <Edit3 className="w-3.5 h-3.5 text-[#00ff41]" />
                        <span>QUY TRÌNH CHỈNH SỬA XUẤT BẢN CHUẨN BÁO CHÍ:</span>
                      </div>

                      <div className="text-[#00ff41] bg-[#000] p-2 border border-[#00ff41]/40 leading-relaxed text-[11px]">
                        <strong>Đề xuất sửa lại:</strong> {line.correction || 'Cần dẫn chứng nguồn báo cáo chính thức và loại bỏ từ ngữ giật gân.'}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Tab 2: Source & Metadata Analyzer */}
      {activeTab === 'source_inspector' && (
        <div className="bg-[#111] border border-[#ff00ff]/60 p-4 space-y-4 text-xs">
          <div className="text-xs font-bold text-[#ff00ff] uppercase border-b border-[#ff00ff]/40 pb-2 flex items-center justify-between">
            <span>CÔNG CỤ SOI METADATA & ĐỘ TIN CÂY NGUỒN TIN (INVESTIGATIVE SUITE)</span>
            <span className="text-[10px] text-[#00ff41]">ISO JOURNALISM 2026</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div className="bg-[#000] p-3 border border-[#ff00ff]/40 space-y-2">
              <div className="font-bold text-[#ff00ff] text-xs">🔍 PHÂN TÍCH TÊN MIỀN & TÁC GIẢ</div>
              <p className="text-[11px] text-white/80 leading-relaxed">
                • Domain trích dẫn: <span className="text-[#00ff41]">moet.gov.vn</span> (Xác thực chính phủ chuẩn)<br/>
                • Tác giả bài viết: Phóng viên ban Giáo dục Đào tạo<br/>
                • Chỉ số uy tín tác giả: <strong>98/100</strong>
              </p>
            </div>

            <div className="bg-[#000] p-3 border border-[#ff00ff]/40 space-y-2">
              <div className="font-bold text-[#ff00ff] text-xs">📸 METADATA HÌNH ẢNH & VIDEO</div>
              <p className="text-[11px] text-white/80 leading-relaxed">
                • Ảnh EXIF: Canon EOS R5 // 2026-08-01 09:30:00<br/>
                • Reverse Image Search: 0% trùng lặp ghép ảnh AI<br/>
                • Đánh giá ảnh: <strong>Ảnh gốc chụp thực tế</strong>
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Verify Submit Button */}
      <button
        disabled={flaggedIds.length === 0}
        onClick={handleVerifyFactCheck}
        className="w-full py-3 bg-[#00ff41] text-[#0c0c0c] font-black text-xs uppercase flex items-center justify-center gap-2 border-2 border-white hover:bg-[#00e53a] disabled:opacity-40 shadow-[0_0_20px_rgba(0,255,65,0.6)] cursor-pointer transition-all active:scale-[0.99]"
      >
        <Search className="w-4 h-4" />
        <span>XÁC NHẬN BÀI BIÊN TẬP & DUYỆT XUẤT BẢN BÁO CHÍ</span>
      </button>

      {/* Result feedback */}
      {evalResult && (
        <div className={`p-4 border text-xs font-bold space-y-2.5 ${
          evalResult.passed ? 'bg-[#000] border-[#00ff41] text-[#00ff41]' : 'bg-[#000] border-[#ff4444] text-[#ff4444]'
        }`}>
          <div className="flex items-center gap-2 text-sm">
            {evalResult.passed ? <CheckCircle2 className="w-6 h-6 text-[#00ff41] shrink-0" /> : <XCircle className="w-6 h-6 text-[#ff4444] shrink-0" />}
            <span>{evalResult.feedback}</span>
          </div>
          {evalResult.details && (
            <div className="space-y-1.5 text-[11px] pt-2 border-t border-[#00ff41]/30 font-mono">
              {evalResult.details.map((d, i) => (
                <div key={i} className="p-1.5 bg-[#111] border border-[#00ff41]/30">
                  {d}
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
