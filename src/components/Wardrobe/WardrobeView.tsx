import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Plus,
  Shirt,
  WashingMachine,
  Star,
  MapPin,
  Grid,
  List,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
} from 'lucide-react';
import { WardrobeItem, ItemCategory, CleanStatus, FormalityLevel } from '../../types';
import { User } from '../../lib/firebase';

interface WardrobeViewProps {
  items: WardrobeItem[];
  onOpenAddItem: () => void;
  onSelectItem: (item: WardrobeItem) => void;
  onToggleCleanStatus: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  user?: User | null;
  onOpenAuth?: () => void;
  onOpenLaundryBasket?: () => void;
}

const CATEGORIES: { label: string; value: ItemCategory | 'All' }[] = [
  { label: 'All Pieces', value: 'All' },
  { label: 'Tops', value: 'Tops' },
  { label: 'Bottoms', value: 'Bottoms' },
  { label: 'Dresses', value: 'Dresses & One-Pieces' },
  { label: 'Outerwear', value: 'Outerwear' },
  { label: 'Shoes', value: 'Shoes' },
  { label: 'Bags', value: 'Bags' },
  { label: 'Jewelry & Watches', value: 'Jewelry & Watches' },
  { label: 'Hats & Eyewear', value: 'Hats & Eyewear' },
  { label: 'Accessories & Belts', value: 'Accessories & Belts' },
];

