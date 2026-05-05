import React, { useState } from 'react';
import { GoogleGenAI } from '@google/genai';
import { Sparkles, Copy, CheckCircle2, Loader2, Play } from 'lucide-react';
import { useAppStore } from '../store/StoreContext';

const ASSISTANTS = [
  { id: '1', name: 'Nombres de Marca (INPI)', desc: 'Genera 5 nombres de marca, elegantes y registrables.', prompt: 'Actúa como un experto en Naming y marcas en Argentina. Genera 5 nombres para una marca de joyería, elegantes, y que sean altamente probables de poder registrarse en INPI Clase 14. Input del usuario: ' },
  { id: '2', name: 'Optimizador de Bio IG', desc: 'Mejora la biografía de Instagram para que sea atractiva. Usa formato AIDA.', prompt: 'Mejora esta biografía de Instagram para una joyería. Hazla persuasiva, usa emojis adecuados, incluye un llamado a la acción claro y mantén el límite de 150 caracteres. Input actual: ' },
  { id: '3', name: 'Copy para Meta Ads', desc: 'Crea textos publicitarios persuasivos enfocados en venta y engagement.', prompt: 'Escribe un copy persuasivo (con formula AIDA) para un anuncio de Meta Ads vendiendo joyería en Argentina. Enfócate en el beneficio (elegancia, estatus o durabilidad si es acero). Input del producto/oferta: ' },
  { id: '4', name: 'Guionista Reels Virales', desc: 'Crea guiones 15-30 seg. con un buen gancho visual y auditivo para Reels / TikToks.', prompt: 'Escribe un guion segundo a segundo, para un Reel de Instagram de 15-30 segundos sobre joyería. Debe tener un gancho visual/auditivo fuerte en los primeros 3 segundos. Input del tema: ' },
  { id: '5', name: 'Recuperador de Carritos', desc: 'Redacta mensajes para enviar por WhatsApp a clientes que no terminaron su compra.', prompt: 'Escribe un mensaje de WhatsApp corto, amigable y muy persuasivo para enviar a un cliente de Argentina que dejó un carrito abandonado en la tienda online. No seas agresivo. Input (nombre/producto si hay): ' },
  { id: '6', name: 'Derribador de Objeciones', desc: 'Genera respuestas empáticas para clientes que dudan en comprar (ej: envíos caros).', prompt: 'Dame una respuesta perfecta y empática para esta objeción de venta de un cliente de joyería. Input de la objeción: ' },
  { id: '7', name: 'Contacto Mayorista (Once)', desc: 'Prepara un mensaje en tono formal-casual para pedir información a proveedores.', prompt: 'Haz un breve mensaje formal pero directo para enviar por WhatsApp a un mayorista de joyería en Once (Buenos Aires) pidiendo su catálogo, lista de precios y mínimos de compra. Input (tu nombre/marca): ' },
  { id: '8', name: 'Mensaje Alibaba (Inglés)', desc: 'Traduce a inglés comercial perfecto para que un fabricante internacional te responda rápido.', prompt: 'Traduce y profesionaliza este mensaje al inglés comercial de negocios, para enviarle a una fábrica proveedora de joyería en Alibaba China. Incluye la versión en español y en inglés. Input: ' },
  { id: '9', name: 'Consultor Aduanero', desc: 'Analiza si un link de China conviene. Requisitos (Courier o General).', prompt: 'Actúa como un despachante de aduanas argentino en 2026. Analiza el producto indicado. DIAGNÓSTICO: ¿Qué es?. REQUISITOS: Certificaciones especiales. MATEMÁTICA Y RENTABILIDAD: Estima impuestos y sugiere si es rentable. RÉGIMEN: ¿Usa régimen general o Courier? Input del producto: ', useSearch: true },
  { id: '10', name: 'Armador de Catálogo', desc: 'Sugiere proporciones de compra (cadenas, aros, dijes) ideal para primera inversión.', prompt: 'Actúa como un mayorista experto de Once. Recomienda exactamente qué mix de productos (modelos, materiales) comprar para empezar a vender sin clavarse con stock. Capital del usuario: ' },
  { id: '11', name: 'Calculadora de Rentabilidad', desc: 'Pega la factura o el precio de costo, te sugerimos el precio de venta y rentabilidad.', prompt: 'Actúa como un financiero retail especializado en joyería (2026 Argentina). El usuario ingresará un precio de costo o comprobante de un producto. Debes calcular: 1) Precio de Venta Recomendado (margen x3 o rentabilidad saludable), 2) Beneficio bruto por unidad, 3) Estrategia de pricing (ej. si conviene dar envío gratis o no). Si dice "el proveedor me pasa este link/factura a este precio", calcula todo eso directo. Input: ' },
];

import ReactMarkdown from 'react-markdown';

