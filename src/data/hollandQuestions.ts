import { Question, HollandTrait } from '../types';

export const HOLLAND_TRAIT_NAMES: Record<HollandTrait, { name: string; radarKey: string; color: string; desc: string }> = {
  R: { name: 'Thực tế (Realistic)', radarKey: 'kiencuong', color: '#ef4444', desc: 'Thích thao tác trực tiếp, kỹ thuật, công cụ và làm việc thực tế.' },
  I: { name: 'Nghiên cứu (Investigative)', radarKey: 'phantich', color: '#3b82f6', desc: 'Thích tư duy logic, phân tích dữ liệu, khám phá và giải quyết bài toán khó.' },
  A: { name: 'Nghệ thuật (Artistic)', radarKey: 'sangtao', color: '#ec4899', desc: 'Thích sáng tạo, viết lách, thiết kế, thể hiện ý tưởng độc đáo.' },
  S: { name: 'Xã hội (Social)', radarKey: 'camthong', color: '#10b981', desc: 'Thích giúp đỡ, giảng dạy, lắng nghe, chăm sóc và kết nối con người.' },
  E: { name: 'Thuyết phục (Enterprising)', radarKey: 'lanhdao', color: '#f59e0b', desc: 'Thích lãnh đạo, thuyết phục, quản lý dự án và ra quyết định.' },
  C: { name: 'Quy chuẩn (Conventional)', radarKey: 'kyluat', color: '#8b5cf6', desc: 'Thích tính nguyên tắc, tổ chức, chính xác, lưu trữ và theo quy trình.' }
};

