import { useState } from "react";
import { Icons } from "./Icons";

export default function SaleSelector({ saleSelector, setSaleSelector, onConfirm }) {
  const [customerName, setCustomerName] = useState("");
  const maxStock = (Number(saleSelector.product.stock_vitrina) || 0) + (Number(saleSelector.product.stock_bodega) || 0);

  const handleConfirm = () => {
    onConfirm(customerName || "Cliente General");
  };

  return (
    <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-md z-[200] flex items-center justify-center p-6 animate-fade">
      <div className="bg-white w-full max-w-sm rounded-[3rem] p-10 animate-scale-in shadow-2xl border border-brand-gold/10">
        <div className="text-center mb-8">
           <h2 className="text-2xl font-serif font-bold text-brand-navy mb-2">Registrar Venta</h2>
           <p className="text-[10px] text-brand-gold font-black uppercase tracking-widest leading-relaxed">
             {saleSelector.product.name}
           </p>
        </div>
        
        <div className="space-y-6">
          <div className="space-y-3">
            <label className="text-[9px] font-bold text-brand-navy/40 uppercase tracking-widest ml-2">Nombre del Cliente</label>
            <input 
              type="text" 
              placeholder="Ej. Juan Pérez" 
              className="w-full bg-brand-bg border border-brand-navy/5 p-4 rounded-xl outline-none focus:border-brand-gold text-sm font-bold text-brand-navy"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
            />
          </div>

          <div className="space-y-3">
            <label className="text-[9px] font-bold text-brand-navy/40 uppercase tracking-widest ml-2 text-center block">Cantidad</label>
            <div className="flex items-center justify-center gap-6">
              <button onClick={() => setSaleSelector(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
                className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white transition-all">
                <Icons.Minus size={18} />
              </button>
              <span className="text-4xl font-serif font-bold text-brand-navy">{saleSelector.quantity}</span>
              <button onClick={() => setSaleSelector(prev => ({ ...prev, quantity: Math.min(maxStock, prev.quantity + 1) }))}
                className="w-12 h-12 bg-brand-bg rounded-xl flex items-center justify-center text-brand-navy hover:bg-brand-navy hover:text-white transition-all">
                <Icons.Plus size={18} />
              </button>
            </div>
          </div>
        </div>

        <div className="mt-10 space-y-3">
          <button onClick={handleConfirm}
            className="w-full bg-brand-navy text-white py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] shadow-xl hover:bg-brand-gold transition-all active:scale-95">
            Confirmar Venta
          </button>
          <button onClick={() => setSaleSelector({ isOpen: false, product: null, quantity: 1 })}
            className="w-full py-2 text-brand-navy/30 hover:text-red-500 font-bold uppercase tracking-widest text-[9px] transition-colors">
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
