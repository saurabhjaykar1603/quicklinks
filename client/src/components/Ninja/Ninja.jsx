/* Hand-drawn ninja mascot — mask, headband ribbons and happy eyes */
function Ninja({ size = 96, mood = "happy" }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      role="img"
      aria-label="QuickLinks ninja mascot"
    >
      {/* headband ribbons flying left */}
      <path d="M14 40 L-2 30 L8 46 Z" fill="#e4573f" />
      <path d="M16 48 L-4 46 L10 56 Z" fill="#c74a35" />

      {/* head */}
      <circle cx="62" cy="62" r="46" fill="#453931" />
      <circle cx="62" cy="62" r="46" stroke="#332a24" strokeWidth="3" />

      {/* face opening */}
      <rect x="26" y="46" width="72" height="30" rx="15" fill="#f7e7c4" />

      {/* eyes */}
      {mood === "happy" ? (
        <>
          <path
            d="M44 62 q5 -8 10 0"
            stroke="#332a24"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
          <path
            d="M70 62 q5 -8 10 0"
            stroke="#332a24"
            strokeWidth="4"
            strokeLinecap="round"
            fill="none"
          />
        </>
      ) : (
        <>
          <ellipse cx="49" cy="61" rx="5" ry="7" fill="#332a24" />
          <ellipse cx="75" cy="61" rx="5" ry="7" fill="#332a24" />
          <circle cx="51" cy="58" r="1.8" fill="#ffffff" />
          <circle cx="77" cy="58" r="1.8" fill="#ffffff" />
        </>
      )}

      {/* headband */}
      <rect x="20" y="36" width="84" height="10" rx="5" fill="#e4573f" />

      {/* blush */}
      <circle cx="36" cy="68" r="4" fill="#ef6a56" opacity="0.45" />
      <circle cx="88" cy="68" r="4" fill="#ef6a56" opacity="0.45" />

      {/* little link charm */}
      <g transform="translate(88 92) rotate(-18)">
        <rect
          x="0"
          y="0"
          width="16"
          height="9"
          rx="4.5"
          stroke="#2f9c81"
          strokeWidth="3"
          fill="none"
        />
        <rect
          x="11"
          y="0"
          width="16"
          height="9"
          rx="4.5"
          stroke="#23806a"
          strokeWidth="3"
          fill="none"
        />
      </g>
    </svg>
  );
}

export default Ninja;
