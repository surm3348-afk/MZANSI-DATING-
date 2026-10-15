import React from 'react';
import { Compass, Heart, MessageCircle, Crown, User } from 'lucide-react';

export type TabType = 'discover' | 'likes' | 'chat' | 'vip' | 'profile';

interface BottomNavProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  unreadChatCount?: number;
  newLikesCount?: number;
}

export const BottomNav: React.FC<BottomNavProps> = ({
  activeTab,
  onSelectTab,
  unreadChatCount = 1,
  newLikesCount = 3
}) => {
  return (
    <div className="fixed bottom-4 inset-x-0 z-40 max-w-[390px] mx-auto px-3 pointer-events-none">
      {/* Floating White Pill 32px rounded with soft shadow */}
      <nav className="pointer-events-auto bg-white/95 backdrop-blur-md rounded-[32px] px-3 py-2 shadow-xl shadow-purple-950/15 border border-white/80 flex items-center justify-between">
        {/* Discover (Compass) */}
        <button
          type="button"
          onClick={() => onSelectTab('discover')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'discover'
              ? 'text-purple-600 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
          aria-label="Discover"
        >
          <div className="relative">
            <Compass size={22} strokeWidth={activeTab === 'discover' ? 2.5 : 1.8} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Discover</span>
        </button>

        {/* Likes (Heart with 3 badge) */}
        <button
          type="button"
          onClick={() => onSelectTab('likes')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'likes'
              ? 'text-purple-600 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
          aria-label="Likes"
        >
          <div className="relative">
            <Heart
              size={22}
              strokeWidth={activeTab === 'likes' ? 2.5 : 1.8}
              fill={activeTab === 'likes' ? '#9333EA' : 'none'}
            />
            {newLikesCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-rose-500 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {newLikesCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Likes</span>
        </button>

        {/* Chat (Bubble with 1 badge) */}
        <button
          type="button"
          onClick={() => onSelectTab('chat')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'chat'
              ? 'text-purple-600 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
          aria-label="Chat"
        >
          <div className="relative">
            <MessageCircle
              size={22}
              strokeWidth={activeTab === 'chat' ? 2.5 : 1.8}
              fill={activeTab === 'chat' ? '#9333EA' : 'none'}
            />
            {unreadChatCount > 0 && (
              <span className="absolute -top-1 -right-2 bg-purple-600 text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center shadow-xs">
                {unreadChatCount}
              </span>
            )}
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Chat</span>
        </button>

        {/* VIP (Crown gold with 18+ badge) */}
        <button
          type="button"
          onClick={() => onSelectTab('vip')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'vip'
              ? 'text-[#C5A253] font-bold scale-105'
              : 'text-[#C5A253]/70 hover:text-[#B78E3E] font-medium'
          }`}
          aria-label="VIP"
        >
          <div className="relative">
            <Crown
              size={22}
              strokeWidth={activeTab === 'vip' ? 2.5 : 1.8}
              className="text-[#C5A253]"
              fill={activeTab === 'vip' ? '#C5A253' : 'none'}
            />
            <span className="absolute -top-1 -right-2.5 bg-gradient-to-r from-[#C5A253] to-[#B78E3E] text-white text-[8px] font-extrabold px-1 rounded-full shadow-xs">
              18+
            </span>
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight font-semibold text-[#9E7728]">VIP</span>
        </button>

        {/* Profile (User) */}
        <button
          type="button"
          onClick={() => onSelectTab('profile')}
          className={`flex-1 py-1.5 flex flex-col items-center justify-center transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'text-purple-600 font-bold scale-105'
              : 'text-slate-400 hover:text-slate-600 font-medium'
          }`}
          aria-label="Profile"
        >
          <div className="relative">
            <User size={22} strokeWidth={activeTab === 'profile' ? 2.5 : 1.8} />
          </div>
          <span className="text-[10px] mt-0.5 tracking-tight">Profile</span>
        </button>
      </nav>
    </div>
  );
};
