import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoTimeOutline,
  IoCalendarOutline,
  IoFlashOutline,
  IoChevronDownOutline,
} from "react-icons/io5";

const HUDTimePicker = ({ playerCount, onDataUpdate }) => {
  const [selectedDate, setSelectedDate] = useState("Today");
  const [duration, setDuration] = useState(1);
  const [time, setTime] = useState("09:00");
  const [period, setPeriod] = useState("PM"); // AM or PM
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const times = [
    "01:00",
    "01:15",
    "01:30",
    "01:45",
    "02:00",
    "02:15",
    "02:30",
    "02:45",
    "03:00",
    "03:15",
    "03:30",
    "03:45",
    "04:00",
    "04:15",
    "04:30",
    "04:45",
    "05:00",
    "05:15",
    "05:30",
    "05:45",
    "06:00",
    "06:15",
    "06:30",
    "06:45",
    "07:00",
    "07:15",
    "07:30",
    "07:45",
    "08:00",
    "08:15",
    "08:30",
    "08:45",
    "09:00",
    "09:15",
    "09:30",
    "09:45",
    "10:00",
    "10:15",
    "10:30",
    "10:45",
    "11:00",
    "11:15",
    "11:30",
    "11:45",
    "12:00",
    "12:15",
    "12:30",
    "12:45",
  ];

  const hourlyRate = 100;
  const totalPrice = playerCount * duration * hourlyRate;

  const get24hTime = (t, p) => {
    let [h, m] = t.split(":");
    if (p === "PM" && h !== "12") h = parseInt(h) + 12;
    if (p === "AM" && h === "12") h = "00";
    return `${h}:${m}`;
  };

  useEffect(() => {
    onDataUpdate({
      selectedDate,
      duration,
      startTime: get24hTime(time, period),
      totalPrice,
    });
  }, [selectedDate, duration, time, period, playerCount]);

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-purple-500 uppercase ml-2 flex items-center gap-2 tracking-widest">
          <IoCalendarOutline /> Deployment Date
        </label>
        <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
          {["Today", "Tomorrow", "08 April", "09 April"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setSelectedDate(d)}
              className={`shrink-0 px-5 py-2.5 rounded-xl border text-[11px] font-bold transition-all ${
                selectedDate === d
                  ? "bg-purple-600 border-purple-400 shadow-lg"
                  : "bg-purple-900/10 border-purple-500/10 text-purple-300/40"
              }`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-purple-500 uppercase ml-2 flex items-center gap-2 tracking-widest">
          <IoTimeOutline /> Start Time
        </label>

        <div className="flex gap-2 h-12 md:h-14">
          <div className="relative grow">
            <button
              type="button"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="w-full h-full bg-purple-900/10 border border-purple-500/20 rounded-xl px-4 flex items-center justify-between text-sm font-bold text-white focus:border-purple-500 transition-all"
            >
              {time}{" "}
              <IoChevronDownOutline
                className={`transition-transform ${isDropdownOpen ? "rotate-180" : ""}`}
              />
            </button>

            <AnimatePresence>
              {isDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="absolute bottom-full mb-2 w-full max-h-48 overflow-y-auto bg-[#1a1625] border border-purple-500/30 rounded-xl z-200 scrollbar-thin scrollbar-thumb-purple-600"
                >
                  {times.map((t) => (
                    <div
                      key={t}
                      onClick={() => {
                        setTime(t);
                        setIsDropdownOpen(false);
                      }}
                      className="px-4 py-3 text-sm font-bold hover:bg-purple-600 cursor-pointer transition-colors border-b border-white/5 last:border-none"
                    >
                      {t}
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className="flex bg-purple-900/20 rounded-xl p-1 border border-purple-500/10 w-28 md:w-32">
            {["AM", "PM"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setPeriod(p)}
                className={`flex-1 rounded-lg text-[10px] md:text-xs font-black transition-all ${
                  period === p
                    ? "bg-purple-600 text-white shadow-md"
                    : "text-purple-400/40 hover:text-purple-400"
                }`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-purple-500 uppercase ml-2 flex items-center gap-2 tracking-widest">
          <IoFlashOutline /> Duration
        </label>
        <div className="grid grid-cols-5 gap-1.5 md:gap-2">
          {[1, 2, 3, 4, 10].map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setDuration(h)}
              className={`py-3 rounded-xl border text-xs font-black transition-all ${
                duration === h
                  ? "bg-purple-600 border-purple-400 shadow-lg"
                  : "bg-purple-900/10 border-purple-500/10 text-purple-300/40"
              }`}
            >
              {h}H
            </button>
          ))}
        </div>
      </div>

      <div className="p-4 rounded-2xl bg-purple-900/10 border border-purple-500/20 text-center">
        <div className="text-[9px] font-black text-purple-400 uppercase tracking-widest">
          Estimated Cost
        </div>
        <div className="text-3xl font-black text-white italic">
          ₹{totalPrice}
        </div>
      </div>
    </div>
  );
};

export default HUDTimePicker;
