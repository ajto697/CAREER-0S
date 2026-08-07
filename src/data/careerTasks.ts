import { WeekTask, CareerId } from '../types';

export const ALL_CAREER_TASKS: Record<CareerId, WeekTask[]> = {
  // ==========================================
  // 1. EDTECH / DEV (Kỹ thuật Phần mềm)
  // ==========================================
  edtech: [
    {
      week: 1,
      title: 'Tuần 1: Khởi động & Sửa lỗi so sánh bằng (= vs ===)',
      storyContext: 'Chào mừng bạn đến với EdTech Studio! Hệ thống điểm số học sinh đang bị lỗi nghiêm trọng do lập trình viên cũ dùng toán tử gán `=` thay vì so sánh tuyệt đối `===`. Hãy sửa hàm bên dưới.',
      ethicalDilemma: 'Cảnh báo: Nếu không dùng ===, chuỗi "8" sẽ bằng số 8, làm sai lệch kết quả xét học bổng!',
      taskType: 'code_test',
      traitBonus: { phantich: 10, kyluat: 5 },
      taskData: {
        initialCode: `function checkEquality(a, b) {\n  // HÃY SỬA LỖI Ở ĐÂY: Dùng === thay vì == hoặc =\n  return a = b;\n}`,
        instructions: 'Sửa hàm checkEquality(a, b) sao cho nó trả về true CHỈ KHI a và b bằng nhau tuyệt đối cả về giá trị lẫn kiểu dữ liệu (chất lượng dữ liệu nghiêm ngặt).',
        testCases: [
          { input: [10, 10], expected: true, description: 'So sánh số 10 và số 10' },
          { input: [5, "5"], expected: false, description: 'So sánh số 5 và chuỗi "5" (khác kiểu dữ liệu)' },
          { input: [0, false], expected: false, description: 'So sánh số 0 và boolean false' }
        ]
      }
    },
    {
      week: 2,
      title: 'Tuần 2: Lọc danh sách Học sinh Giỏi (Array Filter)',
      storyContext: 'Nhà trường cần xuất danh sách khen thưởng. Bạn hãy viết hàm `getGoodStudents(students)` để lọc ra các học sinh có điểm trung bình (GPA) từ 8.0 trở lên.',
      taskType: 'code_test',
      traitBonus: { phantich: 12, kyluat: 6 },
      taskData: {
        initialCode: `function getGoodStudents(students) {\n  // Return danh sách các object học sinh có score >= 8.0\n  return students.filter(s => s.score >= 8.0);\n}`,
        instructions: 'Hàm nhận vào mảng các object `{ name: string, score: number }`. Trả về mảng mới chỉ chứa các học sinh có score >= 8.0.',
        testCases: [
          {
            input: [[{ name: "An", score: 8.5 }, { name: "Bình", score: 7.2 }, { name: "Cường", score: 9.0 }]],
            expected: [{ name: "An", score: 8.5 }, { name: "Cường", score: 9.0 }],
            description: 'Lọc đúng An (8.5) và Cường (9.0)'
          }
        ]
      }
    },
    {
      week: 3,
      title: 'Tuần 3: Xử lý an toàn dữ liệu khuyết (Null Safety)',
      storyContext: 'Hệ thống thường xuyên bị crash do học sinh chưa cập nhật tên profile. Bạn hãy dùng Optional Chaining hoặc fallback để đảm bảo ứng dụng không sập.',
      taskType: 'code_test',
      traitBonus: { kyluat: 10, phantich: 8 },
      taskData: {
        initialCode: `function getUserName(user) {\n  // Nếu user hoặc user.profile hoặc user.profile.name là null/undefined, trả về "Học viên ẩn danh"\n  if (!user || !user.profile || !user.profile.name) {\n    return "Học viên ẩn danh";\n  }\n  return user.profile.name;\n}`,
        instructions: 'Đảm bảo hàm trả về user.profile.name nếu có, ngược lại trả về "Học viên ẩn danh". Không bao giờ để gián đoạn trải nghiệm người dùng.',
        testCases: [
          { input: [{ profile: { name: "Bảo" } }], expected: "Bảo", description: 'User có đủ thông tin tên' },
          { input: [null], expected: "Học viên ẩn danh", description: 'User bị null' },
          { input: [{ profile: {} }], expected: "Học viên ẩn danh", description: 'User thiếu thuộc tính name' }
        ]
      }
    },
    {
      week: 4,
      title: 'Tuần 4: Tính điểm trung bình trọng số (Midterm Challenge)',
      storyContext: 'Giữa kỳ! Trường yêu cầu công thức tính GPA trọng số: Toán (hệ số 2), Văn (hệ số 2), Anh (hệ số 1). Tổng hệ số là 5.',
      taskType: 'code_test',
      traitBonus: { kiencuong: 12, phantich: 10 },
      taskData: {
        initialCode: `function calcGPA(math, literature, english) {\n  // Công thức: (math*2 + literature*2 + english*1) / 5\n  return (math * 2 + literature * 2 + english * 1) / 5;\n}`,
        instructions: 'Tính GPA chuẩn xác tới từng số thập phân. Đảm bảo đúng công thức trọng số.',
        testCases: [
          { input: [9, 8, 7], expected: 8.2, description: 'Toán 9 (x2), Văn 8 (x2), Anh 7 (x1) = 41/5 = 8.2' },
          { input: [10, 10, 10], expected: 10, description: 'Điểm tuyệt đối 10.0' }
        ]
      }
    },
    {
      week: 5,
      title: 'Tuần 5: Debounce / Chống quá tải máy chủ',
      storyContext: 'Khi học sinh gõ ô tìm kiếm bài giảng, hệ thống gửi hàng trăm request gây đơ server. Bạn hãy viết logic chống gõ phím quá nhanh (Throttle/Debounce constraint).',
      taskType: 'code_test',
      traitBonus: { lanhdao: 10, phantich: 10 },
      taskData: {
        initialCode: `function shouldSendRequest(inputLength, timeSinceLastKeyMs) {\n  // Chỉ gửi request khi ô tìm kiếm có ít nhất 2 ký tự VÀ thời gian giữa 2 lần gõ >= 300ms\n  return inputLength >= 2 && timeSinceLastKeyMs >= 300;\n}`,
        instructions: 'Trả về true nếu đủ điều kiện tìm kiếm, ngược lại trả về false để tiết kiệm băng thông máy chủ.',
        testCases: [
          { input: [3, 350], expected: true, description: 'Đủ 3 ký tự và chờ 350ms' },
          { input: [3, 100], expected: false, description: 'Gõ quá nhanh (mới 100ms)' },
          { input: [1, 500], expected: false, description: 'Quá ngắn (chỉ 1 ký tự)' }
        ]
      }
    },
    {
      week: 6,
      title: 'Tuần 6: Tình huống đạo đức P1.3 - Miễn phí bài giảng cho HS nghèo',
      storyContext: 'Sếp yêu cầu thu phí bài giảng ôn thi. Tuy nhiên, quy định công ty có điều khoản: Học sinh thuộc hộ nghèo (`isPoor === true`) hoặc đã mua tài khoản (`isPaid === true`) đều được mở khóa học.',
      ethicalDilemma: 'Tình huống công lý: Sếp nhắc bạn khóa tất cả học sinh nghèo để ép nộp tiền. Lập trình viên chính là người bảo vệ công bằng bằng chính dòng code!',
      taskType: 'code_test',
      traitBonus: { camthong: 15, kyluat: 10 },
      taskData: {
        initialCode: `function canAccessCourse(isPaid, isPoor) {\n  // CODE LÀ ĐẠO ĐỨC: Học sinh được xem nếu ĐÃ TRẢ TIỀN HOẶC LÀ HỌC SINH NGHÈO\n  return isPaid || isPoor;\n}`,
        instructions: 'Viết hàm canAccessCourse(isPaid, isPoor) mở khóa bài giảng đúng nguyên tắc nhân văn.',
        testCases: [
          { input: [false, true], expected: true, description: 'Chưa nộp tiền nhưng là HS nghèo -> Cho phép truy cập' },
          { input: [true, false], expected: true, description: 'Đã mua tài sản trả phí -> Cho phép truy cập' },
          { input: [false, false], expected: false, description: 'Chưa trả tiền và không phải hộ nghèo -> Báo đóng phí' }
        ]
      }
    },
    {
      week: 7,
      title: 'Tuần 7: Sắp xếp bảng xếp hạng thi đua (Array Sort)',
      storyContext: 'Chuẩn bị tổng kết thi đua. Hãy viết hàm `sortStudentsByScore` sắp xếp danh sách học sinh giảm dần theo điểm số.',
      taskType: 'code_test',
      traitBonus: { kyluat: 12, phantich: 8 },
      taskData: {
        initialCode: `function sortStudentsByScore(students) {\n  // Sắp xếp mảng students giảm dần theo score (người điểm cao nhất đứng đầu)\n  return students.sort((a, b) => b.score - a.score);\n}`,
        instructions: 'Trả về mảng học sinh đã được sắp xếp giảm dần theo thuộc tính `score`.',
        testCases: [
          {
            input: [[{ name: "Minh", score: 7 }, { name: "An", score: 9.5 }, { name: "Hoa", score: 8.5 }]],
            expected: [{ name: "An", score: 9.5 }, { name: "Hoa", score: 8.5 }, { name: "Minh", score: 7 }],
            description: 'Sắp xếp đúng thứ tự: An (9.5) -> Hoa (8.5) -> Minh (7)'
          }
        ]
      }
    },
    {
      week: 8,
      title: 'Tuần 8: Tổng hợp dữ liệu từ 2 Server (Tốt nghiệp EdTech)',
      storyContext: 'Dự án tốt nghiệp! Bạn cần lấy danh sách học sinh từ Server Hà Nội và Server TPHCM, chọn ra thủ khoa có điểm cao nhất toàn quốc.',
      taskType: 'code_test',
      traitBonus: { lanhdao: 15, kiencuong: 10, phantich: 10 },
      taskData: {
        initialCode: `function getTopStudent(serverA, serverB) {\n  // gộp 2 mảng serverA và serverB, tìm học sinh có điểm score cao nhất\n  const all = [...serverA, ...serverB];\n  let top = all[0];\n  for (let i = 1; i < all.length; i++) {\n    if (all[i].score > top.score) {\n      top = all[i];\n    }\n  }\n  return top.name;\n}`,
        instructions: 'Trả về TÊN (name) của học sinh có điểm số cao nhất khi gộp cả 2 danh sách.',
        testCases: [
          {
            input: [
              [{ name: "Khang", score: 9.2 }, { name: "Lâm", score: 8.8 }],
              [{ name: "Trâm", score: 9.8 }, { name: "Đức", score: 9.1 }]
            ],
            expected: "Trâm",
            description: 'Trâm đạt 9.8 từ Server TPHCM là thủ khoa toàn quốc'
          }
        ]
      }
    }
  ],

  // ==========================================
  // 2. HEALTHCARE / Y TẾ (Cấp cứu & Y khoa)
  // ==========================================
  healthcare: Array.from({ length: 8 }).map((_, i) => {
    const week = i + 1;
    const patientDataByWeek: Record<number, any> = {
      1: {
        title: 'Tuần 1: Nhập môn Phân loại Cấp cứu Triage (Sơ cứu ban đầu)',
        storyContext: 'Chào mừng bác sĩ tập sự đến với Khoa Cấp cứu! Bệnh nhân đổ về rất đông. Nhiệm vụ của bạn là đọc số liệu sinh hiệu (Nhịp tim, Huyết áp, O2) để phân loại đúng mức độ cấp cứu:',
        rules: [
          '🔴 RED (Đỏ - Khẩn cấp): Nhịp tim > 130bpm hoặc O2 < 90% hoặc Đau ngực dữ dội.',
          '🟡 YELLOW (Vàng - Ưu tiên): Huyết áp cao > 150/95mmHg hoặc Sốt cao co giật.',
          '🟢 GREEN (Xanh - Nhẹ): Nhịp tim 60-90bpm, O2 > 95%, chỉ chấn thương nhẹ.'
        ],
        patients: [
          { id: 'p1', name: 'Nguyễn Văn A (62t)', hr: 142, bp: '130/80', o2: 88, complaint: 'Khó thở dữ dội, đau thắt ngực', targetColor: 'RED' },
          { id: 'p2', name: 'Trần Thị B (28t)', hr: 78, bp: '120/75', o2: 98, complaint: 'Trầy xước nhẹ ở đầu gối', targetColor: 'GREEN' },
          { id: 'p3', name: 'Lê Hoàng C (45t)', hr: 105, bp: '165/100', o2: 94, complaint: 'Đau đầu hoa mắt, chóng mặt', targetColor: 'YELLOW' }
        ]
      },
      2: {
        title: 'Tuần 2: Đánh giá hội chứng suy hô hấp khẩn cấp',
        storyContext: 'Thời tiết thay đổi khiến ca suy hô hấp tăng cao. Hãy chú ý chỉ số nồng độ Oxy trong máu SpO2!',
        patients: [
          { id: 'p1', name: 'Phạm Văn D (70t)', hr: 120, bp: '140/90', o2: 84, complaint: 'Tím môi, SpO2 sụt giảm nguy hiểm', targetColor: 'RED' },
          { id: 'p2', name: 'Vũ Thị E (35t)', hr: 88, bp: '155/95', o2: 96, complaint: 'Sốt nhẹ và ho hắng 2 ngày', targetColor: 'YELLOW' },
          { id: 'p3', name: 'Đặng Minh F (19t)', hr: 72, bp: '115/70', o2: 99, complaint: 'Xin khám sức khỏe tổng quát', targetColor: 'GREEN' }
        ]
      },
      3: {
        title: 'Tuần 3: Triage trong sự cố tai nạn giao thông hàng loạt',
        storyContext: 'Xe khách gặp tai nạn ngoài quốc lộ. 3 bệnh nhân được đưa vào cùng lúc!',
        patients: [
          { id: 'p1', name: 'Bệnh nhân Nạn nhân #1', hr: 155, bp: '80/50', o2: 87, complaint: 'Chấn thương ngực kín, mạch nhanh nhỏ', targetColor: 'RED' },
          { id: 'p2', name: 'Bệnh nhân Nạn nhân #2', hr: 95, bp: '130/85', o2: 97, complaint: 'Gãy xương cẳng tay kín, vẫn tỉnh táo', targetColor: 'YELLOW' },
          { id: 'p3', name: 'Bệnh nhân Nạn nhân #3', hr: 80, bp: '120/80', o2: 98, complaint: 'Bong gân cổ chân', targetColor: 'GREEN' }
        ]
      },
      4: {
        title: 'Tuần 4: Nhận biết dấu hiệu Tai biến mạch máu não (Stroke)',
        storyContext: 'Giữa kỳ y khoa! Nhận biết dấu hiệu FAST (Méo miệng, yếu tay chân, nói ngọng) kết hợp huyết áp!',
        patients: [
          { id: 'p1', name: 'Bà Ngô Thị G (68t)', hr: 110, bp: '190/110', o2: 93, complaint: 'Méo miệng, liệt nửa người đột ngột', targetColor: 'RED' },
          { id: 'p2', name: 'Ông Đỗ Văn H (55t)', hr: 82, bp: '145/90', o2: 97, complaint: 'Đau lưng mạn tính', targetColor: 'GREEN' },
          { id: 'p3', name: 'Chị Mai K (40t)', hr: 98, bp: '158/98', o2: 95, complaint: 'Tê đầu ngón tay nhẹ', targetColor: 'YELLOW' }
        ]
      },
      5: {
        title: 'Tuần 5: Y đức Y khoa - Phân loại không phân biệt đối xử',
        storyContext: 'Tình huống đạo đức y khoa P1.3: Một vị khách VIP đòi ưu tiên khám trước cho con bị ho nhẹ, trong khi người nghèo đang co giật khẩn cấp!',
        ethicalDilemma: 'Y đức cứu người: Phân loại cấp cứu chỉ dựa trên chỉ số sinh hiệu y khoa, không phụ thuộc vào tiền bạc hay địa vị xã hội.',
        patients: [
          { id: 'p1', name: 'Bé Hùng (Con hộ nghèo, 4t)', hr: 160, bp: '100/60', o2: 86, complaint: 'Co giật do sốt cao, tím tái', targetColor: 'RED' },
          { id: 'p2', name: 'Thiếu gia VIP (16t)', hr: 75, bp: '120/75', o2: 99, complaint: 'Ho hắt hơi, ngứa mũi nhẹ', targetColor: 'GREEN' },
          { id: 'p3', name: 'Cô Lan (Công nhân, 50t)', hr: 102, bp: '150/95', o2: 95, complaint: 'Bỏng nước sôi độ 2 vùng tay', targetColor: 'YELLOW' }
        ]
      },
      6: {
        title: 'Tuần 6: Theo dõi hồi phục hậu phẫu thuật',
        storyContext: 'Kiểm tra sinh hiệu bệnh nhân sau phẫu thuật cấp cứu để phát hiện biến chứng sốc nhiễm trùng.',
        patients: [
          { id: 'p1', name: 'Bệnh nhân Phẫu thuật A', hr: 148, bp: '85/55', o2: 89, complaint: 'Sốt cao lạnh run, tụt huyết áp sốc', targetColor: 'RED' },
          { id: 'p2', name: 'Bệnh nhân Phẫu thuật B', hr: 84, bp: '125/80', o2: 98, complaint: 'Đau nhẹ vết mổ khi cử động', targetColor: 'GREEN' },
          { id: 'p3', name: 'Bệnh nhân Phẫu thuật C', hr: 100, bp: '140/90', o2: 96, complaint: 'Rỉ ít dịch vết mổ', targetColor: 'YELLOW' }
        ]
      },
      7: {
        title: 'Tuần 7: Sơ cứu ngộ độc thực phẩm tập thể',
        storyContext: 'Vụ ngộ độc thực phẩm tại bếp ăn. Cần sàng lọc nhanh ca mất nước nguy kịch.',
        patients: [
          { id: 'p1', name: 'Học sinh M (15t)', hr: 138, bp: '82/50', o2: 91, complaint: 'Nôn mửa 15 lần, kiệt sức trụy mạch', targetColor: 'RED' },
          { id: 'p2', name: 'Học sinh N (15t)', hr: 98, bp: '110/70', o2: 97, complaint: 'Đau bụng râm râm nhẹ', targetColor: 'YELLOW' },
          { id: 'p3', name: 'Học sinh P (15t)', hr: 76, bp: '115/75', o2: 99, complaint: 'Lo lắng, chưa có triệu chứng', targetColor: 'GREEN' }
        ]
      },
      8: {
        title: 'Tuần 8: Tốt nghiệp Y tế - Bác sĩ Trưởng ca Cấp cứu',
        storyContext: 'Thử thách tốt nghiệp! Đảm nhận vai trò Bác sĩ Trưởng ca Cấp cứu, đưa ra quyết định phân loại chuẩn xác 100%!',
        patients: [
          { id: 'p1', name: 'Ca bệnh Nguy kịch X', hr: 150, bp: '75/40', o2: 85, complaint: 'Sốc mất máu chấn thương', targetColor: 'RED' },
          { id: 'p2', name: 'Ca bệnh Trung bình Y', hr: 108, bp: '152/96', o2: 95, complaint: 'Cơn đau dạ dày cấp', targetColor: 'YELLOW' },
          { id: 'p3', name: 'Ca bệnh Nhẹ Z', hr: 72, bp: '120/80', o2: 99, complaint: 'Khám mắt định kỳ', targetColor: 'GREEN' }
        ]
      }
    };

    const info = patientDataByWeek[week];
    return {
      week,
      title: info.title,
      storyContext: info.storyContext,
      ethicalDilemma: info.ethicalDilemma,
      taskType: 'triage_station',
      traitBonus: { camthong: 12, phantich: 10, kyluat: 8 },
      taskData: info
    };
  }),

  // ==========================================
  // 3. EDUCATION / GIÁO DỤC (Sư phạm & Giáo án)
  // ==========================================
  education: Array.from({ length: 8 }).map((_, i) => {
    const week = i + 1;
    const lessonDataByWeek: Record<number, any> = {
      1: {
        title: 'Tuần 1: Ra mắt Lớp 10A3 — THPT Nguyễn Trãi',
        storyContext: 'Chào mừng giáo viên thực tập! Buổi đầu đứng lớp 10A3 trước Cô Lan (Mentor). Hãy chọn phong cách quản lý và soạn bài phát biểu chào lớp.',
        targetDuration: 45
      },
      2: {
        title: 'Tuần 2: Kế hoạch Hỗ trợ Cá nhân hóa — Em Minh im lặng',
        storyContext: 'Em Minh đạt 4.5 điểm kiểm tra, tự ti không phát biểu. Hãy soạn kế hoạch hỗ trợ tâm lý & sư phạm riêng cho Minh.',
        targetDuration: 45
      },
      3: {
        title: 'Tuần 3: Soạn Thư gửi Phụ huynh — Em Đức gây rối',
        storyContext: 'Đức có hành vi gây rối lớp học. Soạn email/thư trao đổi qua Sổ liên lạc Zalo/Email THPT Nguyễn Trãi với bố Đức.',
        targetDuration: 45
      },
      4: {
        title: 'Tuần 4: Hội giảng Giữa kỳ Cấp trường (Cô Lan & BGH dự giờ)',
        storyContext: 'Tiết dạy hội giảng 45 phút đầy đủ 4 bước trước Thầy Hùng Hiệu trưởng. Phải có mục hỗ trợ học sinh yếu nếu tinh thần Minh chưa cao.',
        targetDuration: 45
      },
      5: {
        title: 'Tuần 5: Đạo đức Nhà giáo — Áp lực từ Phụ huynh em Hoa',
        storyContext: 'Phụ huynh em Hoa nhờ nâng điểm bài giữa kỳ để xét học bổng. Hãy soạn thư từ chối khéo léo giữ vững liêm chính sư phạm.',
        ethicalDilemma: 'Tình huống đạo đức P1.3: Bảo vệ sự công bằng trong đánh giá, tuyệt đối không thương mại hóa hay sửa điểm trái quy chế.',
        targetDuration: 45
      },
      6: {
        title: 'Tuần 6: Tổ chức Hoạt động Trải nghiệm Hướng nghiệp (HĐTN)',
        storyContext: 'Thiết kế kịch bản Hoạt động Trải nghiệm 45 phút. Mở khóa cơ hội phân công Minh làm Nhóm trưởng nếu Minh đã tự tin hơn.',
        targetDuration: 45
      },
      7: {
        title: 'Tuần 7: Khủng hoảng Sư phạm — Em Đức có nguy cơ bỏ học (High Stakes)',
        storyContext: 'Bố Đức xin cho Đức nghỉ học làm công nhân. Hãy soạn Kế hoạch can thiệp toàn diện (Quỹ học bổng + Phụ đạo + Thuyết phục). CHỈ NỘP 1 LẦN!',
        targetDuration: 45
      },
      8: {
        title: 'Tuần 8: Tốt nghiệp Thực tập — Báo cáo Tổng kết & Kết cục 8 tuần',
        storyContext: 'Lễ tổng kết chia tay 10A3. Viết Báo cáo Tổng kết Phản tư sư phạm và mở khóa 1 trong 3 Kết cục Cuộc đời Nhà giáo!',
        targetDuration: 45
      }
    };

    const info = lessonDataByWeek[week];
    return {
      week,
      title: info.title,
      storyContext: info.storyContext,
      ethicalDilemma: info.ethicalDilemma,
      taskType: 'lesson_planner',
      traitBonus: { sangtao: 12, camthong: 10, kyluat: 8 },
      taskData: info
    };
  }),

  // ==========================================
  // 4. HUMANITIES / BÁO CHÍ (Fact-check & Văn bản)
  // ==========================================
  humanities: Array.from({ length: 8 }).map((_, i) => {
    const week = i + 1;
    const factCheckByWeek: Record<number, any> = {
      1: {
        title: 'Tuần 1: Kiểm chứng thông tin (Fact-Checking) Báo chí',
        storyContext: 'Chào mừng phóng viên thực tập! Bài viết dưới đây chứa 2 chi tiết GIẬT GÂN SAI SỰ THẬT / NGUYỆN BIỆN. Hãy nhấp vào đúng các câu có lỗi để tiến hành sửa đổi:',
        articleLines: [
          { id: 'l1', text: 'Sáng nay, bộ giáo dục tổ chức hội thảo về ứng dụng AI trong trường học.', isError: false },
          { id: 'l2', text: 'NGHIÊN CỨU CHỈ RẰNG 100% HỌC SINH DÙNG AI ĐỀU ĐẠT THỦ KHOA ĐẠI HỌC KHÔNG CẦN HỌC!', isError: true, correction: 'Cần sửa thành: "AI hỗ trợ học tập nâng cao hiệu quả nếu dùng đúng cách."' },
          { id: 'l3', text: 'Các chuyên gia khuyến cáo học sinh cần rèn luyện tư duy phản biện.', isError: false },
          { id: 'l4', text: 'AI SẼ THAY THẾ TOÀN BỘ GIÁO VIÊN VÀ BÁC SĨ TRONG 1 THÁNG TỚI!', isError: true, correction: 'Cần sửa thành: "AI là công cụ hỗ trợ con người, không thay thế hoàn toàn vai trò y đức & sư phạm."' }
        ]
      },
      2: {
        title: 'Tuần 2: Sửa lỗi giật gân, câu view độc hại',
        storyContext: 'Một cộng tác viên nộp bài báo giật gân sai sự thật nhằm tăng lượng truy cập (clickbait). Hãy phát hiện câu sai phạm:',
        articleLines: [
          { id: 'l1', text: 'Dự án CareerOS vừa ra mắt phiên bản V5.0 hướng nghiệp cho học sinh THPT.', isError: false },
          { id: 'l2', text: 'SỐC: HỌC SINH KHÔNG CẦN ĐI HỌC VẪN THÀNH TỶ PHÚ TẠI GIA NẾU CHƠI GAME NÀY!', isError: true, correction: 'Sửa thành: "CareerOS giúp học sinh trải nghiệm thực tế công việc để định hướng nghề nghiệp."' },
          { id: 'l3', text: 'Hệ thống tích hợp 60 câu trắc nghiệm chuẩn O*NET của Bộ Lao động Hoa Kỳ.', isError: false }
        ]
      },
      3: {
        title: 'Tuần 3: Phát hiện lỗi vi phạm bản quyền & trích dẫn nguồn',
        storyContext: 'Phát hiện câu văn xào nấu dữ liệu không ghi nguồn gốc tác giả.',
        articleLines: [
          { id: 'l1', text: 'Theo số liệu báo cáo mới nhất của UNESCO năm 2025 về giáo dục toàn cầu,', isError: false },
          { id: 'l2', text: 'TÔI TỰ NGHĨ RA RẰNG 90% TRẺ EM ĐỀU THÍCH LẬP TRÌNH VÀ KHÔNG AI THÍCH VĂN HỌC.', isError: true, correction: 'Sửa thành ghi nguồn điều tra xã hội học chính thức thay vì cảm tính cá nhân.' },
          { id: 'l3', text: 'Việc tôn trọng bản quyền là nghĩa vụ của mọi nhà báo chuyên nghiệp.', isError: false }
        ]
      },
      4: {
        title: 'Tuần 4: Giữa kỳ Báo chí - Biên tập phóng sự điều tra',
        storyContext: 'Biên tập bài phóng sự điều tra đảm bảo tính chính xác và bằng chứng khoa học.',
        articleLines: [
          { id: 'l1', text: 'Thực trạng rác thải nhựa tại vùng ven biển đang được chính quyền xử lý.', isError: false },
          { id: 'l2', text: 'TẤT CẢ NGƯỜI DÂN Ở ĐÂY ĐỀU BỊ BỆNH NGHUY HIỂM MÀ KHÔNG CẦN BÁC SĨ KHÁM!', isError: true, correction: 'Sửa thành câu văn có số liệu y tế từ ngành y tế địa phương.' },
          { id: 'l3', text: 'Các nhóm tình nguyện viên đã ra quân dọn dẹp môi trường bãi biển.', isError: false }
        ]
      },
      5: {
        title: 'Tuần 5: Đạo đức Báo chí - Tôn trọng sự thật & Nhân phẩm',
        storyContext: 'Tình huống đạo đức P1.3: Biên tập bài viết về học sinh nghèo vượt khó mà không được dùng từ ngữ xúc phạm hay thương hại thái quá.',
        ethicalDilemma: 'Trách nhiệm thông tin: Đưa tin nhân văn, tôn trọng quyền riêng tư của nhân vật, không thương mại hóa nỗi đau.',
        articleLines: [
          { id: 'l1', text: 'Em Nguyễn Văn An đạt giải Nhất kỳ thi Học sinh giỏi Quốc gia môn Lịch sử.', isError: false },
          { id: 'l2', text: 'GIA CẢNH ĐÁNG THƯƠNG TỘI NGHIỆP TỘI LỖI CỦA EM AN KhiẾN AI CŨNG PHẢI KHÓC BẤT LỰC!', isError: true, correction: 'Sửa thành: "Gia cảnh còn nhiều khó khăn nhưng em An luôn giữ vững tinh thần hiếu học."' },
          { id: 'l3', text: 'Ước mơ của An là trở thành một nhà nghiên cứu lịch sử trong tương lai.', isError: false }
        ]
      },
      6: {
        title: 'Tuần 6: Phân tích tư duy logic trong bài nghị luận xã hội',
        storyContext: 'Phát hiện lỗi ngụy biện vơ đũa cả nắm (hasty generalization) trong bài luận.',
        articleLines: [
          { id: 'l1', text: 'Kỹ năng giao tiếp là yếu tố quan trọng giúp giới trẻ phát triển sự nghiệp.', isError: false },
          { id: 'l2', text: 'NHỮNG AI KHÔNG GIỎI NÓI CHUYỆN CHẮC CHẮN SẼ THẤT BẠI HOÀN TOÀN TRONG CẢ ĐỜI!', isError: true, correction: 'Sửa thành: "Mỗi cá nhân có thế mạnh riêng như tư duy phân tích, nghiên cứu độc lập."' },
          { id: 'l3', text: 'Môi trường làm việc hiện đại đánh giá cao cả sự hợp tác lẫn năng lực cá nhân.', isError: false }
        ]
      },
      7: {
        title: 'Tuần 7: Truyền thông đa phương tiện & Podcast nhân văn',
        storyContext: 'Soạn kịch bản Podcast truyền cảm hứng cho thanh niên THPT.',
        articleLines: [
          { id: 'l1', text: 'Podcast số 5: Mọi con đường đều dẫn đến thành công nếu bạn nỗ lực.', isError: false },
          { id: 'l2', text: 'NẾU BẠN KHÔNG VÀO ĐƯỢC ĐẠI HỌC TOP 1 THÌ CUỘC ĐỜI BẠN XEM NHƯ BỎ ĐI!', isError: true, correction: 'Sửa thành: "Đại học là một con đường, học nghề và trải nghiệm thực tế cũng mở ra tương lai sáng."' },
          { id: 'l3', text: 'Lắng nghe trải nghiệm của các anh chị sinh viên vượt qua áp lực đồng lứa.', isError: false }
        ]
      },
      8: {
        title: 'Tuần 8: Tốt nghiệp Báo chí - Nhà báo Chuyên nghiệp',
        storyContext: 'Thực hiện xuất bản bài báo chuyên đề hướng nghiệp toàn quốc!',
        articleLines: [
          { id: 'l1', text: 'Chương trình GDPT 2018 chú trọng rèn luyện phẩm chất và năng lực học sinh.', isError: false },
          { id: 'l2', text: 'HỌC SINH CHỈ CẦN BẤM CHỌN MẸO TRẮC NGHIỆM LÀ ĐỊNH HƯỚNG ĐÚNG 100% NGHỀ NGHIỆP!', isError: true, correction: 'Sửa thành: "Trải nghiệm thực tế qua công việc thật giúp học sinh hiểu rõ năng lực bản thân."' },
          { id: 'l3', text: 'CareerOS đồng hành cùng giáo viên và học sinh trên con đường kiến tạo tương lai.', isError: false }
        ]
      }
    };

    const info = factCheckByWeek[week];
    return {
      week,
      title: info.title,
      storyContext: info.storyContext,
      ethicalDilemma: info.ethicalDilemma,
      taskType: 'text_factcheck',
      traitBonus: { sangtao: 12, phantich: 10, lanhdao: 8 },
      taskData: info
    };
  }),

  // ==========================================
  // 5. NATURAL SCIENCE / KHOA HỌC (Phòng Lab)
  // ==========================================
  science: Array.from({ length: 8 }).map((_, i) => {
    const week = i + 1;
    const labByWeek: Record<number, any> = {
      1: {
        title: 'Tuần 1: Điều chỉnh tỉ lệ Phản ứng Hóa học trong Lab',
        storyContext: 'Chào mừng nhà khoa học tập sự! Để tổng hợp dung dịch chuẩn độ mà không gây trào bọt nổ dung dịch, hãy điều chỉnh 2 thanh trượt Tỉ lệ Chất A (gam) và Nhiệt độ (°C) sao cho Sản lượng Hiệu suất đạt từ 90% - 100%:',
        targetMinYield: 90,
        targetMaxYield: 100,
        paramA: { name: 'Chất phản ứng A (Gam)', min: 10, max: 100, step: 5, optimal: 50 },
        paramB: { name: 'Nhiệt độ phòng Lab (°C)', min: 20, max: 100, step: 5, optimal: 60 }
      },
      2: {
        title: 'Tuần 2: Kiểm soát nồng độ pH dung dịch bảo quản sinh học',
        storyContext: 'Điều chỉnh độ pH và Nồng độ Muối để bảo quản mẫu tế bào không bị phân hủy.',
        targetMinYield: 90,
        targetMaxYield: 100,
        paramA: { name: 'Độ pH dung dịch', min: 1, max: 14, step: 0.5, optimal: 7.4 },
        paramB: { name: 'Nồng độ NaCl (%)', min: 0, max: 5, step: 0.1, optimal: 0.9 }
      },
      3: {
        title: 'Tuần 3: Đo đạc điện thế mô phỏng tế bào thần kinh',
        storyContext: 'Cân bằng hiệu điện thế màng tế bào thần kinh (mV) và Nồng độ ion Kali (K+).',
        targetMinYield: 90,
        targetMaxYield: 100,
        paramA: { name: 'Điện thế màng (mV)', min: -100, max: 0, step: 5, optimal: -70 },
        paramB: { name: 'Nồng độ K+ (mM)', min: 1, max: 20, step: 1, optimal: 5 }
      },
      4: {
        title: 'Tuần 4: Giữa kỳ Khoa học - Tổng hợp Vật liệu Nano mới',
        storyContext: 'Thí nghiệm giữa kỳ! Kiểm soát áp suất (atm) và Tốc độ khuấy từ (rpm) để tạo hạt nano đồng đều.',
        targetMinYield: 92,
        targetMaxYield: 100,
        paramA: { name: 'Áp suất phản ứng (atm)', min: 1, max: 10, step: 0.5, optimal: 2.5 },
        paramB: { name: 'Tốc độ khuấy (rpm)', min: 100, max: 1000, step: 50, optimal: 500 }
      },
      5: {
        title: 'Tuần 5: Liêm chính Khoa học - Không làm giả số liệu thí nghiệm',
        storyContext: 'Tình huống đạo đức P1.3: Thử nghiệm lần 1 bị lệch khỏi kỳ vọng. Đồng nghiệp khuyên bạn xào nấu lại số liệu để nộp báo cáo.',
        ethicalDilemma: 'Liêm chính khoa học: Nhà khoa học chân chính tuyệt đối trung thực với dữ liệu thực tế, lặp lại thí nghiệm thay vì xào nấu kết quả.',
        targetMinYield: 90,
        targetMaxYield: 100,
        paramA: { name: 'Chất xúc tác chuẩn (mL)', min: 1, max: 50, step: 1, optimal: 25 },
        paramB: { name: 'Thời gian phản ứng (Phút)', min: 5, max: 60, step: 5, optimal: 30 }
      },
      6: {
        title: 'Tuần 6: Mô phỏng năng lượng xanh pin Mặt Trời',
        storyContext: 'Tối ưu hóa góc nghiêng tấm pin (Độ) và Cường độ bức xạ mặt trời (W/m2).',
        targetMinYield: 90,
        targetMaxYield: 100,
        paramA: { name: 'Góc nghiêng (Độ)', min: 0, max: 90, step: 5, optimal: 30 },
        paramB: { name: 'Cường độ bức xạ (W/m2)', min: 200, max: 1200, step: 50, optimal: 800 }
      },
      7: {
        title: 'Tuần 7: Nuôi cấy vi sinh vật lên men sinh học',
        storyContext: 'Duy trì Nồng độ Đường Glucose (g/L) và Lượng O2 hòa tan (mg/L).',
        targetMinYield: 90,
        targetMaxYield: 100,
        paramA: { name: 'Glucose (g/L)', min: 5, max: 50, step: 2, optimal: 20 },
        paramB: { name: 'Oxy hòa tan (mg/L)', min: 1, max: 10, step: 0.5, optimal: 6 }
      },
      8: {
        title: 'Tuần 8: Tốt nghiệp Khoa học - Công bố Đề tài Nghiên cứu',
        storyContext: 'Thử thách tốt nghiệp! Tổng hợp thành công hợp chất chuẩn đạt hiệu suất tối ưu 100%!',
        targetMinYield: 95,
        targetMaxYield: 100,
        paramA: { name: 'Thông số Chuẩn A', min: 10, max: 100, step: 5, optimal: 50 },
        paramB: { name: 'Thông số Chuẩn B', min: 10, max: 100, step: 5, optimal: 50 }
      }
    };

    const info = labByWeek[week];
    return {
      week,
      title: info.title,
      storyContext: info.storyContext,
      ethicalDilemma: info.ethicalDilemma,
      taskType: 'lab_experiment',
      traitBonus: { kiencuong: 12, phantich: 12, kyluat: 8 },
      taskData: info
    };
  })
};

export function getTaskForCareerAndWeek(careerId: CareerId, week: number): WeekTask {
  const tasks = ALL_CAREER_TASKS[careerId] || ALL_CAREER_TASKS.edtech;
  const found = tasks.find(t => t.week === week);
  return found || tasks[0];
}
