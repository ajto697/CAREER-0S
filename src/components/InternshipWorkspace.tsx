import React, { useState } from 'react';
import { UserProgress, CareerId, WeeklyResult, Settings, TaskEvaluationResult, TeacherState } from '../types';
import { getCareerById } from '../data/careerData';
import { getTaskForCareerAndWeek } from '../data/careerTasks';
import { calculateRadarFromScores } from '../utils/storage';
import { playSound } from '../utils/audio';

import { CodeEditorTool } from './tools/CodeEditorTool';
import { TriageStationTool } from './tools/TriageStationTool';
import { LessonPlannerTool } from './tools/LessonPlannerTool';
import { FactCheckerTool } from './tools/FactCheckerTool';
import { LabExperimentTool } from './tools/LabExperimentTool';
import { RadarChartCanvas } from './RadarChartCanvas';
import { OnboardingOverlayGuide } from './OnboardingOverlayGuide';
import { SituationAnimator } from './SituationAnimator';

import { ArrowRight, ArrowLeft, Sparkles, PenTool, ShieldCheck, HelpCircle, Tv, CheckCircle2, Activity, GitBranch, UserCheck, Heart, Award, Shield } from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  progress: UserProgress;
  settings: Settings;
  onUpdateProgress: (p: UserProgress) => void;
  onFinishInternship: () => void;
  onBackToMap: () => void;
}

const DEFAULT_TEACHER_STATE: TeacherState = {
  trustMentor: 70,
  reputation: 75,
  moraleDuc: 50,
  moraleMinh: 50,
  moraleHoa: 70,
  parentTrustDuc: 55,
  classAtmosphere: 65,
  flags: []
};

// Helper function to calculate branch narrative based on TeacherState & flags
function getBranchNarrative(careerId: CareerId, week: number, state: TeacherState) {
  const { trustMentor, reputation, moraleDuc, moraleMinh, flags } = state;
  const prevPassed = flags.includes(`passed_w${week - 1}`);
  const prevFailed = flags.includes(`failed_w${week - 1}`);
  const ethicsUpheld = flags.includes('ethics_upheld');
  const ethicsCompromised = flags.includes('ethics_compromised');

  if (week === 1) {
    return {
      badgeLabel: 'KHỞI ĐẦU HÀNH TRÌNH',
      narrativeText: 'Tuần thực tập đầu tiên chính thức bắt đầu! Mentor và đồng nghiệp đang theo dõi sát sao thái độ làm việc và chuyên môn của bạn.',
      impactNote: 'Hoàn thành tốt tuần này sẽ đặt nền móng Lòng tin (Mentor Trust) và Uy tín (BGH Reputation).'
    };
  }

  let badgeLabel = 'DIỄN BIẾN MỚI TỪ QUYẾT ĐỊNH TRƯỚC';
  let narrativeText = '';
  let impactNote = '';

  if (prevFailed) {
    badgeLabel = '⚠️ RẼ NHÁNH: THỬ THÁCH SAU THẤT BẠI';
    narrativeText = `Do tuần ${week - 1} chưa đạt tiêu chuẩn Passed (Lòng tin Mentor giảm xuống ${trustMentor}%), quy trình tuần này bị kiểm soát nghiêm ngặt hơn. Cần kiểm tra kỹ lưỡng từng thao tác!`;
    impactNote = 'Hãy tập trung hoàn thành chính xác 100% để khôi phục chỉ số Uy Tín BGH.';
  } else if (prevPassed) {
    badgeLabel = '🏆 RẼ NHÁNH: PHONG ĐỘ XUẤT SẮC';
    narrativeText = `Kết quả xuất sắc ở tuần ${week - 1} giúp bạn nhận được sự khen ngợi trực tiếp (Lòng tin Mentor đạt ${trustMentor}%). Bạn được trao thêm quyền chủ động xử lý tình huống!`;
    impactNote = 'Thêm cơ hội cộng điểm thưởng Radar năng lực.';
  } else {
    narrativeText = `Hành trình tiếp tục ở Tuần ${week}. Lòng tin Mentor hiện tại: ${trustMentor}%, Uy tín BGH: ${reputation}%.`;
    impactNote = 'Duy trì phong độ làm việc chuẩn mực.';
  }

  if (ethicsUpheld) {
    narrativeText += ' Hành động kiên quyết giữ vững liêm chính đạo đức ở tuần trước giúp bạn được tập thể tôn trọng sâu sắc.';
  } else if (ethicsCompromised) {
    narrativeText += ' Sự cố vi phạm quy chuẩn đạo đức ở tuần trước khiến Ban Giám Hiệu đưa bạn vào danh sách giám sát đặc biệt.';
  }

  if (moraleDuc < 45 && (careerId === 'education' || careerId === 'edtech')) {
    narrativeText += ' Em Đức đang tỏ ra thiếu tập trung và cần sự kiên nhẫn đồng hành.';
  } else if (moraleMinh >= 70) {
    narrativeText += ' Em Minh tự tin xung phong hỗ trợ các bạn cùng tiến.';
  }

  return { badgeLabel, narrativeText, impactNote };
}

