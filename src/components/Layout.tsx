import React, { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { 
  LayoutDashboard, Map, Package, Box, ShoppingCart, 
  Calculator, Truck, Megaphone, MessageSquare, 
  Scale, Globe, CheckSquare, Sparkles, Menu, X, Download, RotateCcw, LogOut
} from 'lucide-react';
import { useAppStore } from '../store/StoreContext';
import GlobalAiAssistant from './GlobalAiAssistant';
import { logout } from '../firebase';

const NAV_ITEMS = [
  { path: '/', label: 'Dashboard', icon: LayoutDashboard, color: 'text-white' },
  { path: '/roadmap', label: 'Guía de Inicio', icon: Map, color: 'text-amber-700' },
  { path: '/products', label: 'Catálogo', icon: Package, color: 'text-sky-400' },
  { path: '/stock', label: 'Stock', icon: Box, color: 'text-indigo-400' },
  { path: '/sales', label: 'Ventas', icon: ShoppingCart, color: 'text-purple-400' },
  { path: '/finances', label: 'Finanzas', icon: Calculator, color: 'text-emerald-700' },
  { path: '/providers', label: 'Proveedores', icon: Truck, color: 'text-orange-400' },
  { path: '/calendar', label: 'Calendario', icon: CheckSquare, color: 'text-red-400' },
  { path: '/marketing', label: 'Marketing', icon: Megaphone, color: 'text-pink-400' },
  { path: '/support', label: 'Atención al Cliente', icon: MessageSquare, color: 'text-teal-400' },
  { path: '/legal', label: 'Legal e Impuestos', icon: Scale, color: 'text-red-700' },
  { path: '/importation', label: 'Importación', icon: Globe, color: 'text-blue-400' },
  { path: '/checklists', label: 'Checklists', icon: CheckSquare, color: 'text-green-400' },
  { path: '/ai-assistants', label: 'Asistentes IA', icon: Sparkles, color: 'text-fuchsia-400' },
];

export default function Layout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { resetData, exportData, state, user } = useAppStore();

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeMobileMenu = () => setIsMobileMenuOpen(false);

  // Calculate generic progress based on completed tasks
  const completedTasks = state.tasks.filter(t => t.completed).length;
  const totalTasks = state.tasks.length;
  const progressPercent = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const SidebarContent = () => (
    <div className="flex flex-col h-full overflow-y-auto w-64 bg-[var(--color-brand-950)] border-r border-[var(--color-brand-800)] text-[var(--color-brand-100)] p-4 shadow-2xl relative z-10">
      <div className="flex items-center gap-3 mb-8 px-2 mt-4">
        <span className="text-3xl drop-shadow-lg">💎</span>
        <div>
           <h1 className="text-2xl font-serif font-bold tracking-wider golden-text-gradient">JoyaOS</h1>
           <span className="text-[10px] tracking-widest uppercase text-[#D4AF37]/80 font-semibold bg-[#D4AF37]/10 px-2 py-0.5 rounded-full border border-[#D4AF37]/30 inline-block mt-1">Pro Edition</span>
        </div>
      </div>

      <div className="mb-6 px-2">
        <div className="flex justify-between text-[10px] font-bold text-[var(--color-brand-400)] uppercase tracking-widest mb-2">
          <span>Progreso del Negocio</span>
          <span className="text-[var(--color-gold)]">{progressPercent}%</span>
        </div>
        <div className="w-full bg-[var(--color-brand-900)] rounded-full h-1.5 border border-[var(--color-brand-800)]">
          <div 
            className="bg-gradient-to-r from-[#AA8C2C] to-[#D4AF37] h-full rounded-full transition-all duration-1000 shadow-[0_0_10px_rgba(212,175,55,0.4)]"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      <nav className="flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={closeMobileMenu}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all text-sm group ${
                  isActive 
                    ? 'bg-gradient-to-r from-[var(--color-gold)]/10 to-transparent text-[var(--color-gold)] font-medium border-l-2 border-[var(--color-gold)] shadow-[inset_2px_0_10px_rgba(212,175,55,0.05)]' 
                    : 'text-[var(--color-brand-300)] hover:bg-[var(--color-brand-900)] hover:text-[var(--color-brand-100)] border-l-2 border-transparent'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={`w-5 h-5 transition-transform group-hover:scale-110 ${isActive ? 'text-[var(--color-gold)]' : 'text-[var(--color-brand-400)] group-hover:text-[var(--color-brand-100)]'}`} />
                  {item.label}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="mt-8 border-t border-[var(--color-brand-800)] pt-4 space-y-2">
        {user && (
           <div className="px-3 py-2 text-xs text-[var(--color-brand-400)] truncate mb-2">
             <span className="opacity-60">Sesión iniciada como:</span><br/>
             <span className="font-bold text-brand-300">{user.email}</span>
           </div>
        )}
        <button onClick={logout} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--color-brand-400)] hover:text-[var(--color-brand-100)] hover:bg-[var(--color-brand-900)] rounded-lg transition-colors">
          <LogOut className="w-4 h-4" /> Cerrar Sesión
        </button>
        <button onClick={exportData} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-[var(--color-brand-400)] hover:text-[var(--color-brand-100)] hover:bg-[var(--color-brand-900)] rounded-lg transition-colors">
          <Download className="w-4 h-4" /> Exportar Backup (JSON)
        </button>
        <button onClick={resetData} className="flex w-full items-center gap-2 px-3 py-2 text-sm text-red-700/80 hover:text-red-400 hover:bg-red-950/20 rounded-lg transition-colors">
          <RotateCcw className="w-4 h-4" /> Resetear Datos Locales
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[var(--color-brand-950)] flex font-sans">
      {/* Desktop Sidebar */}
      <div className={`hidden md:flex flex-shrink-0 transition-all duration-300 ease-in-out ${isSidebarOpen ? 'w-64' : 'w-0 overflow-hidden'} h-screen sticky top-0`}>
        <SidebarContent />
      </div>

      {/* Mobile Sidebar overlay */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-40 bg-black/60 backdrop-blur-sm" onClick={closeMobileMenu} />
      )}

      {/* Mobile Sidebar */}
      <div className={`md:hidden fixed inset-y-0 left-0 z-50 transform transition-transform duration-300 ease-in-out ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-h-screen relative overflow-x-hidden">
        {/* Background Atmos */}
        <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-[var(--color-gold)]/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        <div className="fixed bottom-0 left-1/4 w-[600px] h-[600px] bg-[#AA8C2C]/5 rounded-full blur-[150px] pointer-events-none -z-10" />

        {/* Header content */}
        <header className="sticky top-0 bg-[var(--color-brand-950)]/80 backdrop-blur-md border-b border-[var(--color-brand-800)] px-4 py-3 flex items-center justify-between shadow-sm z-30 shrink-0">
          <div className="flex items-center gap-4">
            <button 
               onClick={toggleSidebar} 
               className="hidden md:flex p-2 text-[var(--color-brand-400)] hover:text-[var(--color-gold)] hover:bg-[var(--color-brand-900)] rounded-lg transition-colors"
               title="Alternar Barra Lateral"
            >
              <Menu className="w-5 h-5" />
            </button>
            <button 
               onClick={() => setIsMobileMenuOpen(true)} 
               className="md:hidden p-2 text-[var(--color-brand-400)] hover:text-[var(--color-gold)] hover:bg-[var(--color-brand-900)] rounded-lg transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            <span className="text-lg font-serif font-bold md:hidden text-[var(--color-brand-100)]">JoyaOS</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-[var(--color-brand-400)] font-medium hidden sm:inline-block tracking-widest uppercase">Modo Administrativo</span>
          </div>
        </header>

        {/* Page Content area */}
        <main className="flex-1 p-4 md:p-6 relative pb-10 sm:pb-6">
            <div className="max-w-7xl mx-auto min-h-full animate-in fade-in duration-500 relative z-10">
               <Outlet />
            </div>
        </main>
        
        {/* Global AI Assistant Float */}
        <GlobalAiAssistant />
      </div>
    </div>
  );
}
