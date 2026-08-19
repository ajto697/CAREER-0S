import React, { useState, useEffect } from 'react';
import { UserProgress, CareerId, Settings } from '../types';
import { VIETNAM_MAJORS_CATALOG, TOTAL_MAJORS_COUNT } from '../data/vietnamMajorsData';
import { playSound } from '../utils/audio';
import { 
  Code, HeartPulse, GraduationCap, Newspaper, FlaskConical, 
  ArrowRight, BookOpen, Layers, Building2, Search, CheckCircle2,
  Palette, Users, Briefcase, Scale, Dna, Calculator, Wrench, Cpu, Factory,
  Trees, HeartHandshake, Plane, Truck, Leaf, ShieldCheck, Filter, Compass, Sparkles, MapPin, Zap,
  Sun, Moon, Sunset, Eye, Check, ChevronRight, ChevronLeft, CornerDownRight, BarChart3, TrendingUp, Radio, X
} from 'lucide-react';
import { PixelCitySkyline, PixelBuildingSprite, PixelShibaSprite } from './pixel/PixelArtSprites';
import confetti from 'canvas-confetti';

interface Props {
  progress: UserProgress;
  settings: Settings;
  onSelectCareer: (id: CareerId) => void;
}

// Metadata mapping for 23 MOET Major Categories
export interface MoetBuildingConfig {
  id: number;
  code: string;
  name: string;
  shortName: string;
  hollandCode: string;
  color: string;
  mappedCareerId: CareerId;
  iconName: string;
  spriteType: 'school' | 'hospital' | 'tech_tower' | 'media_hq' | 'bio_lab' | 'court' | 'art_studio' | 'business' | 'logistics' | 'agriculture' | 'defense' | 'factory';
  height: number;
  districtId: 'tech_engineering' | 'biomed_science' | 'commerce_media' | 'civic_humanities';
  salaryJunior: string;
  salarySenior: string;
  salaryJuniorNum: number; // in Million VND
  salarySeniorNum: number; // in Million VND
  topSchools: string[];
  industryFocus: string;
  isoX: number; // Isometric grid coordinate X (0-100)
  isoY: number; // Isometric grid coordinate Y (0-100)
}

