export interface Product {
  id: string;
  name: string;
  category: 'Acero Quirúrgico' | 'Acero Dorado' | 'Acero Blanco' | 'Plata 925' | 'Insumos / Packaging';
  cost: number;
  price: number;
  stock: number;
  isActive: boolean;
}

export interface Sale {
  id: string;
  productId: string;
  quantity: number;
  total: number;
  paymentMethod: 'Transferencia' | 'MercadoPago' | 'Efectivo';
  client: string;
  date: string; // ISO date string
}

export interface Provider {
  id: string;
  name: string;
  zone: 'Once CABA' | 'Libertad CABA' | 'Online' | 'Otro';
  type: string;
  contact: string;
  phone?: string;
  email?: string;
  minPurchase: number;
  rating: number; // 1 to 5
}

export interface Task {
  id: string;
  title: string;
  completed: boolean;
  category: string;
  status?: 'pending' | 'in-progress' | 'completed';
  frequency?: 'daily' | 'weekly' | 'monthly' | 'once';
}

export interface StockChange {
  id: string;
  productId: string;
  delta: number;
  date: string;
}

export interface AppEvent {
  id: string;
  date: string; // YYYY-MM-DD
  title: string;
  type: 'buy' | 'marketing' | 'finance' | 'sale' | 'other';
}

export interface AiMessage {
  role: 'user' | 'model';
  text: string;
}

export interface ChatSession {
  id: string;
  date: string;
  title: string;
  messages: AiMessage[];
}

export interface AppState {
  products: Product[];
  sales: Sale[];
  providers: Provider[];
  tasks: Task[];
  stockHistory: StockChange[];
  events: AppEvent[];
  startDate: string;
  chatSessions?: ChatSession[];
}
