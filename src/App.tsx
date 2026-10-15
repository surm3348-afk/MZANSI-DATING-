import React, { useState, useEffect } from 'react';
import { FloatingCloversBackground } from './components/CloverLogo';
import { LoginScreen } from './components/LoginScreen';
import { SignUpScreen } from './components/SignUpScreen';
import { VerificationScreen } from './components/VerificationScreen';
import { DiscoverScreen } from './components/DiscoverScreen';
import { LikesScreen } from './components/LikesScreen';
import { ChatScreen } from './components/ChatScreen';
import { VIPScreen } from './components/VIPScreen';
import { ProfileWalletScreen } from './components/ProfileWalletScreen';
import { BottomNav, TabType } from './components/BottomNav';
import { ProfileDetailsModal } from './components/ProfileDetailsModal';
import { ApkExportModal } from './components/ApkExportModal';
import { AndroidFrame } from './components/AndroidFrame';
import { PushNotificationBanner } from './components/PushNotificationBanner';
import { MOCK_PROFILES } from './data/mockData';
import { UserProfile, VerificationType } from './types';
import { 
  registerFCMDeviceToken, 
  sendPushNotification, 
  subscribeToUserNotifications, 
  PushNotificationPayload 
} from './firebase';

export default function App() {
  // Navigation & Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authScreen, setAuthScreen] = useState<'login' | 'signup'>('login');
  const [activeTab, setActiveTab] = useState<TabType>('discover');
  const [showVerificationDirect, setShowVerificationDirect] = useState<boolean>(false);

  // User Profile & Wallet States
  const [currentUser, setCurrentUser] = useState<UserProfile>({
    id: 'currentUser',
    name: 'Thandeka Zulu',
    age: 25,
    gender: 'female',
    lookingFor: 'men',
    location: 'Mbombela, Mpumalanga',
    province: 'Mpumalanga',
    country: 'South Africa',
    flag: '🇿🇦',
    bio: 'Passionate about coastal hikes, soulful amapiano, architecture and honest connections e Mzansi.',
    occupation: 'Interior Architect',
    avatar: '/src/assets/images/mzansi_profile_thandeka_1792002715162.jpg',
    photos: ['/src/assets/images/mzansi_profile_thandeka_1792002715162.jpg'],
    verification: 'blue',
    isOnline: true,
    interests: ['Amapiano', 'Table Mountain', 'Wine Tasting', 'Architecture'],
    languages: ['siSwati', 'English'],
    isVipCreator: false
  });

  const [userCoins, setUserCoins] = useState<number>(350);
  const [isVipSubscriber, setIsVipSubscriber] = useState<boolean>(false);

  // App Data states
  const [profiles, setProfiles] = useState<UserProfile[]>(MOCK_PROFILES);
  const [likedProfiles, setLikedProfiles] = useState<UserProfile[]>([
    MOCK_PROFILES[1], // Zola
    MOCK_PROFILES[2], // Sipho
    MOCK_PROFILES[3], // Kamo
  ]);
  const [activeChatRecipient, setActiveChatRecipient] = useState<UserProfile | null>(null);
  const [inspectedProfile, setInspectedProfile] = useState<UserProfile | null>(null);

  // FCM Real-Time Push Notification State
  const [activeNotification, setActiveNotification] = useState<PushNotificationPayload | null>(null);

  // Gemini Horoscope Conversation Starter Draft
  const [chatDraftMessage, setChatDraftMessage] = useState<string>('');

  // App UI Frame toggles
  const [isPhoneFrame, setIsPhoneFrame] = useState<boolean>(true);
  const [showApkModal, setShowApkModal] = useState<boolean>(false);

  // Initialize FCM Token & Real-Time Push Notification Listener on Login
  useEffect(() => {
    if (isAuthenticated) {
      registerFCMDeviceToken(currentUser.id);

      const unsubscribe = subscribeToUserNotifications(currentUser.id, (notif) => {
        setActiveNotification(notif);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [isAuthenticated, currentUser.id]);

  // Auth Handlers
  const handleLoginSuccess = (email: string) => {
    setIsAuthenticated(true);
    setCurrentUser((prev) => ({
      ...prev,
      name: email.split('@')[0].replace('.', ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || prev.name,
      verification: 'blue'
    }));

    // Trigger welcoming FCM Push Notification
    setTimeout(() => {
      sendPushNotification({
        recipientUserId: 'currentUser',
        senderName: 'Thandeka',
        senderAvatar: '/src/assets/images/mzansi_profile_thandeka_1792002715162.jpg',
        type: 'message',
        title: 'New message from Thandeka 💬',
        body: 'Sawubona! Would love to check out that new rooftop jazz lounge this Friday 🎷'
      });
    }, 2000);
  };

  const handleSignUpSuccess = (newUser: Partial<UserProfile>) => {
    setCurrentUser((prev) => ({
      ...prev,
      ...newUser,
      verification: 'blue'
    }));
    setIsAuthenticated(true);
    setActiveTab('discover');

    // Welcome push notification
    setTimeout(() => {
      sendPushNotification({
        recipientUserId: 'currentUser',
        senderName: 'Zola',
        senderAvatar: '/src/assets/images/mzansi_profile_zola_1792002720321.jpg',
        type: 'like',
        title: 'Zola liked your new profile! ❤️',
        body: 'Welcome to Mzansi Dating! Tap to view your first admirer.'
      });
    }, 1500);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setAuthScreen('login');
  };

  const handleDeleteAccount = () => {
    setIsAuthenticated(false);
    setAuthScreen('login');
    setUserCoins(0);
    alert('Your Mzansi Dating account, biometric data and chats have been securely deleted.');
  };

  // Profile Interaction Handlers
  const handleLike = (profile: UserProfile) => {
    if (!likedProfiles.some((p) => p.id === profile.id)) {
      setLikedProfiles((prev) => [profile, ...prev]);
    }

    // Trigger simulated reciprocal real-time FCM Push Notification
    setTimeout(() => {
      sendPushNotification({
        recipientUserId: 'currentUser',
        senderName: profile.name,
        senderAvatar: profile.avatar,
        type: 'like',
        title: `${profile.name} liked you back! ❤️`,
        body: `It is a match! You and ${profile.name} are ready to chat e Mzansi.`
      });
    }, 2500);
  };

  const handleSuperLike = (profile: UserProfile) => {
    handleLike(profile);
    setTimeout(() => {
      sendPushNotification({
        recipientUserId: 'currentUser',
        senderName: profile.name,
        senderAvatar: profile.avatar,
        type: 'superlike',
        title: `${profile.name} sent you a Golden Clover! 🍀✨`,
        body: `You received a rare Super Like from ${profile.name} in ${profile.location}!`
      });
    }, 1800);
  };

  const handleOpenChat = (profile: UserProfile) => {
    setActiveChatRecipient(profile);
    setActiveTab('chat');
  };

  const handleOpenChatWithStarter = (profile: UserProfile, starterText: string) => {
    setActiveChatRecipient(profile);
    setChatDraftMessage(starterText);
    setActiveTab('chat');
  };

  // Wallet Handlers
  const handleDeductCoins = (amount: number, reason: string): boolean => {
    if (userCoins < amount) {
      return false;
    }
    setUserCoins((prev) => prev - amount);
    return true;
  };

  const handleAddCoins = (coins: number, priceZAR: number) => {
    setUserCoins((prev) => prev + coins);
  };

  const handleSubscribeVIP = () => {
    setIsVipSubscriber(true);
    alert('Welcome to Mzansi VIP Pass! Unlimited chats & priority bookings unlocked.');
  };

  // Push Notification Banner Click Handler
  const handleNotificationBannerClick = (notif: PushNotificationPayload) => {
    setActiveNotification(null);
    if (notif.type === 'message') {
      const matched = profiles.find((p) => p.name.toLowerCase() === notif.senderName.toLowerCase()) || profiles[0];
      handleOpenChat(matched);
    } else if (notif.type === 'like' || notif.type === 'superlike') {
      setActiveTab('likes');
    }
  };

  // Manual Test Push Trigger
  const handleManualTestPush = (type: 'message' | 'like') => {
    if (type === 'message') {
      sendPushNotification({
        recipientUserId: 'currentUser',
        senderName: 'Thandeka',
        senderAvatar: '/src/assets/images/mzansi_profile_thandeka_1792002715162.jpg',
        type: 'message',
        title: 'New message from Thandeka 💬',
        body: 'Sawubona! Would love to check out that new rooftop jazz lounge this Friday 🎷'
      });
    } else {
      sendPushNotification({
        recipientUserId: 'currentUser',
        senderName: 'Zola',
        senderAvatar: '/src/assets/images/mzansi_profile_zola_1792002720321.jpg',
        type: 'like',
        title: 'Zola liked your profile! ❤️',
        body: 'Zola from Durban is interested in connecting with you e Mzansi!'
      });
    }
  };

  return (
    <main className="min-h-screen relative overflow-x-hidden">
      {/* Floating Clovers and Romantic Sparkles */}
      <FloatingCloversBackground />

      {/* Real-Time Push Notification Banner (Android / PWA style) */}
      <PushNotificationBanner
        notification={activeNotification}
        onDismiss={() => setActiveNotification(null)}
        onActionClick={handleNotificationBannerClick}
      />

      {/* Screen Navigator Shortcut Bar (Floating helper at top for rapid previewing during review) */}
      <div className="fixed top-2 left-2 z-50 flex items-center gap-1 bg-white/80 backdrop-blur-md px-2 py-1 rounded-full shadow-md text-[10px] text-slate-700 border border-purple-200">
        <span className="font-bold text-[#9E7728] px-1">Jump to:</span>
        <button
          type="button"
          onClick={() => {
            setIsAuthenticated(false);
            setAuthScreen('login');
            setShowVerificationDirect(false);
          }}
          className={`px-2 py-0.5 rounded-full cursor-pointer ${
            !isAuthenticated && authScreen === 'login' ? 'bg-purple-600 text-white font-bold' : 'hover:bg-purple-100'
          }`}
        >
          1. Login
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAuthenticated(false);
            setAuthScreen('signup');
            setShowVerificationDirect(false);
          }}
          className={`px-2 py-0.5 rounded-full cursor-pointer ${
            !isAuthenticated && authScreen === 'signup' ? 'bg-purple-600 text-white font-bold' : 'hover:bg-purple-100'
          }`}
        >
          2. Sign Up
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAuthenticated(true);
            setShowVerificationDirect(true);
          }}
          className={`px-2 py-0.5 rounded-full cursor-pointer ${
            isAuthenticated && showVerificationDirect ? 'bg-purple-600 text-white font-bold' : 'hover:bg-purple-100'
          }`}
        >
          3. Verification
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAuthenticated(true);
            setShowVerificationDirect(false);
            setActiveTab('discover');
          }}
          className={`px-2 py-0.5 rounded-full cursor-pointer ${
            isAuthenticated && !showVerificationDirect && activeTab === 'discover' ? 'bg-purple-600 text-white font-bold' : 'hover:bg-purple-100'
          }`}
        >
          4. Discover
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAuthenticated(true);
            setShowVerificationDirect(false);
            setActiveTab('chat');
          }}
          className={`px-2 py-0.5 rounded-full cursor-pointer ${
            isAuthenticated && !showVerificationDirect && activeTab === 'chat' ? 'bg-purple-600 text-white font-bold' : 'hover:bg-purple-100'
          }`}
        >
          5. Chat
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAuthenticated(true);
            setShowVerificationDirect(false);
            setActiveTab('vip');
          }}
          className={`px-2 py-0.5 rounded-full cursor-pointer ${
            isAuthenticated && !showVerificationDirect && activeTab === 'vip' ? 'bg-purple-600 text-white font-bold' : 'hover:bg-purple-100'
          }`}
        >
          6. VIP (18+)
        </button>
        <button
          type="button"
          onClick={() => {
            setIsAuthenticated(true);
            setShowVerificationDirect(false);
            setActiveTab('profile');
          }}
          className={`px-2 py-0.5 rounded-full cursor-pointer ${
            isAuthenticated && !showVerificationDirect && activeTab === 'profile' ? 'bg-purple-600 text-white font-bold' : 'hover:bg-purple-100'
          }`}
        >
          7. Wallet/Profile
        </button>
      </div>

      {/* Android Frame & Viewport */}
      <AndroidFrame
        isPhoneFrame={isPhoneFrame}
        onTogglePhoneFrame={() => setIsPhoneFrame(!isPhoneFrame)}
        onOpenApkModal={() => setShowApkModal(true)}
        onTestPush={handleManualTestPush}
      >
        {/* VIEW ROUTING */}
        {!isAuthenticated ? (
          authScreen === 'login' ? (
            <LoginScreen
              onLoginSuccess={handleLoginSuccess}
              onNavigateToSignUp={() => setAuthScreen('signup')}
            />
          ) : (
            <SignUpScreen
              onSignUpSuccess={handleSignUpSuccess}
              onNavigateToLogin={() => setAuthScreen('login')}
            />
          )
        ) : showVerificationDirect ? (
          <VerificationScreen
            currentVerification={currentUser.verification}
            onUpdateVerification={(type: VerificationType) => {
              setCurrentUser((prev) => ({ ...prev, verification: type }));
            }}
            onBack={() => setShowVerificationDirect(false)}
            onContinueToDiscover={() => {
              setShowVerificationDirect(false);
              setActiveTab('discover');
            }}
          />
        ) : (
          <div className="flex-1 flex flex-col justify-between">
            {activeTab === 'discover' && (
              <DiscoverScreen
                currentUser={currentUser}
                profiles={profiles}
                onLikeProfile={handleLike}
                onSuperLike={handleSuperLike}
                onOpenChat={handleOpenChat}
                onOpenChatWithMatch={handleOpenChatWithStarter}
                onSelectProfileDetails={(p) => setInspectedProfile(p)}
                onNavigateToVIP={() => setActiveTab('vip')}
              />
            )}

            {activeTab === 'likes' && (
              <LikesScreen
                likedProfiles={likedProfiles}
                onOpenChat={handleOpenChat}
                onSelectProfileDetails={(p) => setInspectedProfile(p)}
                isVipSubscriber={isVipSubscriber}
                onSubscribe={handleSubscribeVIP}
              />
            )}

            {activeTab === 'chat' && (
              <ChatScreen
                currentProfile={currentUser}
                userBalance={userCoins}
                isVipSubscriber={isVipSubscriber}
                onDeductCoins={handleDeductCoins}
                onSubscribe={handleSubscribeVIP}
                onBackToDiscover={() => setActiveTab('discover')}
                activeRecipient={activeChatRecipient}
                onCloseActiveChat={() => setActiveChatRecipient(null)}
                initialMessageDraft={chatDraftMessage}
                onClearInitialDraft={() => setChatDraftMessage('')}
              />
            )}

            {activeTab === 'vip' && (
              <VIPScreen
                vipCreators={profiles.filter((p) => p.isVipCreator)}
                userBalance={userCoins}
                isVipSubscriber={isVipSubscriber}
                onOpenChat={handleOpenChat}
                onNavigateToWallet={() => setActiveTab('profile')}
                onDeductCoins={handleDeductCoins}
                onSubscribe={handleSubscribeVIP}
              />
            )}

            {activeTab === 'profile' && (
              <ProfileWalletScreen
                user={currentUser}
                userBalance={userCoins}
                isVipSubscriber={isVipSubscriber}
                onAddCoins={handleAddCoins}
                onUpdateProfile={(updated) => setCurrentUser((prev) => ({ ...prev, ...updated }))}
                onNavigateToVerification={() => setShowVerificationDirect(true)}
                onLogout={handleLogout}
                onDeleteAccount={handleDeleteAccount}
                onSubscribe={handleSubscribeVIP}
              />
            )}

            {/* Sticky Bottom Navigation Bar */}
            <BottomNav
              activeTab={activeTab}
              onSelectTab={(tab) => {
                setShowVerificationDirect(false);
                setActiveTab(tab);
              }}
              unreadChatCount={1}
              newLikesCount={likedProfiles.length}
            />
          </div>
        )}
      </AndroidFrame>

      {/* Profile Details Modal */}
      <ProfileDetailsModal
        profile={inspectedProfile}
        onClose={() => setInspectedProfile(null)}
        onLike={handleLike}
        onSuperLike={handleSuperLike}
        onOpenChat={handleOpenChat}
      />

      {/* Android APK Export Guide Modal */}
      <ApkExportModal
        isOpen={showApkModal}
        onClose={() => setShowApkModal(false)}
      />
    </main>
  );
}
