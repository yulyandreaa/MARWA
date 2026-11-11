'use client';

import {read, usePersisted, write} from './persist';
import {seedProducts, type Product} from '@/data/shopSeed';
import {demoSeller} from '@/data/demoAccounts';
import {readSettings, shippingCost} from './settings';

const K = {
  products: 'marwa.products.v1',
  cart: 'marwa.cart.v1',
  users: 'marwa.users.v1',
  session: 'marwa.session.v1',
  orders: 'marwa.orders.v1',
  favorites: 'marwa.favorites.v1',
  addresses: 'marwa.addresses.v1',
  stockLog: 'marwa.stock-log.v1',
};

/* ------------------------------------------------------------------ */
/* Products                                                            */
/* ------------------------------------------------------------------ */
/* Una sola vez por navegador: agrega al catálogo guardado los productos de
   referencia nuevos y las especificaciones, sin tocar lo que el vendedor editó. */
const CATALOG_FLAG = 'marwa.catalog-refs.v1';
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(K.products);
    if (raw && !localStorage.getItem(CATALOG_FLAG)) {
      const list = JSON.parse(raw) as Product[];
      const ids = new Set(list.map(p => p.id));
      const merged = list.map(p => {
        const seed = seedProducts.find(s => s.id === p.id);
        return seed && !p.specs ? {...p, specs: seed.specs} : p;
      });
      localStorage.setItem(K.products, JSON.stringify([...merged, ...seedProducts.filter(p => !ids.has(p.id))]));
    }
    localStorage.setItem(CATALOG_FLAG, '1');
  } catch {}
}

/* Una sola vez por navegador: pasa el catálogo guardado a las seis líneas oficiales.
   Conserva precio, stock y foto; retira lo que ya no pertenece a ninguna línea. */
const LINES_FLAG = 'marwa.catalog-lines.v2';
const RETIRED = new Set(['ref-switch-8', 'ref-switch-24poe', 'ref-router', 'ref-ap', 'ref-sfp', 'ref-bandeja', 'ref-multitoma']);
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(K.products);
    if (raw && !localStorage.getItem(LINES_FLAG)) {
      const list = (JSON.parse(raw) as Product[]).filter(p => !RETIRED.has(p.id));
      const ids = new Set(list.map(p => p.id));
      const known = new Set(seedProducts.map(p => p.category as string));
      const migrated = list.map(p => {
        const seed = seedProducts.find(s => s.id === p.id);
        if (seed) return {...p, name: seed.name, description: seed.description, features: seed.features, category: seed.category, specs: seed.specs};
        if (known.has(p.category)) return p;
        // Productos creados por el vendedor en líneas retiradas: quedan ocultos para reasignarlos.
        return (p.category as string) === 'infraestructura' ? {...p, category: 'metalmecanica' as const} : {...p, category: 'cableado' as const, visible: false};
      });
      localStorage.setItem(K.products, JSON.stringify([...migrated, ...seedProducts.filter(p => !ids.has(p.id))]));
    }
    localStorage.setItem(LINES_FLAG, '1');
  } catch {}
}

/* Una sola vez por navegador: trae las vistas, fichas técnicas y productos nuevos del
   catálogo inicial a los productos guardados, sin pisar lo que el vendedor ya subió. */
const MEDIA_FLAG = 'marwa.catalog-media.v2';
const TEST_SHEET = '/fichas/marwa-ficha-gabinete-12ru.pdf';
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(K.products);
    if (raw && !localStorage.getItem(MEDIA_FLAG)) {
      const saved = JSON.parse(raw) as Product[];
      const ids = new Set(saved.map(p => p.id));
      const list = saved.map(p => {
        const seed = seedProducts.find(s => s.id === p.id);
        const next = {...p};
        // La ficha del 12RU se probó en otro producto: ahora vive en su propio producto.
        if (p.id !== 'gabinete-12ru' && p.datasheet?.url === TEST_SHEET) delete next.datasheet;
        if (!seed) return next;
        if (seed.gallery?.length && !p.gallery?.length) { next.image = seed.image; next.gallery = seed.gallery; }
        if (seed.datasheet && !next.datasheet) next.datasheet = seed.datasheet;
        return next;
      });
      localStorage.setItem(K.products, JSON.stringify([...list, ...seedProducts.filter(p => !ids.has(p.id))]));
    }
    localStorage.setItem(MEDIA_FLAG, '1');
  } catch {}
}

