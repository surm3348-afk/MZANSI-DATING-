import { UserProfile, CoinPackage, VirtualGift, Conversation, ChatMessage, Transaction } from '../types';

export const SA_PROVINCES = [
  'Gauteng',
  'Western Cape',
  'KwaZulu-Natal',
  'Eastern Cape',
  'Free State',
  'Limpopo',
  'Mpumalanga',
  'North West',
  'Northern Cape'
] as const;

export const COUNTRY_CODES = [
  { name: 'South Africa', code: '+27', flag: '🇿🇦', region: 'Africa' },
  { name: 'Nigeria', code: '+234', flag: '🇳🇬', region: 'Africa' },
  { name: 'Kenya', code: '+254', flag: '🇰🇪', region: 'Africa' },
  { name: 'Ghana', code: '+233', flag: '🇬🇭', region: 'Africa' },
  { name: 'Zimbabwe', code: '+263', flag: '🇿🇼', region: 'Africa' },
  { name: 'Botswana', code: '+267', flag: '🇧🇼', region: 'Africa' },
  { name: 'Namibia', code: '+264', flag: '🇳🇦', region: 'Africa' },
  { name: 'United Kingdom', code: '+44', flag: '🇬🇧', region: 'Europe' },
  { name: 'Germany', code: '+49', flag: '🇩🇪', region: 'Europe' },
  { name: 'France', code: '+33', flag: '🇫🇷', region: 'Europe' },
  { name: 'Netherlands', code: '+31', flag: '🇳🇱', region: 'Europe' },
  { name: 'Ireland', code: '+353', flag: '🇮🇪', region: 'Europe' },
];

export const VIRTUAL_GIFTS: VirtualGift[] = [
  { id: 'g1', name: 'King Protea', icon: '🌸', coins: 20, description: 'National flower of SA - pure elegance' },
  { id: 'g2', name: 'Golden Rose', icon: '🌹', coins: 50, description: 'A classic token of romantic warmth' },
  { id: 'g3', name: 'Amarula & Truffles', icon: '🍫', coins: 80, description: 'Sweet African indulgence' },
  { id: 'g4', name: 'Champagne Toast', icon: '🍾', coins: 150, description: 'Celebrate an exquisite connection' },
  { id: 'g5', name: 'Diamond Clover', icon: '🍀', coins: 300, description: 'Golden luck & rare romance' },
  { id: 'g6', name: 'Solitaire Ring', icon: '💍', coins: 500, description: 'The ultimate royal declaration' },
];

export const COIN_PACKAGES: CoinPackage[] = [
  { id: 'pack1', coins: 100, priceZAR: 50 },
  { id: 'pack2', coins: 250, priceZAR: 110, popular: true, bonus: 20 },
  { id: 'pack3', coins: 500, priceZAR: 200, bonus: 50 },
  { id: 'pack4', coins: 1500, priceZAR: 500, bonus: 200 },
];

