import React, { useState } from 'react';
import { UserProgress, Settings, PixelAvatarConfig } from '../types';
import { PixelCustomAvatarSprite, PixelShibaSprite } from './pixel/PixelArtSprites';
import { playSound } from '../utils/audio';
import { 
  Sparkles, X, Check, RefreshCw, Shuffle, User, Palette, 
  Glasses, Award, Laptop, Heart, Crown, Sliders, Play, Smile
} from 'lucide-react';

interface Props {
  progress: UserProgress;
  settings: Settings;
  isOpen: boolean;
  onClose: () => void;
  onSaveAvatar: (newAvatar: PixelAvatarConfig) => void;
}

export const PixelAvatarStudioModal: React.FC<Props> = ({
  progress,
  settings,
  isOpen,
  onClose,
  onSaveAvatar
}) => {
  const initialAvatar: PixelAvatarConfig = progress.customAvatar || {
    gender: 'male',
    skinTone: 'warm',
    hairStyle: 'spiky',
    hairColor: 'black',
    outfit: 'cyber_hoodie',
    outfitColor: 'green',
    accessory: 'cyber_visor',
    headgear: 'none',
    heldItem: 'laptop',
    companion: 'shiba',
    title: 'Thực Tập Sinh Cyber',
    expression: 'smile'
  };

  const [avatar, setAvatar] = useState<PixelAvatarConfig>({ ...initialAvatar });
  const [activeTab, setActiveTab] = useState<'body' | 'hair' | 'outfit' | 'accessory' | 'headgear' | 'item' | 'companion' | 'title'>('body');
  const [previewScale, setPreviewScale] = useState<number>(110);
  const [activePose, setActivePose] = useState<'idle' | 'wave' | 'triumph'>('idle');
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  if (!isOpen) return null;

  // Options catalog
  const SKIN_TONES = [
    { id: 'fair', label: 'Trắng Sáng', color: '#fed7aa' },
    { id: 'warm', label: 'Tự Nhiên', color: '#fdba74' },
    { id: 'tan', label: 'Bánh Mật', color: '#d97706' },
    { id: 'dark', label: 'Rắn Rỏi', color: '#78350f' },
    { id: 'cyber_neon', label: 'Cyber Neon', color: '#00ff41' },
    { id: 'golden', label: 'Hoàng Kim', color: '#facc15' }
  ];

  const HAIR_STYLES = [
    { id: 'spiky', label: '⚡ Tóc Spiky Cá Tính' },
    { id: 'side_part', label: '👔 Rẽ Ngôi Lịch Lãm' },
    { id: 'ponytail', label: '🎀 Đuôi Ngựa Cột Nơ' },
    { id: 'curly', label: '🌀 Tóc Xoăn Bồng Bềnh' },
    { id: 'cyber_bob', label: '🤖 Cyber Bob Angular' },
    { id: 'short_fade', label: '✂️ Undercut Fade Gọn' },
    { id: 'long_flow', label: '✨ Tóc Dài Suôn Mượt' }
  ];

  const HAIR_COLORS = [
    { id: 'black', label: 'Đen Tuyển', color: '#18181b' },
    { id: 'brown', label: 'Nâu Hạt Dẻ', color: '#78350f' },
    { id: 'blond', label: 'Vàng Kim', color: '#fde047' },
    { id: 'red', label: 'Đỏ Lửa', color: '#dc2626' },
    { id: 'cyan', label: 'Cyan Cyber', color: '#06b6d4' },
    { id: 'magenta', label: 'Hồng Neon', color: '#d946ef' },
    { id: 'emerald', label: 'Xanh Ngọc Lục', color: '#10b981' },
    { id: 'silver', label: 'Bạch Kim', color: '#cbd5e1' }
  ];

  const OUTFITS = [
    { id: 'ao_dai_trad', label: '🌸 Áo Dài Truyền Thống (Tà Lụa Thướt Tha & Quần Lụa Trắng)' },
    { id: 'ao_ba_ba', label: '🌾 Áo Bà Ba Nam Bộ (Cài Nút Giữa & Hai Túi Dưới Dân Dã)' },
    { id: 'ao_doan_tn', label: '💙 Áo Đoàn Thanh Niên Việt Nam (Áo Xanh Huy Hiệu Sao Vàng)' },
    { id: 'hoc_sinh_khan_quang', label: '🧣 Đồng Phục Học Sinh Quàng Khăn Đỏ Đội Viên' },
    { id: 'viet_phuc_nhat_binh', label: '👑 Việt Phục Cổ Phong Nhật Bình Triều Nguyễn (Cổ Ngũ Sắc)' },
    { id: 'ao_co_do_sao_vang', label: '🇻🇳 Áo Thun Cờ Đỏ Sao Vàng Tự Hào Việt Nam' },
    { id: 'school_uniform', label: '🎓 Đồng Phục Sơ Mi & Cà Vạt Học Sinh' },
    { id: 'cyber_hoodie', label: '⚡ Áo Hoodie Cyberpunk (Khóa Kéo Neon)' },
    { id: 'doctor_scrubs', label: '🩺 Trang Phục Y Khoa (Áo Scrubs Bác Sĩ)' },
    { id: 'teacher_blazer', label: '📚 Áo Vest Sư Phạm / Công Sở Chuẩn Mực' },
    { id: 'lab_coat', label: '🧪 Áo Choàng Lab Nghiên Cứu Khoa Học' },
    { id: 'streetwear', label: '🎨 Streetwear Thời Trang Năng Động' }
  ];

  const OUTFIT_COLORS = [
    { id: 'white', label: 'Trắng Tinh Khôi (Áo Dài Trắng)', color: '#f8fafc' },
    { id: 'red', label: 'Đỏ Thắm May Mắn', color: '#ef4444' },
    { id: 'blue', label: 'Xanh Đoàn / Biển Sâu', color: '#1d4ed8' },
    { id: 'yellow', label: 'Vàng Hoàng Gia / Hoa Mai', color: '#eab308' },
    { id: 'green', label: 'Xanh Lá / Matrix', color: '#10b981' },
    { id: 'magenta', label: 'Hồng Sen / Cyber', color: '#d946ef' },
    { id: 'slate', label: 'Nâu Đất / Đen Trầm (Bà Ba)', color: '#334155' }
  ];

  const ACCESSORIES = [
    { id: 'none', label: '❌ Không đeo kính/phụ kiện' },
    { id: 'khan_ran_co', label: '🧣 Khăn Rằn Nam Bộ Quàng Cổ Dân Dã' },
    { id: 'glasses', label: '👓 Kính Cận Trí Thức Học Sinh' },
    { id: 'cyber_visor', label: '🥽 Kính Cyber Visor Laser' },
    { id: 'shades', label: '🕶️ Kính Mát Siêu Ngầu' },
    { id: 'mask', label: '😷 Khẩu Trang Bảo Hộ Y Tế' },
    { id: 'scouter', label: '🎯 Kính Đo Chỉ Số Scouter' }
  ];

  const HEADGEARS = [
    { id: 'none', label: '❌ Không đội nón/mũ' },
    { id: 'non_la', label: '🌾 Nón Lá Bài Thơ Duyên Dáng (Quai Lụa Hồng)' },
    { id: 'non_coi', label: '🎖️ Nón Cối Bộ Đội (Huy Hiệu Ngôi Sao Vàng)' },
    { id: 'man_truyen_thong', label: '👑 Mấn Đội Đầu Cổ Truyền (Gấm Đính Ngọc)' },
    { id: 'khan_ran_head', label: '🧣 Khăn Rằn Quấn Đầu Phong Cách Nam Bộ' },
    { id: 'bang_ron_vietnam', label: '🇻🇳 Băng Rôn Đỏ Sao Vàng "VIỆT NAM VÔ ĐỊCH"' },
    { id: 'grad_cap', label: '🎓 Mũ Cử Nhân Tốt Nghiệp' },
    { id: 'headphones', label: '🎧 Tai Nghe Gaming / DJ' },
    { id: 'cap_back', label: '🧢 Mũ Lưỡi Trai Đội Ngược' },
    { id: 'cat_ears', label: '🐱 Tai Mèo Cyber Neko' },
    { id: 'crown', label: '👑 Vương Miện Quán Quân' },
    { id: 'beret', label: '🎨 Mũ Nồi Beret Nghệ Thuật' }
  ];

  const HELD_ITEMS = [
    { id: 'none', label: '❌ Không cầm vật phẩm' },
    { id: 'banh_mi', label: '🥖 Ổ Bánh Mì Việt Nam Giòn Rụm Kẹp Chả & Ngò Gai' },
    { id: 'ca_phe_phin', label: '☕ Cà Phê Phin Sữa Đá Sài Gòn Đậm Đà' },
    { id: 'co_to_quoc', label: '🇻🇳 Cờ Đỏ Sao Vàng Cầm Tay Tung Bay' },
    { id: 'hoa_sen', label: '🪷 Bông Hoa Sen Hồng Thanh Khiết (Quốc Hoa)' },
    { id: 'but_vo_hongha', label: '📖 Vở Ô Ly Hồng Hà & Cây Bút Mực Bến Nghé' },
    { id: 'dan_bau', label: '🎵 Đàn Bầu / Đàn Tranh Dân Tộc Cổ Truyền' },
    { id: 'quat_mo', label: '🪭 Quạt Mo Cau Làng Quê Dân Gian' },
    { id: 'laptop', label: '💻 Laptop Lập Trình Matrix' },
    { id: 'tablet', label: '📱 Máy Tính Bảng Nghiệp Vụ' },
    { id: 'stethoscope', label: '🩺 Ống Nghe Y Tế Khám Bệnh' },
    { id: 'flask', label: '🧪 Bình Hóa Chất Thí Nghiệm' },
    { id: 'certificate', label: '📜 Giấy Khen / Bằng Tốt Nghiệp' },
    { id: 'coffee', label: '☕ Ly Cà Phê Chạy Deadline' },
    { id: 'gameboy', label: '🕹️ Máy Gameboy 8-Bit Cổ Điển' }
  ];

  const COMPANIONS = [
    { id: 'none', label: '❌ Đi một mình' },
    { id: 'trau_vang', label: '🐂 Trâu Vàng Kim Ngưu (Chuông Vàng May Mắn Lúa Nước)' },
    { id: 'cho_phu_quoc', label: '🐕 Chó Phú Quốc Xoáy Lưng (Tinh Khôn & Dũng Mãnh)' },
    { id: 'meo_muop', label: '🐈 Mèo Mướp Tam Thể Mắt Ngọc Bắt Chuột' },
    { id: 'chim_lac', label: '🦅 Chim Lạc Trống Đồng Đông Sơn (Âu Lạc Thần Thoại)' },
    { id: 'shiba', label: '🐕 Chó Shiba Cyber Bot' },
    { id: 'drone', label: '🛸 Drone Bay Giám Sát AI' },
    { id: 'pixel_cat', label: '🐈 Mèo Pixel May Mắn' },
    { id: 'robot_owl', label: '🦉 Cú Máy Tri Thức' }
  ];

  const EXPRESSIONS = [
    { id: 'smile', label: '😊 Vui Vẻ Duyên Dáng' },
    { id: 'cool', label: '😎 Tự Tin Rạng Rỡ' },
    { id: 'wink', label: '😉 Nháy Mắt Đáng Yêu' },
    { id: 'focus', label: '🧐 Tập Trung Quyết Tâm' },
    { id: 'triumph', label: '🏆 Hào Hùng Chiến Thắng' }
  ];

  const PRESET_TITLES = [
    'Nữ Sinh Áo Dài Duyên Dáng',
    'Thanh Niên Việt Nam Quyết Tâm',
    'Cháu Ngoan Bác Hồ 10A3',
    'Trạng Nguyên Đất Việt',
    'Thực Tập Sinh GDPT 2018',
    'Thủ Khoa Sư Phạm',
    'Kỹ Sư Công Nghệ Trẻ',
    'Bác Sĩ Cứu Tinh Y Đức',
    'Chiến Binh CareerOS Tự Hào',
    'Học Sinh Tiên Tiến'
  ];

  // Presets
  const applyPreset = (presetKey: string) => {
    playSound.click(settings.retroSound);
    if (presetKey === 'aodai') {
      setAvatar({
        gender: 'female',
        skinTone: 'fair',
        hairStyle: 'long_flow',
        hairColor: 'black',
        outfit: 'ao_dai_trad',
        outfitColor: 'white',
        accessory: 'none',
        headgear: 'non_la',
        heldItem: 'hoa_sen',
        companion: 'meo_muop',
        title: 'Nữ Sinh Áo Dài Duyên Dáng',
        expression: 'smile'
      });
    } else if (presetKey === 'doan_tn') {
      setAvatar({
        gender: 'male',
        skinTone: 'warm',
        hairStyle: 'side_part',
        hairColor: 'black',
        outfit: 'ao_doan_tn',
        outfitColor: 'blue',
        accessory: 'none',
        headgear: 'bang_ron_vietnam',
        heldItem: 'co_to_quoc',
        companion: 'trau_vang',
        title: 'Thanh Niên Xung Kích Việt Nam',
        expression: 'triumph'
      });
    } else if (presetKey === 'viet_phuc') {
      setAvatar({
        gender: 'female',
        skinTone: 'fair',
        hairStyle: 'long_flow',
        hairColor: 'black',
        outfit: 'viet_phuc_nhat_binh',
        outfitColor: 'yellow',
        accessory: 'none',
        headgear: 'man_truyen_thong',
        heldItem: 'dan_bau',
        companion: 'chim_lac',
        title: 'Việt Phục Nhật Bình Quý Phái',
        expression: 'smile'
      });
    } else if (presetKey === 'baba') {
      setAvatar({
        gender: 'male',
        skinTone: 'tan',
        hairStyle: 'spiky',
        hairColor: 'black',
        outfit: 'ao_ba_ba',
        outfitColor: 'slate',
        accessory: 'khan_ran_co',
        headgear: 'non_la',
        heldItem: 'ca_phe_phin',
        companion: 'cho_phu_quoc',
        title: 'Chàng Trai Nam Bộ Mộc Mạc',
        expression: 'cool'
      });
    } else if (presetKey === 'saovang') {
      setAvatar({
        gender: 'male',
        skinTone: 'warm',
        hairStyle: 'short_fade',
        hairColor: 'black',
        outfit: 'ao_co_do_sao_vang',
        outfitColor: 'red',
        accessory: 'none',
        headgear: 'bang_ron_vietnam',
        heldItem: 'banh_mi',
        companion: 'trau_vang',
        title: 'Việt Nam Quyết Tâm Vô Địch',
        expression: 'triumph'
      });
    } else if (presetKey === 'khanday') {
      setAvatar({
        gender: 'female',
        skinTone: 'fair',
        hairStyle: 'ponytail',
        hairColor: 'black',
        outfit: 'hoc_sinh_khan_quang',
        outfitColor: 'white',
        accessory: 'glasses',
        headgear: 'none',
        heldItem: 'but_vo_hongha',
        companion: 'meo_muop',
        title: 'Cháu Ngoan Bác Hồ Gương Mẫu',
        expression: 'smile'
      });
    } else if (presetKey === 'coder') {
      setAvatar({
        gender: 'cyber',
        skinTone: 'cyber_neon',
        hairStyle: 'spiky',
        hairColor: 'cyan',
        outfit: 'cyber_hoodie',
        outfitColor: 'green',
        accessory: 'cyber_visor',
        headgear: 'headphones',
        heldItem: 'laptop',
        companion: 'shiba',
        title: 'Fullstack Cyber Coder',
        expression: 'cool'
      });
    }
  };

  const handleRandomize = () => {
    playSound.click(settings.retroSound);
    const rand = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
    
    setAvatar({
      gender: rand(['male', 'female', 'cyber']),
      skinTone: rand(SKIN_TONES).id as any,
      hairStyle: rand(HAIR_STYLES).id as any,
      hairColor: rand(HAIR_COLORS).id as any,
      outfit: rand(OUTFITS).id as any,
      outfitColor: rand(OUTFIT_COLORS).id as any,
      accessory: rand(ACCESSORIES).id as any,
      headgear: rand(HEADGEARS).id as any,
      heldItem: rand(HELD_ITEMS).id as any,
      companion: rand(COMPANIONS).id as any,
      title: rand(PRESET_TITLES),
      expression: rand(EXPRESSIONS).id as any
    });
  };

  const handleSave = () => {
    playSound.confetti(settings.retroSound);
    onSaveAvatar(avatar);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 font-mono text-[#00ff41] select-none">
      <div className="w-full max-w-5xl bg-[#080d08] border-4 border-[#00ff41] p-4 sm:p-6 shadow-[0_0_50px_rgba(0,255,65,0.4)] relative max-h-[94vh] overflow-y-auto flex flex-col space-y-4 pixelated">
        
        {/* Header Bar */}
        <div className="flex items-center justify-between border-b-2 border-[#00ff41] pb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-[#00ff41] text-[#000] flex items-center justify-center font-black border-2 border-[#000] shadow-[0_0_15px_#00ff41]">
              <Palette className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-sm sm:text-base font-pixel font-bold uppercase text-white tracking-wider">
                  XƯỞNG TẠO NHÂN VẬT PIXEL (8-BIT AVATAR STUDIO)
                </h2>
                <span className="bg-[#ff00ff] text-[#000] text-[9px] px-2 py-0.5 font-pixel font-bold uppercase">
                  CUSTOM V5
                </span>
              </div>
              <p className="text-xs text-[#00ff41]/80 mt-0.5">
                Tự do thiết kế hình đại diện thực tập sinh theo phong cách game retro cá nhân hóa!
              </p>
            </div>
          </div>

          <button
            onClick={() => { playSound.click(settings.retroSound); onClose(); }}
            className="p-1.5 border-2 border-[#ff4444] text-[#ff4444] hover:bg-[#ff4444] hover:text-[#000] transition-colors"
            title="Đóng cửa sổ"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Preset Buttons Bar */}
        <div className="bg-[#111] border border-[#00ff41]/40 p-2 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-white">
            <Sparkles className="w-4 h-4 text-[#ff00ff]" />
            <span>MẪU GỢI Ý ĐẶC TRƯNG VIỆT NAM:</span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5">
            <button
              onClick={() => applyPreset('aodai')}
              className="px-2 py-1 bg-[#0c0c0c] border border-[#f472b6] text-[#f472b6] hover:bg-[#f472b6] hover:text-[#000] text-[10px] font-bold"
            >
              🌸 Nữ Sinh Áo Dài
            </button>
            <button
              onClick={() => applyPreset('doan_tn')}
              className="px-2 py-1 bg-[#0c0c0c] border border-[#3b82f6] text-[#3b82f6] hover:bg-[#3b82f6] hover:text-[#000] text-[10px] font-bold"
            >
              💙 Áo Đoàn Tình Nguyện
            </button>
            <button
              onClick={() => applyPreset('saovang')}
              className="px-2 py-1 bg-[#0c0c0c] border border-[#ef4444] text-[#ef4444] hover:bg-[#ef4444] hover:text-[#000] text-[10px] font-bold"
            >
              🇻🇳 Cờ Đỏ Sao Vàng
            </button>
            <button
              onClick={() => applyPreset('viet_phuc')}
              className="px-2 py-1 bg-[#0c0c0c] border border-[#facc15] text-[#facc15] hover:bg-[#facc15] hover:text-[#000] text-[10px] font-bold"
            >
              👑 Việt Phục Nhật Bình
            </button>
            <button
              onClick={() => applyPreset('baba')}
              className="px-2 py-1 bg-[#0c0c0c] border border-[#a16207] text-[#fde047] hover:bg-[#fde047] hover:text-[#000] text-[10px] font-bold"
            >
              🌾 Áo Bà Ba Nam Bộ
            </button>
            <button
              onClick={() => applyPreset('khanday')}
              className="px-2 py-1 bg-[#0c0c0c] border border-[#ef4444] text-white hover:bg-[#ef4444] hover:text-[#000] text-[10px] font-bold"
            >
              🧣 Khăn Quàng Đỏ
            </button>
            <button
              onClick={() => applyPreset('coder')}
              className="px-2 py-1 bg-[#0c0c0c] border border-[#00e5ff] text-[#00e5ff] hover:bg-[#00e5ff] hover:text-[#000] text-[10px] font-bold"
            >
              ⚡ Cyber Coder
            </button>
          </div>
        </div>

        {/* Main 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 flex-1">
          
          {/* LEFT COLUMN: LIVE AVATAR PREVIEW CARD (4 COLS) */}
          <div className="lg:col-span-4 bg-[#030604] border-2 border-[#00ff41] p-4 flex flex-col items-center justify-between space-y-4 shadow-[inset_0_0_20px_rgba(0,255,65,0.15)] relative">
            
            {/* Top Preview Controls */}
            <div className="w-full flex items-center justify-between border-b border-[#00ff41]/30 pb-2 text-[10px] text-[#00ff41]">
              <span className="font-pixel font-bold">XEM TRƯỚC (LIVE PREVIEW)</span>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setPreviewScale(prev => Math.max(70, prev - 15))}
                  className="px-1.5 py-0.5 bg-[#111] border border-[#00ff41] hover:bg-[#00ff41] hover:text-black font-bold"
                  title="Thu nhỏ"
                >
                  -
                </button>
                <span className="text-[9px] font-mono">{previewScale}px</span>
                <button
                  onClick={() => setPreviewScale(prev => Math.min(150, prev + 15))}
                  className="px-1.5 py-0.5 bg-[#111] border border-[#00ff41] hover:bg-[#00ff41] hover:text-black font-bold"
                  title="Phóng to"
                >
                  +
                </button>
              </div>
            </div>

            {/* Sprite Stage Box with Matrix Grid Backdrop */}
            <div className="w-full py-6 bg-[#080d09] border border-[#00ff41]/40 rounded flex flex-col items-center justify-center relative overflow-hidden min-h-[190px]">
              {/* Matrix Background Lines */}
              <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#00ff41_1px,transparent_1px)] [background-size:12px_12px]" />

              {/* Real-time Dynamic Sprite */}
              <PixelCustomAvatarSprite
                config={avatar}
                size={previewScale}
                animate={true}
                showCompanion={true}
                showTitle={true}
                actionPose={activePose}
                className="z-10 transform transition-transform"
              />

              {/* Player Name Display */}
              <div className="mt-3 text-center z-10">
                <span className="text-xs font-bold text-white tracking-wider uppercase bg-[#111] px-2 py-0.5 border border-[#00ff41]/60 inline-block">
                  {progress.name || 'HỌC SINH'}
                </span>
                <span className="block text-[10px] text-[#ff00ff] font-bold mt-0.5">
                  [{progress.school} - {progress.className}]
                </span>
              </div>
            </div>

            {/* Expression & Pose Interactive Tester */}
            <div className="w-full space-y-1.5">
              <div className="text-[10px] font-bold text-[#00ff41] uppercase flex items-center justify-between">
                <span>HÀNH ĐỘNG & DÁNG ĐỨNG:</span>
                <span className="text-[#ff00ff]">{activePose.toUpperCase()}</span>
              </div>
              <div className="grid grid-cols-3 gap-1">
                <button
                  onClick={() => { playSound.click(settings.retroSound); setActivePose('idle'); }}
                  className={`py-1 text-[10px] font-bold border ${activePose === 'idle' ? 'bg-[#00ff41] text-black border-[#00ff41]' : 'border-[#00ff41]/50 hover:bg-[#00ff41]/20'}`}
                >
                  Đứng Yên
                </button>
                <button
                  onClick={() => { playSound.click(settings.retroSound); setActivePose('wave'); }}
                  className={`py-1 text-[10px] font-bold border ${activePose === 'wave' ? 'bg-[#00ff41] text-black border-[#00ff41]' : 'border-[#00ff41]/50 hover:bg-[#00ff41]/20'}`}
                >
                  👋 Vẫy Tay
                </button>
                <button
                  onClick={() => { playSound.click(settings.retroSound); setActivePose('triumph'); }}
                  className={`py-1 text-[10px] font-bold border ${activePose === 'triumph' ? 'bg-[#00ff41] text-black border-[#00ff41]' : 'border-[#00ff41]/50 hover:bg-[#00ff41]/20'}`}
                >
                  🏆 Chiến Thắng
                </button>
              </div>
            </div>

            {/* Quick Action Tools: Randomize & Reset */}
            <div className="w-full grid grid-cols-2 gap-2 pt-2 border-t border-[#00ff41]/30">
              <button
                onClick={handleRandomize}
                className="py-1.5 bg-[#111] border border-[#ff00ff] text-[#ff00ff] hover:bg-[#ff00ff] hover:text-black font-bold text-[11px] flex items-center justify-center gap-1 transition-all"
              >
                <Shuffle className="w-3.5 h-3.5" />
                <span>NGẪU NHIÊN 🎲</span>
              </button>
              <button
                onClick={() => { playSound.click(settings.retroSound); setAvatar({ ...initialAvatar }); }}
                className="py-1.5 bg-[#111] border border-[#888] text-[#aaa] hover:bg-white hover:text-black font-bold text-[11px] flex items-center justify-center gap-1 transition-all"
              >
                <RefreshCw className="w-3.5 h-3.5" />
                <span>MẶC ĐỊNH</span>
              </button>
            </div>

          </div>

          {/* RIGHT COLUMN: DETAILED CUSTOMIZATION TABS & CONTROLS (8 COLS) */}
          <div className="lg:col-span-8 bg-[#0a0f0a] border-2 border-[#00ff41] p-4 flex flex-col justify-between space-y-4">
            
            {/* Customization Navigation Tabs */}
            <div className="flex flex-wrap gap-1 border-b border-[#00ff41]/40 pb-2">
              {[
                { id: 'body', label: '👤 Hình Thể & Da' },
                { id: 'hair', label: '✂️ Kiểu & Màu Tóc' },
                { id: 'outfit', label: '🥋 Trang Phục' },
                { id: 'accessory', label: '👓 Phụ Kiện' },
                { id: 'headgear', label: '🎓 Mũ & Tai Nghe' },
                { id: 'item', label: '💼 Cầm Tay' },
                { id: 'companion', label: '🐾 Thú Cưng' },
                { id: 'title', label: '🏷️ Danh Hiệu' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => { playSound.click(settings.retroSound); setActiveTab(tab.id as any); }}
                  className={`px-2.5 py-1 text-[11px] font-bold transition-all border ${
                    activeTab === tab.id
                      ? 'bg-[#00ff41] text-[#000] border-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.4)]'
                      : 'bg-[#111] text-[#00ff41] border-[#00ff41]/40 hover:bg-[#00ff41]/20'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* TAB CONTENTS CONTAINER */}
            <div className="space-y-4 flex-1 min-h-[280px]">
              
              {/* TAB 1: BODY & SKIN & EXPRESSION */}
              {activeTab === 'body' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Gender / Silhouette */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white uppercase block">
                      1. THIẾT LẬP THỂ LOẠI NHÂN VẬT:
                    </label>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { id: 'male', label: '👦 Nam Sinh / Chàng Trai' },
                        { id: 'female', label: '👧 Nữ Sinh / Cô Gái' },
                        { id: 'cyber', label: '🤖 Cyber Android / Robot' }
                      ].map(g => (
                        <button
                          key={g.id}
                          onClick={() => { playSound.click(settings.retroSound); setAvatar({ ...avatar, gender: g.id as any }); }}
                          className={`p-2 border text-xs font-bold text-left transition-all ${
                            avatar.gender === g.id
                              ? 'bg-[#00ff41] text-black border-[#00ff41]'
                              : 'bg-[#111] text-white border-[#00ff41]/40 hover:border-[#00ff41]'
                          }`}
                        >
                          {g.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Skin Tone Selector */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white uppercase block">
                      2. TÔNG MÀU DA (SKIN TONE):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {SKIN_TONES.map(skin => (
                        <button
                          key={skin.id}
                          onClick={() => { playSound.click(settings.retroSound); setAvatar({ ...avatar, skinTone: skin.id as any }); }}
                          className={`p-2 border flex items-center gap-2 text-xs font-bold transition-all ${
                            avatar.skinTone === skin.id
                              ? 'bg-[#00ff41]/20 border-[#00ff41] text-[#00ff41]'
                              : 'bg-[#111] border-[#00ff41]/30 text-white hover:border-[#00ff41]'
                          }`}
                        >
                          <span
                            className="w-5 h-5 border border-black inline-block shrink-0 shadow-sm"
                            style={{ backgroundColor: skin.color }}
                          />
                          <span className="truncate">{skin.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Expression */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white uppercase block">
                      3. BIỂU CẢM KHUÔN MẶT (FACIAL EXPRESSION):
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                      {EXPRESSIONS.map(exp => (
                        <button
                          key={exp.id}
                          onClick={() => { playSound.click(settings.retroSound); setAvatar({ ...avatar, expression: exp.id as any }); }}
                          className={`p-2 border text-xs font-bold text-left transition-all ${
                            avatar.expression === exp.id
                              ? 'bg-[#ff00ff] text-black border-[#ff00ff]'
                              : 'bg-[#111] text-white border-[#ff00ff]/30 hover:border-[#ff00ff]'
                          }`}
                        >
                          {exp.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: HAIR STYLE & COLOR */}
              {activeTab === 'hair' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Hair Style */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white uppercase block">
                      1. KIỂU TÓC 8-BIT:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {HAIR_STYLES.map(hair => (
                        <button
                          key={hair.id}
                          onClick={() => { playSound.click(settings.retroSound); setAvatar({ ...avatar, hairStyle: hair.id as any }); }}
                          className={`p-2 border text-xs font-bold text-left transition-all ${
                            avatar.hairStyle === hair.id
                              ? 'bg-[#00ff41] text-black border-[#00ff41]'
                              : 'bg-[#111] text-white border-[#00ff41]/40 hover:border-[#00ff41]'
                          }`}
                        >
                          {hair.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Hair Color */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white uppercase block">
                      2. MÀU NHUỘM TÓC:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {HAIR_COLORS.map(color => (
                        <button
                          key={color.id}
                          onClick={() => { playSound.click(settings.retroSound); setAvatar({ ...avatar, hairColor: color.id as any }); }}
                          className={`p-2 border flex items-center gap-2 text-xs font-bold transition-all ${
                            avatar.hairColor === color.id
                              ? 'bg-[#00ff41]/20 border-[#00ff41] text-[#00ff41]'
                              : 'bg-[#111] border-[#00ff41]/30 text-white hover:border-[#00ff41]'
                          }`}
                        >
                          <span
                            className="w-4 h-4 border border-white/50 inline-block shrink-0 shadow-sm"
                            style={{ backgroundColor: color.color }}
                          />
                          <span className="truncate">{color.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: OUTFIT & COLOR */}
              {activeTab === 'outfit' && (
                <div className="space-y-4 animate-fade-in">
                  {/* Outfit Model */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white uppercase block">
                      1. BỘ TRANG PHỤC THỰC TẬP:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {OUTFITS.map(fit => (
                        <button
                          key={fit.id}
                          onClick={() => { playSound.click(settings.retroSound); setAvatar({ ...avatar, outfit: fit.id as any }); }}
                          className={`p-2.5 border text-xs font-bold text-left transition-all ${
                            avatar.outfit === fit.id
                              ? 'bg-[#00ff41] text-black border-[#00ff41]'
                              : 'bg-[#111] text-white border-[#00ff41]/40 hover:border-[#00ff41]'
                          }`}
                        >
                          {fit.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Outfit Color Palette */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white uppercase block">
                      2. BẢNG MÀU TRANG PHỤC:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {OUTFIT_COLORS.map(color => (
                        <button
                          key={color.id}
                          onClick={() => { playSound.click(settings.retroSound); setAvatar({ ...avatar, outfitColor: color.id as any }); }}
                          className={`p-2 border flex items-center gap-2 text-xs font-bold transition-all ${
                            avatar.outfitColor === color.id
                              ? 'bg-[#00ff41]/20 border-[#00ff41] text-[#00ff41]'
                              : 'bg-[#111] border-[#00ff41]/30 text-white hover:border-[#00ff41]'
                          }`}
                        >
                          <span
                            className="w-4 h-4 border border-white/50 inline-block shrink-0 shadow-sm"
                            style={{ backgroundColor: color.color }}
                          />
                          <span className="truncate">{color.label}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: FACIAL ACCESSORIES */}
              {activeTab === 'accessory' && (
                <div className="space-y-3 animate-fade-in">
                  <label className="text-xs font-bold text-white uppercase block">
                    KÍNH & PHỤ KIỆN KHUÔN MẶT:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {ACCESSORIES.map(acc => (
                      <button
                        key={acc.id}
                        onClick={() => { playSound.click(settings.retroSound); setAvatar({ ...avatar, accessory: acc.id as any }); }}
                        className={`p-3 border text-xs font-bold text-left transition-all ${
                          avatar.accessory === acc.id
                            ? 'bg-[#00e5ff] text-black border-[#00e5ff] shadow-[0_0_10px_rgba(0,229,255,0.4)]'
                            : 'bg-[#111] text-white border-[#00e5ff]/30 hover:border-[#00e5ff]'
                        }`}
                      >
                        {acc.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 5: HEADGEAR */}
              {activeTab === 'headgear' && (
                <div className="space-y-3 animate-fade-in">
                  <label className="text-xs font-bold text-white uppercase block">
                    MŨ, VƯƠNG MIỆN & TAI NGHE:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {HEADGEARS.map(gear => (
                      <button
                        key={gear.id}
                        onClick={() => { playSound.click(settings.retroSound); setAvatar({ ...avatar, headgear: gear.id as any }); }}
                        className={`p-3 border text-xs font-bold text-left transition-all ${
                          avatar.headgear === gear.id
                            ? 'bg-[#facc15] text-black border-[#facc15] shadow-[0_0_10px_rgba(250,204,21,0.4)]'
                            : 'bg-[#111] text-white border-[#facc15]/30 hover:border-[#facc15]'
                        }`}
                      >
                        {gear.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: HELD ITEM */}
              {activeTab === 'item' && (
                <div className="space-y-3 animate-fade-in">
                  <label className="text-xs font-bold text-white uppercase block">
                    VẬT PHẨM & DỤNG CỤ NGHỀ NGHIỆP CẦM TAY:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {HELD_ITEMS.map(item => (
                      <button
                        key={item.id}
                        onClick={() => { playSound.click(settings.retroSound); setAvatar({ ...avatar, heldItem: item.id as any }); }}
                        className={`p-3 border text-xs font-bold text-left transition-all ${
                          avatar.heldItem === item.id
                            ? 'bg-[#00ff41] text-black border-[#00ff41] shadow-[0_0_10px_rgba(0,255,65,0.4)]'
                            : 'bg-[#111] text-white border-[#00ff41]/30 hover:border-[#00ff41]'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: COMPANION PET */}
              {activeTab === 'companion' && (
                <div className="space-y-3 animate-fade-in">
                  <label className="text-xs font-bold text-white uppercase block">
                    THÚ CƯNG & BẠN ĐỒNG HÀNH 8-BIT:
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {COMPANIONS.map(comp => (
                      <button
                        key={comp.id}
                        onClick={() => { playSound.click(settings.retroSound); setAvatar({ ...avatar, companion: comp.id as any }); }}
                        className={`p-3 border text-xs font-bold text-left transition-all ${
                          avatar.companion === comp.id
                            ? 'bg-[#ff00ff] text-black border-[#ff00ff] shadow-[0_0_10px_rgba(255,0,255,0.4)]'
                            : 'bg-[#111] text-white border-[#ff00ff]/30 hover:border-[#ff00ff]'
                        }`}
                      >
                        {comp.label}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 8: TITLE & NICKNAME */}
              {activeTab === 'title' && (
                <div className="space-y-4 animate-fade-in">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white uppercase block">
                      DANH HIỆU / BIỆT DANH HIỂN THỊ TRÊN HUY HIỆU:
                    </label>
                    <input
                      type="text"
                      value={avatar.title || ''}
                      onChange={(e) => setAvatar({ ...avatar, title: e.target.value.slice(0, 30) })}
                      placeholder="Nhập danh hiệu hoặc chọn gợi ý bên dưới..."
                      className="w-full bg-[#111] border-2 border-[#00ff41] px-3 py-2 text-sm text-[#00ff41] font-bold focus:outline-none focus:ring-2 focus:ring-[#00ff41]"
                      maxLength={30}
                    />
                    <div className="text-[10px] text-[#00ff41]/70 text-right">
                      {(avatar.title || '').length} / 30 ký tự
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-white uppercase block">
                      DANH HIỆU GỢI Ý MẪU:
                    </label>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {PRESET_TITLES.map(title => (
                        <button
                          key={title}
                          onClick={() => { playSound.click(settings.retroSound); setAvatar({ ...avatar, title }); }}
                          className={`p-2 border text-xs font-bold text-left transition-all ${
                            avatar.title === title
                              ? 'bg-[#00ff41] text-black border-[#00ff41]'
                              : 'bg-[#111] text-white border-[#00ff41]/30 hover:border-[#00ff41]'
                          }`}
                        >
                          🎖️ {title}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

            </div>

            {/* Bottom Save & Apply Confirmation Bar */}
            <div className="border-t-2 border-[#00ff41] pt-3 flex flex-wrap items-center justify-between gap-3">
              <div className="text-xs text-[#00ff41]/80 flex items-center gap-1.5">
                <PixelShibaSprite size={20} mood="happy" accessory="cyber_visor" />
                <span>Nhân vật pixel sẽ hiển thị xuyên suốt bàn làm việc, bản đồ và chứng chỉ tốt nghiệp!</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => { playSound.click(settings.retroSound); onClose(); }}
                  className="px-4 py-2 border border-[#888] text-[#aaa] hover:bg-white hover:text-black font-bold text-xs"
                >
                  HỦY BỎ
                </button>
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-[#00ff41] text-black hover:bg-[#00e53a] font-pixel font-bold text-xs uppercase flex items-center gap-1.5 shadow-[0_0_20px_rgba(0,255,65,0.4)] transform hover:scale-105 active:scale-95 transition-all"
                >
                  {saveSuccess ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>ĐÃ LƯU THÀNH CÔNG!</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-4 h-4" />
                      <span>LƯU & ÁP DỤNG NGAY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
