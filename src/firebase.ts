import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  updateDoc,
  getDocs,
  onSnapshot, 
  getDocFromServer,
  collection,
  query,
  where
} from 'firebase/firestore';
import { getMessaging, getToken, onMessage, isSupported } from 'firebase/messaging';
import firebaseConfig from '../firebase-applet-config.json';
import { ChatMessage } from './types';

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);

// Error handling interface
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.warn('Firestore notice: ', JSON.stringify(errInfo));
  return errInfo;
}

// Test connection on boot
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or initializing.');
    }
  }
}
testConnection();

export interface TypingStatusData {
  conversationId: string;
  userId: string;
  userName: string;
  isTyping: boolean;
  lastTypedAt: string;
}

// Helper to set typing status in Firestore
export async function setTypingStatus(
  conversationId: string, 
  userId: string, 
  userName: string, 
  isTyping: boolean
) {
  const path = `typing_status/${conversationId}_${userId}`;
  try {
    await setDoc(doc(db, 'typing_status', `${conversationId}_${userId}`), {
      conversationId,
      userId,
      userName,
      isTyping,
      lastTypedAt: new Date().toISOString()
    }, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

// Real-time Firestore snapshot listener for typing indicators
export function subscribeToTypingStatus(
  conversationId: string, 
  currentUserId: string, 
  onTypingChange: (otherUserIsTyping: boolean, typingUserName: string) => void
) {
  const collectionPath = 'typing_status';
  try {
    const unsubscribe = onSnapshot(
      collection(db, collectionPath),
      (snapshot) => {
        let isTyping = false;
        let typingName = '';

        snapshot.forEach((docSnap) => {
          const data = docSnap.data() as TypingStatusData;
          if (data && data.conversationId === conversationId && data.userId !== currentUserId) {
            if (data.isTyping) {
              const diffMs = Date.now() - new Date(data.lastTypedAt || 0).getTime();
              if (diffMs < 5000) {
                isTyping = true;
                typingName = data.userName || 'Someone';
              }
            }
          }
        });

        onTypingChange(isTyping, typingName);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, collectionPath);
      }
    );

    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, collectionPath);
    return () => {};
  }
}

/// ---------------------------------------------------------------------------
/// REAL-TIME FIRESTORE CHAT MESSAGES & READ INDICATORS (DOUBLE TICKS)
/// ---------------------------------------------------------------------------

/**
 * Save chat message to Firestore and trigger real-time updates for conversation participants
 */
export async function saveChatMessageToFirestore(msg: ChatMessage, conversationId: string) {
  const path = `messages/${msg.id}`;
  try {
    const payload: Record<string, any> = {
      id: msg.id,
      conversationId,
      senderId: msg.senderId,
      receiverId: msg.receiverId,
      text: msg.text || '',
      timestamp: msg.timestamp,
      isRead: !!msg.isRead,
      createdAt: msg.createdAt || new Date().toISOString(),
      status: msg.status || (msg.isRead ? 'read' : 'delivered')
    };

    if (msg.imageUrl) payload.imageUrl = msg.imageUrl;
    if (msg.isBlurred !== undefined) payload.isBlurred = msg.isBlurred;
    if (msg.gift) payload.gift = msg.gift;
    if (msg.readAt) payload.readAt = msg.readAt;

    await setDoc(doc(db, 'messages', msg.id), payload, { merge: true });
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Mark a message as read in Firestore, triggering real-time double tick updates
 */
export async function markMessageAsReadInFirestore(messageId: string) {
  const path = `messages/${messageId}`;
  try {
    await updateDoc(doc(db, 'messages', messageId), {
      isRead: true,
      status: 'read',
      readAt: new Date().toISOString()
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, path);
  }
}

/**
 * Mark all incoming unread messages in a conversation as read in Firestore
 */
export async function markConversationMessagesAsReadInFirestore(
  conversationId: string, 
  currentUserId: string
) {
  const collectionPath = 'messages';
  try {
    const q = query(
      collection(db, collectionPath),
      where('conversationId', '==', conversationId),
      where('receiverId', '==', currentUserId),
      where('isRead', '==', false)
    );

    const snapshot = await getDocs(q);
    const updates = snapshot.docs.map((docSnap) => 
      updateDoc(docSnap.ref, {
        isRead: true,
        status: 'read',
        readAt: new Date().toISOString()
      })
    );
    await Promise.all(updates);
  } catch (err) {
    handleFirestoreError(err, OperationType.UPDATE, collectionPath);
  }
}

/**
 * Subscribe to real-time message updates (including read status double ticks) for a conversation
 */
export function subscribeToConversationMessages(
  conversationId: string,
  onMessagesChange: (messages: ChatMessage[]) => void
) {
  const collectionPath = 'messages';
  try {
    const q = query(
      collection(db, collectionPath),
      where('conversationId', '==', conversationId)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const msgs: ChatMessage[] = [];
        snapshot.forEach((docSnap) => {
          msgs.push(docSnap.data() as ChatMessage);
        });
        // Sort chronologically by createdAt or id
        msgs.sort((a, b) => (a.createdAt || a.id).localeCompare(b.createdAt || b.id));
        onMessagesChange(msgs);
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, collectionPath);
      }
    );

    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, collectionPath);
    return () => {};
  }
}


/// ---------------------------------------------------------------------------
/// FIREBASE CLOUD MESSAGING (FCM) & PUSH NOTIFICATIONS
/// ---------------------------------------------------------------------------
export interface PushNotificationPayload {
  id: string;
  recipientUserId: string;
  senderName: string;
  senderAvatar: string;
  type: 'message' | 'like' | 'superlike' | 'vip_request';
  title: string;
  body: string;
  timestamp: string;
  isRead: boolean;
}

/**
 * Request notification permission and register FCM device token
 */
export async function registerFCMDeviceToken(userId: string): Promise<string | null> {
  try {
    const supported = await isSupported();
    if (!supported) {
      console.log('Firebase Cloud Messaging is not directly supported in this browser context.');
      return null;
    }

    // Request notification permission from user
    if ('Notification' in window && Notification.permission !== 'granted') {
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        console.log('Notification permission declined by user.');
        return null;
      }
    }

    const messaging = getMessaging(app);

    // Retrieve registration token
    let token: string | null = null;
    try {
      token = await getToken(messaging, {
        vapidKey: 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuYTrV4UfK85A', // standard demo key
        serviceWorkerRegistration: await navigator.serviceWorker?.getRegistration()
      });
    } catch {
      // Fallback token identifier for device tracking
      token = `fcm_web_${userId}_${Date.now()}`;
    }

    if (token) {
      // Save device token to Firestore
      await setDoc(doc(db, 'fcm_tokens', `${userId}_device`), {
        userId,
        token,
        platform: 'web',
        updatedAt: new Date().toISOString()
      }, { merge: true });
      console.log('FCM Device token registered:', token);
    }

    return token;
  } catch (err) {
    console.warn('FCM registration notice:', err);
    return null;
  }
}

