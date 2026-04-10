import React, { useState } from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./index.css";
import { AnimatePresence } from "framer-motion";
import BootLoader from "./components/BootLoader.jsx";

// 🚨 FIX: Changed to AuthProvider to match your context file exactly
import { AuthProvider } from "./context/AuthContext.jsx";

const RootComponent = () => {
  const [isBooting, setIsBooting] = useState(() => {
    const hasBooted = sessionStorage.getItem("nexus_booted");
    return !hasBooted;
  });

  const handleBootComplete = () => {
    setIsBooting(false);
    sessionStorage.setItem("nexus_booted", "true");
  };

  return (
    <>
      <AnimatePresence mode="wait">
        {isBooting && <BootLoader onComplete={handleBootComplete} />}
      </AnimatePresence>

      {/* 🚨 FIX: Using AuthProvider here as well */}
      <AuthProvider>
        <App />
      </AuthProvider>
    </>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RootComponent />
  </React.StrictMode>,
);
