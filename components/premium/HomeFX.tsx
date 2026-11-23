'use client';

import {useEffect, useState} from 'react';

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
  /* 19-nov-2026 · página "más humana": sin efectos de aparición. Los títulos y los bloques siempre están visibles
     (pedido del usuario). Se quitaron también los títulos palabra por palabra, el desplazamiento suave (Lenis),
     el cable de luz lateral y el brillo que sigue al mouse. El código anterior está en git. */
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
        <img src="/assets/marwa-logo-oficial.png" alt="" width={1200} height={602}/>
        <span className="hv-intro-line"/>
      </div>
    </div>
  );
}
