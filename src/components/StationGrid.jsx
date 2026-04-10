import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Monitor, Gamepad2, CheckCircle2, Loader2 } from "lucide-react";
import useApi from "../hooks/useApi";
import { toast } from "sonner";

const StationGrid = ({ maxSelectable, onFinalize }) => {
  const api = useApi();
  const [stations, setStations] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [hoveredStation, setHoveredStation] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStations = async () => {
      try {
        const response = await api.get("/stations");
        if (response.data.success) {
          setStations(response.data.stations);
        }
      } catch (error) {
        console.error("Failed to fetch stations:", error);
        toast.error("Radar Offline: Could not sync with base.");
      } finally {
        setLoading(false);
      }
    };
    fetchStations();
  }, [api]);

  const handleSelect = (station) => {
    if (station.status !== "Available") return;

    if (selectedIds.includes(station.stationId)) {
      setSelectedIds(selectedIds.filter((id) => id !== station.stationId));
    } else {
      if (selectedIds.length < maxSelectable) {
        setSelectedIds([...selectedIds, station.stationId]);
      } else {
        // If they click another PC while max is reached, it shifts the selection
        setSelectedIds([...selectedIds.slice(1), station.stationId]);
      }
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-black">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin mb-4" />
        <div className="text-purple-500 font-black uppercase tracking-widest text-xs animate-pulse">
          Scanning Sector for Available Units...
        </div>
      </div>
    );
  }

  if (stations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[50vh] bg-black">
        <div className="text-red-500 font-black uppercase tracking-widest text-xs">
          No Stations Found in Database. Run Seed Script.
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-start md:justify-center min-h-screen bg-black p-3 md:p-6 pt-20 md:pt-6 pb-20">
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

      <div className="relative w-full max-w-5xl bg-[#0a0a0a] border border-purple-500/20 rounded-3xl md:rounded-4xl p-3 md:p-10 shadow-[0_0_100px_rgba(168,85,247,0.05)]">
        <div className="flex flex-wrap justify-center gap-4 md:gap-6 mb-8 text-[8px] md:text-[10px] uppercase font-bold tracking-widest">
          <div className="flex items-center gap-1.5 text-purple-400">
            <div className="w-2 h-2 rounded-full bg-purple-500 shadow-[0_0_8px_rgba(168,85,247,0.8)]" />{" "}
            Available
          </div>
          <div className="flex items-center gap-1.5 text-red-900">
            <div className="w-2 h-2 rounded-full bg-red-900" /> Occupied
          </div>
          <div className="flex items-center gap-1.5 text-gray-700">
            <div className="w-2 h-2 rounded-full bg-gray-700" /> Offline/Maint
          </div>
        </div>

        <div className="grid grid-cols-5 md:grid-cols-10 gap-1.5 md:gap-4">
          {stations.map((s) => {
            const isSelected = selectedIds.includes(s.stationId);
            const isAvailable = s.status === "Available";
            const isOccupied = s.status === "Occupied";
            const isMaintenance =
              s.status === "Maintenance" || s.status === "Offline";

            return (
              <div key={s._id || s.stationId} className="relative group">
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
                    className={`text-[7px] md:text-[8px] font-black mt-1 ${isSelected ? "text-white" : isAvailable ? "text-purple-500/60" : "text-gray-600"}`}
                  >
                    {s.stationId}
                  </span>
                </motion.button>

                <AnimatePresence>
                  {hoveredStation?.stationId === s.stationId &&
                    isAvailable &&
                    !isSelected && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        className="absolute bottom-full left-1/2 -translate-x-1/2 mb-3 w-32 md:w-48 p-2 md:p-3 rounded-xl md:rounded-2xl bg-[#130f1d] border border-purple-500/30 shadow-2xl z-50 pointer-events-none"
                      >
                        <div className="text-[8px] md:text-[10px] text-purple-400 font-black uppercase mb-1">
                          Hardware Info
                        </div>
                        <div className="text-[7px] md:text-[9px] text-white/60 leading-tight">
                          <p className="mb-0.5 tracking-tight">
                            ⚡{" "}
                            {s.type === "PC"
                              ? "RTX 3080, i7, 32GB"
                              : "Next-Gen Console"}
                          </p>
                          <p className="tracking-tight">
                            🎮{" "}
                            {s.type === "PC"
                              ? "Valorant, GTA V, CS2"
                              : "FIFA, Mortal Kombat"}
                          </p>
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

      {/* 🚨 NEW OVERLAY POPUP FOR CONFIRMATION */}
      <AnimatePresence>
        {selectedIds.length === maxSelectable && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-1000 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0a0a0a] border border-purple-500/30 w-full max-w-sm p-8 rounded-[2.5rem] text-center shadow-[0_0_80px_rgba(168,85,247,0.15)]"
            >
              <div className="w-20 h-20 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-purple-500/20">
                <CheckCircle2 className="text-4xl text-purple-500" />
              </div>

              <h2 className="text-2xl font-black uppercase text-white mb-2 tracking-tighter">
                Squad <span className="text-purple-500">Ready</span>
              </h2>
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-8 px-2">
                Selected Units:{" "}
                <span className="text-purple-400">
                  {selectedIds.join(", ")}
                </span>
              </p>

              <div className="flex flex-col gap-3">
                <button
                  onClick={() => onFinalize(selectedIds)}
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-[0_10px_20px_rgba(168,85,247,0.3)] transition-all"
                >
                  Confirm Deployment
                </button>
                <button
                  onClick={() => setSelectedIds(selectedIds.slice(0, -1))}
                  className="w-full bg-white/5 hover:bg-white/10 text-white py-4 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all"
                >
                  Modify Selection
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default StationGrid;
