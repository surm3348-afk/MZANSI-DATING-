import React, { useState } from 'react';
import { Heart, Sparkles, MessageCircle, CheckCircle2, Lock } from 'lucide-react';
import { UserProfile } from '../types';
import { CloverIcon } from './CloverLogo';

interface LikesScreenProps {
  likedProfiles: UserProfile[];
  onOpenChat: (profile: UserProfile) => void;
  onSelectProfileDetails: (profile: UserProfile) => void;
  isVipSubscriber: boolean;
  onSubscribe: () => void;
}

export const LikesScreen: React.FC<LikesScreenProps> = ({
  likedProfiles,
  onOpenChat,
  onSelectProfileDetails,
  isVipSubscriber,
  onSubscribe
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'matches' | 'superlikes'>('all');

  return (
    <div className="w-full max-w-[430px] mx-auto px-4 pb-24 pt-2">
      {/* Header */}
      <div className="flex items-center justify-between py-2 border-b border-white/20">
        <div className="flex items-center gap-2">
          <CloverIcon size={24} />
          <h1 className="font-serif-mzansi text-xl font-bold text-white drop-shadow-sm">
            Likes & Matches
          </h1>
        </div>
        <span className="text-xs bg-white/20 backdrop-blur-xs text-white px-2.5 py-1 rounded-full font-semibold">
          {likedProfiles.length} Interested
        </span>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white/40 backdrop-blur-xs rounded-2xl my-3 text-xs">
        <button
          type="button"
          onClick={() => setFilterMode('all')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filterMode === 'all'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          All Likes ({likedProfiles.length})
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('matches')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filterMode === 'matches'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          Mutual Matches
        </button>
        <button
          type="button"
          onClick={() => setFilterMode('superlikes')}
          className={`flex-1 py-1.5 rounded-xl font-bold transition-all cursor-pointer ${
            filterMode === 'superlikes'
              ? 'bg-white text-slate-900 shadow-xs'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          🍀 Super Likes
        </button>
      </div>

      {/* VIP Unlock Banner if not subscribed */}
      {!isVipSubscriber && (
        <div className="p-3.5 bg-gradient-to-r from-amber-500 to-[#C5A253] rounded-2xl text-white shadow-md mb-3 flex items-center justify-between">
          <div className="space-y-0.5">
            <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
              VIP Feature
            </span>
            <div className="font-bold text-xs mt-1">See Who Liked You Instantly</div>
            <p className="text-[10px] text-white/90">
              Unlock unblurred photos & match immediately without waiting.
            </p>
          </div>
          <button
            type="button"
            onClick={onSubscribe}
            className="px-3 py-1.5 bg-white text-slate-900 rounded-xl text-xs font-bold hover:bg-slate-50 cursor-pointer shadow-xs shrink-0"
          >
            R149/mo
          </button>
        </div>
      )}

      {/* Profiles Grid */}
      <div className="grid grid-cols-2 gap-3">
        {likedProfiles.map((profile, index) => (
          <div
            key={profile.id}
            className="bg-white rounded-[22px] overflow-hidden shadow-sm border border-white/80 group flex flex-col justify-between"
          >
            <div
              className="relative h-48 w-full cursor-pointer bg-slate-100"
              onClick={() => onSelectProfileDetails(profile)}
            >
              <img
                src={profile.avatar}
                alt={profile.name}
                referrerPolicy="no-referrer"
                className={`w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 ${
                  !isVipSubscriber && index > 1 ? 'filter blur-sm' : ''
                }`}
              />

              {!isVipSubscriber && index > 1 && (
                <div className="absolute inset-0 bg-black/40 backdrop-blur-xs flex flex-col items-center justify-center p-2 text-center text-white">
                  <Lock size={18} className="text-amber-300 mb-1" />
                  <span className="text-[10px] font-bold">Secret Admirer</span>
                  <span className="text-[9px] text-white/80">Unlock with VIP</span>
                </div>
              )}

              {/* Badges */}
              <div className="absolute top-2 right-2">
                {profile.verification === 'purple' ? (
                  <span className="bg-purple-600 text-white p-1 rounded-full text-xs shadow-xs">
                    <CheckCircle2 size={12} />
                  </span>
                ) : (
                  <span className="bg-blue-500 text-white p-1 rounded-full text-xs shadow-xs">
                    <CheckCircle2 size={12} />
                  </span>
                )}
              </div>

              {/* Bottom Scrim */}
              <div className="absolute bottom-0 inset-x-0 p-2.5 bg-gradient-to-t from-black/80 via-black/30 to-transparent text-white">
                <div className="font-serif-mzansi font-bold text-xs truncate">
                  {profile.name}, {profile.age}
                </div>
                <div className="text-[10px] text-white/80 truncate">
                  {profile.location}
                </div>
              </div>
            </div>

            {/* Action Bar */}
            <div className="p-2.5 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-[#9E7728] flex items-center gap-1">
                <CloverIcon size={12} />
                <span>94% Match</span>
              </span>

              <button
                type="button"
                onClick={() => onOpenChat(profile)}
                className="px-3 py-1 bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-lg text-xs font-semibold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <MessageCircle size={12} />
                <span>Chat</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
