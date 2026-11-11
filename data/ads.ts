/**
 * Publicidad de la columna de filtros (páginas de categoría y "Todos los productos").
 * Para cambiarla: reemplazar `image` (formato vertical 1:2, unos 900 x 1800 px) y, si se quiere,
 * poner `href` (enlace a una categoría, producto o promoción). Sin `href` la imagen no es clicable.
 */
export type SideAd = {image: string; alt: string; href?: string; width: number; height: number};

export const sideAd: SideAd = {
  image: '/assets/publicidad/soluciones-redes-personaje-v1.jpg',
  alt: 'MARWA Redes y Energía: soluciones en redes y telecomunicaciones para proyectos que no se detienen',
  width: 889,
  height: 1769,
};
