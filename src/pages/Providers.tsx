import React, { useState } from 'react';
import AiPanel from '../components/AiPanel';
import { useAppStore } from '../store/StoreContext';
import { Provider } from '../types';
import { Store, Star, Plus, ShieldAlert, Edit2, Trash2, X, Factory, MessageSquare } from 'lucide-react';

export default function Providers() {
  const { state, setState } = useAppStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProvider, setEditingProvider] = useState<Provider | null>(null);

  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar este proveedor?')) {
      setState(prev => ({
        ...prev,
        providers: prev.providers.filter(p => p.id !== id)
      }));
    }
  };

  const openForm = (prov?: Provider) => {
    setEditingProvider(prov || null);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="mb-2 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-serif font-bold golden-text-gradient mb-1">Proveedores (Once y Libertad)</h1>
          <p className="text-brand-400 text-sm">Directorio de mayoristas, importadores y fabricantes.</p>
        </div>
        <button onClick={() => openForm()} className="golden-button px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 transform hover:scale-105 transition-all shadow-[0_0_20px_rgba(212,175,55,0.15)]">
          <Plus className="w-5 h-5" /> Nuevo Proveedor
        </button>
      </div>

      <AiPanel 
        title="Asistente: Negociador B2B"
        systemPrompt="Eres un comprador mayorista profesional de joyas. El usuario te dará el nombre de un proveedor o una situación, tú debes generar un script en español profesional (y directo) para negociar mejores precios, preguntar por compras mínimas, o resolver problemas con envíos."
        placeholder="Ej: Quiero un mensaje para preguntar a Joyas XYZ si hacen descuento en efectivo."
        description="Genera guiones de negociación profesional efectivos para tratar con mayoristas y conseguir mejores condiciones."
      />

      <div className="bg-gradient-to-r from-red-950/40 to-brand-950/40 border border-red-900/50 rounded-xl p-5 flex gap-4 text-red-200 text-sm shadow-inner relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
           <ShieldAlert className="w-24 h-24" />
        </div>
        <div className="p-3 bg-red-900/20 border border-red-800/50 rounded-lg h-fit shrink-0">
          <ShieldAlert className="w-6 h-6 text-red-400" />
        </div>
        <div className="relative z-10">
          <strong className="block mb-2 text-red-300 text-base">¡Alerta Anti-Estafas en Joyería!</strong>
          <ul className="list-none space-y-1.5 text-red-100/80">
             <li className="flex items-start gap-2"><span className="text-brand-500">•</span> Nunca transfieras a cuentas que no sean de empresa o locales verificados.</li>
             <li className="flex items-start gap-2"><span className="text-brand-500">•</span> Si el precio en Instagram es 50% menor que Once, desconfía al 100%.</li>
             <li className="flex items-start gap-2"><span className="text-brand-500">•</span> Pide catálogo oficial (Tiendanube o PDF) y busca la dirección en Street View.</li>
          </ul>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {state.providers.map(prov => (
          <div key={prov.id} className="premium-card rounded-2xl p-0 hover:border-gold/30 transition-all duration-300 group hover:-translate-y-1 hover:shadow-xl hover:shadow-gold/5 flex flex-col">
            <div className="p-5 border-b border-brand-800/50 bg-brand-950/30 flex justify-between items-start rounded-t-2xl">
              <div className="flex-1">
                <h3 className="font-bold text-lg text-brand-50 flex items-center gap-2">
                  <Factory className="w-5 h-5 text-gold" />
                  {prov.name}
                </h3>
                <span className="inline-block mt-1 px-2.5 py-0.5 bg-brand-900 border border-brand-800 rounded-md text-xs font-medium text-brand-300">
                  {prov.type}
                </span>
              </div>
              <div className="flex text-gold bg-gold/10 px-2 py-1 rounded-full items-center gap-1">
                 <span className="text-xs font-bold">{prov.rating}.0</span>
                 <Star className="w-3.5 h-3.5 fill-current" />
              </div>
            </div>
            
            <div className="p-5 space-y-3 text-sm flex-1">
              <div className="flex items-center justify-between p-2 rounded-lg bg-brand-900/30 border border-transparent group-hover:border-brand-800/50 transition-colors">
                <span className="text-brand-500 uppercase tracking-wider text-[10px] font-bold">Ubicación</span>
                <span className="font-medium text-brand-100">{prov.zone}</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-brand-900/30 border border-transparent group-hover:border-brand-800/50 transition-colors">
                <span className="text-brand-500 uppercase tracking-wider text-[10px] font-bold">Compra Mínima</span>
                <span className="font-bold text-emerald-400">${prov.minPurchase.toLocaleString()}</span>
              </div>
            </div>

            <div className="p-4 border-t border-brand-800/50 flex items-center justify-between bg-brand-950/50 rounded-b-2xl">
              <div className="flex gap-2">
                {prov.phone && (
                  <a 
                    href={`https://wa.me/${prov.phone.replace(/[^0-9]/g,'')}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1.5 text-brand-300 bg-brand-900 hover:bg-brand-800 border border-brand-700 px-3 py-1.5 rounded-lg transition-colors text-[11px] font-bold uppercase tracking-wide cursor-pointer"
                    title="Llamar/WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-emerald-500" />
                    WApp
                  </a>
                )}
                {prov.email && (
                  <a 
                    href={`mailto:${prov.email}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1.5 text-brand-300 bg-brand-900 hover:bg-brand-800 border border-brand-700 px-3 py-1.5 rounded-lg transition-colors text-[11px] font-bold uppercase tracking-wide cursor-pointer"
                    title="Enviar Email"
                  >
                    @ Email
                  </a>
                )}
                {!prov.phone && !prov.email && prov.contact && (
                  <a 
                    href={prov.contact.includes('@') ? `https://instagram.com/${prov.contact.replace('@','')}` : `https://wa.me/${prov.contact.replace(/[^0-9]/g,'')}`} 
                    target="_blank" 
                    rel="noreferrer" 
                    className="flex items-center gap-1.5 text-brand-300 bg-brand-900 hover:bg-brand-800 border border-brand-700 px-3 py-1.5 rounded-lg transition-colors text-[11px] font-bold uppercase tracking-wide cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5 text-sky-500" />
                    Ingresar
                  </a>
                )}
              </div>
              <div className="flex gap-1 transition-opacity">
                 <button onClick={() => openForm(prov)} className="p-2 text-brand-400 hover:text-sky-400 bg-brand-900 rounded-lg hover:bg-sky-500/10 border border-brand-800 hover:border-sky-500/30 transition-all cursor-pointer" title="Editar"><Edit2 className="w-4 h-4" /></button>
                 <button onClick={() => handleDelete(prov.id)} className="p-2 text-brand-400 hover:text-red-400 bg-brand-900 rounded-lg hover:bg-red-500/10 border border-brand-800 hover:border-red-500/30 transition-all cursor-pointer" title="Eliminar"><Trash2 className="w-4 h-4" /></button>
              </div>
            </div>
          </div>
        ))}
        
        {/* Add Provider Card */}
        <button onClick={() => openForm()} className="bg-brand-900/20 border-2 border-dashed border-brand-800 rounded-2xl p-5 flex flex-col items-center justify-center text-brand-500 hover:bg-brand-900/50 hover:border-gold/30 hover:text-gold transition-all min-h-[250px] group">
          <div className="p-4 rounded-full bg-brand-950 group-hover:bg-gold/10 mb-3 transition-colors border border-brand-800 group-hover:border-gold/20">
            <Plus className="w-8 h-8" />
          </div>
          <span className="font-bold text-lg">Agregar Proveedor</span>
          <span className="text-xs text-center mt-2 px-6 text-brand-400">Amplía tu red de abastecimiento y registra contactos.</span>
        </button>
      </div>

      {isModalOpen && (
        <ProviderModal 
          provider={editingProvider} 
          onClose={() => setIsModalOpen(false)} 
        />
      )}
    </div>
  );
}

