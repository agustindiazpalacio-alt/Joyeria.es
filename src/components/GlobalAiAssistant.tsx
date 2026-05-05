import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Loader2, Send, Clock, Trash2, ChevronLeft } from 'lucide-react';
import { useAppStore } from '../store/StoreContext';
import ReactMarkdown from 'react-markdown';
import { GoogleGenAI } from '@google/genai';

export default function GlobalAiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [viewMode, setViewMode] = useState<'chat' | 'history'>('chat');
  const [inputVal, setInputVal] = useState('');
  const [activeSessionId, setActiveSessionId] = useState<string | null>(null);
  
  const initialMessage = {
    role: 'model' as const,
    text: '¡Hola! Soy tu asistente estrella de JoyaOS. Pregúntame sobre tus ventas, qué comprar en Once, o estrategias de rentabilidad.'
  };
  
  const [messages, setMessages] = useState<{role: 'user'|'model', text: string}[]>([initialMessage]);
  const [isLoading, setIsLoading] = useState(false);
  const { state, setState } = useAppStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (viewMode === 'chat') {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, viewMode]);

  const saveCurrentSession = () => {
    if (messages.length > 1) {
      const firstUserMsg = messages.find(m => m.role === 'user')?.text || 'Nueva Conversación';
      const title = firstUserMsg.length > 30 ? firstUserMsg.substring(0, 30) + '...' : firstUserMsg;
      
      setState(prev => {
        const existingSessions = prev.chatSessions || [];
        
        // Si ya hay una sesión activa, la actualizamos en lugar de duplicarla
        if (activeSessionId) {
          return {
            ...prev,
            chatSessions: existingSessions.map(s => 
              s.id === activeSessionId 
                ? { ...s, messages: [...messages], title } 
                : s
            )
          };
        }
        
        // Si es nueva, la agregamos
        const newSession = {
          id: 'chat_' + Date.now(),
          date: new Date().toISOString(),
          title: title,
          messages: [...messages]
        };
        return {
          ...prev,
          chatSessions: [...existingSessions, newSession]
        };
      });
    }
  };

  const handleClose = () => {
    saveCurrentSession();
    setMessages([initialMessage]);
    setActiveSessionId(null);
    setIsOpen(false);
    setViewMode('chat');
  };

  const openHistory = () => {
    saveCurrentSession();
    setMessages([initialMessage]); // Prepara para un chat nuevo cuando vuelva
    setActiveSessionId(null);
    setViewMode('history');
  };

  const loadSession = (sessionId: string) => {
    const session = state.chatSessions?.find(s => s.id === sessionId);
    if (session) {
      setMessages(session.messages);
      setActiveSessionId(session.id);
      setViewMode('chat');
    }
  };

  const deleteSession = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    setState(prev => ({
      ...prev,
      chatSessions: (prev.chatSessions || []).filter(s => s.id !== sessionId)
    }));
    if (activeSessionId === sessionId) {
      setMessages([initialMessage]);
      setActiveSessionId(null);
    }
  };

  const handleSend = async () => {
    if (!inputVal.trim()) return;
    
    const userText = inputVal;
    setMessages(prev => [...prev, { role: 'user', text: userText }]);
    setInputVal('');
    setIsLoading(true);

    try {
      const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
      
      const contextStr = JSON.stringify({
        productos_top: state.products.slice(0,5).map(p=>p.name),
        ventas_totales_cantidad: state.sales.length,
        presupuesto_referencia: "$100.000 ARS"
      });

      const prompt = `Eres el asistente virtual global de la aplicación JoyaOS, un SaaS premium para emprendedores de joyería en Argentina 2026. 
Reglas:
- Sé amigable, directo, usa formato markdown, y contesta en español argentino.
- Limítate a responder lo requerido basándote en tu propia especialidad (ventas, negocios). Si es algo muy técnico de impuestos derivado al "Asesor Fiscal" (en la sección Legales), si es importación al "Agente de Aduanas" (en la sección Importaciones). No te extiendas con pasos de importación a menos que el usuario lo pida explícitamente. No respondas con guiones larguísimos, sé conciso.
- El usuario te pregunta: "${userText}"
- Aquí hay un breve contexto: ${contextStr}
(No menciones el contexto a menos que sea relevante).
`;

      const responseStream = await ai.models.generateContentStream({
        model: 'gemini-3.1-pro-preview',
        contents: prompt,
        tools: [{ googleSearch: {} }],
        config: {
          maxOutputTokens: 8192,
          temperature: 0.7
        }
      });
      
      let fullText = '';
      for await (const chunk of responseStream) {
        if (chunk.text) {
          fullText += chunk.text;
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === 'model') {
                lastMessage.text = fullText;
            } else {
                newMessages.push({ role: 'model', text: fullText });
            }
            return newMessages;
          });
        }
      }

      if (!fullText) {
        setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage.role === 'model') {
                lastMessage.text = 'Mmm, no pude procesar eso. ¿Podés repetir?';
            } else {
                newMessages.push({ role: 'model', text: 'Mmm, no pude procesar eso. ¿Podés repetir?' });
            }
            return newMessages;
        });
      }
    } catch (e: any) {
      setMessages(prev => [...prev, { role: 'model', text: `Hubo un error de conexión: ${e.message}` }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button 
         onClick={() => setIsOpen(true)}
         className={`fixed bottom-6 right-6 golden-button text-brand-950 shadow-[0_0_20px_rgba(245,158,11,0.3)] rounded-full p-4 transition-all hover:scale-110 z-40 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <Sparkles className="w-6 h-6" />
      </button>

      {isOpen && (
        <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 w-[calc(100vw-2rem)] sm:w-[400px] max-w-[400px] h-[75vh] max-h-[600px] premium-card flex flex-col shadow-[0_0_40px_rgba(0,0,0,0.8)] z-[100] overflow-hidden border border-gold/30 rounded-2xl">
          {/* Header */}
          <div className="bg-gradient-to-r from-brand-900 to-brand-950 border-b border-brand-800 p-4 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {viewMode === 'history' ? (
                <button onClick={() => setViewMode('chat')} className="text-brand-400 hover:text-white mr-1">
                  <ChevronLeft className="w-5 h-5" />
                </button>
              ) : (
                <Sparkles className="w-5 h-5 text-gold" />
              )}
              <h3 className="font-serif font-bold text-brand-100">{viewMode === 'history' ? 'Historial de Chats' : 'JoyaOS Assistant'}</h3>
            </div>
            <div className="flex items-center gap-3">
              {viewMode === 'chat' && (
                <button onClick={openHistory} className="text-brand-400 hover:text-gold transition-colors" title="Ver Historial">
                  <Clock className="w-5 h-5" />
                </button>
              )}
              <button onClick={handleClose} className="text-brand-500 hover:text-brand-300 transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {viewMode === 'history' ? (
            /* History View */
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-brand-950/80 custom-scrollbar">
              {(!state.chatSessions || state.chatSessions.length === 0) ? (
                <div className="text-center text-brand-500 mt-10">
                  <Clock className="w-10 h-10 mx-auto mb-3 opacity-20" />
                  <p className="text-sm">No hay chats guardados aún.</p>
                </div>
              ) : (
                [...state.chatSessions].reverse().map(session => (
                  <div 
                    key={session.id} 
                    onClick={() => loadSession(session.id)}
                    className="bg-brand-900 border border-brand-800 p-3 rounded-xl cursor-pointer hover:border-gold/50 transition-all flex justify-between items-center group"
                  >
                    <div className="overflow-hidden pr-2">
                      <p className="text-sm font-bold text-brand-200 truncate">{session.title}</p>
                      <p className="text-xs text-brand-500 mt-1">{new Date(session.date).toLocaleString('es-AR')}</p>
                    </div>
                    <button 
                      onClick={(e) => deleteSession(e, session.id)}
                      className="p-2 text-brand-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all"
                      title="Eliminar chat"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))
              )}
            </div>
          ) : (
            /* Chat View */
            <>
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-brand-950/80 custom-scrollbar">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${msg.role === 'user' ? 'bg-gold text-brand-950 rounded-tr-sm font-medium' : 'bg-brand-900 border border-brand-800 text-brand-200 rounded-tl-sm'}`}>
                      {msg.role === 'model' ? (
                        <div className="prose prose-invert prose-sm"><ReactMarkdown>{msg.text}</ReactMarkdown></div>
                      ) : (
                        msg.text
                      )}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-brand-900 border border-brand-800 p-3 rounded-2xl rounded-tl-sm flex items-center gap-2 text-brand-400">
                      <Loader2 className="w-4 h-4 animate-spin text-gold" />
                      <span className="text-xs">Pensando...</span>
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Area */}
              <div className="p-3 border-t border-brand-800 bg-brand-950">
                <div className="relative">
                  <input 
                    type="text" 
                    value={inputVal}
                    onChange={e => setInputVal(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleSend()}
                    placeholder="Preguntale a la IA..."
                    className="w-full bg-brand-900 border border-brand-800 rounded-full pl-4 pr-12 py-3 focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-sm text-brand-100"
                  />
                  <button 
                    onClick={handleSend}
                    disabled={isLoading || !inputVal.trim()}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 bg-gold text-brand-950 rounded-full disabled:opacity-50 hover:bg-yellow-400 transition-colors"
                    title="A la 🚀"
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}
    </>
  );
}
