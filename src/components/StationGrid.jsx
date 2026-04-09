import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Gamepad2, CheckCircle2 } from "lucide-react";

const StationGrid = ({ maxSelectable, onFinalize }) => {
  const [stations, setStations] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [hoveredStation, setHoveredStation] = useState(null);

  // 📡 Mocking API Fetch - 60 Stations (50 PC + 10 Console)
  useEffect(() => {
    const generateStations = () => {
      const rows = ["A", "B", "C", "D", "E", "F"];
      const data = [];
      rows.forEach((row) => {
        for (let i = 1; i <= 10; i++) {
          data.push({
            id: `${row}-${i}`,
            name:
              row === "F" ? `Console-${i}` : `PC-${rows.indexOf(row) * 10 + i}`,
            type: row === "F" ? "Console" : "PC",
            status:
              Math.random() > 0.8
                ? "Occupied"
                : Math.random() > 0.95
                  ? "Maintenance"
                  : "Available",
            specs: "RTX 3080, i7-12700K, 32GB DDR5",
            games: "Valorant, GTA V, Apex Legends",
          });
        }
      });
      setStations(data);
    };
    generateStations();
  }, []);

  const handleSelect = (station) => {
    if (station.status !== "Available") return;

    if (selectedIds.includes(station.id)) {
      setSelectedIds(selectedIds.filter((id) => id !== station.id));
    } else {
      if (selectedIds.length < maxSelectable) {
        setSelectedIds([...selectedIds, station.id]);
      } else {
        // 🔄 BookMyShow Logic: Pehla wala remove, naya wala add
        setSelectedIds([...selectedIds.slice(1), station.id]);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-start md:justify-center min-h-screen bg-black p-3 md:p-6 pt-20 md:pt-6">
      {/* 🏆 Status Header */}
      <div className="mb-6 md:mb-10 text-center px-4">
        <h2 className="text-xl md:text-3xl font-black text-white tracking-tighter uppercase leading-none">
          Select <span className="text-purple-500">{maxSelectable}</span>{" "}
          Stations
        </h2>
        <p className="text-[9px] md:text-sm text-purple-400/50 font-bold mt-1 uppercase tracking-wider">
          {selectedIds.length === maxSelectable
            ? "Squad Ready! Deploy to base."
            : `Need ${maxSelectable - selectedIds.length} more to confirm.`}
        </p>
      </div>

      {/* 🗺️ The Grid Area - Optimized for 320px Mobile-S */}
      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-purple-500/20 rounded-3xl md:rounded-4xl p-3 md:p-10 shadow-[0_0_100px_rgba(168,85,247,0.05)]">
        {/* 🏷️ Responsive Legend */}
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 text-[8px] md:text-[10px] uppercase font-bold tracking-widest">
          <div className="flex items-center gap-1.5 text-purple-400">
            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />{" "}
            Available
          </div>
          <div className="flex items-center gap-1.5 text-red-900">
            <div className="w-2 h-2 rounded-full bg-red-900" /> Occupied
          </div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <div className="w-2 h-2 rounded-full bg-gray-700" /> Offline
          </div>
        </div>

        {/* 🔳 60-Station Grid - gap-1.5 is key for 320px screens */}
        <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5 md:gap-4">
          {stations.map((s) => {
            const isSelected = selectedIds.includes(s.id);
            const isAvailable = s.status === "Available";
            const isOccupied = s.status === "Occupied";
            const isMaintenance = s.status === "Maintenance";

            return (
              <div key={s.id} className="relative group">
                <motion.button
                  whileTap={isAvailable ? { scale: 0.9 } : {}}
                  onMouseEnter={() => isAvailable && setHoveredStation(s)}
                  onMouseLeave={() => setHoveredStation(null)}
                  onClick={() => handleSelect(s)}
                  className={`relative flex flex-col items-center justify-center w-full aspect-square rounded-lg md:rounded-xl border transition-all duration-300
                    ${isSelected ? "bg-purple-600 border-purple-400 shadow-[0_0_15px_rgba(168,85,247,0.5)] z-10 scale-105" : ""}
                    ${!isSelected && isAvailable ? "bg-purple-900/10 border-purple-500/10 hover:border-purple-500/40" : ""}
                    ${isOccupied ? "bg-red-900/10 border-red-900/30 cursor-not-allowed" : ""}
                    ${isMaintenance ? "bg-gray-800/20 border-gray-700/20 cursor-not-allowed" : ""}
                  `}
                >
                  {s.type === "PC" ? (
                    <Monitor
                      className={`w-3.5 h-3.5 md:w-6 md:h-6 ${isSelected ? "text-white" : isAvailable ? "text-purple-400" : "text-gray-700"}`}
                    />
                  ) : (
                    <Gamepad2
                      className={`w-3.5 h-3.5 md:w-6 md:h-6 ${isSelected ? "text-white" : isAvailable ? "text-purple-400" : "text-gray-700"}`}
                    />
                  )}
                  <span
                    className={`text-[7px] md:text-[10px] font-black mt-0.5 ${isSelected ? "text-white" : "text-purple-500/20"}`}
                  >
                    {s.id}
                  </span>
                </motion.button>

                {/* ℹ️ Hover Intelligence Tooltip */}
                <AnimatePresence>
                  {hoveredStation?.id === s.id &&
                    isAvailable &&
                    !isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-32 md:w-48 p-2 md:p-3 rounded-xl md:rounded-2xl bg-[#130f1d] border border-purple-500/30 shadow-2xl z-100 pointer-events-none"
                      >
                        <div className="text-[8px] md:text-[10px] text-purple-400 font-black uppercase mb-1">
                          Hardware Info
                        </div>
                        <div className="text-[7px] md:text-[9px] text-white/60 leading-tight">
                          <p className="mb-0.5 tracking-tight">⚡ {s.specs}</p>
                          <p className="tracking-tight">🎮 {s.games}</p>
                        </div>
                        <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 md:border-8 border-transparent border-t-[#130f1d]" />
                      </motion.div>
                    )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 🚀 Checkout Floating Action Button */}
      <AnimatePresence>
        {selectedIds.length === maxSelectable && (
          <motion.button
            initial={{ y: 50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 50, opacity: 0 }}
            onClick={() => onFinalize(selectedIds)}
            className="fixed bottom-6 md:bottom-10 flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3 md:px-10 md:py-4 rounded-xl md:rounded-2xl font-black text-xs md:text-lg shadow-[0_20px_40px_rgba(168,85,247,0.4)] transition-all z-200 uppercase tracking-widest"
          >
            Deploy Squad <CheckCircle2 className="w-4 h-4 md:w-6 md:h-6" />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StationGrid;
