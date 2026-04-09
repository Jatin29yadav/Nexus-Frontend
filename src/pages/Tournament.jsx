import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react";
import TournamentRegistrationModal from "../components/TournamentRegistrationModal";
import {
  IoTrophyOutline,
  IoAddOutline,
  IoCashOutline,
  IoCalendarOutline,
  IoInformationCircleOutline,
  IoRocketOutline,
  IoCloseOutline,
} from "react-icons/io5";

const Tournaments = () => {
  const { user, isSignedIn, isLoaded } = useUser();
  const [tournaments, setTournaments] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [selectedTournament, setSelectedTournament] = useState(null);

  useEffect(() => {
    setTimeout(() => {
      setTournaments([
        {
          _id: "69d2908288fe45ad75dbb910",
          title: "Valorant Radiant Cup",
          game: "Valorant",
          prize: "₹50,000",
          date: "2026-05-10",
          slots: 16,
          filled: 12,
          thumbnail:
            "https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&q=80",
        },
        {
          _id: "2",
          title: "FIFA Pro League",
          game: "FIFA 24",
          prize: "₹20,000",
          date: "2026-05-15",
          slots: 32,
          filled: 30,
          thumbnail:
            "https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&q=80",
        },
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const handleEnlistClick = (tournament) => {
    setSelectedTournament(tournament);
    setIsRegisterOpen(true);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden selection:bg-purple-500/30">
      <div className="absolute top-0 left-0 w-125 h-125 bg-purple-900/10 rounded-full blur-[150px] pointer-events-none" />

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

          {user?.publicMetadata?.role === "admin" && (
            <motion.button
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              onClick={() => setIsAdminOpen(true)}
              className="flex items-center gap-2 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/30 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
            >
              <IoAddOutline className="text-lg" /> Deploy Tournament
            </motion.button>
          )}
        </div>

        {loading ? (
          <div className="text-purple-500 text-center animate-pulse font-black uppercase tracking-widest">
            Loading Circuit Data...
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {tournaments.map((t) => (
              <motion.div
                key={t._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-[#0a0a0a] border border-purple-500/20 rounded-3xl shadow-[0_0_30px_rgba(168,85,247,0.05)] hover:border-purple-500/50 transition-all group flex flex-col overflow-hidden"
              >
                <div className="h-40 sm:h-48 w-full relative overflow-hidden">
                  <div className="absolute inset-0 bg-linear-to-t from-[#0a0a0a] to-transparent z-10" />
                  <img
                    src={t.thumbnail}
                    alt={t.game}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
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
                      {t.filled}/{t.slots} TEAMS
                    </div>
                  </div>

                  <div className="space-y-2 mb-6 grow text-xs font-bold text-gray-400">
                    <p className="flex items-center gap-3">
                      <IoCashOutline className="text-purple-500 text-base" />{" "}
                      Prize Pool: <span className="text-white">{t.prize}</span>
                    </p>
                    <p className="flex items-center gap-3">
                      <IoCalendarOutline className="text-purple-500 text-base" />{" "}
                      Date: <span className="text-white">{t.date}</span>
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
                      disabled={t.filled >= t.slots}
                      className="flex-[1.5] flex justify-center items-center gap-1.5 bg-purple-600 hover:bg-purple-500 text-white py-3 sm:py-3.5 rounded-xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_10px_20px_rgba(168,85,247,0.2)]"
                    >
                      <IoRocketOutline className="text-sm sm:text-base" />{" "}
                      {t.filled >= t.slots ? "Roster Full" : "Enlist"}
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* 🚀 Reusable Component Call */}
      <TournamentRegistrationModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        tournament={selectedTournament}
      />

      {/* ADMIN CREATE MODAL (Kept here for now) */}
      <AnimatePresence>
        {isAdminOpen && user?.isAdmin && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-500 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-[#0a0a0a] border border-purple-500/30 w-full max-w-lg p-6 sm:p-8 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.15)] relative"
            >
              <button
                onClick={() => setIsAdminOpen(false)}
                className="absolute top-6 right-6 text-purple-500/50 hover:text-purple-500 text-xl z-50"
              >
                <IoCloseOutline />
              </button>
              <h2 className="text-xl font-black uppercase text-white mb-6 pr-8">
                Initialize New Tournament
              </h2>
              <form className="space-y-4">
                {/* Admin Form Inputs... */}
                <button
                  type="submit"
                  className="w-full bg-yellow-600 hover:bg-yellow-500 text-black py-4 rounded-xl font-black text-xs uppercase tracking-widest mt-4"
                >
                  Deploy Server
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
