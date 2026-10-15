import React, { useRef, useState, useEffect } from 'react';
import { Heart, CheckCircle2, MapPin, Video, Volume2, VolumeX } from 'lucide-react';
import { UserProfile } from '../types';

interface DiscoverProfileCardProps {
  profile: UserProfile;
  isLiked: boolean;
  onSelectProfileDetails: (profile: UserProfile) => void;
  onLikeClick: (e: React.MouseEvent, profile: UserProfile) => void;
}

export const DiscoverProfileCard: React.FC<DiscoverProfileCardProps> = ({
  profile,
  isLiked,
  onSelectProfileDetails,
  onLikeClick,
}) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isMuted, setIsMuted] = useState<boolean>(true);
  const [videoProgress, setVideoProgress] = useState<number>(0);
  const [videoError, setVideoError] = useState<boolean>(false);

  // Check if profile is a verified user with video snippet capability
  const isVerified = profile.verification === 'purple' || profile.verification === 'blue';
  const hasVideoSnippet = isVerified && Boolean(profile.videoSnippetUrl || profile.hasVideoIntro) && !videoError;

  // Resolve video URL: user's snippet URL or high quality fallback snippet
  const videoSrc = profile.videoSnippetUrl || (
    profile.verification === 'purple'
      ? 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-at-the-camera-39906-large.mp4'
      : undefined
  );

  // Initialize and autoplay video when snippet is enabled
  useEffect(() => {
    const video = videoRef.current;
    if (!video || !hasVideoSnippet || !videoSrc) return;

    video.muted = true;
    const playPromise = video.play();
    if (playPromise !== undefined) {
      playPromise
        .then(() => setIsPlaying(true))
        .catch(() => {
          // In case of autoplay policy restriction, keep poster photo visible
          setIsPlaying(false);
        });
    }

    return () => {
      if (video) {
        video.pause();
      }
    };
  }, [hasVideoSnippet, videoSrc]);

  // Handle 5-second snippet loop and progress
  const handleTimeUpdate = () => {
    const video = videoRef.current;
    if (!video) return;

    const currentTime = video.currentTime;
    // Exactly 5-second snippet restriction
    if (currentTime >= 5.0) {
      video.currentTime = 0;
      video.play().catch(() => {});
      setVideoProgress(0);
    } else {
      setVideoProgress((currentTime / 5.0) * 100);
    }
  };

  // Toggle audio without triggering card details navigation
  const handleToggleAudio = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (videoRef.current) {
      const nextMuted = !videoRef.current.muted;
      videoRef.current.muted = nextMuted;
      setIsMuted(nextMuted);
    }
  };

  const handleLikeWithHaptic = (e: React.MouseEvent) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(25);
      } catch {
        // ignore
      }
    }
    onLikeClick(e, profile);
  };

  return (
    <div
      onClick={() => onSelectProfileDetails(profile)}
      className="group relative bg-white rounded-[20px] overflow-hidden shadow-md shadow-purple-950/10 border border-white/80 cursor-pointer transition-all duration-300 hover:shadow-xl hover:-translate-y-0.5 flex flex-col"
    >
      {/* Photo/Video Card with Rounded 20px & strict h-64 */}
      <div className="relative h-64 w-full bg-slate-900 overflow-hidden">
        {/* Underlay Image / Poster fallback */}
        <img
          src={profile.avatar}
          alt={profile.name}
          referrerPolicy="no-referrer"
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-500 ${
            hasVideoSnippet && isPlaying ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
          }`}
        />

        {/* 5-second Auto-Playing Video Snippet for Verified Users */}
        {hasVideoSnippet && videoSrc && (
          <video
            ref={videoRef}
            src={videoSrc}
            poster={profile.avatar}
            autoPlay
            muted={isMuted}
            playsInline
            onTimeUpdate={handleTimeUpdate}
            onPlaying={() => setIsPlaying(true)}
            onError={() => {
              setVideoError(true);
              setIsPlaying(false);
            }}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        )}

        {/* 5-second Video Progress Bar at top edge */}
        {hasVideoSnippet && isPlaying && (
          <div className="absolute top-0 inset-x-0 h-1 bg-black/40 z-20 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C5A253] via-[#E6CA65] to-[#B78E3E] transition-all duration-100 ease-linear shadow-xs"
              style={{ width: `${Math.min(100, Math.max(0, videoProgress))}%` }}
            />
          </div>
        )}

        {/* Online indicator top left */}
        {profile.isOnline && (
          <div className="absolute top-2.5 left-2.5 z-20 bg-black/45 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/10 shadow-xs">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Online</span>
          </div>
        )}

        {/* 5s Video Snippet Badge + Audio Toggle top right */}
        {hasVideoSnippet && (
          <div className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1">
            <div
              className="bg-black/60 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1 border border-white/20 shadow-xs"
              title="Verified 5-Second Video Snippet"
            >
              <Video size={10} className="text-[#C5A253]" />
              <span className="font-mono">5s</span>
            </div>

            {isPlaying && (
              <button
                type="button"
                onClick={handleToggleAudio}
                className="w-5 h-5 rounded-full bg-black/60 backdrop-blur-xs text-white/90 hover:text-white flex items-center justify-center border border-white/20 shadow-xs cursor-pointer transition-transform hover:scale-110 active:scale-95"
                title={isMuted ? 'Unmute video audio' : 'Mute video audio'}
                aria-label={isMuted ? 'Unmute snippet' : 'Mute snippet'}
              >
                {isMuted ? <VolumeX size={10} /> : <Volume2 size={10} className="text-[#C5A253]" />}
              </button>
            )}
          </div>
        )}

        {/* Bottom Gradient (Black to Transparent) */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent pointer-events-none z-10" />

        {/* Profile info: Name, Age, Location flag, Badge & Like Button */}
        <div className="absolute bottom-2.5 inset-x-2.5 text-white flex flex-col justify-end z-20">
          {/* Name & Age white bold */}
          <div className="font-serif-mzansi text-base font-extrabold leading-tight drop-shadow-sm truncate">
            {profile.name}, {profile.age}
          </div>

          {/* Location with flag icon: e.g. "Mbombela 🇿🇦" */}
          <div className="flex items-center gap-1 text-[11px] text-white/90 mt-0.5 truncate drop-shadow-xs font-medium">
            <MapPin size={11} className="text-[#C5A253] shrink-0" />
            <span className="truncate">{profile.location}</span>
            <span className="text-xs">{profile.flag}</span>
          </div>

          {/* Badge & Like Button Row */}
          <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/15">
            {/* Badge: "Purple Verified" small gold pill */}
            {profile.verification === 'purple' ? (
              <span className="bg-gradient-to-r from-[#C5A253] to-[#B78E3E] text-white text-[9px] font-bold px-2 py-0.5 rounded-full shadow-xs flex items-center gap-1">
                <CheckCircle2 size={10} strokeWidth={3} />
                <span>Purple Verified</span>
              </span>
            ) : (
              <span className="bg-white/30 backdrop-blur-xs text-white text-[9px] font-semibold px-2 py-0.5 rounded-full flex items-center gap-1">
                <CheckCircle2 size={10} />
                <span>Verified</span>
              </span>
            )}

            {/* Like button gold heart bottom right */}
            <button
              type="button"
              onClick={handleLikeWithHaptic}
              className={`w-8 h-8 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isLiked
                  ? 'bg-rose-500 text-white scale-110 shadow-rose-500/40'
                  : 'bg-white/90 backdrop-blur-xs text-[#C5A253] hover:bg-white hover:scale-105 active:scale-95 shadow-black/20'
              }`}
              title="Like Profile"
              aria-label="Like profile"
            >
              <Heart
                size={15}
                fill={isLiked ? '#FFFFFF' : '#C5A253'}
                strokeWidth={isLiked ? 2 : 1.5}
              />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
