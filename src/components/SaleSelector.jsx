import { Icons } from "./Icons";

export default function SaleSelector({ saleSelector, setSaleSelector, onConfirm }) {
  const maxStock = (parseInt(saleSelector.product.stock_vitrina) || 0) + (parseInt(saleSelector.product.stock_bodega) || 0);

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[150] flex items-center justify-center p-6">
      <div className="bg-white w-full max-w-sm rounded-[2.5rem] p-8 animate-slideUp shadow-2xl">
        <h2 className="text-xl font-serif font-bold italic mb-2 text-center">Registrar Venta</h2>
        <p className="text-[10px] text-stone-400 font-black uppercase text-center tracking-widest mb-8">{saleSelector.product.name}</p>
        
        <div className="flex items-center justify-center gap-8 mb-10">
          <button onClick={() => setSaleSelector(prev => ({ ...prev, quantity: Math.max(1, prev.quantity - 1) }))}
            className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-900 active:scale-90 transition-all">
            <Icons.Minus />
          </button>
          <span className="text-5xl font-serif font-bold">{saleSelector.quantity}</span>
          <button onClick={() => setSaleSelector(prev => ({ ...prev, quantity: Math.min(maxStock, prev.quantity + 1) }))}
            className="w-14 h-14 bg-stone-100 rounded-2xl flex items-center justify-center text-stone-900 active:scale-90 transition-all">
            <Icons.Plus />
          </button>
        </div>

        <div className="space-y-3">
          <button onClick={onConfirm}
            className="w-full bg-emerald-500 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[10px] shadow-lg shadow-emerald-200 active:scale-95 transition-all">
            CONFIRMAR VENTA
          </button>
          <button onClick={() => setSaleSelector({ isOpen: false, product: null, quantity: 1 })}
            className="w-full bg-stone-50 text-stone-400 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[9px] active:scale-95 transition-all">
            CANCELAR
          </button>
        </div>
      </div>
    </div>
  );
}
