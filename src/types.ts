export type GenderPreference = 'Womenswear' | 'Menswear' | 'Gender-Neutral / Unisex' | 'All Styles';

export type FitPreference = 'Regular Fit' | 'Relaxed & Oversized' | 'Tailored & Slim' | 'Athletic';

export interface UserStylePreferences {
  genderPreference: GenderPreference;
  fitPreference: FitPreference;
  favoriteAesthetics: string[];
  defaultColorMood?: string;
}

export type ItemCategory =
  | 'Tops'
  | 'Bottoms'
  | 'Dresses & One-Pieces'
  | 'Outerwear'
  | 'Shoes'
  | 'Bags'
  | 'Jewelry & Watches'
  | 'Hats & Eyewear'
  | 'Accessories & Belts';

export type CleanStatus = 'Clean' | 'In Laundry' | 'Dry Cleaning';

export type FormalityLevel = 'Casual' | 'Smart Casual' | 'Formal' | 'Sporty' | 'Party / Glam';

export type Season = 'Spring' | 'Summer' | 'Autumn' | 'Winter' | 'All Seasons';

export interface WardrobeItem {
  id: string;
  name: string;
  category: ItemCategory;
  genderCategory?: GenderPreference;
  subCategory?: string;
  color: string;
  secondaryColor?: string;
  material?: string;
  brand?: string;
  formality: FormalityLevel;
  seasons: Season[];
  imageUrl: string;
  status: CleanStatus;
  storageLocation: string; // e.g. "Main Closet Shelf 2", "Shoe Rack", "Jewelry Box"
  isFavorite: boolean;
  timesWorn: number;
  lastWornDate?: string;
  notes?: string;
  createdAt: string;
}

export interface WeatherData {
  location: string;
  temperatureC: number;
  temperatureF: number;
  condition: 'Sunny' | 'Partly Cloudy' | 'Rainy' | 'Windy' | 'Snowy' | 'Hot & Humid' | 'Cold & Crisp';
  humidity: number;
  icon: string;
  season: Season;
  adviceSummary: string;
}

export type Occasion =
  | 'Casual Work / Office'
  | 'Formal Business'
  | 'Casual Day Out'
  | 'Date Night'
  | 'Party & Evening Event'
  | 'Gym / Workout'
  | 'Beach & Summer Resort'
  | 'Rainy Day Commute'
  | 'Cozy Lounge / Home'
  | 'Travel & Flight';

export interface SuggestedOutfitItem {
  itemId?: string;
  itemName: string;
  category: ItemCategory;
  color: string;
  reasoning: string;
  isFromWardrobe: boolean;
}

export interface SuggestedOutfit {
  id: string;
  title: string;
  styleVibe: string;
  matchScore: number; // 0 - 100
  items: SuggestedOutfitItem[];
  overallReasoning: string;
  weatherSuitability: string;
  stylingTips: string[];
  suggestedAccessories: string[];
}

export interface SavedOutfit {
  id: string;
  title: string;
  occasion: Occasion;
  styleVibe: string;
  itemIds: string[];
  customNotes?: string;
  createdAt: string;
  lastWornDate?: string;
}

export interface WearLog {
  id: string;
  date: string; // YYYY-MM-DD
  outfitId?: string;
  outfitName: string;
  itemIds: string[];
  occasion: string;
  location?: string;
  rating?: number; // 1 to 5 stars
  notes?: string;
}

export interface AIRecommendationRequest {
  weather: WeatherData;
  occasion: Occasion;
  genderPreference?: GenderPreference;
  fitPreference?: FitPreference;
  stylePreference?: string;
  colorPreference?: string;
  wardrobe: WardrobeItem[];
}

export interface AIRecommendationResponse {
  outfits: SuggestedOutfit[];
  generalStylingAdvice: string;
  missingKeyPiecesSuggestion?: string[];
}

export interface ItemAnalysisResponse {
  name: string;
  category: ItemCategory;
  subCategory: string;
  color: string;
  material: string;
  formality: FormalityLevel;
  seasons: Season[];
  suggestedStorageLocation: string;
  styleNotes: string;
}

export interface RecommendedAccessory {
  placement: string;
  accessoryName: string;
  color: string;
  material?: string;
  stylingTip: string;
  isFromWardrobe: boolean;
  matchedWardrobeItemId?: string;
  matchedWardrobeItemName?: string;
}

export interface AccessorySet {
  id: string;
  setName: string;
  aestheticVibe: string;
  matchScore: number;
  stylistAdvice: string;
  recommendedAccessories: RecommendedAccessory[];
}

export interface ImageAccessoryResponse {
  detectedOutfitSummary: string;
  outfitColorPalette: string[];
  overallStylingVibe: string;
  accessorySets: AccessorySet[];
}

