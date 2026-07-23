import React, { useState, useEffect } from 'react';
import {
  WashingMachine,
  X,
  Play,
  Zap,
  Trash2,
  Droplets,
  Shirt,
  Timer,
  ChevronDown,
} from 'lucide-react';
import { WardrobeItem } from '../../types';

export interface LaundryCycleState {
  id: string;
  itemIds: string[];
  startTime: number; // Date.now() timestamp
  durationSeconds: number;
  totalDurationSeconds: number;
  presetName: string;
  status: 'idle' | 'running' | 'completed';
}

interface LaundryBasketModalProps {
  isOpen: boolean;
  onClose: () => void;
  laundryItems: WardrobeItem[];
  onRemoveFromLaundry: (id: string) => void;
  onCompleteCycle: (itemIds: string[]) => void;
  activeCycle: LaundryCycleState | null;
  onStartCycle: (itemIds: string[], durationSeconds: number, presetName: string) => void;
  onCancelCycle: () => void;
  onInstantCompleteCycle?: () => void;
}

const DURATION_OPTIONS = [
  { value: '30', label: '30 Seconds', seconds: 30, name: '30 Seconds' },
  { value: '300', label: '5 Minutes', seconds: 300, name: '5 Minutes' },
  { value: '900', label: '15 Minutes', seconds: 900, name: '15 Minutes' },
  { value: '1800', label: '30 Minutes', seconds: 1800, name: '30 Minutes' },
  { value: '2700', label: '45 Minutes', seconds: 2700, name: '45 Minutes' },
  { value: '3600', label: '60 Minutes (1 Hour)', seconds: 3600, name: '60 Minutes' },
  { value: '5400', label: '90 Minutes (1.5 Hours)', seconds: 5400, name: '90 Minutes' },
  { value: '7200', label: '120 Minutes (2 Hours)', seconds: 7200, name: '120 Minutes' },
];

