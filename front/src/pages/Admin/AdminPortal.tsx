import React, { useState } from 'react';
import { Perfume, Gender, Category, DayNight, Season } from '../../types';
import { Plus, Trash2, Palette, Image as ImageIcon, Edit2, X, Save, Star, ShieldCheck, Lock, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../../lib/utils';
import { safeStorage } from '../../lib/storage';

interface AdminPortalProps {
  perfumes: Perfume[];
  setPerfumes: (perfumes: Perfume[]) => void;
  colors: Record<string, string>;
  setColors: (colors: Record<string, string>) => void;
  logo: string | null;
  setLogo: (logo: string | null) => void;
  onClose: () => void;
  isDarkMode?: boolean;
}

export default function AdminPortal({
  perfumes,
  setPerfumes,
  colors,
  setColors,
  logo,
  setLogo,
  onClose,
  isDarkMode = false
}: AdminPortalProps) {
  const [token, setToken] = useState<string | null>(safeStorage.getItem('adminToken'));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Accord creation state
  const [newAccordName, setNewAccordName] = useState('');
  const [newAccordColor, setNewAccordColor] = useState('#c19253');

  // Logo update state
  const [newLogoUrl, setNewLogoUrl] = useState(logo || '');

  // Form states for adding/editing perfumes
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerfume, setEditingPerfume] = useState<Partial<Perfume> | null>(null);

  const defaultPerfumeState = (): Partial<Perfume> => ({
    name: '',
    brand: '',
    price: 3200,
    code: 'P-' + Math.floor(10 + Math.random() * 89),
    gender: 'Unisex',
    category: 'Perfume',
    description: 'An elegant formulation composed of handpicked oils and resins.',
    rating: 4.5,
    mainImage: 'https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600',
    galleryImages: ['https://images.unsplash.com/photo-1594035910387-fea47794261f?w=600'],
    accords: [
      { name: 'Woody', value: 80, color: '#8d6e63' },
      { name: 'Spicy', value: 60, color: '#d84315' }
    ],
    fragranceProfile: { longevity: '8H', projection: 'Moderate', sillage: 'Moderate' },
    dayNight: 'Both',
    seasons: ['Autumn', 'Winter'],
    notes: {
      top: [{ name: 'Bergamot', iconUrl: 'https://images.unsplash.com/photo-1577234286142-fc0ee054174d?w=100' }],
      middle: [{ name: 'Lavender', iconUrl: 'https://images.unsplash.com/photo-1558223635-a6a9be78efaa?w=100' }],
      base: [{ name: 'Cedarwood', iconUrl: 'https://images.unsplash.com/photo-1550605995-1c390543f324?w=100' }]
    }
  });

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (username === 'admin' && password === 'admin') {
      safeStorage.setItem('adminToken', 'yeab_token_sec');
      setToken('yeab_token_sec');
      setAuthError('');
    } else {
      setAuthError('Incorrect formulation master credentials.');
    }
  };

  const handleLogout = () => {
    safeStorage.removeItem('adminToken');
    setToken(null);
  };

  // Accord colors management
  const handleSaveAccordColor = () => {
    if (!newAccordName.trim()) return;
    const cleanName = newAccordName.trim();
    setColors({
      ...colors,
      [cleanName]: newAccordColor
    });
    setNewAccordName('');
  };

  const handleDeleteAccordColor = (name: string) => {
    const next = { ...colors };
    delete next[name];
    setColors(next);
  };

  // Brand Logo update
  const handleSaveLogo = () => {
    setLogo(newLogoUrl.trim() || null);
    alert('Atelier brand insignia updated successfully!');
  };

  // Perfume CRUD Operations
  const handleDeletePerfume = (id: string) => {
    if (window.confirm('Delete this perfume from the active collection?')) {
      setPerfumes(perfumes.filter((p) => p.id !== id));
    }
  };

  const handleOpenAddForm = () => {
    setEditingPerfume(defaultPerfumeState());
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (perfume: Perfume) => {
    setEditingPerfume({ ...perfume });
    setIsFormOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPerfume) return;

    if (!editingPerfume.name || !editingPerfume.brand) {
      alert('Must populate fragrance name and brand house.');
      return;
    }

    if (editingPerfume.id) {
      // Edit
      setPerfumes(perfumes.map((p) => (p.id === editingPerfume.id ? (editingPerfume as Perfume) : p)));
    } else {
      // Add
      const newId = String(Date.now());
      const completePerfume: Perfume = {
        ...(editingPerfume as Perfume),
        id: newId,
        galleryImages: [editingPerfume.mainImage || '']
      };
      setPerfumes([completePerfume, ...perfumes]);
    }

    setIsFormOpen(false);
    setEditingPerfume(null);
  };

  if (!token) {
    return (
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 min-h-[500px] transition-colors duration-300 bg-[#fdfdfc] dark:bg-black">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="w-full max-w-md border rounded-3xl p-8 shadow-xl text-center transition-all duration-300 bg-[#FAF9F5] border-[#ecebe7] text-[#111111] dark:bg-black dark:border-[#c19253]/35 dark:text-[#c19253]"
        >
          <div className="w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#111111]/5 dark:bg-[#c19253]/10">
            <Lock className="text-[#c19253]" size={20} />
          </div>

          <h2 className="font-serif text-3xl font-bold tracking-widest mb-2 text-gray-900 dark:text-[#c19253]">
            ATELIER AUTH
          </h2>
          <p className="text-[10px] tracking-widest uppercase font-bold text-gray-400 dark:text-gray-400 mb-8">
            Master Formulation Entry
          </p>

          <form onSubmit={handleLogin} className="space-y-4 text-left">
            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-400 mb-1.5 pl-1">
                Formulation Role
              </label>
              <input
                type="text"
                className="w-full px-4 py-3 rounded-xl outline-none text-xs font-bold font-mono tracking-wider transition-all border bg-white border-[#ecebe7] focus:border-black text-[#111111] dark:bg-black dark:border-[#c19253]/35 dark:focus:border-[#c19253] dark:text-white"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="master username ('admin')"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-400 mb-1.5 pl-1">
                Access Code
              </label>
              <input
                type="password"
                className="w-full px-4 py-3 rounded-xl outline-none text-xs font-bold font-mono tracking-wider transition-all border bg-white border-[#ecebe7] focus:border-black text-[#111111] dark:bg-black dark:border-[#c19253]/35 dark:focus:border-[#c19253] dark:text-white"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="master key ('admin')"
                required
              />
            </div>

            {authError && (
              <p className="text-[10px] uppercase font-bold text-red-500 tracking-wider">
                {authError}
              </p>
            )}

            <button
              type="submit"
              className="w-full py-3.5 rounded-xl text-xs font-bold tracking-widest uppercase shadow-md transition-all mt-4 bg-[#111111] text-white hover:text-[#c19253] dark:bg-[#c19253] dark:text-black dark:hover:bg-white"
            >
              Sign into atelier
            </button>
          </form>

          <button
            onClick={onClose}
            className="text-[10px] uppercase tracking-widest font-extrabold mt-6 transition-colors text-gray-400 hover:text-black dark:text-gray-500 dark:hover:text-[#c19253]"
          >
            Cancel and Return
          </button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col min-h-0 transition-colors duration-300 bg-white dark:bg-black">
      
      {/* ATELIER MASTER NAVIGATION */}
      <div className="p-6 border-b flex items-center justify-between flex-shrink-0 transition-colors duration-300 bg-white border-[#ecebe7] dark:bg-black dark:border-[#c19253]/20">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center border transition-colors bg-[#FAF9F5] border-[#ecebe7] dark:bg-black dark:border-[#c19253]/30">
            <ShieldCheck className="text-[#c19253]" size={18} />
          </div>
          <div>
            <h2 className="font-serif text-2xl font-black leading-none mb-1 transition-colors text-gray-900 dark:text-[#c19253]">
              Atelier Formulation Station
            </h2>
            <span className="text-[9px] font-bold text-gray-400 block uppercase tracking-widest">
              Catalog Administration Engine
            </span>
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-[10px] font-black uppercase text-gray-400 tracking-wider hover:text-red-500 transition-colors dark:text-[#c19253] dark:hover:text-red-400"
          >
            <LogOut size={14} />
            Leave Station
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-wider transition-colors border border-[#ecebe7] text-gray-500 hover:text-[#111111] hover:bg-gray-50 dark:border-[#c19253]/30 dark:text-[#c19253] dark:bg-black dark:hover:bg-[#c19253]/10 dark:hover:text-[#c19253]"
          >
            Close Dashboard
          </button>
        </div>
      </div>

      {/* DASHBOARD GRID CONTENT */}
      <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-10 custom-scrollbar">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          
          {/* SEC 1: Accord palette Formulation */}
          <div className="xl:col-span-1 border-r-0 xl:border-r border-[#ecebe7] dark:border-[#c19253]/15 xl:pr-8 space-y-6">
            <div className="flex items-center gap-3">
              <Palette className="text-[#c19253]" size={18} />
              <h3 className="text-xs uppercase tracking-[0.2em] font-extrabold text-gray-900 dark:text-[#c19253] leading-none">
                Main Accord Colors
              </h3>
            </div>

            <div className="bg-[#FAF9F5] dark:bg-black p-5 rounded-2xl border border-[#ecebe7] dark:border-[#c19253]/25 space-y-4 shadow-sm">
              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-400 pl-1">
                  New Accord Category
                </label>
                <input
                  type="text"
                  className="w-full bg-white dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/30 px-3.5 py-2 rounded-xl text-xs font-bold outline-none focus:border-black dark:focus:border-[#c19253] text-[#111111] dark:text-white"
                  placeholder="e.g. Balsamic, Green, Powdery"
                  value={newAccordName}
                  onChange={(e) => setNewAccordName(e.target.value)}
                />
              </div>

              <div className="flex gap-3">
                <div className="flex-1 space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-400 pl-1">
                    Accord color tag
                  </label>
                  <div className="flex bg-white dark:bg-black rounded-xl border border-[#ecebe7] dark:border-[#c19253]/35 overflow-hidden">
                    <input
                      type="color"
                      className="w-10 h-9 p-1 border-0 cursor-pointer bg-transparent"
                      value={newAccordColor}
                      onChange={(e) => setNewAccordColor(e.target.value)}
                    />
                    <input
                      type="text"
                      className="flex-1 px-2.5 outline-none border-0 text-[11px] font-mono font-bold uppercase text-gray-600 dark:text-white bg-transparent"
                      value={newAccordColor}
                      onChange={(e) => setNewAccordColor(e.target.value)}
                    />
                  </div>
                </div>
                
                <button
                  onClick={handleSaveAccordColor}
                  className="px-5 bg-black hover:bg-neutral-800 text-white dark:bg-[#c19253] dark:text-black dark:hover:bg-white rounded-xl text-xs font-extrabold uppercase tracking-widest flex items-center justify-center mt-auto h-9 shadow-sm"
                >
                  Save Color
                </button>
              </div>
            </div>

            <div className="space-y-3">
              <span className="text-[10px] uppercase font-bold text-gray-400 dark:text-gray-400 tracking-widest block pl-1">
                Configured accords spectra
              </span>
              <div className="max-h-[300px] overflow-y-auto pr-2 space-y-2 custom-scrollbar">
                {Object.entries(colors).map(([name, hex]) => (
                  <div
                    key={name}
                    className="flex items-center justify-between bg-white dark:bg-black p-3 rounded-xl border border-[#ecebe7] dark:border-[#c19253]/20 shadow-sm hover:border-black/10 dark:hover:border-[#c19253]/40 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-md shadow-inner" style={{ backgroundColor: hex }} />
                      <span className="text-xs font-extrabold text-[#111111] dark:text-white uppercase tracking-wider">{name}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-[10px] font-mono tracking-wider uppercase font-bold text-gray-400 pl-1">
                        {hex}
                      </span>
                      <button
                        onClick={() => handleDeleteAccordColor(name)}
                        className="text-gray-300 hover:text-red-500 transition-colors"
                        title="Delete color map"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* SEC 2: Brand insignia & details */}
          <div className="xl:col-span-1 border-r-0 xl:border-r border-[#ecebe7] dark:border-[#c19253]/15 xl:pr-8 space-y-6">
            <div className="flex items-center gap-3">
              <ImageIcon className="text-[#c19253]" size={18} />
              <h3 className="text-xs uppercase tracking-[0.2em] font-extrabold text-gray-900 dark:text-[#c19253] leading-none">
                Insignia settings
              </h3>
            </div>

            <div className="bg-[#FAF9F5] dark:bg-black p-5 rounded-2xl border border-[#ecebe7] dark:border-[#c19253]/25 space-y-4 shadow-sm">
              <div className="space-y-1.5">
                <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-400 pl-1">
                  Atelier Logo Web URL
                </label>
                <input
                  type="url"
                  className="w-full bg-white dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/30 px-3.5 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-black dark:focus:border-[#c19253] text-gray-650 dark:text-white"
                  placeholder="https://pngimg.com/uploads/crown/crown_PNG10.png"
                  value={newLogoUrl}
                  onChange={(e) => setNewLogoUrl(e.target.value)}
                />
              </div>

              <div className="flex items-center justify-between border-t border-[#ecebe7]/60 dark:border-[#c19253]/10 pt-4 mt-2">
                <button
                  onClick={() => {
                    setLogo(null);
                    setNewLogoUrl('');
                  }}
                  className="text-[9px] uppercase tracking-widest font-extrabold text-gray-400 hover:text-red-500 dark:hover:text-red-400 transition-colors"
                >
                  Reset Default Crown
                </button>
                <button
                  onClick={handleSaveLogo}
                  className="px-4 py-2 bg-black hover:bg-neutral-800 text-white dark:bg-[#c19253] dark:text-black dark:hover:bg-white text-[10px] font-black uppercase tracking-widest rounded-lg shadow-sm"
                >
                  Apply Insignia
                </button>
              </div>
            </div>

            {/* Current logo print preview */}
            <div className="border border-[#ecebe7] dark:border-[#c19253]/25 rounded-3xl p-6 bg-white dark:bg-black shadow-sm flex flex-col items-center justify-center min-h-[150px]">
              <span className="text-[9px] font-bold text-gray-300 dark:text-gray-500 uppercase tracking-widest mb-4">
                Active Insignia Print
              </span>
              {logo ? (
                <img src={logo} alt="YEAB Insignia" className="w-16 h-16 object-contain" />
              ) : (
                <div className="w-14 h-14 rounded-full border-2 border-dashed border-[#ecebe7] dark:border-[#c19253]/30 flex items-center justify-center text-gray-350 dark:text-gray-500 font-extrabold hover:text-gray-450 transition-colors">
                  Crown
                </div>
              )}
            </div>
          </div>

          {/* SEC 3: Curate Perfume Fragrances */}
          <div className="xl:col-span-1 space-y-6">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Palette className="text-[#c19253]" size={18} />
                <h3 className="text-xs uppercase tracking-[0.2em] font-extrabold text-gray-900 dark:text-[#c19253] leading-none">
                  Curate Fragrances
                </h3>
              </div>

              <button
                onClick={handleOpenAddForm}
                className="flex items-center gap-1.5 bg-[#111111] hover:bg-neutral-800 text-white dark:bg-[#c19253] dark:text-black dark:hover:bg-white rounded-lg px-3.5 py-1.5 text-[9px] font-black uppercase tracking-wider shadow-sm transition-all"
              >
                <Plus size={12} /> Add Fragrance
              </button>
            </div>

            <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {perfumes.map((p) => (
                <div
                  key={p.id}
                  className="bg-[#FAF9F5] dark:bg-black rounded-2xl p-4 border border-[#ecebe7] dark:border-[#c19253]/20 shadow-sm flex items-center justify-between group hover:border-[#c19253]/45 transition-all"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-xl border border-black/5 dark:border-[#c19253]/20 bg-white dark:bg-black p-1 flex items-center justify-center">
                      <img src={p.mainImage} alt={p.name} className="max-w-full max-h-full object-contain" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-[8px] font-mono font-bold text-[#c19253] block uppercase tracking-widest">
                        {p.code} • {p.brand}
                      </span>
                      <h4 className="font-serif text-[13px] font-extrabold text-[#111111] dark:text-white truncate max-w-[150px]">
                        {p.name}
                      </h4>
                      <span className="text-[10px] font-black font-mono text-gray-400 dark:text-[#c19253]/70 block">
                        {p.price.toLocaleString()} ETB
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-1">
                    <button
                      onClick={() => handleOpenEditForm(p)}
                      className="p-2 bg-white dark:bg-black rounded-lg border border-[#ecebe7] dark:border-[#c19253]/30 hover:border-black/25 dark:hover:border-[#c19253] text-gray-500 dark:text-[#c19253] hover:text-[#111111] shadow-xs"
                      title="Edit details"
                    >
                      <Edit2 size={12} />
                    </button>
                    <button
                      onClick={() => handleDeletePerfume(p.id)}
                      className="p-2 bg-white dark:bg-black rounded-lg border border-[#ecebe7] dark:border-[#c19253]/30 hover:border-red-200 dark:hover:bg-red-950/20 text-gray-400 hover:text-red-500 shadow-xs"
                      title="Retire fragrance"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>

      {/* ADMIN EDIT / ADD MODAL DRAWER */}
      <AnimatePresence>
        {isFormOpen && editingPerfume && (
          <div className="fixed inset-0 z-50 flex items-center justify-end">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.6 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black backdrop-blur-xs"
              onClick={() => setIsFormOpen(false)}
            />
            
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: '0%' }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="relative w-full max-w-2xl h-full bg-white dark:bg-black shadow-2xl flex flex-col z-10 overflow-hidden border-l border-[#ecebe7] dark:border-[#c19253]/30"
            >
              <div className="p-6 border-b border-[#ecebe7] dark:border-[#c19253]/20 flex justify-between items-center bg-[#FAF9F5] dark:bg-black">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-gray-900 dark:text-[#c19253] leading-none mb-1">
                    {editingPerfume.id ? 'Edit Formulation' : 'Create Formulation'}
                  </h3>
                  <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block">
                    Define essence structural parameters
                  </span>
                </div>
                <button
                  onClick={() => setIsFormOpen(false)}
                  className="w-8 h-8 rounded-full border border-black/5 dark:border-[#c19253]/20 bg-white dark:bg-black flex items-center justify-center text-gray-400 hover:text-black dark:text-[#c19253] dark:hover:text-white shadow-sm transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6 custom-scrollbar text-[#111111] dark:text-[#c19253]">
                
                {/* Category Selection */}
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400 dark:text-gray-400 mb-2">
                    Collection Category
                  </label>
                  <div className="grid grid-cols-3 gap-2 bg-[#FAF9F5] dark:bg-black p-1.5 rounded-xl border border-[#ecebe7] dark:border-[#c19253]/25">
                    {['Perfume', 'Brand Perfume', 'Luxury Perfume'].map((cat) => {
                      const isActive = editingPerfume.category === cat;
                      return (
                        <button
                          key={cat}
                          type="button"
                          onClick={() => setEditingPerfume({
                            ...editingPerfume,
                            category: cat as Category,
                            brand: cat === 'Brand Perfume' ? '' : 'Yeab Luxury'
                          })}
                          className={cn(
                            "py-2.5 px-3 rounded-lg text-[9px] font-black uppercase tracking-wider transition-all",
                            isActive 
                              ? "bg-black text-white dark:bg-[#c19253] dark:text-black shadow-md font-black" 
                              : "text-gray-400 hover:text-black dark:hover:text-[#c19253]"
                          )}
                        >
                          {cat === 'Perfume' ? 'Signature' : cat === 'Brand Perfume' ? 'Designer' : 'Private Blend'}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Name & House */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                      Fragrance Name
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#FAF9F5] dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/30 px-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-black dark:focus:border-[#c19253] text-[#111111] dark:text-white placeholder:text-gray-300"
                      value={editingPerfume.name}
                      onChange={(e) => setEditingPerfume({ ...editingPerfume, name: e.target.value })}
                      placeholder="e.g. Amber Oud Absolute"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                      Brand House
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#FAF9F5] dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/30 px-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-black dark:focus:border-[#c19253] text-[#111111] dark:text-white placeholder:text-gray-400 disabled:opacity-50"
                      value={editingPerfume.brand}
                      onChange={(e) => setEditingPerfume({ ...editingPerfume, brand: e.target.value })}
                      placeholder="e.g. Tom Ford"
                      disabled={editingPerfume.category !== 'Brand Perfume'}
                      required
                    />
                  </div>
                </div>

                {/* Price, code, rate */}
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                      Pricing (ETB)
                    </label>
                    <input
                      type="number"
                      className="w-full bg-[#FAF9F5] dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/30 px-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-black dark:focus:border-[#c19253] text-[#111111] dark:text-white"
                      value={editingPerfume.price}
                      onChange={(e) => setEditingPerfume({ ...editingPerfume, price: Number(e.target.value) || 0 })}
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                      Atelier Code
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#FAF9F5] dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/30 px-4 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wider outline-none focus:border-black dark:focus:border-[#c19253] text-[#111111] dark:text-white"
                      value={editingPerfume.code}
                      onChange={(e) => setEditingPerfume({ ...editingPerfume, code: e.target.value })}
                      placeholder="P-MA40"
                      required
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                      Rating ({editingPerfume.rating})
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="5"
                      step="0.1"
                      className="w-full h-8 accent-black dark:accent-[#c19253] mt-1 cursor-pointer"
                      value={editingPerfume.rating}
                      onChange={(e) => setEditingPerfume({ ...editingPerfume, rating: Number(e.target.value) })}
                    />
                  </div>
                </div>

                {/* Images URL sources */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                    Fragrance Flask Image Link (URL)
                  </label>
                  <input
                    type="url"
                    className="w-full bg-[#FAF9F5] dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/30 px-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-black dark:focus:border-[#c19253] text-gray-650 dark:text-white"
                    value={editingPerfume.mainImage}
                    onChange={(e) => setEditingPerfume({ ...editingPerfume, mainImage: e.target.value })}
                    required
                  />
                </div>

                {/* Gender selection */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                      Optimal Target Gender
                    </label>
                    <select
                      className="w-full bg-[#FAF9F5] dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/30 px-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-black dark:focus:border-[#c19253] text-gray-950 dark:text-[#c19253]"
                      value={editingPerfume.gender}
                      onChange={(e) => setEditingPerfume({ ...editingPerfume, gender: e.target.value as Gender })}
                    >
                      <option value="Male">Masculine</option>
                      <option value="Female">Feminine</option>
                      <option value="Unisex">Unisex Blend</option>
                      <option value="Kids">Children</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                      Optimal Wear Time
                    </label>
                    <select
                      className="w-full bg-[#FAF9F5] dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/30 px-4 py-2.5 rounded-xl text-xs font-bold outline-none focus:border-black dark:focus:border-[#c19253] text-gray-950 dark:text-[#c19253]"
                      value={editingPerfume.dayNight}
                      onChange={(e) => setEditingPerfume({ ...editingPerfume, dayNight: e.target.value as DayNight })}
                    >
                      <option value="Day">Day Only</option>
                      <option value="Night">Night Only</option>
                      <option value="Both">Day and Night</option>
                    </select>
                  </div>
                </div>

                {/* Seasons */}
                <div>
                  <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400 mb-2">
                    Optimal Seasons (multi-select)
                  </label>
                  <div className="flex gap-2">
                    {['Winter', 'Spring', 'Summer', 'Autumn'].map((s) => {
                      const season = s as Season;
                      const isChecked = editingPerfume.seasons?.includes(season);
                      return (
                        <button
                          key={s}
                          type="button"
                          onClick={() => {
                            const next = isChecked
                              ? (editingPerfume.seasons || []).filter((x) => x !== season)
                              : [...(editingPerfume.seasons || []), season];
                            setEditingPerfume({ ...editingPerfume, seasons: next });
                          }}
                          className={cn(
                            "flex-1 py-2 rounded-xl text-[9px] font-black uppercase tracking-wider border transition-all",
                            isChecked
                              ? "bg-black text-white border-black dark:bg-[#c19253] dark:text-black dark:border-transparent"
                              : "bg-[#FAF9F5] text-gray-400 border-[#ecebe7] dark:bg-black dark:border-[#c19253]/20 dark:text-gray-500"
                          )}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Custom Narrative Description */}
                <div className="space-y-1.5">
                  <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                    Product Narrative (Description)
                  </label>
                  <textarea
                    rows={3}
                    className="w-full bg-[#FAF9F5] dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/30 px-4 py-3 rounded-xl text-xs font-bold outline-none focus:border-black dark:focus:border-[#c19253] text-gray-650 dark:text-white resize-none leading-relaxed"
                    value={editingPerfume.description}
                    onChange={(e) => setEditingPerfume({ ...editingPerfume, description: e.target.value })}
                  />
                </div>

                {/* Performance indicators */}
                <div className="grid grid-cols-3 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                      Longevity (e.g. '8H')
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#FAF9F5] dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/30 px-4 py-2 rounded-xl text-xs font-bold outline-none focus:border-black dark:focus:border-[#c19253] text-[#111111] dark:text-white"
                      value={editingPerfume.fragranceProfile?.longevity}
                      onChange={(e) => setEditingPerfume({
                        ...editingPerfume,
                        fragranceProfile: { ...editingPerfume.fragranceProfile!, longevity: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                      Projection
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#FAF9F5] dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/30 px-4 py-2 rounded-xl text-xs font-bold outline-none focus:border-black dark:focus:border-[#c19253] text-[#111111] dark:text-white"
                      value={editingPerfume.fragranceProfile?.projection}
                      onChange={(e) => setEditingPerfume({
                        ...editingPerfume,
                        fragranceProfile: { ...editingPerfume.fragranceProfile!, projection: e.target.value }
                      })}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="block text-[9px] uppercase tracking-wider font-extrabold text-gray-400">
                      Sillage
                    </label>
                    <input
                      type="text"
                      className="w-full bg-[#FAF9F5] dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/30 px-4 py-2 rounded-xl text-xs font-bold outline-none focus:border-black dark:focus:border-[#c19253] text-[#111111] dark:text-white"
                      value={editingPerfume.fragranceProfile?.sillage}
                      onChange={(e) => setEditingPerfume({
                        ...editingPerfume,
                        fragranceProfile: { ...editingPerfume.fragranceProfile!, sillage: e.target.value }
                      })}
                    />
                  </div>
                </div>

                {/* Form Accords and ingredients */}
                <div className="border border-[#ecebe7] dark:border-[#c19253]/25 p-4 rounded-2xl space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-extrabold uppercase">
                    <span className="text-gray-400">Master Accords</span>
                    <button
                      type="button"
                      onClick={() => {
                        const name = window.prompt('Accord structural category:');
                        if (!name) return;
                        const valueStr = window.prompt('Accord percentage scale (0-100):');
                        if (!valueStr) return;
                        const parsedVal = Number(valueStr) || 50;
                        const nextAcc = [...(editingPerfume.accords || [])];
                        // check color maps
                        nextAcc.push({ name, value: parsedVal, color: colors[name] || '#666' });
                        setEditingPerfume({ ...editingPerfume, accords: nextAcc });
                      }}
                      className="text-[#c19253] hover:underline cursor-pointer"
                    >
                      + Add Accord row
                    </button>
                  </div>

                  <div className="space-y-2">
                    {editingPerfume.accords?.map((acc, index) => (
                      <div key={index} className="flex items-center gap-3 bg-[#FAF9F5] dark:bg-black p-2.5 rounded-lg border border-[#ecebe7] dark:border-[#c19253]/20 text-xs text-gray-800 dark:text-gray-200">
                        <div className="w-5 h-5 rounded-md shadow-inner" style={{ backgroundColor: colors[acc.name] || acc.color }} />
                        <span className="flex-1 font-bold">{acc.name}</span>
                        <span className="font-mono text-gray-400">{acc.value}%</span>
                        <button
                          type="button"
                          onClick={() => {
                            const nextAcc = (editingPerfume.accords || []).filter((_, i) => i !== index);
                            setEditingPerfume({ ...editingPerfume, accords: nextAcc });
                          }}
                          className="text-gray-300 hover:text-red-500 transition-colors cursor-pointer"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Sub-block Top middle base notes */}
                <div className="space-y-3.5 border border-[#ecebe7] dark:border-[#c19253]/25 p-4 rounded-2xl">
                  <h4 className="text-[10px] uppercase font-extrabold text-gray-400">Notes formulation list</h4>
                  
                  {(['top', 'middle', 'base'] as const).map((noteTier) => (
                    <div key={noteTier} className="space-y-2">
                      <div className="flex justify-between items-center text-[9px] font-extrabold uppercase">
                        <span className="text-gray-500 capitalize">{noteTier} Elements</span>
                        <button
                          type="button"
                          onClick={() => {
                            const name = window.prompt('Substance element name:');
                            if (!name) return;
                            const imageLink = window.prompt('Raw material representation URL link:', 'https://images.unsplash.com/photo-1558223635-a6a9be78efaa?w=100');
                            if (!imageLink) return;

                            const notesCopy = { ...editingPerfume.notes! };
                            notesCopy[noteTier] = [...(notesCopy[noteTier] || []), { name, iconUrl: imageLink }];
                            setEditingPerfume({ ...editingPerfume, notes: notesCopy });
                          }}
                          className="text-[#c19253] hover:underline cursor-pointer"
                        >
                          + Add element
                        </button>
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {editingPerfume.notes?.[noteTier]?.map((node, i) => (
                          <div key={i} className="flex items-center gap-1.5 bg-white dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/25 px-2.5 py-1 rounded-full text-[10px] font-bold text-gray-800 dark:text-gray-200">
                            <img src={node.iconUrl} alt="" className="w-4 h-4 rounded-full object-cover" />
                            <span>{node.name}</span>
                            <button
                              type="button"
                              onClick={() => {
                                const notesCopy = { ...editingPerfume.notes! };
                                notesCopy[noteTier] = notesCopy[noteTier].filter((_, index) => index !== i);
                                setEditingPerfume({ ...editingPerfume, notes: notesCopy });
                              }}
                              className="text-gray-350 hover:text-red-500 cursor-pointer pl-0.5"
                            >
                              <X size={10} />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

              </form>

              {/* SAVING PANEL */}
              <div className="p-6 bg-[#FAF9F5] dark:bg-black border-t border-[#ecebe7] dark:border-[#c19253]/20 flex gap-4">
                <button
                  type="button"
                  onClick={handleFormSubmit}
                  className="flex-1 bg-black hover:bg-neutral-850 text-white dark:bg-[#c19253] dark:text-black dark:hover:bg-white py-3.5 rounded-xl text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 shadow-lg cursor-pointer"
                >
                  <Save size={14} /> Provide Formulation
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-3.5 bg-white hover:bg-gray-50 dark:bg-black border border-[#ecebe7] dark:border-[#c19253]/25 rounded-xl text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-[#c19253] dark:hover:bg-[#c19253]/10 cursor-pointer"
                >
                  Cancel
                </button>
              </div>

            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
