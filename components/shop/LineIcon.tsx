const paths: Record<string, JSX.Element> = {
  todo: <><rect x="3" y="3" width="7" height="7" rx="1.5"/><rect x="14" y="3" width="7" height="7" rx="1.5"/><rect x="3" y="14" width="7" height="7" rx="1.5"/><rect x="14" y="14" width="7" height="7" rx="1.5"/></>,
  cableado: <path d="M5 4v6a4 4 0 0 0 4 4h6a4 4 0 0 1 4 4v2M5 4h4M5 4H1M19 20h4M19 20h-4"/>,
  fibra: <><circle cx="12" cy="12" r="3"/><path d="M12 2v4M12 18v4M2 12h4M18 12h4M5 5l3 3M16 16l3 3M19 5l-3 3M8 16l-3 3"/></>,
  networking: <><rect x="2" y="4" width="20" height="6" rx="1.5"/><rect x="2" y="14" width="20" height="6" rx="1.5"/><path d="M6 7h.01M6 17h.01M10 7h4M10 17h4"/></>,
  plastica: <><ellipse cx="6" cy="12" rx="3" ry="7"/><path d="M6 5h12a3 7 0 0 1 0 14H6"/></>,
  infraestructura: <><rect x="5" y="2" width="14" height="20" rx="1.5"/><path d="M8 6h8M8 10h8M8 14h8M9 18h.01"/></>,
  hdtv: <><rect x="2" y="5" width="20" height="13" rx="2"/><path d="M8 22h8M12 18v4"/></>,
  energia: <path d="M13 2 4 14h7l-1 8 9-12h-7z"/>,
};

export function LineIcon({id, className}: {id: string; className?: string}) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      {paths[id] ?? paths.todo}
    </svg>
  );
}