/* Una sola vez por navegador: si el catálogo inicial ganó vistas nuevas y el vendedor
   no cambió las fotos de ese producto, se actualiza su galería. */
const VIEWS_FLAG = 'marwa.catalog-views.v1';
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(K.products);
    if (raw && !localStorage.getItem(VIEWS_FLAG)) {
      const list = (JSON.parse(raw) as Product[]).map(p => {
        const seed = seedProducts.find(s => s.id === p.id);
        const fromSeed = (src: string) => src.startsWith('/assets/productos/');
        if (!seed?.gallery || p.image !== seed.image || !(p.gallery ?? []).every(fromSeed)) return p;
        return {...p, gallery: seed.gallery};
      });
      localStorage.setItem(K.products, JSON.stringify(list));
    }
    localStorage.setItem(VIEWS_FLAG, '1');
  } catch {}
}

/* Una sola vez por navegador: agrega los productos del inventario (Excel) que ya tienen fotos. */
const EXCEL_FLAG = 'marwa.catalog-excel.v1';
const EXCEL_IDS = ['jack-keystone-cat6-azul', 'patch-cord-fibra-sc-apc-3m', 'espiral-cables-3-4-negro', 'tuberia-pvc-sch40-1'];
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(K.products);
    if (raw && !localStorage.getItem(EXCEL_FLAG)) {
      const list = JSON.parse(raw) as Product[];
      const ids = new Set(list.map(p => p.id));
      const added = seedProducts.filter(p => EXCEL_IDS.includes(p.id) && !ids.has(p.id));
      localStorage.setItem(K.products, JSON.stringify([...added, ...list]));
    }
    localStorage.setItem(EXCEL_FLAG, '1');
  } catch {}
}

/* Una sola vez: actualiza los textos de esos productos (ajustados el 9-nov-2026). */
const EXCEL_TEXT_FLAG = 'marwa.catalog-excel-text.v1';
if (typeof window !== 'undefined') {
  try {
    const raw = localStorage.getItem(K.products);
    if (raw && !localStorage.getItem(EXCEL_TEXT_FLAG)) {
      const list = (JSON.parse(raw) as Product[]).map(p => {
        const seed = EXCEL_IDS.includes(p.id) && seedProducts.find(s => s.id === p.id);
        return seed ? {...p, features: seed.features, description: seed.description, specs: seed.specs} : p;
      });
      localStorage.setItem(K.products, JSON.stringify(list));
    }
    localStorage.setItem(EXCEL_TEXT_FLAG, '1');
  } catch {}
}

export const useProducts = () => usePersisted<Product[]>(K.products, seedProducts);
export const readProducts = () => read<Product[]>(K.products, seedProducts);

export function saveProduct(p: Product) {
  const list = readProducts();
  const before = list.find(x => x.id === p.id);
  const ok = write(K.products, before ? list.map(x => (x.id === p.id ? p : x)) : [p, ...list]);
  const delta = p.stock - (before?.stock ?? 0);
  if (ok && delta) logStock([{productId: p.id, delta, reason: before ? 'Ajuste manual' : 'Inventario inicial'}]);
  return ok;
}

/** Aplica un cambio a varios productos a la vez. */
export const bulkUpdateProducts = (ids: string[], change: (p: Product) => Product) =>
  write(K.products, readProducts().map(p => (ids.includes(p.id) ? change(p) : p)));

export const isOnOffer = (p: Product) => !!p.listPrice && p.listPrice > p.price;

