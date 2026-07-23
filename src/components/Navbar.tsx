import React, { useState } from 'react';
import { Shirt, Sparkles, CalendarDays, BarChart2, Sun, Moon, CloudRain, CloudSun, Wind, Snowflake, MapPin, ChevronDown, User as UserIcon, LogOut, LogIn, RefreshCw, Sliders, WashingMachine } from 'lucide-react';
import { WeatherData, UserStylePreferences } from '../types';
import { User, logoutUser } from '../lib/firebase';

interface NavbarProps {
  activeTab: 'wardrobe' | 'stylist' | 'history-analytics';
  setActiveTab: (tab: 'wardrobe' | 'stylist' | 'history-analytics') => void;
  weather: WeatherData;
  onOpenAddItem: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  cleanItemsCount: number;
  totalItemsCount: number;
  onRefreshWeather?: (city: string) => void;
  isWeatherLoading?: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  user: User | null;
  onOpenAuth: () => void;
  stylePreferences?: UserStylePreferences;
  onOpenStylePreferences?: () => void;
  onOpenLaundryBasket?: () => void;
  laundryItemsCount?: number;
  isWashingActive?: boolean;
}

const CITY_PRESETS = ['Bangalore', 'Hyderabad', 'Madurai'];

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  weather,
  onOpenAddItem,
  searchQuery,
  setSearchQuery,
  cleanItemsCount,
  totalItemsCount,
  onRefreshWeather,
  isWeatherLoading,
  isDarkMode,
  onToggleDarkMode,
  user,
  onOpenAuth,
  stylePreferences,
  onOpenStylePreferences,
  onOpenLaundryBasket,
  laundryItemsCount = 0,
  isWashingActive = false,
}) => {
  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [customCity, setCustomCity] = useState('');

  const getWeatherIcon = (cond: string) => {
    switch (cond) {
      case 'Rainy':
        return <CloudRain className="w-3.5 h-3.5 text-[#004253] dark:text-[#38bdf8]" />;
      case 'Sunny':
        return <Sun className="w-3.5 h-3.5 text-[#E6A100] dark:text-amber-400" />;
      case 'Windy':
        return <Wind className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-slate-300" />;
      case 'Snowy':
      case 'Cold & Crisp':
        return <Snowflake className="w-3.5 h-3.5 text-[#004253] dark:text-[#38bdf8]" />;
      default:
        return <CloudSun className="w-3.5 h-3.5 text-[#1A1A1A] dark:text-amber-300" />;
    }
  };

  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customCity.trim() && onRefreshWeather) {
      onRefreshWeather(customCity.trim());
      setCustomCity('');
      setShowLocationMenu(false);
    }
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 dark:bg-[#121214]/95 backdrop-blur-md border-b border-[#E5E5E1] dark:border-[#2A2A30] text-[#1A1A1A] dark:text-white shadow-xs transition-colors w-full">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20 gap-1.5 sm:gap-4">
          
          {/* Brand Logo, Name & Location/Weather */}
          <div className="flex items-center gap-2 sm:gap-3 min-w-0 shrink">
            <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-[#1A1A1A] dark:bg-[#004253] text-white flex items-center justify-center shadow-xs shrink-0">
              <Shirt className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <h1 className="text-base sm:text-xl font-bold tracking-wider sm:tracking-widest uppercase text-[#1A1A1A] dark:text-white truncate">
                  MyRobe
                </h1>
                <span className="hidden sm:inline-block px-2.5 py-0.5 text-[10px] font-bold tracking-widest uppercase rounded-full bg-[#E6F0F2] dark:bg-[#004253]/30 text-[#004253] dark:text-[#38bdf8] border border-[#004253]/20 shrink-0">
                  Smart Closet
                </span>
              </div>

              {/* Location & Small Weather Icon under MyRobe */}
              <div className="flex items-center gap-1 text-[11px] sm:text-xs text-[#7A7A75] dark:text-[#A1A1AA] font-medium mt-0.5 relative min-w-0">
                <MapPin className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-[#004253] dark:text-[#38bdf8] shrink-0" />
                <button
                  id="btn-location-dropdown-toggle"
                  onClick={() => setShowLocationMenu(!showLocationMenu)}
                  className="flex items-center gap-0.5 sm:gap-1 text-[#1A1A1A] dark:text-white font-semibold hover:text-[#004253] dark:hover:text-[#38bdf8] transition-colors truncate max-w-[90px] sm:max-w-none"
                  title="Click to select location"
                >
                  <span className="truncate">{weather.location}</span>
                  <ChevronDown className="w-3 h-3 text-[#7A7A75] dark:text-[#A1A1AA] shrink-0" />
                </button>

                <span className="text-[#E5E5E1] dark:text-[#2A2A30] shrink-0">•</span>

                {/* Small Weather Icon & Temp */}
                <span className="inline-flex items-center gap-1 shrink-0" title={`${weather.condition}, ${weather.temperatureC}°C (${weather.season})`}>
                  {getWeatherIcon(weather.condition)}
                  <span className="text-[#1A1A1A] dark:text-white font-medium">{weather.temperatureC}°C</span>
                </span>
              </div>

              {/* Dropdown Location Selector Popover */}
              {showLocationMenu && (
                <div className="absolute top-full left-0 mt-2 w-56 bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl shadow-lg p-3 z-50 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider text-[#7A7A75] dark:text-[#A1A1AA]">
                    <span>Select Location</span>
                    {onRefreshWeather && (
                      <button
                        onClick={() => {
                          onRefreshWeather(weather.location);
                          setShowLocationMenu(false);
                        }}
                        className="text-[#004253] dark:text-[#38bdf8] hover:underline flex items-center gap-1"
                      >
                        <RefreshCw className={`w-3 h-3 ${isWeatherLoading ? 'animate-spin' : ''}`} />
                        Refresh
                      </button>
                    )}
                  </div>

                  <div className="space-y-1">
                    {CITY_PRESETS.map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          if (onRefreshWeather) onRefreshWeather(city);
                          setShowLocationMenu(false);
                        }}
                        className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center justify-between ${
                          weather.location === city
                            ? 'bg-[#1A1A1A] text-white dark:bg-[#004253] dark:text-white'
                            : 'hover:bg-[#F5F5F0] dark:hover:bg-[#222226] text-[#1A1A1A] dark:text-white'
                        }`}
                      >
                        <span>{city}</span>
                        {weather.location === city && <span className="text-[10px] text-white dark:text-[#38bdf8] font-bold">Active</span>}
                      </button>
                    ))}
                  </div>

                  <form onSubmit={handleCustomCitySubmit} className="pt-2 border-t border-[#E5E5E1] dark:border-[#2A2A30] flex gap-1">
                    <input
                      type="text"
                      value={customCity}
                      onChange={(e) => setCustomCity(e.target.value)}
                      placeholder="Other city..."
                      className="w-full px-2 py-1 text-xs border border-[#E5E5E1] dark:border-[#2A2A30] bg-white dark:bg-[#222226] text-[#1A1A1A] dark:text-white placeholder:text-[#A1A1AA] rounded-lg focus:outline-none focus:border-[#1A1A1A] dark:focus:border-[#38bdf8]"
                    />
                    <button
                      type="submit"
                      className="px-2.5 py-1 bg-[#1A1A1A] dark:bg-[#004253] hover:bg-[#2A2A2A] dark:hover:bg-[#005B73] text-white text-xs font-medium rounded-lg shrink-0"
                    >
                      Go
                    </button>
                  </form>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Tabs */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-[#7A7A75] dark:text-[#A1A1AA]">
            <button
              id="nav-tab-wardrobe"
              onClick={() => setActiveTab('wardrobe')}
              className={`flex items-center gap-2 py-1 transition-all ${
                activeTab === 'wardrobe'
                  ? 'text-[#1A1A1A] dark:text-white font-semibold border-b-2 border-[#1A1A1A] dark:border-white'
                  : 'text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
              }`}
            >
              <Shirt className="w-4 h-4" />
              <span>Wardrobe Inventory</span>
            </button>

            <button
              id="nav-tab-stylist"
              onClick={() => setActiveTab('stylist')}
              className={`flex items-center gap-2 py-1 transition-all ${
                activeTab === 'stylist'
                  ? 'text-[#1A1A1A] dark:text-white font-semibold border-b-2 border-[#1A1A1A] dark:border-white'
                  : 'text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-4 h-4 text-[#004253] dark:text-[#38bdf8]" />
              <span>Stylist</span>
            </button>

            <button
              id="nav-tab-history-analytics"
              onClick={() => setActiveTab('history-analytics')}
              className={`flex items-center gap-2 py-1 transition-all ${
                activeTab === 'history-analytics'
                  ? 'text-[#1A1A1A] dark:text-white font-semibold border-b-2 border-[#1A1A1A] dark:border-white'
                  : 'text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
              }`}
            >
              <BarChart2 className="w-4 h-4 text-[#004253] dark:text-[#38bdf8]" />
              <span>History & Analytics</span>
            </button>
          </nav>

          {/* Quick Actions */}
          <div className="flex items-center gap-3">
            {/* Style & Gender Preferences Button */}
            {onOpenStylePreferences && (
              <button
                id="btn-style-preferences-toggle"
                onClick={onOpenStylePreferences}
                className="hidden sm:flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#E6F0F2] text-[#004253] border border-[#004253]/20 hover:bg-[#D8E8EC] transition-all text-xs font-bold shadow-xs shrink-0"
                title="Customize Style & Gender Focus"
              >
                <Sliders className="w-3.5 h-3.5 text-[#004253]" />
                <span>{stylePreferences?.genderPreference || 'Style Focus'}</span>
              </button>
            )}

            {/* Laundry Basket Button */}
            {onOpenLaundryBasket && (
              <button
                id="btn-navbar-laundry-basket"
                onClick={onOpenLaundryBasket}
                className={`relative p-2.5 rounded-2xl border transition-all flex items-center justify-center shrink-0 shadow-xs ${
                  isWashingActive
                    ? 'bg-[#004253] text-white border-[#004253] animate-pulse'
                    : 'bg-[#F9F9F8] dark:bg-[#222226] border-[#E5E5E1] dark:border-[#2A2A30] text-[#1A1A1A] dark:text-white hover:bg-[#E6F0F2] dark:hover:bg-[#004253]/30'
                }`}
                title="Open Laundry Basket"
                aria-label="Open Laundry Basket"
              >
                <WashingMachine className={`w-4 h-4 ${isWashingActive ? 'animate-spin' : ''}`} style={isWashingActive ? { animationDuration: '3s' } : undefined} />
                {laundryItemsCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 min-w-[20px] h-[20px] px-1 rounded-full bg-[#004253] dark:bg-[#38bdf8] text-white dark:text-[#121214] font-bold text-[10px] flex items-center justify-center border-2 border-white dark:border-[#121214]">
                    {laundryItemsCount}
                  </span>
                )}
              </button>
            )}

            {/* Dark Mode Switch Button */}
            <button
              id="btn-dark-mode-toggle"
              onClick={onToggleDarkMode}
              className="p-2.5 rounded-2xl bg-[#F9F9F8] border border-[#E5E5E1] text-[#1A1A1A] hover:bg-[#F5F5F0] transition-all flex items-center justify-center shrink-0 shadow-xs"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
              aria-label="Toggle dark mode"
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-[#E6A100]" />
              ) : (
                <Moon className="w-4 h-4 text-[#1A1A1A]" />
              )}
            </button>

            {/* Auth / Profile Button */}
            <div className="relative">
              {user ? (
                <div>
                  <button
                    id="btn-user-profile-menu"
                    onClick={() => setShowUserMenu(!showUserMenu)}
                    className="flex items-center gap-2 px-3 py-1.5 rounded-2xl bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] text-[#1A1A1A] dark:text-white hover:bg-[#F5F5F0] dark:hover:bg-[#2C2C32] transition-all shadow-xs"
                  >
                    <div className="w-7 h-7 rounded-full bg-[#004253] text-white flex items-center justify-center text-xs font-bold uppercase shadow-xs shrink-0">
                      {(user.displayName || user.email || 'U').charAt(0).toUpperCase()}
                    </div>
                    <span className="hidden sm:inline text-xs font-semibold max-w-[100px] truncate">
                      {(user.displayName || user.email?.split('@')[0] || 'Account').trim().split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-[#7A7A75]" />
                  </button>

                  {/* Dropdown Menu */}
                  {showUserMenu && (
                    <div className="absolute right-0 mt-2 w-56 p-2 rounded-2xl bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] shadow-xl z-50 animate-in fade-in duration-150">
                      <div className="px-3 py-2 border-b border-[#E5E5E1] dark:border-[#2A2A30] mb-1">
                        <p className="text-xs font-bold text-[#1A1A1A] dark:text-white truncate">
                          {user.displayName || 'Wardrobe Member'}
                        </p>
                        <p className="text-[10px] text-[#7A7A75] dark:text-[#A1A1AA] truncate">
                          {user.email}
                        </p>
                      </div>
                      {onOpenStylePreferences && (
                        <button
                          onClick={() => {
                            setShowUserMenu(false);
                            onOpenStylePreferences();
                          }}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-[#1A1A1A] dark:text-white hover:bg-[#F9F9F8] dark:hover:bg-[#2A2A30] font-medium transition-colors mb-1"
                        >
                          <Sliders className="w-4 h-4 text-[#004253]" />
                          <span>Style Preferences</span>
                        </button>
                      )}
                      <button
                        onClick={async () => {
                          setShowUserMenu(false);
                          await logoutUser();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 font-medium transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Sign Out</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <button
                  id="btn-login-open"
                  onClick={onOpenAuth}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#1A1A1A] hover:bg-[#333330] dark:bg-[#004253] dark:hover:bg-[#002D3A] text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.98]"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Log In</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Navigation Bar */}
        <div className="flex md:hidden items-center justify-around py-2.5 border-t border-[#E5E5E1] dark:border-[#2A2A30] text-xs font-medium">
          <button
            id="mobile-nav-wardrobe"
            onClick={() => setActiveTab('wardrobe')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
              activeTab === 'wardrobe' ? 'text-[#1A1A1A] dark:text-white font-bold' : 'text-[#7A7A75] dark:text-[#A1A1AA]'
            }`}
          >
            <Shirt className="w-4 h-4" />
            <span>Inventory</span>
          </button>
          <button
            id="mobile-nav-stylist"
            onClick={() => setActiveTab('stylist')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
              activeTab === 'stylist' ? 'text-[#004253] dark:text-[#38bdf8] font-bold' : 'text-[#7A7A75] dark:text-[#A1A1AA]'
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#004253] dark:text-[#38bdf8]" />
            <span>Stylist</span>
          </button>
          <button
            id="mobile-nav-history-analytics"
            onClick={() => setActiveTab('history-analytics')}
            className={`flex flex-col items-center gap-1 py-1 px-2 rounded-lg ${
              activeTab === 'history-analytics' ? 'text-[#1A1A1A] dark:text-white font-bold' : 'text-[#7A7A75] dark:text-[#A1A1AA]'
            }`}
          >
            <BarChart2 className="w-4 h-4 text-[#004253] dark:text-[#38bdf8]" />
            <span>History & Stats</span>
          </button>
        </div>
      </div>
    </header>
  );
};