function ProviderModal({ provider, onClose }: { provider: Provider | null, onClose: () => void }) {
  const { setState } = useAppStore();
  const [formData, setFormData] = useState<Partial<Provider>>(provider || {
    name: '', type: 'Fabricante', zone: 'Once CABA', contact: '', rating: 5, minPurchase: 0
  });

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setState(prev => {
      let providers;
      let newEvent = null;

      if (provider) {
         providers = prev.providers.map(p => p.id === provider.id ? { ...p, ...formData } as Provider : p);
      } else {
         const newProv = { ...formData, id: 'prov_' + Date.now() } as Provider;
         providers = [newProv, ...prev.providers];
         
         const tomorrow = new Date();
         tomorrow.setDate(tomorrow.getDate() + 1);
         const yyyy = tomorrow.getFullYear();
         const mm = String(tomorrow.getMonth() + 1).padStart(2, '0');
         const dd = String(tomorrow.getDate()).padStart(2, '0');
         
         newEvent = {
           id: 'evt_' + Date.now(),
           date: `${yyyy}-${mm}-${dd}`,
           title: `Hacer pedido o cotizar con ${newProv.name}`,
           type: 'buy'
         } as const;
      }
      
      return {
        ...prev,
        providers,
        events: newEvent ? [...(prev.events || []), newEvent] : (prev.events || [])
      }
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
       <div className="premium-card w-full max-w-md p-6 animate-in zoom-in-95">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-serif font-bold text-brand-100 flex items-center gap-2">
               <Store className="w-5 h-5 text-gold" />
               {provider ? 'Editar Proveedor' : 'Nuevo Proveedor'}
            </h2>
            <button onClick={onClose} className="p-2 text-brand-500 hover:text-brand-200"><X className="w-5 h-5" /></button>
          </div>
          <form onSubmit={submit} className="space-y-4">
             <div>
                <label className="block text-sm font-bold text-brand-400 mb-1">Nombre Comercial</label>
                <input required type="text" value={formData.name} onChange={e=>setFormData({...formData, name: e.target.value})} className="premium-input w-full" placeholder="Ej: Joyas Centro" />
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-brand-400 mb-1">Tipo</label>
                   <select required value={formData.type} onChange={e=>setFormData({...formData, type: e.target.value})} className="premium-input w-full">
                     <option value="Fabricante">Fabricante</option>
                     <option value="Importador Directo">Importador</option>
                     <option value="Mayorista / Revendedor">Mayorista</option>
                     <option value="Insumos">Insumos/Packaging</option>
                   </select>
                </div>
                <div>
                   <label className="block text-sm font-bold text-brand-400 mb-1">Ubicación</label>
                   <select required value={formData.zone} onChange={e=>setFormData({...formData, zone: e.target.value as any})} className="premium-input w-full">
                     <option value="Once CABA">Once CABA</option>
                     <option value="Libertad CABA">Libertad CABA</option>
                     <option value="Online">Online</option>
                     <option value="Otro">Otro</option>
                   </select>
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-brand-400 mb-1">Red Social / Web</label>
                   <input type="text" value={formData.contact} onChange={e=>setFormData({...formData, contact: e.target.value})} className="premium-input w-full" placeholder="Ej: @joyascentro" />
                </div>
                <div>
                   <label className="block text-sm font-bold text-brand-400 mb-1">Compra Mínima ($)</label>
                   <input required type="number" min="0" value={formData.minPurchase} onChange={e=>setFormData({...formData, minPurchase: Number(e.target.value)})} className="premium-input w-full" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <label className="block text-sm font-bold text-brand-400 mb-1">Teléfono (WhatsApp)</label>
                   <input type="tel" value={formData.phone || ''} onChange={e=>setFormData({...formData, phone: e.target.value})} className="premium-input w-full" placeholder="Ej: +54911..." />
                </div>
                <div>
                   <label className="block text-sm font-bold text-brand-400 mb-1">Email</label>
                   <input type="email" value={formData.email || ''} onChange={e=>setFormData({...formData, email: e.target.value})} className="premium-input w-full" placeholder="contacto@..." />
                </div>
             </div>
             <div>
                <label className="block text-sm font-bold text-brand-400 mb-1">Calificación (1-5)</label>
                <input required type="range" min="1" max="5" value={formData.rating} onChange={e=>setFormData({...formData, rating: Number(e.target.value)})} className="w-full accent-gold" />
                <div className="text-center text-gold mt-1">{"⭐".repeat(formData.rating || 5)}</div>
             </div>
             
             <div className="pt-4 flex gap-3">
                <button type="button" onClick={onClose} className="flex-1 px-4 py-3 bg-brand-900 border border-brand-800 rounded-xl text-brand-300 font-bold hover:bg-brand-800 transition-colors">Cancelar</button>
                <button type="submit" className="flex-1 golden-button py-3 rounded-xl font-bold">Guardar</button>
             </div>
          </form>
       </div>
    </div>
  )
}

