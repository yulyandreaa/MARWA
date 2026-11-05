import type {ReactNode} from 'react';

const paths: Record<string, ReactNode> = {
  search: <><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></>,
  cart: <><path d="M3 4h2l2.4 11.2a2 2 0 0 0 2 1.6h7.7a2 2 0 0 0 2-1.5L21 8H6"/><circle cx="10" cy="20" r="1.2"/><circle cx="17" cy="20" r="1.2"/></>,
  user: <><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></>,
  truck: <><path d="M3 6h11v10H3zM14 9h4l3 3v4h-7"/><circle cx="7" cy="17.5" r="1.8"/><circle cx="17" cy="17.5" r="1.8"/></>,
  shield: <><path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z"/><path d="m8.5 12 2.5 2.5 4.5-5"/></>,
  card: <><rect x="2.5" y="5" width="19" height="14" rx="2"/><path d="M2.5 10h19M6 15h4"/></>,
  chat: <><path d="M4 5h16v11H9l-5 4z"/><path d="M9 10h.01M12 10h.01M15 10h.01"/></>,
  tag: <><path d="M3 12V4h8l10 10-8 8z"/><circle cx="7.5" cy="8.5" r="1.3"/></>,
  tools: <><path d="M14 6a4 4 0 0 0 5 5l-9 9-3-3 9-9"/><path d="M4 4l5 5"/></>,
  phone: <path d="M5 3h4l2 5-3 2a11 11 0 0 0 6 6l2-3 5 2v4a2 2 0 0 1-2 2A17 17 0 0 1 3 5a2 2 0 0 1 2-2z"/>,
  mail: <><rect x="3" y="5" width="18" height="14" rx="2"/><path d="m3 7 9 6 9-6"/></>,
  pin: <><path d="M12 21s7-6.5 7-12a7 7 0 0 0-14 0c0 5.5 7 12 7 12z"/><circle cx="12" cy="9" r="2.5"/></>,
  arrow: <path d="M5 12h14M13 6l6 6-6 6"/>,
  chevron: <path d="m9 6 6 6-6 6"/>,
  close: <path d="M6 6l12 12M18 6 6 18"/>,
  menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
  eye: <><path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z"/><circle cx="12" cy="12" r="3"/></>,
  eyeOff: <><path d="M4 4l16 16"/><path d="M9.5 5.9A9 9 0 0 1 12 5.5c6 0 9.5 6.5 9.5 6.5a16 16 0 0 1-3 3.8M6.2 7.6A16 16 0 0 0 2.5 12S6 18.5 12 18.5a9 9 0 0 0 4.2-1"/></>,
  layers: <><path d="m12 3 9 5-9 5-9-5z"/><path d="m3 12 9 5 9-5"/><path d="m3 16 9 5 9-5"/></>,
  heart: <path d="M12 20.5s-8-4.7-8-11A4.5 4.5 0 0 1 12 6.8a4.5 4.5 0 0 1 8 2.7c0 6.3-8 11-8 11z"/>,
  check: <><circle cx="12" cy="12" r="9"/><path d="m8 12 3 3 5-6"/></>,
  clock: <><circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/></>,
  bag: <><path d="M5 8h14l1 13H4z"/><path d="M9 8V6a3 3 0 0 1 6 0v2"/></>,
  headset: <><path d="M4 14v-2a8 8 0 0 1 16 0v2"/><path d="M4 14h3v5H5a1 1 0 0 1-1-1zM20 14h-3v5h2a1 1 0 0 0 1-1z"/><path d="M17 19c0 1.5-2 2-4 2"/></>,
  dots: <><circle cx="12" cy="5" r="1.3" fill="currentColor"/><circle cx="12" cy="12" r="1.3" fill="currentColor"/><circle cx="12" cy="19" r="1.3" fill="currentColor"/></>,
  trash: <><path d="M4 7h16M9 7V4h6v3M6 7l1 13h10l1-13M10 11v6M14 11v6"/></>,
  grid: <><rect x="4" y="4" width="7" height="7"/><rect x="13" y="4" width="7" height="7"/><rect x="4" y="13" width="7" height="7"/><rect x="13" y="13" width="7" height="7"/></>,
  box: <><path d="M12 3 4 7v10l8 4 8-4V7z"/><path d="m4 7 8 4 8-4M12 11v10"/></>,
  lock: <><rect x="5" y="11" width="14" height="10" rx="1.5"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></>,
  logout: <><path d="M10 4H5v16h5"/><path d="M14 8l4 4-4 4M18 12H9"/></>,
  ethernet: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M7 15V9h2V7h6v2h2v6zM10 15v-2M12 15v-2M14 15v-2"/></>,
  fiber: <><path d="M3 21c5 0 6-4 8-8s3-6 7-8"/><path d="m16 3 5 3M18 8l3-1M14 5l1-3M4 16l3 3"/></>,
  network: <><circle cx="12" cy="5" r="2.5"/><circle cx="5" cy="19" r="2.5"/><circle cx="12" cy="19" r="2.5"/><circle cx="19" cy="19" r="2.5"/><path d="M12 7.5v9M5 16.5V13h14v3.5"/></>,
  pipes: <><ellipse cx="8" cy="15" rx="5" ry="5.5"/><path d="M8 9.5h8a5 5 0 0 1 0 11h-8"/><ellipse cx="16" cy="9" rx="5" ry="4.5"/></>,
  server: <><rect x="4" y="3" width="16" height="8" rx="1.5"/><rect x="4" y="13" width="16" height="8" rx="1.5"/><path d="M8 7h.01M8 17h.01M12 7h4M12 17h4"/></>,
  tv: <><rect x="3" y="4" width="18" height="13" rx="1.5"/><path d="M8 21h8M12 17v4"/></>,
  bolt: <path d="M13 2 5 14h6l-1 8 8-12h-6z"/>,
  star: <path d="m12 3 2.8 5.8 6.2.9-4.5 4.4 1.1 6.3L12 17.4l-5.6 3 1.1-6.3L3 9.7l6.2-.9z"/>,
  help: <><circle cx="12" cy="12" r="9"/><path d="M9.5 9.5a2.5 2.5 0 1 1 3.8 2.1c-.8.5-1.3 1.1-1.3 2M12 17h.01"/></>,
  login: <><path d="M14 4h5v16h-5"/><path d="M4 12h11M11 8l4 4-4 4"/></>,
  repeat: <><path d="M4 11V9a3 3 0 0 1 3-3h12M16 3l3 3-3 3"/><path d="M20 13v2a3 3 0 0 1-3 3H5M8 21l-3-3 3-3"/></>,
};

export function Icon({name, className}: {name: keyof typeof paths | string; className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[name]}
    </svg>
  );
}
