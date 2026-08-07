import React, { useState, useEffect, useRef } from 'react';
import { TaskEvaluationResult, Settings } from '../../types';
import { playSound } from '../../utils/audio';
import { HeartPulse, CheckCircle2, XCircle, ShieldAlert, Activity, Stethoscope, Syringe, AlertCircle } from 'lucide-react';

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
    title: string;
    storyContext: string;
    rules?: string[];
    patients: Patient[];
  };
  settings: Settings;
  onEvaluateResult: (res: TaskEvaluationResult) => void;
}

export const TriageStationTool: React.FC<Props> = ({ taskData, settings, onEvaluateResult }) => {
  const [activePatientIdx, setActivePatientIdx] = useState<number>(0);
  const [assignments, setAssignments] = useState<Record<string, 'RED' | 'YELLOW' | 'GREEN'>>({});
  const [actions, setActions] = useState<Record<string, 'oxygen_iv' | 'antihypertensive' | 'outpatient_care'>>({});
  const [evalResult, setEvalResult] = useState<TaskEvaluationResult | null>(null);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const currentPatient = taskData.patients[activePatientIdx] || taskData.patients[0];

  // Animated ECG Waveform Monitor on Canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animId: number;
    let x = 0;
    const width = canvas.width;
    const height = canvas.height;
    const midY = height / 2;

    const hr = currentPatient.hr || 80;
    const speed = Math.max(1.5, (hr / 60) * 2); // Sweep speed matches Heart Rate

    // Clear background
    ctx.fillStyle = '#050505';
    ctx.fillRect(0, 0, width, height);

    // Grid lines
    ctx.strokeStyle = 'rgba(0, 255, 65, 0.15)';
    ctx.lineWidth = 1;
    for (let i = 0; i < width; i += 15) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i, height);
      ctx.stroke();
    }
    for (let j = 0; j < height; j += 15) {
      ctx.beginPath();
      ctx.moveTo(0, j);
      ctx.lineTo(width, j);
      ctx.stroke();
    }

    let prevY = midY;

    const renderECG = () => {
      // Fade trailing line
      ctx.fillStyle = 'rgba(5, 5, 5, 0.08)';
      ctx.fillRect(x, 0, 10, height);

      x += speed;
      if (x > width) x = 0;

      // Generate ECG P-Q-R-S-T pulse curve
      const posInCycle = (x % 90);
      let currY = midY;

      if (posInCycle > 30 && posInCycle < 35) {
        currY = midY - 6; // P wave
      } else if (posInCycle >= 35 && posInCycle < 40) {
        currY = midY + 4; // Q wave
      } else if (posInCycle >= 40 && posInCycle < 48) {
        currY = midY - (hr > 120 ? 32 : 24); // R peak (higher if tachycardia)
      } else if (posInCycle >= 48 && posInCycle < 55) {
        currY = midY + 12; // S wave
      } else if (posInCycle >= 65 && posInCycle < 75) {
        currY = midY - 8; // T wave
      } else {
        currY = midY + (Math.random() * 2 - 1); // Noise
      }

      ctx.beginPath();
      ctx.strokeStyle = currentPatient.hr > 130 || currentPatient.o2 < 90 ? '#ff4444' : currentPatient.bp.startsWith('15') || currentPatient.bp.startsWith('16') || currentPatient.bp.startsWith('17') || currentPatient.bp.startsWith('18') || currentPatient.bp.startsWith('19') ? '#ff00ff' : '#00ff41';
      ctx.lineWidth = 2;
      ctx.shadowBlur = 8;
      ctx.shadowColor = ctx.strokeStyle;
      ctx.moveTo(x - speed, prevY);
      ctx.lineTo(x, currY);
      ctx.stroke();

      prevY = currY;
      animId = requestAnimationFrame(renderECG);
    };

    renderECG();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [currentPatient]);

  const handleAssignPriority = (pId: string, color: 'RED' | 'YELLOW' | 'GREEN') => {
    playSound.click(settings.retroSound);
    setAssignments(prev => ({ ...prev, [pId]: color }));
  };

  const handleAssignAction = (pId: string, action: 'oxygen_iv' | 'antihypertensive' | 'outpatient_care') => {
    playSound.click(settings.retroSound);
    setActions(prev => ({ ...prev, [pId]: action }));
  };

  const handleVerifyTriage = () => {
    playSound.click(settings.retroSound);
    let correctTriageCount = 0;
    let correctActionCount = 0;
    const totalPatients = taskData.patients.length;
    const details: string[] = [];

    taskData.patients.forEach(p => {
      const assignedPriority = assignments[p.id];
      const assignedAction = actions[p.id];

      // Determine correct recommended action based on clinical rules if not explicitly passed
      let correctAction: 'oxygen_iv' | 'antihypertensive' | 'outpatient_care' = 'outpatient_care';
      if (p.targetColor === 'RED') correctAction = 'oxygen_iv';
      else if (p.targetColor === 'YELLOW') correctAction = 'antihypertensive';

      if (p.recommendedAction) correctAction = p.recommendedAction;

      const priorityOk = assignedPriority === p.targetColor;
      const actionOk = assignedAction === correctAction;

      if (priorityOk) correctTriageCount++;
      if (actionOk) correctActionCount++;

      if (priorityOk && actionOk) {
        details.push(`[CHUẨN LÂM SÀNG] ${p.name}: Phân loại ${assignedPriority} + Xử trí chính xác.`);
      } else {
        const pStatus = priorityOk ? `Đúng ${p.targetColor}` : `Lỗi phân loại (${assignedPriority || 'Chưa chọn'} ➔ Đúng: ${p.targetColor})`;
        const aStatus = actionOk ? 'Xử trí đúng' : `Lỗi phác đồ điều trị`;
        details.push(`[CẦN CHỈNH SỬA] ${p.name}: ${pStatus} | ${aStatus}`);
      }
    });

    const totalPoints = correctTriageCount * 15 + correctActionCount * 10;
    const maxPoints = totalPatients * 25;
    const passRatio = totalPoints / maxPoints;
    const isPassed = passRatio >= 0.7;
    const score = Math.round(passRatio * 100);

    const result: TaskEvaluationResult = {
      passed: isPassed,
      score,
      feedback: isPassed
        ? `Đã hoàn thành xuất sắc ca trực Cấp cứu! Phân loại chuẩn ${correctTriageCount}/${totalPatients} ca & ra phác đồ cấp cứu chính xác ${correctActionCount}/${totalPatients} ca (${score}%).`
        : `Kết quả chỉ đạt ${score}%. Hãy rà soát lại chỉ số sinh hiệu (HR, BP, SpO2) và phối hợp phác đồ điều trị phù hợp cho từng mức cấp cứu.`,
      details
    };

    setEvalResult(result);
    if (isPassed) playSound.pass(settings.retroSound);
    else playSound.fail(settings.retroSound);

    onEvaluateResult(result);
  };

  const allReady = taskData.patients.every(p => assignments[p.id] && actions[p.id]);

  return (
    <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-4 space-y-4 font-mono text-[#00ff41] select-none">
      {/* Header Clinical Control Panel */}
      <div className="bg-[#111] p-3.5 border border-[#00ff41]/50 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black uppercase text-[#00ff41]">
            <HeartPulse className="w-5 h-5 text-[#ff00ff] animate-pulse" />
            <span>HỆ THỐNG ĐIỀU HÀNH TRIAGE CẤP CỨU Y KHOA PRO</span>
          </div>
          <span className="px-2 py-0.5 bg-[#ff00ff] text-[#0c0c0c] text-[10px] font-black uppercase">
            HỒ SƠ BỆNH ÁN THỰC CHIẾN
          </span>
        </div>
        <p className="opacity-90 text-xs">
          Phân tích hồ sơ bệnh án lâm sàng, đọc chỉ số sinh hiệu trên Monitor, gán Mức độ Cấp cứu và Chỉ định Phác đồ Xử trí Cấp tốc:
        </p>

        {/* Clinical Guidelines Reference Box */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] pt-1">
          <div className="bg-[#000] text-[#ff4444] p-2 border border-[#ff4444]/60">
            🔴 <strong>RED (CẤP CỨU NGUY KỊCH):</strong> HR &gt; 130bpm hoặc SpO2 &lt; 90% ➔ Phác đồ: Thở Oxy cao áp 10L/phút & Lập đường truyền tĩnh mạch IV.
          </div>
          <div className="bg-[#000] text-[#ff00ff] p-2 border border-[#ff00ff]/60">
            🟡 <strong>YELLOW (ƯU TIÊN CẤP TỐC):</strong> Huyết áp cao &gt; 150mmHg ➔ Phác đồ: Dùng thuốc hạ huyết áp khẩn cấp & theo dõi liên tục.
          </div>
          <div className="bg-[#000] text-[#00ff41] p-2 border border-[#00ff41]/60">
            🟢 <strong>GREEN (KHÁM NGOẠI TRÚ):</strong> Sinh hiệu ổn định ➔ Phác đồ: Xử lý sát trùng vết thương, tư vấn kê đơn về nhà.
          </div>
        </div>
      </div>

      {/* Patient Tab Selector */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {taskData.patients.map((p, idx) => {
          const isSelected = idx === activePatientIdx;
          const assignedP = assignments[p.id];
          const assignedA = actions[p.id];
          const isDone = assignedP && assignedA;

          return (
            <button
              key={p.id}
              onClick={() => { playSound.click(settings.retroSound); setActivePatientIdx(idx); }}
              className={`px-3 py-2 text-xs font-bold uppercase border transition-all shrink-0 flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#00ff41] text-[#0c0c0c] border-white shadow-[0_0_15px_rgba(0,255,65,0.6)]'
                  : isDone
                  ? 'bg-[#000] text-[#00ff41] border-[#00ff41]'
                  : 'bg-[#111] text-[#00ff41]/60 border-[#00ff41]/30 hover:border-[#00ff41]'
              }`}
            >
              <Stethoscope className="w-3.5 h-3.5" />
              <span>CA #{idx + 1}: {p.name.split(' ')[0]}</span>
              {isDone && <CheckCircle2 className="w-3.5 h-3.5 text-[#00ff41]" />}
            </button>
          );
        })}
      </div>

      {/* Selected Patient Clinical Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left Column: Live ECG Monitor & Vitals */}
        <div className="bg-[#111] border border-[#00ff41]/60 p-4 space-y-3">
          <div className="flex items-center justify-between border-b border-[#00ff41]/40 pb-2">
            <span className="font-bold text-white text-xs uppercase flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#00ff41]" />
              ECG MONITOR TELEMETRY // {currentPatient.name}
            </span>
            <span className="text-[10px] text-[#ff00ff] font-bold">
              GCS SCORE: {currentPatient.gcs || (currentPatient.targetColor === 'RED' ? '9/15 (Lơ mơ)' : '15/15 (Tỉnh táo)')}
            </span>
          </div>

          {/* ECG Canvas Waveform */}
          <div className="relative bg-[#050505] border border-[#00ff41]/40 p-1">
            <canvas
              ref={canvasRef}
              width={480}
              height={120}
              className="w-full h-28 object-cover"
            />
            <div className="absolute top-2 right-2 bg-[#000]/80 px-2 py-1 border border-[#00ff41]/40 text-[9px] text-[#00ff41]">
              SWEEP: 25mm/s // LEAD II
            </div>
          </div>

          {/* Vital Signs Grid */}
          <div className="grid grid-cols-3 gap-2 text-center text-xs pt-1">
            <div className="bg-[#000] p-2.5 border border-[#00ff41]/40">
              <div className="text-[10px] opacity-70">NHỊP TIM (HR)</div>
              <div className={`text-base font-black ${currentPatient.hr > 130 ? 'text-[#ff4444] animate-pulse' : 'text-[#00ff41]'}`}>
                {currentPatient.hr} <span className="text-[10px]">bpm</span>
              </div>
            </div>

            <div className="bg-[#000] p-2.5 border border-[#00ff41]/40">
              <div className="text-[10px] opacity-70">HUYẾT ÁP (BP)</div>
              <div className="text-base font-black text-[#ff00ff]">
                {currentPatient.bp} <span className="text-[10px]">mmHg</span>
              </div>
            </div>

            <div className="bg-[#000] p-2.5 border border-[#00ff41]/40">
              <div className="text-[10px] opacity-70">OXY (SpO2)</div>
              <div className={`text-base font-black ${currentPatient.o2 < 90 ? 'text-[#ff4444] animate-pulse' : 'text-[#00ff41]'}`}>
                {currentPatient.o2}%
              </div>
            </div>
          </div>

          {/* Patient Complaint & Symptoms Notes */}
          <div className="bg-[#000] p-3 border border-[#ff00ff]/40 text-xs space-y-1">
            <div className="text-[10px] text-[#ff00ff] font-bold uppercase flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>TRIỆU CHỨNG KHÁM LÂM SÀNG BAN ĐẦU:</span>
            </div>
            <p className="text-white opacity-95 italic">
              "{currentPatient.complaint}"
            </p>
          </div>
        </div>

        {/* Right Column: Interactive Clinical Decision Making */}
        <div className="bg-[#111] border border-[#00ff41]/60 p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-bold text-[#00ff41] border-b border-[#00ff41]/40 pb-2 uppercase flex items-center justify-between">
              <span>ĐƯA RA QUYẾT ĐỊNH Y KHOA CA #{activePatientIdx + 1}</span>
              <span className="text-[10px] text-[#ff00ff]">BẮC BỘ Y TẾ STANDARD</span>
            </div>

            {/* Step 1: Assign Triage Priority */}
            <div className="space-y-2">
              <label className="text-[11px] font-bold text-white block uppercase">
                1. PHÂN LOẠI MỨC ĐỘ ƯU TIÊN CẤP CỨU:
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => handleAssignPriority(currentPatient.id, 'RED')}
                  className={`py-2 px-1 font-bold text-xs border uppercase transition-all flex flex-col items-center gap-1 ${
                    assignments[currentPatient.id] === 'RED'
                      ? 'bg-[#ff4444] text-[#0c0c0c] border-white shadow-[0_0_15px_rgba(255,68,68,0.8)]'
                      : 'bg-[#000] text-[#ff4444] border-[#ff4444]/60 hover:bg-[#ff4444]/20'
                  }`}
                >
                  <span className="text-sm">🔴 RED</span>
                  <span className="text-[9px]">Cấp cứu nguy kịch</span>
                </button>

                <button
                  onClick={() => handleAssignPriority(currentPatient.id, 'YELLOW')}
                  className={`py-2 px-1 font-bold text-xs border uppercase transition-all flex flex-col items-center gap-1 ${
                    assignments[currentPatient.id] === 'YELLOW'
                      ? 'bg-[#ff00ff] text-[#0c0c0c] border-white shadow-[0_0_15px_rgba(255,0,255,0.8)]'
                      : 'bg-[#000] text-[#ff00ff] border-[#ff00ff]/60 hover:bg-[#ff00ff]/20'
                  }`}
                >
                  <span className="text-sm">🟡 YELLOW</span>
                  <span className="text-[9px]">Ưu tiên cấp tốc</span>
                </button>

                <button
                  onClick={() => handleAssignPriority(currentPatient.id, 'GREEN')}
                  className={`py-2 px-1 font-bold text-xs border uppercase transition-all flex flex-col items-center gap-1 ${
                    assignments[currentPatient.id] === 'GREEN'
                      ? 'bg-[#00ff41] text-[#0c0c0c] border-white shadow-[0_0_15px_rgba(0,255,65,0.8)]'
                      : 'bg-[#000] text-[#00ff41] border-[#00ff41]/60 hover:bg-[#00ff41]/20'
                  }`}
                >
                  <span className="text-sm">🟢 GREEN</span>
                  <span className="text-[9px]">Khám nhẹ ngoại trú</span>
                </button>
              </div>
            </div>

            {/* Step 2: Assign Immediate First Aid Action Protocol */}
            <div className="space-y-2 pt-2">
              <label className="text-[11px] font-bold text-white block uppercase flex items-center gap-1.5">
                <Syringe className="w-3.5 h-3.5 text-[#ff00ff]" />
                <span>2. PHÁC ĐỒ XỬ TRÍ CẤP TỐC BAN ĐẦU:</span>
              </label>

              <div className="space-y-2">
                <button
                  onClick={() => handleAssignAction(currentPatient.id, 'oxygen_iv')}
                  className={`w-full p-2.5 text-left border text-xs font-mono transition-all ${
                    actions[currentPatient.id] === 'oxygen_iv'
                      ? 'bg-[#ff4444] text-[#0c0c0c] font-bold border-white shadow-[0_0_10px_rgba(255,68,68,0.5)]'
                      : 'bg-[#000] text-[#ff4444] border-[#ff4444]/40 hover:bg-[#ff4444]/10'
                  }`}
                >
                  <div className="font-bold uppercase">💉 PHÁC ĐỒ A: THỞ OXY CAO ÁP 10L/PHÚT + IV FLUID</div>
                  <div className="text-[10px] opacity-80 font-normal">Áp dụng ca suy hô hấp, SpO2 &lt; 90%, mạch nhanh nhỏ tụt áp.</div>
                </button>

                <button
                  onClick={() => handleAssignAction(currentPatient.id, 'antihypertensive')}
                  className={`w-full p-2.5 text-left border text-xs font-mono transition-all ${
                    actions[currentPatient.id] === 'antihypertensive'
                      ? 'bg-[#ff00ff] text-[#0c0c0c] font-bold border-white shadow-[0_0_10px_rgba(255,0,255,0.5)]'
                      : 'bg-[#000] text-[#ff00ff] border-[#ff00ff]/40 hover:bg-[#ff00ff]/10'
                  }`}
                >
                  <div className="font-bold uppercase">💊 PHÁC ĐỒ B: THUỐC HẠ HUYẾT ÁP KHẨN CẤP + MONITOR</div>
                  <div className="text-[10px] opacity-80 font-normal">Áp dụng ca cơn tăng huyết áp &gt; 150mmHg, đau đầu chóng mặt.</div>
                </button>

                <button
                  onClick={() => handleAssignAction(currentPatient.id, 'outpatient_care')}
                  className={`w-full p-2.5 text-left border text-xs font-mono transition-all ${
                    actions[currentPatient.id] === 'outpatient_care'
                      ? 'bg-[#00ff41] text-[#0c0c0c] font-bold border-white shadow-[0_0_10px_rgba(0,255,65,0.5)]'
                      : 'bg-[#000] text-[#00ff41] border-[#00ff41]/40 hover:bg-[#00ff41]/10'
                  }`}
                >
                  <div className="font-bold uppercase">🩹 PHÁC ĐỒ C: SÁT TRÙNG BĂNG BÓ & ĐƠN THUỐC NGOẠI TRÚ</div>
                  <div className="text-[10px] opacity-80 font-normal">Áp dụng ca chấn thương nhẹ, trầy xước, sinh hiệu hoàn toàn bình thường.</div>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-center text-[#ff00ff] italic">
            Chuyển qua lại giữa các ca bệnh bằng thanh tab phía trên để hoàn tất cả {taskData.patients.length} bệnh nhân.
          </div>
        </div>
      </div>

      {/* Verification Submit Button */}
      <button
        disabled={!allReady}
        onClick={handleVerifyTriage}
        className="w-full py-3 bg-[#00ff41] text-[#0c0c0c] font-black text-xs uppercase flex items-center justify-center gap-2 border-2 border-white hover:bg-[#00e53a] disabled:opacity-40 shadow-[0_0_20px_rgba(0,255,65,0.6)] cursor-pointer transition-all active:scale-[0.99]"
      >
        <ShieldAlert className="w-4 h-4" />
        <span>XÁC NHẬN BỆNH ÁN & CHẤM ĐIỂM BÁC SĨ CẤP CỨU</span>
      </button>

      {/* Evaluation Feedback Section */}
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