export const MOCK_PROFILES: UserProfile[] = [
  {
    id: 'u1',
    name: 'Thandeka',
    age: 25,
    gender: 'female',
    lookingFor: 'men',
    location: 'Mbombela',
    province: 'Mpumalanga',
    country: 'South Africa',
    flag: '🇿🇦',
    bio: 'Architect with a passion for wildlife sunsets, scenic panoramic routes, and deep conversations. Fluent in siSwati and English.',
    occupation: 'Interior Architect & Designer',
    avatar: '/src/assets/images/mzansi_profile_thandeka_1792002715162.jpg',
    photos: [
      '/src/assets/images/mzansi_profile_thandeka_1792002715162.jpg',
    ],
    verification: 'purple',
    isOnline: true,
    interests: ['Amapiano', 'Table Mountain', 'Wine Tasting', 'Architecture', 'Cooking'],
    languages: ['isiXhosa', 'English'],
    height: '1.68m',
    starSign: 'Leo',
    isVipCreator: true,
    vipCoinRate: 30,
    vipCategory: 'Fine Dining & Cultural Tours',
    vipBio: 'Verified Cape Town host. Let us explore curated art galleries, secret botanical gardens, and world-class wine estates.',
    videoSnippetUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-woman-smiling-at-the-camera-39906-large.mp4',
    hasVideoIntro: true,
  },
  {
    id: 'u2',
    name: 'Zola',
    age: 24,
    gender: 'female',
    lookingFor: 'men',
    location: 'Umhlanga, Durban',
    province: 'KwaZulu-Natal',
    country: 'South Africa',
    flag: '🇿🇦',
    bio: 'Lifestyle curator, fashion stylist and beach lover. Looking for someone genuine who loves good food, laughter, and high vibrations.',
    occupation: 'Fashion Stylist & Creative Director',
    avatar: '/src/assets/images/mzansi_profile_zola_1792002720321.jpg',
    photos: [
      '/src/assets/images/mzansi_profile_zola_1792002720321.jpg',
    ],
    verification: 'purple',
    isOnline: true,
    interests: ['Fashion', 'Coastal Drives', 'Afrobeats', 'Gym & Pilates', 'Sushi'],
    languages: ['isiZulu', 'English'],
    height: '1.70m',
    starSign: 'Taurus',
    isVipCreator: true,
    vipCoinRate: 40,
    vipCategory: 'Fashion Events & High Tea',
    vipBio: '18+ Verified Creator. Exclusive private chats, style advisory sessions, and VIP event company in upscale Durban/Sandton venues.',
    videoSnippetUrl: 'https://assets.mixkit.co/videos/preview/mixkit-fashion-model-in-neon-light-41808-large.mp4',
    hasVideoIntro: true,
  },
  {
    id: 'u3',
    name: 'Sipho',
    age: 28,
    gender: 'male',
    lookingFor: 'women',
    location: 'Rosebank, Johannesburg',
    province: 'Gauteng',
    country: 'South Africa',
    flag: '🇿🇦',
    bio: 'Tech entrepreneur & fitness enthusiast. Sundays are for Sunday braais with family and soulful music. Big on ambition, kindness and good banter.',
    occupation: 'Fintech Founder & Angel Investor',
    avatar: '/src/assets/images/mzansi_profile_sipho_1792002716368.jpg',
    photos: [
      '/src/assets/images/mzansi_profile_sipho_1792002716368.jpg',
    ],
    verification: 'purple',
    isOnline: false,
    lastSeen: '15m ago',
    interests: ['Startups', 'Braai', 'Golf', 'Afro-House', 'Travel'],
    languages: ['isiZulu', 'Sesotho', 'English'],
    height: '1.85m',
    starSign: 'Scorpio',
    isVipCreator: false,
    videoSnippetUrl: 'https://assets.mixkit.co/videos/preview/mixkit-young-man-walking-and-smiling-in-a-park-41857-large.mp4',
    hasVideoIntro: true,
  },
  {
    id: 'u4',
    name: 'Kamo',
    age: 26,
    gender: 'female',
    lookingFor: 'men',
    location: 'Sandton, Johannesburg',
    province: 'Gauteng',
    country: 'South Africa',
    flag: '🇿🇦',
    bio: 'Corporate attorney by day, amateur painter by weekend. Looking for an educated, respectful partner with a great sense of humour.',
    occupation: 'Commercial Attorney',
    avatar: '/src/assets/images/mzansi_profile_kamo_1792002716821.jpg',
    photos: [
      '/src/assets/images/mzansi_profile_kamo_1792002716821.jpg',
    ],
    verification: 'blue',
    isOnline: true,
    interests: ['Legal Tech', 'Contemporary Art', 'Tennis', 'Podcasts', 'Book Clubs'],
    languages: ['Setswana', 'English', 'Afrikaans'],
    height: '1.65m',
    starSign: 'Virgo',
    isVipCreator: true,
    vipCoinRate: 35,
    vipCategory: 'Coffee Dates & Professional Networking',
    vipBio: 'Engaging conversations on law, arts, and Johannesburg nightlife over artisan coffee.'
  },
  {
    id: 'u5',
    name: 'Ayanda',
    age: 27,
    gender: 'female',
    lookingFor: 'men',
    location: 'Pretoria East',
    province: 'Gauteng',
    country: 'South Africa',
    flag: '🇿🇦',
    bio: 'Pediatric doctor. Healing small humans, running half marathons, and drinking good rooibos tea. Love family values and positive energy.',
    occupation: 'Pediatric Specialist',
    avatar: '/src/assets/images/mzansi_profile_thandeka_1792002715162.jpg',
    photos: ['/src/assets/images/mzansi_profile_thandeka_1792002715162.jpg'],
    verification: 'purple',
    isOnline: true,
    interests: ['Marathon Running', 'Medical Science', 'Gospel & Soul', 'Baking', 'Hiking'],
    languages: ['isiXhosa', 'English', 'Sepedi'],
    height: '1.63m',
    starSign: 'Capricorn',
    isVipCreator: false,
    videoSnippetUrl: 'https://assets.mixkit.co/videos/preview/mixkit-portrait-of-a-woman-smiling-in-a-park-40960-large.mp4',
    hasVideoIntro: true,
  },
  {
    id: 'u6',
    name: 'Liam',
    age: 29,
    gender: 'male',
    lookingFor: 'women',
    location: 'London / Cape Town',
    country: 'United Kingdom',
    flag: '🇬🇧',
    bio: 'Software director splitting my time between Shoreditch and Camps Bay. Looking for meaningful connection with warmth, wit and adventure.',
    occupation: 'Engineering Director',
    avatar: '/src/assets/images/mzansi_profile_sipho_1792002716368.jpg',
    photos: ['/src/assets/images/mzansi_profile_sipho_1792002716368.jpg'],
    verification: 'blue',
    isOnline: false,
    lastSeen: '1h ago',
    interests: ['Surfing', 'Deep Learning', 'Craft Beers', 'Trail Running', 'Photography'],
    languages: ['English'],
    height: '1.88m',
    starSign: 'Aries',
    isVipCreator: false
  }
];

