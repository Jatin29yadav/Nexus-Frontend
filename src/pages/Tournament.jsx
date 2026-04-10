import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import TournamentRegistrationModal from "../components/TournamentRegistrationModal";
import useApi from "../hooks/useApi";
import { toast } from "sonner";
import {
  IoTrophyOutline,
  IoAddOutline,
  IoCalendarOutline,
  IoInformationCircleOutline,
  IoRocketOutline,
  IoCloseOutline,
  IoTimeOutline,
  IoPeopleOutline,
} from "react-icons/io5";

const Tournaments = () => {
  const { user } = useContext(AuthContext);
  const api = useApi();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);
  const [actionLoading, setActionLoading] = useState(false);

  // 🛠️ CUSTOM UI STATES FOR DATE/TIME
  const [formData, setFormData] = useState({
    title: "",
    game: "",
    description: "",
    maxTeams: 16,
    selectedDate: new Date(),
    startTime: "12:00",
    endTime: "18:00",
  });

  // Generate next 14 days for selection
  const upcomingDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  // Generate 24-hour time slots (every 30 mins)
  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hours}:${minutes}`;
  });

  const fetchTournaments = async () => {
    try {
      const response = await api.get("/tournaments");
      if (response.data.success) setTournaments(response.data.tournaments);
    } catch (error) {
      toast.error("Failed to fetch tournaments");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournaments();
  }, [api]);

  const handleEnlistClick = (tournament) => {
    setSelectedTournament(tournament);
    setIsRegisterOpen(true);
  };

  // 🛡️ ADMIN: Create Tournament Function
  const handleCreateTournament = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      // Logic to combine Date and Time into ISO string
      const start = new Date(formData.selectedDate);
      const [sH, sM] = formData.startTime.split(":");
      start.setHours(parseInt(sH), parseInt(sM), 0);

      const end = new Date(formData.selectedDate);
      const [eH, eM] = formData.endTime.split(":");
      end.setHours(parseInt(eH), parseInt(eM), 0);

      const payload = {
        title: formData.title,
        game: formData.game,
        description: formData.description,
        maxTeams: formData.maxTeams,
        eventTime: { start: start.toISOString(), end: end.toISOString() },
      };

      await api.post("/tournaments", payload);
      toast.success("TOURNAMENT DEPLOYED SUCCESSFULLY!");
      setIsAdminOpen(false);
      fetchTournaments();
    } catch (error) {
      toast.error(error.response?.data?.message || "Deployment Failed");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden selection:bg-purple-500/30">
      <div className="absolute top-0 left-0 w-[125vw] h-[125vw] sm:w-125 sm:h-125 bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-4xl md:text-5xl font-black uppercase tracking-tighter flex items-center gap-3">
              <IoTrophyOutline className="text-purple-500" /> Pro{" "}
              <span className="text-purple-500">Circuit</span>
            </h1>
            <p className="text-purple-400/50 font-bold text-xs uppercase tracking-widest mt-1">
              Compete for glory and credits
            </p>
          </motion.div>

          {user?.role === "Admin" && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_0_15px_rgba(234,179,8,0.2)]"
            >
              <IoAddOutline className="text-lg" /> Deploy Tournament
            </motion.button>
          )}
        </div>

        {loading ? (
          <div className="text-purple-500 text-center animate-pulse font-black uppercase tracking-widest">
            Fetching Circuit Data...
          </div>
        ) : tournaments.length === 0 ? (
          <div className="text-gray-500 text-center font-bold uppercase tracking-widest bg-[#0a0a0a] border border-white/5 p-10 rounded-3xl">
            No active tournaments found in the database.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {tournaments.map((t) => {
              const filledSlots = t.registeredTeams?.length || 0;
              return (
                <motion.div
                  key={t._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#0a0a0a] border border-purple-500/20 rounded-3xl shadow-[0_0_30px_rgba(168,85,247,0.05)] hover:border-purple-500/50 transition-all group flex flex-col overflow-hidden"
                >
                  <div className="h-40 sm:h-48 w-full relative overflow-hidden bg-purple-900/20 flex items-center justify-center">
                    <IoTrophyOutline className="text-6xl text-purple-500/20" />
                    <div className="absolute top-4 left-4 z-20 bg-purple-600/80 backdrop-blur-md px-3 py-1 rounded-md text-[10px] font-black uppercase tracking-widest text-white border border-purple-400/50">
                      {t.game}
                    </div>
                  </div>

                  <div className="p-5 sm:p-6 flex flex-col grow">
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="text-lg sm:text-xl font-black uppercase tracking-tight leading-tight">
                        {t.title}
                      </h3>
                      <div className="bg-purple-900/30 border border-purple-500/30 px-2 py-1 rounded-md text-[10px] sm:text-xs font-black text-purple-300 whitespace-nowrap ml-2">
                        {filledSlots}/{t.maxTeams} TEAMS
                      </div>
                    </div>

                    <div className="space-y-2 mb-6 grow text-xs font-bold text-gray-400">
                      <p className="flex items-center gap-3">
                        <IoCalendarOutline className="text-purple-500 text-base" />{" "}
                        Date:{" "}
                        <span className="text-white">
                          {new Date(t.eventTime.start).toLocaleDateString()}
                        </span>
                      </p>
                    </div>

                    <div className="flex gap-2 sm:gap-3 mt-auto">
                      <Link
                        to={`/tournament/${t._id}`}
                        className="flex-1 flex justify-center items-center gap-1.5 bg-transparent hover:bg-purple-900/20 border border-purple-500/30 hover:border-purple-500 text-white py-3 sm:py-3.5 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all"
                      >
                        <IoInformationCircleOutline className="text-sm sm:text-base" />{" "}
                        Intel
                      </Link>
                      <button
                        onClick={() => handleEnlistClick(t)}
                        disabled={filledSlots >= t.maxTeams}
                        className="flex-[1.5] flex justify-center items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white py-3 sm:py-3.5 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <IoRocketOutline className="text-sm sm:text-base" />{" "}
                        {filledSlots >= t.maxTeams ? "Roster Full" : "Enlist"}
                      </button>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <TournamentRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        tournament={selectedTournament}
      />

      {/* 🛡️ PREMIUM ADMIN MODAL: CREATE TOURNAMENT */}
      <AnimatePresence>
        {isAdminOpen && user?.role === "Admin" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-500 flex items-center justify-center bg-black/90 backdrop-blur-md p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0a0a0a] border border-yellow-500/30 w-full max-w-2xl p-6 sm:p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(234,179,8,0.1)] relative max-h-[90vh] overflow-y-auto scrollbar-hide"
            >
              <button
                onClick={() => setIsAdminOpen(false)}
                className="absolute top-6 right-6 text-yellow-500/50 hover:text-yellow-500 text-2xl transition-colors"
              >
                <IoCloseOutline />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-black uppercase text-white tracking-tighter flex items-center gap-3">
                  <IoAddOutline className="text-yellow-500" /> New{" "}
                  <span className="text-yellow-500">Operation</span>
                </h2>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">
                  Initialize Pro-Circuit Deployment
                </p>
              </div>

              <form onSubmit={handleCreateTournament} className="space-y-8">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Mission Title
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.title}
                      onChange={(e) =>
                        setFormData({ ...formData, title: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-yellow-500 outline-none transition-all"
                      placeholder="VALORANT MASTERS"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Combat Game
                    </label>
                    <input
                      required
                      type="text"
                      value={formData.game}
                      onChange={(e) =>
                        setFormData({ ...formData, game: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-yellow-500 outline-none transition-all"
                      placeholder="VALORANT"
                    />
                  </div>
                </div>

                {/* Squad Count & Description */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1 flex items-center gap-1">
                      <IoPeopleOutline /> Max Squads
                    </label>
                    <input
                      required
                      type="number"
                      value={formData.maxTeams}
                      onChange={(e) =>
                        setFormData({ ...formData, maxTeams: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-yellow-500 outline-none transition-all"
                      min="2"
                    />
                  </div>
                  <div className="md:col-span-2 space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Briefing / Intel
                    </label>
                    <input
                      required
                      value={formData.description}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          description: e.target.value,
                        })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-yellow-500 outline-none transition-all"
                      placeholder="Rules of engagement..."
                    />
                  </div>
                </div>

                {/* 📅 PREMIUM DATE SELECTOR */}
                <div className="space-y-3">
                  <label className="text-[10px] font-black text-yellow-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <IoCalendarOutline /> Deployment Date
                  </label>
                  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {upcomingDays.map((date, idx) => {
                      const isSelected =
                        formData.selectedDate.toDateString() ===
                        date.toDateString();
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setFormData({ ...formData, selectedDate: date })
                          }
                          className={`shrink-0 w-20 h-24 rounded-2xl border flex flex-col items-center justify-center transition-all ${isSelected ? "bg-yellow-500 border-yellow-400 text-black shadow-[0_0_20px_rgba(234,179,8,0.3)] scale-105" : "bg-white/5 border-white/10 text-gray-400 hover:border-yellow-500/50"}`}
                        >
                          <span className="text-[10px] font-black uppercase mb-1">
                            {date.toLocaleString("en-US", { weekday: "short" })}
                          </span>
                          <span className="text-xl font-black">
                            {date.getDate()}
                          </span>
                          <span className="text-[8px] font-bold uppercase mt-1">
                            {date.toLocaleString("en-US", { month: "short" })}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* 🕒 PREMIUM TIME SELECTOR */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-yellow-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <IoTimeOutline /> Start Sync
                    </label>
                    <select
                      value={formData.startTime}
                      onChange={(e) =>
                        setFormData({ ...formData, startTime: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-yellow-500 appearance-none cursor-pointer"
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t} className="bg-black">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-yellow-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <IoTimeOutline /> End Ops
                    </label>
                    <select
                      value={formData.endTime}
                      onChange={(e) =>
                        setFormData({ ...formData, endTime: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white outline-none focus:border-yellow-500 appearance-none cursor-pointer"
                    >
                      {timeSlots.map((t) => (
                        <option key={t} value={t} className="bg-black">
                          {t}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={actionLoading}
                  className="w-full bg-yellow-600 hover:bg-yellow-500 text-black py-5 rounded-2xl font-black text-xs uppercase tracking-[0.3em] mt-6 disabled:opacity-50 shadow-[0_15px_30px_rgba(234,179,8,0.2)] transition-all transform active:scale-95"
                >
                  {actionLoading ? "UPLOADING INTEL..." : "INITIALIZE CIRCUIT"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Tournaments;
