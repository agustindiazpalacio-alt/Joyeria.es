import React from 'react';
import { BrowserRouter, Routes, Route, Outlet } from 'react-router-dom';
import { StoreProvider, useAppStore } from './store/StoreContext';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import Finances from './pages/Finances';
import Roadmap from './pages/Roadmap';
import Stock from './pages/Stock';
import Sales from './pages/Sales';
import Providers from './pages/Providers';
import Checklists from './pages/Checklists';
import CalendarView from './pages/CalendarView';
import AiAssistants from './pages/AiAssistants';
import { Marketing, Support, Legal, Importation } from './pages/MarketingAndLegal';
import { loginWithGoogle } from './firebase';

function MainApp() {
  const { user, loading } = useAppStore();

  if (loading) {
    return <div className="h-screen w-full flex items-center justify-center bg-brand-950 text-gold text-xl font-serif">Cargando JoyaOS...</div>;
  }

  if (!user) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-brand-950">
        <h1 className="text-4xl font-serif font-bold golden-text-gradient mb-6">JoyaOS</h1>
        <p className="text-brand-300 mb-8 max-w-sm text-center">Inicia sesión con Google para usar esta app como tu base de datos y mantener tu información segura.</p>
        <button 
          onClick={loginWithGoogle}
          className="bg-gold text-brand-950 font-bold px-8 py-3 rounded-xl hover:bg-yellow-400 transition-all font-serif"
        >
          Iniciar sesión con Google
        </button>
      </div>
    );
  }

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="roadmap" element={<Roadmap />} />
            <Route path="products" element={<Products />} />
            <Route path="stock" element={<Stock />} />
            <Route path="sales" element={<Sales />} />
            <Route path="finances" element={<Finances />} />
            <Route path="providers" element={<Providers />} />
            <Route path="checklists" element={<Checklists />} />
            <Route path="calendar" element={<CalendarView />} />
            <Route path="ai-assistants" element={<AiAssistants />} />
            <Route path="marketing" element={<Marketing />} />
            <Route path="support" element={<Support />} />
            <Route path="legal" element={<Legal />} />
            <Route path="importation" element={<Importation />} />
          </Route>
        </Routes>
      </BrowserRouter>
  );
}

export default function App() {
  return (
    <StoreProvider>
      <MainApp />
    </StoreProvider>
  );
}





