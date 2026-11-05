const cop = new Intl.NumberFormat('es-CO', {style: 'currency', currency: 'COP', maximumFractionDigits: 0});
export const money = (n: number) => cop.format(n);

const dt = new Intl.DateTimeFormat('es-CO', {day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit'});
const d = new Intl.DateTimeFormat('es-CO', {day: 'numeric', month: 'short', year: 'numeric'});
export const dateTime = (iso: string) => dt.format(new Date(iso));
export const date = (iso: string) => d.format(new Date(iso));

export const slug = (s: string) =>
  s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/** Resize an uploaded photo to a light JPEG data URL (fits in localStorage). */
export function compressPhoto(file: File, max = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, max / Math.max(img.width, img.height));
      const c = document.createElement('canvas');
      c.width = Math.round(img.width * scale);
      c.height = Math.round(img.height * scale);
      const ctx = c.getContext('2d')!;
      ctx.fillStyle = '#fff';
      ctx.fillRect(0, 0, c.width, c.height);
      ctx.drawImage(img, 0, 0, c.width, c.height);
      URL.revokeObjectURL(img.src);
      resolve(c.toDataURL('image/jpeg', 0.8));
    };
    img.onerror = () => reject(new Error('No se pudo leer la imagen.'));
    img.src = URL.createObjectURL(file);
  });
}