/* Historial de inventario: cada venta, cancelación, devolución y ajuste manual. */
export type StockMove = {id: string; at: string; productId: string; delta: number; reason: string; ref?: string};
const NO_MOVES: StockMove[] = [];
const MAX_MOVES = 500;
export const useStockLog = () => usePersisted<StockMove[]>(K.stockLog, NO_MOVES);

function logStock(moves: Omit<StockMove, 'id' | 'at'>[]) {
  const at = new Date().toISOString();
  const added = moves.map((m, i) => ({...m, at, id: `${Date.now().toString(36)}-${i}`}));
  write(K.stockLog, [...added, ...read<StockMove[]>(K.stockLog, NO_MOVES)].slice(0, MAX_MOVES));
}

function restock(orderId: string, items: {id: string; qty: number}[], reason: string) {
  write(K.products, readProducts().map(p => {
    const it = items.find(i => i.id === p.id);
    return it ? {...p, stock: p.stock + it.qty} : p;
  }));
  logStock(items.map(i => ({productId: i.id, delta: i.qty, reason, ref: orderId})));
}
export function deleteProduct(id: string) {
  write(K.products, readProducts().filter(p => p.id !== id));
}
export function resetProducts() {
  write(K.products, seedProducts);
}

/* ------------------------------------------------------------------ */
/* Cart                                                                */
/* ------------------------------------------------------------------ */
export type CartLine = {id: string; qty: number};
const EMPTY_CART: CartLine[] = [];
export const useCart = () => usePersisted<CartLine[]>(K.cart, EMPTY_CART);
const readCart = () => read<CartLine[]>(K.cart, EMPTY_CART);

function stockOf(id: string) {
  return readProducts().find(p => p.id === id)?.stock ?? 0;
}
/** Returns the quantity actually in the cart after adding. */
export function addToCart(id: string, qty = 1) {
  const cart = readCart();
  const current = cart.find(l => l.id === id)?.qty ?? 0;
  const next = Math.min(stockOf(id), current + qty);
  if (next <= 0) return 0;
  write(K.cart, current ? cart.map(l => (l.id === id ? {...l, qty: next} : l)) : [...cart, {id, qty: next}]);
  return next;
}
export function setCartQty(id: string, qty: number) {
  const q = Math.max(0, Math.min(stockOf(id), Math.floor(qty) || 0));
  write(K.cart, q ? readCart().map(l => (l.id === id ? {...l, qty: q} : l)) : readCart().filter(l => l.id !== id));
}
export const clearCart = () => write(K.cart, EMPTY_CART);

export type DetailedLine = CartLine & {product: Product};
export function detailCart(cart: CartLine[], products: Product[]) {
  const lines: DetailedLine[] = cart
    .map(l => ({...l, product: products.find(p => p.id === l.id)!}))
    .filter(l => l.product && l.product.visible);
  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0);
  const units = lines.reduce((s, l) => s + l.qty, 0);
  return {lines, subtotal, units};
}

/* ------------------------------------------------------------------ */
/* Users & session                                                     */
/* ------------------------------------------------------------------ */
export type Role = 'comprador' | 'vendedor';
export type Profile = {
  name: string;
  company: string;
  docId: string;
  phone: string;
  department: string;
  city: string;
  address: string;
};
export type User = Profile & {email: string; role: Role; passwordHash: string; createdAt: string; billingAddress?: string};

const NO_USERS: User[] = [];
const NO_SESSION: {email: string} | null = null;
export const useUsers = () => usePersisted<User[]>(K.users, NO_USERS);
const readUsers = () => read<User[]>(K.users, NO_USERS);

const sellerUser: User = {
  email: demoSeller.email, role: 'vendedor', passwordHash: '', createdAt: '2026-01-01T00:00:00.000Z',
  name: demoSeller.name, company: 'MARWA Redes y Energía', docId: '', phone: '3102569469',
  department: 'Bogotá D.C.', city: 'Bogotá', address: 'Av. 70 #49-39',
};

