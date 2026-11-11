"""Excel de inventario MARWA -> data/inventario.ts + fotos y fichas en public/.
Uso: venv/bin/python -I inventario.py <excel> <carpeta EDICION> <carpeta FICHAS> <proyecto>
"""
import json, os, re, shutil, subprocess, sys, unicodedata
import openpyxl
from PIL import Image, ImageFilter, ImageOps

# Foto principal elegida a mano cuando la marcada como "Producto" es un acercamiento (n.º de foto en el orden normal).
MAIN = {'MW-001': 2, 'MW-002': 2, 'MW-003': 2, 'MW-004': 2, 'MW-005': 2, 'MW-020': 3}
FILL = 0.78   # el producto ocupa el 78 % del lado de la foto: todos se ven del mismo tamaño
SIDE = 1200

def whiten(im, bg):
    """Fondo blanco parejo en todas las fotos: el gris del fondo pasa a blanco (mismo ajuste en todo
    el cuadro, así el producto conserva su color) y lo que queda casi blanco se limpia del todo."""
    gains = [min(1.45, 250 / max(1, c)) for c in bg]
    lut = []
    for g in gains:
        for v in range(256):
            x = min(255.0, v * g)
            # Suaviza el paso a blanco desde 236: el fondo y el viñeteado quedan en 255.
            if x > 236: x = 236 + (x - 236) * (19 / 14) if x < 250 else 255
            lut.append(min(255, round(x)))
    return im.point(lut)

