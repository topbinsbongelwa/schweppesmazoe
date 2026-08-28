const API_BASE = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api").replace(/\/$/, "");

export interface Product {
  _id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  flavor: string;
  packSize: string;
  image: string;
  bgImage: string;
  inStock: boolean;
  stock: number;
  featured: boolean;
  badge?: string;
}

export type ProductInput = Omit<Product, "_id">;

export interface User {
  id: string;
  name: string;
  email: string;
}

export interface AuthResponse { token: string; user: User; }

export interface DashboardStats {
  products: number;
  orders: number;
  customers: number;
  revenue: number;
  recentOrders: Order[];
  topProducts: { _id: string; units: number; revenue: number }[];
  lowStock: Product[];
}

export interface Order {
  _id: string;
  user: string;
  items: { product: string; quantity: number; price: number }[];
  shippingAddress: string;
  paymentMethod: string;
  totalAmount: number;
  status: string;
  createdAt: string;
}

async function apiFetch<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ message: "Request failed" }));
    throw new Error(error.message || "Request failed");
  }

  return res.json();
}

export const api = {
  products: {
    getAll: () => apiFetch<Product[]>("/products"),
    getOne: (id: string) => apiFetch<Product>(`/products/${id}`),
    create: (data: ProductInput) => apiFetch<Product>("/products", { method: "POST", body: JSON.stringify(data) }),
    update: (id: string, data: Partial<ProductInput>) => apiFetch<Product>(`/products/${id}`, { method: "PUT", body: JSON.stringify(data) }),
    remove: (id: string) => apiFetch<{ message: string }>(`/products/${id}`, { method: "DELETE" }),
    search: (q: string) => apiFetch<Product[]>(`/products?search=${encodeURIComponent(q)}`),
    getByCategory: (cat: string) => apiFetch<Product[]>(`/products?category=${cat}`),
  },
  auth: {
    register: (data: { name: string; email: string; password: string }) =>
      apiFetch<AuthResponse>("/users/register", { method: "POST", body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      apiFetch<AuthResponse>("/users/login", { method: "POST", body: JSON.stringify(data) }),
    profile: (token: string) =>
      apiFetch<{ id: string; name: string; email: string }>("/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      }),
  },
  orders: {
    getAll: (token: string) =>
      apiFetch<Order[]>("/orders", { headers: { Authorization: `Bearer ${token}` } }),
    create: (token: string, data: Partial<Order>) =>
      apiFetch<Order>("/orders", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(data),
      }),
  },
  dashboard: {
    getStats: () => apiFetch<DashboardStats>("/dashboard/stats"),
  },
};
