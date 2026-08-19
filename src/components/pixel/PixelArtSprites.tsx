import React, { useState, useEffect } from 'react';

// ==========================================
// 1. ANIMATED 8-BIT PIXEL SHIBA INU MASCOT
// ==========================================

interface PixelShibaProps {
  size?: number;
  mood?: 'idle' | 'happy' | 'bark' | 'thinking' | 'triumph';
  accessory?: 'none' | 'cyber_visor' | 'grad_cap' | 'headphones';
  className?: string;
}

export const PixelShibaSprite: React.FC<PixelShibaProps> = ({
  size = 48,
  mood = 'idle',
  accessory = 'none',
  className = ''
}) => {
  const [frame, setFrame] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setFrame(prev => (prev + 1) % 4);
    }, 350);
    return () => clearInterval(timer);
  }, []);

  const tailAngle = frame % 2 === 0 ? 'rotate-[-8deg]' : 'rotate-[12deg]';
  const earBounce = frame % 2 === 1 ? '-translate-y-[1px]' : 'translate-y-0';
  const blink = (frame === 3 && mood === 'idle') || mood === 'happy';

  return (
    <div 
      className={`relative inline-block select-none pixelated ${className}`}
      style={{ width: size, height: size }}
    >
      <svg
        viewBox="0 0 24 24"
        width={size}
        height={size}
        className="overflow-visible"
        shapeRendering="crispEdges"
      >
        {/* Pixel Tail with animated wagging */}
        <g className={`origin-bottom-left transition-transform duration-200 ${tailAngle}`}>
          <rect x="2" y="13" width="3" height="3" fill="#d97706" />
          <rect x="1" y="11" width="3" height="3" fill="#f59e0b" />
          <rect x="2" y="10" width="2" height="2" fill="#fff" />
        </g>

        {/* Shiba Body */}
        <rect x="5" y="12" width="13" height="8" fill="#d97706" />
        <rect x="6" y="13" width="11" height="6" fill="#f59e0b" />
        {/* White Belly */}
        <rect x="8" y="14" width="7" height="6" fill="#ffffff" />

        {/* Paws */}
        <rect x="6" y="20" width="3" height="3" fill="#d97706" />
        <rect x="6" y="22" width="3" height="1" fill="#ffffff" />
        <rect x="14" y="20" width="3" height="3" fill="#d97706" />
        <rect x="14" y="22" width="3" height="1" fill="#ffffff" />

        {/* Shiba Head */}
        <g className={`transition-transform duration-150 ${earBounce}`}>
          {/* Ears */}
          <polygon points="6,3 10,3 10,7 6,7" fill="#b45309" />
          <polygon points="7,4 9,4 9,6 7,6" fill="#fecdd3" />
          <polygon points="15,3 19,3 19,7 15,7" fill="#b45309" />
          <polygon points="16,4 18,4 18,6 16,6" fill="#fecdd3" />

          {/* Head Main Shape */}
          <rect x="5" y="5" width="15" height="9" fill="#d97706" />
          <rect x="6" y="6" width="13" height="7" fill="#f59e0b" />

          {/* White Cheeks */}
          <rect x="5" y="9" width="3" height="4" fill="#ffffff" />
          <rect x="17" y="9" width="3" height="4" fill="#ffffff" />
          <rect x="8" y="10" width="9" height="3" fill="#ffffff" />

          {/* Shiba Eyebrows (White dots) */}
          <rect x="8" y="6" width="2" height="1" fill="#ffffff" />
          <rect x="15" y="6" width="2" height="1" fill="#ffffff" />

          {/* Eyes */}
          {blink ? (
            <>
              {/* Happy squint eyes ^^ */}
              <rect x="8" y="8" width="3" height="1" fill="#1e1b4b" />
              <rect x="14" y="8" width="3" height="1" fill="#1e1b4b" />
            </>
          ) : (
            <>
              {/* Normal alert eyes with shine */}
              <rect x="8" y="7" width="2" height="3" fill="#1e1b4b" />
              <rect x="8" y="7" width="1" height="1" fill="#ffffff" />
              <rect x="15" y="7" width="2" height="3" fill="#1e1b4b" />
              <rect x="15" y="7" width="1" height="1" fill="#ffffff" />
            </>
          )}

          {/* Nose & Snout */}
          <rect x="11" y="9" width="3" height="2" fill="#1e1b4b" />
          
          {/* Mouth (Barking or Smile) */}
          {mood === 'bark' || frame % 2 === 1 ? (
            <rect x="11" y="11" width="3" height="2" fill="#ef4444" />
          ) : (
            <rect x="12" y="11" width="1" height="1" fill="#1e1b4b" />
          )}

          {/* Cyber Collar */}
          <rect x="6" y="13" width="13" height="2" fill="#00ff41" />
          <rect x="11" y="13" width="3" height="2" fill="#ff00ff" />

          {/* ACCESSORY: CYBER VISOR */}
          {accessory === 'cyber_visor' && (
            <g>
              <rect x="6" y="7" width="13" height="3" fill="#00e5ff" fillOpacity="0.85" />
              <rect x="8" y="8" width="9" height="1" fill="#ffffff" />
              <rect x="18" y="7" width="2" height="3" fill="#00ff41" />
            </g>
          )}

          {/* ACCESSORY: GRADUATION CAP */}
          {accessory === 'grad_cap' && (
            <g>
              <polygon points="12,0 21,3 12,6 3,3" fill="#0c0c0c" stroke="#ff00ff" strokeWidth="0.5" />
              <rect x="9" y="3" width="6" height="3" fill="#0c0c0c" />
              {/* Gold Tassel */}
              <rect x="5" y="3" width="1" height="4" fill="#fbbf24" />
              <circle cx="5" cy="7" r="0.8" fill="#fbbf24" />
            </g>
          )}

          {/* ACCESSORY: HEADPHONES */}
          {accessory === 'headphones' && (
            <g>
              <rect x="4" y="2" width="17" height="2" fill="#ff00ff" />
              <rect x="3" y="4" width="3" height="6" fill="#00ff41" />
              <rect x="19" y="4" width="3" height="6" fill="#00ff41" />
            </g>
          )}
        </g>
      </svg>
    </div>
  );
};


// ==========================================
// 2. DETAILED 8-BIT PIXEL CHARACTERS
// ==========================================

export type CharacterType = 
  | 'teacher_lan' 
  | 'principal_hung' 
  | 'student_duc' 
  | 'student_minh' 
  | 'student_hoa'
  | 'doctor_medic'
  | 'edtech_coder'
  | 'fact_checker'
  | 'bio_scientist';

interface PixelCharacterProps {
  type: CharacterType;
  size?: number;
  mood?: 'neutral' | 'happy' | 'worried' | 'angry' | 'thinking' | 'proud';
  showSpeech?: string;
  className?: string;
}

