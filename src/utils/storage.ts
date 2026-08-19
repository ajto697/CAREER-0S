import { UserProgress, Settings, HollandTrait, RadarTraits, WeeklyResult, SaveSlot, SaveSlotSummary, PixelAvatarConfig } from '../types';
import { RAW_HOLLAND_QUESTIONS } from '../data/hollandQuestions';

const STORAGE_KEY_PROGRESS = 'CAREEROS_V5_PROGRESS_DATA';
const STORAGE_KEY_SETTINGS = 'CAREEROS_V5_SETTINGS_DATA';
const STORAGE_KEY_SLOTS = 'CAREEROS_V5_ALL_SLOTS';

export const DEFAULT_PIXEL_AVATAR: PixelAvatarConfig = {
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

export const DEFAULT_RADAR: RadarTraits = {
  kiencuong: 20,
  phantich: 20,
  sangtao: 20,
  camthong: 20,
  lanhdao: 20,
  kyluat: 20
};

export const INITIAL_PROGRESS: UserProgress = {
  name: 'Học Sinh',
  school: 'THPT Chuyên',
  className: '12A1',
  currentGate: 'welcome',
  quizScores: { R: 0, I: 0, A: 0, S: 0, E: 0, C: 0 },
  quizAnswers: {},
  quizCompleted: false,
  hollandCode: 'Chưa làm',
  chosenCareer: null,
  currentWeek: 1,
  weeklyResults: {},
  reflections: {},
  radarTraits: { ...DEFAULT_RADAR },
  badges: ['Người Khởi Đầu'],
  reflectionPoints: 0,
  traitHistory: [{ date: new Date().toLocaleDateString('vi-VN'), source: 'Khởi tạo tài khoản', traitsAdded: {} }],
  zodiacSign: 'Xử Nữ',
  customAvatar: { ...DEFAULT_PIXEL_AVATAR }
};

export const INITIAL_SETTINGS: Settings = {
  crtScanlines: true,
  retroSound: true,
  showZodiac: false,
  volume: 80
};

export function loadUserProgress(): UserProgress {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_PROGRESS);
    if (raw) {
      const parsed = JSON.parse(raw);
      return { 
        ...INITIAL_PROGRESS, 
        ...parsed,
        customAvatar: parsed.customAvatar ? { ...DEFAULT_PIXEL_AVATAR, ...parsed.customAvatar } : { ...DEFAULT_PIXEL_AVATAR }
      };
    }
  } catch (e) {
    console.warn('Failed to load storage', e);
  }
  return { ...INITIAL_PROGRESS };
}

export function createSaveSummary(progress: UserProgress): SaveSlotSummary {
  let totalScore = 0;
  Object.values(progress.weeklyResults || {}).forEach(r => { totalScore += (r.score || 0); });

  return {
    playerName: progress.name || 'Học Sinh',
    school: progress.school || 'THPT',
    className: progress.className || '12',
    gate: progress.currentGate,
    week: progress.currentWeek || 1,
    career: progress.chosenCareer,
    hollandCode: progress.hollandCode || 'Chưa có',
    totalScore,
    badgeCount: progress.badges ? progress.badges.length : 0,
    savedAt: new Date().toLocaleString('vi-VN')
  };
}

export function saveUserProgress(data: UserProgress) {
  try {
    localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(data));
    // Auto-save slot update
    saveToSlot('auto', data, 'TỰ ĐỘNG LƯU (AUTO-SAVE)');
  } catch (e) {
    console.warn('Failed to save storage', e);
  }
}

export function getAllSaveSlots(): Record<string, SaveSlot> {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SLOTS);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('Failed to load slots', e);
  }
  return {};
}

export function saveToSlot(slotId: string, progress: UserProgress, customTitle?: string): SaveSlot {
  const slots = getAllSaveSlots();
  
  const careerNameMap: Record<string, string> = {
    edtech: 'EdTech / Dev',
    healthcare: 'Y Tế',
    education: 'Sư Phạm',
    humanities: 'Nhà Báo',
    science: 'Sinh Học'
  };

  const careerLabel = progress.chosenCareer ? (careerNameMap[progress.chosenCareer] || progress.chosenCareer) : 'Chưa chọn ngành';
  const defaultTitle = `${progress.name || 'Player'} - W${progress.currentWeek} (${careerLabel})`;

  const slot: SaveSlot = {
    id: slotId,
    title: customTitle || defaultTitle,
    timestamp: new Date().toLocaleString('vi-VN'),
    progress: JSON.parse(JSON.stringify(progress)),
    summary: createSaveSummary(progress)
  };

  slots[slotId] = slot;

  try {
    localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(slots));
  } catch (e) {
    console.warn('Failed to save slot', e);
  }

  return slot;
}

export function loadFromSlot(slotId: string): UserProgress | null {
  const slots = getAllSaveSlots();
  if (slots[slotId] && slots[slotId].progress) {
    const loaded = slots[slotId].progress;
    try {
      localStorage.setItem(STORAGE_KEY_PROGRESS, JSON.stringify(loaded));
    } catch (e) {
      console.warn('Error setting current active progress from slot', e);
    }
    return { ...INITIAL_PROGRESS, ...loaded };
  }
  return null;
}

