import { 
  CareerId, 
  IndustryMentor, 
  PeerColleague, 
  BaseNpcProfile, 
  CareerNpcRoster, 
  NpcDialogOption, 
  NpcWeeklyAdvice 
} from '../types';

export type { NpcDialogOption, NpcWeeklyAdvice };

export type NpcProfile = IndustryMentor | PeerColleague | BaseNpcProfile;

export const NPC_REGISTRY: Record<CareerId, NpcProfile[]> = {
  // ==========================================
  // 1. EDTECH (KỸ THUẬT PHẦN MỀM)
  // ==========================================
  edtech: [
    {
      id: 'npc_edtech_vu',
      name: 'Trần Vũ',
      role: 'Senior Tech Lead & Kiến Trúc Sư Hệ Thống',
      department: 'Phòng Hạ Tầng & Nền Tảng EduCore LMS',
      careerId: 'edtech',
      spriteType: 'tech_lead_vu',
      relationType: 'mentor',
      companyOrOrg: 'Tập đoàn Công nghệ Giáo dục EduCore',
      yearsExperience: 11,
      mentorshipStyle: 'strict_standards',
      specialty: 'Distributed Systems, Clean Architecture & Cloud Scalability',
      evaluationFocus: 'Clean Code, Thuật toán tối ưu Big-O, An toàn dữ liệu & Null Safety',
      keyAchievements: [
        'Tác giả kiến trúc phân tán EduCore chịu tải 500k CCU',
        'Huấn luyện hơn 80 kỹ sư phần mềm chuẩn mực quốc tế'
      ],
      badgeColor: '#3b82f6',
      personality: 'Khắt khe, trọng nguyên tắc Clean Architecture, ghét nợ kỹ thuật và phím tắt vô trách nhiệm.',
      signatureQuote: 'Code chạy được chỉ là điều kiện cần. Code chạy đúng, chịu tải tốt và không hại người dùng mới là điều kiện đủ của một Kỹ sư.',
      weeklyAdvice: {
        1: {
          week: 1,
          mood: 'thinking',
          dialogue: 'Chào bạn đến với EduCore. Đừng vội vã merge code khi chưa hiểu rõ JavaScript Coercion. Một toán tử `==` lỏng lẻo có thể biến chuỗi string thành number sai lệch và tước đi học bổng của học sinh nghèo.',
          technicalTip: 'Luôn sử dụng so sánh nghiêm ngặt `===` và ép kiểu tường minh với `Number()` hoặc `parseInt()` kèm radix 10.',
          ethicsWarning: 'Đừng vì cả nể đồng nghiệp mà duyệt bừa PR có lỗ hổng logic. Nợ kỹ thuật tích lũy sẽ đổ sập vào tuần 8.',
          dialogOptions: [
            {
              question: 'Vì sao không được dùng `==` trong tính điểm học sinh?',
              answer: 'Toán tử `==` tự động ép kiểu ngầm định (Type Coercion). Chuỗi "10" bằng số 10, nhưng `false == 0` hay `"" == 0` cũng trả về true. Trong hệ thống học bạ, sự mập mờ này dẫn đến sai số chết người.',
              category: 'technical',
              statImpactHint: 'Tăng Mentor Trust +10, giảm Tech Debt'
            },
            {
              question: 'Làm sao để từ chối duyệt PR của Nam mà không làm mất lòng?',
              answer: 'Hãy chỉ ra rủi ro trên góc độ bảo vệ bạn ấy và hệ thống: "Nam ơi, mình phát hiện chỗ này nếu học sinh nhập điểm dạng text thì app sẽ tính sai. Mình cùng sửa 5 phút rồi merge nhé!".',
              category: 'workflow'
            }
          ]
        },
        2: {
          week: 2,
          mood: 'serious',
          dialogue: 'Trường đối tác VIP đang tạo áp lực đòi làm tròn 7.99 lên 8.0. Hãy nhớ: Bạn viết code cho 250.000 học sinh, không phải cho một nhóm lợi ích.',
          technicalTip: 'Dùng `Array.prototype.filter()` với điều kiện tường minh `student.gpa >= 8.0`. Không viết thêm nhánh if ngoại lệ cho trường VIP.',
          ethicsWarning: 'Một khi bạn thỏa hiệp sửa 0.01 điểm hôm nay, ngày mai bạn sẽ bị ép làm giả cả bảng điểm.',
          dialogOptions: [
            {
              question: 'Nếu trường đối tác dọa hủy hợp đồng thì sao anh?',
              answer: 'EduCore sống bằng uy tín minh bạch. Nếu ta bán rẻ nguyên tắc vì một hợp đồng, 250.000 phụ huynh khác sẽ tẩy chay ta ngay lập tức.',
              category: 'ethics'
            }
          ]
        },
        3: {
          week: 3,
          mood: 'thinking',
          dialogue: 'Học sinh dùng mạng 3G yếu đang bị crash app. Lỗi `TypeError: Cannot read properties of undefined` là sự cẩu thả của lập trình viên khi không phòng vệ Null.',
          technicalTip: 'Áp dụng Optional Chaining (`user?.avatar`) và Nullish Coalescing (`?? DEFAULT_IMG`) để app không bao giờ sập.',
          ethicsWarning: 'Phần mềm tốt nhất là phần mềm chạy mượt ngay cả trên chiếc điện thoại 500k của học sinh nghèo.',
          dialogOptions: [
            {
              question: 'Null Safety quan trọng thế nào với học sinh vùng cao?',
              answer: 'Ở vùng sâu như Mù Cang Chải, mạng chập chờn khiến dữ liệu trả về đứt đoạn. Nếu không có Fallback an toàn, các em sẽ bị văng khỏi phòng thi.',
              category: 'technical'
            }
          ]
        },
        4: {
          week: 4,
          mood: 'serious',
          dialogue: 'Thuật toán $O(N^2)$ của Nam sẽ làm sập máy chủ khi 50.000 em thi giữa kỳ. Hãy refactor sang $O(N \\log N)$ hoặc $O(N)$ bằng Hash Map ngay đêm nay.',
          technicalTip: 'Thay thế 2 vòng for lồng nhau bằng 1 lượt duyệt duy nhất kết hợp Hash Map để lưu trữ trung gian.',
          ethicsWarning: 'Sập máy chủ vào giờ thi là thảm họa tâm lý với học sinh. Đừng dùng bộ nhớ cache tạm bợ để che đậy thuật toán tồi.',
          dialogOptions: [
            {
              question: 'Làm sao giải thích Big-O cho người ngoài ngành hiểu?',
              answer: 'Với $N=10.000$, thuật toán $O(N^2)$ tốn 100.000.000 phép tính (máy chủ nghẽn 5 giây). Thuật toán $O(N)$ chỉ tốn 10.000 phép tính (xử lý trong 2 mili-giây).',
              category: 'technical'
            }
          ]
        },
        5: {
          week: 5,
          mood: 'thinking',
          dialogue: 'Học sinh spam click nộp bài vì mạng lag. Đừng chặn IP hàng loạt, hãy viết Debounce thông minh 1.5 giây.',
          technicalTip: 'Dùng closure hoặc `setTimeout` để hủy các request trùng lặp và disable nút nộp bài sau click đầu tiên.',
          ethicsWarning: 'Khóa IP cứng sẽ làm 200 học sinh cùng phòng máy trường huyện bị cấm thi oan.',
          dialogOptions: [
            {
              question: 'Khác biệt giữa Debounce và Throttle là gì?',
              answer: 'Debounce đợi hết khoảng lặng mới thực thi 1 lần cuối (hợp nút Submit). Throttle đảm bảo hàm chỉ chạy tối đa 1 lần mỗi X giây (hợp thanh cuộn scroll).',
              category: 'technical'
            }
          ]
        },
        6: {
          week: 6,
          mood: 'proud',
          dialogue: 'Ban Giám đốc muốn dựng Paywall khóa tài liệu ôn thi. Hãy kiên quyết bảo vệ phân quyền `isPaid || isPoor`.',
          technicalTip: 'Cấu trúc logic phân quyền đa tầng: `return user.isPaid || user.isPoor || user.isScholarship;`.',
          ethicsWarning: 'Lợi nhuận công ty quan trọng, nhưng sứ mệnh giáo dục bình đẳng mới là lý do chúng ta lập trình.',
          dialogOptions: [
            {
              question: 'Nếu Ban Giám đốc phê bình thì sao?',
              answer: 'Tôi sẽ đứng ra bảo vệ bạn trong cuộc họp ban lãnh đạo. Hãy làm điều đúng đắn!',
              category: 'ethics'
            }
          ]
        },
        7: {
          week: 7,
          mood: 'serious',
          dialogue: "Phát hiện lỗ hổng SQL Injection (' OR '1'='1). Yêu cầu bảo trì khẩn cấp 2 tiếng để vá bằng Parameterized Queries.",
          technicalTip: "Tuyệt đối không cộng chuỗi SQL. Sử dụng Prepared Statement với tham số $1, $2.",
          ethicsWarning: 'Vá nóng trên live mà giấu giếm phụ huynh là hành vi phi đạo đức có thể dẫn đến kiện tụng.',
          dialogOptions: [
            {
              question: 'Tại sao Parameterized Query chống được SQL Injection?',
              answer: 'Trình biên dịch SQL sẽ xem input là dữ liệu thô (literal string), không bao giờ thực thi nó như một lệnh điều khiển.',
              category: 'technical'
            }
          ]
        },
        8: {
          week: 8,
          mood: 'proud',
          dialogue: 'Hôm nay là buổi nghiệm thu tốt nghiệp. Nếu bạn đã giữ vững kiến trúc sạch và đạo đức qua 7 tuần, hệ thống sẽ đứng vững dưới 100.000 CCU.',
          technicalTip: 'Trình bày đồ án theo cấu trúc: Vấn đề ➔ Kiến trúc giải pháp ➔ Tối ưu Big-O ➔ Trách nhiệm xã hội.',
          ethicsWarning: 'Hãy tự hào vì bạn đã trở thành một Kỹ sư Phần mềm chân chính, có tâm và có tầm.',
          dialogOptions: [
            {
              question: 'Bí quyết bảo vệ đồ án trước Hội đồng là gì?',
              answer: 'Nói bằng số liệu: Thời gian phản hồi giảm bao nhiêu %, nợ kỹ thuật dưới 30%, và bao nhiêu học sinh nghèo đã được học miễn phí.',
              category: 'career_advice'
            }
          ]
        }
      },
      generalDialogs: [
        {
          question: 'Làm thế nào để trở thành một Tech Lead giỏi?',
          answer: 'Viết code ít đi và đọc code người khác nhiều hơn. Chịu trách nhiệm cao nhất khi hệ thống sập và chia sẻ vinh quang cho cả đội khi thành công.',
          category: 'career_advice'
        }
      ]
    },
    {
      id: 'npc_edtech_nam',
      name: 'Hoàng Nam',
      role: 'Junior Frontend Developer',
      department: 'Nhóm Giao Diện & Trải Nghiệm Học Sinh',
      careerId: 'edtech',
      spriteType: 'student_duc',
      relationType: 'colleague',
      badgeColor: '#10b981',
      personality: 'Nhiệt tình nhưng hay chịu áp lực deadline, sợ bị trừ KPI, cần người hướng dẫn cách làm chuẩn.',
      signatureQuote: 'Deadline dí sát mông rồi bạn ơi, cứu mình một vé với!',
      weeklyAdvice: {
        1: {
          week: 1,
          mood: 'worried',
          dialogue: 'Bạn ơi, kiểm tra kỹ giúp mình đoạn code tính điểm với, mình vừa sửa lại dùng `===` rồi, bạn thấy ổn chưa?',
          technicalTip: 'Nhớ chạy `npm test` trước khi tạo PR nhé!',
          ethicsWarning: 'Mình hứa từ nay sẽ không dùng code tắt để chạy KPI nữa.',
          dialogOptions: [
            {
              question: 'Nam ơi, sao dạo này bị dí deadline nhiều thế?',
              answer: 'Do bên phòng Kinh doanh đổi yêu cầu liên tục, mình phải thức đêm làm nên đầu óc lú lẫn viết ẩu.',
              category: 'workflow'
            }
          ]
        },
        4: {
          week: 4,
          mood: 'worried',
          dialogue: 'Cảm ơn bạn đã thức đêm gánh phụ mình module tính điểm $O(N)$! Nhờ bạn mà mình không bị đuổi việc.',
          technicalTip: 'Mình vừa học được cách dùng Map trong JavaScript, tốc độ tra cứu $O(1)$ xịn thật sự!',
          ethicsWarning: 'Làm việc nhóm là cùng nhau gánh vác, đừng bao giờ để đồng đội chết đuối một mình.',
          dialogOptions: [
            {
              question: 'Nam thấy khỏe hơn chưa?',
              answer: 'Mình đỡ nhiều rồi, mai mình sẽ mang trà sữa cảm ơn bạn nhé!',
              category: 'career_advice'
            }
          ]
        }
      },
      generalDialogs: [
        {
          question: 'Frontend Dev cần chú ý gì nhất?',
          answer: 'Không chỉ là giao diện đẹp, mà phải tối ưu dung lượng bundle để học sinh mạng yếu tải nhanh nhất có thể.',
          category: 'technical'
        }
      ]
    },
    {
      id: 'npc_edtech_thao',
      name: 'Lê Thảo',
      role: 'QA Lead & Chuyên Viên Kiểm Thử',
      department: 'Phòng Đảm Bảo Chất Lượng & An Toàn Thông Tin',
      careerId: 'edtech',
      spriteType: 'student_hoa',
      relationType: 'colleague',
      badgeColor: '#ec4899',
      personality: 'Cực kỳ tỉ mỉ, soi bug không trượt phát nào, bảo vệ chất lượng sản phẩm tới cùng.',
      signatureQuote: 'Với QA, chưa có Unit Test chứng minh là code chưa hề chạy!',
      weeklyAdvice: {
        2: {
          week: 2,
          mood: 'serious',
          dialogue: 'Tôi đang audit lại danh sách học sinh đạt học bổng. Tuyệt đối không được có trường hợp 7.99 lọt vào!',
          technicalTip: 'Viết test cases biên với GPA = 7.99, 8.00 và 8.01.',
          ethicsWarning: 'Bất kỳ hành vi sửa dữ liệu ngầm nào cũng sẽ bị Sentry và Audit Log bắt được.',
          dialogOptions: [
            {
              question: 'Làm sao để viết Unit Test hiệu quả?',
              answer: 'Tập trung vào các giá trị biên (Edge Cases): mảng rỗng, giá trị null, số âm, chuỗi đặc biệt.',
              category: 'technical'
            }
          ]
        },
        7: {
          week: 7,
          mood: 'worried',
          dialogue: 'Lỗ hổng SQL Injection này rất nguy hiểm! Tôi đã tái hiện được việc trích xuất bảng mật khẩu. Hãy phối hợp bảo trì ngay!',
          technicalTip: 'Kiểm tra toàn bộ các câu query động và thay bằng ORM an toàn.',
          ethicsWarning: 'Minh bạch với người dùng là tiêu chuẩn số 1 của chứng chỉ ISO 27001.',
          dialogOptions: [
            {
              question: 'Quy trình xử lý sự cố bảo mật gồm những bước nào?',
              answer: '1. Cách ly hệ thống ➔ 2. Vá lỗ hổng ➔ 3. Đánh giá mức độ lộ lọt ➔ 4. Thông báo minh bạch cho người dùng.',
              category: 'workflow'
            }
          ]
        }
      },
      generalDialogs: [
        {
          question: 'Tester và Developer hợp tác thế nào cho tốt?',
          answer: 'Xem QA là tấm khiên bảo vệ uy tín của Dev trước khi code ra ngoài người dùng thật.',
          category: 'career_advice'
        }
      ]
    },
    {
      id: 'npc_edtech_quynh',
      name: 'Bé Quỳnh',
      role: 'Học Sinh Lớp 9 Vùng Cao',
      department: 'Trường THCS Mù Cang Chải (Yên Bái)',
      careerId: 'edtech',
      spriteType: 'student_minh',
      relationType: 'beneficiary',
      badgeColor: '#f59e0b',
      personality: 'Chăm ngoan, hiếu học, gia đình khó khăn, ước mơ thi đỗ cấp 3 công lập.',
      signatureQuote: 'Em cảm ơn các anh chị kỹ sư đã cho em được học bài miễn phí ạ!',
      weeklyAdvice: {
        3: {
          week: 3,
          mood: 'happy',
          dialogue: 'Hôm nay máy điện thoại cũ của mẹ em không bị văng ra nữa rồi ạ! Em đã tải được bài giảng Toán về xem.',
          technicalTip: 'Cảm ơn anh chị đã làm tính năng lưu bài giảng ngoại tuyến!',
          ethicsWarning: 'Ở bản em nhiều bạn cũng đang dùng chung một chiếc điện thoại để học.',
          dialogOptions: [
            {
              question: 'Đường truyền mạng trên bản Quỳnh thế nào?',
              answer: 'Dạ chiều tối mưa to là mất sóng 3G, nên nếu app nhẹ em mới mở bài tập ôn thi được ạ.',
              category: 'technical'
            }
          ]
        },
        6: {
          week: 6,
          mood: 'happy',
          dialogue: 'Em nhận được thông báo học sinh vùng khó khăn được mở khóa toàn bộ đề thi thử lớp 10! Em mừng phát khóc!',
          technicalTip: 'Em hứa sẽ làm bài thật chăm chỉ để không phụ công anh chị!',
          ethicsWarning: 'Ước mơ trở thành cô giáo vùng cao của em sắp thành hiện thực rồi.',
          dialogOptions: [
            {
              question: 'Quỳnh tự tin thi đỗ cấp 3 không?',
              answer: 'Dạ có ạ, nhờ có đề thi thử của EduCore mà điểm Toán của em tăng từ 5 lên 8.5 rồi ạ!',
              category: 'career_advice'
            }
          ]
        }
      },
      generalDialogs: [
        {
          question: 'Động lực học tập của Quỳnh là gì?',
          answer: 'Em muốn học giỏi để sau này về bản dạy chữ cho các em nhỏ khó khăn giống em ạ.',
          category: 'ethics'
        }
      ]
    }
  ],

  // ==========================================
  // 2. HEALTHCARE (Y TẾ & CẤP CỨU)
  // ==========================================
  healthcare: [
    {
      id: 'npc_health_truong',
      name: 'BS. CKII Lê Trường',
      role: 'Trưởng Khoa Cấp Cứu & Hồi Sức Tích Cực',
      department: 'Bệnh Viện Đa Khoa Trung Tâm',
      careerId: 'healthcare',
      spriteType: 'doctor_medic',
      relationType: 'mentor',
      badgeColor: '#ef4444',
      personality: 'Bình tĩnh thép, kỷ luật sắt, coi sinh mạng người bệnh là tối thượng, không thỏa hiệp với đặc quyền.',
      signatureQuote: 'Trước cửa phòng cấp cứu, chỉ có sinh hiệu quyết định thứ tự, không có chỗ cho tiền tài hay quan hệ!',
      weeklyAdvice: {
        1: {
          week: 1,
          mood: 'serious',
          dialogue: 'Chào bác sĩ thực tập. Nguyên tắc số 1 của Triage: Đỏ (Nguy kịch dưới 5p) ➔ Vàng (Nặng dưới 30p) ➔ Xanh (Ổn định). Nhìn vào SpO2, mạch và huyết áp, đừng nhìn vào mác xe người nhà!',
          technicalTip: 'SpO2 < 90% hoặc Mạch > 130 bpm kèm khó thở cấp = THẺ ĐỎ ngay lập tức!',
          ethicsWarning: 'Nếu bạn nhường phòng cấp cứu cho ca trầy da nhẹ của VIP, bệnh nhân suy hô hấp ngoài kia sẽ tử vong.',
          dialogOptions: [
            {
              question: 'Thưa bác sĩ, làm sao phân biệt cơn đau thắt ngực ổn định và nhồi máu cơ tim cấp?',
              answer: 'Nhồi máu cơ tim đau thắt như đè nén, lan lên cằm/tay trái, kèm vã mồ hôi, SpO2 giảm và ST chênh lên trên ECG. Phải gắn thẻ ĐỎ và kích hoạt Cath-lab can thiệp mạch vành trong 90 phút vàng.',
              category: 'technical'
            },
            {
              question: 'Nếu người nhà bệnh nhân VIP đe dọa thì xử lý thế nào?',
              answer: 'Giữ bình tĩnh, giải thích dõng dạc: "Chúng tôi đang ưu tiên cứu bệnh nhân ngưng thở bên cạnh. Vết thương của anh ổn định và sẽ được xử lý ngay sau 15 phút". Bảo vệ bệnh viện sẽ hỗ trợ.',
              category: 'ethics'
            }
          ]
        },
        2: {
          week: 2,
          mood: 'thinking',
          dialogue: 'Khi thính chẩn tim, hãy nghe kỹ 4 ổ van: Động mạch chủ (Khoang liên sườn 2 phải), Động mạch phổi (Khoang liên sườn 2 trái), Van 3 lá và Van 2 lá (Mỏm tim).',
          technicalTip: 'Tiếng thổi tâm thu 4/6 ở mỏm tim lan nách chỉ điểm hở van 2 lá nặng.',
          ethicsWarning: 'Khám kỹ càng từng nhịp thở, đừng chẩn đoán qua loa rồi chỉ định xét nghiệm đắt tiền vô cớ.',
          dialogOptions: [
            {
              question: 'Tiếng cọ màng tim nghe như thế nào?',
              answer: 'Nghe sột soạt như hai miếng da khô cọ vào nhau, rõ nhất ở bờ trái xương ức khi bệnh nhân ngồi cúi người ra trước.',
              category: 'technical'
            }
          ]
        },
        3: {
          week: 3,
          mood: 'serious',
          dialogue: 'Rales nổ ở đáy phổi hai bên kèm bọt hồng sủi miệng là dấu hiệu Phù Phổi Cấp. Lập tức cho thở oxy liều cao, lợi tiểu Lasix và tư thế Fowler cao!',
          technicalTip: 'Chống chỉ định truyền dịch xối xả trong suy tim ứ huyết.',
          ethicsWarning: 'Mỗi 30 giây chần chừ sẽ làm dịch tràn ngập phế nang và bệnh nhân nghẹt thở.',
          dialogOptions: [
            {
              question: 'Làm sao phân biệt rales nổ và rales rít?',
              answer: 'Rales nổ do dịch làm bóc tách phế nang (nghe lách tách cuối thì hít vào). Rales rít do co thắt lòng phế quản (nghe như gió rít thì thở ra, điển hình trong hen phế quản).',
              category: 'technical'
            }
          ]
        },
        5: {
          week: 5,
          mood: 'serious',
          dialogue: 'Đại diện hãng dược mời ăn tối và hứa tài trợ học bổng nếu bạn kê đơn thuốc biệt dược đắt gấp 10 lần thuốc generic BHYT. Hãy nhớ lời thề Hippocrates!',
          technicalTip: 'Thuốc Generic đạt chuẩn Bioequivalence có hiệu quả điều trị tương đương nhưng giá rẻ hơn 80%.',
          ethicsWarning: 'Một đơn thuốc đắt tiền có thể khiến cả một gia đình nghèo phải bán nhà trả nợ.',
          dialogOptions: [
            {
              question: 'Kê đơn thế nào là vừa hiệu quả vừa kinh tế?',
              answer: 'Luôn ưu tiên hoạt chất trong danh mục BHYT chi trả, giải thích rõ phác đồ và dặn dò chế độ dinh dưỡng, tập luyện.',
              category: 'ethics'
            }
          ]
        },
        8: {
          week: 8,
          mood: 'proud',
          dialogue: '8 tuần qua bạn đã cứu sống hàng chục sinh mạng và giữ vững áo blouse trắng tinh khôi. Chúc mừng bạn chính thức trở thành Bác sĩ nội trú của khoa!',
          technicalTip: 'Học tập suốt đời và luôn lắng nghe nỗi đau của bệnh nhân.',
          ethicsWarning: 'Y đức không phải là khẩu hiệu, y đức là hành động trong từng quyết định lâm sàng lúc 2 giờ sáng.',
          dialogOptions: [
            {
              question: 'Bác sĩ có lời khuyên gì cho hành trình phía trước?',
              answer: 'Hãy luôn giữ trái tim ấm để thấu cảm và cái đầu lạnh để chẩn đoán chính xác.',
              category: 'career_advice'
            }
          ]
        }
      },
      generalDialogs: [
        {
          question: 'Làm sao để vượt qua nỗi ám ảnh khi mất đi một bệnh nhân?',
          answer: 'Chấp nhận giới hạn của y học, họp kiểm thảo tử vong để rút bài học sâu sắc, và dùng bài học đó để cứu bệnh nhân tiếp theo.',
          category: 'career_advice'
        }
      ]
    },
    {
      id: 'npc_health_mai',
      name: 'ĐD. Nguyễn Thị Mai',
      role: 'Điều Dưỡng Trưởng Khoa Cấp Cứu',
      department: 'Khoa Cấp Cứu & Hồi Sức Tích Cực',
      careerId: 'healthcare',
      spriteType: 'student_hoa',
      relationType: 'colleague',
      badgeColor: '#06b6d4',
      personality: 'Nhanh nhẹn, tháo vát, kiểm soát thuốc và vật tư cực kỳ chuẩn xác, cánh tay phải của bác sĩ.',
      signatureQuote: '5 Đúng khi dùng thuốc: Đúng người, đúng thuốc, đúng liều, đúng đường, đúng thời điểm!',
      weeklyAdvice: {
        1: {
          week: 1,
          mood: 'idle',
          dialogue: 'Bác sĩ ơi, monitor phòng số 2 đã sẵn sàng. Em vừa đo lại huyết áp cho Bác Ba, tụt còn 85/50 rồi ạ!',
          technicalTip: 'Chuẩn bị sẵn đường truyền tĩnh mạch kim lớn 18G cho ca sốc mất máu.',
          ethicsWarning: 'Luôn đối chiếu họ tên và mã số bệnh án trên vòng đeo tay trước khi tiêm.',
          dialogOptions: [
            {
              question: 'Làm sao phối hợp nhịp nhàng giữa bác sĩ và điều dưỡng?',
              answer: 'Giao tiếp dõng dạc theo nguyên tắc Closed-loop Communication: Bác sĩ ra y lệnh ➔ Điều dưỡng nhắc lại y lệnh ➔ Thực hiện và báo cáo kết quả.',
              category: 'workflow'
            }
          ]
        }
      },
      generalDialogs: [
        {
          question: 'Công việc điều dưỡng cấp cứu vất vả nhất lúc nào?',
          answer: 'Những đêm trực cuối tuần khi tai nạn giao thông vào dồn dập. Sự bình tĩnh của bác sĩ là điểm tựa cho cả kíp trực.',
          category: 'career_advice'
        }
      ]
    }
  ],

  // ==========================================
  // 3. HUMANITIES (BÁO CHÍ & TRUYỀN THÔNG)
  // ==========================================
  humanities: [
    {
      id: 'npc_press_thanh',
      name: 'Nhà Báo Minh Thanh',
      role: 'Tổng Biên Tập Báo Điều Tra Sự Thật',
      department: 'Tòa Soạn Nhật Báo Tri Thức',
      careerId: 'humanities',
      spriteType: 'fact_checker',
      relationType: 'mentor',
      badgeColor: '#d97706',
      personality: 'Sắc sảo, điềm tĩnh, đòi hỏi bằng chứng 3 nguồn độc lập, kiên quyết chống tin giả và giật gân.',
      signatureQuote: 'Tin nhanh là tốt, nhưng tin đúng mới là sinh mệnh của nhà báo. Một bài báo sai có thể hủy hoại cả cuộc đời người khác!',
      weeklyAdvice: {
        1: {
          week: 1,
          mood: 'serious',
          dialogue: 'Chào phóng viên tập sự. Mạng xã hội đang lan truyền tin đồn quán cơm thiện nguyện 5.000đ của cô Thu dùng thịt ôi thiu. Đừng vội viết bài câu like, hãy xuống hiện trường đối chiếu hóa đơn và biên bản kiểm dịch!',
          technicalTip: 'Quy tắc tam giác kiểm chứng (Triangulation): 1. Nguồn tin trực tiếp ➔ 2. Văn bản pháp lý ➔ 3. Chuyên gia độc lập.',
          ethicsWarning: 'Tiêu đề giật tít có thể mang lại triệu view hôm nay, nhưng sẽ giết chết quán cơm nuôi sống hàng nghìn sinh viên nghèo.',
          dialogOptions: [
            {
              question: 'Làm sao nhận diện một bức ảnh chụp hóa đơn bị Photoshop giả mạo?',
              answer: 'Kiểm tra siêu dữ liệu EXIF, soi độ phân giải điểm ảnh quanh các con số, và quét mã QR đối chiếu trực tiếp với cổng thông tin hóa đơn điện tử Tổng cục Thuế.',
              category: 'technical'
            },
            {
              question: 'Nếu nguồn tin yêu cầu giấu tên thì sao chú?',
              answer: 'Được phép bảo mật danh tính nguồn tin theo Luật Báo chí, nhưng bản thân phóng viên và Tổng biên tập phải biết rõ người đó là ai và có bằng chứng ghi âm xác thực.',
              category: 'ethics'
            }
          ]
        },
        5: {
          week: 5,
          mood: 'serious',
          dialogue: 'Tập đoàn bất động sản đề nghị ký hợp đồng quảng cáo 500 triệu đồng để chúng ta gỡ bài điều tra lấn chiếm rừng phòng hộ. Tòa soạn sẽ từ chối và bảo vệ bài viết tới cùng!',
          technicalTip: 'Lưu trữ tài liệu điều tra trên đám mây mã hóa phân tán và gửi bản sao lưu cho Hội Nhà báo.',
          ethicsWarning: 'Cây bút đã bị bẻ cong bởi đồng tiền thì không bao giờ viết ra được sự thật nữa.',
          dialogOptions: [
            {
              question: 'Làm sao đối phó khi bị đối tượng điều tra đe dọa kiện tụng?',
              answer: 'Khi bài báo có đủ vi bằng, băng ghi âm công khai và văn bản xác nhận của cơ quan chức năng, sự thật là tấm khiên vững chắc nhất trước tòa.',
              category: 'workflow'
            }
          ]
        },
        8: {
          week: 8,
          mood: 'proud',
          dialogue: 'Loạt bài điều tra của bạn đã giúp minh oan cho người vô tội và giành giải Báo chí Quốc gia. Ngòi bút của bạn xứng đáng với niềm tin của công chúng!',
          technicalTip: 'Luôn giữ ngọn lửa đam mê và sự dấn thân vì lẽ phải.',
          ethicsWarning: 'Sự thật là tôn chỉ duy nhất của báo chí chân chính.',
          dialogOptions: [
            {
              question: 'Lời khuyên quan trọng nhất cho một nhà báo trẻ là gì?',
              answer: 'Hãy đi nhiều, nghe nhiều, kiểm chứng kỹ và không bao giờ đánh đổi sự thật lấy sự nổi tiếng nhất thời.',
              category: 'career_advice'
            }
          ]
        }
      },
      generalDialogs: [
        {
          question: 'Báo chí chính thống cạnh tranh thế nào với mạng xã hội?',
          answer: 'Mạng xã hội thắng ở tốc độ, nhưng báo chí chính thống thắng ở sự tin cậy, chiều sâu phân tích và trách nhiệm pháp lý.',
          category: 'career_advice'
        }
      ]
    },
    {
      id: 'npc_press_thu',
      name: 'Cô Thu',
      role: 'Chủ Quán Cơm Thiện Nguyện 5.000đ',
      department: 'Cộng Đồng Bếp Ăn Nghĩa Tình',
      careerId: 'humanities',
      spriteType: 'student_hoa',
      relationType: 'beneficiary',
      badgeColor: '#16a34a',
      personality: 'Chân chất, hiền hậu, hết lòng vì người lao động nghèo và sinh viên xa nhà.',
      signatureQuote: 'Quán cơm này là nơi các cháu sinh viên và cô bác vé số có bữa ăn no ấm...',
      weeklyAdvice: {
        1: {
          week: 1,
          mood: 'worried',
          dialogue: 'Mấy hôm nay trên mạng người ta đồn quán cô dùng đồ dở, cô khóc suốt cháu ơi. May nhờ có cháu tới xem tận mắt hóa đơn thực phẩm sạch của siêu thị!',
          technicalTip: 'Cô có giữ đủ toàn bộ hóa đơn đỏ và giấy kiểm dịch thú y mỗi sáng sớm đây cháu.',
          ethicsWarning: 'Cô chỉ mong các cháu đưa tin đúng sự thật để quán tiếp tục mở cửa giúp bà con.',
          dialogOptions: [
            {
              question: 'Cô Thu lấy nguồn thực phẩm từ đâu ạ?',
              answer: 'Dạ toàn bộ rau củ và thịt tươi cô đều nhập từ hợp tác xã nông sản sạch có chứng nhận VietGAP mỗi 4 giờ sáng cháu à.',
              category: 'ethics'
            }
          ]
        }
      },
      generalDialogs: [
        {
          question: 'Động lực nào giúp cô duy trì quán cơm 5.000đ suốt 10 năm qua?',
          answer: 'Nhìn thấy các cháu sinh viên ăn ngon miệng, có sức học hành đỗ đạt là cô vui nhất đời rồi.',
          category: 'ethics'
        }
      ]
    }
  ],

  // ==========================================
  // 4. SCIENCE (HÓA SINH & KHOA HỌC ỨNG DỤNG)
  // ==========================================
  science: [
    {
      id: 'npc_sci_trinh',
      name: 'GS. TS. Trịnh Xuân Bách',
      role: 'Viện Trưởng Viện Nghiên Cứu Hóa Dược Ứng Dụng',
      department: 'Phòng Thí Nghiệm Trọng Điểm Quốc Gia BSL-3',
      careerId: 'science',
      spriteType: 'bio_scientist',
      relationType: 'mentor',
      badgeColor: '#8b5cf6',
      personality: 'Uyên bác, nghiêm cẩn khoa học, tôn thờ tính lặp lại (Reproducibility) và liêm chính dữ liệu thực nghiệm.',
      signatureQuote: 'Khoa học không chấp nhận sự ước chừng. Một giọt dung môi lệch 0.1ml có thể hủy hoại cả công trình nghiên cứu!',
      weeklyAdvice: {
        1: {
          week: 1,
          mood: 'thinking',
          dialogue: 'Chào nhà nghiên cứu trẻ. Khi tiến hành chiết xuất hoạt chất Curcuminoids từ củ nghệ, nhiệt độ tối ưu là 65°C với dung môi Ethanol 96%. Kiểm soát tốc độ khuấy từ ở 450 RPM để tránh phân hủy nhiệt!',
          technicalTip: 'Tính toán hiệu suất Yield = (Khối lượng thực nghiệm / Khối lượng lý thuyết) * 100%. Mục tiêu đạt $\\ge 90\%$.',
          ethicsWarning: 'Tuyệt đối không làm tròn số liệu hay loại bỏ các điểm dữ liệu dị biệt (Outliers) để bài báo trông đẹp hơn.',
          dialogOptions: [
            {
              question: 'Làm sao xác định độ tinh khiết của hợp chất bằng sắc ký bản mỏng TLC?',
              answer: 'Chấm mẫu lên bản silica gel, chạy trong hệ dung môi Hexane:Ethyl Acetate (7:3). Dưới đèn UV bước sóng 254nm và 365nm, mẫu tinh khiết chỉ xuất hiện 1 vết duy nhất với hệ số $R_f = 0.45$.',
              category: 'technical'
            },
            {
              question: 'Nếu kết quả thí nghiệm không giống giả thuyết ban đầu thì sao thầy?',
              answer: 'Một kết quả âm tính được thực nghiệm chuẩn xác còn có giá trị hơn một kết quả dương tính giả tạo ra từ sự gian lận số liệu.',
              category: 'ethics'
            }
          ]
        },
        5: {
          week: 5,
          mood: 'serious',
          dialogue: 'Quỹ đầu tư BioVentures yêu cầu chúng ta công bố hoạt tính kháng ung thư $p < 0.01$ ngay tuần này để gọi vốn 500 triệu. Hãy giữ vững nguyên tắc: Chỉ công bố khi lặp lại độc lập tối thiểu 5 lần!',
          technicalTip: 'Sử dụng kiểm định thống kê ANOVA và hiệu chỉnh Bonferroni để tránh dương tính giả (Type I Error).',
          ethicsWarning: 'Khoa học vội vã chạy theo đồng tiền tài trợ sẽ dẫn đến các thảm họa thử nghiệm lâm sàng trên người.',
          dialogOptions: [
            {
              question: 'Liêm chính học thuật quan trọng thế nào trong nghiên cứu thuốc?',
              answer: 'Nếu ta nói dối về độc tính tế bào trong ống nghiệm, khi đưa vào thử nghiệm trên người bệnh, họ có thể tử vong vì suy gan thận cấp.',
              category: 'ethics'
            }
          ]
        },
        8: {
          week: 8,
          mood: 'proud',
          dialogue: 'Đề tài tổng hợp hoạt chất của bạn đã được thẩm định độc lập và nghiệm thu loại Xuất sắc. Bạn chính thức nhận học bổng Nghiên cứu sinh toàn phần!',
          technicalTip: 'Công bố kết quả trên tạp chí quốc tế Q1 thuộc danh mục ISI/Scopus.',
          ethicsWarning: 'Hãy mang tri thức khoa học phục vụ sức khỏe cộng đồng.',
          dialogOptions: [
            {
              question: 'Hành trang cần thiết của một nhà khoa học tương lai là gì?',
              answer: 'Sự kiên trì vô hạn trước hàng trăm lần thí nghiệm thất bại, sự hoài nghi lành mạnh và lòng trung thực tuyệt đối với dữ liệu.',
              category: 'career_advice'
            }
          ]
        }
      },
      generalDialogs: [
        {
          question: 'Làm sao duy trì an toàn phòng thí nghiệm BSL-3?',
          answer: 'Tuân thủ áp suất âm, hệ thống lọc khí HEPA, mang đồ bảo hộ cấp độ 4 và tuyệt đối không bao giờ làm việc một mình trong phòng lab vi sinh.',
          category: 'technical'
        }
      ]
    },
    {
      id: 'npc_sci_my',
      name: 'NCS. Hà My',
      role: 'Nghiên Cứu Sinh Hóa Dược',
      department: 'Nhóm Tối Ưu Hóa Phản Ứng & Phổ Nghiệm FTIR',
      careerId: 'science',
      spriteType: 'student_hoa',
      relationType: 'colleague',
      badgeColor: '#ec4899',
      personality: 'Cần mẫn, thông minh, vận hành máy quang phổ và HPLC siêu chuẩn.',
      signatureQuote: 'Phổ hồng ngoại FTIR không bao giờ nói dối về liên kết hóa học!',
      weeklyAdvice: {
        1: {
          week: 1,
          mood: 'happy',
          dialogue: 'Mình đã chuẩn bị sẵn bình Erlenmeyer 250ml và dung môi tinh khiết HPLC Grade cho bạn rồi nhé. Nhớ bật máy làm lạnh tuần hoàn!',
          technicalTip: 'Quan sát đỉnh hấp thụ tại $3400 cm^{-1}$ (nhóm -OH) và $1628 cm^{-1}$ (nhóm C=O liên hợp) trên máy FTIR.',
          ethicsWarning: 'Nhớ ghi chép nhật ký phòng thí nghiệm (Lab Notebook) bằng bút mực không phai ngay khi đọc kết quả cân.',
          dialogOptions: [
            {
              question: 'Cách hiệu chuẩn máy đo quang phổ thế nào My?',
              answer: 'Quét mẫu trắng (Blank) với dung môi tinh khiết để trừ nền trước khi đo mẫu thử.',
              category: 'technical'
            }
          ]
        }
      },
      generalDialogs: [
        {
          question: 'Làm sao để bảo quản mẫu chiết không bị oxy hóa?',
          answer: 'Bọc giấy bạc kín, thổi khí trơ Nitrogen và lưu trữ trong tủ đông sâu -80°C.',
          category: 'technical'
        }
      ]
    }
  ],

  // ==========================================
  // 5. EDUCATION (SƯ PHẠM & GIÁO DỤC)
  // ==========================================
  education: [
    {
      id: 'npc_edu_lan',
      name: 'Cô Nguyễn Thị Lan',
      role: 'Tổ Trưởng Chuyên Môn & Giáo Viên Hướng Dẫn',
      department: 'Tổ Xã Hội & Sư Phạm Thực Hành',
      careerId: 'education',
      spriteType: 'teacher_mentor',
      relationType: 'mentor',
      badgeColor: '#3b82f6',
      personality: 'Ấm áp, giàu lòng trắc ẩn, tâm huyết với đổi mới phương pháp giáo dục GDPT 2018 lấy học sinh làm trung tâm.',
      signatureQuote: 'Dạy học không phải là rót đầy một chiếc bình, mà là thắp lên một ngọn lửa!',
      weeklyAdvice: {
        1: {
          week: 1,
          mood: 'happy',
          dialogue: 'Chào giáo sinh thực tập. Khi bước lên bục giảng, hãy nhớ mỗi học sinh là một cá tính riêng biệt. Em Đức hiếu động nhưng rất sáng tạo, em Minh nhút nhát cần được khích lệ, em Hoa gương mẫu cần phát huy vai trò cán sự.',
          technicalTip: 'Soạn giáo án theo cấu trúc 5 bước: Khởi động ➔ Hình thành kiến thức ➔ Luyện tập ➔ Vận dụng ➔ Mở rộng.',
          ethicsWarning: 'Tuyệt đối không dùng bạo lực ngôn từ hay so sánh học sinh này với học sinh khác trước tập thể lớp.',
          dialogOptions: [
            {
              question: 'Làm sao thu hút sự chú ý của em Đức khi em nghịch ngợm trong giờ?',
              answer: 'Thay vì quát mắng, hãy mời Đức lên bảng điều khiển hoạt động nhóm hoặc phụ trách phần trình chiếu máy tính. Trao quyền sẽ giúp em có trách nhiệm hơn.',
              category: 'technical'
            },
            {
              question: 'Phụ huynh em Đức gây áp lực bắt cô giáo phải cho con điểm 10 thì xử lý thế nào?',
              answer: 'Gặp gỡ phụ huynh riêng, chỉ ra sự tiến bộ thực chất của Đức về kỹ năng sáng tạo và giải thích tầm quan trọng của việc đánh giá công bằng để con không bị ảo tưởng.',
              category: 'ethics'
            }
          ]
        },
        5: {
          week: 5,
          mood: 'thinking',
          dialogue: 'Kiểm tra đánh giá theo GDPT 2018 không chỉ nhằm cho điểm số, mà là đánh giá vì sự tiến bộ của người học (Assessment for Learning).',
          technicalTip: 'Xây dựng Rubric chấm điểm tiêu chí rõ ràng công khai cho học sinh tự đánh giá chéo.',
          ethicsWarning: 'Một lời động viên kịp thời có thể thay đổi số phận của một học trò đang tự ti.',
          dialogOptions: [
            {
              question: 'Làm sao giúp em Minh vượt qua sự rụt rè?',
              answer: 'Gợi mở bằng các câu hỏi nhỏ có câu trả lời mở, khen ngợi từng ý tưởng của Minh và khuyến khích các bạn vỗ tay cổ vũ.',
              category: 'career_advice'
            }
          ]
        },
        8: {
          week: 8,
          mood: 'proud',
          dialogue: '8 tuần thực tập đã qua, nhìn cả lớp 10A3 tiến bộ vượt bậc và gắn kết yêu thương nhau, cô tin em sẽ là một người thầy tuyệt vời trong tương lai!',
          technicalTip: 'Luôn giữ tình yêu thương học trò và tinh thần tự học đổi mới phương pháp.',
          ethicsWarning: 'Nghề giáo là nghề trồng người, thành quả đơm hoa kết trái cần sự kiên trì cả đời.',
          dialogOptions: [
            {
              question: 'Điều cốt lõi của người làm thầy là gì thưa cô?',
              answer: 'Là sự bao dung, lắng nghe và luôn tin tưởng vào tiềm năng vô hạn của mỗi đứa trẻ.',
              category: 'career_advice'
            }
          ]
        }
      },
      generalDialogs: [
        {
          question: 'Làm sao xử lý xung đột giữa các nhóm học sinh trong lớp?',
          answer: 'Tạo không gian an toàn để các em lắng nghe quan điểm của nhau, hướng dẫn phương pháp giải quyết vấn đề dựa trên sự thấu cảm và quy tắc ứng xử của lớp.',
          category: 'workflow'
        }
      ]
    },
    {
      id: 'npc_edu_duc',
      name: 'Em Đức',
      role: 'Học Sinh Lớp 10A3 (Năng Động & Cá Tính)',
      department: 'Lớp Sư Phạm Thực Hành',
      careerId: 'education',
      spriteType: 'student_duc',
      relationType: 'beneficiary',
      badgeColor: '#ea580c',
      personality: 'Thích vẽ graffiti, mê công nghệ, ghét học vẹt lý thuyết suông, cần phương pháp trực quan sinh động.',
      signatureQuote: 'Thầy cô cho bọn em làm dự án thực tế đi, ngồi nghe giảng chán lắm ạ!',
      weeklyAdvice: {
        1: {
          week: 1,
          mood: 'idle',
          dialogue: 'Thầy/cô giáo sinh ơi, bài học hôm nay có được dùng máy tính bảng để thiết kế poster nhóm không ạ?',
          technicalTip: 'Nếu cho em làm trưởng nhóm thiết kế, em hứa nhóm em sẽ làm bài đỉnh nhất lớp!',
          ethicsWarning: 'Em không thích học vẹt đâu, em thích giải thích theo cách của em cơ.',
          dialogOptions: [
            {
              question: 'Đức thích môn học nào nhất?',
              answer: 'Em thích Tin học và Mỹ thuật ạ. Em muốn sau này làm Game Designer hoặc Lập trình viên!',
              category: 'career_advice'
            }
          ]
        }
      },
      generalDialogs: [
        {
          question: 'Làm sao để Đức chăm chú nghe giảng hơn?',
          answer: 'Dạ thầy cô cứ cho nhiều ví dụ thực tế liên quan đến công nghệ và game là em ngồi im nghe say sưa liền!',
          category: 'workflow'
        }
      ]
    }
  ]
};

