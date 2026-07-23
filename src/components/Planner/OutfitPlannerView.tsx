import React, { useState } from 'react';
import { CalendarDays, Bookmark, Star, Plus, CheckCircle, Trash2, Tag, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { SavedOutfit, WearLog, WardrobeItem } from '../../types';

interface OutfitPlannerViewProps {
  savedOutfits: SavedOutfit[];
  wearLogs: WearLog[];
  wardrobe: WardrobeItem[];
  onRemoveSavedOutfit: (id: string) => void;
  onLogWear: (log: Omit<WearLog, 'id'>) => void;
  onDeleteWearLog: (id: string) => void;
}

export const OutfitPlannerView: React.FC<OutfitPlannerViewProps> = ({
  savedOutfits,
  wearLogs,
  wardrobe,
  onRemoveSavedOutfit,
  onLogWear,
  onDeleteWearLog,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'saved' | 'history'>('saved');
  const [showLogModal, setShowLogModal] = useState(false);

  // New Log Form State
  const [logDate, setLogDate] = useState(new Date().toISOString().split('T')[0]);
  const [logOutfitName, setLogOutfitName] = useState('');
  const [logOccasion, setLogOccasion] = useState('Casual Day Out');
  const [logRating, setLogRating] = useState(5);
  const [logNotes, setLogNotes] = useState('');

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
      {/* Top Banner */}
      <div className="bg-white border border-[#E5E5E1] rounded-2xl p-6 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-[#1A1A1A]">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#E6F0F2] text-[#004253] border border-[#004253]/20">
              Outfit Planner & History
            </span>
            <span className="text-xs text-[#7A7A75] font-semibold">{savedOutfits.length} Saved Looks</span>
          </div>
          <h2 className="text-3xl font-light tracking-tight text-[#1A1A1A]">
            Saved Outfits & Wear Journal
          </h2>
          <p className="text-xs text-[#7A7A75] mt-1 max-w-xl">
            Review favorite looks, log daily wear history, and track how frequently clothing items get worn.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            id="btn-log-outfit-today"
            onClick={() => setShowLogModal(true)}
            className="flex items-center gap-2 px-5 py-3 rounded-2xl bg-[#1A1A1A] hover:bg-[#333330] text-white font-medium text-xs shadow-xs transition-all active:scale-[0.98]"
          >
            <Plus className="w-4 h-4 stroke-[2]" />
            <span>Log What You Wore</span>
          </button>
        </div>
      </div>

      {/* Sub Tab Switcher */}
      <div className="flex border-b border-[#E5E5E1] gap-6 text-xs font-medium">
        <button
          onClick={() => setActiveSubTab('saved')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeSubTab === 'saved'
              ? 'border-[#1A1A1A] text-[#1A1A1A] font-semibold'
              : 'border-transparent text-[#7A7A75] hover:text-[#1A1A1A]'
          }`}
        >
          <Bookmark className="w-4 h-4" />
          <span>Saved Outfits Collection ({savedOutfits.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('history')}
          className={`pb-3 border-b-2 flex items-center gap-2 transition-colors ${
            activeSubTab === 'history'
              ? 'border-[#1A1A1A] text-[#1A1A1A] font-semibold'
              : 'border-transparent text-[#7A7A75] hover:text-[#1A1A1A]'
          }`}
        >
          <Clock className="w-4 h-4" />
          <span>Wear History Journal ({wearLogs.length})</span>
        </button>
      </div>

      {/* Content Area */}
      {activeSubTab === 'saved' ? (
        savedOutfits.length === 0 ? (
          <div className="bg-white border border-[#E5E5E1] rounded-2xl p-16 text-center text-[#7A7A75] space-y-3">
            <Bookmark className="w-10 h-10 text-[#A1A19C] mx-auto" />
            <h3 className="text-base font-semibold text-[#1A1A1A]">No Saved Outfits Yet</h3>
            <p className="text-xs text-[#7A7A75] max-w-sm mx-auto">
              Use the AI Stylist tab to generate and bookmark your favorite outfit combinations.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {savedOutfits.map((outfit) => (
              <div
                key={outfit.id}
                className="bg-white border border-[#E5E5E1] hover:border-[#1A1A1A] rounded-2xl p-5 shadow-sm space-y-4 text-[#1A1A1A] relative group transition-all"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-widest bg-[#F5F5F0] text-[#1A1A1A] border border-[#E5E5E1]">
                      {outfit.styleVibe}
                    </span>
                    <h3 className="text-base font-semibold text-[#1A1A1A] mt-1.5">{outfit.title}</h3>
                    <p className="text-xs text-[#7A7A75]">{outfit.occasion}</p>
                  </div>

                  <button
                    onClick={() => onRemoveSavedOutfit(outfit.id)}
                    className="p-1.5 rounded-lg text-[#7A7A75] hover:text-rose-600 hover:bg-[#F5F5F0] transition-colors"
                    title="Remove saved outfit"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <div className="pt-3 border-t border-[#E5E5E1] flex items-center justify-between text-xs text-[#7A7A75]">
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
                        notes: 'Wore from saved outfits library',
                      });
                    }}
                    className="text-[#004253] hover:underline font-medium flex items-center gap-1"
                  >
                    <CheckCircle className="w-3.5 h-3.5" />
                    <span>Log Worn Today</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )
      ) : wearLogs.length === 0 ? (
        <div className="bg-white border border-[#E5E5E1] rounded-2xl p-16 text-center text-[#7A7A75] space-y-3">
          <CalendarDays className="w-10 h-10 text-[#A1A19C] mx-auto" />
          <h3 className="text-base font-semibold text-[#1A1A1A]">No Wear Logs Recorded</h3>
          <p className="text-xs text-[#7A7A75] max-w-sm mx-auto">
            Log what you wear daily to build your personal style history timeline.
          </p>
          <button
            onClick={() => setShowLogModal(true)}
            className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] text-white font-medium text-xs"
          >
            Log Today's Outfit
          </button>
        </div>
      ) : (
        <div className="bg-white border border-[#E5E5E1] rounded-2xl overflow-hidden divide-y divide-[#E5E5E1]">
          {wearLogs.map((log) => (
            <div key={log.id} className="p-4 hover:bg-[#F9F9F8] transition-colors flex items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#1A1A1A] bg-[#F5F5F0] px-2.5 py-0.5 rounded-full border border-[#E5E5E1]">
                    {log.date}
                  </span>
                  <h4 className="text-sm font-semibold text-[#1A1A1A]">{log.outfitName}</h4>
                </div>
                <div className="flex items-center gap-3 text-xs text-[#7A7A75]">
                  <span>Occasion: {log.occasion}</span>
                  {log.notes && <span>• "{log.notes}"</span>}
                </div>
              </div>

              <div className="flex items-center gap-3">
                <div className="flex items-center text-[#1A1A1A]">
                  {Array.from({ length: log.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-[#1A1A1A]" />
                  ))}
                </div>

                <button
                  onClick={() => onDeleteWearLog(log.id)}
                  className="p-1.5 text-[#7A7A75] hover:text-rose-600 rounded-lg hover:bg-[#F5F5F0]"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal for Logging Outfit */}
      {showLogModal && (
        <div className="fixed inset-0 z-50 bg-[#1A1A1A]/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white border border-[#E5E5E1] rounded-2xl w-full max-w-md p-6 shadow-2xl text-[#1A1A1A] space-y-4">
            <h3 className="text-lg font-semibold text-[#1A1A1A]">Log What You Wore</h3>

            <form onSubmit={handleCreateLog} className="space-y-4 text-xs">
              <div>
                <label className="block text-[#7A7A75] font-semibold mb-1">Date</label>
                <input
                  type="date"
                  value={logDate}
                  onChange={(e) => setLogDate(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F9F9F8] border border-[#E5E5E1] rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[#7A7A75] font-semibold mb-1">Outfit Name / Description</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. White Oxford + Dark Jeans + Gold Watch"
                  value={logOutfitName}
                  onChange={(e) => setLogOutfitName(e.target.value)}
                  className="w-full px-3.5 py-2.5 bg-[#F9F9F8] border border-[#E5E5E1] rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[#7A7A75] font-semibold mb-1">Occasion</label>
                <input
                  type="text"
                  value={logOccasion}
                  onChange={(e) => setLogOccasion(e.target.value)}
                  placeholder="e.g. Office, Dinner, Casual Walk"
                  className="w-full px-3.5 py-2.5 bg-[#F9F9F8] border border-[#E5E5E1] rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div>
                <label className="block text-[#7A7A75] font-semibold mb-1">Satisfaction Rating</label>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setLogRating(star)}
                      className={`p-1.5 rounded-lg ${logRating >= star ? 'text-[#1A1A1A]' : 'text-[#A1A19C]'}`}
                    >
                      <Star className="w-5 h-5 fill-current" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#7A7A75] font-semibold mb-1">Styling Notes</label>
                <textarea
                  rows={2}
                  value={logNotes}
                  onChange={(e) => setLogNotes(e.target.value)}
                  placeholder="e.g. Very comfortable in the chilly weather!"
                  className="w-full px-3.5 py-2.5 bg-[#F9F9F8] border border-[#E5E5E1] rounded-xl text-[#1A1A1A] focus:outline-none focus:border-[#1A1A1A]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 rounded-xl text-[#7A7A75] hover:text-[#1A1A1A]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-[#1A1A1A] text-white font-medium"
                >
                  Save Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
