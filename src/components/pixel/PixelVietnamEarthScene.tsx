import React, { useState, useEffect, useRef } from 'react';
import { 
  Globe, Compass, MapPin, Sparkles, Navigation, ShieldCheck, 
  Cpu, HeartPulse, Newspaper, FlaskConical, GraduationCap, 
  Layers, Sun, Moon, Zap, Flag, Radar, Eye, Anchor, Waves,
  Mountain, Wind, Trees, Landmark, Ship, Radio, CheckCircle2,
  ChevronRight, Volume2, Info, Crosshair, RefreshCw, CloudRain
} from 'lucide-react';
import { playSound } from '../../utils/audio';

interface Props {
  className?: string;
  enableSound?: boolean;
  compact?: boolean;
  onSelectRegion?: (regionId: string) => void;
}

type ViewMode = 'vietnam_map' | 'earth_globe' | 'scenic_skyline';
type MapLayer = 'all' | 'careers' | 'geography' | 'islands_sovereignty' | 'landmarks';
type MapArtStyle = 'pixel_retro' | 'cyber_vector';
type WeatherMode = 'sunny' | 'rain' | 'night';

interface CareerHub {
  id: string;
  name: string;
  shortName: string;
  role: string;
  icon: any;
  color: string;
  x: number;
  y: number;
  latLng: string;
  description: string;
  specialty: string;
  region: string;
  careers: string[];
  keyStats: string;
}

interface LandmarkPoint {
  id: string;
  name: string;
  type: 'heritage' | 'mountain' | 'island' | 'extremity' | 'dk1';
  x: number;
  y: number;
  description: string;
  tag: string;
}

// 5 GDPT 2026 Core Hubs matched to the redrawn S-curve geometry
const CAREER_HUBS: CareerHub[] = [
  {
    id: 'hanoi',
    name: 'Thủ Đô Hà Nội // Trung Tâm Sư Phạm & EdTech Core',
    shortName: 'HÀ NỘI',
    role: 'TRUNG TÂM GIÁO DỤC & SƯ PHẠM QUỐC GIA',
    icon: GraduationCap,
    color: '#3b82f6',
    x: 185,
    y: 135,
    latLng: '21.0285° N, 105.8542° E',
    region: 'Đồng Bằng Sông Hồng & Bắc Bộ',
    description: 'Trụ sở Bộ Giáo dục & Đào tạo, tổ hợp các trường Đại học Sư phạm trọng điểm và Hệ thống quản lý học tập EduCore phục vụ 500.000 học sinh.',
    specialty: 'Đổi mới Sư phạm GDPT 2018, Lập trình EdTech, Quản trị hệ thống đào tạo số',
    careers: ['education', 'edtech'],
    keyStats: '50+ Viện/Đại học // 1.2M Học sinh THPT'
  },
  {
    id: 'danang',
    name: 'Đà Nẵng & Miền Trung // Innovation & AI Semiconductor Hub',
    shortName: 'ĐÀ NẴNG',
    role: 'THUNG LŨNG ĐỔI MỚI SÁNG TẠO & VI MẠCH BÁN DẪN',
    icon: Cpu,
    color: '#00ff41',
    x: 270,
    y: 345,
    latLng: '16.0544° N, 108.2022° E',
    region: 'Duyên Hải Nam Trung Bộ & Tây Nguyên',
    description: 'Khu công nghệ cao Đà Nẵng, trung tâm ươm tạo vi mạch bán dẫn quốc gia, nghiên cứu trí tuệ nhân tạo và thành phố thông minh ven biển.',
    specialty: 'Trí tuệ nhân tạo (AI), Phân tích dữ liệu lớn, Thiết kế chip bán dẫn & EdTech Cloud',
    careers: ['edtech', 'science'],
    keyStats: '20+ Tech Hubs // Cửa ngõ Hành lang Kinh tế Đông - Tây'
  },
  {
    id: 'hochiminh',
    name: 'TP. Hồ Chí Minh // Y Tế Cấp Cứu, Báo Chí & Tài Chính Số',
    shortName: 'TP. HỒ CHÍ MINH',
    role: 'ĐẠI ĐÔ THỊ Y TẾ TUYẾN CUỐI & KINH TẾ SỐ',
    icon: HeartPulse,
    color: '#ef4444',
    x: 208,
    y: 510,
    latLng: '10.8231° N, 106.6297° E',
    region: 'Đông Nam Bộ',
    description: 'Trung tâm y tế chuyên sâu hàng đầu Đông Nam Á, tổ hợp Tòa soạn Báo chí - Truyền thông đa phương tiện lớn nhất và thị trường tài chính công nghệ.',
    specialty: 'Cấp cứu Triage đa khoa, Phóng sự điều tra & Fact-checking, Fintech & Logistics',
    careers: ['healthcare', 'humanities'],
    keyStats: '120+ Bệnh viện đa khoa & chuyên khoa // 15 triệu dân đô thị'
  },
  {
    id: 'mekong',
    name: 'Cần Thơ & ĐBSCL // Viện Sinh Học Nông Nghiệp & Dược Liệu Biển',
    shortName: 'CẦN THƠ - ĐBSCL',
    role: 'VIỆN NGHIÊN CỨU NÔNG SINH & DƯỢC THẢO',
    icon: FlaskConical,
    color: '#a855f7',
    x: 165,
    y: 540,
    latLng: '10.0452° N, 105.7469° E',
    region: 'Đồng Bằng Sông Cửu Long',
    description: 'Vựa lương thực quốc gia, trung tâm nghiên cứu gen giống cây thích ứng biến đổi khí hậu, sinh học biển và công nghệ chiết xuất dược liệu tự nhiên.',
    specialty: 'Hóa dược tự nhiên, Quang phổ phân tích, Nông nghiệp công nghệ cao, Môi trường sinh thái',
    careers: ['science', 'healthcare'],
    keyStats: 'Vựa lúa 50% sản lượng quốc gia // 9 cửa sông Cửu Long'
  },
  {
    id: 'islands',
    name: 'Quần Đảo Hoàng Sa & Trường Sa // Phên Dậu Biển Đảo Thiêng Liêng',
    shortName: 'HOÀNG SA & TRƯỜNG SA',
    role: 'HẢI ĐĂNG BẢO VỆ CHỦ QUYỀN BIỂN ĐẢO TỔ QUỐC',
    icon: Flag,
    color: '#facc15',
    x: 395,
    y: 340,
    latLng: '16.5000° N, 112.0000° E // 8.8500° N, 111.9000° E',
    region: 'Biển Đông Việt Nam',
    description: 'Vùng trời và thềm lục địa thiêng liêng của Tổ quốc với hệ thống trạm khí tượng thủy văn, ngọn hải đăng quốc tế, trạm radar viễn thông và nhà giàn DK1.',
    specialty: 'Hải dương học, Viễn thông vô tuyến vệ tinh, Khí tượng biển & Cứu hộ cứu nạn hàng hải',
    careers: ['science', 'humanities'],
    keyStats: 'Hơn 3.260 km bờ biển // 1 triệu km² vùng biển đặc quyền kinh tế'
  }
];