async function hash(text: string) {
  const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(`marwa:${text}`));
  return Array.from(new Uint8Array(buf)).map(b => b.toString(16).padStart(2, '0')).join('');
}
const norm = (email: string) => email.trim().toLowerCase();

export function useSessionUser(): User | null {
  const session = usePersisted(K.session, NO_SESSION);
  const users = useUsers();
  if (!session) return null;
  if (session.email === sellerUser.email) return sellerUser;
  return users.find(u => u.email === session.email) ?? null;
}

export const isEmailTaken = (email: string) => norm(email) === sellerUser.email || readUsers().some(u => u.email === norm(email));

/* INTEGRACIÓN PENDIENTE: este registro es una demo en localStorage. Al conectar el
   backend, crear la cuenta en el servidor y asignar allí el rol; nunca desde el cliente. */
export async function register(data: Profile & {email: string; password: string}) {
  const email = norm(data.email);
  if (isEmailTaken(email)) {
    throw new Error('Ya existe una cuenta con ese correo.');
  }
  const {password, ...profile} = data;
  const user: User = {...profile, email, role: 'comprador', passwordHash: await hash(password), createdAt: new Date().toISOString()};
  write(K.users, [...readUsers(), user]);
  write(K.session, {email});
  return user;
}

export async function login(emailRaw: string, password: string): Promise<User> {
  const email = norm(emailRaw);
  if (email === sellerUser.email) {
    if (password !== demoSeller.password) throw new Error('Correo o contraseña incorrectos.');
    write(K.session, {email});
    return sellerUser;
  }
  const user = readUsers().find(u => u.email === email);
  if (!user || user.passwordHash !== (await hash(password))) throw new Error('Correo o contraseña incorrectos.');
  write(K.session, {email});
  return user;
}

export const logout = () => write(K.session, null);

export function updateAccount(email: string, data: Partial<Pick<User, 'name' | 'phone' | 'company' | 'docId' | 'billingAddress'>>) {
  return write(K.users, readUsers().map(u => (u.email === email ? {...u, ...data} : u)));
}

export function updateProfile(email: string, profile: Profile) {
  write(K.users, readUsers().map(u => (u.email === email ? {...u, ...profile} : u)));
}

/** Borra la cuenta, sus favoritos y direcciones. Los pedidos se conservan como registro de venta. */
export async function deleteAccount(email: string, password: string) {
  const user = readUsers().find(u => u.email === email);
  if (user?.passwordHash && user.passwordHash !== (await hash(password))) throw new Error('La contraseña no es correcta.');
  const {[email]: _favorites, ...favorites} = read<Record<string, string[]>>(K.favorites, {});
  write(K.favorites, favorites);
  write(K.addresses, read<{email: string}[]>(K.addresses, []).filter(a => a.email !== email));
  write(K.users, readUsers().filter(u => u.email !== email));
  write(K.session, null);
}

export async function changePassword(email: string, current: string, next: string) {
  const user = readUsers().find(u => u.email === email);
  if (!user || user.passwordHash !== (await hash(current))) throw new Error('La contraseña actual no es correcta.');
  const passwordHash = await hash(next);
  write(K.users, readUsers().map(u => (u.email === email ? {...u, passwordHash} : u)));
}

/* ------------------------------------------------------------------ */
/* Orders                                                              */
/* ------------------------------------------------------------------ */
/* 'pendiente' queda listo para la pasarela real: hoy todo pedido nace con pago aprobado. */
export type OrderStatus = 'pendiente' | 'pagado' | 'preparando' | 'enviado' | 'entregado' | 'cancelado';
export const statusFlow: OrderStatus[] = ['pagado', 'preparando', 'enviado', 'entregado'];
export const statusLabel: Record<OrderStatus, string> = {
  pendiente: 'Pendiente',
  pagado: 'Confirmado',
  preparando: 'En preparación',
  enviado: 'Despachado',
  entregado: 'Entregado',
  cancelado: 'Cancelado',
};
export type PaymentMethod = 'tarjeta' | 'pse' | 'nequi';
export const paymentLabel: Record<PaymentMethod, string> = {tarjeta: 'Tarjeta crédito/débito', pse: 'PSE', nequi: 'Nequi'};

