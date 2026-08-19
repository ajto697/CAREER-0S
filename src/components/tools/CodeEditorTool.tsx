import React, { useState, useEffect } from 'react';
import { TaskEvaluationResult, Settings, SoftwareState } from '../../types';
import { playSound } from '../../utils/audio';
import {
  Play,
  CheckCircle2,
  XCircle,
  Terminal,
  Cpu,
  RotateCcw,
  Bug,
  Sparkles,
  Zap,
  Wrench,
  Search,
  GitPullRequest,
  GitBranch,
  Activity,
  Server,
  Check,
  Layers,
  Code,
  ShieldCheck,
  AlertTriangle,
  Send,
  MessageSquare,
  Users,
  Clock,
  Shield,
  HelpCircle,
  FileCode,
  Lock,
  ChevronRight
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  taskData: {
    initialCode: string;
    instructions: string;
    testCases: Array<{ input: any[]; expected: any; description: string }>;
    title?: string;
    storyContext?: string;
  };
  settings: Settings;
  onEvaluateResult: (res: TaskEvaluationResult) => void;
  currentWeek?: number;
  softwareState?: SoftwareState;
  onUpdateSoftwareState?: (newState: SoftwareState) => void;
  equippedToolId?: string;
  unlockedSkills?: string[];
}

const DEFAULT_STATE: SoftwareState = {
  systemStability: 75,
  techDebt: 20,
  teamMorale: 80,
  userTrust: 75,
  productVelocity: 70,
  securityCompliance: 85,
  mentorTrustVu: 70,
  flags: []
};

