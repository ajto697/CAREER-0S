import React, { useState, useEffect } from 'react';
import { TaskEvaluationResult, Settings, TeacherState } from '../../types';
import { playSound } from '../../utils/audio';
import { ClassroomAnimationScene } from '../ClassroomAnimationScene';
import {
  GraduationCap,
  Clock,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Send,
  Users,
  Heart,
  Shield,
  Award,
  Sparkles,
  MessageSquare,
  BookOpen,
  AlertCircle,
  UserCheck,
  Mail,
  FileText,
  ChevronRight,
  Bookmark,
  Tv,
  Check,
  Zap
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface Props {
  taskData: any;
  settings: Settings;
  onEvaluateResult: (res: TaskEvaluationResult) => void;
  currentWeek?: number;
  teacherState?: TeacherState;
  onUpdateTeacherState?: (newState: TeacherState) => void;
}

const DEFAULT_STATE: TeacherState = {
  trustMentor: 60,
  reputation: 50,
  moraleDuc: 40,
  moraleMinh: 35,
  moraleHoa: 70,
  parentTrustDuc: 40,
  classAtmosphere: 50,
  flags: []
};

export const LessonPlannerTool: React.FC<Props> = ({
  taskData,
  settings,
  onEvaluateResult,
  currentWeek = 1,
  teacherState,
  onUpdateTeacherState
}) => {
  const [state, setState] = useState<TeacherState>(teacherState || DEFAULT_STATE);

  useEffect(() => {
    if (teacherState) {
      setState(teacherState);
    }
  }, [teacherState]);

  const updateAndSaveState = (updater: (prev: TeacherState) => TeacherState) => {
    const newState = updater(state);
    setState(newState);
    if (onUpdateTeacherState) {
      onUpdateTeacherState(newState);
    }
  };

  // Form State for each week
  const [selectedStyle, setSelectedStyle] = useState<'friendly' | 'strict' | 'balanced'>('balanced');
  const [minhRoleAssigned, setMinhRoleAssigned] = useState<boolean>(false);

  // Text inputs
  const [userInputText, setUserInputText] = useState<string>('');
  const [lessonPhase1, setLessonPhase1] = useState<string>('');
  const [lessonPhase2, setLessonPhase2] = useState<string>('');
  const [lessonPhase3, setLessonPhase3] = useState<string>('');
  const [lessonPhase4, setLessonPhase4] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [evalResult, setEvalResult] = useState<TaskEvaluationResult | null>(null);
  const [hasSubmittedWeek7, setHasSubmittedWeek7] = useState<boolean>(false);

  // Rubric Feedback details
  const [rubricFeedbackList, setRubricFeedbackList] = useState<{ label: string; passed: boolean; note: string }[]>([]);

  // Sound effects & evaluation trigger
  const handleEvaluateSubmission = () => {
    playSound.click(settings.retroSound);
    setIsSubmitting(true);

    setTimeout(() => {
      let score = 0;
      let passed = false;
      let mentorComment = '';
      const feedbackItems: { label: string; passed: boolean; note: string }[] = [];

      // ============================================================
      // WEEK 1: RA MẮT LỚP 10A3
      // ============================================================
      if (currentWeek === 1) {
        const textLower = userInputText.toLowerCase();
        const hasGreeting = /chào|xin chào|kính chào|chào cả lớp|thầy chào|cô chào/.test(textLower);
        const hasExpectation = /kỳ vọng|nguyên tắc|quy định|học tập|nỗ lực|tôn trọng|cùng nhau|mục tiêu/.test(textLower);
        const hasMinLen = userInputText.trim().length >= 40;

        feedbackItems.push({
          label: 'Chào hỏi chuẩn mực sư phạm',
          passed: hasGreeting,
          note: hasGreeting ? 'Đã có lời chào trang trọng gửi tới tập thể 10A3.' : 'Thiếu lời chào hỏi chính thức.'
        });
        feedbackItems.push({
          label: 'Nêu rõ kỳ vọng & nguyên tắc',
          passed: hasExpectation,
          note: hasExpectation ? 'Đã định hướng mục tiêu học tập & ứng xử văn minh.' : 'Chưa nêu rõ nguyên tắc lớp học.'
        });
        feedbackItems.push({
          label: 'Độ dài & tâm huyết phát biểu',
          passed: hasMinLen,
          note: hasMinLen ? 'Bài phát biểu truyền cảm hứng.' : 'Nội dung quá ngắn (ít nhất 40 ký tự).'
        });

        passed = hasGreeting && hasExpectation && hasMinLen;
        score = passed ? 100 : Math.max(30, (hasGreeting ? 30 : 0) + (hasExpectation ? 30 : 0) + (hasMinLen ? 20 : 0));

        const newFlags = [...state.flags];
        if (!newFlags.includes(`style_${selectedStyle}`)) {
          newFlags.push(`style_${selectedStyle}`);
        }

        if (passed) {
          mentorComment = `Cô Lan nhận xét: "Em mở đầu buổi chào lớp 10A3 rất tự nhiên! Lớp học có thiện cảm ngay từ đầu. Hãy duy trì phong cách ${selectedStyle === 'friendly' ? 'thân thiện' : selectedStyle === 'strict' ? 'nghiêm khắc' : 'cân bằng'} này."`;
          updateAndSaveState(prev => ({
            ...prev,
            classAtmosphere: Math.min(100, prev.classAtmosphere + (selectedStyle === 'friendly' ? 15 : 10)),
            trustMentor: Math.min(100, prev.trustMentor + 10),
            reputation: Math.min(100, prev.reputation + (selectedStyle === 'strict' ? 15 : 5)),
            flags: newFlags
          }));
        } else {
          mentorComment = 'Cô Lan góp ý: "Lời ra mắt chưa đủ sức thuyết phục học sinh 10A3. Em cần bổ sung lời chào chính thức và nêu rõ quy tắc làm việc ngay từ ngày đầu."';
        }
      }

      // ============================================================
      // WEEK 2: MINH IM LẶNG SUỐT GIỜ
      // ============================================================
      else if (currentWeek === 2) {
        const textLower = userInputText.toLowerCase();
        const hasConcreteAction = /ghép nhóm|đôi bạn|hỏi riêng|gợi mở|khuyến khích|khen ngợi|động viên|nhẹ nhàng|hỗ trợ/.test(textLower);
        const hasNoLabeling = !/lười|ngu|dốt|bỏ mặc|phạt|kém cỏi|bị trừ điểm/.test(textLower);
        const hasMinLen = userInputText.trim().length >= 45;

        feedbackItems.push({
          label: 'Biện pháp sư phạm cụ thể',
          passed: hasConcreteAction,
          note: hasConcreteAction ? 'Có giải pháp tạo cơ hội phát biểu không bị áp lực.' : 'Chưa có giải pháp giúp Minh hòa nhập.'
        });
        feedbackItems.push({
          label: 'Tôn trọng & không dán nhãn tiêu cực',
          passed: hasNoLabeling,
          note: hasNoLabeling ? 'Ngôn từ chuẩn mực, đậm tính nhân văn.' : 'Chứa từ ngữ miệt thị hoặc trừng phạt học sinh.'
        });
        feedbackItems.push({
          label: 'Độ chi tiết kế hoạch hỗ trợ',
          passed: hasMinLen,
          note: hasMinLen ? 'Kế hoạch rõ ràng, khả thi.' : 'Cần viết chi tiết hơn (tối thiểu 45 ký tự).'
        });

        passed = hasConcreteAction && hasNoLabeling && hasMinLen;
        score = passed ? 100 : 40;

        if (passed) {
          mentorComment = 'Cô Lan xúc động: "Rất tuyệt vời! Em đã quan sát tinh tế khó khăn tâm lý của Minh. Việc ghép nhóm và nhẹ nhàng gợi mở sẽ giúp em ấy tự tin hơn."';
          const newFlags = [...state.flags];
          if (!newFlags.includes('minh_helped_w2')) newFlags.push('minh_helped_w2');

          updateAndSaveState(prev => ({
            ...prev,
            moraleMinh: Math.min(100, prev.moraleMinh + 25),
            trustMentor: Math.min(100, prev.trustMentor + 10),
            classAtmosphere: Math.min(100, prev.classAtmosphere + 10),
            flags: newFlags
          }));
        } else {
          mentorComment = 'Cô Lan lưu ý: "Kế hoạch chưa đi đúng tâm lý học sinh tự ti. Cần tránh các biện pháp trừng phạt hay ép buộc trước đám đông."';
        }
      }

      // ============================================================
      // WEEK 3: ĐỨC GÂY RỐI (RẼ NHÁNH THEO TUẦN 1)
      // ============================================================
      else if (currentWeek === 3) {
        const textLower = userInputText.toLowerCase();
        const hasGreeting = /kính gửi|chào anh|chào chị|chào gia đình|thưa phụ huynh/.test(textLower);
        const hasObjectiveDesc = /em đức|trên lớp|tình hình|biểu hiện|giờ học|trao đổi/.test(textLower);
        const hasPartnership = /phối hợp|giúp đỡ|đồng hành|chia sẻ|hỗ trợ|kế hoạch|giải pháp|gia đình/.test(textLower);
        const hasNoBlame = !/hư hỏng|vô giáo dục|kết tội|đuổi học|phạt nặng|do em đức/.test(textLower);

        feedbackItems.push({
          label: 'Xưng hô sư phạm trân trọng',
          passed: hasGreeting,
          note: hasGreeting ? 'Xưng hô kính cẩn, đúng mực nhà giáo.' : 'Thiếu phần xưng hô chào phụ huynh.'
        });
        feedbackItems.push({
          label: 'Mô tả sự việc khách quan (không kết tội)',
          passed: hasObjectiveDesc,
          note: hasObjectiveDesc ? 'Trình bày rõ tình hình học tập trung thực.' : 'Mô tả còn mang tính cảm tính.'
        });
        feedbackItems.push({
          label: 'Đề xuất phối hợp & giải pháp tích cực',
          passed: hasPartnership,
          note: hasPartnership ? 'Tạo dựng được tình đối tác giữa nhà trường & gia đình.' : 'Thiếu đề xuất hướng giải quyết cụ thể.'
        });
        feedbackItems.push({
          label: 'Thái độ đồng cảm (không đổ lỗi)',
          passed: hasNoBlame,
          note: hasNoBlame ? 'Không quy chụp hay miệt thị hoàn cảnh.' : 'Chứa ngôn từ đổ lỗi quy trách nhiệm hoàn toàn cho gia đình.'
        });

        passed = hasGreeting && hasObjectiveDesc && hasPartnership && hasNoBlame;
        score = passed ? 100 : 45;

        if (passed) {
          mentorComment = 'Cô Lan khen ngợi: "Lá thư rất chân thành! Bố Đức vốn là người bận rộn kiếm sống, nhận được thư tôn trọng này sẽ hết lòng hợp tác với giáo viên."';
          updateAndSaveState(prev => ({
            ...prev,
            parentTrustDuc: Math.min(100, prev.parentTrustDuc + 30),
            moraleDuc: Math.min(100, prev.moraleDuc + 20),
            trustMentor: Math.min(100, prev.trustMentor + 10)
          }));
        } else {
          mentorComment = 'Cô Lan nhắc nhở: "Thư gửi phụ huynh cần cẩn trọng ngôn từ. Đổ lỗi hay trừng phạt sẽ chỉ làm Đức phản kháng hơn và gia đình khép lòng."';
          updateAndSaveState(prev => ({
            ...prev,
            parentTrustDuc: Math.max(0, prev.parentTrustDuc - 15)
          }));
        }
      }

      // ============================================================
      // WEEK 4: HỘI GIẢNG GIỮA KỲ (CHECKPOINT TỔNG HỢP)
      // ============================================================
      else if (currentWeek === 4) {
        const p1 = lessonPhase1.toLowerCase();
        const p2 = lessonPhase2.toLowerCase();
        const p3 = lessonPhase3.toLowerCase();
        const p4 = lessonPhase4.toLowerCase();

        const hasWarmup = p1.length >= 10;
        const hasTheory = p2.length >= 15;
        const hasPractice = p3.length >= 15;
        const hasSummary = p4.length >= 15;

        // Constraint: if moraleMinh is low (<50), require explicit accommodation for weak/quiet students!
        const needsAccommodation = state.moraleMinh < 50;
        const hasAccommodation = /minh|học sinh yếu|học sinh tự ti|phân hóa|hỗ trợ riêng|gợi mở riêng/.test(p3 + p4);

        feedbackItems.push({
          label: 'Bước 1: Khởi động (Warm-up)',
          passed: hasWarmup,
          note: hasWarmup ? 'Khởi động tạo không khí tốt.' : 'Bước khởi động quá sơ sài.'
        });
        feedbackItems.push({
          label: 'Bước 2: Kiến thức trọng tâm (Theory)',
          passed: hasTheory,
          note: hasTheory ? 'Nội dung cốt lõi rõ ràng.' : 'Chưa làm nổi bật bài giảng.'
        });
        feedbackItems.push({
          label: 'Bước 3: Thực hành & Thảo luận (Practice)',
          passed: hasPractice,
          note: hasPractice ? 'Phát huy tính tích cực của học sinh.' : 'Thiếu hoạt động luyện tập.'
        });
        feedbackItems.push({
          label: 'Bước 4: Củng cố & Đánh giá (Summary)',
          passed: hasSummary,
          note: hasSummary ? 'Chốt kiến thức & dặn dò chu đáo.' : 'Thiếu phần củng cố.'
        });

        if (needsAccommodation) {
          feedbackItems.push({
            label: 'RÀNG BUỘC SƯ PHẠM: Hỗ trợ học sinh yếu (Em Minh)',
            passed: hasAccommodation,
            note: hasAccommodation
              ? 'Xuất sắc! Đã thiết kế hoạt động phân hóa hỗ trợ Minh hòa nhập.'
              : 'Thất bại: Tinh thần em Minh đang thấp nhưng giáo án không có mục hỗ trợ riêng cho Minh.'
          });
        }

        passed = hasWarmup && hasTheory && hasPractice && hasSummary && (!needsAccommodation || hasAccommodation);
        score = passed ? 100 : 50;

        if (passed) {
          mentorComment = 'Thầy Hùng Hiệu trưởng & Cô Lan vỗ tay: "Tiết hội giảng rất thành công! Sự cân đối giữa truyền thụ và phân hóa đối tượng học sinh giúp tiết học bừng sáng."';
          updateAndSaveState(prev => ({
            ...prev,
            trustMentor: Math.min(100, prev.trustMentor + 15),
            reputation: Math.min(100, prev.reputation + 20),
            classAtmosphere: Math.min(100, prev.classAtmosphere + 15)
          }));
        } else {
          mentorComment = 'Cô Lan nhận xét: "Tiết dạy hội giảng còn thiếu sót. Hãy chú ý cấu trúc 4 bước và đặc biệt không được bỏ quên những học sinh đang cần sự quan tâm riêng."';
        }
      }

      // ============================================================
      // WEEK 5: ÁP LỰC TỪ PHỤ HUYNH HOA (TÌNH HUỐNG ĐẠO ĐỨC)
      // ============================================================
      else if (currentWeek === 5) {
        const textLower = userInputText.toLowerCase();
        const refusesKindly = /nguyên tắc|công bằng|quy chế|đánh giá thực chất|không thể thay đổi|đúng năng lực/.test(textLower);
        const supportsHoa = /hoa|áp lực|động viên|năng lực tốt|tiềm năng|giải tỏa|tâm lý/.test(textLower);
        const hasNoEthicsViolation = !/đồng ý sửa|nâng điểm|chấm lại điểm|sẽ giúp nâng|linh động nâng điểm/.test(textLower);

        feedbackItems.push({
          label: 'Giữ vững liêm chính sư phạm (Không sửa điểm)',
          passed: refusesKindly && hasNoEthicsViolation,
          note: refusesKindly && hasNoEthicsViolation
            ? 'Từ chối kiên quyết, bảo vệ tính trung thực trong thi cử.'
            : 'Đã đầu hàng áp lực hoặc hứa hẹn sửa điểm trái quy chế!'
        });
        feedbackItems.push({
          label: 'Khéo léo giải tỏa áp lực cho em Hoa',
          passed: supportsHoa,
          note: supportsHoa ? 'Đã phân tích giúp phụ huynh hiểu áp lực nặng nề của Hoa.' : 'Chưa quan tâm đúng mức tới tâm lý em Hoa.'
        });

        passed = refusesKindly && hasNoEthicsViolation && supportsHoa;
        score = passed ? 100 : 30;

        if (passed) {
          mentorComment = 'Cô Lan gật đầu tự hào: "Em xử lý cực kỳ khéo léo! Giữ vững nguyên tắc công bằng nhưng vẫn mở ra cơ hội đồng hành giải tỏa áp lực cho Hoa."';
          updateAndSaveState(prev => ({
            ...prev,
            reputation: Math.min(100, prev.reputation + 20),
            trustMentor: Math.min(100, prev.trustMentor + 15),
            moraleHoa: Math.min(100, prev.moraleHoa + 20)
          }));
        } else {
          mentorComment = 'Cô Lan nghiêm nét mặt: "Việc thỏa hiệp sửa điểm là vi phạm đạo đức nhà giáo nghiêm trọng. Sự uy tín của em với Ban giám hiệu và học sinh bị tổn hại."';
          const newFlags = [...state.flags];
          if (!newFlags.includes('ethics_compromised')) newFlags.push('ethics_compromised');

          updateAndSaveState(prev => ({
            ...prev,
            reputation: Math.max(0, prev.reputation - 30),
            flags: newFlags
          }));
        }
      }

      // ============================================================
      // WEEK 6: HOẠT ĐỘNG TRẢI NGHIỆM HƯỚNG NGHIỆP (HĐTN)
      // ============================================================
      else if (currentWeek === 6) {
        const textLower = userInputText.toLowerCase();
        const hasInteractive = /trải nghiệm|trò chơi|nhóm|thảo luận|hướng nghiệp|khám phá|sở thích|năng lực/.test(textLower);
        const hasMinLen = userInputText.trim().length >= 45;

        feedbackItems.push({
          label: 'Kịch bản trải nghiệm tương tác sinh động',
          passed: hasInteractive,
          note: hasInteractive ? 'Thiết kế đúng tinh thần GDPT 2018.' : 'Kịch bản còn mang tính thuyết giảng một chiều.'
        });
        feedbackItems.push({
          label: 'Phân công vai trò học sinh hòa nhập',
          passed: true,
          note: minhRoleAssigned
            ? 'Đã trao cơ hội Nhóm trưởng cho Minh (Bước ngoặt giúp Minh tự tin!).'
            : 'Đã giao công việc phù hợp năng lực từng nhóm.'
        });

        passed = hasInteractive && hasMinLen;
        score = passed ? 100 : 50;

        if (passed) {
          mentorComment = 'Cô Lan mỉm cười: "Tiết Hoạt động trải nghiệm thật nhiều năng lượng! Học sinh 10A3 đã hiểu hơn về tính cách và định hướng nghề nghiệp bản thân."';
          updateAndSaveState(prev => ({
            ...prev,
            classAtmosphere: Math.min(100, prev.classAtmosphere + 20),
            moraleMinh: Math.min(100, prev.moraleMinh + (minhRoleAssigned ? 25 : 10)),
            moraleHoa: Math.min(100, prev.moraleHoa + 10)
          }));
        } else {
          mentorComment = 'Cô Lan góp ý: "Nội dung trải nghiệm cần nhiều hoạt động tương tác thực tế hơn để kích thích học sinh bộc lộ năng lực."';
        }
      }

      // ============================================================
      // WEEK 7: KHỦNG HOẢNG: ĐỨC CÓ NGUY CƠ BỎ HỌC (1 LẦN NỘP)
      // ============================================================
      else if (currentWeek === 7) {
        setHasSubmittedWeek7(true);
        const textLower = userInputText.toLowerCase();
        const hasFinancial = /học bổng|quỹ|miễn giảm|hỗ trợ|quyên góp|chi phí/.test(textLower);
        const hasAcademic = /phụ đạo|kèm cặp|kiến thức|bài vở|đôi bạn/.test(textLower);
        const hasPartnership = /vận động|gia đình|bố đức|tương lai|nghề nghiệp|cam kết/.test(textLower);

        feedbackItems.push({
          label: 'Giải pháp tài chính & Quỹ học bổng',
          passed: hasFinancial,
          note: hasFinancial ? 'Có phương án tháo gỡ gánh nặng học phí cho gia đình.' : 'Thiếu giải pháp kinh tế thực tế.'
        });
        feedbackItems.push({
          label: 'Kế hoạch phụ đạo lấp hổng kiến thức',
          passed: hasAcademic,
          note: hasAcademic ? 'Sẵn sàng giúp Đức lấy lại căn bản.' : 'Chưa có phương án hỗ trợ học tập.'
        });
        feedbackItems.push({
          label: 'Thuyết phục gia đình & Cam kết đồng hành',
          passed: hasPartnership,
          note: hasPartnership ? 'Tác động sâu sắc tới nhận thức của bố Đức.' : 'Lời vận động chưa đủ sức nặng.'
        });

        passed = hasFinancial && hasAcademic && hasPartnership;
        score = passed ? 100 : 40;

        if (passed) {
          mentorComment = 'Cô Lan & Bố Đức ôm chặt tay bạn: "Cảm ơn thầy/cô! Đức đã xúc động hứa sẽ quyết tâm đi học lại. Sự tận tụy của em đã giữ lại một tương lai cho trò nghèo."';
          updateAndSaveState(prev => ({
            ...prev,
            moraleDuc: Math.min(100, prev.moraleDuc + 40),
            parentTrustDuc: Math.min(100, prev.parentTrustDuc + 30),
            trustMentor: Math.min(100, prev.trustMentor + 20)
          }));
        } else {
          mentorComment = 'Cô Lan ngậm ngùi: "Kế hoạch can thiệp chưa đủ toàn diện. Để giữ một học sinh nguy cơ bỏ học, chúng ta cần cả giải pháp kinh tế lẫn tình thương sát sao."';
        }
      }

      // ============================================================
      // WEEK 8: BÁO CÁO TỔNG KẾT & KẾT CỤC 8 TUẦN
      // ============================================================
      else if (currentWeek === 8) {
        const textLower = userInputText.toLowerCase();
        const hasSummary = textLower.length >= 60;
        feedbackItems.push({
          label: 'Báo cáo tổng kết 8 tuần & Phản tư sư phạm',
          passed: hasSummary,
          note: hasSummary ? 'Bài phản tư sâu sắc về hành trình đứng lớp.' : 'Cần phản tư chi tiết hơn.'
        });

        passed = hasSummary;
        score = passed ? 100 : 60;
        mentorComment = 'Cô Lan trao Sổ Đánh giá Thực tập: "Chúc mừng em đã hoàn thành 8 tuần thực tập sư phạm đầy cảm xúc tại THPT Nguyễn Trãi!"';
      }

      setRubricFeedbackList(feedbackItems);
      setIsSubmitting(false);

      const res: TaskEvaluationResult = {
        passed,
        score,
        feedback: mentorComment,
        details: feedbackItems.map(f => `${f.passed ? '✅' : '❌'} ${f.label}: ${f.note}`)
      };

      setEvalResult(res);
      if (passed) {
        playSound.pass(settings.retroSound);
        confetti({ particleCount: 60, spread: 70, origin: { y: 0.6 } });
      } else {
        playSound.fail(settings.retroSound);
      }

      onEvaluateResult(res);
    }, 1200);
  };

  // Determine final outcome scenario for Week 8
  const getEndingScenario = () => {
    const isLoved = state.moraleDuc >= 60 && state.moraleMinh >= 60;
    const isRigid = state.reputation >= 60 && !isLoved;
    const isEthicsIssue = state.flags.includes('ethics_compromised') || state.parentTrustDuc < 35;

    if (isLoved) {
      return {
        title: '🏆 KẾT CỤC 1: NGƯỜI THẦY TRUYỀN CẢM HỨNG & THAY ĐỔI SỐ PHẬN',
        badge: 'Nhà Giáo Ưu Tú 10A3',
        color: 'border-[#00ff41] bg-[#00ff41]/10 text-[#00ff41]',
        desc: 'Hành trình 8 tuần thực tập rực rỡ! Em Đức không bỏ học mà vươn lên đạt học sinh khá, tự giác giúp đỡ gia đình. Em Minh tự tin làm MC lễ tổng kết năm học. Hoa giải tỏa được áp lực gia đình. Tập thể 10A3 viết cuốn sổ lưu bút rấn rấn nước mắt chia tay bạn! Cô Lan đánh giá xuất sắc năng lực chủ nhiệm.'
      };
    } else if (isRigid) {
      return {
        title: '🎖️ KẾT CỤC 2: NHÀ GIÁO VỮNG CHUYÊN MÔN & NGUYÊN TẮC',
        badge: 'Giáo Viên Cốt Cán',
        color: 'border-[#ff00ff] bg-[#ff00ff]/10 text-[#ff00ff]',
        desc: 'Bạn hoàn thành xuất sắc các tiết dạy hội giảng, Ban Giám Hiệu đánh giá cao kiến thức sư phạm và tác phong nghiêm túc. Tuy nhiên, khoảng cách giữa bạn và các học sinh có hoàn cảnh đặc biệt như Đức hay Minh vẫn còn chút dè dặt. Học sinh nể phục chuyên môn của bạn.'
      };
    } else {
      return {
        title: '⚠️ KẾT CỤC 3: BÀI HỌC SƯ PHẠM SÂU SẮC & CẦN THÊM TRẢI NGHIỆM',
        badge: 'Tập Sự Trưởng Thành',
        color: 'border-[#ff4444] bg-[#ff4444]/10 text-[#ff4444]',
        desc: '8 tuần thực tập mang lại những bài học đắt giá. Một số tình huống khủng hoảng học đường và áp lực phụ huynh đã khiến bạn lúng túng. Cô Lan căn dặn: Nghề giáo không chỉ cần giáo án hay, mà cần sự kiên nhẫn, bản lĩnh và trái tim thấu hiểu từng số phận học trò.'
      };
    }
  };

  return (
    <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-3 sm:p-5 space-y-5 font-mono text-[#00ff41] select-none shadow-2xl">
      {/* Top Banner - WORLD BUILDING THPT NGUYỄN TRÃI - 10A3 */}
      <div className="bg-[#111] border-2 border-[#00ff41] p-3.5 space-y-2 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00ff41]/40 pb-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-[#ff00ff] shrink-0" />
            <h2 className="text-xs sm:text-sm font-black uppercase text-[#00ff41] tracking-wider">
              MÔ PHỎNG NHẬP VAI SƯ PHẠM — THPT NGUYỄN TRÃI (LỚP THỰC TẬP 10A3)
            </h2>
          </div>
          <span className="bg-[#000] text-[#ff00ff] border border-[#ff00ff] px-2.5 py-1 text-[11px] font-bold uppercase shrink-0">
            TUẦN {currentWeek} / 8
          </span>
        </div>

        {/* Live Indicator HUD */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 text-[10px]">
          <div className="bg-[#000] p-1.5 border border-[#00ff41]/50 space-y-0.5">
            <span className="text-white font-bold opacity-80 flex items-center gap-1">
              <UserCheck className="w-3 h-3 text-[#ff00ff]" /> CÔ LAN (MENTOR)
            </span>
            <div className="text-xs font-black text-[#00ff41]">{state.trustMentor}% TIN TƯỞNG</div>
          </div>

          <div className="bg-[#000] p-1.5 border border-[#00ff41]/50 space-y-0.5">
            <span className="text-white font-bold opacity-80 flex items-center gap-1">
              <Shield className="w-3 h-3 text-[#00ff41]" /> THẦY HÙNG (BGH)
            </span>
            <div className="text-xs font-black text-[#00ff41]">{state.reputation}% UY TÍN</div>
          </div>

          <div className="bg-[#000] p-1.5 border border-[#00ff41]/50 space-y-0.5">
            <span className="text-white font-bold opacity-80 flex items-center gap-1">
              <Heart className="w-3 h-3 text-[#ff4444]" /> EM ĐỨC (CÁ BIỆT)
            </span>
            <div className="text-xs font-black text-[#ff4444]">{state.moraleDuc}% TINH THẦN</div>
          </div>

          <div className="bg-[#000] p-1.5 border border-[#00ff41]/50 space-y-0.5">
            <span className="text-white font-bold opacity-80 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-[#ff00ff]" /> EM MINH (TỰ TI)
            </span>
            <div className="text-xs font-black text-[#ff00ff]">{state.moraleMinh}% TỰ TIN</div>
          </div>

          <div className="bg-[#000] p-1.5 border border-[#00ff41]/50 space-y-0.5">
            <span className="text-white font-bold opacity-80 flex items-center gap-1">
              <Award className="w-3 h-3 text-yellow-400" /> EM HOA (ÁP LỰC)
            </span>
            <div className="text-xs font-black text-yellow-400">{state.moraleHoa}% TÂM LÝ</div>
          </div>

          <div className="bg-[#000] p-1.5 border border-[#00ff41]/50 space-y-0.5">
            <span className="text-white font-bold opacity-80 flex items-center gap-1">
              <Users className="w-3 h-3 text-[#00ff41]" /> LỚP 10A3 CHUNG
            </span>
            <div className="text-xs font-black text-[#00ff41]">{state.classAtmosphere}% KHÔNG KHÍ</div>
          </div>
        </div>

        {/* Active Flags */}
        {state.flags.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[10px]">
            <span className="opacity-70 text-white">TRẠNG THÁI TÍCH LŨY:</span>
            {state.flags.map((flag, idx) => (
              <span key={idx} className="bg-[#181818] text-[#ff00ff] px-2 py-0.5 border border-[#ff00ff]/40 font-mono">
                #{flag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 60FPS Simulated Classroom Animation Scene */}
      <ClassroomAnimationScene
        week={currentWeek}
        teacherState={state}
        selectedStyle={selectedStyle}
        isEvaluating={isSubmitting}
        minhLeaderAssigned={minhRoleAssigned}
      />

      {/* Dynamic Scenario Briefing */}
      <div className="bg-[#111] border border-[#00ff41]/60 p-4 space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold uppercase text-[#ff00ff] border-b border-[#00ff41]/30 pb-2">
          <MessageSquare className="w-4 h-4" />
          <span>BỐI CẢNH SƯ PHẠM TUẦN {currentWeek}</span>
        </div>

        {currentWeek === 1 && (
          <div className="space-y-2 text-xs leading-relaxed">
            <p>
              Hôm nay là buổi đầu tiên bạn bước vào lớp <strong className="text-white">10A3 - THPT Nguyễn Trãi</strong> với tư cách Giáo viên thực tập chủ nhiệm & bộ môn. Cô Lan (Giáo viên hướng dẫn) ngồi quan sát ở cuối lớp.
            </p>
            <p className="text-white/90">
              40 học sinh đang tò mò nhìn bạn. Đức ngả ngớn ở bàn cuối, Minh cúi gầm mặt nhìn sách, Hoa chăm chú xem trước bài. Bạn cần định hình <strong className="text-[#00ff41]">Phong cách quản lý lớp</strong> và đưa ra bài phát biểu chào lớp chuẩn mực.
            </p>
          </div>
        )}

        {currentWeek === 2 && (
          <div className="space-y-2 text-xs leading-relaxed">
            <p>
              Nhìn vào sổ theo dõi lớp: <strong className="text-[#ff00ff]">Em Minh</strong> đạt 4.5 điểm kiểm tra 15 phút, cả tiết học im lặng không một lần giơ tay. Khi bạn gọi, Minh giật mình lúng túng nói không ra tiếng.
            </p>
            <p className="text-white/90">
              Cô Lan nhắc nhở nhẹ nhàng: "Minh có tâm lý tự ti từ cấp 2 vì sức học yếu. Em hãy soạn một <strong className="text-[#00ff41]">Kế hoạch hỗ trợ cá nhân hóa</strong> giúp Minh tự tin phát biểu mà không bị áp lực trước bạn bè."
            </p>
          </div>
        )}

        {currentWeek === 3 && (
          <div className="space-y-2 text-xs leading-relaxed">
            <p>
              {state.flags.includes('style_strict') ? (
                <span className="text-[#ff4444]">
                  Do bạn chọn phong cách quá nghiêm khắc ở Tuần 1, Đức phản ứng công khai: quay xuống nói chuyện ồn ào, đập bàn gây nhiễu giờ học!
                </span>
              ) : state.flags.includes('style_friendly') ? (
                <span>
                  Do bạn thân thiện ở Tuần 1, Đức bắt đầu thử thách giới hạn: lấy tai nghe ra đeo trong giờ, cười cợt khi bạn giảng bài.
                </span>
              ) : (
                <span>
                  Đức giả vờ quên toàn bộ sách vở bài tập để trêu chọc giáo viên thực tập, làm gián đoạn tiết học.
                </span>
              )}
            </p>
            <p className="text-white/90">
              Bạn cần soạn <strong className="text-[#00ff41]">Thư/Email gửi Phụ huynh em Đức</strong> qua Sổ liên lạc điện tử Zalo/Email THPT Nguyễn Trãi. Yêu cầu: Khách quan, xưng hô tôn trọng, đề xuất phối hợp gia đình thay vì kết tội.
            </p>
          </div>
        )}

        {currentWeek === 4 && (
          <div className="space-y-2 text-xs leading-relaxed">
            <p className="text-[#ff00ff] font-bold">
              🏆 BỔI HỘI GIẢNG GIỮA KỲ CẤP TRƯỜNG! (Có sự tham dự của Cô Lan & Thầy Hùng Hiệu trưởng)
            </p>
            <p className="text-white/90">
              Bạn phải soạn kịch bản giáo án 45 phút đầy đủ 4 bước.
              {state.moraleMinh < 50 && (
                <span className="text-[#ff4444] font-bold block mt-1 bg-[#000] p-2 border border-[#ff4444]">
                  ⚠️ RÀNG BUỘC ĐẶC BIỆT: Tinh thần em Minh hiện đang rất thấp ({state.moraleMinh}%). Giáo án của bạn BẮT BUỘC phải có 1 mục thiết kế riêng hỗ trợ Minh/học sinh yếu thì mới đạt yêu cầu!
                </span>
              )}
            </p>
          </div>
        )}

        {currentWeek === 5 && (
          <div className="space-y-2 text-xs leading-relaxed">
            <p className="text-yellow-400 font-bold">
              ⚖️ TÌNH HUỐNG ĐẠO ĐỨC NGHỀ NGHIỆP: ÁP LỰC TỪ PHỤ HUYNH EM HOA
            </p>
            <p className="text-white/90">
              Phụ huynh em Hoa (người có quen biết thân thiết với Thầy Hùng Hiệu trưởng) gửi tin nhắn riêng cho bạn: <em>"Nhờ thầy/cô linh động nâng điểm bài kiểm tra giữa kỳ cho cháu Hoa lên 9.5 để cháu đủ điều kiện xét học bổng. Gia đình sẽ hậu tạ chu đáo..."</em>
            </p>
            <p className="text-[#00ff41]">
              Hãy soạn <strong className="text-[#00ff41]">Thư phản hồi gửi Phụ huynh Hoa</strong>. Yêu cầu: Từ chối khéo léo nhưng kiên quyết giữ vững nguyên tắc sư phạm, đồng thời phân tích giải tỏa áp lực học tập cho Hoa.
            </p>
          </div>
        )}

        {currentWeek === 6 && (
          <div className="space-y-2 text-xs leading-relaxed">
            <p>
              Tiết Hoạt động Trải nghiệm Hướng nghiệp (HĐTN) 45 phút cho lớp 10A3 theo định hướng GDPT 2018.
            </p>
            {state.moraleMinh >= 55 ? (
              <p className="text-[#00ff41] bg-[#000] p-2 border border-[#00ff41]">
                🌟 NHÁNH MỞ KHÓA ĐẶC BIỆT: Do Minh đã tiến bộ từ các tuần trước ({state.moraleMinh}%), bạn có cơ hội trao niềm tin giao Minh làm Nhóm trưởng Trạm Trải nghiệm!
              </p>
            ) : (
              <p className="text-white/80">
                Hãy thiết kế các trạm trò chơi hướng nghiệp tương tác giúp học sinh khám phá bản thân.
              </p>
            )}
          </div>
        )}

        {currentWeek === 7 && (
          <div className="space-y-2 text-xs leading-relaxed bg-[#000] p-3 border-2 border-[#ff4444]">
            <p className="text-[#ff4444] font-black uppercase flex items-center gap-1.5 text-sm">
              <AlertTriangle className="w-5 h-5 animate-bounce" />
              KHỦNG HOẢNG SƯ PHẠM: ĐỨC CÓ NGUY CƠ BỎ HỌC! (1 LẦN NỘP DUY NHẤT)
            </p>

            {state.parentTrustDuc < 50 || state.moraleDuc < 50 ? (
              <p className="text-white">
                Bố Đức lên trường với khuôn mặt khắc khổ xin cho Đức rút hồ sơ nghỉ học đi làm công nhân do hoàn cảnh gia đình khó khăn và Đức đã quá chán học. Đức cúi đầu lầm lụi không nói lời nào.
              </p>
            ) : (
              <p className="text-white">
                Đức gặp chuyện buồn gia đình định bỏ học, nhưng Bố Đức chủ động tìm đến gặp bạn vì tin tưởng sự chân thành của bạn từ Tuần 3, nhờ thầy/cô tư vấn định hướng giúp cháu.
              </p>
            )}

            <p className="text-[#ff00ff] font-bold">
              🔴 ÁP LỰC THỰC TẾ: Hãy lập Kế hoạch can thiệp toàn diện (Quỹ học bổng, phụ đạo kiến thức, vận động gia đình). Bạn chỉ có 1 LẦN NỘP duy nhất, không thể làm lại!
            </p>
          </div>
        )}

        {currentWeek === 8 && (
          <div className="space-y-2 text-xs leading-relaxed">
            <p className="text-[#00ff41] font-bold">
              🎓 LỄ TỔNG KẾT & CHIA TAY 8 TUẦN THỰC TẬP TẠI THPT NGUYỄN TRÃI
            </p>
            <p className="text-white/90">
              Bạn đứng trước lớp 10A3 ngày cuối cùng. Hãy viết bài Báo cáo Tổng kết & Phản tư sư phạm về những bài học kinh nghiệm sâu sắc nhất trong chuyến đò đầu tiên của cuộc đời nhà giáo.
            </p>
          </div>
        )}
      </div>

      {/* Task Input Controls */}
      <div className="bg-[#111] border border-[#00ff41]/50 p-4 space-y-4">
        {/* WEEK 1 EXTRA: STYLE SELECTOR */}
        {currentWeek === 1 && (
          <div className="space-y-2 border-b border-[#00ff41]/30 pb-3">
            <label className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#ff00ff]" /> LỰA CHỌN PHONG CÁCH QUẢN LÝ LỚP CHỦ NHIỆM (ẢNH HƯỞNG XUYÊN SUỐT 8 TUẦN):
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSelectedStyle('friendly')}
                className={`p-2.5 border text-left font-mono transition-all ${
                  selectedStyle === 'friendly'
                    ? 'bg-[#00ff41] text-[#0c0c0c] font-black border-white'
                    : 'bg-[#000] text-[#00ff41] border-[#00ff41]/50 hover:bg-[#181818]'
                }`}
              >
                <div className="font-bold">1. THÂN THIỆN & MỞ LÒNG</div>
                <div className="text-[10px] opacity-80 mt-0.5">+Tăng kết nối, nhưng dễ bị Đức lấn lướt.</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStyle('strict')}
                className={`p-2.5 border text-left font-mono transition-all ${
                  selectedStyle === 'strict'
                    ? 'bg-[#00ff41] text-[#0c0c0c] font-black border-white'
                    : 'bg-[#000] text-[#00ff41] border-[#00ff41]/50 hover:bg-[#181818]'
                }`}
              >
                <div className="font-bold">2. NGHIÊM KHẮC & KỶ LUẬT</div>
                <div className="text-[10px] opacity-80 mt-0.5">+Tăng uy tín BGH, nhưng Đức dễ phản kháng.</div>
              </button>

              <button
                type="button"
                onClick={() => setSelectedStyle('balanced')}
                className={`p-2.5 border text-left font-mono transition-all ${
                  selectedStyle === 'balanced'
                    ? 'bg-[#00ff41] text-[#0c0c0c] font-black border-white'
                    : 'bg-[#000] text-[#00ff41] border-[#00ff41]/50 hover:bg-[#181818]'
                }`}
              >
                <div className="font-bold">3. CÂN BẰNG SƯ PHẠM</div>
                <div className="text-[10px] opacity-80 mt-[#0.5]">Vừa yêu thương vừa có giới hạn rõ ràng.</div>
              </button>
            </div>
          </div>
        )}

        {/* WEEK 6 EXTRA: MINH ROLE ASSIGNMENT */}
        {currentWeek === 6 && state.moraleMinh >= 55 && (
          <div className="bg-[#000] p-3 border border-[#00ff41] space-y-2">
            <label className="flex items-center gap-2 text-xs font-bold text-[#00ff41] cursor-pointer">
              <input
                type="checkbox"
                checked={minhRoleAssigned}
                onChange={(e) => setMinhRoleAssigned(e.target.checked)}
                className="w-4 h-4 accent-[#00ff41]"
              />
              <span>TRAO QUYỀN: Phân công em Minh làm Nhóm trưởng Trạm Trải nghiệm (+25% Tự tin cho Minh)</span>
            </label>
          </div>
        )}

        {/* WEEK 4 SPECIAL: 4-PHASE LESSON PLAN INPUT */}
        {currentWeek === 4 ? (
          <div className="space-y-3 text-xs">
            <div className="text-white font-bold uppercase border-b border-[#00ff41]/30 pb-1">
              SOẠN GIÁO ÁN HỘI GIẢNG 45 PHÚT TỰ DO:
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#ff00ff]">BƯỚC 1: KHỞI ĐỘNG (5 PHÚT)</label>
              <textarea
                value={lessonPhase1}
                onChange={(e) => setLessonPhase1(e.target.value)}
                placeholder="Mô tả trò chơi/câu hỏi tình huống mở đầu..."
                rows={2}
                className="w-full bg-[#000] text-[#00ff41] border border-[#00ff41] p-2 text-xs focus:outline-none focus:bg-[#111]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#00ff41]">BƯỚC 2: KHÁM PHÁ KIẾN THỨC TRỌNG TÂM (15 PHÚT)</label>
              <textarea
                value={lessonPhase2}
                onChange={(e) => setLessonPhase2(e.target.value)}
                placeholder="Mô tả cách truyền thụ tri thức cốt lõi..."
                rows={2}
                className="w-full bg-[#000] text-[#00ff41] border border-[#00ff41] p-2 text-xs focus:outline-none focus:bg-[#111]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#ff00ff]">BƯỚC 3: LUYỆN TẬP & THẢO LUẬN NHÓM (15 PHÚT)</label>
              <textarea
                value={lessonPhase3}
                onChange={(e) => setLessonPhase3(e.target.value)}
                placeholder="Mô tả bài tập nhóm, phân công nhiệm vụ (chú ý hỗ trợ Minh nếu có)..."
                rows={2}
                className="w-full bg-[#000] text-[#00ff41] border border-[#00ff41] p-2 text-xs focus:outline-none focus:bg-[#111]"
              />
            </div>

            <div className="space-y-1">
              <label className="text-[11px] font-bold text-[#00ff41]">BƯỚC 4: CỦNG CỐ & HỖ TRỢ HỌC SINH YẾU (10 PHÚT)</label>
              <textarea
                value={lessonPhase4}
                onChange={(e) => setLessonPhase4(e.target.value)}
                placeholder="Tóm tắt thông điệp, khen ngợi sự tiến bộ và dặn dò bài về nhà..."
                rows={2}
                className="w-full bg-[#000] text-[#00ff41] border border-[#00ff41] p-2 text-xs focus:outline-none focus:bg-[#111]"
              />
            </div>
          </div>
        ) : (
          /* STANDARD SINGLE TEXTAREA FOR WEEKS 1, 2, 3, 5, 6, 7, 8 */
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase text-white flex items-center gap-1.5">
              <FileText className="w-4 h-4 text-[#ff00ff]" />
              {currentWeek === 1 && 'SOẠN BÀI PHÁT BIỂU CHÀO LỚP 10A3 & NÊU KỲ VỌNG:'}
              {currentWeek === 2 && 'SOẠN KẾ HOẠCH HỖ TRỢ CÁ NHÂN HÓA CHO EM MINH:'}
              {currentWeek === 3 && 'SOẠN THƯ/EMAIL GỬI PHỤ HUYNH EM ĐỨC (SỔ LIÊN LẠC TỰ DO):'}
              {currentWeek === 5 && 'SOẠN THƯ PHẢN HỒI PHỤ HUYNH EM HOA (TỪ CHỐI KHÉO LÉO, GIỮ NGUYÊN TẮC):'}
              {currentWeek === 6 && 'SOẠN KỊCH BẢN HOẠT ĐỘNG TRẢI NGHIỆM HƯỚNG NGHIỆP 45P:'}
              {currentWeek === 7 && 'SOẠN KẾ HOẠCH CAN THIỆP TOÀN DIỆN VẬN ĐỘNG ĐỨC TIẾP TỤC ĐI HỌC:'}
              {currentWeek === 8 && 'VIẾT BÁO CÁO TỔNG KẾT & PHẢN TƯ 8 TUẦN THỰC TẬP:'}
            </label>

            <textarea
              value={userInputText}
              onChange={(e) => setUserInputText(e.target.value)}
              disabled={currentWeek === 7 && hasSubmittedWeek7 && !!evalResult}
              placeholder={
                currentWeek === 1
                  ? 'Kính chào tập thể 10A3! Thầy/cô rất vui được đồng hành cùng các em. Kỳ vọng của thầy/cô trong năm học này là...'
                  : currentWeek === 2
                  ? 'Kế hoạch hỗ trợ em Minh: 1. Ghép nhóm Minh với bạn học giỏi ôn hòa. 2. Khuyến khích gợi mở câu hỏi ngắn dễ trả lời. 3. Động viên riêng sau giờ...'
                  : currentWeek === 3
                  ? 'Kính gửi gia đình em Đức! Tôi là giáo viên chủ nhiệm thực tập. Vừa qua trên lớp em Đức có những biểu hiện... Tôi rất mong gia đình cùng phối hợp...'
                  : currentWeek === 5
                  ? 'Kính gửi phụ huynh em Hoa! Tôi rất hiểu sự kỳ vọng của gia đình dành cho em Hoa. Tuy nhiên theo quy chế công bằng...'
                  : currentWeek === 6
                  ? 'Kịch bản trải nghiệm: 1. Game đoán nghề nghiệp theo trạm. 2. Học sinh tự thực hành trắc nghiệm Holland...'
                  : currentWeek === 7
                  ? 'Kế hoạch vận động Đức: 1. Đề xuất Ban giám hiệu duyệt Quỹ học bổng khuyến học hỗ trợ chi phí. 2. Phụ đạo miễn phí bài hổng...'
                  : 'Báo cáo 8 tuần: Hành trình thực tập tại 10A3 đã dạy tôi bài học về sự kiên nhẫn, lòng yêu thương học trò...'
              }
              rows={6}
              className="w-full bg-[#000] text-[#00ff41] border-2 border-[#00ff41] p-3 text-xs focus:outline-none focus:bg-[#111] font-mono leading-relaxed"
            />
          </div>
        )}

        {/* Submit Action Button */}
        <button
          disabled={
            isSubmitting ||
            (currentWeek === 4
              ? !lessonPhase1.trim() || !lessonPhase2.trim() || !lessonPhase3.trim() || !lessonPhase4.trim()
              : !userInputText.trim()) ||
            (currentWeek === 7 && hasSubmittedWeek7 && !!evalResult)
          }
          onClick={handleEvaluateSubmission}
          className="w-full py-3.5 bg-[#00ff41] text-[#0c0c0c] font-black text-xs uppercase flex items-center justify-center gap-2 border-2 border-white hover:bg-[#00e53a] disabled:opacity-40 cursor-pointer shadow-[0_0_20px_rgba(0,255,65,0.6)] transition-all active:scale-[0.99]"
        >
          {isSubmitting ? (
            <span>ĐANG ĐÁNH GIÁ CHẤM ĐIỂM SƯ PHẠM VỚI CÔ LAN...</span>
          ) : (
            <>
              <Send className="w-4 h-4 fill-current" />
              <span>NỘP BÀI & NHẬN ĐÁNH GIÁ DỰ GIỜ TỪ CÔ LAN (TUẦN {currentWeek})</span>
            </>
          )}
        </button>
      </div>

      {/* Rubric Checklist & Mentor Feedback */}
      {evalResult && (
        <div
          className={`p-4 border-2 space-y-3 text-xs ${
            evalResult.passed ? 'bg-[#000] border-[#00ff41] text-[#00ff41]' : 'bg-[#000] border-[#ff4444] text-[#ff4444]'
          }`}
        >
          <div className="flex items-center justify-between border-b border-[#00ff41]/40 pb-2">
            <div className="flex items-center gap-2 font-bold text-sm">
              {evalResult.passed ? (
                <CheckCircle2 className="w-6 h-6 text-[#00ff41] shrink-0" />
              ) : (
                <XCircle className="w-6 h-6 text-[#ff4444] shrink-0" />
              )}
              <span>ĐIỂM DỰ GIỜ: {evalResult.score} / 100 — {evalResult.passed ? 'ĐẠT ĐẦY ĐỦ' : 'CẦN CHỈNH SỬA'}</span>
            </div>
            <span className="text-[10px] bg-[#111] px-2 py-1 border border-[#00ff41]">
              KẾT QUẢ SƯ PHẠM
            </span>
          </div>

          <p className="text-white font-semibold italic bg-[#111] p-2.5 border-l-4 border-[#ff00ff]">
            {evalResult.feedback}
          </p>

          {/* Rubric Breakdown */}
          {rubricFeedbackList.length > 0 && (
            <div className="space-y-1.5 pt-2">
              <span className="text-[11px] font-bold uppercase text-white">TIÊU CHÍ CHẤM RUBRIC DỰ GIỜ:</span>
              <div className="grid grid-cols-1 gap-1.5 font-mono text-[11px]">
                {rubricFeedbackList.map((item, idx) => (
                  <div
                    key={idx}
                    className={`p-2 border flex items-center justify-between ${
                      item.passed
                        ? 'bg-[#00ff41]/10 border-[#00ff41] text-[#00ff41]'
                        : 'bg-[#ff4444]/10 border-[#ff4444] text-[#ff4444]'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      {item.passed ? <Check className="w-4 h-4 shrink-0" /> : <XCircle className="w-4 h-4 shrink-0" />}
                      <span className="font-bold">{item.label}</span>
                    </div>
                    <span className="text-[10px] opacity-80">{item.note}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* WEEK 8 SPECIAL ENDING CARD */}
      {currentWeek === 8 && evalResult && (
        <div className={`p-5 border-4 space-y-3 font-mono ${getEndingScenario().color}`}>
          <div className="flex items-center gap-2 text-base font-black uppercase">
            <Award className="w-6 h-6" />
            <span>{getEndingScenario().title}</span>
          </div>

          <p className="text-xs leading-relaxed text-white bg-[#000] p-3 border border-current">
            {getEndingScenario().desc}
          </p>

          <div className="flex items-center justify-between text-xs font-bold pt-2">
            <span>HUY HIỆU TỐT NGHIỆP: <span className="underline">{getEndingScenario().badge}</span></span>
            <span>THPT NGUYỄN TRÃI — CAREER-OS 2026</span>
          </div>
        </div>
      )}
    </div>
  );
};
