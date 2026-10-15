export type VerificationType = 'none' | 'blue' | 'purple'; // blue = email, purple = video selfie

export type ProvinceSA = 
  | 'Gauteng'
  | 'Western Cape'
  | 'KwaZulu-Natal'
  | 'Eastern Cape'
  | 'Free State'
  | 'Limpopo'
  | 'Mpumalanga'
  | 'North West'
  | 'Northern Cape';

export interface UserProfile {
  id: string;
  name: string;
  age: number;
  gender: 'female' | 'male' | 'non-binary';
  lookingFor: 'men' | 'women' | 'everyone';
  location: string;
  province?: ProvinceSA;
  country: string;
  flag: string;
  bio: string;
  occupation: string;
  avatar: string;
  photos: string[];
  verification: VerificationType;
  isOnline: boolean;
  lastSeen?: string;
  interests: string[];
  languages: string[];
  height?: string;
  starSign?: string;
  isVipCreator?: boolean;
  vipCoinRate?: number;
  vipCategory?: string;
  vipBio?: string;
  videoSnippetUrl?: string;
  hasVideoIntro?: boolean;
  badges?: ('top_contributor' | 'trendsetter' | 'rising_star')[];
  interactionScore?: number;
  profileCompletion?: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  receiverId: string;
  text?: string;
  imageUrl?: string;
  isBlurred?: boolean;
  audioDuration?: number; // seconds for voice note
  isVoiceNote?: boolean;
  gift?: {
    name: string;
    icon: string;
    coins: number;
  };
  timestamp: string;
  isRead: boolean;
  readAt?: string;
  conversationId?: string;
  createdAt?: string;
  status?: 'sending' | 'sent' | 'delivered' | 'read';
}

export interface Conversation {
  id: string;
  participant: UserProfile;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
}

export interface CoinPackage {
  id: string;
  coins: number;
  priceZAR: number;
  popular?: boolean;
  bonus?: number;
}

export interface VirtualGift {
  id: string;
  name: string;
  icon: string;
  coins: number;
  description: string;
}

export interface MeetupRequest {
  id: string;
  creatorId: string;
  creatorName: string;
  date: string;
  time: string;
  publicVenue: string;
  purpose: string;
  status: 'pending' | 'accepted' | 'declined' | 'completed';
  coinsOffered: number;
  agreedToConsent: boolean;
  createdAt: string;
}

export interface Transaction {
  id: string;
  type: 'deposit' | 'gift_sent' | 'gift_received' | 'vip_chat' | 'subscription' | 'meetup_escrow';
  title: string;
  amountCoins: number;
  amountZAR?: number;
  date: string;
  status: 'completed' | 'pending';
}

export interface DailyMzansiHoroscopeData {
  sign: string;
  mzansiArchetype: string;
  dailyForecast: string;
  conversationSparker: string;
  luckyVibe: string;
  compatibility: string;
  mzansiDateIdea: string;
  luckyNumber: number;
  isFallback?: boolean;
}
