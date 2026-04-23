import { useState, useMemo } from "react";
import { Icons } from "./Icons";
import { LOGO_URL, CATEGORIES } from "../data/initialData";

export default function ShopView({ products, onAdminClick }) {
  const [categoryFilter, setCategoryFilter] = useState('Todos');
  const [selectedProduct, setSelectedProduct] = useState(null);

  const filteredProducts = useMemo(() => 
    products.filter(p => categoryFilter === 'Todos' || p.category === categoryFilter), 
  [categoryFilter, products]);

  return (
    <div className="min-h-screen bg-[#c4c3bb] selection:bg-black selection:text-white text-stone-900">
      <nav className="fixed top-0 w-full bg-black/95 backdrop-blur-xl h-20 px-8 flex items-center justify-between z-[60] border-b border-white/5">
        <div className="flex items-center gap-3">
          <img src={LOGO_URL} className="w-10 h-10 rounded-full object-cover border border-white/20" alt="Logo" />
          <h1 className="text-2xl font-serif font-black tracking-tighter text-white italic">ISNA</h1>
        </div>
        <button onClick={onAdminClick} className="p-3 text-stone-600 hover:text-white transition-all"><Icons.Lock /></button>
      </nav>

      <header className="bg-black text-white pt-48 pb-24 text-center px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-30">
          {/* Vetas orgánicas estilo Cola de Pez Betta */}
          <svg className="absolute w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
            <defs>
              <linearGradient id="gold-flow" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="50%" stopColor="#fbbf24" stopOpacity="0.4" />
                <stop offset="100%" stopColor="transparent" />
              </linearGradient>
            </defs>
            {/* Curvas fluidas */}
            <path d="M-10,50 Q20,10 60,50 T110,50" fill="none" stroke="url(#gold-flow)" strokeWidth="0.5" className="animate-float" />
            <path d="M-10,60 Q30,20 70,60 T110,60" fill="none" stroke="url(#gold-flow)" strokeWidth="0.8" className="animate-float" style={{ animationDelay: '-3s' }} />
            <path d="M-10,40 Q25,0 65,40 T110,40" fill="none" stroke="url(#gold-flow)" strokeWidth="0.3" className="animate-float" style={{ animationDelay: '-6s' }} />
            <path d="M0,100 C20,80 50,110 80,80" fill="none" stroke="url(#gold-flow)" strokeWidth="0.5" className="animate-float" style={{ animationDelay: '-9s' }} />
            <path d="M100,20 C80,40 50,10 20,40" fill="none" stroke="url(#gold-flow)" strokeWidth="0.4" className="animate-float" style={{ animationDelay: '-12s' }} />
          </svg>
          
          {/* Resplandores suaves para dar volumen */}
          <div className="absolute top-1/4 right-0 w-96 h-96 bg-yellow-500/10 blur-[100px] rounded-full"></div>
          <div className="absolute bottom-1/4 left-0 w-80 h-80 bg-orange-500/5 blur-[120px] rounded-full"></div>
        </div>

        <div className="relative z-10 px-4">
          <img src={LOGO_URL} className="w-16 h-16 md:w-20 md:h-20 rounded-full object-cover mx-auto mb-6 md:mb-8 shadow-2xl border-2 border-white/10 animate-fade" alt="Logo" />
          <span className="text-[10px] md:text-sm font-black uppercase tracking-[0.6em] md:tracking-[0.8em] text-stone-600 block mb-3 md:mb-4">CALIDAD Y ELEGANCIA</span>
          <h2 className="text-5xl md:text-8xl font-serif tracking-tighter mb-6 md:mb-8 font-bold italic text-glow-gold">ISNA</h2>
          <p className="text-[11px] md:text-base font-medium uppercase tracking-[0.3em] md:tracking-[0.5em] text-stone-500 italic">VENTAS AL POR MAYOR Y AL DETAL</p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex justify-center mb-12 border-b border-stone-200">
          <div className="flex overflow-x-auto gap-3 pb-8 no-scrollbar">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setCategoryFilter(cat)} className={`px-8 py-3 rounded-full text-[9px] font-black uppercase tracking-[0.1em] transition-all whitespace-nowrap ${categoryFilter === cat ? 'bg-black text-white shadow-lg' : 'bg-white text-stone-400 border border-stone-200 hover:border-stone-400'}`}>{cat}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6 md:gap-10">
          {filteredProducts.map((p, i) => (
            <div key={p.id} className={`group cursor-pointer animate-slide-up stagger-${Math.min((i % 6) + 1, 6)}`} onClick={() => setSelectedProduct(p)}>
              <div className="aspect-[4/5] rounded-[1.8rem] overflow-hidden bg-white shadow-sm relative mb-4 group-hover:shadow-xl transition-all duration-500">
                <img src={p.image || 'https://via.placeholder.com/400'} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                { (parseInt(p.stock_vitrina) + parseInt(p.stock_bodega)) === 0 && (
                  <div className="absolute inset-0 bg-black/60 flex items-center justify-center backdrop-blur-[1px]">
                    <span className="text-white text-[8px] font-black uppercase tracking-[0.3em] border border-white/20 px-4 py-2 italic">Sold Out</span>
                  </div>
                )}
              </div>
              <div className="text-center px-2">
                <p className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-1">{p.category}</p>
                <h3 className="text-sm md:text-lg font-serif text-stone-900 font-bold group-hover:italic transition-all duration-300 line-clamp-1">{p.name}</h3>
                <p className="text-stone-500 mt-1 font-light tracking-[0.1em] text-base italic">${p.price.toLocaleString()}</p>
              </div>
            </div>
          ))}
          {filteredProducts.length === 0 && (
            <div className="col-span-full text-center py-20">
              <p className="text-stone-400 text-sm uppercase tracking-widest">No hay productos en esta categoría</p>
            </div>
          )}
        </div>
      </main>

      <footer className="bg-black text-white py-24 px-8 text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-5 pointer-events-none">
          <div className="absolute bottom-0 left-0 w-full h-[50%] bg-gradient-to-t from-yellow-600/20 to-transparent"></div>
        </div>
        
        <div className="relative z-10">
          <img src={LOGO_URL} className="w-24 h-24 rounded-full object-cover mx-auto mb-8 opacity-100 shadow-[0_0_30px_rgba(251,191,36,0.3)] border border-white/10" alt="Logo" />
          <h3 className="text-4xl font-serif italic mb-8 text-glow-gold">ISNA</h3>
          <p className="text-sm uppercase tracking-[0.8em] font-black text-glow-gold">Zarzal Valle</p>
          <div className="mt-20 text-stone-700 text-[10px] font-black uppercase tracking-[0.8em]">© 2025 ISNA BOUTIQUE</div>
        </div>
      </footer>

      {selectedProduct && (
        <div className="fixed inset-0 bg-black/95 backdrop-blur-2xl z-[200] flex items-center justify-center p-4">
          <div className="bg-white rounded-[3rem] w-full max-w-4xl max-h-[90vh] overflow-y-auto relative p-8 md:p-16 animate-slideUp">
            <button onClick={() => setSelectedProduct(null)} className="absolute top-8 right-8 bg-stone-50 p-4 rounded-full"><Icons.X /></button>
            <div className="flex flex-col md:flex-row gap-12 mt-6">
              <div className="w-full md:w-1/2">
                <img src={selectedProduct.image || 'https://via.placeholder.com/600'} className="w-full aspect-[4/5] object-cover rounded-[2.5rem] shadow-xl" />
              </div>
              <div className="flex-1 flex flex-col justify-center">
                <span className="text-[10px] font-black text-stone-300 uppercase tracking-[0.5em] mb-4">{selectedProduct.category}</span>
                <h2 className="text-4xl md:text-5xl font-serif font-black mb-6 text-stone-900 italic">{selectedProduct.name}</h2>
                <p className="text-3xl font-light text-stone-800 mb-10 italic">${selectedProduct.price.toLocaleString()}</p>
                <div className="border-l-4 border-stone-900 pl-8 mb-12">
                  <p className="text-stone-500 text-lg italic leading-relaxed">{selectedProduct.description || 'Pieza exclusiva seleccionada por ISNA Boutique.'}</p>
                </div>
                <button className="w-full bg-black text-white py-6 rounded-3xl flex items-center justify-center gap-4 font-black uppercase tracking-[0.3em] text-[11px] btn-premium">
                  <Icons.WhatsApp /> Consultar Disponibilidad
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
