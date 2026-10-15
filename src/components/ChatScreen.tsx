import React, { useState, useEffect, useRef } from 'react';
import { 
  ArrowLeft, 
  Phone, 
  Video, 
  MoreVertical, 
  Paperclip, 
  Gift, 
  Send, 
  Lock, 
  Sparkles, 
  CheckCheck, 
  Flag, 
  Ban, 
  X, 
  AlertTriangle,
  Radio
} from 'lucide-react';
import { UserProfile, ChatMessage, VirtualGift } from '../types';
import { VIRTUAL_GIFTS, MOCK_PROFILES } from '../data/mockData';
import { 
  setTypingStatus, 
  subscribeToTypingStatus, 
  sendPushNotification,
  saveChatMessageToFirestore,
  markMessageAsReadInFirestore,
  subscribeToConversationMessages,
  markConversationMessagesAsReadInFirestore
} from '../firebase';
import { CloverIcon } from './CloverLogo';

interface ChatScreenProps {
  currentProfile: UserProfile | null;
  userBalance: number;
  isVipSubscriber: boolean;
  onDeductCoins: (amount: number, reason: string) => boolean;
  onSubscribe: () => void;
  onBackToDiscover?: () => void;
  activeRecipient?: UserProfile | null;
  onCloseActiveChat?: () => void;
  initialMessageDraft?: string;
  onClearInitialDraft?: () => void;
}

