import { useState } from "react";
import "./App.css";
import Routing from "./Routing";
import { MessagingProvider } from "./context/MessagingContext";

function App() {
  return (
    <>
      <MessagingProvider>
        <Routing />
      </MessagingProvider>
    </>
  );
}

export default App;
