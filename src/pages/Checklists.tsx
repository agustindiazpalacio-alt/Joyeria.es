import React, { useState } from 'react';
import AiPanel from '../components/AiPanel';
import { useAppStore } from '../store/StoreContext';
import { Plus, Trash2, Calendar, ClipboardList, CalendarDays, Zap, Circle, ArrowRightCircle, CheckCircle2, Clock } from 'lucide-react';
import { Task } from '../types';

type TaskStatus = 'pending' | 'in-progress' | 'completed';
type TaskFrequency = 'daily' | 'weekly' | 'monthly' | 'once';

export default function Checklists() {
  const { state, setState } = useAppStore();
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskFreq, setNewTaskFreq] = useState<TaskFrequency>('daily');

  const updateTaskStatus = (id: string, status: TaskStatus) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => {
        if (t.id === id) {
          return {
            ...t,
            status,
            completed: status === 'completed',
          };
        }
        return t;
      })
    }));
  };
  
  // Retrocompatibilidad
  const normalizedTasks = state.tasks.map(t => ({
    ...t,
    status: t.status || (t.completed ? 'completed' : 'pending'),
    frequency: t.frequency || 'once'
  })) as (Task & { status: TaskStatus, frequency: TaskFrequency })[];

  const deleteTask = (id: string) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== id)
    }));
  };

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskTitle.trim()) return;
    
    const newTask: Task = {
      id: 't_' + Date.now(),
      title: newTaskTitle.trim(),
      completed: false,
      category: 'General', 
      status: 'pending',
      frequency: newTaskFreq
    };

    setState(prev => ({
      ...prev,
      tasks: [...prev.tasks, newTask]
    }));
    setNewTaskTitle('');
  };

  const statusConfig = {
    'pending': { icon: Circle, color: 'text-brand-500', bg: 'bg-brand-900/50', border: 'border-brand-800', label: 'Pendientes', colBg: 'bg-brand-950/30' },
    'in-progress': { icon: ArrowRightCircle, color: 'text-amber-500', bg: 'bg-amber-500/10', border: 'border-amber-500/30', label: 'En Proceso', colBg: 'bg-amber-950/10' },
    'completed': { icon: CheckCircle2, color: 'text-emerald-500', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', label: 'Hechas', colBg: 'bg-emerald-950/10' }
  };

  const freqConfig = {
    'daily': { label: 'Diaria', icon: Zap },
    'weekly': { label: 'Semanal', icon: Calendar },
    'monthly': { label: 'Mensual', icon: CalendarDays },
    'once': { label: 'Única vez', icon: ClipboardList }
  };

  const columns = (Object.keys(statusConfig) as TaskStatus[]).map(status => ({
    status,
    config: statusConfig[status],
    tasks: normalizedTasks.filter(t => t.status === status)
  }));

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-10 h-full flex flex-col">
      <div className="mb-2">
        <h1 className="text-3xl font-serif font-bold golden-text-gradient mb-1">Tablero de Tareas</h1>
        <p className="text-brand-400 text-sm">Gestiona tus procesos en tiempo real: pendiente, en proceso y finalizado.</p>
      </div>

      <AiPanel 
        title="Asistente: Organizador Kanban"
        systemPrompt="Eres un consultor de eficiencia. Analizas la lista de tareas del usuario y le dices cómo concentrarse mejor y ahorrar tiempo. Recomienda agrupar tareas o delegar lo que no aporta valor."
        placeholder="Ej: Tengo demasiadas tareas pendientes, ¿cómo me organizo?"
        description="Recibe consejos sobre cómo priorizar tus tareas del tablero."
      />

      {/* Input Header */}
      <div className="premium-card p-4 sm:p-5 mb-2 bg-brand-950/95 backdrop-blur-md shadow-xl border-brand-800 rounded-2xl">
        <form onSubmit={addTask} className="flex flex-col sm:flex-row gap-3 items-end">
          <div className="flex-1 w-full">
            <label className="text-[11px] font-bold uppercase tracking-widest text-brand-500 mb-1.5 block">Nueva Tarea</label>
            <input 
              type="text" 
              value={newTaskTitle}
              onChange={e => setNewTaskTitle(e.target.value)}
              placeholder="Ej: Revisar stock de anillos..."
              className="w-full bg-brand-900 border border-brand-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-brand-100 placeholder:text-brand-600 transition-all shadow-inner"
            />
          </div>
          <div className="w-full sm:w-auto">
            <label className="text-[11px] font-bold uppercase tracking-widest text-brand-500 mb-1.5 block">Frecuencia</label>
            <select 
              value={newTaskFreq} 
              onChange={e => setNewTaskFreq(e.target.value as TaskFrequency)}
              className="w-full sm:w-48 bg-brand-900 border border-brand-800 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-gold focus:ring-1 focus:ring-gold text-brand-100 appearance-none"
            >
              {Object.entries(freqConfig).map(([key, conf]) => (
                <option key={key} value={key}>{conf.label}</option>
              ))}
            </select>
          </div>
          <button 
            type="submit" 
            disabled={!newTaskTitle.trim()} 
            className="w-full sm:w-auto bg-brand-800 text-gold hover:bg-gold hover:text-brand-950 font-bold px-6 py-3 rounded-xl text-sm disabled:opacity-50 disabled:cursor-not-allowed flex justify-center items-center gap-2 transition-all h-[46px]"
          >
            <Plus className="w-4 h-4" /> Agregar
          </button>
        </form>
      </div>

      {/* Kanban Board */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 flex-1 min-h-[500px]">
        {columns.map(col => {
          const ColIcon = col.config.icon;
          return (
            <div key={col.status} className={`rounded-2xl border border-brand-800/40 p-4 flex flex-col ${col.config.colBg}`}>
              <div className="flex items-center justify-between mb-4 pb-3 border-b border-brand-800/50">
                <h3 className={`font-serif font-bold text-lg flex items-center gap-2 ${col.status === 'completed' ? 'text-emerald-500' : col.status === 'in-progress' ? 'text-amber-500' : 'text-brand-100'}`}>
                   <ColIcon className="w-5 h-5" />
                   {col.config.label}
                </h3>
                <span className="bg-brand-900 text-brand-400 text-xs px-2.5 py-1 rounded-full font-bold shadow-inner">
                  {col.tasks.length}
                </span>
              </div>

              <div className="flex-1 space-y-3 overflow-y-auto pr-1 custom-scrollbar">
                {col.tasks.map(task => {
                  const FreqIcon = freqConfig[task.frequency].icon;
                  return (
                    <div 
                      key={task.id} 
                      className={`premium-card p-4 rounded-xl border transition-all duration-200 group hover:-translate-y-0.5 hover:shadow-lg ${task.status === 'completed' ? 'opacity-80' : ''}`}
                    >
                       <div className="flex justify-between items-start gap-2 mb-3">
                          <p className={`text-sm font-medium leading-snug flex-1 ${task.status === 'completed' ? 'line-through text-brand-500' : 'text-brand-100'}`}>
                            {task.title}
                          </p>
                          <button 
                            onClick={() => deleteTask(task.id)}
                            className="p-1.5 text-brand-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity rounded-md hover:bg-red-500/10 shrink-0"
                            title="Eliminar tarea"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                       </div>

                       <div className="flex items-center justify-between mt-auto">
                          <span className="flex items-center gap-1.5 text-[11px] font-bold text-brand-400 uppercase tracking-wider bg-brand-900 px-2 py-1 rounded border border-brand-800">
                             <FreqIcon className="w-3.5 h-3.5 text-gold/80" />
                             {freqConfig[task.frequency].label}
                          </span>
                          
                          <div className="flex gap-1">
                            {(Object.keys(statusConfig) as TaskStatus[]).filter(s => s !== task.status).map(sOpt => {
                               const OptIcon = statusConfig[sOpt].icon;
                               return (
                                 <button
                                   key={sOpt}
                                   onClick={() => updateTaskStatus(task.id, sOpt)}
                                   className="p-1.5 rounded-lg bg-brand-900 border border-brand-800 text-brand-400 hover:text-brand-100 hover:bg-brand-800 transition-colors"
                                   title={`Mover a ${statusConfig[sOpt].label}`}
                                 >
                                   <OptIcon className="w-4 h-4" />
                                 </button>
                               )
                            })}
                          </div>
                       </div>
                    </div>
                  );
                })}
                {col.tasks.length === 0 && (
                  <div className="text-center py-10 opacity-30">
                    <ColIcon className="w-10 h-10 mx-auto mb-2 text-brand-500" />
                    <p className="text-sm font-medium text-brand-400">Sin tareas</p>
                  </div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  );
}