export const PixelCharacterSprite: React.FC<PixelCharacterProps> = ({
  type,
  size = 56,
  mood = 'neutral',
  showSpeech,
  className = ''
}) => {
  const [bounce, setBounce] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setBounce(prev => (prev + 1) % 2);
    }, 450);
    return () => clearInterval(timer);
  }, []);

  const renderCharacterSVG = () => {
    switch (type) {
      // 1. CÔ LAN (TEACHER MENTOR)
      case 'teacher_lan':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full pixelated" shapeRendering="crispEdges">
            {/* Bun Hair */}
            <rect x="9" y="1" width="6" height="3" fill="#451a03" />
            <rect x="7" y="3" width="10" height="7" fill="#78350f" />
            {/* Face */}
            <rect x="7" y="5" width="10" height="7" fill="#fde047" />
            {/* Glasses */}
            <rect x="8" y="6" width="3" height="3" fill="none" stroke="#0284c7" strokeWidth="1" />
            <rect x="13" y="6" width="3" height="3" fill="none" stroke="#0284c7" strokeWidth="1" />
            <rect x="11" y="7" width="2" height="1" fill="#0284c7" />
            {/* Eyes */}
            <rect x="9" y="7" width="1" height="1" fill="#0f172a" />
            <rect x="14" y="7" width="1" height="1" fill="#0f172a" />
            {/* Smile / Mouth */}
            <rect x="10" y="10" width="4" height="1" fill={mood === 'happy' || mood === 'proud' ? '#e11d48' : '#78350f'} />
            {/* Teacher Blazer / Ao Dai */}
            <rect x="6" y="12" width="12" height="9" fill="#0284c7" />
            <rect x="9" y="12" width="6" height="4" fill="#ffffff" />
            {/* Mentor Badge */}
            <rect x="7" y="14" width="2" height="2" fill="#fbbf24" />
            {/* Teacher Notebook / Pen */}
            <rect x="15" y="13" width="4" height="6" fill="#f43f5e" />
            <rect x="16" y="14" width="2" height="4" fill="#ffffff" />
            {/* Legs */}
            <rect x="8" y="21" width="3" height="3" fill="#1e293b" />
            <rect x="13" y="21" width="3" height="3" fill="#1e293b" />
          </svg>
        );

      // 2. THẦY HÙNG (PRINCIPAL)
      case 'principal_hung':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full pixelated" shapeRendering="crispEdges">
            {/* Hair with grey streaks */}
            <rect x="7" y="2" width="10" height="4" fill="#475569" />
            <rect x="6" y="4" width="2" height="4" fill="#94a3b8" />
            {/* Face */}
            <rect x="7" y="5" width="10" height="7" fill="#fde047" />
            {/* Eyebrows */}
            <rect x="8" y="5" width="3" height="1" fill="#334155" />
            <rect x="13" y="5" width="3" height="1" fill="#334155" />
            {/* Eyes */}
            <rect x="8" y="7" width="2" height="1" fill="#0f172a" />
            <rect x="14" y="7" width="2" height="1" fill="#0f172a" />
            {/* Glasses */}
            <rect x="7" y="6" width="4" height="3" fill="none" stroke="#d97706" strokeWidth="0.8" />
            <rect x="13" y="6" width="4" height="3" fill="none" stroke="#d97706" strokeWidth="0.8" />
            <rect x="11" y="7" width="2" height="1" fill="#d97706" />
            {/* Suit & Tie */}
            <rect x="5" y="12" width="14" height="9" fill="#1e293b" />
            <rect x="9" y="12" width="6" height="4" fill="#ffffff" />
            <rect x="11" y="12" width="2" height="6" fill="#dc2626" />
            {/* Gold Lapel Pin */}
            <rect x="7" y="13" width="1" height="2" fill="#fbbf24" />
            {/* Shoes */}
            <rect x="7" y="21" width="4" height="3" fill="#0f172a" />
            <rect x="13" y="21" width="4" height="3" fill="#0f172a" />
          </svg>
        );

      // 3. EM ĐỨC (REBELLIOUS / CREATIVE STUDENT)
      case 'student_duc':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full pixelated" shapeRendering="crispEdges">
            {/* Backwards Cap / Hair */}
            <rect x="6" y="2" width="11" height="4" fill="#ea580c" />
            <rect x="15" y="3" width="4" height="2" fill="#ea580c" />
            {/* Face */}
            <rect x="7" y="5" width="10" height="7" fill="#fde047" />
            {/* Headphones */}
            <rect x="6" y="3" width="12" height="1" fill="#06b6d4" />
            <rect x="5" y="4" width="2" height="5" fill="#06b6d4" />
            <rect x="17" y="4" width="2" height="5" fill="#06b6d4" />
            {/* Eyes */}
            {mood === 'angry' ? (
              <>
                <polygon points="8,7 10,8 8,8" fill="#0f172a" />
                <polygon points="16,7 14,8 16,8" fill="#0f172a" />
              </>
            ) : (
              <>
                <rect x="9" y="7" width="2" height="2" fill="#0f172a" />
                <rect x="14" y="7" width="2" height="2" fill="#0f172a" />
              </>
            )}
            {/* Smirk */}
            <rect x="11" y="10" width="3" height="1" fill="#78350f" />
            {/* Streetwear Hoodie */}
            <rect x="6" y="12" width="12" height="9" fill="#16a34a" />
            <rect x="10" y="12" width="4" height="6" fill="#000000" />
            <rect x="11" y="13" width="2" height="2" fill="#ffffff" />
            {/* Sneakers */}
            <rect x="7" y="21" width="4" height="3" fill="#dc2626" />
            <rect x="13" y="21" width="4" height="3" fill="#dc2626" />
          </svg>
        );

      // 4. EM MINH (THOUGHTFUL / SHY STUDENT)
      case 'student_minh':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full pixelated" shapeRendering="crispEdges">
            {/* Neat Black Hair */}
            <rect x="7" y="2" width="10" height="5" fill="#0f172a" />
            {/* Face */}
            <rect x="7" y="5" width="10" height="7" fill="#fde047" />
            {/* Round Glasses */}
            <rect x="8" y="6" width="3" height="3" fill="none" stroke="#64748b" strokeWidth="1" />
            <rect x="13" y="6" width="3" height="3" fill="none" stroke="#64748b" strokeWidth="1" />
            <rect x="11" y="7" width="2" height="1" fill="#64748b" />
            {/* Eyes */}
            <rect x="9" y="7" width="1" height="1" fill="#0f172a" />
            <rect x="14" y="7" width="1" height="1" fill="#0f172a" />
            {/* Shy Blush & Mouth */}
            <rect x="7" y="9" width="2" height="1" fill="#fda4af" />
            <rect x="15" y="9" width="2" height="1" fill="#fda4af" />
            <rect x="10" y="10" width="4" height="1" fill="#78350f" />
            {/* Uniform Shirt & Vest */}
            <rect x="6" y="12" width="12" height="9" fill="#0284c7" />
            <rect x="10" y="12" width="4" height="7" fill="#ffffff" />
            <rect x="11" y="13" width="2" height="4" fill="#0284c7" />
            {/* Holding Notebook */}
            <rect x="14" y="14" width="4" height="5" fill="#f59e0b" />
            {/* Pants */}
            <rect x="8" y="21" width="3" height="3" fill="#1e293b" />
            <rect x="13" y="21" width="3" height="3" fill="#1e293b" />
          </svg>
        );

      // 5. EM HOA (CLASS MONITOR / DILIGENT)
      case 'student_hoa':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full pixelated" shapeRendering="crispEdges">
            {/* Hair with Pink Bow */}
            <rect x="6" y="2" width="12" height="6" fill="#451a03" />
            <rect x="15" y="2" width="3" height="3" fill="#ec4899" />
            {/* Side Ponytail */}
            <rect x="4" y="4" width="3" height="7" fill="#451a03" />
            {/* Face */}
            <rect x="7" y="5" width="10" height="7" fill="#fde047" />
            {/* Bright Big Eyes */}
            <rect x="8" y="7" width="2" height="2" fill="#0f172a" />
            <rect x="8" y="7" width="1" height="1" fill="#ffffff" />
            <rect x="14" y="7" width="2" height="2" fill="#0f172a" />
            <rect x="14" y="7" width="1" height="1" fill="#ffffff" />
            {/* Cheerful Smile */}
            <rect x="10" y="10" width="4" height="1" fill="#e11d48" />
            {/* School Uniform */}
            <rect x="6" y="12" width="12" height="9" fill="#ffffff" />
            <rect x="9" y="12" width="6" height="5" fill="#e11d48" />
            {/* Class Leader Armband */}
            <rect x="6" y="14" width="2" height="2" fill="#e11d48" />
            {/* Shoes */}
            <rect x="8" y="21" width="3" height="3" fill="#0f172a" />
            <rect x="13" y="21" width="3" height="3" fill="#0f172a" />
          </svg>
        );

      // 6. DOCTOR / MEDIC
      case 'doctor_medic':
      case 'doctor_truong':
      case 'doctor_nam':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full pixelated" shapeRendering="crispEdges">
            {/* Medical Cap */}
            <rect x="7" y="2" width="10" height="4" fill="#06b6d4" />
            <rect x="10" y="2" width="4" height="2" fill="#ffffff" />
            <rect x="11" y="2" width="2" height="2" fill="#ef4444" />
            {/* Face */}
            <rect x="7" y="5" width="10" height="7" fill="#fde047" />
            <rect x="8" y="7" width="2" height="2" fill="#0f172a" />
            <rect x="14" y="7" width="2" height="2" fill="#0f172a" />
            {/* Mask or Stethoscope */}
            <rect x="8" y="9" width="8" height="3" fill="#e0f2fe" />
            {/* Scrubs */}
            <rect x="6" y="12" width="12" height="9" fill="#0891b2" />
            <rect x="9" y="13" width="6" height="6" fill="#ffffff" />
            {/* Stethoscope */}
            <path d="M 8 13 L 8 16 Q 12 19 16 16 L 16 13" stroke="#e2e8f0" strokeWidth="1" fill="none" />
            <circle cx="12" cy="18" r="1" fill="#e2e8f0" />
            {/* Pants */}
            <rect x="7" y="21" width="4" height="3" fill="#0e7490" />
            <rect x="13" y="21" width="4" height="3" fill="#0e7490" />
          </svg>
        );

      // 6B. NURSE MAI / HUONG (PEER COLLEAGUE HEALTHCARE)
      case 'nurse_mai':
      case 'nurse_huong':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full pixelated" shapeRendering="crispEdges">
            {/* Nurse Cap with Red Cross */}
            <rect x="7" y="2" width="10" height="4" fill="#ffffff" />
            <rect x="11" y="3" width="2" height="2" fill="#ef4444" />
            {/* Hair */}
            <rect x="6" y="4" width="12" height="4" fill="#451a03" />
            {/* Face */}
            <rect x="7" y="5" width="10" height="7" fill="#fde047" />
            <rect x="8" y="7" width="2" height="2" fill="#0f172a" />
            <rect x="14" y="7" width="2" height="2" fill="#0f172a" />
            <rect x="10" y="10" width="4" height="1" fill="#e11d48" />
            {/* Cyan Scrubs Uniform */}
            <rect x="6" y="12" width="12" height="9" fill="#06b6d4" />
            <rect x="9" y="12" width="6" height="4" fill="#ffffff" />
            {/* Medical Clipboard */}
            <rect x="15" y="14" width="4" height="5" fill="#f59e0b" />
            <rect x="16" y="15" width="2" height="3" fill="#ffffff" />
            {/* Shoes */}
            <rect x="7" y="21" width="4" height="3" fill="#ffffff" />
            <rect x="13" y="21" width="4" height="3" fill="#ffffff" />
          </svg>
        );

      // 7. EDTECH CODER / TECH LEAD VU
      case 'edtech_coder':
      case 'tech_lead_vu':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full pixelated" shapeRendering="crispEdges">
            {/* Cyber Cap / Hair */}
            <rect x="7" y="2" width="10" height="4" fill="#059669" />
            {/* Cyber Visor */}
            <rect x="6" y="6" width="12" height="3" fill="#00ff41" />
            <rect x="8" y="7" width="8" height="1" fill="#ffffff" />
            {/* Cyber Hoodie */}
            <rect x="6" y="11" width="12" height="10" fill="#0f172a" />
            <rect x="9" y="12" width="6" height="5" fill="#00ff41" />
            <text x="9" y="15" fontSize="3" fill="#000" fontFamily="monospace">JS</text>
            {/* Glowing Laptop */}
            <rect x="6" y="15" width="12" height="5" fill="#334155" />
            <rect x="7" y="16" width="10" height="3" fill="#00ff41" />
            {/* Shoes */}
            <rect x="7" y="21" width="4" height="3" fill="#00ff41" />
            <rect x="13" y="21" width="4" height="3" fill="#00ff41" />
          </svg>
        );

      // 7B. JUNIOR DEV NAM (PEER COLLEAGUE EDTECH)
      case 'junior_dev_nam':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full pixelated" shapeRendering="crispEdges">
            {/* Messy Brown Hair */}
            <rect x="6" y="2" width="12" height="5" fill="#78350f" />
            {/* Face */}
            <rect x="7" y="5" width="10" height="7" fill="#fde047" />
            {/* Blue Gaming Headset */}
            <rect x="5" y="4" width="2" height="5" fill="#3b82f6" />
            <rect x="17" y="4" width="2" height="5" fill="#3b82f6" />
            <rect x="6" y="2" width="12" height="1" fill="#3b82f6" />
            {/* Eyes */}
            <rect x="8" y="7" width="2" height="2" fill="#0f172a" />
            <rect x="14" y="7" width="2" height="2" fill="#0f172a" />
            {/* Mouth */}
            <rect x="10" y="10" width="4" height="1" fill="#78350f" />
            {/* T-Shirt */}
            <rect x="6" y="12" width="12" height="9" fill="#1e293b" />
            <rect x="10" y="13" width="4" height="4" fill="#38bdf8" />
            {/* Holding Bubble Tea / Coffee */}
            <rect x="15" y="15" width="3" height="4" fill="#f59e0b" />
            <rect x="16" y="13" width="1" height="2" fill="#ef4444" />
            {/* Shoes */}
            <rect x="7" y="21" width="4" height="3" fill="#3b82f6" />
            <rect x="13" y="21" width="4" height="3" fill="#3b82f6" />
          </svg>
        );

      // 8. FACT CHECKER / JOURNALIST / EDITOR THANH
      case 'fact_checker':
      case 'chief_editor_thanh':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full pixelated" shapeRendering="crispEdges">
            {/* Detective / Reporter Hat */}
            <rect x="5" y="2" width="14" height="2" fill="#78350f" />
            <rect x="7" y="1" width="10" height="3" fill="#92400e" />
            {/* Press Card tucked in hat */}
            <rect x="14" y="1" width="3" height="3" fill="#ffffff" />
            <rect x="15" y="2" width="1" height="1" fill="#ef4444" />
            {/* Face */}
            <rect x="7" y="4" width="10" height="7" fill="#fde047" />
            <rect x="8" y="6" width="2" height="2" fill="#0f172a" />
            <rect x="14" y="6" width="2" height="2" fill="#0f172a" />
            {/* Trench Coat */}
            <rect x="6" y="11" width="12" height="10" fill="#b45309" />
            <rect x="10" y="11" width="4" height="6" fill="#ffffff" />
            {/* Magnifying Glass */}
            <circle cx="16" cy="15" r="2.5" stroke="#38bdf8" strokeWidth="1" fill="#e0f2fe" fillOpacity="0.5" />
            <rect x="18" y="17" width="2" height="4" fill="#78350f" transform="rotate(45 18 17)" />
            {/* Shoes */}
            <rect x="7" y="21" width="4" height="3" fill="#451a03" />
            <rect x="13" y="21" width="4" height="3" fill="#451a03" />
          </svg>
        );

      // 8B. REPORTER LONG (PEER COLLEAGUE JOURNALISM)
      case 'reporter_long':
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full pixelated" shapeRendering="crispEdges">
            {/* Cap */}
            <rect x="6" y="2" width="11" height="3" fill="#047857" />
            <rect x="14" y="3" width="4" height="2" fill="#047857" />
            {/* Face */}
            <rect x="7" y="5" width="10" height="7" fill="#fde047" />
            <rect x="8" y="7" width="2" height="2" fill="#0f172a" />
            <rect x="14" y="7" width="2" height="2" fill="#0f172a" />
            {/* Reporter Vest */}
            <rect x="6" y="12" width="12" height="9" fill="#065f46" />
            <rect x="9" y="12" width="6" height="5" fill="#d1fae5" />
            {/* DSLR Camera Hanging */}
            <rect x="10" y="15" width="4" height="3" fill="#0f172a" />
            <circle cx="12" cy="16.5" r="1" fill="#38bdf8" />
            {/* Shoes */}
            <rect x="7" y="21" width="4" height="3" fill="#064e3b" />
            <rect x="13" y="21" width="4" height="3" fill="#064e3b" />
          </svg>
        );

      // 9. BIO SCIENTIST / PROFESSOR TRINH
      case 'bio_scientist':
      case 'professor_trinh':
      case 'scientist_ha':
      default:
        return (
          <svg viewBox="0 0 24 24" className="w-full h-full pixelated" shapeRendering="crispEdges">
            {/* Hair */}
            <rect x="7" y="2" width="10" height="4" fill="#6d28d9" />
            {/* Safety Goggles */}
            <rect x="6" y="5" width="12" height="4" fill="#a855f7" />
            <rect x="7" y="6" width="4" height="2" fill="#22c55e" />
            <rect x="13" y="6" width="4" height="2" fill="#22c55e" />
            {/* Lab Coat */}
            <rect x="6" y="10" width="12" height="11" fill="#ffffff" />
            <rect x="10" y="10" width="4" height="5" fill="#a855f7" />
            {/* Chemical Test Tube Flask in Hand */}
            <path d="M 15 13 L 17 13 L 18 17 L 14 17 Z" fill="#22c55e" stroke="#000" strokeWidth="0.5" />
            <rect x="15" y="12" width="2" height="2" fill="#e2e8f0" />
            {/* Shoes */}
            <rect x="7" y="21" width="4" height="3" fill="#334155" />
            <rect x="13" y="21" width="4" height="3" fill="#334155" />
          </svg>
        );
    }
  };

  return (
    <div className={`relative inline-flex flex-col items-center select-none ${className}`}>
      {/* Optional Pixel Speech Bubble */}
      {showSpeech && (
        <div className="absolute bottom-full mb-1 bg-[#000] border-2 border-[#00ff41] px-2 py-1 text-[10px] text-[#00ff41] font-mono whitespace-nowrap shadow-[0_0_10px_#00ff41] z-20 animate-fade-in">
          <span>{showSpeech}</span>
          <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-2 h-2 bg-[#000] border-r-2 border-b-2 border-[#00ff41] rotate-45" />
        </div>
      )}

      {/* Character Sprite Frame */}
      <div 
        className={`transition-transform duration-200 ${bounce ? 'translate-y-[-2px]' : 'translate-y-0'}`}
        style={{ width: size, height: size }}
      >
        {renderCharacterSVG()}
      </div>
    </div>
  );
};


