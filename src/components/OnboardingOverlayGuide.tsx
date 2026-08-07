import React, { useState } from 'react';
import { Settings } from '../types';
import { playSound } from '../utils/audio';
import { Sparkles, ArrowRight, ArrowLeft, Check, HelpCircle, Terminal, Play, Cpu, ShieldCheck } from 'lucide-react';

interface Props {
  settings: Settings;
  onClose: () => void;
}

export const OnboardingOverlayGuide: React.FC<Props> = ({ settings, onClose }) => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const steps = [
    {
      targetId: 'guide-step-story',
      title: '1. BỐI CẢNH & YÊU CẦU NHIỆM VỤ',
      badge: 'NHẬN TASK MỖI TUẦN',
      icon: Terminal,
      description: 'Mỗi tuần thực tập, bạn sẽ nhận được một nhiệm vụ thực tế mô phỏng môi trường làm việc thực sự. Hãy đọc kỹ bối cảnh công việc và các tình huống đạo đức nghề nghiệp trước khi bắt tay vào làm.',
      tip: 'Mẹo: Bối cảnh sẽ gợi ý những quy tắc và tiêu chuẩn cần đạt được!'
    },
    {
      targetId: 'guide-step-tool',
      title: '2. KHU VỰC THỰC HÀNH & MÔ PHỎNG',
      badge: 'WORKSPACE INTERACTIVE',
      icon: Cpu,
      description: 'Đây là công cụ làm việc thực chiến của từng ngành! Tùy theo ngành học, bạn sẽ thao tác trực tiếp với Code Editor, Trạm phân loại y tế Triage, Trình soạn giáo án, Công cụ kiểm chứng tin tức, hoặc Trình thí nghiệm phòng Lab.',
      tip: 'Bạn có thể thử nghiệm lại nhiều lần cho tới khi đạt điểm tối đa!'
    },
    {
      targetId: 'guide-step-tool',
      title: '3. CHẠY THỬ & ĐÁNH GIÁ TỰ ĐỘNG',
      badge: 'CHẤM ĐIỂM SỨC NGHỀ',
      icon: Play,
      description: 'Sau khi hoàn thành giải pháp, bấm nút CHẠY MÔ PHỎNG hoặc CHẠY TEST CASE. Hệ thống AI sẽ tự động chấm điểm bài làm, xuất thông báo kết quả và phản hồi ngay lập tức.',
      tip: 'Khi đạt tiêu chuẩn PASSED, bạn sẽ nhận được phần thưởng thuộc tính chỉ số nghề nghiệp!'
    },
    {
      targetId: 'guide-step-radar',
      title: '4. NHẬT KÝ PHẢN TƯ & SƠ ĐỒ NĂNG LỰC',
      badge: 'RADAR SKILL VERIFIED',
      icon: Sparkles,
      description: 'Ghi lại bài học kinh nghiệm vào Nhật ký Phản tư để nhận thêm điểm SP. Tất cả điểm số từ các tuần thực tập sẽ được cập nhật trực tiếp lên Sơ đồ Radar Năng lực 6 trục!',
      tip: 'Hoàn thành đủ 8 tuần để nhận Chứng Chỉ Tốt Nghiệp Thực Tập!'
    }
  ];

  const step = steps[currentStep];
  const StepIcon = step.icon;

  const handleNext = () => {
    playSound.click(settings.retroSound);
    if (currentStep < steps.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      playSound.pass(settings.retroSound);
      onClose();
    }
  };

  const handlePrev = () => {
    playSound.click(settings.retroSound);
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-mono">
      {/* Background Animated Matrix Grid lines effect */}
      <div className="absolute inset-0 bg-[radial-gradient(#00ff41_1px,transparent_1px)] [background-size:24px_24px] opacity-10 pointer-events-none"></div>

      {/* Center Modal Dialog Card */}
      <div className="relative w-full max-w-xl bg-[#0c0c0c] border-2 border-[#00ff41] p-6 shadow-[0_0_40px_rgba(0,255,65,0.4)] text-[#00ff41] space-y-6">
        {/* Decorative corner accents */}
        <div className="absolute -top-1 -left-1 w-3 h-3 bg-[#00ff41]"></div>
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-[#00ff41]"></div>
        <div className="absolute -bottom-1 -left-1 w-3 h-3 bg-[#00ff41]"></div>
        <div className="absolute -bottom-1 -right-1 w-3 h-3 bg-[#00ff41]"></div>

        {/* Modal Header */}
        <div className="flex items-center justify-between border-b-2 border-[#00ff41]/40 pb-3">
          <div className="flex items-center gap-2">
            <span className="p-1.5 bg-[#000] border border-[#00ff41] text-[#ff00ff]">
              <HelpCircle className="w-5 h-5" />
            </span>
            <div>
              <div className="text-[10px] text-[#ff00ff] font-bold uppercase tracking-wider">
                SYSTEM TUTORIAL // HƯỚNG DẪN THỰC TẬP TUẦN 1
              </div>
              <h3 className="text-base font-black text-white uppercase">
                {step.title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => { playSound.click(settings.retroSound); onClose(); }}
            className="text-xs px-2 py-1 bg-[#000] border border-[#00ff41]/60 text-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c] transition-colors"
          >
            ĐÓNG [ESC]
          </button>
        </div>

        {/* Step Progress Tracker Badges */}
        <div className="flex items-center justify-between gap-2">
          {steps.map((s, idx) => (
            <button
              key={idx}
              onClick={() => { playSound.click(settings.retroSound); setCurrentStep(idx); }}
              className={`flex-1 py-1.5 text-center text-[10px] font-bold uppercase border transition-all ${
                idx === currentStep
                  ? 'bg-[#00ff41] text-[#0c0c0c] border-white shadow-[0_0_10px_rgba(0,255,65,0.6)]'
                  : idx < currentStep
                  ? 'bg-[#000] text-[#00ff41] border-[#00ff41]'
                  : 'bg-[#000] text-[#00ff41]/40 border-[#00ff41]/20'
              }`}
            >
              BƯỚC {idx + 1}
            </button>
          ))}
        </div>

        {/* Step Content Card */}
        <div className="bg-[#111] p-4 border border-[#00ff41]/60 space-y-3 relative overflow-hidden">
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-bold bg-[#ff00ff] text-[#0c0c0c] px-2 py-0.5 uppercase">
              {step.badge}
            </span>
            <span className="text-xs font-bold text-[#00ff41]">
              {currentStep + 1} / {steps.length}
            </span>
          </div>

          <div className="flex items-start gap-3 pt-1">
            <div className="p-2.5 bg-[#000] border border-[#00ff41] text-[#00ff41] shrink-0 mt-0.5">
              <StepIcon className="w-6 h-6" />
            </div>

            <div className="space-y-2">
              <p className="text-xs sm:text-sm text-white opacity-95 leading-relaxed">
                {step.description}
              </p>

              <div className="p-2.5 bg-[#000] border border-[#ff00ff]/50 text-xs text-[#ff00ff] flex items-center gap-2">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span className="text-[11px] leading-snug">{step.tip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer Navigation Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-[#00ff41]/30">
          <button
            disabled={currentStep === 0}
            onClick={handlePrev}
            className="px-4 py-2 bg-[#000] border border-[#00ff41] text-[#00ff41] text-xs font-bold uppercase flex items-center gap-1.5 hover:bg-[#00ff41]/20 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>QUAY LẠI</span>
          </button>

          <button
            onClick={handleNext}
            className="px-5 py-2.5 bg-[#00ff41] text-[#0c0c0c] text-xs font-black uppercase flex items-center gap-2 border-2 border-white hover:bg-[#00e53a] shadow-[0_0_15px_rgba(0,255,65,0.5)] transition-all active:scale-[0.98]"
          >
            <span>{currentStep === steps.length - 1 ? 'BẮT ĐẦU THỰC TẬP NGAY' : 'TIẾP THEO'}</span>
            {currentStep === steps.length - 1 ? <Check className="w-4 h-4" /> : <ArrowRight className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
};
