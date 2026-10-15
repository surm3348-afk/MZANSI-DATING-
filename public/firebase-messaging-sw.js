// Firebase Cloud Messaging Service Worker for Mzansi Dating
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.14.0/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyDivuiKSahOvYs1k7NR5fBZcYV85wN4k8o",
  projectId: "synthetic-diorama-ct86m",
  messagingSenderId: "491370438849",
  appId: "1:491370438849:web:c605edc14e579c7e0bf440"
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);
  const notificationTitle = payload.notification ? payload.notification.title : 'Mzansi Dating';
  const notificationOptions = {
    body: payload.notification ? payload.notification.body : 'You have a new update in Mzansi Dating.',
    icon: '/favicon.ico',
    badge: '/favicon.ico',
    data: payload.data
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
