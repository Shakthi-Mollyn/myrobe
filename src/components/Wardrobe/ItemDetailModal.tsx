import React from 'react';
import { X, MapPin, Sparkles, Star, WashingMachine, Calendar, Trash2, Edit3, Check, Tag } from 'lucide-react';
import { WardrobeItem } from '../../types';

interface ItemDetailModalProps {
  item: WardrobeItem | null;
  onClose: () => void;
  onToggleCleanStatus: (id: string) => void;
  onToggleFavorite: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onUpdateLocation: (id: string, newLocation: string) => void;
}

export const ItemDetailModal: React.FC<ItemDetailModalProps> = ({
  item,
  onClose,
  onToggleCleanStatus,
  onToggleFavorite,
  onDeleteItem,
  onUpdateLocation,
}) => {
  if (!item) return null;

  const [isEditingLocation, setIsEditingLocation] = React.useState(false);
  const [locationValue, setLocationValue] = React.useState(item.storageLocation);

  const handleSaveLocation = () => {
    onUpdateLocation(item.id, locationValue);
    setIsEditingLocation(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden text-[#1A1A1A] dark:text-white my-8">
        {/* Header Image & Actions */}
        <div className="relative h-64 w-full bg-[#F9F9F8] dark:bg-[#222226] overflow-hidden">
          <img
            src={item.imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-white dark:from-[#1C1C20] via-white/30 dark:via-[#1C1C20]/30 to-transparent" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 rounded-full bg-white/90 dark:bg-[#1C1C20]/90 hover:bg-white dark:hover:bg-[#2A2A30] text-[#1A1A1A] dark:text-white transition-colors border border-[#E5E5E1] dark:border-[#2A2A30] shadow-xs"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Favorite Button */}
          <button
            onClick={() => onToggleFavorite(item.id)}
            className={`absolute top-4 left-4 p-2 rounded-full backdrop-blur-md transition-all border shadow-xs ${
              item.isFavorite
                ? 'bg-[#004253] text-white border-[#004253]'
                : 'bg-white/90 dark:bg-[#1C1C20]/90 text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white border-[#E5E5E1] dark:border-[#2A2A30]'
            }`}
          >
            <Star className={`w-4 h-4 ${item.isFavorite ? 'fill-white' : ''}`} />
          </button>

          {/* Badge Overlay */}
          <div className="absolute bottom-4 left-6 right-6 flex items-end justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#E6F0F2] dark:bg-[#004253]/40 text-[#004253] dark:text-[#38bdf8] border border-[#004253]/20">
                  {item.category}
                </span>
                <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#F9F9F8] dark:bg-[#222226] text-[#7A7A75] dark:text-[#A1A1AA] border border-[#E5E5E1] dark:border-[#2A2A30]">
                  {item.formality}
                </span>
              </div>
              <h2 className="text-xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">{item.name}</h2>
            </div>

            {/* Laundry Toggle Chip */}
            <button
              onClick={() => onToggleCleanStatus(item.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 border transition-all ${
                item.status === 'Clean'
                  ? 'bg-[#E6F0F2] dark:bg-[#004253]/30 text-[#004253] dark:text-[#38bdf8] border-[#004253]/20'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 border-rose-200 dark:border-rose-800'
              }`}
            >
              <WashingMachine className="w-4 h-4" />
              <span>{item.status}</span>
            </button>
          </div>
        </div>

        {/* Modal Details Body */}
        <div className="p-6 space-y-5">
          {/* Attributes Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 bg-[#F9F9F8] dark:bg-[#222226] p-4 rounded-xl border border-[#E5E5E1] dark:border-[#2A2A30] text-xs">
            <div>
              <span className="text-[#7A7A75] dark:text-[#A1A1AA] block text-[10px] uppercase font-bold tracking-widest">Primary Color</span>
              <span className="font-semibold text-[#1A1A1A] dark:text-white">{item.color}</span>
            </div>
            <div>
              <span className="text-[#7A7A75] dark:text-[#A1A1AA] block text-[10px] uppercase font-bold tracking-widest">Material</span>
              <span className="font-semibold text-[#1A1A1A] dark:text-white">{item.material || 'N/A'}</span>
            </div>
            <div>
              <span className="text-[#7A7A75] dark:text-[#A1A1AA] block text-[10px] uppercase font-bold tracking-widest">Brand / Tag</span>
              <span className="font-semibold text-[#1A1A1A] dark:text-white">{item.brand || 'Unbranded'}</span>
            </div>
            <div>
              <span className="text-[#7A7A75] dark:text-[#A1A1AA] block text-[10px] uppercase font-bold tracking-widest">Times Worn</span>
              <span className="font-semibold text-[#004253] dark:text-[#38bdf8]">{item.timesWorn} times</span>
            </div>
            <div>
              <span className="text-[#7A7A75] dark:text-[#A1A1AA] block text-[10px] uppercase font-bold tracking-widest">Last Worn</span>
              <span className="font-semibold text-[#1A1A1A] dark:text-white">{item.lastWornDate || 'Never logged'}</span>
            </div>
            <div>
              <span className="text-[#7A7A75] dark:text-[#A1A1AA] block text-[10px] uppercase font-bold tracking-widest">Seasons</span>
              <span className="font-semibold text-[#1A1A1A] dark:text-white">{item.seasons.join(', ')}</span>
            </div>
          </div>

          {/* Home Storage Location */}
          <div className="bg-[#F9F9F8] dark:bg-[#222226] p-4 rounded-xl border border-[#E5E5E1] dark:border-[#2A2A30] flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="w-4 h-4 text-[#7A7A75] dark:text-[#A1A1AA] shrink-0" />
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A7A75] dark:text-[#A1A1AA] block">
                  Home Storage Location
                </span>
                {!isEditingLocation ? (
                  <span className="text-sm font-semibold text-[#1A1A1A] dark:text-white">{item.storageLocation}</span>
                ) : (
                  <div className="flex items-center gap-2 mt-1">
                    <input
                      type="text"
                      value={locationValue}
                      onChange={(e) => setLocationValue(e.target.value)}
                      className="px-2.5 py-1 text-xs bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-lg text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253]"
                    />
                    <button
                      onClick={handleSaveLocation}
                      className="p-1 rounded bg-[#004253] dark:bg-[#005B73] text-white font-medium"
                    >
                      <Check className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>
            </div>

            {!isEditingLocation && (
              <button
                onClick={() => setIsEditingLocation(true)}
                className="text-xs text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white flex items-center gap-1 font-medium"
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>Edit</span>
              </button>
            )}
          </div>

          {/* Notes / Stylist Rationale */}
          {item.notes && (
            <div className="bg-[#F9F9F8] dark:bg-[#222226] p-4 rounded-xl border border-[#E5E5E1] dark:border-[#2A2A30] text-xs">
              <span className="font-bold text-[#1A1A1A] dark:text-white block mb-1">Stylist & Closet Notes:</span>
              <p className="text-[#7A7A75] dark:text-[#A1A1AA] leading-relaxed">{item.notes}</p>
            </div>
          )}

          {/* Actions Footer */}
          <div className="flex items-center justify-between pt-4 border-t border-[#E5E5E1] dark:border-[#2A2A30]">
            <button
              onClick={() => {
                onDeleteItem(item.id);
                onClose();
              }}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
              <span>Remove from Wardrobe</span>
            </button>

            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-xs font-semibold bg-[#004253] dark:bg-[#005B73] hover:bg-[#002D3A] text-white transition-colors shadow-xs"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