export const MOET_BUILDINGS_CONFIG: MoetBuildingConfig[] = [
  {
    id: 1,
    code: '714',
    name: 'Khoa học Giáo dục & Đào tạo GV',
    shortName: 'Tòa Sư Phạm & Giáo Dục',
    hollandCode: 'S + A',
    color: '#00ff41',
    mappedCareerId: 'education',
    iconName: 'GraduationCap',
    spriteType: 'school',
    height: 190,
    districtId: 'civic_humanities',
    salaryJunior: '8 - 15 Tr/tháng',
    salarySenior: '20 - 45 Tr/tháng',
    salaryJuniorNum: 11.5,
    salarySeniorNum: 32.5,
    topSchools: ['ĐH Sư Phạm Hà Nội', 'ĐH Sư Phạm TPHCM', 'ĐH Giáo Dục - ĐHQGHN'],
    industryFocus: 'Đào tạo giáo viên, thiết kế chương trình học, nghiên cứu phương pháp giảng dạy hiện đại và tâm lý học đường.',
    isoX: 18,
    isoY: 65
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
    spriteType: 'art_studio',
    height: 175,
    districtId: 'civic_humanities',
    salaryJunior: '10 - 18 Tr/tháng',
    salarySenior: '25 - 60 Tr/tháng',
    salaryJuniorNum: 14,
    salarySeniorNum: 42.5,
    topSchools: ['ĐH Mỹ Thuật Việt Nam', 'ĐH Kiến Trúc TPHCM', 'Học viện Âm nhạc Quốc gia'],
    industryFocus: 'Sáng tạo nghệ thuật thị giác, thiết kế đồ họa, thời trang, truyền thông thị giác và mỹ thuật ứng dụng.',
    isoX: 25,
    isoY: 75
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
    spriteType: 'school',
    height: 185,
    districtId: 'civic_humanities',
    salaryJunior: '9 - 16 Tr/tháng',
    salarySenior: '22 - 50 Tr/tháng',
    salaryJuniorNum: 12.5,
    salarySeniorNum: 36,
    topSchools: ['ĐH KHXH&NV Hà Nội / TPHCM', 'ĐH Hà Nội', 'ĐH Ngoại Ngữ - ĐHQGHN'],
    industryFocus: 'Nghiên cứu văn hóa, biên - phiên dịch ngôn ngữ quốc tế, văn học, triết học và truyền thông toàn cầu.',
    isoX: 15,
    isoY: 82
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
    spriteType: 'school',
    height: 180,
    districtId: 'civic_humanities',
    salaryJunior: '9 - 15 Tr/tháng',
    salarySenior: '20 - 45 Tr/tháng',
    salaryJuniorNum: 12,
    salarySeniorNum: 32.5,
    topSchools: ['ĐH KHXH&NV', 'ĐH Kinh Tế Quốc Dân', 'ĐH Học viện Thanh Thiếu Niên'],
    industryFocus: 'Phân tích hành vi con người, tư vấn tâm lý, xã hội học, nghiên cứu hành vi tiêu dùng và chính sách công.',
    isoX: 30,
    isoY: 88
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
    spriteType: 'media_hq',
    height: 195,
    districtId: 'commerce_media',
    salaryJunior: '10 - 18 Tr/tháng',
    salarySenior: '25 - 55 Tr/tháng',
    salaryJuniorNum: 14,
    salarySeniorNum: 40,
    topSchools: ['Học viện Báo chí & Tuyên truyền', 'ĐH KHXH&NV', 'ĐH RMIT'],
    industryFocus: 'Sản xuất tin tức truyền thông, báo chí đa phương tiện, biên tập tòa soạn, PR và truyền thông thương hiệu.',
    isoX: 52,
    isoY: 70
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
    spriteType: 'business',
    height: 220,
    districtId: 'commerce_media',
    salaryJunior: '12 - 22 Tr/tháng',
    salarySenior: '30 - 80 Tr/tháng',
    salaryJuniorNum: 17,
    salarySeniorNum: 55,
    topSchools: ['ĐH Kinh Tế Quốc Dân', 'ĐH Ngoại Thương', 'ĐH Kinh Tế TPHCM (UEH)'],
    industryFocus: 'Quản trị doanh nghiệp, marketing số, tài chính - ngân hàng, chứng khoán, kế toán và thương mại điện tử.',
    isoX: 62,
    isoY: 60
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
    spriteType: 'court',
    height: 185,
    districtId: 'civic_humanities',
    salaryJunior: '10 - 20 Tr/tháng',
    salarySenior: '28 - 70 Tr/tháng',
    salaryJuniorNum: 15,
    salarySeniorNum: 49,
    topSchools: ['ĐH Luật Hà Nội', 'ĐH Luật TPHCM', 'Khoa Luật - ĐHQGHN'],
    industryFocus: 'Tư vấn pháp lý doanh nghiệp, tranh tụng tố tụng, kiểm sát, luật thương mại quốc tế và bảo hộ bản quyền.',
    isoX: 22,
    isoY: 55
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
    spriteType: 'bio_lab',
    height: 190,
    districtId: 'biomed_science',
    salaryJunior: '10 - 17 Tr/tháng',
    salarySenior: '25 - 50 Tr/tháng',
    salaryJuniorNum: 13.5,
    salarySeniorNum: 37.5,
    topSchools: ['ĐH Khoa Học Tự Nhiên', 'ĐH USTH (Việt Pháp)', 'Viện Hàn Lâm KHVN'],
    industryFocus: 'Nghiên cứu di truyền, công nghệ sinh học, vắc-xin, kỹ thuật gen và ứng dụng sinh học trong y nông nghiệp.',
    isoX: 75,
    isoY: 20
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
    spriteType: 'bio_lab',
    height: 180,
    districtId: 'biomed_science',
    salaryJunior: '10 - 18 Tr/tháng',
    salarySenior: '25 - 60 Tr/tháng',
    salaryJuniorNum: 14,
    salarySeniorNum: 42.5,
    topSchools: ['ĐH Khoa Học Tự Nhiên', 'ĐH Bách Khoa', 'ĐH USTH'],
    industryFocus: 'Khám phá quy luật vật lý, hóa học, địa chất, khoa học vật liệu tiên tiến và nghiên cứu phòng thí nghiệm.',
    isoX: 85,
    isoY: 28
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
    spriteType: 'tech_tower',
    height: 195,
    districtId: 'tech_engineering',
    salaryJunior: '14 - 25 Tr/tháng',
    salarySenior: '35 - 90 Tr/tháng',
    salaryJuniorNum: 19.5,
    salarySeniorNum: 62.5,
    topSchools: ['Viện Nghiên cứu Cao cấp về Toán', 'ĐH Khoa Học Tự Nhiên', 'ĐH Bách Khoa'],
    industryFocus: 'Phân tích dữ liệu lớn (Big Data), mô hình hóa toán học, khoa học dữ liệu, trí tuệ nhân tạo và tài chính định lượng.',
    isoX: 20,
    isoY: 35
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
    spriteType: 'tech_tower',
    height: 230,
    districtId: 'tech_engineering',
    salaryJunior: '15 - 28 Tr/tháng',
    salarySenior: '40 - 100 Tr/tháng',
    salaryJuniorNum: 21.5,
    salarySeniorNum: 70,
    topSchools: ['ĐH Bách Khoa', 'ĐH CNTT - ĐHQG TPHCM', 'ĐH FPT', 'ĐH Công Nghệ'],
    industryFocus: 'Phát triển phần mềm, trí tuệ nhân tạo (AI), an toàn thông tin, điện toán đám mây và hệ thống IoT.',
    isoX: 28,
    isoY: 22
  },
  {
    id: 12,
    code: '751',
    name: 'Công nghệ Kỹ thuật',
    shortName: 'Tòa Công Nghệ Kỹ Thuật',
    hollandCode: 'R + I',
    color: '#00e5ff',
    mappedCareerId: 'edtech',
    iconName: 'Cpu',
    spriteType: 'tech_tower',
    height: 200,
    districtId: 'tech_engineering',
    salaryJunior: '11 - 19 Tr/tháng',
    salarySenior: '26 - 60 Tr/tháng',
    salaryJuniorNum: 15,
    salarySeniorNum: 43,
    topSchools: ['ĐH Bách Khoa', 'ĐH Điện Lực', 'ĐH Công Nghiệp Hà Nội'],
    industryFocus: 'Ứng dụng kỹ thuật sản xuất, công nghệ điều khiển, vật liệu mới, hệ thống thông minh và bảo trì công nghiệp.',
    isoX: 38,
    isoY: 32
  },
  {
    id: 13,
    code: '752',
    name: 'Kỹ thuật Cơ khí & Điện',
    shortName: 'Tòa Kỹ Thuật Cơ Khí',
    hollandCode: 'R + I',
    color: '#ffea00',
    mappedCareerId: 'edtech',
    iconName: 'Wrench',
    spriteType: 'factory',
    height: 205,
    districtId: 'tech_engineering',
    salaryJunior: '11 - 18 Tr/tháng',
    salarySenior: '25 - 55 Tr/tháng',
    salaryJuniorNum: 14.5,
    salarySeniorNum: 40,
    topSchools: ['ĐH Bách Khoa Hà Nội / TPHCM', 'ĐH Sư Phạm Kỹ Thuật', 'ĐH Cần Thơ'],
    industryFocus: 'Thiết kế & chế tạo máy móc, tự động hóa, robot công nghiệp, kỹ thuật điện - điện tử và năng lượng.',
    isoX: 12,
    isoY: 22
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
    spriteType: 'factory',
    height: 175,
    districtId: 'commerce_media',
    salaryJunior: '9 - 16 Tr/tháng',
    salarySenior: '22 - 48 Tr/tháng',
    salaryJuniorNum: 12.5,
    salarySeniorNum: 35,
    topSchools: ['ĐH Bách Khoa', 'ĐH Nông Lâm TPHCM', 'ĐH Công Nghiệp Thực Phẩm'],
    industryFocus: 'Chế biến & bảo quản thực phẩm, kiểm định chất lượng an toàn vệ sinh, công nghệ hóa thực phẩm và đồ uống.',
    isoX: 72,
    isoY: 82
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
    spriteType: 'tech_tower',
    height: 215,
    districtId: 'tech_engineering',
    salaryJunior: '11 - 18 Tr/tháng',
    salarySenior: '28 - 65 Tr/tháng',
    salaryJuniorNum: 14.5,
    salarySeniorNum: 46.5,
    topSchools: ['ĐH Kiến Trúc Hà Nội / TPHCM', 'ĐH Xây Dựng Hà Nội', 'ĐH Bách Khoa'],
    industryFocus: 'Thiết kế kiến trúc công trình, quy hoạch đô thị, kỹ thuật kết cấu xây dựng và quản lý dự án hạ tầng.',
    isoX: 32,
    isoY: 42
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
    spriteType: 'agriculture',
    height: 170,
    districtId: 'civic_humanities',
    salaryJunior: '8 - 15 Tr/tháng',
    salarySenior: '20 - 45 Tr/tháng',
    salaryJuniorNum: 11.5,
    salarySeniorNum: 32.5,
    topSchools: ['Học viện Nông nghiệp VN', 'ĐH Nông Lâm TPHCM', 'ĐH Cần Thơ'],
    industryFocus: 'Nông nghiệp công nghệ cao, lâm nghiệp bền vững, nuôi trồng thủy hải sản và chế biến sản phẩm nông nghiệp.',
    isoX: 8,
    isoY: 52
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
    spriteType: 'hospital',
    height: 180,
    districtId: 'biomed_science',
    salaryJunior: '9 - 17 Tr/tháng',
    salarySenior: '22 - 50 Tr/tháng',
    salaryJuniorNum: 13,
    salarySeniorNum: 36,
    topSchools: ['Học viện Nông nghiệp VN', 'ĐH Nông Lâm TPHCM', 'ĐH Huế'],
    industryFocus: 'Chẩn đoán & điều trị y khoa động vật, dược y tế thú y, phòng chống dịch bệnh zoonosis và chăn nuôi.',
    isoX: 68,
    isoY: 38
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
    spriteType: 'hospital',
    height: 225,
    districtId: 'biomed_science',
    salaryJunior: '12 - 25 Tr/tháng',
    salarySenior: '30 - 80 Tr/tháng',
    salaryJuniorNum: 18.5,
    salarySeniorNum: 55,
    topSchools: ['ĐH Y Hà Nội', 'ĐH Y Dược TPHCM', 'ĐH Y Khoa Phạm Ngọc Thạch'],
    industryFocus: 'Khám chữa bệnh lâm sàng, dược học, điều dưỡng, kỹ thuật y học, nha khoa và y tế công cộng.',
    isoX: 60,
    isoY: 28
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
    spriteType: 'school',
    height: 175,
    districtId: 'civic_humanities',
    salaryJunior: '8 - 14 Tr/tháng',
    salarySenior: '18 - 38 Tr/tháng',
    salaryJuniorNum: 11,
    salarySeniorNum: 28,
    topSchools: ['ĐH KHXH&NV', 'ĐH Lao Động - Xã Hội', 'ĐH Sư Phạm'],
    industryFocus: 'Hỗ trợ cộng đồng yếu thế, công tác xã hội, bảo trợ trẻ em, phát triển an sinh và tư vấn tâm lý cộng đồng.',
    isoX: 20,
    isoY: 94
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
    spriteType: 'business',
    height: 200,
    districtId: 'commerce_media',
    salaryJunior: '10 - 18 Tr/tháng',
    salarySenior: '25 - 60 Tr/tháng',
    salaryJuniorNum: 14,
    salarySeniorNum: 42.5,
    topSchools: ['ĐH Hà Nội', 'ĐH Kinh Tế Quốc Dân', 'ĐH Văn Hóa TPHCM'],
    industryFocus: 'Quản trị khách sạn - nhà hàng, điều hành tour du lịch quốc tế, dịch vụ lưu trú cao cấp và ẩm thực.',
    isoX: 82,
    isoY: 65
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
    spriteType: 'logistics',
    height: 210,
    districtId: 'commerce_media',
    salaryJunior: '11 - 20 Tr/tháng',
    salarySenior: '28 - 70 Tr/tháng',
    salaryJuniorNum: 15.5,
    salarySeniorNum: 49,
    topSchools: ['ĐH Giao Thông Vận Tải', 'ĐH Hàng Hải Việt Nam', 'ĐH Kinh Tế TPHCM'],
    industryFocus: 'Quản lý chuỗi cung ứng toàn cầu, kho vận logistics, vận tải đa phương thức và dịch vụ xuất nhập khẩu.',
    isoX: 70,
    isoY: 50
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
    spriteType: 'bio_lab',
    height: 180,
    districtId: 'biomed_science',
    salaryJunior: '9 - 16 Tr/tháng',
    salarySenior: '22 - 48 Tr/tháng',
    salaryJuniorNum: 12.5,
    salarySeniorNum: 35,
    topSchools: ['ĐH Tài Nguyên & Môi Trường', 'ĐH Khoa Học Tự Nhiên', 'ĐH Bách Khoa'],
    industryFocus: 'Bảo vệ môi trường, quản lý đất đai & tài nguyên nước, xử lý chất thải và ứng phó biến đổi khí hậu.',
    isoX: 88,
    isoY: 42
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
    spriteType: 'defense',
    height: 190,
    districtId: 'civic_humanities',
    salaryJunior: 'Theo cấp bậc LLVT',
    salarySenior: 'Theo cấp bậc LLVT',
    salaryJuniorNum: 16,
    salarySeniorNum: 45,
    topSchools: ['Học viện An ninh Nhân dân', 'Học viện Cảnh sát Nhân dân', 'Học viện Kỹ thuật Quân sự'],
    industryFocus: 'Bảo vệ an ninh quốc gia, trật tự an toàn xã hội, kỹ thuật quân sự, phòng thủ dân sự và tác chiến không gian mạng.',
    isoX: 5,
    isoY: 72
  }
];

