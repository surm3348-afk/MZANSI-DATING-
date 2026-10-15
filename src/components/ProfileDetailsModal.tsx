import React from 'react';
import { X, CheckCircle2, MapPin, Heart, MessageCircle, Sparkles, ShieldCheck } from 'lucide-react';
import { UserProfile } from '../types';
import { CloverIcon } from './CloverLogo';

interface ProfileDetailsModalProps {
  profile: UserProfile | null;
  onClose: () => void;
  onLike: (profile: UserProfile) => void;
  onSuperLike: (profile: UserProfile) => void;
  onOpenChat: (profile: UserProfile) => void;
}

export const ProfileDetailsModal: React.FC<ProfileDetailsModalProps> = ({
  profile,
  onClose,
  onLike,
  onSuperLike,
  onOpenChat
}) => {
  if (!profile) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-3 md:p-4">
      <div className="bg-white rounded-[28px] max-w-[420px] w-full max-h-[90vh] overflow-y-auto shadow-2xl relative border border-white/80 animate-in zoom-in-95 duration-200">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full bg-black/40 backdrop-blur-xs text-white flex items-center justify-center hover:bg-black/60 transition-colors cursor-pointer"
        >
          <X size={18} />
        </button>

        {/* Hero Photo with Scrim */}
        <div className="relative h-80 w-full bg-slate-100">
          <img
            src={profile.avatar}
            alt={profile.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>

          {/* Info on Scrim */}
          <div className="absolute bottom-4 inset-x-4 text-white">
            <div className="flex items-center gap-2">
              <h2 className="font-serif-mzansi text-2xl font-extrabold">
                {profile.name}, {profile.age}
              </h2>
              <span className="text-xl">{profile.flag}</span>
              {profile.verification === 'purple' ? (
                <span className="bg-purple-600 text-white p-1 rounded-full text-xs">
                  <CheckCircle2 size={14} />
                </span>
              ) : (
                <span className="bg-blue-500 text-white p-1 rounded-full text-xs">
                  <CheckCircle2 size={14} />
                </span>
              )}
            </div>
            <div className="text-xs text-white/90 flex items-center gap-1.5 mt-1">
              <MapPin size={13} className="text-[#C5A253]" />
              <span>{profile.location}</span>
              <span>·</span>
              <span>{profile.occupation}</span>
            </div>
          </div>
        </div>

        {/* Body Content */}
        <div className="p-5 space-y-4 text-xs">
          {/* Trust Badge Explanation */}
          <div className="p-3 bg-purple-50/70 rounded-2xl border border-purple-100 flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-full bg-purple-600 text-white flex items-center justify-center shrink-0">
              <ShieldCheck size={16} />
            </div>
            <div>
              <span className="font-bold text-slate-800 block text-xs">
                {profile.verification === 'purple' ? 'Purple Verified Identity' : 'Blue Verified Email'}
              </span>
              <span className="text-[10px] text-slate-500">
                {profile.verification === 'purple'
                  ? 'Matched with South African Photo ID & 3D biometric selfie.'
                  : 'Authenticated email and phone number.'}
              </span>
            </div>
          </div>

          {/* Bio */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1">
              About {profile.name}
            </h4>
            <p className="text-slate-700 leading-relaxed text-xs">
              {profile.bio}
            </p>
          </div>

          {/* VIP Creator Info if applicable */}
          {profile.isVipCreator && (
            <div className="p-3 bg-gradient-to-r from-amber-50 to-pink-50 rounded-2xl border border-amber-200 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-900 flex items-center gap-1">
                  <Sparkles size={14} className="text-[#C5A253]" />
                  <span>18+ VIP Creator Host</span>
                </span>
                <span className="font-extrabold text-[#9E7728] text-xs">
                  {profile.vipCoinRate} Coins / Chat
                </span>
              </div>
              <p className="text-[11px] text-slate-600 leading-tight">
                {profile.vipBio}
              </p>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Languages</span>
              <span className="font-semibold text-slate-800">{profile.languages.join(', ')}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Star Sign</span>
              <span className="font-semibold text-slate-800">{profile.starSign || 'Leo ♌'}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Height</span>
              <span className="font-semibold text-slate-800">{profile.height || '1.70m'}</span>
            </div>
            <div className="p-2.5 bg-slate-50 rounded-xl">
              <span className="text-slate-400 block text-[10px]">Looking For</span>
              <span className="font-semibold text-slate-800 capitalize">{profile.lookingFor}</span>
            </div>
          </div>

          {/* Interests */}
          <div>
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px] mb-1.5">
              Passions & Interests
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {profile.interests.map((tag) => (
                <span
                  key={tag}
                  className="px-2.5 py-1 bg-purple-50 text-purple-900 rounded-lg text-[11px] font-medium"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Row */}
          <div className="pt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                onOpenChat(profile);
                onClose();
              }}
              className="flex-1 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-xs flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
            >
              <MessageCircle size={15} />
              <span>Send Message</span>
            </button>

            <button
              type="button"
              onClick={() => {
                onSuperLike(profile);
                onClose();
              }}
              className="p-3 bg-amber-50 hover:bg-amber-100 text-[#C5A253] border border-amber-300 rounded-xl flex items-center justify-center cursor-pointer shadow-xs"
              title="Golden Clover Super Like"
            >
              <CloverIcon size={20} />
            </button>

            <button
              type="button"
              onClick={() => {
                onLike(profile);
                onClose();
              }}
              className="p-3 bg-rose-50 hover:bg-rose-100 text-rose-500 rounded-xl flex items-center justify-center cursor-pointer shadow-xs"
              title="Like Profile"
            >
              <Heart size={20} fill="#F43F5E" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