def normalize(src, dst):
    im = ImageOps.exif_transpose(Image.open(src)).convert('RGB')
    w, h = im.size
    small = im.resize((300, max(1, round(300 * h / w))))
    sw, sh = small.size
    px = small.load()
    b = max(2, sw // 30)
    border = [px[x, y] for x in range(sw) for y in list(range(b)) + list(range(sh - b, sh))] + \
             [px[x, y] for y in range(sh) for x in list(range(b)) + list(range(sw - b, sw))]
    bg = tuple(sorted(c[i] for c in border)[len(border) // 2] for i in range(3))
    mask = Image.new('L', small.size)
    mask.putdata([255 if max(abs(c[0] - bg[0]), abs(c[1] - bg[1]), abs(c[2] - bg[2])) > 30 else 0 for c in small.getdata()])
    mask = mask.filter(ImageFilter.MinFilter(3)).filter(ImageFilter.MaxFilter(5))
    box = mask.getbbox()
    k = w / sw
    if not box or (box[2] - box[0] > sw * .96 and box[3] - box[1] > sh * .96):
        # Foto que ya llena todo el cuadro (acercamiento): solo se lleva a cuadrado sin recortar el producto.
        x0, y0, x1, y1 = 0, 0, w, h
    else:
        x0, y0, x1, y1 = [round(v * k) for v in box]
    cx, cy = (x0 + x1) / 2, (y0 + y1) / 2
    side = max(x1 - x0, y1 - y0) / (FILL if box and (x1 - x0, y1 - y0) != (w, h) else 1)
    side = max(side, 1)
    canvas = Image.new('RGB', (round(side), round(side)), bg)  # se blanquea después junto con la foto
    # Borde difuminado: la foto se funde con el fondo agregado y no se nota el corte.
    f = max(4, round(min(w, h) * .06))
    fade = Image.new('L', (w, h), 0)
    fade.paste(255, (f, f, w - f, h - f))
    fade = fade.filter(ImageFilter.GaussianBlur(f / 2))
    canvas.paste(im, (round(side / 2 - cx), round(side / 2 - cy)), fade)
    canvas = canvas.resize((SIDE, SIDE), Image.LANCZOS)
    canvas = whiten(canvas, bg)
    canvas.save(dst, 'JPEG', quality=84, optimize=True, progressive=True)

XLSX, EDIC, FICHAS, ROOT = sys.argv[1:5]
OUT_IMG = os.path.join(ROOT, 'public/assets/productos')
OUT_PDF = os.path.join(ROOT, 'public/fichas')
os.makedirs(OUT_IMG, exist_ok=True); os.makedirs(OUT_PDF, exist_ok=True)

CAT = {'Cableado estructurado': 'cableado', 'Fibra óptica': 'fibra', 'Línea plástica': 'plastica',
       'Canalización y ductería': 'canalizacion', 'HDTV': 'hdtv', 'Metalmecánica': 'metalmecanica'}
HIDDEN = {'MW-012': 'Viene incluido con el patch panel de 48 puertos (MW-018); no se vende por separado.'}
EMPTY = {None, '', '—', '-', 'Por confirmar'}

def ok(v):
    return v is not None and str(v).strip() not in EMPTY and not str(v).startswith('Por confirmar')

def slug(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii', 'ignore').decode().lower()
    s = s.replace('"', '-pulg').replace('/', '-')
    return re.sub(r'-+', '-', re.sub(r'[^a-z0-9]+', '-', s)).strip('-')

def cap(s):
    s = s.strip()
    return s[:1].upper() + s[1:]

wb = openpyxl.load_workbook(XLSX, data_only=True)
H = [c.value for c in wb['Productos'][1]]
rows = [dict(zip(H, r)) for r in wb['Productos'].iter_rows(min_row=2, values_only=True) if r[0]]

photos = {}
for code, _, fname, _, use, rep, folder in wb['Fotos editadas'].iter_rows(min_row=2, values_only=True):
    if code: photos.setdefault(code, []).append((fname, use, rep, folder))

ORDER = {'Producto': 0, '—': 1, None: 1, 'Empaque': 2}
products, report, used_ids = [], [], set()
for r in rows:
    code, name = r['Código'], r['Nombre del producto'].strip()
    sub = (r['Subcategoría'] or '').strip()
    cat = CAT[r['Categoría']]
    tool = sub.startswith('Herramienta')
    pid = slug(name)
    if pid in used_ids: pid = f'{pid}-{code.lower()}'
    used_ids.add(pid)

    # Fotos: la marcada como "Producto" primero, el empaque al final; sin repetidas si hay otras.
    lst = sorted(photos.get(code, []), key=lambda p: ORDER.get(p[1], 1))
    if len([p for p in lst if not p[2]]) > 0: lst = [p for p in lst if not p[2]]
    if code in MAIN: lst.insert(0, lst.pop(MAIN[code] - 1))
    imgs = []
    for i, (fname, _, _, folder) in enumerate(lst, 1):
        src = os.path.join(EDIC, folder, fname)
        dst = f'{pid}-{i}.jpg'
        normalize(src, os.path.join(OUT_IMG, dst))
        imgs.append(f'/assets/productos/{dst}')

    # Ficha técnica
    sheet = None
    if r['Ficha técnica'] == 'Sí' and r['Archivo de ficha técnica / nota']:
        m = re.match(r'\s*(.+?\.pdf)', r['Archivo de ficha técnica / nota'], re.I)
        if m:
            src = os.path.join(FICHAS, m.group(1).strip())
            if os.path.exists(src):
                dst = f'marwa-ficha-{re.sub(r"-marwa$", "", slug(m.group(1)[:-4]))}.pdf'
                shutil.copyfile(src, os.path.join(OUT_PDF, dst))
                sheet = {'name': m.group(1).strip(), 'url': f'/fichas/{dst}', 'size': os.path.getsize(src)}
            else:
                report.append(f'{code}: no se encontró la ficha {m.group(1)}')

    # Especificaciones para filtros y la tabla del producto
    spec = {'tipo': 'Herramientas' if tool else sub}
    color, medida, pres = r['Color'], r['Medida'], r['Presentación']
    if cat == 'cableado':
        m = re.search(r'Cat\.?\s*(5E|6A|6)', name, re.I)
        if m: spec['categoria'] = f'Cat. {m.group(1).upper()}'
        if ok(pres) and not str(pres).startswith('Incluido'): spec['presentacion'] = str(pres)
    if cat == 'fibra':
        if sub.startswith('Monomodo'): spec['modo'] = 'Monomodo'
        m = re.findall(r'\b(SC|LC)/(APC|UPC)', name)
        if m: spec['conector'] = ' – '.join(dict.fromkeys(f'{a}/{b}' for a, b in m))
    if cat == 'plastica':
        if ok(medida): spec['medida'] = str(medida)
        if ok(color): spec['color'] = str(color)
    if cat == 'canalizacion' and not tool:
        if ok(medida): spec['medida'] = str(medida)
        spec['material'] = 'PVC' if 'SCH' in sub else 'Acero galvanizado'
    for label, v in [('Marca', r['Marca']), ('Color', color), ('Medida', medida), ('Contenido', r['Contenido'])]:
        if ok(v) and str(v) not in spec.values(): spec[label] = str(v)

    # Sin notas internas del inventario, como "(según sticker)"
    clean = lambda t: re.sub(r'\s*\((según|posible|ver)[^)]*\)', '', t, flags=re.I).strip()
    feats = [cap(clean(f)) for f in re.split(r';\s*', r['Especificaciones'] or '') if ok(f) and clean(f)]
    for v in (medida, color):
        if ok(v) and len(feats) < 4 and not any(str(v).lower() in f.lower() for f in feats): feats.append(cap(str(v)))
    low = lambda f: f if f[:2].isupper() or f[:1].isdigit() else f[:1].lower() + f[1:]
    desc = f'{name} de MARWA para la línea de {r["Categoría"].lower()}.'
    if feats: desc += ' ' + cap(', '.join(low(f) for f in feats[:4])) + '.'

    unit = 'unidad'
    if ok(pres) and not str(pres).startswith('Incluido') and pres not in ('Sin empaque',): unit = str(pres).lower()

    p = {'id': pid, 'sku': code, 'name': name, 'category': cat, 'description': desc,
         'image': imgs[0] if imgs else '/assets/marwa-hex-logo.svg', 'features': feats[:6] or [name],
         'price': 0, 'unit': unit, 'stock': 0, 'visible': not tool and code not in HIDDEN, 'specs': spec}
    if len(imgs) > 1: p['gallery'] = imgs[1:]
    if sheet: p['datasheet'] = sheet
    products.append(p)
    if not imgs: report.append(f'{code}: sin fotos editadas')
    if tool: report.append(f'{code}: herramienta, queda oculta (no hay línea para herramientas)')
    if code in HIDDEN: report.append(f'{code}: oculto. {HIDDEN[code]}')

body = json.dumps(products, ensure_ascii=False, indent=2)
ts = f"""import type {{Product}} from './shopSeed';

/**
 * Inventario real de MARWA, generado desde "MARWA INVENTARIO.xlsx" (11-nov-2026).
 * PRECIO Y EXISTENCIAS EN 0: están pendientes; el equipo MARWA los ajusta desde el panel del vendedor.
 * Mientras el precio sea 0, la tienda muestra "Precio por confirmar" y ofrece cotizar con un asesor.
 * No editar a mano: se vuelve a generar con el script del inventario.
 */
export const inventoryProducts: Product[] = {body};
"""
open(os.path.join(ROOT, 'data/inventario.ts'), 'w').write(ts)
print(len(products), 'productos ·', sum(1 for p in products if p['visible']), 'visibles ·',
      sum(1 + len(p.get('gallery', [])) for p in products), 'fotos ·', sum(1 for p in products if 'datasheet' in p), 'fichas')
print('\n'.join(report))