export const RAW_HOLLAND_QUESTIONS: Question[] = [
  // R - Realistic (Kiên cường / Kỹ thuật / Thao tác)
  { id: 1, text: 'Lắp ráp hoặc sửa chữa thiết bị điện tử, máy tính.', category: 'R', categoryLabel: 'Thực tế' },
  { id: 2, text: 'Vận hành các máy móc kỹ thuật hoặc công cụ cơ khí.', category: 'R', categoryLabel: 'Thực tế' },
  { id: 3, text: 'Làm việc ngoài trời, chăm sóc cây trồng hoặc mô hình sinh học.', category: 'R', categoryLabel: 'Thực tế' },
  { id: 4, text: 'Thiết lập hạ tầng mạng hoặc phần cứng hệ thống.', category: 'R', categoryLabel: 'Thực tế' },
  { id: 5, text: 'Xây dựng mô hình vật lý, sa bàn hoặc sản phẩm 3D.', category: 'R', categoryLabel: 'Thực tế' },
  { id: 6, text: 'Kiểm tra đo đạc thông số kỹ thuật thực tế của thiết bị.', category: 'R', categoryLabel: 'Thực tế' },
  { id: 7, text: 'Sử dụng công cụ cầm tay để tạo ra sản phẩm hoàn chỉnh.', category: 'R', categoryLabel: 'Thực tế' },
  { id: 8, text: 'Sửa chữa và bảo trì các thiết bị gia dụng hay dụng cụ thí nghiệm.', category: 'R', categoryLabel: 'Thực tế' },
  { id: 9, text: 'Thiết kế thi công công trình nhỏ hoặc lập bản vẽ kỹ thuật.', category: 'R', categoryLabel: 'Thực tế' },
  { id: 10, text: 'Thực hành các thao tác trực tiếp thay vì chỉ đọc tài liệu lý thuyết.', category: 'R', categoryLabel: 'Thực tế' },

  // I - Investigative (Phân tích / Nghiên cứu / Logic)
  { id: 11, text: 'Nghiên cứu nguyên nhân của một hiện tượng tự nhiên hay căn bệnh.', category: 'I', categoryLabel: 'Nghiên cứu' },
  { id: 12, text: 'Phân tích thuật toán và tối ưu hóa hiệu năng mã nguồn.', category: 'I', categoryLabel: 'Nghiên cứu' },
  { id: 13, text: 'Đọc tài liệu khoa học và tìm hiểu cơ chế hoạt động của sự vật.', category: 'I', categoryLabel: 'Nghiên cứu' },
  { id: 14, text: 'Giải các bài toán đố logic hoặc câu đố mã hóa phức tạp.', category: 'I', categoryLabel: 'Nghiên cứu' },
  { id: 15, text: 'Thực hiện thí nghiệm hóa học hoặc sinh học trong phòng lab.', category: 'I', categoryLabel: 'Nghiên cứu' },
  { id: 16, text: 'Thu thập và phân tích chỉ số sinh hiệu (nhịp tim, huyết áp).', category: 'I', categoryLabel: 'Nghiên cứu' },
  { id: 17, text: 'Lập biểu đồ dữ liệu để tìm ra quy luật ẩn đằng sau số liệu.', category: 'I', categoryLabel: 'Nghiên cứu' },
  { id: 18, text: 'Tìm lỗi sai (bug) trong một quy trình hoặc hệ thống dữ liệu.', category: 'I', categoryLabel: 'Nghiên cứu' },
  { id: 19, text: 'Đánh giá tính chính xác của các luận điểm khoa học.', category: 'I', categoryLabel: 'Nghiên cứu' },
  { id: 20, text: 'Khám phá tri thức mới thông qua quan sát và suy luận phản biện.', category: 'I', categoryLabel: 'Nghiên cứu' },

  // A - Artistic (Sáng tạo / Nghệ thuật / Nhân văn)
  { id: 21, text: 'Viết bài báo, câu chuyện hoặc kịch bản truyền thông hấp dẫn.', category: 'A', categoryLabel: 'Nghệ thuật' },
  { id: 22, text: 'Thiết kế giao diện (UI/UX) hoặc đồ họa trực quan sinh động.', category: 'A', categoryLabel: 'Nghệ thuật' },
  { id: 23, text: 'Sáng tạo nội dung giáo dục hoặc tài liệu giảng dạy độc đáo.', category: 'A', categoryLabel: 'Nghệ thuật' },
  { id: 24, text: 'Phân tích yếu tố nghệ thuật, văn học hoặc tư tưởng lịch sử.', category: 'A', categoryLabel: 'Nghệ thuật' },
  { id: 25, text: 'Chụp ảnh, quay dựng video hoặc làm truyền thông đa phương tiện.', category: 'A', categoryLabel: 'Nghệ thuật' },
  { id: 26, text: 'Tự do thể hiện ý tưởng cá nhân không bị gò bó bởi khuôn mẫu.', category: 'A', categoryLabel: 'Nghệ thuật' },
  { id: 27, text: 'Thuyết trình kể chuyện (storytelling) truyền cảm hứng cho người nghe.', category: 'A', categoryLabel: 'Nghệ thuật' },
  { id: 28, text: 'Biên tập và chỉnh sửa văn bản cho mượt mà, giàu cảm xúc.', category: 'A', categoryLabel: 'Nghệ thuật' },
  { id: 29, text: 'Thiết kế không gian lớp học hoặc trải nghiệm người dùng mới lạ.', category: 'A', categoryLabel: 'Nghệ thuật' },
  { id: 30, text: 'Thử nghiệm các phong cách diễn đạt mới trong công việc.', category: 'A', categoryLabel: 'Nghệ thuật' },

  // S - Social (Cảm thông / Xã hội / Giúp đỡ)
  { id: 31, text: 'Giảng dạy, hướng dẫn bài học cho học sinh hoặc bạn bè.', category: 'S', categoryLabel: 'Xã hội' },
  { id: 32, text: 'Chăm sóc, động viên và tư vấn tâm lý cho người gặp khó khăn.', category: 'S', categoryLabel: 'Xã hội' },
  { id: 33, text: 'Cấp cứu, cứu chữa và hỗ trợ bệnh nhân hồi phục sức khỏe.', category: 'S', categoryLabel: 'Xã hội' },
  { id: 34, text: 'Lắng nghe nhu cầu của cộng đồng và đề xuất giải pháp xã hội.', category: 'S', categoryLabel: 'Xã hội' },
  { id: 35, text: 'Tổ chức các hoạt động tình nguyện, kết nối mọi người.', category: 'S', categoryLabel: 'Xã hội' },
  { id: 36, text: 'Bảo vệ quyền lợi cho đối tượng yếu thế hoặc học sinh khó khăn.', category: 'S', categoryLabel: 'Xã hội' },
  { id: 37, text: 'Giải quyết xung đột và tạo sự hòa giải trong nhóm.', category: 'S', categoryLabel: 'Xã hội' },
  { id: 38, text: 'Chia sẻ kiến thức bổ ích để nâng cao nhận thức cộng đồng.', category: 'S', categoryLabel: 'Xã hội' },
  { id: 39, text: 'Kiên nhẫn đồng hành cùng người khác vượt qua thử thách.', category: 'S', categoryLabel: 'Xã hội' },
  { id: 40, text: 'Làm công việc mang lại giá trị nhân văn sâu sắc cho xã hội.', category: 'S', categoryLabel: 'Xã hội' },

  // E - Enterprising (Lãnh đạo / Thuyết phục / Quản lý)
  { id: 41, text: 'Lên kế hoạch và điều hành dự án hoàn thành đúng thời hạn.', category: 'E', categoryLabel: 'Thuyết phục' },
  { id: 42, text: 'Thuyết phục ban giám đốc hoặc nhà đầu tư ủng hộ ý tưởng.', category: 'E', categoryLabel: 'Thuyết phục' },
  { id: 43, text: 'Phân công nhiệm vụ và dẫn dắt đội ngũ làm việc hiệu quả.', category: 'E', categoryLabel: 'Thuyết phục' },
  { id: 44, text: 'Đàm phán thương lượng để đạt thỏa thuận tốt nhất.', category: 'E', categoryLabel: 'Thuyết phục' },
  { id: 45, text: 'Đề xuất chiến lược phát triển sản phẩm công nghệ hoặc dịch vụ.', category: 'E', categoryLabel: 'Thuyết phục' },
  { id: 46, text: 'Chịu trách nhiệm ra quyết định quan trọng trong tình huống gấp.', category: 'E', categoryLabel: 'Thuyết phục' },
  { id: 47, text: 'Tổ chức các sự kiện quy mô cho toàn trường hoặc công ty.', category: 'E', categoryLabel: 'Thuyết phục' },
  { id: 48, text: 'Định hướng tầm nhìn và tạo động lực cho các thành viên.', category: 'E', categoryLabel: 'Thuyết phục' },
  { id: 49, text: 'Đánh giá tính khả thi và rủi ro của các dự án mới.', category: 'E', categoryLabel: 'Thuyết phục' },
  { id: 50, text: 'Xây dựng mối quan hệ đối tác tin cậy với các bên.', category: 'E', categoryLabel: 'Thuyết phục' },

  // C - Conventional (Kỷ luật / Quy chuẩn / Tổ chức)
  { id: 51, text: 'Sắp xếp hồ sơ, dữ liệu và danh sách đúng trình tự quy định.', category: 'C', categoryLabel: 'Quy chuẩn' },
  { id: 52, text: 'Tuân thủ nghiêm ngặt quy trình y đức và quy chuẩn an toàn.', category: 'C', categoryLabel: 'Quy chuẩn' },
  { id: 53, text: 'Lập sổ sách theo dõi thu chi, ngân sách dự án chính xác.', category: 'C', categoryLabel: 'Quy chuẩn' },
  { id: 54, text: 'Phân loại tài liệu và lưu trữ thông tin khoa học, rõ ràng.', category: 'C', categoryLabel: 'Quy chuẩn' },
  { id: 55, text: 'Soát lỗi chính tả, chuẩn hóa định dạng bài viết trước khi xuất bản.', category: 'C', categoryLabel: 'Quy chuẩn' },
  { id: 56, text: 'Xây dựng thời khóa biểu, giáo án chuẩn xác từng phút.', category: 'C', categoryLabel: 'Quy chuẩn' },
  { id: 57, text: 'Kiểm tra tính hợp lệ của chứng từ, báo cáo và dữ liệu nhập vào.', category: 'C', categoryLabel: 'Quy chuẩn' },
  { id: 58, text: 'Duy trì kỷ luật công việc và nguyên tắc minh bạch, khách quan.', category: 'C', categoryLabel: 'Quy chuẩn' },
  { id: 59, text: 'Theo dõi tiến độ chi tiết theo từng mốc thời gian đề ra.', category: 'C', categoryLabel: 'Quy chuẩn' },
  { id: 60, text: 'Hoàn thành công việc với sự tỉ mỉ, cẩn trọng tuyệt đối.', category: 'C', categoryLabel: 'Quy chuẩn' }
];

// Shuffle array deterministically or pseudo-randomly for realistic test experience
export function getShuffledQuestions(): Question[] {
  const list = [...RAW_HOLLAND_QUESTIONS];
  // Simple deterministic pseudo-shuffle based on item ids
  return list.sort((a, b) => {
    const hashA = (a.id * 37 + 13) % 60;
    const hashB = (b.id * 37 + 13) % 60;
    return hashA - hashB;
  });
}
