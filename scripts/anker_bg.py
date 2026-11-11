"""Recolorea el fondo de un hero de estudio MARWA al degradado de Anker.
Pared: (222,235,249) arriba -> blanco en la línea de la mesa. Superficie: (231,241,247) -> (242,248,253).
El producto (píxeles saturados) se conserva; sombras y brillos del fondo se preservan por razón respecto
a un fondo de referencia estimado por fila (blur horizontal enmascarado).
uso: python3 anker_bg.py entrada.jpg salida.jpg TABLE_Y
"""
import sys
import numpy as np
from PIL import Image

src, dst, table_y = sys.argv[1], sys.argv[2], int(sys.argv[3])
a = np.asarray(Image.open(src).convert('RGB')).astype(np.float32)
H, W, _ = a.shape

sat = a.max(2) - a.min(2)
lum = a.mean(2)
row_med = np.median(lum, axis=1, keepdims=True)
m = ((sat < 40) & (np.abs(lum - row_med) < 30)).astype(np.float32)

# Fondo de referencia: promedio horizontal enmascarado (ventana ancha) por fila
R = 150
def hblur(x):
    c = np.cumsum(np.pad(x, ((0, 0), (R + 1, R)), mode='edge'), axis=1)
    return c[:, 2 * R + 1:] - c[:, :-2 * R - 1]
den = hblur(m)
ref = np.stack([hblur(a[..., k] * m) for k in range(3)], -1) / np.maximum(den, 1)[..., None]
# filas sin datos suficientes: usar mediana de la fila
fallback = np.median(a, axis=1, keepdims=True).repeat(W, 1)
ref = np.where((den < 50)[..., None], fallback, ref)

# Degradado objetivo por fila (colores de Anker)
y = np.arange(H, dtype=np.float32)[:, None]
top, white = np.array([222, 235, 249], np.float32), np.array([255, 255, 255], np.float32)
s0, s1 = np.array([231, 241, 247], np.float32), np.array([242, 248, 253], np.float32)
t_wall = np.clip(y / table_y, 0, 1)
t_wall = t_wall ** 1.15
wall = top + (white - top) * t_wall[..., None]
t_surf = np.clip((y - table_y) / max(H - table_y, 1), 0, 1)
surf = s0 + (s1 - s0) * t_surf[..., None]
target = np.where((y < table_y)[..., None], wall, surf)
target = np.broadcast_to(target, (H, W, 3))

# Mapeo: debajo de ref escala por razón (sombras), encima comprime hacia 255 (brillos)
ratio = a / np.maximum(ref, 1)
dark = target * ratio
bright = target + (a - ref) * (255 - target) / np.maximum(255 - ref, 1)
new = np.where(a <= ref, dark, bright)

# Peso de fondo: baja saturación -> fondo; producto saturado -> original
w = np.clip((70 - sat) / 40, 0, 1)[..., None]
out = new * w + a * (1 - w)
# Borde y frente de la mesa (sin producto): superficie limpia como Anker
edge_y = int(sys.argv[4]) if len(sys.argv) > 4 else H
out[edge_y:] = target[edge_y:]
# Suavizar el grano amplificado en la superficie (solo fondo, no producto)
from PIL import ImageFilter
sm = np.asarray(Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(3))).astype(np.float32)
band = slice(table_y + 6, edge_y)
out[band] = sm[band] * w[band] + out[band] * (1 - w[band])
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(dst, quality=92)
print('ok', W, H)
