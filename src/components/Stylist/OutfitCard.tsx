import React from 'react';
import { Sparkles, CheckCircle, Tag, Thermometer, ShieldCheck, Bookmark, ArrowRight, Heart } from 'lucide-react';
import { SuggestedOutfit, WardrobeItem } from '../../types';

interface OutfitCardProps {
  outfit: SuggestedOutfit;
  wardrobe: WardrobeItem[];
  onWearToday: (outfit: SuggestedOutfit) => void;
  onSaveOutfit: (outfit: SuggestedOutfit) => void;
  isSaved?: boolean;
}

export const OutfitCard: React.FC<OutfitCardProps> = ({
  outfit,
  wardrobe,
  onWearToday,
  onSaveOutfit,
  isSaved = false,
}) => {
  // Map wardrobe items if available for images
  const getWardrobeImage = (itemId?: string) => {
    if (!itemId) return null;
    const found = wardrobe.find((i) => i.id === itemId);
    return found ? found.imageUrl : null;
  };

  return (
    <div className="bg-white border border-[#E5E5E1] hover:border-[#1A1A1A] rounded-2xl p-6 shadow-sm space-y-5 text-[#1A1A1A] transition-all">
      {/* Card Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-[#E5E5E1]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#F5F5F0] text-[#1A1A1A] border border-[#E5E5E1]">
              {outfit.styleVibe}
            </span>
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#E6F0F2] text-[#004253] border border-[#004253]/20 flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>{outfit.matchScore}% Match</span>
            </span>
          </div>
          <h3 className="text-xl font-light tracking-tight text-[#1A1A1A]">{outfit.title}</h3>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={() => onSaveOutfit(outfit)}
            className={`px-4 py-2.5 rounded-xl border text-xs font-medium flex items-center gap-1.5 transition-all ${
              isSaved
                ? 'bg-[#1A1A1A] text-white border-[#1A1A1A]'
                : 'bg-white hover:bg-[#F5F5F0] text-[#1A1A1A] border-[#E5E5E1]'
            }`}
          >
            <Bookmark className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>

          <button
            onClick={() => onWearToday(outfit)}
            className="px-5 py-2.5 rounded-2xl bg-[#1A1A1A] hover:bg-[#333330] text-white font-medium text-xs shadow-xs flex items-center gap-1.5 transition-all active:scale-[0.98]"
          >
            <CheckCircle className="w-4 h-4 text-[#004253]" />
            <span>Wear Today</span>
          </button>
        </div>
      </div>

      {/* Rationale & Weather Suitability */}
      <div className="bg-[#F9F9F8] p-4 rounded-xl border border-[#E5E5E1] space-y-2 text-xs">
        <p className="text-[#4A4A45] leading-relaxed">
          <span className="text-[#1A1A1A] font-bold">Stylist Note: </span>
          {outfit.overallReasoning}
        </p>
        <div className="flex items-center gap-2 text-[#004253] pt-1 font-medium">
          <Thermometer className="w-4 h-4 text-[#004253] shrink-0" />
          <span>{outfit.weatherSuitability}</span>
        </div>
      </div>

      {/* Outfit Elements Breakdown */}
      <div>
        <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#7A7A75] mb-3">
          Outfit Combination Breakdown ({outfit.items.length} Pieces)
        </h4>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {outfit.items.map((item, idx) => {
            const imgUrl = getWardrobeImage(item.itemId);
            return (
              <div
                key={idx}
                className="bg-[#F9F9F8] p-3 rounded-xl border border-[#E5E5E1] flex items-center gap-3"
              >
                {imgUrl ? (
                  <img
                    src={imgUrl}
                    alt={item.itemName}
                    className="w-12 h-12 object-cover rounded-lg border border-[#E5E5E1] shrink-0 bg-white"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-lg bg-white border border-[#E5E5E1] flex items-center justify-center shrink-0 text-[#1A1A1A]">
                    <Tag className="w-5 h-5 text-[#7A7A75]" />
                  </div>
                )}

                <div className="min-w-0 text-xs">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#7A7A75] block">
                    {item.category}
                  </span>
                  <p className="font-semibold text-[#1A1A1A] truncate">{item.itemName}</p>
                  <p className="text-[11px] text-[#7A7A75] line-clamp-1">{item.reasoning}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Styling Tips & Accessory Recommendations */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#E5E5E1] text-xs">
        {outfit.stylingTips && outfit.stylingTips.length > 0 && (
          <div className="bg-[#F9F9F8] p-3.5 rounded-xl border border-[#E5E5E1] space-y-1.5">
            <span className="font-bold text-[#1A1A1A] block">Pro Styling Tips:</span>
            <ul className="list-disc list-inside space-y-1 text-[#4A4A45]">
              {outfit.stylingTips.map((tip, i) => (
                <li key={i}>{tip}</li>
              ))}
            </ul>
          </div>
        )}

        {outfit.suggestedAccessories && outfit.suggestedAccessories.length > 0 && (
          <div className="bg-[#F9F9F8] p-3.5 rounded-xl border border-[#E5E5E1] space-y-1.5">
            <span className="font-bold text-[#004253] block">Accessory Pairings:</span>
            <ul className="list-disc list-inside space-y-1 text-[#4A4A45]">
              {outfit.suggestedAccessories.map((acc, i) => (
                <li key={i}>{acc}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};