export const InternshipWorkspace: React.FC<Props> = ({
  progress,
  settings,
  onUpdateProgress,
  onFinishInternship,
  onBackToMap
}) => {
  const careerId = (progress.chosenCareer || 'edtech') as CareerId;
  const career = getCareerById(careerId);
  const currentWeek = progress.currentWeek || 1;

  const currentTask = getTaskForCareerAndWeek(careerId, currentWeek);
  const weekKey = `${careerId}_w${currentWeek}`;
  const existingResult = progress.weeklyResults[weekKey];

  const teacherState: TeacherState = progress.teacherState || DEFAULT_TEACHER_STATE;
  const branchInfo = getBranchNarrative(careerId, currentWeek, teacherState);

  const completedWeeksCount = Array.from({ length: 8 }).filter((_, idx) => {
    const wKey = `${careerId}_w${idx + 1}`;
    return progress.weeklyResults[wKey]?.passed;
  }).length;
  const progressPercent = Math.round((completedWeeksCount / 8) * 100);

  const [reflectionText, setReflectionText] = useState(progress.reflections[weekKey] || '');
  const [reflectionSaved, setReflectionSaved] = useState(!!progress.reflections[weekKey]);
  const [lastEval, setLastEval] = useState<TaskEvaluationResult | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(currentWeek === 1);

  const handleToolEvaluated = (res: TaskEvaluationResult) => {
    setLastEval(res);

    // Compute updated TeacherState
    const currentTeacherState = progress.teacherState || DEFAULT_TEACHER_STATE;
    const updatedFlags = [...currentTeacherState.flags];

    if (res.passed) {
      if (!updatedFlags.includes(`passed_w${currentWeek}`)) {
        updatedFlags.push(`passed_w${currentWeek}`);
      }
      if (res.score >= 85 && !updatedFlags.includes(`high_score_w${currentWeek}`)) {
        updatedFlags.push(`high_score_w${currentWeek}`);
      }
    } else {
      if (!updatedFlags.includes(`failed_w${currentWeek}`)) {
        updatedFlags.push(`failed_w${currentWeek}`);
      }
    }

    if (currentTask.ethicalDilemma) {
      if (res.passed && !updatedFlags.includes('ethics_upheld')) {
        updatedFlags.push('ethics_upheld');
      } else if (!res.passed && !updatedFlags.includes('ethics_compromised')) {
        updatedFlags.push('ethics_compromised');
      }
    }

    const trustDelta = res.passed ? (res.score >= 85 ? 10 : 5) : -5;
    const repDelta = res.passed ? (res.score >= 85 ? 10 : 5) : -5;
    const atmosphereDelta = res.passed ? 8 : -5;
    const moraleDelta = res.passed ? 8 : -5;

    const newTeacherState: TeacherState = {
      ...currentTeacherState,
      trustMentor: Math.min(100, Math.max(0, currentTeacherState.trustMentor + trustDelta)),
      reputation: Math.min(100, Math.max(0, currentTeacherState.reputation + repDelta)),
      classAtmosphere: Math.min(100, Math.max(0, currentTeacherState.classAtmosphere + atmosphereDelta)),
      moraleDuc: Math.min(100, Math.max(0, currentTeacherState.moraleDuc + moraleDelta)),
      moraleMinh: Math.min(100, Math.max(0, currentTeacherState.moraleMinh + moraleDelta)),
      moraleHoa: Math.min(100, Math.max(0, currentTeacherState.moraleHoa + moraleDelta)),
      flags: updatedFlags
    };

    const resultItem: WeeklyResult = {
      week: currentWeek,
      careerId,
      score: res.score,
      passed: res.passed,
      feedback: res.feedback,
      date: new Date().toLocaleDateString('vi-VN'),
      reflection: reflectionText,
      traitsEarned: currentTask.traitBonus
    };

    const newWeeklyResults = { ...progress.weeklyResults, [weekKey]: resultItem };
    const newRadar = calculateRadarFromScores(progress.quizScores, newWeeklyResults);

    const traitLogSource = `Tuần ${currentWeek}: ${currentTask.title}`;
    const newTraitHistory = [
      ...progress.traitHistory,
      { date: new Date().toLocaleDateString('vi-VN'), source: traitLogSource, traitsAdded: currentTask.traitBonus }
    ];

    const updatedProgress: UserProgress = {
      ...progress,
      weeklyResults: newWeeklyResults,
      radarTraits: newRadar,
      traitHistory: newTraitHistory,
      teacherState: newTeacherState
    };

    onUpdateProgress(updatedProgress);

    if (res.passed) {
      confetti({ particleCount: 50, spread: 60, origin: { y: 0.7 } });
    }
  };

  const handleSaveReflection = () => {
    if (!reflectionText.trim()) return;
    playSound.click(settings.retroSound);

    const newReflections = { ...progress.reflections, [weekKey]: reflectionText };
    const newReflectionPoints = progress.reflectionPoints + (reflectionSaved ? 0 : 1);

    const totalReflections = Object.keys(newReflections).length;
    const newBadges = [...progress.badges];
    if (totalReflections >= 8 && !newBadges.includes('Người Phản Tư')) {
      newBadges.push('Người Phản Tư');
      confetti({ particleCount: 100, spread: 80 });
    }

    const updatedProgress: UserProgress = {
      ...progress,
      reflections: newReflections,
      reflectionPoints: newReflectionPoints,
      badges: newBadges
    };

    onUpdateProgress(updatedProgress);
    setReflectionSaved(true);
  };

  const handleNextWeek = () => {
    playSound.click(settings.retroSound);
    if (currentWeek < 8) {
      onUpdateProgress({ ...progress, currentWeek: currentWeek + 1 });
      setLastEval(null);
      setReflectionText(progress.reflections[`${careerId}_w${currentWeek + 1}`] || '');
      setReflectionSaved(!!progress.reflections[`${careerId}_w${currentWeek + 1}`]);
    } else {
      onFinishInternship();
    }
  };

  const renderTaskTool = () => {
    switch (currentTask.taskType) {
      case 'code_test':
        return (
          <CodeEditorTool
            taskData={currentTask.taskData}
            settings={settings}
            onEvaluateResult={handleToolEvaluated}
          />
        );
      case 'triage_station':
        return (
          <TriageStationTool
            taskData={currentTask.taskData}
            settings={settings}
            onEvaluateResult={handleToolEvaluated}
          />
        );
      case 'lesson_planner':
        return (
          <LessonPlannerTool
            taskData={currentTask.taskData}
            settings={settings}
            onEvaluateResult={handleToolEvaluated}
            currentWeek={currentWeek}
            teacherState={progress.teacherState}
            onUpdateTeacherState={(newState) => {
              onUpdateProgress({
                ...progress,
                teacherState: newState
              });
            }}
          />
        );
      case 'text_factcheck':
        return (
          <FactCheckerTool
            taskData={currentTask.taskData}
            settings={settings}
            onEvaluateResult={handleToolEvaluated}
          />
        );
      case 'lab_experiment':
        return (
          <LabExperimentTool
            taskData={currentTask.taskData}
            settings={settings}
            onEvaluateResult={handleToolEvaluated}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-mono text-[#00ff41] select-none relative">
      {/* Onboarding Overlay Guide Triggered on Week 1 or on Demand */}
      {showGuide && (
        <OnboardingOverlayGuide
          settings={settings}
          onClose={() => setShowGuide(false)}
        />
      )}

      {/* Top Header Workspace Status */}
      <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { playSound.click(settings.retroSound); onBackToMap(); }}
            className="p-2 border border-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c] transition-colors"
            title="Trở về bản đồ thành phố"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold bg-[#00ff41] text-[#0c0c0c] px-2 py-0.5 uppercase">
                THỰC TẬP 8 TUẦN
              </span>
              <span className="text-xs opacity-80 uppercase">NGÀNH: {career.name}</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#00ff41] mt-1 uppercase">
              {currentTask.title}
            </h2>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {/* Tutorial Help Button */}
          <button
            onClick={() => { playSound.click(settings.retroSound); setShowGuide(true); }}
            className="px-3 py-2 bg-[#000] text-[#ff00ff] font-bold text-xs uppercase flex items-center gap-1.5 border border-[#ff00ff] hover:bg-[#ff00ff] hover:text-[#0c0c0c] transition-all"
            title="Xem lại hướng dẫn giao diện thực tập"
          >
            <HelpCircle className="w-4 h-4" />
            <span>HƯỚNG DẪN GIAO DIỆN</span>
          </button>

          {/* Action button if finished week */}
          <button
            disabled={!existingResult?.passed && !lastEval?.passed}
            onClick={handleNextWeek}
            className="px-4 py-2.5 bg-[#00ff41] text-[#0c0c0c] font-bold text-xs uppercase flex items-center gap-2 border-2 border-[#00ff41] hover:bg-[#00e53a] disabled:opacity-40 transition-all"
          >
            <span>{currentWeek === 8 ? 'XEM CHỨNG CHỈ TỐT NGHIỆP' : 'SANG TUẦN TIẾP THEO'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Live TeacherState & Branch Status HUD */}
      <div className="bg-[#0c0c0c] border-2 border-[#ff00ff] p-4 shadow-[0_0_20px_rgba(255,0,255,0.2)] space-y-3 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs border-b border-[#ff00ff]/30 pb-2">
          <div className="flex items-center gap-2 font-bold uppercase text-[#ff00ff]">
            <GitBranch className="w-4 h-4 text-[#ff00ff] animate-pulse" />
            <span>HỆ THỐNG MÔ PHỎNG RẼ NHÁNH TÌNH HUỐNG (TEACHER & PERFORMANCE STATE)</span>
          </div>

          <div className="flex items-center gap-2 text-[11px]">
            <span className="text-white opacity-80">TRẠNG THÁI HIỆN TẠI:</span>
            <span className="bg-[#111] text-[#00ff41] px-2 py-0.5 border border-[#00ff41] font-bold uppercase">
              TUẦN {currentWeek} ACTIVE
            </span>
          </div>
        </div>

        {/* Live Attribute Counters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-5 gap-2 text-[11px]">
          <div className="bg-[#000] p-2 border border-[#00ff41]/50 space-y-0.5">
            <span className="text-white/80 font-bold flex items-center gap-1">
              <UserCheck className="w-3.5 h-3.5 text-[#ff00ff]" /> MENTOR TRUST
            </span>
            <div className="text-sm font-black text-[#00ff41]">{teacherState.trustMentor}%</div>
          </div>

          <div className="bg-[#000] p-2 border border-[#00ff41]/50 space-y-0.5">
            <span className="text-white/80 font-bold flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-[#00ff41]" /> REPUTATION (BGH)
            </span>
            <div className="text-sm font-black text-[#00ff41]">{teacherState.reputation}%</div>
          </div>

          <div className="bg-[#000] p-2 border border-[#00ff41]/50 space-y-0.5">
            <span className="text-white/80 font-bold flex items-center gap-1">
              <Heart className="w-3.5 h-3.5 text-[#ff4444]" /> MORALE (ĐỨC)
            </span>
            <div className="text-sm font-black text-[#ff4444]">{teacherState.moraleDuc}%</div>
          </div>

          <div className="bg-[#000] p-2 border border-[#00ff41]/50 space-y-0.5">
            <span className="text-white/80 font-bold flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-[#ff00ff]" /> MORALE (MINH)
            </span>
            <div className="text-sm font-black text-[#ff00ff]">{teacherState.moraleMinh}%</div>
          </div>

          <div className="bg-[#000] p-2 border border-[#00ff41]/50 space-y-0.5 col-span-2 sm:col-span-1">
            <span className="text-white/80 font-bold flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-yellow-400" /> CLASS ATMOSPHERE
            </span>
            <div className="text-sm font-black text-yellow-400">{teacherState.classAtmosphere}%</div>
          </div>
        </div>

        {/* Dynamic Branch Story Event Banner */}
        <div className="bg-[#111] p-3 border border-[#ff00ff]/60 space-y-1.5 text-xs">
          <div className="flex items-center justify-between">
            <span className="bg-[#ff00ff] text-[#000] px-2 py-0.5 font-black text-[10px] uppercase">
              {branchInfo.badgeLabel}
            </span>
            <span className="text-[10px] text-[#ff00ff] font-bold">BRANCH LOGIC SYSTEM</span>
          </div>

          <p className="text-white font-bold leading-relaxed text-[11px]">
            {branchInfo.narrativeText}
          </p>

          <p className="text-[#00ff41] text-[10px] italic">
            💡 Tác động: {branchInfo.impactNote}
          </p>
        </div>
      </div>

      {/* Retro CRT Scanline Progress Bar */}
      <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-4 shadow-[0_0_20px_rgba(0,255,65,0.25)] space-y-2.5 font-mono">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 font-bold uppercase text-[#00ff41]">
            <div className="relative flex items-center justify-center">
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff41] animate-ping absolute" />
              <span className="w-2.5 h-2.5 rounded-full bg-[#00ff41] relative" />
            </div>
            <Tv className="w-4 h-4 text-[#ff00ff]" />
            <span>MÔ PHỎNG TIẾN ĐỘ THỰC TẬP TỔNG THỂ (CRT MONITOR SYSTEM)</span>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            <span className="opacity-80 text-white">TRẠNG THÁI:</span>
            <span className="bg-[#000] text-[#00ff41] px-2.5 py-1 border border-[#00ff41] font-black uppercase text-[11px] shadow">
              {completedWeeksCount} / 8 TUẦN ĐÃ ĐẠT ({progressPercent}%)
            </span>
          </div>
        </div>

        {/* CRT Display Frame */}
        <div className="relative bg-[#000] border-2 border-[#00ff41]/70 p-1.5 overflow-hidden shadow-[inset_0_0_15px_rgba(0,255,65,0.4)]">
          {/* Scanline Overlay Grid */}
          <div
            className="absolute inset-0 pointer-events-none z-20 opacity-40 mix-blend-overlay"
            style={{
              backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.85), rgba(0,0,0,0.85) 1px, transparent 1px, transparent 3px)'
            }}
          />

          {/* CRT Phosphor Glow Glare */}
          <div className="absolute inset-0 bg-gradient-to-b from-[#00ff41]/5 via-transparent to-[#00ff41]/5 pointer-events-none z-10" />

          {/* Progress Bar Track */}
          <div className="relative w-full h-8 bg-[#080808] border border-[#00ff41]/40 flex items-center overflow-hidden">
            {/* Week notch grid marks (12.5% per block) */}
            <div className="absolute inset-0 grid grid-cols-8 z-10 pointer-events-none border-x border-[#00ff41]/20">
              {Array.from({ length: 8 }).map((_, i) => {
                const wNum = i + 1;
                const isDone = progress.weeklyResults[`${careerId}_w${wNum}`]?.passed;
                return (
                  <div key={i} className="border-r border-[#00ff41]/20 h-full flex items-center justify-between px-1">
                    <span className={`text-[9px] font-black font-mono ${isDone ? 'text-[#00ff41]' : 'text-[#00ff41]/30'}`}>
                      W{wNum}
                    </span>
                    {isDone && <CheckCircle2 className="w-3 h-3 text-[#00ff41] opacity-90 hidden sm:block" />}
                  </div>
                );
              })}
            </div>

            {/* Fill Bar with smooth transition */}
            <div
              className="h-full bg-gradient-to-r from-[#009928] via-[#00ff41] to-[#2eff6a] transition-all duration-1000 ease-out shadow-[0_0_20px_rgba(0,255,65,0.9)] relative"
              style={{ width: `${progressPercent}%` }}
            >
              {/* Animated Leading Edge Beam */}
              {progressPercent > 0 && (
                <div className="absolute right-0 top-0 bottom-0 w-2.5 bg-white shadow-[0_0_15px_#ffffff] animate-pulse" />
              )}
            </div>

            {/* CRT Text overlay centered over track */}
            <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-xs z-20 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] uppercase tracking-wider">
              {progressPercent === 100 ? (
                <span className="text-[#00ff41] flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#ff00ff] animate-bounce" />
                  HOÀN THÀNH 100% HOÀN HẢO CHƯƠNG TRÌNH THỰC TẬP 8 TUẦN!
                </span>
              ) : (
                <span>SYSTEM PROGRESS: {progressPercent}% [{completedWeeksCount}/8 TUẦN]</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Week Step Progress Bar (1 to 8) */}
      <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-3 flex items-center justify-between gap-2 overflow-x-auto text-xs">
        {Array.from({ length: 8 }).map((_, idx) => {
          const wNum = idx + 1;
          const wKey = `${careerId}_w${wNum}`;
          const isDone = progress.weeklyResults[wKey]?.passed;
          const isCurrent = wNum === currentWeek;

          return (
            <button
              key={wNum}
              onClick={() => { 
                playSound.click(settings.retroSound); 
                onUpdateProgress({ ...progress, currentWeek: wNum });
                if (wNum === 1) setShowGuide(true);
              }}
              className={`flex-1 py-2 px-1 border text-center transition-all min-w-[70px] uppercase font-bold ${
                isCurrent
                  ? 'bg-[#00ff41] text-[#0c0c0c] border-[#00ff41]'
                  : isDone
                  ? 'bg-[#111] text-[#00ff41] border-[#00ff41]'
                  : 'bg-[#000] text-[#00ff41]/50 border-[#00ff41]/30 hover:text-[#00ff41]'
              }`}
            >
              <div>TUẦN {wNum}</div>
              <div className="text-[10px]">
                {isDone ? '[PASSED]' : isCurrent ? '▶ ACTIVE' : 'WAIT'}
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Workspace 2 Cols Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Story Context + Interactive Task Tool */}
        <div className="lg:col-span-2 space-y-5">
          {/* Story & Ethical Dilemma Dialog */}
          <div id="guide-step-story" className="bg-[#0c0c0c] border-2 border-[#00ff41] p-5 space-y-3 shadow-lg relative">
            <div className="flex items-start gap-3">
              <div className="w-12 h-12 bg-[#00ff41] text-[#0c0c0c] font-bold text-lg flex items-center justify-center shrink-0">
                W{currentWeek}
              </div>

              <div className="space-y-1">
                <div className="text-xs font-bold text-[#00ff41] uppercase">
                  BỐI CẢNH DẪN DẮT BÀI TẬP BÁO CÁO THỰC TẬP
                </div>
                <p className="text-xs sm:text-sm text-[#00ff41] opacity-90 leading-relaxed">
                  {currentTask.storyContext}
                </p>
              </div>
            </div>

            {/* Ethical Dilemma Notice if present */}
            {currentTask.ethicalDilemma && (
              <div className="p-3 bg-[#111] border border-[#ff00ff] text-xs flex items-start gap-2">
                <ShieldCheck className="w-5 h-5 text-[#ff00ff] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#ff00ff] uppercase block text-[11px]">GÓC BÀI HỌC ĐẠO ĐỨC NGHỀ NGHIỆP:</strong>
                  <span className="text-[#00ff41] opacity-90">{currentTask.ethicalDilemma}</span>
                </div>
              </div>
            )}
          </div>

          {/* Situation Animator - 8-Bit Retro Visualizer */}
          <SituationAnimator
            week={currentWeek}
            careerId={careerId}
            teacherState={progress.teacherState}
            isEvaluating={!existingResult?.passed && !!lastEval}
          />

          {/* Interactive Real Task Tool Component */}
          <div id="guide-step-tool">
            {renderTaskTool()}
          </div>

          {/* Reflection Journal Section */}
          <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-[#ff00ff] font-bold text-xs uppercase">
                <PenTool className="w-4 h-4" />
                <span>NHẬT KÝ PHẢN TƯ TUẦN {currentWeek} (+1 SP)</span>
              </div>
              <span className="text-[10px] bg-[#00ff41] text-[#0c0c0c] px-2 py-0.5 font-bold">
                TỔNG SP: {progress.reflectionPoints}Đ
              </span>
            </div>

            <p className="text-xs opacity-80">
              Hãy viết 1 câu trả lời ngắn: <em>"Bạn đã học được kỹ năng hay bài học gì giá trị nhất trong tuần này?"</em>
            </p>

            <div className="flex gap-2">
              <input
                type="text"
                value={reflectionText}
                onChange={(e) => { setReflectionText(e.target.value); setReflectionSaved(false); }}
                placeholder="Ví dụ: Học cách kiểm soát lỗi null safety để ứng dụng không bị sập..."
                className="flex-1 bg-[#000] text-[#00ff41] border border-[#00ff41] px-3 py-2 text-xs focus:outline-none focus:bg-[#111]"
              />
              <button
                onClick={handleSaveReflection}
                className="px-4 py-2 bg-[#00ff41] text-[#0c0c0c] font-bold text-xs uppercase border border-[#00ff41] hover:bg-[#00e53a]"
              >
                {reflectionSaved ? 'ĐÃ LƯU ✓' : 'LƯU NHẬT KÝ'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Live Radar Traits Chart & Real-Work Trait Log */}
        <div id="guide-step-radar" className="space-y-5">
          {/* Radar Chart Display */}
          <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-4 shadow-lg space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold uppercase text-[#00ff41]">SƠ ĐỒ NĂNG LỰC RADAR THẬT</span>
              <span className="opacity-70 text-[10px]">[100% VERIFIED]</span>
            </div>

            <div className="bg-[#000] p-3 border border-[#00ff41]/50 flex justify-center">
              <RadarChartCanvas traits={progress.radarTraits} size={280} />
            </div>
          </div>

          {/* Real Work Trait Log */}
          <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-4 shadow-lg space-y-3 text-xs">
            <div className="flex items-center justify-between text-[#00ff41] font-bold uppercase">
              <span>LỊCH SỬ TÍCH LŨY ĐIỂM THẬT</span>
              <Sparkles className="w-4 h-4 text-[#ff00ff]" />
            </div>

            <div className="space-y-2 max-h-56 overflow-y-auto">
              {progress.traitHistory.map((item, idx) => (
                <div key={idx} className="bg-[#111] p-2.5 border border-[#00ff41]/40 space-y-1 text-[11px]">
                  <div className="flex justify-between font-bold">
                    <span>{item.source}</span>
                    <span className="text-[#00ff41]">{item.date}</span>
                  </div>
                  <div className="flex flex-wrap gap-1 text-[10px]">
                    {Object.entries(item.traitsAdded).map(([k, v]) => (
                      <span key={k} className="bg-[#000] text-[#00ff41] px-1.5 py-0.5 border border-[#00ff41]">
                        +{v} {k}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
