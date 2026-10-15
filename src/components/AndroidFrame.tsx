import React, { useState } from 'react';
import { Wifi, Battery, Signal, Smartphone, Maximize2, Download, Bell, MessageCircle, Heart } from 'lucide-react';
import { CloverIcon } from './CloverLogo';

interface AndroidFrameProps {
  children: React.ReactNode;
  isPhoneFrame: boolean;
  onTogglePhoneFrame: () => void;
  onOpenApkModal: () => void;
  onTestPush?: (type: 'message' | 'like') => void;
}

export const AndroidFrame: React.FC<AndroidFrameProps> = ({
  children,
  isPhoneFrame,
  onTogglePhoneFrame,
  onOpenApkModal,
  onTestPush
}) => {
  const [showPushMenu, setShowPushMenu] = useState(false);

  return (
    <div className="min-h-screen flex flex-col items-center justify-start py-2 sm:py-6 relative z-10">
      {/* Desktop Top Control Bar */}
      <header className="w-full max-w-4xl px-4 py-2 mb-3 flex items-center justify-between gap-4 text-xs">
        {/* Brand Zone */}
        <div className="flex items-center gap-2">
          <CloverIcon size={26} />
          <span className="font-serif-mzansi text-lg font-bold text-white drop-shadow-md">
            Mzansi Dating
          </span>
          <span className="hidden sm:inline-block text-[10px] bg-white/20 backdrop-blur-xs text-white px-2 py-0.5 rounded-full font-medium">
            FCM Real-Time Enabled
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {/* FCM Push Notification Simulator Trigger */}
          {onTestPush && (
            <div className="relative">
              <button
                type="button"
                onClick={() => setShowPushMenu(!showPushMenu)}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-700/80 hover:bg-purple-700 text-white font-semibold rounded-xl shadow-md transition-all cursor-pointer text-xs"
                title="Test real-time FCM push notification"
              >
                <Bell size={13} className="animate-bounce" />
                <span className="hidden sm:inline whitespace-nowrap">Test Push (FCM)</span>
              </button>

              {showPushMenu && (
                <div className="absolute right-0 top-9 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-2 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                  <div className="text-[10px] font-bold text-slate-400 uppercase px-2 py-1">
                    Trigger FCM Event
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPushMenu(false);
                      onTestPush('message');
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-purple-50 rounded-xl text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <MessageCircle size={14} className="text-purple-600" />
                    <span>New Message Push</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowPushMenu(false);
                      onTestPush('like');
                    }}
                    className="w-full text-left px-2.5 py-1.5 hover:bg-rose-50 rounded-xl text-slate-700 flex items-center gap-2 cursor-pointer"
                  >
                    <Heart size={14} className="text-rose-500" />
                    <span>New Like Match Push</span>
                  </button>
                </div>
              )}
            </div>
          )}

          {/* APK Export Modal Trigger */}
          <button
            type="button"
            onClick={onOpenApkModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-gold-gradient text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all cursor-pointer text-xs"
          >
            <Download size={14} />
            <span className="whitespace-nowrap">Export APK</span>
          </button>

          {/* Toggle Phone Frame / Full Responsive */}
          <button
            type="button"
            onClick={onTogglePhoneFrame}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white/25 hover:bg-white/35 text-white font-medium rounded-xl backdrop-blur-xs transition-colors cursor-pointer text-xs"
            title={isPhoneFrame ? 'Switch to Full Screen View' : 'Switch to Android Phone Mockup'}
          >
            {isPhoneFrame ? (
              <>
                <Maximize2 size={13} />
                <span className="hidden md:inline whitespace-nowrap">Full Responsive</span>
              </>
            ) : (
              <>
                <Smartphone size={13} />
                <span className="hidden md:inline whitespace-nowrap">Android Mockup</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* App Container (Phone Bezel vs Clean Container) */}
      <div
        className={`w-full transition-all duration-300 ${
          isPhoneFrame
            ? 'max-w-[420px] rounded-[44px] border-[10px] border-slate-900/90 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.4)] overflow-hidden bg-gradient-to-br from-[#E9D5FF] via-[#FBCFE8] to-[#E8C4FF] relative min-h-[840px] flex flex-col justify-between'
            : 'max-w-2xl px-2'
        }`}
      >
        {/* Android Status Bar */}
        {isPhoneFrame && (
          <div className="h-7 bg-transparent px-6 flex items-center justify-between text-[11px] text-white/90 font-medium select-none z-30 pt-1">
            <span>11:31</span>

            {/* Camera Punch Hole */}
            <div className="w-3.5 h-3.5 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-950"></div>
            </div>

            <div className="flex items-center gap-1.5 text-white/90">
              <Signal size={12} />
              <Wifi size={12} />
              <Battery size={13} />
            </div>
          </div>
        )}

        {/* Inner Content Slot */}
        <div className="flex-1 w-full flex flex-col">{children}</div>

        {/* Android Gesture Bar */}
        {isPhoneFrame && (
          <div className="h-5 w-full flex items-center justify-center pointer-events-none pb-1 z-30">
            <div className="w-32 h-1 bg-white/40 rounded-full"></div>
          </div>
        )}
      </div>
    </div>
  );
};
