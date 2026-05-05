import React, { useState, useMemo } from 'react';
import { useAppStore } from '../store/StoreContext';
import { Sale } from '../types';
import { ShoppingCart, Download, Plus, Filter, Sparkles, Loader2, X, Copy, CheckCircle2, Trash2 } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { GoogleGenAI } from '@google/genai';
import AiPanel from '../components/AiPanel';

export default function Sales() {
  const { state, setState } = useAppStore();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSaleForAi, setSelectedSaleForAi] = useState<Sale | null>(null);
  const [filterPayment, setFilterPayment] = useState('Todos');
  const [dateFilter, setDateFilter] = useState('30'); // days

  // Stats
  const filteredSales = useMemo(() => {
    return state.sales.filter(s => {
      if (filterPayment !== 'Todos' && s.paymentMethod !== filterPayment) return false;
      const daysDiff = (new Date().getTime() - new Date(s.date).getTime()) / (1000 * 3600 * 24);
      if (daysDiff > Number(dateFilter)) return false;
      return true;
    }).sort((a,b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [state.sales, filterPayment, dateFilter]);

  const totalPeriod = filteredSales.reduce((acc, s) => acc + s.total, 0);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Estás seguro de que deseas eliminar esta venta? El stock NO se restaurará automáticamente.')) {
      setState(prev => ({
        ...prev,
        sales: prev.sales.filter(s => s.id !== id)
      }));
    }
  };

  // Chart data
  const paymentData = useMemo(() => {
    const acc: Record<string, number> = {};
    filteredSales.forEach(s => {
      acc[s.paymentMethod] = (acc[s.paymentMethod] || 0) + s.total;
    });
    return Object.keys(acc).map(k => ({ name: k, Total: acc[k] }));
  }, [filteredSales]);

  const exportCSV = () => {
    let csv = 'Fecha,Cliente,ProductoID,Cantidad,Método,Total\n';
    filteredSales.forEach(s => {
      csv += `${new Date(s.date).toLocaleDateString()},${s.client || 'N/A'},${s.productId},${s.quantity},${s.paymentMethod},${s.total}\n`;
    });
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "ventas.csv");
    link.click();
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-serif font-bold golden-text-gradient mb-1">Ventas</h1>
          <p className="text-brand-400 text-sm">Registro histórico y análisis de conversiones</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <button onClick={exportCSV} className="bg-brand-900 border border-brand-800 hover:bg-brand-800 text-brand-300 px-4 py-2 rounded-xl font-medium flex items-center gap-2 transition-colors">
            <Download className="w-5 h-5" /> CSV
          </button>
          <button onClick={() => setIsModalOpen(true)} className="golden-button px-4 py-2 rounded-xl font-bold flex items-center gap-2 flex-col sm:flex-row w-full sm:w-auto justify-center">
            <Plus className="w-5 h-5" /> Nueva Venta
          </button>
        </div>
      </div>

      <AiPanel 
        title="Asistente: Analista de Ventas"
        systemPrompt="Eres un analista de datos de ventas experto en e-commerce. Analiza las ventas recientes para encontrar patrones (¿qué método de pago es más usado? ¿qué producto destaca?). Da recomendaciones para aumentar el ticket promedio."
        contextData={{ ventasSeleccionadas: filteredSales.map(s => ({ m: s.paymentMethod, tot: s.total, qty: s.quantity })), total: totalPeriod }}
        placeholder="Ej: Analiza mis ventas de este mes y dame 3 consejos para subir la facturación."
        description="Evalúa el rendimiento de tus ventas recientes, tus métodos de pago más populares y detecta oportunidades para incrementar el ticket promedio mensual."
      />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         <div className="md:col-span-1 premium-card p-6 flex flex-col justify-center">
            <p className="text-brand-500 mb-1 uppercase tracking-widest text-[11px] font-bold">Total (Período Seleccionado)</p>
            <h2 className="text-3xl font-bold text-emerald-700 mt-2">${totalPeriod.toLocaleString('es-AR')}</h2>
            <p className="text-sm text-brand-400 mt-2">{filteredSales.length} ventas procesadas</p>
         </div>
         <div className="md:col-span-2 premium-card p-4">
            <h3 className="text-lg font-serif font-medium text-brand-100 mb-4">Ventas por Método de Pago</h3>
            <div className="h-32">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={paymentData} layout="vertical" margin={{top: 0, right: 0, left: 20, bottom: 0}}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{fill: '#71717a', fontSize: 12}} />
                  <Tooltip cursor={{fill: 'rgba(255,255,255,0.05)'}} contentStyle={{backgroundColor: '#0f0f11', border: '1px solid #3f3f46', borderRadius: '12px', color: '#fff'}} formatter={(val) => '$'+val.toLocaleString()} />
                  <Bar dataKey="Total" fill="url(#purpleGoldGradient)" radius={[0, 4, 4, 0]} barSize={20} />
                </BarChart>
              </ResponsiveContainer>
              <svg width="0" height="0">
                <defs>
                  <linearGradient id="purpleGoldGradient" x1="0" y1="0" x2="1" y2="0">
                    <stop offset="0%" stopColor="#f59e0b" />
                    <stop offset="100%" stopColor="#8b5cf6" />
                  </linearGradient>
                </defs>
              </svg>
            </div>
         </div>
      </div>

      <div className="flex justify-start gap-4 mb-4">
         <select value={dateFilter} onChange={e=>setDateFilter(e.target.value)} className="bg-brand-900 border border-brand-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
            <option value="1">Hoy</option>
            <option value="7">Últimos 7 días</option>
            <option value="30">Últimos 30 días</option>
            <option value="365">Último año</option>
         </select>
         <select value={filterPayment} onChange={e=>setFilterPayment(e.target.value)} className="bg-brand-900 border border-brand-800 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-gold">
            <option value="Todos">Todos los métodos</option>
            <option value="MercadoPago">MercadoPago</option>
            <option value="Transferencia">Transferencia</option>
            <option value="Efectivo">Efectivo</option>
         </select>
      </div>

      <div className="premium-card overflow-hidden">
         <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
               <thead className="bg-brand-900/50 text-xs text-brand-500 uppercase tracking-widest border-b border-brand-800">
                  <tr>
                     <th className="px-4 py-3">Fecha</th>
                     <th className="px-4 py-3">Cliente</th>
                     <th className="px-4 py-3">Producto</th>
                     <th className="px-4 py-3 text-center">Cant.</th>
                     <th className="px-4 py-3">Pago</th>
                     <th className="px-4 py-3 text-right">Total</th>
                     <th className="px-4 py-3 text-center">Acciones</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-brand-800/50">
                  {filteredSales.map(sale => {
                     const p = state.products.find(x => x.id === sale.productId);
                     return (
                        <tr key={sale.id} className="hover:bg-brand-800/30 transition-colors group">
                           <td className="px-4 py-3 text-brand-500">{new Date(sale.date).toLocaleDateString()}</td>
                           <td className="px-4 py-3 font-medium">{sale.client || 'Consumidor Final'}</td>
                           <td className="px-4 py-3 text-brand-400">{p?.name || '---'}</td>
                           <td className="px-4 py-3 text-center text-brand-400">{sale.quantity}</td>
                           <td className="px-4 py-3"><span className="text-xs bg-brand-950 px-2 py-1 rounded text-brand-400 border">{sale.paymentMethod}</span></td>
                           <td className="px-4 py-3 text-emerald-400 font-bold text-right">${sale.total.toLocaleString()}</td>
                           <td className="px-4 py-3 text-center">
                             <div className="flex justify-center gap-1">
                               <button
                                 onClick={() => setSelectedSaleForAi(sale)}
                                 className="p-1.5 text-brand-400 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors border border-transparent hover:border-gold/30"
                                 title="Generar mensaje post-venta"
                               >
                                 <Sparkles className="w-4 h-4" />
                               </button>
                               <button
                                 onClick={() => handleDelete(sale.id)}
                                 className="p-1.5 text-brand-400 hover:text-red-600 hover:bg-red-100 rounded-lg transition-colors border border-transparent hover:border-red-200 cursor-pointer"
                                 title="Eliminar venta"
                               >
                                 <Trash2 className="w-4 h-4" />
                               </button>
                             </div>
                           </td>
                        </tr>
                     )
                  })}
               </tbody>
            </table>
         </div>
      </div>

      {isModalOpen && <NewSaleModal onClose={() => setIsModalOpen(false)} />}
      {selectedSaleForAi && <AiSaleMessageModal sale={selectedSaleForAi} onClose={() => setSelectedSaleForAi(null)} />}
    </div>
  );
}

