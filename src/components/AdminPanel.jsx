import { useState, useMemo } from "react";
import { Icons } from "./Icons";
import { LOGO_URL } from "../data/initialData";
import SaleSelector from "./SaleSelector";
import SalesHistory from "./SalesHistory";
import ProductEditor from "./ProductEditor";

export default function AdminPanel({ store, onExit }) {
  const { products, sales, stats, notification, showToast, registerSale, saveProduct } = store;
  const [adminSearch, setAdminSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [saleSelector, setSaleSelector] = useState({ isOpen: false, product: null, quantity: 1 });

  const adminFilteredProducts = useMemo(() =>
    products.filter(p => p.name?.toLowerCase().includes(adminSearch.toLowerCase())),
  [adminSearch, products]);

  const handleRegisterSale = () => {
    registerSale(saleSelector.product, saleSelector.quantity);
    setSaleSelector({ isOpen: false, product: null, quantity: 1 });
  };

  return (
    <div className="min-h-screen bg-[#c4c3bb] pb-32">
      {notification && (
        <div className={`fixed top-20 left-1/2 -translate-x-1/2 z-[200] px-6 py-3 rounded-full shadow-2xl text-[10px] font-black uppercase tracking-widest animate-bounce ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-emerald-500 text-white'}`}>
          {notification.message}
        </div>
      )}

      <nav className="bg-white border-b h-16 px-4 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-2">
          <img src={LOGO_URL} className="w-8 h-8 rounded-full object-cover" alt="Logo" />
          <h1 className="font-serif font-black tracking-tighter text-stone-900">ADMIN ISNA</h1>
        </div>
        <button onClick={onExit} className="text-[10px] font-bold uppercase text-stone-400 px-4 py-2 bg-stone-50 rounded-full">Salir</button>
      </nav>

      <div className="p-4 space-y-4 max-w-2xl mx-auto">
        <div className="bg-stone-900 text-white p-8 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-10 pointer-events-none">
            <div className="absolute top-[-10%] left-[-10%] w-[120%] h-[20%] bg-yellow-500 blur-[80px] rotate-12"></div>
            <div className="absolute bottom-[-10%] right-[-10%] w-[120%] h-[20%] bg-yellow-600 blur-[80px] -rotate-12"></div>
          </div>
          <p className="relative z-10 text-[10px] uppercase tracking-[0.2em] text-stone-500 font-bold mb-1">Caja de Hoy</p>
          <h3 className="relative z-10 text-4xl font-serif font-bold mb-6">${stats.total.toLocaleString()}</h3>
          <button onClick={() => setIsHistoryOpen(true)} className="relative z-10 w-full bg-white/5 py-4 rounded-2xl text-[9px] font-black uppercase tracking-widest flex items-center justify-center gap-2 border border-white/10 hover:bg-white/10 transition-all">
            <Icons.History /> Historial de Hoy ({stats.count})
          </button>
        </div>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 text-stone-400"><Icons.Search /></div>
            <input type="text" placeholder="Buscar en inventario..." className="w-full p-4 pl-12 rounded-2xl border-none shadow-sm outline-none text-sm" value={adminSearch} onChange={e => setAdminSearch(e.target.value)} />
          </div>
          <button onClick={() => { setEditForm({ name: "", category: "Relojes", price: 0, stock_vitrina: 1, stock_bodega: 0, image: "", description: "" }); setIsEditing(true); }} className="bg-stone-900 text-white px-6 rounded-2xl shadow-lg active:scale-95 transition-all">
            <Icons.Plus />
          </button>
        </div>

        <div className="space-y-3">
          {adminFilteredProducts.map(p => (
            <div key={p.id} className="bg-white p-3 rounded-[1.8rem] shadow-sm flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <img src={p.image || 'https://via.placeholder.com/100'} className="w-14 h-14 rounded-2xl object-cover" />
                  {(parseInt(p.stock_vitrina) + parseInt(p.stock_bodega)) <= 0 && (
                    <div className="absolute inset-0 bg-red-500/20 rounded-2xl border border-red-500/50"></div>
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm text-stone-900">{p.name}</p>
                  <p className={`text-[10px] uppercase font-black tracking-wider ${(parseInt(p.stock_vitrina) + parseInt(p.stock_bodega)) <= 0 ? 'text-red-500' : 'text-stone-400'}`}>
                    Stock: {(parseInt(p.stock_vitrina) + parseInt(p.stock_bodega))} • ${p.price.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex gap-1">
                <button onClick={() => {
                  const totalStock = (parseInt(p.stock_vitrina) || 0) + (parseInt(p.stock_bodega) || 0);
                  if (totalStock <= 0) { showToast('Sin stock disponible', 'error'); return; }
                  setSaleSelector({ isOpen: true, product: p, quantity: 1 });
                }} className="p-3 text-emerald-600 bg-emerald-50 rounded-xl active:bg-emerald-100" title="Vender">
                  <Icons.Tag />
                </button>
                <button onClick={() => { setEditForm({...p}); setIsEditing(true); }} className="p-3 text-stone-400 bg-stone-50 rounded-xl active:bg-stone-100">
                  <Icons.Edit />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {saleSelector.isOpen && (
        <SaleSelector saleSelector={saleSelector} setSaleSelector={setSaleSelector} onConfirm={handleRegisterSale} />
      )}

      {isHistoryOpen && (
        <SalesHistory sales={sales} onClose={() => setIsHistoryOpen(false)} />
      )}

      {isEditing && (
        <ProductEditor editForm={editForm} setEditForm={setEditForm} onSave={(e) => { e.preventDefault(); saveProduct(editForm); setIsEditing(false); }} onClose={() => setIsEditing(false)} />
      )}
    </div>
  );
}
