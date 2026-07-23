import React, { useState } from 'react';
import {
  Sparkles,
  Loader2,
  Compass,
  Shirt,
  Sliders,
} from 'lucide-react';
import {
  WeatherData,
  Occasion,
  SuggestedOutfit,
  WardrobeItem,
  AIRecommendationResponse,
  UserStylePreferences,
  GenderPreference,
  FitPreference,
} from '../../types';
import { OutfitCard } from './OutfitCard';

interface OutfitStylistViewProps {
  weather: WeatherData;
  wardrobe: WardrobeItem[];
  onWearToday: (outfit: SuggestedOutfit) => void;
  onSaveOutfit: (outfit: SuggestedOutfit) => void;
  savedOutfitIds: string[];
  stylePreferences?: UserStylePreferences;
  onOpenStylePreferences?: () => void;
  onAddItem?: (newItem: Omit<WardrobeItem, 'id' | 'createdAt' | 'timesWorn'>) => void;
}

const OCCASIONS: Occasion[] = [
  'Casual Work / Office',
  'Formal Business',
  'Casual Day Out',
  'Date Night',
  'Party & Evening Event',
  'Gym / Workout',
  'Beach & Summer Resort',
  'Rainy Day Commute',
  'Cozy Lounge / Home',
  'Travel & Flight',
];

const GENDER_PREFERENCES: GenderPreference[] = [
  'All Styles',
  'Womenswear',
  'Menswear',
  'Gender-Neutral / Unisex',
];

const FIT_PREFERENCES: FitPreference[] = [
  'Regular Fit',
  'Relaxed & Oversized',
  'Tailored & Slim',
  'Athletic',
];

