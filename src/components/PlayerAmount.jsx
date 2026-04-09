import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IoArrowForwardOutline } from "react-icons/io5";

const PlayerSAmount = ({ onSelectionComplete }) => {
  const [count, setCount] = useState(1);

  return (
    <div className="fixed inset-0 z-150 flex h-screen w-screen items-center justify-center bg-black">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative flex w-[90%] max-w-md flex-col items-center rounded-[2.5rem] border border-purple-500/20 bg-[#0a0a0a] p-10 shadow-[0_0_80px_rgba(168,85,247,0.15)] md:w-full"
      >
        <h2 className="mb-2 text-center text-xl font-bold tracking-widest text-white md:text-2xl">
          SELECT SQUAD SIZE
        </h2>
        <p className="mb-10 text-center text-sm font-medium text-purple-400/50 md:text-base">
          How Many Legend's Are Joining?
        </p>

        <div className="relative mb-12 flex h-32 w-32 items-center justify-center md:h-40 md:w-40">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute h-full w-full rounded-full border-2 border-dashed border-white/60"
          />

          <div className="relative flex h-[85%] w-[85%] items-center justify-center rounded-full border-2 border-purple-500 bg-purple-500/5 shadow-[0_0_30px_rgba(168,85,247,0.4)]">
            <AnimatePresence mode="wait">
              <motion.span
                key={count}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.5, opacity: 0 }}
                className="text-5xl font-black text-white md:text-6xl"
              >
                {count}
              </motion.span>
            </AnimatePresence>
          </div>
        </div>

        <div className="mb-10 w-full px-2 sm:px-4">
          <input
            type="range"
            min="1"
            max="10"
            step="1"
            value={count}
            onChange={(e) => setCount(parseInt(e.target.value))}
            className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-purple-900/30 accent-purple-500 outline-none transition-all"
            style={{
              background: `linear-gradient(to right, #a855f7 0%, #a855f7 ${(count - 1) * 11.11}%, #1e1b4b ${(count - 1) * 11.11}%, #1e1b4b 100%)`,
            }}
          />

          <div className="mt-4 flex justify-between px-0.5">
            {[...Array(10)].map((_, i) => {
              const num = i + 1;
              const isActive = count === num;
              return (
                <span
                  key={num}
                  className={`text-[10px] sm:text-xs font-bold transition-all duration-300 ${
                    isActive
                      ? "text-purple-400 scale-125 shadow-purple-500/50 drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]"
                      : "text-purple-400/20"
                  }`}
                >
                  {num < 10 ? `0${num}` : num}
                </span>
              );
            })}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={() => onSelectionComplete(count)}
          className="group flex w-full items-center justify-center 
             gap-2 sm:gap-3 
             rounded-xl sm:rounded-2xl 
             bg-purple-600 
             py-3 sm:py-4 
             px-4 
             text-sm min-[375px]:text-base sm:text-lg 
             font-bold text-white 
             shadow-[0_10px_20px_rgba(168,85,247,0.3)] 
             transition-all hover:bg-purple-500 
             active:scale-95 
             whitespace-nowrap"
        >
          <span className="shrink-0">
            CONFIRM {count} {count === 1 ? "PLAYER" : "PLAYERS"}
          </span>
          <IoArrowForwardOutline className="shrink-0 text-lg transition-transform group-hover:translate-x-1 sm:text-xl" />
        </motion.button>

        <div className="pointer-events-none absolute -right-10 -top-10 h-32 w-32 rounded-full bg-purple-600/5 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-purple-600/5 blur-3xl" />
      </motion.div>
    </div>
  );
};

export default PlayerSAmount;