// District groupings for urban layout
interface DistrictDef {
  id: 'tech_engineering' | 'biomed_science' | 'commerce_media' | 'civic_humanities';
  name: string;
  subTitle: string;
  themeColor: string;
  hollandTraits: string;
  icon: string;
  buildingIds: number[];
  description: string;
}

const DISTRICTS_DATA: DistrictDef[] = [
  {
    id: 'tech_engineering',
    name: 'QUẬN I: THUNG LŨNG CÔNG NGHỆ & KỸ THUẬT SỐ',
    subTitle: 'Digital Engineering & AI Valley',
    themeColor: '#00ff41',
    hollandTraits: 'I + R + C (Investigative • Realistic • Conventional)',
    icon: 'Cpu',
    buildingIds: [11, 12, 13, 15, 10],
    description: 'Trung tâm công nghệ cao, phát triển phần mềm AI, vi mạch bán dẫn, kỹ thuật cơ điện tử và kiến trúc hạ tầng.'
  },
  {
    id: 'biomed_science',
    name: 'QUẬN II: ĐẶC KHU Y TẾ & KHOA HỌC SỰ SỐNG',
    subTitle: 'Biomedical & Life Sciences Park',
    themeColor: '#38bdf8',
    hollandTraits: 'I + S + R (Investigative • Social • Realistic)',
    icon: 'HeartPulse',
    buildingIds: [18, 17, 8, 9, 22],
    description: 'Khu liên hợp y tế chuyên sâu, nghiên cứu gen vắc-xin, sinh học phân tử và quản lý tài nguyên môi trường.'
  },
  {
    id: 'commerce_media',
    name: 'QUẬN III: TRUNG TÂM TÀI CHÍNH, BÁO CHÍ & LOGISTICS',
    subTitle: 'Commerce, Media & Transit Center',
    themeColor: '#facc15',
    hollandTraits: 'E + C + A (Enterprising • Conventional • Artistic)',
    icon: 'Briefcase',
    buildingIds: [6, 21, 20, 5, 14],
    description: 'Đặc khu thương mại kinh tế quốc tế, tòa soạn báo chí đa phương tiện, chuỗi cung ứng logistics toàn cầu.'
  },
  {
    id: 'civic_humanities',
    name: 'QUẬN IV: ĐÔ THỊ GIÁO DỤC, NGHỆ THUẬT & XÃ HỘI',
    subTitle: 'Civic, Education & Arts Quarter',
    themeColor: '#d946ef',
    hollandTraits: 'S + A + E (Social • Artistic • Enterprising)',
    icon: 'GraduationCap',
    buildingIds: [1, 2, 3, 4, 7, 19, 16, 23],
    description: 'Trọng điểm sư phạm GDPT 2018, nghệ thuật thị giác, văn hóa nhân văn, công lý pháp luật và an ninh quốc phòng.'
  }
];

