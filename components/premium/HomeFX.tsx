'use client';

import {useEffect, useState} from 'react';
import Lenis from 'lenis';

/**
 * Efectos de la página de inicio (10-nov-2026, ronda sin créditos):
 * - Desplazamiento suave (Lenis) y enlaces del menú con deslizamiento suave.
 * - Títulos que aparecen palabra por palabra ([data-split]).
 * - Bloques que aparecen al entrar en pantalla ([data-fx]).
 * - Profundidad: imágenes que se mueven más lento que el texto ([data-speed]).
 * - Brillo que sigue al mouse en tarjetas ([data-glow]).
 * - Texto gigante que se desliza con el desplazamiento ([data-scroll-x]).
 * - Proceso fijo: los 4 pasos se encienden uno a uno ([data-steps]).
 * - Cable de luz lateral que se llena al bajar (.hv-cable).
 * Todo se desactiva si el visitante pide reducir el movimiento.
 */
export function HomeFX() {
  useEffect(() => {
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const cleanups: (() => void)[] = [];

    /* títulos palabra por palabra */
    document.querySelectorAll<HTMLElement>('[data-split]').forEach(el => {
      if (el.dataset.splitDone) return;
      el.dataset.splitDone = '1';
      let i = 0;
      const wrap = (node: Node) => {
        if (node.nodeType === 3) {
          const frag = document.createDocumentFragment();
          (node.textContent ?? '').split(/(\s+)/).forEach(part => {
            if (!part) return;
            if (/^\s+$/.test(part)) { frag.appendChild(document.createTextNode(part)); return; }
            const outer = document.createElement('span'); outer.className = 'w';
            const inner = document.createElement('span'); inner.textContent = part; inner.style.transitionDelay = `${i++ * 55}ms`;
            outer.appendChild(inner); frag.appendChild(outer);
          });
          node.parentNode?.replaceChild(frag, node);
        } else node.childNodes.forEach(c => wrap(c));
      };
      Array.from(el.childNodes).forEach(wrap);
    });

    /* aparición al entrar en pantalla */
    const io = new IntersectionObserver(entries => entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); }
    }), {threshold: .18, rootMargin: '0px 0px -60px 0px'});
    document.querySelectorAll('[data-split], [data-fx]').forEach(el => reduce ? el.classList.add('in') : io.observe(el));
    cleanups.push(() => io.disconnect());
    if (reduce) return () => cleanups.forEach(f => f());

    /* desplazamiento suave */
    const lenis = new Lenis({duration: 1.15, smoothWheel: true});
    let raf = 0;
    const loop = (t: number) => { lenis.raf(t); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    const onAnchor = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest('a[href^="/#"], a[href^="#"]') as HTMLAnchorElement | null;
      if (!a || location.pathname !== '/') return;
      const id = a.getAttribute('href')!.split('#')[1];
      const el = id && document.getElementById(id);
      if (!el) return;
      e.preventDefault();
      lenis.scrollTo(el, {offset: -70});
      history.replaceState(null, '', `#${id}`);
    };
    document.addEventListener('click', onAnchor);
    cleanups.push(() => { cancelAnimationFrame(raf); lenis.destroy(); document.removeEventListener('click', onAnchor); });

    /* efectos ligados al desplazamiento */
    const speeds = Array.from(document.querySelectorAll<HTMLElement>('[data-speed]'));
    const slides = Array.from(document.querySelectorAll<HTMLElement>('[data-scroll-x]'));
    const stepsWrap = document.querySelector<HTMLElement>('[data-steps]');
    const cable = document.querySelector<HTMLElement>('.hv-cable i');
    const onScroll = () => {
      const vh = window.innerHeight;
      speeds.forEach(el => {
        const r = el.getBoundingClientRect();
        const center = r.top + r.height / 2 - vh / 2;
        el.style.transform = `translate3d(0, ${(-center * Number(el.dataset.speed)).toFixed(1)}px, 0) scale(1.12)`;
      });
      slides.forEach(el => {
        const r = el.getBoundingClientRect();
        const p = (vh - r.top) / (vh + r.height);
        el.style.transform = `translate3d(${(-p * Number(el.dataset.scrollX)).toFixed(1)}px, 0, 0)`;
      });
      if (stepsWrap) {
        const r = stepsWrap.getBoundingClientRect();
        const total = r.height - vh;
        const p = Math.min(1, Math.max(0, -r.top / Math.max(total, 1)));
        const n = Number(stepsWrap.dataset.steps);
        stepsWrap.style.setProperty('--p', p.toFixed(3));
        const idx = Math.min(n - 1, Math.floor(p * n * 0.999));
        stepsWrap.querySelectorAll('li').forEach((li, i) => {
          li.classList.toggle('on', i <= idx);
          li.classList.toggle('cur', i === idx);
          // entrada de cada tarjeta ligada al desplazamiento (0 = fuera, 1 = en su lugar)
          const e = Math.min(1, Math.max(0, (p * 1.25 + .12 - i * .2) / .26));
          li.style.setProperty('--e', (1 - Math.pow(1 - e, 3)).toFixed(3));
        });
      }
      if (cable) {
        const max = document.documentElement.scrollHeight - vh;
        cable.style.transform = `scaleY(${Math.min(1, window.scrollY / Math.max(max, 1)).toFixed(4)})`;
      }
    };
    lenis.on('scroll', onScroll);
    window.addEventListener('resize', onScroll);
    onScroll();
    cleanups.push(() => window.removeEventListener('resize', onScroll));

    /* brillo que sigue al mouse en tarjetas */
    const glow = (e: PointerEvent) => {
      const card = (e.target as HTMLElement).closest<HTMLElement>('[data-glow]');
      if (!card) return;
      const r = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${e.clientX - r.left}px`);
      card.style.setProperty('--my', `${e.clientY - r.top}px`);
    };
    document.addEventListener('pointermove', glow);
    cleanups.push(() => document.removeEventListener('pointermove', glow));

    return () => cleanups.forEach(f => f());
  }, []);
  return null;
}

/* Entrada animada: el logo de MARWA aparece barra por barra y la cortina se abre (una vez por sesión). */
export function HomeIntro() {
  const [show, setShow] = useState(true);
  const [leaving, setLeaving] = useState(false);
  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem('marwa-intro') === '1'; } catch { /* sin almacenamiento */ }
    if (seen || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setShow(false); return; }
    const t1 = setTimeout(() => setLeaving(true), 1300);
    // se marca como vista al terminar (así el modo de desarrollo, que ejecuta esto dos veces, no la salta)
    const t2 = setTimeout(() => { setShow(false); try { sessionStorage.setItem('marwa-intro', '1'); } catch { /* sin almacenamiento */ } }, 2000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, []);
  if (!show) return null;
  return (
    <div className={`hv-intro${leaving ? ' out' : ''}`} aria-hidden="true">
      <div className="hv-intro-logo">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/assets/marwa-logo-oficial.png" alt="" width={900} height={445}/>
        <span className="hv-intro-line"/>
      </div>
    </div>
  );
}