export default function AiAssistants() {
  const [activeAssistant, setActiveAssistant] = useState(ASSISTANTS[0]);
  const [inputVal, setInputVal] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!inputVal.trim() || inputVal.trim().length < 5) {
        setResult("Por favor ingresa un poco más de contexto. Muy poca información afectará la calidad de la respuesta.");
        return;
    }
    
    setIsLoading(true);
    setResult('');
    setCopied(false);
    
    try {
      const loadingSteps = [
        "Iniciando flujo de trabajo...", 
        "Ejecutando herramientas y analizando la entrada...", 
        "Consultando base de conocimientos...", 
        "Generando cálculos y recomendaciones...",
        "Redactando el informe final..."
      ];
      let stepIndex = 0;
      const progressInterval = setInterval(() => {
         setResult(`*${loadingSteps[stepIndex]}* \n\n⏳ _(Trabajando en tu respuesta...)_`);
         stepIndex = (stepIndex + 1) % loadingSteps.length;
      }, 4000);

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      const fullPrompt = `${inputVal}`;
      
      const modelConfig: any = {
        model: (activeAssistant as any).useSearch ? 'gemini-3.1-pro-preview' : 'gemini-2.5-flash',
        contents: fullPrompt,
        config: {
          systemInstruction: activeAssistant.prompt + "\n\nInstrucción estricta: Limítate estrictamente a tu especialidad. NO hables de aduanas, envíos internacionales ni importaciones a menos que sea tu rol principal o se te pida explícitamente. Sé conciso y directo.",
          maxOutputTokens: 8192,
          temperature: 0.7
        }
      };
      
      if ((activeAssistant as any).useSearch) {
        modelConfig.tools = [{ googleSearch: {} }];
      }

      const responseStream = await ai.models.generateContentStream(modelConfig);
      
      clearInterval(progressInterval);

      let fullText = '';
      for await (const chunk of responseStream) {
        if (chunk.text) {
          fullText += chunk.text;
          setResult(fullText);
        }
      }

      if (!fullText) {
        setResult('La IA no devolvió ninguna respuesta.');
      }
    } catch (error: any) {
      console.error(error);
      setResult(`Error al generar: ${error.message || 'Error desconocido'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(result);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] md:h-[calc(100vh-4rem)] max-w-6xl mx-auto w-full">
      <div className="flex items-center justify-between mb-4 shrink-0">
        <div>
           <h1 className="text-3xl font-serif font-bold golden-text-gradient flex items-center gap-2 mb-1">
             <Sparkles className="w-8 h-8 text-gold drop-shadow-md" /> Centro de IA
           </h1>
           <p className="text-brand-400 text-sm hidden sm:block">Tu equipo de expertos trabajando 24/7 para potenciar tu marca.</p>
        </div>
      </div>

      <div className="flex-1 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Sidebar assistants list */}
        <div className="w-full md:w-1/3 flex flex-col gap-2 shrink-0 overflow-y-auto mb-4 md:mb-0 pb-4 custom-scrollbar">
          <p className="text-xs font-bold text-brand-500 uppercase tracking-widest px-2 py-1 mb-1">Elegir Asistente</p>
          {ASSISTANTS.map(ast => (
            <button
              key={ast.id}
              onClick={() => { setActiveAssistant(ast); setInputVal(''); setResult(''); }}
              className={`text-left px-4 py-3 rounded-xl transition-all flex flex-col gap-1 ${
                activeAssistant.id === ast.id 
                  ? 'border border-gold/50 shadow-[0_0_15px_rgba(245,158,11,0.15)] bg-gold/5'
                  : 'bg-brand-900/50 border border-brand-800/50 hover:border-gold/30'
              }`}
            >
              <span className={`text-sm font-bold ${activeAssistant.id === ast.id ? 'text-gold' : 'text-brand-300'}`}>{ast.name}</span>
              <span className={`text-xs ${activeAssistant.id === ast.id ? 'text-gold/80' : 'text-brand-500'} line-clamp-2`}>{ast.desc}</span>
            </button>
          ))}
        </div>

        {/* Workspace */}
        <div className="flex-1 premium-card p-6 flex flex-col min-h-[400px]">
          <div className="mb-4">
            <h2 className="text-xl font-serif font-bold text-brand-100">{activeAssistant.name}</h2>
            <p className="text-sm text-brand-500 mt-1">Ingresa el contexto o la información necesaria y nuestra IA hará la magia.</p>
          </div>

          <div className="mb-4 relative">
            <textarea
              className="w-full bg-brand-950/80 border border-brand-700/50 rounded-xl p-4 focus:border-gold focus:ring-1 focus:ring-gold focus:outline-none resize-none min-h-[120px] text-brand-200 shadow-inner"
              placeholder="Escribe aquí tu petición o contexto..."
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
            />
            <div className="flex justify-end mt-3">
              <button
                onClick={handleGenerate}
                disabled={isLoading || !inputVal.trim()}
                className="golden-button disabled:opacity-50 px-6 py-2.5 rounded-xl font-bold flex items-center gap-2"
              >
                {isLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Sparkles className="w-5 h-5" />}
                {isLoading ? 'Generando...' : 'Generar magia con IA'}
              </button>
            </div>
          </div>

          {/* Result area */}
          <div className="flex-1 flex flex-col min-h-[200px] relative">
            <div className={`flex-1 rounded-xl p-6 overflow-y-auto border shadow-inner ${result ? 'border-gold/20 bg-brand-950/80' : 'border-brand-800/50 bg-brand-900/30 flex items-center justify-center'}`}>
              {!result && !isLoading && (
                <div className="text-center text-brand-500">
                  <Sparkles className="w-12 h-12 mx-auto mb-3 opacity-20" />
                  <p>La respuesta aparecerá aquí</p>
                </div>
              )}
              {result && (
                <div className="prose prose-invert prose-sm max-w-none text-brand-300">
                  <ReactMarkdown>{result}</ReactMarkdown>
                </div>
              )}
            </div>

            {result && (
              <button
                onClick={copyToClipboard}
                className="absolute top-4 right-4 p-2 bg-[#0a0a0a] border border-brand-700 rounded-lg shadow-lg text-brand-400 hover:text-white transition-colors"
                title="Copiar al portapapeles"
              >
                {copied ? <CheckCircle2 className="w-5 h-5 text-emerald-700" /> : <Copy className="w-5 h-5" />}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
