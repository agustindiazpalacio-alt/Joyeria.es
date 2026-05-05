import React, { useState } from 'react';
import { useAppStore } from '../store/StoreContext';
import { AlertTriangle, Package, DollarSign, History, X, Plus, Edit2, Trash2, Search } from 'lucide-react';
import { Product } from '../types';

import AiPanel from '../components/AiPanel';

export default function Stock() {
  const { state, setState } = useAppStore();
  const [filter, setFilter] = useState('Todos');
  const [search, setSearch] = useState('');
  const [showHistory, setShowHistory] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const adjustStock = (id: string, delta: number) => {
    setState(prev => {
      const historyArr = prev.stockHistory || [];
      return {
      ...prev,
      products: prev.products.map(p => {
        if (p.id === id) {
          const newStock = Math.max(0, p.stock + delta);
          return { ...p, stock: newStock };
        }
        return p;
      }),
      stockHistory: [
        {
          id: 'hist_' + Date.now() + Math.random(),
          productId: id,
          delta: delta,
          date: new Date().toISOString()
        },
        ...historyArr
      ]
    }});
  };

  const handleDelete = (id: string) => {
    if (window.confirm('¿Seguro que quieres eliminar este producto?')) {
      setState(prev => ({
        ...prev,
        products: prev.products.filter(p => p.id !== id)
      }));
    }
  };

  const openForm = (prod?: Product) => {
    setEditingProduct(prod || null);
    setIsModalOpen(true);
  };

  const filtered = state.products.filter(p => {
    const matchesFilter = filter === 'Todos' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  const totalItems = state.products.reduce((acc, p) => acc + p.stock, 0);
  const totalValueCost = state.products.reduce((acc, p) => acc + (p.stock * p.cost), 0);
  const totalValuePrice = state.products.reduce((acc, p) => acc + (p.stock * p.price), 0);
  const alertsCount = state.products.filter(p => p.stock < 3).length;

  const categories = ['Todos', ...Array.from(new Set(state.products.map(p => p.category)))];
  const recentHistory = (state.stockHistory || []).slice(0, 20);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-serif font-bold golden-text-gradient mb-1">Inventario & Catálogo</h1>
          <p className="text-brand-400 text-sm">Audita y gestiona tus productos en tiempo real</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button 
            onClick={() => setShowHistory(true)}
            className="flex-1 sm:flex-none px-4 py-2 bg-brand-900 border border-brand-800 hover:border-gold/50 rounded-xl text-sm font-bold flex items-center justify-center gap-2 text-brand-300 transition-colors shadow-sm cursor-pointer"
          >
            <History className="w-4 h-4" /> Historial
          </button>
          <button 
            onClick={() => openForm()}
            className="flex-1 sm:flex-none golden-button px-4 py-2 rounded-xl text-sm font-bold flex items-center justify-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" /> Nuevo Producto
          </button>
        </div>
      </div>

      <AiPanel 
        title="Asistente: Gestor de Inventario"
        systemPrompt="Eres un Gestor de Inventario experto en retail. Analiza el stock actual y recomienda qué reponer urgentemente (alerta roja), qué intentar liquidar mediante combos, y da consejos sobre cómo distribuir el presupuesto de la próxima compra."
        contextData={{ productos: state.products.map(p => ({ nom: p.name, stock: p.stock, cat: p.category })) }}
        placeholder="Ej: Tengo $200.000 para reponer mercancía, ¿qué compro?"
        description="Analiza tu stock actual, identifica productos estancados para liquidar, y optimiza inteligentemente tu presupuesto de reposición."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="premium-card p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="p-3 bg-sky-100 text-sky-600 rounded-xl border border-sky-200"><Package className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-brand-500 font-medium">Unidades Totales</p>
            <p className="text-xl font-bold text-brand-100">{totalItems}</p>
          </div>
        </div>
        <div className="premium-card p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl border border-emerald-200"><DollarSign className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-brand-500 font-medium">Valuación (Venta)</p>
            <p className="text-xl font-bold text-brand-100">${totalValuePrice.toLocaleString()}</p>
          </div>
        </div>
        <div className="premium-card p-5 flex items-center gap-4 hover:-translate-y-1 transition-transform">
          <div className="p-3 bg-red-100 text-red-600 rounded-xl border border-red-200"><AlertTriangle className="w-6 h-6" /></div>
          <div>
            <p className="text-sm text-brand-500 font-medium">Alertas de Stock</p>
            <p className="text-xl font-bold text-brand-100">{alertsCount}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-brand-900 border border-brand-800 p-2 sm:p-3 rounded-2xl shadow-sm">
        <div className="relative w-full sm:w-80 shrink-0">
           <Search className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-brand-500" />
           <input 
             type="text"
             placeholder="Buscar en catálogo..."
             value={search}
             onChange={e => setSearch(e.target.value)}
             className="w-full bg-brand-950 border border-brand-800 rounded-xl py-2.5 pl-11 pr-4 text-sm text-brand-100 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold transition-all shadow-inner"
           />
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 sm:pb-0 hide-scrollbar snap-x w-full">
          {categories.map(c => (
            <button 
              key={c}
              onClick={() => setFilter(c)}
              className={`snap-start px-4 py-2 rounded-xl text-sm font-bold whitespace-nowrap transition-colors cursor-pointer ${
                filter === c ? 'bg-gold text-brand-950 shadow-md' : 'bg-brand-950 text-brand-400 hover:bg-brand-800 hover:text-brand-300'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
        {filtered.map(product => (
          <div key={product.id} className="premium-card bg-brand-900 p-0 flex flex-col relative overflow-hidden group hover:border-gold/30 hover:shadow-lg transition-all duration-300">
            {/* Status Strip */}
            <div className={`h-1.5 w-full ${product.stock === 0 ? 'bg-red-500' : product.stock < 3 ? 'bg-amber-400' : 'bg-emerald-500'}`} />

            <div className="p-4 flex-1 flex flex-col">
              <div className="flex justify-between items-start mb-3">
                 <div className="w-12 h-12 rounded-xl bg-brand-950 border border-brand-800 flex items-center justify-center shrink-0 shadow-inner">
                    <Package className="w-5 h-5 text-brand-500" />
                 </div>
                 <div className="flex gap-1 transition-opacity">
                    <button onClick={() => openForm(product)} className="p-1.5 text-brand-400 hover:text-sky-400 bg-brand-950 rounded-md border border-brand-800 hover:border-sky-500/30 transition-colors cursor-pointer"><Edit2 className="w-3.5 h-3.5" /></button>
                    <button onClick={() => handleDelete(product.id)} className="p-1.5 text-brand-400 hover:text-red-400 bg-brand-950 rounded-md border border-brand-800 hover:border-red-500/30 transition-colors cursor-pointer"><Trash2 className="w-3.5 h-3.5" /></button>
                 </div>
              </div>
              
              <div className="mb-4">
                <p className="text-[10px] font-bold uppercase tracking-wider text-gold/80 mb-1">{product.category}</p>
                <h3 className="font-bold text-brand-100 line-clamp-2 leading-snug">{product.name}</h3>
                <p className="text-lg font-bold text-emerald-600 mt-2">${product.price.toLocaleString('es-AR')}</p>
              </div>
              
              <div className="mt-auto">
                <div className="flex justify-between text-xs mb-1.5 px-1 font-medium">
                  <span className="text-brand-500">Stock actual:</span>
                  <span className={`font-bold ${product.stock === 0 ? 'text-red-500' : product.stock < 3 ? 'text-amber-600' : 'text-emerald-600'}`}>
                    {product.stock} un.
                  </span>
                </div>
                
                {product.stock < 5 && (
                  <div className="flex justify-between text-xs mb-2 px-1 font-bold text-sky-400">
                    <span>Sugerido comprar:</span>
                    <span>{10 - product.stock} un.</span>
                  </div>
                )}
                
                <div className="flex justify-between items-center bg-brand-950 rounded-xl p-1 border border-brand-800/80 shadow-inner mt-2">
                  <button 
                    onClick={() => adjustStock(product.id, -1)}
                    className="w-10 h-8 flex items-center justify-center rounded-lg hover:bg-red-100 text-brand-400 hover:text-red-600 transition-colors cursor-pointer"
                  >
                    -
                  </button>
                  <div className="text-[10px] font-bold text-brand-400 uppercase tracking-widest px-2">Ajustar</div>
                  <button 
                    onClick={() => adjustStock(product.id, 1)}
                    className="w-10 h-8 flex items-center justify-center rounded-lg hover:bg-emerald-100 text-brand-400 hover:text-emerald-600 transition-colors cursor-pointer"
                  >
                    +
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
           <div className="col-span-full py-20 text-center flex flex-col items-center">
             <Package className="w-12 h-12 text-brand-700 opacity-20 mb-3" />
             <p className="text-brand-500 font-medium">No se encontraron productos.</p>
           </div>
        )}
      </div>

      {isModalOpen && (
        <ProductModal 
          product={editingProduct} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}

      {showHistory && (
        <div className="fixed inset-0 bg-brand-900/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="premium-card w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
             <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-serif font-bold text-brand-100 flex items-center gap-2">
                   <History className="w-5 h-5 text-gold" /> Historial Reciente
                </h2>
                <button onClick={() => setShowHistory(false)} className="text-brand-500 hover:text-brand-100 transition-colors bg-brand-950 rounded-full p-2 border border-brand-800 cursor-pointer">
                   <X className="w-4 h-4" />
                </button>
             </div>
             
             <div className="space-y-3 max-h-[60vh] overflow-y-auto custom-scrollbar pr-2">
                {recentHistory.length === 0 ? (
                  <p className="text-center text-brand-500 py-8 text-sm">No hay movimientos recientes.</p>
                ) : (
                  recentHistory.map(h => {
                    const product = state.products.find(p => p.id === h.productId);
                    const prodName = product ? product.name : 'Producto Eliminado';
                    const isPositive = h.delta > 0;
                    return (
                      <div key={h.id} className="p-3 bg-brand-950 rounded-xl border border-brand-800 flex justify-between items-center">
                         <div>
                            <p className="text-sm font-bold text-brand-200 line-clamp-1">{prodName}</p>
                            <p className="text-[11px] text-brand-500 font-medium mt-0.5">{new Date(h.date).toLocaleString('es-AR')}</p>
                         </div>
                         <div className={`font-mono font-bold px-2.5 py-1 rounded-md text-sm border ${isPositive ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-600'}`}>
                            {isPositive ? '+' : ''}{h.delta}
                         </div>
                      </div>
                    );
                  })
                )}
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

function ProductModal({ product, onClose }: { product: Product | null, onClose: () => void }) {
  const { state, setState } = useAppStore();
  const [formData, setFormData] = useState<Partial<Product>>(product || {
    name: '', category: 'Acero Quirúrgico', cost: 0, price: 0, stock: 0, isActive: true
  });

  const categories = ['Acero Dorado', 'Acero Quirúrgico', 'Plata 925', 'Acero Blanco', 'Insumos / Packaging'];

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => {
      if (product) {
         return {
           ...prev,
           products: prev.products.map(p => p.id === product.id ? { ...p, ...formData } as Product : p)
         }
      } else {
         return {
           ...prev,
           products: [{ ...formData, id: 'prod_' + Date.now() } as Product, ...prev.products]
         }
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-brand-900/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 py-8 overflow-y-auto">
       <div className="premium-card w-full max-w-md p-6 bg-brand-900 shadow-2xl animate-in zoom-in-95 my-auto">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif font-bold text-brand-100 flex items-center gap-2">
               <Package className="w-5 h-5 text-gold" />
               {product ? 'Editar Producto' : 'Nuevo Producto'}
            </h2>
            <button onClick={onClose} className="p-2 text-brand-400 hover:text-brand-100 bg-brand-950 rounded-full border border-brand-800 cursor-pointer"><X className="w-4 h-4" /></button>
          </div>
          <form onSubmit={submit} className="space-y-4">
             <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-500 mb-1.5">Nombre del Producto</label>
                <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="premium-input w-full p-3" placeholder="Ej: Anillo de Plata 925" />
             </div>
             <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-500 mb-1.5">Categoría</label>
                <select required value={formData.category} onChange={e=>setFormData({...formData, category: e.target.value as any})} className="premium-input w-full p-3">
                  {categories.map(c => <option key={c} value={c}>{c}</option>)}
                </select>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-500 mb-1.5">Costo ($)</label>
                   <input required type="number" min="0" value={formData.cost || ''} onChange={e=>setFormData({...formData, cost: Number(e.target.value)})} className="premium-input w-full p-3" placeholder="Costo" />
                </div>
                <div>
                   <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-500 mb-1.5">Precio de Venta ($)</label>
                   <input required type="number" min="0" value={formData.price || ''} onChange={e=>setFormData({...formData, price: Number(e.target.value)})} className="premium-input w-full p-3" placeholder="Venta" />
                </div>
             </div>
             <div>
                <label className="block text-[11px] uppercase tracking-widest font-bold text-brand-500 mb-1.5">Stock Inicial</label>
                <input required type="number" min="0" value={formData.stock || ''} onChange={e=>setFormData({...formData, stock: Number(e.target.value)})} className="premium-input w-full p-3" placeholder="0" />
             </div>
             
             <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-brand-950 border border-brand-800 rounded-xl text-brand-500 font-bold hover:bg-brand-800 hover:text-brand-300 transition-colors cursor-pointer">Cancelar</button>
                <button type="submit" className="flex-1 golden-button py-3 rounded-xl font-bold uppercase tracking-widest text-xs cursor-pointer">Guardar</button>
             </div>
          </form>
       </div>
    </div>
  )
}

