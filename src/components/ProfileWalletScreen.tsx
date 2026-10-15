import React, { useState } from 'react';
import { 
  Coins, 
  CreditCard, 
  ShieldCheck, 
  Settings, 
  LogOut, 
  Trash2, 
  Edit3, 
  CheckCircle2, 
  Clock, 
  ChevronRight, 
  Sparkles, 
  X, 
  MapPin, 
  Bell, 
  Lock, 
  AlertTriangle 
} from 'lucide-react';
import { UserProfile, CoinPackage, Transaction, VerificationType } from '../types';
import { COIN_PACKAGES, INITIAL_TRANSACTIONS } from '../data/mockData';
import { CloverIcon } from './CloverLogo';

interface ProfileWalletScreenProps {
  user: UserProfile;
  userBalance: number;
  isVipSubscriber: boolean;
  onAddCoins: (coins: number, priceZAR: number) => void;
  onUpdateProfile: (updated: Partial<UserProfile>) => void;
  onNavigateToVerification: () => void;
  onLogout: () => void;
  onDeleteAccount: () => void;
  onSubscribe: () => void;
}

export const ProfileWalletScreen: React.FC<ProfileWalletScreenProps> = ({
  user,
  userBalance,
  isVipSubscriber,
  onAddCoins,
  onUpdateProfile,
  onNavigateToVerification,
  onLogout,
  onDeleteAccount,
  onSubscribe
}) => {
  const [activeTab, setActiveTab] = useState<'wallet' | 'profile' | 'settings'>('wallet');
  const [showBuyCoinsModal, setShowBuyCoinsModal] = useState(false);
  const [showEditProfileModal, setShowEditProfileModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);

  // Edit profile form state
  const [editName, setEditName] = useState(user.name);
  const [editBio, setEditBio] = useState(user.bio);
  const [editOccupation, setEditOccupation] = useState(user.occupation);
  const [editLocation, setEditLocation] = useState(user.location);
  const [editInterests, setEditInterests] = useState(user.interests.join(', '));

  // Transactions state
  const [transactions, setTransactions] = useState<Transaction[]>(INITIAL_TRANSACTIONS);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handlePurchasePackage = (pkg: CoinPackage) => {
    const bonus = pkg.bonus || 0;
    const totalCoins = pkg.coins + bonus;
    onAddCoins(totalCoins, pkg.priceZAR);

    const newTx: Transaction = {
      id: `tx_${Date.now()}`,
      type: 'deposit',
      title: `Top Up: ${pkg.coins} Coins (${pkg.priceZAR} ZAR)`,
      amountCoins: totalCoins,
      amountZAR: pkg.priceZAR,
      date: 'Just now',
      status: 'completed'
    };

    setTransactions((prev) => [newTx, ...prev]);
    setShowBuyCoinsModal(false);
    showToast(`Added ${totalCoins} Gold Coins to your Mzansi wallet! ✨`);
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile({
      name: editName,
      bio: editBio,
      occupation: editOccupation,
      location: editLocation,
      interests: editInterests.split(',').map((s) => s.trim()).filter(Boolean)
    });
    setShowEditProfileModal(false);
    showToast('Profile updated successfully!');
  };

  return (
    <div className="w-full max-w-[430px] mx-auto px-4 pb-24 pt-2">
      {/* Toast */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Top Bar */}
      <div className="flex items-center justify-between py-2 border-b border-white/20">
        <div className="flex items-center gap-2">
          <CloverIcon size={24} />
          <h1 className="font-serif-mzansi text-xl font-bold text-white drop-shadow-sm">
            My Mzansi Hub
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setShowSettingsModal(true)}
          className="p-2 text-white/90 hover:text-white rounded-xl bg-white/20 backdrop-blur-xs transition-colors cursor-pointer"
          aria-label="Settings"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* User Quick Identity Card */}
      <div className="my-3 p-4 bg-white rounded-[24px] shadow-md border border-white/80 flex items-center gap-3.5">
        <div className="relative w-16 h-16 rounded-2xl overflow-hidden shrink-0 bg-slate-100">
          <img
            src={user.avatar}
            alt={user.name}
            referrerPolicy="no-referrer"
            className="w-full h-full object-cover"
          />
          {user.verification === 'purple' ? (
            <span className="absolute bottom-1 right-1 bg-purple-600 text-white rounded-full p-0.5 border border-white">
              <CheckCircle2 size={12} />
            </span>
          ) : (
            <span className="absolute bottom-1 right-1 bg-blue-500 text-white rounded-full p-0.5 border border-white">
              <CheckCircle2 size={12} />
            </span>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-serif-mzansi font-bold text-base text-slate-900 truncate">
              {user.name}, {user.age}
            </span>
            <span>{user.flag}</span>
          </div>
          <div className="text-[11px] text-slate-500 truncate flex items-center gap-1 mt-0.5">
            <MapPin size={11} className="text-[#C5A253]" />
            <span>{user.location}</span>
          </div>

          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowEditProfileModal(true)}
              className="text-[11px] font-semibold text-purple-700 bg-purple-50 hover:bg-purple-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
            >
              <Edit3 size={11} />
              <span>Edit Profile</span>
            </button>

            {user.verification !== 'purple' && (
              <button
                type="button"
                onClick={onNavigateToVerification}
                className="text-[11px] font-semibold text-[#9E7728] bg-amber-50 hover:bg-amber-100 px-2.5 py-1 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck size={11} />
                <span>Get Purple Badge</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Tab Switcher (Wallet vs Profile Details) */}
      <div className="flex p-1 bg-white/40 backdrop-blur-xs rounded-2xl mb-3 text-xs">
        <button
          type="button"
          onClick={() => setActiveTab('wallet')}
          className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'wallet'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          💰 Coins & Wallet
        </button>
        <button
          type="button"
          onClick={() => setActiveTab('profile')}
          className={`flex-1 py-2 rounded-xl font-bold transition-all cursor-pointer ${
            activeTab === 'profile'
              ? 'bg-white text-slate-900 shadow-sm'
              : 'text-slate-700 hover:text-slate-900'
          }`}
        >
          👤 About Me & Photos
        </button>
      </div>

      {/* WALLET TAB */}
      {activeTab === 'wallet' && (
        <div className="space-y-3.5">
          {/* Main Gold Card */}
          <div className="p-5 bg-gold-gradient text-white rounded-[24px] shadow-xl relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-3 -translate-y-3 opacity-20 pointer-events-none">
              <CloverIcon size={130} />
            </div>

            <div className="relative z-10">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider bg-black/20 px-2 py-0.5 rounded-full">
                    Official Mzansi Balance
                  </span>
                  <div className="text-3xl font-extrabold font-serif-mzansi mt-2 flex items-center gap-2">
                    <CloverIcon size={28} />
                    <span>{userBalance}</span>
                    <span className="text-sm font-sans font-normal opacity-90">Coins</span>
                  </div>
                </div>

                <div className="text-right">
                  <span className="text-[11px] opacity-80 block">VIP Status:</span>
                  <span className="text-xs font-bold bg-white/20 px-2.5 py-0.5 rounded-full inline-block mt-0.5">
                    {isVipSubscriber ? 'Active Pass' : 'Standard'}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowBuyCoinsModal(true)}
                  className="py-2.5 bg-white text-slate-900 rounded-xl font-bold text-xs shadow-md hover:bg-slate-50 transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Coins size={14} className="text-[#C5A253]" />
                  <span>Buy Coins</span>
                </button>

                <button
                  type="button"
                  onClick={onSubscribe}
                  className="py-2.5 bg-purple-900/80 hover:bg-purple-900 text-white rounded-xl font-bold text-xs shadow-md transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Sparkles size={14} className="text-amber-300" />
                  <span>VIP Pass (R149)</span>
                </button>
              </div>
            </div>
          </div>

          {/* Quick Coin Packs Preview */}
          <div className="bg-white rounded-[24px] p-4 shadow-sm border border-white/80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="font-serif-mzansi text-sm font-bold text-slate-900">
                Popular Coin Packs
              </h3>
              <span className="text-[10px] text-slate-400">100 Coins = R50</span>
            </div>

            <div className="grid grid-cols-2 gap-2.5">
              {COIN_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => handlePurchasePackage(pkg)}
                  className={`p-3 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    pkg.popular
                      ? 'border-[#C5A253] bg-amber-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-slate-50/50'
                  }`}
                >
                  <div className="flex justify-between items-start">
                    <span className="font-bold text-sm text-slate-900">
                      {pkg.coins} Coins
                    </span>
                    {pkg.bonus && (
                      <span className="text-[9px] bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded font-bold">
                        +{pkg.bonus} Free
                      </span>
                    )}
                  </div>
                  <div className="mt-2 flex justify-between items-center">
                    <span className="text-xs font-extrabold text-[#9E7728]">
                      R{pkg.priceZAR}
                    </span>
                    <span className="text-[10px] text-purple-700 font-semibold underline">
                      Buy →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Transaction History Ledger */}
          <div className="bg-white rounded-[24px] p-4 shadow-sm border border-white/80 space-y-2">
            <div className="flex justify-between items-center pb-1">
              <h3 className="font-serif-mzansi text-sm font-bold text-slate-900 flex items-center gap-1.5">
                <Clock size={15} className="text-slate-400" />
                <span>Transaction History</span>
              </h3>
              <span className="text-[10px] text-slate-400">Past 30 Days</span>
            </div>

            <div className="divide-y divide-slate-100">
              {transactions.map((tx) => (
                <div key={tx.id} className="py-2.5 flex items-center justify-between text-xs">
                  <div>
                    <div className="font-semibold text-slate-800">{tx.title}</div>
                    <div className="text-[10px] text-slate-400">{tx.date}</div>
                  </div>
                  <div className="text-right">
                    <span
                      className={`font-bold ${
                        tx.amountCoins > 0
                          ? 'text-emerald-600'
                          : tx.amountCoins < 0
                          ? 'text-rose-600'
                          : 'text-purple-700'
                      }`}
                    >
                      {tx.amountCoins > 0 ? `+${tx.amountCoins}` : tx.amountCoins} Coins
                    </span>
                    {tx.amountZAR && (
                      <span className="text-[10px] text-slate-400 block">
                        R{tx.amountZAR}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* PROFILE TAB */}
      {activeTab === 'profile' && (
        <div className="space-y-3">
          <div className="bg-white rounded-[24px] p-4 shadow-sm border border-white/80 space-y-3">
            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                About Me
              </span>
              <p className="text-xs text-slate-700 mt-1 leading-relaxed">
                {user.bio}
              </p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Occupation
              </span>
              <p className="text-xs text-slate-700 mt-0.5">{user.occupation}</p>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Interests & Vibe
              </span>
              <div className="flex flex-wrap gap-1.5 mt-1.5">
                {user.interests.map((interest) => (
                  <span
                    key={interest}
                    className="px-2.5 py-1 bg-purple-50 text-purple-900 border border-purple-100 rounded-lg text-[11px] font-medium"
                  >
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            <div>
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                Languages Spoken
              </span>
              <p className="text-xs text-slate-700 mt-0.5">
                {user.languages.join(', ')}
              </p>
            </div>

            <button
              type="button"
              onClick={() => setShowEditProfileModal(true)}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl font-semibold text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Edit3 size={14} />
              <span>Update Bio & Interests</span>
            </button>
          </div>

          {/* Verification Callout */}
          <div className="p-4 bg-purple-50 rounded-2xl border border-purple-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-purple-950 block">
                Verification Status
              </span>
              <span className="text-[11px] text-purple-700">
                {user.verification === 'purple' ? 'Purple Tick (Video Selfie & ID Verified)' : 'Blue Tick (Email & Phone Verified)'}
              </span>
            </div>
            <button
              type="button"
              onClick={onNavigateToVerification}
              className="px-3 py-1.5 bg-purple-600 text-white rounded-xl text-xs font-semibold hover:bg-purple-700 transition-colors cursor-pointer"
            >
              Manage
            </button>
          </div>
        </div>
      )}

      {/* Account Management & Logout Card */}
      <div className="mt-4 bg-white rounded-[24px] p-4 shadow-sm border border-white/80 space-y-2 text-xs">
        <h4 className="font-serif-mzansi font-bold text-slate-900">Account Safety & Controls</h4>

        <button
          type="button"
          onClick={onLogout}
          className="w-full py-2.5 px-3 rounded-xl bg-slate-50 hover:bg-slate-100 text-slate-700 flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <LogOut size={16} className="text-slate-500" />
            <span>Log Out of Mzansi Dating</span>
          </div>
          <ChevronRight size={14} className="text-slate-400" />
        </button>

        <button
          type="button"
          onClick={() => setShowDeleteModal(true)}
          className="w-full py-2.5 px-3 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 flex items-center justify-between transition-colors cursor-pointer"
        >
          <div className="flex items-center gap-2">
            <Trash2 size={16} className="text-rose-500" />
            <span>Delete Account & Erase Data</span>
          </div>
          <ChevronRight size={14} className="text-rose-400" />
        </button>
      </div>

      {/* BUY COINS MODAL */}
      {showBuyCoinsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-5 space-y-3.5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowBuyCoinsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2">
              <CloverIcon size={24} />
              <h3 className="font-serif-mzansi text-lg font-bold text-slate-900">
                Top Up Mzansi Coins
              </h3>
            </div>
            <p className="text-xs text-slate-500">
              Support local creators, send flowers, and unlock private chats. Secured by Ozow / PayFast.
            </p>

            <div className="space-y-2">
              {COIN_PACKAGES.map((pkg) => (
                <div
                  key={pkg.id}
                  onClick={() => handlePurchasePackage(pkg)}
                  className="p-3 border border-slate-200 hover:border-[#C5A253] rounded-xl flex items-center justify-between cursor-pointer hover:bg-amber-50/40 transition-colors"
                >
                  <div className="flex items-center gap-2">
                    <CloverIcon size={18} />
                    <div>
                      <span className="font-bold text-xs text-slate-900 block">
                        {pkg.coins} Coins
                      </span>
                      {pkg.bonus && (
                        <span className="text-[10px] text-emerald-600 font-semibold">
                          +{pkg.bonus} Bonus Coins
                        </span>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-xs bg-gold-gradient text-white px-3 py-1.5 rounded-lg shadow-xs">
                    R{pkg.priceZAR}
                  </span>
                </div>
              ))}
            </div>

            <div className="text-[10px] text-slate-400 text-center">
              Transactions are processed in South African Rands (ZAR).
            </div>
          </div>
        </div>
      )}

      {/* EDIT PROFILE MODAL */}
      {showEditProfileModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-5 space-y-3.5 shadow-2xl relative max-h-[85vh] overflow-y-auto">
            <button
              type="button"
              onClick={() => setShowEditProfileModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <h3 className="font-serif-mzansi text-lg font-bold text-slate-900">
              Edit Your Profile
            </h3>

            <form onSubmit={handleSaveProfile} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Bio / About Me
                </label>
                <textarea
                  rows={3}
                  value={editBio}
                  onChange={(e) => setEditBio(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl resize-none"
                  required
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Occupation
                </label>
                <input
                  type="text"
                  value={editOccupation}
                  onChange={(e) => setEditOccupation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Location
                </label>
                <input
                  type="text"
                  value={editLocation}
                  onChange={(e) => setEditLocation(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Interests (comma separated)
                </label>
                <input
                  type="text"
                  value={editInterests}
                  onChange={(e) => setEditInterests(e.target.value)}
                  className="w-full p-2.5 bg-slate-50 border border-slate-200 rounded-xl"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-gold-gradient text-white rounded-xl font-bold text-xs shadow-md"
              >
                Save Profile Changes
              </button>
            </form>
          </div>
        </div>
      )}

      {/* SETTINGS MODAL */}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-5 space-y-3.5 shadow-2xl relative">
            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <h3 className="font-serif-mzansi text-lg font-bold text-slate-900">
              App Preferences & Security
            </h3>

            <div className="space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Push Notifications</span>
                  <span className="text-[10px] text-slate-400">Match alerts & messages</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#C5A253]" />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">Read Receipts (Blue Checks)</span>
                  <span className="text-[10px] text-slate-400">Show when you have read messages</span>
                </div>
                <input type="checkbox" defaultChecked className="w-4 h-4 accent-[#C5A253]" />
              </div>

              <div className="p-3 bg-slate-50 rounded-xl flex items-center justify-between">
                <div>
                  <span className="font-semibold text-slate-800 block">POPIA Data Protection</span>
                  <span className="text-[10px] text-slate-400">Strict South African Privacy Shield</span>
                </div>
                <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">Active</span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setShowSettingsModal(false)}
              className="w-full py-2.5 bg-slate-900 text-white rounded-xl font-medium text-xs"
            >
              Done
            </button>
          </div>
        </div>
      )}

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-5 space-y-3 shadow-2xl relative">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <h3 className="font-serif-mzansi text-base font-bold text-center text-slate-900">
              Delete Account Permanently?
            </h3>
            <p className="text-xs text-slate-500 text-center leading-relaxed">
              This action cannot be undone. All your matches, chat histories, remaining coins ({userBalance}), and verification credentials will be wiped immediately per POPIA requirements.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowDeleteModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
              >
                Keep Account
              </button>
              <button
                type="button"
                onClick={onDeleteAccount}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
