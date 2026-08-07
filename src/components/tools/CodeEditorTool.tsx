import React, { useState } from 'react';
import { TaskEvaluationResult, Settings } from '../../types';
import { playSound } from '../../utils/audio';
import { Play, CheckCircle2, XCircle, Terminal, Cpu, RotateCcw, Bug } from 'lucide-react';

interface Props {
  taskData: {
    initialCode: string;
    instructions: string;
    testCases: Array<{ input: any[]; expected: any; description: string }>;
  };
  settings: Settings;
  onEvaluateResult: (res: TaskEvaluationResult) => void;
}

export const CodeEditorTool: React.FC<Props> = ({ taskData, settings, onEvaluateResult }) => {
  const [userCode, setUserCode] = useState(taskData.initialCode);
  const [logs, setLogs] = useState<string[]>([]);
  const [executionStats, setExecutionStats] = useState<{ timeMs: number; memoryKb: number } | null>(null);
  const [evalResult, setEvalResult] = useState<TaskEvaluationResult | null>(null);

  const lines = userCode.split('\n');

  const handleRunTests = () => {
    playSound.click(settings.retroSound);
    setLogs([]);
    const testLogs: string[] = [];
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

      const passRatio = passedCount / totalTests;
      const isPassed = passRatio === 1;
      const score = Math.round(passRatio * 100);

      const result: TaskEvaluationResult = {
        passed: isPassed,
        score,
        feedback: isPassed 
          ? `Xuất sắc! Đã vượt qua 100% (${passedCount}/${totalTests}) test cases tự động. Thuật toán tối ưu thời gian chạy ${elapsedMs}ms!`
          : `Đạt ${passedCount}/${totalTests} test cases (${score}%). Hãy kiểm tra lại logic điều kiện và đầu ra hàm ở Console.`,
        details: testLogs
      };

      setLogs(testLogs);
      setEvalResult(result);
      if (isPassed) playSound.pass(settings.retroSound);
      else playSound.fail(settings.retroSound);

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

  return (
    <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-4 space-y-4 font-mono text-[#00ff41] select-none">
      {/* Tool Header & Instructions */}
      <div className="bg-[#111] p-3.5 border border-[#00ff41]/50 space-y-2 text-xs">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-black uppercase text-[#00ff41]">
            <Terminal className="w-5 h-5 text-[#00ff41]" />
            <span>IDE TÍCH HỢP TRÌNH BIÊN DỊCH JAVASCRIPT ENGINE (EDTECH STUDIO)</span>
          </div>
          <span className="px-2 py-0.5 bg-[#000] border border-[#00ff41] text-[#00ff41] text-[10px] font-bold uppercase">
            V8 COMPILER READY
          </span>
        </div>
        <p className="opacity-90 text-xs">{taskData.instructions}</p>
      </div>

      {/* Editor with Line Numbers */}
      <div className="space-y-1.5">
        <div className="flex justify-between items-center text-[11px] opacity-80 uppercase font-bold">
          <span className="flex items-center gap-1.5">
            <Cpu className="w-3.5 h-3.5 text-[#ff00ff]" />
            <span>MÃ NGUỒN JAVASCRIPT (EDITABLE):</span>
          </span>
          <button 
            onClick={() => { playSound.click(settings.retroSound); setUserCode(taskData.initialCode); }} 
            className="hover:text-[#ff00ff] flex items-center gap-1 text-[10px] text-[#00ff41] underline cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Khôi phục mã ban đầu</span>
          </button>
        </div>

        <div className="flex border border-[#00ff41] bg-[#000] overflow-hidden">
          {/* Line Numbers Gutter */}
          <div className="bg-[#111] border-r border-[#00ff41]/40 px-2 py-3 text-right text-[11px] text-[#00ff41]/50 font-mono select-none leading-relaxed">
            {lines.map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>

          {/* Textarea */}
          <textarea
            value={userCode}
            onChange={(e) => setUserCode(e.target.value)}
            rows={Math.max(8, lines.length)}
            className="w-full bg-[#000] text-[#00ff41] p-3 text-xs font-mono focus:outline-none focus:bg-[#050505] leading-relaxed resize-y"
            spellCheck={false}
          />
        </div>
      </div>

      {/* Run Tests Button */}
      <button
        onClick={handleRunTests}
        className="w-full py-3 bg-[#00ff41] text-[#0c0c0c] font-black text-xs uppercase flex items-center justify-center gap-2 border-2 border-white hover:bg-[#00e53a] shadow-[0_0_20px_rgba(0,255,65,0.6)] cursor-pointer transition-all active:scale-[0.99]"
      >
        <Play className="w-4 h-4 fill-current" />
        <span>CHẠY AUTOMATED TEST SUITE & BÁO CÁO THUẬT TOÁN</span>
      </button>

      {/* Execution Stats & Console Logs */}
      {logs.length > 0 && (
        <div className="bg-[#111] border border-[#00ff41]/50 p-4 space-y-3 text-xs">
          <div className="flex items-center justify-between border-b border-[#00ff41]/40 pb-2">
            <div className="text-[11px] font-bold uppercase flex items-center gap-1.5 text-[#00ff41]">
              <Terminal className="w-3.5 h-3.5" />
              <span>TERMINAL OUTPUT LOGS & DEBUGS</span>
            </div>

            {executionStats && (
              <div className="flex items-center gap-3 text-[10px] font-mono text-[#ff00ff]">
                <span>⏱ {executionStats.timeMs}ms execution</span>
                <span>⚡ {executionStats.memoryKb}KB memory</span>
              </div>
            )}
          </div>

          <div className="space-y-1.5 max-h-48 overflow-y-auto font-mono text-[11px] bg-[#000] p-3 border border-[#00ff41]/40">
            {logs.map((log, i) => (
              <div 
                key={i} 
                className={log.includes('[PASS]') ? 'text-[#00ff41]' : log.includes('[FAIL]') || log.includes('[ERROR]') || log.includes('[SYNTAX/RUNTIME ERROR]') ? 'text-[#ff4444]' : 'text-[#00ff41]/80'}
              >
                {log}
              </div>
            ))}
          </div>

          {evalResult && (
            <div className={`p-3 border text-xs font-bold flex items-center gap-2 ${
              evalResult.passed ? 'bg-[#000] border-[#00ff41] text-[#00ff41]' : 'bg-[#000] border-[#ff4444] text-[#ff4444]'
            }`}>
              {evalResult.passed ? <CheckCircle2 className="w-5 h-5 text-[#00ff41] shrink-0" /> : <XCircle className="w-5 h-5 text-[#ff4444] shrink-0" />}
              <span>{evalResult.feedback}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
