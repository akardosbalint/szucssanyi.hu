type IconProps = { className?: string };

export function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M13.5 21v-7.5h2.52l.38-2.93h-2.9V8.7c0-.85.24-1.43 1.46-1.43h1.56V4.66C16.2 4.6 15.32 4.5 14.28 4.5c-2.16 0-3.64 1.32-3.64 3.74v2.33H8.1v2.93h2.54V21h2.86Z" />
    </svg>
  );
}

export function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.6" />
      <circle cx="17.1" cy="6.9" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.8} className={className} aria-hidden="true">
      <rect x="3" y="6" width="18" height="12" rx="4" />
      <path d="M11 9.8v4.4l3.8-2.2Z" fill="currentColor" stroke="none" />
    </svg>
  );
}

export function TikTokIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
      <path d="M16.5 3h-2.7v11.9a2.9 2.9 0 1 1-2.9-2.9c.2 0 .4 0 .6.05V9.3a5.6 5.6 0 1 0 4.9 5.55V8.9a6.9 6.9 0 0 0 4.1 1.35V7.5a4.2 4.2 0 0 1-3.99-4.5Z" />
    </svg>
  );
}
