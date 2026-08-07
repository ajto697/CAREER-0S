import React, { useState, useEffect, useRef } from 'react';
import { TaskEvaluationResult, Settings } from '../../types';
import { playSound } from '../../utils/audio';
import { FlaskConical, Zap, CheckCircle2, XCircle, ShieldAlert, Thermometer, TestTube, Sparkles } from 'lucide-react';

interface LabParam {
  name: string;
  min: number;
  max: number;
  step: number;
  optimal: number;
}

interface Props {
  taskData: {
    title: string;
    storyContext: string;
    targetMinYield: number;
    targetMaxYield: number;
    paramA: LabParam;
    paramB: LabParam;
  };
  settings: Settings;
  onEvaluateResult: (res: TaskEvaluationResult) => void;
}

export const LabExperimentTool: React.FC<Props> = ({ taskData, settings, onEvaluateResult }) => {
  const [valA, setValA] = useState<number>(taskData.paramA.min);
  const [valB, setValB] = useState<number>(taskData.paramB.min);
  const [catalyst, setCatalyst] = useState<'enzyme' | 'platinum' | 'buffer'>('enzyme');
  const [safetyChecked, setSafetyChecked] = useState<{ ppe: boolean; fumeHood: boolean }>({ ppe: true, fumeHood: true });
  const [evalResult, setEvalResult] = useState<TaskEvaluationResult | null>(null);
  const [isReacting, setIsReacting] = useState<boolean>(false);
  const [reactionBubbles, setReactionBubbles] = useState<Array<{ id: number; x: number; y: number; size: number }>>([]);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Animated Reaction Flask Visualizer
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

      // Background lab grid
      ctx.fillStyle = '#050505';
      ctx.fillRect(0, 0, w, h);

      // Calculate Reaction Color based on proximity to optimal values
      const diffA = Math.abs(valA - taskData.paramA.optimal) / (taskData.paramA.max - taskData.paramA.min);
      const diffB = Math.abs(valB - taskData.paramB.optimal) / (taskData.paramB.max - taskData.paramB.min);
      const proximity = 1 - Math.min(1, (diffA + diffB) / 2);

      // Liquid Fill level
      const liquidHeight = Math.min(h * 0.7, (valA / taskData.paramA.max) * h * 0.6 + h * 0.2);
      const liquidTop = h - liquidHeight;

      // Draw Erlenmeyer Flask Outline
      ctx.beginPath();
      ctx.strokeStyle = '#00ff41';
      ctx.lineWidth = 3;
      ctx.moveTo(w * 0.4, h * 0.1);
      ctx.lineTo(w * 0.6, h * 0.1);
      ctx.lineTo(w * 0.6, h * 0.35);
      ctx.lineTo(w * 0.85, h * 0.9);
      ctx.lineTo(w * 0.15, h * 0.9);
      ctx.lineTo(w * 0.4, h * 0.35);
      ctx.closePath();
      ctx.stroke();

      // Liquid Gradient
      const liquidGrad = ctx.createLinearGradient(0, liquidTop, 0, h);
      if (proximity > 0.8) {
        liquidGrad.addColorStop(0, 'rgba(0, 255, 65, 0.85)'); // Pure Emerald Green
        liquidGrad.addColorStop(1, 'rgba(0, 200, 50, 0.95)');
      } else if (proximity > 0.5) {
        liquidGrad.addColorStop(0, 'rgba(255, 0, 255, 0.8)'); // High reaction Purple
        liquidGrad.addColorStop(1, 'rgba(180, 0, 255, 0.9)');
      } else {
        liquidGrad.addColorStop(0, 'rgba(0, 180, 255, 0.6)'); // Cold Blue
        liquidGrad.addColorStop(1, 'rgba(0, 100, 200, 0.8)');
      }

      // Draw Liquid Fill
      ctx.save();
      ctx.clip(); // Clip inside flask
      ctx.fillStyle = liquidGrad;

      // Wave top surface
      ctx.beginPath();
      ctx.moveTo(0, liquidTop);
      for (let x = 0; x <= w; x += 10) {
        const waveY = liquidTop + Math.sin((x / 20) + (frame / 10)) * (isReacting ? 6 : 2);
        ctx.lineTo(x, waveY);
      }
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fill();

      // Animated Bubbles during reaction
      if (isReacting || proximity > 0.7) {
        const bubbleCount = isReacting ? 12 : 5;
        for (let i = 0; i < bubbleCount; i++) {
          const bx = w * 0.25 + (Math.sin(i * 99 + frame / 10) * 0.25 + 0.25) * w * 0.5;
          const by = h * 0.9 - ((frame * (2 + i) + i * 40) % (liquidHeight - 10));
          const size = 2 + (i % 4);

          ctx.beginPath();
          ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.arc(bx, by, size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.restore();

      animId = requestAnimationFrame(renderLabFlask);
    };

    renderLabFlask();

    return () => {
      cancelAnimationFrame(animId);
    };
  }, [valA, valB, catalyst, isReacting, taskData]);

  const handleRunReaction = () => {
    playSound.click(settings.retroSound);
    setIsReacting(true);

    setTimeout(() => {
      setIsReacting(false);

      const diffA = Math.abs(valA - taskData.paramA.optimal) / (taskData.paramA.max - taskData.paramA.min);
      const diffB = Math.abs(valB - taskData.paramB.optimal) / (taskData.paramB.max - taskData.paramB.min);

      let penalty = (diffA * 45) + (diffB * 45);

      // Catalyst bonus
      if (catalyst === 'enzyme') penalty *= 0.85; // Best selectivity
      if (!safetyChecked.ppe || !safetyChecked.fumeHood) penalty += 15;

      const calculatedYield = Math.max(10, Math.min(100, Math.round(100 - penalty)));
      const isPassed = calculatedYield >= taskData.targetMinYield;

      const details: string[] = [
        `🧪 Hiệu suất tổng hợp tinh khiết: ${calculatedYield}% (Mục tiêu chuẩn ISO: ≥${taskData.targetMinYield}%)`,
        `• Thông số 1 (${taskData.paramA.name}): ${valA} (Giá trị tối ưu chuẩn: ${taskData.paramA.optimal})`,
        `• Thông số 2 (${taskData.paramB.name}): ${valB} (Giá trị tối ưu chuẩn: ${taskData.paramB.optimal})`,
        `• Chất xúc tác sinh học: ${catalyst === 'enzyme' ? 'Enzim Biocatalyst (Chuẩn hóa)' : catalyst === 'platinum' ? 'Bột Bạch Kim Pt' : 'Dung dịch Đệm Buffer pH'}`,
        `• An toàn Phòng Lab: Trang bị bảo hộ PPE (${safetyChecked.ppe ? 'ĐẠT' : 'THIẾU'}) | Tủ hút Fume Hood (${safetyChecked.fumeHood ? 'ĐẠT' : 'THIẾU'})`
      ];

      const result: TaskEvaluationResult = {
        passed: isPassed,
        score: calculatedYield,
        feedback: isPassed
          ? `Thí nghiệm thành công rực rỡ! Sản phẩm tổng hợp đạt độ tinh khiết ${calculatedYield}% và tuân thủ tuyệt đối quy trình an toàn phòng lab.`
          : `Hiệu suất tổng hợp chỉ đạt ${calculatedYield}%. Hãy điều chỉnh 2 thông số phòng lab về sát giá trị tối ưu và chọn chất xúc tác phù hợp.`,
        details
      };

      setEvalResult(result);
      if (isPassed) playSound.pass(settings.retroSound);
      else playSound.fail(settings.retroSound);

      onEvaluateResult(result);
    }, 800);
  };

  return (
    <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-4 space-y-4 font-mono text-[#00ff41] select-none">
      {/* Header */}
      <div className="bg-[#111] p-3.5 border border-[#00ff41]/50 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black uppercase text-[#00ff41]">
            <FlaskConical className="w-5 h-5 text-[#ff00ff]" />
            <span>MÔ PHỎNG PHÒNG THÍ NGHIỆM HÓA - SINH HỌC TỔNG HỢP (ISO LAB)</span>
          </div>
          <span className="px-2 py-0.5 bg-[#000] border border-[#00ff41] text-[#00ff41] text-[10px] font-black uppercase">
            HIỆU SUẤT MỤC TIÊU: ≥{taskData.targetMinYield}%
          </span>
        </div>
        <p className="opacity-90 text-xs">
          Điều chỉnh nồng độ phản ứng, chọn chất xúc tác tối ưu và tuân thủ quy tắc an toàn bảo hộ phòng lab để thu hoạch hợp chất chuẩn.
        </p>
      </div>

      {/* Main Lab Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Left: Flask Canvas Visualizer & Safety Checks */}
        <div className="bg-[#111] border border-[#00ff41]/60 p-4 space-y-3 flex flex-col justify-between">
          <div className="space-y-2">
            <div className="text-xs font-bold text-white uppercase border-b border-[#00ff41]/40 pb-2 flex items-center justify-between">
              <span>BÌNH PHẢN ỨNG ERLENMEYER REAL-TIME</span>
              <span className="text-[10px] text-[#ff00ff]">QUANG PHỔ HÓA HỌC</span>
            </div>

            {/* Flask Canvas */}
            <div className="relative bg-[#050505] border border-[#00ff41]/40 p-1 flex justify-center">
              <canvas
                ref={canvasRef}
                width={320}
                height={200}
                className="w-full h-44 object-contain"
              />
              <div className="absolute top-2 right-2 bg-[#000]/80 px-2 py-1 border border-[#00ff41]/40 text-[9px] text-[#00ff41]">
                Nhiệt độ dung dịch: {valB}°C
              </div>
            </div>
          </div>

          {/* Safety PPE Controls */}
          <div className="bg-[#000] p-3 border border-[#ff00ff]/40 space-y-2 text-xs">
            <div className="text-[10px] text-[#ff00ff] font-bold uppercase flex items-center gap-1.5">
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>DANH MỤC AN TOÀN PHÒNG LAB (PPE COMPLIANCE):</span>
            </div>

            <div className="grid grid-cols-2 gap-2 text-[11px]">
              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={safetyChecked.ppe}
                  onChange={(e) => setSafetyChecked(prev => ({ ...prev, ppe: e.target.checked }))}
                  className="accent-[#00ff41]"
                />
                <span>Kính & Găng tay Nitrile</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer hover:text-white">
                <input
                  type="checkbox"
                  checked={safetyChecked.fumeHood}
                  onChange={(e) => setSafetyChecked(prev => ({ ...prev, fumeHood: e.target.checked }))}
                  className="accent-[#00ff41]"
                />
                <span>Bật Tủ hút khí Fume Hood</span>
              </label>
            </div>
          </div>
        </div>

        {/* Right: Sliders & Catalyst Controls */}
        <div className="bg-[#111] border border-[#00ff41]/60 p-4 space-y-4 flex flex-col justify-between">
          <div className="space-y-4">
            <div className="text-xs font-bold text-[#00ff41] border-b border-[#00ff41]/40 pb-2 uppercase flex items-center justify-between">
              <span>ĐIỀU CHỈNH THÔNG SỐ ĐỘNG HỌC PHẢN ỨNG</span>
              <span className="text-[10px] text-[#ff00ff]">PRECISION CONTROLS</span>
            </div>

            {/* Slider 1 */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white uppercase">{taskData.paramA.name}:</span>
                <span className="font-black text-[#00ff41] bg-[#000] px-2.5 py-0.5 border border-[#00ff41]/50">
                  {valA}
                </span>
              </div>
              <input
                type="range"
                min={taskData.paramA.min}
                max={taskData.paramA.max}
                step={taskData.paramA.step}
                value={valA}
                onChange={(e) => setValA(parseFloat(e.target.value))}
                className="w-full accent-[#00ff41] bg-[#000] h-2.5 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] opacity-60">
                <span>Tối thiểu: {taskData.paramA.min}</span>
                <span>Tối đa: {taskData.paramA.max}</span>
              </div>
            </div>

            {/* Slider 2 */}
            <div className="space-y-1.5 pt-1">
              <div className="flex justify-between items-center text-xs">
                <span className="font-bold text-white uppercase">{taskData.paramB.name}:</span>
                <span className="font-black text-[#ff00ff] bg-[#000] px-2.5 py-0.5 border border-[#ff00ff]/50">
                  {valB}
                </span>
              </div>
              <input
                type="range"
                min={taskData.paramB.min}
                max={taskData.paramB.max}
                step={taskData.paramB.step}
                value={valB}
                onChange={(e) => setValB(parseFloat(e.target.value))}
                className="w-full accent-[#ff00ff] bg-[#000] h-2.5 cursor-pointer"
              />
              <div className="flex justify-between text-[9px] opacity-60">
                <span>Tối thiểu: {taskData.paramB.min}</span>
                <span>Tối đa: {taskData.paramB.max}</span>
              </div>
            </div>

            {/* Catalyst Selection */}
            <div className="space-y-1.5 pt-2">
              <label className="text-[11px] font-bold text-white block uppercase flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#ff00ff]" />
                <span>CHỌN CHẤT XÚC TÁC / DUNG DỊCH ĐỆM:</span>
              </label>

              <div className="grid grid-cols-3 gap-2 text-xs">
                <button
                  onClick={() => { playSound.click(settings.retroSound); setCatalyst('enzyme'); }}
                  className={`py-2 px-1 font-bold border text-center uppercase transition-all ${
                    catalyst === 'enzyme'
                      ? 'bg-[#00ff41] text-[#0c0c0c] border-white shadow-[0_0_10px_rgba(0,255,65,0.6)]'
                      : 'bg-[#000] text-[#00ff41] border-[#00ff41]/40 hover:border-[#00ff41]'
                  }`}
                >
                  <div className="text-[11px]">Enzim Sinh Học</div>
                  <div className="text-[9px] opacity-80">(Tối ưu 100%)</div>
                </button>

                <button
                  onClick={() => { playSound.click(settings.retroSound); setCatalyst('platinum'); }}
                  className={`py-2 px-1 font-bold border text-center uppercase transition-all ${
                    catalyst === 'platinum'
                      ? 'bg-[#ff00ff] text-[#0c0c0c] border-white shadow-[0_0_10px_rgba(255,0,255,0.6)]'
                      : 'bg-[#000] text-[#ff00ff] border-[#ff00ff]/40 hover:border-[#ff00ff]'
                  }`}
                >
                  <div className="text-[11px]">Bột Bạch Kim</div>
                  <div className="text-[9px] opacity-80">(Xúc tác kim loại)</div>
                </button>

                <button
                  onClick={() => { playSound.click(settings.retroSound); setCatalyst('buffer'); }}
                  className={`py-2 px-1 font-bold border text-center uppercase transition-all ${
                    catalyst === 'buffer'
                      ? 'bg-white text-[#0c0c0c] border-white shadow'
                      : 'bg-[#000] text-white border-white/40 hover:border-white'
                  }`}
                >
                  <div className="text-[11px]">Đệm pH Buffer</div>
                  <div className="text-[9px] opacity-80">(Cân bằng môi trường)</div>
                </button>
              </div>
            </div>
          </div>

          <div className="pt-2 text-[10px] text-center text-[#00ff41] opacity-80 italic">
            Mẹo phòng lab: Đưa cả 2 thanh trượt về sát giá trị tối ưu để thu được dung dịch tinh khiết cao nhất.
          </div>
        </div>
      </div>

      {/* Run Reaction Button */}
      <button
        disabled={isReacting}
        onClick={handleRunReaction}
        className="w-full py-3 bg-[#00ff41] text-[#0c0c0c] font-black text-xs uppercase flex items-center justify-center gap-2 border-2 border-white hover:bg-[#00e53a] disabled:opacity-40 shadow-[0_0_20px_rgba(0,255,65,0.6)] cursor-pointer transition-all active:scale-[0.99]"
      >
        <Zap className={`w-4 h-4 ${isReacting ? 'animate-spin text-[#ff00ff]' : ''}`} />
        <span>{isReacting ? 'ĐANG KÍCH HOẠT PHẢN ỨNG HÓA - SINH...' : 'KÍCH HOẠT PHẢN ỨNG & ĐO HIỆU SUẤT TINH KHÁO'}</span>
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
