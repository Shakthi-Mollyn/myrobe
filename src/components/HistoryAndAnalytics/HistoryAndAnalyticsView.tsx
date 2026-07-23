import React, { useState, useMemo } from 'react';
import {
  CalendarDays,
  Bookmark,
  Clock,
  Plus,
  BarChart2,
  PieChart,
  Shirt,
  WashingMachine,
  Trophy,
  Palette,
  CheckCircle,
  Star,
  Trash2,
  Calendar as CalendarIcon,
  AlertTriangle,
  X,
  Tag,
  Check
} from 'lucide-react';
import { SavedOutfit, WearLog, WardrobeItem } from '../../types';

interface HistoryAndAnalyticsViewProps {
  savedOutfits: SavedOutfit[];
  wearLogs: WearLog[];
  wardrobe: WardrobeItem[];
  onRemoveSavedOutfit: (id: string) => void;
  onLogWear: (log: Omit<WearLog, 'id'>) => void;
  onDeleteWearLog: (id: string) => void;
}

export const HistoryAndAnalyticsView: React.FC<HistoryAndAnalyticsViewProps> = ({
  savedOutfits,
  wearLogs,
  wardrobe,
  onRemoveSavedOutfit,
  onLogWear,
  onDeleteWearLog,
}) => {
  // Sub tab: 'analytics' | 'history' | 'saved'
  const [activeSubTab, setActiveSubTab] = useState<'analytics' | 'history' | 'saved'>('analytics');
  const [showLogModal, setShowLogModal] = useState(false);

  // New Log Form State
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logOutfitName, setLogOutfitName] = useState('');
  const [logOccasion, setLogOccasion] = useState('Casual Day Out');
  const [logRating, setLogRating] = useState(5);
  const [logNotes, setLogNotes] = useState('');

  // Analytics Computations
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    wardrobe.forEach((item) => {
      map[item.category] = (map[item.category] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [wardrobe]);

  const cleanCount = wardrobe.filter((i) => i.status === 'Clean').length;
  const laundryCount = wardrobe.filter((i) => i.status === 'In Laundry').length;

  const mostWornItems = useMemo(() => {
    return [...wardrobe].sort((a, b) => b.timesWorn - a.timesWorn).slice(0, 5);
  }, [wardrobe]);

  const underutilizedItems = useMemo(() => {
    return wardrobe.filter((i) => i.timesWorn <= 2);
  }, [wardrobe]);

  const colorBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    wardrobe.forEach((item) => {
      const c = item.color || 'Other';
      map[c] = (map[c] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [wardrobe]);

  const handleCreateLog = (e: React.FormEvent) => {
    e.preventDefault();
    if (!logOutfitName.trim()) return;

    onLogWear({
      date: logDate,
      outfitName: logOutfitName.trim(),
      itemIds: [],
      occasion: logOccasion,
      rating: logRating,
      notes: logNotes.trim(),
    });

    setShowLogModal(false);
    setLogOutfitName('');
    setLogNotes('');
  };

  return (
    <div className="space-y-6">
      {/* Top Combined Banner */}
      <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[#1A1A1A] dark:text-white">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#E6F0F2] dark:bg-[#004253]/40 text-[#004253] dark:text-[#38bdf8] border border-[#004253]/20">
              History & Closet Analytics
            </span>
            <span className="text-xs text-[#7A7A75] dark:text-[#A1A1AA] font-semibold">
              {wardrobe.length} Pieces • {wearLogs.length} Logs • {savedOutfits.length} Saved Looks
            </span>
          </div>
          <h2 className="text-2xl md:text-3xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">
            Wear History & Closet Analytics
          </h2>
          <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA] mt-1 max-w-xl">
            Track daily outfit logs, analyze wardrobe usage frequency, review color distribution, and manage saved looks.
          </p>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            id="btn-log-outfit-today"
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-xl bg-[#1A1A1A] dark:bg-[#004253] hover:bg-[#333330] dark:hover:bg-[#002D3A] text-white font-semibold text-xs shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            <span>Log What You Wore</span>
          </button>
        </div>
      </div>

      {/* Metric Quick Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-4 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#F9F9F8] dark:bg-[#222226] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2A2A30]">
            <Shirt className="w-5 h-5 text-[#004253] dark:text-[#38bdf8]" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7A75] dark:text-[#A1A1AA] block">Total Closet</span>
            <span className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">{wardrobe.length}</span>
            <span className="text-[11px] text-[#7A7A75] dark:text-[#A1A1AA] block">Clothing & Accessories</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-4 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#F9F9F8] dark:bg-[#222226] text-[#004253] dark:text-[#38bdf8] border border-[#E5E5E1] dark:border-[#2A2A30]">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7A75] dark:text-[#A1A1AA] block">Ready to Wear</span>
            <span className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">{cleanCount}</span>
            <span className="text-[11px] text-[#7A7A75] dark:text-[#A1A1AA] block">{Math.round((cleanCount / (wardrobe.length || 1)) * 100)}% Clean Ratio</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-4 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#F9F9F8] dark:bg-[#222226] text-rose-600 dark:text-rose-400 border border-[#E5E5E1] dark:border-[#2A2A30]">
            <WashingMachine className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7A75] dark:text-[#A1A1AA] block">In Laundry</span>
            <span className="text-2xl font-bold tracking-tight text-[#1A1A1A] dark:text-white">{laundryCount}</span>
            <span className="text-[11px] text-[#7A7A75] dark:text-[#A1A1AA] block">Awaiting Wash</span>
          </div>
        </div>

        <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-4 shadow-xs flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#F9F9F8] dark:bg-[#222226] text-[#1A1A1A] dark:text-white border border-[#E5E5E1] dark:border-[#2A2A30]">
            <Trophy className="w-5 h-5 text-amber-500" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7A75] dark:text-[#A1A1AA] block">Top Worn Piece</span>
            <span className="text-sm font-semibold text-[#1A1A1A] dark:text-white truncate max-w-[130px] block">
              {mostWornItems[0]?.name || 'N/A'}
            </span>
            <span className="text-[11px] text-[#004253] dark:text-[#38bdf8] font-medium">{mostWornItems[0]?.timesWorn || 0} times worn</span>
          </div>
        </div>
      </div>

      {/* Unified Navigation Sub-Tabs */}
      <div className="flex border-b border-[#E5E5E1] dark:border-[#2A2A30] gap-6 text-xs font-semibold overflow-x-auto no-scrollbar">
        <button
          id="tab-sub-analytics"
          onClick={() => setActiveSubTab('analytics')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'analytics'
              ? 'border-[#004253] dark:border-[#38bdf8] text-[#004253] dark:text-[#38bdf8] font-bold'
              : 'border-transparent text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
          }`}
        >
          <BarChart2 className="w-4 h-4" />
          <span>Closet Analytics & Usage Stats</span>
        </button>

        <button
          id="tab-sub-history"
          onClick={() => setActiveSubTab('history')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'history'
              ? 'border-[#004253] dark:border-[#38bdf8] text-[#004253] dark:text-[#38bdf8] font-bold'
              : 'border-transparent text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Wear History Journal ({wearLogs.length})</span>
        </button>

        <button
          id="tab-sub-saved"
          onClick={() => setActiveSubTab('saved')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeSubTab === 'saved'
              ? 'border-[#004253] dark:border-[#38bdf8] text-[#004253] dark:text-[#38bdf8] font-bold'
              : 'border-transparent text-[#7A7A75] dark:text-[#A1A1AA] hover:text-[#1A1A1A] dark:hover:text-white'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Looks Collection ({savedOutfits.length})</span>
        </button>
      </div>

      {/* SUB TAB 1: ANALYTICS & STATS */}
      {activeSubTab === 'analytics' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Category Breakdown */}
            <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-6 shadow-xs space-y-4 text-[#1A1A1A] dark:text-white">
              <div className="flex items-center gap-2">
                <BarChart2 className="w-5 h-5 text-[#004253] dark:text-[#38bdf8]" />
                <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">Category Distribution</h3>
              </div>

              <div className="space-y-3">
                {categoryCounts.map(([cat, count]) => {
                  const percentage = Math.round((count / (wardrobe.length || 1)) * 100);
                  return (
                    <div key={cat} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-[#1A1A1A] dark:text-white">{cat}</span>
                        <span className="text-[#7A7A75] dark:text-[#A1A1AA]">
                          {count} pcs ({percentage}%)
                        </span>
                      </div>
                      <div className="w-full bg-[#F5F5F0] dark:bg-[#222226] h-2.5 rounded-full overflow-hidden border border-[#E5E5E1] dark:border-[#2A2A30]">
                        <div
                          className="bg-[#004253] dark:bg-[#38bdf8] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Color Spectrum Breakdown */}
            <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-6 shadow-xs space-y-4 text-[#1A1A1A] dark:text-white">
              <div className="flex items-center gap-2">
                <Palette className="w-5 h-5 text-[#004253] dark:text-[#38bdf8]" />
                <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">Wardrobe Color Spectrum</h3>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {colorBreakdown.map(([colorName, count]) => (
                  <div
                    key={colorName}
                    className="p-3.5 rounded-xl bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] flex flex-col justify-between"
                  >
                    <span className="text-xs font-bold text-[#1A1A1A] dark:text-white">{colorName}</span>
                    <span className="text-xs text-[#004253] dark:text-[#38bdf8] font-semibold mt-1">
                      {count} {count === 1 ? 'item' : 'items'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Leaderboard Grid: Most Worn vs Underutilized */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Top Most Worn Leaderboard */}
            <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Trophy className="w-5 h-5 text-amber-500" />
                  <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">Top 5 Most Worn Pieces</h3>
                </div>
              </div>

              <div className="space-y-3">
                {mostWornItems.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center gap-3 p-3 rounded-xl bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30]"
                  >
                    <span className="w-6 h-6 rounded-full bg-[#E6F0F2] dark:bg-[#004253]/40 text-[#004253] dark:text-[#38bdf8] text-xs font-bold flex items-center justify-center shrink-0">
                      #{index + 1}
                    </span>
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="w-10 h-10 object-cover rounded-lg shrink-0 border border-[#E5E5E1] dark:border-[#2A2A30]"
                    />
                    <div className="min-w-0 flex-1">
                      <h4 className="text-xs font-bold text-[#1A1A1A] dark:text-white truncate">{item.name}</h4>
                      <p className="text-[11px] text-[#7A7A75] dark:text-[#A1A1AA]">{item.category} • {item.color}</p>
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-[#E6F0F2] dark:bg-[#004253]/30 text-[#004253] dark:text-[#38bdf8] shrink-0">
                      {item.timesWorn} Wears
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Underutilized Wardrobe Items */}
            <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-6 shadow-xs space-y-4">
              <div className="flex items-center gap-2">
                <AlertTriangle className="w-5 h-5 text-amber-500" />
                <div>
                  <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">Underutilized Items</h3>
                  <p className="text-[11px] text-[#7A7A75] dark:text-[#A1A1AA]">Pieces worn 2 times or fewer</p>
                </div>
              </div>

              {underutilizedItems.length === 0 ? (
                <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA] py-4 text-center">
                  Great job! All items in your closet are actively being worn.
                </p>
              ) : (
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                  {underutilizedItems.slice(0, 6).map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-xl bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30]"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-10 h-10 object-cover rounded-lg shrink-0 border border-[#E5E5E1] dark:border-[#2A2A30]"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-[#1A1A1A] dark:text-white truncate">{item.name}</h4>
                          <p className="text-[11px] text-[#7A7A75] dark:text-[#A1A1AA]">{item.category} • {item.storageLocation}</p>
                        </div>
                      </div>
                      <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 shrink-0">
                        {item.timesWorn === 0 ? 'Never Worn' : `${item.timesWorn} Wears`}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* SUB TAB 2: WEAR HISTORY JOURNAL */}
      {activeSubTab === 'history' && (
        <div className="space-y-4">
          {wearLogs.length === 0 ? (
            <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-16 text-center text-[#7A7A75] dark:text-[#A1A1AA] space-y-3">
              <Clock className="w-10 h-10 text-[#004253] dark:text-[#38bdf8] mx-auto" />
              <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">No Wear History Yet</h3>
              <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA] max-w-sm mx-auto">
                Log the outfits you wear every day to build an insightful style timeline and track piece longevity.
              </p>
              <button
                onClick={() => setShowLogModal(true)}
                className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] dark:bg-[#004253] text-white font-semibold text-xs inline-flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                <span>Log Today's Outfit</span>
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {wearLogs.map((log) => (
                <div
                  key={log.id}
                  className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-5 shadow-xs space-y-3 text-[#1A1A1A] dark:text-white hover:border-[#004253] dark:hover:border-[#38bdf8] transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#E6F0F2] dark:bg-[#004253]/30 text-[#004253] dark:text-[#38bdf8] border border-[#004253]/20">
                          {log.date}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[#F9F9F8] dark:bg-[#222226] text-[#7A7A75] dark:text-[#A1A1AA] border border-[#E5E5E1] dark:border-[#2A2A30]">
                          {log.occasion}
                        </span>
                      </div>
                      <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">{log.outfitName}</h3>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center gap-0.5 text-amber-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`w-3.5 h-3.5 ${
                              i < (log.rating || 5) ? 'fill-amber-500' : 'text-[#E5E5E1] dark:text-[#2A2A30]'
                            }`}
                          />
                        ))}
                      </div>

                      <button
                        onClick={() => onDeleteWearLog(log.id)}
                        className="p-1.5 rounded-lg text-[#7A7A75] hover:text-rose-600 hover:bg-[#F5F5F0] dark:hover:bg-[#222226] transition-colors"
                        title="Delete log entry"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {log.notes && (
                    <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA] leading-relaxed pl-2 border-l-2 border-[#004253] dark:border-[#38bdf8]">
                      {log.notes}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* SUB TAB 3: SAVED LOOKS COLLECTION */}
      {activeSubTab === 'saved' && (
        <div className="space-y-4">
          {savedOutfits.length === 0 ? (
            <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-16 text-center text-[#7A7A75] dark:text-[#A1A1AA] space-y-3">
              <Bookmark className="w-10 h-10 text-[#004253] dark:text-[#38bdf8] mx-auto" />
              <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">No Saved Outfits Yet</h3>
              <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA] max-w-sm mx-auto">
                Use the AI Suggestion tab to generate and bookmark your favorite outfit combinations.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {savedOutfits.map((outfit) => (
                <div
                  key={outfit.id}
                  className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl p-5 shadow-xs space-y-4 text-[#1A1A1A] dark:text-white relative group hover:border-[#004253] dark:hover:border-[#38bdf8] transition-all"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#F9F9F8] dark:bg-[#222226] text-[#004253] dark:text-[#38bdf8] border border-[#E5E5E1] dark:border-[#2A2A30]">
                        {outfit.styleVibe}
                      </span>
                      <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white mt-1.5">{outfit.title}</h3>
                      <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA]">{outfit.occasion}</p>
                    </div>

                    <button
                      onClick={() => onRemoveSavedOutfit(outfit.id)}
                      className="p-1.5 rounded-lg text-[#7A7A75] hover:text-rose-600 hover:bg-[#F9F9F8] dark:hover:bg-[#222226] transition-colors"
                      title="Remove saved outfit"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="pt-3 border-t border-[#E5E5E1] dark:border-[#2A2A30] flex items-center justify-between text-xs text-[#7A7A75] dark:text-[#A1A1AA]">
                    <span>Saved on {outfit.createdAt}</span>
                    <button
                      onClick={() => {
                        onLogWear({
                          date: new Date().toISOString().split('T')[0],
                          outfitId: outfit.id,
                          outfitName: outfit.title,
                          itemIds: outfit.itemIds,
                          occasion: outfit.occasion,
                          rating: 5,
                          notes: `Wore saved outfit "${outfit.title}"`,
                        });
                        setActiveSubTab('history');
                      }}
                      className="px-3 py-1.5 rounded-xl bg-[#004253] dark:bg-[#005B73] hover:bg-[#002D3A] text-white font-semibold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Wear Today</span>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* LOG OUTFIT MODAL */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-3xl w-full max-w-md shadow-2xl p-6 text-[#1A1A1A] dark:text-white space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-[#E5E5E1] dark:border-[#2A2A30]">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#E6F0F2] dark:bg-[#004253]/30 text-[#004253] dark:text-[#38bdf8]">
                  <CalendarDays className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-[#1A1A1A] dark:text-white">Log What You Wore</h3>
                  <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA]">Record your outfit details for today</p>
                </div>
              </div>
              <button
                onClick={() => setShowLogModal(false)}
                className="p-1.5 rounded-full text-[#7A7A75] hover:bg-[#F9F9F8] dark:hover:bg-[#222226] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateLog} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A7A75] dark:text-[#A1A1AA] mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A7A75] dark:text-[#A1A1AA] mb-1">
                  Outfit Title / Summary
                </label>
                <input
                  type="text"
                  placeholder="e.g. Linen Shirt & Navy Chinos"
                  value={logOutfitName}
                  onChange={(e) => setLogOutfitName(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253]"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A7A75] dark:text-[#A1A1AA] mb-1">
                  Occasion
                </label>
                <select
                  value={logOccasion}
                  onChange={(e) => setLogOccasion(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253]"
                >
                  <option value="Casual Work / Office">Casual Work / Office</option>
                  <option value="Casual Day Out">Casual Day Out</option>
                  <option value="Formal Business">Formal Business</option>
                  <option value="Date Night">Date Night</option>
                  <option value="Party & Evening Event">Party & Evening Event</option>
                  <option value="Gym / Workout">Gym / Workout</option>
                  <option value="Travel & Flight">Travel & Flight</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A7A75] dark:text-[#A1A1AA] mb-1">
                  Comfort & Fit Rating (1 - 5 Stars)
                </label>
                <div className="flex items-center gap-1.5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setLogRating(star)}
                      className="p-1 text-amber-500 focus:outline-none"
                    >
                      <Star
                        className={`w-6 h-6 ${
                          star <= logRating ? 'fill-amber-500' : 'text-[#E5E5E1] dark:text-[#2A2A30]'
                        }`}
                      />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#7A7A75] dark:text-[#A1A1AA] mb-1">
                  Notes / Styling Thoughts (Optional)
                </label>
                <textarea
                  rows={2}
                  placeholder="Felt very comfortable in the AC..."
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253]"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-[#E5E5E1] dark:border-[#2A2A30]">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-[#7A7A75] hover:bg-[#F9F9F8] dark:hover:bg-[#222226]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-[#004253] dark:bg-[#005B73] text-white font-semibold text-xs shadow-xs"
                >
                  Save Log Entry
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
