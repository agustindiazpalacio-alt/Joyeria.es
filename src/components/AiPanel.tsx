import React, { useState } from 'react';
import { Sparkles, Loader2, Copy, CheckCircle2, ChevronDown, ChevronUp } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import Tooltip from './Tooltip';
import { GoogleGenAI } from '@google/genai';

interface AiPanelProps {
  title: string;
  systemPrompt: string;
  contextData?: any;
  placeholder?: string;
  buttonText?: string;
  description?: string;
  useSearch?: boolean;
}

export default function AiPanel({ title, systemPrompt, contextData, placeholder = "Describe tu situación o haz una pregunta...", buttonText = "Consultar", description, useSearch = false }: AiPanelProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [inputVal, setInputVal] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);

  const handleGenerate = async () => {
    if (!inputVal.trim() && !contextData) return;
    if (inputVal.trim().length > 0 && inputVal.trim().length < 5) {
      setResult('Por favor, ingresa al menos unas palabras más para que la IA entienda el contexto.');
      return;
    }
    
    setIsLoading(true);
    setResult('');
    setCopied(false);
    
    try {
      // Simulate real-time progress steps for better UX when tools like Search take a while
      const loadingSteps = [
        "Iniciando razonamiento y análisis de la URL/Texto...", 
        "Ejecutando Google Search (Buscando importaciones, NCM y aranceles)...", 
        "Verificando regulaciones argentinas 2026...", 
        "Calculando matemáticas financieras y de impuestos...",
        "Redactando el informe final..."
      ];
      let stepIndex = 0;
      const progressInterval = setInterval(() => {
         setResult(`*${loadingSteps[stepIndex]}* \n\n⏳ _(Por favor espera, los análisis completos con enlaces web pueden demorar entre 15 y 30 segundos)_`);
         stepIndex = (stepIndex + 1) % loadingSteps.length;
      }, 4000);

      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const prompt = `
Contexto de la aplicación: ${contextData ? JSON.stringify(contextData) : 'Ninguno provisto.'}

Instrucción estricta: Limítate estrictamente a tu rol y especialidad definidos arriba. NO hables de aduanas, importaciones, ni regulaciones de comercio exterior a menos que tu rol específico te lo demande (ej: si eres el Agente Aduanero) o el usuario lo pida explícitamente. Sé conciso y directo al punto.

Consulta del usuario: ${inputVal}
      `;

      const modelConfig: any = {
        model: useSearch ? 'gemini-3.1-pro-preview' : 'gemini-2.5-flash',
        contents: prompt,
        config: {
          systemInstruction: systemPrompt,
          maxOutputTokens: 8192,
          temperature: 0.7
        }
      };
      
      if (useSearch) {
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
        setResult('La IA no devolvió ninguna respuesta. Intenta con un enlace diferente.');
      }
    } catch (error: any) {
      console.error(error);
      setResult(`Error al consultar a Gemini: ${error.message}`);
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
    <div className="premium-card mb-6 overflow-hidden">
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-white/5 transition-colors"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="font-serif text-lg golden-text-gradient font-bold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-gold" />
          {title}
          {description && <Tooltip text={description} />}
        </h3>
        {isOpen ? <ChevronUp className="w-5 h-5 text-brand-400" /> : <ChevronDown className="w-5 h-5 text-brand-400" />}
      </div>
      
      {isOpen && (
        <div className="p-4 pt-0 border-t border-brand-800/50 mt-2">
          <textarea
            className="w-full bg-brand-900 border border-brand-700/50 rounded-xl p-3 focus:ring-1 focus:ring-gold focus:border-gold outline-none resize-none min-h-[80px] text-brand-200 mt-4 placeholder:text-brand-600 text-sm shadow-inner"
            placeholder={placeholder}
            value={inputVal}
            onChange={(e) => setInputVal(e.target.value)}
          />
          <div className="flex justify-end mt-3">
            <button
              onClick={handleGenerate}
              disabled={isLoading || (!inputVal.trim() && !contextData)}
              className="golden-button disabled:opacity-50 px-5 py-2 rounded-lg font-bold flex items-center gap-2 text-sm shadow-lg"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isLoading ? 'Analizando...' : buttonText}
            </button>
          </div>

          {result && (
            <div className="mt-4 relative bg-brand-950/80 border border-brand-800 rounded-xl p-5 shadow-inner">
               <div className="prose prose-invert prose-sm max-w-none text-brand-300">
                  <ReactMarkdown>{result}</ReactMarkdown>
               </div>
               <button
                  onClick={copyToClipboard}
                  className="absolute top-3 right-3 p-1.5 bg-brand-900 border border-brand-700 rounded text-brand-400 hover:text-white transition-colors"
                  title="Copiar respuesta"
                >
                  {copied ? <CheckCircle2 className="w-4 h-4 text-emerald-700" /> : <Copy className="w-4 h-4" />}
                </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
