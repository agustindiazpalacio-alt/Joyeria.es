import React, { useState } from 'react';
import { Calendar as CalendarIcon, ChevronLeft, ChevronRight, Plus, Trash2, X } from 'lucide-react';
import AiPanel from '../components/AiPanel';
import { useAppStore } from '../store/StoreContext';
import { AppEvent } from '../types';

export default function CalendarView() {
  const { state, setState } = useAppStore();
  const [currentDate, setCurrentDate] = useState(new Date());
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDateStr, setSelectedDateStr] = useState<string>('');
  
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState<AppEvent['type']>('marketing');

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'];
  const dayNames = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];

  // Calculate sales per day to show in calendar automatically
  const salesCountPerDay = React.useMemo(() => {
    const counts: Record<string, { qty: number, revenue: number }> = {};
    state.sales.forEach(sale => {
      const dateOnly = sale.date.split('T')[0];
      if (!counts[dateOnly]) counts[dateOnly] = { qty: 0, revenue: 0 };
      counts[dateOnly].qty += sale.quantity;
      counts[dateOnly].revenue += sale.total;
    });
    return counts;
  }, [state.sales]);

  const handleDayClick = (dayNum: number) => {
    const yyyy = currentDate.getFullYear();
    const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
    const dd = String(dayNum).padStart(2, '0');
    setSelectedDateStr(`${yyyy}-${mm}-${dd}`);
    setIsModalOpen(true);
  };

  const handleSaveEvent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEventTitle.trim()) return;
    
    const newEvt: AppEvent = {
       id: 'evt_' + Date.now(),
       date: selectedDateStr,
       title: newEventTitle,
       type: newEventType
    };
    
    setState(prev => ({
       ...prev,
       events: [...(prev.events || []), newEvt]
    }));
    
    setIsModalOpen(false);
    setNewEventTitle('');
  };
  
  const handleDeleteEvent = (e: React.MouseEvent, id: string) => {
     e.stopPropagation();
     if(window.confirm('¿Borrar este evento?')) {
        setState(prev => ({
           ...prev,
           events: (prev.events || []).filter(evt => evt.id !== id)
        }));
     }
  };

  const events = state.events || [];

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-10">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-2">
        <div>
          <h1 className="text-3xl font-serif font-bold golden-text-gradient mb-1">Calendario de Eventos</h1>
          <p className="text-brand-400 text-sm">Planifica campañas, pagos y compras mayoristas.</p>
        </div>
      </div>

      <AiPanel 
        title="Asistente: Planificador Estratégico"
        systemPrompt="Eres un planificador de negocios para retail. Recomienda qué eventos o fechas especiales (día de la madre, navidad, cybermonday, etc) debería aprovechar una joyería en Argentina."
        placeholder="Ej: ¿Qué fechas clave hay en octubre para hacer promociones?"
        description="Obtén ideas sobre las fechas más rentables del año para hacer lanzamientos."
      />

      <div className="premium-card p-4 sm:p-6 shadow-xl">
         <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold font-serif flex items-center gap-2 text-brand-100">
               <CalendarIcon className="w-5 h-5 text-gold" />
               <span className="capitalize">{monthNames[currentDate.getMonth()]}</span> {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
               <button onClick={prevMonth} className="p-2 border border-brand-800 rounded-lg hover:bg-brand-900 transition-colors text-brand-400 hover:text-gold cursor-pointer">
                  <ChevronLeft className="w-5 h-5" />
               </button>
               <button onClick={nextMonth} className="p-2 border border-brand-800 rounded-lg hover:bg-brand-900 transition-colors text-brand-400 hover:text-gold cursor-pointer">
                  <ChevronRight className="w-5 h-5" />
               </button>
            </div>
         </div>

         <div className="grid grid-cols-7 gap-px bg-brand-800 rounded-xl overflow-hidden border border-brand-800 shadow-inner">
            {dayNames.map(day => (
              <div key={day} className="bg-brand-950 py-3 text-center text-[10px] sm:text-xs font-bold text-brand-500 uppercase tracking-widest">
                {day}
              </div>
            ))}
            
            {Array.from({ length: firstDayOfMonth }).map((_, i) => (
              <div key={`empty-${i}`} className="bg-brand-900/30 min-h-[100px] sm:min-h-[120px] p-2" />
            ))}
            
            {Array.from({ length: daysInMonth }).map((_, i) => {
              const dayNum = i + 1;
              const yyyy = currentDate.getFullYear();
              const mm = String(currentDate.getMonth() + 1).padStart(2, '0');
              const dd = String(dayNum).padStart(2, '0');
              const dateStr = `${yyyy}-${mm}-${dd}`;
              
              const isToday = dayNum === new Date().getDate() && currentDate.getMonth() === new Date().getMonth() && currentDate.getFullYear() === new Date().getFullYear();
              const dayEvents = events.filter(e => e.date === dateStr);
              const daySales = salesCountPerDay[dateStr];
              
              return (
                <div 
                   key={dayNum} 
                   onClick={() => handleDayClick(dayNum)}
                   className={`bg-brand-950 min-h-[100px] sm:min-h-[120px] p-1.5 sm:p-2 hover:bg-brand-900 transition-colors relative group cursor-pointer`}
                >
                   <span className={`text-sm font-bold flex items-center justify-center w-7 h-7 rounded-full mb-1 ${isToday ? 'bg-gold text-brand-950 shadow-md' : 'text-brand-300 group-hover:text-gold'}`}>
                     {dayNum}
                   </span>
                   <div className="space-y-1 sm:space-y-1.5 custom-scrollbar overflow-y-auto max-h-[80px]">
                     {daySales && daySales.qty > 0 && (
                       <div className="text-[10px] sm:text-[11px] p-1.5 rounded font-bold uppercase tracking-wide truncate border bg-brand-500/10 text-brand-400 border-brand-500/30 flex justify-between items-center tooltip-trigger" title={`Ingresos: $${daySales.revenue.toLocaleString('es-AR')}`}>
                          <span>🛍️ {daySales.qty} Ventas</span>
                       </div>
                     )}
                     
                     {dayEvents.map((evt) => (
                        <div key={evt.id} className={`text-[10px] sm:text-[11px] p-1.5 rounded font-bold uppercase tracking-wide truncate border flex justify-between items-center group/evt ${evt.type === 'buy' ? 'bg-sky-500/10 text-sky-400 border-sky-500/30' : evt.type === 'marketing' ? 'bg-fuchsia-500/10 text-fuchsia-400 border-fuchsia-500/30' : evt.type === 'finance' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' : 'bg-brand-800/50 text-brand-300 border-brand-700'}`}>
                           <span className="truncate">{evt.title}</span>
                           <button onClick={(e) => handleDeleteEvent(e, evt.id)} className="opacity-0 group-hover/evt:opacity-100 hover:text-red-400 transition-opacity ml-1 shrink-0 p-0.5"><Trash2 className="w-3 h-3" /></button>
                        </div>
                     ))}
                   </div>
                   <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-brand-600">
                      <Plus className="w-4 h-4" />
                   </div>
                </div>
              );
            })}
         </div>
      </div>
      
      {isModalOpen && (
         <div className="fixed inset-0 bg-brand-950/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="premium-card w-full max-w-md p-6 shadow-2xl bg-brand-900">
               <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-serif font-bold text-brand-100 flex items-center gap-2">
                     <CalendarIcon className="w-5 h-5 text-gold" />
                     Añadir Evento
                  </h3>
                  <button onClick={() => setIsModalOpen(false)} className="p-2 text-brand-400 hover:text-brand-100 bg-brand-950 rounded-full border border-brand-800 cursor-pointer"><X className="w-4 h-4" /></button>
               </div>
               
               <form onSubmit={handleSaveEvent} className="space-y-4">
                  <div>
                     <label className="block text-[11px] font-bold uppercase tracking-widest text-brand-500 mb-1.5">Fecha</label>
                     <input type="text" readOnly value={selectedDateStr} className="w-full bg-brand-950 border border-brand-800 rounded-xl px-4 py-3 text-sm text-brand-400 font-mono" />
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold uppercase tracking-widest text-brand-500 mb-1.5">Título del Evento</label>
                     <input autoFocus required type="text" value={newEventTitle} onChange={e=>setNewEventTitle(e.target.value)} className="w-full bg-brand-950 border border-brand-800 rounded-xl px-4 py-3 text-sm text-brand-100 focus:outline-none focus:border-gold transition-colors" placeholder="Ej: Pago a proveedores" />
                  </div>
                  <div>
                     <label className="block text-[11px] font-bold uppercase tracking-widest text-brand-500 mb-1.5">Tipo</label>
                     <select value={newEventType} onChange={e=>setNewEventType(e.target.value as any)} className="w-full bg-brand-950 border border-brand-800 rounded-xl px-4 py-3 text-sm text-brand-100 focus:outline-none focus:border-gold transition-colors appearance-none">
                        <option value="marketing">Campaña / Marketing</option>
                        <option value="buy">Compra / Reposición</option>
                        <option value="finance">Pago / Finanzas</option>
                        <option value="other">Otro</option>
                     </select>
                  </div>
                  <div className="pt-4">
                     <button type="submit" className="w-full golden-button py-3 rounded-xl font-bold uppercase tracking-widest text-xs cursor-pointer flex items-center justify-center gap-2">
                        <Plus className="w-4 h-4" /> Guardar Evento
                     </button>
                  </div>
               </form>
            </div>
         </div>
      )}
    </div>
  );
}
