export function InvitationArt({ compact = false }: { compact?: boolean }) {
  return (
    <div className="invitation-frame paper-grain overflow-hidden rounded-[0.2rem] px-5 py-6 text-tinta draw-in">
      <svg
        viewBox="0 0 360 430"
        role="img"
        aria-label="Ilustracion de Luis y Oscar con montes y lavanda"
        className={compact ? "mx-auto h-64 w-full max-w-sm" : "mx-auto h-auto w-full max-w-md"}
      >
        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path strokeOpacity=".34" strokeWidth="1.4" d="M18 122c37-17 67-22 104-6 22 9 44 13 71-2 40-23 75-22 147-8" />
          <path strokeOpacity=".22" strokeWidth="1.2" d="M24 142c35-10 56-5 86 9 27 12 55 10 83-4 43-22 76-17 136 5" />
          <path strokeOpacity=".22" strokeWidth="1.2" d="M54 115l19-24 16 19 10-9 12 15" />
          <path strokeOpacity=".22" strokeWidth="1.2" d="M248 115l26-27 20 25 12-11 21 18" />
        </g>

        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2">
          <path d="M113 38l-3 58c11 8 25 10 39 2l-2-60-9 5-8-12-8 12-9-5Z" />
          <path d="M119 55h21M121 70h17M123 86h13" />
          <path d="M216 36c7 8 25 7 34 0l5 60c-11 10-32 11-44 0l5-60Z" />
          <path d="M218 31c5-10 13-10 17 0 5-11 15-11 19 0" />
          <path d="M224 58h21M225 73h18M227 88h15" />
        </g>

        <g fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.4">
          <path d="M128 192c-8 7-12 20-12 39v68" />
          <path d="M165 191c9 8 14 23 14 46v66" />
          <path d="M121 232c14 10 35 9 53-1" />
          <path d="M132 166c12-15 31-8 36 7 4 14-4 30-18 31-17 1-27-22-18-38Z" />
          <path d="M137 168c10 6 20 6 30 0" />
          <path d="M128 304h20M164 304h20" />

          <path d="M198 190c-9 8-14 22-14 43v70" />
          <path d="M238 190c11 10 16 26 15 50v63" />
          <path d="M188 233c17 11 41 10 62-2" />
          <path d="M205 165c12-14 32-9 38 7 4 13-4 30-19 31-18 1-29-21-19-38Z" />
          <path d="M208 168c11 6 22 5 32-1" />
          <path d="M186 236c-13 15-26 25-41 28" />
          <path d="M250 235c15 12 29 18 43 17" />
          <path d="M187 304h20M237 304h20" />
        </g>

        <g stroke="currentColor" strokeLinecap="round" strokeLinejoin="round">
          <path fill="#2d2a28" strokeWidth="2" d="M165 285c14-20 42-18 54 1 10 17 0 45-27 45-27 0-37-28-27-46Z" />
          <path fill="#fbf3df" strokeWidth="1.8" d="M179 289c8 10 19 10 28 0 3 17-2 29-14 29-12 0-17-12-14-29Z" />
          <path fill="#2d2a28" strokeWidth="2" d="M167 284l-18-18M216 284l19-18" />
          <path stroke="#fbf3df" strokeWidth="1.6" d="M185 302h.1M203 302h.1M193 309v5" />
        </g>

        <g fill="none" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2">
          <path stroke="#748260" d="M153 378c23-21 47-21 70 0M180 378c-8-14-18-24-32-29M197 378c9-15 20-25 36-30" />
          <path stroke="#7d6098" d="M146 351c-18-10-35-13-51-8M143 360c-19-5-35-3-48 8M236 351c18-10 35-13 51-8M239 360c19-5 35-3 48 8" />
          <path stroke="#7d6098" d="M95 343l-9-5M108 341l-9-7M121 343l-8-7M287 343l9-5M274 341l9-7M261 343l8-7" />
        </g>

        <text x="180" y="366" textAnchor="middle" className="fill-tinta font-hand text-[31px]">
          4-7-2026
        </text>
      </svg>
    </div>
  );
}

export function LavenderDivider({ label }: { label?: string }) {
  return (
    <div className="lavender-divider text-lavanda" aria-hidden={!label}>
      <span className="font-hand text-2xl font-bold">{label ?? "✦"}</span>
    </div>
  );
}
