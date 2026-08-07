import React, { useState } from 'react';
import { UserProgress, CareerId, Settings } from '../types';
import { VIETNAM_MAJORS_CATALOG, TOTAL_MAJORS_COUNT } from '../data/vietnamMajorsData';
import { playSound } from '../utils/audio';
import { 
  Code, HeartPulse, GraduationCap, Newspaper, FlaskConical, 
  ArrowRight, BookOpen, Layers, Building2, Search, CheckCircle2,
  Palette, Users, Briefcase, Scale, Dna, Calculator, Wrench, Cpu, Factory,
  Trees, HeartHandshake, Plane, Truck, Leaf, ShieldCheck, Filter, Compass, Sparkles, MapPin, Zap
} from 'lucide-react';

interface Props {
  progress: UserProgress;
  settings: Settings;
  onSelectCareer: (id: CareerId) => void;
}

// Metadata mapping for 23 MOET Major Categories
interface MoetBuildingConfig {
  id: number;
  code: string;
  name: string;
  shortName: string;
  hollandCode: string;
  color: string;
  mappedCareerId: CareerId;
  iconName: string;
  salaryJunior: string;
  salarySenior: string;
  topSchools: string[];
  industryFocus: string;
}

const MOET_BUILDINGS_CONFIG: MoetBuildingConfig[] = [
  {
    id: 1,
    code: '714',
    name: 'Khoa học Giáo dục & Đào tạo GV',
    shortName: 'Tòa Sư Phạm & Giáo Dục',
    hollandCode: 'S + A',
    color: '#00ff41',
    mappedCareerId: 'education',
    iconName: 'GraduationCap',
    salaryJunior: '8 - 15 Tr/tháng',
    salarySenior: '20 - 45 Tr/tháng',
    topSchools: ['ĐH Sư Phạm Hà Nội', 'ĐH Sư Phạm TPHCM', 'ĐH Giáo Dục - ĐHQGHN'],
    industryFocus: 'Đào tạo giáo viên, thiết kế chương trình học, nghiên cứu phương pháp giảng dạy hiện đại và tâm lý học đường.'
  },
  {
    id: 2,
    code: '721',
    name: 'Nghệ thuật & Thiết kế',
    shortName: 'Tòa Nghệ Thuật & Thiết Kế',
    hollandCode: 'A + R',
    color: '#ff00ff',
    mappedCareerId: 'humanities',
    iconName: 'Palette',
    salaryJunior: '10 - 18 Tr/tháng',
    salarySenior: '25 - 60 Tr/tháng',
    topSchools: ['ĐH Mỹ Thuật Việt Nam', 'ĐH Kiến Trúc TPHCM', 'Học viện Âm nhạc Quốc gia'],
    industryFocus: 'Sáng tạo nghệ thuật thị giác, thiết kế đồ họa, thời trang, truyền thông thị giác và mỹ thuật ứng dụng.'
  },
  {
    id: 3,
    code: '722',
    name: 'Nhân văn & Ngôn ngữ',
    shortName: 'Tòa Nhân Văn & Ngôn Ngữ',
    hollandCode: 'A + S',
    color: '#ffaa00',
    mappedCareerId: 'humanities',
    iconName: 'BookOpen',
    salaryJunior: '9 - 16 Tr/tháng',
    salarySenior: '22 - 50 Tr/tháng',
    topSchools: ['ĐH KHXH&NV Hà Nội / TPHCM', 'ĐH Hà Nội', 'ĐH Ngoại Ngữ - ĐHQGHN'],
    industryFocus: 'Nghiên cứu văn hóa, biên - phiên dịch ngôn ngữ quốc tế, văn học, triết học và truyền thông toàn cầu.'
  },
  {
    id: 4,
    code: '731',
    name: 'Khoa học Xã hội & Hành vi',
    shortName: 'Tòa Tâm Lý & Xã Hội',
    hollandCode: 'S + I',
    color: '#00e5ff',
    mappedCareerId: 'humanities',
    iconName: 'Users',
    salaryJunior: '9 - 15 Tr/tháng',
    salarySenior: '20 - 45 Tr/tháng',
    topSchools: ['ĐH KHXH&NV', 'ĐH Kinh Tế Quốc Dân', 'ĐH Học viện Thanh Thiếu Niên'],
    industryFocus: 'Phân tích hành vi con người, tư vấn tâm lý, xã hội học, nghiên cứu hành vi tiêu dùng và chính sách công.'
  },
  {
    id: 5,
    code: '732',
    name: 'Báo chí & Thông tin',
    shortName: 'Tòa Báo Chí & Tòa Soạn',
    hollandCode: 'A + E',
    color: '#ff3366',
    mappedCareerId: 'humanities',
    iconName: 'Newspaper',
    salaryJunior: '10 - 18 Tr/tháng',
    salarySenior: '25 - 55 Tr/tháng',
    topSchools: ['Học viện Báo chí & Tuyên truyền', 'ĐH KHXH&NV', 'ĐH RMIT'],
    industryFocus: 'Sản xuất tin tức truyền thông, báo chí đa phương tiện, biên tập tòa soạn, PR và truyền thông thương hiệu.'
  },
  {
    id: 6,
    code: '734',
    name: 'Kinh doanh & Quản lý',
    shortName: 'Tòa Kinh Doanh & Tài Chính',
    hollandCode: 'E + C',
    color: '#00ff41',
    mappedCareerId: 'edtech',
    iconName: 'Briefcase',
    salaryJunior: '12 - 22 Tr/tháng',
    salarySenior: '30 - 80 Tr/tháng',
    topSchools: ['ĐH Kinh Tế Quốc Dân', 'ĐH Ngoại Thương', 'ĐH Kinh Tế TPHCM (UEH)'],
    industryFocus: 'Quản trị doanh nghiệp, marketing số, tài chính - ngân hàng, chứng khoán, kế toán và thương mại điện tử.'
  },
  {
    id: 7,
    code: '738',
    name: 'Pháp luật & Tư pháp',
    shortName: 'Tòa Pháp Luật & Luật Sư',
    hollandCode: 'E + I',
    color: '#ff00ff',
    mappedCareerId: 'humanities',
    iconName: 'Scale',
    salaryJunior: '10 - 20 Tr/tháng',
    salarySenior: '28 - 70 Tr/tháng',
    topSchools: ['ĐH Luật Hà Nội', 'ĐH Luật TPHCM', 'Khoa Luật - ĐHQGHN'],
    industryFocus: 'Tư vấn pháp lý doanh nghiệp, tranh tụng tố tụng, kiểm sát, luật thương mại quốc tế và bảo hộ bản quyền.'
  },
  {
    id: 8,
    code: '742',
    name: 'Khoa học Sự sống',
    shortName: 'Tòa Sinh Học & Gen',
    hollandCode: 'I + R',
    color: '#00e5ff',
    mappedCareerId: 'science',
    iconName: 'Dna',
    salaryJunior: '10 - 17 Tr/tháng',
    salarySenior: '25 - 50 Tr/tháng',
    topSchools: ['ĐH Khoa Học Tự Nhiên', 'ĐH USTH (Việt Pháp)', 'Viện Hàn Lâm KHVN'],
    industryFocus: 'Nghiên cứu di truyền, công nghệ sinh học, vắc-xin, kỹ thuật gen và ứng dụng sinh học trong y nông nghiệp.'
  },
  {
    id: 9,
    code: '744',
    name: 'Khoa học Tự nhiên',
    shortName: 'Tòa Viện Nghiên Cứu Lab',
    hollandCode: 'I + R',
    color: '#00ff41',
    mappedCareerId: 'science',
    iconName: 'FlaskConical',
    salaryJunior: '10 - 18 Tr/tháng',
    salarySenior: '25 - 60 Tr/tháng',
    topSchools: ['ĐH Khoa Học Tự Nhiên', 'ĐH Bách Khoa', 'ĐH USTH'],
    industryFocus: 'Khám phá quy luật vật lý, hóa học, địa chất, khoa học vật liệu tiên tiến và nghiên cứu phòng thí nghiệm.'
  },
  {
    id: 10,
    code: '746',
    name: 'Toán & Thống kê',
    shortName: 'Tòa Toán Học & Data',
    hollandCode: 'I + C',
    color: '#ffaa00',
    mappedCareerId: 'science',
    iconName: 'Calculator',
    salaryJunior: '14 - 25 Tr/tháng',
    salarySenior: '35 - 90 Tr/tháng',
    topSchools: ['Viện Nghiên cứu Cao cấp về Toán', 'ĐH Khoa Học Tự Nhiên', 'ĐH Bách Khoa'],
    industryFocus: 'Phân tích dữ liệu lớn (Big Data), mô hình hóa toán học, khoa học dữ liệu, trí tuệ nhân tạo và tài chính định lượng.'
  },
  {
    id: 11,
    code: '748',
    name: 'Máy tính & CNTT',
    shortName: 'Tòa EdTech & CNTT',
    hollandCode: 'I + C',
    color: '#00ff41',
    mappedCareerId: 'edtech',
    iconName: 'Code',
    salaryJunior: '15 - 28 Tr/tháng',
    salarySenior: '40 - 100 Tr/tháng',
    topSchools: ['ĐH Bách Khoa', 'ĐH CNTT - ĐHQG TPHCM', 'ĐH FPT', 'ĐH Công Nghệ'],
    industryFocus: 'Phát triển phần mềm, trí tuệ nhân tạo (AI), an toàn thông tin, điện toán đám mây và hệ thống IoT.'
  },
  {
    id: 12,
    code: '752',
    name: 'Kỹ thuật Cơ khí & Điện',
    shortName: 'Tòa Kỹ Thuật Cơ Khí',
    hollandCode: 'R + I',
    color: '#ffea00',
    mappedCareerId: 'edtech',
    iconName: 'Wrench',
    salaryJunior: '11 - 18 Tr/tháng',
    salarySenior: '25 - 55 Tr/tháng',
    topSchools: ['ĐH Bách Khoa Hà Nội / TPHCM', 'ĐH Sư Phạm Kỹ Thuật', 'ĐH Cần Thơ'],
    industryFocus: 'Thiết kế & chế tạo máy móc, tự động hóa, robot công nghiệp, kỹ thuật điện - điện tử và năng lượng.'
  },
  {
    id: 13,
    code: '751',
    name: 'Công nghệ Kỹ thuật',
    shortName: 'Tòa Công Nghệ Kỹ Thuật',
    hollandCode: 'R + I',
    color: '#00e5ff',
    mappedCareerId: 'edtech',
    iconName: 'Cpu',
    salaryJunior: '11 - 19 Tr/tháng',
    salarySenior: '26 - 60 Tr/tháng',
    topSchools: ['ĐH Bách Khoa', 'ĐH Điện Lực', 'ĐH Công Nghiệp Hà Nội'],
    industryFocus: 'Ứng dụng kỹ thuật sản xuất, công nghệ điều khiển, vật liệu mới, hệ thống thông minh và bảo trì công nghiệp.'
  },
  {
    id: 14,
    code: '754',
    name: 'Sản xuất & Chế biến',
    shortName: 'Tòa Chế Biến Thực Phẩm',
    hollandCode: 'R + C',
    color: '#ff00ff',
    mappedCareerId: 'science',
    iconName: 'Factory',
    salaryJunior: '9 - 16 Tr/tháng',
    salarySenior: '22 - 48 Tr/tháng',
    topSchools: ['ĐH Bách Khoa', 'ĐH Nông Lâm TPHCM', 'ĐH Công Nghiệp Thực Phẩm'],
    industryFocus: 'Chế biến & bảo quản thực phẩm, kiểm định chất lượng an toàn vệ sinh, công nghệ hóa thực phẩm và đồ uống.'
  },
  {
    id: 15,
    code: '758',
    name: 'Kiến trúc & Xây dựng',
    shortName: 'Tòa Kiến Trúc Xây Dựng',
    hollandCode: 'A + R',
    color: '#ffaa00',
    mappedCareerId: 'edtech',
    iconName: 'Building2',
    salaryJunior: '11 - 18 Tr/tháng',
    salarySenior: '28 - 65 Tr/tháng',
    topSchools: ['ĐH Kiến Trúc Hà Nội / TPHCM', 'ĐH Xây Dựng Hà Nội', 'ĐH Bách Khoa'],
    industryFocus: 'Thiết kế kiến trúc công trình, quy hoạch đô thị, kỹ thuật kết cấu xây dựng và quản lý dự án hạ tầng.'
  },
  {
    id: 16,
    code: '762',
    name: 'Nông, Lâm & Thủy sản',
    shortName: 'Tòa Nông Lâm Thủy Sản',
    hollandCode: 'R + I',
    color: '#00ff41',
    mappedCareerId: 'science',
    iconName: 'Trees',
    salaryJunior: '8 - 15 Tr/tháng',
    salarySenior: '20 - 45 Tr/tháng',
    topSchools: ['Học viện Nông nghiệp VN', 'ĐH Nông Lâm TPHCM', 'ĐH Cần Thơ'],
    industryFocus: 'Nông nghiệp công nghệ cao, lâm nghiệp bền vững, nuôi trồng thủy hải sản và chế biến sản phẩm nông nghiệp.'
  },
  {
    id: 17,
    code: '764',
    name: 'Thú y',
    shortName: 'Tòa Bệnh Viện Thú Y',
    hollandCode: 'I + R',
    color: '#ff3366',
    mappedCareerId: 'healthcare',
    iconName: 'HeartPulse',
    salaryJunior: '9 - 17 Tr/tháng',
    salarySenior: '22 - 50 Tr/tháng',
    topSchools: ['Học viện Nông nghiệp VN', 'ĐH Nông Lâm TPHCM', 'ĐH Huế'],
    industryFocus: 'Chẩn đoán & điều trị y khoa động vật, dược y tế thú y, phòng chống dịch bệnh zoonosis và chăn nuôi.'
  },
  {
    id: 18,
    code: '772',
    name: 'Y tế & Sức khỏe',
    shortName: 'Tòa Y Tế & Bệnh Viện',
    hollandCode: 'I + S',
    color: '#ff3366',
    mappedCareerId: 'healthcare',
    iconName: 'HeartPulse',
    salaryJunior: '12 - 25 Tr/tháng',
    salarySenior: '30 - 80 Tr/tháng',
    topSchools: ['ĐH Y Hà Nội', 'ĐH Y Dược TPHCM', 'ĐH Y Khoa Phạm Ngọc Thạch'],
    industryFocus: 'Khám chữa bệnh lâm sàng, dược học, điều dưỡng, kỹ thuật y học, nha khoa và y tế công cộng.'
  },
  {
    id: 19,
    code: '776',
    name: 'Dịch vụ Xã hội',
    shortName: 'Tòa Công Tác Xã Hội',
    hollandCode: 'S + E',
    color: '#00e5ff',
    mappedCareerId: 'education',
    iconName: 'HeartHandshake',
    salaryJunior: '8 - 14 Tr/tháng',
    salarySenior: '18 - 38 Tr/tháng',
    topSchools: ['ĐH KHXH&NV', 'ĐH Lao Động - Xã Hội', 'ĐH Sư Phạm'],
    industryFocus: 'Hỗ trợ cộng đồng yếu thế, công tác xã hội, bảo trợ trẻ em, phát triển an sinh và tư vấn tâm lý cộng đồng.'
  },
  {
    id: 20,
    code: '781',
    name: 'Du lịch & Khách sạn',
    shortName: 'Tòa Du Lịch & Khách Sạn',
    hollandCode: 'E + S',
    color: '#ff00ff',
    mappedCareerId: 'humanities',
    iconName: 'Plane',
    salaryJunior: '10 - 18 Tr/tháng',
    salarySenior: '25 - 60 Tr/tháng',
    topSchools: ['ĐH Hà Nội', 'ĐH Kinh Tế Quốc Dân', 'ĐH Văn Hóa TPHCM'],
    industryFocus: 'Quản trị khách sạn - nhà hàng, điều hành tour du lịch quốc tế, dịch vụ lưu trú cao cấp và ẩm thực.'
  },
  {
    id: 21,
    code: '784',
    name: 'Dịch vụ Vận tải & Logistics',
    shortName: 'Tòa Vận Tải & Logistics',
    hollandCode: 'R + E',
    color: '#00ff41',
    mappedCareerId: 'edtech',
    iconName: 'Truck',
    salaryJunior: '11 - 20 Tr/tháng',
    salarySenior: '28 - 70 Tr/tháng',
    topSchools: ['ĐH Giao Thông Vận Tải', 'ĐH Hàng Hải Việt Nam', 'ĐH Kinh Tế TPHCM'],
    industryFocus: 'Quản lý chuỗi cung ứng toàn cầu, kho vận logistics, vận tải đa phương thức và dịch vụ xuất nhập khẩu.'
  },
  {
    id: 22,
    code: '785',
    name: 'Môi trường & Đất đai',
    shortName: 'Tòa Môi Trường & Tài Nguyên',
    hollandCode: 'I + R',
    color: '#00e5ff',
    mappedCareerId: 'science',
    iconName: 'Leaf',
    salaryJunior: '9 - 16 Tr/tháng',
    salarySenior: '22 - 48 Tr/tháng',
    topSchools: ['ĐH Tài Nguyên & Môi Trường', 'ĐH Khoa Học Tự Nhiên', 'ĐH Bách Khoa'],
    industryFocus: 'Bảo vệ môi trường, quản lý đất đai & tài nguyên nước, xử lý chất thải và ứng phó biến đổi khí hậu.'
  },
  {
    id: 23,
    code: '786',
    name: 'An ninh, Quốc phòng',
    shortName: 'Tòa An Ninh & Quốc Phòng',
    hollandCode: 'R + E',
    color: '#ffea00',
    mappedCareerId: 'healthcare',
    iconName: 'ShieldCheck',
    salaryJunior: 'Theo cấp bậc LLVT',
    salarySenior: 'Theo cấp bậc LLVT',
    topSchools: ['Học viện An ninh Nhân dân', 'Học viện Cảnh sát Nhân dân', 'Học viện Kỹ thuật Quân sự'],
    industryFocus: 'Bảo vệ an ninh quốc gia, trật tự an toàn xã hội, kỹ thuật quân sự, phòng thủ dân sự và tác chiến không gian mạng.'
  }
];

