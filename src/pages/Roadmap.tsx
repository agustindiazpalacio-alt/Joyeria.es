import React from 'react';
import { useAppStore } from '../store/StoreContext';
import { CheckCircle2, Circle, Rocket } from 'lucide-react';
import AiPanel from '../components/AiPanel';

const PHASES = [
  {
    title: 'Fase 1: Identidad y Formalidad 🏢',
    steps: [
      { id: 'rs1', title: '1. Nombre y Registro INPI (Clase 14)', desc: 'Fundamental. Antes de gastar en packaging, verifica disponibilidad fonética en el portal TAD y paga el VEP (aprox $40.000 ARS). La Clase 14 incluye joyería y metales preciosos. Demora unos 18-24 meses en otorgarse, pero el pago ya te prioriza.' },
      { id: 'rs2', title: '2. Alta AFIP: Monotributo Cat. A', desc: 'Saca Clave Fiscal nivel 3 (desde la App Mi AFIP). Date de alta. El pago mensual (aprox $42.000) unifica componente impositivo, jubilación y obra social. Es el costo mínimo para operar 100% legal.' },
      { id: 'rs3', title: '3. Habilitar Facturación', desc: 'En la web de AFIP: da de alta un punto de venta y asócialo a "Comprobantes en línea". Emite siempre Factura C. Recuerda facturar tus ventas para justificar tus ingresos de caja.' }
    ]
  },
  {
    title: 'Fase 2: Infraestructura E-commerce 💻',
    steps: [
      { id: 'rs4', title: '4. Dominio NIC.ar', desc: 'Registra tuMarca.com.ar (cuesta menos de $1.000 anual). Vincula tu dominio a tu tienda. Da muchísima más confianza que un link genérico o vender solo por Instagram.' },
      { id: 'rs5', title: '5. Plataforma: Tiendanube o Shopify', desc: 'Inicia con Tiendanube (tarifas en pesos). Carga al menos 15 productos iniciales. Crea políticas claras de cambios y devoluciones.' },
      { id: 'rs6', title: '6. Pagos, Envíos e IIBB', desc: 'Integra MercadoPago. Configura Envíopack o Correo Argentino. ATENCIÓN: Si envías fuera de tu provincia, debes darte de alta en Convenio Multilateral de IIBB para que no te retengan SIRCREB.' }
    ]
  },
  {
    title: 'Fase 3: Sourcing y Primer Stock 📦',
    steps: [
      { id: 'rs7', title: '7. Proveedores Nacionales (Once)', desc: 'Viaja a CABA o compra online en mayoristas. Tu primera compra debería rondar los $200.000 ARS. Regla de oro: 70% básicos rotativos (argollas, rosarios) y 30% piezas ancla llamativas.' },
      { id: 'rs8', title: '8. Packaging Inolvidable (Unboxing)', desc: 'Busca un proveedor de estuches y bolsas en Once o MercadoLibre. Suma stickers, tarjetas de cuidado del acero y un perfume característico a la caja. El unboxing justifica pagar más caro el producto.' },
      { id: 'rs9', title: '9. Fijación de Precios', desc: 'Usa multiplicador x3 o x4 del costo. Si un anillo de acero te cuesta $4.000, no lo vendas por menos de $12.000. Ese margen absorberá el 60% de impuestos de Facebook Ads y los envíos gratis.' }
    ]
  },
  {
    title: 'Fase 4: Tráfico y Lanzamiento 💸',
    steps: [
      { id: 'rs10', title: '10. Meta Ads Básico (Sin Impuestos)', desc: 'Crea el Facebook Business manager en PESOS. Para evitar el 60% (PAIS/RG) de recargo en la tarjeta, recarga tu cuenta publicitaria prepago usando código de barras (Pago Fácil) o MercadoPago. INVALUABLE.' },
      { id: 'rs11', title: '11. Contenido Orgánico Vital', desc: 'Muestra a cámara cómo armas los pedidos ("Pack with me"). Haz la prueba de mojar tus piezas para demostrar que el acero quirúrgico no se oxida.' },
      { id: 'rs12', title: '12. Prender Campañas de Conversión', desc: 'Invierte de $4.000 a $6.000 diarios inicialmente en una campaña "Conversiones (Ventas)". Oferta de lanzamiento: "Envío Gratis Superando $40.000 + 3 Cuotas Sin Interés".' }
    ]
  },
  {
    title: 'Fase 5: Escalar (Importación Directa) 🚢',
    steps: [
      { id: 'rs13', title: '13. Tu Primer Régimen Courier', desc: 'Cuando te quedes corto en Once, trae por DHL/FedEx directo de Alibaba. Límite: $3000 USD y 50KG. Cuidado con la "regla de 3 unidades": aduana te frena si traes 50 unidades idénticas bajo tu CUIT personal si sospechan fin comercial grosero para nivel Courier.' },
      { id: 'rs14', title: '14. Registro de Importador/Exportador', desc: 'Para escalar en serio, date de alta en la Aduana y AFIP como importador formal. Necesitas un Despachante de Aduana.' },
      { id: 'rs15', title: '15. Régimen General (LCL/FCL)', desc: 'Trae consolidado (LCL). Posición arancelaria 7117.19.00 (Bijouterie). Pagarás arancel (20%), Tasa estadística (3%), IVA (21%), IVA Adicional (20%) e IIBB. Pese a esto, tu costo final FOB+Impuestos será un 40% menor al de Once.' }
    ]
  }
];

