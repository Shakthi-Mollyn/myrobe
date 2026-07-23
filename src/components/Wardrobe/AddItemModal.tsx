import React, { useState, useRef } from 'react';
import { X, Camera, Sparkles, Upload, Loader2, Shirt, Check, MapPin, Tag } from 'lucide-react';
import { WardrobeItem, ItemCategory, CleanStatus, FormalityLevel, Season } from '../../types';

interface AddItemModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddItem: (item: Omit<WardrobeItem, 'id' | 'createdAt' | 'timesWorn'>) => void;
}

const CATEGORIES: ItemCategory[] = [
  'Tops',
  'Bottoms',
  'Dresses & One-Pieces',
  'Outerwear',
  'Shoes',
  'Bags',
  'Jewelry & Watches',
  'Hats & Eyewear',
  'Accessories & Belts',
];

const FORMALITIES: FormalityLevel[] = [
  'Casual',
  'Smart Casual',
  'Formal',
  'Sporty',
  'Party / Glam',
];

const SEASONS: Season[] = ['Spring', 'Summer', 'Autumn', 'Winter', 'All Seasons'];

const DEFAULT_IMAGES_BY_CATEGORY: Record<ItemCategory, string> = {
  Tops: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
  Bottoms: 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80',
  'Dresses & One-Pieces': 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=600&auto=format&fit=crop&q=80',
  Outerwear: 'https://images.unsplash.com/photo-1544441893-675973e31985?w=600&auto=format&fit=crop&q=80',
  Shoes: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?w=600&auto=format&fit=crop&q=80',
  Bags: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=600&auto=format&fit=crop&q=80',
  'Jewelry & Watches': 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?w=600&auto=format&fit=crop&q=80',
  'Hats & Eyewear': 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=600&auto=format&fit=crop&q=80',
  'Accessories & Belts': 'https://images.unsplash.com/photo-1624222247344-550fb60583dc?w=600&auto=format&fit=crop&q=80',
};

