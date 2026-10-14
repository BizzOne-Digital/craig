export function HeroLines({ className = '' }) {
  return (
    <svg
      className={className}
      viewBox="0 0 800 600"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M0 120 L800 80"
        stroke="url(#lineGrad)"
        strokeWidth="1"
        className="animate-draw-line"
        style={{ strokeDasharray: 820, strokeDashoffset: 820 }}
      />
      <path
        d="M100 0 L60 600"
        stroke="rgba(225,6,0,0.35)"
        strokeWidth="1"
        className="animate-draw-line-delayed"
        style={{ strokeDasharray: 620, strokeDashoffset: 620 }}
      />
      <path
        d="M700 600 L740 0"
        stroke="rgba(243,238,230,0.08)"
        strokeWidth="1"
      />
      <rect x="620" y="380" width="140" height="8" fill="rgba(225,6,0,0.9)" className="animate-redaction" />
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="800" y2="0">
          <stop stopColor="transparent" />
          <stop offset="0.5" stopColor="#E10600" />
          <stop offset="1" stopColor="transparent" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export default HeroLines;