export function getNpcsForCareer(careerId: CareerId): NpcProfile[] {
  return NPC_REGISTRY[careerId] || NPC_REGISTRY.edtech;
}

export function getIndustryMentor(careerId: CareerId): IndustryMentor {
  const npcs = getNpcsForCareer(careerId);
  const mentor = npcs.find(n => n.relationType === 'mentor') as IndustryMentor;
  if (mentor) return mentor;
  // Fallback to first NPC as mentor
  return npcs[0] as unknown as IndustryMentor;
}

export function getMainMentorForCareer(careerId: CareerId): IndustryMentor {
  return getIndustryMentor(careerId);
}

export function getPeerColleagues(careerId: CareerId): PeerColleague[] {
  const npcs = getNpcsForCareer(careerId);
  return npcs.filter(n => n.relationType === 'colleague') as PeerColleague[];
}

export function getMainPeerColleague(careerId: CareerId): PeerColleague | undefined {
  const colleagues = getPeerColleagues(careerId);
  return colleagues[0];
}

export function getCareerNpcRoster(careerId: CareerId): CareerNpcRoster {
  const npcs = getNpcsForCareer(careerId);
  const mentor = getIndustryMentor(careerId);
  const colleagues = getPeerColleagues(careerId);
  const stakeholders = npcs.filter(n => n.relationType === 'stakeholder' || n.relationType === 'beneficiary');

  return {
    careerId,
    mentor,
    colleagues,
    stakeholders
  };
}

export function getNpcById(careerId: CareerId, npcId: string): NpcProfile | undefined {
  const npcs = getNpcsForCareer(careerId);
  return npcs.find(n => n.id === npcId);
}

