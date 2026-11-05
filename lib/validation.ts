export const passwordRules = [
  {label: 'Mínimo 8 caracteres', test: (v: string) => v.length >= 8},
  {label: 'Una letra mayúscula', test: (v: string) => /[A-ZÁÉÍÓÚÑ]/.test(v)},
  {label: 'Un número', test: (v: string) => /\d/.test(v)},
];
export const isStrongPassword = (v: string) => passwordRules.every(r => r.test(v));

/** Deja solo los dígitos del número local, sin el indicativo 57. */
export const phoneDigits = (v: string) => {
  const digits = v.replace(/\D/g, '');
  return digits.length === 12 && digits.startsWith('57') ? digits.slice(2) : digits;
};
export const isValidPhone = (v: string) => {
  const n = phoneDigits(v).length;
  return n >= 7 && n <= 10;
};
export const phoneError = 'Escribe un número de 7 a 10 dígitos, por ejemplo 310 256 9469.';