export type OrderItem = {id: string; sku: string; name: string; image: string; price: number; qty: number; unit: string};
export type Order = {
  id: string;
  email: string;
  customer: Profile;
  notes: string;
  items: OrderItem[];
  total: number;
  payment: {method: PaymentMethod; reference: string};
  status: OrderStatus;
  tracking?: string;
  carrier?: string;
  /** Solo la ve el equipo MARWA. */
  sellerNote?: string;
  returnRequest?: ReturnRequest;
  /** Envío cobrado; sin valor, se coordinó al despachar. */
  shipping?: number;
  /** Cambios de estado hacia atrás que hizo el vendedor. */
  corrections?: {status: OrderStatus; at: string}[];
  history: {status: OrderStatus; at: string; note?: string}[];
  createdAt: string;
};

export type ReturnRequest = {
  reason: string;
  detail: string;
  items: {id: string; name: string; qty: number}[];
  photos: string[];
  at: string;
  status: 'solicitada' | 'aprobada' | 'rechazada';
  answer?: string;
  answeredAt?: string;
};
export const cancelReasons = ['Ya no lo necesito', 'Me equivoqué de producto', 'Encontré otra opción', 'Tarda demasiado', 'Otro motivo'];
export const returnReasons = ['Llegó defectuoso', 'No es lo que pedí', 'Llegó incompleto', 'Ya no lo necesito', 'Otro motivo'];
export const returnLabel: Record<ReturnRequest['status'], string> = {solicitada: 'Devolución solicitada', aprobada: 'Devolución aprobada', rechazada: 'Devolución rechazada'};

export const carriers: {name: string; url?: string}[] = [
  {name: 'Servientrega', url: 'https://www.servientrega.com'},
  {name: 'Coordinadora', url: 'https://www.coordinadora.com'},
  {name: 'Interrapidísimo', url: 'https://interrapidisimo.com'},
  {name: 'TCC', url: 'https://www.tcc.com.co'},
  {name: 'Deprisa', url: 'https://www.deprisa.com'},
  {name: 'Otra transportadora'},
];

const NO_ORDERS: Order[] = [];
export const useOrders = () => usePersisted<Order[]>(K.orders, NO_ORDERS);
const readOrders = () => read<Order[]>(K.orders, NO_ORDERS);

export const isOrderActive = (o: Order) => o.status !== 'entregado' && o.status !== 'cancelado';

/** Puts an old order back in the cart. `short` lists what no longer has enough stock. */
export function reorder(order: Order) {
  const products = readProducts();
  const short: string[] = [];
  let added = 0;
  for (const item of order.items) {
    const product = products.find(p => p.id === item.id);
    if (!product?.visible) { short.push(item.name); continue; }
    const before = readCart().find(l => l.id === item.id)?.qty ?? 0;
    const after = addToCart(item.id, item.qty);
    if (after > before) added += 1;
    if (after - before < item.qty) short.push(item.name);
  }
  return {added, short};
}

