import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import "./index.css";
import { MessagingProvider } from "./context/MessagingContext";
import { OrdersProvider } from "./context/OrdersContext";
import { CategoryProvider } from "./context/CategoryContext";
import { CartProvider } from "./context/CartContext";
import { AuthProvider } from "./context/AuthContext";

if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((registration) => {
      console.log("Service Worker registered with scope:", registration.scope);
    })
    .catch((err) => {
      console.error("Service Worker registration failed:", err);
    });
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <CategoryProvider>
          <MessagingProvider>
            <OrdersProvider>
              <App />
            </OrdersProvider>
          </MessagingProvider>
        </CategoryProvider>
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>,
);
