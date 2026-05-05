import { AppState, Product, Provider, Sale, Task } from '../types';

const INITIAL_PRODUCTS: Product[] = [
  { id: 'p1', name: 'Anillo Regulable Acero Dorado', category: 'Acero Dorado', cost: 1800, price: 8500, stock: 12, isActive: true },
  { id: 'p2', name: 'Cadena Eslabón Cubana', category: 'Acero Quirúrgico', cost: 2200, price: 10000, stock: 5, isActive: true },
  { id: 'p3', name: 'Aros Argolla Plata 925', category: 'Plata 925', cost: 3500, price: 16000, stock: 2, isActive: true },
  { id: 'p4', name: 'Collar Luna Acero Blanco', category: 'Acero Blanco', cost: 1200, price: 5500, stock: 8, isActive: true },
  { id: 'p5', name: 'Pulsera Doble Acero', category: 'Acero Quirúrgico', cost: 900, price: 4200, stock: 15, isActive: true },
  { id: 'p6', name: 'Anillo Sello Acero', category: 'Acero Quirúrgico', cost: 2800, price: 12000, stock: 4, isActive: true },
  { id: 'p7', name: 'Aros Huggies Dorados', category: 'Acero Dorado', cost: 1500, price: 7000, stock: 20, isActive: true },
  { id: 'p8', name: 'Cadena Tejido Rolo', category: 'Plata 925', cost: 1100, price: 5000, stock: 1, isActive: true },
];

const INITIAL_PROVIDERS: Provider[] = [
  { id: 'pr1', name: 'MayoristaOnce', zone: 'Once CABA', type: 'Acero', contact: '+5491100001111', minPurchase: 150000, rating: 4 },
  { id: 'pr2', name: 'Libertad Plata', zone: 'Libertad CABA', type: 'Plata 925', contact: '+5491100002222', minPurchase: 80000, rating: 5 },
  { id: 'pr3', name: 'InsumosPro', zone: 'Online', type: 'Insumos / Packaging', contact: 'insumospro.com.ar', minPurchase: 30000, rating: 4 },
  { id: 'pr4', name: 'AceroVip', zone: 'Once CABA', type: 'Acero Premium', contact: '+5491100003333', minPurchase: 200000, rating: 5 },
  { id: 'pr5', name: 'OroBrillos', zone: 'Online', type: 'Dorado PVD', contact: '@orobrillos.mayorista', minPurchase: 120000, rating: 3 },
];

const generateInitialSales = (): Sale[] => {
  const sales: Sale[] = [];
  const today = new Date();
  
  // Generate a few sales over the last 15 days
  for (let i = 0; i < 10; i++) {
    const p = INITIAL_PRODUCTS[i % INITIAL_PRODUCTS.length];
    const daysAgo = Math.floor(Math.random() * 15);
    const date = new Date(today);
    date.setDate(date.getDate() - daysAgo);
    
    sales.push({
      id: `s${i}`,
      productId: p.id,
      quantity: 1 + Math.floor(Math.random() * 2), // 1 to 3
      total: p.price * (1 + Math.floor(Math.random() * 2)),
      paymentMethod: i % 3 === 0 ? 'MercadoPago' : (i % 2 === 0 ? 'Transferencia' : 'Efectivo'),
      client: i % 2 === 0 ? 'María García' : 'Juan Perez',
      date: date.toISOString(),
    });
  }
  
  return sales;
};

const INITIAL_TASKS: Task[] = [
  { id: 't1', title: 'Elegir nombre (INPI Clase 14)', completed: false, category: 'Setup Inicial' },
  { id: 't2', title: 'Inscripción Monotributo AFIP Categoría A', completed: false, category: 'Setup Inicial' },
  { id: 't3', title: 'Comprar dominio NIC.ar', completed: false, category: 'Setup Inicial' },
  { id: 't4', title: 'Crear Tiendanube', completed: false, category: 'Setup Inicial' },
  { id: 't5', title: 'Revisar carritos abandonados', completed: false, category: 'Rutina Mañana' },
  { id: 't6', title: 'Responder WhatsApps acumulados', completed: false, category: 'Rutina Mañana' },
  { id: 't7', title: 'Imprimir etiquetas de envío', completed: false, category: 'Rutina Tarde' },
  { id: 't8', title: 'Armar cajas y grabar pack-with-me', completed: false, category: 'Rutina Tarde' },
  { id: 't9', title: 'Revisar flujo de caja', completed: false, category: 'Auditoría Semanal' },
  { id: 't10', title: 'Revisar ROAS y campañas Meta Ads', completed: false, category: 'Auditoría Semanal' },
  { id: 't11', title: 'Separar ganancias y pagar monotributo', completed: false, category: 'Cierre Mensual' },
  { id: 't12', title: 'Liquidar stock muerto', completed: false, category: 'Cierre Mensual' },
];

export const initialData: AppState = {
  products: INITIAL_PRODUCTS,
  sales: generateInitialSales(),
  providers: INITIAL_PROVIDERS,
  tasks: INITIAL_TASKS,
  stockHistory: [],
  events: [],
  startDate: new Date().toISOString(),
  chatSessions: [],
};
