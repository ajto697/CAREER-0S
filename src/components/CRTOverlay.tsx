import React from 'react';

interface Props {
  enabled: boolean;
}

export const CRTOverlay: React.FC<Props> = ({ enabled }) => {
  if (!enabled) return null;

  return (
    <div className="aria-hidden:true pointer-events-none fixed inset-0 z-50 overflow-hidden select-none">
      {/* CRT Animation Keyframes */}
      <style>{`
        @keyframes crtFlicker {
          0% { opacity: 0.95; }
          48% { opacity: 0.98; }
          50% { opacity: 0.88; }
          52% { opacity: 0.99; }
          85% { opacity: 0.96; }
          87% { opacity: 0.91; }
          90% { opacity: 1; }
          100% { opacity: 0.95; }
        }
        .animate-crt-flicker {
          animation: crtFlicker 0.25s infinite;
        }
      `}</style>

      {/* CRT Scanline pattern with subtle periodic screen flicker */}
      <div 
        className="absolute inset-0 bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.35)_50%)] bg-[length:100%_4px] animate-crt-flicker"
      />
      {/* Vignette border glow */}
      <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(0,0,0,0.65)] border border-[#00ff41]/20" />
    </div>
  );
};

