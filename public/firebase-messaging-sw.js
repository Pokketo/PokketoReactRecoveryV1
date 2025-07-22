importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);
// // Initialize the Firebase app in the service worker by passing the generated config
const firebaseConfig = {
  apiKey: "AIzaSyDw7V2e7r8HXuiQuSjk_Q_v4dm3k1P5rIs",
	authDomain: "indianmarketstore.firebaseapp.com",
	projectId: "indianmarketstore",
	storageBucket: "indianmarketstore.appspot.com",
	messagingSenderId: "194760754243",
	appId: "1:194760754243:web:1dbe4d94ef8d99c72d40f6",
	measurementId: "G-F8J8VL20XT",
};

firebase?.initializeApp(firebaseConfig);

// Retrieve firebase messaging
const messaging = firebase?.messaging();

messaging.onBackgroundMessage(function (payload) {
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
