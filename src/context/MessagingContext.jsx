import React, { createContext, useContext, useEffect, useState } from "react";
import { messaging } from "../config/firebase";
import { getToken, onMessage } from "firebase/messaging";

const MessagingContext = createContext();

export const useMessaging = () => useContext(MessagingContext);

export const MessagingProvider = ({ children }) => {
  const [token, setToken] = useState(null);

  useEffect(() => {
    async function requestPermission() {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
        try {
          const currentToken = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          });
          if (currentToken) {
            setToken(currentToken);
            console.log("FCM Token:", currentToken);
            // Send token to your server to store it for future notifications
          } else {
            console.log(
              "No registration token available. Request permission to generate one.",
            );
          }
        } catch (error) {
          console.log("An error occurred while retrieving token. ", error);
        }
      } else {
        console.log("Notification permission denied.");
      }
    }

    requestPermission();

    // Handle incoming messages. Called when:
    // - a message is received while the app has focus
    // - the user clicks on an app notification created by a service worker
    //   `messaging.onBackgroundMessage` handler.
    onMessage(messaging, (payload) => {
      console.log("Message received. ", payload);
      // You can update your UI or display a notification here.
    });
  }, []);

  return (
    <MessagingContext.Provider value={{ token }}>
      {children}
    </MessagingContext.Provider>
  );
};