// National Extremities & Sacred Landmarks
const NATIONAL_LANDMARKS: LandmarkPoint[] = [
  { id: 'lung_cu', name: 'Cột Cờ Lũng Cú (Cực Bắc Tổ Quốc)', type: 'extremity', x: 185, y: 38, description: 'Điểm cực Bắc 23°23\'N tại Hà Giang với lá cờ Tổ quốc 54m² biểu trưng 54 dân tộc anh em.', tag: '23°23\'B - CỰC BẮC' },
  { id: 'fansipan', name: 'Đỉnh Fansipan (3.143m)', type: 'mountain', x: 118, y: 62, description: 'Nóc nhà Đông Dương trên dãy Hoàng Liên Sơn hùng vĩ phủ mây trắng.', tag: 'NÓC NHÀ ĐÔNG DƯƠNG' },
  { id: 'ha_long', name: 'Vịnh Hạ Long - Bái Tử Long', type: 'heritage', x: 258, y: 130, description: 'Di sản Thiên nhiên Thế giới UNESCO với hàng ngàn hòn đảo đá vôi kỳ vĩ giữa Vịnh Bắc Bộ.', tag: 'DI SẢN THẾ GIỚI' },
  { id: 'apa_chai', name: 'A Pa Chải (Cực Tây Tổ Quốc)', type: 'extremity', x: 54, y: 94, description: 'Cột mốc ngã ba biên giới Việt Nam - Lào - Trung Quốc tại xã Sìn Thầu, Điện Biên.', tag: '102°09\'Đ - CỰC TÂY' },
  { id: 'son_doong', name: 'Hang Sơn Đoòng (Quảng Bình)', type: 'heritage', x: 185, y: 278, description: 'Hang động tự nhiên kỳ vĩ lớn nhất hành tinh ẩn mình trong Vườn quốc gia Phong Nha - Kẻ Bàng.', tag: 'KỲ QUAN THẾ GIỚI' },
  { id: 'hue', name: 'Cố Đô Huế & Dòng Sông Hương', type: 'heritage', x: 238, y: 320, description: 'Quần thể di tích Cố đô triều Nguyễn, nhã nhạc cung đình và dòng sông Hương thơ mộng.', tag: 'CỐ ĐÔ LỊCH SỬ' },
  { id: 'mui_doi', name: 'Mũi Đôi - Mũi Điện (Cực Đông Đất Liền)', type: 'extremity', x: 322, y: 442, description: 'Tọa độ 109°28\'Đ tại bán đảo Hòn Gốm nơi đón ánh bình minh đầu tiên trên dải đất liền.', tag: '109°28\'Đ - CỰC ĐÔNG' },
  { id: 'da_lat', name: 'Cao Nguyên Lâm Viên - Đà Lạt', type: 'mountain', x: 248, y: 460, description: 'Vùng khí hậu ôn đới cao nguyên với rừng thông xanh bạt ngàn và công nghệ sinh học hoa màu.', tag: 'CAO NGUYÊN BAZAN' },
  { id: 'phu_quoc', name: 'Đảo Ngọc Phú Quốc (Kiên Giang)', type: 'island', x: 82, y: 528, description: 'Thành phố đảo lớn nhất Việt Nam giữa Vịnh Thái Lan với rạn san hô và sinh thái biển quý giá.', tag: 'ĐẢO NGỌC TÂY NAM' },
  { id: 'con_dao', name: 'Quần Đảo Côn Đảo (Bà Rịa - Vũng Tàu)', type: 'island', x: 235, y: 590, description: 'Di tích lịch sử cách mạng hào hùng và Vườn quốc gia Côn Đảo bảo tồn rùa biển.', tag: 'CÔN ĐẢO OAI HÙNG' },
  { id: 'mui_ca_mau', name: 'Mũi Cà Mau (Cực Nam Tổ Quốc)', type: 'extremity', x: 150, y: 595, description: 'Điểm cực Nam 8°37\'N nơi đất nở ra, rừng ngập mặn tiến ra biển biếc bồi đắp non sông.', tag: '8°37\'B - CỰC NAM' },
  { id: 'dk1_platform', name: 'Cụm Nhà Giàn DK1 Biển Đông', type: 'dk1', x: 320, y: 595, description: 'Những pháo đài thép kiên cường trên thềm lục địa phía Nam bảo vệ chủ quyền thềm lục địa.', tag: 'NHÀ GIÀN DK1' }
];