// ==========================================
// 3. 8-BIT PIXEL BUILDING & CITY GRAPHICS
// ==========================================

interface PixelBuildingProps {
  type?: 'school' | 'hospital' | 'tech_tower' | 'media_hq' | 'bio_lab' | 'court' | 'art_studio' | 'business' | 'logistics' | 'agriculture' | 'defense' | 'factory';
  name: string;
  code: string;
  floors?: number;
  active?: boolean;
  color?: string;
  height?: number;
  hollandCode?: string;
  salary?: string;
  majorsCount?: number;
  onClick?: () => void;
  className?: string;
}

export const PixelBuildingSprite: React.FC<PixelBuildingProps> = ({
  type = 'tech_tower',
  name,
  code,
  floors = 4,
  active = false,
  color = '#00ff41',
  height = 190,
  hollandCode = '',
  salary = '',
  majorsCount = 0,
  onClick,
  className = ''
}) => {
  const [lightBlink, setLightBlink] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setLightBlink(prev => (prev + 1) % 8);
    }, 400);
    return () => clearInterval(timer);
  }, []);

  // Architectural Roof and Spire Rendering
  const renderRoofFeature = () => {
    switch (type) {
      case 'school':
        return (
          <div className="flex flex-col items-center mb-0.5">
            {/* Vietnamese Traditional Eaves / University Bell Dome */}
            <div className="w-16 h-2 bg-[#b91c1c] border border-[#fef08a] flex items-center justify-center relative">
              <div className="absolute -top-1 w-8 h-2 bg-[#dc2626] border border-[#fef08a]" />
              <div className="text-[10px]">🎓</div>
            </div>
            <div className="w-1.5 h-1.5 bg-[#facc15] animate-pulse" />
          </div>
        );
      case 'hospital':
        return (
          <div className="flex flex-col items-center mb-0.5">
            {/* Emergency Helipad with Red Cross */}
            <div className="w-16 h-3 bg-[#1e293b] border-2 border-[#ef4444] flex items-center justify-center gap-1 shadow-[0_0_8px_#ef4444]">
              <span className="text-[8px] text-[#ef4444] font-black">H</span>
              <div className="w-1.5 h-1.5 bg-[#ef4444] animate-ping" />
            </div>
            <div className="w-0.5 h-2 bg-[#64748b]" />
          </div>
        );
      case 'tech_tower':
        return (
          <div className="flex flex-col items-center mb-0.5">
            {/* Cyber Antenna Spire with Laser Rings */}
            <div className="w-1.5 h-1.5 bg-[#00ff41] shadow-[0_0_8px_#00ff41]" />
            <div className="w-0.5 h-4 bg-[#00ff41] relative">
              <div className="absolute top-1 -left-2 w-4 h-0.5 bg-[#00ff41]/80" />
              <div className="absolute top-2 -left-3 w-6 h-0.5 bg-[#00e5ff]" />
            </div>
            <div className="w-14 h-2 bg-[#0c1a0c] border border-[#00ff41] flex items-center justify-center text-[7px] text-[#00ff41] font-mono">
              AI MATRIX
            </div>
          </div>
        );
      case 'bio_lab':
        return (
          <div className="flex flex-col items-center mb-0.5">
            {/* Biosphere Dome with DNA Coil */}
            <div className="w-12 h-4 bg-[#0284c7]/40 border-2 border-[#38bdf8] rounded-t-full flex items-center justify-center shadow-[0_0_10px_#38bdf8]">
              <span className="text-[9px]">🧬</span>
            </div>
            <div className="w-14 h-1.5 bg-[#0f172a] border border-[#38bdf8]" />
          </div>
        );
      case 'media_hq':
        return (
          <div className="flex flex-col items-center mb-0.5">
            {/* Satellite Dish & Live Broadcast Beacon */}
            <div className="flex items-center gap-1">
              <div className="w-4 h-4 rounded-full border-2 border-[#ff00ff] bg-black flex items-center justify-center rotate-45">
                <div className="w-1.5 h-1.5 bg-[#ff00ff] rounded-full animate-ping" />
              </div>
              <span className="text-[8px] bg-[#ff00ff] text-black font-bold px-1">LIVE</span>
            </div>
            <div className="w-0.5 h-2 bg-[#666]" />
          </div>
        );
      case 'business':
        return (
          <div className="flex flex-col items-center mb-0.5">
            {/* Luxury Glass Crown with Golden Spire */}
            <div className="w-1.5 h-2 bg-[#facc15] shadow-[0_0_8px_#facc15]" />
            <div className="w-16 h-3 bg-[#1e1b4b] border border-[#facc15] flex items-center justify-center text-[8px] text-[#facc15] font-bold">
              STOCK HQ
            </div>
          </div>
        );
      case 'court':
        return (
          <div className="flex flex-col items-center mb-0.5">
            {/* Classical Pediment & Scales */}
            <div className="w-16 h-3 bg-[#334155] border border-[#94a3b8] flex items-center justify-center text-[9px]">
              ⚖️
            </div>
          </div>
        );
      default:
        return (
          <div className="flex flex-col items-center mb-0.5">
            <div className={`w-1.5 h-1.5 ${lightBlink % 2 === 0 ? 'bg-[#ff0044]' : 'bg-[#00ff41]'} shadow-[0_0_8px_#00ff41]`} />
            <div className="w-0.5 h-3 bg-[#666]" />
          </div>
        );
    }
  };

  return (
    <div
      onClick={onClick}
      className={`group flex flex-col items-center cursor-pointer transition-all duration-200 ${className}`}
    >
      {/* Rooftop Architecture */}
      {renderRoofFeature()}

      {/* Building Body Frame */}
      <div 
        className={`w-32 sm:w-36 bg-[#060a06] border-2 flex flex-col justify-between p-1.5 transition-all relative overflow-hidden ${
          active 
            ? 'border-[#00ff41] shadow-[0_0_30px_rgba(0,255,65,0.7)] scale-105 z-20 bg-[#0b140b]' 
            : 'border-[#00ff41]/40 group-hover:border-[#00ff41] opacity-90 group-hover:opacity-100 hover:shadow-[0_0_18px_rgba(0,255,65,0.35)]'
        }`}
        style={{ height: `${height}px` }}
      >
        {/* Subtle matrix scanline inside tower */}
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_bottom,transparent_50%,rgba(0,255,65,0.4)_51%)] [background-size:100%_4px] pointer-events-none" />

        {/* Top Header Banner: MOET Code & Holland */}
        <div className="w-full bg-[#000] border border-[#00ff41]/60 py-0.5 px-1 flex items-center justify-between text-[8px] font-pixel font-bold z-10">
          <span className="text-[#00ff41]">MÃ {code}</span>
          {hollandCode && (
            <span className="text-[#ff00ff] bg-[#111] px-1 border border-[#ff00ff]/40">
              {hollandCode}
            </span>
          )}
        </div>

        {/* Windows Grid Matrix with Animated Office Lights */}
        <div className="grid grid-cols-4 gap-1.5 my-auto px-1 py-1.5 z-10">
          {Array.from({ length: Math.max(8, floors * 3) }).map((_, idx) => {
            const isLit = (idx + lightBlink) % 3 === 0 || (idx + lightBlink) % 4 === 0;
            const windowColor = isLit ? color : 'rgba(255,255,255,0.08)';

            return (
              <div
                key={idx}
                className="h-3.5 border border-black/50 transition-colors duration-300 relative flex items-center justify-center overflow-hidden"
                style={{
                  backgroundColor: windowColor,
                  boxShadow: isLit ? `0 0 6px ${color}` : 'none'
                }}
              >
                {/* Silhouette in lit window */}
                {isLit && (idx % 5 === 0) && (
                  <div className="w-1.5 h-2 bg-black/70 rounded-t-sm" />
                )}
              </div>
            );
          })}
        </div>

        {/* Middle Glowing LED Sign for Building Theme */}
        <div className="w-full bg-[#000] border-y border-[#00ff41]/40 py-0.5 px-1 text-center text-[7px] text-[#ffea00] font-mono truncate z-10">
          {floors} TẦNG NHÓM NGÀNH
        </div>

        {/* Ground Floor Main Entrance Lobby */}
        <div className="w-full h-8 bg-[#000] border border-[#00ff41]/70 flex items-center justify-between px-2 z-10">
          {/* Street Lamp Post */}
          <div className="flex flex-col items-center">
            <div className="w-1.5 h-1.5 rounded-full bg-[#ffea00] shadow-[0_0_6px_#ffea00]" />
            <div className="w-0.5 h-3 bg-[#444]" />
          </div>

          {/* Automatic Glass Sliding Door */}
          <div className="w-8 h-6 bg-[#00ff41]/20 border border-[#00ff41] flex items-center justify-center relative overflow-hidden">
            <div className="w-0.5 h-full bg-[#00ff41]" />
            <div className="absolute inset-0 bg-[#00ff41]/10 animate-pulse" />
          </div>

          {/* Planter pot / Vietnamese Lotus Bowl */}
          <div className="w-3 h-3 bg-[#78350f] border border-[#d97706] flex items-center justify-center text-[7px]">
            🌱
          </div>
        </div>
      </div>

      {/* Building Bottom Label */}
      <div className="mt-2 text-center w-32 sm:w-36">
        <div className={`text-[11px] font-bold truncate font-pixel ${active ? 'text-white' : 'text-[#00ff41]'}`}>
          {name}
        </div>
        <div className="text-[9px] text-[#00ff41]/70 font-mono flex items-center justify-center gap-1">
          {majorsCount > 0 && <span>{majorsCount} Ngành ĐH</span>}
          {salary && <span className="text-[#ff00ff]">({salary})</span>}
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 4. INTERACTIVE PIXEL RETRO CITY SKYLINE
// ==========================================

