import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { MessagingProvider } from "./context/MessagingContext.jsx";
import "./index.css";

if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    const swUrl = `/firebase-messaging-sw.js?apiKey=${
      import.meta.env.VITE_FIREBASE_API_KEY
    }&authDomain=${import.meta.env.VITE_FIREBASE_AUTH_DOMAIN}&projectId=${
      import.meta.env.VITE_FIREBASE_PROJECT_ID
    }&storageBucket=${
      import.meta.env.VITE_FIREBASE_STORAGE_BUCKET
    }&messagingSenderId=${
      import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID
    }&appId=${import.meta.env.VITE_FIREBASE_APP_ID}&measurementId=${
      import.meta.env.VITE_FIREBASE_MEASUREMENT_ID
    }`;

    navigator.serviceWorker
      .register(swUrl)
      .then((registration) => {
        console.log(
          "Service Worker registered with scope:",
          registration.scope,
        );
      })
      .catch((error) => {
        console.error("Service Worker registration failed:", error);
      });
  });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <MessagingProvider>
      <App />
    </MessagingProvider>
  </React.StrictMode>,
);
