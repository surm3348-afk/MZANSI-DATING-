import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Copy, 
  Check, 
  RefreshCw, 
  MessageCircle, 
  ChevronDown, 
  ChevronUp, 
  Flame, 
  Heart, 
  Compass,
  Star,
  Share2
} from 'lucide-react';
import { CloverIcon } from './CloverLogo';
import { DailyMzansiHoroscopeData, UserProfile } from '../types';

interface DailyMzansiHoroscopeProps {
  currentUser?: UserProfile;
  profiles?: UserProfile[];
  onOpenChatWithMatch?: (profile: UserProfile, starterText: string) => void;
  onShowToast: (msg: string) => void;
}

const ZODIAC_SIGNS = [
  { name: 'Aries', symbol: '♈', dates: 'Mar 21 - Apr 19', vibe: 'Bold Trailblazer' },
  { name: 'Taurus', symbol: '♉', dates: 'Apr 20 - May 20', vibe: 'Soft Life Lover' },
  { name: 'Gemini', symbol: '♊', dates: 'May 21 - Jun 20', vibe: 'Witty Socialite' },
  { name: 'Cancer', symbol: '♋', dates: 'Jun 21 - Jul 22', vibe: 'Deeply Protective' },
  { name: 'Leo', symbol: '♌', dates: 'Jul 23 - Aug 22', vibe: 'Amapiano Royalty' },
  { name: 'Virgo', symbol: '♍', dates: 'Aug 23 - Sep 22', vibe: 'Classy Perfectionist' },
  { name: 'Libra', symbol: '♎', dates: 'Sep 23 - Oct 22', vibe: 'Charming Romantic' },
  { name: 'Scorpio', symbol: '♏', dates: 'Oct 23 - Nov 21', vibe: 'Magnetic Mystery' },
  { name: 'Sagittarius', symbol: '♐', dates: 'Nov 22 - Dec 21', vibe: 'Kruger Adventurer' },
  { name: 'Capricorn', symbol: '♑', dates: 'Dec 22 - Jan 19', vibe: 'Ambitious Mogul' },
  { name: 'Aquarius', symbol: '♒', dates: 'Jan 20 - Feb 18', vibe: 'Free-Spirited Rebel' },
  { name: 'Pisces', symbol: '♓', dates: 'Feb 19 - Mar 20', vibe: 'Soulful Dreamer' },
];

const MZANSI_VIBES = [
  'Amapiano Groove 🎵',
  'Braai & Chaf Pozi 🥩',
  'Camps Bay Sunset 🌅',
  'Quiet Soft Life ✨',
  'Jozi Skyline Coffee ☕',
  'Table Mountain Hike ⛰️'
];

