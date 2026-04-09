import React from "react";
import { motion } from "framer-motion";

const GridStagger = ({ children }) => {
  const columns = 5;

  // 🎬 Cinematic easing curve (Expo In-Out) for a very premium, smooth feel
  const ease = [0.76, 0, 0.24, 1];
  const duration = 0.85;

  return (
    <>
      <div className="fixed inset-0 z-9999 pointer-events-none flex">
        {[...Array(columns)].map((_, i) => (
          <motion.div
            key={i}
            // 🌌 Deep dark-to-purple gradient with an ambient shadow
            className="relative h-full w-full bg-linear-to-b from-[#050505] via-purple-900/60 to-[#050505] shadow-[0_0_50px_rgba(168,85,247,0.15)] overflow-hidden"
            // ⬇️ Downward sweeping motion logic
            initial={{ top: 0, height: "100vh" }}
            animate={{ top: "100vh", height: 0 }} // Slides down to reveal new page
            exit={{ top: 0, height: "100vh" }} // Grows back up to cover old page
            transition={{
              duration: duration,
              ease: ease,
              delay: i * 0.06, // Tighter stagger delay for a cohesive wave
            }}
          >
            {/* ✨ The Subtle Edge Glow Effect */}
            <div className="absolute inset-y-0 right-0 w-px bg-linear-to-b from-transparent via-purple-400/60 to-transparent shadow-[0_0_15px_rgba(168,85,247,0.8)]" />
          </motion.div>
        ))}
      </div>

      {/* 📄 Page Content Fade & Blur Reveal */}
      <motion.div
        initial={{ opacity: 0, filter: "blur(8px)", y: 20 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        exit={{ opacity: 0, filter: "blur(8px)", y: -20 }}
        transition={{ duration: 0.6, delay: 0.45, ease: "easeOut" }}
      >
        {children}
      </motion.div>
    </>
  );
};

// 🌟 FINAL EXPORT (Only Grid Stagger remains)
export const PageTransition = ({ children }) => {
  return <GridStagger>{children}</GridStagger>;
};
