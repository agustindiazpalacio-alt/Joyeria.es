import React from 'react';
import AiPanel from '../components/AiPanel';
import { Megaphone, MessageSquare, Scale, Globe, Zap, Camera, CheckCircle, CheckCircle2, AlertTriangle, BookOpen, MapPin, Plane, Ship, Package } from 'lucide-react';

export function Marketing() {
  const [cpm, setCpm] = React.useState('1500');
  const [conversionRate, setConversionRate] = React.useState('1.5');
  const [ticketPromedio, setTicketPromedio] = React.useState('25000');
  const [presupuesto, setPresupuesto] = React.useState('50000');

  const calcROI = () => {
    const vCpm = Number(cpm) || 0;
    const vCr = Number(conversionRate) / 100 || 0;
    const vTkt = Number(ticketPromedio) || 0;
    const vPpto = Number(presupuesto) || 0;

    const impresiones = vCpm > 0 ? (vPpto / vCpm) * 1000 : 0;
    const clicks = impresiones * 0.02; // Asumimos un CTR promedio de 2% para joyas
    const compras = clicks * vCr;
    const facturado = compras * vTkt;
    const roas = vPpto > 0 ? (facturado / vPpto) : 0;

    return { impresiones, clicks, compras, facturado, roas };
  };

  const totals = calcROI();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="mb-2">
        <h1 className="text-3xl font-serif font-bold golden-text-gradient flex items-center gap-2 mb-1">
          <Megaphone className="w-8 h-8 text-gold drop-shadow-md" /> Marketing & Meta Ads
        </h1>
        <p className="text-brand-400 text-sm">Gestiona tus campañas, presupuestos y visualiza tu tráfico.</p>
      </div>
      <AiPanel 
        title="Asistente: Copywriter Publicitario"
        systemPrompt="Eres un redactor de Meta Ads enfocado en vender joyas en Argentina (2026). Genera copies cortos, persuasivos, enfocados en 'Regalo Ideal', 'Acero Inoxidable' y con un fuerte llamado a la acción. Usa precios en pesos ARS si se te piden. Escribe de forma atractiva para Instagram."
        placeholder="Ej: Escribe un caption para Instagram sobre un anillo de acero que no se oxida, precio $6.000, envío express."
        description="Redacta descripciones atractivas y persuasivas (copies) para tus anuncios en redes sociales, enfocadas en convertir visualizaciones en ventas."
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        <div className="premium-card p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-fuchsia-500/5 rounded-full blur-3xl -z-10 group-hover:bg-fuchsia-500/10 transition-colors" />
            <h2 className="text-lg font-serif font-bold text-brand-100 flex items-center gap-2 mb-4 border-b border-brand-800/50 pb-3">
              <Zap className="w-5 h-5 text-fuchsia-500" />
              Calculadora/Proyección Meta Ads
            </h2>
            <p className="text-brand-400 text-xs mb-5">Estima cuántas ventas lograrás y el ROAS según la inversión publicitaria.</p>
            
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="col-span-2 sm:col-span-1">
                 <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-500 mb-1.5 focus-within:text-fuchsia-400 transition-colors">Presupuesto Mensual ($)</label>
                 <input type="number" value={presupuesto} onChange={e=>setPresupuesto(e.target.value)} className="w-full bg-brand-950 border border-brand-800 rounded-xl p-3 text-sm text-brand-100 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all shadow-inner" />
              </div>
              <div className="col-span-2 sm:col-span-1">
                 <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-500 mb-1.5 focus-within:text-fuchsia-400 transition-colors">Ticket Promedio ($)</label>
                 <input type="number" value={ticketPromedio} onChange={e=>setTicketPromedio(e.target.value)} className="w-full bg-brand-950 border border-brand-800 rounded-xl p-3 text-sm text-brand-100 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all shadow-inner" />
              </div>
              <div>
                 <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-500 mb-1.5 focus-within:text-fuchsia-400 transition-colors">CPM Est. ($/1K impr.)</label>
                 <input type="number" value={cpm} onChange={e=>setCpm(e.target.value)} className="w-full bg-brand-950 border border-brand-800 rounded-xl p-3 text-sm text-brand-100 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all shadow-inner" />
              </div>
              <div>
                 <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-500 mb-1.5 focus-within:text-fuchsia-400 transition-colors">% Conv. Web (o chat)</label>
                 <input type="number" step="0.1" value={conversionRate} onChange={e=>setConversionRate(e.target.value)} className="w-full bg-brand-950 border border-brand-800 rounded-xl p-3 text-sm text-brand-100 focus:outline-none focus:border-fuchsia-500 focus:ring-1 focus:ring-fuchsia-500 transition-all shadow-inner" />
              </div>
            </div>

            <div className="bg-brand-950 p-5 rounded-2xl border border-brand-800/80 shadow-md">
               <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-500 mb-1">Impresiones</p>
                    <p className="text-lg font-bold text-brand-200">{Math.round(totals.impresiones).toLocaleString('es-AR')}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-500 mb-1">Clicks</p>
                    <p className="text-lg font-bold text-sky-400">{Math.round(totals.clicks).toLocaleString('es-AR')}</p>
                  </div>
                  <div className="bg-brand-800/20 py-2 rounded-lg border border-brand-800/50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-1">Ventas</p>
                    <p className="text-lg font-bold text-emerald-400">{Math.round(totals.compras)}</p>
                  </div>
                  <div className="bg-brand-800/20 py-2 rounded-lg border border-brand-800/50">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-1">ROAS</p>
                    <p className="text-lg font-bold text-gold">{totals.roas.toFixed(2)}x</p>
                  </div>
               </div>
               <div className="mt-4 pt-4 border-t border-brand-800 flex flex-col sm:flex-row justify-between sm:items-center gap-2">
                 <span className="text-xs font-bold text-brand-400">Retorno Estimado Facturado:</span>
                 <span className="text-2xl font-mono font-bold text-emerald-500">${Math.round(totals.facturado).toLocaleString('es-AR')}</span>
               </div>
            </div>
        </div>

        <div className="space-y-6">
          <div className="bg-pink-950/30 p-6 rounded-2xl border border-pink-900/50">
            <h2 className="text-lg font-bold text-pink-100 mb-2">¡Evitar el Impuesto País (60%)!</h2>
            <p className="text-pink-200 text-sm mb-4">Para no pagar dólares a precio tarjeta en Meta Ads:</p>
            <ol className="list-decimal pl-5 space-y-2 text-sm text-pink-100">
              <li>Crea una cuenta publicitaria **NUEVA** si la actual está en USD.</li>
              <li>En pago, elige <strong>Pesos Argentinos (ARS)</strong>.</li>
              <li>Agrega fondos MANUALMENTE vía MercadoPago / Tarjeta Débito (prepago).</li>
            </ol>
          </div>
          
          <div className="premium-card p-6 border-t-2 border-t-pink-500 shadow-md">
             <h3 className="font-serif text-lg font-bold text-brand-100 flex items-center gap-2 mb-4"><Camera className="w-5 h-5 text-pink-400" /> Fórmula del Contenido / Reels</h3>
             <ul className="space-y-4">
                <li className="flex gap-3">
                   <div className="p-1.5 rounded-lg bg-pink-500/10 text-pink-400 shrink-0 h-fit border border-pink-500/20">1</div>
                   <div>
                     <p className="text-sm font-bold text-brand-200">El Gancho (0-3 seg)</p>
                     <p className="text-xs text-brand-400 mt-1 leading-snug">Visual super close-up al brillo de la joya. Pregunta: "¿Buscabas tu anillo definitivo?"</p>
                   </div>
                </li>
                <li className="flex gap-3">
                   <div className="p-1.5 rounded-lg bg-sky-500/10 text-sky-400 shrink-0 h-fit border border-sky-500/20">2</div>
                   <div>
                     <p className="text-sm font-bold text-brand-200">El Beneficio o Situación (4-8 seg)</p>
                     <p className="text-xs text-brand-400 mt-1 leading-snug">Mete el acero en agua o muéstralo puesto en una mano o cuello.</p>
                   </div>
                </li>
             </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

export function Support() {
  const [activeTab, setActiveTab] = React.useState<'scripts'|'style'|'crisis'>('scripts');

  const templates = [
    {
      category: "Ventas & Cierre",
      items: [
        {
          title: "Dato de Transferencia (+ Descuento)",
          text: "¡Excelente elección! 💎 Como charlamos, tenés un 10% OFF pagando por transferencia.\n\nEl total con descuento queda en: [Monto]\n\nCBU: 0000000000000\nAlias: joyaos.mp\nTitular: Tu Nombre\n\nPorfa envíame el comprobante por acá apenas transfieras así te separo el stock. ¿Para cuándo quisieras el envío?"
        },
        {
          title: "Stock Agotado (Preventa)",
          text: "¡Hola [Nombre]! ✨ Te cuento que ese modelo voló y ahora lo tenemos en preventa. Entran de nuevo el [Fecha]. Si lo señás ahora, te mantenemos el precio actual y te regalamos un paño de pulido. ¿Te reservo uno?"
        }
      ]
    },
    {
      category: "Logística & Seguimiento",
      items: [
        {
          title: "Envío Realizado (Tracking)",
          text: "¡Buenas noticias, [Nombre]! 🚀 Tu pedido ya está en camino.\n\nEmpresa: [Correo]\nCódigo de seguimiento: [Código]\nLink para seguirlo: [Link]\n\nRecordá que suele actualizarse después de las 20hs. ¡Cualquier duda avisame! ✨"
        },
        {
          title: "Retiro por Pick-up Point",
          text: "¡Hola! 📍 Tu pedido ya está listo para retirar por nuestro punto en [Barrio/Zona].\n\nHorarios: [Horarios]\nDirección: [Dirección]\n\nSolo necesitás decir tu nombre o número de pedido. ¡Te esperamos! 🥰"
        }
      ]
    },
    {
      category: "Fidelización",
      items: [
        {
          title: "Pedido Entregado (Feedback)",
          text: "¡Hola [Nombre]! ✨ Vi que el correo ya entregó tu paquetito. ¿Llegó todo bien? ¿Qué te parecieron las piezas? \n\nSi subís una foto a tus historias etiquetándonos, nos ayudás un montón y te ganás un 15% OFF para tu próxima compra. 🥰"
        }
      ]
    }
  ];

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="mb-2">
        <h1 className="text-3xl font-serif font-bold golden-text-gradient flex items-center gap-2 mb-1">
          <MessageSquare className="w-8 h-8 text-gold drop-shadow-md" /> Atención al Cliente
        </h1>
        <p className="text-brand-400 text-sm">Profesionaliza tu comunicación para vender más y fidelizar.</p>
      </div>

      <div className="flex p-1 bg-brand-950 border border-brand-800 rounded-xl mb-6 w-fit">
        <button 
          onClick={() => setActiveTab('scripts')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'scripts' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-brand-500 hover:text-brand-300'}`}
        >
          Scripts de Venta
        </button>
        <button 
          onClick={() => setActiveTab('style')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'style' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-brand-500 hover:text-brand-300'}`}
        >
          Manual de Estilo
        </button>
        <button 
          onClick={() => setActiveTab('crisis')}
          className={`px-4 py-2 text-xs font-bold uppercase tracking-wider rounded-lg transition-all ${activeTab === 'crisis' ? 'bg-teal-500/10 text-teal-400 border border-teal-500/20' : 'text-brand-500 hover:text-brand-300'}`}
        >
          Manejo de Crisis
        </button>
      </div>

      {activeTab === 'scripts' && (
        <div className="space-y-8">
          <AiPanel 
            title="Generador de Respuestas (IA)"
            systemPrompt="Eres un vendedor experto en WhatsApp para una joyería premium en Argentina. El usuario te mandará el mensaje de un cliente. Tu objetivo es responder con una respuesta lista para enviar. Tono: Cercano, empático, profesional. Usa emojis moderadamente. Enfócate siempre en el beneficio de la pieza (Acero quirúrgico, no se oxida, Brillo eterno)."
            placeholder="Pega el mensaje del cliente aquí..."
            description="Obtén una respuesta perfecta para cualquier consulta o problema de un cliente."
          />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {templates.map((cat, idx) => (
              <div key={idx} className="space-y-4">
                <h2 className="text-sm font-bold text-brand-500 uppercase tracking-widest pl-1">{cat.category}</h2>
                <div className="space-y-4">
                  {cat.items.map((item, i) => (
                    <div key={i} className="premium-card p-5 group relative border-l-2 border-l-teal-500/30 hover:border-l-teal-500 transition-all">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-teal-300 text-sm">{item.title}</h3>
                        <button 
                          onClick={() => navigator.clipboard.writeText(item.text)}
                          className="bg-brand-950 border border-brand-800 p-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity hover:bg-brand-800"
                          title="Copiar mensaje"
                        >
                          <Zap className="w-3.5 h-3.5 text-gold" />
                        </button>
                      </div>
                      <p className="text-xs text-brand-400 whitespace-pre-wrap leading-relaxed font-serif bg-brand-950/40 p-3 rounded-lg border border-brand-900/50">
                        {item.text}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'style' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="premium-card p-6 border-t-2 border-t-gold">
            <h3 className="text-lg font-bold text-brand-100 mb-3">Tono de Voz</h3>
            <p className="text-sm text-brand-300 leading-relaxed">
              En joyería, el tono debe ser <strong>aspiracional pero accesible</strong>. 
              No hablamos como una corporación, sino como una amiga experta en accesorios.
            </p>
            <ul className="mt-4 space-y-2 text-xs text-brand-400">
              <li className="flex gap-2">✅ "¡Hola [Nombre]! ✨"</li>
              <li className="flex gap-2">✅ "¿Te gustaría ver cómo queda puesto?"</li>
              <li className="flex gap-2">❌ "Estimado cliente, se le informa que..."</li>
            </ul>
          </div>
          <div className="premium-card p-6 border-t-2 border-t-teal-500">
            <h3 className="text-lg font-bold text-brand-100 mb-3">Ortografía y Emojis</h3>
            <p className="text-sm text-brand-300 leading-relaxed">
              La confianza se construye con los detalles. Una falta de ortografía en un precio o material puede hacerte perder una venta de $50.000.
            </p>
            <div className="mt-4 p-3 bg-brand-950 rounded-lg text-[11px] text-brand-400 italic">
              "Tip: Usa ✨, 💎 y 💍 para resaltar el valor, pero no más de 3 por mensaje para no parecer spam."
            </div>
          </div>
          <div className="premium-card p-6 border-t-2 border-t-fuchsia-500">
            <h3 className="text-lg font-bold text-brand-100 mb-3">Tiempos de Respuesta</h3>
            <p className="text-sm text-brand-300 leading-relaxed">
              El 70% de las ventas por Instagram/WhatsApp se cierran si respondes en los primeros <strong>15 minutos</strong>.
            </p>
            <div className="mt-4 bg-teal-500/10 border border-teal-500/20 p-3 rounded-lg text-xs text-teal-400 font-bold text-center">
              Meta: &lt; 5 min
            </div>
          </div>
        </div>
      )}

      {activeTab === 'crisis' && (
        <div className="space-y-6">
          <div className="bg-red-950/20 border border-red-900/40 p-6 rounded-2xl">
            <h3 className="text-lg font-bold text-red-200 mb-4 flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" /> Protocolo de Reclamos ("Joyita Fallada")
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div className="space-y-4">
                <p className="text-brand-300">Si un cliente recibe algo roto o fallado, <strong>la prioridad es la calma</strong>.</p>
                <div className="space-y-2">
                  <div className="p-3 bg-brand-950 rounded-xl border border-brand-800">
                    <p className="font-bold text-brand-200 mb-1">Paso 1: Validar</p>
                    <p className="text-xs text-brand-400">"¡Mil disculpas [Nombre]! 😔 Por favor, ¿me podrías mandar una foto o videito cortito del problema así lo reviso con el equipo de control de calidad?"</p>
                  </div>
                  <div className="p-3 bg-brand-950 rounded-xl border border-brand-800">
                    <p className="font-bold text-brand-200 mb-1">Paso 2: Solución Inmediata</p>
                    <p className="text-xs text-brand-400">Nunca discutas por un envío. Ofrece: 1) Reenvío sin cargo, 2) Crédito en tienda + bono, o 3) Devolución total.</p>
                  </div>
                </div>
              </div>
              <div className="bg-brand-950 p-5 rounded-2xl border border-brand-800 self-start">
                <h4 className="font-bold text-brand-200 mb-3 text-xs uppercase tracking-wider">Script de Resolución</h4>
                <p className="text-xs text-brand-400 italic leading-relaxed">
                  "¡Hola [Nombre]! Queremos que ames tus joyitas tanto como nosotros. Te pedimos disculpas por lo sucedido. Acabamos de generarte un cupón de envío gratis y te mandamos una unidad nueva de [Producto] hoy mismo cortesía de JoyaOS. 💖 ¿Te parece bien?"
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export function Legal() {
  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="mb-2">
        <h1 className="text-3xl font-serif font-bold golden-text-gradient flex items-center gap-2 mb-1">
          <Scale className="w-8 h-8 text-gold drop-shadow-md" /> Legal e Impuestos 2026
        </h1>
        <p className="text-brand-400 text-sm">Monotributo, AFIP y SIRCREB. Toda tu contaduría bajo control y regulada.</p>
      </div>
      <AiPanel 
        title="Asistente: Asesor Fiscal"
        systemPrompt="Eres un Asesor Fiscal especializado en pymes en Argentina (año 2026). Ayudas a resolver dudas sobre Monotributo (categorías, topes), SIRCREB, Ingresos Brutos, y retenciones de MercadoPago."
        placeholder="Ej: MercadoPago me está reteniendo un 10.5%, ¿por qué pasa esto y cómo lo evito?"
        description="Resuelve tus dudas sobre impuestos en Argentina: Monotributo, IIBB, SIRCREB y por qué te retienen dinero en MercadoPago."
        useSearch={true}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
         <div className="space-y-6">
           <div className="premium-card p-6 shadow-md border-t-4 border-t-sky-500 relative">
              <div className="absolute top-0 right-0 w-24 h-24 bg-sky-500/5 rounded-full blur-2xl -z-10" />
              <h2 className="font-bold text-lg text-brand-100 mb-4 flex items-center gap-2"><CheckCircle className="w-5 h-5 text-sky-400" /> Checklist AFIP Básico</h2>
              <ul className="space-y-3">
                 <li className="flex items-start gap-3">
                    <div className="p-1 rounded-md bg-sky-500/10 text-sky-400 shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4" /></div>
                    <div>
                       <p className="text-sm font-bold text-brand-200">Alta Monotributo</p>
                       <p className="text-xs text-brand-400 mt-0.5">Clave Fiscal Nivel 3. Categoría inicial A.</p>
                    </div>
                 </li>
                 <li className="flex items-start gap-3">
                    <div className="p-1 rounded-md bg-sky-500/10 text-sky-400 shrink-0 mt-0.5"><CheckCircle2 className="w-4 h-4" /></div>
                    <div>
                       <p className="text-sm font-bold text-brand-200">Facturación Electrónica</p>
                       <p className="text-xs text-brand-400 mt-0.5">Habilitar punto de venta y dar de alta "Comprobantes en línea". Siempre Factura C como Monotributista.</p>
                    </div>
                 </li>
                 <li className="flex items-start gap-3">
                    <div className="p-1 rounded-md bg-amber-500/10 text-amber-500 shrink-0 mt-0.5"><AlertTriangle className="w-4 h-4" /></div>
                    <div>
                       <p className="text-sm font-bold text-brand-200">Ingresos Brutos (ARBA / AGIP / DGR)</p>
                       <p className="text-xs text-brand-400 mt-0.5">Si vendes a todo el país vía envío de correo, necesitas Convenio Multilateral.</p>
                    </div>
                 </li>
              </ul>
           </div>
           
           <div className="premium-card p-6">
             <h2 className="font-bold text-lg mb-4 text-brand-100 flex items-center gap-2"><BookOpen className="w-4 h-4 text-purple-400" /> Registro de Marca (INPI)</h2>
             <p className="text-sm text-brand-400 mb-4">No inviertas recursos en bolsas, tarjetas y redes si tu marca no está a tu nombre.</p>
             <div className="bg-brand-900 p-4 rounded-xl border border-brand-800/80 text-sm list-decimal list-inside space-y-1.5 text-brand-300">
                <li>Buscar disponibilidad fonética en la web INPI.</li>
                <li>Joyería, cuarzo, relojes pertenecen a <strong>CLASE 14</strong>.</li>
                <li>Trámite 100% online por TAD. Tarda hasta 24 meses.</li>
             </div>
           </div>
         </div>

         <div className="space-y-6">
           <div className="premium-card p-6 shadow-md border-orange-900/40">
             <h2 className="font-bold text-brand-100 mb-4 border-b border-brand-800/50 pb-2">Top Errores Costosos</h2>
             <div className="space-y-4 text-sm">
                <div className="bg-brand-950/50 p-4 rounded-xl border border-brand-800/80 hover:border-red-500/30 transition-colors group">
                   <h4 className="text-brand-200 font-bold mb-1 group-hover:text-red-400 transition-colors">1. No pagar Ingresos Brutos</h4>
                   <p className="text-brand-400 text-xs leading-relaxed">MercadoPago y bancos activarán "Retenciones SIRCREB" exageradas por no registrarte.</p>
                </div>
                <div className="bg-brand-950/50 p-4 rounded-xl border border-brand-800/80 hover:border-orange-500/30 transition-colors group">
                   <h4 className="text-brand-200 font-bold mb-1 group-hover:text-orange-400 transition-colors">2. Comprar en Negro y facturar "Blanco"</h4>
                   <p className="text-brand-400 text-xs leading-relaxed">Si haces facturas C a tus clientes pero no tienes Facturas A o B o C de tus proveedores mayoristas, corres riesgo de exclusión.</p>
                </div>
             </div>
           </div>
         </div>
      </div>
    </div>
  );
}

export function Importation() {
  const [fob, setFob] = React.useState('');
  const [shipping, setShipping] = React.useState('');
  const [dolar, setDolar] = React.useState('1300');
  const [tariffs, setTariffs] = React.useState('65');
  const [quantity, setQuantity] = React.useState('100');

  const calcImport = () => {
    const vFob = Number(fob) || 0;
    const vShip = Number(shipping) || 0;
    const vDolar = Number(dolar) || 0;
    const vTariffs = (Number(tariffs) || 0) / 100;
    const vQty = Number(quantity) || 1;
    
    const cif = vFob + vShip;
    const impuestos = cif * vTariffs;
    const totalUsd = cif + impuestos;
    const totalArs = totalUsd * vDolar;
    const unitarioArs = totalArs / vQty;
    const unitarioUsd = totalUsd / vQty;
    return { totalUsd, totalArs, unitarioArs, unitarioUsd, cif, impuestos };
  };

  const { totalUsd, totalArs, unitarioArs, unitarioUsd, cif, impuestos } = calcImport();

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-10">
      <div className="mb-2">
        <h1 className="text-3xl font-serif font-bold golden-text-gradient flex items-center gap-2 mb-1">
          <Globe className="w-8 h-8 text-gold drop-shadow-md" /> Importación &amp; Aduana
        </h1>
        <p className="text-brand-400 text-sm">Regímenes, aduana y calculadora de costo FOB a tu puerta.</p>
      </div>
      <AiPanel 
        title="Asistente: Agente Aduanero & Importador"
        systemPrompt="Eres un despachante de aduanas y agente de importación experto (Argentina 2026). El usuario te enviará links de productos extranjeros (Ej: Alibaba, Aliexpress).
        Tu análisis DEBE contener esta estructura exacta:
        1) DIAGNÓSTICO DEL PRODUCTO: ¿Qué es? (Clasificación arancelaria NCM).
        2) REQUISITOS Y TRABAS: Certificaciones (ANMAT, Seguridad Eléctrica, etc.).
        3) MATEMÁTICA Y RENTABILIDAD: Calcula el costo final aproximado en Argentina sumando FOB + Seguro + Flete + Impuestos (Arancel, Tasa Estadística, IVA, Percepciones). Di claramente si conviene o NO conviene.
        4) RECOMENDACIÓN DE RÉGIMEN: ¿Régimen Courier o Régimen General? Explica por qué.
        Trata de dar números y porcentajes realistas para Argentina y que tu respuesta sea detallada 'Paso a Paso'."
        placeholder="Pega un link de Alibaba/Aliexpress o dinos el producto exacto a analizar y su precio FOB..."
        description="Evalúa si un producto de China es rentable, qué régimen aduanero le corresponde y cuánto pagarás de impuestos al llegar a Argentina."
        useSearch={true}
      />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-6">
            <h2 className="text-xl font-bold text-brand-100 flex items-center gap-2 mb-2"><BookOpen className="w-5 h-5 text-brand-500" /> Teoría y Regímenes</h2>
            <div className="bg-brand-900 p-5 rounded-2xl border border-brand-800/80 text-sm text-brand-300 space-y-4 shadow-sm">
                <div className="group hover:bg-brand-950 p-2 rounded-lg transition-colors">
                  <h3 className="flex items-center gap-2 font-bold text-sky-400 mb-1"><MapPin className="w-4 h-4" /> Comprar en Once Nacional</h3>
                  <p className="text-brand-400">Ideal para empezar. Capital bajo a medio. Alta rotación y sin riesgo aduanero. El costo unitario es mayor pero la liquidez es inmediata.</p>
                </div>
                <div className="group hover:bg-brand-950 p-2 rounded-lg transition-colors">
                  <h3 className="flex items-center gap-2 font-bold text-amber-500 mb-1"><Plane className="w-4 h-4" /> Régimen Courier (DHL/FedEx)</h3>
                  <p className="text-brand-400">Ideal para saltar al siguiente nivel y comprar directo en Alibaba. Límite de 50KG, US$3.000 por envío y hasta 3 unidades de "la misma especie". <strong className="text-amber-500 font-medium">Nota: Ojo con "la misma especie", aduana puede interpretarlo estricto.</strong></p>
                </div>
                <div className="group hover:bg-brand-950 p-2 rounded-lg transition-colors">
                  <h3 className="flex items-center gap-2 font-bold text-red-500 mb-1"><Ship className="w-4 h-4" /> Régimen General</h3>
                  <p className="text-brand-400">Grandes volúmenes. Necesitas Despachante, estar Inscripto como Importador. Costos altos fijos. NCM 7117.19.00 (Bijou, incluye acero).</p>
                </div>
            </div>
        </div>

        <div className="premium-card p-6 shadow-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 rounded-full blur-3xl -z-10 group-hover:bg-gold/10 transition-colors" />
            <h2 className="text-lg font-serif font-bold text-brand-100 flex items-center gap-2 mb-4 border-b border-brand-800/50 pb-3">
              <Package className="w-5 h-5 text-gold" />
              Calculadora de Costos (Courier Estimado)
            </h2>
            <p className="text-brand-400 text-xs mb-6">Calcula rápidamente el costo final y unitario puesto en Argentina.</p>
            
            <div className="space-y-4 mb-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-500 mb-1.5 focus-within:text-gold transition-colors">Costo (FOB) USD</label>
                  <input type="number" value={fob} onChange={e=>setFob(e.target.value)} className="w-full bg-brand-950 border border-brand-800 rounded-xl p-3 text-sm text-brand-100 focus:outline-none focus:border-gold transition-all shadow-inner" placeholder="Ej: 150" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-500 mb-1.5 focus-within:text-gold transition-colors">Flete (Shipping) USD</label>
                  <input type="number" value={shipping} onChange={e=>setShipping(e.target.value)} className="w-full bg-brand-950 border border-brand-800 rounded-xl p-3 text-sm text-brand-100 focus:outline-none focus:border-gold transition-all shadow-inner" placeholder="Ej: 45" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-500 mb-1.5 focus-within:text-gold transition-colors">Cant. de Unidades</label>
                  <input type="number" value={quantity} onChange={e=>setQuantity(e.target.value)} className="w-full bg-brand-950 border border-brand-800 rounded-xl p-3 text-sm text-brand-100 focus:outline-none focus:border-gold transition-all shadow-inner" placeholder="Ej: 100" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-500 mb-1.5 focus-within:text-gold transition-colors">Dólar (MEP/Blue)</label>
                  <input type="number" value={dolar} onChange={e=>setDolar(e.target.value)} className="w-full bg-brand-950 border border-brand-800 rounded-xl p-3 text-sm text-brand-100 focus:outline-none focus:border-gold transition-all shadow-inner" />
                </div>
              </div>
              <div>
                 <label className="block text-[10px] font-bold uppercase tracking-widest text-brand-500 mb-1.5 focus-within:text-gold transition-colors">Aranceles + Tasa (% aprox)</label>
                 <input type="number" value={tariffs} onChange={e=>setTariffs(e.target.value)} className="w-full bg-brand-950 border border-brand-800 rounded-xl p-3 text-sm text-brand-100 focus:outline-none focus:border-gold transition-all shadow-inner" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-4">
              <div className="bg-brand-900 p-4 rounded-xl border border-brand-800/80 shadow-md relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-sky-500" />
                 <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-1">Costo Unit.</p>
                 <span className="text-xl font-mono font-bold text-sky-400 flex flex-col">${unitarioArs.toLocaleString('es-AR', {maximumFractionDigits: 0})} <span className="text-[10px] text-brand-500 mt-0.5">U$D {unitarioUsd.toFixed(2)}</span></span>
              </div>
              <div className="bg-brand-900 p-4 rounded-xl border border-brand-800/80 shadow-md relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                 <p className="text-[10px] font-bold uppercase tracking-widest text-brand-400 mb-1">Costo Total</p>
                 <span className="text-xl font-mono font-bold text-emerald-400 flex flex-col">${totalArs.toLocaleString('es-AR', {maximumFractionDigits: 0})} <span className="text-[10px] text-brand-500 mt-0.5">U$D {totalUsd.toFixed(2)}</span></span>
              </div>
            </div>
            <div className="bg-brand-950 p-4 rounded-xl border border-brand-800/50 flex justify-between items-center text-xs">
               <span className="text-brand-400">CIF (FOB + Envío): <strong className="text-brand-200">U$D {cif.toFixed(2)}</strong></span>
               <span className="text-brand-400">Impuestos (Estimados): <strong className="text-brand-200">U$D {impuestos.toFixed(2)}</strong></span>
            </div>
        </div>
      </div>
    </div>
  );
}
