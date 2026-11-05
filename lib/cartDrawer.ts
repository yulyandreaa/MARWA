/* Permite abrir el carrito lateral desde cualquier encabezado. */
let listener: () => void = () => {};
export const onCartOpen = (fn: () => void) => { listener = fn; };
export const openCart = () => listener();
