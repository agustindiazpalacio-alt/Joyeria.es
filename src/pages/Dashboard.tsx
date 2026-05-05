import React, { useMemo } from 'react';
import { useAppStore } from '../store/StoreContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line, CartesianGrid } from 'recharts';
import { DollarSign, Package, AlertTriangle, TrendingUp, CheckSquare } from 'lucide-react';
import AiPanel from '../components/AiPanel';

const COLORS = ['#f59e0b', '#3b82f6', '#10b981', '#6366f1', '#ec4899'];

export default function Dashboard() {
  const { state } = useAppStore();

  const totalSales = useMemo(() => state.sales.reduce((acc, sale) => acc + sale.total, 0), [state.sales]);
  const totalStock = useMemo(() => state.products.reduce((acc, p) => acc + p.stock, 0), [state.products]);
  
  // Calculate profits roughly assuming each sale's gain is (sale_total - cost * quantity)
  const totalProfit = useMemo(() => {
    return state.sales.reduce((acc, sale) => {
      const product = state.products.find(p => p.id === sale.productId);
      if (product) {
        return acc + (sale.total - (product.cost * sale.quantity));
      }
      return acc;
    }, 0);
  }, [state.sales, state.products]);

  const lowStockAlerts = useMemo(() => state.products.filter(p => p.stock < 3), [state.products]);
  const pendingTasksDay = useMemo(() => state.tasks.filter(t => !t.completed && (t.category === 'Rutina Mañana' || t.category === 'Rutina Tarde')), [state.tasks]);

  const recentSales = useMemo(() => {
    return [...state.sales].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).slice(0, 5);
  }, [state.sales]);

  // Chart Data preparation
  const categoryData = useMemo(() => {
    const acc: Record<string, number> = {};
    state.products.forEach(p => {
      acc[p.category] = (acc[p.category] || 0) + p.stock;
    });
    return Object.keys(acc).map(key => ({ name: key, value: acc[key] }));
  }, [state.products]);

  const last7DaysSales = useMemo(() => {
    const data = [];
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dateStr = d.toISOString().split('T')[0];
      const sum = state.sales.filter(s => s.date.startsWith(dateStr)).reduce((add, s) => add + s.total, 0);
      data.push({ name: `${d.getDate()}/${d.getMonth()+1}`, Total: sum });
    }
    return data;
  }, [state.sales]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-3xl font-serif font-bold golden-text-gradient">Dashboard</h1>
      </div>

      <AiPanel 
        title="Asistente: Analista de Negocio"
        systemPrompt="Eres un Analista de Negocios experto en retail y e-commerce de joyas en Argentina. Analiza los datos de ventas, stock y ganancias actuales y provee un diagnóstico semanal de 2 a 3 consideraciones estratégicas accionables. Sé preciso y enfocado a aumentar la rentabilidad. Evita generalidades, habla con datos."
        contextData={{ ventasTotales: totalSales, stockTotal: totalStock, gananciaNeta: totalProfit, alertasStockBajo: lowStockAlerts.length, ventasUltimos7Dias: last7DaysSales }}
        placeholder="Ej: ¿Qué productos debería promocionar esta semana?"
        description="Evalúa tus métricas de ventas y stock para identificar mejoras estratégicas. Te ayuda a enfocar tus esfuerzos para maximizar la rentabilidad semanal."
      />

      {/* Info Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="premium-card p-4 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--color-brand-400)] uppercase tracking-widest">Ventas Totales</p>
              <h3 className="text-2xl font-bold mt-1 text-[var(--color-brand-100)]">${totalSales.toLocaleString('es-AR')}</h3>
            </div>
            <div className="p-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20"><DollarSign className="w-5 h-5 text-emerald-700" /></div>
          </div>
        </div>
        
        <div className="premium-card p-4 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--color-brand-400)] uppercase tracking-widest">Stock Total</p>
              <h3 className="text-2xl font-bold mt-1 text-[var(--color-brand-100)]">{totalStock} unid.</h3>
            </div>
            <div className="p-2 bg-blue-500/10 rounded-xl border border-blue-500/20"><Package className="w-5 h-5 text-blue-400" /></div>
          </div>
        </div>

        <div className="premium-card p-4 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--color-brand-400)] uppercase tracking-widest">Ganancia Neta Est.</p>
              <h3 className="text-2xl font-bold mt-1 text-[var(--color-brand-100)]">${totalProfit.toLocaleString('es-AR')}</h3>
            </div>
            <div className="p-2 bg-purple-500/10 rounded-xl border border-purple-500/20"><TrendingUp className="w-5 h-5 text-purple-400" /></div>
          </div>
        </div>

        <div className="premium-card p-4 rounded-2xl">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-sm font-medium text-[var(--color-brand-400)] uppercase tracking-widest">Stock Bajo</p>
              <h3 className="text-2xl font-bold mt-1 text-[var(--color-brand-100)]">{lowStockAlerts.length} prod.</h3>
            </div>
            <div className="p-2 bg-red-500/10 rounded-xl border border-red-500/20"><AlertTriangle className="w-5 h-5 text-red-700" /></div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Charts */}
        <div className="lg:col-span-2 premium-card p-4 rounded-2xl">
          <h3 className="text-lg font-serif font-medium text-[var(--color-brand-100)] mb-4">Ventas Últimos 7 Días</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={last7DaysSales}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-brand-800)" />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: 'var(--color-brand-400)', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: 'var(--color-brand-400)', fontSize: 12}} width={60} />
                <RechartsTooltip cursor={{fill: 'var(--color-brand-800)'}} contentStyle={{backgroundColor: 'var(--color-brand-950)', border: '1px solid var(--color-brand-800)', borderRadius: '12px', color: '#fff'}} />
                <Bar dataKey="Total" fill="url(#goldGradient)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
          <svg width="0" height="0">
            <defs>
              <linearGradient id="goldGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-gold)" />
                <stop offset="100%" stopColor="var(--color-gold-hover)" />
              </linearGradient>
            </defs>
          </svg>
        </div>

        <div className="premium-card p-4 rounded-2xl">
          <h3 className="text-lg font-serif font-medium text-[var(--color-brand-100)] mb-4">Distribución Stock</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={categoryData} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <RechartsTooltip contentStyle={{backgroundColor: 'var(--color-brand-950)', border: '1px solid var(--color-brand-800)', borderRadius: '12px', color: '#fff'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-2 text-xs text-[var(--color-brand-400)] text-center">
            {categoryData.map((c, i) => (
               <span key={c.name} className="inline-block mx-2"><span className="inline-block w-2 h-2 rounded-full mr-1" style={{backgroundColor: COLORS[i % COLORS.length]}}></span>{c.name}</span>
            ))}
          </div>
        </div>

        {/* Lists */}
        <div className="lg:col-span-2 premium-card p-4 rounded-2xl overflow-hidden">
          <h3 className="text-lg font-serif font-medium text-[var(--color-brand-100)] mb-4">Últimas 5 Ventas</h3>
          <div className="overflow-x-auto">
            {recentSales.length > 0 ? (
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-[var(--color-brand-400)] uppercase tracking-widest bg-[var(--color-brand-900)] border-b border-[var(--color-brand-800)]">
                  <tr>
                    <th className="px-4 py-3">Cliente</th>
                    <th className="px-4 py-3">Producto</th>
                    <th className="px-4 py-3">Cant.</th>
                    <th className="px-4 py-3">Total</th>
                    <th className="px-4 py-3">Fecha</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[var(--color-brand-800)]/50">
                  {recentSales.map((sale) => {
                    const prod = state.products.find(p => p.id === sale.productId);
                    return (
                      <tr key={sale.id} className="hover:bg-[var(--color-brand-800)]/30 transition-colors">
                        <td className="px-4 py-3 font-medium text-[var(--color-brand-300)]">{sale.client || 'Consumidor Final'}</td>
                        <td className="px-4 py-3 text-[var(--color-brand-400)]">{prod?.name || 'Producto Eliminado'}</td>
                        <td className="px-4 py-3 text-[var(--color-brand-400)]">{sale.quantity}</td>
                        <td className="px-4 py-3 font-medium text-emerald-700">${sale.total.toLocaleString('es-AR')}</td>
                        <td className="px-4 py-3 text-[var(--color-brand-400)]">{new Date(sale.date).toLocaleDateString()}</td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            ) : (
              <div className="py-8 text-center border border-dashed border-[var(--color-brand-800)] rounded-xl bg-[var(--color-brand-950)]/50">
                <DollarSign className="w-8 h-8 text-[var(--color-brand-600)] mx-auto mb-2 opacity-50" />
                <p className="text-[var(--color-brand-400)] font-medium">No hay ventas registradas.</p>
                <p className="text-xs text-[var(--color-brand-500)] mt-1">Cuando realices ventas aparecerán aquí.</p>
              </div>
            )}
          </div>
        </div>

        <div className="premium-card p-4 rounded-2xl">
          <h3 className="text-lg font-serif font-medium text-[var(--color-brand-100)] mb-4">Tareas del Día</h3>
          <ul className="space-y-3">
            {pendingTasksDay.length > 0 ? pendingTasksDay.map(t => (
              <li key={t.id} className="flex gap-3 items-start p-2 rounded-xl hover:bg-[var(--color-brand-800)]/30 transition-colors">
                <CheckSquare className="w-5 h-5 text-[var(--color-gold)] shrink-0 mt-0.5" />
                <span className="text-sm text-[var(--color-brand-300)] leading-tight">{t.title} <span className="text-[10px] tracking-wider uppercase px-2 py-0.5 bg-[var(--color-brand-950)] border border-[var(--color-brand-800)] text-[var(--color-brand-400)] rounded-full block mt-1.5 w-max">{t.category}</span></span>
              </li>
            )) : (
              <li className="text-sm text-[var(--color-brand-400)] text-center py-4">No hay tareas pendientes para hoy. ¡Excelente!</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
