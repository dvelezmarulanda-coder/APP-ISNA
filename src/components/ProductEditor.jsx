import { useRef } from "react";
import { Icons } from "./Icons";

export default function ProductEditor({ editForm, setEditForm, onSave, onClose, categories }) {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => setEditForm({ ...editForm, image: reader.result });
    if (e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
  };

  const selectableCategories = (categories || []).filter(c => c !== 'Todos');

  return (
    <div className="fixed inset-0 bg-brand-bg z-[200] flex flex-col animate-fade-in overflow-y-auto">
      <div className="p-8 border-b border-brand-navy/5 flex justify-between items-center bg-white sticky top-0 z-10 shadow-sm">
        <div className="flex flex-col">
          <h2 className="text-3xl font-serif font-bold text-brand-navy leading-none">{editForm.id ? 'Editar Producto' : 'Nuevo Producto'}</h2>
          <span className="text-[10px] text-brand-gold uppercase tracking-[0.3em] font-bold mt-2">Gestión de Inventario</span>
        </div>
        <button onClick={onClose} className="p-4 bg-brand-bg text-brand-navy rounded-full hover:bg-brand-navy hover:text-white transition-all">
          <Icons.X size={20} />
        </button>
      </div>
      
      <form onSubmit={onSave} className="flex-1 p-8 md:p-12 space-y-12 max-w-5xl mx-auto w-full pb-32">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
          {/* Image Upload Area */}
          <div onClick={() => fileInputRef.current.click()} className="aspect-square bg-white rounded-[2.5rem] flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-brand-navy/10 cursor-pointer hover:border-brand-gold hover:bg-white/80 transition-all shadow-sm group">
            {editForm.image ? (
              <img src={editForm.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt="Vista previa" />
            ) : (
              <div className="text-center text-brand-navy/20 group-hover:text-brand-gold transition-colors">
                <Icons.Camera size={48} className="mx-auto mb-4" />
                <p className="text-[10px] font-black uppercase tracking-widest">Añadir Imagen</p>
              </div>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
          </div>

          <div className="space-y-8">
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-brand-navy/40 uppercase tracking-widest ml-4">Información Principal</label>
              <input required placeholder="Nombre del artículo" className="w-full p-6 bg-white rounded-2xl border border-brand-navy/5 outline-none font-bold text-brand-navy focus:border-brand-gold shadow-sm transition-all" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
            </div>
            
            <div className="space-y-3">
              <label className="text-[10px] font-bold text-brand-navy/40 uppercase tracking-widest ml-4">Categoría</label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {selectableCategories.map(cat => (
                  <button key={cat} type="button" onClick={() => setEditForm({...editForm, category: cat})} className={`py-4 rounded-xl text-[9px] font-black uppercase border transition-all ${editForm.category === cat ? 'bg-brand-navy text-white border-brand-navy shadow-lg' : 'bg-white text-brand-navy/40 border-brand-navy/5 hover:border-brand-gold'}`}>
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-brand-navy/40 uppercase tracking-widest ml-4">Precio Detal</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-brand-navy/30">$</span>
                  <input type="number" required className="w-full p-6 pl-10 bg-white rounded-2xl border border-brand-navy/5 outline-none font-serif text-xl font-bold text-brand-navy focus:border-brand-gold shadow-sm" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-brand-gold uppercase tracking-widest ml-4">Precio Mayorista</label>
                <div className="relative">
                  <span className="absolute left-6 top-1/2 -translate-y-1/2 font-bold text-brand-gold/30">$</span>
                  <input type="number" required className="w-full p-6 pl-10 bg-white rounded-2xl border border-brand-gold/10 outline-none font-serif text-xl font-bold text-brand-gold focus:border-brand-gold shadow-sm" value={editForm.wholesale_price || ''} onChange={e => setEditForm({...editForm, wholesale_price: e.target.value})} />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-brand-navy/40 uppercase tracking-widest ml-4">Stock Vitrina</label>
                <input type="number" required className="w-full p-6 bg-white rounded-2xl border border-brand-navy/5 outline-none font-bold text-brand-navy focus:border-brand-gold shadow-sm" value={editForm.stock_vitrina} onChange={e => setEditForm({...editForm, stock_vitrina: e.target.value})} />
              </div>
              <div className="space-y-3">
                <label className="text-[10px] font-bold text-brand-navy/40 uppercase tracking-widest ml-4">Stock Bodega</label>
                <input type="number" required className="w-full p-6 bg-white rounded-2xl border border-brand-navy/5 outline-none font-bold text-brand-navy focus:border-brand-gold shadow-sm" value={editForm.stock_bodega} onChange={e => setEditForm({...editForm, stock_bodega: e.target.value})} />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-[10px] font-bold text-brand-navy/40 uppercase tracking-widest ml-4">Descripción Exclusiva</label>
              <textarea rows="4" className="w-full p-6 bg-white rounded-2xl border border-brand-navy/5 outline-none italic text-brand-navy/60 focus:border-brand-gold shadow-sm" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="flex gap-4 pt-10">
          <button type="button" onClick={onClose} className="flex-1 py-6 rounded-3xl font-bold uppercase tracking-widest text-[10px] text-brand-navy/40 hover:bg-white transition-all">Cancelar</button>
          <button type="submit" className="flex-[2] bg-brand-navy text-white py-6 rounded-3xl font-bold uppercase tracking-[0.3em] text-[11px] shadow-2xl hover:bg-brand-gold transition-all active:scale-95">
            {editForm.id ? 'Actualizar Producto' : 'Guardar en Catálogo'}
          </button>
        </div>
      </form>
    </div>
  );
}
