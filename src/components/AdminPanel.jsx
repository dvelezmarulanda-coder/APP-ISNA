import { useState, useMemo } from "react";
import { Icons } from "./Icons";
import { LOGO_URL } from "../data/initialData";
import SaleSelector from "./SaleSelector";
import ProductEditor from "./ProductEditor";

export default function AdminPanel({ store, onExit }) {
  const { 
    products = [], 
    sales = [], 
    categories = [], 
    notification, 
    showToast, 
    registerSale, 
    saveProduct, 
    saveCategory, 
    deleteCategory, 
    updateSaleStatus,
    clearSalesHistory
  } = store || {};

  const [activeTab, setActiveTab] = useState("dashboard");
  const [adminSearch, setAdminSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState(null);
  const [newCatName, setNewCatName] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [saleSelector, setSaleSelector] = useState({ isOpen: false, product: null, quantity: 1 });
  const [expandedSale, setExpandedSale] = useState(null);

  const dashboardStats = useMemo(() => {
    try {
      const safeSales = sales || [];
      const safeProducts = products || [];
      
      const totalRevenue = safeSales.reduce((acc, s) => acc + (Number(s?.price || 0) * (Number(s?.quantity) || 1)), 0);
      const totalSalesCount = safeSales.length;
      const totalProducts = safeProducts.length;
      const criticalStockCount = safeProducts.filter(p => p && (Number(p.stock_vitrina || 0) + Number(p.stock_bodega || 0)) <= 2).length;
      
      const productSales = {};
      safeSales.forEach(s => {
        if (s && s.name) {
          productSales[s.name] = (productSales[s.name] || 0) + (Number(s.quantity) || 1);
        }
      });
      const topProducts = Object.entries(productSales)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 5)
        .map(([name, qty]) => ({ name, qty }));

      return { totalRevenue, totalSalesCount, totalProducts, criticalStockCount, topProducts };
    } catch (e) {
      console.error("Dashboard stats error:", e);
      return { totalRevenue: 0, totalSalesCount: 0, totalProducts: 0, criticalStockCount: 0, topProducts: [] };
    }
  }, [sales, products]);

  const adminFilteredProducts = useMemo(() => {
    const safeProducts = products || [];
    const search = (adminSearch || "").toLowerCase();
    return safeProducts.filter(p => p && p.name && p.name.toLowerCase().includes(search));
  }, [adminSearch, products]);

  const handleRegisterSale = (customerName) => {
    if (saleSelector.product && registerSale) {
      registerSale(saleSelector.product, saleSelector.quantity, customerName);
    }
    setSaleSelector({ isOpen: false, product: null, quantity: 1 });
  };

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Icons.Layout ? <Icons.Layout size={18} /> : null },
    { id: 'products', label: 'Productos', icon: Icons.Package ? <Icons.Package size={18} /> : null },
    { id: 'categories', label: 'Categorías', icon: Icons.Layers ? <Icons.Layers size={18} /> : null },
    { id: 'sales', label: 'Ventas', icon: Icons.ShoppingCart ? <Icons.ShoppingCart size={18} /> : null },
  ];

  return (
    <div className="flex min-h-screen bg-brand-bg font-sans text-brand-navy">
      {notification && (
        <div className={`fixed top-6 right-6 z-[300] px-6 py-3 rounded-xl shadow-2xl text-xs font-bold animate-fade-in ${notification.type === 'error' ? 'bg-red-500 text-white' : 'bg-brand-navy text-white'}`}>
          {notification.message}
        </div>
      )}

      {isSidebarOpen && <div className="fixed inset-0 bg-brand-navy/60 backdrop-blur-sm z-[150] lg:hidden" onClick={() => setIsSidebarOpen(false)} />}

      <aside className={`w-64 bg-brand-navy text-white flex flex-col fixed h-full z-[160] transition-transform duration-300 lg:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex items-center gap-4 border-b border-white/5">
          <img src={LOGO_URL} className="w-10 h-10 rounded-full object-cover border border-brand-gold/30" alt="Logo" />
          <div className="flex flex-col">
            <h1 className="text-lg font-serif font-black tracking-tighter text-white leading-none">ISNA</h1>
            <span className="font-bold tracking-widest text-[8px] opacity-40 uppercase">Management</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2">
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => { setActiveTab(item.id); setIsSidebarOpen(false); setExpandedSale(null); }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all text-sm font-medium ${activeTab === item.id ? 'bg-white/10 text-brand-gold shadow-sm' : 'text-white/40 hover:text-white hover:bg-white/5'}`}
            >
              {item.icon}
              {item.label}
            </button>
          ))}
        </nav>

        <div className="p-6 border-t border-white/5">
          <button onClick={onExit} className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 text-white/60 rounded-xl hover:bg-red-500 hover:text-white transition-all text-[10px] font-bold uppercase tracking-widest">
            Salir del Panel
          </button>
        </div>
      </aside>

      <main className="flex-1 lg:ml-64 p-4 md:p-10">
        <header className="flex justify-between items-center mb-8 md:mb-10">
          <div className="flex items-center gap-4">
            <button onClick={() => setIsSidebarOpen(true)} className="lg:hidden p-3 bg-white rounded-xl shadow-sm border border-brand-navy/5 text-brand-navy">
              {Icons.Menu && <Icons.Menu size={20} />}
            </button>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold text-brand-navy capitalize">{activeTab}</h2>
              <p className="text-brand-navy/40 text-xs md:text-sm mt-1">Gestión avanzada ISNA Boutique</p>
            </div>
          </div>
          <img src={LOGO_URL} className="w-10 h-10 md:w-12 md:h-12 rounded-full border-2 border-white shadow-sm" alt="Admin" />
        </header>

        {activeTab === 'dashboard' && (
          <div className="space-y-6 md:space-y-10 animate-fade-in">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
              <StatCard title="Ingresos" value={`$ ${Number(dashboardStats.totalRevenue || 0).toLocaleString()}`} icon={Icons.TrendingUp && <Icons.TrendingUp size={20} className="text-brand-navy" />} sub="Total hoy" />
              <StatCard title="Ventas" value={dashboardStats.totalSalesCount} icon={Icons.ShoppingCart && <Icons.ShoppingCart size={20} className="text-brand-navy" />} sub="Órdenes" />
              <StatCard title="Stock" value={dashboardStats.totalProducts} icon={Icons.Package && <Icons.Package size={20} className="text-brand-navy" />} sub="Catálogo" />
              <StatCard title="Alerta" value={dashboardStats.criticalStockCount} icon={Icons.AlertCircle && <Icons.AlertCircle size={20} className="text-red-500" />} sub="Crítico" isCritical={dashboardStats.criticalStockCount > 0} />
            </div>
            
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-brand-navy/5">
              <h3 className="text-lg font-bold text-brand-navy mb-6 md:mb-8">Top Productos</h3>
              <div className="space-y-6">
                {(dashboardStats.topProducts || []).map((p, i) => (
                  <div key={i} className="space-y-2">
                    <div className="flex justify-between text-xs">
                      <span className="font-bold text-brand-navy/70">{p.name}</span>
                      <span className="font-black text-brand-gold">{p.qty}</span>
                    </div>
                    <div className="h-2 bg-brand-bg rounded-full overflow-hidden">
                      <div className="h-full bg-brand-navy rounded-full" style={{ width: `${(p.qty / (dashboardStats.topProducts[0]?.qty || 1)) * 100}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'products' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-brand-navy/30">{Icons.Search && <Icons.Search size={20} />}</div>
                <input type="text" placeholder="Buscar..." className="w-full bg-white border border-brand-navy/5 p-4 pl-12 rounded-2xl shadow-sm outline-none text-sm focus:border-brand-gold transition-all" value={adminSearch} onChange={e => setAdminSearch(e.target.value)} />
              </div>
              <button onClick={() => { setEditForm({ name: "", category: categories[1] || "Relojes", price: 0, wholesale_price: 0, stock_vitrina: 1, stock_bodega: 0, image: "", description: "" }); setIsEditing(true); }} className="bg-brand-navy text-white px-8 py-4 sm:py-0 rounded-2xl shadow-lg flex items-center justify-center gap-2 text-sm font-bold hover:bg-brand-gold transition-all">
                {Icons.Plus && <Icons.Plus size={20} />} Nuevo
              </button>
            </div>
            <div className="space-y-4">
              {adminFilteredProducts.map(p => (
                <div key={p?.id} className="bg-white p-4 rounded-2xl shadow-sm border border-brand-navy/5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:border-brand-gold/30 transition-all">
                  <div className="flex items-center gap-4">
                    <img src={p?.image || 'https://via.placeholder.com/100'} className="w-14 h-14 md:w-16 md:h-16 rounded-xl object-cover" />
                    <div className="flex-1">
                      <h4 className="font-bold text-brand-navy text-sm md:text-base leading-tight">{p?.name}</h4>
                      <p className="text-[9px] text-brand-gold font-bold uppercase tracking-widest">{p?.category}</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between md:justify-end gap-4 md:gap-12 border-t md:border-t-0 pt-4 md:pt-0">
                    <div className="text-left md:text-right">
                      <p className="text-[8px] md:text-[10px] text-brand-navy/30 font-bold uppercase tracking-widest">Precios</p>
                      <p className="text-xs md:text-sm font-bold text-brand-navy">${Number(p?.price || 0).toLocaleString()} <span className="text-brand-gold ml-1 md:ml-2">(${Number(p?.wholesale_price || p?.price || 0).toLocaleString()})</span></p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-[8px] md:text-[10px] text-brand-navy/30 font-bold uppercase tracking-widest">Stock</p>
                      <p className="text-xs md:text-sm font-bold text-brand-navy">{(Number(p?.stock_vitrina || 0) + Number(p?.stock_bodega || 0))}</p>
                    </div>
                    <div className="flex gap-1 md:gap-2">
                      <button onClick={() => { setEditForm({...p}); setIsEditing(true); }} className="p-3 text-brand-navy/20 hover:text-brand-navy hover:bg-brand-bg rounded-xl transition-all">{Icons.Edit && <Icons.Edit size={18} />}</button>
                      <button onClick={() => {
                        const totalStock = (Number(p?.stock_vitrina) || 0) + (Number(p?.stock_bodega) || 0);
                        if (totalStock <= 0) { showToast && showToast('Sin stock disponible', 'error'); return; }
                        setSaleSelector({ isOpen: true, product: p, quantity: 1 });
                      }} className="p-3 text-brand-navy/20 hover:text-brand-gold hover:bg-brand-bg rounded-xl transition-all">{Icons.ShoppingCart && <Icons.ShoppingCart size={18} />}</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'categories' && (
          <div className="max-w-2xl animate-fade-in space-y-6 md:space-y-8">
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-brand-navy/5">
              <h3 className="text-lg font-bold text-brand-navy mb-6">Nueva Categoría</h3>
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <input type="text" placeholder="Nombre..." className="flex-1 bg-brand-bg border border-brand-navy/5 p-4 rounded-xl outline-none focus:border-brand-gold text-sm" value={newCatName} onChange={e => setNewCatName(e.target.value)} />
                <button onClick={() => { saveCategory && saveCategory(newCatName); setNewCatName(''); }} className="bg-brand-navy text-white px-8 py-4 sm:py-0 rounded-xl font-bold text-xs hover:bg-brand-gold transition-all">Agregar</button>
              </div>
            </div>
            <div className="bg-white p-6 md:p-8 rounded-3xl shadow-sm border border-brand-navy/5">
              <h3 className="text-lg font-bold text-brand-navy mb-6">Lista Actual</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(categories || []).map(cat => (
                  <div key={cat} className="flex justify-between items-center p-4 bg-brand-bg rounded-xl border border-brand-navy/5">
                    <span className="text-sm font-bold text-brand-navy">{cat}</span>
                    {cat !== 'Todos' && <button onClick={() => deleteCategory && deleteCategory(cat)} className="text-brand-navy/20 hover:text-red-500 transition-colors">{Icons.X && <Icons.X size={16} />}</button>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'sales' && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
              <div className="flex flex-col">
                 <h3 className="text-xl font-bold text-brand-navy">Historial de Ventas</h3>
                 <p className="text-[10px] text-brand-navy/30 uppercase tracking-widest font-bold">Registro detallado de transacciones</p>
              </div>
              <button 
                onClick={() => {
                  if(window.confirm('¿Estás seguro de que deseas REINICIAR todo el historial de ventas? Esta acción no se puede deshacer.')) {
                    clearSalesHistory();
                  }
                }}
                className="px-6 py-3 bg-red-50 text-red-600 rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-red-600 hover:text-white transition-all border border-red-100"
              >
                Reiniciar Ventas Diarias
              </button>
            </div>
            <div className="grid grid-cols-1 gap-4">
              {(!sales || sales.length === 0) ? (
                <div className="p-20 text-center bg-white rounded-3xl border border-brand-navy/5">
                  {Icons.History && <Icons.History size={48} className="mx-auto mb-4 text-brand-navy/10" />}
                  <p className="text-brand-navy/40 font-serif italic">No hay ventas registradas aún.</p>
                </div>
              ) : (
                sales.map(s => (
                  <div key={s?.id} className={`bg-white p-6 rounded-3xl shadow-sm border ${expandedSale === s?.id ? 'border-brand-gold shadow-xl' : 'border-brand-navy/5'} flex flex-col gap-6 transition-all duration-500`}>
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div className="flex gap-4">
                        <div className="w-12 h-12 bg-brand-bg rounded-2xl flex items-center justify-center text-brand-navy border border-brand-navy/5">{Icons.Package && <Icons.Package size={24} />}</div>
                        <div>
                          <h4 className="font-bold text-brand-navy leading-none">{s?.name}</h4>
                          <p className="text-[10px] text-brand-navy/40 font-bold uppercase tracking-widest mt-2">Cliente: <span className="text-brand-navy">{s?.customerData?.name || s?.customer || 'Cliente General'}</span></p>
                          <p className="text-[8px] text-brand-navy/30 mt-1 uppercase tracking-widest">{s?.dateStr} • {s?.timestamp ? new Date(s.timestamp).toLocaleDateString() : '-'}</p>
                        </div>
                      </div>
                      <div className="flex flex-wrap items-center gap-4 md:gap-8 w-full md:w-auto">
                        <div className="text-right">
                          <p className="text-[8px] text-brand-navy/30 font-bold uppercase tracking-widest">Total</p>
                          <p className="text-base font-black text-brand-navy">${(Number(s?.price || 0) * Number(s?.quantity || 1)).toLocaleString()}</p>
                        </div>
                        <span className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${s?.status === 'Despachado' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>{s?.status || 'Pendiente'}</span>
                        <div className="flex gap-2">
                          <button onClick={() => setExpandedSale(expandedSale === s?.id ? null : s?.id)} className="p-3 bg-brand-bg text-brand-navy rounded-xl hover:bg-brand-navy hover:text-white transition-all shadow-sm">{expandedSale === s?.id ? (Icons.Minus && <Icons.Minus size={18} />) : (Icons.Search && <Icons.Search size={18} />)}</button>
                          <button onClick={() => updateSaleStatus && updateSaleStatus(s?.id, s?.status === 'Despachado' ? 'Pendiente' : 'Despachado')} className={`px-4 md:px-6 py-3 rounded-xl text-[9px] font-bold uppercase tracking-widest transition-all ${s?.status === 'Despachado' ? 'bg-amber-500 text-white' : 'bg-brand-navy text-white hover:bg-emerald-600'}`}>{s?.status === 'Despachado' ? 'Revertir' : 'Despachar'}</button>
                        </div>
                      </div>
                    </div>
                    {expandedSale === s?.id && (
                      <div className="pt-6 border-t border-brand-navy/5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 animate-fade-in">
                        <div>
                          <p className="text-[9px] font-bold text-brand-gold uppercase tracking-widest mb-2">Información del Cliente</p>
                          <p className="text-sm font-bold text-brand-navy">{s?.customerData?.name || s?.customer || 'Cliente General'}</p>
                          <p className="text-xs text-brand-navy/50 mt-1">{s?.customerData?.phone || 'Sin teléfono'}</p>
                        </div>
                        <div className="md:col-span-2">
                          <p className="text-[9px] font-bold text-brand-gold uppercase tracking-widest mb-2">Dirección de Despacho</p>
                          <p className="text-sm font-bold text-brand-navy">{s?.customerData?.address || 'Venta presencial'}</p>
                          <p className="text-xs text-brand-navy/50 mt-1">{s?.customerData?.city || '-'}</p>
                        </div>
                        <div className="flex justify-end items-end">
                           <a href={`https://wa.me/${(s?.customerData?.phone || '').replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-2 bg-emerald-500 text-white px-4 py-2 rounded-lg text-[10px] font-bold uppercase tracking-widest hover:bg-emerald-600 transition-all">{Icons.WhatsApp && <Icons.WhatsApp size={16} />} Contactar</a>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </main>

      {saleSelector.isOpen && <SaleSelector saleSelector={saleSelector} setSaleSelector={setSaleSelector} onConfirm={handleRegisterSale} />}
      {isEditing && <ProductEditor editForm={editForm} setEditForm={setEditForm} onSave={(e) => { e.preventDefault(); saveProduct && saveProduct(editForm); setIsEditing(false); }} onClose={() => setIsEditing(false)} categories={categories} />}
    </div>
  );
}

function StatCard({ title, value, icon, sub, isCritical }) {
  return (
    <div className={`bg-white p-6 md:p-8 rounded-3xl shadow-sm border ${isCritical ? 'border-red-100 bg-red-50/50' : 'border-brand-navy/5'}`}>
      <div className="flex items-center justify-between mb-4">
        <div className="p-2 md:p-3 rounded-2xl bg-brand-bg border border-brand-navy/5 w-fit">{icon}</div>
        <p className={`text-[8px] md:text-[10px] font-bold uppercase tracking-widest px-2 py-1 rounded-full ${isCritical ? 'bg-red-100 text-red-600' : 'bg-brand-bg text-brand-navy/30'}`}>{sub}</p>
      </div>
      <div>
        <p className="text-[10px] font-bold text-brand-navy/30 uppercase tracking-widest mb-1">{title}</p>
        <h4 className={`text-xl md:text-2xl font-black ${isCritical ? 'text-red-600' : 'text-brand-navy'}`}>{value}</h4>
      </div>
    </div>
  );
}
