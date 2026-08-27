export type CartItem = {
  name: string;
  price: number;
  image: string;
  quantity: number;
};

const CART_KEY = "mazoe-cart";

export function readCart(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(window.localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(stored) ? stored : [];
  } catch {
    return [];
  }
}

export function writeCart(items: CartItem[]) {
  window.localStorage.setItem(CART_KEY, JSON.stringify(items));
  window.dispatchEvent(new Event("mazoe-cart-updated"));
}

export function addCartItem(item: Omit<CartItem, "quantity">) {
  const cart = readCart();
  const existing = cart.find((entry) => entry.name === item.name);
  if (existing) existing.quantity += 1;
  else cart.push({ ...item, quantity: 1 });
  writeCart(cart);
  return cart;
}

export function cartCount(items: CartItem[]) {
  return items.reduce((total, item) => total + item.quantity, 0);
}