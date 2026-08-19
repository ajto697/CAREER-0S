import React, { useState } from 'react';
import { CareerId } from '../types';
import { getNpcsForCareer, NpcProfile, NpcDialogOption } from '../data/npcGuidanceData';
import { PixelCharacterSprite } from './pixel/PixelArtSprites';
import { playSound } from '../utils/audio';
import { 
  Users, MessageSquare, Lightbulb, ShieldAlert, Sparkles, X, 
  HelpCircle, ChevronRight, BookOpen, Award, CheckCircle2, UserCheck, HeartHandshake
} from 'lucide-react';

interface Props {
  careerId: CareerId;
  currentWeek: number;
  isOpen: boolean;
  onClose: () => void;
  initialNpcId?: string;
}

export const NpcGuidanceModal: React.FC<Props> = ({
  careerId,
  currentWeek,
  isOpen,
  onClose,
  initialNpcId
}) => {
  const npcs = getNpcsForCareer(careerId);
  const [selectedNpcId, setSelectedNpcId] = useState<string>(initialNpcId || npcs[0]?.id || '');
  const [selectedQuestion, setSelectedQuestion] = useState<NpcDialogOption | null>(null);
  const [activeTab, setActiveTab] = useState<'weekly_advice' | 'qa_dialogue' | 'profile'>('weekly_advice');

  if (!isOpen) return null;

  const currentNpc = npcs.find(n => n.id === selectedNpcId) || npcs[0];
  const weeklyData = currentNpc.weeklyAdvice[currentWeek] || currentNpc.weeklyAdvice[1] || {
    week: currentWeek,
    mood: 'thinking' as const,
    dialogue: `Tuần ${currentWeek}: Hãy chú ý kiểm tra kỹ lưỡng quy trình chuyên môn và giữ vững chuẩn mực đạo đức nghề nghiệp.`,
    technicalTip: 'Áp dụng đúng phương pháp chuẩn mực và kiểm thử các trường hợp biên.',
    ethicsWarning: 'Mỗi quyết định đều có tác động trực tiếp đến người dùng và uy tín của bạn.',
    dialogOptions: []
  };

  const allQuestions: NpcDialogOption[] = [
    ...(weeklyData.dialogOptions || []),
    ...(currentNpc.generalDialogs || [])
  ];

  const handleSelectNpc = (npcId: string) => {
    setSelectedNpcId(npcId);
    setSelectedQuestion(null);
    playSound.click();
  };

  const handleSelectQuestion = (q: NpcDialogOption) => {
    setSelectedQuestion(q);
    playSound.click();
  };

  const getRelationBadge = (relation: string) => {
    switch (relation) {
      case 'mentor':
        return { label: 'MENTOR HƯỚNG DẪN', bg: 'bg-blue-900/40 text-blue-300 border-blue-600/50' };
      case 'colleague':
        return { label: 'ĐỒNG NGHIỆP', bg: 'bg-emerald-900/40 text-emerald-300 border-emerald-600/50' };
      case 'beneficiary':
        return { label: 'NGƯỜI HƯỞNG LỢI', bg: 'bg-amber-900/40 text-amber-300 border-amber-600/50' };
      case 'stakeholder':
      default:
        return { label: 'ĐỐI TÁC / QUỸ', bg: 'bg-purple-900/40 text-purple-300 border-purple-600/50' };
    }
  };

  const relBadge = getRelationBadge(currentNpc.relationType);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-4xl max-h-[90vh] flex flex-col bg-[#0f172a] border-2 border-[#00ff41] rounded-2xl shadow-[0_0_35px_rgba(0,255,65,0.25)] overflow-hidden font-mono text-slate-100">
        
        {/* TOP HEADER */}
        <div className="flex items-center justify-between px-5 py-3.5 bg-[#0a0f1d] border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#00ff41]/10 rounded-lg border border-[#00ff41]/40 text-[#00ff41]">
              <Users className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-white tracking-wide">
                  HỆ THỐNG NPC & MENTOR HƯỚNG DẪN
                </h2>
                <span className="px-2 py-0.5 text-[11px] font-semibold bg-[#00ff41]/15 text-[#00ff41] border border-[#00ff41]/30 rounded">
                  TUẦN {currentWeek}/8
                </span>
              </div>
              <p className="text-xs text-slate-400">
                Trao đổi chuyên môn, nhận bí kíp kỹ thuật và tháo gỡ tình huống đạo đức
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playSound.click();
              onClose();
            }}
            className="p-1.5 rounded-lg bg-slate-800/80 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-slate-700 hover:border-red-500/50 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* MAIN BODY: 2 COLUMNS */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-12 overflow-hidden min-h-0">
          
          {/* LEFT COLUMN: NPC SELECTION LIST (4 cols) */}
          <div className="md:col-span-4 bg-[#080d1a] border-r border-slate-800 p-3 flex flex-col gap-2 overflow-y-auto max-h-56 md:max-h-none">
            <div className="text-[11px] font-bold text-slate-400 px-2 py-1 uppercase tracking-wider flex items-center gap-1.5">
              <UserCheck className="w-3.5 h-3.5 text-[#00ff41]" />
              Nhân sự & Đồng nghiệp ({npcs.length})
            </div>

            {npcs.map(npc => {
              const isSelected = npc.id === selectedNpcId;
              const badge = getRelationBadge(npc.relationType);
              return (
                <button
                  key={npc.id}
                  onClick={() => handleSelectNpc(npc.id)}
                  className={`w-full text-left p-2.5 rounded-xl border transition-all flex items-center gap-3 ${
                    isSelected
                      ? 'bg-slate-800/90 border-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.15)] text-white'
                      : 'bg-slate-900/50 border-slate-800/80 hover:border-slate-700 text-slate-300 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="w-10 h-10 rounded-lg bg-black/50 border border-slate-700 flex items-center justify-center p-1 shrink-0">
                    <PixelCharacterSprite 
                      character={npc.spriteType as any}
                      mood={isSelected ? 'happy' : 'idle'}
                      size={32}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-xs truncate">{npc.name}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 truncate">{npc.role}</p>
                    <span className={`inline-block mt-1 px-1.5 py-0.2 text-[9px] border rounded ${badge.bg}`}>
                      {badge.label}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* RIGHT COLUMN: NPC INTERACTION & ADVICE (8 cols) */}
          <div className="md:col-span-8 flex flex-col bg-[#0d1424] overflow-y-auto">
            
            {/* NPC BANNER & PROFILE HEADER */}
            <div className="p-4 bg-gradient-to-r from-slate-900 via-slate-900/90 to-[#0d1424] border-b border-slate-800 flex items-center gap-4">
              <div className="w-16 h-16 rounded-2xl bg-black/60 border-2 border-[#00ff41]/60 flex items-center justify-center p-1.5 shadow-[0_0_20px_rgba(0,255,65,0.2)] shrink-0">
                <PixelCharacterSprite 
                  character={currentNpc.spriteType as any}
                  mood={weeklyData.mood}
                  size={52}
                />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-white">{currentNpc.name}</h3>
                  <span className={`px-2 py-0.5 text-[10px] border rounded-full font-bold ${relBadge.bg}`}>
                    {relBadge.label}
                  </span>
                </div>
                <p className="text-xs text-[#00ff41] font-semibold">{currentNpc.role}</p>
                <p className="text-[11px] text-slate-400 italic truncate">"{currentNpc.signatureQuote}"</p>
              </div>
            </div>

            {/* TABS */}
            <div className="flex items-center gap-2 px-4 pt-3 border-b border-slate-800 bg-[#0a0f1d]/50">
              <button
                onClick={() => {
                  playSound.click();
                  setActiveTab('weekly_advice');
                }}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'weekly_advice'
                    ? 'border-[#00ff41] text-[#00ff41] bg-[#00ff41]/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Lightbulb className="w-3.5 h-3.5" />
                Hướng Dẫn Tuần {currentWeek}
              </button>

              <button
                onClick={() => {
                  playSound.click();
                  setActiveTab('qa_dialogue');
                }}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'qa_dialogue'
                    ? 'border-[#00ff41] text-[#00ff41] bg-[#00ff41]/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <MessageSquare className="w-3.5 h-3.5" />
                Hỏi Đáp Chuyên Môn ({allQuestions.length})
              </button>

              <button
                onClick={() => {
                  playSound.click();
                  setActiveTab('profile');
                }}
                className={`px-3 py-2 text-xs font-bold border-b-2 transition-colors flex items-center gap-1.5 ${
                  activeTab === 'profile'
                    ? 'border-[#00ff41] text-[#00ff41] bg-[#00ff41]/5'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                Hồ Sơ Nhân Sự
              </button>
            </div>

            {/* TAB CONTENT */}
            <div className="p-4 flex-1 flex flex-col gap-4">
              
              {/* TAB 1: WEEKLY ADVICE */}
              {activeTab === 'weekly_advice' && (
                <div className="flex flex-col gap-3.5 animate-fade-in">
                  
                  {/* NPC SPEECH BUBBLE */}
                  <div className="relative p-4 rounded-xl bg-black/60 border border-[#00ff41]/40 shadow-inner">
                    <div className="flex items-center gap-2 mb-2 text-[#00ff41] text-xs font-bold">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Lời dặn dò đầu tuần từ {currentNpc.name}:</span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-200 leading-relaxed">
                      "{weeklyData.dialogue}"
                    </p>
                  </div>

                  {/* PRO-TIP BOX */}
                  <div className="p-3.5 rounded-xl bg-blue-950/30 border border-blue-700/40 text-blue-200 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                      <Lightbulb className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-blue-300 uppercase tracking-wide">
                        Mẹo Kỹ Thuật (Technical Pro-tip)
                      </h4>
                      <p className="text-xs text-blue-100 mt-1 leading-relaxed">
                        {weeklyData.technicalTip}
                      </p>
                    </div>
                  </div>

                  {/* ETHICS WARNING BOX */}
                  <div className="p-3.5 rounded-xl bg-amber-950/30 border border-amber-700/40 text-amber-200 flex items-start gap-3">
                    <div className="p-1.5 rounded-lg bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                      <ShieldAlert className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wide">
                        Lưu Ý Đạo Đức Nghề Nghiệp (Ethics Caution)
                      </h4>
                      <p className="text-xs text-amber-100 mt-1 leading-relaxed">
                        {weeklyData.ethicsWarning}
                      </p>
                    </div>
                  </div>

                  {/* QUICK ACCESS TO QUESTIONS */}
                  {weeklyData.dialogOptions && weeklyData.dialogOptions.length > 0 && (
                    <div className="mt-1">
                      <div className="text-[11px] font-bold text-slate-400 mb-2 uppercase flex items-center gap-1.5">
                        <HelpCircle className="w-3.5 h-3.5 text-[#00ff41]" />
                        Câu hỏi thường gặp tuần này:
                      </div>
                      <div className="grid grid-cols-1 gap-2">
                        {weeklyData.dialogOptions.map((q, idx) => (
                          <button
                            key={idx}
                            onClick={() => {
                              handleSelectQuestion(q);
                              setActiveTab('qa_dialogue');
                            }}
                            className="text-left p-2.5 rounded-lg bg-slate-900/80 hover:bg-slate-800 border border-slate-800 hover:border-[#00ff41]/60 text-xs text-slate-200 flex items-center justify-between gap-2 group transition-all"
                          >
                            <span className="group-hover:text-[#00ff41] transition-colors">{q.question}</span>
                            <ChevronRight className="w-4 h-4 text-slate-500 group-hover:text-[#00ff41] group-hover:translate-x-0.5 transition-all shrink-0" />
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 2: Q&A DIALOGUE */}
              {activeTab === 'qa_dialogue' && (
                <div className="flex flex-col gap-3.5 animate-fade-in">
                  
                  {/* QUESTION LIST */}
                  <div className="flex flex-col gap-2">
                    <span className="text-[11px] font-bold text-slate-400 uppercase">
                      Chọn chủ đề để hỏi {currentNpc.name}:
                    </span>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {allQuestions.map((q, idx) => {
                        const isQSelected = selectedQuestion?.question === q.question;
                        return (
                          <button
                            key={idx}
                            onClick={() => handleSelectQuestion(q)}
                            className={`text-left p-2.5 rounded-lg border text-xs transition-all flex items-start gap-2 ${
                              isQSelected
                                ? 'bg-emerald-950/50 border-[#00ff41] text-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.15)]'
                                : 'bg-slate-900/70 border-slate-800 hover:border-slate-700 text-slate-300 hover:bg-slate-800'
                            }`}
                          >
                            <MessageSquare className="w-3.5 h-3.5 shrink-0 mt-0.5 text-slate-400" />
                            <span className="line-clamp-2">{q.question}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* ANSWER DIALOGUE BOX */}
                  {selectedQuestion ? (
                    <div className="p-4 rounded-xl bg-black/70 border border-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.15)] flex flex-col gap-2 mt-2 animate-fade-in">
                      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                        <span className="text-xs font-bold text-white flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-[#00ff41]" />
                          {currentNpc.name} giải đáp:
                        </span>
                        <span className="text-[10px] px-2 py-0.5 bg-slate-800 text-slate-300 rounded font-semibold">
                          {selectedQuestion.category.toUpperCase()}
                        </span>
                      </div>

                      <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans mt-1">
                        "{selectedQuestion.answer}"
                      </p>

                      {selectedQuestion.statImpactHint && (
                        <div className="mt-2 text-[11px] text-[#00ff41] font-semibold bg-[#00ff41]/10 px-2.5 py-1 rounded border border-[#00ff41]/30 flex items-center gap-1.5">
                          <Sparkles className="w-3.5 h-3.5" />
                          Gợi ý chỉ số: {selectedQuestion.statImpactHint}
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-8 text-center border border-dashed border-slate-800 rounded-xl text-slate-500 text-xs">
                      Bấm vào một câu hỏi ở trên để lắng nghe giải đáp trực tiếp từ {currentNpc.name}.
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: NPC PROFILE */}
              {activeTab === 'profile' && (
                <div className="flex flex-col gap-3.5 animate-fade-in">
                  <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 flex flex-col gap-3">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase">Đơn vị & Tổ chức</h4>
                        <p className="text-xs text-white font-semibold mt-0.5">
                          {(currentNpc as any).companyOrOrg || currentNpc.department}
                        </p>
                      </div>

                      {(currentNpc as any).yearsExperience !== undefined && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase">Kinh nghiệm chuyên môn</h4>
                          <p className="text-xs text-[#00ff41] font-semibold mt-0.5">
                            {(currentNpc as any).yearsExperience} năm thực chiến trong ngành
                          </p>
                        </div>
                      )}

                      {(currentNpc as any).friendshipBond !== undefined && (
                        <div>
                          <h4 className="text-xs font-bold text-slate-400 uppercase">Độ gắn kết đồng nghiệp</h4>
                          <div className="flex items-center gap-2 mt-1">
                            <div className="flex-1 h-2 bg-black/60 rounded-full overflow-hidden border border-emerald-500/40">
                              <div 
                                className="h-full bg-gradient-to-r from-emerald-500 to-[#00ff41]" 
                                style={{ width: `${(currentNpc as any).friendshipBond}%` }}
                              />
                            </div>
                            <span className="text-[11px] font-bold text-emerald-400">
                              {(currentNpc as any).friendshipBond}%
                            </span>
                          </div>
                        </div>
                      )}
                    </div>

                    {(currentNpc as any).mentorshipStyle && (
                      <div className="p-2.5 rounded-lg bg-blue-950/30 border border-blue-600/30">
                        <h4 className="text-xs font-bold text-blue-300 uppercase">Phong cách Mentor & Trọng tâm đánh giá</h4>
                        <p className="text-xs text-slate-200 mt-1">
                          {(currentNpc as any).evaluationFocus || 'Đề cao tính chính xác, tư duy hệ thống và chuẩn mực đạo đức.'}
                        </p>
                      </div>
                    )}

                    {(currentNpc as any).collaborationStyle && (
                      <div className="p-2.5 rounded-lg bg-emerald-950/30 border border-emerald-600/30">
                        <h4 className="text-xs font-bold text-emerald-300 uppercase">Phong cách phối hợp & Lời khuyên hỗ trợ</h4>
                        <p className="text-xs text-slate-200 mt-1">
                          {(currentNpc as any).supportTip || (currentNpc as any).collaborationStyle}
                        </p>
                      </div>
                    )}

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Tính cách & Đặc điểm</h4>
                      <p className="text-xs text-slate-200 mt-0.5 leading-relaxed">{currentNpc.personality}</p>
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-slate-400 uppercase">Triết lý nghề nghiệp</h4>
                      <p className="text-xs text-[#00ff41] italic mt-0.5">"{currentNpc.signatureQuote}"</p>
                    </div>

                    {(currentNpc as any).keyAchievements && (currentNpc as any).keyAchievements.length > 0 && (
                      <div>
                        <h4 className="text-xs font-bold text-slate-400 uppercase mb-1.5">Thành tích & Dấu ấn tiêu biểu</h4>
                        <ul className="space-y-1">
                          {(currentNpc as any).keyAchievements.map((ach: string, idx: number) => (
                            <li key={idx} className="text-xs text-slate-300 flex items-start gap-1.5">
                              <span className="text-[#00ff41] font-bold">✓</span>
                              <span>{ach}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </div>
              )}

            </div>

            {/* FOOTER */}
            <div className="p-3 bg-[#0a0f1d] border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">
                Ấn <kbd className="px-1.5 py-0.5 bg-slate-800 text-slate-300 rounded border border-slate-700 text-[10px]">ESC</kbd> hoặc nút đóng để tiếp tục làm việc
              </span>

              <button
                onClick={() => {
                  playSound.click();
                  onClose();
                }}
                className="px-4 py-1.5 rounded-lg bg-[#00ff41] hover:bg-[#00e5ff] text-black font-bold text-xs transition-all shadow-[0_0_15px_rgba(0,255,65,0.3)] flex items-center gap-1.5"
              >
                <CheckCircle2 className="w-4 h-4" />
                Đã Rõ Hướng Dẫn
              </button>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