function NewSaleModal({ onClose }: { onClose: () => void }) {
   const { state, setState } = useAppStore();
   const [productId, setProductId] = useState(state.products[0]?.id || '');
   const [quantity, setQuantity] = useState(1);
   const [method, setMethod] = useState<'Transferencia'|'MercadoPago'|'Efectivo'>('Transferencia');
   const [client, setClient] = useState('');
   const [priceOverride, setPriceOverride] = useState('');
   const [saleDate, setSaleDate] = useState(new Date().toISOString().substring(0, 10));

   const prod = state.products.find(p => p.id === productId);
   
   const submit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!productId || !prod) return;
      
      const priceToUse = priceOverride ? Number(priceOverride) : prod.price;
      const total = priceToUse * quantity;

      const newSale: Sale = {
         id: 's_' + Date.now(),
         productId,
         quantity,
         total,
         paymentMethod: method,
         client,
         date: new Date(saleDate + "T12:00:00").toISOString()
      };

      setState(prev => {
         // Prevent calendar clutter by relying on sales summary logic in CalendarView
         return {
           ...prev,
           sales: [...prev.sales, newSale],
           products: prev.products.map(p => p.id === productId ? { ...p, stock: Math.max(0, p.stock - quantity) } : p)
         };
      });
      onClose();
   };

   return (
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
         <div className="premium-card w-full max-w-md p-6 animate-in zoom-in-95">
            <h2 className="text-xl font-serif font-bold mb-4 golden-text-gradient">Registrar Venta</h2>
            <form onSubmit={submit} className="space-y-4">
               <div>
                  <label className="block text-sm text-brand-400 mb-1">Producto</label>
                  <select required value={productId} onChange={e=>setProductId(e.target.value)} className="premium-input w-full p-2.5">
                     {state.products.map(p => <option key={p.id} value={p.id}>{p.name} (Stock: {p.stock} | Precio: ${p.price})</option>)}
                  </select>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm text-brand-400 mb-1">Cantidad</label>
                     <input type="number" min="1" required value={quantity} onChange={e=>setQuantity(Number(e.target.value))} className="premium-input w-full p-2.5" />
                  </div>
                  <div>
                     <label className="block text-sm text-brand-400 mb-1">Precio Unit. Final</label>
                     <input type="number" placeholder={`$${prod?.price || 0}`} value={priceOverride} onChange={e=>setPriceOverride(e.target.value)} className="premium-input w-full p-2.5" />
                  </div>
               </div>
               <div className="grid grid-cols-2 gap-4">
                  <div>
                     <label className="block text-sm text-brand-400 mb-1">Método de Pago</label>
                     <select value={method} onChange={e=>setMethod(e.target.value as any)} className="premium-input w-full p-2.5">
                        <option value="Transferencia">Transferencia</option>
                        <option value="MercadoPago">MercadoPago</option>
                        <option value="Efectivo">Efectivo</option>
                     </select>
                  </div>
                  <div>
                     <label className="block text-sm text-brand-400 mb-1">Cliente (Opcional)</label>
                     <input type="text" value={client} onChange={e=>setClient(e.target.value)} className="premium-input w-full p-2.5" />
                  </div>
               </div>
               <div>
                  <label className="block text-sm text-brand-400 mb-1">Fecha de la Venta</label>
                  <input type="date" required value={saleDate} onChange={e=>setSaleDate(e.target.value)} className="premium-input w-full p-2.5 text-brand-100" />
               </div>
               <p className="text-[11px] font-medium bg-amber-950/30 text-amber-200 p-2 text-center rounded border border-amber-900/50">El stock se restará y se añadirá un evento al calendario.</p>
               <div className="flex gap-2 pt-2">
                  <button type="button" onClick={onClose} className="flex-1 bg-brand-900 border border-brand-800 hover:bg-brand-800 text-brand-300 py-2.5 rounded-xl font-bold transition-colors">Cancelar</button>
                  <button type="submit" className="flex-1 golden-button py-2.5 rounded-xl font-bold">Guardar Venta</button>
               </div>
            </form>
         </div>
      </div>
   );
}

