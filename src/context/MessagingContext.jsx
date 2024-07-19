import React, { createContext, useContext, useEffect, useState } from "react";
import { messaging } from "../config/firebase";
import { getToken, onMessage } from "firebase/messaging";
import { confirmAlert } from "react-confirm-alert";
import { useAuth } from "./AuthContext";
import "react-confirm-alert/src/react-confirm-alert.css";

const MessagingContext = createContext();

export const useMessaging = () => useContext(MessagingContext);

export const MessagingProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    async function requestPermission() {
      console.log("Requesting notification permission...");
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        console.log("Notification permission granted.");
        try {
          console.log("Attempting to retrieve FCM token...");
          const currentToken = await getToken(messaging, {
            vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY,
          });
          if (currentToken) {
            setToken(currentToken);
            console.log("FCM Token retrieved:", currentToken);
            await sendTokenToServer(currentToken);
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

    onMessage(messaging, (payload) => {
      console.log("Message received from backend:", payload);
      confirmAlert({
        title: payload.notification.title,
        message: payload.notification.body,
        buttons: [
          {
            label: "OK",
            onClick: () => {},
          },
        ],
      });
    });
  }, [user]);

  const sendNotification = (notification) => {
    console.log("Sending notification:", notification);
    confirmAlert({
      title: notification.title,
      message: notification.body,
      buttons: [
        {
          label: "OK",
          onClick: () => {},
        },
      ],
    });
  };

  const sendTokenToServer = async (token) => {
    console.log("Sending FCM token to server:", token);
    try {
      const response = await fetch("/api/store-fcm-token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, userId: user._id }), // Replace with actual user ID
      });
      if (!response.ok) {
        throw new Error("Failed to store FCM token");
      }
      console.log("FCM token successfully sent to server");
    } catch (error) {
      console.error("Error sending FCM token to server:", error);
    }
  };

  return (
    <MessagingContext.Provider value={{ token, sendNotification }}>
      {children}
    </MessagingContext.Provider>
  );
};