export default function Roadmap() {
  const { state, setState } = useAppStore();

  const toggleStep = (id: string, title: string) => {
    setState(prev => {
      let newTasks = [...prev.tasks];
      const existing = newTasks.find(t => t.title === title);
      
      if (existing) {
        newTasks = newTasks.map(t => t.title === title ? { ...t, completed: !t.completed } : t);
      } else {
        newTasks.push({
          id: id,
          title: title,
          completed: true,
          category: 'Setup Inicial'
        });
      }
      return { ...prev, tasks: newTasks };
    });
  };

  const isCompleted = (title: string) => {
    return state.tasks.find(t => t.title === title)?.completed || false;
  };

  const totalSteps = PHASES.reduce((acc, p) => acc + p.steps.length, 0);
  const completedSteps = PHASES.reduce((acc, p) => acc + p.steps.filter(s => isCompleted(s.title)).length, 0);
  const progressPercent = Math.round((completedSteps / totalSteps) * 100);

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-12">
      <div className="mb-8">
        <h1 className="text-3xl font-serif font-bold golden-text-gradient mb-2 flex items-center gap-3">
           <Rocket className="w-8 h-8 text-gold drop-shadow-md" /> 
           Roadmap Estratégico 2026
        </h1>
        <p className="text-brand-400">Guía definitiva de cero a importador para profesionalizar y lanzar tu imperio joyero.</p>
      </div>

      <div className="bg-brand-900 border border-brand-800/80 p-5 rounded-2xl shadow-md">
         <div className="flex justify-between items-end mb-2">
            <span className="text-sm font-bold text-brand-300 uppercase tracking-wider">Tu Progreso de Lanzamiento</span>
            <span className="text-xl font-mono font-bold text-gold">{progressPercent}%</span>
         </div>
         <div className="w-full h-3 bg-brand-950 rounded-full overflow-hidden border border-brand-800/50">
            <div 
              className="h-full bg-gradient-to-r from-amber-500 to-gold rounded-full transition-all duration-1000 ease-out"
              style={{ width: `${progressPercent}%` }}
            />
         </div>
      </div>

      <AiPanel 
        title="Asistente de Incubación de Negocio"
        systemPrompt="Eres un Asesor Especializado en incubar marcas de joyas en Argentina 2026. Te enviarán dudas sobre el roadmap: INPI, AFIP, envíos o Meta Ads. Responde preciso, dando el paso exacto que deben dar y qué evitar para no perder dinero o tiempo."
        contextData={{ pasosCompletados: state.tasks.filter(t => t.completed).map(t => t.title) }}
        placeholder="Ej: Ya di de alta el Monotributo pero me asusta lo de Convenio Multilateral de IIBB. ¿Puedo evitarlo si vendo por IG?"
        description="Si te trabas en algún punto legal o estratégico, consúltale a nuestra IA para que te guíe en el acto."
      />

      <div className="space-y-12">
         {PHASES.map((phase, pIdx) => (
            <div key={pIdx} className="premium-card p-6 md:p-8 relative overflow-hidden group">
               <div className="absolute top-0 left-0 w-1.5 h-full bg-brand-800/50 group-hover:bg-gold/30 transition-colors" />
               <h2 className="text-2xl font-bold text-brand-100 mb-6 pl-2 tracking-tight">{phase.title}</h2>
               
               <div className="space-y-6">
                 {phase.steps.map((step) => {
                   const completed = isCompleted(step.title);
                   return (
                     <div key={step.id} className="relative pl-10 md:pl-14">
                       <button 
                         onClick={() => toggleStep(step.id, step.title)}
                         className="absolute left-0 lg:-left-2 top-0.5 bg-brand-900 p-1 rounded-full border border-brand-800 hover:border-gold transition-colors z-10 hover:shadow-[0_0_15px_rgba(212,175,55,0.4)]"
                       >
                         {completed ? 
                           <CheckCircle2 className="w-6 h-6 md:w-8 md:h-8 text-gold drop-shadow-md transition-all scale-110" /> : 
                           <Circle className="w-6 h-6 md:w-8 md:h-8 text-brand-600 hover:text-brand-400 transition-colors" />
                         }
                       </button>
                       <div 
                           className={`p-5 md:p-6 rounded-2xl border transition-all duration-300 ${
                              completed 
                              ? 'bg-brand-950/40 border-brand-900/50 opacity-60' 
                              : 'bg-brand-900/60 border-brand-800/80 hover:border-gold/50 hover:bg-brand-900/80 shadow-md'
                           }`}
                       >
                         <h3 className={`font-serif font-bold text-lg mb-2 transition-colors ${completed ? 'text-brand-500 line-through' : 'text-brand-100 group-hover/card:text-gold'}`}>
                            {step.title}
                         </h3>
                         <p className={`text-sm md:text-base leading-relaxed ${completed ? 'text-brand-600' : 'text-brand-300'}`}>
                            {step.desc}
                         </p>
                       </div>
                     </div>
                   )
                 })}
               </div>
            </div>
         ))}
      </div>
    </div>
  );
}