export const PixelCitySkyline: React.FC<{ 
  timeMode?: 'night' | 'sunset' | 'dawn';
  className?: string;
}> = ({ 
  timeMode = 'night',
  className = '' 
}) => {
  const [starPulse, setStarPulse] = useState<number>(0);
  const [metroPos, setMetroPos] = useState<number>(0);
  const [dronePos, setDronePos] = useState<number>(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setStarPulse(prev => (prev + 1) % 100);
      setMetroPos(prev => (prev + 1.2) % 120);
      setDronePos(prev => (prev + 0.8) % 100);
    }, 150);
    return () => clearInterval(timer);
  }, []);

  // Theme palettes
  const bgGradient = {
    night: 'bg-[radial-gradient(ellipse_at_top,_#0a1812_0%,_#020403_100%)]',
    sunset: 'bg-[radial-gradient(ellipse_at_top,_#3b0764_0%,_#1e1b4b_50%,_#020403_100%)]',
    dawn: 'bg-[radial-gradient(ellipse_at_top,_#064e3b_0%,_#062e24_50%,_#020403_100%)]'
  }[timeMode];

  return (
    <div className={`relative w-full h-36 sm:h-44 ${bgGradient} overflow-hidden border-b-2 border-[#00ff41] pixelated ${className}`}>
      {/* Twinkling Star Matrix Background */}
      <div className="absolute inset-0 pixel-stars-bg opacity-75" />

      {/* Dynamic Celestial Body (Moon/Sun) */}
      {timeMode === 'night' ? (
        <div className="absolute top-3 right-10 w-12 h-12 bg-[#ffea00] border-2 border-[#fef08a] shadow-[0_0_25px_#ffea00] flex items-center justify-center">
          <div className="w-8 h-8 bg-[#030608] rounded-full translate-x-2 -translate-y-1" />
        </div>
      ) : timeMode === 'sunset' ? (
        <div className="absolute top-4 right-12 w-14 h-14 bg-[#f97316] rounded-full border-2 border-[#fdba74] shadow-[0_0_35px_#f97316]" />
      ) : (
        <div className="absolute top-3 right-12 w-12 h-12 bg-[#34d399] rounded-full border-2 border-[#6ee7b7] shadow-[0_0_30px_#34d399]" />
      )}

      {/* Cyber Radio Tower with Pulsing Signal Rings */}
      <div className="absolute top-2 left-8 flex flex-col items-center opacity-80 pointer-events-none">
        <div className="w-2 h-2 rounded-full bg-[#ef4444] shadow-[0_0_10px_#ef4444] animate-ping" />
        <div className="w-0.5 h-10 bg-[#475569]" />
        <div className="w-6 h-0.5 bg-[#475569]" />
      </div>

      {/* Flying Cyber AI Delivery Drone */}
      <div 
        className="absolute top-7 transition-all duration-200 pointer-events-none flex items-center gap-1.5 z-20"
        style={{ left: `${dronePos}%` }}
      >
        <div className="px-1.5 py-0.5 bg-[#ff00ff] border border-white shadow-[0_0_10px_#ff00ff] text-[7px] text-black font-black">
          AI DRONE
        </div>
        <div className="w-2 h-0.5 bg-[#00ff41] animate-ping" />
      </div>

      {/* Distant Futuristic Skyline Silhouette */}
      <div className="absolute bottom-12 inset-x-0 flex items-end justify-between opacity-35 px-4 pointer-events-none z-0">
        <div className="w-12 h-24 bg-[#022c22] border-t-2 border-[#00ff41]" />
        <div className="w-16 h-32 bg-[#0c1a2e] border-t-2 border-[#00e5ff]" />
        <div className="w-20 h-20 bg-[#2e1065] border-t-2 border-[#ff00ff]" />
        <div className="w-14 h-36 bg-[#022c22] border-t-2 border-[#00ff41]" />
        <div className="w-18 h-28 bg-[#451a03] border-t-2 border-[#ffaa00]" />
        <div className="w-12 h-22 bg-[#022c22] border-t-2 border-[#00ff41]" />
      </div>

      {/* Elevated Viaduct Track for Cyber Metro Skytrain */}
      <div className="absolute bottom-6 inset-x-0 h-6 bg-[#090d09]/90 border-y border-[#00ff41]/50 flex items-center z-10">
        {/* Support Pillars */}
        <div className="w-full flex justify-around">
          {Array.from({ length: 12 }).map((_, i) => (
            <div key={i} className="w-2 h-6 bg-[#1e293b] border-x border-[#00ff41]/30" />
          ))}
        </div>

        {/* Animated Moving Cyber Metro Train */}
        <div 
          className="absolute flex items-center gap-1 transition-all duration-200"
          style={{ left: `${metroPos - 20}%` }}
        >
          {/* Train Engine */}
          <div className="w-12 h-4 bg-[#00ff41] border border-white shadow-[0_0_12px_#00ff41] flex items-center justify-between px-1 text-[7px] text-black font-black">
            <span>METRO</span>
            <div className="w-1.5 h-1.5 bg-[#facc15] shadow-[0_0_6px_#facc15]" />
          </div>
          {/* Carriage 1 */}
          <div className="w-10 h-4 bg-[#0284c7] border border-white flex items-center justify-around px-1">
            <div className="w-1.5 h-1.5 bg-[#ffea00]" />
            <div className="w-1.5 h-1.5 bg-[#ffea00]" />
          </div>
          {/* Carriage 2 */}
          <div className="w-10 h-4 bg-[#d946ef] border border-white flex items-center justify-around px-1">
            <div className="w-1.5 h-1.5 bg-[#00ff41]" />
            <div className="w-1.5 h-1.5 bg-[#00ff41]" />
          </div>
        </div>
      </div>

      {/* Floating Hologram Billboard */}
      <div className="absolute bottom-14 right-1/4 bg-[#000]/90 border border-[#00ff41] px-3 py-1 text-[9px] font-pixel text-[#00ff41] shadow-[0_0_15px_rgba(0,255,65,0.6)] z-15 animate-pulse hidden sm:flex items-center gap-2">
        <span className="w-2 h-2 bg-[#ff00ff] rounded-full animate-ping" />
        <span>THÀNH PHỐ HƯỚNG NGHIỆP GDPT 2018 • 23 TÒA NHÀ • 376 NGÀNH</span>
      </div>

      {/* Foreground Highway Road with Road Markings */}
      <div className="absolute bottom-0 inset-x-0 h-6 bg-[#030503] border-t-2 border-[#00ff41] flex items-center justify-around px-4 z-20">
        <div className="w-full flex items-center justify-between">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="w-3.5 h-1 bg-[#ffea00]" />
          ))}
        </div>
      </div>
    </div>
  );
};


// ==========================================
// 5. FULLY CUSTOMIZABLE 8-BIT PIXEL AVATAR SPRITE
// ==========================================

import { PixelAvatarConfig } from '../../types';

interface PixelCustomAvatarProps {
  config: PixelAvatarConfig;
  size?: number;
  animate?: boolean;
  showCompanion?: boolean;
  showTitle?: boolean;
  actionPose?: 'idle' | 'wave' | 'work' | 'triumph';
  className?: string;
}