export const OutfitStylistView: React.FC<OutfitStylistViewProps> = ({
  weather,
  wardrobe,
  onWearToday,
  onSaveOutfit,
  savedOutfitIds,
  stylePreferences,
  onOpenStylePreferences,
}) => {
  // Full Outfit Generator States
  const [selectedOccasion, setSelectedOccasion] = useState<Occasion>('Casual Day Out');
  const [genderPreference, setGenderPreference] = useState<GenderPreference>(
    stylePreferences?.genderPreference || 'All Styles'
  );
  const [fitPreference, setFitPreference] = useState<FitPreference>(
    stylePreferences?.fitPreference || 'Regular Fit'
  );
  const [colorPreference, setColorPreference] = useState(stylePreferences?.defaultColorMood || '');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [recommendations, setRecommendations] = useState<AIRecommendationResponse | null>(null);

  const cleanWardrobeItems = wardrobe.filter((i) => i.status === 'Clean');

  // Handle Full Outfit Generation
  const handleGenerateOutfits = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const response = await fetch('/api/suggest-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          weather,
          occasion: selectedOccasion,
          genderPreference,
          fitPreference,
          colorPreference: colorPreference.trim() || undefined,
          wardrobe,
        }),
      });

      if (!response.ok) {
        throw new Error('Stylist AI service returned an error');
      }

      const data: AIRecommendationResponse = await response.json();
      setRecommendations(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg('Failed to generate outfit recommendations. Please verify your connection or try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Controls Panel */}
      <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-6 shadow-xs space-y-6">
        {/* Gender / Style Category Selection */}
        <div>
          <div className="flex items-center justify-between mb-2.5">
            <label className="text-[10px] font-bold uppercase tracking-widest text-[#7A7A75] dark:text-[#A1A1AA]">
              1. Gender & Style Aesthetic Focus
            </label>
            {onOpenStylePreferences && (
              <button
                type="button"
                onClick={onOpenStylePreferences}
                className="text-[11px] font-semibold text-[#004253] dark:text-[#38bdf8] hover:underline flex items-center gap-1"
              >
                <Sliders className="w-3 h-3" />
                <span>Customize Profile</span>
              </button>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {GENDER_PREFERENCES.map((g) => (
              <button
                key={g}
                type="button"
                id={`btn-gender-pref-${g.toLowerCase().replace(/[\s\/]+/g, '-')}`}
                onClick={() => setGenderPreference(g)}
                className={`px-3.5 py-2 rounded-xl text-xs font-semibold transition-all border ${
                  genderPreference === g
                    ? 'bg-[#004253] dark:bg-[#005B73] text-white border-[#004253] shadow-xs'
                    : 'bg-[#F9F9F8] dark:bg-[#222226] text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white border-[#E5E5E1] dark:border-[#2A2A30]'
                }`}
              >
                {g}
              </button>
            ))}
          </div>
        </div>

        {/* Occasion Selection */}
        <div className="pt-5 border-t border-[#E5E5E1] dark:border-[#2A2A30]">
          <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A7A75] dark:text-[#A1A1AA] mb-2.5">
            2. Select Occasion / Event
          </label>
          <div className="flex flex-wrap gap-2">
            {OCCASIONS.map((occ) => (
              <button
                key={occ}
                id={`btn-occ-${occ.toLowerCase().replace(/[\s\/]+/g, '-')}`}
                onClick={() => setSelectedOccasion(occ)}
                className={`px-3.5 py-2 rounded-xl text-xs font-medium transition-all border ${
                  selectedOccasion === occ
                    ? 'bg-[#1A1A1A] dark:bg-[#004253] text-white font-semibold border-[#1A1A1A] shadow-xs'
                    : 'bg-[#F9F9F8] dark:bg-[#222226] text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white border-[#E5E5E1] dark:border-[#2A2A30]'
                }`}
              >
                {occ}
              </button>
            ))}
          </div>
        </div>

        {/* Fit Silhouette & Color Preference Grid */}
        <div className="pt-5 border-t border-[#E5E5E1] dark:border-[#2A2A30] grid grid-cols-1 md:grid-cols-2 gap-5">
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A7A75] dark:text-[#A1A1AA] mb-2.5">
              3. Fit / Silhouette Preference
            </label>
            <div className="flex flex-wrap gap-1.5">
              {FIT_PREFERENCES.map((fit) => (
                <button
                  key={fit}
                  type="button"
                  onClick={() => setFitPreference(fit)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                    fitPreference === fit
                      ? 'bg-[#1A1A1A] dark:bg-[#004253] text-white border-[#1A1A1A]'
                      : 'bg-[#F9F9F8] dark:bg-[#222226] text-[#7A7A75] dark:text-[#A1A1AA] border-[#E5E5E1] dark:border-[#2A2A30]'
                  }`}
                >
                  {fit}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-[10px] font-bold uppercase tracking-widest text-[#7A7A75] dark:text-[#A1A1AA] mb-2.5">
              4. Color Accent Preference (Optional)
            </label>
            <input
              type="text"
              value={colorPreference}
              onChange={(e) => setColorPreference(e.target.value)}
              placeholder="e.g. Earthy tones, Warm monochrome, Cream & Gold"
              className="w-full px-3.5 py-2 text-xs bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#1A1A1A] rounded-xl"
            />
          </div>
        </div>

        {/* Generate Action Button */}
        <div className="pt-4 border-t border-[#E5E5E1] dark:border-[#2A2A30] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-xs text-[#7A7A75] dark:text-[#A1A1AA]">
            <span className="font-semibold text-[#1A1A1A] dark:text-white">{cleanWardrobeItems.length}</span> Clean Pieces Ready
            <span className="hidden sm:inline">• Target: <strong className="text-[#004253] dark:text-[#38bdf8]">{genderPreference}</strong> ({fitPreference})</span>
          </div>
          <button
            id="btn-generate-outfits-panel"
            onClick={handleGenerateOutfits}
            disabled={isLoading || wardrobe.length === 0}
            className="px-6 py-3 rounded-xl bg-[#1A1A1A] dark:bg-[#004253] hover:bg-[#333330] dark:hover:bg-[#002D3A] text-white font-medium text-xs shadow-xs flex items-center gap-2.5 transition-all active:scale-[0.98] shrink-0"
          >
            {isLoading ? (
              <Loader2 className="w-4 h-4 animate-spin text-white" />
            ) : (
              <Sparkles className="w-4 h-4 text-[#004253] dark:text-[#38bdf8]" />
            )}
            <span>{isLoading ? 'Crafting Outfits...' : 'Generate Outfits'}</span>
          </button>
        </div>
      </div>

      {/* Error Message if Any */}
      {errorMsg && (
        <div className="p-4 bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 rounded-2xl text-xs text-rose-700 dark:text-rose-300">
          {errorMsg}
        </div>
      )}

      {/* Recommendations Output Display */}
      {isLoading ? (
        <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-16 text-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#004253] dark:text-[#38bdf8] animate-spin mx-auto" />
          <h3 className="text-base font-semibold text-[#1A1A1A] dark:text-white">Styling Outfits for {weather.location}...</h3>
          <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA] max-w-sm mx-auto">
            Analyzing your {wardrobe.length} items against current weather ({weather.temperatureC}°C, {weather.condition}) and {selectedOccasion}...
          </p>
        </div>
      ) : recommendations ? (
        <div className="space-y-6">
          {/* Stylist Summary Note */}
          <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-5 shadow-xs flex items-start gap-3">
            <div className="p-2 rounded-xl bg-[#E6F0F2] dark:bg-[#004253]/30 text-[#004253] dark:text-[#38bdf8] border border-[#004253]/20 shrink-0 mt-0.5">
              <Compass className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-[#7A7A75] dark:text-[#A1A1AA] mb-1">
                Stylist Rationale
              </h4>
              <p className="text-xs text-[#1A1A1A] dark:text-white leading-relaxed">
                {recommendations.generalStylingAdvice}
              </p>
            </div>
          </div>

          {/* Generated Outfit Cards */}
          <div className="space-y-6">
            {recommendations.outfits.map((outfit) => (
              <OutfitCard
                key={outfit.id}
                outfit={outfit}
                wardrobe={wardrobe}
                onWearToday={onWearToday}
                onSaveOutfit={onSaveOutfit}
                isSaved={savedOutfitIds.includes(outfit.id)}
              />
            ))}
          </div>
        </div>
      ) : (
        /* Default Call to Action state */
        <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-12 text-center space-y-4 text-[#7A7A75] dark:text-[#A1A1AA]">
          <div className="w-12 h-12 rounded-2xl bg-[#E6F0F2] dark:bg-[#004253]/30 border border-[#004253]/20 text-[#004253] dark:text-[#38bdf8] flex items-center justify-center mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-base font-semibold text-[#1A1A1A] dark:text-white">Ready to Style Your Outfits</h3>
            <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA] max-w-md mx-auto mt-1">
              Select an occasion above and click "Generate Outfits" to receive tailored, weather-aware outfit suggestions.
            </p>
          </div>
          <button
            onClick={handleGenerateOutfits}
            disabled={wardrobe.length === 0}
            className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] dark:bg-[#004253] text-white font-medium text-xs inline-flex items-center gap-2"
          >
            <Sparkles className="w-4 h-4 text-[#004253] dark:text-[#38bdf8]" />
            <span>Generate Outfits Now</span>
          </button>
        </div>
      )}
    </div>
  );
};

