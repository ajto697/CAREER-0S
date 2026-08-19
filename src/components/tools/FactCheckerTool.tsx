import React, { useState, useEffect } from 'react';
import { TaskEvaluationResult, Settings, JournalismState } from '../../types';
import { playSound } from '../../utils/audio';
import {
  Newspaper,
  CheckCircle2,
  XCircle,
  Search,
  Edit3,
  ShieldCheck,
  AlertTriangle,
  FileText,
  Globe,
  Mic,
  Volume2,
  Sparkles,
  Scale,
  Check,
  Radio,
  Send,
  MessageSquare,
  Users,
  Shield,
  Layers,
  Award,
  ChevronRight,
  Eye,
  AlertCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ArticleLine {
  id: string;
  text: string;
  isError: boolean;
  correction?: string;
  errorCategory?: 'clickbait' | 'fake_news' | 'no_citation' | 'bias';
}

interface Props {
  taskData: {
    title?: string;
    storyContext?: string;
    articleLines: ArticleLine[];
  };
  settings: Settings;
  onEvaluateResult: (res: TaskEvaluationResult) => void;
  currentWeek?: number;
  journalismState?: JournalismState;
  onUpdateJournalismState?: (newState: JournalismState) => void;
  equippedToolId?: string;
  unlockedSkills?: string[];
}

const DEFAULT_STATE: JournalismState = {
  truthAccuracy: 80,
  publicImpact: 70,
  legalRisk: 20,
  editorialIntegrity: 85,
  sourceTrust: 75,
  sponsorPressure: 35,
  editorTrustThanh: 70,
  flags: []
};

export const FactCheckerTool: React.FC<Props> = ({
  taskData,
  settings,
  onEvaluateResult,
  currentWeek = 1,
  journalismState,
  onUpdateJournalismState,
  equippedToolId,
  unlockedSkills = []
}) => {
  const [state, setState] = useState<JournalismState>(journalismState || DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<'editor' | 'dilemma_essay' | 'sources' | 'newsroom'>('editor');
  const [flaggedIds, setFlaggedIds] = useState<string[]>([]);
  const [evalResult, setEvalResult] = useState<TaskEvaluationResult | null>(null);
  const [osintHint, setOsintHint] = useState<string | null>(null);
  const [rubricFeedbackList, setRubricFeedbackList] = useState<{ label: string; passed: boolean; note: string }[]>([]);

  // Dilemma & Essay state
  const [selectedEthicalChoice, setSelectedEthicalChoice] = useState<string>('protect_truth');
  const [journalisticEssay, setJournalisticEssay] = useState<string>('');

  // Headline A/B Testing state
  const [chosenHeadlineIdx, setChosenHeadlineIdx] = useState<number>(1);
  const headlines = [
    { title: 'SỐC: PHÁT HIỆN GÂY CHẤN ĐỘNG CỘNG ĐỒNG MẠNG!', virality: 95, integrity: 30, category: 'Giật gân (Clickbait)' },
    { title: taskData.title || 'Phóng Sự Điều Tra Độc Lập & Kiểm Chứng Nguồn Tin', virality: 75, integrity: 95, category: 'Chuẩn Mực Báo Chí' },
    { title: 'Bản Tin Thống Kê Tổng Hợp Số Liệu Ban Đầu', virality: 35, integrity: 98, category: 'Hàn Lâm' }
  ];

  // Skill unlocks
  const hasMic = unlockedSkills.includes('press_badge_mic') || equippedToolId === 'press_badge_mic';
  const hasLens = unlockedSkills.includes('dslr_telephoto_lens') || equippedToolId === 'dslr_telephoto_lens';
  const hasOsint = unlockedSkills.includes('osint_cross_verifier') || equippedToolId === 'osint_cross_verifier';
  const hasSatellite = unlockedSkills.includes('satellite_broadcast_van') || equippedToolId === 'satellite_broadcast_van';

  useEffect(() => {
    if (journalismState) {
      setState(journalismState);
    }
  }, [journalismState]);

  useEffect(() => {
    setFlaggedIds([]);
    setEvalResult(null);
    setRubricFeedbackList([]);
    setJournalisticEssay('');
  }, [currentWeek]);

  const updateAndSaveState = (updater: (prev: JournalismState) => JournalismState) => {
    const newState = updater(state);
    setState(newState);
    if (onUpdateJournalismState) {
      onUpdateJournalismState(newState);
    }
  };

  const toggleFlag = (id: string) => {
    playSound.click(settings.retroSound);
    setFlaggedIds(prev =>
      prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
    );
  };

  const handleUseOsintTool = () => {
    playSound.click(settings.retroSound);
    const errLine = taskData.articleLines.find(l => l.isError);
    if (errLine) {
      if (!flaggedIds.includes(errLine.id)) {
        setFlaggedIds(prev => [...prev, errLine.id]);
      }
      setOsintHint(`🛰️ [OSINT FACT-CHECK ENGINE]: Đã đối chiếu dữ liệu với 3 nguồn độc lập! Phát hiện câu nghi vấn: "${errLine.text.slice(0, 45)}..." vi phạm quy chuẩn sự thật.`);
    } else {
      setOsintHint('🛰️ [OSINT FACT-CHECK ENGINE]: Dữ liệu bài viết hoàn toàn khớp với nguồn tin chính thống.');
    }
  };

  // Comprehensive Evaluation for Fact-checking & Journalistic Essay
  const handleVerifyFactCheck = () => {
    playSound.click(settings.retroSound);
    const feedbackItems: { label: string; passed: boolean; note: string }[] = [];
    let correctCount = 0;
    let falseAlarmCount = 0;
    const totalErrors = taskData.articleLines.filter(l => l.isError).length;

    taskData.articleLines.forEach(line => {
      const isFlagged = flaggedIds.includes(line.id);

      if (line.isError && isFlagged) {
        correctCount++;
      } else if (!line.isError && isFlagged) {
        falseAlarmCount++;
      }
    });

    const isFactCheckPerfect = correctCount === totalErrors && falseAlarmCount === 0;

    feedbackItems.push({
      label: `Phát hiện câu giật gân/ngụy biện (${correctCount}/${totalErrors} Lỗi)`,
      passed: isFactCheckPerfect,
      note: isFactCheckPerfect
        ? 'Phát hiện chính xác 100% các câu sai lệch sự thật mà không bắt nhầm câu đúng.'
        : `Còn thiếu ${totalErrors - correctCount} lỗi hoặc gắn cờ nhầm ${falseAlarmCount} câu đúng.`
    });

    // Semantic Evaluation for Open-Ended Essay
    const essayLower = journalisticEssay.toLowerCase();
    let essayPassed = true;
    let mentorComment = '';

    if (currentWeek === 1) {
      const hasVerification = /nguồn tin|kiểm chứng|xác minh|độc lập|sở y tế|cô thu/.test(essayLower);
      const hasEthics = /sự thật|tin giả|fake news|danh dự|nhân văn|trách nhiệm|quán cơm/.test(essayLower);
      const hasMinLen = journalisticEssay.trim().length >= 35;

      feedbackItems.push({
        label: 'Quy tắc kiểm chứng nguồn tin độc lập',
        passed: hasVerification,
        note: hasVerification ? 'Ý thức rõ quy tắc kiểm chứng 2 nguồn trước khi xuất bản.' : 'Chưa nêu rõ quy trình xác minh nguồn tin.'
      });
      feedbackItems.push({
        label: 'Bảo vệ danh dự người vô tội (Cô Thu quán cơm)',
        passed: hasEthics,
        note: hasEthics ? 'Bảo vệ nạn nhân khỏi bạo lực mạng xã hội.' : 'Chưa liên hệ đến trách nhiệm bảo vệ người vô tội.'
      });
      feedbackItems.push({
        label: 'Độ sâu luận giải báo chí (≥35 ký tự)',
        passed: hasMinLen,
        note: hasMinLen ? 'Bài luận sắc sảo, chặt chẽ.' : 'Bài phân tích đạo đức báo chí quá ngắn.'
      });

      essayPassed = hasVerification && hasEthics && hasMinLen;

      updateAndSaveState(prev => {
        const nextFlags = [...prev.flags];
        let { truthAccuracy, editorialIntegrity, editorTrustThanh, legalRisk } = prev;

        if (selectedEthicalChoice === 'protect_truth') {
          nextFlags.push('w1_truth_upheld_thu');
          truthAccuracy = Math.min(100, truthAccuracy + 15);
          editorialIntegrity = Math.min(100, editorialIntegrity + 10);
          editorTrustThanh = Math.min(100, editorTrustThanh + 10);
          legalRisk = Math.max(5, legalRisk - 10);
        } else {
          nextFlags.push('w1_clickbait_published');
          editorialIntegrity = Math.max(20, editorialIntegrity - 25);
          legalRisk = Math.min(100, legalRisk + 25);
        }

        return { ...prev, truthAccuracy, editorialIntegrity, editorTrustThanh, legalRisk, flags: nextFlags };
      });

      mentorComment = 'Nhà báo Minh Thanh: "Tòa soạn cần những cây bút bản lĩnh như bạn. Sự thật của quán cơm Cô Thu đã được sáng tỏ!"';
    } else if (currentWeek === 5) {
      const hasSponsor = /nhà tài trợ|quảng cáo|việt phát|đặng việt|xung đột lợi ích|độc lập/.test(essayLower);
      const hasIntegrity5 = /sự thật|liêm chính|học sinh|không thỏa hiệp|công lý/.test(essayLower);
      const hasMinLen = journalisticEssay.trim().length >= 35;

      feedbackItems.push({
        label: 'Giải quyết xung đột lợi ích tài trợ (Sponsor Pressure)',
        passed: hasSponsor,
        note: hasSponsor ? 'Không cúi đầu trước hợp đồng quảng cáo 500 triệu.' : 'Chưa làm rõ bài học về xung đột lợi ích.'
      });
      feedbackItems.push({
        label: 'Bảo vệ quyền lợi học sinh trước khóa học lừa đảo',
        passed: hasIntegrity5,
        note: hasIntegrity5 ? 'Giữ vững liêm chính ngòi bút phụng sự bạn đọc.' : 'Chưa nhấn mạnh công lý cho nạn nhân bị lừa.'
      });

      essayPassed = hasSponsor && hasIntegrity5 && hasMinLen;

      updateAndSaveState(prev => {
        const nextFlags = [...prev.flags, 'w5_sponsor_investigation_published'];
        return {
          ...prev,
          editorialIntegrity: Math.min(100, prev.editorialIntegrity + 20),
          editorTrustThanh: Math.min(100, prev.editorTrustThanh + 15),
          sponsorPressure: Math.min(100, prev.sponsorPressure + 20),
          flags: nextFlags
        };
      });

      mentorComment = 'Nhà báo Minh Thanh: "Tôi duyệt bài điều tra lên trang nhất. Danh dự của tờ báo không bao giờ có giá 500 triệu!"';
    } else {
      // General weeks (2, 3, 4, 6, 7, 8)
      const hasEthicsGen = /sự thật|báo chí|nguồn tin|kiểm chứng|khách quan|đạo đức|trách nhiệm/.test(essayLower);
      const hasTradeoffGen = /đánh đổi|bản quyền|ngụy biện|nạn nhân|đính chính|tự do ngôn luận/.test(essayLower);
      const hasMinLen = journalisticEssay.trim().length >= 35;

      feedbackItems.push({
        label: 'Biện giải đạo đức & Tiêu chuẩn xuất bản báo chí',
        passed: hasEthicsGen,
        note: hasEthicsGen ? 'Thể hiện phẩm chất của người làm báo chân chính.' : 'Chưa làm nổi bật chuẩn mực báo chí.'
      });
      feedbackItems.push({
        label: 'Phân tích sự đánh đổi ngòi bút trong kỷ nguyên số',
        passed: hasTradeoffGen,
        note: hasTradeoffGen ? 'Nhận diện rõ ranh giới giữa lượt view và giá trị sự thật.' : 'Chưa phân tích sự đánh đổi truyền thông.'
      });

      essayPassed = hasEthicsGen && hasTradeoffGen && hasMinLen;

      updateAndSaveState(prev => {
        const nextFlags = [...prev.flags, `w${currentWeek}_journalism_passed`];
        return {
          ...prev,
          truthAccuracy: Math.min(100, prev.truthAccuracy + 5),
          editorialIntegrity: Math.min(100, prev.editorialIntegrity + 5),
          flags: nextFlags
        };
      });

      mentorComment = 'Nhà báo Minh Thanh: "Bài viết đạt độ chuẩn xác cao, phản ánh đúng tinh thần tôn trọng sự thật!"';
    }

    const isOverallPassed = isFactCheckPerfect && essayPassed;
    let score = Math.round(((correctCount / totalErrors) * 0.6 + (essayPassed ? 0.4 : 0.15)) * 100);

    if (isOverallPassed && hasOsint) {
      score = Math.min(100, score + 5);
    }

    const result: TaskEvaluationResult = {
      passed: isOverallPassed,
      score,
      feedback: isOverallPassed
        ? `✓ HOÀN THÀNH XUẤT SẮC! ${mentorComment} Điểm liêm chính báo chí: ${score}/100.`
        : `⚠️ CHƯA ĐẠT CHUẨN TÒA SOẠN! ${isFactCheckPerfect ? 'Đã lọc đúng câu lỗi nhưng bài Biện luận đạo đức báo chí chưa đủ sâu sắc.' : 'Chưa bắt đúng các câu giật gân/ngụy biện. Hãy kiểm tra lại bài báo.'}`,
      details: [
        `--- BÁO CÁO THẨM ĐỊNH FACT-CHECKING & ĐẠO ĐỨC BÁO CHÍ ---`,
        ...feedbackItems.map(item => `[${item.passed ? 'PASS' : 'REVISE'}] ${item.label}: ${item.note}`)
      ]
    };

    setRubricFeedbackList(feedbackItems);
    setEvalResult(result);

    if (isOverallPassed) {
      playSound.pass(settings.retroSound);
      confetti({ particleCount: 50, spread: 70 });
    } else {
      playSound.fail(settings.retroSound);
    }

    onEvaluateResult(result);
  };

  const getDilemmaOptions = () => {
    switch (currentWeek) {
      case 1:
        return [
          { id: 'protect_truth', title: 'Hoãn đăng bài, trực tiếp xuống quán cơm Cô Thu và Sở Y tế xác minh', desc: 'Mất độc quyền tin nóng trước đối thủ nhưng bảo vệ danh dự người vô tội và sự thật.' },
          { id: 'publish_clickbait', title: 'Đăng ngay bài giật tít "Nghi vấn quán cơm đầu độc" để lấy triệu view', desc: 'Thu hút lượng truy cập khổng lồ nhưng biến tòa soạn thành kẻ tiếp tay cho tin giả.' }
        ];
      case 5:
        return [
          { id: 'investigate_sponsor', title: 'Kiên quyết xuất bản bài điều tra sai phạm tập đoàn Việt Phát', desc: 'Bảo vệ quyền lợi của hàng ngàn học sinh bị lừa, chấp nhận mất hợp đồng tài trợ 500 triệu.' },
          { id: 'kill_story_for_money', title: 'Nhận hợp đồng tài trợ 500 triệu và hủy bài phóng sự điều tra', desc: 'Bảo đảm nguồn thu cho tòa soạn nhưng đánh mất hoàn toàn đạo đức và liêm chính nhà báo.' }
        ];
      case 6:
        return [
          { id: 'protect_minor_identity', title: 'Làm mờ mặt, đổi tên nhân vật học sinh bị tổn thương', desc: 'Bảo vệ tương lai và tâm lý của các em theo chuẩn mực nhân văn (Do No Harm).' },
          { id: 'sensational_expose', title: 'Quay cận cảnh nước mắt và công khai danh tính để viral', desc: 'Tạo hiệu ứng xúc động mạnh mẽ trên mạng xã hội nhưng đẩy nạn nhân vào vết thương tâm lý dài hạn.' }
        ];
      default:
        return [
          { id: 'rigorous_journalism', title: 'Kiên định với chuẩn mực báo chí điều tra nghiêm cẩn', desc: 'Mọi dòng tin đều có chứng cứ xác thực và dẫn nguồn bản quyền minh bạch.' },
          { id: 'fast_news_chase', title: 'Chạy theo tốc độ và thị hiếu giải trí câu view', desc: 'Ưu tiên số lượng bài và từ khóa nóng để tối ưu hóa thứ hạng tìm kiếm.' }
        ];
    }
  };

  return (
    <div className="bg-[#0c0c0c] border-2 border-[#f59e0b] p-4 space-y-4 font-mono text-[#fbbf24] select-none shadow-2xl">
      {/* Header Bar */}
      <div className="bg-[#1a1205] p-3.5 border border-[#f59e0b]/60 space-y-2 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-black uppercase text-[#f59e0b]">
            <Newspaper className="w-5 h-5 text-[#f59e0b]" />
            <span>BAN BIÊN TẬP & BÀN KIỂM CHỨNG SỰ THẬT FACT-CHECKING TÒA SOẠN</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#000] border border-[#f59e0b] text-[#f59e0b] text-[10px] font-bold uppercase">
              TUẦN {currentWeek}/8: {currentWeek === 5 ? 'ĐỐI ĐẦU NHÀ TÀI TRỢ' : 'PHÓNG SỰ ĐIỀU TRA'}
            </span>
            <span className="px-2 py-0.5 bg-[#000] border border-[#ff00ff] text-[#ff00ff] text-[10px] font-bold uppercase">
              TÒA SOẠN TIẾNG DÂN
            </span>
          </div>
        </div>
        <p className="opacity-90 text-xs text-white/90">
          {taskData.storyContext || 'Rà soát bài viết, nhấp chọn các câu chứa thông tin giật gân, ngụy biện hoặc tin giả chưa kiểm chứng.'}
        </p>
      </div>

      {/* Special Equipped Tools HUD Bar */}
      {(hasMic || hasLens || hasOsint || hasSatellite) && (
        <div className="bg-[#1a1505] border-2 border-[#ffea00] p-3 space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-white uppercase text-[11px]">
              <Sparkles className="w-4 h-4 text-[#ffea00]" />
              <span>DỤNG CỤ TÁC NGHIỆP ĐẶC BIỆT:</span>
              <span className="text-[#f59e0b] bg-black px-2 py-0.2 border border-[#f59e0b]/50">
                {hasOsint ? '🛰️ HỆ THỐNG ĐỐI CHIẾU DỮ LIỆU MỞ OSINT' : hasSatellite ? '📡 XE TRUYỀN HÌNH VỆ TINH TRỰC TIẾP' : '🎙️ THẺ NHÀ BÁO & MICRO ĐIỀU TRA'}
              </span>
            </div>

            <button
              onClick={handleUseOsintTool}
              className="px-3 py-1 bg-[#ffea00] text-black font-black text-[10px] uppercase hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(255,234,0,0.4)]"
            >
              <Search className="w-3.5 h-3.5" />
              <span>GỌI QUÉT OSINT ĐỐI CHIẾU NGUỒN</span>
            </button>
          </div>

          {osintHint && (
            <div className="bg-black p-2 border border-[#ffea00]/60 text-[11px] text-[#ffea00] font-mono animate-fadeIn">
              {osintHint}
            </div>
          )}
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#f59e0b]/40 pb-2">
        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('editor'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'editor'
              ? 'bg-[#f59e0b] text-black border-white shadow-[0_0_10px_rgba(245,158,11,0.6)] font-black'
              : 'bg-[#111] text-[#f59e0b] border-[#f59e0b]/40 hover:border-[#f59e0b]'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>1. BÀN RÀ SOÁT BẢN THẢO BÁO CHÍ</span>
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('dilemma_essay'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'dilemma_essay'
              ? 'bg-[#ffea00] text-black border-white shadow-[0_0_10px_rgba(255,234,0,0.6)] font-black'
              : 'bg-[#111] text-[#ffea00] border-[#ffea00]/40 hover:border-[#ffea00]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>2. ĐẠO ĐỨC NGÒI BÚT & LUẬN GIẢI</span>
          {journalisticEssay.trim().length >= 35 && (
            <span className="bg-black text-[#ffea00] text-[9px] px-1 py-0.2 border border-[#ffea00]">
              ✓ ĐÃ VIẾT
            </span>
          )}
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('sources'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'sources'
              ? 'bg-[#00e5ff] text-black border-white shadow-[0_0_10px_rgba(0,229,255,0.6)] font-black'
              : 'bg-[#111] text-[#00e5ff] border-[#00e5ff]/40 hover:border-[#00e5ff]'
          }`}
        >
          <Globe className="w-3.5 h-3.5" />
          <span>3. ĐỐI CHIẾU NGUỒN TIN (CROSS-VERIFICATION)</span>
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('newsroom'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'newsroom'
              ? 'bg-[#ff00ff] text-black border-white shadow-[0_0_10px_rgba(255,0,255,0.6)] font-black'
              : 'bg-[#111] text-[#ff00ff] border-[#ff00ff]/40 hover:border-[#ff00ff]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>4. PHÒNG HỌP TỔNG BIÊN TẬP</span>
        </button>
      </div>

      {/* TAB 1: FACT-CHECKING ARTICLE EDITOR */}
      {activeTab === 'editor' && (
        <div className="space-y-4">
          <div className="bg-[#080808] border border-[#f59e0b]/60 p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-[#f59e0b]/40 pb-2 text-xs">
              <span className="font-bold text-white uppercase flex items-center gap-2">
                <FileText className="w-4 h-4 text-[#f59e0b]" />
                BẢN THẢO BÀI BÁO CHỜ DUYỆT (BẤM VÀO CÂU NGHI VẤN ĐỂ GẮN CỜ)
              </span>
              <span className="text-white/70">
                Đã gắn cờ: <strong className="text-[#ff0055]">{flaggedIds.length} câu</strong>
              </span>
            </div>

            {/* Article Lines Interactive List */}
            <div className="space-y-2">
              {taskData.articleLines.map((line, idx) => {
                const isFlagged = flaggedIds.includes(line.id);
                return (
                  <div
                    key={line.id}
                    onClick={() => toggleFlag(line.id)}
                    className={`p-3 border-2 cursor-pointer transition-all flex items-start justify-between gap-3 ${
                      isFlagged
                        ? 'bg-[#2a0505] border-[#ff0055] text-white shadow-[0_0_10px_rgba(255,0,85,0.4)]'
                        : 'bg-[#111] border-white/20 text-white/90 hover:border-[#f59e0b]'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span className="text-[11px] font-bold text-white/50 shrink-0 mt-0.5">[{idx + 1}]</span>
                      <p className="text-xs sm:text-sm leading-relaxed">{line.text}</p>
                    </div>

                    <div className="shrink-0">
                      {isFlagged ? (
                        <span className="px-2 py-0.5 bg-[#ff0055] text-white text-[10px] font-black uppercase flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3" /> PHÁT HIỆN LỖI
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 bg-black border border-white/30 text-white/50 text-[10px] uppercase">
                          CHƯA GẮN CỜ
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Headline A/B Testing Box */}
            <div className="mt-4 pt-3 border-t border-[#f59e0b]/30 space-y-2">
              <label className="text-xs font-bold text-white uppercase block">
                CHỌN TIÊU ĐỀ BÀI BÁO (HEADLINE A/B TESTING):
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
                {headlines.map((hl, idx) => (
                  <div
                    key={idx}
                    onClick={() => { playSound.click(settings.retroSound); setChosenHeadlineIdx(idx); }}
                    className={`p-2.5 border cursor-pointer transition-all space-y-1 ${
                      chosenHeadlineIdx === idx
                        ? 'bg-[#1f1505] border-[#ffea00] text-white'
                        : 'bg-black border-white/20 text-white/70 hover:border-white/50'
                    }`}
                  >
                    <div className="text-[10px] text-[#f59e0b] font-bold uppercase">{hl.category}</div>
                    <div className="text-xs font-bold">{hl.title}</div>
                    <div className="text-[10px] text-white/50 flex justify-between pt-1">
                      <span>Viral: {hl.virality}%</span>
                      <span>Uy tín: {hl.integrity}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Verify Action Bar */}
            <div className="pt-3 flex flex-col sm:flex-row items-center justify-between gap-3">
              <span className="text-xs text-white/70">
                💡 Sang Tab 2 để điền bài Luận giải Đạo đức ngòi bút trước khi nộp duyệt xuất bản.
              </span>
              <button
                onClick={handleVerifyFactCheck}
                className="px-5 py-2.5 bg-[#f59e0b] text-black font-black text-xs uppercase border-2 border-white hover:bg-white transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(245,158,11,0.5)]"
              >
                <Check className="w-4 h-4" />
                <span>THẨM ĐỊNH BẢN THẢO & ĐÁNH GIÁ TÒA SOẠN</span>
              </button>
            </div>
          </div>

          {/* Rubric Evaluation Banner */}
          {evalResult && (
            <div
              className={`p-4 border-2 space-y-3 ${
                evalResult.passed
                  ? 'bg-[#081f0c] border-[#00ff41] text-[#00ff41]'
                  : 'bg-[#1f080c] border-[#ff0055] text-[#ff8888]'
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2 font-black uppercase text-sm">
                  {evalResult.passed ? <CheckCircle2 className="w-5 h-5 text-[#00ff41]" /> : <XCircle className="w-5 h-5 text-[#ff0055]" />}
                  <span>{evalResult.passed ? 'BÀI BÁO ĐẠT CHUẨN XUẤT BẢN & LIÊM CHÍNH CAO' : 'BẢN THẢO BỊ TỪ CHỐI DUYỆT'}</span>
                </div>
                <div className="text-lg font-black">{evalResult.score}/100 ĐIỂM</div>
              </div>

              <p className="text-xs text-white leading-relaxed">{evalResult.feedback}</p>

              {rubricFeedbackList.length > 0 && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 border-t border-current/30 text-xs">
                  {rubricFeedbackList.map((item, idx) => (
                    <div key={idx} className="p-2 bg-black/60 border border-current/40 space-y-1">
                      <div className="font-bold flex items-center gap-1.5">
                        {item.passed ? <Check className="w-3.5 h-3.5 text-[#00ff41]" /> : <AlertTriangle className="w-3.5 h-3.5 text-[#ffea00]" />}
                        <span>{item.label}</span>
                      </div>
                      <p className="text-[10px] text-white/80">{item.note}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: ĐẠO ĐỨC NGÒI BÚT & LUẬN GIẢI */}
      {activeTab === 'dilemma_essay' && (
        <div className="space-y-4 bg-[#080808] border border-[#ffea00]/60 p-4">
          <div className="border-b border-[#ffea00]/40 pb-2">
            <h3 className="text-sm font-black text-[#ffea00] uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ffea00]" />
              QUYẾT ĐỊNH ĐẠO ĐỨC BÁO CHÍ & BIỆN LUẬN SỰ THẬT TUẦN {currentWeek}
            </h3>
            <p className="text-xs text-white/80 mt-1">
              Ngòi bút có sức mạnh định hướng công lý xã hội — Nhà báo chân chính luôn đặt sự thật và danh dự con người lên trên lượt click giật gân.
            </p>
          </div>

          {/* Dilemma Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white uppercase block">
              1. LỰA CHỌN PHƯƠNG ÁN XỬ LÝ ĐẠO ĐỨC TÒA SOẠN:
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {getDilemmaOptions().map((opt) => (
                <div
                  key={opt.id}
                  onClick={() => {
                    playSound.click(settings.retroSound);
                    setSelectedEthicalChoice(opt.id);
                  }}
                  className={`p-3 border-2 cursor-pointer transition-all space-y-1.5 ${
                    selectedEthicalChoice === opt.id
                      ? 'bg-[#1a1500] border-[#ffea00] text-white shadow-[0_0_10px_rgba(255,234,0,0.3)]'
                      : 'bg-[#111] border-white/20 text-white/70 hover:border-white/50'
                  }`}
                >
                  <div className="font-bold text-xs text-[#ffea00] flex items-center gap-2">
                    <input
                      type="radio"
                      name="ethical_bao_chi"
                      checked={selectedEthicalChoice === opt.id}
                      onChange={() => setSelectedEthicalChoice(opt.id)}
                      className="accent-[#ffea00]"
                    />
                    <span>{opt.title}</span>
                  </div>
                  <p className="text-[11px] text-white/80 pl-5 leading-relaxed">{opt.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Essay Input */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#00ff41]" />
                2. BÀI BIỆN LUẬN BÁO CHÍ & TRÁCH NHIỆM XÃ HỘI (TỰ LUẬN ĐÁNH GIÁ CHUYÊN SÂU):
              </label>
              <span className={`text-[11px] ${journalisticEssay.trim().length >= 35 ? 'text-[#00ff41]' : 'text-[#ffea00]'}`}>
                {journalisticEssay.trim().length}/35 ký tự tối thiểu
              </span>
            </div>

            <textarea
              value={journalisticEssay}
              onChange={(e) => setJournalisticEssay(e.target.value)}
              placeholder={
                currentWeek === 1
                  ? "Ví dụ: Nhà báo có trách nhiệm xác minh nguồn tin độc lập với cơ quan y tế trước khi đăng bài. Việc giật tít vô căn cứ về quán cơm Cô Thu không chỉ vi phạm đạo đức báo chí mà còn hủy hoại danh dự người vô tộc và lòng tốt của xã hội..."
                  : "Trình bày phân tích về nguồn tin, sự đánh đổi giữa view và sự thật cùng trách nhiệm của ngòi bút..."
              }
              rows={4}
              className="w-full bg-[#050505] border-2 border-[#ffea00]/80 p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ffea00] leading-relaxed selection:bg-[#ffea00] selection:text-black font-mono"
            />
          </div>

          {/* Action */}
          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-white/60">
              💡 Bấm nút "NỘP BÀI BIỆN LUẬN BÁO CHÍ" để Tổng biên tập chấm điểm xuất bản.
            </span>
            <button
              onClick={handleVerifyFactCheck}
              className="px-4 py-2 bg-[#ffea00] text-black font-black text-xs uppercase hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(255,234,0,0.4)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>NỘP BÀI BIỆN LUẬN BÁO CHÍ</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: CROSS-VERIFICATION DASHBOARD */}
      {activeTab === 'sources' && (
        <div className="space-y-3 bg-[#051015] border border-[#00e5ff]/60 p-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-[#00e5ff]/40 pb-2">
            <div className="flex items-center gap-2 text-[#00e5ff] font-bold uppercase">
              <Globe className="w-4 h-4" />
              <span>BẢNG ĐỐI CHIẾU NGUỒN TIN ĐA CHIỀU (CROSS-SOURCE MATRIX)</span>
            </div>
            <span className="px-2 py-0.5 bg-black border border-[#00e5ff] text-[#00e5ff] text-[10px] font-bold">
              VERIFIED CHANNELS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-black p-3 border border-[#00ff41]/40 space-y-1">
              <span className="text-[#00ff41] font-bold text-[11px]">NGUỒN CHÍNH THỐNG: CƠ QUAN CHỨC NĂNG</span>
              <p className="text-white/80 text-[10px] leading-relaxed">
                Văn bản phát ngôn chính thức từ Sở Y tế, Viện Kiểm nghiệm Vệ sinh ATTP. Độ tin cậy: 99%.
              </p>
            </div>

            <div className="bg-black p-3 border border-[#ffea00]/40 space-y-1">
              <span className="text-[#ffea00] font-bold text-[11px]">NGUỒN NHÂN CHỨNG HIỆN TRƯỜNG</span>
              <p className="text-white/80 text-[10px] leading-relaxed">
                Ghi âm phỏng vấn người dân tại quán cơm Cô Thu và khách ăn trưa. Độ tin cậy: 85% (Cần đối chiếu).
              </p>
            </div>

            <div className="bg-black p-3 border border-[#ff0055]/40 space-y-1">
              <span className="text-[#ff0055] font-bold text-[11px]">NGUỒN TIN ĐỒN MẠNG XÃ HỘI</span>
              <p className="text-white/80 text-[10px] leading-relaxed">
                Bài đăng ẩn danh trên nhóm diễn đàn Facebook chưa qua kiểm chứng. Độ tin cậy: 15% (Rủi ro tin giả cao).
              </p>
            </div>
          </div>

          {/* Journalism State Counters */}
          <div className="pt-2 border-t border-[#00e5ff]/30">
            <h4 className="text-[11px] font-bold text-white uppercase mb-2">CHỈ SỐ BÁO CHÍ & TÒA SOẠN (JOURNALISM STATE):</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">TRUTH ACCURACY</span>
                <span className="text-[#00ff41] font-bold">{state.truthAccuracy}%</span>
              </div>
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">EDITORIAL INTEGRITY</span>
                <span className="text-[#ffea00] font-bold">{state.editorialIntegrity}%</span>
              </div>
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">LEGAL RISK</span>
                <span className={state.legalRisk > 40 ? 'text-[#ff0055] font-bold' : 'text-[#00e5ff] font-bold'}>
                  {state.legalRisk}%
                </span>
              </div>
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">EDITOR THANH TRUST</span>
                <span className="text-[#ff00ff] font-bold">{state.editorTrustThanh}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: NEWSROOM CONSULTATION */}
      {activeTab === 'newsroom' && (
        <div className="space-y-3 bg-[#100510] border border-[#ff00ff]/60 p-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-[#ff00ff]/40 pb-2">
            <div className="flex items-center gap-2 text-[#ff00ff] font-bold">
              <Users className="w-4 h-4" />
              <span>PHÒNG HỌP BAN BIÊN TẬP TÒA SOẠN (TUẦN {currentWeek})</span>
            </div>
            <span className="px-2 py-0.5 bg-[#111] border border-[#ff00ff] text-[#ff00ff] text-[10px] uppercase font-bold">
              EDITORIAL BOARD
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-[#111] border border-white/20 space-y-1">
              <div className="flex items-center justify-between text-white/80">
                <span className="font-bold text-[#f59e0b]">Nhà báo Minh Thanh (Tổng biên tập / Mentor)</span>
                <span className="text-[10px] text-white/50">Chủ trì</span>
              </div>
              <p className="text-white/90 text-[11px] leading-relaxed">
                "Một bài báo sai sự thật có thể hủy hoại cả cuộc đời một con người lương thiện. Hãy nhớ: Chúng ta viết vì sự thật và công lý, không phải vì những cú nhấp chuột rẻ tiền."
              </p>
            </div>

            <div className="p-3 bg-[#111] border border-white/20 space-y-1">
              <div className="flex items-center justify-between text-white/80">
                <span className="font-bold text-[#ffea00]">Phóng viên ảnh Hoàng Kim</span>
                <span className="text-[10px] text-white/50">Đồng nghiệp</span>
              </div>
              <p className="text-white/90 text-[11px] leading-relaxed">
                "Công nhận bài viết sau khi rà soát chuẩn xác hơn hẳn. Mình học được nhiều từ sự cẩn trọng của bạn!"
              </p>
            </div>

            <div className="p-3 bg-[#111] border border-white/20 space-y-1">
              <div className="flex items-center justify-between text-white/80">
                <span className="font-bold text-[#00ff41]">Cô Thu (Chủ quán cơm 5.000đ)</span>
                <span className="text-[10px] text-white/50">Người được minh oan</span>
              </div>
              <p className="text-white/90 text-[11px] leading-relaxed">
                "Cảm ơn các nhà báo đã làm sáng tỏ sự thật. Quán cơm lại tiếp tục được mở cửa phục vụ người nghèo và sinh viên khó khăn..."
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
