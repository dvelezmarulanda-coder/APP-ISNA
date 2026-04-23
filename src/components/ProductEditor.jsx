import { useRef } from "react";
import { Icons } from "./Icons";
import { CATEGORIES } from "../data/initialData";

export default function ProductEditor({ editForm, setEditForm, onSave, onClose }) {
  const fileInputRef = useRef(null);

  const handleImageUpload = (e) => {
    const reader = new FileReader();
    reader.onload = () => setEditForm({ ...editForm, image: reader.result });
    if (e.target.files?.[0]) reader.readAsDataURL(e.target.files[0]);
  };

  // Only use categories other than 'Todos'
  const selectableCategories = CATEGORIES.filter(c => c !== 'Todos');

  return (
    <div className="fixed inset-0 bg-white z-[110] flex flex-col animate-slideUp">
      <div className="p-6 border-b flex justify-between items-center bg-white sticky top-0">
        <h2 className="text-2xl font-serif font-bold italic">{editForm.id ? 'Actualizar Producto' : 'Nuevo Ingreso'}</h2>
        <button onClick={onClose} className="p-3 bg-stone-100 rounded-full"><Icons.X /></button>
      </div>
      
      <form onSubmit={onSave} className="flex-1 overflow-y-auto p-6 space-y-8 pb-32">
        <div onClick={() => fileInputRef.current.click()} className="aspect-square w-full max-w-sm mx-auto bg-stone-50 rounded-[3rem] flex flex-col items-center justify-center overflow-hidden border-2 border-dashed border-stone-200 cursor-pointer active:bg-stone-100 transition-all">
          {editForm.image ? (
            <img src={editForm.image} className="w-full h-full object-cover" />
          ) : (
            <div className="text-center text-stone-300">
              <Icons.Camera />
              <p className="text-[9px] font-black uppercase mt-2 tracking-widest">Subir Imagen</p>
            </div>
          )}
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
        </div>

        <div className="space-y-6 max-w-lg mx-auto">
          <input required placeholder="Nombre del Producto" className="w-full p-5 bg-stone-50 rounded-2xl border border-stone-100 outline-none font-bold" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} />
          
          <div className="grid grid-cols-3 gap-2">
            {selectableCategories.map(cat => (
              <button key={cat} type="button" onClick={() => setEditForm({...editForm, category: cat})} className={`py-4 rounded-xl text-[9px] font-black uppercase border ${editForm.category === cat ? 'bg-black text-white border-black' : 'bg-white text-stone-400 border-stone-100'}`}>
                {cat}
              </button>
            ))}
          </div>
          
          <input type="number" required placeholder="Precio" className="w-full p-5 bg-stone-50 rounded-2xl border border-stone-100 outline-none font-serif text-2xl font-bold" value={editForm.price} onChange={e => setEditForm({...editForm, price: e.target.value})} />
          
          <div className="grid grid-cols-2 gap-4">
            <input type="number" required placeholder="Vitrina" className="p-4 bg-stone-50 rounded-2xl border border-stone-100" value={editForm.stock_vitrina} onChange={e => setEditForm({...editForm, stock_vitrina: e.target.value})} />
            <input type="number" required placeholder="Bodega" className="p-4 bg-stone-50 rounded-2xl border border-stone-100" value={editForm.stock_bodega} onChange={e => setEditForm({...editForm, stock_bodega: e.target.value})} />
          </div>
          
          <textarea rows="3" placeholder="Descripción..." className="w-full p-5 bg-stone-50 rounded-2xl border border-stone-100 outline-none italic text-sm" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} />
        </div>

        <button type="submit" className="fixed bottom-8 left-8 right-8 bg-black text-white py-6 rounded-[2rem] font-black uppercase tracking-[0.3em] text-[11px] shadow-2xl active:scale-95 transition-all">
          {editForm.id ? 'ACTUALIZAR STOCK' : 'GUARDAR PRODUCTO'}
        </button>
      </form>
    </div>
  );
}