/** Simulated approved payment: creates the order, decrements stock, empties cart. */
export function placeOrder(input: {email: string; customer: Profile; notes: string; method: PaymentMethod}) {
  const products = readProducts();
  const {lines, subtotal} = detailCart(readCart(), products);
  if (!lines.length) throw new Error('Tu carrito está vacío.');
  const short = lines.find(l => l.qty > l.product.stock);
  if (short) throw new Error(`Solo quedan ${short.product.stock} unidades de ${short.product.name}.`);

  const orders = readOrders();
  const shipping = shippingCost(subtotal, readSettings());
  const last = orders.reduce((m, o) => Math.max(m, Number(o.id.split('-')[1]) || 1000), 1000);
  const now = new Date().toISOString();
  const order: Order = {
    id: `MAR-${last + 1}`,
    email: input.email,
    customer: input.customer,
    notes: input.notes,
    items: lines.map(l => ({id: l.id, sku: l.product.sku, name: l.product.name, image: l.product.image, price: l.product.price, qty: l.qty, unit: l.product.unit})),
    total: subtotal + (shipping ?? 0),
    shipping: shipping ?? undefined,
    payment: {method: input.method, reference: `SIM-${Date.now().toString(36).toUpperCase()}`},
    status: 'pagado',
    history: [{status: 'pagado', at: now}],
    createdAt: now,
  };
  write(K.orders, [order, ...orders]);
  write(K.products, products.map(p => {
    const l = lines.find(x => x.id === p.id);
    return l ? {...p, stock: p.stock - l.qty} : p;
  }));
  logStock(lines.map(l => ({productId: l.id, delta: -l.qty, reason: 'Venta', ref: order.id})));
  clearCart();
  return order;
}

/* ------------------------------------------------------------------ */
/* Acceso directo de la demo                                           */
/* ------------------------------------------------------------------ */
/* INTEGRACIÓN PENDIENTE: retirar esto al conectar la autenticación real. */
const demoBuyer: User = {
  email: 'comprador@marwa.test', role: 'comprador', passwordHash: '', createdAt: '2026-01-01T00:00:00.000Z',
  name: 'Cliente de ejemplo', company: 'Empresa de ejemplo S.A.S.', docId: '900000000', phone: '3000000000',
  department: 'Bogotá D.C.', city: 'Bogotá', address: 'Calle de ejemplo #1-23',
};

function seedDemoOrders() {
  const orders = readOrders();
  if (orders.some(o => o.email === demoBuyer.email)) return;
  const products = readProducts();
  const {email, role: _role, passwordHash: _hash, createdAt: _created, ...customer} = demoBuyer;
  const samples: {ids: string[]; status: OrderStatus; daysAgo: number}[] = [
    {ids: ['patch-panel', 'patch-cord'], status: 'preparando', daysAgo: 1},
    {ids: ['fibra-drop'], status: 'enviado', daysAgo: 4},
    {ids: ['cable-cat5e', 'rack-piso'], status: 'entregado', daysAgo: 12},
  ];
  const last = orders.reduce((m, o) => Math.max(m, Number(o.id.split('-')[1]) || 1000), 1000);
  const demo = samples.flatMap(({ids, status, daysAgo}, i): Order[] => {
    const items = products.filter(p => ids.includes(p.id)).map(p => ({id: p.id, sku: p.sku, name: p.name, image: p.image, price: p.price, qty: 2, unit: p.unit}));
    if (!items.length) return [];
    const at = (days: number) => new Date(Date.now() - days * 86400000).toISOString();
    const steps = statusFlow.slice(0, statusFlow.indexOf(status) + 1);
    return [{
      id: `MAR-${last + samples.length - i}`,
      email,
      customer,
      notes: 'Pedido de ejemplo',
      items,
      total: items.reduce((sum, item) => sum + item.price * item.qty, 0),
      payment: {method: 'pse', reference: `SIM-DEMO${i + 1}`},
      status,
      tracking: steps.includes('enviado') ? `GUIA-DEMO-${i + 1}` : undefined,
      history: steps.map((s, step) => ({status: s, at: at(Math.max(daysAgo - step, 0))})),
      createdAt: at(daysAgo),
    }];
  });
  write(K.orders, [...demo, ...orders]);
}

/** Entra sin contraseña a la cuenta de ejemplo, con pedidos para que el panel no se vea vacío. */
export function demoLogin(role: Role): User {
  if (!readUsers().some(u => u.email === demoBuyer.email)) write(K.users, [...readUsers(), demoBuyer]);
  seedDemoOrders();
  const user = role === 'vendedor' ? sellerUser : demoBuyer;
  write(K.session, {email: user.email});
  return user;
}

