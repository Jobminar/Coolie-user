import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Check if root is already created
let root;
const container = document.getElementById("root");

if (!container._reactRootContainer) {
  root = ReactDOM.createRoot(container);
} else {
  root = container._reactRootContainer._internalRoot.current.child.stateNode;
}

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
