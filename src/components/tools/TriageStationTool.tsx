import React, { useState, useEffect, useRef } from 'react';
import { TaskEvaluationResult, Settings, HealthcareState } from '../../types';
import { playSound } from '../../utils/audio';
import {
  HeartPulse,
  CheckCircle2,
  XCircle,
  ShieldAlert,
  Activity,
  Stethoscope,
  Syringe,
  AlertCircle,
  Eye,
  Pill,
  Disc,
  FileText,
  ShieldCheck,
  Sparkles,
  Wrench,
  Users,
  Send,
  MessageSquare,
  Clock,
  Check,
  AlertTriangle,
  Flame,
  Shield,
  HelpCircle
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Patient {
  id: string;
  name: string;
  hr: number;
  bp: string;
  o2: number;
  complaint: string;
  targetColor: 'RED' | 'YELLOW' | 'GREEN';
  gcs?: number; // Glasgow Coma Scale (3-15)
  allergies?: string;
  recommendedAction?: 'oxygen_iv' | 'antihypertensive' | 'outpatient_care';
}

interface Props {
  taskData: {
    title?: string;
    storyContext?: string;
    rules?: string[];
    patients: Patient[];
  };
  settings: Settings;
  onEvaluateResult: (res: TaskEvaluationResult) => void;
  currentWeek?: number;
  healthcareState?: HealthcareState;
  onUpdateHealthcareState?: (newState: HealthcareState) => void;
  equippedToolId?: string;
  unlockedSkills?: string[];
}

const DEFAULT_STATE: HealthcareState = {
  patientSurvivalRate: 85,
  bedCapacity: 65,
  staffBurnout: 30,
  medicalEthics: 90,
  diagnosticAccuracy: 80,
  hospitalReputation: 80,
  mentorTrustBacSiTruong: 75,
  flags: []
};

export const TriageStationTool: React.FC<Props> = ({
  taskData,
  settings,
  onEvaluateResult,
  currentWeek = 1,
  healthcareState,
  onUpdateHealthcareState,
  equippedToolId,
  unlockedSkills = []
}) => {
  const [state, setState] = useState<HealthcareState>(healthcareState || DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<'triage_bay' | 'clinical_essay' | 'icu_monitor' | 'consultation'>('triage_bay');
  const [activePatientIdx, setActivePatientIdx] = useState<number>(0);
  const [activeSubTab, setActiveSubTab] = useState<'vitals' | 'stethoscope' | 'labs' | 'rx'>('vitals');
  const [assignments, setAssignments] = useState<Record<string, 'RED' | 'YELLOW' | 'GREEN'>>({});
  const [actions, setActions] = useState<Record<string, 'oxygen_iv' | 'antihypertensive' | 'outpatient_care'>>({});
  const [evalResult, setEvalResult] = useState<TaskEvaluationResult | null>(null);
  const [rubricFeedbackList, setRubricFeedbackList] = useState<{ label: string; passed: boolean; note: string }[]>([]);

  // Dilemma and Clinical Essay state
  const [selectedEthicalChoice, setSelectedEthicalChoice] = useState<string>('fair_triage');
  const [clinicalEssay, setClinicalEssay] = useState<string>('');

  // Stethoscope listening state
  const [listeningPoint, setListeningPoint] = useState<'aortic' | 'mitral' | 'lung_left' | 'lung_right' | null>(null);
  const [auscultationLog, setAuscultationLog] = useState<string>('Chưa đặt ống nghe lên vị trí thính chẩn.');

  // Special Skills
  const hasStethoscope = unlockedSkills.includes('digital_stethoscope') || equippedToolId === 'digital_stethoscope';
  const hasAED = unlockedSkills.includes('auto_defibrillator_aed') || equippedToolId === 'auto_defibrillator_aed';
  const hasHoloICU = unlockedSkills.includes('holo_icu_diagnostics') || equippedToolId === 'holo_icu_diagnostics';
  const [activeSkillHint, setActiveSkillHint] = useState<string | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (healthcareState) {
      setState(healthcareState);
    }
  }, [healthcareState]);

  useEffect(() => {
    setActivePatientIdx(0);
    setAssignments({});
    setActions({});
    setEvalResult(null);
    setRubricFeedbackList([]);
    setClinicalEssay('');
  }, [currentWeek]);

  const updateAndSaveState = (updater: (prev: HealthcareState) => HealthcareState) => {
    const newState = updater(state);
    setState(newState);
    if (onUpdateHealthcareState) {
      onUpdateHealthcareState(newState);
    }
  };

  const currentPatient = taskData.patients[activePatientIdx] || taskData.patients[0];

  const handleListenPoint = (point: 'aortic' | 'mitral' | 'lung_left' | 'lung_right') => {
    playSound.click(settings.retroSound);
    setListeningPoint(point);

    if (point === 'aortic' || point === 'mitral') {
      if (currentPatient.hr > 130) {
        setAuscultationLog(`[TIM - ${point.toUpperCase()}]: Tiếng tim T1 T2 mờ, nhịp tim rất nhanh dồn dập (~${currentPatient.hr} bpm), nghi ngờ rung nhĩ hoặc nhịp nhanh kịch phát.`);
      } else if (parseInt(currentPatient.bp.split('/')[0]) > 160) {
        setAuscultationLog(`[TIM - ${point.toUpperCase()}]: Tiếng tim T2 đanh mạnh ở ổ van động mạch chủ, áp lực tống máu tăng cao do cơn tăng huyết áp.`);
      } else {
        setAuscultationLog(`[TIM - ${point.toUpperCase()}]: Tiếng T1 T2 đều rõ, không nghe thấy âm thổi bệnh lý.`);
      }
    } else {
      if (currentPatient.o2 < 90) {
        setAuscultationLog(`[PHỔI - ${point.toUpperCase()}]: Rì rào phế nang giảm mạnh, nghe rõ tiếng Ran rít và rale nổ ở đáy phổi. Tình trạng suy hô hấp cấp tính!`);
      } else {
        setAuscultationLog(`[PHỔI - ${point.toUpperCase()}]: Rì rào phế nang êm dịu 2 bên phế trường, không rales ứ đọng.`);
      }
    }
  };

  // Animated ECG Waveform Monitor on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let offset = 0;
    const hr = currentPatient.hr || 80;
    const speed = hr > 120 ? 4 : 2.5;

    const render = () => {
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Grid
      ctx.strokeStyle = 'rgba(0, 255, 65, 0.15)';
      ctx.lineWidth = 1;
      for (let x = 0; x < canvas.width; x += 20) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
        ctx.stroke();
      }
      for (let y = 0; y < canvas.height; y += 20) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
        ctx.stroke();
      }

      // ECG Line
      ctx.strokeStyle = currentPatient.targetColor === 'RED' ? '#ff0055' : '#00ff41';
      ctx.lineWidth = 2;
      ctx.beginPath();

      const midY = canvas.height / 2;
      for (let x = 0; x < canvas.width; x++) {
        const cycle = ((x + offset) * (hr / 60)) % 100;
        let y = midY;

        if (cycle > 40 && cycle < 45) {
          y = midY - 6; // P wave
        } else if (cycle >= 45 && cycle < 48) {
          y = midY + 4; // Q wave
        } else if (cycle >= 48 && cycle < 52) {
          y = midY - 35; // R wave (spike)
        } else if (cycle >= 52 && cycle < 56) {
          y = midY + 12; // S wave
        } else if (cycle >= 65 && cycle < 75) {
          y = midY - 10; // T wave
        }

        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();

      offset += speed;
      animId = requestAnimationFrame(render);
    };

    render();
    return () => cancelAnimationFrame(animId);
  }, [currentPatient]);

  const handleUseSkill = () => {
    playSound.click(settings.retroSound);
    confetti({ particleCount: 30, spread: 50 });

    if (hasHoloICU) {
      setActiveSkillHint('🏥 [HOLO ICU]: Ảnh chụp 3D phổi cho thấy dịch ứ đáy phổi màng ngoài tim. Đề xuất can thiệp thở Oxy và kiểm soát huyết áp khẩn.');
    } else if (hasAED) {
      setActiveSkillHint('⚡ [AUTO AED PRO]: Máy theo dõi nhịp xoang cảnh báo rung thất nếu nhịp tim vượt quá 140 bpm. Chuẩn bị bản sốc điện!');
    } else if (hasStethoscope) {
      setActiveSkillHint('🩺 [DIGITAL STETHOSCOPE]: Phát hiện tiếng thổi tâm thu 3/6 tại ổ van 2 lá và ran nổ đáy phổi.');
    }
  };

  // Comprehensive Clinical & Ethical Evaluation
  const handleEvaluateTriage = () => {
    playSound.click(settings.retroSound);
    const feedbackItems: { label: string; passed: boolean; note: string }[] = [];

    // 1. Triage accuracy check
    let correctCount = 0;
    const totalPatients = taskData.patients.length;

    taskData.patients.forEach((p) => {
      const assigned = assignments[p.id];
      if (assigned === p.targetColor) {
        correctCount++;
      }
    });

    const triagePassed = correctCount === totalPatients;

    feedbackItems.push({
      label: `Phân loại Triage lâm sàng (${correctCount}/${totalPatients} Bệnh nhân)`,
      passed: triagePassed,
      note: triagePassed
        ? 'Phân loại mức độ khẩn cấp chính xác 100% dựa trên sinh hiệu HR, BP, SpO2.'
        : `Có ${totalPatients - correctCount} bệnh nhân phân loại sai mức độ ưu tiên cấp cứu.`
    });

    // 2. Open-ended Clinical & Ethical Essay Evaluation
    const essayLower = clinicalEssay.toLowerCase();
    let essayPassed = true;
    let mentorNote = '';

    if (currentWeek === 1) {
      const hasVitals = /sinh hiệu|nhịp tim|huyết áp|spo2|o2|hr|bp|gcs/.test(essayLower);
      const hasEthics = /y đức|công bằng|không thiên vị|tính mạng|ưu tiên|cấp cứu|bác ba/.test(essayLower);
      const hasMinLen = clinicalEssay.trim().length >= 35;

      feedbackItems.push({
        label: 'Phân tích chỉ số sinh hiệu nguy kịch',
        passed: hasVitals,
        note: hasVitals ? 'Nhận diện đúng rủi ro suy hô hấp và đau ngực cấp.' : 'Chưa phân tích sinh hiệu (SpO2/HR/BP).'
      });
      feedbackItems.push({
        label: 'Bảo vệ y đức công bằng trước bệnh nhân VIP',
        passed: hasEthics,
        note: hasEthics ? 'Kiên quyết đặt tính mạng lên trên tiền bạc/thân thế.' : 'Chưa thể hiện rõ lập trường y đức.'
      });
      feedbackItems.push({
        label: 'Độ sâu luận giải lâm sàng (≥35 ký tự)',
        passed: hasMinLen,
        note: hasMinLen ? 'Lập luận đầy đủ, chặt chẽ.' : 'Bài luận lâm sàng quá ngắn.'
      });

      essayPassed = hasVitals && hasEthics && hasMinLen;

      updateAndSaveState(prev => {
        const nextFlags = [...prev.flags];
        let { medicalEthics, mentorTrustBacSiTruong, hospitalReputation, patientSurvivalRate } = prev;

        if (selectedEthicalChoice === 'fair_triage') {
          nextFlags.push('w1_fair_triage_upheld');
          medicalEthics = Math.min(100, medicalEthics + 10);
          mentorTrustBacSiTruong = Math.min(100, mentorTrustBacSiTruong + 10);
          patientSurvivalRate = Math.min(100, patientSurvivalRate + 5);
        } else {
          nextFlags.push('w1_vip_favored');
          medicalEthics = Math.max(30, medicalEthics - 20);
          hospitalReputation = Math.max(30, hospitalReputation - 15);
        }

        return { ...prev, medicalEthics, mentorTrustBacSiTruong, hospitalReputation, patientSurvivalRate, flags: nextFlags };
      });

      mentorNote = 'BS. Lê Hùng: "Triage chuẩn xác! Nhớ lấy câu này: Trước cửa phòng cấp cứu, chỉ có sinh hiệu quyết định thứ tự, không có chỗ cho đặc quyền!"';
    } else if (currentWeek === 2) {
      const hasRespiratory = /suy hô hấp|spo2|oxy|phổi|ran|khó thở|tím tái/.test(essayLower);
      const hasDiagnostic = /chẩn đoán|phân biệt|thính chẩn|x-quang|khẩn cấp/.test(essayLower);
      const hasMinLen = clinicalEssay.trim().length >= 35;

      feedbackItems.push({
        label: 'Đánh giá hội chứng suy hô hấp cấp',
        passed: hasRespiratory,
        note: hasRespiratory ? 'Nắm rõ rủi ro khi SpO2 sụt giảm dưới 90%.' : 'Chưa phân tích cơ chế suy hô hấp.'
      });
      feedbackItems.push({
        label: 'Biện luận chẩn đoán phân biệt & Thính chẩn',
        passed: hasDiagnostic,
        note: hasDiagnostic ? 'Biện giải hợp lý giữa Hen phế quản và Phù phổi.' : 'Chưa nêu rõ phương pháp chẩn đoán phân biệt.'
      });

      essayPassed = hasRespiratory && hasDiagnostic && hasMinLen;

      updateAndSaveState(prev => {
        const nextFlags = [...prev.flags, 'w2_respiratory_mastered'];
        return {
          ...prev,
          diagnosticAccuracy: Math.min(100, prev.diagnosticAccuracy + 10),
          patientSurvivalRate: Math.min(100, prev.patientSurvivalRate + 5),
          flags: nextFlags
        };
      });

      mentorNote = 'BS. Lê Hùng: "Phát hiện sớm SpO2 thấp đã cứu sống bệnh nhân suy hô hấp kịp thời."';
    } else if (currentWeek === 5) {
      const hasVIP = /vip|công bằng|hộ nghèo|trẻ em|co giật|sinh hiệu|đạo đức/.test(essayLower);
      const hasEthics5 = /y đức|bình đẳng|lương y|cứu người|nghèo/.test(essayLower);
      const hasMinLen = clinicalEssay.trim().length >= 35;

      feedbackItems.push({
        label: 'Xử trí ca cấp cứu nhi co giật trước VIP',
        passed: hasVIP,
        note: hasVIP ? 'Xử trí khẩn cấp đúng mức độ ĐỎ nguy kịch cho bé Hùng.' : 'Chưa ưu tiên đúng ca cấp cứu co giật.'
      });
      feedbackItems.push({
        label: 'Giữ vững lằn ranh Y đức Y khoa',
        passed: hasEthics5,
        note: hasEthics5 ? 'Tâm sáng cứu người, không lung lay trước áp lực.' : 'Chưa nêu cao tinh thần Y đức.'
      });

      essayPassed = hasVIP && hasEthics5 && hasMinLen;

      updateAndSaveState(prev => {
        const nextFlags = [...prev.flags, 'w5_child_saved_ethics'];
        return {
          ...prev,
          medicalEthics: Math.min(100, prev.medicalEthics + 15),
          mentorTrustBacSiTruong: Math.min(100, prev.mentorTrustBacSiTruong + 10),
          patientSurvivalRate: Math.min(100, prev.patientSurvivalRate + 10),
          flags: nextFlags
        };
      });

      mentorNote = 'Điều dưỡng Trưởng Mai: "Bé Hùng đã cắt cơn co giật an toàn. Cảm ơn bác sĩ đã kiên quyết bảo vệ bệnh nhi!"';
    } else {
      // General weeks (3, 4, 6, 7, 8)
      const hasClinical = /sinh hiệu|cấp cứu|điều trị|an toàn|phác đồ|bệnh nhân|y khoa/.test(essayLower);
      const hasTradeoff = /đánh đổi|ưu tiên|thảm họa|quy trình|y đức|trách nhiệm/.test(essayLower);
      const hasMinLen = clinicalEssay.trim().length >= 35;

      feedbackItems.push({
        label: 'Biện luận lâm sàng & Phác đồ điều trị',
        passed: hasClinical,
        note: hasClinical ? 'Phác đồ cấp cứu phù hợp với bệnh cảnh.' : 'Chưa làm rõ phác đồ điều trị lâm sàng.'
      });
      feedbackItems.push({
        label: 'Trách nhiệm nghề nghiệp & Đạo đức Y khoa',
        passed: hasTradeoff,
        note: hasTradeoff ? 'Ý thức rõ trọng trách tính mạng con người.' : 'Chưa nêu bật được trách nhiệm người thầy thuốc.'
      });

      essayPassed = hasClinical && hasTradeoff && hasMinLen;

      updateAndSaveState(prev => {
        const nextFlags = [...prev.flags, `w${currentWeek}_passed`];
        return {
          ...prev,
          patientSurvivalRate: Math.min(100, prev.patientSurvivalRate + 5),
          diagnosticAccuracy: Math.min(100, prev.diagnosticAccuracy + 5),
          flags: nextFlags
        };
      });

      mentorNote = 'BS. Lê Hùng: "Quyết định xử trí nhanh, chính xác và đúng y đức nghề nghiệp!"';
    }

    const isOverallPassed = triagePassed && essayPassed;
    let score = Math.round(((correctCount / totalPatients) * 0.6 + (essayPassed ? 0.4 : 0.15)) * 100);

    if (isOverallPassed && hasHoloICU) {
      score = Math.min(100, score + 5);
    }

    const result: TaskEvaluationResult = {
      passed: isOverallPassed,
      score,
      feedback: isOverallPassed
        ? `✓ XUẤT SẮC! ${mentorNote} Điểm lâm sàng: ${score}/100. Đã cập nhật chỉ số Y tế & Cứu sinh.`
        : `⚠️ CHƯA ĐẠT! ${triagePassed ? 'Phân loại màu đã đúng nhưng phần Biện luận lâm sàng & Y đức chưa đạt yêu cầu.' : 'Còn bệnh nhân phân loại sai màu cấp cứu. Hãy kiểm tra lại sinh hiệu và hoàn thiện bài luận.'}`,
      details: [
        `--- ĐÁNH GIÁ PHÂN LOẠI TRIAGE & BIỆN LUẬN LÂM SÀNG ---`,
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
      case 5:
        return [
          { id: 'fair_triage', title: 'Ưu tiên ca cấp cứu nguy kịch (Bác Ba / Bé Hùng - Mã ĐỎ)', desc: 'Xử trí khẩn cấp theo chuẩn Triage sinh hiệu, không nhượng bộ bệnh nhân VIP chỉ bị trầy xước nhẹ.' },
          { id: 'favor_vip', title: 'Nhượng bộ xếp phòng VIP khám trước cho thiếu gia Long', desc: 'Tránh xung đột với nhà tài trợ nhưng vi phạm y đức và đẩy bệnh nhân nguy kịch vào vòng nguy hiểm.' }
        ];
      case 3:
      case 7:
        return [
          { id: 'mass_start_protocol', title: 'Áp dụng giao thức Triage Thảm họa START Protocol chuẩn', desc: 'Phân loại nhanh không quá 60s/nạn nhân để cứu được số lượng người sống sót tối đa.' },
          { id: 'emotional_focus', title: 'Tập trung toàn lực cứu 1 nạn nhân nặng nhất đến trước', desc: 'Bỏ lỡ thời gian vàng của nhiều nạn nhân khác có khả năng cứu sống cao hơn.' }
        ];
      default:
        return [
          { id: 'evidence_based', title: 'Tuân thủ Y học thực chứng & Liêm chính kê đơn', desc: 'Kê đơn thuốc chuẩn dược điển, từ chối hoa hồng hãng dược để bảo vệ an toàn cho bệnh nhân.' },
          { id: 'compromised_care', title: 'Thỏa hiệp với áp lực tài chính và tiến độ bệnh viện', desc: 'Cắt giảm các bước xét nghiệm cần thiết để đẩy nhanh lưu chuyển giường bệnh.' }
        ];
    }
  };

  return (
    <div className="bg-[#0c0c0c] border-2 border-[#ef4444] p-4 space-y-4 font-mono text-[#ff8888] select-none shadow-2xl">
      {/* Header Bar */}
      <div className="bg-[#190808] p-3.5 border border-[#ef4444]/60 space-y-2 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-black uppercase text-[#ef4444]">
            <HeartPulse className="w-5 h-5 animate-pulse text-[#ef4444]" />
            <span>TRẠM PHÂN LOẠI CẤP CỨU TRIAGE Y KHOA & THEO DÕI SINH HIỆU KHẨN</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#000] border border-[#ef4444] text-[#ef4444] text-[10px] font-bold uppercase">
              TUẦN {currentWeek}/8: {currentWeek === 5 ? 'THỬ THÁCH Y ĐỨC' : 'LÂM SÀNG CẤP CỨU'}
            </span>
            <span className="px-2 py-0.5 bg-[#000] border border-[#00ff41] text-[#00ff41] text-[10px] font-bold uppercase">
              KHOA CẤP CỨU A&E
            </span>
          </div>
        </div>
        <p className="opacity-90 text-xs text-white/90">
          {taskData.storyContext || 'Đánh giá sinh hiệu (HR, BP, SpO2) và nghe tiếng tim phổi để phân loại Triage 3 màu chính xác.'}
        </p>
      </div>

      {/* Special Equipped Tools HUD Bar */}
      {(hasStethoscope || hasAED || hasHoloICU) && (
        <div className="bg-[#1a0808] border-2 border-[#ffea00] p-3 space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-white uppercase text-[11px]">
              <Wrench className="w-4 h-4 text-[#ffea00]" />
              <span>DỤNG CỤ Y KHOA ĐẶC BIỆT:</span>
              <span className="text-[#ff4444] bg-black px-2 py-0.2 border border-[#ff4444]/50">
                {hasHoloICU ? '🏥 HỆ THỐNG HOLO ICU CHẨN ĐOÁN 3D' : hasAED ? '⚡ MÁY SỐC ĐIỆN KHỬ RUNG AUTO AED' : '🩺 ỐNG NGHE KỸ THUẬT SỐ PRO'}
              </span>
            </div>

            <button
              onClick={handleUseSkill}
              className="px-3 py-1 bg-[#ffea00] text-black font-black text-[10px] uppercase hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(255,234,0,0.4)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>KÍCH HOẠT CHẨN ĐOÁN CHUYÊN SÂU</span>
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
      <div className="flex flex-wrap gap-2 border-b border-[#ef4444]/40 pb-2">
        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('triage_bay'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'triage_bay'
              ? 'bg-[#ef4444] text-black border-white shadow-[0_0_10px_rgba(239,68,68,0.6)] font-black'
              : 'bg-[#111] text-[#ef4444] border-[#ef4444]/40 hover:border-[#ef4444]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>1. BÀN PHÂN LOẠI TRIAGE ({taskData.patients.length} BỆNH NHÂN)</span>
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('clinical_essay'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'clinical_essay'
              ? 'bg-[#ffea00] text-black border-white shadow-[0_0_10px_rgba(255,234,0,0.6)] font-black'
              : 'bg-[#111] text-[#ffea00] border-[#ffea00]/40 hover:border-[#ffea00]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>2. Y ĐỨC & BIỆN LUẬN LÂM SÀNG</span>
          {clinicalEssay.trim().length >= 35 && (
            <span className="bg-black text-[#ffea00] text-[9px] px-1 py-0.2 border border-[#ffea00]">
              ✓ ĐÃ VIẾT
            </span>
          )}
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('icu_monitor'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'icu_monitor'
              ? 'bg-[#00ff41] text-black border-white shadow-[0_0_10px_rgba(0,255,65,0.6)] font-black'
              : 'bg-[#111] text-[#00ff41] border-[#00ff41]/40 hover:border-[#00ff41]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>3. MONITOR THEO DÕI SÓNG ECG & O2</span>
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('consultation'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'consultation'
              ? 'bg-[#ff00ff] text-black border-white shadow-[0_0_10px_rgba(255,0,255,0.6)] font-black'
              : 'bg-[#111] text-[#ff00ff] border-[#ff00ff]/40 hover:border-[#ff00ff]'
          }`}
        >
          <Users className="w-3.5 h-3.5" />
          <span>4. HỘI CHẨN KÍP TRỰC CẤP CỨU</span>
        </button>
      </div>

      {/* TAB 1: TRIAGE BAY & PATIENT CLINICAL EXAM */}
      {activeTab === 'triage_bay' && (
        <div className="space-y-4">
          {/* Patient Switcher Tabs */}
          <div className="flex flex-wrap gap-2">
            {taskData.patients.map((p, idx) => {
              const isSelected = idx === activePatientIdx;
              const assignedColor = assignments[p.id];
              return (
                <button
                  key={p.id}
                  onClick={() => { playSound.click(settings.retroSound); setActivePatientIdx(idx); }}
                  className={`px-3 py-2 text-xs font-bold border-2 transition-all flex items-center gap-2 cursor-pointer ${
                    isSelected
                      ? 'bg-[#ef4444] text-black border-white shadow-[0_0_10px_rgba(239,68,68,0.5)]'
                      : 'bg-[#111] text-white/80 border-white/20 hover:border-[#ef4444]'
                  }`}
                >
                  <span>{idx + 1}. {p.name}</span>
                  {assignedColor && (
                    <span
                      className={`w-3 h-3 rounded-full border border-black ${
                        assignedColor === 'RED' ? 'bg-[#ff0055]' : assignedColor === 'YELLOW' ? 'bg-[#ffea00]' : 'bg-[#00ff41]'
                      }`}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {/* Current Patient Clinical Details Card */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left: Vitals & Stethoscope Auscultation */}
            <div className="lg:col-span-8 space-y-3 bg-[#080808] border border-[#ef4444]/60 p-4">
              <div className="flex items-center justify-between border-b border-[#ef4444]/40 pb-2">
                <div className="font-black text-white text-sm uppercase flex items-center gap-2">
                  <Activity className="w-4 h-4 text-[#ef4444]" />
                  <span>HỒ SƠ BỆNH ÁN: {currentPatient.name}</span>
                </div>
                <span className="text-xs text-white/70">Lý do vào viện: <strong className="text-[#ffea00]">{currentPatient.complaint}</strong></span>
              </div>

              {/* Vitals Grid */}
              <div className="grid grid-cols-3 gap-3 text-center">
                <div className="bg-[#111] p-3 border border-[#ef4444]/40">
                  <span className="text-[10px] text-white/60 block">NHỊP TIM (HR)</span>
                  <div className={`text-xl font-black ${currentPatient.hr > 120 ? 'text-[#ff0055] animate-pulse' : 'text-[#00ff41]'}`}>
                    {currentPatient.hr} <span className="text-xs font-normal">bpm</span>
                  </div>
                </div>

                <div className="bg-[#111] p-3 border border-[#ef4444]/40">
                  <span className="text-[10px] text-white/60 block">HUYẾT ÁP (BP)</span>
                  <div className={`text-xl font-black ${parseInt(currentPatient.bp.split('/')[0]) > 150 ? 'text-[#ffea00]' : 'text-[#00ff41]'}`}>
                    {currentPatient.bp} <span className="text-xs font-normal">mmHg</span>
                  </div>
                </div>

                <div className="bg-[#111] p-3 border border-[#ef4444]/40">
                  <span className="text-[10px] text-white/60 block">NỒNG ĐỘ OXY (SpO2)</span>
                  <div className={`text-xl font-black ${currentPatient.o2 < 90 ? 'text-[#ff0055] animate-pulse' : 'text-[#00ff41]'}`}>
                    {currentPatient.o2}%
                  </div>
                </div>
              </div>

              {/* Interactive Stethoscope Auscultation */}
              <div className="bg-[#111] border border-white/20 p-3 space-y-2">
                <div className="flex items-center justify-between text-xs text-white font-bold uppercase">
                  <span className="flex items-center gap-1.5"><Stethoscope className="w-4 h-4 text-[#00e5ff]" /> THÍNH CHẨN ỐNG NGHE TIM - PHỔI</span>
                  <span className="text-[10px] text-[#00e5ff]">Bấm các vị trí để nghe</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <button
                    onClick={() => handleListenPoint('aortic')}
                    className={`p-2 text-center text-xs font-bold border transition-all cursor-pointer ${
                      listeningPoint === 'aortic' ? 'bg-[#00e5ff] text-black border-white' : 'bg-black text-[#00e5ff] border-[#00e5ff]/40'
                    }`}
                  >
                    Van ĐMC (Aortic)
                  </button>
                  <button
                    onClick={() => handleListenPoint('mitral')}
                    className={`p-2 text-center text-xs font-bold border transition-all cursor-pointer ${
                      listeningPoint === 'mitral' ? 'bg-[#00e5ff] text-black border-white' : 'bg-black text-[#00e5ff] border-[#00e5ff]/40'
                    }`}
                  >
                    Van 2 Lá (Mitral)
                  </button>
                  <button
                    onClick={() => handleListenPoint('lung_left')}
                    className={`p-2 text-center text-xs font-bold border transition-all cursor-pointer ${
                      listeningPoint === 'lung_left' ? 'bg-[#00ff41] text-black border-white' : 'bg-black text-[#00ff41] border-[#00ff41]/40'
                    }`}
                  >
                    Đáy Phổi Trái
                  </button>
                  <button
                    onClick={() => handleListenPoint('lung_right')}
                    className={`p-2 text-center text-xs font-bold border transition-all cursor-pointer ${
                      listeningPoint === 'lung_right' ? 'bg-[#00ff41] text-black border-white' : 'bg-black text-[#00ff41] border-[#00ff41]/40'
                    }`}
                  >
                    Đáy Phổi Phải
                  </button>
                </div>

                <div className="p-2 bg-black border border-white/20 text-xs text-white/90">
                  {auscultationLog}
                </div>
              </div>
            </div>

            {/* Right: Triage Classification Actions */}
            <div className="lg:col-span-4 space-y-3 bg-[#080808] border border-[#ef4444]/60 p-4">
              <h4 className="text-xs font-black text-white uppercase border-b border-[#ef4444]/40 pb-1.5">
                QUYẾT ĐỊNH PHÂN LOẠI TRIAGE CHO {currentPatient.name}:
              </h4>

              <div className="space-y-2">
                <button
                  onClick={() => {
                    playSound.click(settings.retroSound);
                    setAssignments(prev => ({ ...prev, [currentPatient.id]: 'RED' }));
                  }}
                  className={`w-full p-3 border-2 text-left font-black text-xs uppercase flex items-center justify-between transition-all cursor-pointer ${
                    assignments[currentPatient.id] === 'RED'
                      ? 'bg-[#ff0055] text-white border-white shadow-[0_0_12px_#ff0055]'
                      : 'bg-[#111] text-[#ff8888] border-[#ff0055]/40 hover:border-[#ff0055]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ff0055] border border-white" />
                    <span>MÃ ĐỎ (RED) - CẤP CỨU KHẨN CẤP</span>
                  </div>
                  <span className="text-[10px]">Đe dọa tính mạng ngay</span>
                </button>

                <button
                  onClick={() => {
                    playSound.click(settings.retroSound);
                    setAssignments(prev => ({ ...prev, [currentPatient.id]: 'YELLOW' }));
                  }}
                  className={`w-full p-3 border-2 text-left font-black text-xs uppercase flex items-center justify-between transition-all cursor-pointer ${
                    assignments[currentPatient.id] === 'YELLOW'
                      ? 'bg-[#ffea00] text-black border-white shadow-[0_0_12px_#ffea00]'
                      : 'bg-[#111] text-[#ffea00] border-[#ffea00]/40 hover:border-[#ffea00]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#ffea00] border border-black" />
                    <span>MÃ VÀNG (YELLOW) - ƯU TIÊN THEO DÕI</span>
                  </div>
                  <span className="text-[10px]">Chưa đe dọa ngay</span>
                </button>

                <button
                  onClick={() => {
                    playSound.click(settings.retroSound);
                    setAssignments(prev => ({ ...prev, [currentPatient.id]: 'GREEN' }));
                  }}
                  className={`w-full p-3 border-2 text-left font-black text-xs uppercase flex items-center justify-between transition-all cursor-pointer ${
                    assignments[currentPatient.id] === 'GREEN'
                      ? 'bg-[#00ff41] text-black border-white shadow-[0_0_12px_#00ff41]'
                      : 'bg-[#111] text-[#00ff41] border-[#00ff41]/40 hover:border-[#00ff41]'
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-[#00ff41] border border-black" />
                    <span>MÃ XANH (GREEN) - CHĂM SÓC NHẸ</span>
                  </div>
                  <span className="text-[10px]">Khám ngoại trú</span>
                </button>
              </div>

              {/* Action prompt */}
              <div className="pt-2">
                <button
                  onClick={handleEvaluateTriage}
                  className="w-full py-3 bg-[#ef4444] text-black font-black text-xs uppercase border-2 border-white hover:bg-white transition-all flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(239,68,68,0.5)]"
                >
                  <HeartPulse className="w-4 h-4" />
                  <span>XÁC NHẬN PHÂN LOẠI & ĐÁNH GIÁ Y ĐỨC</span>
                </button>
              </div>
            </div>
          </div>

          {/* Rubric Evaluation Results Banner */}
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
                  <span>{evalResult.passed ? 'KẾT QUẢ TRIAGE & Y ĐỨC ĐẠT CHUẨN XUẤT SẮC' : 'CẦN CHỈNH SỬA & HOÀN THIỆN PHÁC ĐỒ'}</span>
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

      {/* TAB 2: Y ĐỨC & BIỆN LUẬN LÂM SÀNG */}
      {activeTab === 'clinical_essay' && (
        <div className="space-y-4 bg-[#080808] border border-[#ffea00]/60 p-4">
          <div className="border-b border-[#ffea00]/40 pb-2">
            <h3 className="text-sm font-black text-[#ffea00] uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ffea00]" />
              QUYẾT ĐỊNH Y ĐỨC & BIỆN LUẬN LÂM SÀNG CẤP CỨU TUẦN {currentWeek}
            </h3>
            <p className="text-xs text-white/80 mt-1">
              "Lương y như từ mẫu" — Sự công bằng và lòng trắc ẩn cứu người là chuẩn mực bất di bất dịch của người thầy thuốc.
            </p>
          </div>

          {/* Dilemma Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white uppercase block">
              1. LỰA CHỌN PHƯƠNG ÁN XỬ TRÍ Y ĐỨC:
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
                      name="ethical_y_khoa"
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
                2. BIỆN LUẬN LÂM SÀNG & NGUYÊN TẮC Y ĐỨC (TỰ LUẬN ĐÁNH GIÁ CHUYÊN SÂU):
              </label>
              <span className={`text-[11px] ${clinicalEssay.trim().length >= 35 ? 'text-[#00ff41]' : 'text-[#ffea00]'}`}>
                {clinicalEssay.trim().length}/35 ký tự tối thiểu
              </span>
            </div>

            <textarea
              value={clinicalEssay}
              onChange={(e) => setClinicalEssay(e.target.value)}
              placeholder={
                currentWeek === 1
                  ? "Ví dụ: Dựa trên sinh hiệu bệnh nhân, Bác Ba có SpO2 84% tụt nghiêm trọng kèm đau ngực khó thở dữ dội, thuộc mã ĐỎ đe dọa tính mạng trực tiếp. Thiếu gia Long sinh hiệu ổn định thuộc mã XANH. Nguyên tắc Triage yêu cầu ưu tiên người nguy kịch trước, không phân biệt thân thế..."
                  : "Trình bày phân tích sinh hiệu, chẩn đoán phân biệt và trách nhiệm y đức của người thầy thuốc..."
              }
              rows={4}
              className="w-full bg-[#050505] border-2 border-[#ffea00]/80 p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ffea00] leading-relaxed selection:bg-[#ffea00] selection:text-black font-mono"
            />
          </div>

          {/* Action */}
          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-white/60">
              💡 Hãy viết bài luận lâm sàng đầy đủ trước khi bấm nộp bài để đạt điểm tối đa.
            </span>
            <button
              onClick={handleEvaluateTriage}
              className="px-4 py-2 bg-[#ffea00] text-black font-black text-xs uppercase hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(255,234,0,0.4)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>NỘP BÀI BIỆN LUẬN LÂM SÀNG</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: ICU MONITOR & ECG WAVEFORM CANVAS */}
      {activeTab === 'icu_monitor' && (
        <div className="space-y-3 bg-[#050505] border border-[#00ff41]/60 p-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-[#00ff41]/40 pb-2">
            <div className="flex items-center gap-2 text-[#00ff41] font-bold uppercase">
              <Activity className="w-4 h-4" />
              <span>HỆ THỐNG THEO DÕI ĐIỆN TÂM ĐỒ (ECG MONITOR) - BỆNH NHÂN: {currentPatient.name}</span>
            </div>
            <span className="px-2 py-0.5 bg-black border border-[#00ff41] text-[#00ff41] text-[10px] font-bold">
              REAL-TIME 12-LEAD SIMULATOR
            </span>
          </div>

          {/* Canvas Waveform */}
          <div className="border-2 border-[#00ff41]/80 bg-black overflow-hidden relative">
            <canvas ref={canvasRef} width={640} height={180} className="w-full h-[180px] block" />
            <div className="absolute top-2 left-2 text-[10px] text-[#00ff41] bg-black/70 px-2 py-0.5 border border-[#00ff41]/40">
              CH1: LEAD II | {currentPatient.hr} BPM | SpO2: {currentPatient.o2}%
            </div>
          </div>

          {/* Healthcare State Counters */}
          <div className="pt-2 border-t border-[#00ff41]/30">
            <h4 className="text-[11px] font-bold text-white uppercase mb-2">CHỈ SỐ BỆNH VIỆN & Y TẾ (HEALTHCARE STATE):</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">SURVIVAL RATE</span>
                <span className="text-[#00ff41] font-bold">{state.patientSurvivalRate}%</span>
              </div>
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">BED CAPACITY</span>
                <span className="text-[#00e5ff] font-bold">{state.bedCapacity}%</span>
              </div>
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">MEDICAL ETHICS</span>
                <span className="text-[#ffea00] font-bold">{state.medicalEthics}%</span>
              </div>
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">MENTOR HÙNG TRUST</span>
                <span className="text-[#ff00ff] font-bold">{state.mentorTrustBacSiTruong}%</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: CONSULTATION WITH MENTOR BS. HÙNG & NURSE MAI */}
      {activeTab === 'consultation' && (
        <div className="space-y-3 bg-[#100510] border border-[#ff00ff]/60 p-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-[#ff00ff]/40 pb-2">
            <div className="flex items-center gap-2 text-[#ff00ff] font-bold">
              <Users className="w-4 h-4" />
              <span>HỘI CHẨN KÍP TRỰC CẤP CỨU (KHOA A&E - TUẦN {currentWeek})</span>
            </div>
            <span className="px-2 py-0.5 bg-[#111] border border-[#ff00ff] text-[#ff00ff] text-[10px] uppercase font-bold">
              ON-CALL SHIFT
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-[#111] border border-white/20 space-y-1">
              <div className="flex items-center justify-between text-white/80">
                <span className="font-bold text-[#ef4444]">BS. Lê Hùng (Bác sĩ Trưởng khoa Cấp cứu / Mentor)</span>
                <span className="text-[10px] text-white/50">Ca trực 24h</span>
              </div>
              <p className="text-white/90 text-[11px] leading-relaxed">
                "Trước cửa cấp cứu, chỉ có sinh hiệu là sự thật. Dù là ai, hễ SpO2 dưới 90% hoặc huyết áp tụt kẹp là phải vào phòng hồi sức ngay lập tức. Em làm tốt lắm!"
              </p>
            </div>

            <div className="p-3 bg-[#111] border border-white/20 space-y-1">
              <div className="flex items-center justify-between text-white/80">
                <span className="font-bold text-[#ffea00]">Điều dưỡng Trưởng Mai</span>
                <span className="text-[10px] text-white/50">Trực chính</span>
              </div>
              <p className="text-white/90 text-[11px] leading-relaxed">
                "Đã chuẩn bị sẵn đường truyền tĩnh mạch và máy thở Oxy mask cho ca mã ĐỎ. Kíp trực phối hợp rất nhịp nhàng!"
              </p>
            </div>

            <div className="p-3 bg-[#111] border border-white/20 space-y-1">
              <div className="flex items-center justify-between text-white/80">
                <span className="font-bold text-[#00ff41]">Bác Ba (Bệnh nhân hồi phục)</span>
                <span className="text-[10px] text-white/50">Phòng lưu bệnh</span>
              </div>
              <p className="text-white/90 text-[11px] leading-relaxed">
                "Cảm ơn các bác sĩ đã kịp thời cho tôi thở oxy lúc tôi tưởng không qua khỏi... Lương y như từ mẫu thực sự!"
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
