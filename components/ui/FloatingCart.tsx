'use client';
import { useState } from 'react';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, X, Plus, Minus, Send, Clock, Truck, Store, Banknote, CreditCard, Candy } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface FloatingCartProps {
  isOpenBusiness: boolean;
}

export default function FloatingCart({ isOpenBusiness }: FloatingCartProps) {
  const [isOpen, setIsOpen] = useState(false);
  const { cart, addToCart, removeFromCart, total, totalItems } = useCart();

  const [deliveryMethod, setDeliveryMethod] = useState<'delivery' | 'retiro'>('delivery');
  const [paymentMethod, setPaymentMethod] = useState<'efectivo' | 'transferencia'>('efectivo');
  const [kioscoExtra, setKioscoExtra] = useState('');

  const sendWhatsApp = () => {
    if (!isOpenBusiness) return;
    const phone = "5492634325471";
    const items = cart.map((i: any) => `• ${i.qty}x ${i.name}`).join('\\n');
    let msg = `¡Hola Rubén! 👋 Mi pedido:\\n\\n${items}\\n\\n`;
    msg += `--- \\n`;
    msg += `📍 *Entrega:* ${deliveryMethod === 'delivery' ? 'Delivery' : 'Local'}\\n`;
    msg += `💳 *Pago:* ${paymentMethod === 'efectivo' ? 'Efectivo' : 'Transferencia'}\\n`;
    
    if (kioscoExtra.trim()) {
      msg += `✨ *Extras Kiosco:* ${kioscoExtra}\\n`;
    }
    
    msg += `--- \\n`;
    msg += `💰 *Subtotal:* $${total}\\n`;
    msg += `\\n¡Quedo atento a la confirmación!`;

    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  if (totalItems === 0) return null;

  return (
    <>
      {/* Botón Flotante */}
      <motion.button
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(true)}
        className="fixed bottom-32 right-6 z-[60] bg-(--color-accent) text-white p-5 rounded-full shadow-2xl flex items-center gap-3"
      >
        <div className="relative">
          <ShoppingCart size={24} />
          <span className="absolute -top-2 -right-2 bg-white text-(--color-accent) text-[10px] font-black h-5 w-5 rounded-full flex items-center justify-center border-2 border-(--color-accent)">
            {totalItems}
          </span>
        </div>
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-md flex items-end justify-center p-4"
          >
            <motion.div 
              initial={{ y: '100%' }} animate={{ y: 0 }} exit={{ y: '100%' }}
              className="bg-(--color-background) w-full max-w-md rounded-[3rem] overflow-hidden flex flex-col max-h-[90vh] shadow-2xl"
            >
              {/* Header */}
              <div className="p-8 bg-(--color-primary-dark) text-white flex justify-between items-center">
                <div>
                  <h2 className="text-2xl font-black italic uppercase tracking-tighter">Tu Pedido</h2>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/50">Revisá tu selección</p>
                </div>
                <button onClick={() => setIsOpen(false)} className="bg-white/10 p-2 rounded-full hover:bg-white/20 transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Items */}
              <div className="flex-1 overflow-y-auto p-8 space-y-6 no-scrollbar">
                {cart.map((item: any) => (
                  <div key={item.id} className="flex justify-between items-center group">
                    <div className="space-y-1">
                      <h4 className="font-black italic uppercase text-(--color-primary-dark) tracking-tight group-hover:text-(--color-accent) transition-colors">{item.name}</h4>
                      <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">${item.price} c/u</p>
                    </div>
                    <div className="flex items-center gap-4 bg-(--color-surface) p-1.5 rounded-2xl border border-gray-100">
                      <button onClick={() => removeFromCart(item.id)} className="p-1 hover:text-(--color-accent) transition-colors"><Minus size={14} /></button>
                      <span className="font-black text-xs w-4 text-center">{item.qty}</span>
                      <button onClick={() => addToCart(item)} className="p-1 hover:text-(--color-accent) transition-colors"><Plus size={14} /></button>
                    </div>
                  </div>
                ))}

                {/* Extras Kiosco */}
                <div className="pt-4 border-t border-gray-100">
                  <div className="flex items-center gap-2 mb-3">
                    <Candy size={14} className="text-(--color-accent)" />
                    <h4 className="text-[10px] font-black uppercase text-gray-400 tracking-widest">¿Querés algo más del kiosco?</h4>
                  </div>
                  <textarea
                    value={kioscoExtra}
                    onChange={(e) => setKioscoExtra(e.target.value)}
                    placeholder="Ej: un alfajor, chicles, cigarrillos..."
                    className="w-full bg-(--color-surface) border border-gray-100 rounded-2xl p-4 text-xs font-bold italic focus:ring-2 focus:ring-(--color-accent) outline-none resize-none"
                    rows={2}
                  />
                </div>

                {/* Métodos de Entrega */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Método de Entrega</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setDeliveryMethod('delivery')}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                        deliveryMethod === 'delivery' ? 'border-(--color-primary) bg-(--color-primary)/5 text-(--color-primary)' : 'border-gray-50 text-gray-400'
                      }`}
                    >
                      <Truck size={20} />
                      <span className="text-[9px] font-black uppercase">Delivery</span>
                    </button>
                    <button 
                      onClick={() => setDeliveryMethod('retiro')}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                        deliveryMethod === 'retiro' ? 'border-(--color-primary) bg-(--color-primary)/5 text-(--color-primary)' : 'border-gray-50 text-gray-400'
                      }`}
                    >
                      <Store size={20} />
                      <span className="text-[9px] font-black uppercase">Retiro Local</span>
                    </button>
                  </div>
                </div>

                {/* Métodos de Pago */}
                <div className="space-y-4 pt-4 border-t border-gray-100">
                  <h4 className="text-[10px] font-black uppercase text-gray-300 tracking-[0.2em]">Medio de Pago</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setPaymentMethod('efectivo')}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === 'efectivo' ? 'border-(--color-accent) bg-(--color-accent)/5 text-(--color-accent)' : 'border-gray-50 text-gray-400'
                      }`}
                    >
                      <Banknote size={20} />
                      <span className="text-[9px] font-black uppercase">Efectivo</span>
                    </button>
                    <button 
                      onClick={() => setPaymentMethod('transferencia')}
                      className={`p-4 rounded-2xl border-2 flex flex-col items-center gap-2 transition-all ${
                        paymentMethod === 'transferencia' ? 'border-(--color-accent) bg-(--color-accent)/5 text-(--color-accent)' : 'border-gray-50 text-gray-400'
                      }`}
                    >
                      <CreditCard size={20} />
                      <span className="text-[9px] font-black uppercase">Transferencia</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Footer */}
              {!cart.length ? null : (
                <div className="p-8 bg-white border-t border-gray-100 space-y-6">
                  <div className="flex flex-col gap-4">
                    <div className="flex justify-between items-end">
                      <div className="space-y-1">
                        <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">Total Estimado</span>
                        <div className="text-4xl font-black italic text-(--color-primary-dark) tracking-tighter leading-none">${total}</div>
                      </div>
                      {kioscoExtra.trim() && (
                        <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="text-right">
                          <span className="text-[9px] font-black uppercase text-(--color-accent) tracking-[0.1em] flex items-center gap-1">
                            <Candy size={10} /> + Extras Kiosco
                          </span>
                          <span className="text-[9px] font-bold text-orange-400 italic">Pendiente cotizar</span>
                        </motion.div>
                      )}
                    </div>
                    
                    <button 
                      onClick={sendWhatsApp} 
                      disabled={!isOpenBusiness}
                      className={`w-full py-4 rounded-[1.5rem] font-black text-[11px] uppercase tracking-widest flex items-center justify-center gap-3 transition-all ${
                        isOpenBusiness ? 'bg-[#25D366] text-white shadow-lg shadow-green-500/20' : 'bg-gray-100 text-gray-400'
                      }`}
                    >
                      {isOpenBusiness ? (
                        <>
                          <Send size={16} /> 
                          {kioscoExtra.trim() ? "Consultar Total Final" : "Confirmar pedido"}
                        </>
                      ) : (
                        <><Clock size={16} /> Local Cerrado</>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}