export const AddItemModal: React.FC<AddItemModalProps> = ({
  isOpen,
  onClose,
  onAddItem,
}) => {
  if (!isOpen) return null;

  const [activeTab, setActiveTab] = useState<'ai' | 'manual'>('ai');
  const [imagePreview, setImagePreview] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [aiError, setAiError] = useState<string | null>(null);

  // Form Fields
  const [name, setName] = useState('');
  const [category, setCategory] = useState<ItemCategory>('Tops');
  const [subCategory, setSubCategory] = useState('');
  const [color, setColor] = useState('');
  const [material, setMaterial] = useState('');
  const [brand, setBrand] = useState('');
  const [formality, setFormality] = useState<FormalityLevel>('Smart Casual');
  const [selectedSeasons, setSelectedSeasons] = useState<Season[]>(['All Seasons']);
  const [status, setStatus] = useState<CleanStatus>('Clean');
  const [storageLocation, setStorageLocation] = useState('Main Wardrobe Closet');
  const [isFavorite, setIsFavorite] = useState(false);
  const [notes, setNotes] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64Data = event.target?.result as string;
      setImagePreview(base64Data);

      // Trigger AI Analysis
      setIsAnalyzing(true);
      setAiError(null);

      try {
        const response = await fetch('/api/analyze-item-image', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            imageBase64: base64Data,
            mimeType: file.type || 'image/jpeg',
          }),
        });

        if (!response.ok) {
          throw new Error('AI analysis API call failed');
        }

        const data = await response.json();
        if (data.name) setName(data.name);
        if (data.category && CATEGORIES.includes(data.category)) setCategory(data.category);
        if (data.subCategory) setSubCategory(data.subCategory);
        if (data.color) setColor(data.color);
        if (data.material) setMaterial(data.material);
        if (data.formality && FORMALITIES.includes(data.formality)) setFormality(data.formality);
        if (data.seasons && Array.isArray(data.seasons)) setSelectedSeasons(data.seasons);
        if (data.suggestedStorageLocation) setStorageLocation(data.suggestedStorageLocation);
        if (data.styleNotes) setNotes(data.styleNotes);

        setActiveTab('manual'); // Switch to review details
      } catch (err: any) {
        console.error(err);
        setAiError('AI could not auto-detect fields. You can enter details manually below.');
      } finally {
        setIsAnalyzing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSeasonToggle = (s: Season) => {
    if (s === 'All Seasons') {
      setSelectedSeasons(['All Seasons']);
      return;
    }
    const filtered = selectedSeasons.filter((item) => item !== 'All Seasons');
    if (filtered.includes(s)) {
      const updated = filtered.filter((item) => item !== s);
      setSelectedSeasons(updated.length === 0 ? ['All Seasons'] : updated);
    } else {
      setSelectedSeasons([...filtered, s]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onAddItem({
      name: name.trim(),
      category,
      subCategory: subCategory.trim() || category,
      color: color.trim() || 'Multi-color',
      material: material.trim() || 'Cotton/Blend',
      brand: brand.trim() || 'Unbranded',
      formality,
      seasons: selectedSeasons,
      imageUrl: imagePreview || DEFAULT_IMAGES_BY_CATEGORY[category],
      status,
      storageLocation: storageLocation.trim() || 'Home Closet',
      isFavorite,
      notes: notes.trim(),
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden text-[#1A1A1A] dark:text-white my-8">
        {/* Header */}
        <div className="px-6 py-4 bg-[#F9F9F8] dark:bg-[#222226] border-b border-[#E5E5E1] dark:border-[#2A2A30] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-lg bg-white dark:bg-[#1C1C20] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2A2A30]">
              <Shirt className="w-5 h-5 text-[#004253] dark:text-[#38bdf8]" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-[#1A1A1A] dark:text-white">Add Wardrobe Piece</h2>
              <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA]">Add clothes, shoes, bags, or accessories to your home closet</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F5F5F0] dark:hover:bg-[#2A2A30] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex border-b border-[#E5E5E1] dark:border-[#2A2A30] bg-[#F9F9F8] dark:bg-[#222226] px-6 pt-3 gap-4 text-xs font-medium">
          <button
            type="button"
            onClick={() => setActiveTab('ai')}
            className={`pb-3 border-b-2 flex items-center gap-2 px-1 transition-colors ${
              activeTab === 'ai'
                ? 'border-[#004253] dark:border-[#38bdf8] text-[#004253] dark:text-[#38bdf8] font-bold'
                : 'border-transparent text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#004253] dark:text-[#38bdf8]" />
            <span>AI Photo Auto-Scan</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('manual')}
            className={`pb-3 border-b-2 flex items-center gap-2 px-1 transition-colors ${
              activeTab === 'manual'
                ? 'border-[#004253] dark:border-[#38bdf8] text-[#004253] dark:text-[#38bdf8] font-bold'
                : 'border-transparent text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
            }`}
          >
            <Tag className="w-4 h-4" />
            <span>Piece Details & Form</span>
          </button>
        </div>

        {/* Body Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-5 max-h-[75vh] overflow-y-auto">
          {activeTab === 'ai' && (
            <div className="space-y-4">
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-[#E5E5E1] dark:border-[#2A2A30] hover:border-[#004253] dark:hover:border-[#38bdf8] rounded-2xl p-8 text-center bg-[#F9F9F8] dark:bg-[#222226] cursor-pointer transition-all hover:bg-[#F5F5F0] dark:hover:bg-[#2A2A30] group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleImageUpload}
                  accept="image/*"
                  className="hidden"
                />

                {imagePreview ? (
                  <div className="flex flex-col items-center gap-3">
                    <img
                      src={imagePreview}
                      alt="Uploaded item preview"
                      className="w-36 h-36 object-cover rounded-xl border border-[#E5E5E1] dark:border-[#2A2A30] shadow-sm bg-white dark:bg-[#1C1C20]"
                    />
                    {isAnalyzing ? (
                      <div className="flex items-center gap-2 text-[#004253] dark:text-[#38bdf8] font-medium text-xs">
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>AI analyzing color, material, category & formality...</span>
                      </div>
                    ) : (
                      <p className="text-xs text-[#004253] dark:text-[#38bdf8] font-medium flex items-center gap-1">
                        <Check className="w-4 h-4" />
                        Photo uploaded! Review generated details below.
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex flex-col items-center gap-3">
                    <div className="p-4 rounded-full bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] text-[#1A1A1A] dark:text-white group-hover:scale-105 transition-transform">
                      <Camera className="w-7 h-7 text-[#004253] dark:text-[#38bdf8]" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-[#1A1A1A] dark:text-white">Snap or Upload a Photo of Your Item</p>
                      <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA] mt-1">
                        Our AI vision model will automatically detect name, category, color, material & formality.
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {aiError && (
                <p className="text-xs text-rose-600 bg-rose-50 dark:bg-rose-950/40 p-3 rounded-xl border border-rose-200 dark:border-rose-800">
                  {aiError}
                </p>
              )}
            </div>
          )}

          {/* Form Fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#7A7A75] dark:text-[#A1A1AA] mb-1">
                Item Title / Name <span className="text-[#004253] dark:text-[#38bdf8]">*</span>
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Linen White Button-Up, Gold Chain Watch, Leather Loafers"
                className="w-full px-3.5 py-2.5 text-sm bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253] dark:focus:border-[#38bdf8]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#7A7A75] dark:text-[#A1A1AA] mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as ItemCategory)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253]"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A7A75] dark:text-[#A1A1AA] mb-1">Sub-Category</label>
                <input
                  type="text"
                  value={subCategory}
                  onChange={(e) => setSubCategory(e.target.value)}
                  placeholder="e.g. Oxford Shirt, Trench, Sneakers, Clutch"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#7A7A75] dark:text-[#A1A1AA] mb-1">Primary Color</label>
                <input
                  type="text"
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  placeholder="e.g. Black, Camel, Gold, Emerald"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A7A75] dark:text-[#A1A1AA] mb-1">Material</label>
                <input
                  type="text"
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  placeholder="e.g. Silk, Denim, Wool, Calfskin"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A7A75] dark:text-[#A1A1AA] mb-1">Brand / Tag</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="e.g. Zara, COS, Vintage"
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253]"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-[#7A7A75] dark:text-[#A1A1AA] mb-1">Formality Level</label>
                <select
                  value={formality}
                  onChange={(e) => setFormality(e.target.value as FormalityLevel)}
                  className="w-full px-3.5 py-2.5 text-sm bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253]"
                >
                  {FORMALITIES.map((f) => (
                    <option key={f} value={f}>
                      {f}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#7A7A75] dark:text-[#A1A1AA] mb-1">Storage Location at Home</label>
                <div className="relative">
                  <MapPin className="w-4 h-4 text-[#7A7A75] dark:text-[#A1A1AA] absolute left-3 top-3" />
                  <input
                    type="text"
                    value={storageLocation}
                    onChange={(e) => setStorageLocation(e.target.value)}
                    placeholder="e.g. Main Closet Shelf 2, Jewelry Box"
                    className="w-full pl-9 pr-3.5 py-2.5 text-sm bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253]"
                  />
                </div>
              </div>
            </div>

            {/* Seasons Selection */}
            <div>
              <label className="block text-xs font-semibold text-[#7A7A75] dark:text-[#A1A1AA] mb-1.5">Suitable Seasons</label>
              <div className="flex flex-wrap gap-2">
                {SEASONS.map((s) => (
                  <button
                    type="button"
                    key={s}
                    onClick={() => handleSeasonToggle(s)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      selectedSeasons.includes(s)
                        ? 'bg-[#004253] dark:bg-[#005B73] text-white border-[#004253]'
                        : 'bg-[#F9F9F8] dark:bg-[#222226] text-[#7A7A75] dark:text-[#A1A1AA] border-[#E5E5E1] dark:border-[#2A2A30] hover:text-[#1A1A1A] dark:hover:text-white'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Laundry & Favorite Toggles */}
            <div className="flex items-center justify-between pt-3 border-t border-[#E5E5E1] dark:border-[#2A2A30]">
              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 text-xs font-medium text-[#1A1A1A] dark:text-white cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'Clean'}
                    onChange={() => setStatus('Clean')}
                    className="accent-[#004253]"
                  />
                  <span>Ready to Wear (Clean)</span>
                </label>
                <label className="flex items-center gap-2 text-xs font-medium text-[#1A1A1A] dark:text-white cursor-pointer">
                  <input
                    type="radio"
                    name="status"
                    checked={status === 'In Laundry'}
                    onChange={() => setStatus('In Laundry')}
                    className="accent-[#004253]"
                  />
                  <span>In Laundry</span>
                </label>
              </div>

              <label className="flex items-center gap-2 text-xs font-medium text-[#1A1A1A] dark:text-white cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFavorite}
                  onChange={(e) => setIsFavorite(e.target.checked)}
                  className="rounded accent-[#004253]"
                />
                <span>Favorite Piece</span>
              </label>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E5E5E1] dark:border-[#2A2A30]">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white hover:bg-[#F5F5F0] dark:hover:bg-[#222226] transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#004253] dark:bg-[#005B73] hover:bg-[#002D3A] text-white shadow-xs transition-all"
            >
              Save to Wardrobe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