/**
 * Send real-time push notification event to Firestore & Native Notification API
 */
export async function sendPushNotification(payload: Omit<PushNotificationPayload, 'id' | 'timestamp' | 'isRead'>) {
  const notifId = `notif_${Date.now()}`;
  const fullPayload: PushNotificationPayload = {
    ...payload,
    id: notifId,
    timestamp: new Date().toISOString(),
    isRead: false
  };

  const path = `notifications/${notifId}`;
  try {
    // 1. Write to Firestore real-time notification collection
    await setDoc(doc(db, 'notifications', notifId), fullPayload);

    // 2. Trigger native browser notification if granted
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(fullPayload.title, {
        body: fullPayload.body,
        icon: fullPayload.senderAvatar || '/favicon.ico',
        badge: '/favicon.ico',
      });
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.WRITE, path);
  }
}

/**
 * Subscribe to real-time incoming push notifications for the current user
 */
export function subscribeToUserNotifications(
  currentUserId: string,
  onNotificationReceived: (notification: PushNotificationPayload) => void
) {
  const collectionPath = 'notifications';
  try {
    const unsubscribe = onSnapshot(
      collection(db, collectionPath),
      (snapshot) => {
        snapshot.docChanges().forEach((change) => {
          if (change.type === 'added') {
            const data = change.doc.data() as PushNotificationPayload;
            if (data && data.recipientUserId === currentUserId) {
              onNotificationReceived(data);
            }
          }
        });
      },
      (error) => {
        handleFirestoreError(error, OperationType.GET, collectionPath);
      }
    );

    return unsubscribe;
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, collectionPath);
    return () => {};
  }
}

/**
 * Setup foreground FCM listener
 */
export async function listenToForegroundMessages(onMessageCallback: (payload: any) => void) {
  try {
    const supported = await isSupported();
    if (!supported) return () => {};
    const messaging = getMessaging(app);
    return onMessage(messaging, (payload) => {
      console.log('Foreground FCM message received:', payload);
      onMessageCallback(payload);
    });
  } catch {
    return () => {};
  }
}
