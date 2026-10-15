import React, { useState } from 'react';
import { Search, Heart, RefreshCw, X, CheckCircle2, MapPin } from 'lucide-react';
import { CloverIcon } from './CloverLogo';
import { DailyMzansiHoroscope } from './DailyMzansiHoroscope';
import { DiscoverProfileCard } from './DiscoverProfileCard';
import { UserProfile } from '../types';

interface DiscoverScreenProps {
  currentUser?: UserProfile;
  profiles: UserProfile[];
  onLikeProfile: (profile: UserProfile) => void;
  onSuperLike: (profile: UserProfile) => void;
  onOpenChat: (profile: UserProfile) => void;
  onOpenChatWithMatch?: (profile: UserProfile, starterText: string) => void;
  onSelectProfileDetails: (profile: UserProfile) => void;
  onNavigateToVIP: () => void;
}

type FilterChip = 'All' | 'Nearby Mbombela' | 'Verified Purple' | 'Africa' | 'Europe' | 'Online Now';

export const DiscoverScreen: React.FC<DiscoverScreenProps> = ({
  currentUser,
  profiles,
  onLikeProfile,
  onSuperLike,
  onOpenChat,
  onOpenChatWithMatch,
  onSelectProfileDetails,
}) => {
  const [activeFilter, setActiveFilter] = useState<FilterChip>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [showSearchInput, setShowSearchInput] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);
  const [likedMap, setLikedMap] = useState<Record<string, boolean>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handlePullToRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
      showToast('Refreshed latest profiles e Mzansi 🇿🇦');
    }, 900);
  };

  const handleLikeClick = (e: React.MouseEvent, profile: UserProfile) => {
    e.stopPropagation();
    const isAlreadyLiked = likedMap[profile.id];
    setLikedMap((prev) => ({ ...prev, [profile.id]: !isAlreadyLiked }));
    if (!isAlreadyLiked) {
      onLikeProfile(profile);
      showToast(`Liked ${profile.name}! ❤️`);
    }
  };

  // Filter logic
  const filteredProfiles = profiles.filter((p) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        p.name.toLowerCase().includes(q) ||
        p.location.toLowerCase().includes(q) ||
        p.bio.toLowerCase().includes(q) ||
        p.occupation.toLowerCase().includes(q);
      if (!match) return false;
    }

    // Filter Chips
    if (activeFilter === 'Nearby Mbombela') {
      return p.location.toLowerCase().includes('mbombela') || p.province === 'Mpumalanga';
    }
    if (activeFilter === 'Verified Purple') {
      return p.verification === 'purple';
    }
    if (activeFilter === 'Africa') {
      return p.country === 'South Africa' || p.country === 'Nigeria' || p.country === 'Kenya';
    }
    if (activeFilter === 'Europe') {
      return p.country === 'United Kingdom' || p.country === 'France' || p.country === 'Germany';
    }
    if (activeFilter === 'Online Now') {
      return p.isOnline;
    }

    return true;
  });

  const filterChips: FilterChip[] = [
    'All',
    'Nearby Mbombela',
    'Verified Purple',
    'Africa',
    'Europe',
    'Online Now',
  ];

  return (
    <div className="w-full max-w-[430px] mx-auto px-4 pb-28 pt-2">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER: "Find Love E Mzansi" small gold top left, search icon top right */}
      <div className="flex items-center justify-between py-2.5">
        <div className="flex items-center gap-2">
          <CloverIcon size={20} />
          <h1 className="font-serif-mzansi text-lg font-bold text-[#C5A253] tracking-wide drop-shadow-sm">
            Find Love E Mzansi
          </h1>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Pull to Refresh Button */}
          <button
            type="button"
            onClick={handlePullToRefresh}
            className={`p-2 rounded-full text-white/90 hover:text-white bg-white/20 backdrop-blur-xs transition-all cursor-pointer ${
              isRefreshing ? 'animate-spin text-[#C5A253]' : ''
            }`}
            title="Pull to Refresh"
            aria-label="Refresh profiles"
          >
            <RefreshCw size={16} />
          </button>

          {/* Search Icon */}
          <button
            type="button"
            onClick={() => setShowSearchInput(!showSearchInput)}
            className={`p-2 rounded-full transition-all cursor-pointer ${
              showSearchInput
                ? 'bg-gold-gradient text-white shadow-md'
                : 'text-white/90 hover:text-white bg-white/20 backdrop-blur-xs'
            }`}
            aria-label="Search profiles"
          >
            <Search size={16} />
          </button>
        </div>
      </div>

      {/* Expandable Search Input */}
      {showSearchInput && (
        <div className="relative mb-2.5 animate-in fade-in slide-in-from-top-1 duration-200">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name, city (e.g. Mbombela), interests..."
            className="w-full pl-9 pr-8 py-2 bg-white/95 backdrop-blur-md border border-white/80 rounded-2xl text-xs text-slate-800 placeholder-[#6B7280] shadow-sm focus:outline-none focus:ring-2 focus:ring-[#C5A253]"
            autoFocus
          />
          <Search size={14} className="absolute left-3 top-2.5 text-[#C5A253]" />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X size={14} />
            </button>
          )}
        </div>
      )}

      {/* FILTER CHIP ROW: All, Nearby Mbombela, Verified Purple, Africa, Europe, Online Now (Gold when active) */}
      <div className="flex items-center gap-2 overflow-x-auto py-2 scrollbar-none text-xs">
        {filterChips.map((chip) => {
          const isActive = activeFilter === chip;
          return (
            <button
              key={chip}
              type="button"
              onClick={() => setActiveFilter(chip)}
              className={`px-3.5 py-1.5 rounded-full shrink-0 font-medium transition-all cursor-pointer select-none ${
                isActive
                  ? 'bg-gold-gradient text-white shadow-md shadow-[#C5A253]/25 font-semibold'
                  : 'bg-white/90 text-slate-700 hover:bg-white shadow-xs border border-white/60'
              }`}
            >
              {chip === 'Nearby Mbombela' && '📍 '}
              {chip === 'Verified Purple' && '✓ '}
              {chip === 'Online Now' && '🟢 '}
              {chip}
            </button>
          );
        })}
      </div>

      {/* Daily Mzansi Horoscope Widget (Gemini-powered conversation sparker & insight) */}
      <div className="mt-2.5">
        <DailyMzansiHoroscope
          currentUser={currentUser}
          profiles={profiles}
          onOpenChatWithMatch={onOpenChatWithMatch}
          onShowToast={showToast}
        />
      </div>

      {/* Simulated Pull to Refresh Status indicator */}
      {isRefreshing && (
        <div className="py-2 flex items-center justify-center gap-2 text-xs text-white/90 font-medium animate-pulse">
          <CloverIcon size={16} />
          <span>Refreshing Mzansi matches...</span>
        </div>
      )}

      {/* PROFILE GRID: 2 COLUMNS */}
      {filteredProfiles.length === 0 ? (
        <div className="bg-white rounded-[24px] p-8 text-center my-6 shadow-sm border border-white/80">
          <div className="w-12 h-12 bg-amber-50 text-[#C5A253] rounded-full flex items-center justify-center mx-auto mb-3">
            <Search size={22} />
          </div>
          <h3 className="font-serif-mzansi text-base font-bold text-slate-800">
            No Profiles Found
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-xs mx-auto">
            Try switching to "All" or resetting your search to see more matches e Mzansi.
          </p>
          <button
            type="button"
            onClick={() => {
              setActiveFilter('All');
              setSearchQuery('');
            }}
            className="mt-3.5 px-4 py-2 bg-gold-gradient text-white text-xs font-semibold rounded-xl shadow-xs"
          >
            Show All Profiles
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 mt-1.5">
          {filteredProfiles.map((profile) => (
            <DiscoverProfileCard
              key={profile.id}
              profile={profile}
              isLiked={Boolean(likedMap[profile.id])}
              onSelectProfileDetails={onSelectProfileDetails}
              onLikeClick={handleLikeClick}
            />
          ))}
        </div>
      )}
    </div>
  );
};
