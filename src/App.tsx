import React, { useState, useEffect } from 'react';
import { Shirt, Plus, WashingMachine } from 'lucide-react';
import { Navbar } from './components/Navbar';
import { WardrobeView } from './components/Wardrobe/WardrobeView';
import { AddItemModal } from './components/Wardrobe/AddItemModal';
import { ItemDetailModal } from './components/Wardrobe/ItemDetailModal';
import { LaundryBasketModal, LaundryCycleState } from './components/Wardrobe/LaundryBasketModal';
import { OutfitStylistView } from './components/Stylist/OutfitStylistView';
import { HistoryAndAnalyticsView } from './components/HistoryAndAnalytics/HistoryAndAnalyticsView';
import { AuthModal } from './components/AuthModal';
import { StylePreferencesModal } from './components/StylePreferencesModal';
import { auth, onAuthStateChanged, User } from './lib/firebase';
import { INITIAL_WARDROBE } from './data/defaultWardrobe';
import { WardrobeItem, WeatherData, SuggestedOutfit, SavedOutfit, WearLog, UserStylePreferences } from './types';

const LOCAL_STORAGE_WARDROBE_KEY = 'myrobe_wardrobe_items_v1';
const LOCAL_STORAGE_SAVED_OUTFITS_KEY = 'myrobe_saved_outfits_v1';
const LOCAL_STORAGE_WEAR_LOGS_KEY = 'myrobe_wear_logs_v1';
const LOCAL_STORAGE_DARK_MODE_KEY = 'myrobe_dark_mode_v1';
const LOCAL_STORAGE_STYLE_PREFS_KEY = 'myrobe_style_preferences_v1';
const LOCAL_STORAGE_LAUNDRY_CYCLE_KEY = 'myrobe_laundry_cycle_v1';