export const DailyMzansiHoroscope: React.FC<DailyMzansiHoroscopeProps> = ({
  currentUser,
  profiles = [],
  onOpenChatWithMatch,
  onShowToast
}) => {
  const [selectedSign, setSelectedSign] = useState<string>('Leo');
  const [selectedVibe, setSelectedVibe] = useState<string>(MZANSI_VIBES[0]);
  const [horoscope, setHoroscope] = useState<DailyMzansiHoroscopeData | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [showMatchPicker, setShowMatchPicker] = useState<boolean>(false);

  // Fetch or generate horoscope
  const fetchHoroscope = async (signToFetch: string, vibeToFetch: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/horoscope', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          sign: signToFetch,
          vibe: vibeToFetch,
          userName: currentUser?.name || 'Mzansi Match'
        }),
      });

      if (!response.ok) {
        throw new Error('Server returned error');
      }

      const data: DailyMzansiHoroscopeData = await response.json();
      setHoroscope(data);
    } catch (err) {
      console.warn('Falling back to local Mzansi horoscope:', err);
      // Fallback
      setHoroscope({
        sign: signToFetch,
        mzansiArchetype: `${signToFetch} • The Mzansi Royalty`,
        dailyForecast: `The stars over Table Mountain and the golden highveld are in perfect harmony for you today! Your natural warmth and magnetic energy are at their peak. Keep your heart open to spontaneous laughter and soulful conversations.`,
        conversationSparker: `Quick Sunday debate: are we watching the golden sunset from a scenic rooftop or having a cozy braai with an amapiano playlist?`,
        luckyVibe: vibeToFetch,
        compatibility: 'Leo, Sagittarius & Libra',
        mzansiDateIdea: 'Scenic coffee drive or artisan gelato stroll followed by sunset drinks',
        luckyNumber: 27,
        isFallback: true
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchHoroscope(selectedSign, selectedVibe);
  }, [selectedSign]);

  const handleCopySparker = () => {
    if (!horoscope?.conversationSparker) return;
    navigator.clipboard.writeText(horoscope.conversationSparker);
    setIsCopied(true);
    onShowToast('Sparker copied! Ready to paste into chat ❤️');
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleSendToMatch = (profile: UserProfile) => {
    if (!horoscope?.conversationSparker) return;
    setShowMatchPicker(false);
    if (onOpenChatWithMatch) {
      onOpenChatWithMatch(profile, horoscope.conversationSparker);
    } else {
      handleCopySparker();
    }
  };

  return (
    <div className="w-full bg-white rounded-[24px] shadow-lg shadow-purple-950/5 border border-white/90 overflow-hidden mb-4 transition-all">
      {/* Widget Header with Gold Accents */}
      <div className="bg-gradient-to-r from-purple-50/80 via-white to-amber-50/80 p-3.5 sm:p-4 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-[#C5A253] to-[#E0C778] flex items-center justify-center text-white shadow-md shadow-[#C5A253]/25">
            <Sparkles size={18} className="animate-spin-slow" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <h2 className="font-serif-mzansi text-sm sm:text-base font-bold text-slate-800 tracking-tight">
                Daily Mzansi Horoscope
              </h2>
              <span className="text-[10px] font-bold bg-[#C5A253]/15 text-[#B78E3E] px-2 py-0.5 rounded-full border border-[#C5A253]/30">
                ✨ Gemini AI
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Daily love insights & conversation sparkers e Mzansi
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => fetchHoroscope(selectedSign, selectedVibe)}
            disabled={isLoading}
            className={`p-1.5 rounded-full text-slate-500 hover:text-[#C5A253] hover:bg-amber-50 transition-colors ${
              isLoading ? 'animate-spin text-[#C5A253]' : ''
            }`}
            title="Refresh Horoscope"
            aria-label="Refresh horoscope with Gemini"
          >
            <RefreshCw size={15} />
          </button>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            aria-label={isExpanded ? 'Collapse horoscope' : 'Expand horoscope'}
          >
            {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3.5 sm:p-4 space-y-3.5">
          {/* Zodiac Sign Carousel / Pills */}
          <div>
            <div className="flex items-center justify-between mb-1.5 px-0.5">
              <span className="text-[11px] font-semibold text-slate-600 flex items-center gap-1">
                <span>Select Your Star Sign:</span>
                <span className="text-[#C5A253] font-bold">{selectedSign}</span>
              </span>
              <span className="text-[10px] text-slate-400">
                {ZODIAC_SIGNS.find(s => s.name === selectedSign)?.dates}
              </span>
            </div>
            <div className="flex items-center gap-1.5 overflow-x-auto py-1 scrollbar-none">
              {ZODIAC_SIGNS.map((z) => {
                const isActive = selectedSign === z.name;
                return (
                  <button
                    key={z.name}
                    type="button"
                    onClick={() => {
                      if (selectedSign !== z.name) {
                        setSelectedSign(z.name);
                      }
                    }}
                    className={`shrink-0 px-2.5 py-1.5 rounded-xl text-xs flex items-center gap-1.5 font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-gold-gradient text-white shadow-md shadow-[#C5A253]/25 font-bold scale-102'
                        : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80 border border-slate-200/50'
                    }`}
                  >
                    <span className="text-sm leading-none">{z.symbol}</span>
                    <span>{z.name}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Vibe Selector Pills */}
          <div>
            <span className="text-[11px] font-semibold text-slate-600 block mb-1.5 px-0.5">
              Today's Mzansi Dating Vibe:
            </span>
            <div className="flex items-center gap-1.5 overflow-x-auto py-0.5 scrollbar-none">
              {MZANSI_VIBES.map((vibe) => {
                const isActive = selectedVibe === vibe;
                return (
                  <button
                    key={vibe}
                    type="button"
                    onClick={() => {
                      setSelectedVibe(vibe);
                      fetchHoroscope(selectedSign, vibe);
                    }}
                    className={`shrink-0 px-2.5 py-1 rounded-full text-[11px] font-medium transition-all cursor-pointer ${
                      isActive
                        ? 'bg-purple-100 text-purple-800 border border-purple-300 font-semibold shadow-xs'
                        : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200/60'
                    }`}
                  >
                    {vibe}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Horoscope Content Card */}
          {isLoading ? (
            <div className="bg-gradient-to-b from-amber-50/50 to-purple-50/50 rounded-2xl p-5 border border-amber-100/60 flex flex-col items-center justify-center text-center space-y-2.5 py-8 animate-pulse">
              <div className="w-10 h-10 rounded-full bg-gold-gradient text-white flex items-center justify-center animate-spin">
                <CloverIcon size={20} />
              </div>
              <div className="space-y-1">
                <p className="font-serif-mzansi font-bold text-slate-800 text-sm">
                  Consulting the Mzansi Stars with Gemini...
                </p>
                <p className="text-[11px] text-slate-500">
                  Aligning your {selectedSign} romantic energy e South Africa 🇿🇦
                </p>
              </div>
            </div>
          ) : horoscope ? (
            <div className="bg-gradient-to-br from-amber-50/70 via-white to-purple-50/50 rounded-2xl p-3.5 sm:p-4 border border-[#C5A253]/25 shadow-xs relative">
              {/* Archetype Banner */}
              <div className="flex items-center justify-between pb-2 border-b border-amber-200/50">
                <div className="flex items-center gap-1.5">
                  <Star size={14} className="text-[#C5A253] fill-[#C5A253]" />
                  <span className="font-serif-mzansi font-extrabold text-xs sm:text-sm text-slate-900 tracking-wide">
                    {horoscope.mzansiArchetype}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-[#B78E3E] bg-[#C5A253]/15 px-2 py-0.5 rounded-full">
                  <span>Lucky #</span>
                  <span>{horoscope.luckyNumber}</span>
                </div>
              </div>

              {/* Daily Love Forecast */}
              <p className="text-xs text-slate-700 leading-relaxed mt-2.5 font-normal">
                {horoscope.dailyForecast}
              </p>

              {/* CONVERSATION SPARKER BOX */}
              <div className="mt-3 bg-white/90 rounded-xl p-3 border border-[#C5A253]/35 shadow-xs">
                <div className="flex items-center justify-between mb-1.5">
                  <div className="flex items-center gap-1 text-[11px] font-bold text-[#B78E3E] uppercase tracking-wider">
                    <MessageCircle size={13} className="text-[#C5A253]" />
                    <span>Spark Conversation</span>
                  </div>
                  <span className="text-[10px] text-purple-700 font-semibold bg-purple-100/80 px-1.5 py-0.5 rounded-md">
                    Icebreaker of the Day
                  </span>
                </div>

                <p className="font-serif-mzansi italic text-xs text-slate-900 bg-amber-50/40 p-2 rounded-lg border-l-2 border-[#C5A253]">
                  "{horoscope.conversationSparker}"
                </p>

                {/* Action Buttons for Conversation Sparker */}
                <div className="flex items-center gap-2 mt-2.5">
                  <button
                    type="button"
                    onClick={handleCopySparker}
                    className="flex-1 py-1.5 px-3 bg-gold-gradient text-white text-xs font-semibold rounded-xl shadow-xs hover:opacity-95 active:scale-98 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {isCopied ? <Check size={13} /> : <Copy size={13} />}
                    <span>{isCopied ? 'Copied to Clipboard!' : 'Copy Sparker'}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowMatchPicker(!showMatchPicker)}
                    className="py-1.5 px-3 bg-purple-100 hover:bg-purple-200 text-purple-900 text-xs font-semibold rounded-xl transition-all flex items-center gap-1 cursor-pointer border border-purple-200"
                    title="Send directly to a match"
                  >
                    <Share2 size={13} />
                    <span>Send to Match</span>
                  </button>
                </div>

                {/* Match Picker Mini Drawer */}
                {showMatchPicker && profiles.length > 0 && (
                  <div className="mt-2.5 p-2 bg-slate-50 rounded-xl border border-slate-200/80 animate-in fade-in slide-in-from-top-1 duration-200">
                    <p className="text-[10px] font-bold text-slate-500 mb-1.5 uppercase tracking-wider">
                      Send icebreaker to:
                    </p>
                    <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                      {profiles.slice(0, 5).map((p) => (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => handleSendToMatch(p)}
                          className="shrink-0 flex items-center gap-1.5 p-1 pr-2 bg-white rounded-full border border-slate-200 shadow-xs hover:border-[#C5A253] transition-all text-left"
                        >
                          <img
                            src={p.avatar}
                            alt={p.name}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                          <span className="text-[11px] font-medium text-slate-800">
                            {p.name.split(' ')[0]}
                          </span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Vibe, Compatibility & Date Idea Badges */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 mt-3 text-[11px]">
                <div className="flex items-center gap-1.5 bg-white/70 p-1.5 rounded-lg border border-slate-100">
                  <Heart size={12} className="text-rose-500 shrink-0" />
                  <span className="text-slate-500 font-medium">Best Match:</span>
                  <span className="text-slate-800 font-semibold truncate">{horoscope.compatibility}</span>
                </div>

                <div className="flex items-center gap-1.5 bg-white/70 p-1.5 rounded-lg border border-slate-100">
                  <Compass size={12} className="text-[#C5A253] shrink-0" />
                  <span className="text-slate-500 font-medium">Date Idea:</span>
                  <span className="text-slate-800 font-semibold truncate">{horoscope.mzansiDateIdea}</span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
};
