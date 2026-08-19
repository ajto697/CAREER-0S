import React, { useState } from 'react';
import { CareerId, Settings, SkillTreeNode, UserProgress } from '../types';
import { CAREER_SKILL_TREES, getSkillTreeForCareer } from '../data/skillTreeData';
import { playSound } from '../utils/audio';
import { 
  Sparkles, Zap, Lock, CheckCircle2, ShieldCheck, Cpu, 
  Stethoscope, Activity, Tv, Bookmark, Users, Heart, 
  Mail, MessageSquare, GraduationCap, Mic, Camera, Globe, 
  AlertTriangle, Newspaper, TestTube, Thermometer, FlaskConical,
  Code, GitBranch, Layers, Search, Terminal, X, Wrench, ArrowRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  careerId: CareerId;
  progress: UserProgress;
  settings: Settings;
  onUpdateProgress: (newProgress: UserProgress) => void;
  onClose: () => void;
}

export const CareerSkillTreeModal: React.FC<Props> = ({
  careerId,
  progress,
  settings,
  onUpdateProgress,
  onClose
}) => {
  const skillTree = getSkillTreeForCareer(careerId);
  const currentSkillPoints = progress.skillPoints ?? 2; // Default base 2 SP
  const unlockedList = progress.unlockedSkills?.[careerId] || [];
  const equippedToolId = progress.equippedTool?.[careerId] || unlockedList[0] || '';

  const [selectedNodeId, setSelectedNodeId] = useState<string>(unlockedList[0] || skillTree[0].id);

  const selectedNode = skillTree.find(n => n.id === selectedNodeId) || skillTree[0];
  const isSelectedUnlocked = unlockedList.includes(selectedNode.id);

  // Check prerequisites
  const canUnlock = (node: SkillTreeNode) => {
    if (unlockedList.includes(node.id)) return false;
    if (currentSkillPoints < node.cost) return false;
    if (node.prerequisites.length === 0) return true;
    return node.prerequisites.every(preId => unlockedList.includes(preId));
  };

  const handleUnlockSkill = (node: SkillTreeNode) => {
    if (!canUnlock(node)) return;

    playSound.pass(settings.retroSound);
    confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });

    const newUnlocked = [...unlockedList, node.id];
    const newSP = currentSkillPoints - node.cost;

    const newUnlockedMap = {
      ...(progress.unlockedSkills || {}),
      [careerId]: newUnlocked
    };

    // Auto-equip if first unlocked or highest tier
    const newEquippedMap = {
      ...(progress.equippedTool || {}),
      [careerId]: node.id
    };

    const updated: UserProgress = {
      ...progress,
      skillPoints: newSP,
      unlockedSkills: newUnlockedMap,
      equippedTool: newEquippedMap
    };

    onUpdateProgress(updated);
  };

  const handleEquipTool = (nodeId: string) => {
    playSound.click(settings.retroSound);
    const newEquippedMap = {
      ...(progress.equippedTool || {}),
      [careerId]: nodeId
    };

    onUpdateProgress({
      ...progress,
      equippedTool: newEquippedMap
    });
  };

  const renderIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'Code': return <Code className={className} />;
      case 'GitBranch': return <GitBranch className={className} />;
      case 'Layers': return <Layers className={className} />;
      case 'Search': return <Search className={className} />;
      case 'Terminal': return <Terminal className={className} />;
      case 'Stethoscope': return <Stethoscope className={className} />;
      case 'Activity': return <Activity className={className} />;
      case 'Zap': return <Zap className={className} />;
      case 'ShieldAlert': return <AlertTriangle className={className} />;
      case 'Tv': return <Tv className={className} />;
      case 'Bookmark': return <Bookmark className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Heart': return <Heart className={className} />;
      case 'Mail': return <Mail className={className} />;
      case 'MessageSquare': return <MessageSquare className={className} />;
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'Mic': return <Mic className={className} />;
      case 'Camera': return <Camera className={className} />;
      case 'Globe': return <Globe className={className} />;
      case 'AlertTriangle': return <AlertTriangle className={className} />;
      case 'Newspaper': return <Newspaper className={className} />;
      case 'TestTube': return <TestTube className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      case 'Thermometer': return <Thermometer className={className} />;
      case 'FlaskConical': return <FlaskConical className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Sparkles': return <Sparkles className={className} />;
      default: return <Wrench className={className} />;
    }
  };

  // Group by tier
  const tier1Nodes = skillTree.filter(n => n.tier === 1);
  const tier2Nodes = skillTree.filter(n => n.tier === 2);
  const tier3Nodes = skillTree.filter(n => n.tier === 3);

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-[#0a0d0a] border-2 border-[#00ff41] w-full max-w-5xl shadow-[0_0_30px_rgba(0,255,65,0.3)] font-mono text-[#00ff41] relative my-auto">
        {/* Top Title Bar */}
        <div className="bg-[#111] p-3.5 sm:p-4 border-b-2 border-[#00ff41] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-black border border-[#00ff41] text-[#ff00ff]">
              <Sparkles className="w-6 h-6 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-[#00ff41] text-black font-black px-2 py-0.2 uppercase">
                  CAREER SKILL TREE // HỆ THỐNG CÂY KỸ NĂNG NGHỀ NGHIỆP
                </span>
                <span className="text-[10px] text-[#ffea00] border border-[#ffea00]/40 px-1.5 py-0.2 uppercase">
                  {careerId.toUpperCase()} SPECIALIZATION
                </span>
              </div>
              <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-wider mt-0.5">
                MỞ KHÓA DỤNG CỤ CHUYÊN DỤNG & NÂNG CẤP CƠ CHẾ TƯƠNG TÁC
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* SP Point Balance Badge */}
            <div className="bg-black border-2 border-[#ffea00] px-3 py-1.5 text-center shadow-[0_0_10px_rgba(255,234,0,0.3)]">
              <div className="text-[9px] text-white/70 uppercase">ĐIỂM KỸ NĂNG (SP)</div>
              <div className="text-lg font-black text-[#ffea00] leading-none flex items-center justify-center gap-1">
                <Zap className="w-4 h-4 fill-current" />
                <span>{currentSkillPoints} SP</span>
              </div>
            </div>

            <button
              onClick={() => {
                playSound.click(settings.retroSound);
                onClose();
              }}
              className="p-1.5 bg-black border border-white/40 text-white hover:border-[#ff00ff] hover:text-[#ff00ff] transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-4 sm:p-5 grid grid-cols-1 lg:grid-cols-12 gap-5">
          {/* Left Column (lg:7) - Interactive Visual Skill Tree Graph */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex items-center justify-between text-xs border-b border-[#00ff41]/30 pb-2">
              <span className="font-bold text-white uppercase">CÂY TIẾN TRÌNH 3 CẤP ĐỘ (TIER 1 ➔ TIER 3)</span>
              <span className="text-[10px] text-[#00ff41]/80">
                Đã mở: {unlockedList.length}/{skillTree.length} kỹ năng
              </span>
            </div>

            <div className="space-y-4 pt-1">
              {/* Tier 1 Row */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-[#00ff41] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#00ff41] inline-block"></span>
                  <span>TIER I: CÔNG CỤ NHẬP MÔN CƠ BẢN (1 SP)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tier1Nodes.map(node => {
                    const isUnlocked = unlockedList.includes(node.id);
                    const isEquipped = equippedToolId === node.id;
                    const isSelected = selectedNodeId === node.id;
                    const available = canUnlock(node);

                    return (
                      <div
                        key={node.id}
                        onClick={() => {
                          playSound.click(settings.retroSound);
                          setSelectedNodeId(node.id);
                        }}
                        className={`p-3 border-2 transition-all cursor-pointer relative flex items-start gap-3 ${
                          isSelected
                            ? 'border-white bg-[#0f240f] shadow-[0_0_15px_rgba(0,255,65,0.4)] scale-[1.02]'
                            : isUnlocked
                            ? 'border-[#00ff41] bg-[#051105] hover:bg-[#0a1f0a]'
                            : available
                            ? 'border-[#ffea00]/80 bg-[#141205] hover:border-[#ffea00]'
                            : 'border-gray-800 bg-[#060606] opacity-60'
                        }`}
                      >
                        {isEquipped && (
                          <span className="absolute -top-2.5 right-2 bg-[#ff00ff] text-black text-[9px] font-black px-1.5 py-0.2 uppercase border border-white">
                            ĐANG TRANG BỊ
                          </span>
                        )}

                        <div className={`p-2 border ${isUnlocked ? 'border-[#00ff41] bg-black text-[#00ff41]' : 'border-gray-700 bg-black text-gray-400'}`}>
                          {renderIcon(node.iconName, "w-5 h-5")}
                        </div>

                        <div className="space-y-0.5 truncate">
                          <div className="text-xs font-bold text-white truncate">{node.name}</div>
                          <div className="text-[10px] text-[#ffea00] font-bold">{node.specialToolName}</div>
                          <div className="text-[9px] text-[#00ff41]/70">Chi phí: {node.cost} SP</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Connecting Tree Divider */}
              <div className="flex justify-center my-1 text-[#00ff41]/40 text-xs font-mono">
                ▼ ▼ ▼ (Yêu cầu hoàn thành Tier 1 để mở khóa Tier 2) ▼ ▼ ▼
              </div>

              {/* Tier 2 Row */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-[#ffea00] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#ffea00] inline-block"></span>
                  <span>TIER II: THIẾT BỊ NÂNG CAO TƯƠNG TÁC (2 SP)</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {tier2Nodes.map(node => {
                    const isUnlocked = unlockedList.includes(node.id);
                    const isEquipped = equippedToolId === node.id;
                    const isSelected = selectedNodeId === node.id;
                    const available = canUnlock(node);

                    return (
                      <div
                        key={node.id}
                        onClick={() => {
                          playSound.click(settings.retroSound);
                          setSelectedNodeId(node.id);
                        }}
                        className={`p-3 border-2 transition-all cursor-pointer relative flex items-start gap-3 ${
                          isSelected
                            ? 'border-white bg-[#0f240f] shadow-[0_0_15px_rgba(255,234,0,0.4)] scale-[1.02]'
                            : isUnlocked
                            ? 'border-[#ffea00] bg-[#141205] hover:bg-[#1f1a05]'
                            : available
                            ? 'border-[#ffea00]/80 bg-[#141205] hover:border-[#ffea00]'
                            : 'border-gray-800 bg-[#060606] opacity-60'
                        }`}
                      >
                        {isEquipped && (
                          <span className="absolute -top-2.5 right-2 bg-[#ff00ff] text-black text-[9px] font-black px-1.5 py-0.2 uppercase border border-white">
                            ĐANG TRANG BỊ
                          </span>
                        )}

                        <div className={`p-2 border ${isUnlocked ? 'border-[#ffea00] bg-black text-[#ffea00]' : 'border-gray-700 bg-black text-gray-400'}`}>
                          {renderIcon(node.iconName, "w-5 h-5")}
                        </div>

                        <div className="space-y-0.5 truncate">
                          <div className="text-xs font-bold text-white truncate">{node.name}</div>
                          <div className="text-[10px] text-[#ffea00] font-bold">{node.specialToolName}</div>
                          <div className="text-[9px] text-[#ffea00]/80">Chi phí: {node.cost} SP</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Connecting Tree Divider */}
              <div className="flex justify-center my-1 text-[#ff00ff]/50 text-xs font-mono">
                ▼ ▼ ▼ (Yêu cầu hoàn thành Tier 2 để chạm mốc Tuyệt Kỹ) ▼ ▼ ▼
              </div>

              {/* Tier 3 Row */}
              <div className="space-y-1.5">
                <div className="text-[10px] font-bold text-[#ff00ff] uppercase tracking-wider flex items-center gap-1.5">
                  <span className="w-2 h-2 bg-[#ff00ff] inline-block"></span>
                  <span>TIER III: SIÊU THIẾT BỊ ĐỘT PHÁ TUẦN TỐT NGHIỆP (3 SP)</span>
                </div>
                <div className="grid grid-cols-1 gap-2.5">
                  {tier3Nodes.map(node => {
                    const isUnlocked = unlockedList.includes(node.id);
                    const isEquipped = equippedToolId === node.id;
                    const isSelected = selectedNodeId === node.id;
                    const available = canUnlock(node);

                    return (
                      <div
                        key={node.id}
                        onClick={() => {
                          playSound.click(settings.retroSound);
                          setSelectedNodeId(node.id);
                        }}
                        className={`p-3 border-2 transition-all cursor-pointer relative flex items-start gap-3 ${
                          isSelected
                            ? 'border-white bg-[#220a22] shadow-[0_0_20px_rgba(255,0,255,0.5)] scale-[1.01]'
                            : isUnlocked
                            ? 'border-[#ff00ff] bg-[#1a071a] hover:bg-[#250a25]'
                            : available
                            ? 'border-[#ff00ff]/70 bg-[#140614] hover:border-[#ff00ff]'
                            : 'border-gray-800 bg-[#060606] opacity-60'
                        }`}
                      >
                        {isEquipped && (
                          <span className="absolute -top-2.5 right-2 bg-[#ff00ff] text-black text-[9px] font-black px-1.5 py-0.2 uppercase border border-white">
                            ĐANG TRANG BỊ
                          </span>
                        )}

                        <div className={`p-2 border ${isUnlocked ? 'border-[#ff00ff] bg-black text-[#ff00ff]' : 'border-gray-700 bg-black text-gray-400'}`}>
                          {renderIcon(node.iconName, "w-6 h-6")}
                        </div>

                        <div className="space-y-0.5 truncate flex-1">
                          <div className="text-xs font-bold text-white flex items-center justify-between">
                            <span className="truncate">{node.name}</span>
                            <span className="text-[10px] text-[#ff00ff] font-bold">CHI PHÍ: {node.cost} SP</span>
                          </div>
                          <div className="text-[11px] text-[#ffea00] font-bold">{node.specialToolName}</div>
                          <div className="text-[10px] text-[#ff00ff]/90">{node.effectDescription}</div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column (lg:5) - Selected Node Details & Unlock Action */}
          <div className="lg:col-span-5 bg-[#040604] border-2 border-[#00ff41] p-4 sm:p-5 flex flex-col justify-between space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between border-b border-[#00ff41]/40 pb-2">
                <span className="text-[10px] text-white/70 uppercase">CHI TIẾT KỸ NĂNG & DỤNG CỤ</span>
                <span className={`text-[10px] font-bold px-2 py-0.5 border ${
                  isSelectedUnlocked
                    ? 'border-[#00ff41] text-[#00ff41] bg-black'
                    : 'border-[#ffea00] text-[#ffea00] bg-black'
                }`}>
                  {isSelectedUnlocked ? 'ĐÃ MỞ KHÓA' : `YÊU CẦU: ${selectedNode.cost} SP`}
                </span>
              </div>

              {/* Tool Icon & Big Name */}
              <div className="flex items-center gap-3">
                <div className="p-3 bg-black border-2 border-[#00ff41] text-[#ff00ff]">
                  {renderIcon(selectedNode.iconName, "w-8 h-8")}
                </div>
                <div>
                  <h4 className="text-base font-black text-white uppercase">{selectedNode.name}</h4>
                  <div className="text-xs text-[#ffea00] font-bold">{selectedNode.specialToolName}</div>
                  <div className="text-[10px] text-white/60">Tier {selectedNode.tier} • {careerId.toUpperCase()} Track</div>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-1 bg-black p-3 border border-[#00ff41]/30 text-xs">
                <div className="text-[10px] text-[#00ff41] font-bold uppercase">MÔ TẢ CÔNG DỤNG CHUYÊN MÔN:</div>
                <p className="text-white/80 leading-relaxed text-[11px]">
                  {selectedNode.description}
                </p>
              </div>

              {/* Interaction Gameplay Bonus */}
              <div className="space-y-1 bg-black p-3 border border-[#ff00ff]/40 text-xs">
                <div className="text-[10px] text-[#ff00ff] font-bold uppercase flex items-center gap-1">
                  <Zap className="w-3.5 h-3.5" />
                  <span>CƠ CHẾ THAY ĐỔI TƯƠNG TÁC (GAMEPLAY EFFECT):</span>
                </div>
                <p className="text-[#ffea00] leading-relaxed text-[11px] font-bold">
                  {selectedNode.effectDescription}
                </p>
              </div>

              {/* Prerequisites check */}
              {selectedNode.prerequisites.length > 0 && (
                <div className="text-[10px] text-white/70 space-y-1">
                  <div className="font-bold">ĐIỀU KIỆN TIÊN QUYẾT:</div>
                  <div className="flex flex-wrap gap-1">
                    {selectedNode.prerequisites.map(preId => {
                      const preNode = skillTree.find(n => n.id === preId);
                      const isPreMet = unlockedList.includes(preId);
                      return (
                        <span 
                          key={preId} 
                          className={`px-1.5 py-0.5 border text-[9px] ${
                            isPreMet ? 'border-[#00ff41] text-[#00ff41]' : 'border-red-500 text-red-400'
                          }`}
                        >
                          {isPreMet ? '✓' : '✗'} {preNode?.name || preId}
                        </span>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions */}
            <div className="space-y-2 pt-3 border-t border-[#00ff41]/30">
              {isSelectedUnlocked ? (
                <div className="space-y-2">
                  <div className="p-2 bg-[#00ff41]/10 border border-[#00ff41] text-[#00ff41] text-xs text-center font-bold flex items-center justify-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>KỸ NĂNG ĐÃ MỞ KHÓA HOÀN TẤT</span>
                  </div>

                  {equippedToolId !== selectedNode.id ? (
                    <button
                      onClick={() => handleEquipTool(selectedNode.id)}
                      className="w-full py-2.5 bg-[#ff00ff] text-black font-black text-xs uppercase hover:bg-white transition-colors cursor-pointer border border-white"
                    >
                      KÍCH HOẠT DỤNG CỤ NÀY (EQUIP TOOL)
                    </button>
                  ) : (
                    <div className="text-center text-[10px] text-[#ffea00] font-bold">
                      ★ DỤNG CỤ NÀY ĐANG ĐƯỢC TRANG BỊ TRONG PHÒNG LÀM VIỆC ★
                    </div>
                  )}
                </div>
              ) : (
                <button
                  disabled={!canUnlock(selectedNode)}
                  onClick={() => handleUnlockSkill(selectedNode)}
                  className={`w-full py-3 text-xs font-black uppercase flex items-center justify-center gap-2 border-2 transition-all cursor-pointer ${
                    canUnlock(selectedNode)
                      ? 'bg-[#00ff41] text-black border-white hover:bg-[#00e53a] shadow-[0_0_15px_rgba(0,255,65,0.6)]'
                      : 'bg-[#111] text-gray-500 border-gray-800 cursor-not-allowed'
                  }`}
                >
                  {canUnlock(selectedNode) ? (
                    <>
                      <Zap className="w-4 h-4 fill-current" />
                      <span>MỞ KHÓA KỸ NĂNG ({selectedNode.cost} SP)</span>
                    </>
                  ) : (
                    <>
                      <Lock className="w-4 h-4" />
                      <span>CHƯA ĐỦ ĐIỀU KIỆN (CẦN {selectedNode.cost} SP & KỸ NĂNG TRƯỚC)</span>
                    </>
                  )}
                </button>
              )}

              <div className="text-[9px] text-white/50 text-center">
                Mẹo: Kiếm thêm +2 SP khi vượt qua mỗi tuần thực tập và +1 SP khi viết bài phản tư sư phạm!
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