export const CodeEditorTool: React.FC<Props> = ({
  taskData,
  settings,
  onEvaluateResult,
  currentWeek = 1,
  softwareState,
  onUpdateSoftwareState,
  equippedToolId,
  unlockedSkills = []
}) => {
  const [state, setState] = useState<SoftwareState>(softwareState || DEFAULT_STATE);
  const [activeTab, setActiveTab] = useState<'editor' | 'git_pr' | 'telemetry' | 'dilemma_essay'>('editor');
  const [userCode, setUserCode] = useState(taskData.initialCode);
  const [logs, setLogs] = useState<string[]>([]);
  const [executionStats, setExecutionStats] = useState<{ timeMs: number; memoryKb: number } | null>(null);
  const [evalResult, setEvalResult] = useState<TaskEvaluationResult | null>(null);
  const [activeCopilotHint, setActiveCopilotHint] = useState<string | null>(null);

  // Dilemma and Architectural Essay state
  const [selectedEthicalChoice, setSelectedEthicalChoice] = useState<string>('balanced');
  const [architecturalEssay, setArchitecturalEssay] = useState<string>('');
  const [rubricFeedbackList, setRubricFeedbackList] = useState<{ label: string; passed: boolean; note: string }[]>([]);

  // Debugger breakpoints state
  const [breakpoints, setBreakpoints] = useState<number[]>([]);

  // Skills
  const hasLinter = unlockedSkills.includes('ide_linter') || equippedToolId === 'ide_linter';
  const hasDebugger = unlockedSkills.includes('debugger_ast') || equippedToolId === 'debugger_ast';
  const hasCopilot = unlockedSkills.includes('ai_quantum_copilot') || equippedToolId === 'ai_quantum_copilot';

  useEffect(() => {
    if (softwareState) {
      setState(softwareState);
    }
  }, [softwareState]);

  useEffect(() => {
    setUserCode(taskData.initialCode);
    setLogs([]);
    setEvalResult(null);
    setRubricFeedbackList([]);
    setArchitecturalEssay('');
  }, [currentWeek, taskData.initialCode]);

  const updateAndSaveState = (updater: (prev: SoftwareState) => SoftwareState) => {
    const newState = updater(state);
    setState(newState);
    if (onUpdateSoftwareState) {
      onUpdateSoftwareState(newState);
    }
  };

  // Telemetry real-time simulation
  const [telemetry, setTelemetry] = useState({
    cpuLoad: 24,
    memoryUsage: 42.6,
    rps: 1250,
    latencyMs: 18.4,
    uptime: '99.98%'
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        cpuLoad: Math.min(95, Math.max(12, Math.round(prev.cpuLoad + (Math.random() * 6 - 3)))),
        memoryUsage: Math.min(80, Math.max(30, Math.round((prev.memoryUsage + (Math.random() * 1.2 - 0.6)) * 10) / 10)),
        rps: Math.round(prev.rps + (Math.random() * 80 - 40)),
        latencyMs: Math.round((prev.latencyMs + (Math.random() * 1.5 - 0.75)) * 10) / 10,
        uptime: state.systemStability >= 70 ? '99.98%' : '98.42%'
      }));
    }, 2000);
    return () => clearInterval(interval);
  }, [state.systemStability]);

  const toggleBreakpoint = (lineNum: number) => {
    playSound.click(settings.retroSound);
    setBreakpoints(prev =>
      prev.includes(lineNum) ? prev.filter(l => l !== lineNum) : [...prev, lineNum]
    );
  };

  const handleUseCopilot = () => {
    playSound.click(settings.retroSound);
    confetti({ particleCount: 30, spread: 50 });

    if (hasCopilot) {
      setActiveCopilotHint('🤖 [AI QUANTUM COPILOT]: Phân tích AST cho thấy hàm cần xử lý chặt chẽ các trường hợp biên (edge cases), kiểm tra null/undefined và tối ưu Big-O để không làm tăng CPU load.');
    } else if (hasDebugger) {
      setActiveCopilotHint('🔍 [AST INSPECTOR]: Cây cú pháp phát hiện vị trí return hoặc điều kiện logic đang bị lệch so với kỳ vọng của test case.');
    } else if (hasLinter) {
      setActiveCopilotHint('⚡ [LINTER PRO]: Cú pháp tổng thể hợp lệ, không có lỗi biên dịch cơ bản. Hãy kiểm tra các trường hợp ngoại lệ đầu vào.');
    }
  };

  // Comprehensive Evaluation for Code and Ethical Essay
  const handleRunAndEvaluate = () => {
    playSound.click(settings.retroSound);
    setLogs([]);
    const testLogs: string[] = [];
    const feedbackItems: { label: string; passed: boolean; note: string }[] = [];
    let passedCount = 0;
    const totalTests = taskData.testCases.length;
    const startTime = performance.now();

    try {
      const fnNameMatch = userCode.match(/function\s+([a-zA-Z0-9_]+)/);
      const fnName = fnNameMatch ? fnNameMatch[1] : null;

      if (!fnName) {
        throw new Error('Không tìm thấy khai báo hàm hợp lệ trong mã nguồn! Hãy giữ cú pháp: function <tên_hàm>(...)');
      }

      const fullScript = `${userCode}; return ${fnName};`;
      const fn = new Function(fullScript)();

      taskData.testCases.forEach((tc, idx) => {
        testLogs.push(`▶ RUNNING AUTOMATED TEST #${idx + 1}: ${tc.description}`);
        const actual = fn(...tc.input);

        const actualStr = JSON.stringify(actual);
        const expectedStr = JSON.stringify(tc.expected);

        if (actualStr === expectedStr) {
          testLogs.push(`  [PASS] Output = ${actualStr} (Chính xác)`);
          passedCount++;
        } else {
          testLogs.push(`  [FAIL] Kỳ vọng ${expectedStr} nhưng kết quả trả về = ${actualStr}`);
        }
      });

      const endTime = performance.now();
      const elapsedMs = Math.max(0.12, Math.round((endTime - startTime) * 100) / 100);
      setExecutionStats({ timeMs: elapsedMs, memoryKb: 128 + Math.floor(userCode.length * 0.4) });

      const codePassed = passedCount === totalTests;

      feedbackItems.push({
        label: `Unit Test Suite (${passedCount}/${totalTests} Passed)`,
        passed: codePassed,
        note: codePassed
          ? `Vượt qua toàn bộ ${totalTests} test cases biên với thời gian thực thi tối ưu ${elapsedMs}ms.`
          : `Thất bại tại ${totalTests - passedCount} test cases. Hãy kiểm tra lại logic điều kiện.`
      });

      // Rubric & Semantic Evaluation for Essay & Ethical Choice
      const essayLower = architecturalEssay.toLowerCase();
      let essayPassed = true;
      let mentorFeedback = '';

      if (currentWeek === 1) {
        const hasStrictType = /===|kiểu dữ liệu|type|tuyệt đối|strict|ép kiểu|sai lệch/.test(essayLower);
        const hasFairness = /công bằng|học bổng|minh bạch|chính xác|điểm số|học sinh/.test(essayLower);
        const hasMinLen = architecturalEssay.trim().length >= 35;

        feedbackItems.push({
          label: 'Lý giải toán tử so sánh tuyệt đối (===)',
          passed: hasStrictType,
          note: hasStrictType ? 'Nắm rõ rủi ro ép kiểu ngầm (type coercion) trong JS.' : 'Chưa phân tích rõ tại sao cần dùng ===.'
        });
        feedbackItems.push({
          label: 'Phân tích tính công bằng trong xét duyệt',
          passed: hasFairness,
          note: hasFairness ? 'Thấu hiểu tác động của dòng code tới cơ hội học sinh.' : 'Chưa liên hệ tới đạo đức công bằng điểm số.'
        });
        feedbackItems.push({
          label: 'Độ sâu luận giải kiến trúc (≥35 ký tự)',
          passed: hasMinLen,
          note: hasMinLen ? 'Lập luận đầy đủ, rõ ràng.' : 'Nội dung phân tích quá ngắn.'
        });

        essayPassed = hasStrictType && hasFairness && hasMinLen;

        updateAndSaveState(prev => {
          const nextFlags = [...prev.flags];
          let { systemStability, techDebt, mentorTrustVu, userTrust } = prev;

          if (selectedEthicalChoice === 'reject_hack') {
            nextFlags.push('w1_nam_strict_code');
            mentorTrustVu = Math.min(100, mentorTrustVu + 10);
            systemStability = Math.min(100, systemStability + 10);
            techDebt = Math.max(0, techDebt - 5);
          } else if (selectedEthicalChoice === 'allow_hack') {
            nextFlags.push('w1_nam_hack_approved');
            mentorTrustVu = Math.max(20, mentorTrustVu - 15);
            techDebt = Math.min(100, techDebt + 20);
            systemStability = Math.max(30, systemStability - 10);
          }

          return { ...prev, systemStability, techDebt, mentorTrustVu, userTrust, flags: nextFlags };
        });

        mentorFeedback = essayPassed && codePassed
          ? 'Anh Trần Vũ: "Code clean, tư duy chặt chẽ về type safety. Giữ vững tinh thần không thỏa hiệp với nợ kỹ thuật nhé!"'
          : 'Anh Trần Vũ: "Cần chú ý kỹ các trường hợp ép kiểu và giải trình rõ ràng hơn."';
      } else if (currentWeek === 2) {
        const hasArrayLogic = /filter|mảng|điều kiện|biên|gpa|lọc|phần tử/.test(essayLower);
        const hasIntegrity = /trung thực|quy chuẩn|không làm tròn|chính sách|nguyên tắc|công tâm/.test(essayLower);
        const hasMinLen = architecturalEssay.trim().length >= 35;

        feedbackItems.push({
          label: 'Xử lý logic mảng & dữ liệu biên',
          passed: hasArrayLogic,
          note: hasArrayLogic ? 'Hiểu rõ cơ chế lọc mảng và điều kiện biên.' : 'Chưa phân tích thuật toán lọc danh sách.'
        });
        feedbackItems.push({
          label: 'Bảo vệ tính liêm chính dữ liệu khen thưởng',
          passed: hasIntegrity,
          note: hasIntegrity ? 'Giữ vững chuẩn mực, không can thiệp số liệu thiên vị.' : 'Chưa nêu rõ lập trường trước yêu cầu sửa điểm.'
        });

        essayPassed = hasArrayLogic && hasIntegrity && hasMinLen;

        updateAndSaveState(prev => {
          const nextFlags = [...prev.flags];
          let { mentorTrustVu, userTrust, teamMorale } = prev;
          if (selectedEthicalChoice === 'strict_standard') {
            nextFlags.push('w2_standard_upheld');
            userTrust = Math.min(100, userTrust + 10);
            mentorTrustVu = Math.min(100, mentorTrustVu + 5);
          } else {
            nextFlags.push('w2_bias_compromised');
            userTrust = Math.max(30, userTrust - 15);
            teamMorale = Math.max(30, teamMorale - 10);
          }
          return { ...prev, mentorTrustVu, userTrust, teamMorale, flags: nextFlags };
        });

        mentorFeedback = essayPassed && codePassed
          ? 'Chị Lê Thảo (QA Lead): "Test case lọc mảng đạt chuẩn! Thái độ liêm chính với dữ liệu khen thưởng rất đáng khen ngợi."'
          : 'Chị Lê Thảo: "Thuật toán lọc cần bao quát cả dữ liệu null và các trường hợp biên."';
      } else if (currentWeek === 3) {
        const hasNullSafety = /null|undefined|optional chaining|fallback|bảo vệ|crash|an toàn/.test(essayLower);
        const hasUX = /trải nghiệm|liên tục|mạng yếu|học sinh|không sập|gián đoạn/.test(essayLower);
        const hasMinLen = architecturalEssay.trim().length >= 35;

        feedbackItems.push({
          label: 'Chiến lược Null Safety & Thoái lui an toàn',
          passed: hasNullSafety,
          note: hasNullSafety ? 'Bảo vệ hàm khỏi lỗi TypeError unhandled.' : 'Chưa làm rõ cơ chế Null Safety.'
        });
        feedbackItems.push({
          label: 'Đảm bảo trải nghiệm liên tục cho người dùng',
          passed: hasUX,
          note: hasUX ? 'Đặt trải nghiệm học sinh làm trung tâm.' : 'Chưa giải thích tầm quan trọng của tính liên tục.'
        });

        essayPassed = hasNullSafety && hasUX && hasMinLen;

        updateAndSaveState(prev => {
          const nextFlags = [...prev.flags];
          let { systemStability, userTrust } = prev;
          if (selectedEthicalChoice === 'graceful_fallback') {
            nextFlags.push('w3_graceful_ux');
            systemStability = Math.min(100, systemStability + 15);
            userTrust = Math.min(100, userTrust + 10);
          } else {
            nextFlags.push('w3_forced_crash');
            userTrust = Math.max(20, userTrust - 20);
          }
          return { ...prev, systemStability, userTrust, flags: nextFlags };
        });

        mentorFeedback = 'Anh Trần Vũ: "Null safety là bài học vỡ lòng nhưng quyết định tính sống còn của app triệu người dùng."';
      } else if (currentWeek === 4) {
        const hasBigO = /o\(|độ phức tạp|tối ưu|cpu|bộ nhớ|latency|thời gian|hiệu năng/.test(essayLower);
        const hasWeight = /trọng số|hệ số|công thức|chính xác|trung bình/.test(essayLower);
        const hasMinLen = architecturalEssay.trim().length >= 35;

        feedbackItems.push({
          label: 'Phân tích độ phức tạp thuật toán (Big-O)',
          passed: hasBigO,
          note: hasBigO ? 'Nhận diện điểm nghẽn hiệu năng khi tính điểm số lớn.' : 'Chưa phân tích độ phức tạp thời gian/bộ nhớ.'
        });
        feedbackItems.push({
          label: 'Tính toán GPA trọng số chính xác',
          passed: hasWeight,
          note: hasWeight ? 'Đúng công thức trọng số đa môn học.' : 'Chưa nêu rõ quy tắc tính trọng số.'
        });

        essayPassed = hasBigO && hasWeight && hasMinLen;

        updateAndSaveState(prev => {
          const nextFlags = [...prev.flags];
          let { productVelocity, techDebt } = prev;
          nextFlags.push('w4_midterm_optimized');
          productVelocity = Math.min(100, productVelocity + 10);
          techDebt = Math.max(0, techDebt - 10);
          return { ...prev, productVelocity, techDebt, flags: nextFlags };
        });

        mentorFeedback = 'Anh Trần Vũ: "Thuật toán xử lý mượt mà. Hệ thống chịu tải đỉnh rất ổn định!"';
      } else if (currentWeek === 5) {
        const hasDebounce = /debounce|throttle|giới hạn|spam|server|băng thông|quá tải|tần suất/.test(essayLower);
        const hasAccessibility = /vùng sâu|mạng yếu|kết nối|3g|quỳnh|tiếp cận|thân thiện/.test(essayLower);
        const hasMinLen = architecturalEssay.trim().length >= 35;

        feedbackItems.push({
          label: 'Cơ chế Debounce / Rate Limiting',
          passed: hasDebounce,
          note: hasDebounce ? 'Kiểm soát tần suất request bảo vệ hạ tầng máy chủ.' : 'Chưa nêu rõ nguyên lý Debounce.'
        });
        feedbackItems.push({
          label: 'Hỗ trợ người dùng mạng yếu (Accessibility)',
          passed: hasAccessibility,
          note: hasAccessibility ? 'Quan tâm tới học sinh vùng sâu vùng xa (Bé Quỳnh).' : 'Chưa tính đến trải nghiệm người dùng mạng yếu.'
        });

        essayPassed = hasDebounce && hasAccessibility && hasMinLen;

        updateAndSaveState(prev => {
          const nextFlags = [...prev.flags];
          let { systemStability, userTrust } = prev;
          if (selectedEthicalChoice === 'adaptive_debounce') {
            nextFlags.push('w5_adaptive_network');
            userTrust = Math.min(100, userTrust + 15);
            systemStability = Math.min(100, systemStability + 10);
          } else {
            nextFlags.push('w5_strict_ip_block');
            userTrust = Math.max(30, userTrust - 15);
          }
          return { ...prev, systemStability, userTrust, flags: nextFlags };
        });

        mentorFeedback = 'Chị Lê Thảo: "Cân bằng tải tốt và không làm khó các bạn học sinh ở vùng mạng chập chờn!"';
      } else if (currentWeek === 6) {
        const hasSocialDuty = /nghèo|chính sách|miễn phí|bình đẳng|quyền học tập|đạo đức|nhân văn/.test(essayLower);
        const hasLogic = /hoặc|or|ispoor|ispaid|điều kiện|mở khóa/.test(essayLower);
        const hasMinLen = architecturalEssay.trim().length >= 35;

        feedbackItems.push({
          label: 'Bảo vệ quyền học tập của học sinh nghèo',
          passed: hasSocialDuty,
          note: hasSocialDuty ? 'Code thể hiện trách nhiệm đạo đức cao cả của kỹ sư.' : 'Chưa làm nổi bật nguyên tắc đạo đức hỗ trợ học sinh nghèo.'
        });
        feedbackItems.push({
          label: 'Logic phân quyền truy cập bài học',
          passed: hasLogic,
          note: hasLogic ? 'Cấu trúc toán tử logic || chuẩn xác.' : 'Chưa giải thích rõ cấu trúc logic mở khóa.'
        });

        essayPassed = hasSocialDuty && hasLogic && hasMinLen;

        updateAndSaveState(prev => {
          const nextFlags = [...prev.flags];
          let { userTrust, mentorTrustVu, teamMorale } = prev;
          if (selectedEthicalChoice === 'protect_free_tier') {
            nextFlags.push('w6_free_tier_protected');
            userTrust = Math.min(100, userTrust + 20);
            teamMorale = Math.min(100, teamMorale + 15);
          } else {
            nextFlags.push('w6_paywall_only');
            userTrust = Math.max(10, userTrust - 25);
            mentorTrustVu = Math.max(20, mentorTrustVu - 10);
          }
          return { ...prev, userTrust, mentorTrustVu, teamMorale, flags: nextFlags };
        });

        mentorFeedback = 'Anh Trần Vũ: "Dòng code của bạn đã bảo vệ ước mơ đến trường của hàng ngàn học sinh nghèo. Rất tự hào về bạn!"';
      } else if (currentWeek === 7) {
        const hasSecurity = /bảo mật|sql injection|xss|lỗ hổng|vá|sự cố|dữ liệu|an toàn/.test(essayLower);
        const hasResponse = /quy trình|báo cáo|minh bạch|khắc phục|tạm dừng|trách nhiệm/.test(essayLower);
        const hasMinLen = architecturalEssay.trim().length >= 35;

        feedbackItems.push({
          label: 'Nhận thức an ninh thông tin & Lỗ hổng bảo mật',
          passed: hasSecurity,
          note: hasSecurity ? 'Ý thức rõ nguy cơ rò rỉ dữ liệu cá nhân học sinh.' : 'Chưa phân tích nguy cơ an ninh thông tin.'
        });
        feedbackItems.push({
          label: 'Quy trình ứng phó sự cố (Incident Response)',
          passed: hasResponse,
          note: hasResponse ? 'Quy trình xử lý minh bạch, có trách nhiệm.' : 'Chưa nêu rõ quy trình ứng phó sự cố chuẩn.'
        });

        essayPassed = hasSecurity && hasResponse && hasMinLen;

        updateAndSaveState(prev => {
          const nextFlags = [...prev.flags];
          let { securityCompliance, systemStability, mentorTrustVu } = prev;
          if (selectedEthicalChoice === 'transparent_fix') {
            nextFlags.push('w7_transparent_security');
            securityCompliance = Math.min(100, securityCompliance + 20);
            mentorTrustVu = Math.min(100, mentorTrustVu + 10);
          } else {
            nextFlags.push('w7_hotfix_silently');
            securityCompliance = Math.max(20, securityCompliance - 20);
            systemStability = Math.max(30, systemStability - 15);
          }
          return { ...prev, securityCompliance, systemStability, mentorTrustVu, flags: nextFlags };
        });

        mentorFeedback = 'Chị Lê Thảo: "An toàn dữ liệu học sinh là lằn ranh đỏ. Quyết định xử lý sự cố rất chuyên nghiệp."';
      } else {
        // Week 8: Architecture & Refactoring
        const hasArchitecture = /kiến trúc|microservices|monolith|tái cấu trúc|refactor|hệ thống|bảo trì/.test(essayLower);
        const hasSummary = /tổng kết|trưởng thành|kỹ sư|trách nhiệm|kinh nghiệm|học hỏi|8 tuần/.test(essayLower);
        const hasMinLen = architecturalEssay.trim().length >= 40;

        feedbackItems.push({
          label: 'Tư duy kiến trúc hệ thống & Tái cấu trúc',
          passed: hasArchitecture,
          note: hasArchitecture ? 'Hiểu rõ sự đánh đổi kiến trúc hệ thống quy mô lớn.' : 'Chưa phân tích kiến trúc phần mềm.'
        });
        feedbackItems.push({
          label: 'Tổng kết năng lực & Phẩm chất Kỹ sư công nghệ',
          passed: hasSummary,
          note: hasSummary ? 'Phản tư toàn diện hành trình 8 tuần thực tập.' : 'Chưa đúc kết được bài học trưởng thành.'
        });

        essayPassed = hasArchitecture && hasSummary && hasMinLen;

        updateAndSaveState(prev => {
          const nextFlags = [...prev.flags, 'w8_graduated_edtech'];
          return {
            ...prev,
            systemStability: 95,
            mentorTrustVu: 95,
            teamMorale: 90,
            productVelocity: 85,
            flags: nextFlags
          };
        });

        mentorFeedback = 'Anh Trần Vũ: "Chúc mừng bạn đã hoàn thành xuất sắc 8 tuần thực tập kỹ thuật phần mềm! Bạn đã sẵn sàng cho vị trí Kỹ sư chính thức!"';
      }

      const isOverallPassed = codePassed && essayPassed;
      let score = Math.round(((passedCount / totalTests) * 0.6 + (essayPassed ? 0.4 : 0.15)) * 100);

      if (isOverallPassed && hasCopilot) {
        score = Math.min(100, score + 5);
      }

      const result: TaskEvaluationResult = {
        passed: isOverallPassed,
        score,
        feedback: isOverallPassed
          ? `✓ HOÀN THÀNH XUẤT SẮC! ${mentorFeedback} Điểm tổng hợp: ${score}/100. Đã cập nhật chỉ số phần mềm.`
          : `⚠️ CHƯA ĐẠT CHUẨN! ${codePassed ? 'Code Unit Test đã qua nhưng phần Luận giải kiến trúc & Đạo đức chưa đạt yêu cầu.' : 'Unit Test bị lỗi. Hãy sửa mã nguồn và hoàn thiện luận giải.'}`,
        details: [
          ...testLogs,
          `--- ĐÁNH GIÁ LUẬN GIẢI KIẾN TRÚC & ĐẠO ĐỨC ---`,
          ...feedbackItems.map(item => `[${item.passed ? 'PASS' : 'REVISE'}] ${item.label}: ${item.note}`)
        ]
      };

      setLogs(testLogs);
      setRubricFeedbackList(feedbackItems);
      setEvalResult(result);

      if (isOverallPassed) {
        playSound.pass(settings.retroSound);
        confetti({ particleCount: 50, spread: 70 });
      } else {
        playSound.fail(settings.retroSound);
      }

      onEvaluateResult(result);
    } catch (err: any) {
      const errMsg = `[SYNTAX/RUNTIME ERROR] Lỗi thực thi mã: ${err.message}`;
      setLogs([errMsg]);
      setExecutionStats(null);
      const failResult: TaskEvaluationResult = {
        passed: false,
        score: 0,
        feedback: 'Mã nguồn bị lỗi cú pháp hoặc crash khi chạy. Hãy sửa lỗi và thử lại.',
        details: [errMsg]
      };
      setEvalResult(failResult);
      playSound.fail(settings.retroSound);
      onEvaluateResult(failResult);
    }
  };

  const lines = userCode.split('\n');

  // Dilemma presets for current week
  const getDilemmaOptions = () => {
    switch (currentWeek) {
      case 1:
        return [
          { id: 'reject_hack', title: 'Kiên quyết bắt buộc dùng === và viết đủ Unit Test', desc: 'Từ chối duyệt PR tắt của Hoàng Nam. Nam bị trễ KPI tuần 1 nhưng hệ thống không phát sinh nợ kỹ thuật.' },
          { id: 'allow_hack', title: 'Tạm duyệt PR để Nam kịp nộp báo cáo ra mắt', desc: 'Hệ thống kịp tiến độ nhưng tăng nợ kỹ thuật và Tech Lead Trần Vũ sẽ cảnh cáo ở đợt audit sau.' }
        ];
      case 2:
        return [
          { id: 'strict_standard', title: 'Giữ nguyên chuẩn GPA >= 8.0, không sửa điểm 7.99', desc: 'Bảo vệ công bằng cho tất cả học sinh, từ chối can thiệp số liệu dù chịu áp lực từ BGH.' },
          { id: 'flexible_rounding', title: 'Thêm ngoại lệ làm tròn số cho hồ sơ ưu tiên', desc: 'Làm hài lòng cấp quản lý nhưng làm suy giảm niềm tin và tạo tiền lệ xấu trong code.' }
        ];
      case 3:
        return [
          { id: 'graceful_fallback', title: 'Fallback về "Học viên ẩn danh" và tiếp tục chạy', desc: 'Học sinh mạng yếu hoặc chưa kịp điền profile vẫn có thể học bình thường không bị văng app.' },
          { id: 'force_profile_block', title: 'Chặn truy cập bắt buộc nâng cấp profile ngay', desc: 'Ép người dùng cập nhật dữ liệu nhưng gây ức chế và làm giảm chỉ số giữ chân học sinh.' }
        ];
      case 5:
        return [
          { id: 'adaptive_debounce', title: 'Debounce thông minh + Thân thiện với mạng 3G yếu', desc: 'Giới hạn tần suất vừa đủ bảo vệ server, đồng thời không chặn oan học sinh vùng cao như bé Quỳnh.' },
          { id: 'strict_ip_block', title: 'Khóa IP tức thì nếu gửi quá 5 request/giây', desc: 'Bảo vệ máy chủ tuyệt đối nhưng nhiều học sinh dùng chung mạng trường học sẽ bị chặn hàng loạt.' }
        ];
      case 6:
        return [
          { id: 'protect_free_tier', title: 'Mở khóa toàn bộ bài giảng cho học sinh nghèo (isPoor === true)', desc: 'Bảo vệ quyền học tập bình đẳng, chấp nhận giảm doanh thu gói VIP ngắn hạn.' },
          { id: 'paywall_only', title: 'Chỉ mở khóa tài khoản trả phí (isPaid === true)', desc: 'Tối đa hóa doanh thu cho công ty nhưng tước đi cơ hội học tập của các em học sinh có hoàn cảnh khó khăn.' }
        ];
      case 7:
        return [
          { id: 'transparent_fix', title: 'Báo cáo công khai sự cố bảo mật & Bảo trì hệ thống', desc: 'Bảo vệ dữ liệu cá nhân học sinh tuyệt đối dù phải dừng server vài giờ trước kỳ thi.' },
          { id: 'hotfix_silently', title: 'Âm thầm vá nóng trong khi server vẫn đang nhận tải', desc: 'Không làm gián đoạn người dùng nhưng có rủi ro rò rỉ dữ liệu nếu bản vá chưa hoàn thiện.' }
        ];
      default:
        return [
          { id: 'balanced_engineering', title: 'Cân bằng giữa hiệu năng hệ thống và trải nghiệm người dùng', desc: 'Lựa chọn phương án kiến trúc bền vững, dễ bảo trì cho thế hệ kỹ sư kế cận.' },
          { id: 'fast_iteration', title: 'Tập trung tốc độ bàn giao tính năng mới', desc: 'Chấp nhận rủi ro tái cấu trúc sau để nhanh chóng chiếm lĩnh thị trường người dùng.' }
        ];
    }
  };

  return (
    <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-4 space-y-4 font-mono text-[#00ff41] select-none shadow-2xl">
      {/* Tool Header & Status */}
      <div className="bg-[#111] p-3.5 border border-[#00ff41]/50 space-y-2 text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2 font-black uppercase text-[#00ff41]">
            <Terminal className="w-5 h-5 text-[#00ff41]" />
            <span>IDE TÍCH HỢP TRÌNH BIÊN DỊCH V8 & WORKSPACE KỸ THUẬT PHẦN MỀM</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 bg-[#000] border border-[#00ff41] text-[#00ff41] text-[10px] font-bold uppercase">
              TUẦN {currentWeek}/8: {currentWeek === 6 ? 'THỬ THÁCH ĐẠO ĐỨC' : currentWeek === 8 ? 'ĐỒ ÁN TỐT NGHIỆP' : 'CORE REFACTOR'}
            </span>
            <span className="px-2 py-0.5 bg-[#000] border border-[#ff00ff] text-[#ff00ff] text-[10px] font-bold uppercase">
              BRANCH: feature/week-{currentWeek}-edtech
            </span>
          </div>
        </div>
        <p className="opacity-90 text-xs text-white/90">{taskData.instructions}</p>
      </div>

      {/* Special Equipped Tools HUD Bar */}
      {(hasLinter || hasDebugger || hasCopilot) && (
        <div className="bg-[#081208] border-2 border-[#ffea00] p-3 space-y-2 text-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 font-bold text-white uppercase text-[11px]">
              <Wrench className="w-4 h-4 text-[#ffea00]" />
              <span>DỤNG CỤ CHUYÊN DỤNG KÍCH HOẠT:</span>
              <span className="text-[#00ff41] bg-black px-2 py-0.2 border border-[#00ff41]/50">
                {hasCopilot ? '⚡ SIÊU MÁY TÍNH AI QUANTUM COPILOT' : hasDebugger ? '🔍 GỠ LỖI SÂU AST' : '🛠️ TERMINAL LINTER PRO'}
              </span>
            </div>

            <button
              onClick={handleUseCopilot}
              className="px-3 py-1 bg-[#ffea00] text-black font-black text-[10px] uppercase hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(255,234,0,0.4)]"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>GỌI TRỢ GIÚP DỤNG CỤ AI</span>
            </button>
          </div>

          {activeCopilotHint && (
            <div className="bg-black p-2 border border-[#ffea00]/60 text-[11px] text-[#ffea00] font-mono animate-fadeIn">
              {activeCopilotHint}
            </div>
          )}
        </div>
      )}

      {/* Navigation Sub-Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-[#00ff41]/40 pb-2">
        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('editor'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'editor'
              ? 'bg-[#00ff41] text-[#0c0c0c] border-white shadow-[0_0_10px_rgba(0,255,65,0.6)]'
              : 'bg-[#111] text-[#00ff41] border-[#00ff41]/40 hover:border-[#00ff41]'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          <span>1. CODE EDITOR & TEST RUNNER</span>
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('dilemma_essay'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'dilemma_essay'
              ? 'bg-[#ffea00] text-[#0c0c0c] border-white shadow-[0_0_10px_rgba(255,234,0,0.6)]'
              : 'bg-[#111] text-[#ffea00] border-[#ffea00]/40 hover:border-[#ffea00]'
          }`}
        >
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>2. ĐẠO ĐỨC & BIỆN LUẬN KIẾN TRÚC</span>
          {architecturalEssay.trim().length >= 35 && (
            <span className="bg-black text-[#ffea00] text-[9px] px-1 py-0.2 border border-[#ffea00]">
              ✓ ĐÃ VIẾT
            </span>
          )}
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('git_pr'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'git_pr'
              ? 'bg-[#ff00ff] text-[#0c0c0c] border-white shadow-[0_0_10px_rgba(255,0,255,0.6)]'
              : 'bg-[#111] text-[#ff00ff] border-[#ff00ff]/40 hover:border-[#ff00ff]'
          }`}
        >
          <GitPullRequest className="w-3.5 h-3.5" />
          <span>3. GIT CODE REVIEW (PR #{300 + currentWeek})</span>
        </button>

        <button
          onClick={() => { playSound.click(settings.retroSound); setActiveTab('telemetry'); }}
          className={`px-3 py-1.5 text-xs font-bold uppercase border transition-all flex items-center gap-1.5 ${
            activeTab === 'telemetry'
              ? 'bg-[#00e5ff] text-[#0c0c0c] border-white shadow-[0_0_10px_rgba(0,229,255,0.6)]'
              : 'bg-[#111] text-[#00e5ff] border-[#00e5ff]/40 hover:border-[#00e5ff]'
          }`}
        >
          <Activity className="w-3.5 h-3.5" />
          <span>4. GIÁM SÁT MÁY CHỦ TELEMETRY</span>
        </button>
      </div>

      {/* TAB 1: CODE EDITOR & TEST RUNNER */}
      {activeTab === 'editor' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: Interactive Code Editor */}
            <div className="lg:col-span-8 space-y-2">
              <div className="flex items-center justify-between text-xs bg-[#000] px-3 py-1.5 border border-[#00ff41]/60">
                <div className="flex items-center gap-2">
                  <FileCode className="w-3.5 h-3.5 text-[#00ff41]" />
                  <span className="font-bold">src/controllers/Week{currentWeek}Task.js</span>
                  <span className="text-white/60">({lines.length} lines)</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      playSound.click(settings.retroSound);
                      setUserCode(taskData.initialCode);
                    }}
                    className="text-[10px] text-white/70 hover:text-[#00ff41] flex items-center gap-1"
                    title="Khôi phục mã ban đầu"
                  >
                    <RotateCcw className="w-3 h-3" /> RESET CODE
                  </button>
                </div>
              </div>

              {/* Code TextArea with Breakpoints Gutter */}
              <div className="relative flex bg-[#050505] border border-[#00ff41] min-h-[220px]">
                {/* Gutter Line Numbers */}
                <div className="w-10 bg-[#111] py-2 flex flex-col items-center border-r border-[#00ff41]/30 select-none text-[11px] text-[#00ff41]/50">
                  {lines.map((_, i) => (
                    <div
                      key={i}
                      onClick={() => toggleBreakpoint(i + 1)}
                      className="w-full flex items-center justify-between px-1 cursor-pointer hover:bg-[#222]"
                    >
                      <span className="text-[9px]">{i + 1}</span>
                      {breakpoints.includes(i + 1) && (
                        <div className="w-2 h-2 rounded-full bg-[#ff0055] animate-pulse" />
                      )}
                    </div>
                  ))}
                </div>

                {/* Actual Editable Area */}
                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  className="flex-1 bg-transparent p-2.5 font-mono text-xs sm:text-sm text-[#00ff41] focus:outline-none resize-y min-h-[240px] leading-relaxed selection:bg-[#00ff41] selection:text-black"
                  spellCheck={false}
                />
              </div>

              {/* Test Action Bar */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <div className="text-[11px] text-white/70 flex items-center gap-2">
                  <span>💡 Viết hàm chuẩn xác và sang Tab 2 để hoàn thành biện luận đạo đức.</span>
                </div>

                <button
                  onClick={handleRunAndEvaluate}
                  className="px-5 py-2.5 bg-[#00ff41] text-black font-black text-xs uppercase border-2 border-white hover:bg-[#00e53a] transition-all flex items-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(0,255,65,0.5)]"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>CHẠY TEST SUITE & ĐÁNH GIÁ TOÀN DIỆN</span>
                </button>
              </div>
            </div>

            {/* Right Column: Automated Test Suite & Output Terminal */}
            <div className="lg:col-span-4 space-y-3">
              {/* Test Cases Specification Box */}
              <div className="bg-[#000] border border-[#00ff41]/60 p-3 space-y-2 text-xs">
                <div className="font-bold text-white uppercase text-[11px] flex items-center justify-between border-b border-[#00ff41]/30 pb-1.5">
                  <span>BỘ KIỂM THỬ TỰ ĐỘNG ({taskData.testCases.length} CASES)</span>
                  <Bug className="w-3.5 h-3.5 text-[#ffea00]" />
                </div>
                <div className="space-y-1.5 max-h-[140px] overflow-y-auto pr-1">
                  {taskData.testCases.map((tc, idx) => (
                    <div key={idx} className="p-1.5 bg-[#111] border border-[#00ff41]/20 text-[11px]">
                      <div className="text-[#ffea00] font-bold">TC #{idx + 1}: {tc.description}</div>
                      <div className="text-white/70 text-[10px]">
                        Input: <code className="text-[#00ff41]">{JSON.stringify(tc.input)}</code> → Expected: <code className="text-[#00e5ff]">{JSON.stringify(tc.expected)}</code>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Real-time Execution Output Terminal */}
              <div className="bg-[#050505] border-2 border-[#00ff41] p-3 space-y-2 text-xs font-mono min-h-[160px]">
                <div className="flex items-center justify-between border-b border-[#00ff41]/40 pb-1 text-[10px] text-white/70">
                  <span className="flex items-center gap-1"><Terminal className="w-3 h-3 text-[#00ff41]" /> CONSOLE OUTPUT</span>
                  {executionStats && (
                    <span className="text-[#00e5ff]">
                      ⏱ {executionStats.timeMs}ms | 💾 {executionStats.memoryKb}KB
                    </span>
                  )}
                </div>

                <div className="space-y-1 max-h-[150px] overflow-y-auto pr-1 text-[11px]">
                  {logs.length === 0 ? (
                    <div className="text-white/40 italic">Chưa có log thực thi. Nhấn 'CHẠY TEST SUITE' để chạy mã nguồn.</div>
                  ) : (
                    logs.map((l, i) => (
                      <div
                        key={i}
                        className={
                          l.includes('[PASS]')
                            ? 'text-[#00ff41]'
                            : l.includes('[FAIL]') || l.includes('ERROR')
                            ? 'text-[#ff0055]'
                            : 'text-white/90'
                        }
                      >
                        {l}
                      </div>
                    ))
                  )}
                </div>
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
                  <span>{evalResult.passed ? 'BÀI LÀM ĐẠT CHUẨN KỸ THUẬT & ĐẠO ĐỨC' : 'CẦN CHỈNH SỬA & HOÀN THIỆN'}</span>
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

      {/* TAB 2: ĐẠO ĐỨC & BIỆN LUẬN KIẾN TRÚC (OPEN-ENDED ESSAY & DILEMMA) */}
      {activeTab === 'dilemma_essay' && (
        <div className="space-y-4 bg-[#080808] border border-[#ffea00]/60 p-4">
          <div className="border-b border-[#ffea00]/40 pb-2">
            <h3 className="text-sm font-black text-[#ffea00] uppercase flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#ffea00]" />
              QUYẾT ĐỊNH ĐẠO ĐỨC & BIỆN LUẬN KIẾN TRÚC PHẦN MỀM TUẦN {currentWeek}
            </h3>
            <p className="text-xs text-white/80 mt-1">
              Kỹ sư phần mềm giỏi không chỉ viết code đúng cú pháp, mà phải biết bảo vệ hệ thống trước nợ kỹ thuật và bảo vệ người dùng trước bất công thuật toán.
            </p>
          </div>

          {/* Ethical Decision Trade-off Choice */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-white uppercase block">
              1. LỰA CHỌN PHƯƠNG ÁN XỬ LÝ TÌNH HUỐNG NGHỀ NGHIỆP:
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
                      name="ethical_opt"
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

          {/* Open-Ended Architectural & Ethical Essay Input */}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-white uppercase flex items-center gap-2">
                <MessageSquare className="w-3.5 h-3.5 text-[#00ff41]" />
                2. BÀI PHÂN TÍCH KỸ THUẬT & TRÁCH NHIỆM NGHỀ NGHIỆP (TỰ LUẬN ĐÁNH GIÁ CHUYÊN SÂU):
              </label>
              <span className={`text-[11px] ${architecturalEssay.trim().length >= 35 ? 'text-[#00ff41]' : 'text-[#ffea00]'}`}>
                {architecturalEssay.trim().length}/35 ký tự tối thiểu
              </span>
            </div>

            <textarea
              value={architecturalEssay}
              onChange={(e) => setArchitecturalEssay(e.target.value)}
              placeholder={
                currentWeek === 1
                  ? "Ví dụ: Trong hệ thống xét học bổng, việc dùng '===' giúp ngăn chặn ép kiểu ngầm giữa chuỗi và số, đảm bảo điểm số 10A3 được xét duyệt công bằng, tránh sai sót làm mất quyền lợi của học sinh..."
                  : currentWeek === 6
                  ? "Ví dụ: Lập trình viên phải đặt đạo đức nghề nghiệp lên trên lợi ích ngắn hạn. Dòng code 'isPaid || isPoor' đảm bảo học sinh nghèo như bé Quỳnh vẫn được tiếp cận bài giảng ôn thi miễn phí..."
                  : "Trình bày phân tích kỹ thuật, sự đánh đổi Big-O/Null Safety và trách nhiệm của kỹ sư phần mềm đối với hệ thống..."
              }
              rows={4}
              className="w-full bg-[#050505] border-2 border-[#ffea00]/80 p-3 text-xs sm:text-sm text-white focus:outline-none focus:border-[#ffea00] leading-relaxed selection:bg-[#ffea00] selection:text-black font-mono"
            />
          </div>

          {/* Action prompt */}
          <div className="flex items-center justify-between text-xs pt-2">
            <span className="text-white/60">
              💡 Sau khi điền bài luận, bấm nút "CHẠY TEST SUITE & ĐÁNH GIÁ TOÀN DIỆN" ở góc dưới để hệ thống chấm điểm tổng hợp.
            </span>
            <button
              onClick={handleRunAndEvaluate}
              className="px-4 py-2 bg-[#ffea00] text-black font-black text-xs uppercase hover:bg-white transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_10px_rgba(255,234,0,0.4)]"
            >
              <Send className="w-3.5 h-3.5" />
              <span>NỘP BÀI BIỆN LUẬN & TEST</span>
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: GIT PULL REQUEST REVIEW (PR WORKFLOW WITH MENTOR VŨ & QA THẢO) */}
      {activeTab === 'git_pr' && (
        <div className="space-y-3 bg-[#0a0510] border border-[#ff00ff]/60 p-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-[#ff00ff]/40 pb-2">
            <div className="flex items-center gap-2 text-[#ff00ff] font-bold">
              <GitPullRequest className="w-4 h-4" />
              <span>PULL REQUEST #{300 + currentWeek}: feat(edtech-core)/week-{currentWeek}-implementation</span>
            </div>
            <span className="px-2 py-0.5 bg-[#111] border border-[#ff00ff] text-[#ff00ff] text-[10px] uppercase font-bold">
              OPEN FOR CODE REVIEW
            </span>
          </div>

          <div className="space-y-2">
            <div className="p-3 bg-[#111] border border-white/20 space-y-1">
              <div className="flex items-center justify-between text-white/80">
                <span className="font-bold text-[#00ff41]">Anh Trần Vũ (Senior Tech Lead / Mentor)</span>
                <span className="text-[10px] text-white/50">15 phút trước</span>
              </div>
              <p className="text-white/90 text-[11px] leading-relaxed">
                {currentWeek === 1
                  ? '"Lưu ý đặc biệt: Toàn bộ module điểm số tuyệt đối không được phép dùng toán tử ==. Bất kỳ rủi ro type coercion nào cũng sẽ bị từ chối merge."'
                  : currentWeek === 6
                  ? '"Quy tắc mở khóa khóa học cho học sinh hộ nghèo là cam kết của toàn công ty. Hãy đảm bảo điều kiện isPoor được kiểm tra chuẩn xác."'
                  : '"Cần lưu ý kiểm tra các trường hợp ngoại lệ đầu vào và đảm bảo độ phức tạp thời gian O(N) để tránh nghẽn server."'}
              </p>
            </div>

            <div className="p-3 bg-[#111] border border-white/20 space-y-1">
              <div className="flex items-center justify-between text-white/80">
                <span className="font-bold text-[#ffea00]">Chị Lê Thảo (QA Lead)</span>
                <span className="text-[10px] text-white/50">8 phút trước</span>
              </div>
              <p className="text-white/90 text-[11px] leading-relaxed">
                "Bộ test suite tự động đã sẵn sàng. Em hãy chạy kiểm thử trên Tab 1 và bổ sung phần biện luận kỹ thuật ở Tab 2 để team tiến hành duyệt PR."
              </p>
            </div>

            <div className="p-3 bg-[#111] border border-white/20 space-y-1">
              <div className="flex items-center justify-between text-white/80">
                <span className="font-bold text-[#00e5ff]">Hoàng Nam (Junior Developer / Đồng nghiệp)</span>
                <span className="text-[10px] text-white/50">3 phút trước</span>
              </div>
              <p className="text-white/90 text-[11px] leading-relaxed">
                "Cảm ơn bạn đã hỗ trợ mình rà soát code tuần này! Cùng cố gắng giữ vững chất lượng nhé!"
              </p>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GIÁM SÁT MÁY CHỦ TELEMETRY REAL-TIME */}
      {activeTab === 'telemetry' && (
        <div className="space-y-3 bg-[#051015] border border-[#00e5ff]/60 p-4 text-xs font-mono">
          <div className="flex items-center justify-between border-b border-[#00e5ff]/40 pb-2">
            <div className="flex items-center gap-2 text-[#00e5ff] font-bold uppercase">
              <Server className="w-4 h-4" />
              <span>HẠ TẦNG MÁY CHỦ EDTECH PROD CLUSTER - LIVE METRICS</span>
            </div>
            <span className="px-2 py-0.5 bg-black border border-[#00e5ff] text-[#00e5ff] text-[10px] font-bold">
              UPTIME: {telemetry.uptime}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="bg-black p-3 border border-[#00e5ff]/40 space-y-1">
              <span className="text-white/60 text-[10px]">CPU UTILIZATION</span>
              <div className="text-xl font-black text-[#00e5ff]">{telemetry.cpuLoad}%</div>
              <div className="w-full bg-[#111] h-1.5 overflow-hidden">
                <div className="bg-[#00e5ff] h-full" style={{ width: `${telemetry.cpuLoad}%` }} />
              </div>
            </div>

            <div className="bg-black p-3 border border-[#00e5ff]/40 space-y-1">
              <span className="text-white/60 text-[10px]">MEMORY (RAM)</span>
              <div className="text-xl font-black text-[#00ff41]">{telemetry.memoryUsage}%</div>
              <div className="w-full bg-[#111] h-1.5 overflow-hidden">
                <div className="bg-[#00ff41] h-full" style={{ width: `${telemetry.memoryUsage}%` }} />
              </div>
            </div>

            <div className="bg-black p-3 border border-[#00e5ff]/40 space-y-1">
              <span className="text-white/60 text-[10px]">THROUGHPUT (RPS)</span>
              <div className="text-xl font-black text-[#ffea00]">{telemetry.rps} req/s</div>
              <span className="text-[9px] text-white/50">Học sinh trực tuyến</span>
            </div>

            <div className="bg-black p-3 border border-[#00e5ff]/40 space-y-1">
              <span className="text-white/60 text-[10px]">P99 LATENCY</span>
              <div className="text-xl font-black text-[#ff00ff]">{telemetry.latencyMs} ms</div>
              <span className="text-[9px] text-white/50">Độ trễ phản hồi</span>
            </div>
          </div>

          {/* Software State Overview */}
          <div className="pt-2 border-t border-[#00e5ff]/30">
            <h4 className="text-[11px] font-bold text-white uppercase mb-2">CHỈ SỐ THỰC TẬP KỸ THUẬT PHẦN MỀM (SOFTWARE STATE):</h4>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px]">
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">SYSTEM STABILITY</span>
                <span className="text-[#00ff41] font-bold">{state.systemStability}%</span>
              </div>
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">TECH DEBT</span>
                <span className={state.techDebt > 40 ? 'text-[#ff0055] font-bold' : 'text-[#ffea00] font-bold'}>
                  {state.techDebt}%
                </span>
              </div>
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">SECURITY COMPLIANCE</span>
                <span className="text-[#00e5ff] font-bold">{state.securityCompliance}%</span>
              </div>
              <div className="bg-black/60 p-2 border border-white/20">
                <span className="text-white/60 block text-[9px]">MENTOR VŨ TRUST</span>
                <span className="text-[#ff00ff] font-bold">{state.mentorTrustVu}%</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
