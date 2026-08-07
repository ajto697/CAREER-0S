import { CareerInfo, CareerId } from '../types';

export const CAREER_LIST: CareerInfo[] = [
  {
    id: 'edtech',
    name: 'EdTech & Kỹ Thuật Phần Mềm',
    shortName: 'Tòa EdTech & CNTT',
    icon: 'Code',
    hollandCode: 'I + C',
    subjects: ['Tin học', 'Công nghệ', 'Toán học'],
    color: '#3b82f6',
    bgGradient: 'from-blue-900/60 to-cyan-900/40',
    description: 'Xây dựng ứng dụng giáo dục thông minh, hệ thống quản lý học tập (LMS), viết mã nguồn, sửa lỗi bug và tối ưu hóa hệ thống.',
    salaryJunior: '8 - 15 Triệu VNĐ',
    salarySenior: '20 - 45 Triệu VNĐ',
    roadmap: [
      'Cấp 3: Học giỏi Tin học, Toán logic, Tiếng Anh chuyên ngành.',
      'Đại học: Ngành Khoa học Máy tính, Công nghệ Thông tin, Kỹ thuật Phần mềm (Bách Khoa, KHTN, FPT, UIT).',
      'Thực tập: Junior Developer / QA Tester tại tập đoàn EdTech & Công nghệ.',
      'Sự nghiệp: Fullstack Engineer → Tech Lead / Product Manager.'
    ],
    topSchools: ['ĐH Bách Khoa', 'ĐH Khoa Học Tự Nhiên', 'ĐH FPT', 'ĐH Công Nghệ - ĐHQG'],
    ethicsTopic: 'Đạo đức thuật toán & Công bằng truy cập giáo dục cho học sinh nghèo.',
    floors: [
      {
        floorNumber: 1,
        subMajorName: 'Kỹ Thuật Phần Mềm (Software Engineering)',
        code: '7480103',
        description: 'Lập trình ứng dụng, thiết kế cấu trúc mã nguồn, debug sửa lỗi logic và xây dựng quy chuẩn kiểm thử phần mềm.',
        keySkills: ['Lập trình JS/TS', 'Sửa lỗi Bug', 'Cấu trúc mảng & Hàm'],
        careerRole: 'Junior Software Engineer',
        moetMajorMatch: 'Kỹ thuật phần mềm'
      },
      {
        floorNumber: 2,
        subMajorName: 'Khoa Học Máy Tính (Computer Science)',
        code: '7480101',
        description: 'Nghiên cứu thuật toán, độ phức tạp tính toán, tối ưu hóa bộ nhớ và thiết kế hệ thống xử lý dữ liệu lớn.',
        keySkills: ['Thuật toán tối ưu', 'Cấu trúc dữ liệu', 'Toán rời rạc'],
        careerRole: 'Algorithm Specialist / Developer',
        moetMajorMatch: 'Khoa học máy tính'
      },
      {
        floorNumber: 3,
        subMajorName: 'Trí Tuệ Nhân Tạo & Khoa Học Dữ Liệu (AI & Data Science)',
        code: '7480201',
        description: 'Mô hình hóa học máy (Machine Learning), phân tích xu hướng học tập học sinh và đề xuất bài giảng cá nhân hóa.',
        keySkills: ['Phân tích Dữ liệu', 'Học máy AI', 'Thống kê ứng dụng'],
        careerRole: 'AI Application Engineer',
        moetMajorMatch: 'Trí tuệ nhân tạo (AI)'
      },
      {
        floorNumber: 4,
        subMajorName: 'Hệ Thống Thông Tin & LMS (Information Systems)',
        code: '7480104',
        description: 'Thiết kế cơ sở dữ liệu trường học, quản trị hạ tầng máy chủ LMS và đồng bộ hóa kết quả thi đua toàn quốc.',
        keySkills: ['Quản trị CSDL', 'Null Safety', 'Gộp Server'],
        careerRole: 'Database & Systems Admin',
        moetMajorMatch: 'Hệ thống thông tin'
      },
      {
        floorNumber: 5,
        subMajorName: 'An Toàn Thông Tin & Chống Quá Tải (Cybersecurity)',
        code: '7480202',
        description: 'Bảo vệ dữ liệu cá nhân học sinh, thiết kế cơ chế Debounce/Throttle chống tấn công từ chối dịch vụ (DDoS).',
        keySkills: ['Bảo mật dữ liệu', 'Debounce/Throttle', 'An toàn mạng'],
        careerRole: 'Cybersecurity Engineer',
        moetMajorMatch: 'An toàn thông tin'
      },
      {
        floorNumber: 6,
        subMajorName: 'Quản Trị Sản Phẩm & Đạo Đức EdTech (EdTech Product Lead)',
        code: '7480108',
        description: 'Lãnh đạo dự án công nghệ giáo dục, đảm bảo quyền lợi truy cập bài học miễn phí cho học sinh nghèo.',
        keySkills: ['Lãnh đạo sản phẩm', 'Đạo đức thuật toán', 'Tư duy công nghệ'],
        careerRole: 'EdTech Product Manager / Tech Lead',
        moetMajorMatch: 'Công nghệ thông tin'
      }
    ]
  },
  {
    id: 'healthcare',
    name: 'Y Tế & Cấp Cứu Y Khoa',
    shortName: 'Tòa Y Tế & Bệnh Viện',
    icon: 'HeartPulse',
    hollandCode: 'I + S',
    subjects: ['Sinh học', 'Hóa học', 'GDCD (Y đức)'],
    color: '#ef4444',
    bgGradient: 'from-red-900/60 to-rose-900/40',
    description: 'Chẩn đoán bệnh, phân loại cấp cứu dựa trên chỉ số sinh hiệu (nhịp tim, huyết áp, O2), kê đơn và thực hành y đức cứu người.',
    salaryJunior: '10 - 18 Triệu VNĐ',
    salarySenior: '25 - 60 Triệu VNĐ',
    roadmap: [
      'Cấp 3: Khối B00 (Toán, Hóa, Sinh), rèn luyện sự cẩn trọng và lòng trắc ẩn.',
      'Đại học: Y Khoa, Y Đa Khoa, Y Học Dự Phòng (ĐH Y Hà Nội, ĐH Y Dược TPHCM, Phạm Ngọc Thạch).',
      'Thực tập: Bác sĩ nội trú / Thực tập sinh tại Bệnh viện đa khoa.',
      'Sự nghiệp: Bác sĩ Chuyên khoa I/II → Trưởng khoa / Chuyên gia Y tế.'
    ],
    topSchools: ['ĐH Y Hà Nội', 'ĐH Y Dược TPHCM', 'ĐH Y Khoa Phạm Ngọc Thạch', 'ĐH Y Dược Huế'],
    ethicsTopic: 'Quy trình phân loại Triage minh bạch, không thiên vị và y đức cứu người.',
    floors: [
      {
        floorNumber: 1,
        subMajorName: 'Y Khoa & Đa Khoa (General Medicine)',
        code: '7720101',
        description: 'Khám lâm sàng, đọc thông số sinh hiệu cơ bản và chẩn đoán tình trạng sức khỏe toàn diện của bệnh nhân.',
        keySkills: ['Đọc sinh hiệu', 'Chẩn đoán lâm sàng', 'Khám đa khoa'],
        careerRole: 'Bác sĩ Đa khoa Tập sự',
        moetMajorMatch: 'Y khoa'
      },
      {
        floorNumber: 2,
        subMajorName: 'Bác Sĩ Cấp Cứu & Phân Loại Triage (Emergency Medicine)',
        code: '7720102',
        description: 'Phân loại mức độ nguy kịch (Đỏ/Vàng/Xanh) dựa trên Nhịp tim, Huyết áp, SpO2 trong môi trường cấp cứu áp lực cao.',
        keySkills: ['Quy trình Triage', 'Sơ cứu nguy kịch', 'Xử lý suy hô hấp'],
        careerRole: 'Bác sĩ Cấp Cứu Triage',
        moetMajorMatch: 'Y học dự phòng'
      },
      {
        floorNumber: 3,
        subMajorName: 'Điều Dưỡng & Cấp Cứu Tai Nạn (Emergency Nursing)',
        code: '7720301',
        description: 'Chăm sóc người bệnh tai nạn giao thông, theo dõi phục hồi vết thương và phối hợp kíp trực cấp cứu.',
        keySkills: ['Chăm sóc người bệnh', 'Cấp cứu thảm họa', 'Kỹ thuật điều dưỡng'],
        careerRole: 'Điều dưỡng Cấp cứu',
        moetMajorMatch: 'Điều dưỡng'
      },
      {
        floorNumber: 4,
        subMajorName: 'Y Học Dự Phòng & Nhận Biết Đột Quỵ (Stroke & Public Health)',
        code: '7720103',
        description: 'Sàng lọc sớm triệu chứng Tai biến mạch máu não (Stroke) theo quy tắc FAST và ngộ độc thực phẩm cộng đồng.',
        keySkills: ['Sàng lọc FAST', 'Dự phòng đột quỵ', 'Dịch tễ học'],
        careerRole: 'Bác sĩ Y học Dự phòng',
        moetMajorMatch: 'Y học dự phòng'
      },
      {
        floorNumber: 5,
        subMajorName: 'Dược Học & Kỹ Thuật Y Sinh (Pharmacy & Biomedical)',
        code: '7720201',
        description: 'Kiểm soát tương tác thuốc, theo dõi biến chứng nhiễm trùng hậu phẫu và vận hành trang thiết bị y tế.',
        keySkills: ['Dược lý học', 'Thiết bị Y sinh', 'Kiểm soát nhiễm khuẩn'],
        careerRole: 'Dược sĩ / Chuyên viên Y sinh',
        moetMajorMatch: 'Dược học'
      },
      {
        floorNumber: 6,
        subMajorName: 'Trưởng Ca Cấp Cứu & Y Đức Chuyên Khoa (Chief Medical Officer)',
        code: '7720108',
        description: 'Chỉ huy kíp trực bệnh viện, đảm bảo y đức công bằng - tuyệt đối không ưu tiên bệnh nhân vì tiền bạc địa vị.',
        keySkills: ['Lãnh đạo Y khoa', 'Bảo vệ Y đức', 'Chỉ huy ca trực'],
        careerRole: 'Bác sĩ Trưởng ca Cấp cứu',
        moetMajorMatch: 'Tổ chức và quản lý y tế'
      }
    ]
  },
  {
    id: 'education',
    name: 'Giáo Dục & Sư Phạm Chuẩn',
    shortName: 'Tòa Sư Phạm & Giáo Dục',
    icon: 'GraduationCap',
    hollandCode: 'S + A',
    subjects: ['Tâm lý giáo dục', 'HĐTN-HN', 'Ngữ văn'],
    color: '#10b981',
    bgGradient: 'from-emerald-900/60 to-teal-900/40',
    description: 'Thiết kế giáo án 45 phút chuẩn sư phạm, phân bổ thời gian hợp lý giữa lý thuyết - thực hành, tư vấn tâm lý học đường.',
    salaryJunior: '7 - 12 Triệu VNĐ',
    salarySenior: '18 - 35 Triệu VNĐ',
    roadmap: [
      'Cấp 3: Học khá môn Khoa học Xã hội, rèn luyện kỹ năng truyền đạt & kiên nhẫn.',
      'Đại học: Sư Phạm Toán, Sư Phạm Văn, Tâm Lý Giáo Dục (ĐH Sư Phạm Hà Nội, ĐH Sư Phạm TPHCM).',
      'Thực tập: Giáo viên thực tập tại trường THPT / THCS.',
      'Sự nghiệp: Giáo viên cốt cán → Tổ trưởng chuyên môn → Hiệu trưởng / Chuyên gia giáo dục.'
    ],
    topSchools: ['ĐH Sư Phạm Hà Nội', 'ĐH Sư Phạm TPHCM', 'ĐH Giáo Dục - ĐHQGHN'],
    ethicsTopic: 'Tôn trọng sự khác biệt của học sinh, sư phạm tích cực, không bạo lực tư tưởng.',
    floors: [
      {
        floorNumber: 1,
        subMajorName: 'Sư Phạm Toán & Khoa Học Tự Nhiên (STEM Education)',
        code: '7140201',
        description: 'Giảng dạy lý thuyết và bài tập khoa học, áp dụng phương pháp trực quan giúp học sinh tiếp thu tư duy logic.',
        keySkills: ['Soạn giáo án', 'Phương pháp STEM', 'Giảng dạy Khoa học'],
        careerRole: 'Giáo viên Sư phạm Toán - KHTN',
        moetMajorMatch: 'Sư phạm Toán học'
      },
      {
        floorNumber: 2,
        subMajorName: 'Sư Phạm Ngữ Văn & Khoa Học Xã Hội (Humanities Education)',
        code: '7140217',
        description: 'Truyền cảm hứng văn học, lịch sử, kỹ năng diễn đạt ngôn ngữ và tư duy phản biện cho học sinh.',
        keySkills: ['Truyền đạt diễn đạt', 'Sư phạm Văn học', 'Tư duy phản biện'],
        careerRole: 'Giáo viên Sư phạm Ngữ văn',
        moetMajorMatch: 'Sư phạm Ngữ văn'
      },
      {
        floorNumber: 3,
        subMajorName: 'Tâm Lý Học Giáo Dục & Tư Vấn Học Đường (Educational Psychology)',
        code: '7140101',
        description: 'Tư vấn tâm lý lứa tuổi học sinh, lắng nghe, tháo gỡ áp lực học tập và đồng hành cùng học sinh có hoàn cảnh đặc biệt.',
        keySkills: ['Lắng nghe thấu cảm', 'Tư vấn tâm lý', 'Xử lý khủng hoảng'],
        careerRole: 'Chuyên viên Tư vấn Tâm lý Học đường',
        moetMajorMatch: 'Tâm lý học giáo dục'
      },
      {
        floorNumber: 4,
        subMajorName: 'Công Nghệ Giáo Dục & Bài Dạy Tương Tác (Instructional Design)',
        code: '7140102',
        description: 'Thiết kế bài giảng tương tác 45 phút chuẩn GDPT 2018, phân bổ hợp lý giữa Khởi động - Lý thuyết - Thực hành - Tổng kết.',
        keySkills: ['Thiết kế Kế hoạch bài dạy', 'Phân bổ 45 phút', 'Ứng dụng EdTech'],
        careerRole: 'Chuyên viên Thiết kế Bài giảng',
        moetMajorMatch: 'Công nghệ giáo dục'
      },
      {
        floorNumber: 5,
        subMajorName: 'Quản Lý Giáo Dục & Hoạt Động Trải Nghiệm (Educational Management)',
        code: '7140114',
        description: 'Tổ chức Hoạt động trải nghiệm hướng nghiệp (HĐTN), áp dụng kỷ luật tích cực và quản lý lớp học hòa nhập.',
        keySkills: ['Tổ chức HĐTN', 'Kỷ luật tích cực', 'Quản lý lớp học'],
        careerRole: 'Chuyên viên Quản lý Giáo dục / Chủ nhiệm',
        moetMajorMatch: 'Quản lý giáo dục'
      },
      {
        floorNumber: 6,
        subMajorName: 'Giáo Viên Cốt Cán & Chuyên Gia Phát Triển Chương Trình (Master Educator)',
        code: '7140200',
        description: 'Chủ trì hội giảng cấp quốc gia, thẩm định chương trình học tập nhân văn và đào tạo thế hệ giáo viên trẻ.',
        keySkills: ['Lãnh đạo Sư phạm', 'Thẩm định Chương trình', 'Hội giảng chuyên sâu'],
        careerRole: 'Giáo viên Cốt cán / Tổ trưởng Chuyên môn',
        moetMajorMatch: 'Giáo dục học'
      }
    ]
  },
  {
    id: 'humanities',
    name: 'Báo Chí & Nhân Văn Truyền Thông',
    shortName: 'Tòa Báo Chí & Tòa Soạn',
    icon: 'Newspaper',
    hollandCode: 'A + S',
    subjects: ['Ngữ văn', 'Lịch sử', 'Giáo dục Kinh tế & Pháp luật'],
    color: '#f59e0b',
    bgGradient: 'from-amber-900/60 to-orange-900/40',
    description: 'Biên tập bài viết, kiểm tra sự thật (fact-check), phát hiện lỗi nguỵ biện/tin giả và đảm bảo trách nhiệm thông tin báo chí.',
    salaryJunior: '8 - 14 Triệu VNĐ',
    salarySenior: '20 - 40 Triệu VNĐ',
    roadmap: [
      'Cấp 3: Giỏi Văn, Lịch sử, đọc sách và theo dõi thời sự tư duy phản biện.',
      'Đại học: Báo chí, Truyền thông đa phương tiện, Xã hội học (Học viện Báo chí & Tuyên truyền, ĐH KHXH&NV).',
      'Thực tập: Phóng viên / Phóng viên thực tập tại Tòa soạn & Hãng tin.',
      'Sự nghiệp: Biên tập viên chính → Trưởng ban biên tập → Giám đốc truyền thông.'
    ],
    topSchools: ['Học viện Báo chí & Tuyên truyền', 'ĐH KHXH&NV Hà Nội / TPHCM', 'ĐH RMIT'],
    ethicsTopic: 'Sự thật khách quan, tôn trọng bản quyền, chống giật gân / câu view độc hại.',
    floors: [
      {
        floorNumber: 1,
        subMajorName: 'Báo Chí & Phóng Viên Điều Tra (Journalism)',
        code: '7320101',
        description: 'Thu thập nguồn tin thời sự, phỏng vấn nhân chứng và viết tin bài báo chí chân thực, khách quan.',
        keySkills: ['Kỹ năng phỏng vấn', 'Viết tin bài', 'Điều thực tế'],
        careerRole: 'Phóng viên Báo chí',
        moetMajorMatch: 'Báo chí'
      },
      {
        floorNumber: 2,
        subMajorName: 'Truyền Thông Đa Phương Tiện & Podcast (Multimedia Communication)',
        code: '7320104',
        description: 'Xây dựng kịch bản Video phóng sự, sản xuất Podcast truyền cảm hứng hướng nghiệp cho thanh niên.',
        keySkills: ['Sản xuất Podcast', 'Kịch bản đa phương tiện', 'Sáng tạo nội dung'],
        careerRole: 'Chuyên viên Truyền thông Đa phương tiện',
        moetMajorMatch: 'Truyền thông đa phương tiện'
      },
      {
        floorNumber: 3,
        subMajorName: 'Quan Hệ Công Chúng & Tự Do Ngôn Luận (Public Relations - PR)',
        code: '7320108',
        description: 'Quản trị thông tin tổ chức, phát ngôn nhân văn và bảo vệ hình ảnh cộng đồng trước sóng gió dư luận.',
        keySkills: ['Thông điệp PR', 'Xử lý khủng hoảng', 'Kết nối cộng đồng'],
        careerRole: 'Chuyên viên Quan hệ Công chúng',
        moetMajorMatch: 'Quan hệ công chúng'
      },
      {
        floorNumber: 4,
        subMajorName: 'Kiểm Chứng Thông Tin & Chống Tin Giả (Fact-Checking & Ethics)',
        code: '7320102',
        description: 'Phát hiện ngụy biện vơ đũa cả nắm, kiểm tra nguồn dẫn bản quyền và loại bỏ phát ngôn giật gân sai sự thật.',
        keySkills: ['Fact-check sự thật', 'Phát hiện giật gân', 'Trích dẫn bản quyền'],
        careerRole: 'Chuyên viên Kiểm chứng Thông tin (Fact-Checker)',
        moetMajorMatch: 'Thông tin học'
      },
      {
        floorNumber: 5,
        subMajorName: 'Biên Tập Viên Tòa Soạn & Xuất Bản (Editorial)',
        code: '7320105',
        description: 'Rà soát lỗi ngữ pháp, loại bỏ từ ngữ miệt thị thương hại và chỉnh sửa bài báo đạt chuẩn đạo đức báo chí.',
        keySkills: ['Biên tập văn bản', 'Đạo đức báo chí', 'Rà soát tác phẩm'],
        careerRole: 'Biên tập viên Tòa soạn',
        moetMajorMatch: 'Truyền thông đại chúng'
      },
      {
        floorNumber: 6,
        subMajorName: 'Giám Đốc Truyền Thông & Trách Nhiệm Báo Chí (Media Director)',
        code: '7320100',
        description: 'Chịu trách nhiệm tư tưởng ấn phẩm toàn quốc, bảo vệ tự do báo chí gắn liền với sự thật và công lý xã hội.',
        keySkills: ['Lãnh đạo Tòa soạn', 'Trách nhiệm xã hội', 'Định hướng truyền thông'],
        careerRole: 'Tổng Biên tập / Giám đốc Truyền thông',
        moetMajorMatch: 'Truyền thông quốc tế'
      }
    ]
  },
  {
    id: 'science',
    name: 'Khoa Học Tự Nhiên & Nghiên Cứu',
    shortName: 'Tòa Viện Nghiên Cứu Lab',
    icon: 'FlaskConical',
    hollandCode: 'I + R',
    subjects: ['Vật lý', 'Hóa học', 'Sinh học', 'Toán học'],
    color: '#8b5cf6',
    bgGradient: 'from-purple-900/60 to-violet-900/40',
    description: 'Mô phỏng phản ứng thí nghiệm, kiểm soát tỉ lệ hóa chất & thông số môi trường, bảo đảm liêm chính khoa học trong phòng lab.',
    salaryJunior: '9 - 16 Triệu VNĐ',
    salarySenior: '22 - 50 Triệu VNĐ',
    roadmap: [
      'Cấp 3: Học chuyên KHTN (Toán, Lý, Hóa, Sinh), yêu thích khám phá bản chất thế giới.',
      'Đại học: Hóa học, Vật lý học, Biến đổi khí hậu, Biotechnology (ĐH KHTN, ĐH USTH - Việt Pháp).',
      'Thực tập: Trợ lý nghiên cứu (RA) tại các Viện Hàn lâm & Phòng thí nghiệm trọng điểm.',
      'Sự nghiệp: Nghiên cứu viên chính (PhD) → Chủ nhiệm đề tài khoa học quốc gia.'
    ],
    topSchools: ['ĐH Khoa Học Tự Nhiên', 'ĐH USTH (Việt Pháp)', 'Viện Hàn Lâm Khoa Học VN'],
    ethicsTopic: 'Liêm chính khoa học, tuyệt đối không xào nấu dữ liệu hay làm giả kết quả thí nghiệm.',
    floors: [
      {
        floorNumber: 1,
        subMajorName: 'Hóa Học Phân Tích & Phản Ứng Lab (Analytic Chemistry)',
        code: '7440112',
        description: 'Kiểm soát tỉ lệ hóa chất A, nhiệt độ phòng Lab và tính toán hiệu suất tổng hợp sản lượng dung dịch chuẩn.',
        keySkills: ['Pha chế hóa chất', 'Cân bằng phản ứng', 'Hiệu suất Lab'],
        careerRole: 'Kỹ thuật viên Phòng Lab Hóa học',
        moetMajorMatch: 'Hóa học'
      },
      {
        floorNumber: 2,
        subMajorName: 'Sinh Học Ứng Dụng & Vi Sinh Vật (Applied Biology)',
        code: '7420101',
        description: 'Duy trì nồng độ pH, muối sinh học và oxy hòa tan để nuôi cấy tế bào cùng mẫu vi sinh vật lên men.',
        keySkills: ['Nuôi cấy vi sinh', 'Độ pH & Oxy', 'An toàn sinh học'],
        careerRole: 'Nghiên cứu viên Sinh học Ứng dụng',
        moetMajorMatch: 'Sinh học ứng dụng'
      },
      {
        floorNumber: 3,
        subMajorName: 'Vật Lý Học & Năng Lượng Tái Tạo (Physics & Green Energy)',
        code: '7440102',
        description: 'Đo đạc điện thế màng tế bào thần kinh và mô phỏng tối ưu hóa hiệu suất năng lượng pin mặt trời.',
        keySkills: ['Mô phỏng Vật lý', 'Điện thế thần kinh', 'Năng lượng xanh'],
        careerRole: 'Nghiên cứu viên Vật lý Năng lượng',
        moetMajorMatch: 'Vật lý học'
      },
      {
        floorNumber: 4,
        subMajorName: 'Công Nghệ Nano & Vật Liệu Mới (Nanotechnology)',
        code: '7480100',
        description: 'Điều chỉnh áp suất và tốc độ khuấy từ để tổng hợp các hạt nano đồng đều phục vụ công nghiệp hi-tech.',
        keySkills: ['Tổng hợp Nano', 'Áp suất & Khuấy từ', 'Khoa học Vật liệu'],
        careerRole: 'Chuyên viên Công nghệ Nano',
        moetMajorMatch: 'Khoa học vật liệu'
      },
      {
        floorNumber: 5,
        subMajorName: 'Liêm Chính Khoa Học & Xử Lý Dữ Liệu (Scientific Integrity)',
        code: '7440108',
        description: 'Bảo vệ liêm chính khoa học - tuyệt đối không sửa số liệu thí nghiệm sai lệch hay xào nấu kết quả.',
        keySkills: ['Liêm chính khoa học', 'Trung thực dữ liệu', 'Phương pháp nghiên cứu'],
        careerRole: 'Trợ lý Nghiên cứu Khoa học (RA)',
        moetMajorMatch: 'Khoa học môi trường'
      },
      {
        floorNumber: 6,
        subMajorName: 'Viện Hàn Lâm & Chủ Nhiệm Đề Tài Quốc Gia (Principal Investigator)',
        code: '7440100',
        description: 'Lãnh đạo viện nghiên cứu, chủ trì đề tài cấp nhà nước và công bố công trình trên tạp chí quốc tế ISI/Scopus.',
        keySkills: ['Chủ nhiệm Đề tài', 'Công bố Quốc tế', 'Tư duy Khám phá'],
        careerRole: 'Chủ nhiệm Đề tài / Viện sĩ KH',
        moetMajorMatch: 'Khoa học vũ trụ'
      }
    ]
  }
];

export function getCareerById(id: CareerId): CareerInfo {
  return CAREER_LIST.find(c => c.id === id) || CAREER_LIST[0];
}