export function deleteSaveSlot(slotId: string): void {
  const slots = getAllSaveSlots();
  if (slots[slotId]) {
    delete slots[slotId];
    try {
      localStorage.setItem(STORAGE_KEY_SLOTS, JSON.stringify(slots));
    } catch (e) {
      console.warn('Failed to delete slot', e);
    }
  }
}

export function exportProgressJSON(progress: UserProgress, filename?: string) {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(progress, null, 2));
  const downloadAnchor = document.createElement('a');
  const safeName = (progress.name || 'Player').replace(/[^a-zA-Z0-9]/g, '_');
  const name = filename || `CAREEROS_SaveData_${safeName}_W${progress.currentWeek}.json`;
  downloadAnchor.setAttribute("href", dataStr);
  downloadAnchor.setAttribute("download", name);
  document.body.appendChild(downloadAnchor);
  downloadAnchor.click();
  downloadAnchor.remove();
}

export function importProgressJSON(jsonString: string): UserProgress {
  const parsed = JSON.parse(jsonString);
  if (!parsed || typeof parsed !== 'object') {
    throw new Error('Định dạng file không hợp lệ');
  }
  const importedProgress: UserProgress = {
    ...INITIAL_PROGRESS,
    ...parsed,
    radarTraits: { ...DEFAULT_RADAR, ...(parsed.radarTraits || {}) }
  };

  saveUserProgress(importedProgress);
  return importedProgress;
}

export function loadSettings(): Settings {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_SETTINGS);
    if (raw) {
      return { ...INITIAL_SETTINGS, ...JSON.parse(raw) };
    }
  } catch (e) {
    console.warn('Failed to load settings', e);
  }
  return { ...INITIAL_SETTINGS };
}

export function saveSettings(settings: Settings) {
  try {
    localStorage.setItem(STORAGE_KEY_SETTINGS, JSON.stringify(settings));
  } catch (e) {
    console.warn('Failed to save settings', e);
  }
}

export function calculateHollandCode(scores: Record<HollandTrait, number>): string {
  const sorted = (Object.keys(scores) as HollandTrait[]).sort((a, b) => scores[b] - scores[a]);
  if (scores[sorted[0]] === 0) return 'Chưa có';
  return sorted.slice(0, 3).join('');
}

export function calculateRadarFromScores(
  quizScores: Record<HollandTrait, number>,
  weeklyResults: Record<string, WeeklyResult>
): RadarTraits {
  const radar: RadarTraits = {
    kiencuong: Math.round((quizScores.R || 0) * 1.5) + 15,
    phantich: Math.round((quizScores.I || 0) * 1.5) + 15,
    sangtao: Math.round((quizScores.A || 0) * 1.5) + 15,
    camthong: Math.round((quizScores.S || 0) * 1.5) + 15,
    lanhdao: Math.round((quizScores.E || 0) * 1.5) + 15,
    kyluat: Math.round((quizScores.C || 0) * 1.5) + 15
  };

  Object.values(weeklyResults).forEach(res => {
    if (res.traitsEarned) {
      if (res.traitsEarned.kiencuong) radar.kiencuong += res.traitsEarned.kiencuong;
      if (res.traitsEarned.phantich) radar.phantich += res.traitsEarned.phantich;
      if (res.traitsEarned.sangtao) radar.sangtao += res.traitsEarned.sangtao;
      if (res.traitsEarned.camthong) radar.camthong += res.traitsEarned.camthong;
      if (res.traitsEarned.lanhdao) radar.lanhdao += res.traitsEarned.lanhdao;
      if (res.traitsEarned.kyluat) radar.kyluat += res.traitsEarned.kyluat;
    }
  });

  return radar;
}

export function exportClassDataCSV(progress: UserProgress): string {
  const headers = [
    'Họ và Tên',
    'Trường',
    'Lớp',
    'Mã Holland',
    'Ngành Đã Chọn',
    'Tuần Hiện Tại',
    'Tổng Điểm Thực Tập',
    'Điểm Phản Tư (SP)',
    'Kiên Cường',
    'Phân Tích',
    'Sáng Tạo',
    'Cảm Thông',
    'Lãnh Đạo',
    'Kỷ Luật',
    'Danh Hiệu Badges'
  ];

  const careerNameMap: Record<string, string> = {
    edtech: 'EdTech / Software Dev',
    healthcare: 'Y Tế / Bác Sĩ',
    education: 'Giáo Dục / Giáo Viên',
    humanities: 'Nhà Báo / Truyền Thông',
    science: 'Khoa Học Tự Nhiên'
  };

  let totalScore = 0;
  Object.values(progress.weeklyResults).forEach(r => { totalScore += r.score; });

  const row = [
    `"${progress.name}"`,
    `"${progress.school}"`,
    `"${progress.className}"`,
    `"${progress.hollandCode}"`,
    `"${careerNameMap[progress.chosenCareer || ''] || 'Chưa chọn'}"`,
    progress.currentWeek,
    totalScore,
    progress.reflectionPoints,
    progress.radarTraits.kiencuong,
    progress.radarTraits.phantich,
    progress.radarTraits.sangtao,
    progress.radarTraits.camthong,
    progress.radarTraits.lanhdao,
    progress.radarTraits.kyluat,
    `"${progress.badges.join(', ')}"`
  ];

  return [headers.join(','), row.join(',')].join('\n');
}
