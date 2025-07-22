import { initializeApp, getApps, getApp } from "firebase/app";
import {
  getMessaging,
  getToken,
  onMessage,
  isSupported,
} from "firebase/messaging";
import { getAuth } from "firebase/auth";
const firebaseConfig = {
  apiKey: "AIzaSyDw7V2e7r8HXuiQuSjk_Q_v4dm3k1P5rIs",
	authDomain: "indianmarketstore.firebaseapp.com",
	projectId: "indianmarketstore",
	storageBucket: "indianmarketstore.appspot.com",
	messagingSenderId: "194760754243",
	appId: "1:194760754243:web:1dbe4d94ef8d99c72d40f6",
	measurementId: "G-F8J8VL20XT",
};
const firebaseApp = !getApps().length
  ? initializeApp(firebaseConfig)
  : getApp();
const messaging = (async () => {
  try {
    const isSupportedBrowser = await isSupported();
    if (isSupportedBrowser) {
      return getMessaging(firebaseApp);
    }
    return null;
  } catch (err) {
    return null;
  }
})();

export const fetchToken = async (setTokenFound, setFcmToken) => {
  return getToken(await messaging, {
    vapidKey: "BOf451Qrk-e6xGsBOxoK0rJhIFNwkjz3XzAltZ-HvBdVIhnGL3rUw0_RdyAPOkEzChZ0jazF15dChVQqQgC1ieE",
  })
    .then((currentToken) => {
      if (currentToken) {
        setTokenFound(true);
        setFcmToken(currentToken);

        // Track the token -> client mapping, by sending to backend server
        // show on the UI that permission is secured
      } else {
        setTokenFound(false);
        setFcmToken();
        // shows on the UI that permission is required
      }
    })
    .catch((err) => {
      console.error(err);
      // catch error while creating client token
    });
};

export const onMessageListener = async () =>
  new Promise((resolve) =>
    (async () => {
      const messagingResolve = await messaging;
      onMessage(messagingResolve, (payload) => {
        resolve(payload);
      });
    })()
  );
export const auth = getAuth(firebaseApp);
