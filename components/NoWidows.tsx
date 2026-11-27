'use client';

import {useEffect} from 'react';

/* Sin viudas (26-nov-2026): en cada texto une las dos últimas palabras con un espacio
   que no se parte, para que ninguna línea final quede con una sola palabra.
   Corre después de cargar la página y cada vez que cambia el contenido. */
const BLOCKS = 'p, h1, h2, h3, h4, h5, li, small, figcaption, blockquote, dd, dt, label, button, a, b, strong, em, span';
const NBSP = ' ';

function textNodes(el: Element) {
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const nodes: Text[] = [];
  let n: Node | null;
  while ((n = walker.nextNode())) if (n.nodeValue) nodes.push(n as Text);
  return nodes;
}

function fix(el: Element) {
  if (el.closest('input, textarea, select, code, pre, svg, [contenteditable], [data-widows="off"]')) return;
  const style = getComputedStyle(el);
  if (style.display === 'inline' || style.display === 'none') return;
  const text = el.textContent?.trim() ?? '';
  if (text.split(/\s+/).length < 3) return;
  const all = textNodes(el);
  let k = all.length - 1;
  while (k >= 0 && !(all[k].nodeValue ?? '').trim()) k--;
  const last = all[k];
  if (!last) return;
  const value = last.nodeValue ?? '';
  const trimmed = value.replace(/\s+$/, '');
  /* Ya está arreglado: el último espacio es el que no se parte */
  const lastGap = trimmed.search(/[ \u00A0]\S*$/);
  if (lastGap >= 0 && trimmed[lastGap] === NBSP) return;
  const i = trimmed.lastIndexOf(' ');
  if (i >= 0) {
    last.nodeValue = trimmed.slice(0, i) + NBSP + trimmed.slice(i + 1) + value.slice(trimmed.length);
    return;
  }
  /* La última palabra está sola en su nodo (por ejemplo dentro de un <span>): se cambia el espacio anterior */
  for (let j = k - 1; j >= 0; j--) {
    const v = all[j].nodeValue ?? '';
    if (/\u00A0$/.test(v)) return;
    if (/ $/.test(v)) { all[j].nodeValue = v.replace(/ $/, NBSP); return; }
    if (v.trim()) return;
  }
}

function run(root: ParentNode) {
  root.querySelectorAll(BLOCKS).forEach(fix);
}

export default function NoWidows() {
  useEffect(() => {
    /* Espera a que React termine de armar toda la página (incluidas las partes que cargan después);
       si se cambia el texto antes, React avisa que el texto no coincide. */
    let t: ReturnType<typeof setTimeout> | undefined;
    let mo: MutationObserver | undefined;
    let cancelled = false;
    const start = () => {
      if (cancelled) return;
      run(document);
      mo = new MutationObserver(() => {
        clearTimeout(t);
        t = setTimeout(() => run(document), 400);
      });
      mo.observe(document.body, {childList: true, subtree: true, characterData: true});
    };
    const later = () => { t = setTimeout(() => ('requestIdleCallback' in window ? window.requestIdleCallback(start, {timeout: 2000}) : start()), 1200); };
    if (document.readyState === 'complete') later();
    else window.addEventListener('load', later, {once: true});
    return () => { cancelled = true; mo?.disconnect(); clearTimeout(t); window.removeEventListener('load', later); };
  }, []);
  return null;
}