function AiSaleMessageModal({ sale, onClose }: { sale: Sale, onClose: () => void }) {
  const { state } = useAppStore();
  const [message, setMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const product = state.products.find(p => p.id === sale.productId);
  const prodName = product?.name || 'producto';

  const generateMessage = async () => {
    setIsLoading(true);
    try {
      const apiKey = 'AIzaSyCBeMU46FwZdPv_GEpZ8xKYIVbNbbYxYhQ';
      const ai = new GoogleGenAI({ apiKey });
      const prompt = `Escribe un mensaje de WhatsApp amigable, corto y profesional para un cliente de mi joyería en Argentina.
El cliente se llama: ${sale.client || 'Cliente'}.
Acaba de comprar: ${sale.quantity}x ${prodName}.
Monto total: $${sale.total}.
El objetivo es agradecer la compra, darle un mini tip de cuidado (porque es una joya), y dejar la puerta abierta para su próxima compra con un 10% off. No uses formato markdown denso, solo pura redacción de texto de WhatsApp con algunos emojis.`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
          maxOutputTokens: 250,
          temperature: 0.7
        }
      });

      if (response.text) {
        setMessage(response.text);
      } else {
        setMessage("La IA no devolvió ninguna respuesta.");
      }
    } catch(err) {
      console.error(err);
      setMessage("Hubo un error al generar el mensaje.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="premium-card w-full max-w-md p-6 animate-in zoom-in-95">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-serif font-bold flex items-center gap-2 text-brand-100">
             <Sparkles className="w-5 h-5 text-gold" />
             Mensaje Post-Venta
          </h2>
          <button onClick={onClose} className="p-2 text-brand-400 hover:text-white"><X className="w-5 h-5"/></button>
        </div>
        
        <div className="mb-4">
           {message ? (
             <div className="p-4 bg-brand-950/80 border border-brand-800 rounded-xl relative whitespace-pre-wrap text-sm text-brand-300">
               {message}
               <button 
                  onClick={() => { navigator.clipboard.writeText(message); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
                  className="absolute top-2 right-2 p-1.5 bg-brand-800 rounded-md hover:bg-brand-700 transition"
               >
                 {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4 text-brand-400" />}
               </button>
             </div>
           ) : (
             <div className="text-center py-8 text-brand-500 border border-dashed border-brand-800 rounded-xl bg-brand-900/50">
               {isLoading ? <Loader2 className="w-8 h-8 animate-spin mx-auto text-gold mb-2" /> : <Sparkles className="w-8 h-8 mx-auto opacity-20 mb-2 fill-current" />}
               <p className="text-sm">{isLoading ? 'Cargando magia...' : 'Generá un mensaje personalizado para este cliente.'}</p>
             </div>
           )}
        </div>

        <button 
           onClick={generateMessage}
           disabled={isLoading}
           className="w-full golden-button py-3 flex justify-center items-center gap-2"
        >
           {isLoading ? 'Generando...' : message ? 'Regenerar Mensaje' : 'Generar Ahora'}
        </button>
      </div>
    </div>
  );
}
