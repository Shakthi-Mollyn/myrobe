import React, { useState } from 'react';
import { Sun, CloudRain, CloudSun, Wind, Snowflake, MapPin, RefreshCw } from 'lucide-react';
import { WeatherData } from '../types';

interface WeatherWidgetProps {
  weather: WeatherData;
  setWeather: React.Dispatch<React.SetStateAction<WeatherData>>;
  onRefreshWeather: (city: string) => void;
  isLoading: boolean;
}

const CITY_PRESETS = [
  'Bangalore',
  'Hyderabad',
  'Madurai',
];

export const WeatherWidget: React.FC<WeatherWidgetProps> = ({
  weather,
  setWeather,
  onRefreshWeather,
  isLoading,
}) => {
  const [customLocationInput, setCustomLocationInput] = useState('');
  const [showCustomInput, setShowCustomInput] = useState(false);

  const getWeatherIcon = (cond: string) => {
    switch (cond) {
      case 'Rainy':
        return <CloudRain className="w-4 h-4 text-[#004253] dark:text-[#38bdf8]" />;
      case 'Sunny':
        return <Sun className="w-4 h-4 text-[#E6A100] dark:text-amber-400" />;
      case 'Windy':
        return <Wind className="w-4 h-4 text-[#1A1A1A] dark:text-slate-300" />;
      case 'Snowy':
      case 'Cold & Crisp':
        return <Snowflake className="w-4 h-4 text-[#004253] dark:text-[#38bdf8]" />;
      default:
        return <CloudSun className="w-4 h-4 text-[#1A1A1A] dark:text-amber-300" />;
    }
  };

  const handleCustomCitySubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocationInput.trim()) {
      onRefreshWeather(customLocationInput.trim());
      setCustomLocationInput('');
      setShowCustomInput(false);
    }
  };

  return (
    <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-3 sm:p-3.5 shadow-xs text-[#1A1A1A] dark:text-white w-full max-w-sm space-y-2">
      {/* Top Row: Location, Temp, Icon, Refresh */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="p-2 bg-[#F9F9F8] dark:bg-[#222226] rounded-xl border border-[#E5E5E1] dark:border-[#2A2A30] shrink-0">
            {getWeatherIcon(weather.condition)}
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-[#7A7A75] dark:text-[#A1A1AA] shrink-0" />
              <h3 className="text-sm font-semibold text-[#1A1A1A] dark:text-white truncate tracking-tight">
                {weather.location}
              </h3>
              <span className="text-[9px] uppercase font-bold tracking-widest px-2 py-0.5 rounded-full bg-[#F5F5F0] dark:bg-[#222226] text-[#7A7A75] dark:text-[#A1A1AA] shrink-0">
                {weather.season}
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-xs text-[#7A7A75] dark:text-[#A1A1AA] mt-0.5">
              <span className="font-semibold text-[#1A1A1A] dark:text-white">{weather.temperatureC}°C</span>
              <span>/ {weather.temperatureF}°F</span>
              <span className="text-[9px] font-bold uppercase tracking-wider text-[#004253] dark:text-[#38bdf8]">
                • {weather.condition}
              </span>
            </div>
          </div>
        </div>

        <button
          id="btn-weather-refresh"
          onClick={() => onRefreshWeather(weather.location)}
          disabled={isLoading}
          className="p-1.5 rounded-lg bg-[#F9F9F8] dark:bg-[#222226] hover:bg-[#F5F5F0] dark:hover:bg-[#2A2A30] border border-[#E5E5E1] dark:border-[#2A2A30] text-[#7A7A75] dark:text-[#A1A1AA] transition-colors shrink-0"
          title="Refresh current weather"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin text-[#004253] dark:text-[#38bdf8]' : ''}`} />
        </button>
      </div>

      {/* City Presets Bar */}
      <div className="flex items-center justify-between gap-1 pt-1.5 border-t border-[#E5E5E1]/60 dark:border-[#2A2A30] text-[11px]">
        <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7A75] dark:text-[#A1A1AA]">Location:</span>
        <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
          {CITY_PRESETS.map((city) => (
            <button
              key={city}
              id={`btn-weather-city-${city.toLowerCase().replace(/\s+/g, '-')}`}
              onClick={() => onRefreshWeather(city)}
              disabled={isLoading}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all text-[11px] whitespace-nowrap ${
                weather.location === city
                  ? 'bg-[#004253] dark:bg-[#005B73] text-white'
                  : 'bg-[#F9F9F8] dark:bg-[#222226] hover:bg-[#F5F5F0] dark:hover:bg-[#2A2A30] text-[#7A7A75] dark:text-[#A1A1AA] border border-[#E5E5E1] dark:border-[#2A2A30]'
              }`}
            >
              {city}
            </button>
          ))}

          {!showCustomInput ? (
            <button
              id="btn-weather-custom-city"
              onClick={() => setShowCustomInput(true)}
              className="px-2 py-0.5 rounded-lg bg-[#F9F9F8] dark:bg-[#222226] text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white border border-[#E5E5E1] dark:border-[#2A2A30] text-[11px] whitespace-nowrap"
            >
              + Other
            </button>
          ) : (
            <form onSubmit={handleCustomCitySubmit} className="flex items-center gap-1">
              <input
                type="text"
                value={customLocationInput}
                onChange={(e) => setCustomLocationInput(e.target.value)}
                placeholder="City..."
                className="px-2 py-0.5 text-[11px] rounded-lg bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] text-[#1A1A1A] dark:text-white focus:outline-none w-20"
              />
              <button
                type="submit"
                className="px-2 py-0.5 text-[11px] rounded-lg bg-[#004253] dark:bg-[#005B73] text-white font-medium"
              >
                Go
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