export const LaundryBasketModal: React.FC<LaundryBasketModalProps> = ({
  isOpen,
  onClose,
  laundryItems,
  onRemoveFromLaundry,
  onCompleteCycle,
  activeCycle,
  onStartCycle,
  onCancelCycle,
  onInstantCompleteCycle,
}) => {
  const [selectedOption, setSelectedOption] = useState<string>('1800');

  // Time remaining for active cycle
  const [timeLeft, setTimeLeft] = useState<number>(0);

  useEffect(() => {
    if (!activeCycle || activeCycle.status !== 'running') {
      setTimeLeft(0);
      return;
    }

    const updateTimer = () => {
      const now = Date.now();
      const elapsedSeconds = Math.floor((now - activeCycle.startTime) / 1000);
      const remaining = Math.max(0, activeCycle.totalDurationSeconds - elapsedSeconds);
      setTimeLeft(remaining);

      if (remaining === 0) {
        // Timer completed!
        if (onCompleteCycle) {
          onCompleteCycle(activeCycle.itemIds);
        }
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, [activeCycle, onCompleteCycle]);

  if (!isOpen) return null;

  const isWashing = activeCycle && activeCycle.status === 'running' && timeLeft > 0;

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    if (mins >= 60) {
      const hrs = Math.floor(mins / 60);
      const remMins = mins % 60;
      return `${hrs}h ${remMins}m ${secs.toString().padStart(2, '0')}s`;
    }
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const progressPercent = activeCycle && activeCycle.totalDurationSeconds > 0
    ? Math.min(100, Math.round(((activeCycle.totalDurationSeconds - timeLeft) / activeCycle.totalDurationSeconds) * 100))
    : 0;

  const handleStart = () => {
    let finalDuration = 1800;
    let name = '30 Minutes Wash';

    const match = DURATION_OPTIONS.find((o) => o.value === selectedOption);
    if (match) {
      finalDuration = match.seconds;
      name = `${match.label} Wash`;
    }

    const itemIdsToWash = laundryItems.map((i) => i.id);
    if (itemIdsToWash.length === 0) return;

    onStartCycle(itemIdsToWash, finalDuration, name);
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#1A1A1A]/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className="bg-white dark:bg-[#1C1C20] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden text-[#1A1A1A] dark:text-white my-6">
        
        {/* Header */}
        <div className="bg-[#004253] text-white p-4 sm:p-5 flex items-center justify-between relative overflow-hidden">
          <div className="flex items-center gap-3 relative z-10">
            <div className={`p-2.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white ${isWashing ? 'animate-bounce' : ''}`}>
              <WashingMachine className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold tracking-tight">Laundry Basket</h2>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-white/20 text-white font-mono">
                  {laundryItems.length} {laundryItems.length === 1 ? 'item' : 'items'}
                </span>
              </div>
              <p className="text-xs text-white/80 mt-0.5">
                {isWashing ? 'Cycle active in progress...' : 'Washing machine & clothing care cycle'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors relative z-10"
            title="Close"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Decorative background circle */}
          <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white/5 rounded-full blur-xl pointer-events-none" />
        </div>

        <div className="p-4 sm:p-6 space-y-5">
          
          {/* Active Washing Cycle View */}
          {isWashing ? (
            <div className="bg-[#E6F0F2] dark:bg-[#004253]/25 border border-[#004253]/20 dark:border-[#004253]/40 rounded-2xl p-5 text-center space-y-4 shadow-inner">
              <div className="flex items-center justify-center">
                <div className="relative w-20 h-20 flex items-center justify-center rounded-full bg-[#004253] text-white shadow-md">
                  <WashingMachine className="w-10 h-10 animate-spin" style={{ animationDuration: '3s' }} />
                  <span className="absolute -bottom-1 -right-1 p-1 bg-emerald-500 rounded-full text-white border-2 border-white dark:border-[#1C1C20]">
                    <Droplets className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>

              <div>
                <span className="text-[11px] font-bold uppercase tracking-widest text-[#004253] dark:text-[#38bdf8] block">
                  {activeCycle?.presetName || 'Laundry Cycle'}
                </span>
                <div className="text-3xl font-mono font-bold text-[#1A1A1A] dark:text-white mt-1">
                  {formatTime(timeLeft)}
                </div>
                <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA] mt-1">
                  Estimated time remaining until clean & fresh
                </p>
              </div>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[11px] font-semibold text-[#7A7A75] dark:text-[#A1A1AA]">
                  <span>Washing & Rinsing</span>
                  <span>{progressPercent}%</span>
                </div>
                <div className="w-full h-3 rounded-full bg-[#D1E2E5] dark:bg-[#2A2A30] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#004253] to-[#38bdf8] transition-all duration-1000"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* Items in Active Wash */}
              <div className="pt-2">
                <p className="text-xs font-semibold text-[#1A1A1A] dark:text-white mb-2 text-left">
                  Items in current wash cycle:
                </p>
                <div className="flex items-center gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {laundryItems.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-center gap-2 bg-white dark:bg-[#1C1C20] border border-[#004253]/20 dark:border-[#004253]/40 rounded-xl p-1.5 pr-3 text-xs shrink-0"
                    >
                      <img src={item.imageUrl} alt={item.name} className="w-8 h-8 rounded-lg object-cover" />
                      <span className="font-medium text-[#1A1A1A] dark:text-white truncate max-w-[100px] text-[11px]">
                        {item.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions for active cycle */}
              <div className="flex items-center gap-2 pt-2 border-t border-[#004253]/15 dark:border-[#004253]/30">
                <button
                  onClick={
                    onInstantCompleteCycle
                      ? onInstantCompleteCycle
                      : () => onCompleteCycle(activeCycle?.itemIds || [])
                  }
                  className="flex-1 py-2.5 px-3 rounded-xl bg-[#004253] dark:bg-[#005B73] hover:bg-[#002D3A] text-white text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1.5"
                >
                  <Zap className="w-3.5 h-3.5 fill-white" />
                  <span>Instant Finish & Clean All</span>
                </button>
                <button
                  onClick={onCancelCycle}
                  className="py-2.5 px-3 rounded-xl bg-white dark:bg-[#1C1C20] border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 text-xs font-medium transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : laundryItems.length === 0 ? (
            /* Empty State */
            <div className="py-12 text-center space-y-3">
              <div className="w-16 h-16 rounded-full bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] flex items-center justify-center mx-auto text-[#7A7A75] dark:text-[#A1A1AA]">
                <Shirt className="w-8 h-8 opacity-60" />
              </div>
              <h3 className="text-base font-semibold text-[#1A1A1A] dark:text-white">Your Laundry Basket is Empty</h3>
              <p className="text-xs text-[#7A7A75] dark:text-[#A1A1AA] max-w-xs mx-auto">
                Items marked as "In Laundry" in your wardrobe will appear here ready to be washed.
              </p>
              <button
                onClick={onClose}
                className="mt-2 px-4 py-2 rounded-xl bg-[#1A1A1A] dark:bg-[#004253] text-white text-xs font-medium hover:bg-[#333330] dark:hover:bg-[#002D3A]"
              >
                Return to Wardrobe
              </button>
            </div>
          ) : (
            /* Idle Basket: Items List + Duration Preset Selector */
            <>
              {/* Basket Items List */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-bold text-[#1A1A1A] dark:text-white">Items in Basket ({laundryItems.length})</span>
                  <span className="text-[#7A7A75] dark:text-[#A1A1AA] text-[11px]">Ready for wash cycle</span>
                </div>

                <div className="max-h-48 overflow-y-auto space-y-2 pr-1">
                  {laundryItems.map((item) => (
                    <div
                      key={item.id}
                      className="bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] rounded-xl p-2.5 flex items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-11 h-11 rounded-lg object-cover border border-[#E5E5E1] dark:border-[#2A2A30] shrink-0"
                        />
                        <div className="min-w-0">
                          <h4 className="text-xs font-semibold text-[#1A1A1A] dark:text-white truncate">{item.name}</h4>
                          <p className="text-[11px] text-[#7A7A75] dark:text-[#A1A1AA] truncate">
                            {item.category} • {item.color}
                          </p>
                        </div>
                      </div>

                      <button
                        onClick={() => onRemoveFromLaundry(item.id)}
                        className="p-1.5 rounded-lg hover:bg-rose-50 dark:hover:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs transition-colors shrink-0 flex items-center gap-1 font-medium"
                        title="Remove from basket (Mark Clean)"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span className="hidden sm:inline text-[11px]">Remove</span>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {/* Wash Duration Dropdown Selector */}
              <div className="space-y-3 pt-3 border-t border-[#E5E5E1] dark:border-[#2A2A30]">
                <label
                  htmlFor="select-laundry-duration"
                  className="text-xs font-bold text-[#1A1A1A] dark:text-white flex items-center gap-2"
                >
                  <Timer className="w-4 h-4 text-[#004253] dark:text-[#38bdf8]" />
                  <span>Select Wash Time</span>
                </label>

                <div className="relative">
                  <select
                    id="select-laundry-duration"
                    value={selectedOption}
                    onChange={(e) => setSelectedOption(e.target.value)}
                    className="w-full px-3.5 py-3 text-xs font-semibold rounded-xl bg-[#F9F9F8] dark:bg-[#222226] border border-[#E5E5E1] dark:border-[#2A2A30] text-[#1A1A1A] dark:text-white focus:outline-none focus:border-[#004253] dark:focus:border-[#38bdf8] transition-colors cursor-pointer appearance-none pr-10 shadow-xs"
                  >
                    {DURATION_OPTIONS.map((opt) => (
                      <option key={opt.value} value={opt.value} className="py-1.5 text-xs">
                        {opt.label}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-[#7A7A75] dark:text-[#A1A1AA] absolute right-3.5 top-3.5 pointer-events-none" />
                </div>
              </div>

              {/* Start Laundry Button */}
              <div className="pt-2">
                <button
                  onClick={handleStart}
                  className="w-full py-3 px-4 rounded-xl bg-[#004253] dark:bg-[#005B73] hover:bg-[#002D3A] text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>Start Laundry Cycle ({laundryItems.length} items)</span>
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
};