export const PixelCustomAvatarSprite: React.FC<PixelCustomAvatarProps> = ({
  config,
  size = 64,
  animate = true,
  showCompanion = true,
  showTitle = false,
  actionPose = 'idle',
  className = ''
}) => {
  const [frame, setFrame] = useState<number>(0);

  useEffect(() => {
    if (!animate) return;
    const timer = setInterval(() => {
      setFrame(prev => (prev + 1) % 4);
    }, 380);
    return () => clearInterval(timer);
  }, [animate]);

  // Skin Palette Mapping
  const skinColors = {
    fair: { base: '#fed7aa', shade: '#fba779', highlight: '#fff1e6' },
    warm: { base: '#fdba74', shade: '#ea580c', highlight: '#ffedd5' },
    tan: { base: '#d97706', shade: '#92400e', highlight: '#fef3c7' },
    dark: { base: '#78350f', shade: '#451a03', highlight: '#9a3412' },
    cyber_neon: { base: '#00ff41', shade: '#009926', highlight: '#73ff9a' },
    golden: { base: '#facc15', shade: '#ca8a04', highlight: '#fef08a' }
  }[config?.skinTone || 'warm'] || { base: '#fdba74', shade: '#ea580c', highlight: '#ffedd5' };

  // Hair Palette Mapping
  const hairColors = {
    black: { base: '#18181b', highlight: '#3f3f46' },
    brown: { base: '#78350f', highlight: '#a16207' },
    blond: { base: '#fde047', highlight: '#fef9c3' },
    red: { base: '#dc2626', highlight: '#f87171' },
    cyan: { base: '#06b6d4', highlight: '#67e8f9' },
    magenta: { base: '#d946ef', highlight: '#f0abfc' },
    emerald: { base: '#10b981', highlight: '#6ee7b7' },
    silver: { base: '#cbd5e1', highlight: '#ffffff' }
  }[config?.hairColor || 'black'] || { base: '#18181b', highlight: '#3f3f46' };

  // Outfit Palette Mapping
  const outfitColors = {
    green: { primary: '#00ff41', secondary: '#059669', trim: '#ffffff' },
    blue: { primary: '#0284c7', secondary: '#0369a1', trim: '#bae6fd' },
    magenta: { primary: '#d946ef', secondary: '#a21caf', trim: '#fdf4ff' },
    yellow: { primary: '#eab308', secondary: '#a16207', trim: '#000000' },
    red: { primary: '#ef4444', secondary: '#b91c1c', trim: '#ffffff' },
    slate: { primary: '#334155', secondary: '#1e293b', trim: '#94a3b8' },
    white: { primary: '#f8fafc', secondary: '#cbd5e1', trim: '#00ff41' }
  }[config?.outfitColor || 'green'] || { primary: '#00ff41', secondary: '#059669', trim: '#ffffff' };

  // Animation ticks
  const breathY = animate && frame % 2 === 1 ? -1 : 0;
  const isBlink = animate && (frame === 3 || config?.expression === 'wink');
  const waveArm = actionPose === 'wave' || (actionPose === 'idle' && frame === 2);
  const triumphArms = config?.expression === 'triumph' || actionPose === 'triumph';

  return (
    <div className={`relative inline-flex flex-col items-center select-none pixelated ${className}`}>
      <div 
        className="relative flex items-center justify-center" 
        style={{ width: showCompanion && config?.companion && config.companion !== 'none' ? size * 1.3 : size, height: size }}
      >
        <svg
          viewBox="0 0 32 32"
          width={size}
          height={size}
          className="overflow-visible filter drop-shadow-[0_2px_4px_rgba(0,0,0,0.5)]"
          shapeRendering="crispEdges"
        >
          {/* SHADOW BASE */}
          <ellipse cx="16" cy="30" rx="7" ry="2" fill="rgba(0,0,0,0.4)" />

          {/* BACK HAIR (For Ponytail & Long Flow) */}
          {config?.hairStyle === 'ponytail' && (
            <g>
              <rect x="7" y="10" width="4" height="8" fill={hairColors.base} />
              <rect x="6" y="14" width="3" height="5" fill={hairColors.highlight} />
              {/* Ribbon */}
              <rect x="9" y="10" width="3" height="3" fill="#ff00ff" />
            </g>
          )}

          {config?.hairStyle === 'long_flow' && (
            <g>
              <rect x="8" y="10" width="16" height="12" fill={hairColors.base} />
              <rect x="7" y="12" width="3" height="9" fill={hairColors.highlight} />
              <rect x="22" y="12" width="3" height="9" fill={hairColors.highlight} />
            </g>
          )}

          {/* LEGS & SHOES */}
          <g>
            {/* Pants or Skirt depending on outfit */}
            {config?.outfit === 'ao_dai_trad' ? (
              // White/Dark Silk Pants for Ao Dai
              <g>
                <rect x="12" y="24" width="3" height="5" fill="#f8fafc" />
                <rect x="17" y="24" width="3" height="5" fill="#f8fafc" />
                {/* Flowing Silk Flaps (Tà Áo Dài) in front & back */}
                <rect x="11" y="23" width="10" height="5" fill={outfitColors.primary} fillOpacity="0.9" />
                <rect x="12" y="27" width="8" height="2" fill={outfitColors.secondary} />
                <line x1="16" y1="23" x2="16" y2="28" stroke={outfitColors.secondary} strokeWidth="0.5" />
              </g>
            ) : config?.outfit === 'viet_phuc_nhat_binh' ? (
              // Royal Long Robe Flaps
              <g>
                <rect x="11" y="23" width="10" height="6" fill={outfitColors.primary} />
                <rect x="10" y="25" width="2" height="4" fill="#facc15" />
                <rect x="20" y="25" width="2" height="4" fill="#facc15" />
                <rect x="12" y="27" width="8" height="2" fill="#ef4444" />
              </g>
            ) : (
              // Standard Pants
              <g>
                <rect x="12" y="24" width="3" height="5" fill="#1e293b" />
                <rect x="17" y="24" width="3" height="5" fill="#1e293b" />
              </g>
            )}

            {/* Shoes */}
            <rect x="11" y="28" width="4" height="2" fill={outfitColors.primary} />
            <rect x="17" y="28" width="4" height="2" fill={outfitColors.primary} />
            <rect x="11" y="29" width="4" height="1" fill="#ffffff" />
            <rect x="17" y="29" width="4" height="1" fill="#ffffff" />
          </g>

          {/* TORSO & OUTFIT (With Breathing offset) */}
          <g transform={`translate(0, ${breathY})`}>
            {/* Body Base */}
            <rect x="11" y="15" width="10" height="9" fill={outfitColors.primary} />
            <rect x="12" y="16" width="8" height="7" fill={outfitColors.secondary} />

            {/* OUTFIT SPECIFIC DETAILS */}
            {/* 1. ÁO DÀI TRUYỀN THỐNG VIỆT NAM */}
            {config?.outfit === 'ao_dai_trad' && (
              <g>
                {/* Mandarin High Collar (Cổ tàu cao thanh lịch) */}
                <rect x="14" y="14" width="4" height="2" fill={outfitColors.primary} stroke={outfitColors.trim} strokeWidth="0.4" />
                {/* Diagonal Pearl Buttons (Hàng cúc chéo ngực đặc trưng) */}
                <path d="M 16 16 L 19 18 L 19 22" stroke={outfitColors.trim} strokeWidth="0.6" fill="none" strokeDasharray="1 1" />
                <circle cx="16" cy="16" r="0.6" fill="#ffffff" />
                <circle cx="18" cy="18" r="0.6" fill="#ffffff" />
                <circle cx="19" cy="20" r="0.6" fill="#ffffff" />
                {/* Fitted Waist Accent & Side Slits */}
                <rect x="11" y="21" width="1" height="3" fill="#ffffff" />
                <rect x="20" y="21" width="1" height="3" fill="#ffffff" />
              </g>
            )}

            {/* 2. ÁO BÀ BA NAM BỘ */}
            {config?.outfit === 'ao_ba_ba' && (
              <g>
                {/* V-neck Mandarin Cut */}
                <polygon points="14,15 18,15 16,18" fill={skinColors.base} />
                {/* Front Center Buttons */}
                <line x1="16" y1="18" x2="16" y2="24" stroke="#ffffff" strokeWidth="0.6" />
                <circle cx="16" cy="18" r="0.5" fill="#f8fafc" />
                <circle cx="16" cy="20" r="0.5" fill="#f8fafc" />
                <circle cx="16" cy="22" r="0.5" fill="#f8fafc" />
                {/* 2 Traditional Lower Pockets */}
                <rect x="12" y="21" width="2.5" height="2.5" fill={outfitColors.secondary} stroke="#ffffff" strokeWidth="0.4" />
                <rect x="17.5" y="21" width="2.5" height="2.5" fill={outfitColors.secondary} stroke="#ffffff" strokeWidth="0.4" />
              </g>
            )}

            {/* 3. ÁO ĐOÀN THANH NIÊN VIỆT NAM */}
            {config?.outfit === 'ao_doan_tn' && (
              <g>
                {/* Blue Youth Shirt Base */}
                <rect x="11" y="15" width="10" height="9" fill="#1d4ed8" />
                {/* White Collar */}
                <polygon points="14,15 18,15 16,17" fill="#ffffff" />
                {/* Shoulder Straps (Cầu vai) */}
                <rect x="11" y="15" width="2" height="1" fill="#3b82f6" />
                <rect x="19" y="15" width="2" height="1" fill="#3b82f6" />
                {/* Huy hiệu Đoàn Cờ Đỏ Sao Vàng ở ngực trái */}
                <rect x="17" y="17" width="2.5" height="2.5" fill="#ef4444" stroke="#facc15" strokeWidth="0.4" />
                <polygon points="18.25,17.5 18.7,18.5 17.8,18.5" fill="#facc15" />
                {/* Front Button Line */}
                <line x1="16" y1="17" x2="16" y2="24" stroke="#93c5fd" strokeWidth="0.5" />
              </g>
            )}

            {/* 4. HỌC SINH KHĂN QUÀNG ĐỎ */}
            {config?.outfit === 'hoc_sinh_khan_quang' && (
              <g>
                {/* Pure White Uniform Shirt */}
                <rect x="11" y="15" width="10" height="9" fill="#ffffff" />
                {/* Shirt Collar */}
                <polygon points="14,15 18,15 16,17" fill="#e2e8f0" />
                {/* Red Pioneer Scarf (Khăn Quàng Đỏ Đội Viên) */}
                <polygon points="13,15 19,15 16,19" fill="#ef4444" />
                <polygon points="14,15 18,15 16,18" fill="#dc2626" />
                {/* Scarf Tail draping down */}
                <polygon points="15.5,19 17.5,19 18,23 16,21" fill="#ef4444" />
                {/* Blue School Pants/Skirt trim */}
                <rect x="11" y="23" width="10" height="1" fill="#1e3a8a" />
              </g>
            )}

            {/* 5. VIỆT PHỤC CỔ PHONG NHẬT BÌNH */}
            {config?.outfit === 'viet_phuc_nhat_binh' && (
              <g>
                {/* Rectangular Embroidered Collar Bands (Ngũ Sắc Cổ Áo Nhật Bình) */}
                <rect x="13" y="15" width="6" height="3" fill="#facc15" />
                <rect x="14" y="15" width="4" height="2" fill="#ef4444" />
                <rect x="15" y="15" width="2" height="1" fill="#00e5ff" />
                {/* Middle Brocade Pattern */}
                <rect x="15" y="18" width="2" height="6" fill="#facc15" />
                {/* Jade Belt & Tassel */}
                <rect x="13" y="21" width="6" height="1.5" fill="#059669" />
                <circle cx="16" cy="21.7" r="1" fill="#f8fafc" />
                <line x1="16" y1="22.5" x2="16" y2="25" stroke="#ef4444" strokeWidth="0.8" />
              </g>
            )}

            {/* 6. ÁO THUN CỜ ĐỎ SAO VÀNG */}
            {config?.outfit === 'ao_co_do_sao_vang' && (
              <g>
                {/* Bright Red Shirt */}
                <rect x="11" y="15" width="10" height="9" fill="#ef4444" />
                <polygon points="14,15 18,15 16,17" fill="#dc2626" />
                {/* 8-bit Golden Star in center */}
                <polygon points="16,17 16.8,19 19,19 17.2,20.2 17.8,22 16,21 14.2,22 14.8,20.2 13,19 15.2,19" fill="#facc15" />
              </g>
            )}

            {/* 7. OTHER CAREER OUTFITS */}
            {config?.outfit === 'school_uniform' && (
              <g>
                {/* White Shirt Collar & Red Tie */}
                <polygon points="14,15 18,15 16,19" fill="#ffffff" />
                <rect x="15" y="16" width="2" height="5" fill="#ef4444" />
                <rect x="12" y="15" width="2" height="9" fill="#1e3a8a" />
                <rect x="18" y="15" width="2" height="9" fill="#1e3a8a" />
              </g>
            )}

            {config?.outfit === 'cyber_hoodie' && (
              <g>
                {/* Neon Zipper & Cyber Trim */}
                <rect x="15" y="15" width="2" height="9" fill="#00e5ff" />
                <rect x="11" y="19" width="10" height="1" fill="#ff00ff" />
                <rect x="12" y="21" width="3" height="2" fill="#0f172a" />
                <rect x="17" y="21" width="3" height="2" fill="#0f172a" />
              </g>
            )}

            {config?.outfit === 'doctor_scrubs' && (
              <g>
                {/* V-neck & Pocket */}
                <polygon points="14,15 18,15 16,18" fill={skinColors.base} />
                <rect x="17" y="19" width="3" height="3" fill="#ffffff" />
                <rect x="18" y="18" width="1" height="2" fill="#ef4444" />
                {/* Stethoscope around neck */}
                <path d="M 12 15 Q 16 20 20 15" stroke="#94a3b8" strokeWidth="1" fill="none" />
                <rect x="15" y="19" width="2" height="2" fill="#e2e8f0" />
              </g>
            )}

            {config?.outfit === 'teacher_blazer' && (
              <g>
                {/* Formal Lapels & Tie/Scarf */}
                <polygon points="14,15 18,15 16,19" fill="#ffffff" />
                <rect x="15.5" y="16" width="1" height="4" fill="#d97706" />
                <polygon points="11,15 14,19 11,24" fill={outfitColors.secondary} />
                <polygon points="21,15 18,19 21,24" fill={outfitColors.secondary} />
                {/* Gold Button */}
                <rect x="15" y="21" width="2" height="1" fill="#facc15" />
              </g>
            )}

            {config?.outfit === 'lab_coat' && (
              <g>
                {/* White Coat overlay */}
                <rect x="11" y="15" width="3" height="10" fill="#ffffff" />
                <rect x="18" y="15" width="3" height="10" fill="#ffffff" />
                <rect x="14" y="15" width="4" height="9" fill={outfitColors.primary} />
                {/* Test tube in pocket */}
                <rect x="12" y="20" width="1" height="3" fill="#00ff41" />
                <rect x="13" y="20" width="1" height="3" fill="#38bdf8" />
              </g>
            )}

            {config?.outfit === 'streetwear' && (
              <g>
                {/* Graphic emblem */}
                <rect x="14" y="17" width="4" height="4" fill="#f43f5e" />
                <rect x="15" y="18" width="2" height="2" fill="#ffffff" />
                <rect x="11" y="22" width="10" height="2" fill="#0f172a" />
              </g>
            )}

            {/* ARMS & SLEEVES */}
            {triumphArms ? (
              // Arms Raised in Victory \o/
              <g>
                <rect x="7" y="12" width="4" height="3" fill={outfitColors.primary} />
                <rect x="6" y="9" width="3" height="4" fill={skinColors.base} />
                <rect x="21" y="12" width="4" height="3" fill={outfitColors.primary} />
                <rect x="23" y="9" width="3" height="4" fill={skinColors.base} />
              </g>
            ) : waveArm ? (
              // Waving Right Hand
              <g>
                {/* Left Arm at side */}
                <rect x="8" y="16" width="3" height="6" fill={outfitColors.primary} />
                <rect x="8" y="21" width="3" height="3" fill={skinColors.base} />
                {/* Right Arm Waving Up */}
                <rect x="21" y="14" width="4" height="3" fill={outfitColors.primary} />
                <rect x="23" y="11" width="3" height="4" fill={skinColors.base} />
                <rect x="24" y="10" width="3" height="2" fill={skinColors.highlight} />
              </g>
            ) : (
              // Standard Idle Arms
              <g>
                <rect x="8" y="16" width="3" height="6" fill={outfitColors.primary} />
                <rect x="8" y="21" width="3" height="3" fill={skinColors.base} />
                <rect x="21" y="16" width="3" height="6" fill={outfitColors.primary} />
                <rect x="21" y="21" width="3" height="3" fill={skinColors.base} />
              </g>
            )}

            {/* HELD ITEMS (Hands / Item Layer) */}
            {/* 1. BÁNH MÌ VIỆT NAM GIÒN RỤM */}
            {config?.heldItem === 'banh_mi' && (
              <g transform="translate(18, 17)">
                {/* Baguette Golden Crust with slash */}
                <ellipse cx="5" cy="4" rx="5" ry="3" fill="#d97706" stroke="#78350f" strokeWidth="0.5" transform="rotate(-15 5 4)" />
                <ellipse cx="5" cy="4" rx="4.2" ry="2.2" fill="#f59e0b" transform="rotate(-15 5 4)" />
                {/* Meat & Cucumber fillings */}
                <rect x="2" y="3" width="6" height="1.5" fill="#ef4444" />
                <rect x="3" y="4" width="4" height="1" fill="#22c55e" />
                <line x1="2" y1="2.5" x2="8" y2="4.5" stroke="#78350f" strokeWidth="0.6" />
              </g>
            )}

            {/* 2. CÀ PHÊ PHIN SỮA ĐÁ SÀI GÒN */}
            {config?.heldItem === 'ca_phe_phin' && (
              <g transform="translate(19, 16)">
                {/* Glass Cup Base */}
                <rect x="1" y="4" width="5" height="7" fill="#ffffff" fillOpacity="0.3" stroke="#94a3b8" strokeWidth="0.5" />
                {/* Condensed Milk Layer at bottom */}
                <rect x="1.5" y="9" width="4" height="1.5" fill="#fef08a" />
                {/* Dark Drip Coffee Layer */}
                <rect x="1.5" y="5.5" width="4" height="3.5" fill="#451a03" />
                {/* Ice Cubes */}
                <rect x="2" y="6" width="1.5" height="1.5" fill="#bae6fd" fillOpacity="0.8" />
                <rect x="3.5" y="7" width="1.5" height="1.5" fill="#bae6fd" fillOpacity="0.8" />
                {/* Metal Phin Coffee Filter on top */}
                <rect x="0" y="3.5" width="7" height="1" fill="#cbd5e1" />
                <rect x="1" y="0.5" width="5" height="3" fill="#94a3b8" stroke="#475569" strokeWidth="0.4" />
                <circle cx="3.5" cy="0.5" r="0.8" fill="#cbd5e1" />
                {/* Red Straw */}
                <line x1="4" y1="-1" x2="6" y2="5" stroke="#ef4444" strokeWidth="0.8" />
              </g>
            )}

            {/* 3. CỜ TỔ QUỐC VẪY TAY */}
            {config?.heldItem === 'co_to_quoc' && (
              <g transform="translate(19, 11)">
                {/* Wooden Flagpole */}
                <line x1="1" y1="0" x2="1" y2="14" stroke="#d97706" strokeWidth="1" />
                <circle cx="1" cy="0" r="0.8" fill="#facc15" />
                {/* Red Flag with Waving Ripple */}
                <rect x="1.5" y="1" width="9" height="6" fill="#ef4444" />
                <polygon points="10.5,1 9.5,4 10.5,7 1.5,7 1.5,1" fill="#ef4444" />
                {/* Golden Star in Center */}
                <polygon points="5.5,2.5 6,3.5 7.2,3.5 6.2,4.2 6.5,5.3 5.5,4.7 4.5,5.3 4.8,4.2 3.8,3.5 5,3.5" fill="#facc15" />
              </g>
            )}

            {/* 4. HOA SEN HỒNG QUỐC HOA */}
            {config?.heldItem === 'hoa_sen' && (
              <g transform="translate(19, 14)">
                {/* Green Stem */}
                <path d="M 2 12 Q 3 7 4 4" stroke="#15803d" strokeWidth="1" fill="none" />
                {/* Lotus Petals */}
                <polygon points="4,0 7,4 1,4" fill="#f43f5e" />
                <polygon points="4,1 6,4 2,4" fill="#fb7185" />
                <polygon points="4,2 5.5,4 2.5,4" fill="#fda4af" />
                <polygon points="2,4 0,3 1,5" fill="#f43f5e" />
                <polygon points="6,4 8,3 7,5" fill="#f43f5e" />
                {/* Green Calyx */}
                <polygon points="1,4 7,4 4,6" fill="#16a34a" />
              </g>
            )}

            {/* 5. VỞ Ô LY HỒNG HÀ & BÚT MỰC */}
            {config?.heldItem === 'but_vo_hongha' && (
              <g transform="translate(19, 17)">
                {/* Notebook */}
                <rect x="0" y="0" width="8" height="9" fill="#0284c7" stroke="#0369a1" strokeWidth="0.5" />
                <rect x="1.5" y="1.5" width="5" height="6" fill="#ffffff" />
                <line x1="2" y1="3" x2="6" y2="3" stroke="#93c5fd" strokeWidth="0.4" />
                <line x1="2" y1="5" x2="6" y2="5" stroke="#93c5fd" strokeWidth="0.4" />
                {/* Pen */}
                <line x1="7" y1="-1" x2="6" y2="8" stroke="#ef4444" strokeWidth="0.8" />
                <circle cx="7" cy="-1" r="0.6" fill="#facc15" />
              </g>
            )}

            {/* 6. ĐÀN BẦU DÂN TỘC */}
            {config?.heldItem === 'dan_bau' && (
              <g transform="translate(19, 13)">
                {/* Wooden Long Body */}
                <rect x="0" y="2" width="9" height="3" fill="#78350f" stroke="#451a03" strokeWidth="0.4" />
                {/* Curved Horn Neck & Dried Gourd */}
                <path d="M 0 3 Q -2 0 -3 -2" stroke="#d97706" strokeWidth="1" fill="none" />
                <circle cx="-3" cy="-1" r="1.5" fill="#ca8a04" />
                {/* Monochord String */}
                <line x1="-3" y1="-2" x2="8" y2="3" stroke="#f8fafc" strokeWidth="0.4" />
              </g>
            )}

            {/* 7. QUẠT MO CAU DÂN GIAN */}
            {config?.heldItem === 'quat_mo' && (
              <g transform="translate(18, 16)">
                {/* Heart-shaped Fan Leaf */}
                <path d="M 3 0 C 0 -3 0 4 3 6 C 6 4 6 -3 3 0" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
                {/* Bamboo Handle */}
                <line x1="3" y1="6" x2="2" y2="10" stroke="#a16207" strokeWidth="1" />
              </g>
            )}

            {/* 8. STANDARD ITEMS */}
            {config?.heldItem === 'laptop' && (
              <g transform="translate(18, 17)">
                <rect x="0" y="0" width="9" height="6" fill="#0f172a" stroke="#00ff41" strokeWidth="0.5" />
                <rect x="1" y="1" width="7" height="4" fill="#000000" />
                <rect x="2" y="2" width="5" height="1" fill="#00ff41" />
                <rect x="2" y="3" width="3" height="1" fill="#00ff41" />
                <rect x="-1" y="5" width="11" height="2" fill="#64748b" />
              </g>
            )}

            {config?.heldItem === 'tablet' && (
              <g transform="translate(19, 18)">
                <rect x="0" y="0" width="7" height="9" fill="#1e293b" stroke="#38bdf8" strokeWidth="0.5" />
                <rect x="1" y="1" width="5" height="7" fill="#00e5ff" fillOpacity="0.4" />
                <rect x="2" y="3" width="3" height="1" fill="#ffffff" />
                <rect x="2" y="5" width="3" height="1" fill="#ff00ff" />
              </g>
            )}

            {config?.heldItem === 'stethoscope' && (
              <g transform="translate(20, 19)">
                <circle cx="3" cy="3" r="2.5" fill="#94a3b8" />
                <circle cx="3" cy="3" r="1" fill="#00e5ff" />
              </g>
            )}

            {config?.heldItem === 'flask' && (
              <g transform="translate(20, 17)">
                <polygon points="2,0 4,0 5,6 1,6" fill="#ffffff" fillOpacity="0.7" stroke="#38bdf8" strokeWidth="0.5" />
                <polygon points="1.5,3 4.5,3 5,6 1,6" fill="#00ff41" />
                <circle cx="3" cy="4" r="0.5" fill="#ffffff" />
              </g>
            )}

            {config?.heldItem === 'certificate' && (
              <g transform="translate(19, 16)">
                <rect x="0" y="0" width="8" height="10" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.5" />
                <rect x="2" y="2" width="4" height="1" fill="#b45309" />
                <rect x="2" y="4" width="4" height="1" fill="#b45309" />
                <circle cx="4" cy="7" r="1.5" fill="#ef4444" />
              </g>
            )}

            {config?.heldItem === 'coffee' && (
              <g transform="translate(20, 19)">
                <rect x="0" y="0" width="5" height="6" fill="#ffffff" />
                <rect x="1" y="2" width="3" height="2" fill="#00ff41" />
                <rect x="5" y="1" width="2" height="3" fill="none" stroke="#ffffff" strokeWidth="0.5" />
                {/* Steam */}
                <path d="M 2 -1 Q 3 -3 2 -4" stroke="#e2e8f0" strokeWidth="0.5" fill="none" />
              </g>
            )}

            {config?.heldItem === 'gameboy' && (
              <g transform="translate(19, 18)">
                <rect x="0" y="0" width="7" height="9" fill="#cbd5e1" stroke="#475569" strokeWidth="0.5" />
                <rect x="1.5" y="1.5" width="4" height="3" fill="#84cc16" />
                <rect x="2" y="5.5" width="2" height="2" fill="#334155" />
                <circle cx="5" cy="6.5" r="0.7" fill="#ef4444" />
              </g>
            )}

            {/* HEAD & FACE */}
            <g>
              {/* Neck */}
              <rect x="14" y="13" width="4" height="3" fill={skinColors.shade} />

              {/* Head Base */}
              <rect x="10" y="6" width="12" height="9" fill={skinColors.base} />
              <rect x="11" y="7" width="10" height="7" fill={skinColors.base} />
              {/* Cheek Shading */}
              <rect x="10" y="11" width="2" height="2" fill={skinColors.shade} />
              <rect x="20" y="11" width="2" height="2" fill={skinColors.shade} />

              {/* EYES & EXPRESSION */}
              {isBlink ? (
                // Squint / Wink Eyes
                <g>
                  <rect x="12" y="10" width="2" height="1" fill="#0f172a" />
                  <rect x="18" y="10" width="2" height="1" fill="#0f172a" />
                </g>
              ) : config?.expression === 'cool' ? (
                // Confident Half-lidded Eyes
                <g>
                  <rect x="12" y="9" width="3" height="1" fill="#0f172a" />
                  <rect x="12" y="10" width="2" height="1" fill="#0284c7" />
                  <rect x="17" y="9" width="3" height="1" fill="#0f172a" />
                  <rect x="18" y="10" width="2" height="1" fill="#0284c7" />
                </g>
              ) : config?.expression === 'focus' ? (
                // Serious Determined Brows & Eyes
                <g>
                  <line x1="11" y1="8" x2="14" y2="9" stroke="#0f172a" strokeWidth="1" />
                  <line x1="21" y1="8" x2="18" y2="9" stroke="#0f172a" strokeWidth="1" />
                  <rect x="12" y="10" width="2" height="2" fill="#0f172a" />
                  <rect x="18" y="10" width="2" height="2" fill="#0f172a" />
                  <rect x="12" y="10" width="1" height="1" fill="#ffffff" />
                  <rect x="18" y="10" width="1" height="1" fill="#ffffff" />
                </g>
              ) : (
                // Bright Friendly Eyes
                <g>
                  <rect x="12" y="9" width="2" height="3" fill="#0f172a" />
                  <rect x="12" y="9" width="1" height="1" fill="#ffffff" />
                  <rect x="18" y="9" width="2" height="3" fill="#0f172a" />
                  <rect x="18" y="9" width="1" height="1" fill="#ffffff" />
                </g>
              )}

              {/* NOSE */}
              <rect x="15.5" y="11" width="1" height="1" fill={skinColors.shade} />

              {/* MOUTH */}
              {config?.expression === 'triumph' || config?.expression === 'smile' ? (
                <rect x="14" y="13" width="4" height="1" fill="#ef4444" />
              ) : (
                <rect x="15" y="13" width="2" height="1" fill="#0f172a" />
              )}
            </g>

            {/* HAIR STYLES */}
            {config?.hairStyle === 'spiky' && (
              <g>
                <polygon points="9,6 12,2 14,6 16,1 19,6 22,3 23,7 9,7" fill={hairColors.base} />
                <rect x="9" y="5" width="14" height="3" fill={hairColors.base} />
                <rect x="10" y="5" width="12" height="2" fill={hairColors.highlight} />
                <rect x="9" y="7" width="2" height="4" fill={hairColors.base} />
                <rect x="21" y="7" width="2" height="4" fill={hairColors.base} />
              </g>
            )}

            {config?.hairStyle === 'side_part' && (
              <g>
                <rect x="9" y="4" width="14" height="4" fill={hairColors.base} />
                <polygon points="9,4 16,2 23,5" fill={hairColors.highlight} />
                <rect x="9" y="6" width="3" height="6" fill={hairColors.base} />
                <rect x="20" y="6" width="3" height="4" fill={hairColors.base} />
              </g>
            )}

            {config?.hairStyle === 'curly' && (
              <g>
                <circle cx="10" cy="5" r="3" fill={hairColors.base} />
                <circle cx="13" cy="3" r="3" fill={hairColors.highlight} />
                <circle cx="17" cy="3" r="3" fill={hairColors.base} />
                <circle cx="21" cy="4" r="3" fill={hairColors.highlight} />
                <circle cx="22" cy="7" r="2.5" fill={hairColors.base} />
                <circle cx="9" cy="7" r="2.5" fill={hairColors.base} />
                <circle cx="8" cy="10" r="2" fill={hairColors.base} />
                <circle cx="23" cy="10" r="2" fill={hairColors.base} />
              </g>
            )}

            {config?.hairStyle === 'cyber_bob' && (
              <g>
                <rect x="9" y="4" width="14" height="4" fill={hairColors.base} />
                <rect x="8" y="7" width="3" height="7" fill={hairColors.base} />
                <rect x="21" y="7" width="3" height="7" fill={hairColors.base} />
                <polygon points="8,14 11,14 8,11" fill={hairColors.highlight} />
                <polygon points="21,14 24,14 24,11" fill={hairColors.highlight} />
                <rect x="11" y="6" width="10" height="2" fill={hairColors.highlight} />
              </g>
            )}

            {config?.hairStyle === 'short_fade' && (
              <g>
                <rect x="10" y="4" width="12" height="3" fill={hairColors.base} />
                <rect x="11" y="4" width="10" height="1" fill={hairColors.highlight} />
                <rect x="9" y="6" width="2" height="2" fill={hairColors.highlight} />
                <rect x="21" y="6" width="2" height="2" fill={hairColors.highlight} />
              </g>
            )}

            {config?.hairStyle === 'ponytail' && (
              <g>
                <rect x="9" y="4" width="14" height="4" fill={hairColors.base} />
                <rect x="10" y="5" width="12" height="2" fill={hairColors.highlight} />
                <rect x="9" y="6" width="2" height="5" fill={hairColors.base} />
                <rect x="21" y="6" width="2" height="5" fill={hairColors.base} />
              </g>
            )}

            {config?.hairStyle === 'long_flow' && (
              <g>
                <rect x="9" y="4" width="14" height="4" fill={hairColors.base} />
                <rect x="10" y="5" width="12" height="2" fill={hairColors.highlight} />
                <rect x="8" y="6" width="3" height="8" fill={hairColors.base} />
                <rect x="21" y="6" width="3" height="8" fill={hairColors.base} />
              </g>
            )}

            {/* FACIAL ACCESSORIES */}
            {/* 1. KHĂN RẰN NAM BỘ QUÀNG CỔ */}
            {config?.accessory === 'khan_ran_co' && (
              <g>
                {/* Checkered Scarf draped around neck and chest */}
                <path d="M 12 13 Q 16 17 20 13" stroke="#0f172a" strokeWidth="2.5" fill="none" />
                <path d="M 12 13 Q 16 17 20 13" stroke="#f8fafc" strokeWidth="2" strokeDasharray="1.5 1.5" fill="none" />
                {/* Scarf Tails */}
                <rect x="13" y="15" width="2" height="6" fill="#0f172a" />
                <rect x="13" y="16" width="2" height="1" fill="#f8fafc" />
                <rect x="13" y="18" width="2" height="1" fill="#f8fafc" />
                <rect x="17" y="15" width="2" height="5" fill="#0f172a" />
                <rect x="17" y="16" width="2" height="1" fill="#f8fafc" />
                <rect x="17" y="18" width="2" height="1" fill="#f8fafc" />
              </g>
            )}

            {config?.accessory === 'glasses' && (
              <g>
                <rect x="11" y="9" width="4" height="3" fill="none" stroke="#000000" strokeWidth="0.8" />
                <rect x="17" y="9" width="4" height="3" fill="none" stroke="#000000" strokeWidth="0.8" />
                <line x1="15" y1="10" x2="17" y2="10" stroke="#000000" strokeWidth="0.8" />
                <rect x="12" y="10" width="1" height="1" fill="#ffffff" />
                <rect x="18" y="10" width="1" height="1" fill="#ffffff" />
              </g>
            )}

            {config?.accessory === 'cyber_visor' && (
              <g>
                <rect x="9" y="8" width="14" height="4" fill="#00e5ff" fillOpacity="0.8" />
                <rect x="10" y="9" width="12" height="1" fill="#ffffff" />
                <rect x="8" y="9" width="2" height="2" fill="#ff00ff" />
                <rect x="22" y="9" width="2" height="2" fill="#ff00ff" />
              </g>
            )}

            {config?.accessory === 'shades' && (
              <g>
                <rect x="10" y="8" width="12" height="4" fill="#0f172a" />
                <line x1="11" y1="9" x2="14" y2="11" stroke="#64748b" strokeWidth="0.8" />
                <line x1="17" y1="9" x2="20" y2="11" stroke="#64748b" strokeWidth="0.8" />
              </g>
            )}

            {config?.accessory === 'mask' && (
              <g>
                <rect x="11" y="11" width="10" height="4" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="0.5" />
                <line x1="9" y1="12" x2="11" y2="12" stroke="#cbd5e1" strokeWidth="0.5" />
                <line x1="21" y1="12" x2="23" y2="12" stroke="#cbd5e1" strokeWidth="0.5" />
              </g>
            )}

            {config?.accessory === 'scouter' && (
              <g>
                <rect x="17" y="8" width="5" height="4" fill="#22c55e" fillOpacity="0.75" stroke="#15803d" strokeWidth="0.5" />
                <rect x="22" y="8" width="2" height="6" fill="#dc2626" />
                <circle cx="19" cy="10" r="1" fill="#ffffff" />
              </g>
            )}

            {/* HEADGEAR */}
            {/* 1. NÓN LÁ VIỆT NAM (Traditional Conical Leaf Hat) */}
            {config?.headgear === 'non_la' && (
              <g>
                {/* Conical Hat Triangle */}
                <polygon points="16,-1 29,6 3,6" fill="#fef08a" stroke="#d97706" strokeWidth="0.6" />
                <polygon points="16,0 27,5.5 5,5.5" fill="#fde047" />
                {/* Palm Leaf Texture Lines */}
                <line x1="16" y1="-1" x2="8" y2="6" stroke="#ca8a04" strokeWidth="0.4" />
                <line x1="16" y1="-1" x2="12" y2="6" stroke="#ca8a04" strokeWidth="0.4" />
                <line x1="16" y1="-1" x2="20" y2="6" stroke="#ca8a04" strokeWidth="0.4" />
                <line x1="16" y1="-1" x2="24" y2="6" stroke="#ca8a04" strokeWidth="0.4" />
                {/* Soft Silk Chin Strap (Quai Nón Lụa Hồng) */}
                <path d="M 8 6 Q 16 16 24 6" stroke="#f472b6" strokeWidth="0.8" fill="none" />
                <circle cx="16" cy="14" r="0.6" fill="#ec4899" />
              </g>
            )}

            {/* 2. NÓN CỐI BỘ ĐỘI (Army Pith Helmet) */}
            {config?.headgear === 'non_coi' && (
              <g>
                {/* Green Helmet Dome */}
                <path d="M 7 6 Q 16 0 25 6" stroke="#15803d" strokeWidth="3.5" fill="#166534" />
                <polygon points="6,6 26,6 25,4 7,4" fill="#15803d" />
                {/* Brim */}
                <rect x="5" y="5.5" width="22" height="1.5" fill="#14532d" />
                {/* Red & Gold Army Star Badge */}
                <circle cx="16" cy="3.5" r="1.5" fill="#ef4444" stroke="#facc15" strokeWidth="0.4" />
                <polygon points="16,2.5 16.3,3.2 17,3.2 16.5,3.7 16.7,4.4 16,4 15.3,4.4 15.5,3.7 15,3.2 15.7,3.2" fill="#facc15" />
                {/* Leather Strap */}
                <path d="M 7 6 Q 16 15 25 6" stroke="#78350f" strokeWidth="0.6" fill="none" />
              </g>
            )}

            {/* 3. MẤN ĐỘI ĐẦU TRUYỀN THỐNG (Traditional Brocade Headband/Crown) */}
            {config?.headgear === 'man_truyen_thong' && (
              <g>
                {/* Brocade Wrap Layers */}
                <ellipse cx="16" cy="5" rx="8.5" ry="3.5" fill="#d946ef" stroke="#a21caf" strokeWidth="0.6" />
                <ellipse cx="16" cy="5" rx="7.5" ry="2.5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.4" />
                {/* Golden Center Pearl */}
                <circle cx="16" cy="5" r="1.2" fill="#ffffff" stroke="#eab308" strokeWidth="0.5" />
                <circle cx="16" cy="5" r="0.6" fill="#ef4444" />
              </g>
            )}

            {/* 4. KHĂN RẰN QUẤN ĐẦU (Southern Checkered Bandana) */}
            {config?.headgear === 'khan_ran_head' && (
              <g>
                <rect x="8" y="4" width="16" height="4" fill="#0f172a" />
                <rect x="8" y="4" width="16" height="4" fill="none" stroke="#f8fafc" strokeWidth="0.8" strokeDasharray="2 2" />
                {/* Knot on side */}
                <polygon points="23,3 27,2 25,6 23,5" fill="#0f172a" stroke="#f8fafc" strokeWidth="0.5" />
              </g>
            )}

            {/* 5. BĂNG RÔN "VIỆT NAM VÔ ĐỊCH / QUYẾT TÂM" */}
            {config?.headgear === 'bang_ron_vietnam' && (
              <g>
                {/* Red Headband */}
                <rect x="8" y="5" width="16" height="3" fill="#ef4444" stroke="#b91c1c" strokeWidth="0.4" />
                {/* Golden Star in Center */}
                <polygon points="16,5.5 16.3,6.2 17,6.2 16.5,6.7 16.7,7.4 16,7 15.3,7.4 15.5,6.7 15,6.2 15.7,6.2" fill="#facc15" />
                {/* Flying Red Ribbons at the back */}
                <path d="M 23 6 Q 27 5 28 8" stroke="#ef4444" strokeWidth="1.2" fill="none" />
                <path d="M 23 7 Q 26 8 28 11" stroke="#dc2626" strokeWidth="1.2" fill="none" />
              </g>
            )}

            {/* 6. STANDARD HEADGEAR */}
            {config?.headgear === 'grad_cap' && (
              <g>
                <polygon points="16,0 26,4 16,7 6,4" fill="#1e1b4b" stroke="#000000" strokeWidth="0.5" />
                <rect x="11" y="4" width="10" height="3" fill="#312e81" />
                {/* Tassel */}
                <circle cx="16" cy="3.5" r="1" fill="#facc15" />
                <line x1="16" y1="3.5" x2="24" y2="5" stroke="#facc15" strokeWidth="0.8" />
                <rect x="23" y="5" width="2" height="3" fill="#facc15" />
              </g>
            )}

            {config?.headgear === 'headphones' && (
              <g>
                <path d="M 8 9 Q 16 2 24 9" stroke="#ff00ff" strokeWidth="2" fill="none" />
                <rect x="7" y="8" width="3" height="6" fill="#00e5ff" stroke="#000000" strokeWidth="0.5" />
                <rect x="22" y="8" width="3" height="6" fill="#00e5ff" stroke="#000000" strokeWidth="0.5" />
              </g>
            )}

            {config?.headgear === 'cap_back' && (
              <g>
                <rect x="9" y="3" width="14" height="4" fill="#ef4444" />
                <rect x="7" y="5" width="4" height="2" fill="#dc2626" />
                <circle cx="16" cy="3" r="1" fill="#ffffff" />
              </g>
            )}

            {config?.headgear === 'cat_ears' && (
              <g>
                <polygon points="9,4 12,0 13,5" fill="#ff00ff" />
                <polygon points="10,4 12,1 12,4" fill="#fecdd3" />
                <polygon points="23,4 20,0 19,5" fill="#ff00ff" />
                <polygon points="22,4 20,1 20,4" fill="#fecdd3" />
              </g>
            )}

            {config?.headgear === 'crown' && (
              <g>
                <polygon points="9,5 10,1 13,3 16,0 19,3 22,1 23,5" fill="#facc15" stroke="#ca8a04" strokeWidth="0.5" />
                <circle cx="16" cy="3" r="0.8" fill="#ef4444" />
                <circle cx="12" cy="4" r="0.6" fill="#00e5ff" />
                <circle cx="20" cy="4" r="0.6" fill="#00e5ff" />
              </g>
            )}

            {config?.headgear === 'beret' && (
              <g>
                <ellipse cx="16" cy="4" rx="8" ry="3" fill="#be123c" />
                <circle cx="16" cy="1" r="0.8" fill="#881337" />
              </g>
            )}
          </g>
        </svg>

        {/* COMPANION PET (Positioned to the right) */}
        {showCompanion && config?.companion && config.companion !== 'none' && (
          <div className="absolute -right-2 bottom-0 z-10 transition-transform duration-200">
            {/* 1. TRÂU VÀNG KIM NGƯU (Vietnamese Golden Water Buffalo) */}
            {config.companion === 'trau_vang' && (
              <div className={`w-8 h-8 flex items-center justify-center ${frame % 2 === 0 ? '-translate-y-1' : 'translate-y-0'}`}>
                <svg viewBox="0 0 20 20" width={size * 0.55} height={size * 0.55} shapeRendering="crispEdges">
                  {/* Curved Horns (Sừng trâu cong oai phong) */}
                  <path d="M 3 5 Q 7 1 10 4" stroke="#78350f" strokeWidth="1.5" fill="none" />
                  <path d="M 17 5 Q 13 1 10 4" stroke="#78350f" strokeWidth="1.5" fill="none" />
                  {/* Head */}
                  <rect x="5" y="4" width="10" height="7" fill="#f59e0b" />
                  <rect x="6" y="5" width="8" height="5" fill="#fde047" />
                  {/* Big cute eyes */}
                  <rect x="6" y="6" width="2" height="2" fill="#18181b" />
                  <rect x="6" y="6" width="1" height="1" fill="#ffffff" />
                  <rect x="12" y="6" width="2" height="2" fill="#18181b" />
                  <rect x="12" y="6" width="1" height="1" fill="#ffffff" />
                  {/* Snout & Nostrils */}
                  <rect x="7" y="8" width="6" height="3" fill="#fbbf24" stroke="#d97706" strokeWidth="0.4" />
                  <circle cx="8.5" cy="9.5" r="0.6" fill="#78350f" />
                  <circle cx="11.5" cy="9.5" r="0.6" fill="#78350f" />
                  {/* Red Collar & Golden Bell (Chuông vàng may mắn) */}
                  <rect x="6" y="11" width="8" height="1.5" fill="#ef4444" />
                  <circle cx="10" cy="13" r="1.2" fill="#facc15" stroke="#ca8a04" strokeWidth="0.4" />
                  {/* Body & Paws */}
                  <rect x="5" y="12" width="10" height="5" fill="#f59e0b" />
                  <rect x="6" y="17" width="2.5" height="2" fill="#78350f" />
                  <rect x="11.5" y="17" width="2.5" height="2" fill="#78350f" />
                  {/* Tail wag */}
                  <line x1="15" y1="13" x2="18" y2={frame % 2 === 0 ? "11" : "15"} stroke="#d97706" strokeWidth="1" />
                </svg>
              </div>
            )}

            {/* 2. CHÓ PHÚ QUỐC CÓ XOÁY LƯNG (Phu Quoc Ridgeback Dog) */}
            {config.companion === 'cho_phu_quoc' && (
              <div className={`w-8 h-8 flex items-center justify-center ${frame % 2 === 0 ? '-translate-y-0.5' : 'translate-y-0'}`}>
                <svg viewBox="0 0 20 20" width={size * 0.55} height={size * 0.55} shapeRendering="crispEdges">
                  {/* Alert Pointed Ears */}
                  <polygon points="5,2 8,2 7,6" fill="#b45309" />
                  <polygon points="12,2 15,2 13,6" fill="#b45309" />
                  {/* Head */}
                  <rect x="6" y="5" width="8" height="6" fill="#d97706" />
                  {/* Eyes */}
                  <rect x="7" y="6" width="2" height="2" fill="#18181b" />
                  <rect x="7" y="6" width="1" height="1" fill="#ffffff" />
                  <rect x="11" y="6" width="2" height="2" fill="#18181b" />
                  <rect x="11" y="6" width="1" height="1" fill="#ffffff" />
                  {/* Snout */}
                  <rect x="8" y="8" width="4" height="3" fill="#92400e" />
                  <rect x="9.5" y="8" width="1" height="1" fill="#000000" />
                  {/* Body with Ridgeback Whirl (Dải lông xoáy lưng đặc trưng Phú Quốc) */}
                  <rect x="6" y="11" width="9" height="6" fill="#d97706" />
                  {/* Distinct Ridge Whirl */}
                  <path d="M 7 11 Q 10 9 13 11" stroke="#78350f" strokeWidth="1.2" fill="none" />
                  {/* Paws */}
                  <rect x="7" y="17" width="2" height="2" fill="#b45309" />
                  <rect x="12" y="17" width="2" height="2" fill="#b45309" />
                  {/* Curved Sickle Tail (Đuôi cong cánh cung) */}
                  <path d="M 15 13 Q 18 10 16 7" stroke="#b45309" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            )}

            {/* 3. MÈO MƯỚP TAM THỂ (Vietnamese Tabby Cat) */}
            {config.companion === 'meo_muop' && (
              <div className={`w-7 h-7 flex items-center justify-center ${frame % 2 === 0 ? '-translate-y-1' : 'translate-y-0'}`}>
                <svg viewBox="0 0 18 18" width={size * 0.48} height={size * 0.48} shapeRendering="crispEdges">
                  {/* Ears */}
                  <polygon points="4,2 7,2 6,5" fill="#ea580c" />
                  <polygon points="11,2 14,2 12,5" fill="#ea580c" />
                  {/* Head */}
                  <rect x="4" y="5" width="10" height="6" fill="#fbbf24" />
                  {/* Tiger Tabby Stripes */}
                  <line x1="9" y1="5" x2="9" y2="7" stroke="#78350f" strokeWidth="0.8" />
                  <line x1="6" y1="6" x2="7" y2="7" stroke="#78350f" strokeWidth="0.6" />
                  <line x1="12" y1="6" x2="11" y2="7" stroke="#78350f" strokeWidth="0.6" />
                  {/* Emerald Green Eyes */}
                  <rect x="5" y="7" width="2" height="2" fill="#10b981" />
                  <rect x="5" y="7" width="1" height="2" fill="#064e3b" />
                  <rect x="11" y="7" width="2" height="2" fill="#10b981" />
                  <rect x="11" y="7" width="1" height="2" fill="#064e3b" />
                  {/* Nose & Whiskers */}
                  <circle cx="9" cy="9.5" r="0.6" fill="#f43f5e" />
                  <line x1="3" y1="9" x2="5" y2="9.5" stroke="#78350f" strokeWidth="0.5" />
                  <line x1="13" y1="9.5" x2="15" y2="9" stroke="#78350f" strokeWidth="0.5" />
                  {/* Body & Paw */}
                  <rect x="5" y="11" width="8" height="5" fill="#f59e0b" />
                  <rect x="6" y="14" width="6" height="2" fill="#ffffff" />
                  {/* Wagging Tail */}
                  <path d={frame % 2 === 0 ? "M 13 13 Q 16 11 15 8" : "M 13 13 Q 16 15 16 10"} stroke="#ea580c" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            )}

            {/* 4. CHIM LẠC TRỐNG ĐỒNG ĐÔNG SƠN (Mythical Dong Son Lac Bird) */}
            {config.companion === 'chim_lac' && (
              <div className={`w-8 h-8 flex items-center justify-center ${frame % 2 === 0 ? '-translate-y-2' : '-translate-y-0.5'}`}>
                <svg viewBox="0 0 20 20" width={size * 0.55} height={size * 0.55} shapeRendering="crispEdges">
                  {/* Long Beak (Mỏ dài vươn cao) */}
                  <polygon points="12,6 18,4 13,8" fill="#facc15" stroke="#ca8a04" strokeWidth="0.4" />
                  {/* Crest & Crown Feather */}
                  <path d="M 8 5 Q 4 1 6 6" stroke="#ca8a04" strokeWidth="1.2" fill="none" />
                  {/* Head & Body */}
                  <circle cx="10" cy="7" r="2.5" fill="#fef08a" />
                  <circle cx="10.5" cy="6.5" r="0.6" fill="#0f172a" />
                  <rect x="7" y="9" width="6" height="5" fill="#fef08a" stroke="#ca8a04" strokeWidth="0.4" />
                  {/* Dong Son Feather Pattern Wing */}
                  <polygon points="7,10 1,8 3,14 7,12" fill="#f59e0b" stroke="#b45309" strokeWidth="0.4" />
                  <polygon points="6,10 3,9 4,13 6,11" fill="#fde047" />
                  {/* Trailing Tail Feathers (Đuôi chim dài kiêu hãnh) */}
                  <path d="M 7 14 Q 4 17 2 19" stroke="#ca8a04" strokeWidth="1" fill="none" />
                  <path d="M 8 14 Q 6 18 5 19" stroke="#ca8a04" strokeWidth="1" fill="none" />
                </svg>
              </div>
            )}

            {/* 5. STANDARD COMPANIONS */}
            {config.companion === 'shiba' && (
              <PixelShibaSprite size={size * 0.45} mood="happy" accessory="cyber_visor" />
            )}

            {config.companion === 'drone' && (
              <div className={`flex flex-col items-center ${frame % 2 === 0 ? '-translate-y-2' : '-translate-y-1'}`}>
                <div className="w-4 h-2 bg-[#00e5ff] border border-black shadow-[0_0_6px_#00e5ff] flex items-center justify-center">
                  <div className="w-1 h-1 bg-[#ff00ff] animate-ping" />
                </div>
                <div className="w-3 h-0.5 bg-[#ffffff] mt-0.5" />
              </div>
            )}

            {config.companion === 'pixel_cat' && (
              <div className="w-6 h-6 flex items-center justify-center">
                <svg viewBox="0 0 16 16" width={size * 0.4} height={size * 0.4} shapeRendering="crispEdges">
                  {/* Cat body & ears */}
                  <polygon points="3,2 6,2 5,5" fill="#18181b" />
                  <polygon points="10,2 13,2 11,5" fill="#18181b" />
                  <rect x="4" y="4" width="8" height="6" fill="#18181b" />
                  {/* Eyes */}
                  <rect x="5" y="6" width="2" height="2" fill="#22c55e" />
                  <rect x="9" y="6" width="2" height="2" fill="#22c55e" />
                  {/* Body & Tail */}
                  <rect x="5" y="10" width="7" height="5" fill="#18181b" />
                  <path d={frame % 2 === 0 ? "M 12 11 Q 15 10 14 7" : "M 12 11 Q 15 13 15 9"} stroke="#18181b" strokeWidth="1.5" fill="none" />
                </svg>
              </div>
            )}

            {config.companion === 'robot_owl' && (
              <div className={`w-6 h-6 flex items-center justify-center ${frame % 2 === 0 ? '-translate-y-1' : 'translate-y-0'}`}>
                <svg viewBox="0 0 16 16" width={size * 0.4} height={size * 0.4} shapeRendering="crispEdges">
                  <rect x="4" y="4" width="8" height="9" fill="#475569" stroke="#00ff41" strokeWidth="0.5" />
                  <circle cx="6" cy="7" r="1.5" fill="#facc15" />
                  <circle cx="10" cy="7" r="1.5" fill="#facc15" />
                  <polygon points="8,8 7,10 9,10" fill="#ea580c" />
                </svg>
              </div>
            )}
          </div>
        )}
      </div>

      {/* OPTIONAL CHARACTER TITLE BADGE */}
      {showTitle && config?.title && (
        <div className="mt-1 bg-[#000] border border-[#00ff41] px-1.5 py-0.5 text-[8px] font-pixel text-[#00ff41] text-center max-w-[120px] truncate shadow-[0_0_8px_rgba(0,255,65,0.3)]">
          {config.title}
        </div>
      )}
    </div>
  );
};
