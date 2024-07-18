import { useState } from "react";
import "./App.css";
import Routing from "./Routing";
import { MessagingProvider } from "./context/MessagingContext";
import NotificationComponent from "./components/NotificationComponent";

function App() {
  return (
    <>
      <MessagingProvider>
        <NotificationComponent />
        <Routing />
      </MessagingProvider>
    </>
  );
}

export default App;
