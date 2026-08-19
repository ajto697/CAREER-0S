import React, { useState, useEffect, useRef } from 'react';
import { TaskEvaluationResult, Settings, ScienceState } from '../../types';
import { playSound } from '../../utils/audio';
import {
  FlaskConical,
  Zap,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Thermometer,
  TestTube,
  Sparkles,
  Eye,
  BookOpen,
  Layers,
  Sliders,
  ShieldCheck,
  Send,
  MessageSquare,
  Users,
  AlertTriangle,
  Check,
  Activity,
  Award
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface LabParam {
  name: string;
  min: number;
  max: number;
  step: number;
  optimal: number;
}

interface Props {
  taskData: {
    title?: string;
    storyContext?: string;
    targetMinYield?: number;
    targetMaxYield?: number;
    paramA: LabParam;
    paramB: LabParam;
  };
  settings: Settings;
  onEvaluateResult: (res: TaskEvaluationResult) => void;
  currentWeek?: number;
  scienceState?: ScienceState;
  onUpdateScienceState?: (newState: ScienceState) => void;
  equippedToolId?: string;
  unlockedSkills?: string[];
}

const DEFAULT_STATE: ScienceState = {
  dataIntegrity: 90,
  labSafety: 90,
  yieldEfficiency: 85,
  grantFunding: 75,
  peerReviewTrust: 80,
  samplePreservation: 85,
  mentorTrustGiaoSuTrinh: 75,
  flags: []
};

export const LabExperimentTool: React.FC<Props> = ({
  taskData,
  settings,
  onEvaluateResult,
  currentWeek = 1,
  scienceState,
  onUpdateScienceState,
  equippedToolId,
  unlockedSkills = []
}) => {
  const [state, setState] = useState<ScienceState>(scienceState || DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<'reactor' | 'method_essay' | 'spectro' | 'lab_council'>('reactor');
  const [valA, setValA] = useState<number>(taskData.paramA.optimal || taskData.paramA.min);
  const [valB, setValB] = useState<number>(taskData.paramB.optimal || taskData.paramB.min);
  const [catalyst, setCatalyst] = useState<'enzyme' | 'platinum' | 'buffer'>('enzyme');
  const [safetyChecked, setSafetyChecked] = useState<{ ppe: boolean; fumeHood: boolean }>({ ppe: true, fumeHood: true });
  const [evalResult, setEvalResult] = useState<TaskEvaluationResult | null>(null);
  const [rubricFeedbackList, setRubricFeedbackList] = useState<{ label: string; passed: boolean; note: string }[]>([]);

  // Dilemma and Essay state
  const [selectedEthicalChoice, setSelectedEthicalChoice] = useState<string>('reproducible_science');
  const [methodologyEssay, setMethodologyEssay] = useState<string>('');

  // Special Skills
  const hasPipette = unlockedSkills.includes('micro_pipette_precision') || equippedToolId === 'micro_pipette_precision';
  const hasPPE = unlockedSkills.includes('safety_ppe_suit') || equippedToolId === 'safety_ppe_suit';
  const hasFTIR = unlockedSkills.includes('ftir_spectrometer') || equippedToolId === 'ftir_spectrometer';
  const hasBioreactor = unlockedSkills.includes('ai_bioreactor_nanolab') || equippedToolId === 'ai_bioreactor_nanolab';
  const [activeSkillHint, setActiveSkillHint] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (scienceState) {
      setState(scienceState);
    }
  }, [scienceState]);

  useEffect(() => {
    setValA(taskData.paramA.optimal || taskData.paramA.min);
    setValB(taskData.paramB.optimal || taskData.paramB.min);
    setEvalResult(null);
    setRubricFeedbackList([]);
    setMethodologyEssay('');
  }, [currentWeek]);

  const updateAndSaveState = (updater: (prev: ScienceState) => ScienceState) => {
    const newState = updater(state);
    setState(newState);
    if (onUpdateScienceState) {
      onUpdateScienceState(newState);
    }
  };

  // Calculate yield based on proximity to optimal values
  const diffA = Math.abs(valA - taskData.paramA.optimal) / Math.max(1, (taskData.paramA.max - taskData.paramA.min));
  const diffB = Math.abs(valB - taskData.paramB.optimal) / Math.max(1, (taskData.paramB.max - taskData.paramB.min));
  const calculatedYield = Math.max(0, Math.min(100, Math.round((1 - (diffA * 0.5 + diffB * 0.5)) * 100)));

  // Canvas visualizer for reaction flask
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let frame = 0;

    const renderLabFlask = () => {
      frame++;
      const w = canvas.width;
      const h = canvas.height;

      ctx.clearRect(0, 0, w, h);
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      // Liquid Fill
      const liquidLevel = h * 0.65;
      const proximity = calculatedYield / 100;

      // Color from blue to glowing green
      const r = Math.round(30 + (1 - proximity) * 180);
      const g = Math.round(150 + proximity * 105);
      const b = Math.round(255 * (1 - proximity));

      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, 0.75)`;
      ctx.beginPath();
      ctx.moveTo(w * 0.25, h - 25);
      ctx.lineTo(w * 0.75, h - 25);
      ctx.lineTo(w * 0.6, liquidLevel);
      ctx.lineTo(w * 0.4, liquidLevel);
      ctx.closePath();
      ctx.fill();

      // Bubbles animation
      ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
      for (let i = 0; i < 6; i++) {
        const bx = w * 0.4 + Math.sin(frame * 0.05 + i * 2) * (w * 0.15);
        const by = h - 30 - ((frame * 2 + i * 25) % (h - liquidLevel - 30));
        ctx.beginPath();
        ctx.arc(bx, by, 3 + (i % 3), 0, Math.PI * 2);
        ctx.fill();
      }

      // Flask outline
      ctx.strokeStyle = '#00ff41';
      ctx.lineWidth = 2.5;
      ctx.beginPath();
      ctx.moveTo(w * 0.45, 20);
      ctx.lineTo(w * 0.45, 60);
      ctx.lineTo(w * 0.2, h - 20);
      ctx.lineTo(w * 0.8, h - 20);
      ctx.lineTo(w * 0.55, 60);
      ctx.lineTo(w * 0.55, 20);
      ctx.closePath();
      ctx.stroke();

      animId = requestAnimationFrame(renderLabFlask);
    };

    renderLabFlask();
    return () => cancelAnimationFrame(animId);
  }, [calculatedYield]);

  const handleUseSkill = () => {
    playSound.click(settings.retroSound);
    confetti({ particleCount: 30, spread: 50 });

    if (hasBioreactor) {
      setActiveSkillHint(`🧫 [AI BIOREACTOR]: Tự động căn chỉnh phản ứng ở hiệu suất cực đại! Thông số khuyến nghị: ${taskData.paramA.name} = ${taskData.paramA.optimal}, ${taskData.paramB.name} = ${taskData.paramB.optimal}.`);
    } else if (hasFTIR) {
      setActiveSkillHint(`🔬 [FTIR SPECTROMETER]: Quang phổ hồng ngoại phát hiện liên kết đôi C=O đặc trưng của hoạt chất có độ tinh khiết 99.2%.`);
    } else if (hasPPE) {
      setActiveSkillHint(`🥽 [SAFETY PPE SUIT]: Đạt chuẩn phòng dịch cấp độ 3 (BSL-3). Khử khuẩn áp suất âm an toàn 100%.`);
    }
  };

  // Comprehensive Evaluation
  const handleEvaluateReaction = () => {
    playSound.click(settings.retroSound);
    const feedbackItems: { label: string; passed: boolean; note: string }[] = [];

    // 1. Yield check
    const minYield = taskData.targetMinYield || 90;
    const isYieldPassed = calculatedYield >= minYield;

    feedbackItems.push({
      label: `Hiệu suất phản ứng tổng hợp (${calculatedYield}% / Chuẩn ≥${minYield}%)`,
      passed: isYieldPassed,
      note: isYieldPassed
        ? `Đạt hiệu suất chiết xuất tối ưu (${calculatedYield}%), bảo toàn hoạt tính sinh học.`
        : `Hiệu suất mới đạt ${calculatedYield}%, chưa chạm ngưỡng quy chuẩn ${minYield}%.`
    });

    // 2. Biosafety checks
    const isSafetyPassed = safetyChecked.ppe && safetyChecked.fumeHood;
    feedbackItems.push({
      label: 'Quy chuẩn An toàn phòng Lab & Tủ hút khí độc',
      passed: isSafetyPassed,
      note: isSafetyPassed ? 'Tuân thủ nghiêm ngặt bảo hộ PPE và bật tủ hút khí độc.' : 'Vi phạm an toàn sinh học.'
    });

    // 3. Open-ended Methodology & Ethics Essay Evaluation
    const essayLower = methodologyEssay.toLowerCase();
    let essayPassed = true;
    let mentorNote = '';

    if (currentWeek === 1) {
      const hasVariables = /biến số|nhiệt độ|ph|tinh chiết|hoạt tính|hiệu suất|quỳnh anh/.test(essayLower);
      const hasMethodology = /khoa học|phương pháp|lặp lại|chuẩn hóa|kiểm soát|thực nghiệm/.test(essayLower);
      const hasMinLen = methodologyEssay.trim().length >= 35;

      feedbackItems.push({
        label: 'Kiểm soát biến số thực nghiệm & Bảo toàn hoạt tính',
        passed: hasVariables,
        note: hasVariables ? 'Hiểu rõ nguy cơ biến tính nhiệt khi gia nhiệt quá mức.' : 'Chưa phân tích cơ chế kiểm soát biến số.'
      });
      feedbackItems.push({
        label: 'Phương pháp luận khoa học & Tính lặp lại (Reproducibility)',
        passed: hasMethodology,
        note: hasMethodology ? 'Nêu cao giá trị của tính lặp lại trong nghiên cứu.' : 'Chưa thể hiện được phương pháp luận khoa học.'
      });
      feedbackItems.push({
        label: 'Độ sâu luận giải khoa học (≥35 ký tự)',
        passed: hasMinLen,
        note: hasMinLen ? 'Lập luận phương pháp xuất sắc, chặt chẽ.' : 'Bài luận phương pháp quá ngắn.'
      });

      essayPassed = hasVariables && hasMethodology && hasMinLen;

      updateAndSaveState(prev => {
        const nextFlags = [...prev.flags];
        let { peerReviewTrust, dataIntegrity, mentorTrustGiaoSuTrinh, grantFunding } = prev;

        if (selectedEthicalChoice === 'reproducible_science') {
          nextFlags.push('w1_science_integrity_upheld');
          peerReviewTrust = Math.min(100, peerReviewTrust + 10);
          dataIntegrity = Math.min(100, dataIntegrity + 10);
          mentorTrustGiaoSuTrinh = Math.min(100, mentorTrustGiaoSuTrinh + 10);
        } else {
          nextFlags.push('w1_rushed_yield');
          dataIntegrity = Math.max(30, dataIntegrity - 20);
          peerReviewTrust = Math.max(30, peerReviewTrust - 15);
        }

        return { ...prev, peerReviewTrust, dataIntegrity, mentorTrustGiaoSuTrinh, grantFunding, flags: nextFlags };
      });

      mentorNote = 'GS.TS. Đặng Quang Trình: "Rất tốt! Khoa học chân chính không có đường tắt. Số liệu thực nghiệm của em rất đáng tin cậy!"';
    } else if (currentWeek === 5) {
      const hasDataIntegrity = /liêm chính|trung thực|không làm giả|số liệu|p-hacking|mù đôi|giả dược/.test(essayLower);
      const hasInvestor = /quỹ đầu tư|vincent|áp lực|an toàn|sức khỏe|thương mại/.test(essayLower);
      const hasMinLen = methodologyEssay.trim().length >= 35;

      feedbackItems.push({
        label: 'Bảo vệ liêm chính dữ liệu trước áp lực Quỹ đầu tư',
        passed: hasDataIntegrity,
        note: hasDataIntegrity ? 'Kiên quyết từ chối xào nấu số liệu lâm sàng mù đôi.' : 'Chưa nêu bật được bài học liêm chính dữ liệu.'
      });
      feedbackItems.push({
        label: 'Đặt an toàn người bệnh lên trên lợi nhuận thương mại',
        passed: hasInvestor,
        note: hasInvestor ? 'Ý thức rõ rủi ro thuốc chưa kiểm chứng ra thị trường.' : 'Chưa phân tích được xung đột lợi ích đầu tư.'
      });

      essayPassed = hasDataIntegrity && hasInvestor && hasMinLen;

      updateAndSaveState(prev => {
        const nextFlags = [...prev.flags, 'w5_double_blind_upheld'];
        return {
          ...prev,
          dataIntegrity: Math.min(100, prev.dataIntegrity + 20),
          mentorTrustGiaoSuTrinh: Math.min(100, prev.mentorTrustGiaoSuTrinh + 15),
          peerReviewTrust: Math.min(100, prev.peerReviewTrust + 15),
          flags: nextFlags
        };
      });

      mentorNote = 'GS.TS. Đặng Quang Trình: "Tôi tự hào về em. Một nhà khoa học không bán rẻ lương tâm trước đồng tiền!"';
    } else {
      // General weeks (2, 3, 4, 6, 7, 8)
      const hasSci = /khoa học|thực nghiệm|phản ứng|dữ liệu|an toàn|phương pháp|kết quả/.test(essayLower);
      const hasEthics = /đánh đổi|đạo đức|môi trường|động vật|liêm chính|trách nhiệm/.test(essayLower);
      const hasMinLen = methodologyEssay.trim().length >= 35;

      feedbackItems.push({
        label: 'Phương pháp thực nghiệm & Kiểm soát môi trường',
        passed: hasSci,
        note: hasSci ? 'Quy trình thực nghiệm chuẩn hóa, kiểm soát tốt sai số.' : 'Chưa làm rõ quy trình thực nghiệm.'
      });
      feedbackItems.push({
        label: 'Trách nhiệm đạo đức nghiên cứu & Môi trường',
        passed: hasEthics,
        note: hasEthics ? 'Có trách nhiệm với môi trường và cộng đồng.' : 'Chưa phân tích trách nhiệm đạo đức nghiên cứu.'
      });

      essayPassed = hasSci && hasEthics && hasMinLen;

      updateAndSaveState(prev => {
        const nextFlags = [...prev.flags, `w${currentWeek}_science_passed`];
        return {
          ...prev,
          peerReviewTrust: Math.min(100, prev.peerReviewTrust + 5),
          labSafety: Math.min(100, prev.labSafety + 5),
          yieldEfficiency: Math.min(100, calculatedYield),
          flags: nextFlags
        };
      });

      mentorNote = 'GS.TS. Đặng Quang Trình: "Quy trình thực nghiệm chuẩn xác, phân tích phương pháp sâu sắc!"';
    }

    const isOverallPassed = isYieldPassed && isSafetyPassed && essayPassed;
    let score = Math.round(((calculatedYield / 100) * 0.5 + (isSafetyPassed ? 0.2 : 0) + (essayPassed ? 0.3 : 0.1)) * 100);

    if (isOverallPassed && hasBioreactor) {
      score = Math.min(100, score + 5);
    }

    const result: TaskEvaluationResult = {
      passed: isOverallPassed,
      score,
      feedback: isOverallPassed
        ? `✓ XUẤT SẮC! ${mentorNote} Điểm thực nghiệm & phương pháp luận: ${score}/100.`
        : `⚠️ CHƯA ĐẠT! ${isYieldPassed ? 'Hiệu suất đã tốt nhưng bài Luận giải phương pháp khoa học chưa đạt yêu cầu.' : 'Hiệu suất phản ứng chưa đạt ngưỡng tối ưu hoặc chưa bật bảo hộ phòng lab.'}`,
      details: [
        `--- BÁO CÁO NGHIỆM THU ĐỀ TÀI & PHƯƠNG PHÁP LUẬN KHOA HỌC ---`,
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
          { id: 'reproducible_science', title: 'Tuân thủ nhiệt độ chuẩn 60°C, bảo toàn hoạt tính sinh học', desc: 'Chấp nhận tốn thêm thời gian thực nghiệm nhưng đảm bảo sản phẩm đạt chất lượng dược lý cao nhất.' },
          { id: 'rush_yield', title: 'Gia nhiệt cấp tốc lên 95°C để nộp báo cáo sớm lấy thành tích', desc: 'Sản lượng ra nhanh nhưng làm biến tính 20% cấu trúc phân tử quý giá của dược liệu.' }
        ];
      case 5:
        return [
          { id: 'strict_double_blind', title: 'Tiến hành thử nghiệm mù đôi có đối chứng giả dược nghiêm ngặt', desc: 'Bảo vệ sự an toàn cho người dùng, từ chối tài trợ vội vã từ quỹ đầu tư mạo hiểm Vincent Đỗ.' },
          { id: 'falsify_data_for_grant', title: 'Xào nấu số liệu sơ bộ và bỏ qua đối chứng để nhận 500 triệu', desc: 'Có kinh phí lớn cho viện nhưng đánh mất danh dự nhà khoa học và đẩy người bệnh vào nguy hiểm.' }
        ];
      case 6:
        return [
          { id: 'apply_3r_principle', title: 'Áp dụng nguyên tắc 3R và mô hình mô tế bào 3D (Organoid)', desc: 'Giảm thiểu đau đớn cho động vật thí nghiệm theo chuẩn mực đạo đức sinh học quốc tế.' },
          { id: 'mass_animal_testing', title: 'Tăng gấp đôi số lượng chuột thí nghiệm để lấy kết quả nhanh', desc: 'Tiết kiệm chi phí trang bị mô hình 3D nhưng vi phạm nguyên tắc phúc lợi động vật.' }
        ];
      default:
        return [
          { id: 'academic_rigour', title: 'Giữ vững liêm chính học thuật và tính minh bạch dữ liệu', desc: 'Mọi con số và biểu đồ đều được lưu trữ nguyên bản và công khai trong sổ nhật ký lab.' },
          { id: 'cherry_pick_results', title: 'Cắt gọt chọn lọc các số liệu đẹp để đường cong p-value hoàn hảo', desc: 'Dễ dàng đăng bài báo nhưng làm sai lệch tri thức khoa học nhân loại.' }
        ];
    }
  };

  return (
    <div className="bg-[#0c0c0c] border-2 border-[#10b981] p-4 space-y-4 font-mono text-[#6ee7b7] select-none shadow-2xl">
      {/* Header Bar */}
      <div className="bg-[#062419] p-3.5 border border-[#10b981]/60 space-y-2 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-black uppercase text-[#10b981]">
            <FlaskConical className="w-5 h-5 text-[#10b981]" />
            <span>PHÒNG THÍ NGHIỆM SINH DƯỢC & TỔNG HỢP HOẠT CHẤT CHUẨN ISO/IEC</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#000] border border-[#10b981] text-[#10b981] text-[10px] font-bold uppercase">
              TUẦN {currentWeek}/8: {currentWeek === 5 ? 'LIÊM CHÍNH DỮ LIỆU' : 'TỔNG HỢP HOẠT CHẤT'}
            </span>
            <span className="px-2 py-0.5 bg-[#000] border border-[#00e5ff] text-[#00e5ff] text-[10px] font-bold uppercase">
              VIỆN SINH DƯỢC
            </span>
          </div>
        </div>
        <p className="opacity-90 text-xs text-white/90">
          {taskData.storyContext || 'Điều chỉnh các biến số thực nghiệm để đạt hiệu suất tối ưu và biện giải phương pháp luận khoa học.'}
        </p>
      </div>

      {/* Special Equipped Tools HUD Bar */}
      {(hasPipette || hasPPE || hasFTIR || hasBioreactor) && (
        <div className="bg-[#05281e] border-2 border-[#ffea00] p-3 space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-white uppercase text-[11px]">
              <Sparkles className="w-4 h-4 text-[#ffea00]" />
              <span>THIẾT BỊ PHÒNG LAB ĐẶC BIỆT:</span>
              <span className="text-[#10b981] bg-black px-2 py-0.2 border border-[#10b981]/50">
                {hasBioreactor ? '🧫 AI BIOREACTOR NANO LAB' : hasFTIR ? '🔬 MÁY QUANG PHỔ HỒNG NGOẠI FTIR' : '🥽 ĐỒNG PHỤC BẢO HỘ AN TOÀN BSL-3'}
              </span>
            </div>

            <button
              onClick={handleUseSkill}
              className="px-3 py-1 bg-[#ffea00] text-black font-black text-[10px] uppercase hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(255,234,0,0.4)]"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>KÍCH HOẠT PHÂN TÍCH QUANG PHỔ NANO</span>
            </button>
          </div>

          {activeSkillHint && (
            <div className="bg-black p-2 border border-[#ffea00]/60 text-[11px] text-[#ffea00] font-mono animate-fadeIn">
              {activeSkillHint}
            </div>
          )}
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#10b981]/40 pb-2">
        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('reactor'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'reactor'
              ? 'bg-[#10b981] text-black border-white shadow-[0_0_10px_rgba(16,185,129,0.6)] font-black'
              : 'bg-[#111] text-[#10b981] border-[#10b981]/40 hover:border-[#10b981]'
          }`}
        >
          <Sliders className="w-3.5 h-3.5" />
          <span>1. BUỒNG PHẢN ỨNG & BIẾN SỐ ({calculatedYield}%)</span>
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('method_essay'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'method_essay'
              ? 'bg-[#ffea00] text-black border-white shadow-[0_0_10px_rgba(255,234,0,0.6)] font-black'
              : 'bg-[#111] text-[#ffea00] border-[#ffea00]/40 hover:border-[#ffea00]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>2. LIÊM CHÍNH HỌC THUẬT & PHƯƠNG PHÁP</span>
          {methodologyEssay.trim().length >= 35 && (
            <span className="bg-black text-[#ffea00] text-[9px] px-1 py-0.2 border border-[#ffea00]">
              ✓ ĐÃ VIẾT
            </span>
          )}
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('spectro'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'spectro'
              ? 'bg-[#00e5ff] text-black border-white shadow-[0_0_10px_rgba(0,229,255,0.6)] font-black'
              : 'bg-[#111] text-[#00e5ff] border-[#00e5ff]/40 hover:border-[#00e5ff]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>3. ĐỒ THỊ QUANG PHỔ & KHÁNG SINH ĐỒ</span>
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('lab_council'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'lab_council'
              ? 'bg-[#ff00ff] text-black border-white shadow-[0_0_10px_rgba(255,0,255,0.6)] font-black'
              : 'bg-[#111] text-[#ff00ff] border-[#ff00ff]/40 hover:border-[#ff00ff]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>4. HỘI ĐỒNG KHOA HỌC VIỆN</span>
        </button>
      </div>

      {/* TAB 1: REACTOR & VARIABLE CONTROLS */}
      {activeTab === 'reactor' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Interactive Controls */}
            <div className="lg:col-span-7 space-y-4 bg-[#080808] border border-[#10b981]/60 p-4">
              <div className="flex items-center justify-between border-b border-[#10b981]/40 pb-2 text-xs">
                <span className="font-bold text-white uppercase flex items-center gap-2">
                  <Sliders className="w-4 h-4 text-[#10b981]" />
                  BẢNG ĐIỀU KHIỂN BIẾN SỐ THỰC NGHIỆM
                </span>
                <span className="text-white/70">Mục tiêu: <strong className="text-[#00ff41]">≥{taskData.targetMinYield || 90}%</strong></span>
              </div>

              {/* Slider Param A */}
              <div className="space-y-1.5 bg-[#111] p-3 border border-white/20">
                <div className="flex justify-between text-xs text-white">
                  <span>{taskData.paramA.name}:</span>
                  <strong className="text-[#00ff41]">{valA}</strong>
                </div>
                <input
                  type="range"
                  min={taskData.paramA.min}
                  max={taskData.paramA.max}
                  step={taskData.paramA.step}
                  value={valA}
                  onChange={(e) => {
                    setValA(parseFloat(e.target.value));
                    playSound.click(settings.retroSound);
                  }}
                  className="w-full accent-[#00ff41] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>Min: {taskData.paramA.min}</span>
                  <span>Max: {taskData.paramA.max}</span>
                </div>
              </div>

              {/* Slider Param B */}
              <div className="space-y-1.5 bg-[#111] p-3 border border-white/20">
                <div className="flex justify-between text-xs text-white">
                  <span>{taskData.paramB.name}:</span>
                  <strong className="text-[#00e5ff]">{valB}</strong>
                </div>
                <input
                  type="range"
                  min={taskData.paramB.min}
                  max={taskData.paramB.max}
                  step={taskData.paramB.step}
                  value={valB}
                  onChange={(e) => {
                    setValB(parseFloat(e.target.value));
                    playSound.click(settings.retroSound);
                  }}
                  className="w-full accent-[#00e5ff] cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-white/50">
                  <span>Min: {taskData.paramB.min}</span>
                  <span>Max: {taskData.paramB.max}</span>
                </div>
              </div>

              {/* Safety Checklist */}
              <div className="bg-[#111] p-3 border border-white/20 space-y-2">
                <span className="text-xs font-bold text-white uppercase block">
                  AN TOÀN SINH HỌC & TỦ HÚT:
                </span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={safetyChecked.ppe}
                      onChange={(e) => setSafetyChecked(prev => ({ ...prev, ppe: e.target.checked }))}
                      className="accent-[#00ff41]"
                    />
                    <span className="text-white/90">Trang bị bảo hộ PPE BSL-3</span>
                  </label>
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={safetyChecked.fumeHood}
                      onChange={(e) => setSafetyChecked(prev => ({ ...prev, fumeHood: e.target.checked }))}
                      className="accent-[#00ff41]"
                    />
                    <span className="text-white/90">Bật tủ hút áp suất âm</span>
                  </label>
                </div>
              </div>
            </div>

            {/* Right: Real-time Flask Reaction Visualizer */}
            <div className="lg:col-span-5 space-y-3 bg-[#080808] border border-[#10b981]/60 p-4 flex flex-col justify-between">
              <div className="flex items-center justify-between border-b border-[#10b981]/40 pb-2 text-xs">
                <span className="font-bold text-white uppercase flex items-center gap-2">
                  <TestTube className="w-4 h-4 text-[#10b981]" />
                  BÌNH PHẢN ỨNG THỰC NGHIỆM
                </span>
                <span className={`font-black text-sm ${calculatedYield >= 90 ? 'text-[#00ff41]' : 'text-[#ffea00]'}`}>
                  HIỆU SUẤT: {calculatedYield}%
                </span>
              </div>

              <div className="border border-[#10b981]/40 bg-black overflow-hidden relative flex items-center justify-center p-2">
                <canvas ref={canvasRef} width={260} height={200} className="block" />
              </div>

              {/* Action Button */}
              <button
                onClick={handleEvaluateReaction}
                className="w-full py-3 bg-[#10b981] text-black font-black text-xs uppercase border-2 border-white hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(16,185,129,0.5)]"
              >
                <FlaskConical className="w-4 h-4" />
                <span>NGHIỆM THU THỰC NGHIỆM & ĐÁNH GIÁ ĐỀ TÀI</span>
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
                  <span>{evalResult.passed ? 'KẾT QUẢ THÍ NGHIỆM & PHƯƠNG PHÁP ĐẠT CHUẨN XUẤT SẮC' : 'CẦN HIỆU CHỈNH LẠI THÔNG SỐ & BÀI LUẬN'}</span>
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

      {/* TAB 2: LIÊM CHÍNH HỌC THUẬT & PHƯƠNG PHÁP */}
      {activeTab === 'method_essay' && (
        <div className="space-y-4 bg-[#080808] border border-[#ffea00]/60 p-4">
          <div className="border-b border-[#ffea00]/40 pb-2">
            <h3 className="text-sm font-black text-[#ffea00] uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ffea00]" />
              QUYẾT ĐỊNH ĐẠO ĐỨC KHOA HỌC & PHƯƠNG PHÁP LUẬN TUẦN {currentWeek}
            </h3>
            <p className="text-xs text-white/80 mt-1">
              Khoa học phụng sự chân lý và nhân loại — Nhà khoa học chân chính tuyệt đối không đánh đổi tính toàn vẹn dữ liệu lấy thành tích hay đồng tiền.
            </p>
          </div>

          {/* Dilemma Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white uppercase block">
              1. LỰA CHỌN PHƯƠNG ÁN XỬ LÝ LIÊM CHÍNH KHOA HỌC:
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
                      name="ethical_khoa_hoc"
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
                2. BIỆN LUẬN PHƯƠNG PHÁP LUẬN & LIÊM CHÍNH DỮ LIỆU (TỰ LUẬN ĐÁNH GIÁ CHUYÊN SÂU):
              </label>
              <span className={`text-[11px] ${methodologyEssay.trim().length >= 35 ? 'text-[#00ff41]' : 'text-[#ffea00]'}`}>
                {methodologyEssay.trim().length}/35 ký tự tối thiểu
              </span>
            </div>

            <textarea
              value={methodologyEssay}
              onChange={(e) => setMethodologyEssay(e.target.value)}
              placeholder={
                currentWeek === 1
                  ? "Ví dụ: Việc duy trì nhiệt độ 60°C là điều kiện cốt lõi để bảo toàn hoạt tính sinh học của Curcumin, tránh nguy cơ biến tính phân tử. Nghiên cứu sinh Quỳnh Anh chịu áp lực tiến độ nhưng nhà khoa học không thể đánh đổi chất lượng lấy tốc độ. Phương pháp chuẩn hóa phải đảm bảo tính lặp lại..."
                  : "Trình bày phân tích phương pháp kiểm soát biến số, bảo vệ liêm chính dữ liệu và đạo đức nghiên cứu..."
              }
              rows={4}
              className="w-full bg-[#050505] border-2 border-[#ffea00]/80 p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ffea00] leading-relaxed selection:bg-[#ffea00] selection:text-black font-mono"
            />
          </div>

          {/* Action */}
          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-white/60">
              💡 Hãy hoàn thành bài luận phương pháp trước khi nghiệm thu đề tài.
            </span>
            <button
              onClick={handleEvaluateReaction}
              className="px-4 py-2 bg-[#ffea00] text-black font-black text-xs uppercase hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(255,234,0,0.4)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>NỘP BÀI BIỆN LUẬN KHOA HỌC</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: SPECTROPHOTOMETER & LAB METRICS */}
      {activeTab === 'spectro' && (
        <div className="space-y-3 bg-[#051510] border border-[#00e5ff]/60 p-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-[#00e5ff]/40 pb-2">
            <div className="flex items-center gap-2 text-[#00e5ff] font-bold uppercase">
              <Activity className="w-4 h-4" />
              <span>PHÂN TÍCH QUANG PHỔ HẤP THỤ UV-VIS & ĐƯỜNG KÍNH VÔ KHUẨN</span>
            </div>
            <span className="px-2 py-0.5 bg-black border border-[#00e5ff] text-[#00e5ff] text-[10px] font-bold">
              SPECTRO METRICS
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="bg-black p-3 border border-[#00ff41]/40 space-y-1">
              <span className="text-[#00ff41] font-bold text-[11px]">BƯỚC SÓNG HẤP THỤ CỰC ĐẠI (λmax)</span>
              <p className="text-white/80 text-[10px] leading-relaxed">
                Đỉnh phổ 425 nm đặc trưng cho hoạt chất Curcuminoid nguyên chất. Độ tinh khiết: 98.6%.
              </p>
            </div>

            <div className="bg-black p-3 border border-[#ffea00]/40 space-y-1">
              <span className="text-[#ffea00] font-bold text-[11px]">HỆ SỐ TƯƠNG QUAN TUYẾN TÍNH (R²)</span>
              <p className="text-white/80 text-[10px] leading-relaxed">
                R² = 0.9985 — Đường chuẩn thực nghiệm có độ tin cậy thống kê cao (p-value &lt; 0.001).
              </p>
            </div>

            <div className="bg-black p-3 border border-[#00e5ff]/40 space-y-1">
              <span className="text-[#00e5ff] font-bold text-[11px]">ĐƯỜNG KÍNH VÒNG VÔ KHUẨN (MRSA)</span>
              <p className="text-white/80 text-[10px] leading-relaxed">
                Đạt 22.4 mm trên chủng vi khuẩn kháng thuốc. Hoạt lực kháng sinh tự nhiên xuất sắc.
              </p>
            </div>
          </div>

          {/* Science State Counters */}
          <div className="pt-2 border-t border-[#00e5ff]/30">
            <h4 className="text-[11px] font-bold text-white uppercase mb-2">CHỈ SỐ PHÒNG THÍ NGHIỆM & KHOA HỌC (SCIENCE STATE):</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">PEER REVIEW TRUST</span>
                <span className="text-[#00ff41] font-bold">{state.peerReviewTrust}%</span>
              </div>
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">DATA INTEGRITY</span>
                <span className="text-[#ffea00] font-bold">{state.dataIntegrity}%</span>
              </div>
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">LAB SAFETY (BSL-3)</span>
                <span className="text-[#00e5ff] font-bold">{state.labSafety}%</span>
              </div>
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">MENTOR TRÌNH TRUST</span>
                <span className="text-[#ff00ff] font-bold">{state.mentorTrustGiaoSuTrinh}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: LAB SCIENTIFIC COUNCIL */}
      {activeTab === 'lab_council' && (
        <div className="space-y-3 bg-[#051515] border border-[#ff00ff]/60 p-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-[#ff00ff]/40 pb-2">
            <div className="flex items-center gap-2 text-[#ff00ff] font-bold">
              <Users className="w-4 h-4" />
              <span>HỘI ĐỒNG KHOA HỌC VIỆN NGHIÊN CỨU (TUẦN {currentWeek})</span>
            </div>
            <span className="px-2 py-0.5 bg-[#111] border border-[#ff00ff] text-[#ff00ff] text-[10px] uppercase font-bold">
              SCIENTIFIC COUNCIL
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-[#111] border border-white/20 space-y-1">
              <div className="flex items-center justify-between text-white/80">
                <span className="font-bold text-[#10b981]">GS.TS. Trần Khang (Viện trưởng / Mentor)</span>
                <span className="text-[10px] text-white/50">Chủ tịch hội đồng</span>
              </div>
              <p className="text-white/90 text-[11px] leading-relaxed">
                "Thực nghiệm này chứng minh phương pháp chiết xuất thảo dược của chúng ta hoàn toàn khả thi và có tính lặp lại cao. Hãy luôn giữ vững sự trung thực khoa học!"
              </p>
            </div>

            <div className="p-3 bg-[#111] border border-white/20 space-y-1">
              <div className="flex items-center justify-between text-white/80">
                <span className="font-bold text-[#ffea00]">NCS. Quỳnh Anh</span>
                <span className="text-[10px] text-white/50">Nghiên cứu sinh</span>
              </div>
              <p className="text-white/90 text-[11px] leading-relaxed">
                "Cảm ơn bạn đã nhắc nhở mình không được vội vàng nâng nhiệt độ. Số liệu bài báo giờ đây vững vàng và minh bạch hơn rất nhiều!"
              </p>
            </div>

            <div className="p-3 bg-[#111] border border-white/20 space-y-1">
              <div className="flex items-center justify-between text-white/80">
                <span className="font-bold text-[#00ff41]">Bác nông dân Sáu (Vùng dược liệu Ba Vì)</span>
                <span className="text-[10px] text-white/50">Đối tác dược liệu</span>
              </div>
              <p className="text-white/90 text-[11px] leading-relaxed">
                "Bà con chúng tôi rất mừng khi thảo dược được nghiên cứu bài bản, khoa học để giúp ích cho sức khỏe người dân cả nước!"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
