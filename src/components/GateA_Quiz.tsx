import React, { useState } from 'react';
import { UserProgress, HollandTrait, Settings } from '../types';
import { getShuffledQuestions, HOLLAND_TRAIT_NAMES } from '../data/hollandQuestions';
import { calculateHollandCode, calculateRadarFromScores } from '../utils/storage';
import { CAREER_LIST } from '../data/careerData';
import { playSound } from '../utils/audio';
import { Compass, CheckCircle, ArrowRight, Sparkles, Award } from 'lucide-react';

interface Props {
  progress: UserProgress;
  settings: Settings;
  onUpdateProgress: (p: UserProgress) => void;
  onSelectCareerToStart: (careerId: string) => void;
  onGoToCityMap: () => void;
}

export const GateA_Quiz: React.FC<Props> = ({
  progress,
  settings,
  onUpdateProgress,
  onSelectCareerToStart,
  onGoToCityMap
}) => {
  const [questions] = useState(getShuffledQuestions());
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>(progress.quizAnswers || {});

  const currentQ = questions[currentIndex];
  const totalQ = questions.length;

  const handleSelectOption = (value: number) => {
    playSound.click(settings.retroSound);
    const newAnswers = { ...answers, [currentQ.id]: value };
    setAnswers(newAnswers);

    const newScores: Record<HollandTrait, number> = { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 };
    questions.forEach(q => {
      const val = newAnswers[q.id];
      if (val !== undefined) {
        newScores[q.category] = (newScores[q.category] || 0) + val;
      }
    });

    const isComplete = Object.keys(newAnswers).length === totalQ;
    const hollandCode = calculateHollandCode(newScores);
    const updatedRadar = calculateRadarFromScores(newScores, progress.weeklyResults);

    const updatedProgress: UserProgress = {
      ...progress,
      quizAnswers: newAnswers,
      quizScores: newScores,
      hollandCode,
      quizCompleted: isComplete,
      radarTraits: updatedRadar
    };

    onUpdateProgress(updatedProgress);

    if (currentIndex < totalQ - 1) {
      setCurrentIndex(prev => prev + 1);
    }
  };

  const optionLabels = [
    { value: 0, label: '0 - RẤT KHÔNG THÍCH' },
    { value: 1, label: '1 - KHÔNG THÍCH' },
    { value: 2, label: '2 - BÌNH THƯỜNG' },
    { value: 3, label: '3 - THÍCH' },
    { value: 4, label: '4 - RẤT THÍCH' }
  ];

  const recommendedCareers = CAREER_LIST.filter(c => {
    const code = progress.hollandCode;
    if (code.includes('I') && code.includes('C')) return c.id === 'edtech';
    if (code.includes('I') && code.includes('S')) return c.id === 'healthcare';
    if (code.includes('S') && code.includes('A')) return c.id === 'education';
    if (code.includes('A') && code.includes('S')) return c.id === 'humanities';
    if (code.includes('I') && code.includes('R')) return c.id === 'science';
    return false;
  });

  const finalRecommendations = recommendedCareers.length > 0 ? recommendedCareers : [CAREER_LIST[0], CAREER_LIST[1]];

  return (
    <div className="max-w-5xl mx-auto space-y-6 font-mono text-[#00ff41] select-none">
      {/* Header Banner */}
      <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-[#00ff41]" />
            <h2 className="text-lg sm:text-xl font-bold uppercase tracking-wide">
              CỔNG A: TRẮC NGHIỆM HOLLAND (60 CÂU O*NET)
            </h2>
          </div>
          <p className="text-xs text-[#00ff41] opacity-80 mt-1 leading-relaxed">
            Bộ câu hỏi O*NET Interest Profiler Short Form của Bộ Lao động Hoa Kỳ (Thang 0-4). Đánh giá 6 nhóm sở thích RIASEC chuẩn mực.
          </p>
        </div>

        <div className="bg-[#111] px-4 py-2 border border-[#00ff41] text-right">
          <div className="text-[10px] opacity-70">MÃ HOLLAND HIỆN TẠI</div>
          <div className="text-2xl font-bold text-[#ff00ff] tracking-wider">
            {progress.hollandCode || '---'}
          </div>
        </div>
      </div>

      {/* Main Assessment & Live Scores Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Question Card */}
        <div className="lg:col-span-2 space-y-4">
          <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-6 shadow-lg relative">
            {/* Step Progress Bar */}
            <div className="flex items-center justify-between text-xs text-[#00ff41] opacity-80 mb-2">
              <span>CÂU HỎI {currentIndex + 1} / {totalQ}</span>
              <span className="font-bold">
                ĐÃ TRẢ LỜI {Object.keys(answers).length}/{totalQ}
              </span>
            </div>

            <div className="w-full bg-[#111] h-2 mb-6 border border-[#00ff41]/50">
              <div 
                className="bg-[#00ff41] h-full transition-all duration-300"
                style={{ width: `${((currentIndex + 1) / totalQ) * 100}%` }}
              />
            </div>

            {/* Question Text */}
            <div className="min-h-[120px] flex flex-col justify-center bg-[#111] p-5 border border-[#00ff41]/60 mb-6">
              <div className="inline-block bg-[#00ff41] text-[#0c0c0c] text-[10px] font-bold px-2 py-0.5 uppercase w-max mb-2">
                NHÓM: {currentQ.categoryLabel} ({HOLLAND_TRAIT_NAMES[currentQ.category].name})
              </div>
              <h3 className="text-base sm:text-lg font-bold text-[#00ff41] leading-relaxed">
                "{currentQ.text}"
              </h3>
            </div>

            {/* Answer Options (0 to 4) */}
            <div className="space-y-2">
              <div className="text-xs opacity-70 mb-1 uppercase">CHỌN MỨC ĐỘ YÊU THÍCH CỦA BẠN:</div>
              {optionLabels.map((opt) => {
                const isSelected = answers[currentQ.id] === opt.value;
                return (
                  <button
                    key={opt.value}
                    onClick={() => handleSelectOption(opt.value)}
                    className={`w-full p-3 border-2 text-left text-xs font-bold transition-all flex items-center justify-between uppercase ${
                      isSelected 
                        ? 'bg-[#00ff41] text-[#0c0c0c] border-[#00ff41]' 
                        : 'bg-[#111] text-[#00ff41] border-[#00ff41]/40 hover:bg-[#1a1a1a]'
                    }`}
                  >
                    <span>{opt.label}</span>
                    {isSelected && <CheckCircle className="w-4 h-4 text-[#0c0c0c]" />}
                  </button>
                );
              })}
            </div>

            {/* Prev / Next Controls */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-[#00ff41]/30 text-xs">
              <button
                disabled={currentIndex === 0}
                onClick={() => { playSound.click(settings.retroSound); setCurrentIndex(p => Math.max(0, p - 1)); }}
                className="px-3 py-1.5 border border-[#00ff41] text-[#00ff41] disabled:opacity-40 hover:bg-[#00ff41] hover:text-[#0c0c0c] font-bold uppercase"
              >
                ← CÂU TRƯỚC
              </button>

              <button
                disabled={currentIndex === totalQ - 1}
                onClick={() => { playSound.click(settings.retroSound); setCurrentIndex(p => Math.min(totalQ - 1, p + 1)); }}
                className="px-3 py-1.5 border border-[#00ff41] text-[#00ff41] disabled:opacity-40 hover:bg-[#00ff41] hover:text-[#0c0c0c] font-bold uppercase"
              >
                CÂU TIẾP THEO →
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Live RIASEC Breakdown & Recommendations */}
        <div className="space-y-4">
          <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-5 shadow-lg space-y-4">
            <h4 className="font-bold text-xs uppercase tracking-wider flex items-center gap-2 text-[#00ff41]">
              <Sparkles className="w-4 h-4 text-[#ff00ff]" />
              ĐIỂM SỞ THÍCH HOLLAND (0-40)
            </h4>

            <div className="space-y-3 text-xs">
              {(Object.keys(HOLLAND_TRAIT_NAMES) as HollandTrait[]).map((trait) => {
                const info = HOLLAND_TRAIT_NAMES[trait];
                const score = progress.quizScores[trait] || 0;
                const percentage = (score / 40) * 100;

                return (
                  <div key={trait} className="space-y-1">
                    <div className="flex justify-between items-center text-[#00ff41]">
                      <span className="font-bold">
                        {trait} - {info.name.split(' ')[0]}
                      </span>
                      <span className="font-bold">{score}/40Đ</span>
                    </div>
                    <div className="w-full bg-[#111] h-2 border border-[#00ff41]/40">
                      <div 
                        className="h-full bg-[#00ff41] transition-all duration-300"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Career Recommendations Section */}
          <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-5 shadow-lg space-y-3">
            <div className="flex items-center gap-2 text-[#ff00ff] font-bold text-xs uppercase">
              <Award className="w-4 h-4" />
              <span>GỢI Ý NGÀNH TRẢI NGHIỆM</span>
            </div>

            <p className="text-xs text-[#00ff41] opacity-80 leading-relaxed">
              Dựa trên mã Holland <strong className="text-[#ff00ff]">{progress.hollandCode}</strong>, bạn có xu hướng phù hợp nhất với:
            </p>

            <div className="space-y-2">
              {finalRecommendations.map((career) => (
                <div key={career.id} className="bg-[#111] p-3 border border-[#00ff41]/50 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-xs uppercase text-[#00ff41]">{career.name}</span>
                    <span className="text-[10px] bg-[#00ff41] text-[#0c0c0c] px-1.5 py-0.5 font-bold">
                      MÃ {career.hollandCode}
                    </span>
                  </div>
                  <p className="text-[11px] opacity-80 leading-tight">{career.description}</p>
                  <button
                    onClick={() => { playSound.click(settings.retroSound); onSelectCareerToStart(career.id); }}
                    className="w-full mt-1 py-1.5 bg-[#00ff41] text-[#0c0c0c] font-bold text-xs uppercase flex items-center justify-center gap-1.5 hover:bg-[#00e53a] border border-[#00ff41]"
                  >
                    <span>VÀO THỰC TẬP 8 TUẦN</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={() => { playSound.click(settings.retroSound); onGoToCityMap(); }}
              className="w-full py-2 bg-[#111] text-[#00ff41] border border-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c] font-bold text-xs uppercase flex items-center justify-center gap-1.5 mt-2 transition-colors"
            >
              <span>XEM BẢN ĐỒ TỰ CHỌN 5 NGÀNH</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
