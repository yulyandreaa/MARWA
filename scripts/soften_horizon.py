"""Suaviza la línea pared/mesa de un hero de categoría en la zona del texto (lado izquierdo).
La transición dura se vuelve un degradado vertical suave hasta poco antes del producto,
y desde ahí vuelve gradualmente a la línea original (el producto no se toca).
uso: python3 soften_horizon.py entrada salida TABLE_Y
"""
import sys
import numpy as np
from PIL import Image

src, dst, table_y = sys.argv[1], sys.argv[2], int(sys.argv[3])
im = Image.open(src).convert('RGB')
a = np.asarray(im).astype(np.float32)
H, W, _ = a.shape

# borde izquierdo del producto: primera columna con varios píxeles saturados u oscuros
sat = (a.max(2) - a.min(2) > 40) | (a.mean(2) < 150)
cols = np.where(sat.sum(0) > 20)[0]
prod_x = int(cols.min())
end = prod_x - 250          # la línea queda dura desde aquí
start = end - 900           # y es totalmente suave antes de aquí

# versión suave: desenfoque vertical fuerte solo en la banda del horizonte
B = 420
y0, y1 = max(table_y - B, 0), min(table_y + B, H)
# desenfoque solo vertical: promedio móvil por columna (kernel ancho = 2*R)
R = 170
pad = np.pad(a[y0:y1], ((R, R), (0, 0), (0, 0)), mode='edge')
c = np.cumsum(pad, axis=0)
c = np.concatenate([np.zeros((1, W, 3), np.float32), c], 0)
vb = (c[2 * R:2 * R + (y1 - y0)] - c[:y1 - y0]) / (2 * R)
# pesos: horizontal (1 = suave, 0 = original) y vertical (para no tocar fuera de la banda)
wx = np.clip((end - np.arange(W)) / max(end - start, 1), 0, 1).astype(np.float32)
yy = np.arange(y0, y1, dtype=np.float32)
wy = np.clip(1 - np.abs(yy - table_y) / B, 0, 1) ** 0.6
w = (wy[:, None] * wx[None, :])[..., None]
out = a.copy()
out[y0:y1] = vb * w + a[y0:y1] * (1 - w)
Image.fromarray(np.clip(out, 0, 255).astype(np.uint8)).save(dst, quality=95)
print('producto desde x =', prod_x, '| suave hasta', start, '-> duro en', end)
