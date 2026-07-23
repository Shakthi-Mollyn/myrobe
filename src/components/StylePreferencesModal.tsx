import React, { useState } from 'react';
import { X, Sparkles, User, Sliders, Check } from 'lucide-react';
import { UserStylePreferences, GenderPreference, FitPreference } from '../types';

interface StylePreferencesModalProps {
  isOpen: boolean;
  onClose: () => void;
  preferences: UserStylePreferences;
  onSavePreferences: (updated: UserStylePreferences) => void;
}

const GENDER_OPTIONS: { value: GenderPreference; label: string; desc: string }[] = [
  { value: 'All Styles', label: 'All Styles', desc: 'No gender restrictions. Explore all wardrobe combinations freely.' },
  { value: 'Womenswear', label: 'Womenswear', desc: 'Feminine silhouettes, dresses, skirts, tailored layering & accessories.' },
  { value: 'Menswear', label: 'Menswear', desc: 'Masculine tailoring, classic outerwear, sharp cuts & structured fits.' },
  { value: 'Gender-Neutral / Unisex', label: 'Unisex / Neutral', desc: 'Fluid, modern gender-neutral styling, relaxed cuts & versatile basics.' },
];

const FIT_OPTIONS: FitPreference[] = [
  'Regular Fit',
  'Relaxed & Oversized',
  'Tailored & Slim',
  'Athletic',
];

const AESTHETIC_TAGS = [
  'Minimalist',
  'Streetwear',
  'Classic Elegance',
  'Smart Casual',
  'Old Money',
  'Y2K / Vintage',
  'Athleisure',
  'Preppy',
  'Boho / Earthy',
];

export const StylePreferencesModal: React.FC<StylePreferencesModalProps> = ({
  isOpen,
  onClose,
  preferences,
  onSavePreferences,
}) => {
  const [genderPref, setGenderPref] = useState<GenderPreference>(preferences.genderPreference || 'All Styles');
  const [fitPref, setFitPref] = useState<FitPreference>(preferences.fitPreference || 'Regular Fit');
  const [selectedAesthetics, setSelectedAesthetics] = useState<string[]>(preferences.favoriteAesthetics || ['Minimalist', 'Smart Casual']);
  const [colorMood, setColorMood] = useState(preferences.defaultColorMood || '');

  if (!isOpen) return null;

  const toggleAesthetic = (tag: string) => {
    setSelectedAesthetics((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleSave = () => {
    onSavePreferences({
      genderPreference: genderPref,
      fitPreference: fitPref,
      favoriteAesthetics: selectedAesthetics,
      defaultColorMood: colorMood,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs animate-fade-in">
      <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl max-w-xl w-full p-6 shadow-2xl relative space-y-6 max-h-[90vh] overflow-y-auto">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-[#E5E5E1] dark:border-[#2A2A30]">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-[#E6F0F2] text-[#004253] flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#1A1A1A] dark:text-white">Style & Gender Preferences</h2>
              <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA]">
                Personalize how AI constructs outfits for your closet
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[#F9F9F8] dark:bg-[#2A2A30] text-[#7A7A75] hover:text-[#1A1A1A] dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Gender / Style Category Selection */}
        <div className="space-y-3">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white">
            1. Gender & Style Aesthetic Focus
          </label>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {GENDER_OPTIONS.map((opt) => {
              const isSelected = genderPref === opt.value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => setGenderPref(opt.value)}
                  className={`p-3.5 rounded-xl border text-left transition-all relative flex flex-col justify-between ${
                    isSelected
                      ? 'border-[#004253] bg-[#E6F0F2]/50 dark:bg-[#004253]/20 shadow-xs'
                      : 'border-[#E5E5E1] dark:border-[#2A2A30] bg-[#F9F9F8] dark:bg-[#222226] hover:bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">{opt.label}</span>
                    {isSelected && <Check className="w-4 h-4 text-[#004253] dark:text-[#38bdf8]" />}
                  </div>
                  <p className="text-[11px] text-[#7A7A75] dark:text-[#A1A1AA] leading-snug">{opt.desc}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Fit & Silhouette Preference */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white">
            2. Fit & Silhouette Style
          </label>
          <div className="flex flex-wrap gap-2">
            {FIT_OPTIONS.map((fit) => {
              const isSelected = fitPref === fit;
              return (
                <button
                  key={fit}
                  type="button"
                  onClick={() => setFitPref(fit)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-[#004253] text-white border-[#004253] shadow-xs'
                      : 'bg-[#F9F9F8] dark:bg-[#222226] border-[#E5E5E1] dark:border-[#2A2A30] text-[#7A7A75] hover:text-[#1A1A1A]'
                  }`}
                >
                  {fit}
                </button>
              );
            })}
          </div>
        </div>

        {/* Favorite Aesthetics */}
        <div className="space-y-3 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white">
            3. Favorite Vibe / Aesthetics
          </label>
          <div className="flex flex-wrap gap-2">
            {AESTHETIC_TAGS.map((tag) => {
              const isSelected = selectedAesthetics.includes(tag);
              return (
                <button
                  key={tag}
                  type="button"
                  onClick={() => toggleAesthetic(tag)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    isSelected
                      ? 'bg-[#1A1A1A] text-white border-[#1A1A1A] shadow-xs'
                      : 'bg-[#F9F9F8] dark:bg-[#222226] border-[#E5E5E1] dark:border-[#2A2A30] text-[#7A7A75] hover:text-[#1A1A1A]'
                  }`}
                >
                  {isSelected ? `✓ ${tag}` : tag}
                </button>
              );
            })}
          </div>
        </div>

        {/* Color Palette Note */}
        <div className="space-y-2 pt-2">
          <label className="block text-xs font-bold uppercase tracking-wider text-[#1A1A1A] dark:text-white">
            4. Signature Color Mood (Optional)
          </label>
          <input
            type="text"
            value={colorMood}
            onChange={(e) => setColorMood(e.target.value)}
            placeholder="e.g. Earthy neutrals, Navy & White, All Black"
            className="w-full px-3.5 py-2.5 text-xs bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253]"
          />
        </div>

        {/* Actions */}
        <div className="pt-4 border-t border-[#E5E5E1] dark:border-[#2A2A30] flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-[#7A7A75] hover:bg-[#F9F9F8] transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSave}
            className="px-5 py-2.5 rounded-xl bg-[#004253] text-white font-semibold text-xs hover:bg-[#002D3A] transition-all shadow-xs flex items-center gap-2"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Save Preferences</span>
          </button>
        </div>

      </div>
    </div>
  );
};
