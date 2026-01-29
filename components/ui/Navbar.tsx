'use client';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchMenuData } from '@/services/menuService';
import { checkBusinessStatus } from '@/utils/dateUtils';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, MapPin, Wallet, Clock, X } from 'lucide-react';
import LocationModal from './modals/LocationModal';
import PaymentModal from './modals/PaymentModal';
import HoursModal from './modals/HoursModal';
import SupportModal from './modals/SupportModal';

export default function Navbar() {
  const [activeModal, setActiveModal] = useState<'payment' | 'hours' | 'location' | 'support' | null>(null);

  const { data } = useQuery({
    queryKey: ['menuData'],
    queryFn: fetchMenuData
  });

  const isOnline = data ? checkBusinessStatus(data.schedules) : false;

  const navItems = [
    { id: 'support', label: 'Soporte', icon: MessageCircle, color: 'hover:text-(--color-accent)' },
    { id: 'location', label: 'Ubicación', icon: MapPin, color: 'hover:text-(--color-primary)' },
    { id: 'payment', label: 'Pagar', icon: Wallet, color: 'hover:text-(--color-primary)' },
    { id: 'hours', label: 'Horarios', icon: Clock, color: 'hover:text-(--color-primary)' },
  ];

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 z-50 px-6 pb-8 pt-4 bg-gradient-to-t from-white via-white to-transparent">
        <div className="max-w-md mx-auto bg-(--color-primary-dark) rounded-[2.5rem] p-2 flex justify-between items-center shadow-2xl border border-white/10">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveModal(item.id as any)}
              className={`flex-1 flex flex-col items-center gap-1 py-3 transition-all rounded-full ${item.color} text-white/50`}
            >
              <item.icon size={20} />
              <span className="text-[8px] font-black uppercase tracking-widest">{item.label}</span>
            </button>
          ))}
        </div>
      </nav>

      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/80 backdrop-blur-md"
            />

            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-(--color-background) w-full max-w-sm rounded-[2.5rem] p-6 md:p-8 relative text-(--color-primary-dark) shadow-2xl z-10"
            >
              <div className="flex justify-between items-start mb-6">
                <div className="flex items-center gap-3">
                  <div className="bg-(--color-surface) p-3 rounded-2xl text-(--color-primary)">
                    {activeModal === 'location' && <MapPin size={24} />}
                    {activeModal === 'payment' && <Wallet size={24} />}
                    {activeModal === 'hours' && <Clock size={24} />}
                    {activeModal === 'support' && <MessageCircle size={24} />}
                  </div>
                  <div>
                    <h3 className="text-xl font-black italic uppercase tracking-tighter leading-none">
                      {activeModal === 'location' && 'Ubicación'}
                      {activeModal === 'payment' && 'Medios de Pago'}
                      {activeModal === 'hours' && 'Nuestros Horarios'}
                      {activeModal === 'support' && 'Soporte'}
                    </h3>
                    <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mt-1">
                      {activeModal === 'support' ? 'Chat directo con nosotros' : 'Información útil para vos'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setActiveModal(null)}
                  className="bg-(--color-surface) p-2 rounded-full text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="relative">
                {activeModal === 'location' && <LocationModal />}
                {activeModal === 'payment' && <PaymentModal />}
                {activeModal === 'hours' && <HoursModal schedules={data?.schedules || []} />}
                {activeModal === 'support' && <SupportModal isOnline={isOnline} />}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}