export default function App() {
  const [activeTab, setActiveTab] = useState<'wardrobe' | 'stylist' | 'history-analytics'>('wardrobe');
  const [user, setUser] = useState<User | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [isStylePreferencesOpen, setIsStylePreferencesOpen] = useState<boolean>(false);
  const [isLaundryBasketOpen, setIsLaundryBasketOpen] = useState<boolean>(false);

  // Laundry Active Cycle State
  const [activeLaundryCycle, setActiveLaundryCycle] = useState<LaundryCycleState | null>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_LAUNDRY_CYCLE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return null;
  });

  useEffect(() => {
    try {
      if (activeLaundryCycle) {
        localStorage.setItem(LOCAL_STORAGE_LAUNDRY_CYCLE_KEY, JSON.stringify(activeLaundryCycle));
      } else {
        localStorage.removeItem(LOCAL_STORAGE_LAUNDRY_CYCLE_KEY);
      }
    } catch (e) {
      console.error(e);
    }
  }, [activeLaundryCycle]);

  // Auto-complete wash cycle when time expires (marks items as Clean and empties laundry basket)
  useEffect(() => {
    if (!activeLaundryCycle || activeLaundryCycle.status !== 'running') return;

    const checkCycleTimer = () => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - activeLaundryCycle.startTime) / 1000);
      const remainingSeconds = activeLaundryCycle.totalDurationSeconds - elapsedSeconds;

      if (remainingSeconds <= 0) {
        // Wash time is over! Mark items as Clean and empty the basket
        setWardrobe((prev) =>
          prev.map((item) => {
            if (activeLaundryCycle.itemIds.includes(item.id) || item.status === 'In Laundry') {
              return { ...item, status: 'Clean' };
            }
            return item;
          })
        );
        setActiveLaundryCycle(null);
        showToast('✨ Wash cycle complete! All items marked as clean and basket emptied.');
      }
    };

    checkCycleTimer();
    const interval = setInterval(checkCycleTimer, 1000);
    return () => clearInterval(interval);
  }, [activeLaundryCycle]);

  // User Style & Gender Preferences State
  const [stylePreferences, setStylePreferences] = useState<UserStylePreferences>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_STYLE_PREFS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return {
      genderPreference: 'All Styles',
      fitPreference: 'Regular Fit',
      favoriteAesthetics: ['Minimalist', 'Smart Casual'],
      defaultColorMood: '',
    };
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_STYLE_PREFS_KEY, JSON.stringify(stylePreferences));
    } catch (e) {
      console.error(e);
    }
  }, [stylePreferences]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });
    return () => unsubscribe();
  }, []);

  // Dark Mode State
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_DARK_MODE_KEY);
      if (saved !== null) return JSON.parse(saved);
      return false;
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_DARK_MODE_KEY, JSON.stringify(isDarkMode));
    } catch (e) {
      console.error(e);
    }
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Local Storage Wardrobe State
  const [wardrobe, setWardrobe] = useState<WardrobeItem[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_WARDROBE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load wardrobe from storage', e);
    }
    return INITIAL_WARDROBE;
  });

  // Local Storage Saved Outfits State
  const [savedOutfits, setSavedOutfits] = useState<SavedOutfit[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_SAVED_OUTFITS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'so-1',
        title: 'Smart Office Minimalist Look',
        occasion: 'Casual Work / Office',
        styleVibe: 'Modern Chic',
        itemIds: ['w-1', 'w-5', 'w-7', 'w-9', 'w-12'],
        createdAt: '2026-07-20',
      },
      {
        id: 'so-2',
        title: 'Cozy Coffee Date Fit',
        occasion: 'Date Night',
        styleVibe: 'Relaxed Tailored',
        itemIds: ['w-2', 'w-4', 'w-6', 'w-8', 'w-10'],
        createdAt: '2026-07-21',
      },
    ];
  });

  // Local Storage Wear Logs State
  const [wearLogs, setWearLogs] = useState<WearLog[]>(() => {
    try {
      const stored = localStorage.getItem(LOCAL_STORAGE_WEAR_LOGS_KEY);
      if (stored) return JSON.parse(stored);
    } catch (e) {
      console.error(e);
    }
    return [
      {
        id: 'wl-1',
        date: '2026-07-21',
        outfitName: 'Clean Leather Low-Top White Sneakers + High-Waisted Jeans',
        itemIds: ['w-8', 'w-4'],
        occasion: 'Casual Day Out',
        rating: 5,
        notes: 'Super comfortable all day',
      },
      {
        id: 'wl-2',
        date: '2026-07-19',
        outfitName: 'Oxford Shirt + Tailored Trousers + Gold Watch',
        itemIds: ['w-1', 'w-5', 'w-12'],
        occasion: 'Office Meeting',
        rating: 5,
        notes: 'Professional and polished look',
      },
    ];
  });

  // Weather State
  const [weather, setWeather] = useState<WeatherData>({
    location: 'Bangalore',
    temperatureC: 26,
    temperatureF: 79,
    condition: 'Partly Cloudy',
    humidity: 58,
    icon: 'cloud-sun',
    season: 'Summer',
    adviceSummary: 'Pleasant, moderate breeze with light cloud cover. Great for breathable linen shirts, cotton tees, or light layers.',
  });
  const [isWeatherLoading, setIsWeatherLoading] = useState(false);

  // Modals & Search State
  const [isAddItemOpen, setIsAddItemOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<WardrobeItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save to LocalStorage effects
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_WARDROBE_KEY, JSON.stringify(wardrobe));
    } catch (e) {
      console.error(e);
    }
  }, [wardrobe]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_SAVED_OUTFITS_KEY, JSON.stringify(savedOutfits));
    } catch (e) {
      console.error(e);
    }
  }, [savedOutfits]);

  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_WEAR_LOGS_KEY, JSON.stringify(wearLogs));
    } catch (e) {
      console.error(e);
    }
  }, [wearLogs]);

  // Fetch Weather by City Name
  const fetchWeather = async (city: string, showNotification = true) => {
    setIsWeatherLoading(true);
    try {
      const res = await fetch(`/api/weather?location=${encodeURIComponent(city)}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
        if (showNotification) {
          showToast(`📍 Weather updated for ${data.location} (${data.temperatureC}°C, ${data.condition})`);
        }
      } else {
        if (showNotification) showToast(`⚠️ Could not fetch weather for "${city}"`);
      }
    } catch (err) {
      console.error(err);
      if (showNotification) showToast(`⚠️ Network error fetching weather`);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  // Fetch Weather by Auto IP Detection
  const fetchAutoLocationWeather = async (showNotification = true) => {
    setIsWeatherLoading(true);
    try {
      const res = await fetch('/api/weather?auto=true');
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
        if (showNotification) {
          showToast(`📍 Auto-detected location: ${data.location} (${data.temperatureC}°C, ${data.condition})`);
        }
      } else {
        fetchWeather('Bangalore', false);
      }
    } catch (err) {
      console.error(err);
      fetchWeather('Bangalore', false);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  // Fetch Weather by Geographic Coordinates (GPS)
  const fetchWeatherByCoords = async (lat: number, lng: number, showNotification = true) => {
    setIsWeatherLoading(true);
    try {
      const res = await fetch(`/api/weather?lat=${lat}&lng=${lng}`);
      if (res.ok) {
        const data = await res.json();
        setWeather(data);
        if (showNotification) {
          showToast(`📍 Auto-detected GPS location: ${data.location} (${data.temperatureC}°C, ${data.condition})`);
        }
      } else {
        fetchAutoLocationWeather(showNotification);
      }
    } catch (err) {
      console.error(err);
      fetchAutoLocationWeather(showNotification);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  // Auto-Detect Current Location via Browser Geolocation with IP Fallback
  const handleDetectLocation = (showNotification = true) => {
    if (showNotification) {
      showToast('📡 Detecting your location...');
    }

    if (!navigator.geolocation) {
      fetchAutoLocationWeather(showNotification);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchWeatherByCoords(latitude, longitude, showNotification);
      },
      (error) => {
        console.warn('Browser GPS permission error or unavailable, using IP fallback:', error);
        fetchAutoLocationWeather(showNotification);
      },
      { enableHighAccuracy: false, timeout: 6000, maximumAge: 300000 }
    );
  };

  useEffect(() => {
    // Attempt location auto-detection on initial mount
    handleDetectLocation(false);
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3000);
  };

  // Handlers
  const handleAddItem = (newItem: Omit<WardrobeItem, 'id' | 'createdAt' | 'timesWorn'>) => {
    const itemToAdd: WardrobeItem = {
      ...newItem,
      id: `w-${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      timesWorn: 0,
    };
    setWardrobe((prev) => [itemToAdd, ...prev]);
    showToast(`Added "${newItem.name}" to your wardrobe!`);
  };

  const handleToggleCleanStatus = (id: string) => {
    setWardrobe((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = item.status === 'Clean' ? 'In Laundry' : 'Clean';
          showToast(
            newStatus === 'In Laundry'
              ? `Added "${item.name}" to Laundry Basket 🧺`
              : `Marked "${item.name}" as Clean ✨`
          );
          return { ...item, status: newStatus };
        }
        return item;
      })
    );
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, status: prev.status === 'Clean' ? 'In Laundry' : 'Clean' } : null));
    }
  };

  const handleStartLaundryCycle = (itemIds: string[], durationSeconds: number, presetName: string) => {
    const newCycle: LaundryCycleState = {
      id: `cycle-${Date.now()}`,
      itemIds,
      startTime: Date.now(),
      durationSeconds,
      totalDurationSeconds: durationSeconds,
      presetName,
      status: 'running',
    };
    setActiveLaundryCycle(newCycle);
    showToast(`Started "${presetName}" wash cycle! 🧺`);
  };

  const handleCompleteLaundryCycle = (itemIds: string[]) => {
    setWardrobe((prev) =>
      prev.map((item) => {
        if (itemIds.includes(item.id) || item.status === 'In Laundry') {
          return { ...item, status: 'Clean' };
        }
        return item;
      })
    );
    setActiveLaundryCycle(null);
    showToast('✨ Wash cycle complete! Items marked as clean and basket emptied.');
  };

  const handleCancelLaundryCycle = () => {
    setActiveLaundryCycle(null);
    showToast('Laundry cycle cancelled.');
  };

  const handleRemoveFromLaundry = (id: string) => {
    setWardrobe((prev) =>
      prev.map((item) => (item.id === id ? { ...item, status: 'Clean' } : item))
    );
    showToast('Removed item from laundry basket');
  };

  const handleToggleFavorite = (id: string) => {
    setWardrobe((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newFav = !item.isFavorite;
          showToast(newFav ? `Added "${item.name}" to favorites` : `Removed "${item.name}" from favorites`);
          return { ...item, isFavorite: newFav };
        }
        return item;
      })
    );
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, isFavorite: !prev.isFavorite } : null));
    }
  };

  const handleDeleteItem = (id: string) => {
    const item = wardrobe.find((i) => i.id === id);
    setWardrobe((prev) => prev.filter((i) => i.id !== id));
    showToast(`Removed "${item?.name || 'Item'}" from wardrobe`);
  };

  const handleUpdateLocation = (id: string, newLocation: string) => {
    setWardrobe((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, storageLocation: newLocation };
        }
        return item;
      })
    );
    if (selectedItem && selectedItem.id === id) {
      setSelectedItem((prev) => (prev ? { ...prev, storageLocation: newLocation } : null));
    }
    showToast('Storage location updated!');
  };

  const handleSaveOutfit = (outfit: SuggestedOutfit) => {
    const alreadySaved = savedOutfits.some((so) => so.id === outfit.id || so.title === outfit.title);
    if (alreadySaved) {
      showToast('Outfit already saved in your collection');
      return;
    }

    const itemIds = outfit.items.map((i) => i.itemId).filter(Boolean) as string[];

    const newSaved: SavedOutfit = {
      id: outfit.id || `so-${Date.now()}`,
      title: outfit.title,
      occasion: 'Casual Day Out',
      styleVibe: outfit.styleVibe,
      itemIds,
      createdAt: new Date().toISOString().split('T')[0],
    };

    setSavedOutfits((prev) => [newSaved, ...prev]);
    showToast(`Saved "${outfit.title}" to your looks collection!`);
  };

  const handleWearToday = (outfit: SuggestedOutfit) => {
    const today = new Date().toISOString().split('T')[0];

    // Increment wear counts for items
    const itemIds = outfit.items.map((i) => i.itemId).filter(Boolean) as string[];

    setWardrobe((prev) =>
      prev.map((item) => {
        if (itemIds.includes(item.id)) {
          return {
            ...item,
            timesWorn: item.timesWorn + 1,
            lastWornDate: today,
          };
        }
        return item;
      })
    );

    // Add Wear Log
    const newLog: WearLog = {
      id: `wl-${Date.now()}`,
      date: today,
      outfitName: outfit.title,
      itemIds,
      occasion: outfit.styleVibe,
      rating: 5,
      notes: `AI Recommended look worn for ${weather.location} weather (${weather.temperatureC}°C, ${weather.condition}).`,
    };

    setWearLogs((prev) => [newLog, ...prev]);
    showToast(`Logged "${outfit.title}" as today's outfit!`);
  };

  const handleLogWear = (log: Omit<WearLog, 'id'>) => {
    const newLog: WearLog = {
      ...log,
      id: `wl-${Date.now()}`,
    };
    setWearLogs((prev) => [newLog, ...prev]);
    showToast(`Logged outfit for ${log.date}!`);
  };

  const handleRemoveSavedOutfit = (id: string) => {
    setSavedOutfits((prev) => prev.filter((o) => o.id !== id));
    showToast('Saved outfit removed');
  };

  const handleDeleteWearLog = (id: string) => {
    setWearLogs((prev) => prev.filter((l) => l.id !== id));
    showToast('Wear log deleted');
  };

  const cleanItemsCount = wardrobe.filter((i) => i.status === 'Clean').length;
  const laundryItems = wardrobe.filter((i) => i.status === 'In Laundry');
  const isWashingActive = Boolean(activeLaundryCycle && activeLaundryCycle.status === 'running');

  return (
    <div className="min-h-screen w-full max-w-full overflow-x-hidden bg-[#F9F9F8] dark:bg-[#121214] text-[#1A1A1A] dark:text-white font-sans antialiased selection:bg-[#1A1A1A]/10 selection:text-[#1A1A1A] transition-colors">
      {/* Top Header Navbar */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        weather={weather}
        onOpenAddItem={() => setIsAddItemOpen(true)}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        cleanItemsCount={cleanItemsCount}
        totalItemsCount={wardrobe.length}
        onRefreshWeather={fetchWeather}
        onDetectLocation={() => handleDetectLocation(true)}
        isWeatherLoading={isWeatherLoading}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode((prev) => !prev)}
        user={user}
        onOpenAuth={() => setIsAuthOpen(true)}
        stylePreferences={stylePreferences}
        onOpenStylePreferences={() => setIsStylePreferencesOpen(true)}
        onOpenLaundryBasket={() => setIsLaundryBasketOpen(true)}
        laundryItemsCount={laundryItems.length}
        isWashingActive={isWashingActive}
      />

      {/* Main Content Area */}
      <main className="w-full max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-5 sm:space-y-6">
        {/* Tab Views */}
        {activeTab === 'wardrobe' && (
          <WardrobeView
            items={wardrobe}
            onOpenAddItem={() => setIsAddItemOpen(true)}
            onSelectItem={(item) => setSelectedItem(item)}
            onToggleCleanStatus={handleToggleCleanStatus}
            onToggleFavorite={handleToggleFavorite}
            user={user}
            onOpenAuth={() => setIsAuthOpen(true)}
            onOpenLaundryBasket={() => setIsLaundryBasketOpen(true)}
          />
        )}

        {activeTab === 'stylist' && (
          <OutfitStylistView
            weather={weather}
            wardrobe={wardrobe}
            onWearToday={handleWearToday}
            onSaveOutfit={handleSaveOutfit}
            savedOutfitIds={savedOutfits.map((s) => s.id)}
            stylePreferences={stylePreferences}
            onOpenStylePreferences={() => setIsStylePreferencesOpen(true)}
            onAddItem={handleAddItem}
          />
        )}

        {activeTab === 'history-analytics' && (
          <HistoryAndAnalyticsView
            savedOutfits={savedOutfits}
            wearLogs={wearLogs}
            wardrobe={wardrobe}
            onRemoveSavedOutfit={handleRemoveSavedOutfit}
            onLogWear={handleLogWear}
            onDeleteWearLog={handleDeleteWearLog}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-[#E5E5E1] dark:border-[#2A2A30] bg-white dark:bg-[#121214] py-8 mt-12 text-center text-xs text-[#7A7A75] dark:text-[#A1A1AA] transition-colors">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© {new Date().getFullYear()} MyRobe • Smart Clothes & Accessory Tracker with AI Stylist</p>
          <div className="flex items-center gap-4 text-[#7A7A75] dark:text-[#A1A1AA] font-medium">
            <span>Powered by Gemini AI</span>
            <span>•</span>
            <span>Clean Minimalist Closet</span>
          </div>
        </div>
      </footer>

      {/* Add Item Modal */}
      <AddItemModal
        isOpen={isAddItemOpen}
        onClose={() => setIsAddItemOpen(false)}
        onAddItem={handleAddItem}
      />

      {/* Item Details Drawer Modal */}
      <ItemDetailModal
        item={selectedItem}
        onClose={() => setSelectedItem(null)}
        onToggleCleanStatus={handleToggleCleanStatus}
        onToggleFavorite={handleToggleFavorite}
        onDeleteItem={handleDeleteItem}
        onUpdateLocation={handleUpdateLocation}
      />

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
      />

      {/* Style & Gender Preferences Modal */}
      <StylePreferencesModal
        isOpen={isStylePreferencesOpen}
        onClose={() => setIsStylePreferencesOpen(false)}
        preferences={stylePreferences}
        onSavePreferences={(updated) => {
          setStylePreferences(updated);
          showToast(`Style preferences updated to ${updated.genderPreference}!`);
        }}
      />

      {/* Laundry Basket Modal */}
      <LaundryBasketModal
        isOpen={isLaundryBasketOpen}
        onClose={() => setIsLaundryBasketOpen(false)}
        laundryItems={laundryItems}
        onRemoveFromLaundry={handleRemoveFromLaundry}
        onStartCycle={handleStartLaundryCycle}
        onCompleteCycle={handleCompleteLaundryCycle}
        onCancelCycle={handleCancelLaundryCycle}
        onInstantCompleteCycle={() => handleCompleteLaundryCycle(laundryItems.map((i) => i.id))}
        activeCycle={activeLaundryCycle}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-4 sm:right-6 z-50 bg-[#1A1A1A] text-white font-medium text-xs px-4 py-3 rounded-xl shadow-2xl flex items-center gap-2 animate-bounce border border-slate-700 max-w-[calc(100vw-2rem)]">
          <div className="w-2 h-2 rounded-full bg-[#38bdf8] shrink-0" />
          <span className="truncate">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