export const GateB_CityMap: React.FC<Props> = ({ progress, settings, onSelectCareer }) => {
  // View modes: 'districts' | 'isometric_blueprint' | 'skyline' | 'matrix_search' | 'salary_radar'
  const [viewMode, setViewMode] = useState<'districts' | 'isometric_blueprint' | 'skyline' | 'matrix_search' | 'salary_radar'>('districts');
  const [timeMode, setTimeMode] = useState<'night' | 'sunset' | 'dawn'>('night');
  const [selectedBuildingId, setSelectedBuildingId] = useState<number>(11); // Default to IT & Computer Science (Code 748)
  const [selectedGroupIdx, setSelectedGroupIdx] = useState<number>(0);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [hollandFilter, setHollandFilter] = useState<string>('ALL');
  const [activeDistrictFilter, setActiveDistrictFilter] = useState<string>('ALL');
  const [hoveredBuilding, setHoveredBuilding] = useState<MoetBuildingConfig | null>(null);
  const [showBuildingModal, setShowBuildingModal] = useState<boolean>(false);

  // Selected MOET Building object
  const currentBuildingConfig = MOET_BUILDINGS_CONFIG.find(b => b.id === selectedBuildingId) || MOET_BUILDINGS_CONFIG[10];
  const currentMoetCategory = VIETNAM_MAJORS_CATALOG.find(c => c.id === currentBuildingConfig.id) || VIETNAM_MAJORS_CATALOG[10];
  
  const currentGroups = currentMoetCategory.groups || [];
  const activeGroup = currentGroups[selectedGroupIdx] || currentGroups[0];

  // Helper to open building detail sub-screen popup instantly without scrolling
  const handleOpenBuildingModal = (buildingId: number, groupIdx = 0) => {
    playSound.click(settings.retroSound);
    setSelectedBuildingId(buildingId);
    setSelectedGroupIdx(groupIdx);
    setShowBuildingModal(true);
  };

  const handlePrevBuilding = () => {
    playSound.click(settings.retroSound);
    const currentIndex = MOET_BUILDINGS_CONFIG.findIndex(b => b.id === selectedBuildingId);
    const prevIndex = (currentIndex - 1 + MOET_BUILDINGS_CONFIG.length) % MOET_BUILDINGS_CONFIG.length;
    setSelectedBuildingId(MOET_BUILDINGS_CONFIG[prevIndex].id);
    setSelectedGroupIdx(0);
  };

  const handleNextBuilding = () => {
    playSound.click(settings.retroSound);
    const currentIndex = MOET_BUILDINGS_CONFIG.findIndex(b => b.id === selectedBuildingId);
    const nextIndex = (currentIndex + 1) % MOET_BUILDINGS_CONFIG.length;
    setSelectedBuildingId(MOET_BUILDINGS_CONFIG[nextIndex].id);
    setSelectedGroupIdx(0);
  };

  // Keyboard shortcut ESC to close modal, Left/Right arrow to navigate buildings
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showBuildingModal) {
        setShowBuildingModal(false);
      }
      if (showBuildingModal && e.key === 'ArrowLeft') {
        handlePrevBuilding();
      }
      if (showBuildingModal && e.key === 'ArrowRight') {
        handleNextBuilding();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [showBuildingModal, selectedBuildingId]);

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
    if (activeDistrictFilter !== 'ALL' && b.districtId !== activeDistrictFilter) {
      return false;
    }
    if (hollandFilter !== 'ALL' && !b.hollandCode.includes(hollandFilter)) {
      return false;
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
      ).slice(0, 16)
    : [];

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-mono text-[#00ff41] select-none pb-12">
      {/* Top Banner Header - Retro Terminal Metropolis Header */}
      <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-4 sm:p-5 relative overflow-hidden shadow-[0_0_25px_rgba(0,255,65,0.25)]">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#00ff41] text-[#0c0c0c] font-black text-xs px-2.5 py-0.5 uppercase tracking-wide">
                CỔNG B // BẢN ĐỒ ĐÔ THỊ HƯỚNG NGHIỆP GDPT 2018
              </span>
              <span className="text-xs text-[#ff00ff] bg-[#111] px-2 py-0.5 border border-[#ff00ff]/50 font-bold">
                23 TÒA NHÀ • 4 PHÂN KHU • {TOTAL_MAJORS_COUNT} NGÀNH ĐẠI HỌC
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white uppercase tracking-wider mt-2 flex items-center gap-2.5">
              <span>SƠ ĐỒ THÀNH PHỐ NGHỀ NGHIỆP & CÁC TÒA CAO ỐC</span>
              <Sparkles className="w-5 h-5 text-[#ffea00] animate-bounce" />
            </h3>
            <p className="text-xs text-[#00ff41] opacity-80 mt-1 max-w-3xl leading-relaxed">
              Khám phá không gian quy hoạch đô thị nghề nghiệp 2.5D: Mỗi tòa nhà đại diện cho 1 nhóm mã ngành chuẩn của Bộ GD&ĐT Việt Nam.
              Bấm vào từng tòa nhà để tra cứu chi tiết ngành học, mức lương và bắt đầu thực tập tương tác.
            </p>
          </div>

          {/* Controls: Time of day atmosphere */}
          <div className="flex items-center gap-1 bg-[#050505] p-1 border border-[#00ff41]/50 shrink-0">
            <button
              onClick={() => {
                playSound.click(settings.retroSound);
                setTimeMode('night');
              }}
              className={`p-1.5 text-xs flex items-center gap-1 transition-all cursor-pointer ${
                timeMode === 'night' ? 'bg-[#00ff41] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
              title="Chế độ Đêm Cyber Neon"
            >
              <Moon className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">ĐÊM</span>
            </button>
            <button
              onClick={() => {
                playSound.click(settings.retroSound);
                setTimeMode('sunset');
              }}
              className={`p-1.5 text-xs flex items-center gap-1 transition-all cursor-pointer ${
                timeMode === 'sunset' ? 'bg-[#f97316] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
              title="Chế độ Hoàng Hôn Rực Rỡ"
            >
              <Sunset className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">HOÀNG HÔN</span>
            </button>
            <button
              onClick={() => {
                playSound.click(settings.retroSound);
                setTimeMode('dawn');
              }}
              className={`p-1.5 text-xs flex items-center gap-1 transition-all cursor-pointer ${
                timeMode === 'dawn' ? 'bg-[#10b981] text-black font-bold' : 'text-gray-400 hover:text-white'
              }`}
              title="Chế độ Bình Minh Tươi Sáng"
            >
              <Sun className="w-3.5 h-3.5" />
              <span className="text-[10px] hidden sm:inline">BÌNH MINH</span>
            </button>
          </div>
        </div>

        {/* View Mode Tabs */}
        <div className="flex flex-wrap items-center gap-2 mt-4 pt-3 border-t border-[#00ff41]/30">
          <button
            onClick={() => {
              playSound.click(settings.retroSound);
              setViewMode('districts');
            }}
            className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-2 border transition-all cursor-pointer ${
              viewMode === 'districts'
                ? 'bg-[#00ff41] text-black border-white shadow-[0_0_12px_#00ff41]'
                : 'bg-black text-[#00ff41] border-[#00ff41]/50 hover:border-[#00ff41]'
            }`}
          >
            <Building2 className="w-4 h-4" />
            <span>1. SƠ ĐỒ 4 ĐẠI PHÂN KHU ĐÔ THỊ</span>
          </button>

          <button
            onClick={() => {
              playSound.click(settings.retroSound);
              setViewMode('isometric_blueprint');
            }}
            className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-2 border transition-all cursor-pointer ${
              viewMode === 'isometric_blueprint'
                ? 'bg-[#00ffff] text-black border-white shadow-[0_0_12px_#00ffff]'
                : 'bg-black text-[#00ffff] border-[#00ffff]/50 hover:border-[#00ffff]'
            }`}
          >
            <Compass className="w-4 h-4" />
            <span>2. BẢN ĐỒ ISOMETRIC 2.5D & QUY HOẠCH</span>
          </button>

          <button
            onClick={() => {
              playSound.click(settings.retroSound);
              setViewMode('skyline');
            }}
            className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-2 border transition-all cursor-pointer ${
              viewMode === 'skyline'
                ? 'bg-[#00ff41] text-black border-white shadow-[0_0_12px_#00ff41]'
                : 'bg-black text-[#00ff41] border-[#00ff41]/50 hover:border-[#00ff41]'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>3. SƠ ĐỒ TOÀN CẢNH 23 CAO ỐC SKYLINE</span>
          </button>

          <button
            onClick={() => {
              playSound.click(settings.retroSound);
              setViewMode('salary_radar');
            }}
            className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-2 border transition-all cursor-pointer ${
              viewMode === 'salary_radar'
                ? 'bg-[#ffea00] text-black border-white shadow-[0_0_12px_#ffea00]'
                : 'bg-black text-[#ffea00] border-[#ffea00]/50 hover:border-[#ffea00]'
            }`}
          >
            <TrendingUp className="w-4 h-4" />
            <span>4. PHÂN TÍCH LƯƠNG & THỊ TRƯỜNG LAO ĐỘNG</span>
          </button>

          <button
            onClick={() => {
              playSound.click(settings.retroSound);
              setViewMode('matrix_search');
            }}
            className={`px-3 py-1.5 text-xs font-bold uppercase flex items-center gap-2 border transition-all cursor-pointer ${
              viewMode === 'matrix_search'
                ? 'bg-[#ff00ff] text-black border-white shadow-[0_0_12px_#ff00ff]'
                : 'bg-black text-[#ff00ff] border-[#ff00ff]/50 hover:border-[#ff00ff]'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>5. MATRIX TRA CỨU 376 NGÀNH ĐH</span>
          </button>
        </div>
      </div>

      {/* Upgraded Cyber Animated Skyline Banner with Metro Train & Drones */}
      <PixelCitySkyline timeMode={timeMode} className="shadow-lg" />

      {/* Quick Filters Bar (RIASEC & District Filters) */}
      <div className="bg-[#0a0a0a] border-2 border-[#00ff41]/60 p-3 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* RIASEC Holland Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <div className="text-[11px] font-bold text-white uppercase flex items-center gap-1 mr-1">
            <Filter className="w-3.5 h-3.5 text-[#ff00ff]" />
            <span>LỌC HOLLAND:</span>
          </div>
          {['ALL', 'R', 'I', 'A', 'S', 'E', 'C'].map((code) => (
            <button
              key={code}
              onClick={() => {
                playSound.click(settings.retroSound);
                setHollandFilter(code);
              }}
              className={`px-2 py-0.5 text-xs font-bold border transition-all cursor-pointer ${
                hollandFilter === code
                  ? 'bg-[#ff00ff] text-black border-white shadow-[0_0_8px_#ff00ff]'
                  : 'bg-black text-[#00ff41] border-[#00ff41]/40 hover:border-[#00ff41]'
              }`}
            >
              {code === 'ALL' ? 'TẤT CẢ (ALL)' : `NHÓM ${code}`}
            </button>
          ))}
        </div>

        {/* District Quick Filter */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-[11px] font-bold text-white uppercase">PHÂN KHU:</span>
          <select
            value={activeDistrictFilter}
            onChange={(e) => {
              playSound.click(settings.retroSound);
              setActiveDistrictFilter(e.target.value);
            }}
            className="bg-black border border-[#00ff41] text-[#00ff41] text-xs px-2 py-0.5 outline-none"
          >
            <option value="ALL">Toàn Bộ 4 Phân Khu Đô Thị</option>
            <option value="tech_engineering">Quận I: Công Nghệ & Kỹ Thuật</option>
            <option value="biomed_science">Quận II: Y Tế & Khoa Học</option>
            <option value="commerce_media">Quận III: Tài Chính & Logistics</option>
            <option value="civic_humanities">Quận IV: Giáo Dục & Xã Hội</option>
          </select>
        </div>
      </div>

      {/* =========================================================
          VIEW MODE 1: 4 URBAN DISTRICTS GRID VIEW (SƠ ĐỒ 4 ĐẠI PHÂN KHU)
          ========================================================= */}
      {viewMode === 'districts' && (
        <div className="space-y-6">
          {DISTRICTS_DATA
            .filter(d => activeDistrictFilter === 'ALL' || d.id === activeDistrictFilter)
            .map((district) => {
              const districtBuildings = MOET_BUILDINGS_CONFIG.filter(b => 
                district.buildingIds.includes(b.id) &&
                (hollandFilter === 'ALL' || b.hollandCode.includes(hollandFilter))
              );

              if (districtBuildings.length === 0) return null;

              return (
                <div 
                  key={district.id}
                  className="bg-[#080c08] border-2 border-[#00ff41] p-4 sm:p-5 relative overflow-hidden space-y-4"
                  style={{ borderColor: district.themeColor }}
                >
                  {/* District Header Banner */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-2 border-b pb-3" style={{ borderColor: `${district.themeColor}50` }}>
                    <div>
                      <div className="flex items-center gap-2">
                        <span 
                          className="text-black font-black text-xs px-2.5 py-0.5 uppercase tracking-wide"
                          style={{ backgroundColor: district.themeColor }}
                        >
                          {district.name}
                        </span>
                        <span className="text-xs text-white bg-black px-2 py-0.5 border border-white/30 font-mono">
                          {districtBuildings.length} TÒA CAO ỐC THUỘC QUẬN
                        </span>
                      </div>
                      <p className="text-xs text-white/80 mt-1">
                        {district.description}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-[10px] text-white/60 font-mono">HOLLAND PHÙ HỢP:</div>
                      <div className="text-xs font-bold" style={{ color: district.themeColor }}>
                        {district.hollandTraits}
                      </div>
                    </div>
                  </div>

                  {/* Buildings Grid inside this District */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3 pt-2">
                    {districtBuildings.map((building) => {
                      const isSelected = selectedBuildingId === building.id;
                      const catData = VIETNAM_MAJORS_CATALOG.find(c => c.id === building.id);
                      const totalMajors = catData?.groups.reduce((acc, g) => acc + g.majors.length, 0) || 0;

                      return (
                        <div
                          key={building.id}
                          onClick={() => handleOpenBuildingModal(building.id, 0)}
                          className={`bg-[#000] p-3 border-2 transition-all duration-200 cursor-pointer flex flex-col justify-between group relative ${
                            isSelected
                              ? 'border-[#00ff41] bg-[#0c1a0c] shadow-[0_0_20px_rgba(0,255,65,0.6)] scale-[1.02] z-10'
                              : 'border-[#00ff41]/30 hover:border-[#00ff41] hover:bg-[#081208] hover:-translate-y-1'
                          }`}
                        >
                          {/* Selected Active Indicator */}
                          {isSelected && (
                            <div className="absolute -top-2.5 right-2 bg-[#00ff41] text-black text-[9px] font-black px-1.5 py-0.2 uppercase border border-white shadow">
                              ĐANG CHỌN
                            </div>
                          )}

                          {/* Top row: Code + Icon */}
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-[#ff00ff] bg-[#141414] px-1.5 py-0.5 border border-[#ff00ff]/40">
                              MÃ {building.code}
                            </span>
                            <div className="p-1.5 bg-[#111] border border-[#00ff41]/40 text-[#00ff41] group-hover:scale-110 group-hover:bg-[#00ff41] group-hover:text-black transition-all">
                              {renderBuildingIcon(building.iconName, "w-4 h-4")}
                            </div>
                          </div>

                          {/* Building Title & Holland */}
                          <div className="my-2">
                            <h4 className={`text-xs font-bold line-clamp-2 uppercase ${isSelected ? 'text-white' : 'text-[#00ff41]'}`}>
                              {building.shortName}
                            </h4>
                            <div className="text-[10px] text-white/60 truncate mt-0.5">
                              {building.name}
                            </div>
                          </div>

                          {/* Bottom info stats: Floors & Majors */}
                          <div className="pt-2 border-t border-[#00ff41]/20 flex items-center justify-between text-[9px] text-[#00ff41]/80">
                            <span className="flex items-center gap-1">
                              <Layers className="w-3 h-3 text-[#ff00ff]" />
                              {catData?.groups.length || 1} Tầng
                            </span>
                            <span className="text-[#ffea00] font-bold bg-[#111] px-1 py-0.5 border border-[#ffea00]/30">{totalMajors} Ngành ĐH</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
        </div>
      )}

      {/* =========================================================
          VIEW MODE 2: INTERACTIVE ISOMETRIC 2.5D MASTER BLUEPRINT MAP
          ========================================================= */}
      {viewMode === 'isometric_blueprint' && (
        <div className="bg-[#030704] border-2 border-[#00ffff] p-4 sm:p-5 space-y-4 shadow-[0_0_30px_rgba(0,255,255,0.2)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00ffff]/40 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#00ffff] animate-spin" style={{ animationDuration: '8s' }} />
                <span>BẢN ĐỒ QUY HOẠCH ĐÔ THỊ ISOMETRIC 2.5D (MASTER BLUEPRINT)</span>
              </h4>
              <p className="text-xs text-white/70 mt-0.5">
                Bấm vào các nút công trình cao ốc trên lưới bản đồ để mở màn hình phụ tra cứu ngay lập tức.
              </p>
            </div>
            <span className="text-[10px] text-[#00ffff] bg-black px-2.5 py-1 border border-[#00ffff]/60 font-mono">
              LƯỚI ĐỊA LÝ 100x100 • 23 TÒA NHÀ
            </span>
          </div>

          {/* Interactive Isometric SVG Canvas */}
          <div className="relative w-full h-96 sm:h-[480px] bg-[#020503] border border-[#00ffff]/40 overflow-hidden rounded">
            <svg 
              viewBox="0 0 1000 600" 
              className="w-full h-full object-cover"
              preserveAspectRatio="xMidYMid meet"
            >
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="isoGrid" width="40" height="24" patternUnits="userSpaceOnUse">
                  <path d="M 0 12 L 20 0 L 40 12 L 20 24 Z" fill="none" stroke="rgba(0,255,255,0.08)" strokeWidth="0.5" />
                </pattern>
                <linearGradient id="riverGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#0284c7" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#00ffff" stopOpacity="0.7" />
                  <stop offset="100%" stopColor="#0284c7" stopOpacity="0.4" />
                </linearGradient>
              </defs>

              {/* Grid Background */}
              <rect width="1000" height="600" fill="url(#isoGrid)" />

              {/* Cyber River meandering through city */}
              <path
                d="M 450 0 C 480 150, 420 300, 520 450 C 580 520, 620 580, 650 600"
                fill="none"
                stroke="url(#riverGrad)"
                strokeWidth="48"
                strokeLinecap="round"
              />
              <path
                d="M 450 0 C 480 150, 420 300, 520 450 C 580 520, 620 580, 650 600"
                fill="none"
                stroke="#ffffff"
                strokeWidth="2"
                strokeDasharray="6,8"
                opacity="0.6"
              />

              {/* Highway Bridges across the river */}
              <line x1="380" y1="220" x2="560" y2="280" stroke="#ffea00" strokeWidth="8" />
              <line x1="380" y1="220" x2="560" y2="280" stroke="#000000" strokeWidth="2" strokeDasharray="4,4" />

              <line x1="420" y1="420" x2="600" y2="480" stroke="#00ff41" strokeWidth="8" />
              <line x1="420" y1="420" x2="600" y2="480" stroke="#000000" strokeWidth="2" strokeDasharray="4,4" />

              {/* District Territory Labels */}
              <text x="180" y="80" fill="#00ff41" fontSize="13" fontWeight="bold" fontFamily="monospace" letterSpacing="1">
                QUẬN I: CÔNG NGHỆ (IT & ENGINEERING)
              </text>
              <text x="720" y="80" fill="#38bdf8" fontSize="13" fontWeight="bold" fontFamily="monospace" letterSpacing="1">
                QUẬN II: Y TẾ & KHOA HỌC
              </text>
              <text x="680" y="550" fill="#facc15" fontSize="13" fontWeight="bold" fontFamily="monospace" letterSpacing="1">
                QUẬN III: KINH TẾ & MEDIA
              </text>
              <text x="120" y="550" fill="#d946ef" fontSize="13" fontWeight="bold" fontFamily="monospace" letterSpacing="1">
                QUẬN IV: SƯ PHẠM & XÃ HỘI
              </text>

              {/* 23 Isometric Building Towers Nodes */}
              {MOET_BUILDINGS_CONFIG.map((b) => {
                const isSelected = selectedBuildingId === b.id;
                const isHovered = hoveredBuilding?.id === b.id;

                // Calculate screen coords from iso coords
                const posX = (b.isoX / 100) * 880 + 60;
                const posY = (b.isoY / 100) * 480 + 60;

                return (
                  <g
                    key={b.id}
                    className="cursor-pointer transition-all duration-300"
                    onClick={() => handleOpenBuildingModal(b.id, 0)}
                    onMouseEnter={() => setHoveredBuilding(b)}
                    onMouseLeave={() => setHoveredBuilding(null)}
                  >
                    {/* Shadow / Base */}
                    <ellipse
                      cx={posX}
                      cy={posY + 12}
                      rx={isSelected ? 22 : 16}
                      ry={isSelected ? 10 : 7}
                      fill="rgba(0,0,0,0.6)"
                    />

                    {/* Isometric Building 3D Block */}
                    <g transform={`translate(${posX - 16}, ${posY - (isSelected ? 32 : 24)})`}>
                      {/* Left Wall */}
                      <path
                        d="M 0 16 L 16 26 L 16 46 L 0 36 Z"
                        fill={isSelected ? '#00e53a' : b.color}
                        opacity={0.75}
                      />
                      {/* Right Wall */}
                      <path
                        d="M 16 26 L 32 16 L 32 36 L 16 46 Z"
                        fill={isSelected ? '#00b32c' : b.color}
                        opacity={0.5}
                      />
                      {/* Roof Top */}
                      <path
                        d="M 16 6 L 32 16 L 16 26 L 0 16 Z"
                        fill={isSelected ? '#ffffff' : b.color}
                        stroke={isSelected ? '#00ff41' : '#ffffff'}
                        strokeWidth={isSelected ? 2 : 1}
                      />
                    </g>

                    {/* Glowing Pin Marker & Code */}
                    <g transform={`translate(${posX}, ${posY - (isSelected ? 42 : 32)})`}>
                      <circle
                        cx="0"
                        cy="0"
                        r={isSelected ? 10 : 8}
                        fill={isSelected ? '#00ff41' : '#000000'}
                        stroke={isSelected ? '#ffffff' : b.color}
                        strokeWidth="2"
                      />
                      <text
                        x="0"
                        y="3"
                        fontSize="7"
                        fontWeight="black"
                        fill={isSelected ? '#000000' : '#ffffff'}
                        textAnchor="middle"
                        fontFamily="monospace"
                      >
                        {b.code}
                      </text>
                    </g>

                    {/* Hover or Selected Label Tooltip */}
                    {(isSelected || isHovered) && (
                      <g transform={`translate(${posX}, ${posY - 52})`}>
                        <rect
                          x="-65"
                          y="-16"
                          width="130"
                          height="20"
                          fill="#000000"
                          stroke={b.color}
                          strokeWidth="1.5"
                          rx="3"
                        />
                        <text
                          x="0"
                          y="-2"
                          fontSize="9"
                          fontWeight="bold"
                          fill="#ffffff"
                          textAnchor="middle"
                          fontFamily="monospace"
                        >
                          {b.shortName}
                        </text>
                      </g>
                    )}
                  </g>
                );
              })}
            </svg>
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW MODE 3: 23 PANORAMIC SKYLINE TOWERS (SƠ ĐỒ 23 TÒA CAO ỐC)
          ========================================================= */}
      {viewMode === 'skyline' && (
        <div className="bg-[#050805] border-2 border-[#00ff41] p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between border-b border-[#00ff41]/40 pb-2">
            <h4 className="text-sm font-bold text-white uppercase flex items-center gap-2">
              <Layers className="w-4 h-4 text-[#00ff41]" />
              <span>TOÀN CẢNH ĐÔ THỊ 23 TÒA CAO ỐC BỘ GD&ĐT (BẤM VÀO TÒA NHÀ ĐỂ MỞ THÔNG TIN)</span>
            </h4>
            <span className="text-xs text-[#00ff41] bg-black px-2 py-0.5 border border-[#00ff41]/40">
              {filteredBuildings.length} TÒA ĐANG HIỂN THỊ
            </span>
          </div>

          {/* Panoramic Horizontal Scroll Runway */}
          <div className="overflow-x-auto pb-4 pt-6 scrollbar-thin scrollbar-thumb-[#00ff41] scrollbar-track-black">
            <div className="flex items-end gap-5 px-4 min-w-max">
              {filteredBuildings.map((building) => {
                const isSelected = selectedBuildingId === building.id;
                const catData = VIETNAM_MAJORS_CATALOG.find(c => c.id === building.id);
                const totalMajors = catData?.groups.reduce((acc, g) => acc + g.majors.length, 0) || 0;

                return (
                  <PixelBuildingSprite
                    key={building.id}
                    type={building.spriteType}
                    name={building.shortName}
                    code={building.code}
                    floors={catData?.groups.length || 3}
                    height={building.height}
                    hollandCode={building.hollandCode}
                    salary={building.salaryJunior}
                    majorsCount={totalMajors}
                    active={isSelected}
                    color={building.color}
                    onClick={() => handleOpenBuildingModal(building.id, 0)}
                  />
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW MODE 4: SALARY RADAR & LABOR MARKET SPECTRUM
          ========================================================= */}
      {viewMode === 'salary_radar' && (
        <div className="bg-[#080802] border-2 border-[#ffea00] p-4 sm:p-5 space-y-4 shadow-[0_0_25px_rgba(255,234,0,0.2)]">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#ffea00]/40 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <BarChart3 className="w-5 h-5 text-[#ffea00]" />
                <span>PHỔ MỨC LƯƠNG & DỰ BÁO NHU CẦU THỊ TRƯỜNG LAO ĐỘNG (2025 - 2030)</span>
              </h4>
              <p className="text-xs text-white/70 mt-0.5">
                So sánh mức thu nhập khởi điểm (Junior) và thu nhập chuyên gia 5+ năm (Senior). Bấm vào từng nhóm để mở màn hình phụ chi tiết.
              </p>
            </div>
            <div className="flex gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1 text-[#00ff41]">
                <span className="w-3 h-3 bg-[#00ff41] inline-block" /> Khởi điểm (Junior)
              </span>
              <span className="flex items-center gap-1 text-[#ff00ff]">
                <span className="w-3 h-3 bg-[#ff00ff] inline-block" /> Chuyên gia (Senior)
              </span>
            </div>
          </div>

          {/* Comparative Salary Spectrum Bars */}
          <div className="space-y-2.5 pt-2 max-h-96 overflow-y-auto pr-1">
            {MOET_BUILDINGS_CONFIG.map((b) => {
              const isSelected = selectedBuildingId === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => handleOpenBuildingModal(b.id, 0)}
                  className={`p-2.5 border transition-all cursor-pointer ${
                    isSelected ? 'bg-[#151500] border-[#ffea00] shadow-[0_0_10px_rgba(255,234,0,0.4)]' : 'bg-black border-[#ffea00]/30 hover:border-[#ffea00] hover:bg-[#0a0a00]'
                  }`}
                >
                  <div className="flex justify-between items-center text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-[#ffea00]">MÃ {b.code}</span>
                      <span className="font-bold text-white">{b.shortName}</span>
                      <span className="text-[10px] text-white/60">({b.hollandCode})</span>
                    </div>
                    <div className="text-[11px] text-white font-mono">
                      <span className="text-[#00ff41]">{b.salaryJunior}</span> ➔ <span className="text-[#ff00ff]">{b.salarySenior}</span>
                    </div>
                  </div>

                  {/* Double Range Bar */}
                  <div className="w-full bg-[#1a1a1a] h-3 rounded-full overflow-hidden flex relative">
                    <div
                      className="bg-[#00ff41] h-full"
                      style={{ width: `${(b.salaryJuniorNum / 80) * 100}%` }}
                      title={`Junior: ${b.salaryJuniorNum} Tr`}
                    />
                    <div
                      className="bg-[#ff00ff] h-full"
                      style={{ width: `${((b.salarySeniorNum - b.salaryJuniorNum) / 80) * 100}%` }}
                      title={`Senior: ${b.salarySeniorNum} Tr`}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =========================================================
          VIEW MODE 5: RIASEC & MAJORS MATRIX (MATRIX TRA CỨU)
          ========================================================= */}
      {viewMode === 'matrix_search' && (
        <div className="bg-[#050805] border-2 border-[#ff00ff] p-4 sm:p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#ff00ff]/40 pb-3">
            <div>
              <h4 className="text-sm font-bold text-white uppercase flex items-center gap-2">
                <Search className="w-4 h-4 text-[#ff00ff]" />
                <span>BẢNG MA TRẬN 23 NHÓM MÃ NGÀNH & ĐẶC TÍNH HOLLAND</span>
              </h4>
              <p className="text-xs text-white/70 mt-0.5">
                Bảng so sánh nhanh mức lương khởi điểm, mã số đào tạo Bộ GD&ĐT và chỉ số Holland tương thích.
              </p>
            </div>

            <div className="relative w-full sm:w-72">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Tra cứu ngành học..."
                className="w-full bg-black border border-[#ff00ff] text-xs text-[#ff00ff] px-3 py-1.5 outline-none placeholder-[#ff00ff]/40"
              />
            </div>
          </div>

          {/* Matrix Table */}
          <div className="overflow-x-auto">
            <table className="w-full text-xs text-left border-collapse">
              <thead>
                <tr className="bg-[#111] text-[#00ff41] border-b border-[#ff00ff]/40">
                  <th className="p-2.5">MÃ GDĐT</th>
                  <th className="p-2.5">TÊN TÒA NHÀ / NHÓM NGÀNH</th>
                  <th className="p-2.5">HOLLAND</th>
                  <th className="p-2.5">SỐ LƯỢNG NGÀNH</th>
                  <th className="p-2.5">LƯƠNG KHỞI ĐIỂM</th>
                  <th className="p-2.5">THAO TÁC</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {MOET_BUILDINGS_CONFIG.map((b) => {
                  const cat = VIETNAM_MAJORS_CATALOG.find(c => c.id === b.id);
                  const count = cat?.groups.reduce((acc, g) => acc + g.majors.length, 0) || 0;
                  const isSelected = selectedBuildingId === b.id;

                  return (
                    <tr 
                      key={b.id}
                      onClick={() => handleOpenBuildingModal(b.id, 0)}
                      className={`hover:bg-[#0c1a0c] cursor-pointer transition-colors ${isSelected ? 'bg-[#0c1a0c] font-bold text-white' : 'text-gray-300'}`}
                    >
                      <td className="p-2.5 text-[#ff00ff] font-bold">{b.code}</td>
                      <td className="p-2.5">
                        <div className="flex items-center gap-2">
                          {renderBuildingIcon(b.iconName, "w-4 h-4 text-[#00ff41]")}
                          <span>{b.name}</span>
                        </div>
                      </td>
                      <td className="p-2.5 text-[#ffea00]">{b.hollandCode}</td>
                      <td className="p-2.5">{count} Ngành ĐH</td>
                      <td className="p-2.5 text-[#00ff41]">{b.salaryJunior}</td>
                      <td className="p-2.5">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenBuildingModal(b.id, 0);
                          }}
                          className="px-2 py-1 bg-[#00ff41] text-black text-[10px] font-bold uppercase hover:bg-white cursor-pointer"
                        >
                          XEM MÀN HÌNH PHỤ
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Global Lookup Engine for All 376 MOET Majors */}
      <div className="bg-[#0c0c0c] border-2 border-[#00ff41] p-5 space-y-4 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#00ff41]/30 pb-3">
          <div>
            <h4 className="text-sm sm:text-base font-bold text-[#00ff41] uppercase flex items-center gap-2">
              <Search className="w-4 h-4 text-[#ff00ff]" />
              <span>TRA CỨU TOÀN BỘ {TOTAL_MAJORS_COUNT} NGÀNH ĐÀO TẠO ĐẠI HỌC BỘ GD&ĐT</span>
            </h4>
            <p className="text-xs text-[#00ff41] opacity-70 mt-0.5">
              Nhập tên ngành (ví dụ: CNTT, Y khoa, Luật kinh tế, Marketing, Trí tuệ nhân tạo...) để mở ngay màn hình phụ thông tin tòa nhà tương ứng.
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
                  onClick={() => handleOpenBuildingModal(major.categoryId, 0)}
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

      {/* =========================================================
          DEDICATED SUB-SCREEN / MODAL: CHI TIẾT TÒA NHÀ & CÁC TẦNG NGÀNH HỌC
          (Hiển thị dạng Màn Hình Phụ Tức Thì - Không cần cuộn lướt xuống)
          ========================================================= */}
      {showBuildingModal && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-black/85 backdrop-blur-md animate-fadeIn"
          onClick={() => setShowBuildingModal(false)}
        >
          <div 
            className="bg-[#050a05] border-2 sm:border-4 border-[#00ff41] w-full max-w-5xl max-h-[92vh] flex flex-col shadow-[0_0_50px_rgba(0,255,65,0.4)] relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top Glowing Header Bar */}
            <div className="bg-[#0c140c] border-b-2 border-[#00ff41] p-3 sm:p-4 flex items-center justify-between gap-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <div className="p-2.5 bg-black border-2 border-[#00ff41] text-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.5)] shrink-0">
                  {renderBuildingIcon(currentBuildingConfig.iconName, "w-6 h-6 sm:w-7 sm:h-7")}
                </div>
                <div className="truncate">
                  <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
                    <span className="bg-[#ff00ff] text-black font-black text-[10px] sm:text-xs px-2 py-0.5 uppercase">
                      MÃ BỘ GD&ĐT: {currentBuildingConfig.code}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#00ff41] bg-black px-1.5 py-0.5 border border-[#00ff41]/50 font-bold">
                      HOLLAND: {currentBuildingConfig.hollandCode}
                    </span>
                    <span className="text-[10px] sm:text-xs text-[#ffea00] bg-black px-1.5 py-0.5 border border-[#ffea00]/50 font-bold hidden sm:inline">
                      {currentGroups.length} TẦNG PHÂN NHÓM
                    </span>
                  </div>
                  <h3 className="text-base sm:text-xl font-black text-white uppercase mt-0.5 truncate">
                    {currentBuildingConfig.shortName}
                  </h3>
                </div>
              </div>

              {/* Navigation Controls: Prev/Next Building + Close Button */}
              <div className="flex items-center gap-1.5 shrink-0">
                <button
                  onClick={handlePrevBuilding}
                  title="Tòa nhà trước (Phím ←)"
                  className="p-1.5 sm:p-2 bg-black border border-[#00ff41]/50 text-[#00ff41] hover:border-[#00ff41] hover:bg-[#0c1a0c] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-[10px] sm:text-xs font-mono text-white/70 px-1 hidden md:inline">
                  {currentBuildingConfig.id} / 23
                </span>
                <button
                  onClick={handleNextBuilding}
                  title="Tòa nhà kế tiếp (Phím →)"
                  className="p-1.5 sm:p-2 bg-black border border-[#00ff41]/50 text-[#00ff41] hover:border-[#00ff41] hover:bg-[#0c1a0c] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
                <button
                  onClick={() => {
                    playSound.click(settings.retroSound);
                    setShowBuildingModal(false);
                  }}
                  title="Đóng màn hình phụ (Phím ESC)"
                  className="p-1.5 sm:p-2 bg-[#ff0055] text-white font-black hover:bg-[#ff3377] border border-white cursor-pointer ml-1 sm:ml-2 flex items-center gap-1"
                >
                  <X className="w-4 h-4" />
                  <span className="text-[10px] font-bold hidden sm:inline">ĐÓNG [ESC]</span>
                </button>
              </div>
            </div>

            {/* Modal Body - Scrollable Content */}
            <div className="p-3 sm:p-5 overflow-y-auto space-y-4 flex-1">
              {/* Summary Description & Salary Snapshot */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 bg-[#0a120a] p-3 sm:p-4 border border-[#00ff41]/40">
                <div className="md:col-span-2 space-y-1">
                  <div className="text-[11px] text-white/60 font-mono uppercase">TỔNG QUAN LĨNH VỰC ĐÀO TẠO:</div>
                  <div className="text-xs sm:text-sm text-white font-bold">{currentBuildingConfig.name}</div>
                  <p className="text-xs text-[#00ff41]/80 leading-relaxed pt-0.5">
                    {currentBuildingConfig.industryFocus}
                  </p>
                </div>
                <div className="bg-black p-2.5 sm:p-3 border border-[#00ff41]/40 space-y-1">
                  <div className="text-[10px] text-white/60 font-mono uppercase">THU NHẬP THỊ TRƯỜNG LAO ĐỘNG:</div>
                  <div className="text-xs font-bold text-[#00ff41] flex items-center justify-between">
                    <span>Khởi điểm (Junior):</span>
                    <span>{currentBuildingConfig.salaryJunior}</span>
                  </div>
                  <div className="text-xs font-bold text-[#ff00ff] flex items-center justify-between">
                    <span>Chuyên gia (5+ năm):</span>
                    <span>{currentBuildingConfig.salarySenior}</span>
                  </div>
                </div>
              </div>

              {/* Elevator & Floor Split Section */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
                {/* Left (lg:4): Interactive Elevator Shaft */}
                <div className="lg:col-span-4 bg-[#020502] border-2 border-[#00ff41]/60 p-3 sm:p-4 space-y-3">
                  {/* Digital LED Elevator Display */}
                  <div className="bg-black border border-[#00ff41] p-2.5 text-center space-y-0.5 shadow-[inset_0_0_10px_rgba(0,255,65,0.3)]">
                    <div className="text-[9px] text-white/60 uppercase">THANG MÁY CAO TỐC ĐIỀU KHIỂN</div>
                    <div className="text-lg font-black text-[#00ff41] font-mono animate-pulse">
                      TẦNG {selectedGroupIdx + 1} / {currentGroups.length}
                    </div>
                    <div className="text-[10px] text-[#ffea00] font-bold truncate">
                      {activeGroup?.subCategory || 'SẢNH TẦNG CHÍNH'}
                    </div>
                  </div>

                  <div className="text-[11px] font-bold text-white uppercase flex items-center gap-1.5 pt-0.5">
                    <Layers className="w-3.5 h-3.5 text-[#ff00ff]" />
                    <span>CHỌN TẦNG KHÁM PHÁ:</span>
                  </div>

                  {/* List of Floors Buttons */}
                  <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                    {currentGroups.map((group, gIdx) => {
                      const isCurrentFloor = selectedGroupIdx === gIdx;

                      return (
                        <button
                          key={gIdx}
                          onClick={() => {
                            playSound.click(settings.retroSound);
                            setSelectedGroupIdx(gIdx);
                          }}
                          className={`w-full p-2 text-left text-xs border transition-all flex items-center justify-between cursor-pointer ${
                            isCurrentFloor
                              ? 'bg-[#00ff41] text-black border-white font-black shadow-[0_0_12px_#00ff41]'
                              : 'bg-black text-[#00ff41] border-[#00ff41]/40 hover:border-[#00ff41] hover:bg-[#0c140c]'
                          }`}
                        >
                          <div className="flex items-center gap-2 truncate">
                            <span className={`w-4 h-4 flex items-center justify-center text-[9px] font-mono border shrink-0 ${isCurrentFloor ? 'border-black bg-black text-[#00ff41]' : 'border-[#00ff41] bg-black'}`}>
                              {gIdx + 1}
                            </span>
                            <span className="truncate text-[11px]">{group.subCategory}</span>
                          </div>
                          <span className={`text-[9px] px-1 py-0.2 border shrink-0 ${isCurrentFloor ? 'border-black text-black font-bold' : 'border-[#00ff41]/40 text-[#ff00ff]'}`}>
                            {group.majors.length} Ngành
                          </span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Top Training Universities */}
                  <div className="pt-2 border-t border-[#00ff41]/30 space-y-1">
                    <div className="text-[9px] text-white/70 font-bold uppercase">TRƯỜNG ĐẠI HỌC TIÊU BIỂU:</div>
                    <div className="space-y-1">
                      {currentBuildingConfig.topSchools.map((school, sIdx) => (
                        <div key={sIdx} className="text-[10px] text-[#00ff41] bg-black p-1.5 border border-[#00ff41]/30 truncate">
                          • {school}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Right (lg:8): Detailed Floor Room & Majors List */}
                {activeGroup && (
                  <div className="lg:col-span-8 bg-[#020502] border-2 border-[#00ff41] p-4 sm:p-5 space-y-4 relative flex flex-col justify-between">
                    <div>
                      {/* Floor Header */}
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#00ff41]/30 pb-2.5">
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="bg-[#ff00ff] text-black font-black text-xs px-2 py-0.5 uppercase">
                              TẦNG {selectedGroupIdx + 1} // {activeGroup.subCategory.toUpperCase()}
                            </span>
                            <span className="text-[11px] text-[#00ff41] bg-black px-2 py-0.5 border border-[#00ff41]/50 font-mono">
                              {activeGroup.majors.length} NGÀNH ĐẠI HỌC
                            </span>
                          </div>
                          <h4 className="text-base sm:text-lg font-bold text-white uppercase mt-1">
                            {activeGroup.subCategory}
                          </h4>
                        </div>
                      </div>

                      {/* List of MOET Majors on this Floor */}
                      <div className="space-y-2 mt-3">
                        <div className="text-xs font-bold text-[#00ff41] uppercase flex items-center gap-1.5">
                          <BookOpen className="w-4 h-4 text-[#ff00ff]" />
                          <span>DANH SÁCH CÁC NGÀNH ĐÀO TẠO ĐẠI HỌC (BỘ GD&ĐT):</span>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1 max-h-56 overflow-y-auto pr-1">
                          {activeGroup.majors.map((major, mIdx) => (
                            <div 
                              key={mIdx}
                              className="bg-black p-2 border border-[#00ff41]/40 flex items-center justify-between text-xs text-white hover:border-[#00ff41] hover:bg-[#0c1a0c] transition-colors cursor-pointer group/major"
                              onClick={() => {
                                playSound.click(settings.retroSound);
                                setShowBuildingModal(false);
                                onSelectCareer(currentBuildingConfig.mappedCareerId);
                              }}
                            >
                              <div className="flex items-center gap-2 truncate">
                                <span className="text-[#00ff41] font-bold text-[10px] font-mono">#{mIdx + 1}</span>
                                <span className="font-bold group-hover/major:text-[#00ff41] truncate text-[11px]">{major}</span>
                              </div>
                              <span className="text-[9px] text-[#ff00ff] border border-[#ff00ff]/40 px-1 py-0.5 shrink-0 ml-1">
                                THỰC TẬP
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* Action Button: Jump into 8-week internship simulation track */}
                    <div className="pt-3 border-t border-[#00ff41]/30">
                      <button
                        onClick={() => {
                          playSound.pass(settings.retroSound);
                          setShowBuildingModal(false);
                          onSelectCareer(currentBuildingConfig.mappedCareerId);
                        }}
                        className="w-full py-3 bg-[#00ff41] text-[#0c0c0c] font-black text-xs sm:text-sm uppercase flex items-center justify-center gap-2 hover:bg-[#00e53a] transition-all border-2 border-white shadow-[0_0_20px_rgba(0,255,65,0.6)] cursor-pointer active:scale-[0.99]"
                      >
                        <Zap className="w-4 h-4 sm:w-5 sm:h-5 fill-current" />
                        <span>BẮT ĐẦU 8 TUẦN THỰC TẬP TẠI TÒA NHÀ NÀY</span>
                        <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
