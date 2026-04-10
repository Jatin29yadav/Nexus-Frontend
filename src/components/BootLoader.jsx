import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";

const BootLoader = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [text, setText] = useState("INITIALIZING MAINFRAME...");

  useEffect(() => {
    // Fake progress bar logic
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval);
          return 100;
        }
        return prev + Math.floor(Math.random() * 15) + 5;
      });
    }, 150);

    // Text changing logic
    const timeout1 = setTimeout(() => setText("SYNCING SECURE COMMS..."), 800);
    const timeout2 = setTimeout(() => setText("WELCOME TO NEXUS."), 1600);

    // Unmount trigger after 2.5s
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 2500);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout1);
      clearTimeout(timeout2);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  return (
    <motion.div
      // Slide up animation when unmounting
      exit={{
        y: "-100%",
        transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1] },
      }}
      className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-black overflow-hidden"
    >
      {/* Background ambient glow */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
        className="absolute w-[40vw] h-[40vw] bg-purple-900/20 blur-[100px] rounded-full pointer-events-none"
      />

      <div className="relative z-10 flex flex-col items-center">
        {/* LOGO REVEAL */}
        <motion.img
          src="/Images/Logo.jpg" // 🚨 Make sure this is in your public folder
          alt="Nexus Logo"
          initial={{ scale: 0.8, opacity: 0, filter: "blur(10px)" }}
          animate={{ scale: 1, opacity: 1, filter: "blur(0px)" }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="w-32 md:w-48 mb-12 drop-shadow-[0_0_30px_rgba(168,85,247,0.5)]"
        />

        {/* LOADING BAR */}
        <div className="w-64 md:w-80 h-1 bg-white/10 rounded-full overflow-hidden mb-4 relative">
          <motion.div
            className="h-full bg-purple-500 shadow-[0_0_15px_rgba(168,85,247,1)]"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ ease: "linear", duration: 0.2 }}
          />
        </div>

        {/* CYBERPUNK TEXT */}
        <motion.div
          key={text}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-purple-500/80 font-mono text-[10px] uppercase tracking-[0.3em] font-black"
        >
          {text}
        </motion.div>
      </div>
    </motion.div>
  );
};

export default BootLoader;
