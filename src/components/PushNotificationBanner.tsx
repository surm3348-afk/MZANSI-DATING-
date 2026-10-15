import React, { useEffect } from 'react';
import { MessageCircle, Heart, Sparkles, X, ChevronRight, Bell } from 'lucide-react';
import { PushNotificationPayload } from '../firebase';
import { CloverIcon } from './CloverLogo';

interface PushNotificationBannerProps {
  notification: PushNotificationPayload | null;
  onDismiss: () => void;
  onActionClick: (notification: PushNotificationPayload) => void;
}

export const PushNotificationBanner: React.FC<PushNotificationBannerProps> = ({
  notification,
  onDismiss,
  onActionClick,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  return (
    <div className="fixed top-3 inset-x-3 z-50 max-w-[400px] mx-auto pointer-events-auto animate-in slide-in-from-top-4 duration-300">
      <div
        onClick={() => onActionClick(notification)}
        className="bg-white/95 backdrop-blur-md rounded-[24px] p-3 shadow-2xl shadow-purple-950/20 border border-white/80 cursor-pointer hover:shadow-purple-900/25 transition-all group"
      >
        <div className="flex items-start gap-3">
          {/* Avatar with type badge */}
          <div className="relative shrink-0">
            <div className="w-11 h-11 rounded-full overflow-hidden border border-[#C5A253]/40 bg-slate-100">
              <img
                src={notification.senderAvatar}
                alt={notification.senderName}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
            </div>
            {/* Category Icon Badge */}
            <span
              className={`absolute -bottom-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-white text-[10px] shadow-xs ${
                notification.type === 'like' || notification.type === 'superlike'
                  ? 'bg-rose-500'
                  : notification.type === 'vip_request'
                  ? 'bg-gold-gradient'
                  : 'bg-purple-600'
              }`}
            >
              {notification.type === 'like' && <Heart size={10} fill="#FFF" />}
              {notification.type === 'superlike' && <CloverIcon size={11} />}
              {notification.type === 'message' && <MessageCircle size={10} />}
              {notification.type === 'vip_request' && <Sparkles size={10} />}
            </span>
          </div>

          {/* Text Content */}
          <div className="flex-1 min-w-0 pr-1">
            <div className="flex items-center justify-between">
              <span className="font-serif-mzansi font-bold text-xs text-slate-900 truncate">
                {notification.title}
              </span>
              <span className="text-[9px] text-slate-400 shrink-0">Just now</span>
            </div>

            <p className="text-[11px] text-slate-600 line-clamp-2 mt-0.5 leading-snug">
              {notification.body}
            </p>

            {/* Quick Action Hint */}
            <div className="mt-1 flex items-center gap-1 text-[10px] text-[#9E7728] font-semibold">
              <span>{notification.type === 'message' ? 'Tap to open chat' : 'Tap to view match'}</span>
              <ChevronRight size={12} className="group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>

          {/* Dismiss button */}
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-full hover:bg-slate-100 shrink-0"
            aria-label="Dismiss"
          >
            <X size={15} />
          </button>
        </div>
      </div>
    </div>
  );
};
