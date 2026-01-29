'use client';
import { useState, useEffect, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import { CalendarDays, Clock, Check, Pencil } from 'lucide-react';

const DAYS = [
  { id: 1, name: 'Lunes' }, { id: 2, name: 'Martes' }, { id: 3, name: 'Miércoles' },
  { id: 4, name: 'Jueves' }, { id: 5, name: 'Viernes' }, { id: 6, name: 'Sábado' }, { id: 0, name: 'Domingo' }
];

export default function ScheduleForm() {
  const [schedules, setSchedules] = useState<any[]>([]);
  const [selectedDay, setSelectedDay] = useState(1);
  const [loading, setLoading] = useState(false);
  const [isOpenManual, setIsOpenManual] = useState(true);
  
  const openRef = useRef<HTMLInputElement>(null);
  const closeRef = useRef<HTMLInputElement>(null);

  useEffect(() => { 
    fetchSchedules(); 
  }, []);

  useEffect(() => {
    const existing = schedules.find(s => s.day_of_week === selectedDay);
    if (existing && openRef.current && closeRef.current) {
      openRef.current.value = existing.open_time.slice(0, 5);
      closeRef.current.value = existing.close_time.slice(0, 5);
      setIsOpenManual(existing.is_open ?? true);
    } else if (openRef.current && closeRef.current) {
      openRef.current.value = "";
      closeRef.current.value = "";
      setIsOpenManual(true);
    }
  }, [selectedDay, schedules]);

  const fetchSchedules = async () => {
    const { data } = await supabase.from('schedules').select('*').order('day_of_week');
    setSchedules(data || []);
  };

  const handleUpdate = async (e: any) => {
    e.preventDefault();
    setLoading(true);
    const dayData = DAYS.find(d => d.id === selectedDay);

    const { error } = await supabase.from('schedules').upsert({
      day_of_week: selectedDay,
      day_name: dayData?.name,
      open_time: openRef.current?.value,
      close_time: closeRef.current?.value,
      is_open: isOpenManual,
    }, { onConflict: 'day_of_week' });

    if (!error) {
      await fetchSchedules();
      alert(`Horario de ${dayData?.name} actualizado correctamente ⏰`);
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#111] p-8 rounded-[2.5rem] border border-[#111] shadow-sm">
      <h3 className="text-(--color-primary) text-[10px] font-black uppercase tracking-widest mb-8 flex items-center gap-2">
        <CalendarDays size={14} /> Gestión de Horarios
      </h3>

      <form onSubmit={handleUpdate} className="space-y-8 mb-10">
        <div className="space-y-3">
          <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">
            1. Seleccioná el día a modificar
          </label>
          <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {DAYS.map((day) => {
              const hasSchedule = schedules.some(s => s.day_of_week === day.id);
              return (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => setSelectedDay(day.id)}
                  className={`px-5 py-3 rounded-2xl text-[10px] font-bold transition-all border whitespace-nowrap flex items-center gap-2 ${
                    selectedDay === day.id 
                      ? 'bg-[#111] border-[#111] text-white shadow-lg shadow-blue-900/10' 
                      : 'bg-[#333] border-[#111] text-gray-400'
                  }`}
                >
                  {day.name}
                  {hasSchedule && <div className={`w-1 h-1 rounded-full ${selectedDay === day.id ? 'bg-white' : 'bg-(--color-accent)'}`} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Lógica de apertura manual (is_open) */}
        <div className="flex items-center justify-between bg-[#111] p-4 rounded-2xl border border-gray-100">
          <span className="text-[10px] font-black uppercase text-(--color-primary-dark) tracking-widest">¿El local abre este día?</span>
          <input 
            type="checkbox" 
            checked={isOpenManual} 
            onChange={(e) => setIsOpenManual(e.target.checked)}
            className="w-5 h-5 accent-(--color-primary) cursor-pointer"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Apertura</label>
            <input 
              ref={openRef}
              type="time" 
              className="w-full bg-[#111] rounded-2xl px-6 py-4 text-sm text-(--color-primary-dark) font-bold border border-gray-100 outline-none focus:ring-1 focus:ring-(--color-primary)/50 transition-all" 
              required 
            />
          </div>
          <div className="space-y-2">
            <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Cierre</label>
            <input 
              ref={closeRef}
              type="time" 
              className="w-full bg-[#111] rounded-2xl px-6 py-4 text-sm text-(--color-primary-dark) font-bold border border-gray-100 outline-none focus:ring-1 focus:ring-(--color-primary)/50 transition-all" 
              required 
            />
          </div>
        </div>

        <button 
          disabled={loading}
          className="w-full bg-(--color-primary) hover:bg-(--color-primary-dark) py-5 rounded-[1.5rem] font-black text-[11px] uppercase tracking-[0.2em] text-white transition-all shadow-xl shadow-blue-900/10 flex items-center justify-center gap-2 active:scale-95"
        >
          {loading ? 'Procesando...' : (
            schedules.some(s => s.day_of_week === selectedDay) 
            ? <><Pencil size={16}/> Actualizar Horario</> 
            : <><Check size={16}/> Guardar Horario</>
          )}
        </button>
      </form>

      <div className="space-y-3">
        <label className="text-[9px] font-black text-gray-400 uppercase tracking-widest ml-2 italic">Horarios establecidos</label>
        <div className="grid gap-2">
          {schedules.map(s => (
            <button 
              key={s.id} 
              onClick={() => setSelectedDay(s.day_of_week)}
              className="w-full flex justify-between items-center p-5 bg-[#111] rounded-2xl border border-gray-100 hover:border-(--color-primary)/50 transition-all group"
            >
              <span className={`text-[10px] font-black uppercase transition-colors ${s.is_open ? 'text-gray-400 group-hover:text-(--color-primary)' : 'text-red-400'}`}>
                {s.day_name} {!s.is_open && '(CERRADO)'}
              </span>
              <div className="flex items-center gap-2">
                <Clock size={12} className="text-(--color-accent)" />
                <span className="text-(--color-primary-dark) text-[11px] font-black tracking-tight">
                  {s.open_time.slice(0,5)} — {s.close_time.slice(0,5)} HS
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}