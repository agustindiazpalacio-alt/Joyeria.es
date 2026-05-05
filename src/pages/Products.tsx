import React, { useState } from 'react';
import { useAppStore } from '../store/StoreContext';
import { Product } from '../types';
import { Search, Plus, Edit2, Trash2, Filter, Package, Sparkles, Loader2 } from 'lucide-react';
import { GoogleGenAI } from '@google/genai';

import AiPanel from '../components/AiPanel';

export default function Products() {
  const { state, setState } = useAppStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('Todas');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Seguro que quieres eliminar este producto?')) {
      setState(prev => ({ ...prev, products: prev.products.filter(p => p.id !== id) }));
    }
  };

  const openForm = (prod?: Product) => {
    setEditingProduct(prod || null);
    setIsModalOpen(true);
  };

  const filteredProducts = state.products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
    let matchesCat = true;
    if (categoryFilter === 'Bajo Stock') {
       matchesCat = p.stock < 3;
    } else if (categoryFilter === 'Inactivos') {
       matchesCat = !p.isActive;
    } else if (categoryFilter !== 'Todas') {
       matchesCat = p.category === categoryFilter;
    }
    return matchesSearch && matchesCat;
  });

  const getStockColor = (stock: number) => {
    if (stock === 0) return 'text-red-400 bg-red-950/50 border border-red-900/50';
    if (stock < 3) return 'text-amber-400 bg-amber-950/50 border border-amber-900/50';
    return 'text-emerald-400 bg-emerald-950/50 border border-emerald-900/50';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-serif font-bold golden-text-gradient mb-1">Catálogo & Stock</h1>
          <p className="text-brand-400 text-sm">Gestiona tus productos, precios y variaciones</p>
        </div>
        <button onClick={() => openForm()} className="golden-button px-5 py-2.5 flex items-center gap-2 font-bold rounded-xl shadow-[0_0_20px_rgba(212,175,55,0.15)] transform hover:scale-105 transition-all">
          <Plus className="w-5 h-5" /> Agregar Producto
        </button>
      </div>

      <AiPanel 
        title="Asistente: Estratega de Productos"
        systemPrompt="Eres un Estratega de Producto experto en joyas. El usuario te dará el nombre o descripción de un producto. Sugiere un precio óptimo para Argentina, una descripción para la web (con copy persuasivo), y aconseja si conviene comprarlo para stock basado en tendencias estacionales."
        contextData={{ inventarioActual: state.products.map(p => ({ nom: p.name, prec: p.price, cost: p.cost })) }}
        placeholder="Ej: Anillo sello de acero dorado con inicial"
        description="Analiza la demanda de nuevos productos de joyería, aconseja sobre estacionalidad, y genera descripciones optimizadas."
      />

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4 bg-brand-950/50 p-4 rounded-xl border border-brand-800/80 shadow-md">
        <div className="relative flex-1 group">
          <Search className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-500 group-focus-within:text-gold transition-colors" />
          <input 
            type="text" 
            placeholder="Buscar por nombre de producto..." 
            className="w-full bg-brand-900 pl-10 pr-4 py-3 border border-brand-800 rounded-xl focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm text-brand-100 placeholder-brand-600 shadow-inner transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex flex-wrap items-center gap-2">
          {['Todas', 'Acero Quirúrgico', 'Plata 925', 'Acero Dorado', 'Bajo Stock', 'Inactivos'].map(c => (
            <button 
              key={c}
              onClick={() => setCategoryFilter(c)}
              className={`px-4 py-2 rounded-xl text-[13px] font-bold transition-all border shadow-sm ${
                categoryFilter === c 
                  ? 'bg-gold/10 text-gold border-gold/30' 
                  : 'bg-brand-900 text-brand-400 border-brand-800/50 hover:bg-brand-800 hover:text-brand-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="premium-card rounded-2xl overflow-hidden shadow-xl border border-brand-800/50">
        <div className="overflow-x-auto custom-scrollbar">
          <table className="w-full text-sm text-left">
            <thead className="text-[10px] text-brand-400 font-bold uppercase tracking-widest bg-brand-900/80 border-b border-brand-800">
              <tr>
                <th className="px-5 py-4 whitespace-nowrap">Nombre</th>
                <th className="px-5 py-4 whitespace-nowrap">Categoría</th>
                <th className="px-5 py-4 whitespace-nowrap">Costo Unit.</th>
                <th className="px-5 py-4 whitespace-nowrap">Precio Venta</th>
                <th className="px-5 py-4 whitespace-nowrap">Stock / Estado</th>
                <th className="px-5 py-4 text-right whitespace-nowrap">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-brand-800/50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-brand-800/20 transition-colors group">
                  <td className="px-5 py-4">
                     <span className="font-bold text-brand-100">{product.name}</span>
                     {!product.isActive && <p className="text-[10px] text-red-400 uppercase tracking-wider font-bold mt-1">Pausado en Web</p>}
                  </td>
                  <td className="px-5 py-4">
                    <span className="px-2.5 py-1 bg-brand-950 border border-brand-800/50 text-brand-300 rounded-lg text-[11px] font-bold tracking-wide">
                      {product.category}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-brand-400 font-mono font-medium">${product.cost.toLocaleString('es-AR')}</td>
                  <td className="px-5 py-4 text-brand-100 font-mono font-bold">${product.price.toLocaleString('es-AR')}</td>
                  <td className="px-5 py-4">
                    <div className="flex flex-col gap-1.5 items-start">
                       <span className={`px-2.5 py-1 rounded-lg text-xs font-bold ${getStockColor(product.stock)} flex items-center justify-center min-w-[70px]`}>
                         {product.stock} {product.stock === 1 ? 'unid.' : 'unids.'}
                       </span>
                       {product.stock < 3 && (
                          <span className="text-[10px] text-brand-400 italic">
                             ⚠️ {product.stock === 0 ? 'Reponer' : 'Comprar sugerido'}: <strong className="text-amber-400">10-20 unid.</strong>
                          </span>
                       )}
                    </div>
                  </td>
                  <td className="px-5 py-4 text-right">
                    <div className="flex justify-end gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                      <button onClick={() => openForm(product)} className="p-2 text-brand-400 hover:text-sky-400 bg-brand-900 rounded-lg hover:bg-sky-500/10 border border-transparent hover:border-sky-500/30 transition-all cursor-pointer"><Edit2 className="w-4 h-4" /></button>
                      <button onClick={() => handleDelete(product.id)} className="p-2 text-brand-400 hover:text-red-400 bg-brand-900 rounded-lg hover:bg-red-500/10 border border-transparent hover:border-red-500/30 transition-all cursor-pointer"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {filteredProducts.length === 0 && (
            <div className="text-center py-16 bg-brand-950/20">
              <Package className="w-12 h-12 text-brand-600 mx-auto mb-4" />
              <p className="text-brand-300 text-lg font-bold">No se encontraron productos.</p>
              <p className="text-brand-500 text-sm mt-1">Prueba con otra búsqueda o filtro.</p>
            </div>
          )}
        </div>
      </div>

      {/* Product Form Modal (Simplified) */}
      {isModalOpen && (
        <ProductModal 
          product={editingProduct} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

function ProductModal({ product, onClose }: { product: Product | null, onClose: () => void }) {
  const { setState } = useAppStore();
  const [formData, setFormData] = useState<Partial<Product>>(product || {
    name: '', category: 'Acero Quirúrgico', cost: 0, price: 0, stock: 0, isActive: true
  });
  const [isAiLoading, setIsAiLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => {
      if (product) {
        return { ...prev, products: prev.products.map(p => p.id === product.id ? { ...p, ...formData } as Product : p) };
      } else {
        return { ...prev, products: [...prev.products, { ...formData, id: 'p_' + Date.now() } as Product] };
      }
    });
    onClose();
  };

  const handleAiFill = async () => {
    if (!formData.name) {
      alert("Por favor, ingresa el nombre del producto primero.");
      return;
    }
    
    setIsAiLoading(true);
    try {
      const apiKey = 'AIzaSyCBeMU46FwZdPv_GEpZ8xKYIVbNbbYxYhQ';
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Devuelve SOLO un JSON puro (sin formato markdown ni \`\`\`json) con datos estimados para una joyería en Argentina (2026) que vende el siguiente producto: "${formData.name}".
      Propiedades esperadas en el JSON:
      {
        "category": "Acero Quirúrgico" | "Acero Dorado" | "Acero Blanco" | "Plata 925" | "Insumos / Packaging",
        "cost": número (costo estimado de compra en Once en pesos ARS, ej: 4000),
        "price": número (precio de venta sugerido al público ARS, ej: 12000),
        "stock": número (stock inicial recomendado ej: 10 o 50)
      }`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          maxOutputTokens: 200,
          temperature: 0.1
        }
      });

      if (!response.text) throw new Error("Error en IA");
      const rawText = response.text;
      
      const cleanJson = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsed = JSON.parse(cleanJson);

      setFormData(prev => ({
        ...prev,
        category: (parsed.category as Product['category']) || prev.category,
        cost: parsed.cost || prev.cost,
        price: parsed.price || prev.price,
        stock: parsed.stock || prev.stock
      }));

    } catch (error) {
      console.error(error);
      alert("La IA no pudo autocompletar. Revisa el nombre ingresado.");
    } finally {
      setIsAiLoading(false);
    }
  };

  // Calculadora Precio sugerido
  const suggestedPrice = Math.round((formData.cost || 0) * 2.5); // Example basic markup

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="premium-card w-full max-w-md p-6 shadow-2xl animate-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-serif font-bold text-brand-100">{product ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <button onClick={onClose} className="text-brand-500 hover:text-white transition-colors bg-brand-900 rounded-full p-2 border border-brand-800">&times;</button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-brand-300 mb-1">Nombre del Producto</label>
            <div className="flex gap-2">
               <input required type="text" placeholder="Ej: Anillo sello de acero" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="premium-input flex-1" />
               <button 
                 type="button"
                 onClick={handleAiFill}
                 disabled={isAiLoading || !formData.name}
                 className="bg-gold/10 text-gold border border-gold/30 hover:bg-gold/20 disabled:opacity-50 px-3 rounded-xl flex items-center justify-center transition-colors"
                 title="Autocompletar con IA"
               >
                 {isAiLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
               </button>
            </div>
            {!product && <p className="text-xs text-gold/70 mt-2">Escribe el nombre y toca la 💎 para autocompletar.</p>}
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-2">
            <div>
              <label className="block text-[13px] font-medium text-brand-400 mb-1">Costo Unitario ($)</label>
              <input required type="number" min="0" value={formData.cost} onChange={e => setFormData({...formData, cost: Number(e.target.value)})} className="premium-input w-full" />
            </div>
            <div>
              <label className="block text-[13px] font-medium text-brand-400 mb-1">Precio de Venta ($)</label>
              <input required type="number" min="0" value={formData.price} onChange={e => setFormData({...formData, price: Number(e.target.value)})} className="premium-input w-full" />
              <p className="text-[11px] text-brand-500 mt-1">Sugerido (x2.5): ${suggestedPrice.toLocaleString()}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[13px] font-medium text-brand-400 mb-1">Categoría Principal</label>
              <select required value={formData.category} onChange={e => setFormData({...formData, category: e.target.value as Product['category']})} className="premium-input w-full">
                <option value="Acero Quirúrgico">Acero Quirúrgico</option>
                <option value="Acero Dorado">Acero Dorado</option>
                <option value="Acero Blanco">Acero Blanco</option>
                <option value="Plata 925">Plata 925</option>
                <option value="Insumos / Packaging">Insumos / Packaging</option>
              </select>
            </div>
            <div>
              <label className="block text-[13px] font-medium text-brand-400 mb-1">Stock</label>
              <input required type="number" min="0" value={formData.stock} onChange={e => setFormData({...formData, stock: Number(e.target.value)})} className="premium-input w-full" />
            </div>
          </div>

          <div className="pt-2">
            <label className="flex items-center gap-2 text-[13px] font-medium text-brand-300">
              <input 
                type="checkbox" 
                checked={formData.isActive} 
                onChange={e => setFormData({...formData, isActive: e.target.checked})} 
                className="w-4 h-4 rounded border-brand-700 text-gold focus:ring-gold bg-brand-900"
              />
              Producto visible en catálogo
            </label>
          </div>

          <button type="submit" className="w-full golden-button py-3 mt-4">
            {product ? 'Guardar Cambios' : 'Crear Producto'}
          </button>
        </form>
      </div>
    </div>
  );
}
