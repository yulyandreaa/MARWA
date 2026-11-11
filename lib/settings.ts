'use client';

import {read, usePersisted, write} from './persist';

const KEY = 'marwa.settings.v1';

export type StoreSettings = {
  company: string;
  nit: string;
  address: string;
  email: string;
  /** Con indicativo, sin +: 573102569469 */
  whatsapp: string;
  shippingMode: 'coordinar' | 'fijo';
  shippingFee: number;
  /** Desde este subtotal el envío no se cobra; 0 = siempre se cobra. */
  freeFrom: number;
  /** Subcategorías agregadas por el vendedor, por línea. */
  extraSubs: Record<string, string[]>;
};

export const defaultSettings: StoreSettings = {
  company: 'MARWA Redes y Energía',
  nit: '',
  address: 'Av. 70 #49-39, Bogotá',
  email: '',
  whatsapp: '573102569469',
  shippingMode: 'coordinar',
  shippingFee: 0,
  freeFrom: 0,
  extraSubs: {},
};

export const useSettings = () => usePersisted<StoreSettings>(KEY, defaultSettings);
export const readSettings = () => read<StoreSettings>(KEY, defaultSettings);
export const saveSettings = (s: StoreSettings) => write(KEY, s);

/** `null` significa que el envío se coordina al despachar. */
export function shippingCost(subtotal: number, s: StoreSettings): number | null {
  if (s.shippingMode === 'coordinar') return null;
  return s.freeFrom > 0 && subtotal >= s.freeFrom ? 0 : s.shippingFee;
}

export const shippingText = (cost: number | null, money: (n: number) => string) =>
  cost === null ? 'Se coordina al despachar' : cost === 0 ? 'Gratis' : money(cost);

/** Subcategorías de una línea: las oficiales más las que agregó el vendedor. */
export function useSubsOf() {
  const {extraSubs} = useSettings();
  return (line: string, base: string[]) => [...base, ...(extraSubs[line] ?? [])];
}
