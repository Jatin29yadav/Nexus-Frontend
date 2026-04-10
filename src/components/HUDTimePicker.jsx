import React, { useState, useEffect } from "react";
import {
  IoCalendarOutline,
  IoTimeOutline,
  IoFlashOutline,
} from "react-icons/io5";

const HUDTimePicker = ({ playerCount, onDataUpdate }) => {
  const [data, setData] = useState({
    selectedDate: "Today",
    startTime: "09:00",
    period: "PM",
    duration: 1,
  });

  const timeSlots = [
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

  useEffect(() => {
    let [h, m] = data.startTime.split(":");
    if (data.period === "PM" && h !== "12") h = parseInt(h) + 12;
    if (data.period === "AM" && h === "12") h = "00";

    const formattedStartTime = `${h}:${m}`;
    const totalPrice = playerCount * data.duration * 100;

    onDataUpdate({
      selectedDate: data.selectedDate,
      startTime: formattedStartTime,
      duration: data.duration,
      totalPrice: totalPrice,
    });
  }, [data, playerCount]);

  return (
    <div className="space-y-6 mt-6">
      <div className="space-y-2">
        <label className="text-[10px] font-black text-purple-500 uppercase ml-2 flex items-center gap-2 tracking-widest">
          <IoCalendarOutline /> Deployment Date
        </label>
        <div className="flex gap-2">
          {["Today", "Tomorrow"].map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => setData({ ...data, selectedDate: d })}
              className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${data.selectedDate === d ? "bg-purple-600 border-purple-400 text-white shadow-lg" : "bg-purple-900/10 border-purple-500/20 text-purple-300/40"}`}
            >
              {d}
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-purple-500 uppercase ml-2 flex items-center gap-2 tracking-widest">
          <IoTimeOutline /> Start Window
        </label>
        <div className="flex gap-2">
          <select
            value={data.startTime}
            onChange={(e) => setData({ ...data, startTime: e.target.value })}
            className="grow bg-purple-900/10 border border-purple-500/20 rounded-xl px-4 py-3 outline-none focus:border-purple-500 text-sm font-bold text-white appearance-none cursor-pointer"
          >
            {timeSlots.map((t) => (
              <option key={t} value={t} className="bg-gray-900">
                {t}
              </option>
            ))}
          </select>
          <div className="flex bg-purple-900/20 rounded-xl p-1 border border-purple-500/20 w-28">
            {["AM", "PM"].map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => setData({ ...data, period: p })}
                className={`flex-1 rounded-lg text-[10px] font-black transition-all ${data.period === p ? "bg-purple-600 text-white shadow-md" : "text-purple-400/40"}`}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <label className="text-[10px] font-black text-purple-500 uppercase ml-2 flex items-center gap-2 tracking-widest">
          <IoFlashOutline /> Duration (Hours)
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4].map((h) => (
            <button
              key={h}
              type="button"
              onClick={() => setData({ ...data, duration: h })}
              className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${data.duration === h ? "bg-purple-600 border-purple-400 text-white shadow-lg" : "bg-purple-900/10 border-purple-500/20 text-purple-300/40"}`}
            >
              {h}H
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HUDTimePicker;
