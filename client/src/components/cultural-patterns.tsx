export function CulturalPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <pattern id="bhutan-pattern" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
        <rect width="20" height="20" fill="currentColor" opacity="0.1" />
        <path
          d="M10 2L15 8L10 14L5 8Z"
          stroke="currentColor"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        <circle cx="10" cy="8" r="2" fill="currentColor" opacity="0.2" />
      </pattern>
      <rect width="100%" height="100%" fill="url(#bhutan-pattern)" />
    </svg>
  );
}

export function DzongRoof({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 60"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M20 50L40 20L60 30L80 15L100 25L120 10L140 20L160 30L180 20L200 40"
        stroke="currentColor"
        strokeWidth="3"
        fill="none"
        opacity="0.3"
      />
      <path
        d="M0 60L20 50L40 20L60 30L80 15L100 25L120 10L140 20L160 30L180 20L200 40L200 60Z"
        fill="currentColor"
        opacity="0.1"
      />
    </svg>
  );
}

export function PrayerFlags({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 300 80"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <line x1="0" y1="20" x2="300" y2="20" stroke="currentColor" strokeWidth="2" opacity="0.3" />
      {[0, 60, 120, 180, 240].map((x, i) => (
        <g key={i}>
          <rect
            x={x + 10}
            y="20"
            width="40"
            height="30"
            fill={["#f48c28", "#fecd2f", "#dc2626", "#16a34a", "#2563eb"][i]}
            opacity="0.7"
          />
          <line x1={x + 10} y1="20" x2={x + 10} y2="50" stroke="currentColor" strokeWidth="1" />
        </g>
      ))}
    </svg>
  );
}

export function BuddhaFace({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Buddha Face Outline */}
      <ellipse cx="100" cy="110" rx="60" ry="70" stroke="currentColor" strokeWidth="2" fill="none" opacity="0.15" />
      
      {/* Hair/Ushnisha */}
      <path
        d="M60 80 Q100 40 140 80 Q130 60 100 55 Q70 60 60 80"
        stroke="currentColor"
        strokeWidth="1.5"
        fill="none"
        opacity="0.2"
      />
      
      {/* Eyes */}
      <ellipse cx="85" cy="95" rx="8" ry="6" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      <ellipse cx="115" cy="95" rx="8" ry="6" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.3" />
      
      {/* Third Eye */}
      <circle cx="100" cy="80" r="3" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.25" />
      
      {/* Nose */}
      <path d="M100 105 L95 115 L100 120 L105 115 Z" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
      
      {/* Mouth */}
      <path d="M90 130 Q100 140 110 130" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.25" />
      
      {/* Lotus Petals around face */}
      <g opacity="0.1">
        {[0, 45, 90, 135, 180, 225, 270, 315].map((angle, i) => {
          const x = 100 + 90 * Math.cos((angle * Math.PI) / 180);
          const y = 110 + 90 * Math.sin((angle * Math.PI) / 180);
          return (
            <ellipse
              key={i}
              cx={x}
              cy={y}
              rx="15"
              ry="8"
              transform={`rotate(${angle} ${x} ${y})`}
              stroke="currentColor"
              strokeWidth="1"
              fill="none"
            />
          );
        })}
      </g>
    </svg>
  );
}

export function Stupa({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 120 160"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Base */}
      <rect x="20" y="140" width="80" height="15" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.15" />
      
      {/* Main dome */}
      <ellipse cx="60" cy="120" rx="35" ry="25" stroke="currentColor" strokeWidth="1.5" fill="none" opacity="0.2" />
      
      {/* Harmika (square structure) */}
      <rect x="50" y="85" width="20" height="15" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.2" />
      
      {/* Spire rings */}
      <circle cx="60" cy="75" r="8" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.15" />
      <circle cx="60" cy="65" r="6" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.15" />
      <circle cx="60" cy="55" r="4" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.15" />
      
      {/* Top jewel */}
      <circle cx="60" cy="45" r="3" stroke="currentColor" strokeWidth="1" fill="currentColor" opacity="0.2" />
      
      {/* Prayer flags */}
      <line x1="30" y1="45" x2="90" y2="45" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
      <rect x="35" y="40" width="8" height="6" fill="currentColor" opacity="0.1" />
      <rect x="52" y="40" width="8" height="6" fill="currentColor" opacity="0.1" />
      <rect x="69" y="40" width="8" height="6" fill="currentColor" opacity="0.1" />
    </svg>
  );
}

export function LotusPattern({ className = "" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 200 200"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Central circle */}
      <circle cx="100" cy="100" r="15" stroke="currentColor" strokeWidth="1" fill="none" opacity="0.15" />
      
      {/* Lotus petals - inner layer */}
      {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((angle, i) => {
        const x1 = 100 + 25 * Math.cos((angle * Math.PI) / 180);
        const y1 = 100 + 25 * Math.sin((angle * Math.PI) / 180);
        const x2 = 100 + 40 * Math.cos((angle * Math.PI) / 180);
        const y2 = 100 + 40 * Math.sin((angle * Math.PI) / 180);
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} Q ${x2} ${y2} ${x1 + 10 * Math.cos(((angle + 15) * Math.PI) / 180)} ${y1 + 10 * Math.sin(((angle + 15) * Math.PI) / 180)}`}
            stroke="currentColor"
            strokeWidth="1"
            fill="none"
            opacity="0.12"
          />
        );
      })}
      
      {/* Lotus petals - outer layer */}
      {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map((angle, i) => {
        const x1 = 100 + 45 * Math.cos((angle * Math.PI) / 180);
        const y1 = 100 + 45 * Math.sin((angle * Math.PI) / 180);
        const x2 = 100 + 65 * Math.cos((angle * Math.PI) / 180);
        const y2 = 100 + 65 * Math.sin((angle * Math.PI) / 180);
        return (
          <path
            key={i}
            d={`M ${x1} ${y1} Q ${x2} ${y2} ${x1 + 15 * Math.cos(((angle + 20) * Math.PI) / 180)} ${y1 + 15 * Math.sin(((angle + 20) * Math.PI) / 180)}`}
            stroke="currentColor"
            strokeWidth="0.8"
            fill="none"
            opacity="0.08"
          />
        );
      })}
    </svg>
  );
}