export const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    participant: MOCK_PROFILES[0], // Thandeka
    lastMessage: 'Sawubona! Would love to check out that new rooftop jazz lounge this Friday 🎷',
    lastMessageTime: '11:24',
    unreadCount: 1
  },
  {
    id: 'c2',
    participant: MOCK_PROFILES[1], // Zola
    lastMessage: 'Thank you for the King Protea gift! You have exquisite taste 🌸',
    lastMessageTime: '09:40',
    unreadCount: 0
  },
  {
    id: 'c3',
    participant: MOCK_PROFILES[3], // Kamo
    lastMessage: 'Voice note (0:18)',
    lastMessageTime: 'Yesterday',
    unreadCount: 0
  }
];

export const INITIAL_MESSAGES_THANDEKA: ChatMessage[] = [
  {
    id: 'm1',
    senderId: 'u1',
    receiverId: 'currentUser',
    text: 'Sawubona! I noticed we both love sunset drives along Chapman\'s Peak.',
    timestamp: '10:45',
    isRead: true
  },
  {
    id: 'm2',
    senderId: 'currentUser',
    receiverId: 'u1',
    text: 'Unjani Thandeka! Chapman\'s Peak at golden hour is unbeatable. Have you been to the lookout point by Hout Bay?',
    timestamp: '10:50',
    isRead: true
  },
  {
    id: 'm3',
    senderId: 'u1',
    receiverId: 'currentUser',
    text: 'Yes! It is magical. By the way, are you into live jazz at all?',
    timestamp: '11:10',
    isRead: true
  },
  {
    id: 'm4',
    senderId: 'currentUser',
    receiverId: 'u1',
    text: 'Love it. Especially soulful South African jazz with some saxophone.',
    timestamp: '11:15',
    isRead: true
  },
  {
    id: 'm5',
    senderId: 'u1',
    receiverId: 'currentUser',
    isVoiceNote: true,
    audioDuration: 14,
    timestamp: '11:20',
    isRead: true
  },
  {
    id: 'm6',
    senderId: 'u1',
    receiverId: 'currentUser',
    text: 'Sawubona! Would love to check out that new rooftop jazz lounge this Friday 🎷',
    timestamp: '11:24',
    isRead: false
  }
];

export const INITIAL_TRANSACTIONS: Transaction[] = [
  {
    id: 'tx1',
    type: 'deposit',
    title: 'Top Up: 250 Coins Pack',
    amountCoins: 270,
    amountZAR: 110,
    date: '14 Oct 2026, 09:15',
    status: 'completed'
  },
  {
    id: 'tx2',
    type: 'gift_sent',
    title: 'Gift to Zola (King Protea)',
    amountCoins: -20,
    date: '14 Oct 2026, 09:35',
    status: 'completed'
  },
  {
    id: 'tx3',
    type: 'subscription',
    title: 'VIP Pass Monthly Renewal',
    amountCoins: 0,
    amountZAR: 149,
    date: '01 Oct 2026',
    status: 'completed'
  }
];