export const WardrobeView: React.FC<WardrobeViewProps> = ({
  items,
  onOpenAddItem,
  onSelectItem,
  onToggleCleanStatus,
  onToggleFavorite,
  user,
  onOpenAuth,
  onOpenLaundryBasket,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<ItemCategory | 'All'>('All');
  const [statusFilter, setStatusFilter] = useState<'All' | 'Clean' | 'In Laundry'>('All');
  const [formalityFilter, setFormalityFilter] = useState<FormalityLevel | 'All'>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // Extract user's first name
  const rawName = user ? (user.displayName || user.email?.split('@')[0] || '') : '';
  const firstName = rawName.trim().split(' ')[0] || '';
  const formattedFirstName = firstName ? firstName.charAt(0).toUpperCase() + firstName.slice(1) : '';

  // Filtered Inventory
  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      // Category Match
      if (selectedCategory !== 'All' && item.category !== selectedCategory) return false;
      // Status Match
      if (statusFilter === 'Clean' && item.status !== 'Clean') return false;
      if (statusFilter === 'In Laundry' && item.status !== 'In Laundry') return false;
      // Formality Match
      if (formalityFilter !== 'All' && item.formality !== formalityFilter) return false;
      // Search Match
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesCategory = item.category.toLowerCase().includes(q);
        const matchesColor = item.color.toLowerCase().includes(q);
        const matchesBrand = (item.brand || '').toLowerCase().includes(q);
        const matchesLocation = (item.storageLocation || '').toLowerCase().includes(q);
        return matchesName || matchesCategory || matchesColor || matchesBrand || matchesLocation;
      }
      return true;
    });
  }, [items, selectedCategory, statusFilter, formalityFilter, searchQuery]);

  // Counts
  const cleanCount = items.filter((i) => i.status === 'Clean').length;
  const laundryCount = items.filter((i) => i.status === 'In Laundry').length;

  const getCategoryCount = (catValue: ItemCategory | 'All') => {
    if (catValue === 'All') return items.length;
    return items.filter((i) => i.category === catValue).length;
  };

  const categoryCleanCount = useMemo(() => {
    const catItems = selectedCategory === 'All' ? items : items.filter((i) => i.category === selectedCategory);
    return catItems.filter((i) => i.status === 'Clean').length;
  }, [items, selectedCategory]);

  const categoryLaundryCount = useMemo(() => {
    const catItems = selectedCategory === 'All' ? items : items.filter((i) => i.category === selectedCategory);
    return catItems.filter((i) => i.status === 'In Laundry').length;
  }, [items, selectedCategory]);

  return (
    <div className="space-y-6">
      {/* Front Page Greeting Banner */}
      <div className="bg-[#F9F9F8] dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-5 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-full bg-[#E6F0F2] dark:bg-[#004253]/40 text-[#004253] dark:text-[#38bdf8] border border-[#004253]/20 flex items-center justify-center font-bold text-base uppercase shrink-0 shadow-xs">
            {user ? (formattedFirstName ? formattedFirstName.charAt(0) : 'U') : '👋'}
          </div>
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-[#1A1A1A] dark:text-white">
              {user ? `Hello ${formattedFirstName || 'there'}!` : 'Hello!'}
            </h2>
            <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA] mt-0.5">
              {user
                ? "Ready to assemble today's fit?"
                : 'Sign in to save your wardrobe and unlock AI outfit suggestions.'}
            </p>
          </div>
        </div>
        {!user && onOpenAuth && (
          <button
            id="btn-frontpage-signin"
            onClick={onOpenAuth}
            className="px-4 py-2 rounded-xl bg-[#004253] dark:bg-[#005B73] text-white font-semibold text-xs hover:bg-[#002D3A] transition-all shadow-xs shrink-0 self-start sm:self-center"
          >
            Sign In
          </button>
        )}
      </div>

      {/* Wardrobe Inventory Tab Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2 border-b border-[#E5E5E1]/60 dark:border-[#2A2A30]">
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-[#1A1A1A] dark:text-white">
            Wardrobe Inventory
          </h1>
          <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA] mt-1">
            {selectedCategory === 'All' ? (
              <>
                {items.length} total pieces • <span className="text-[#004253] dark:text-[#38bdf8] font-medium">{cleanCount} ready to wear</span> •{' '}
                <button
                  type="button"
                  onClick={onOpenLaundryBasket}
                  className="font-semibold text-[#004253] dark:text-[#38bdf8] hover:underline inline-flex items-center gap-1"
                >
                  <span>{laundryCount} in laundry basket</span>
                  <WashingMachine className="w-3.5 h-3.5 inline" />
                </button>
              </>
            ) : (
              <>
                <span className="font-semibold text-[#1A1A1A] dark:text-white">{getCategoryCount(selectedCategory)} {selectedCategory}</span> • <span className="text-[#004253] dark:text-[#38bdf8] font-medium">{categoryCleanCount} ready to wear</span> •{' '}
                <button
                  type="button"
                  onClick={onOpenLaundryBasket}
                  className="font-semibold text-[#004253] dark:text-[#38bdf8] hover:underline inline-flex items-center gap-1"
                >
                  <span>{categoryLaundryCount} in laundry basket</span>
                  <WashingMachine className="w-3.5 h-3.5 inline" />
                </button>
              </>
            )}
          </p>
        </div>
        <button
          id="btn-add-piece-inventory-view"
          onClick={onOpenAddItem}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1A1A1A] dark:bg-[#004253] hover:bg-[#333330] dark:hover:bg-[#002D3A] text-white text-xs font-medium transition-colors shadow-xs shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[2]" />
          <span>Add Piece</span>
        </button>
      </div>

      {/* Filter & Search Controls */}
      <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-3.5 sm:p-5 shadow-xs space-y-3.5">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-[#7A7A75] dark:text-[#A1A1AA] absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search items, colors, brands..."
              className="w-full pl-10 pr-8 py-2.5 text-xs rounded-xl bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253] transition-colors placeholder-[#7A7A75] dark:placeholder-[#A1A1AA]"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 p-0.5 rounded-full text-[#7A7A75] hover:text-[#1A1A1A] dark:hover:text-white"
                title="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter Dropdowns & View Mode Grid for Phone / Flex for Desktop */}
          <div className="grid grid-cols-2 sm:flex sm:items-center gap-2 w-full sm:w-auto">
            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253] font-medium truncate"
            >
              <option value="All">All Laundry Status</option>
              <option value="Clean">Ready (Clean)</option>
              <option value="In Laundry">In Laundry</option>
            </select>

            {/* Formality Filter */}
            <select
              value={formalityFilter}
              onChange={(e) => setFormalityFilter(e.target.value as any)}
              className="w-full sm:w-auto px-3 py-2 text-xs rounded-xl bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253] font-medium truncate"
            >
              <option value="All">All Formality Levels</option>
              <option value="Casual">Casual</option>
              <option value="Smart Casual">Smart Casual</option>
              <option value="Formal">Formal</option>
              <option value="Sporty">Sporty</option>
              <option value="Party / Glam">Party / Glam</option>
            </select>

            {/* View Mode Switcher */}
            <div className="col-span-2 sm:col-auto flex items-center justify-center sm:justify-start p-1 bg-[#E6F0F2] dark:bg-[#004253]/30 border border-[#004253]/20 dark:border-[#004253]/40 rounded-xl">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === 'grid'
                    ? 'bg-[#004253] dark:bg-[#005B73] text-white shadow-xs'
                    : 'text-[#004253] dark:text-[#38bdf8] hover:bg-white/60 dark:hover:bg-[#004253]/50'
                }`}
                title="Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="sm:hidden text-[11px]">Grid</span>
              </button>
              <button
                type="button"
                onClick={() => setViewMode('list')}
                className={`flex-1 sm:flex-none px-3.5 py-1.5 rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-all ${
                  viewMode === 'list'
                    ? 'bg-[#004253] dark:bg-[#005B73] text-white shadow-xs'
                    : 'text-[#004253] dark:text-[#38bdf8] hover:bg-white/60 dark:hover:bg-[#004253]/50'
                }`}
                title="List View"
              >
                <List className="w-3.5 h-3.5" />
                <span className="sm:hidden text-[11px]">List</span>
              </button>
            </div>
          </div>
        </div>

        {/* Category Pills Bar */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-2.5 pb-0.5 no-scrollbar text-xs font-medium border-t border-[#E5E5E1]/60 dark:border-[#2A2A30]">
          {CATEGORIES.map((cat) => {
            const count = getCategoryCount(cat.value);
            const isSelected = selectedCategory === cat.value;
            return (
              <button
                key={cat.label}
                id={`btn-cat-${cat.label.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => setSelectedCategory(cat.value)}
                className={`px-3.5 py-1.5 rounded-xl whitespace-nowrap transition-all border flex items-center gap-1.5 shrink-0 text-xs ${
                  isSelected
                    ? 'bg-[#004253] dark:bg-[#005B73] text-white border-[#004253] dark:border-[#005B73] font-bold shadow-xs'
                    : 'bg-[#E6F0F2] dark:bg-[#004253]/25 text-[#004253] dark:text-[#38bdf8] border-[#004253]/20 dark:border-[#004253]/40 hover:bg-[#D1E2E5] dark:hover:bg-[#004253]/40 font-semibold'
                }`}
              >
                <span>{cat.label}</span>
                <span
                  className={`text-[10px] font-mono font-bold leading-none px-1.5 py-0.5 rounded-md ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-[#004253]/15 dark:bg-[#38bdf8]/20 text-[#004253] dark:text-[#38bdf8]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Wardrobe Items Display */}
      {filteredItems.length === 0 ? (
        <div className="bg-white border border-[#E5E5E1] rounded-2xl p-16 text-center text-[#7A7A75] space-y-4">
          <Shirt className="w-12 h-12 text-[#A1A19C] mx-auto" />
          <h3 className="text-base font-semibold text-[#1A1A1A]">No Pieces Found</h3>
          <p className="text-xs text-[#7A7A75] max-w-sm mx-auto">
            No clothing or accessory matches your current search criteria. Try clearing search filters or adding a new piece.
          </p>
          <button
            onClick={onOpenAddItem}
            className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] text-white font-medium text-xs inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Piece</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="group bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] hover:border-[#1A1A1A] dark:hover:border-[#004253] rounded-2xl overflow-hidden shadow-xs hover:shadow-md transition-all duration-200 flex flex-col"
            >
              {/* Item Card Thumbnail */}
              <div
                className="relative h-56 w-full bg-[#F9F9F8] dark:bg-[#222226] cursor-pointer overflow-hidden"
                onClick={() => onSelectItem(item)}
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />

                {/* Category Pill */}
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest category-token backdrop-blur-md shadow-xs">
                  {item.category}
                </span>

                {/* Favorite Star Button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleFavorite(item.id);
                  }}
                  className={`absolute top-3 right-3 p-2 rounded-full backdrop-blur-md transition-all border ${
                    item.isFavorite
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                      : 'bg-white/80 dark:bg-[#1C1C20]/80 text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white border-[#E5E5E1] dark:border-[#2A2A30]'
                  }`}
                >
                  <Star className={`w-3.5 h-3.5 ${item.isFavorite ? 'fill-white' : ''}`} />
                </button>

                {/* Status Badge */}
                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between">
                  <span className="text-[11px] font-medium text-white bg-[#1A1A1A]/80 px-2.5 py-0.5 rounded-full backdrop-blur-md truncate pr-2">
                    {item.color} • {item.material || 'Standard'}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest ${
                      item.status === 'Clean'
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                    }`}
                  >
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Card Footer Content */}
              <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
                <div onClick={() => onSelectItem(item)} className="cursor-pointer space-y-1">
                  <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-white group-hover:text-[#004253] dark:group-hover:text-[#38bdf8] transition-colors line-clamp-1">
                    {item.name}
                  </h3>
                  <div className="flex items-center gap-1.5 text-[11px] text-[#7A7A75] dark:text-[#A1A1AA]">
                    <MapPin className="w-3.5 h-3.5 text-[#7A7A75] dark:text-[#A1A1AA] shrink-0" />
                    <span className="truncate">{item.storageLocation}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2.5 border-t border-[#E5E5E1] dark:border-[#2A2A30] text-[11px] text-[#7A7A75] dark:text-[#A1A1AA]">
                  <span>Worn {item.timesWorn}x</span>
                  <button
                    onClick={() => onToggleCleanStatus(item.id)}
                    className="text-xs font-semibold text-[#004253] dark:text-[#38bdf8] hover:underline flex items-center gap-1 transition-colors"
                  >
                    <WashingMachine className="w-3.5 h-3.5" />
                    <span>{item.status === 'Clean' ? 'Send to Laundry' : 'Mark Clean'}</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* List View */
        <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl overflow-hidden divide-y divide-[#E5E5E1] dark:divide-[#2A2A30]">
          {filteredItems.map((item) => (
            <div
              key={item.id}
              className="p-4 hover:bg-[#F9F9F8] dark:hover:bg-[#222226] transition-colors flex items-center justify-between gap-4 cursor-pointer"
              onClick={() => onSelectItem(item)}
            >
              <div className="flex items-center gap-4 min-w-0">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-14 h-14 object-cover rounded-xl border border-[#E5E5E1] dark:border-[#2A2A30] shrink-0 bg-[#F9F9F8] dark:bg-[#222226]"
                />
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-white truncate">{item.name}</h3>
                    {item.isFavorite && <Star className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-white fill-[#1A1A1A] dark:fill-white shrink-0" />}
                  </div>
                  <div className="flex items-center gap-3 text-xs text-[#7A7A75] dark:text-[#A1A1AA] mt-1">
                    <span className="text-[#1A1A1A] dark:text-white font-medium">{item.category}</span>
                    <span>• {item.color}</span>
                    <span>• {item.storageLocation}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    item.status === 'Clean'
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                      : 'bg-rose-50 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
                  }`}
                >
                  {item.status}
                </span>

                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleCleanStatus(item.id);
                  }}
                  className="px-3.5 py-1.5 rounded-xl bg-[#E6F0F2] dark:bg-[#004253]/30 border border-[#004253]/20 hover:bg-[#004253] hover:text-white dark:hover:bg-[#005B73] text-xs font-semibold text-[#004253] dark:text-[#38bdf8] transition-all flex items-center gap-1.5"
                >
                  <WashingMachine className="w-3.5 h-3.5" />
                  <span>{item.status === 'Clean' ? 'Send to Laundry' : 'Mark Clean'}</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
