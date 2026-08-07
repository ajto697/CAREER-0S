import { CareerId } from '../types';

export interface MajorGroup {
  subCategory: string;
  majors: string[];
}

export interface MajorCategory {
  id: number;
  code: string;
  name: string;
  relatedCareerId: CareerId;
  simulationToolName: string;
  groups: MajorGroup[];
}

export const VIETNAM_MAJORS_CATALOG: MajorCategory[] = [
  {
    id: 1,
    code: '714',
    name: '1. Khoa học Giáo dục và Đào tạo giáo viên',
    relatedCareerId: 'education',
    simulationToolName: 'Mô Phỏng Thiết Kế Kế Hoạch Bài Dạy 45p & Sư Phạm GDPT',
    groups: [
      {
        subCategory: 'Nhóm Khoa học giáo dục',
        majors: [
          'Công nghệ giáo dục',
          'Quản lý giáo dục',
          'Giáo dục học',
          'Tâm lý học giáo dục',
          'Giáo dục mầm non',
          'Giáo dục tiểu học',
          'Giáo dục đặc biệt',
          'Giáo dục công dân',
          'Giáo dục chính trị',
          'Giáo dục thể chất',
          'Giáo dục quốc phòng - an ninh'
        ]
      },
      {
        subCategory: 'Nhóm Đào tạo giáo viên',
        majors: [
          'Sư phạm Toán học',
          'Sư phạm Tin học',
          'Sư phạm Vật lý',
          'Sư phạm Hóa học',
          'Sư phạm Sinh học',
          'Sư phạm Ngữ văn',
          'Sư phạm Lịch sử',
          'Sư phạm Địa lý',
          'Sư phạm Âm nhạc',
          'Sư phạm Mỹ thuật',
          'Sư phạm Tiếng Anh',
          'Sư phạm Tiếng Pháp',
          'Sư phạm Tiếng Nga',
          'Sư phạm Tiếng Trung Quốc',
          'Sư phạm Tiếng Đức',
          'Sư phạm Tiếng Nhật',
          'Sư phạm Tiếng Hàn Quốc',
          'Sư phạm Khoa học tự nhiên',
          'Sư phạm Lịch sử - Địa lý',
          'Sư phạm Công nghệ'
        ]
      }
    ]
  },
  {
    id: 2,
    code: '721',
    name: '2. Nghệ thuật',
    relatedCareerId: 'humanities',
    simulationToolName: 'Mô Phỏng Biên Kịch, Đạo Diễn & Thiết Kế Đa Phương Tiện',
    groups: [
      {
        subCategory: 'Âm nhạc & Điện ảnh',
        majors: [
          'Âm nhạc học',
          'Sáng tác âm nhạc',
          'Chỉ huy âm nhạc',
          'Thanh nhạc',
          'Biểu diễn nhạc cụ',
          'Đạo diễn điện ảnh - truyền hình',
          'Biên kịch',
          'Quay phim',
          'Diễn viên kịch, điện ảnh - truyền hình',
          'Đạo diễn sân khấu'
        ]
      },
      {
        subCategory: 'Mỹ thuật & Thiết kế',
        majors: [
          'Thiết kế đồ họa',
          'Thiết kế thời trang',
          'Thiết kế công nghiệp',
          'Thiết kế mỹ thuật sân khấu - điện ảnh',
          'Hội họa',
          'Đồ họa',
          'Điêu khắc',
          'Gốm'
        ]
      }
    ]
  },
  {
    id: 3,
    code: '722',
    name: '3. Nhân văn',
    relatedCareerId: 'humanities',
    simulationToolName: 'Mô Phỏng Biên Tập Văn Bản, Ngôn Ngữ Học & Tòa Soạn',
    groups: [
      {
        subCategory: 'Ngôn ngữ học',
        majors: [
          'Ngôn ngữ Anh',
          'Ngôn ngữ Nga',
          'Ngôn ngữ Pháp',
          'Ngôn ngữ Trung Quốc',
          'Ngôn ngữ Đức',
          'Ngôn ngữ Tây Ban Nha',
          'Ngôn ngữ Bồ Đào Nha',
          'Ngôn ngữ Ý',
          'Ngôn ngữ Nhật Bản',
          'Ngôn ngữ Hàn Quốc',
          'Ngôn ngữ Ả Rập',
          'Quốc tế ngữ (Esperanto)'
        ]
      },
      {
        subCategory: 'Văn hóa & Lịch sử',
        majors: [
          'Triết học',
          'Chủ nghĩa xã hội khoa học',
          'Tôn giáo học',
          'Lịch sử',
          'Ngôn ngữ học',
          'Văn học',
          'Văn hóa học',
          'Hán Nôm',
          'Bảo tàng học',
          'Khảo cổ học'
        ]
      }
    ]
  },
  {
    id: 4,
    code: '731',
    name: '4. Khoa học Xã hội và Hành vi',
    relatedCareerId: 'humanities',
    simulationToolName: 'Mô Phỏng Phân Tích Hành Vi, Tâm Lý Học & Khảo Sát Dữ Liệu',
    groups: [
      {
        subCategory: 'Kinh tế & Xã hội',
        majors: [
          'Kinh tế học',
          'Kinh tế chính trị',
          'Kinh tế đầu tư',
          'Kinh tế phát triển',
          'Kinh tế quốc tế',
          'Xã hội học',
          'Tâm lý học',
          'Quốc tế học'
        ]
      },
      {
        subCategory: 'Chính trị & Địa lý',
        majors: [
          'Nhân học',
          'Địa lý học',
          'Chính trị học',
          'Xây dựng Đảng và chính quyền nhà nước',
          'Quan hệ quốc tế'
        ]
      }
    ]
  },
  {
    id: 5,
    code: '732',
    name: '5. Báo chí và Thông tin',
    relatedCareerId: 'humanities',
    simulationToolName: 'Mô Phỏng Tòa Soạn Báo Chí & Fact-Checking Chuẩn ISO',
    groups: [
      {
        subCategory: 'Báo chí - Truyền thông',
        majors: [
          'Báo chí',
          'Truyền thông đa phương tiện',
          'Truyền thông đại chúng',
          'Quan hệ công chúng',
          'Truyền thông quốc tế'
        ]
      },
      {
        subCategory: 'Thông tin học',
        majors: [
          'Thông tin học',
          'Quản lý thông tin',
          'Thông tin - thư viện',
          'Lưu trữ học'
        ]
      }
    ]
  },
  {
    id: 6,
    code: '734',
    name: '6. Kinh doanh và Quản lý',
    relatedCareerId: 'edtech',
    simulationToolName: 'Mô Phỏng Quản Trị Hệ Thống CSDL & Phân Tích Kinh Doanh',
    groups: [
      {
        subCategory: 'Kinh doanh',
        majors: [
          'Quản trị kinh doanh',
          'Marketing',
          'Bất động sản',
          'Kinh doanh quốc tế',
          'Kinh doanh thương mại',
          'Thương mại điện tử (E-commerce)'
        ]
      },
      {
        subCategory: 'Tài chính & Quản lý',
        majors: [
          'Tài chính - Ngân hàng',
          'Tài chính quốc tế',
          'Bảo hiểm',
          'Kế toán',
          'Kiểm toán',
          'Quản trị nhân lực',
          'Hệ thống thông tin quản lý',
          'Quản trị văn phòng'
        ]
      }
    ]
  },
  {
    id: 7,
    code: '738',
    name: '7. Pháp luật',
    relatedCareerId: 'humanities',
    simulationToolName: 'Mô Phỏng Thẩm Định Pháp Luật & Kiểm Chỉnh Đạo Đức',
    groups: [
      {
        subCategory: 'Nhóm Ngành Pháp luật',
        majors: [
          'Luật',
          'Luật kinh tế',
          'Luật quốc tế'
        ]
      }
    ]
  },
  {
    id: 8,
    code: '742',
    name: '8. Khoa học Sự sống',
    relatedCareerId: 'science',
    simulationToolName: 'Mô Phỏng Phòng Lab Nuôi Cấy Vi Sinh & Sinh Học Ứng Dụng',
    groups: [
      {
        subCategory: 'Nhóm Khoa học sự sống',
        majors: [
          'Sinh học',
          'Công nghệ sinh học',
          'Sinh học ứng dụng'
        ]
      }
    ]
  },
  {
    id: 9,
    code: '744',
    name: '9. Khoa học Tự nhiên',
    relatedCareerId: 'science',
    simulationToolName: 'Mô Phỏng Thí Nghiệm Hóa - Sinh ISO & Cân Bằng Nồng Độ',
    groups: [
      {
        subCategory: 'Vật lý & Hóa học',
        majors: [
          'Thiên văn học',
          'Khoa học vũ trụ',
          'Vật lý học',
          'Hóa học',
          'Khoa học vật liệu'
        ]
      },
      {
        subCategory: 'Trái đất & Môi trường',
        majors: [
          'Địa chất học',
          'Khoa học môi trường',
          'Khí tượng và khí hậu học',
          'Thủy văn học',
          'Hải dương học'
        ]
      }
    ]
  },
  {
    id: 10,
    code: '746',
    name: '10. Toán và Thống kê',
    relatedCareerId: 'edtech',
    simulationToolName: 'Mô Phỏng Lập Trình Thuật Toán & Phân Tích Logic V8',
    groups: [
      {
        subCategory: 'Toán & Thống kê',
        majors: [
          'Toán học',
          'Toán cơ',
          'Toán ứng dụng',
          'Thống kê'
        ]
      }
    ]
  },
  {
    id: 11,
    code: '748',
    name: '11. Máy tính và Công nghệ Thông tin',
    relatedCareerId: 'edtech',
    simulationToolName: 'Mô Phỏng Trình Biên Dịch JavaScript & Sửa Lỗi Bug IDE',
    groups: [
      {
        subCategory: 'Công nghệ thông tin & Phần mềm',
        majors: [
          'Khoa học máy tính',
          'Mạng máy tính và truyền thông dữ liệu',
          'Kỹ thuật phần mềm',
          'Hệ thống thông tin',
          'Kỹ thuật máy tính',
          'Công nghệ thông tin',
          'An toàn thông tin',
          'Trí tuệ nhân tạo (AI)'
        ]
      }
    ]
  },
  {
    id: 12,
    code: '752',
    name: '12. Kỹ thuật',
    relatedCareerId: 'science',
    simulationToolName: 'Mô Phỏng Kỹ Thuật Động Học & Thí Nghiệm Áp Suất Khí',
    groups: [
      {
        subCategory: 'Cơ khí & Điện tử',
        majors: [
          'Cơ kỹ thuật',
          'Kỹ thuật cơ khí',
          'Kỹ thuật cơ điện tử',
          'Kỹ thuật ô tô',
          'Kỹ thuật cơ sở hạ tầng',
          'Kỹ thuật điện',
          'Kỹ thuật điện tử - viễn thông',
          'Kỹ thuật điều khiển và tự động hóa',
          'Kỹ thuật y sinh'
        ]
      },
      {
        subCategory: 'Nhiệt, Hóa & Tài nguyên',
        majors: [
          'Kỹ thuật nhiệt',
          'Kỹ thuật vật liệu',
          'Kỹ thuật hóa học',
          'Kỹ thuật môi trường',
          'Kỹ thuật mỏ',
          'Kỹ thuật địa chất',
          'Kỹ thuật trắc địa - bản đồ'
        ]
      },
      {
        subCategory: 'Giao thông & Hàng không',
        majors: [
          'Kỹ thuật tàu thủy',
          'Kỹ thuật hàng không',
          'Kỹ thuật không gian',
          'Kỹ thuật hạt nhân'
        ]
      }
    ]
  },
  {
    id: 13,
    code: '751',
    name: '13. Công nghệ Kỹ thuật',
    relatedCareerId: 'edtech',
    simulationToolName: 'Mô Phỏng Kiểm Thử Hệ Thống & Thiết Kế Công Nghệ',
    groups: [
      {
        subCategory: 'Ứng dụng công nghệ kỹ thuật',
        majors: [
          'Công nghệ kỹ thuật kiến trúc',
          'Công nghệ kỹ thuật công trình xây dựng',
          'Công nghệ kỹ thuật cơ khí',
          'Công nghệ kỹ thuật ô tô',
          'Công nghệ kỹ thuật nhiệt',
          'Công nghệ kỹ thuật điện - điện tử',
          'Công nghệ kỹ thuật môi trường'
        ]
      }
    ]
  },
  {
    id: 14,
    code: '754',
    name: '14. Sản xuất và Chế biến',
    relatedCareerId: 'science',
    simulationToolName: 'Mô Phỏng Quy Trình Chế Biến & Tinh Chế Hóa Sinh',
    groups: [
      {
        subCategory: 'Công nghệ chế biến & May mặc',
        majors: [
          'Công nghệ thực phẩm',
          'Công nghệ sau thu hoạch',
          'Công nghệ chế biến lâm sản',
          'Công nghệ chế biến thủy sản',
          'Kỹ thuật dệt',
          'Công nghệ may'
        ]
      }
    ]
  },
  {
    id: 15,
    code: '758',
    name: '15. Kiến trúc và Xây dựng',
    relatedCareerId: 'science',
    simulationToolName: 'Mô Phỏng Tính Toán Vật Liệu & Kết Cấu Công Trình Lab',
    groups: [
      {
        subCategory: 'Kiến trúc, Quy hoạch & Xây dựng',
        majors: [
          'Kiến trúc',
          'Kiến trúc cảnh quan',
          'Thiết kế nội thất',
          'Quy hoạch vùng và đô thị',
          'Kỹ thuật xây dựng',
          'Kỹ thuật xây dựng công trình giao thông',
          'Kỹ thuật xây dựng công trình thủy',
          'Quản lý xây dựng',
          'Kinh tế xây dựng'
        ]
      }
    ]
  },
  {
    id: 16,
    code: '762',
    name: '16. Nông, Lâm nghiệp và Thủy sản',
    relatedCareerId: 'science',
    simulationToolName: 'Mô Phỏng Thổ Nhưỡng, Nông Hóa & Môi Trường Sinh Học',
    groups: [
      {
        subCategory: 'Nông nghiệp, Lâm nghiệp & Thủy sản',
        majors: [
          'Nông nghiệp',
          'Khuyến nông',
          'Khoa học cây trồng',
          'Bảo vệ thực vật',
          'Nông hóa - thổ nhưỡng',
          'Chăn nuôi',
          'Khoa học đất',
          'Lâm học',
          'Quản lý tài nguyên rừng',
          'Nuôi trồng thủy sản',
          'Khai thác thủy sản',
          'Bệnh học thủy sản'
        ]
      }
    ]
  },
  {
    id: 17,
    code: '764',
    name: '17. Thú y',
    relatedCareerId: 'healthcare',
    simulationToolName: 'Mô Phỏng Chẩn Đoán Sinh Hiệu & Cấp Cứu Thú Y',
    groups: [
      {
        subCategory: 'Bác sĩ & Kỹ thuật Thú y',
        majors: [
          'Thú y'
        ]
      }
    ]
  },
  {
    id: 18,
    code: '772',
    name: '18. Y tế và Sức khỏe',
    relatedCareerId: 'healthcare',
    simulationToolName: 'Mô Phỏng Bệnh Viện, Quy Trình Triage & Khám Lâm Sàng',
    groups: [
      {
        subCategory: 'Y khoa - Dược học',
        majors: [
          'Y khoa',
          'Y học dự phòng',
          'Y học cổ truyền',
          'Răng - Hàm - Mặt',
          'Dược học'
        ]
      },
      {
        subCategory: 'Kỹ thuật y dược',
        majors: [
          'Kỹ thuật xét nghiệm y học',
          'Kỹ thuật hình ảnh y học',
          'Kỹ thuật phục hồi chức năng',
          'Kỹ thuật phục hình răng'
        ]
      },
      {
        subCategory: 'Chăm sóc & Quản lý y tế',
        majors: [
          'Điều dưỡng',
          'Hộ sinh',
          'Y tế công cộng',
          'Tổ chức và quản lý y tế',
          'Quản lý bệnh viện'
        ]
      }
    ]
  },
  {
    id: 19,
    code: '776',
    name: '19. Dịch vụ Xã hội',
    relatedCareerId: 'education',
    simulationToolName: 'Mô Phỏng Tư Vấn Học Đường & Hỗ Trợ Tâm Lý Cộng Đồng',
    groups: [
      {
        subCategory: 'Công tác xã hội & Phát triển cộng đồng',
        majors: [
          'Công tác xã hội'
        ]
      }
    ]
  },
  {
    id: 20,
    code: '781',
    name: '20. Du lịch, Khách sạn, Thể thao và Dịch vụ cá nhân',
    relatedCareerId: 'humanities',
    simulationToolName: 'Mô Phỏng Truyền Thông Dịch Vụ & Điều Hành Khách Sạn',
    groups: [
      {
        subCategory: 'Du lịch & Lưu trú',
        majors: [
          'Du lịch',
          'Quản trị dịch vụ du lịch và lữ hành',
          'Quản trị khách sạn',
          'Quản trị nhà hàng và dịch vụ ăn uống'
        ]
      },
      {
        subCategory: 'Thể thao',
        majors: [
          'Quản lý thể dục thể thao',
          'Huấn luyện thể thao',
          'Y sinh học thể dục thể thao'
        ]
      }
    ]
  },
  {
    id: 21,
    code: '784',
    name: '21. Dịch vụ Vận tải',
    relatedCareerId: 'edtech',
    simulationToolName: 'Mô Phỏng Điều Phối Vận Tải & Tối Ưu Thuật Toán Logistics',
    groups: [
      {
        subCategory: 'Vận tải & Khai thác hàng hải, hàng không',
        majors: [
          'Khai thác vận tải',
          'Kinh tế hàng hải',
          'Kinh tế vận tải',
          'Quản lý hoạt động bay'
        ]
      }
    ]
  },
  {
    id: 22,
    code: '785',
    name: '22. Môi trường và Bảo vệ môi trường',
    relatedCareerId: 'science',
    simulationToolName: 'Mô Phỏng Phòng Lab Phân Tích Môi Trường & Sinh Thái',
    groups: [
      {
        subCategory: 'Quản lý Tài nguyên, Đất đai & Môi trường',
        majors: [
          'Quản lý tài nguyên và môi trường',
          'Quản lý đất đai'
        ]
      }
    ]
  },
  {
    id: 23,
    code: '786',
    name: '23. An ninh, Quốc phòng (Khối đặc thù)',
    relatedCareerId: 'healthcare',
    simulationToolName: 'Mô Phỏng Cấp Cứu Triage Thảm Họa & An Toàn Tác Chiến',
    groups: [
      {
        subCategory: 'An ninh - Công an',
        majors: [
          'Quản lý nhà nước về an ninh trật tự',
          'Trinh sát an ninh',
          'Trinh sát cảnh sát',
          'Điều tra hình sự',
          'Kỹ thuật hình sự',
          'Phòng cháy chữa cháy và cứu nạn cứu hộ'
        ]
      },
      {
        subCategory: 'Quân sự - Quốc phòng',
        majors: [
          'Chỉ huy tham mưu quân sự',
          'Chỉ huy tham mưu phòng không, không quân, hải quân',
          'Biên phòng',
          'Hậu cần quân sự'
        ]
      }
    ]
  }
];

export const TOTAL_MAJORS_COUNT = VIETNAM_MAJORS_CATALOG.reduce((acc, cat) => {
  return acc + cat.groups.reduce((gAcc, group) => gAcc + group.majors.length, 0);
}, 0);