export const CANCELLED_BY_MARWA = 'Cancelado por MARWA';
export const canCancelOrder = (o: Order) => o.status === 'pagado' || o.status === 'preparando';
export const canRequestReturn = (o: Order) => o.status === 'entregado' && !o.returnRequest;

const patchOrder = (id: string, patch: (o: Order) => Order) =>
  write(K.orders, readOrders().map(o => (o.id === id ? patch(o) : o)));

/** El vendedor puede mover el pedido a cualquier estado, también hacia atrás si se equivocó. */
export function setOrderStatus(id: string, status: OrderStatus, extra: {tracking?: string; carrier?: string; note?: string} = {}) {
  const order = readOrders().find(o => o.id === id);
  if (!order || order.status === status) return;
  const at = new Date().toISOString();

  if (order.status === 'cancelado') takeStock(order);
  if (status === 'cancelado') restock(order.id, order.items, 'Pedido cancelado');

  const step = statusFlow.indexOf(status);
  const kept = order.history.filter(h => h.status !== 'cancelado' && statusFlow.indexOf(h.status) <= step);
  const missing = statusFlow.slice(0, step + 1).filter(s => !kept.some(h => h.status === s));
  const history = status === 'cancelado'
    ? [...order.history, {status, at, note: extra.note}]
    : [...kept, ...missing.map(s => ({status: s, at, note: s === status ? extra.note : undefined}))];

  const wentBack = status !== 'cancelado' && (order.status === 'cancelado' || step < statusFlow.indexOf(order.status));
  patchOrder(id, o => ({
    ...o,
    status,
    history,
    tracking: extra.tracking ?? o.tracking,
    carrier: extra.carrier ?? o.carrier,
    corrections: wentBack ? [...(o.corrections ?? []), {status, at}] : o.corrections,
  }));
}

/** Reactivar un pedido cancelado vuelve a apartar sus unidades. */
function takeStock(order: Order) {
  const products = readProducts();
  // Un producto retirado del catálogo no tiene stock que apartar.
  const short = order.items.find(i => {
    const product = products.find(p => p.id === i.id);
    return product && product.stock < i.qty;
  });
  if (short) throw new Error(`No hay stock suficiente de ${short.name} para reactivar el pedido.`);
  write(K.products, products.map(p => {
    const it = order.items.find(i => i.id === p.id);
    return it ? {...p, stock: p.stock - it.qty} : p;
  }));
  logStock(order.items.map(i => ({productId: i.id, delta: -i.qty, reason: 'Pedido reactivado', ref: order.id})));
}

export const isDispatched = (o: Order) => o.status === 'enviado' || o.status === 'entregado';

export const cancelOrderByBuyer = (id: string, reason: string) => setOrderStatus(id, 'cancelado', {note: `Cancelado por el comprador: ${reason}`});

export const setSellerNote = (id: string, sellerNote: string) => patchOrder(id, o => ({...o, sellerNote}));

export function requestReturn(id: string, data: Pick<ReturnRequest, 'reason' | 'detail' | 'items' | 'photos'>) {
  return patchOrder(id, o => ({...o, returnRequest: {...data, status: 'solicitada', at: new Date().toISOString()}}));
}

/** Al aprobar, las unidades vuelven al inventario. El reembolso real se hace en la pasarela. */
export function answerReturn(id: string, approved: boolean, answer: string) {
  const order = readOrders().find(o => o.id === id);
  if (!order?.returnRequest) return;
  const r = order.returnRequest;
  // Las solicitudes viejas no traían productos: devolvían el pedido completo.
  if (approved) restock(order.id, r.items ?? order.items, 'Devolución aprobada');
  patchOrder(id, o => ({
    ...o,
    returnRequest: {...o.returnRequest!, status: approved ? 'aprobada' : 'rechazada', answer, answeredAt: new Date().toISOString()},
  }));
}

