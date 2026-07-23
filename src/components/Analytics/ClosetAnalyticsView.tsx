import React, { useMemo } from 'react';
import { BarChart2, PieChart, Shirt, WashingMachine, AlertTriangle, Sparkles, Trophy, Palette, CheckCircle } from 'lucide-react';
import { WardrobeItem, ItemCategory } from '../../types';

interface ClosetAnalyticsViewProps {
  items: WardrobeItem[];
}

export const ClosetAnalyticsView: React.FC<ClosetAnalyticsViewProps> = ({ items }) => {
  // Category Breakdown
  const categoryCounts = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((item) => {
      map[item.category] = (map[item.category] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [items]);

  // Clean vs Laundry Ratio
  const cleanCount = items.filter((i) => i.status === 'Clean').length;
  const laundryCount = items.filter((i) => i.status === 'In Laundry').length;

  // Top Most Worn Items
  const mostWornItems = useMemo(() => {
    return [...items].sort((a, b) => b.timesWorn - a.timesWorn).slice(0, 5);
  }, [items]);

  // Underutilized Items (worn <= 2 times)
  const underutilizedItems = useMemo(() => {
    return items.filter((i) => i.timesWorn <= 2);
  }, [items]);

  // Color Palette Breakdown
  const colorBreakdown = useMemo(() => {
    const map: Record<string, number> = {};
    items.forEach((item) => {
      const c = item.color || 'Other';
      map[c] = (map[c] || 0) + 1;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 6);
  }, [items]);

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-white border border-[#E5E5E1] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[#1A1A1A]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#E6F0F2] text-[#004253] border border-[#004253]/20">
              Wardrobe Intelligence
            </span>
            <span className="text-xs text-[#7A7A75] font-semibold">{items.length} Tracked Items</span>
          </div>
          <h2 className="text-3xl font-light tracking-tight text-[#1A1A1A]">
            Closet Usage & Color Analytics
          </h2>
          <p className="text-xs text-[#7A7A75] mt-1 max-w-xl">
            Analyze piece usage frequency, review category breakdown, track laundry ratios, and discover underutilized wardrobe items.
          </p>
        </div>
      </div>

      {/* Top Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-[#E5E5E1] rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#F9F9F8] text-[#1A1A1A] border border-[#E5E5E1]">
            <Shirt className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7A75] block">Total Pieces</span>
            <span className="text-2xl font-light tracking-tight text-[#1A1A1A]">{items.length}</span>
            <span className="text-[11px] text-[#7A7A75] block">Clothes & Accessories</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E1] rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#F9F9F8] text-[#004253] border border-[#E5E5E1]">
            <CheckCircle className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7A75] block">Ready to Wear</span>
            <span className="text-2xl font-light tracking-tight text-[#1A1A1A]">{cleanCount}</span>
            <span className="text-[11px] text-[#7A7A75] block">{Math.round((cleanCount / (items.length || 1)) * 100)}% of Wardrobe</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E1] rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#F9F9F8] text-rose-600 border border-[#E5E5E1]">
            <WashingMachine className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7A75] block">In Laundry</span>
            <span className="text-2xl font-light tracking-tight text-[#1A1A1A]">{laundryCount}</span>
            <span className="text-[11px] text-[#7A7A75] block">Awaiting washing</span>
          </div>
        </div>

        <div className="bg-white border border-[#E5E5E1] rounded-2xl p-4 shadow-sm flex items-center gap-4">
          <div className="p-3 rounded-xl bg-[#F9F9F8] text-[#1A1A1A] border border-[#E5E5E1]">
            <Trophy className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-[#7A7A75] block">Top Favorite</span>
            <span className="text-sm font-semibold text-[#1A1A1A] truncate max-w-[130px] block">
              {mostWornItems[0]?.name || 'N/A'}
            </span>
            <span className="text-[11px] text-[#004253] font-medium">{mostWornItems[0]?.timesWorn || 0} times worn</span>
          </div>
        </div>
      </div>

      {/* Analytics Main Panels */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Breakdown */}
        <div className="bg-white border border-[#E5E5E1] rounded-2xl p-6 shadow-sm space-y-4 text-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <BarChart2 className="w-5 h-5 text-[#1A1A1A]" />
            <h3 className="text-base font-semibold text-[#1A1A1A]">Category Distribution</h3>
          </div>

          <div className="space-y-3">
            {categoryCounts.map(([cat, count]) => {
              const percentage = Math.round((count / items.length) * 100);
              return (
                <div key={cat} className="space-y-1">
                  <div className="flex justify-between text-xs font-medium">
                    <span className="text-[#1A1A1A]">{cat}</span>
                    <span className="text-[#7A7A75]">
                      {count} ({percentage}%)
                    </span>
                  </div>
                  <div className="w-full bg-[#F5F5F0] h-2 rounded-full overflow-hidden border border-[#E5E5E1]">
                    <div
                      className="bg-[#1A1A1A] h-full rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Color Spectrum Breakdown */}
        <div className="bg-white border border-[#E5E5E1] rounded-2xl p-6 shadow-sm space-y-4 text-[#1A1A1A]">
          <div className="flex items-center gap-2">
            <Palette className="w-5 h-5 text-[#1A1A1A]" />
            <h3 className="text-base font-semibold text-[#1A1A1A]">Wardrobe Color Spectrum</h3>
          </div>

          <div className="grid grid-cols-2 gap-3">
            {colorBreakdown.map(([colorName, count]) => (
              <div
                key={colorName}
                className="bg-[#F9F9F8] p-3 rounded-xl border border-[#E5E5E1] flex items-center justify-between"
              >
                <div className="flex items-center gap-2">
                  <div className="w-3.5 h-3.5 rounded-full border border-[#E5E5E1] bg-[#1A1A1A]" />
                  <span className="text-xs font-semibold text-[#1A1A1A]">{colorName}</span>
                </div>
                <span className="text-xs font-medium text-[#7A7A75]">{count} pieces</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Worn vs Underutilized */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Most Worn */}
        <div className="bg-white border border-[#E5E5E1] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-[#1A1A1A]" />
            <h3 className="text-base font-semibold text-[#1A1A1A]">Most Worn MVP Pieces</h3>
          </div>

          <div className="space-y-3">
            {mostWornItems.map((item, index) => (
              <div
                key={item.id}
                className="bg-[#F9F9F8] p-3 rounded-xl border border-[#E5E5E1] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <span className="w-6 h-6 rounded-full bg-white text-[#1A1A1A] border border-[#E5E5E1] font-bold text-xs flex items-center justify-center shrink-0">
                    #{index + 1}
                  </span>
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-lg border border-[#E5E5E1] shrink-0 bg-white"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-[#1A1A1A] truncate max-w-[180px]">{item.name}</h4>
                    <span className="text-[11px] text-[#7A7A75]">{item.category} • {item.color}</span>
                  </div>
                </div>
                <span className="text-xs font-medium text-[#1A1A1A] bg-white px-2.5 py-1 rounded-lg border border-[#E5E5E1]">
                  {item.timesWorn} Wears
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Underutilized Alert */}
        <div className="bg-white border border-[#E5E5E1] rounded-2xl p-6 shadow-sm space-y-4">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-[#7A7A75]" />
            <h3 className="text-base font-semibold text-[#1A1A1A]">Rarely Worn Pieces ({underutilizedItems.length})</h3>
          </div>

          <p className="text-xs text-[#7A7A75]">
            These pieces have been worn 2 or fewer times. Try pairing them in your next AI outfit request!
          </p>

          <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
            {underutilizedItems.map((item) => (
              <div
                key={item.id}
                className="bg-[#F9F9F8] p-3 rounded-xl border border-[#E5E5E1] flex items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-10 h-10 object-cover rounded-lg border border-[#E5E5E1] shrink-0 bg-white"
                  />
                  <div>
                    <h4 className="text-xs font-semibold text-[#1A1A1A] truncate max-w-[180px]">{item.name}</h4>
                    <span className="text-[11px] text-[#7A7A75]">{item.category} • {item.storageLocation}</span>
                  </div>
                </div>
                <span className="text-[11px] font-medium text-[#7A7A75] bg-white px-2.5 py-1 rounded-lg border border-[#E5E5E1]">
                  {item.timesWorn} Wears
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
