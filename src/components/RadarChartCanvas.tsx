import React, { useState, useEffect, useRef } from 'react';
import { RadarTraits } from '../types';

interface Props {
  traits: RadarTraits;
  size?: number;
  showLabels?: boolean;
}

export const RadarChartCanvas: React.FC<Props> = ({ traits, size = 280, showLabels = true }) => {
  const [displayedTraits, setDisplayedTraits] = useState<RadarTraits>(traits);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);
  const [traitDeltas, setTraitDeltas] = useState<Partial<Record<keyof RadarTraits, number>>>({});
  const prevTraitsRef = useRef<RadarTraits>(traits);
  const animFrameRef = useRef<number | null>(null);

  useEffect(() => {
    const startTraits = { ...prevTraitsRef.current };
    const targetTraits = { ...traits };

    // Check if any trait value actually changed and calculate deltas
    const keys: (keyof RadarTraits)[] = ['kiencuong', 'phantich', 'sangtao', 'camthong', 'lanhdao', 'kyluat'];
    const deltas: Partial<Record<keyof RadarTraits, number>> = {};
    let hasChanged = false;

    keys.forEach(k => {
      const diff = (targetTraits[k] || 0) - (startTraits[k] || 0);
      if (Math.abs(diff) > 0.1) {
        hasChanged = true;
        deltas[k] = Math.round(diff * 10) / 10;
      }
    });

    if (!hasChanged) {
      setDisplayedTraits(traits);
      setTraitDeltas({});
      return;
    }

    setTraitDeltas(deltas);
    setIsAnimating(true);
    const startTime = performance.now();
    const duration = 1000; // 1 second smooth springy transition

    // Cubic + slight spring overshoot easing
    const easeOutBack = (t: number) => {
      const c1 = 1.70158;
      const c3 = c1 + 1;
      return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
    };

    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutBack(progress);

      const nextTraits = { ...startTraits };
      keys.forEach(k => {
        const startVal = startTraits[k] || 10;
        const targetVal = targetTraits[k] || 10;
        const val = startVal + (targetVal - startVal) * eased;
        nextTraits[k] = Math.round(Math.max(10, Math.min(100, val)) * 10) / 10;
      });

      setDisplayedTraits(nextTraits);

      if (progress < 1) {
        animFrameRef.current = requestAnimationFrame(animate);
      } else {
        prevTraitsRef.current = targetTraits;
        setIsAnimating(false);
      }
    };

    animFrameRef.current = requestAnimationFrame(animate);

    return () => {
      if (animFrameRef.current !== null) {
        cancelAnimationFrame(animFrameRef.current);
      }
    };
  }, [traits]);

  const center = size / 2;
  const radius = (size / 2) - 40;

  const axes = [
    { key: 'kiencuong', label: 'R: KIÊN CƯỜNG', short: 'R', color: '#00ff41' },
    { key: 'phantich', label: 'I: PHÂN TÍCH', short: 'I', color: '#00ff41' },
    { key: 'sangtao', label: 'A: SÁNG TẠO', short: 'A', color: '#00ff41' },
    { key: 'camthong', label: 'S: CẢM THÔNG', short: 'S', color: '#00ff41' },
    { key: 'lanhdao', label: 'E: LÃNH ĐẠO', short: 'E', color: '#00ff41' },
    { key: 'kyluat', label: 'C: KỶ LUẬT', short: 'C', color: '#00ff41' }
  ];

  const totalAxes = axes.length;
  const maxVal = 100;

  const getCoordinates = (index: number, value: number) => {
    const angle = (Math.PI * 2 / totalAxes) * index - Math.PI / 2;
    const normValue = Math.min(Math.max(value, 10), maxVal);
    const distance = (normValue / maxVal) * radius;
    const x = center + distance * Math.cos(angle);
    const y = center + distance * Math.sin(angle);
    return { x, y, angle };
  };

  const points = axes.map((axis, i) => {
    const val = displayedTraits[axis.key as keyof RadarTraits] || 10;
    const { x, y } = getCoordinates(i, val);
    return `${x},${y}`;
  }).join(' ');

  const gridLevels = [0.2, 0.4, 0.6, 0.8, 1.0];

  return (
    <div className="relative flex flex-col items-center justify-center select-none font-mono">
      {/* Live score update badge */}
      {isAnimating && (
        <div className="absolute -top-3 z-10 bg-[#ff00ff] text-[#0c0c0c] text-[10px] font-bold px-2 py-0.5 uppercase tracking-widest border border-[#ff00ff] animate-pulse shadow-[0_0_10px_#ff00ff]">
          ⚡ UPDATING RADAR SCORES...
        </div>
      )}

      <svg width={size} height={size} className="overflow-visible">
        {/* Background Concentric Polygon Grids */}
        {gridLevels.map((level, levelIdx) => {
          const gridPoints = axes.map((_, i) => {
            const { x, y } = getCoordinates(i, maxVal * level);
            return `${x},${y}`;
          }).join(' ');

          return (
            <polygon
              key={levelIdx}
              points={gridPoints}
              fill="none"
              stroke="#00ff41"
              strokeOpacity={levelIdx === gridLevels.length - 1 ? 0.4 : 0.15}
              strokeDasharray={levelIdx < gridLevels.length - 1 ? '2 2' : undefined}
              strokeWidth={levelIdx === gridLevels.length - 1 ? '1.5' : '1'}
            />
          );
        })}

        {/* Axis Lines from Center */}
        {axes.map((_, i) => {
          const { x, y } = getCoordinates(i, maxVal);
          return (
            <line
              key={i}
              x1={center}
              y1={center}
              x2={x}
              y2={y}
              stroke="#00ff41"
              strokeOpacity="0.2"
              strokeWidth="1"
            />
          );
        })}

        {/* Data Radar Polygon */}
        <polygon
          points={points}
          fill={isAnimating ? "#ff00ff" : "#00ff41"}
          fillOpacity={isAnimating ? "0.35" : "0.2"}
          stroke={isAnimating ? "#ff00ff" : "#00ff41"}
          strokeWidth={isAnimating ? "3" : "2"}
          className="transition-colors duration-300"
        />

        {/* Data Points, Pulsing Rings, Delta Badges and Axis Labels */}
        {axes.map((axis, i) => {
          const val = Math.round(displayedTraits[axis.key as keyof RadarTraits] || 10);
          const delta = traitDeltas[axis.key as keyof RadarTraits];
          const hasDelta = delta !== undefined && delta !== 0;
          const { x, y, angle } = getCoordinates(i, val);
          const labelCoords = getCoordinates(i, maxVal + 18);

          let textAnchor: 'start' | 'middle' | 'end' = 'middle';
          if (Math.cos(angle) > 0.3) textAnchor = 'start';
          if (Math.cos(angle) < -0.3) textAnchor = 'end';

          return (
            <g key={i}>
              {/* Pulsing Aura Circle during animation for changed points */}
              {isAnimating && hasDelta && (
                <>
                  <circle
                    cx={x}
                    cy={y}
                    r="12"
                    fill="none"
                    stroke="#ff00ff"
                    strokeWidth="1.5"
                    className="animate-ping opacity-75"
                  />
                  <circle
                    cx={x}
                    cy={y}
                    r="8"
                    fill="#ff00ff"
                    fillOpacity="0.4"
                  />
                </>
              )}

              <circle
                cx={x}
                cy={y}
                r={isAnimating && hasDelta ? "6" : "4"}
                fill={isAnimating && hasDelta ? "#ff00ff" : "#00ff41"}
                stroke="#0c0c0c"
                strokeWidth="1.5"
              />

              {/* Floating Delta Badge (+XP) */}
              {isAnimating && hasDelta && (
                <g>
                  <rect
                    x={x - 14}
                    y={y - 20}
                    width="28"
                    height="14"
                    fill="#ff00ff"
                    rx="2"
                  />
                  <text
                    x={x}
                    y={y - 10}
                    textAnchor="middle"
                    fill="#0c0c0c"
                    fontSize="9"
                    fontWeight="black"
                    className="font-mono"
                  >
                    {delta > 0 ? `+${delta}` : delta}
                  </text>
                </g>
              )}

              {showLabels && (
                <text
                  x={labelCoords.x}
                  y={labelCoords.y + 3}
                  textAnchor={textAnchor}
                  fill={isAnimating && hasDelta ? "#ff00ff" : "#00ff41"}
                  fontSize="10"
                  fontWeight="bold"
                  className="font-mono"
                >
                  {axis.short}:{val}
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
};

