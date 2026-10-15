import React, { useState } from 'react';
import { Sparkles, Shield, AlertTriangle, CheckCircle2, MessageCircle, Calendar, Flag, Ban, X, HeartHandshake, Lock } from 'lucide-react';
import { UserProfile, MeetupRequest } from '../types';
import { CloverIcon } from './CloverLogo';

interface VIPScreenProps {
  vipCreators: UserProfile[];
  userBalance: number;
  isVipSubscriber: boolean;
  onOpenChat: (creator: UserProfile) => void;
  onNavigateToWallet: () => void;
  onDeductCoins: (amount: number, reason: string) => boolean;
  onSubscribe: () => void;
}

export const VIPScreen: React.FC<VIPScreenProps> = ({
  vipCreators,
  userBalance,
  isVipSubscriber,
  onOpenChat,
  onNavigateToWallet,
  onDeductCoins,
  onSubscribe
}) => {
  const [selectedCreatorForMeetup, setSelectedCreatorForMeetup] = useState<UserProfile | null>(null);
  const [selectedCreatorToReport, setSelectedCreatorToReport] = useState<UserProfile | null>(null);
  const [reportReason, setReportReason] = useState<string>('inappropriate');
  const [reportSubmitted, setReportSubmitted] = useState<boolean>(false);
  const [blockedUserIds, setBlockedUserIds] = useState<string[]>([]);

  // Meetup Request Form State
  const [meetupDate, setMeetupDate] = useState('2026-10-18');
  const [meetupTime, setMeetupTime] = useState('19:30');
  const [publicVenue, setPublicVenue] = useState('The Silo Rooftop, V&A Waterfront, Cape Town');
  const [meetupPurpose, setMeetupPurpose] = useState('Dinner Date & Cultural Conversation');
  const [consentedCode, setConsentedCode] = useState(false);
  const [meetupSuccess, setMeetupSuccess] = useState(false);

  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleStartMeetupRequest = (creator: UserProfile) => {
    setSelectedCreatorForMeetup(creator);
    setMeetupSuccess(false);
    setConsentedCode(false);
  };

  const handleSubmitMeetupRequest = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorForMeetup) return;

    if (!consentedCode) {
      showToast('You must accept the consensual adult code of conduct');
      return;
    }

    const escrowCoins = 150;
    if (userBalance < escrowCoins) {
      showToast(`Need ${escrowCoins} coins in escrow for booking. Top up in Wallet!`);
      return;
    }

    const success = onDeductCoins(escrowCoins, `Escrow Deposit: Meetup request with ${selectedCreatorForMeetup.name}`);
    if (success) {
      setMeetupSuccess(true);
      showToast('Meetup request submitted to creator!');
    }
  };

  const handleBlockReport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCreatorToReport) return;

    setBlockedUserIds((prev) => [...prev, selectedCreatorToReport.id]);
    setReportSubmitted(true);
    showToast(`${selectedCreatorToReport.name} has been reported and blocked`);
    setTimeout(() => {
      setSelectedCreatorToReport(null);
      setReportSubmitted(false);
    }, 1500);
  };

  const activeCreators = vipCreators.filter(c => !blockedUserIds.includes(c.id));

  return (
    <div className="w-full max-w-[430px] mx-auto px-4 pb-24 pt-2">
      {/* Toast message */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Header */}
      <div className="flex items-center justify-between py-2 border-b border-white/20">
        <div className="flex items-center gap-2">
          <CloverIcon size={24} />
          <div>
            <h1 className="font-serif-mzansi text-xl font-extrabold text-white tracking-tight drop-shadow-sm flex items-center gap-1.5">
              <span>Mzansi VIP Creators</span>
              <span className="text-[10px] bg-[#C5A253] text-white px-2 py-0.5 rounded-full font-bold">18+</span>
            </h1>
            <span className="text-[10px] text-white/90">Premium private connections & public meetups</span>
          </div>
        </div>

        <button
          type="button"
          onClick={onNavigateToWallet}
          className="bg-white/20 backdrop-blur-xs text-white px-3 py-1.5 rounded-xl text-xs font-semibold hover:bg-white/30 transition-all flex items-center gap-1.5 cursor-pointer"
        >
          <CloverIcon size={14} />
          <span>{userBalance} Coins</span>
        </button>
      </div>

      {/* MANDATORY LEGAL & CONSENT SAFETY DISCLAIMER */}
      <div className="my-3 p-3.5 bg-purple-950/80 backdrop-blur-md rounded-2xl border border-purple-400/40 text-white text-xs space-y-2 shadow-lg">
        <div className="flex items-center gap-2 text-amber-300 font-bold text-xs uppercase tracking-wider">
          <Shield size={16} />
          <span>Mandatory Safety & Consent Standard</span>
        </div>
        <p className="text-[11px] text-purple-100 leading-relaxed">
          Mzansi Dating strictly prohibits escort solicitation, prostitution, or unverified exchanges. VIP Creators are <strong>18+ identity-verified adults</strong> offering curated social experiences, professional advisory, and cultural companionship.
        </p>
        <div className="grid grid-cols-2 gap-2 pt-1 text-[10px] text-purple-200">
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
            <span>100% Consensual & Mutual</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
            <span>Public Venues Only</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
            <span>Govt ID Verified</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 size={12} className="text-emerald-400 shrink-0" />
            <span>Active Moderation & Police Escalation</span>
          </div>
        </div>
      </div>

      {/* VIP Subscription Card */}
      <div className="mb-4 p-4 bg-gradient-to-r from-amber-500 via-[#C5A253] to-amber-600 rounded-3xl text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-4 -translate-y-4 opacity-20 pointer-events-none">
          <CloverIcon size={120} />
        </div>

        <div className="relative z-10">
          <div className="flex justify-between items-start">
            <div>
              <span className="text-[10px] bg-black/30 backdrop-blur-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider">
                All-Access Pass
              </span>
              <h3 className="font-serif-mzansi text-xl font-extrabold mt-1">
                Mzansi VIP Club
              </h3>
            </div>
            <div className="text-right">
              <span className="text-2xl font-extrabold">R149</span>
              <span className="text-xs opacity-90 block">/ month</span>
            </div>
          </div>

          <p className="text-xs text-white/95 mt-2 leading-relaxed">
            Unlock unlimited direct messages, priority replies, 0-coin chat deductions, and exclusive meetup reservation rights.
          </p>

          <button
            type="button"
            onClick={onSubscribe}
            className={`mt-3 w-full py-2.5 rounded-xl font-bold text-xs shadow-md transition-all cursor-pointer ${
              isVipSubscriber
                ? 'bg-emerald-700 text-white cursor-default'
                : 'bg-white text-slate-900 hover:bg-slate-50'
            }`}
          >
            {isVipSubscriber ? '✓ VIP Pass Active (Renews 14 Nov)' : 'Unlock Unlimited VIP for R149/mo'}
          </button>
        </div>
      </div>

      {/* VIP Creators Feed Header */}
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-serif-mzansi text-base font-bold text-white drop-shadow-sm">
          Verified 18+ Creators
        </h2>
        <span className="text-xs text-white/80 font-medium">
          {activeCreators.length} Verified Available
        </span>
      </div>

      {/* Creator Cards */}
      <div className="space-y-3.5">
        {activeCreators.map((creator) => (
          <div
            key={creator.id}
            className="bg-white rounded-[24px] p-4 shadow-md border border-white/80 space-y-3"
          >
            {/* Header: Photo, Name, Rate & Report Button */}
            <div className="flex items-start gap-3">
              <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
                <img
                  src={creator.avatar}
                  alt={creator.name}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <span className="absolute bottom-1 right-1 w-3 h-3 rounded-full bg-emerald-500 border-2 border-white"></span>
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start">
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-serif-mzansi font-bold text-sm text-slate-900 truncate">
                        {creator.name}, {creator.age}
                      </span>
                      <span className="bg-purple-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded-full">
                        Purple Verified
                      </span>
                    </div>
                    <span className="text-[11px] text-[#9E7728] font-semibold block mt-0.5">
                      {creator.vipCategory || 'Lifestyle & Cultural Host'}
                    </span>
                    <span className="text-[10px] text-slate-500">{creator.location}</span>
                  </div>

                  {/* Report / Block Trigger */}
                  <button
                    type="button"
                    onClick={() => setSelectedCreatorToReport(creator)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer"
                    title="Report or Block"
                  >
                    <Flag size={14} />
                  </button>
                </div>
              </div>
            </div>

            {/* VIP Bio */}
            <p className="text-xs text-slate-600 leading-relaxed bg-slate-50 p-2.5 rounded-xl border border-slate-100">
              "{creator.vipBio || creator.bio}"
            </p>

            {/* Rate & Action Buttons */}
            <div className="flex items-center justify-between pt-1 border-t border-slate-100 text-xs">
              <div className="flex items-center gap-1">
                <span className="text-slate-500 text-[11px]">Private Chat:</span>
                <span className="font-bold text-[#9E7728]">
                  {creator.vipCoinRate || 30} Coins / session
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => onOpenChat(creator)}
                  className="px-3 py-1.5 bg-purple-50 text-purple-700 hover:bg-purple-100 rounded-xl font-semibold text-xs flex items-center gap-1 transition-colors cursor-pointer"
                >
                  <MessageCircle size={14} />
                  <span>Chat</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleStartMeetupRequest(creator)}
                  className="px-3.5 py-1.5 bg-gold-gradient text-white rounded-xl font-semibold text-xs shadow-xs hover:shadow transition-all flex items-center gap-1 cursor-pointer"
                >
                  <Calendar size={14} />
                  <span>Meetup Request</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* MEETUP REQUEST MODAL */}
      {selectedCreatorForMeetup && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-5 max-h-[85vh] overflow-y-auto shadow-2xl relative space-y-3.5">
            <button
              type="button"
              onClick={() => setSelectedCreatorForMeetup(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2">
              <CloverIcon size={22} />
              <h3 className="font-serif-mzansi text-lg font-bold text-slate-900">
                Book Consensual Meetup
              </h3>
            </div>

            {meetupSuccess ? (
              <div className="text-center py-4 space-y-3">
                <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 size={28} />
                </div>
                <h4 className="font-serif-mzansi text-base font-bold text-slate-900">
                  Request Sent to {selectedCreatorForMeetup.name}
                </h4>
                <p className="text-xs text-slate-600">
                  150 coins held in secure escrow. Once {selectedCreatorForMeetup.name} confirms, venue details and arrival codes will be shared in your encrypted chat.
                </p>
                <button
                  type="button"
                  onClick={() => setSelectedCreatorForMeetup(null)}
                  className="w-full py-2.5 bg-gold-gradient text-white rounded-xl text-xs font-semibold"
                >
                  Close & View Chat
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitMeetupRequest} className="space-y-3 text-xs">
                <div className="p-2.5 bg-purple-50 rounded-xl border border-purple-100 flex items-center gap-2">
                  <img
                    src={selectedCreatorForMeetup.avatar}
                    alt={selectedCreatorForMeetup.name}
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <span className="font-bold text-slate-900 block">
                      {selectedCreatorForMeetup.name}
                    </span>
                    <span className="text-[10px] text-purple-700">
                      Escrow Deposit: 150 Coins (Refundable if declined)
                    </span>
                  </div>
                </div>

                {/* Public Venue Selector */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Licensed Public Venue (Safety Rule)
                  </label>
                  <select
                    value={publicVenue}
                    onChange={(e) => setPublicVenue(e.target.value)}
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                  >
                    <option value="The Silo Rooftop, V&A Waterfront, Cape Town">
                      🍷 The Silo Rooftop (Cape Town)
                    </option>
                    <option value="Saint Restaurant, Sandton, Johannesburg">
                      🍽️ Saint Restaurant (Sandton JHB)
                    </option>
                    <option value="The Oyster Box Grill Room, Umhlanga, Durban">
                      🌊 The Oyster Box (Umhlanga KZN)
                    </option>
                    <option value="Marble Restaurant, Rosebank, Johannesburg">
                      🥩 Marble (Rosebank JHB)
                    </option>
                  </select>
                </div>

                {/* Date & Time */}
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Preferred Date
                    </label>
                    <input
                      type="date"
                      value={meetupDate}
                      onChange={(e) => setMeetupDate(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                      Preferred Time
                    </label>
                    <input
                      type="time"
                      value={meetupTime}
                      onChange={(e) => setMeetupTime(e.target.value)}
                      className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                    />
                  </div>
                </div>

                {/* Purpose */}
                <div>
                  <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                    Occasion / Purpose
                  </label>
                  <input
                    type="text"
                    value={meetupPurpose}
                    onChange={(e) => setMeetupPurpose(e.target.value)}
                    placeholder="e.g. Birthday celebration, Fine dining & wine"
                    className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                  />
                </div>

                {/* Mandatory Consent Checkbox */}
                <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl">
                  <label className="flex items-start gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={consentedCode}
                      onChange={(e) => setConsentedCode(e.target.checked)}
                      className="w-4 h-4 mt-0.5 rounded text-[#C5A253] border-slate-300 accent-[#C5A253]"
                    />
                    <span className="text-[11px] text-amber-900 leading-tight">
                      <strong>Consensual Adult Agreement:</strong> I acknowledge that all interactions must remain purely consensual between consenting adults (18+), in a public setting with zero forced expectations.
                    </span>
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 bg-gold-gradient text-white rounded-xl font-bold text-xs shadow-md hover:shadow cursor-pointer"
                >
                  Confirm Escrow & Send Request (150 Coins)
                </button>
              </form>
            )}
          </div>
        </div>
      )}

      {/* REPORT & BLOCK MODAL */}
      {selectedCreatorToReport && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-5 shadow-2xl relative space-y-3">
            <button
              type="button"
              onClick={() => setSelectedCreatorToReport(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-rose-600 font-bold">
              <AlertTriangle size={20} />
              <h3 className="font-serif-mzansi text-base font-bold text-slate-900">
                Report & Block {selectedCreatorToReport.name}
              </h3>
            </div>

            <p className="text-xs text-slate-600">
              Mzansi Dating takes community integrity seriously. Our safety team reviews all flagged profiles within 10 minutes.
            </p>

            <form onSubmit={handleBlockReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Reason for Reporting
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs text-slate-800"
                >
                  <option value="inappropriate">Inappropriate Messages or Photos</option>
                  <option value="solicitation">Unsolicited Commercial Exploitation</option>
                  <option value="fake">Fake Profile or Impersonation</option>
                  <option value="harassment">Harassment or Non-consensual Behaviour</option>
                </select>
              </div>

              <div className="p-2.5 bg-rose-50 text-rose-800 rounded-xl text-[11px]">
                Blocking will immediately hide their profile and revoke chat permissions.
              </div>

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedCreatorToReport(null)}
                  className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold"
                >
                  Block & Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