export const ChatScreen: React.FC<ChatScreenProps> = ({
  userBalance,
  isVipSubscriber,
  onDeductCoins,
  onSubscribe,
  onBackToDiscover,
  activeRecipient: propRecipient,
  onCloseActiveChat,
  initialMessageDraft,
  onClearInitialDraft,
}) => {
  // Default to Thandeka (as requested)
  const recipient: UserProfile = propRecipient || MOCK_PROFILES[0];
  const conversationId = `conv_${recipient.id}`;

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg_1',
      senderId: recipient.id,
      receiverId: 'currentUser',
      text: 'Sawubona! How are you enjoying Mbombela and the Lowveld scenery today? 🌸',
      timestamp: '11:15',
      isRead: true
    },
    {
      id: 'msg_2',
      senderId: 'currentUser',
      receiverId: recipient.id,
      text: 'Unjani Thandeka! Mbombela is breathtaking at this time of year. Have you visited Sudwala Caves recently?',
      timestamp: '11:18',
      isRead: true
    },
    {
      id: 'msg_3',
      senderId: recipient.id,
      receiverId: 'currentUser',
      text: 'Yes! It is magical. By the way, I just captured this photo from the botanical garden:',
      timestamp: '11:21',
      isRead: true
    },
    {
      id: 'msg_4',
      senderId: recipient.id,
      receiverId: 'currentUser',
      imageUrl: '/src/assets/images/mzansi_profile_thandeka_1792002715162.jpg',
      isBlurred: true,
      timestamp: '11:22',
      isRead: true
    },
    {
      id: 'msg_5',
      senderId: recipient.id,
      receiverId: 'currentUser',
      text: 'Would you be open to an artisan coffee date at the garden cafe this weekend? ☕✨',
      timestamp: '11:24',
      isRead: false
    }
  ]);

  const [inputText, setInputText] = useState(initialMessageDraft || '');
  const [showTopMenu, setShowTopMenu] = useState(false);
  const [showGiftDrawer, setShowGiftDrawer] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [reportReason, setReportReason] = useState('inappropriate');
  const [isBlocked, setIsBlocked] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (initialMessageDraft) {
      setInputText(initialMessageDraft);
      if (onClearInitialDraft) {
        onClearInitialDraft();
      }
    }
  }, [initialMessageDraft]);

  // Real-time Firestore typing indicator states
  const [isRecipientTyping, setIsRecipientTyping] = useState<boolean>(false);
  const [typingUserName, setTypingUserName] = useState<string>('');
  const typingTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Attach real-time Firestore onSnapshot listener for typing indicators
  useEffect(() => {
    const unsubscribe = subscribeToTypingStatus(
      conversationId,
      'currentUser',
      (otherIsTyping, name) => {
        setIsRecipientTyping(otherIsTyping);
        setTypingUserName(name || recipient.name);
      }
    );

    return () => {
      unsubscribe();
      // Clear current user's typing status when unmounting
      setTypingStatus(conversationId, 'currentUser', 'You', false);
    };
  }, [conversationId, recipient.name]);

  // Attach real-time Firestore onSnapshot listener for messages and read receipts (double ticks)
  useEffect(() => {
    // Seed initial messages to Firestore if needed
    messages.forEach((m) => {
      saveChatMessageToFirestore({
        ...m,
        conversationId,
        status: m.isRead ? 'read' : 'delivered'
      }, conversationId);
    });

    const unsubscribe = subscribeToConversationMessages(conversationId, (firestoreMsgs) => {
      if (firestoreMsgs && firestoreMsgs.length > 0) {
        setMessages((prevLocal) => {
          const map = new Map<string, ChatMessage>();
          prevLocal.forEach((m) => map.set(m.id, m));
          firestoreMsgs.forEach((fm) => {
            const existing = map.get(fm.id);
            map.set(fm.id, { ...existing, ...fm });
          });
          return Array.from(map.values());
        });
      }
    });

    // Mark any unread messages sent to current user as read
    markConversationMessagesAsReadInFirestore(conversationId, 'currentUser');

    return () => {
      unsubscribe();
    };
  }, [conversationId]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isRecipientTyping]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  // Broadcast user's typing activity to Firestore with debounce
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setInputText(val);

    if (val.trim()) {
      setTypingStatus(conversationId, 'currentUser', 'You', true);

      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }

      typingTimeoutRef.current = setTimeout(() => {
        setTypingStatus(conversationId, 'currentUser', 'You', false);
      }, 2000);
    } else {
      setTypingStatus(conversationId, 'currentUser', 'You', false);
    }
  };

  const handleSendMessage = () => {
    if (!inputText.trim()) return;

    // Reset typing status in Firestore immediately
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    setTypingStatus(conversationId, 'currentUser', 'You', false);

    const messageId = `msg_${Date.now()}`;
    const newMsg: ChatMessage = {
      id: messageId,
      senderId: 'currentUser',
      receiverId: recipient.id,
      text: inputText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isRead: false,
      status: 'delivered',
      conversationId,
      createdAt: new Date().toISOString()
    };

    setMessages((prev) => [...prev, newMsg]);
    setInputText('');

    // Persist to Firestore for real-time tracking across sessions and devices
    saveChatMessageToFirestore(newMsg, conversationId);

    // Simulate recipient receiving and reading message in real-time via Firestore (1.6s)
    setTimeout(() => {
      markMessageAsReadInFirestore(messageId);
      showToast(`${recipient.name} read your message (Double Ticks Updated ✓✓)`);

      // Recipient begins typing via Firestore snapshot
      setTimeout(() => {
        setTypingStatus(conversationId, recipient.id, recipient.name, true);

        setTimeout(() => {
          setTypingStatus(conversationId, recipient.id, recipient.name, false);
          const replyId = `msg_${Date.now() + 1}`;
          const replyMsg: ChatMessage = {
            id: replyId,
            senderId: recipient.id,
            receiverId: 'currentUser',
            text: 'Ngiyabonga kakhulu! It feels so genuine speaking with you. Let’s make that date happen e Mzansi! 🌿',
            timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            isRead: true,
            status: 'read',
            conversationId,
            createdAt: new Date().toISOString()
          };
          setMessages((prev) => [...prev, replyMsg]);
          saveChatMessageToFirestore(replyMsg, conversationId);

          // Dispatch real-time push notification
          sendPushNotification({
            recipientUserId: 'currentUser',
            senderName: recipient.name,
            senderAvatar: recipient.avatar,
            type: 'message',
            title: `New message from ${recipient.name} 💬`,
            body: replyMsg.text || 'Sent you a message e Mzansi'
          });
        }, 2200);
      }, 900);
    }, 1600);
  };

  // Helper button to simulate remote user typing in Firestore
  const handleTriggerRemoteTyping = () => {
    setTypingStatus(conversationId, recipient.id, recipient.name, true);
    showToast(`Broadcasting "${recipient.name} is typing" to Firestore listeners...`);

    setTimeout(() => {
      setTypingStatus(conversationId, recipient.id, recipient.name, false);
    }, 3500);
  };

  // Helper button to simulate recipient marking sent messages as Read in Firestore
  const handleTriggerMarkAllReadInFirestore = async () => {
    const unreadMine = messages.filter((m) => m.senderId === 'currentUser' && !m.isRead);
    if (unreadMine.length === 0) {
      showToast('All your sent messages are already marked as Read! ✓✓');
      return;
    }

    for (const m of unreadMine) {
      await markMessageAsReadInFirestore(m.id);
    }
    showToast(`Marked ${unreadMine.length} message(s) as Read in Firestore! ✓✓`);
  };

  const handleSendGift = (gift: VirtualGift) => {
    if (userBalance < gift.coins) {
      showToast(`Need ${gift.coins} coins! Top up in your Wallet`);
      return;
    }

    const success = onDeductCoins(gift.coins, `Gift: ${gift.name} to ${recipient.name}`);
    if (success) {
      const giftMsg: ChatMessage = {
        id: `gift_${Date.now()}`,
        senderId: 'currentUser',
        receiverId: recipient.id,
        gift: {
          name: gift.name,
          icon: gift.icon,
          coins: gift.coins
        },
        text: `Sent a virtual gift: ${gift.name} ${gift.icon}`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isRead: false,
        status: 'delivered',
        conversationId,
        createdAt: new Date().toISOString()
      };

      setMessages((prev) => [...prev, giftMsg]);
      saveChatMessageToFirestore(giftMsg, conversationId);
      setShowGiftDrawer(false);
      showToast(`Sent ${gift.name} to ${recipient.name}! 🌸`);

      // Mark read in Firestore after brief delay
      setTimeout(() => {
        markMessageAsReadInFirestore(giftMsg.id);
      }, 1600);
    }
  };

  const handleReport = (e: React.FormEvent) => {
    e.preventDefault();
    setShowReportModal(false);
    showToast(`Report received for ${recipient.name}. Our safety moderation team will review within 10 minutes.`);
  };

  const handleBlock = () => {
    setIsBlocked(true);
    setShowBlockModal(false);
    showToast(`${recipient.name} has been blocked.`);
  };

  return (
    <div className="w-full max-w-[430px] mx-auto px-3 pb-24 pt-1 flex flex-col h-[88vh]">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-12 left-1/2 -translate-x-1/2 z-50 bg-slate-900/90 text-white text-xs px-4 py-2 rounded-full shadow-lg backdrop-blur-xs flex items-center gap-2 animate-bounce">
          <span>{toastMessage}</span>
        </div>
      )}

      {/* HEADER: White Card rounded 24px, soft shadow */}
      <div className="bg-white rounded-[24px] p-3 shadow-md shadow-purple-950/10 border border-white/80 flex items-center justify-between relative z-20 shrink-0">
        <div className="flex items-center gap-2.5">
          {/* Back Arrow */}
          <button
            type="button"
            onClick={() => {
              if (onCloseActiveChat) onCloseActiveChat();
              if (onBackToDiscover) onBackToDiscover();
            }}
            className="p-1.5 text-slate-600 hover:text-slate-900 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Back"
          >
            <ArrowLeft size={18} />
          </button>

          {/* Profile Pic */}
          <div className="relative w-11 h-11 rounded-full overflow-hidden shrink-0 border border-[#C5A253]/30 bg-slate-100">
            <img
              src={recipient.avatar}
              alt={recipient.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* Name & Status */}
          <div>
            <div className="font-serif-mzansi font-bold text-sm text-slate-900 flex items-center gap-1.5 leading-tight">
              <span>{recipient.name}, {recipient.age}</span>
            </div>
            {/* "Purple Verified • Online" in green */}
            <div className="flex items-center gap-1 mt-0.5 text-[10px]">
              <span className="text-[#9E7728] font-bold">Purple Verified</span>
              <span className="text-slate-300">·</span>
              <span className="text-emerald-500 font-semibold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                <span>Online</span>
              </span>
            </div>
          </div>
        </div>

        {/* Right Action Icons: Call, Video in Gold + Test buttons + 3 dots menu */}
        <div className="flex items-center gap-1 relative">
          {/* Live Firestore Snapshot Test Triggers */}
          <button
            type="button"
            onClick={handleTriggerRemoteTyping}
            className="p-1.5 text-xs text-purple-700 bg-purple-50 hover:bg-purple-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer border border-purple-200/50"
            title="Test real-time Firestore typing indicator listener"
          >
            <Radio size={12} className="text-purple-600 animate-pulse" />
            <span className="hidden sm:inline text-[9px] font-semibold">Typing</span>
          </button>

          <button
            type="button"
            onClick={handleTriggerMarkAllReadInFirestore}
            className="p-1.5 text-xs text-sky-700 bg-sky-50 hover:bg-sky-100 rounded-lg flex items-center gap-1 transition-colors cursor-pointer border border-sky-200/60"
            title="Test real-time Firestore Read receipts (Double Ticks)"
          >
            <CheckCheck size={13} className="text-sky-500" />
            <span className="hidden sm:inline text-[9px] font-semibold">Mark Read</span>
          </button>

          <button
            type="button"
            onClick={() => showToast(`Audio call connecting to ${recipient.name}...`)}
            className="p-1.5 text-[#C5A253] hover:text-[#B78E3E] hover:bg-amber-50 rounded-full transition-colors cursor-pointer"
            title="Audio Call"
            aria-label="Call"
          >
            <Phone size={16} strokeWidth={2} />
          </button>

          <button
            type="button"
            onClick={() => showToast(`Encrypted video call connecting to ${recipient.name}...`)}
            className="p-1.5 text-[#C5A253] hover:text-[#B78E3E] hover:bg-amber-50 rounded-full transition-colors cursor-pointer"
            title="Video Call"
            aria-label="Video Call"
          >
            <Video size={17} strokeWidth={2} />
          </button>

          {/* 3-Dots Top Menu */}
          <button
            type="button"
            onClick={() => setShowTopMenu(!showTopMenu)}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
            aria-label="Menu"
          >
            <MoreVertical size={18} />
          </button>

          {/* Dropdown Menu for Report & Block & Read Ticks */}
          {showTopMenu && (
            <div className="absolute right-0 top-10 w-48 bg-white rounded-2xl shadow-xl border border-slate-100 p-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-2 duration-150">
              <button
                type="button"
                onClick={() => {
                  setShowTopMenu(false);
                  handleTriggerMarkAllReadInFirestore();
                }}
                className="w-full text-left px-3 py-2 text-sky-700 hover:bg-sky-50 rounded-xl flex items-center gap-2 cursor-pointer font-medium"
              >
                <CheckCheck size={14} className="text-sky-500" />
                <span>Mark All Read (✓✓)</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTopMenu(false);
                  setShowReportModal(true);
                }}
                className="w-full text-left px-3 py-2 text-slate-700 hover:bg-slate-50 rounded-xl flex items-center gap-2 cursor-pointer"
              >
                <Flag size={14} className="text-amber-500" />
                <span>Report Profile</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowTopMenu(false);
                  setShowBlockModal(true);
                }}
                className="w-full text-left px-3 py-2 text-rose-600 hover:bg-rose-50 rounded-xl flex items-center gap-2 cursor-pointer font-medium"
              >
                <Ban size={14} />
                <span>Block User</span>
              </button>
              <div className="border-t border-slate-100 my-1"></div>
              <div className="px-3 py-1.5 text-[10px] text-slate-400">
                Firestore Listeners Active
              </div>
            </div>
          )}
        </div>
      </div>

      {/* MESSAGES SCROLL AREA */}
      <div className="flex-1 overflow-y-auto py-3 px-1 space-y-3">
        {/* Date Stamp */}
        <div className="text-center my-1">
          <span className="bg-white/80 backdrop-blur-xs text-[10px] font-semibold text-slate-500 px-3 py-1 rounded-full shadow-xs">
            TODAY · REAL-TIME FIRESTORE SYNC
          </span>
        </div>

        {messages.map((msg) => {
          const isMe = msg.senderId === 'currentUser';

          return (
            <div
              key={msg.id}
              className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[78%] rounded-[20px] px-4 py-2.5 text-xs relative ${
                  isMe
                    ? 'bg-gold-gradient text-white rounded-tr-xs shadow-md shadow-[#C5A253]/20'
                    : 'bg-white text-slate-800 rounded-tl-xs shadow-md shadow-purple-950/5 border border-white/80'
                }`}
              >
                {/* Virtual Gift Embed */}
                {msg.gift && (
                  <div className="p-2 mb-2 bg-amber-500/20 border border-amber-200/40 rounded-xl text-center">
                    <span className="text-3xl block my-1">{msg.gift.icon}</span>
                    <span className="font-bold text-xs">{msg.gift.name}</span>
                    <span className="text-[10px] opacity-90 block">
                      {msg.gift.coins} Gold Coins
                    </span>
                  </div>
                )}

                {/* Photo Media (with VIP Blur Lock feature) */}
                {msg.imageUrl && (
                  <div className="mb-2 rounded-[16px] overflow-hidden relative border border-white/20 bg-slate-100">
                    <img
                      src={msg.imageUrl}
                      alt="Shared media"
                      referrerPolicy="no-referrer"
                      className={`w-52 h-44 object-cover transition-all duration-300 ${
                        !isVipSubscriber ? 'filter blur-md scale-105' : ''
                      }`}
                    />

                    {!isVipSubscriber && (
                      <div className="absolute inset-0 bg-black/45 backdrop-blur-xs flex flex-col items-center justify-center p-3 text-center text-white">
                        <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-xs flex items-center justify-center mb-1.5 text-amber-300 shadow-xs">
                          <Lock size={16} />
                        </div>
                        <span className="text-[11px] font-bold">Private VIP Photo</span>
                        <span className="text-[10px] text-white/80 mb-2">
                          Exclusive photo shared by {recipient.name}
                        </span>
                        <button
                          type="button"
                          onClick={onSubscribe}
                          className="px-3.5 py-1.5 bg-gold-gradient text-white rounded-xl text-[10px] font-bold shadow-md hover:shadow-lg active:scale-95 transition-all cursor-pointer flex items-center gap-1"
                        >
                          <Sparkles size={11} />
                          <span>Unlock with VIP R149/mo</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}

                {/* Message Text */}
                {msg.text && (
                  <p className="leading-relaxed font-normal whitespace-pre-wrap">
                    {msg.text}
                  </p>
                )}

                {/* Timestamp & Real-Time Read Indicators (Double Ticks) */}
                <div
                  className={`flex items-center justify-end gap-1.5 mt-1 text-[10px] ${
                    isMe ? 'text-white/85' : 'text-slate-400'
                  }`}
                >
                  <span>{msg.timestamp}</span>
                  {isMe && (
                    <div
                      className="flex items-center gap-0.5 select-none"
                      title={
                        msg.isRead || msg.status === 'read'
                          ? `Read by ${recipient.name} (✓✓ Real-time Firestore update)`
                          : 'Delivered (✓✓ Waiting for recipient to read in Firestore)'
                      }
                    >
                      <CheckCheck
                        size={14}
                        strokeWidth={2.4}
                        className={`transition-all duration-300 ${
                          msg.isRead || msg.status === 'read'
                            ? 'text-sky-300 drop-shadow-[0_0_6px_rgba(56,189,248,0.85)] scale-105'
                            : 'text-white/60'
                        }`}
                      />
                      {(msg.isRead || msg.status === 'read') && (
                        <span className="text-[9px] font-semibold text-sky-200 ml-0.5 animate-in fade-in duration-200">
                          Read
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          );
        })}

        {/* REAL-TIME 'IS TYPING...' INDICATOR VIA FIRESTORE SNAPSHOT */}
        {isRecipientTyping && (
          <div className="flex items-center gap-2 animate-in fade-in slide-in-from-bottom-1 duration-200 py-1">
            <div className="w-6 h-6 rounded-full overflow-hidden shrink-0 border border-purple-200">
              <img
                src={recipient.avatar}
                alt={recipient.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="bg-white rounded-[20px] rounded-tl-xs px-3.5 py-2 shadow-sm border border-purple-100 flex items-center gap-1.5 text-xs text-slate-700">
              <span className="font-medium text-[11px] text-[#9E7728]">{typingUserName || recipient.name} is typing</span>
              <span className="flex items-center gap-1 pl-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A253] animate-bounce"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A253] animate-bounce [animation-delay:0.2s]"></span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#C5A253] animate-bounce [animation-delay:0.4s]"></span>
              </span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* SAFETY BANNER */}
      <div className="mb-2 p-2 bg-purple-600/10 border border-purple-300/30 rounded-xl text-center text-[10px] text-purple-950 font-medium shrink-0">
        Mandatory Safety: Public venues only • 100% Consensual • Report button available
      </div>

      {/* INPUT BAR */}
      {isBlocked ? (
        <div className="p-3 bg-white/80 backdrop-blur-xs rounded-[32px] text-center text-xs text-slate-500 font-medium">
          You have blocked {recipient.name}. Messaging is disabled.
        </div>
      ) : (
        <div className="bg-white rounded-[32px] p-1.5 pl-3 shadow-lg shadow-purple-950/10 border border-white/80 flex items-center gap-2 shrink-0">
          {/* Attachment Icon */}
          <button
            type="button"
            onClick={() => showToast('Attaching photo...')}
            className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
            title="Attach file or photo"
            aria-label="Attachment"
          >
            <Paperclip size={18} />
          </button>

          {/* Text Input with Real-time Typing Notification */}
          <input
            type="text"
            value={inputText}
            onChange={handleInputChange}
            onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
            placeholder="Type a message..."
            className="flex-1 py-2 text-xs text-slate-800 placeholder-[#6B7280] bg-transparent focus:outline-none"
          />

          {/* Gift Icon Gold */}
          <button
            type="button"
            onClick={() => setShowGiftDrawer(true)}
            className="p-1.5 text-[#C5A253] hover:text-[#B78E3E] transition-colors cursor-pointer"
            title="Send Virtual Gift"
            aria-label="Virtual Gifts"
          >
            <Gift size={20} />
          </button>

          {/* Send Button: Gold circle with paper plane */}
          <button
            type="button"
            onClick={handleSendMessage}
            className="w-9 h-9 rounded-full bg-gold-gradient text-white flex items-center justify-center shadow-md shadow-[#C5A253]/30 hover:scale-105 active:scale-95 transition-all cursor-pointer shrink-0"
            aria-label="Send message"
          >
            <Send size={15} className="translate-x-0.5" />
          </button>
        </div>
      )}

      {/* VIRTUAL GIFTS DRAWER */}
      {showGiftDrawer && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs z-50 flex flex-col justify-end p-3">
          <div className="bg-white rounded-[28px] max-w-[420px] mx-auto w-full p-4 space-y-3 shadow-2xl animate-in slide-in-from-bottom duration-200">
            <div className="flex justify-between items-center pb-2 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <CloverIcon size={20} />
                <h3 className="font-serif-mzansi text-sm font-bold text-slate-900">
                  Send a Mzansi Romantic Gift
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowGiftDrawer(false)}
                className="text-slate-400 hover:text-slate-600 p-1"
              >
                <X size={18} />
              </button>
            </div>

            <div className="flex items-center justify-between text-xs bg-amber-50 p-2 rounded-xl border border-amber-200">
              <span className="text-amber-900">Your Coin Balance:</span>
              <span className="font-bold text-[#9E7728]">{userBalance} Gold Coins</span>
            </div>

            <div className="grid grid-cols-2 gap-2 max-h-56 overflow-y-auto">
              {VIRTUAL_GIFTS.map((gift) => (
                <div
                  key={gift.id}
                  onClick={() => handleSendGift(gift)}
                  className="p-2.5 border border-slate-200 hover:border-[#C5A253] rounded-2xl text-center cursor-pointer hover:bg-amber-50/50 transition-colors group"
                >
                  <span className="text-2xl block group-hover:scale-110 transition-transform">
                    {gift.icon}
                  </span>
                  <div className="font-bold text-xs text-slate-800 mt-1">{gift.name}</div>
                  <button
                    type="button"
                    className="mt-1.5 w-full py-1 bg-gold-gradient text-white rounded-lg text-[10px] font-bold"
                  >
                    Send · {gift.coins} Coins
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* REPORT MODAL */}
      {showReportModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-5 shadow-2xl relative space-y-3">
            <button
              type="button"
              onClick={() => setShowReportModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-600"
            >
              <X size={18} />
            </button>

            <div className="flex items-center gap-2 text-amber-600 font-bold">
              <AlertTriangle size={20} />
              <h3 className="font-serif-mzansi text-base font-bold text-slate-900">
                Report {recipient.name}
              </h3>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed">
              Mzansi Dating strictly enforces mutual respect, safe consensual meetups, and zero tolerance for harassment.
            </p>

            <form onSubmit={handleReport} className="space-y-3 text-xs">
              <div>
                <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                  Reason for Report:
                </label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full p-2 bg-slate-50 border border-slate-200 rounded-xl text-xs"
                >
                  <option value="inappropriate">Inappropriate message or behavior</option>
                  <option value="fake">Suspected fake profile</option>
                  <option value="solicitation">Prohibited commercial solicitation</option>
                  <option value="safety">Public meetup non-compliance</option>
                </select>
              </div>

              <div className="flex gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowReportModal(false)}
                  className="flex-1 py-2 border border-slate-200 text-slate-600 rounded-xl font-medium"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-semibold"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* BLOCK MODAL */}
      {showBlockModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-[24px] max-w-sm w-full p-5 shadow-2xl relative space-y-3 text-center">
            <div className="w-12 h-12 bg-rose-100 text-rose-600 rounded-full flex items-center justify-center mx-auto">
              <AlertTriangle size={24} />
            </div>

            <h3 className="font-serif-mzansi text-base font-bold text-slate-900">
              Block {recipient.name}?
            </h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              They will no longer be able to message you or view your profile. You can unblock anytime from Settings.
            </p>

            <div className="flex gap-2 pt-2">
              <button
                type="button"
                onClick={() => setShowBlockModal(false)}
                className="flex-1 py-2.5 border border-slate-200 text-slate-700 rounded-xl font-semibold text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleBlock}
                className="flex-1 py-2.5 bg-rose-600 hover:bg-rose-700 text-white rounded-xl font-semibold text-xs"
              >
                Yes, Block
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
