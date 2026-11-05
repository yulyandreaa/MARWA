'use client';

import {read, usePersisted, write} from './persist';
import {seedProducts, type Product} from '@/data/shopSeed';
import {demoSeller} from '@/data/demoAccounts';

const K = {
  products: 'marwa.products.v1',
  cart: 'marwa.cart.v1',
  users: 'marwa.users.v1',
  session: 'marwa.session.v1',
  orders: 'marwa.orders.v1',
  favorites: 'marwa.favorites.v1',
  addresses: 'marwa.addresses.v1',
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

export const useProducts = () => usePersisted<Product[]>(K.products, seedProducts);
export const readProducts = () => read<Product[]>(K.products, seedProducts);

export function saveProduct(p: Product) {
  const list = readProducts();
  const exists = list.some(x => x.id === p.id);
  return write(K.products, exists ? list.map(x => (x.id === p.id ? p : x)) : [p, ...list]);
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
  history: {status: OrderStatus; at: string; note?: string}[];
  createdAt: string;
};

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
  const last = orders.reduce((m, o) => Math.max(m, Number(o.id.split('-')[1]) || 1000), 1000);
  const now = new Date().toISOString();
  const order: Order = {
    id: `MAR-${last + 1}`,
    email: input.email,
    customer: input.customer,
    notes: input.notes,
    items: lines.map(l => ({id: l.id, sku: l.product.sku, name: l.product.name, image: l.product.image, price: l.product.price, qty: l.qty, unit: l.product.unit})),
    total: subtotal,
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
  clearCart();
  return order;
}

export function setOrderStatus(id: string, status: OrderStatus, extra: {tracking?: string; note?: string} = {}) {
  const orders = readOrders();
  const order = orders.find(o => o.id === id);
  if (!order || order.status === status) return;
  // Returning stock when an order is cancelled
  if (status === 'cancelado' && order.status !== 'cancelado') {
    write(K.products, readProducts().map(p => {
      const it = order.items.find(i => i.id === p.id);
      return it ? {...p, stock: p.stock + it.qty} : p;
    }));
  }
  write(K.orders, orders.map(o => o.id === id
    ? {...o, status, tracking: extra.tracking ?? o.tracking, history: [...o.history, {status, at: new Date().toISOString(), note: extra.note}]}
    : o));
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
