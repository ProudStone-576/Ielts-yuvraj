/** Yuvraj, the coach: a gold monogram portrait and his note style used across the app. */

export const COACH_NAME = "Yuvraj";

export function YuvrajAvatar({ size = 44 }: { size?: number }) {
  return (
    <svg className="yuvraj-avatar" width={size} height={size} viewBox="0 0 64 64" role="img" aria-label={COACH_NAME}>
      <defs>
        <linearGradient id="yv-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#f3d58a" />
          <stop offset="0.55" stopColor="#d4a84b" />
          <stop offset="1" stopColor="#8a6420" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="30.5" fill="#121216" stroke="url(#yv-gold)" strokeWidth="2.5" />
      <text x="32" y="43" textAnchor="middle" fontFamily="var(--font-display), Georgia, serif" fontSize="32" fontWeight="600" fill="url(#yv-gold)">
        Y
      </text>
    </svg>
  );
}

/** A note from Yuvraj: avatar, his name, and what he has to say. */
export function YuvrajSays({ title, children }: { title?: string; children: React.ReactNode }) {
  return (
    <div className="card coach-note">
      <YuvrajAvatar />
      <div className="stack" style={{ gap: "0.5rem", minWidth: 0 }}>
        <div className="coach-sig">
          <b>{COACH_NAME}</b>
          {title && <span> · {title}</span>}
        </div>
        {children}
      </div>
    </div>
  );
}