export const GateB_CityMap: React.FC<Props> = ({ progress, settings, onSelectCareer }) => {
  const [activeTab, setActiveTab] = useState<'all_23' | 'core_5'>('all_23');
  const [selectedBuildingId, setSelectedBuildingId] = useState<number>(11); // Default to IT & Computer Science (Code 748)
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hollandFilter, setHollandFilter] = useState<string>('ALL');
  const [hoveredBuildingId, setHoveredBuildingId] = useState<number | null>(null);

  // Selected MOET Building object
  const currentBuildingConfig = MOET_BUILDINGS_CONFIG.find(b => b.id === selectedBuildingId) || MOET_BUILDINGS_CONFIG[10];
  const currentMoetCategory = VIETNAM_MAJORS_CATALOG.find(c => c.id === currentBuildingConfig.id) || VIETNAM_MAJORS_CATALOG[10];
  
  const currentGroups = currentMoetCategory.groups || [];
  const activeGroup = currentGroups[selectedGroupIdx] || currentGroups[0];

  // Map icon component helper
  const renderBuildingIcon = (iconName: string, className = "w-5 h-5") => {
    switch (iconName) {
      case 'GraduationCap': return <GraduationCap className={className} />;
      case 'Palette': return <Palette className={className} />;
      case 'BookOpen': return <BookOpen className={className} />;
      case 'Users': return <Users className={className} />;
      case 'Newspaper': return <Newspaper className={className} />;
      case 'Briefcase': return <Briefcase className={className} />;
      case 'Scale': return <Scale className={className} />;
      case 'Dna': return <Dna className={className} />;
      case 'FlaskConical': return <FlaskConical className={className} />;
      case 'Calculator': return <Calculator className={className} />;
      case 'Code': return <Code className={className} />;
      case 'Wrench': return <Wrench className={className} />;
      case 'Cpu': return <Cpu className={className} />;
      case 'Factory': return <Factory className={className} />;
      case 'Building2': return <Building2 className={className} />;
      case 'Trees': return <Trees className={className} />;
      case 'HeartPulse': return <HeartPulse className={className} />;
      case 'HeartHandshake': return <HeartHandshake className={className} />;
      case 'Plane': return <Plane className={className} />;
      case 'Truck': return <Truck className={className} />;
      case 'Leaf': return <Leaf className={className} />;
      case 'ShieldCheck': return <ShieldCheck className={className} />;
      default: return <Building2 className={className} />;
    }
  };

  // Filtered buildings list
  const filteredBuildings = MOET_BUILDINGS_CONFIG.filter(b => {
    if (activeTab === 'core_5') {
      return [1, 5, 9, 11, 18].includes(b.id);
    }
    if (hollandFilter !== 'ALL') {
      return b.hollandCode.includes(hollandFilter);
    }
    return true;
  });

  // Global search across all 376 MOET majors
  const filteredMoetMajors = searchTerm.trim() 
    ? VIETNAM_MAJORS_CATALOG.flatMap(category => 
        category.groups.flatMap(group => 
          group.majors
            .filter(m => m.toLowerCase().includes(searchTerm.toLowerCase()))
            .map(m => ({
              name: m,
              subCategory: group.subCategory,
              categoryName: category.name,
              categoryId: category.id,
              categoryCode: category.code
            }))
        )
      ).slice(0, 12)
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-mono text-[#00ff41] select-none pb-12">
      {/* Top Banner Header - Retro Terminal Style */}
      <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-5 sm:p-6 relative overflow-hidden shadow-[0_0_20px_rgba(0,255,65,0.2)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#00ff41] text-[#0c0c0c] font-bold text-xs px-2.5 py-0.5 uppercase tracking-wide">
                CỔNG B // BẢN ĐỒ THÀNH PHỐ HƯỚNG NGHIỆP GDĐT
              </span>
              <span className="text-[#00ff41] text-xs flex items-center gap-1 border border-[#00ff41]/50 px-2.5 py-0.5 bg-[#000]">
                <Building2 className="w-3.5 h-3.5 text-[#ff00ff]" /> 23 TÒA NHÀ LĨNH VỰC • {TOTAL_MAJORS_COUNT} NGÀNH ĐẠI HỌC
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-black text-[#00ff41] mt-2 uppercase tracking-wide">
              BẢN ĐỒ TÒA NHÀ HƯỚNG NGHIỆP & CÁC TẦNG NGÀNH CON
            </h2>
            <p className="text-xs sm:text-sm text-[#00ff41] opacity-80 mt-1 max-w-3xl leading-relaxed">
              Mỗi tòa nhà quy tụ đầy đủ các ngành đào tạo đại học Việt Nam theo chuẩn Bộ GD&ĐT. Hãy chọn tòa nhà để xem các tầng ngành chi tiết và nhảy vào trải nghiệm thực tập 8 tuần!
            </p>
          </div>

          <div className="bg-[#111] px-4 py-3 border border-[#00ff41] text-right shrink-0">
            <div className="text-[10px] opacity-70">HỒ SƠ HỌC SINH</div>
            <div className="text-sm font-bold text-[#00ff41]">{progress.name}</div>
            <div className="text-xs text-[#ff00ff] font-bold mt-0.5">MÃ HOLLAND: {progress.hollandCode}</div>
          </div>
        </div>
      </div>

      {/* Filter Bar & Mode Toggle */}
      <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-4 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 shadow-lg">
        {/* View mode toggle tabs */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => { playSound.click(settings.retroSound); setActiveTab('all_23'); }}
            className={`px-3 py-2 text-xs font-bold uppercase transition-all border flex items-center gap-1.5 ${
              activeTab === 'all_23'
                ? 'bg-[#00ff41] text-[#0c0c0c] border-white shadow-[0_0_12px_rgba(0,255,65,0.5)]'
                : 'bg-[#000] text-[#00ff41] border-[#00ff41]/40 hover:border-[#00ff41]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>TOÀN BỘ 23 TÒA LĨNH VỰC ({TOTAL_MAJORS_COUNT} NGÀNH)</span>
          </button>

          <button
            onClick={() => { playSound.click(settings.retroSound); setActiveTab('core_5'); }}
            className={`px-3 py-2 text-xs font-bold uppercase transition-all border flex items-center gap-1.5 ${
              activeTab === 'core_5'
                ? 'bg-[#ff00ff] text-[#0c0c0c] border-white shadow-[0_0_12px_rgba(255,0,255,0.5)]'
                : 'bg-[#000] text-[#ff00ff] border-[#ff00ff]/40 hover:border-[#ff00ff]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>5 TÒA THỰC TẬP SÂU 8 TUẦN</span>
          </button>
        </div>

        {/* Holland Code Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0">
          <span className="text-xs opacity-70 flex items-center gap-1 shrink-0 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#00ff41]" />
            LỌC HOLLAND:
          </span>
          {['ALL', 'R', 'I', 'A', 'S', 'E', 'C'].map((code) => (
            <button
              key={code}
              onClick={() => { playSound.click(settings.retroSound); setHollandFilter(code); }}
              className={`px-2.5 py-1 text-[11px] font-bold border transition-all ${
                hollandFilter === code
                  ? 'bg-[#00ff41] text-[#0c0c0c] border-white'
                  : 'bg-[#000] text-[#00ff41] border-[#00ff41]/30 hover:border-[#00ff41]'
              }`}
            >
              {code === 'ALL' ? 'TẤT CẢ' : code}
            </button>
          ))}
        </div>
      </div>

      {/* 8-Bit Pixel City Skyline Container */}
      <div className="bg-[#050505] border-2 border-[#00ff41] p-4 sm:p-6 shadow-[0_0_20px_rgba(0,255,65,0.15)] relative">
        <div className="text-xs font-bold text-[#00ff41] uppercase mb-4 flex items-center justify-between border-b border-[#00ff41]/30 pb-2">
          <div className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-[#ff00ff]" />
            <span>SƠ ĐỒ CÁC TÒA NHÀ THÀNH PHỐ ({filteredBuildings.length} TÒA NHÀ)</span>
          </div>
          <span className="text-[10px] opacity-70">BẤM VÀO TÒA NHÀ ĐỂ QUAN SÁT TẦNG NGÀNH CON</span>
        </div>

        {/* Skyline Horizontal Scrollable Grid */}
        <div className="overflow-x-auto pb-4 pt-2">
          <div className="flex items-end gap-3 min-w-max px-1">
            {filteredBuildings.map((building) => {
              const isSelectedBuilding = selectedBuildingId === building.id;
              const isMatch = progress.hollandCode.includes(building.hollandCode[0]);
              const moetCategory = VIETNAM_MAJORS_CATALOG.find(c => c.id === building.id);
              const groupCount = moetCategory?.groups.length || 1;
              const totalMajorsInBuilding = moetCategory?.groups.reduce((acc, g) => acc + g.majors.length, 0) || 0;

              const isHovered = hoveredBuildingId === building.id;

              return (
                <div
                  key={building.id}
                  className="flex flex-col items-center group cursor-pointer relative"
                  onMouseEnter={() => setHoveredBuildingId(building.id)}
                  onMouseLeave={() => setHoveredBuildingId(null)}
                  onClick={() => {
                    playSound.click(settings.retroSound);
                    setSelectedBuildingId(building.id);
                    setSelectedGroupIdx(0);
                  }}
                >
                  {/* Informative Industry Focus Hover Tooltip */}
                  {isHovered && (
                    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 w-64 sm:w-72 bg-[#000] border-2 border-[#ff00ff] p-3 shadow-[0_0_25px_rgba(255,0,255,0.85)] z-50 animate-fade-in text-left pointer-events-none font-mono">
                      {/* Tooltip Header */}
                      <div className="flex items-center justify-between border-b border-[#ff00ff]/40 pb-1.5 mb-2">
                        <div className="flex items-center gap-1.5 text-[10px] text-[#ff00ff] font-bold uppercase">
                          {renderBuildingIcon(building.iconName, "w-3.5 h-3.5 text-[#ff00ff]")}
                          <span>MÃ BỘ GDĐT {building.code}</span>
                        </div>
                        <span className="text-[9px] bg-[#ff00ff] text-[#0c0c0c] px-1.5 py-0.5 font-black uppercase">
                          HOLLAND: {building.hollandCode}
                        </span>
                      </div>

                      {/* Building Name */}
                      <div className="text-xs font-black text-white uppercase mb-1.5">
                        {building.name}
                      </div>

                      {/* Industry Focus Explanation */}
                      <div className="text-[11px] text-[#00ff41] leading-relaxed mb-2 bg-[#111] p-2 border border-[#00ff41]/40">
                        <span className="text-[#ff00ff] font-bold uppercase block text-[9px] mb-0.5">
                          🎯 TRỌNG TÂM NGÀNH & LĨNH VỰC:
                        </span>
                        {building.industryFocus}
                      </div>

                      {/* Key Stats */}
                      <div className="space-y-1 text-[10px] text-white/90 border-t border-[#00ff41]/30 pt-1.5">
                        <div className="flex justify-between items-center">
                          <span className="opacity-70">Mức lương dự kiến:</span>
                          <span className="font-bold text-[#00ff41]">{building.salaryJunior}</span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="opacity-70">Số ngành GDĐT:</span>
                          <span className="font-bold text-[#ff00ff]">{totalMajorsInBuilding} Ngành Đại Học</span>
                        </div>
                      </div>

                      <div className="mt-2 text-[9px] text-[#ff00ff] italic text-center border-t border-[#ff00ff]/30 pt-1">
                        Bấm vào tòa nhà để xem chi tiết {moetCategory?.groups.length || 0} tầng nhóm ngành!
                      </div>
                    </div>
                  )}

                  {/* Recommendation Badge */}
                  {isMatch && (
                    <div className="mb-1 bg-[#ff00ff] text-[#0c0c0c] text-[8px] font-extrabold px-1.5 py-0.5 uppercase z-20 shadow-md animate-pulse">
                      GỢI Ý TOP 1
                    </div>
                  )}

                  {/* Building Tower Pixel Frame */}
                  <div 
                    className={`w-28 sm:w-32 p-2 border-2 flex flex-col justify-between transition-all duration-200 ${
                      isSelectedBuilding
                        ? 'bg-[#121212] border-[#00ff41] shadow-[0_0_20px_rgba(0,255,65,0.6)] scale-105 z-10'
                        : 'bg-[#0a0a0a] border-[#00ff41]/40 group-hover:border-[#00ff41] opacity-85 group-hover:opacity-100'
                    }`}
                    style={{ height: `${180 + (groupCount * 22)}px` }}
                  >
                    {/* Roof & Code */}
                    <div className="w-full text-center py-1 bg-[#000] border border-[#00ff41]/60 text-[9px] font-bold truncate px-1 text-[#00ff41]">
                      MÃ {building.code}
                    </div>

                    {/* Floor Stack Indicators */}
                    <div className="flex flex-col gap-1 my-auto w-full px-0.5">
                      {moetCategory?.groups.map((group, gIdx) => {
                        const isGroupActive = isSelectedBuilding && selectedGroupIdx === gIdx;

                        return (
                          <div
                            key={gIdx}
                            onClick={(e) => {
                              e.stopPropagation();
                              playSound.click(settings.retroSound);
                              setSelectedBuildingId(building.id);
                              setSelectedGroupIdx(gIdx);
                            }}
                            className={`h-5 text-[8px] px-1 flex items-center justify-between border transition-all ${
                              isGroupActive
                                ? 'bg-[#00ff41] text-[#0c0c0c] font-bold border-white'
                                : isSelectedBuilding
                                ? 'bg-[#00ff41]/20 text-[#00ff41] border-[#00ff41]/40 hover:bg-[#00ff41]/40'
                                : 'bg-[#00ff41]/10 text-[#00ff41]/80 border-[#00ff41]/20 group-hover:bg-[#00ff41]/30'
                            }`}
                          >
                            <span className="font-mono">T{gIdx + 1}</span>
                            <span className="truncate ml-1 opacity-90">{group.subCategory.replace('Nhóm ', '')}</span>
                          </div>
                        );
                      })}
                    </div>

                    {/* Entrance Door Icon */}
                    <div className="w-full h-8 bg-[#000] flex items-center justify-center border border-[#00ff41]">
                      {renderBuildingIcon(building.iconName, "w-4 h-4 text-[#00ff41]")}
                    </div>
                  </div>

                  {/* Building Title Label */}
                  <div className="mt-2 text-center w-28 sm:w-32">
                    <div className={`text-[11px] font-bold truncate ${isSelectedBuilding ? 'text-white' : 'text-[#00ff41]'}`}>
                      {building.shortName.replace('Tòa ', '')}
                    </div>
                    <div className="text-[9px] opacity-70">
                      {totalMajorsInBuilding} NGÀNH ĐH
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Building Elevator Inspector Panel */}
      <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-5 sm:p-6 space-y-6 shadow-2xl">
        {/* Building Title & Summary Bar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b-2 border-[#00ff41]/40 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-[#000] border-2 border-[#00ff41]">
              {renderBuildingIcon(currentBuildingConfig.iconName, "w-7 h-7 text-[#00ff41]")}
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-bold text-[#ff00ff] bg-[#000] px-2 py-0.5 border border-[#ff00ff]/50 uppercase">
                  MÃ BỘ GDĐT: {currentBuildingConfig.code}
                </span>
                <span className="text-xs font-bold text-[#00ff41] bg-[#000] px-2 py-0.5 border border-[#00ff41]/50 uppercase">
                  HOLLAND: {currentBuildingConfig.hollandCode}
                </span>
                <span className="text-xs text-white bg-[#000] px-2 py-0.5 border border-white/40 uppercase">
                  {currentGroups.length} TẦNG NHÓM NGÀNH
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-[#00ff41] uppercase mt-1">
                LĨNH VỰC {currentBuildingConfig.name.toUpperCase()}
              </h3>
            </div>
          </div>

          {/* Salary Expectation Badge */}
          <div className="flex flex-wrap items-center gap-2 bg-[#111] p-3 border border-[#00ff41]/60 shrink-0">
            <div className="text-xs">
              <span className="opacity-70">MỨC LƯƠNG KỲ VỌNG: </span>
              <span className="font-bold text-[#00ff41]">{currentBuildingConfig.salaryJunior}</span>
              <span className="opacity-50 mx-1">→</span>
              <span className="font-bold text-[#ff00ff]">{currentBuildingConfig.salarySenior}</span>
            </div>
          </div>
        </div>

        {/* Main Floor Elevator Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column: Floors List (Groups) */}
          <div className="lg:col-span-4 bg-[#111] p-4 border border-[#00ff41]/60 space-y-3">
            <div className="text-xs font-bold text-[#00ff41] uppercase flex items-center justify-between border-b border-[#00ff41]/30 pb-2">
              <span className="flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#ff00ff]" />
                DANH SÁCH TẦNG NHÓM NGÀNH
              </span>
              <span className="text-[10px] opacity-70">CLICK CHỌN TẦNG</span>
            </div>

            <div className="space-y-2">
              {currentGroups.map((group, gIdx) => {
                const isActive = selectedGroupIdx === gIdx;

                return (
                  <button
                    key={gIdx}
                    onClick={() => {
                      playSound.click(settings.retroSound);
                      setSelectedGroupIdx(gIdx);
                    }}
                    className={`w-full text-left p-2.5 text-xs font-bold transition-all border flex items-center justify-between gap-2 ${
                      isActive
                        ? 'bg-[#00ff41] text-[#0c0c0c] border-white shadow-[0_0_10px_rgba(0,255,65,0.4)]'
                        : 'bg-[#0a0a0a] text-[#00ff41] border-[#00ff41]/40 hover:border-[#00ff41] hover:bg-[#00ff41]/10'
                    }`}
                  >
                    <div className="flex items-center gap-2 truncate">
                      <span className={`px-2 py-0.5 text-[10px] border shrink-0 ${
                        isActive ? 'bg-[#0c0c0c] text-[#00ff41] border-[#00ff41]' : 'bg-[#000] text-[#00ff41] border-[#00ff41]/40'
                      }`}>
                        TẦNG {gIdx + 1}
                      </span>
                      <span className="truncate">{group.subCategory}</span>
                    </div>
                    <span className="text-[10px] font-mono opacity-80 shrink-0 bg-[#000] px-1.5 py-0.5 border border-[#00ff41]/30">
                      {group.majors.length} Ngành
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Detailed Floor Inspector Card */}
          {activeGroup && (
            <div className="lg:col-span-8 bg-[#141414] border-2 border-[#00ff41] p-5 space-y-5 relative">
              {/* Floor Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#00ff41]/30 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#ff00ff] text-[#0c0c0c] font-black text-xs px-2.5 py-0.5 uppercase">
                      TẦNG {selectedGroupIdx + 1} // {activeGroup.subCategory.toUpperCase()}
                    </span>
                    <span className="text-xs text-[#00ff41] bg-[#000] px-2 py-0.5 border border-[#00ff41]/50 font-mono">
                      {activeGroup.majors.length} NGÀNH ĐẠI HỌC THUỘC TẦNG NÀY
                    </span>
                  </div>
                  <h4 className="text-lg sm:text-xl font-bold text-white uppercase mt-2">
                    {activeGroup.subCategory}
                  </h4>
                </div>
              </div>

              {/* List of 376 MOET Majors on this Floor */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-[#00ff41] uppercase flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-[#ff00ff]" />
                  <span>DANH SÁCH CÁC NGÀNH ĐÀO TẠO ĐẠI HỌC VIỆT NAM (BỘ GD&ĐT):</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                  {activeGroup.majors.map((major, mIdx) => (
                    <div 
                      key={mIdx}
                      className="bg-[#0c0c0c] p-2.5 border border-[#00ff41]/40 flex items-center justify-between text-xs text-white hover:border-[#00ff41] transition-colors cursor-pointer group/major"
                      onClick={() => {
                        playSound.click(settings.retroSound);
                        onSelectCareer(currentBuildingConfig.mappedCareerId);
                      }}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="text-[#00ff41] font-bold text-[10px] font-mono">#{mIdx + 1}</span>
                        <span className="font-bold group-hover/major:text-[#00ff41] truncate">{major}</span>
                      </div>
                      <span className="text-[9px] text-[#ff00ff] border border-[#ff00ff]/40 px-1.5 py-0.5 shrink-0 ml-1">
                        8 TUẦN THỰC TẬP
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Schools Training This Group */}
              <div className="space-y-2 bg-[#0a0a0a] p-3 border border-[#00ff41]/40">
                <div className="text-[11px] text-[#00ff41] font-bold uppercase">CÁC TRƯỜNG ĐẠI HỌC HÀNG ĐẦU ĐÀO TẠO NHÓM NGÀNH NÀY:</div>
                <div className="flex flex-wrap gap-1.5">
                  {currentBuildingConfig.topSchools.map((school) => (
                    <span key={school} className="bg-[#000] text-white text-[11px] px-2 py-0.5 border border-[#00ff41]/40">
                      • {school}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button: Jump into 8-week internship simulation track */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    playSound.pass(settings.retroSound);
                    onSelectCareer(currentBuildingConfig.mappedCareerId);
                  }}
                  className="w-full py-3.5 bg-[#00ff41] text-[#0c0c0c] font-black text-sm uppercase flex items-center justify-center gap-2 hover:bg-[#00e53a] transition-all border-2 border-white shadow-[0_0_20px_rgba(0,255,65,0.6)] cursor-pointer active:scale-[0.99]"
                >
                  <Zap className="w-5 h-5 fill-current" />
                  <span>THỰC HÀNH TƯƠNG TÁC TẦNG NÀY (BẮT ĐẦU 8 TUẦN THỰC TẬP)</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Global Lookup Engine for All 376 MOET Majors */}
      <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#00ff41]/30 pb-3">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#00ff41] uppercase flex items-center gap-2">
              <Search className="w-4 h-4 text-[#ff00ff]" />
              <span>TRA CỨU TOÀN BỘ {TOTAL_MAJORS_COUNT} NGÀNH ĐÀO TẠO ĐẠI HỌC BỘ GD&ĐT</span>
            </h4>
            <p className="text-xs text-[#00ff41] opacity-70 mt-0.5">
              Nhập tên ngành (ví dụ: CNTT, Y khoa, Luật kinh tế, Marketing, Trí tuệ nhân tạo...) để định vị ngay tòa nhà tương ứng.
            </p>
          </div>

          <div className="relative w-full sm:w-80">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Nhập tên ngành tìm kiếm..."
              className="w-full bg-[#000] border border-[#00ff41] text-xs text-[#00ff41] px-3 py-2 outline-none focus:border-white placeholder-[#00ff41]/40"
            />
          </div>
        </div>

        {/* Search Results */}
        {searchTerm.trim() && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pt-1">
            {filteredMoetMajors.length > 0 ? (
              filteredMoetMajors.map((major, idx) => (
                <div 
                  key={idx} 
                  onClick={() => {
                    playSound.click(settings.retroSound);
                    setSelectedBuildingId(major.categoryId);
                    setSelectedGroupIdx(0);
                  }}
                  className="bg-[#111] p-3 border border-[#00ff41]/50 hover:border-[#00ff41] cursor-pointer text-xs space-y-1 transition-all hover:-translate-y-0.5"
                >
                  <div className="text-[10px] text-[#ff00ff] font-bold">MÃ NHÓM: {major.categoryCode}</div>
                  <div className="font-bold text-white text-xs">{major.name}</div>
                  <div className="text-[10px] text-[#00ff41] opacity-80 truncate">{major.subCategory}</div>
                  <div className="text-[9px] opacity-60 truncate">{major.categoryName}</div>
                </div>
              ))
            ) : (
              <div className="col-span-full text-xs opacity-70 italic text-center py-3">
                Không tìm thấy ngành khớp với từ khóa "{searchTerm}". Vui lòng thử lại!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
