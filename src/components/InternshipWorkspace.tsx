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
import { PixelCustomAvatarSprite, PixelCharacterSprite } from './pixel/PixelArtSprites';
import { CareerSkillTreeModal } from './CareerSkillTreeModal';
import { NpcGuidanceModal } from './NpcGuidanceModal';
import { getMainMentorForCareer, getNpcsForCareer, getCareerNpcRoster, getIndustryMentor, getPeerColleagues } from '../data/npcGuidanceData';
import { getSkillTreeForCareer } from '../data/skillTreeData';

import { 
  ArrowRight, ArrowLeft, Sparkles, PenTool, ShieldCheck, HelpCircle, Tv, 
  CheckCircle2, Activity, GitBranch, UserCheck, Heart, Award, Shield, 
  Wrench, Zap, BookOpen, Layers, MessageSquare, Check, Flame, ChevronRight, Users, Lightbulb
} from 'lucide-react';
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

  // Sub-screen navigation tab state
  const [activeSubScreen, setActiveSubScreen] = useState<'task_workspace' | 'branch_narrative' | 'radar_analytics' | 'reflection_journal'>('task_workspace');

  const [reflectionText, setReflectionText] = useState(progress.reflections[weekKey] || '');
  const [reflectionSaved, setReflectionSaved] = useState(!!progress.reflections[weekKey]);
  const [lastEval, setLastEval] = useState<TaskEvaluationResult | null>(null);
  const [showGuide, setShowGuide] = useState<boolean>(currentWeek === 1);
  const [showSkillTree, setShowSkillTree] = useState<boolean>(false);

  const currentSkillPoints = progress.skillPoints ?? 2;
  const unlockedSkillsForCareer = progress.unlockedSkills?.[careerId] || [];
  const equippedToolId = progress.equippedTool?.[careerId];

  // NPC Guidance System state
  const [showNpcModal, setShowNpcModal] = useState<boolean>(false);
  const [selectedNpcIdForModal, setSelectedNpcIdForModal] = useState<string | undefined>(undefined);

  const npcRoster = getCareerNpcRoster(careerId);
  const mainMentor = npcRoster.mentor || getMainMentorForCareer(careerId);
  const peerColleagues = npcRoster.colleagues || getPeerColleagues(careerId);
  const primaryColleague = peerColleagues[0];
  const careerNpcs = getNpcsForCareer(careerId);
  const mentorWeeklyAdvice = mainMentor?.weeklyAdvice[currentWeek] || mainMentor?.weeklyAdvice[1];
  const colleagueWeeklyAdvice = primaryColleague?.weeklyAdvice[currentWeek] || primaryColleague?.weeklyAdvice[1];

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

    // SP Bonus on first time pass
    const spEarned = res.passed && !existingResult?.passed ? 2 : 0;
    const newSP = currentSkillPoints + spEarned;

    const updatedProgress: UserProgress = {
      ...progress,
      weeklyResults: newWeeklyResults,
      radarTraits: newRadar,
      traitHistory: newTraitHistory,
      teacherState: newTeacherState,
      skillPoints: newSP
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
    const newSP = (progress.skillPoints ?? 2) + (reflectionSaved ? 0 : 1);

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
      badges: newBadges,
      skillPoints: newSP
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
      setActiveSubScreen('task_workspace');
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
            currentWeek={currentWeek}
            softwareState={progress.softwareState}
            onUpdateSoftwareState={(newState) => {
              onUpdateProgress({
                ...progress,
                softwareState: newState
              });
            }}
            equippedToolId={equippedToolId}
            unlockedSkills={unlockedSkillsForCareer}
          />
        );
      case 'triage_station':
        return (
          <TriageStationTool
            taskData={currentTask.taskData}
            settings={settings}
            onEvaluateResult={handleToolEvaluated}
            currentWeek={currentWeek}
            healthcareState={progress.healthcareState}
            onUpdateHealthcareState={(newState) => {
              onUpdateProgress({
                ...progress,
                healthcareState: newState
              });
            }}
            equippedToolId={equippedToolId}
            unlockedSkills={unlockedSkillsForCareer}
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
            equippedToolId={equippedToolId}
            unlockedSkills={unlockedSkillsForCareer}
          />
        );
      case 'text_factcheck':
        return (
          <FactCheckerTool
            taskData={currentTask.taskData}
            settings={settings}
            onEvaluateResult={handleToolEvaluated}
            currentWeek={currentWeek}
            journalismState={progress.journalismState}
            onUpdateJournalismState={(newState) => {
              onUpdateProgress({
                ...progress,
                journalismState: newState
              });
            }}
            equippedToolId={equippedToolId}
            unlockedSkills={unlockedSkillsForCareer}
          />
        );
      case 'lab_experiment':
        return (
          <LabExperimentTool
            taskData={currentTask.taskData}
            settings={settings}
            onEvaluateResult={handleToolEvaluated}
            currentWeek={currentWeek}
            scienceState={progress.scienceState}
            onUpdateScienceState={(newState) => {
              onUpdateProgress({
                ...progress,
                scienceState: newState
              });
            }}
            equippedToolId={equippedToolId}
            unlockedSkills={unlockedSkillsForCareer}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-4 font-mono text-[#00ff41] select-none relative pb-10">
      {/* Onboarding Overlay Guide Triggered on Week 1 or on Demand */}
      {showGuide && (
        <OnboardingOverlayGuide
          settings={settings}
          onClose={() => setShowGuide(false)}
        />
      )}

      {/* Career Skill Tree Modal */}
      {showSkillTree && (
        <CareerSkillTreeModal
          careerId={careerId}
          progress={progress}
          settings={settings}
          onClose={() => setShowSkillTree(false)}
          onUpdateProgress={onUpdateProgress}
        />
      )}

      {/* NPC & Mentor Guidance Modal */}
      {showNpcModal && (
        <NpcGuidanceModal
          careerId={careerId}
          currentWeek={currentWeek}
          isOpen={showNpcModal}
          onClose={() => setShowNpcModal(false)}
          initialNpcId={selectedNpcIdForModal}
        />
      )}

      {/* Top Header Workspace Status & Quick Controls */}
      <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-3 sm:p-4 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => { playSound.click(settings.retroSound); onBackToMap(); }}
            className="p-2 border border-[#00ff41] hover:bg-[#00ff41] hover:text-[#0c0c0c] transition-colors shrink-0"
            title="Trở về bản đồ thành phố"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* Active Custom Avatar Badge */}
          <div className="hidden sm:flex shrink-0 p-1 bg-[#000] border border-[#00ff41]/60 items-center justify-center">
            <PixelCustomAvatarSprite
              config={progress.customAvatar || {
                gender: 'male',
                skinTone: 'warm',
                hairStyle: 'spiky',
                hairColor: 'black',
                outfit: 'school_uniform',
                outfitColor: 'green',
                accessory: 'none',
                headgear: 'none',
                heldItem: 'laptop',
                companion: 'shiba',
                title: 'Thực Tập Sinh',
                expression: 'focus'
              }}
              size={42}
              animate={true}
              showCompanion={true}
            />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold bg-[#00ff41] text-[#0c0c0c] px-2 py-0.5 uppercase">
                MÀN 2: THỰC TẬP {career.name.toUpperCase()}
              </span>
              <span className="text-[11px] text-[#ffea00] bg-[#111] px-1.5 py-0.5 border border-[#ffea00]/40 font-bold">
                TUẦN {currentWeek}/8
              </span>
            </div>
            <h2 className="text-base sm:text-xl font-black text-white mt-1 uppercase truncate max-w-xl">
              {currentTask.title}
            </h2>
          </div>
        </div>

        {/* Quick Toolbar */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          {/* NPC & Mentor Guidance Button */}
          <button
            onClick={() => { 
              playSound.click(settings.retroSound); 
              setSelectedNpcIdForModal(undefined);
              setShowNpcModal(true); 
            }}
            className="px-2.5 py-1.5 bg-[#002b11] text-[#00ff41] font-bold text-xs uppercase flex items-center gap-1.5 border border-[#00ff41] hover:bg-[#00ff41] hover:text-black transition-all shadow-[0_0_12px_rgba(0,255,65,0.3)] animate-pulse"
            title="Hỏi đáp & nhận lời khuyên từ Mentor và Đồng nghiệp"
          >
            <Users className="w-3.5 h-3.5" />
            <span>HỎI NPC & MENTOR</span>
            <span className="bg-black text-[#00ff41] px-1 py-0.2 border border-[#00ff41] text-[10px]">
              {careerNpcs.length}
            </span>
          </button>

          <button
            onClick={() => { playSound.click(settings.retroSound); setShowSkillTree(true); }}
            className="px-2.5 py-1.5 bg-[#12081f] text-[#ff00ff] font-bold text-xs uppercase flex items-center gap-1.5 border border-[#ff00ff] hover:bg-[#ff00ff] hover:text-black transition-all shadow-[0_0_8px_rgba(255,0,255,0.4)]"
            title="Mở cây kỹ năng & trang bị dụng cụ đặc biệt"
          >
            <Wrench className="w-3.5 h-3.5" />
            <span>KỸ NĂNG & DỤNG CỤ</span>
            <span className="bg-[#000] text-[#ffea00] px-1 py-0.2 border border-[#ffea00] text-[10px]">
              {currentSkillPoints} SP
            </span>
          </button>

          <button
            onClick={() => { playSound.click(settings.retroSound); setShowGuide(true); }}
            className="px-2.5 py-1.5 bg-[#000] text-[#00ff41] font-bold text-xs uppercase flex items-center gap-1 border border-[#00ff41]/80 hover:bg-[#00ff41] hover:text-[#0c0c0c] transition-all"
            title="Xem lại hướng dẫn giao diện thực tập"
          >
            <HelpCircle className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">HƯỚNG DẪN</span>
          </button>

          <button
            disabled={!existingResult?.passed && !lastEval?.passed}
            onClick={handleNextWeek}
            className="px-3 py-1.5 bg-[#00ff41] text-[#0c0c0c] font-black text-xs uppercase flex items-center gap-1.5 border border-white hover:bg-[#00e53a] disabled:opacity-40 transition-all shadow-[0_0_10px_rgba(0,255,65,0.4)]"
          >
            <span>{currentWeek === 8 ? 'LỄ TỐT NGHIỆP 🎓' : 'SANG TUẦN ' + (currentWeek + 1)}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Week Progress Navigation Bar (1 to 8) */}
      <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-2 flex items-center justify-between gap-1.5 overflow-x-auto text-xs">
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
              className={`flex-1 py-1.5 px-1 border text-center transition-all min-w-[65px] uppercase font-bold text-[11px] ${
                isCurrent
                  ? 'bg-[#00ff41] text-[#0c0c0c] border-[#00ff41] shadow-[0_0_8px_#00ff41]'
                  : isDone
                  ? 'bg-[#111] text-[#00ff41] border-[#00ff41]/70'
                  : 'bg-[#000] text-[#00ff41]/40 border-[#00ff41]/20 hover:text-[#00ff41]'
              }`}
            >
              <div>TUẦN {wNum}</div>
              <div className="text-[9px]">
                {isDone ? '✓ ĐẠT' : isCurrent ? '▶ ĐANG LÀM' : 'CHƯA LÀM'}
              </div>
            </button>
          );
        })}
      </div>

      {/* 4 SUB-SCREENS TAB NAVIGATION (Chia đều cho các màn phụ, không nhồi nhét) */}
      <div className="flex flex-wrap items-center gap-2 pt-1 border-b border-[#00ff41]/40 pb-2">
        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveSubScreen('task_workspace'); }}
          className={`px-3 py-2 text-xs font-black uppercase flex items-center gap-2 border-2 transition-all cursor-pointer ${
            activeSubScreen === 'task_workspace'
              ? 'bg-[#00ff41] text-black border-white shadow-[0_0_12px_#00ff41]'
              : 'bg-black text-[#00ff41] border-[#00ff41]/60 hover:border-[#00ff41]'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>1. BÀN LÀM VIỆC & NHIỆM VỤ</span>
          {(existingResult?.passed || lastEval?.passed) && (
            <span className="bg-black text-[#00ff41] text-[10px] px-1 py-0.2 font-bold border border-[#00ff41]">
              ✓ ĐÃ ĐẠT
            </span>
          )}
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveSubScreen('branch_narrative'); }}
          className={`px-3 py-2 text-xs font-black uppercase flex items-center gap-2 border-2 transition-all cursor-pointer ${
            activeSubScreen === 'branch_narrative'
              ? 'bg-[#ff00ff] text-black border-white shadow-[0_0_12px_#ff00ff]'
              : 'bg-black text-[#ff00ff] border-[#ff00ff]/60 hover:border-[#ff00ff]'
          }`}
        >
          <GitBranch className="w-4 h-4" />
          <span>2. CỐT TRUYỆN & CHỈ SỐ RẼ NHÁNH</span>
          <span className="bg-black text-[#ff00ff] text-[10px] px-1 py-0.2 font-bold border border-[#ff00ff]">
            {teacherState.trustMentor}% TRUST
          </span>
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveSubScreen('radar_analytics'); }}
          className={`px-3 py-2 text-xs font-black uppercase flex items-center gap-2 border-2 transition-all cursor-pointer ${
            activeSubScreen === 'radar_analytics'
              ? 'bg-[#00e5ff] text-black border-white shadow-[0_0_12px_#00e5ff]'
              : 'bg-black text-[#00e5ff] border-[#00e5ff]/60 hover:border-[#00e5ff]'
          }`}
        >
          <Zap className="w-4 h-4" />
          <span>3. SƠ ĐỒ RADAR & LỊCH SỬ ĐIỂM</span>
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveSubScreen('reflection_journal'); }}
          className={`px-3 py-2 text-xs font-black uppercase flex items-center gap-2 border-2 transition-all cursor-pointer ${
            activeSubScreen === 'reflection_journal'
              ? 'bg-[#ffea00] text-black border-white shadow-[0_0_12px_#ffea00]'
              : 'bg-black text-[#ffea00] border-[#ffea00]/60 hover:border-[#ffea00]'
          }`}
        >
          <PenTool className="w-4 h-4" />
          <span>4. NHẬT KÝ PHẢN TƯ</span>
          <span className="bg-black text-[#ffea00] text-[10px] px-1 py-0.2 font-bold border border-[#ffea00]">
            {Object.keys(progress.reflections).length}/8 BÀI
          </span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-SCREEN 1: BÀN LÀM VIỆC & NHIỆM VỤ CHÍNH (FOCUSED TASK WORKSPACE)       */}
      {/* ========================================================================= */}
      {activeSubScreen === 'task_workspace' && (
        <div className="space-y-4">
          {/* NPC MENTOR & COLLEAGUE GUIDANCE CALLOUT */}
          {mainMentor && (
            <div className="bg-[#080e1a] border-2 border-blue-500/70 p-3 sm:p-4 rounded-lg shadow-lg flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3 text-slate-200">
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 flex-1">
                {/* Mentor Block */}
                <div 
                  onClick={() => {
                    playSound.click(settings.retroSound);
                    setSelectedNpcIdForModal(mainMentor.id);
                    setShowNpcModal(true);
                  }}
                  className="flex items-center gap-2.5 p-2 rounded-lg bg-blue-950/40 border border-blue-600/40 hover:border-blue-400 cursor-pointer transition-all flex-1"
                >
                  <div className="w-10 h-10 rounded-lg bg-black/60 border border-blue-400/60 p-1 flex items-center justify-center shrink-0">
                    <PixelCharacterSprite
                      character={mainMentor.spriteType as any}
                      mood={mentorWeeklyAdvice?.mood || 'thinking'}
                      size={34}
                    />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-bold text-blue-400 uppercase tracking-wider truncate">
                        MENTOR {mainMentor.name.toUpperCase()}
                      </span>
                      <span className="px-1 py-0.2 text-[8px] bg-blue-900/60 text-blue-200 border border-blue-500/40 rounded">
                        {mainMentor.role}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-300 italic truncate mt-0.5">
                      "{mentorWeeklyAdvice?.dialogue || mainMentor.signatureQuote}"
                    </p>
                  </div>
                </div>

                {/* Colleague Block (if available) */}
                {primaryColleague && (
                  <div 
                    onClick={() => {
                      playSound.click(settings.retroSound);
                      setSelectedNpcIdForModal(primaryColleague.id);
                      setShowNpcModal(true);
                    }}
                    className="hidden lg:flex items-center gap-2.5 p-2 rounded-lg bg-emerald-950/30 border border-emerald-600/40 hover:border-emerald-400 cursor-pointer transition-all flex-1"
                  >
                    <div className="w-10 h-10 rounded-lg bg-black/60 border border-emerald-400/60 p-1 flex items-center justify-center shrink-0">
                      <PixelCharacterSprite
                        character={primaryColleague.spriteType as any}
                        mood="happy"
                        size={34}
                      />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider truncate">
                          ĐỒNG NGHIỆP {primaryColleague.name.toUpperCase()}
                        </span>
                        <span className="px-1 py-0.2 text-[8px] bg-emerald-900/60 text-emerald-200 border border-emerald-500/40 rounded">
                          {primaryColleague.role}
                        </span>
                      </div>
                      <p className="text-[11px] text-emerald-200/90 italic truncate mt-0.5">
                        "{colleagueWeeklyAdvice?.dialogue || primaryColleague.signatureQuote}"
                      </p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                <button
                  onClick={() => {
                    playSound.click(settings.retroSound);
                    setSelectedNpcIdForModal(undefined);
                    setShowNpcModal(true);
                  }}
                  className="px-3 py-2 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded border border-blue-300 transition-all flex items-center gap-1.5 shadow-[0_0_10px_rgba(59,130,246,0.4)]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Trao Đổi Với Đội Ngũ ({careerNpcs.length})</span>
                </button>
              </div>
            </div>
          )}

          {/* Story & Ethical Dilemma Dialog Card */}
          <div id="guide-step-story" className="bg-[#0c0c0c] border-2 border-[#00ff41] p-4 sm:p-5 space-y-3 shadow-lg relative">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 bg-[#00ff41] text-[#0c0c0c] font-black text-base flex items-center justify-center shrink-0">
                W{currentWeek}
              </div>

              <div className="space-y-1">
                <div className="text-[11px] font-black text-[#00ff41] uppercase tracking-wide flex items-center gap-2">
                  <span>BỐI CẢNH TÌNH HUỐNG THỰC TẬP TUẦN {currentWeek}</span>
                  {currentTask.ethicalDilemma && (
                    <span className="bg-[#ff00ff] text-black text-[9px] px-1.5 py-0.2 font-bold uppercase">
                      CÓ THỬ THÁCH ĐẠO ĐỨC
                    </span>
                  )}
                </div>
                <p className="text-xs sm:text-sm text-white opacity-95 leading-relaxed">
                  {currentTask.storyContext}
                </p>
              </div>
            </div>

            {/* Ethical Dilemma Notice if present */}
            {currentTask.ethicalDilemma && (
              <div className="p-3 bg-[#111] border border-[#ff00ff] text-xs flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-[#ff00ff] shrink-0 mt-0.5" />
                <div>
                  <strong className="text-[#ff00ff] uppercase block text-[11px]">BÀI HỌC ĐẠO ĐỨC NGHỀ NGHIỆP:</strong>
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
            onOpenNpcModal={(npcId) => {
              setSelectedNpcIdForModal(npcId);
              setShowNpcModal(true);
            }}
          />

          {/* Interactive Real Task Tool Component */}
          <div id="guide-step-tool">
            {renderTaskTool()}
          </div>

          {/* Bottom Task Action & Next Step Prompt */}
          <div className="bg-[#0c0c0c] border border-[#00ff41]/50 p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-white/80">
              <Sparkles className="w-4 h-4 text-[#ffea00]" />
              <span>
                {existingResult?.passed || lastEval?.passed
                  ? 'Bạn đã hoàn thành tốt nhiệm vụ tuần này! Hãy ghi chép nhật ký phản tư hoặc chuyển sang tuần tiếp theo.'
                  : 'Hãy thực hiện chính xác các thao tác trên công cụ mô phỏng để nhận phản hồi đánh giá và tích lũy điểm O*NET.'}
              </span>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                onClick={() => { playSound.click(settings.retroSound); setActiveSubScreen('reflection_journal'); }}
                className="px-3 py-2 bg-[#111] text-[#ffea00] border border-[#ffea00] hover:bg-[#ffea00] hover:text-black font-bold text-xs uppercase transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5" />
                <span>VIẾT NHẬT KÝ (+1 SP)</span>
              </button>

              <button
                disabled={!existingResult?.passed && !lastEval?.passed}
                onClick={handleNextWeek}
                className="px-4 py-2 bg-[#00ff41] text-black font-black text-xs uppercase border border-white hover:bg-[#00e53a] disabled:opacity-40 transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(0,255,65,0.4)]"
              >
                <span>{currentWeek === 8 ? 'XEM CHỨNG CHỈ TỐT NGHIỆP' : 'SANG TUẦN ' + (currentWeek + 1)}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-SCREEN 2: DIỄN BIẾN CỐT TRUYỆN & CHỈ SỐ RẼ NHÁNH (BRANCH HUD)          */}
      {/* ========================================================================= */}
      {activeSubScreen === 'branch_narrative' && (
        <div className="space-y-4">
          {/* Dynamic Branch Story Event Banner */}
          <div className="bg-[#0c0c0c] border-2 border-[#ff00ff] p-5 shadow-[0_0_20px_rgba(255,0,255,0.2)] space-y-4 font-mono">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ff00ff]/40 pb-3">
              <div className="flex items-center gap-2 font-black uppercase text-[#ff00ff]">
                <GitBranch className="w-5 h-5 animate-pulse" />
                <span>HỆ THỐNG RẼ NHÁNH TÌNH HUỐNG & TRẠNG THÁI NGHỀ NGHIỆP</span>
              </div>
              <span className="bg-[#ff00ff] text-black px-2.5 py-0.5 font-black text-xs uppercase">
                {branchInfo.badgeLabel}
              </span>
            </div>

            <div className="p-4 bg-[#111] border border-[#ff00ff]/60 space-y-2">
              <div className="text-xs font-bold text-[#ff00ff] uppercase">BÁO CÁO TÁC ĐỘNG TỪ CÁC QUYẾT ĐỊNH TRƯỚC:</div>
              <p className="text-sm text-white font-bold leading-relaxed">
                {branchInfo.narrativeText}
              </p>
              <div className="text-xs text-[#00ff41] font-semibold pt-1">
                💡 {branchInfo.impactNote}
              </div>
            </div>

            {/* Live Attribute Counters Grid */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
                <Activity className="w-4 h-4 text-[#00ff41]" />
                CÁC CHỈ SỐ QUAN HỆ & UY TÍN NGHỀ NGHIỆP:
              </h4>

              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 text-xs">
                <div className="bg-[#000] p-3 border border-[#00ff41]/60 space-y-1">
                  <span className="text-white/80 font-bold flex items-center gap-1 text-[11px]">
                    <UserCheck className="w-3.5 h-3.5 text-[#ff00ff]" /> MENTOR TRUST
                  </span>
                  <div className="text-lg font-black text-[#00ff41]">{teacherState.trustMentor}%</div>
                  <p className="text-[10px] text-white/60">Độ tin cậy của Người hướng dẫn</p>
                </div>

                <div className="bg-[#000] p-3 border border-[#00ff41]/60 space-y-1">
                  <span className="text-white/80 font-bold flex items-center gap-1 text-[11px]">
                    <Shield className="w-3.5 h-3.5 text-[#00ff41]" /> REPUTATION
                  </span>
                  <div className="text-lg font-black text-[#00ff41]">{teacherState.reputation}%</div>
                  <p className="text-[10px] text-white/60">Uy tín tại cơ quan / BGH</p>
                </div>

                <div className="bg-[#000] p-3 border border-[#00ff41]/60 space-y-1">
                  <span className="text-white/80 font-bold flex items-center gap-1 text-[11px]">
                    <Heart className="w-3.5 h-3.5 text-[#ff4444]" /> MORALE (ĐỨC)
                  </span>
                  <div className="text-lg font-black text-[#ff4444]">{teacherState.moraleDuc}%</div>
                  <p className="text-[10px] text-white/60">Học sinh cá biệt / Trọng điểm</p>
                </div>

                <div className="bg-[#000] p-3 border border-[#00ff41]/60 space-y-1">
                  <span className="text-white/80 font-bold flex items-center gap-1 text-[11px]">
                    <Sparkles className="w-3.5 h-3.5 text-[#ff00ff]" /> MORALE (MINH)
                  </span>
                  <div className="text-lg font-black text-[#ff00ff]">{teacherState.moraleMinh}%</div>
                  <p className="text-[10px] text-white/60">Học sinh tự ti / Đồng nghiệp</p>
                </div>

                <div className="bg-[#000] p-3 border border-[#00ff41]/60 space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-white/80 font-bold flex items-center gap-1 text-[11px]">
                    <Award className="w-3.5 h-3.5 text-yellow-400" /> CLASS ATMOSPHERE
                  </span>
                  <div className="text-lg font-black text-yellow-400">{teacherState.classAtmosphere}%</div>
                  <p className="text-[10px] text-white/60">Không khí tập thể & tinh thần</p>
                </div>
              </div>
            </div>

            {/* Overall CRT Scanline Progress Monitor */}
            <div className="space-y-2 pt-2 border-t border-[#ff00ff]/30">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white uppercase flex items-center gap-1.5">
                  <Tv className="w-4 h-4 text-[#00ff41]" />
                  TIẾN ĐỘ THỰC TẬP TỔNG THỂ 8 TUẦN
                </span>
                <span className="bg-black text-[#00ff41] px-2 py-0.5 border border-[#00ff41] font-bold">
                  {completedWeeksCount}/8 TUẦN ({progressPercent}%)
                </span>
              </div>

              <div className="relative bg-[#000] border-2 border-[#00ff41]/70 p-1.5 overflow-hidden shadow-[inset_0_0_15px_rgba(0,255,65,0.4)]">
                <div
                  className="absolute inset-0 pointer-events-none z-20 opacity-30 mix-blend-overlay"
                  style={{
                    backgroundImage: 'repeating-linear-gradient(0deg, rgba(0,0,0,0.85), rgba(0,0,0,0.85) 1px, transparent 1px, transparent 3px)'
                  }}
                />
                <div className="relative w-full h-7 bg-[#080808] border border-[#00ff41]/40 flex items-center overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#009928] via-[#00ff41] to-[#2eff6a] transition-all duration-700 shadow-[0_0_15px_rgba(0,255,65,0.9)]"
                    style={{ width: `${progressPercent}%` }}
                  />
                  <div className="absolute inset-0 flex items-center justify-center font-mono font-black text-xs z-20 text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)] uppercase tracking-wider">
                    SYSTEM PROGRESS: {progressPercent}% [{completedWeeksCount}/8 TUẦN PASSED]
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-SCREEN 3: SƠ ĐỒ RADAR NĂNG LỰC & LỊCH SỬ ĐIỂM (RADAR ANALYTICS)        */}
      {/* ========================================================================= */}
      {activeSubScreen === 'radar_analytics' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {/* Left: Radar Chart View */}
            <div className="bg-[#0c0c0c] border-2 border-[#00e5ff] p-5 shadow-lg space-y-4">
              <div className="flex items-center justify-between border-b border-[#00e5ff]/40 pb-2">
                <div className="flex items-center gap-2 font-bold uppercase text-[#00e5ff]">
                  <Zap className="w-5 h-5 text-[#ffea00]" />
                  <span>SƠ ĐỒ NĂNG LỰC RADAR HOLLAND THẬT</span>
                </div>
                <span className="bg-black text-[#00e5ff] px-2 py-0.5 border border-[#00e5ff] text-xs font-bold">
                  CHUẨN O*NET
                </span>
              </div>

              <div className="bg-[#000] p-4 border border-[#00e5ff]/40 flex justify-center items-center">
                <RadarChartCanvas traits={progress.radarTraits} size={300} />
              </div>

              {/* 6 Trait Score Readouts */}
              <div className="grid grid-cols-3 gap-2 text-xs text-center">
                <div className="bg-[#111] p-2 border border-[#00ff41]/40">
                  <span className="text-[10px] text-white/60 block">KIÊN CƯỜNG (R)</span>
                  <span className="font-black text-[#00ff41] text-sm">{progress.radarTraits.kiencuong}</span>
                </div>
                <div className="bg-[#111] p-2 border border-[#00ffff]/40">
                  <span className="text-[10px] text-white/60 block">PHÂN TÍCH (I)</span>
                  <span className="font-black text-[#00ffff] text-sm">{progress.radarTraits.phantich}</span>
                </div>
                <div className="bg-[#111] p-2 border border-[#ff00ff]/40">
                  <span className="text-[10px] text-white/60 block">SÁNG TẠO (A)</span>
                  <span className="font-black text-[#ff00ff] text-sm">{progress.radarTraits.sangtao}</span>
                </div>
                <div className="bg-[#111] p-2 border border-[#ffea00]/40">
                  <span className="text-[10px] text-white/60 block">CẢM THÔNG (S)</span>
                  <span className="font-black text-[#ffea00] text-sm">{progress.radarTraits.camthong}</span>
                </div>
                <div className="bg-[#111] p-2 border border-[#f97316]/40">
                  <span className="text-[10px] text-white/60 block">LÃNH ĐẠO (E)</span>
                  <span className="font-black text-[#f97316] text-sm">{progress.radarTraits.lanhdao}</span>
                </div>
                <div className="bg-[#111] p-2 border border-[#38bdf8]/40">
                  <span className="text-[10px] text-white/60 block">KỶ LUẬT (C)</span>
                  <span className="font-black text-[#38bdf8] text-sm">{progress.radarTraits.kyluat}</span>
                </div>
              </div>
            </div>

            {/* Right: Point Accumulation History Log */}
            <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-5 shadow-lg space-y-3">
              <div className="flex items-center justify-between border-b border-[#00ff41]/40 pb-2">
                <span className="font-bold uppercase text-[#00ff41] flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-[#ff00ff]" />
                  LỊCH SỬ TÍCH LŨY ĐIỂM NĂNG LỰC TỪ BÀI LÀM THẬT
                </span>
                <span className="text-xs text-[#ffea00] font-bold">
                  {progress.traitHistory.length} GIAO DỊCH
                </span>
              </div>

              <div className="space-y-2 max-h-[380px] overflow-y-auto pr-1">
                {progress.traitHistory.length === 0 ? (
                  <div className="p-6 text-center text-white/60 text-xs italic">
                    Chưa có điểm tích lũy nào. Hãy hoàn thành nhiệm vụ thực tập ở Màn 1 để ghi nhận điểm năng lực!
                  </div>
                ) : (
                  progress.traitHistory.map((item, idx) => (
                    <div key={idx} className="bg-[#111] p-3 border border-[#00ff41]/40 space-y-1.5 text-xs">
                      <div className="flex justify-between font-bold">
                        <span className="text-white">{item.source}</span>
                        <span className="text-[#00ff41]">{item.date}</span>
                      </div>
                      <div className="flex flex-wrap gap-1 text-[11px]">
                        {Object.entries(item.traitsAdded).map(([k, v]) => (
                          <span key={k} className="bg-[#000] text-[#00ff41] px-2 py-0.5 border border-[#00ff41]/70">
                            +{v} {k.toUpperCase()}
                          </span>
                        ))}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* SUB-SCREEN 4: NHẬT KÝ PHẢN TƯ THỰC TẬP (REFLECTION JOURNAL)               */}
      {/* ========================================================================= */}
      {activeSubScreen === 'reflection_journal' && (
        <div className="space-y-4">
          {/* Active Week Reflection Input */}
          <div className="bg-[#0c0c0c] border-2 border-[#ffea00] p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#ffea00]/40 pb-2">
              <div className="flex items-center gap-2 text-[#ffea00] font-black text-xs uppercase">
                <PenTool className="w-4 h-4" />
                <span>GHI CHÉP NHẬT KÝ PHẢN TƯ TUẦN {currentWeek} (+1 SP)</span>
              </div>
              <span className="text-xs bg-black text-[#ffea00] px-2 py-0.5 font-bold border border-[#ffea00]">
                TÍCH LŨY: {progress.reflectionPoints} ĐIỂM
              </span>
            </div>

            <p className="text-xs text-white/90 leading-relaxed">
              Hãy viết ngắn gọn 1-2 câu trả lời câu hỏi cốt lõi: <strong className="text-[#00ff41]">"Bạn đã học được kỹ năng hay bài học nghiệp vụ nào giá trị nhất trong tuần thực tập này?"</strong>
            </p>

            <div className="space-y-2">
              <textarea
                rows={3}
                value={reflectionText}
                onChange={(e) => { setReflectionText(e.target.value); setReflectionSaved(false); }}
                placeholder="Ví dụ: Tuần này tôi học được cách xử lý bình tĩnh trước phản ánh của phụ huynh, kiên nhẫn đồng hành cùng em Đức thay vì chỉ trách phạt..."
                className="w-full bg-[#000] text-[#00ff41] border border-[#00ff41] p-3 text-xs focus:outline-none focus:bg-[#111] leading-relaxed"
              />
              <div className="flex justify-end">
                <button
                  onClick={handleSaveReflection}
                  className="px-5 py-2 bg-[#ffea00] text-black font-black text-xs uppercase border border-white hover:bg-yellow-400 transition-all cursor-pointer"
                >
                  {reflectionSaved ? 'ĐÃ LƯU NHẬT KÝ ✓' : 'LƯU NHẬT KÝ PHẢN TƯ (+1 SP)'}
                </button>
              </div>
            </div>
          </div>

          {/* Full 8-Week Reflection Archive Log */}
          <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-5 space-y-3 shadow-lg">
            <div className="flex items-center justify-between border-b border-[#00ff41]/40 pb-2">
              <span className="font-bold uppercase text-[#00ff41] text-xs flex items-center gap-2">
                <BookOpen className="w-4 h-4" />
                LƯU TRỮ NHẬT KÝ PHẢN TƯ TOÀN BỘ 8 TUẦN THỰC TẬP
              </span>
              <span className="text-xs text-white/80">
                {Object.keys(progress.reflections).length}/8 Tuần Đã Ghi Chép
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
              {Array.from({ length: 8 }).map((_, wIdx) => {
                const wNum = wIdx + 1;
                const rText = progress.reflections[`${careerId}_w${wNum}`];
                const res = progress.weeklyResults[`${careerId}_w${wNum}`];

                return (
                  <div key={wNum} className="bg-[#111] p-3 border border-[#00ff41]/40 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-[#00ff41]">TUẦN {wNum}: {getTaskForCareerAndWeek(careerId, wNum).title}</span>
                      <span className={`text-[10px] px-1.5 py-0.2 font-bold ${res?.passed ? 'bg-[#00ff41] text-black' : 'bg-black text-white/50 border border-white/20'}`}>
                        {res?.passed ? 'PASSED' : 'CHƯA ĐẠT'}
                      </span>
                    </div>
                    {rText ? (
                      <p className="text-white/90 italic text-[11px] leading-relaxed">
                        "{rText}"
                      </p>
                    ) : (
                      <p className="text-white/40 text-[11px] italic">
                        Chưa có ghi chép phản tư cho tuần này.
                      </p>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