/* ------------------------------------------------------------------ */
/* Favorites & addresses                                               */
/* INTEGRACIÓN PENDIENTE: hoy viven en el navegador. Al conectar la base */
/* de datos, cada fila debe ligarse al id del cliente autenticado.       */
/* ------------------------------------------------------------------ */
type FavoriteMap = Record<string, string[]>;
const NO_FAVORITES: FavoriteMap = {};
const NO_IDS: string[] = [];
export const useFavorites = (email?: string) => usePersisted<FavoriteMap>(K.favorites, NO_FAVORITES)[email ?? ''] ?? NO_IDS;

/** Returns true when the product ends up saved. */
export function toggleFavorite(email: string, id: string) {
  const map = read<FavoriteMap>(K.favorites, NO_FAVORITES);
  const mine = map[email] ?? [];
  const saved = !mine.includes(id);
  write(K.favorites, {...map, [email]: saved ? [id, ...mine] : mine.filter(x => x !== id)});
  return saved;
}

export type Address = {
  id: string;
  email: string;
  label: string;
  department: string;
  city: string;
  address: string;
  notes: string;
  recipient: string;
  phone: string;
  isDefault: boolean;
};
const NO_ADDRESSES: Address[] = [];
const readAddresses = () => read<Address[]>(K.addresses, NO_ADDRESSES);
export const useAddresses = (email?: string) => usePersisted<Address[]>(K.addresses, NO_ADDRESSES).filter(a => a.email === email);

/* La dirección principal alimenta el checkout. */
function syncDefaultAddress(email: string) {
  const main = readAddresses().find(a => a.email === email && a.isDefault);
  return write(K.users, readUsers().map(u => (u.email === email
    ? {...u, department: main?.department ?? '', city: main?.city ?? '', address: main?.address ?? ''}
    : u)));
}

export function saveAddress(input: Omit<Address, 'id' | 'isDefault'> & {id?: string}) {
  const list = readAddresses();
  const current = list.find(a => a.id === input.id && a.email === input.email);
  const ok = current
    ? write(K.addresses, list.map(a => (a.id === current.id ? {...current, ...input, id: current.id} : a)))
    : write(K.addresses, [...list, {
        ...input,
        id: `dir-${Date.now().toString(36)}`,
        isDefault: !list.some(a => a.email === input.email),
      }]);
  return syncDefaultAddress(input.email) && ok;
}

export function deleteAddress(email: string, id: string) {
  const gone = readAddresses().find(a => a.id === id && a.email === email);
  if (!gone) return false;
  let list = readAddresses().filter(a => a.id !== id);
  const heir = gone.isDefault ? list.find(a => a.email === email) : undefined;
  if (heir) list = list.map(a => (a.id === heir.id ? {...a, isDefault: true} : a));
  return write(K.addresses, list) && syncDefaultAddress(email);
}

export function setDefaultAddress(email: string, id: string) {
  write(K.addresses, readAddresses().map(a => (a.email === email ? {...a, isDefault: a.id === id} : a)));
  return syncDefaultAddress(email);
}

/** Pasa la dirección que el cliente ya tenía en su perfil a la libreta. */
export function ensureAddressBook(user: User) {
  if (!user.address || readAddresses().some(a => a.email === user.email)) return;
  saveAddress({
    email: user.email, label: 'Principal', department: user.department, city: user.city,
    address: user.address, notes: '', recipient: user.name, phone: user.phone,
  });
}

/** Guarda en la libreta la dirección usada en una compra, si es nueva. */
export function rememberAddress(email: string, p: Profile) {
  const known = readAddresses().some(a => a.email === email && a.address === p.address && a.city === p.city);
  if (known) return;
  saveAddress({
    email, label: 'Dirección de compra', department: p.department, city: p.city,
    address: p.address, notes: '', recipient: p.name, phone: p.phone,
  });
}

/** Pedidos que usaron esta dirección; conservan su propia copia de los datos. */
export function addressUsage(a: Address) {
  const used = readOrders().filter(o => o.email === a.email && o.customer.address === a.address && o.customer.city === a.city);
  return {total: used.length, active: used.filter(isOrderActive).length};
}