export const PixelVietnamEarthScene: React.FC<Props> = ({
  className = '',
  enableSound = true,
  compact = false,
  onSelectRegion
}) => {
  const [viewMode, setViewMode] = useState<ViewMode>('vietnam_map');
  const [mapArtStyle, setMapArtStyle] = useState<MapArtStyle>('pixel_retro');
  const [weatherMode, setWeatherMode] = useState<WeatherMode>('sunny');
  const [activeLayer, setActiveLayer] = useState<MapLayer>('all');
  const [rotationAngle, setRotationAngle] = useState<number>(0);
  const [activeHub, setActiveHub] = useState<CareerHub>(CAREER_HUBS[0]);
  const [selectedLandmark, setSelectedLandmark] = useState<LandmarkPoint | null>(null);
  const [radarPulse, setRadarPulse] = useState<number>(0);
  const [hoveredEntity, setHoveredEntity] = useState<string | null>(null);
  const [beaconBeamAngle, setBeaconBeamAngle] = useState<number>(0);
  const [waveOffset, setWaveOffset] = useState<number>(0);
  const [trainPosition, setTrainPosition] = useState<number>(0.2);
  const [isScanning, setIsScanning] = useState<boolean>(false);
  const [scanProgress, setScanProgress] = useState<number>(0);

  // Orbiting Space Satellites
  const [satellites, setSatellites] = useState([
    { id: 1, angle: 45, radius: 110, speed: 0.7, name: 'VINASAT-1' },
    { id: 2, angle: 170, radius: 126, speed: -0.5, name: 'VNREDSat-1' },
    { id: 3, angle: 290, radius: 98, speed: 1.0, name: 'CAREER-OS SAT' }
  ]);

  // Main animation timer
  useEffect(() => {
    const timer = setInterval(() => {
      setRotationAngle(prev => (prev + 0.5) % 360);
      setBeaconBeamAngle(prev => (prev + 2.8) % 360);
      setWaveOffset(prev => (prev + 0.6) % 40);
      setRadarPulse(prev => (prev + 1.2) % 100);
      
      // North-South Train loop: 0 = Hanoi, 1 = Saigon
      setTrainPosition(prev => (prev + 0.003) % 1);

      setSatellites(prev => prev.map(sat => ({
        ...sat,
        angle: (sat.angle + sat.speed) % 360
      })));
    }, 40);

    return () => clearInterval(timer);
  }, []);

  // Redraw / Re-scan Map action
  const handleRedrawMap = () => {
    if (enableSound) playSound.pass(true);
    setIsScanning(true);
    setScanProgress(0);

    let p = 0;
    const interval = setInterval(() => {
      p += 3;
      setScanProgress(p);
      if (p >= 100) {
        clearInterval(interval);
        setTimeout(() => setIsScanning(false), 300);
      }
    }, 30);
  };

  const handleSelectHub = (hub: CareerHub) => {
    if (enableSound) playSound.click(true);
    setActiveHub(hub);
    setSelectedLandmark(null);
    if (onSelectRegion) {
      onSelectRegion(hub.id);
    }
  };

  const handleSelectLandmark = (lm: LandmarkPoint) => {
    if (enableSound) playSound.click(true);
    setSelectedLandmark(lm);
  };

  // Interpolate North-South Railway Train coordinates based on trainPosition (0 -> 1)
  // Hanoi (185, 135) -> Vinh (195, 222) -> Hue (238, 320) -> Danang (270, 345) -> Quy Nhon (302, 412) -> Nha Trang (316, 458) -> Saigon (208, 510)
  const getTrainCoords = () => {
    const waypoints = [
      { x: 185, y: 135 }, // Hanoi
      { x: 195, y: 222 }, // Vinh
      { x: 214, y: 272 }, // Dong Hoi
      { x: 238, y: 320 }, // Hue
      { x: 270, y: 345 }, // Danang
      { x: 290, y: 390 }, // Quang Ngai
      { x: 302, y: 412 }, // Quy Nhon
      { x: 314, y: 430 }, // Tuy Hoa
      { x: 316, y: 458 }, // Nha Trang
      { x: 298, y: 488 }, // Phan Rang
      { x: 280, y: 502 }, // Phan Thiet
      { x: 208, y: 510 }, // Saigon
    ];
    const totalSegments = waypoints.length - 1;
    const scaledPos = trainPosition * totalSegments;
    const idx = Math.floor(scaledPos);
    const fraction = scaledPos - idx;
    const p1 = waypoints[idx] || waypoints[0];
    const p2 = waypoints[Math.min(idx + 1, totalSegments)] || waypoints[totalSegments];

    return {
      x: p1.x + (p2.x - p1.x) * fraction,
      y: p1.y + (p2.y - p1.y) * fraction
    };
  };

  const currentTrain = getTrainCoords();

  // Master Authentic Geographic S-Curve Path (ViewBox 0 0 500 620)
  const masterVietnamSPath = `
    M 185 38
    C 205 44 228 58 248 76
    C 268 92 278 100 282 104
    C 272 118 260 128 258 130
    C 248 138 242 142 245 140
    C 236 150 226 160 220 166
    C 214 174 210 178 210 180
    C 205 190 203 195 202 198
    C 198 210 196 218 195 222
    C 198 235 202 244 204 248
    C 208 260 212 268 214 272
    C 220 285 224 292 226 296
    C 232 308 238 316 242 320
    C 250 328 256 332 258 334
    C 264 340 268 343 270 345
    C 275 358 278 364 280 368
    C 285 380 288 386 290 390
    C 296 402 300 408 302 412
    C 308 422 312 426 314 430
    C 318 436 322 440 322 442
    C 320 450 318 455 316 458
    C 314 466 312 470 310 472
    C 304 482 300 486 298 488
    C 288 496 284 500 280 502
    C 270 510 266 512 262 514
    C 250 520 245 522 242 524
    C 236 528 232 529 230 530
    C 225 535 222 537 220 538
    C 215 544 212 546 210 548
    C 204 554 200 556 198 558
    C 190 564 187 566 185 568
    C 178 574 174 576 172 578
    C 165 584 162 586 160 588
    C 155 592 152 594 150 595
    C 146 594 144 593 142 592
    C 138 586 137 584 136 582
    C 134 572 133 568 132 564
    C 128 552 126 546 125 542
    C 120 532 118 528 116 524
    C 122 518 126 514 128 512
    C 136 506 142 504 144 502
    C 152 498 158 497 160 496
    C 168 492 174 491 176 490
    C 173 482 171 478 170 476
    C 176 468 180 464 182 462
    C 188 455 194 452 196 450
    C 202 444 206 441 208 440
    C 214 430 216 425 218 422
    C 222 410 225 404 226 400
    C 224 388 223 384 222 380
    C 230 368 232 364 234 360
    C 225 348 220 342 218 338
    C 206 322 200 316 196 310
    C 188 295 184 288 180 282
    C 172 265 168 258 166 252
    C 158 235 152 228 150 222
    C 145 205 142 198 140 192
    C 132 176 128 170 126 164
    C 108 148 98 142 94 138
    C 82 124 76 118 72 114
    C 60 102 56 96 54 94
    C 64 84 70 78 74 76
    C 86 72 94 70 98 68
    C 108 64 114 63 118 62
    C 128 58 134 56 138 54
    C 150 49 156 47 160 46
    C 172 41 180 39 185 38
    Z
  `;

  return (
    <div className={`relative bg-[#020703] border-2 border-[#00ff41] text-[#00ff41] font-mono overflow-hidden select-none pixelated shadow-[0_0_40px_rgba(0,255,65,0.25)] ${className}`}>
      
      {/* Top Header Control Toolbar */}
      <div className="bg-[#051107] border-b border-[#00ff41]/50 px-3 py-2 flex flex-wrap items-center justify-between gap-2 z-20 relative backdrop-blur-md">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-[#00ff41] animate-ping" />
          <span className="text-[11px] sm:text-xs font-black uppercase tracking-wider text-white flex items-center gap-1.5">
            <Compass className="w-4 h-4 text-[#00ff41]" />
            <span>BẢN ĐỒ CHỮ S VIỆT NAM // PIXEL ART GDPT 2026</span>
          </span>
        </div>

        {/* View Switcher & Action Tools */}
        <div className="flex flex-wrap items-center gap-1.5">
          {/* Redraw / Scan button */}
          <button
            type="button"
            onClick={handleRedrawMap}
            disabled={isScanning}
            className="px-2.5 py-1 text-[10px] font-black border border-[#facc15] bg-black text-[#facc15] hover:bg-[#facc15] hover:text-black transition-all cursor-pointer flex items-center gap-1 shadow-[0_0_8px_rgba(250,204,21,0.3)] disabled:opacity-50"
            title="Quét radar & Tái tạo đồ họa bản đồ từng bước"
          >
            <RefreshCw className={`w-3 h-3 ${isScanning ? 'animate-spin' : ''}`} />
            <span>{isScanning ? `ĐANG QUÉT ${scanProgress}%` : 'VẼ LẠI BẢN ĐỒ'}</span>
          </button>

          {/* Style Toggle: Retro 16-bit vs Cyber Vector */}
          <button
            type="button"
            onClick={() => {
              if (enableSound) playSound.click(true);
              setMapArtStyle(prev => prev === 'pixel_retro' ? 'cyber_vector' : 'pixel_retro');
            }}
            className={`px-2 py-1 text-[9.5px] font-bold border transition-all cursor-pointer flex items-center gap-1 ${
              mapArtStyle === 'pixel_retro'
                ? 'bg-[#00ff41] text-black border-white'
                : 'bg-black text-[#00ff41] border-[#00ff41]/40'
            }`}
          >
            <Sparkles className="w-3 h-3" />
            <span>{mapArtStyle === 'pixel_retro' ? '16-BIT PIXEL' : 'CYBER VECTOR'}</span>
          </button>

          {/* Weather / Time of Day */}
          <div className="flex items-center border border-[#00ff41]/40 bg-black">
            <button
              type="button"
              onClick={() => { if (enableSound) playSound.click(true); setWeatherMode('sunny'); }}
              className={`p-1 hover:bg-[#00ff41]/20 cursor-pointer ${weatherMode === 'sunny' ? 'text-[#facc15]' : 'text-slate-400'}`}
              title="Nắng vàng nhiệt đới"
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => { if (enableSound) playSound.click(true); setWeatherMode('rain'); }}
              className={`p-1 hover:bg-[#00ff41]/20 cursor-pointer ${weatherMode === 'rain' ? 'text-[#38bdf8]' : 'text-slate-400'}`}
              title="Mưa rào nhiệt đới"
            >
              <CloudRain className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={() => { if (enableSound) playSound.click(true); setWeatherMode('night'); }}
              className={`p-1 hover:bg-[#00ff41]/20 cursor-pointer ${weatherMode === 'night' ? 'text-[#a855f7]' : 'text-slate-400'}`}
              title="Đêm lung linh đèn neon"
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* View Mode Buttons */}
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() => {
                if (enableSound) playSound.click(true);
                setViewMode('vietnam_map');
              }}
              className={`px-2 py-1 text-[9.5px] font-black border transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'vietnam_map'
                  ? 'bg-[#00ff41] text-black border-white shadow-[0_0_12px_#00ff41]'
                  : 'bg-black text-[#00ff41] border-[#00ff41]/40 hover:border-[#00ff41]'
              }`}
            >
              <MapPin className="w-3 h-3" />
              <span>BẢN ĐỒ CHỮ S</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (enableSound) playSound.click(true);
                setViewMode('earth_globe');
              }}
              className={`px-2 py-1 text-[9.5px] font-black border transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'earth_globe'
                  ? 'bg-[#00ffff] text-black border-white shadow-[0_0_12px_#00ffff]'
                  : 'bg-black text-[#00ffff] border-[#00ffff]/40 hover:border-[#00ffff]'
              }`}
            >
              <Globe className="w-3 h-3" />
              <span>QUẢ ĐỊA CẦU</span>
            </button>

            <button
              type="button"
              onClick={() => {
                if (enableSound) playSound.click(true);
                setViewMode('scenic_skyline');
              }}
              className={`px-2 py-1 text-[9.5px] font-black border transition-all cursor-pointer flex items-center gap-1 ${
                viewMode === 'scenic_skyline'
                  ? 'bg-[#facc15] text-black border-white shadow-[0_0_12px_#facc15]'
                  : 'bg-black text-[#facc15] border-[#facc15]/40 hover:border-[#facc15]'
              }`}
            >
              <Landmark className="w-3 h-3" />
              <span>PANORAMA</span>
            </button>
          </div>
        </div>
      </div>

      {/* Layer Filter Chips (for vietnam_map mode) */}
      {viewMode === 'vietnam_map' && (
        <div className="bg-[#020b04] border-b border-[#00ff41]/30 px-3 py-1.5 flex flex-wrap items-center justify-between gap-1.5 text-[9px] z-10 relative">
          <div className="flex items-center gap-1">
            <span className="text-white/70 uppercase font-bold mr-1 flex items-center gap-1">
              <Layers className="w-3 h-3 text-[#00ff41]" />
              <span>LỚP BẢN ĐỒ:</span>
            </span>

            {[
              { id: 'all', label: 'TẤT CẢ LỚP' },
              { id: 'careers', label: '5 HUBS GDPT' },
              { id: 'geography', label: 'ĐỊA HÌNH & SÔNG NGÒI' },
              { id: 'islands_sovereignty', label: 'HOÀNG SA & TRƯỜNG SA' },
              { id: 'landmarks', label: '4 ĐIỂM CỰC & DI SẢN' }
            ].map(layer => (
              <button
                key={layer.id}
                type="button"
                onClick={() => {
                  if (enableSound) playSound.click(true);
                  setActiveLayer(layer.id as MapLayer);
                }}
                className={`px-2 py-0.5 border transition-all cursor-pointer ${
                  activeLayer === layer.id
                    ? 'bg-[#00ff41] text-black border-white font-bold'
                    : 'bg-black/60 text-[#00ff41]/70 border-[#00ff41]/30 hover:border-[#00ff41]'
                }`}
              >
                {layer.label}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2 font-mono text-[9px] text-[#facc15]">
            <span>TỌA ĐỘ: 102°09'Đ - 109°28'Đ // 8°37'B - 23°23'B</span>
          </div>
        </div>
      )}

      {/* Main Content Area */}
      <div className="relative min-h-[520px] max-h-[580px] overflow-hidden flex flex-col justify-center">
        
        {/* CRT Scanline & Pixel Grid Overlay */}
        <div className="absolute inset-0 pointer-events-none z-10 opacity-20 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.4)_50%)] bg-[length:100%_4px]" />
        
        {/* Night mode darkness overlay */}
        {weatherMode === 'night' && (
          <div className="absolute inset-0 pointer-events-none z-[5] bg-[#020b18]/70 mix-blend-multiply transition-colors duration-700" />
        )}

        {/* Rain particles overlay */}
        {weatherMode === 'rain' && (
          <div className="absolute inset-0 pointer-events-none z-[8] overflow-hidden">
            {[...Array(24)].map((_, i) => (
              <div
                key={i}
                className="absolute w-[1.5px] h-5 bg-[#38bdf8] opacity-70 animate-pulse"
                style={{
                  left: `${(i * 4.2 + (i % 3) * 2)}%`,
                  top: `${((waveOffset * 15 + i * 28) % 520)}px`,
                  transform: 'rotate(15deg)'
                }}
              />
            ))}
          </div>
        )}

        {/* Radar / Laser Scan Sweep Animation */}
        {isScanning && (
          <div 
            className="absolute left-0 right-0 h-1 bg-[#00ffff] shadow-[0_0_15px_#00ffff,0_0_30px_#00ff41] z-30 pointer-events-none transition-all duration-75"
            style={{ top: `${scanProgress}%` }}
          >
            <div className="absolute right-4 -top-4 text-[9px] font-black text-[#00ffff] bg-black/90 px-1 border border-[#00ffff]">
              QUÉT QUỐC GIA // {Math.round(scanProgress)}%
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 1: MASTER GEOGRAPHIC S-SHAPED VIETNAM PIXEL MAP */}
        {/* ========================================================================= */}
        {viewMode === 'vietnam_map' && (
          <div className="w-full h-full flex flex-col md:flex-row items-center justify-between p-2 sm:p-4 gap-4">
            
            {/* SVG Interactive Canvas */}
            <div className="relative w-full max-w-[490px] h-[520px] flex items-center justify-center shrink-0">
              
              <svg 
                viewBox="0 0 500 620" 
                className="w-full h-full filter drop-shadow-[0_0_15px_rgba(0,255,65,0.4)] select-none"
              >
                <defs>
                  {/* Landmass Shading & Topographic Gradients */}
                  <linearGradient id="vietnamMainGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#047857" />
                    <stop offset="25%" stopColor="#059669" />
                    <stop offset="55%" stopColor="#10b981" />
                    <stop offset="80%" stopColor="#059669" />
                    <stop offset="100%" stopColor="#047857" />
                  </linearGradient>

                  <linearGradient id="highlandsGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#b45309" />
                    <stop offset="50%" stopColor="#92400e" />
                    <stop offset="100%" stopColor="#78350f" />
                  </linearGradient>

                  <linearGradient id="riverGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#38bdf8" />
                    <stop offset="50%" stopColor="#0ea5e9" />
                    <stop offset="100%" stopColor="#0284c7" />
                  </linearGradient>

                  <linearGradient id="coastalGlow" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#00ff41" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#00ffff" stopOpacity="0.1" />
                  </linearGradient>

                  {/* Ocean Wave Pattern */}
                  <pattern id="seaWaves" width="24" height="24" patternUnits="userSpaceOnUse">
                    <path d="M 0 12 Q 6 6 12 12 T 24 12" fill="none" stroke="#003816" strokeWidth="0.8" opacity="0.6" />
                    <circle cx="18" cy="18" r="0.5" fill="#00ff41" opacity="0.3" />
                  </pattern>

                  {/* Lighthouse Rotating Beam Filter */}
                  <radialGradient id="lightBeam" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#fef08a" stopOpacity="0.95" />
                    <stop offset="40%" stopColor="#facc15" stopOpacity="0.5" />
                    <stop offset="80%" stopColor="#eab308" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                  </radialGradient>
                </defs>

                {/* Ocean Background Texture */}
                <rect x="0" y="0" width="500" height="620" fill="#02140a" />
                <rect x="0" y="0" width="500" height="620" fill="url(#seaWaves)" />

                {/* Maritime Grid Coordinates (Longitudes & Latitudes) */}
                <g stroke="#003816" strokeWidth="0.5" strokeDasharray="3 3">
                  {/* Latitudes */}
                  <line x1="10" y1="38" x2="490" y2="38" />
                  <text x="15" y="34" fill="#00aa44" fontSize="7" fontFamily="monospace">23°23'B (LŨNG CÚ)</text>
                  
                  <line x1="10" y1="135" x2="490" y2="135" />
                  <text x="15" y="131" fill="#00aa44" fontSize="6.5" fontFamily="monospace">21°00'B (HÀ NỘI)</text>
                  
                  <line x1="10" y1="345" x2="490" y2="345" />
                  <text x="15" y="341" fill="#00aa44" fontSize="6.5" fontFamily="monospace">16°00'B (ĐÀ NẴNG - HOÀNG SA)</text>
                  
                  <line x1="10" y1="442" x2="490" y2="442" />
                  <text x="15" y="438" fill="#00aa44" fontSize="6.5" fontFamily="monospace">12°30'B (MŨI ĐÔI - CỰC ĐÔNG)</text>

                  <line x1="10" y1="510" x2="490" y2="510" />
                  <text x="15" y="506" fill="#00aa44" fontSize="6.5" fontFamily="monospace">10°45'B (TP. HỒ CHÍ MINH)</text>

                  <line x1="10" y1="595" x2="490" y2="595" />
                  <text x="15" y="608" fill="#00aa44" fontSize="7" fontFamily="monospace">8°37'B (MŨI CÀ MAU)</text>

                  {/* Longitudes */}
                  <line x1="54" y1="10" x2="54" y2="610" />
                  <text x="58" y="22" fill="#00aa44" fontSize="6.5" fontFamily="monospace">102°09'Đ (A PA CHẢI)</text>
                  
                  <line x1="322" y1="10" x2="322" y2="610" />
                  <text x="326" y="22" fill="#00aa44" fontSize="6.5" fontFamily="monospace">109°28'Đ (MŨI ĐÔI)</text>

                  <line x1="395" y1="10" x2="395" y2="610" />
                  <text x="398" y="22" fill="#00aa44" fontSize="6.5" fontFamily="monospace">112°00'Đ (HOÀNG SA)</text>
                </g>

                {/* Major Sea Labels */}
                <text x="330" y="560" fill="#00ff41" fontSize="9" fontWeight="bold" fontFamily="monospace">BIỂN ĐÔNG VIỆT NAM (112°E)</text>
                <text x="15" y="540" fill="#00aa44" fontSize="7.5" fontFamily="monospace">VỊNH THÁI LAN (104°E)</text>
                <text x="290" y="160" fill="#00aa44" fontSize="8" fontFamily="monospace">VỊNH BẮC BỘ</text>

                {/* Neighboring Landmass Silhouettes (Lào, Campuchia, Trung Quốc) */}
                <g fill="#021f0b" stroke="#00441b" strokeWidth="0.8" strokeDasharray="2 2" opacity="0.6">
                  {/* China (North) */}
                  <path d="M 20 10 L 480 10 L 480 75 L 282 104 L 248 76 L 228 58 L 185 38 L 138 54 L 98 68 L 54 94 L 20 70 Z" />
                  <text x="130" y="24" fill="#00aa44" fontSize="8" fontWeight="bold" fontFamily="monospace" opacity="0.6">TRUNG QUỐC (CHINA)</text>

                  {/* Laos (West) */}
                  <path d="M 20 70 L 54 94 L 72 114 L 94 138 L 126 164 L 140 192 L 150 222 L 166 252 L 180 282 L 196 310 L 218 338 L 234 360 L 222 380 L 160 380 L 110 320 L 60 250 L 20 180 Z" />
                  <text x="70" y="210" fill="#00aa44" fontSize="8" fontWeight="bold" fontFamily="monospace" opacity="0.6">LÀO (LAOS)</text>

                  {/* Cambodia (Southwest) */}
                  <path d="M 160 380 L 222 380 L 226 400 L 218 422 L 208 440 L 196 450 L 182 462 L 170 476 L 176 490 L 160 496 L 144 502 L 128 512 L 116 524 L 50 520 L 40 440 L 90 380 Z" />
                  <text x="75" y="430" fill="#00aa44" fontSize="8" fontWeight="bold" fontFamily="monospace" opacity="0.6">CAMPUCHIA (CAMBODIA)</text>
                </g>

                {/* Animated Waves Rippling in East Sea */}
                <g opacity="0.7">
                  <path 
                    d={`M 310 ${220 + Math.sin(waveOffset * 0.2) * 3} Q 345 ${215 - Math.cos(waveOffset * 0.2) * 3} 380 220 T 430 220`} 
                    fill="none" 
                    stroke="#00ffff" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                  />
                  <path 
                    d={`M 320 ${410 + Math.cos(waveOffset * 0.2) * 3} Q 360 ${415 + Math.sin(waveOffset * 0.2) * 3} 400 410 T 450 410`} 
                    fill="none" 
                    stroke="#00ffff" 
                    strokeWidth="1" 
                    strokeDasharray="4 4" 
                  />
                  <path 
                    d={`M 260 ${540 + Math.sin(waveOffset * 0.2) * 2} Q 300 ${535 - Math.cos(waveOffset * 0.2) * 2} 340 540 T 390 540`} 
                    fill="none" 
                    stroke="#00ffff" 
                    strokeWidth="0.8" 
                    strokeDasharray="3 3" 
                  />
                </g>

                {/* Animated Fishing Boats & Coast Guard Ships */}
                <g 
                  transform={`translate(${310 + Math.sin(waveOffset * 0.15) * 8}, ${250 + Math.cos(waveOffset * 0.15) * 4})`}
                  className="cursor-pointer"
                >
                  {/* Fishing Boat Hull */}
                  <polygon points="0,0 16,0 12,5 4,5" fill="#f59e0b" stroke="#000" strokeWidth="0.5" />
                  <rect x="6" y="-6" width="4" height="6" fill="#3b82f6" />
                  <line x1="8" y1="-9" x2="8" y2="-6" stroke="#fff" strokeWidth="0.8" />
                  <polygon points="8,-9 13,-7 8,-5" fill="#ef4444" />
                  <text x="-4" y="11" fill="#facc15" fontSize="5" fontFamily="monospace">TÀU CÁ NGƯ DÂN</text>
                </g>

                <g 
                  transform={`translate(${335 + Math.cos(waveOffset * 0.12) * 10}, ${445 + Math.sin(waveOffset * 0.12) * 5})`}
                  className="cursor-pointer"
                >
                  {/* Coast Guard Patrol Ship */}
                  <polygon points="0,0 24,0 20,7 2,7" fill="#ffffff" stroke="#1e3a8a" strokeWidth="0.8" />
                  <rect x="6" y="-8" width="8" height="8" fill="#1e3a8a" />
                  <line x1="14" y1="-12" x2="14" y2="-8" stroke="#ffffff" strokeWidth="0.8" />
                  <polygon points="14,-12 20,-10 14,-8" fill="#ef4444" />
                  <text x="-8" y="13" fill="#ffffff" fontSize="5.5" fontWeight="bold" fontFamily="monospace">CẢNH SÁT BIỂN VN</text>
                </g>

                {/* ========================================================================= */}
                {/* 1. AUTHENTIC GEOGRAPHIC S-SHAPED VIETNAM MAINLAND */}
                {/* ========================================================================= */}
                
                {/* Outer Coastal Glow Effect */}
                <path 
                  d={masterVietnamSPath} 
                  fill="none" 
                  stroke="#00ffff" 
                  strokeWidth={mapArtStyle === 'pixel_retro' ? '6' : '4'} 
                  opacity="0.25" 
                />

                {/* 16-Bit Pixel Stepped Border (for Retro Overworld look) */}
                {mapArtStyle === 'pixel_retro' && (
                  <path 
                    d={masterVietnamSPath} 
                    fill="none" 
                    stroke="#00ff41" 
                    strokeWidth="3.5" 
                    strokeDasharray="4 2" 
                    className="opacity-90"
                  />
                )}

                {/* Master Authentic Vietnam S-Polygon Body */}
                <g fill="url(#vietnamMainGradient)" stroke="#00ff41" strokeWidth={mapArtStyle === 'pixel_retro' ? '2' : '1.6'}>
                  <path d={masterVietnamSPath} fillRule="evenodd" />
                </g>

                {/* 2. Topographical Mountain Layer (Tây Bắc & Dãy Trường Sơn & Tây Nguyên) */}
                {(activeLayer === 'all' || activeLayer === 'geography') && (
                  <g fill="url(#highlandsGradient)" stroke="#047857" strokeWidth="0.8" opacity="0.85">
                    {/* Northwest Mountains (Hoàng Liên Sơn, Điện Biên, Lai Châu, Sơn La) */}
                    <polygon points="75,85 118,62 145,75 135,120 100,135 68,105" />
                    {/* Truong Son North Ridge (Nghệ An, Hà Tĩnh, Quảng Bình, Quảng Trị) */}
                    <polygon points="155,210 175,235 190,285 170,275 145,225" />
                    {/* Tay Nguyen Plateau (Kon Tum, Gia Lai, Đắk Lắk, Lâm Đồng) */}
                    <polygon points="218,385 245,395 260,435 245,470 210,450 205,420" />
                    
                    {/* Mountain Peak Sprites */}
                    <g fill="#fef08a" stroke="#d97706" strokeWidth="0.5">
                      {/* Fanxipan */}
                      <polygon points="118,58 122,66 114,66" />
                      {/* Ngoc Linh Peak (Kon Tum) */}
                      <polygon points="230,375 234,382 226,382" />
                      {/* Langbiang Peak (Đà Lạt) */}
                      <polygon points="248,460 252,467 244,467" />
                    </g>
                  </g>
                )}

                {/* 3. Major Rivers Network (Sông Hồng, Sông Hương, Sông Sài Gòn, Sông Tiền, Sông Hậu) */}
                {(activeLayer === 'all' || activeLayer === 'geography') && (
                  <g fill="none" stroke="url(#riverGradient)" strokeWidth="1.6" strokeLinecap="round">
                    {/* Red River (Sông Hồng uốn lượn từ Tây Bắc qua Hà Nội ra Vịnh Bắc Bộ) */}
                    <path d="M 135 54 Q 165 95 185 135 T 210 160 T 232 152" />
                    {/* Sông Đà */}
                    <path d="M 95 95 Q 135 125 165 130" strokeWidth="1.2" />
                    {/* Sông Hương (Huế) */}
                    <path d="M 225 315 Q 235 318 242 320" strokeWidth="1.4" stroke="#38bdf8" />
                    {/* Sông Sài Gòn & Đồng Nai */}
                    <path d="M 188 475 Q 198 495 208 510 T 230 530" strokeWidth="1.4" />
                    {/* Mekong Delta 9 Tributaries (Sông Tiền & Sông Hậu - 9 Cửa Rồng) */}
                    <path d="M 144 502 Q 170 525 210 548" strokeWidth="1.8" />
                    <path d="M 134 515 Q 165 540 185 568" strokeWidth="1.6" />
                    <path d="M 142 535 Q 160 560 160 585" strokeWidth="1.2" />
                  </g>
                )}

                {/* 4. North-South Railway Line (Đường sắt Thống Nhất) & Moving Train */}
                <g opacity="0.8">
                  {/* Railway track line */}
                  <path 
                    d="M 185 135 L 195 222 L 214 272 L 238 320 L 270 345 L 290 390 L 302 412 L 314 430 L 316 458 L 298 488 L 280 502 L 208 510" 
                    fill="none" 
                    stroke="#ffffff" 
                    strokeWidth="0.8" 
                    strokeDasharray="2 2" 
                    opacity="0.6"
                  />

                  {/* Moving Mini Pixel Train */}
                  <g transform={`translate(${currentTrain.x}, ${currentTrain.y})`}>
                    <rect x="-3" y="-2" width="6" height="4" fill="#facc15" stroke="#000" strokeWidth="0.5" />
                    <circle cx="0" cy="-3" r="1.5" fill="#ef4444" className="animate-ping" />
                    <text x="5" y="1" fill="#facc15" fontSize="4" fontFamily="monospace">TÀU SE</text>
                  </g>
                </g>

                {/* 5. Sacred Islands & Archipelagos (Hoàng Sa, Trường Sa, Phú Quốc, Côn Đảo, Cát Bà) */}
                <g className="transition-all">
                  
                  {/* QUẦN ĐẢO HOÀNG SA (TP. Đà Nẵng) */}
                  <g 
                    className="cursor-pointer group"
                    onClick={() => handleSelectHub(CAREER_HUBS[4])}
                    onMouseEnter={() => setHoveredEntity('hoang_sa')}
                    onMouseLeave={() => setHoveredEntity(null)}
                  >
                    {/* Archipelago Boundary Box */}
                    <rect x="360" y="270" width="90" height="75" fill="#00ff41" fillOpacity="0.06" stroke="#facc15" strokeWidth="0.8" strokeDasharray="3 3" />
                    
                    {/* Islets: Đảo Hoàng Sa, Đảo Cây, Phú Lâm, Tri Tôn */}
                    <circle cx="380" cy="285" r="3.5" fill="#facc15" stroke="#000" strokeWidth="0.5" className="animate-pulse" />
                    <circle cx="400" cy="280" r="3" fill="#facc15" stroke="#000" strokeWidth="0.5" />
                    <circle cx="420" cy="295" r="4" fill="#facc15" stroke="#000" strokeWidth="0.5" />
                    <circle cx="390" cy="315" r="3" fill="#facc15" stroke="#000" strokeWidth="0.5" />
                    <circle cx="430" cy="320" r="3.2" fill="#facc15" stroke="#000" strokeWidth="0.5" />
                    
                    {/* Lighthouse Light Beam at Hoang Sa */}
                    <circle 
                      cx="395" 
                      cy="295" 
                      r="20" 
                      fill="none" 
                      stroke="#facc15" 
                      strokeWidth="1" 
                      className="animate-ping opacity-60" 
                    />

                    {/* Label Tag */}
                    <rect x="365" y="330" width="82" height="13" fill="#000" stroke="#facc15" strokeWidth="0.8" />
                    <text x="369" y="340" fill="#facc15" fontSize="7.5" fontWeight="black" fontFamily="monospace">
                      Q.Đ HOÀNG SA (VN)
                    </text>
                  </g>

                  {/* QUẦN ĐẢO TRƯỜNG SA (Tỉnh Khánh Hòa) */}
                  <g 
                    className="cursor-pointer group"
                    onClick={() => handleSelectHub(CAREER_HUBS[4])}
                    onMouseEnter={() => setHoveredEntity('truong_sa')}
                    onMouseLeave={() => setHoveredEntity(null)}
                  >
                    {/* Archipelago Boundary Box */}
                    <rect x="365" y="415" width="115" height="120" fill="#00ff41" fillOpacity="0.06" stroke="#facc15" strokeWidth="0.8" strokeDasharray="3 3" />
                    
                    {/* Islets: Song Tử Tây, Nam Yết, Sinh Tồn, Trường Sa Lớn, Phan Vinh, Đá Tây */}
                    <circle cx="390" cy="430" r="3" fill="#facc15" stroke="#000" strokeWidth="0.5" />
                    <circle cx="420" cy="440" r="3.5" fill="#facc15" stroke="#000" strokeWidth="0.5" />
                    <circle cx="445" cy="455" r="3" fill="#facc15" stroke="#000" strokeWidth="0.5" />
                    <circle cx="395" cy="485" r="4.5" fill="#ef4444" stroke="#facc15" strokeWidth="1" className="animate-pulse" />
                    <circle cx="435" cy="495" r="3.2" fill="#facc15" stroke="#000" strokeWidth="0.5" />
                    <circle cx="415" cy="520" r="3.5" fill="#facc15" stroke="#000" strokeWidth="0.5" />

                    {/* National Flag on Truong Sa Lon */}
                    <g transform="translate(395, 472)">
                      <line x1="0" y1="0" x2="0" y2="16" stroke="#ffffff" strokeWidth="1.2" />
                      <rect x="0" y="0" width="14" height="9" fill="#dc2626" />
                      <polygon points="7,2 8,4.5 10.5,4.5 8.5,6 9.2,8.5 7,7 4.8,8.5 5.5,6 3.5,4.5 6,4.5" fill="#facc15" />
                    </g>

                    {/* Sweeping Lighthouse Light Radar from Truong Sa */}
                    <path
                      d={`M 395 485 L ${395 + Math.cos((beaconBeamAngle * Math.PI) / 180) * 45} ${485 + Math.sin((beaconBeamAngle * Math.PI) / 180) * 45} A 45 45 0 0 1 ${395 + Math.cos(((beaconBeamAngle + 40) * Math.PI) / 180) * 45} ${485 + Math.sin(((beaconBeamAngle + 40) * Math.PI) / 180) * 45} Z`}
                      fill="url(#lightBeam)"
                      opacity="0.75"
                    />

                    {/* Label Tag */}
                    <rect x="372" y="522" width="96" height="13" fill="#000" stroke="#facc15" strokeWidth="0.8" />
                    <text x="376" y="532" fill="#facc15" fontSize="7.5" fontWeight="black" fontFamily="monospace">
                      Q.Đ TRƯỜNG SA (VN)
                    </text>
                  </g>

                  {/* NHÀ GIÀN DK1 TRÊN THỀM LỤC ĐỊA PHÍA NAM */}
                  <g 
                    className="cursor-pointer"
                    onClick={() => handleSelectLandmark(NATIONAL_LANDMARKS[11])}
                    onMouseEnter={() => setHoveredEntity('dk1')}
                    onMouseLeave={() => setHoveredEntity(null)}
                  >
                    <rect x="315" y="588" width="14" height="12" fill="#1e3a8a" stroke="#00ffff" strokeWidth="0.8" />
                    <line x1="322" y1="582" x2="322" y2="588" stroke="#facc15" strokeWidth="1.2" />
                    <circle cx="322" cy="582" r="2" fill="#ef4444" className="animate-ping" />
                    <text x="300" y="610" fill="#00ffff" fontSize="6.5" fontWeight="bold" fontFamily="monospace">NHÀ GIÀN DK1</text>
                  </g>

                  {/* ĐẢO PHÚ QUỐC (Kiên Giang) */}
                  <g 
                    className="cursor-pointer"
                    onClick={() => handleSelectLandmark(NATIONAL_LANDMARKS[8])}
                    onMouseEnter={() => setHoveredEntity('phu_quoc')}
                    onMouseLeave={() => setHoveredEntity(null)}
                  >
                    <polygon points="78,518 88,522 86,540 76,545 74,530" fill="#059669" stroke="#00ff41" strokeWidth="1" />
                    <text x="62" y="555" fill="#00ff41" fontSize="6.5" fontWeight="bold" fontFamily="monospace">ĐẢO PHÚ QUỐC</text>
                  </g>

                  {/* QUẦN ĐẢO CÔN ĐẢO */}
                  <g 
                    className="cursor-pointer"
                    onClick={() => handleSelectLandmark(NATIONAL_LANDMARKS[9])}
                  >
                    <ellipse cx="235" cy="590" rx="6" ry="4" fill="#059669" stroke="#00ff41" strokeWidth="0.8" />
                    <text x="218" y="605" fill="#00ff41" fontSize="6" fontFamily="monospace">CÔN ĐẢO</text>
                  </g>

                  {/* ĐẢO CÁT BÀ & BẠCH LONG VĨ */}
                  <g>
                    <circle cx="250" cy="142" r="3.5" fill="#059669" stroke="#00ff41" strokeWidth="0.8" />
                    <circle cx="280" cy="165" r="3" fill="#059669" stroke="#00ff41" strokeWidth="0.8" />
                    <text x="265" y="160" fill="#00ff41" fontSize="5.5" fontFamily="monospace">BẠCH LONG VĨ</text>
                  </g>
                </g>

                {/* 6. NATIONAL LANDMARKS & 4 EXTREMITIES PINS */}
                {(activeLayer === 'all' || activeLayer === 'geography' || activeLayer === 'landmarks') && (
                  <g>
                    {NATIONAL_LANDMARKS.map(lm => {
                      const isSelected = selectedLandmark?.id === lm.id;
                      return (
                        <g 
                          key={lm.id} 
                          className="cursor-pointer"
                          onClick={() => handleSelectLandmark(lm)}
                        >
                          {/* Extremity Pin */}
                          {lm.type === 'extremity' && (
                            <g transform={`translate(${lm.x}, ${lm.y})`}>
                              <circle cx="0" cy="0" r={isSelected ? 6.5 : 4.5} fill="#ef4444" stroke="#ffffff" strokeWidth="1.2" className="animate-pulse" />
                              <text x="7" y="3" fill="#ffea00" fontSize="6.5" fontWeight="bold" fontFamily="monospace">{lm.tag}</text>
                            </g>
                          )}

                          {/* Heritage Landmark Pin */}
                          {lm.type === 'heritage' && (
                            <g transform={`translate(${lm.x}, ${lm.y})`}>
                              <rect x="-3" y="-3" width="6" height="6" fill="#8b5cf6" stroke="#ffffff" strokeWidth="0.8" />
                            </g>
                          )}

                          {/* Mountain Pin */}
                          {lm.type === 'mountain' && (
                            <g transform={`translate(${lm.x}, ${lm.y})`}>
                              <polygon points="0,-4 4,3 -4,3" fill="#f59e0b" stroke="#ffffff" strokeWidth="0.8" />
                            </g>
                          )}
                        </g>
                      );
                    })}
                  </g>
                )}

                {/* 7. GOLDEN CAPITAL STAR AT HANOI */}
                <g transform="translate(185, 135)">
                  <polygon 
                    points="0,-8 2.5,-2.5 8,-2.5 3.5,1 5.5,7 0,3.5 -5.5,7 -3.5,1 -8,-2.5 -2.5,-2.5" 
                    fill="#fbbf24" 
                    stroke="#b45309" 
                    strokeWidth="0.8" 
                    className="animate-pulse" 
                  />
                </g>

                {/* 8. 5 INTERACTIVE CAREER HUB BEACONS */}
                {(activeLayer === 'all' || activeLayer === 'careers') && (
                  <g>
                    {CAREER_HUBS.map(hub => {
                      const isSelected = activeHub.id === hub.id;
                      const isHovered = hoveredEntity === hub.id;

                      return (
                        <g 
                          key={hub.id} 
                          className="cursor-pointer"
                          onClick={() => handleSelectHub(hub)}
                          onMouseEnter={() => setHoveredEntity(hub.id)}
                          onMouseLeave={() => setHoveredEntity(null)}
                        >
                          {/* Outer Pulsing Aura Ring */}
                          <circle 
                            cx={hub.x} 
                            cy={hub.y} 
                            r={isSelected ? 18 : 11} 
                            fill="none" 
                            stroke={hub.color} 
                            strokeWidth={isSelected ? 2 : 1}
                            className="animate-ping opacity-60"
                          />

                          {/* Central Square Beacon Marker */}
                          <rect 
                            x={hub.x - (isSelected ? 7 : 5)} 
                            y={hub.y - (isSelected ? 7 : 5)} 
                            width={isSelected ? 14 : 10} 
                            height={isSelected ? 14 : 10} 
                            fill="#000000" 
                            stroke={hub.color} 
                            strokeWidth={isSelected ? 2.5 : 1.5}
                            className={isSelected ? 'animate-bounce' : ''}
                          />

                          {/* Inner Core Light */}
                          <circle 
                            cx={hub.x} 
                            cy={hub.y} 
                            r={isSelected ? 3.5 : 2.5} 
                            fill={hub.color} 
                          />

                          {/* Region Name Tag Pill */}
                          <g transform={`translate(${hub.x + 10}, ${hub.y - 8})`}>
                            <rect 
                              x="0" 
                              y="0" 
                              width={hub.shortName.length * 6.5 + 10} 
                              height="14" 
                              fill="#000000" 
                              stroke={isSelected ? '#ffffff' : hub.color} 
                              strokeWidth={isSelected ? 1.5 : 0.8}
                              opacity="0.95"
                            />
                            <text 
                              x="5" 
                              y="10" 
                              fill={isSelected ? '#ffffff' : hub.color} 
                              fontSize="8" 
                              fontWeight="black" 
                              fontFamily="monospace"
                            >
                              {hub.shortName}
                            </text>
                          </g>
                        </g>
                      );
                    })}
                  </g>
                )}
              </svg>
            </div>

            {/* Right Side Rich Info Box for Selected Hub or Landmark */}
            <div className="w-full md:w-[290px] bg-black/95 border-2 border-[#00ff41] p-3 sm:p-4 space-y-2.5 backdrop-blur-md shadow-[0_0_25px_rgba(0,255,65,0.35)] shrink-0 overflow-y-auto max-h-[500px]">
              
              {selectedLandmark ? (
                /* Landmark Detail Card */
                <div className="space-y-2">
                  <div className="flex items-center justify-between border-b border-[#00ff41]/40 pb-2">
                    <div className="flex items-center gap-1.5 text-[#ffea00] font-bold text-[10px]">
                      <Landmark className="w-4 h-4" />
                      <span>DANH THẮNG & ĐIỂM CỰC</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setSelectedLandmark(null)}
                      className="text-[9px] text-[#00ff41] border border-[#00ff41]/40 px-1.5 py-0.5 hover:bg-[#00ff41] hover:text-black cursor-pointer"
                    >
                      ĐÓNG
                    </button>
                  </div>

                  <div>
                    <span className="text-[9px] bg-[#ef4444] text-white px-1.5 py-0.5 font-bold uppercase">
                      {selectedLandmark.tag}
                    </span>
                    <h3 className="text-xs sm:text-sm font-black text-white uppercase mt-1">
                      {selectedLandmark.name}
                    </h3>
                  </div>

                  <p className="text-[11px] text-slate-200 leading-relaxed font-sans">
                    {selectedLandmark.description}
                  </p>

                  <div className="p-2 bg-[#051105] border border-[#00ff41]/40 text-[10px] space-y-1">
                    <span className="text-[#00ff41] font-bold block uppercase">
                      🗺️ Ý Nghĩa Địa Lý & GDPT:
                    </span>
                    <span className="text-white/90 block">
                      Tọa độ ranh giới thiêng liêng, biểu tượng lòng tự hào dân tộc và bài học địa lý thực nghiệm cho học sinh THPT 2026.
                    </span>
                  </div>
                </div>
              ) : (
                /* Career Hub Detail Card */
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between border-b border-[#00ff41]/40 pb-2">
                    <div className="flex items-center gap-1.5">
                      {React.createElement(activeHub.icon, { className: 'w-4 h-4 text-[#00ff41]' })}
                      <span className="text-[10px] text-[#00ffff] font-bold uppercase tracking-wider">
                        {activeHub.role}
                      </span>
                    </div>
                    <span className="px-1.5 py-0.5 text-[8px] bg-[#00ff41] text-black font-black uppercase">
                      ACTIVE HUB
                    </span>
                  </div>

                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-white uppercase tracking-wide">
                      {activeHub.name}
                    </h3>
                    <div className="text-[9px] text-[#00ff41]/80 font-mono mt-0.5 flex items-center gap-1">
                      <Navigation className="w-2.5 h-2.5" />
                      <span>{activeHub.latLng}</span>
                    </div>
                    <div className="text-[9px] text-[#ffea00] font-mono">
                      Vùng: {activeHub.region}
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-200 leading-relaxed font-sans">
                    {activeHub.description}
                  </p>

                  <div className="p-2 bg-[#051105] border border-[#00ff41]/40 text-[10px] space-y-1">
                    <span className="text-[#ffea00] font-bold block uppercase flex items-center gap-1">
                      <Zap className="w-3 h-3 text-[#ffea00]" />
                      <span>Lĩnh Vực Đào Tạo & Thực Tập:</span>
                    </span>
                    <span className="text-white block font-medium">
                      {activeHub.specialty}
                    </span>
                  </div>

                  <div className="p-2 bg-[#08150c] border border-[#00ffff]/40 text-[10px] space-y-0.5">
                    <span className="text-[#00ffff] font-bold block uppercase">
                      📊 Quy Mô & Năng Lực 2026:
                    </span>
                    <span className="text-slate-200 block font-mono text-[9.5px]">
                      {activeHub.keyStats}
                    </span>
                  </div>

                  {/* Quick Jump Buttons to other hubs */}
                  <div className="pt-1 border-t border-[#00ff41]/20">
                    <span className="text-[9px] text-[#00ff41]/70 uppercase block mb-1">
                      CHUYỂN TRUNG TÂM NGHỀ:
                    </span>
                    <div className="flex flex-wrap gap-1">
                      {CAREER_HUBS.map(hub => (
                        <button
                          key={hub.id}
                          type="button"
                          onClick={() => handleSelectHub(hub)}
                          className={`px-1.5 py-0.5 text-[9px] font-bold border transition-all cursor-pointer ${
                            activeHub.id === hub.id
                              ? 'bg-[#00ff41] text-black border-white shadow-[0_0_8px_#00ff41]'
                              : 'bg-black text-[#00ff41]/80 border-[#00ff41]/40 hover:border-[#00ff41]'
                          }`}
                        >
                          {hub.shortName.split(' ')[0]}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 2: ROTATING 8-BIT / 16-BIT EARTH GLOBE MATRIX */}
        {/* ========================================================================= */}
        {viewMode === 'earth_globe' && (
          <div className="relative w-full h-full flex flex-col items-center justify-center p-4">
            
            {/* 8-Bit Pixel Globe Container */}
            <div className="relative w-64 h-64 sm:w-72 sm:h-72 flex items-center justify-center">
              
              {/* Glowing Space Atmosphere Aura */}
              <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-[#00ff41]/20 via-[#00ffff]/30 to-transparent blur-2xl pointer-events-none" />
              
              {/* Outer Latitude Orbit Ring */}
              <div 
                className="absolute w-80 h-80 rounded-full border border-[#00ffff]/30 border-dashed pointer-events-none animate-spin"
                style={{ animationDuration: '30s' }}
              />

              {/* Satellites Orbiting Globe */}
              {satellites.map(sat => {
                const rad = (sat.angle * Math.PI) / 180;
                const x = 128 + Math.cos(rad) * sat.radius;
                const y = 128 + Math.sin(rad) * (sat.radius * 0.45); // Elliptical projection

                return (
                  <div
                    key={sat.id}
                    className="absolute z-20 pointer-events-none flex items-center gap-1 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${x}px`, top: `${y}px` }}
                  >
                    <div className="w-2.5 h-2.5 bg-[#00ffff] border border-black shadow-[0_0_8px_#00ffff] flex items-center justify-center animate-spin">
                      <div className="w-1 h-1 bg-[#ff00ff]" />
                    </div>
                    <span className="text-[8px] bg-black/90 text-[#00ffff] border border-[#00ffff]/40 px-1 font-mono whitespace-nowrap">
                      {sat.name}
                    </span>
                  </div>
                );
              })}

              {/* The 8-Bit Pixel Earth Sphere */}
              <div className="relative w-52 h-52 sm:w-60 sm:h-60 rounded-full bg-[#001026] border-2 border-[#00ffff] overflow-hidden shadow-[inset_0_0_30px_rgba(0,255,255,0.4),0_0_30px_rgba(0,255,65,0.3)]">
                
                {/* Longitude & Latitude Matrix Grid Lines */}
                <div className="absolute inset-0 opacity-30 pointer-events-none">
                  <div className="w-full h-[1px] bg-[#00ffff] absolute top-1/4" />
                  <div className="w-full h-[1.5px] bg-[#00ff41] absolute top-1/2" /> {/* Equator */}
                  <div className="w-full h-[1px] bg-[#00ffff] absolute top-3/4" />
                  <div className="h-full w-[1px] bg-[#00ffff] absolute left-1/4" />
                  <div className="h-full w-[1.5px] bg-[#00ff41] absolute left-1/2" /> {/* Prime Meridian */}
                  <div className="h-full w-[1px] bg-[#00ffff] absolute left-3/4" />
                </div>

                {/* Continents Pixel Pattern moving with rotation angle */}
                <div 
                  className="absolute inset-0 flex items-center transition-transform"
                  style={{ transform: `translateX(${-((rotationAngle * 2) % 360)}px)` }}
                >
                  {/* Repeated continent strips for continuous seamless 360 rotation */}
                  {[0, 1, 2].map(copyIdx => (
                    <div key={copyIdx} className="relative w-[360px] h-full shrink-0">
                      
                      {/* Asia Continent */}
                      <div className="absolute top-10 left-12 w-28 h-20 bg-[#059669] rounded-lg opacity-85 border border-[#10b981]" />
                      <div className="absolute top-16 left-28 w-16 h-12 bg-[#047857] rounded-sm" />
                      
                      {/* VIETNAM - Shining Golden Strip on East Coast of Asia */}
                      <div className="absolute top-14 left-24 w-3.5 h-10 bg-[#facc15] border border-white rounded-full animate-pulse shadow-[0_0_10px_#facc15]" title="VIETNAM // S-SHAPED PEARL">
                        <div className="w-1.5 h-1.5 bg-red-600 rounded-full mx-auto mt-1" />
                      </div>

                      {/* Europe */}
                      <div className="absolute top-8 left-2 w-14 h-12 bg-[#065f46] rounded-md opacity-80" />
                      
                      {/* Africa */}
                      <div className="absolute top-24 left-4 w-18 h-24 bg-[#047857] rounded-xl opacity-80" />
                      
                      {/* Australia & Oceania */}
                      <div className="absolute top-36 left-32 w-14 h-10 bg-[#059669] rounded-lg opacity-85" />
                      
                      {/* Americas (Pacific view) */}
                      <div className="absolute top-12 left-64 w-20 h-32 bg-[#047857] rounded-lg opacity-80" />
                    </div>
                  ))}
                </div>

                {/* Day / Night Atmospheric Shadow terminator */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-black/80 pointer-events-none" />
                
                {/* Space Sun Glare Reflection */}
                <div className="absolute top-2 left-2 w-20 h-20 bg-white/10 rounded-full blur-xl pointer-events-none" />
              </div>
            </div>

            {/* Earth Telemetry & Coordinate Data */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-3 text-[10px] text-[#00ffff] bg-black/80 border border-[#00ffff]/40 px-4 py-2">
              <span className="flex items-center gap-1">
                <Globe className="w-3.5 h-3.5" />
                <span>QUỸ ĐẠO: ĐỊA TĨNH (GEO 35,786 KM)</span>
              </span>
              <span>//</span>
              <span className="text-[#facc15] font-bold">
                VIỆT NAM: 102°09'Đ - 109°28'Đ // 8°37'B - 23°23'B
              </span>
              <span>//</span>
              <span className="text-[#00ff41]">
                VẬN TỐC QUAY: {rotationAngle.toFixed(1)}° / 360°
              </span>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* VIEW 3: PIXEL HERITAGE & FUTURE SKYLINE PANORAMA */}
        {/* ========================================================================= */}
        {viewMode === 'scenic_skyline' && (
          <div className="relative w-full h-full flex flex-col justify-end p-4 overflow-hidden">
            
            {/* Sky Background with Moon & Dong Son Birds */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#020b14] via-[#051c24] to-[#042f1a] pointer-events-none">
              
              {/* Pixel Full Moon / Sun */}
              <div className="absolute top-6 right-12 w-14 h-14 bg-[#fef08a] border-2 border-white rounded-full shadow-[0_0_30px_#fef08a] flex items-center justify-center">
                <div className="w-10 h-10 rounded-full bg-[#fef9c3] opacity-80" />
              </div>

              {/* Mythical Chim Lạc (Đông Sơn Bronze Drum Bird) Flying in Pixel Art */}
              <div 
                className="absolute top-12 z-10 pointer-events-none transition-transform"
                style={{ 
                  left: `${((rotationAngle * 3) % 480) - 40}px`,
                  transform: `translateY(${Math.sin(rotationAngle * 0.1) * 8}px)`
                }}
              >
                <div className="flex items-center gap-1">
                  <div className="w-6 h-3 bg-[#facc15] [clip-path:polygon(0%_50%,40%_0%,100%_30%,60%_70%,20%_100%)] animate-pulse" />
                  <span className="text-[7px] text-[#facc15] font-bold tracking-widest bg-black/60 px-1">CHIM LẠC</span>
                </div>
              </div>
            </div>

            {/* Layer 1: Distant Majestic Mountains (Fansipan & Truong Son) */}
            <div className="absolute bottom-24 left-0 right-0 h-36 pointer-events-none opacity-40">
              <svg viewBox="0 0 800 150" className="w-full h-full">
                <polygon points="0,150 80,40 180,110 260,30 360,120 480,20 600,100 720,45 800,150" fill="#064e3b" />
              </svg>
            </div>

            {/* Layer 2: Vietnamese Cultural & Modern Architectural Landmarks */}
            <div className="relative z-10 flex items-end justify-around w-full gap-2 sm:gap-4 pb-2 border-b-4 border-[#00ff41]">
              
              {/* Landmark 1: Cột Cờ Hà Nội / Tháp Rùa */}
              <div className="flex flex-col items-center">
                <div className="w-2 h-10 bg-red-700 relative">
                  <div className="absolute -top-3 -right-3 w-5 h-3 bg-red-600 border border-yellow-300">
                    <div className="w-1.5 h-1.5 bg-yellow-300 mx-auto mt-0.5" />
                  </div>
                </div>
                <div className="w-12 h-8 bg-[#991b1b] border border-white" />
                <div className="w-16 h-4 bg-[#7f1d1d]" />
                <span className="text-[8px] text-[#ffea00] mt-1 font-bold">CỘT CỜ HN</span>
              </div>

              {/* Landmark 2: Cầu Rồng Đà Nẵng (Phun Lửa Pixel) */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-3 bg-orange-500 rounded-t-full animate-bounce" title="Rồng Phun Lửa">
                  <div className="w-2 h-2 bg-yellow-300 mx-auto" />
                </div>
                <div className="w-20 h-6 bg-[#f59e0b] [clip-path:polygon(0%_100%,20%_20%,40%_80%,60%_20%,80%_80%,100%_20%,100%_100%)]" />
                <div className="w-24 h-3 bg-blue-600" />
                <span className="text-[8px] text-[#00ff41] mt-1 font-bold">CẦU RỒNG</span>
              </div>

              {/* Landmark 3: Chợ Bến Thành & Tháp Bitexco / Landmark 81 TP.HCM */}
              <div className="flex flex-col items-center">
                <div className="w-6 h-28 bg-gradient-to-t from-blue-700 to-cyan-400 border border-white relative">
                  <div className="absolute top-6 -right-2 w-4 h-2 bg-cyan-300 rounded-full" /> {/* Skydeck */}
                  <div className="w-1 h-6 bg-white mx-auto -mt-6" /> {/* Spire */}
                </div>
                <div className="w-16 h-8 bg-[#b45309] border border-white flex items-center justify-center">
                  <div className="w-3 h-3 bg-white rounded-full border border-black" /> {/* Clock */}
                </div>
                <span className="text-[8px] text-[#00ffff] mt-1 font-bold">TP. HỒ CHÍ MINH</span>
              </div>

              {/* Landmark 4: Cầu Cần Thơ & Chợ Nổi Cái Răng */}
              <div className="flex flex-col items-center">
                <div className="w-1 h-16 bg-white" />
                <div className="w-16 h-3 bg-[#0284c7] [clip-path:polygon(0%_0%,50%_100%,100%_0%)]" />
                <div className="w-20 h-4 bg-emerald-700" />
                <span className="text-[8px] text-[#a855f7] mt-1 font-bold">CẦN THƠ ĐBSCL</span>
              </div>

              {/* Landmark 5: Hải Đăng Trường Sa & Nhà Giàn DK1 */}
              <div className="flex flex-col items-center">
                <div className="w-4 h-4 bg-yellow-400 rounded-full animate-ping" />
                <div className="w-5 h-16 bg-gradient-to-b from-red-600 via-white to-red-600 border border-black" />
                <div className="w-12 h-6 bg-slate-700 border border-yellow-400" />
                <span className="text-[8px] text-[#facc15] mt-1 font-bold">HẢI ĐĂNG BIỂN ĐẢO</span>
              </div>
            </div>

            {/* Bottom Ground: High-Speed Metro & Electric Grid */}
            <div className="h-6 bg-[#031c0a] flex items-center justify-between px-4 text-[9px] text-[#00ff41]">
              <span className="flex items-center gap-1 font-mono">
                <Zap className="w-3 h-3 text-[#ffea00]" />
                <span>TUYẾN TÀU ĐIỆN CAO TỐC BẮC - NAM // 350 KM/H</span>
              </span>
              <span className="text-[#00ffff] font-mono">
                HÀ NỘI ⇄ ĐÀ NẴNG ⇄ TP. HỒ CHÍ MINH ⇄ CẦN THƠ
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Status Bar */}
      <div className="bg-[#030a04] border-t border-[#00ff41]/40 px-3 py-1.5 flex flex-wrap items-center justify-between gap-2 text-[9.5px] text-[#00ff41]/90">
        <div className="flex items-center gap-2">
          <span className="text-[#facc15] font-bold">
            🇻🇳 CHỦ QUYỀN TOÀN VẸN LÃNH THỔ:
          </span>
          <span className="text-white font-mono">
            ĐẤT LIỀN CHỮ S // HOÀNG SA & TRƯỜNG SA // VÙNG TRỜI VÀ VÙNG BIỂN THIÊNG LIÊNG
          </span>
        </div>

        <div className="flex items-center gap-2 font-mono">
          <span className="text-[#00ffff]">GDPT 2026</span>
          <span>//</span>
          <span className="text-emerald-400">8 TUẦN THỰC TẬP NGHỀ NGHIỆP</span>
        </div>
      </div>
    </div>
  );
};
