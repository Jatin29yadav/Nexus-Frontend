import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import useApi from "../hooks/useApi";
import { toast } from "sonner";
import {
  IoCloseOutline,
  IoPeopleOutline,
  IoPersonOutline,
  IoGameControllerOutline,
  IoMailOutline,
  IoCallOutline,
  IoCheckmarkCircleOutline, // 🚨 Added Checkmark Icon
} from "react-icons/io5";

const TournamentRegistrationModal = ({ isOpen, onClose, tournament }) => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const navigate = useNavigate();
  const api = useApi();
  const [actionLoading, setActionLoading] = useState(false);

  // 🚨 NEW STATE: To track successful submission
  const [isSuccess, setIsSuccess] = useState(false);

  const [teamData, setTeamData] = useState({
    teamName: "",
    players: Array(5).fill({ name: "", inGameId: "", email: "", phone: "" }),
  });

  const handlePlayerChange = (index, field, value) => {
    const updatedPlayers = [...teamData.players];
    updatedPlayers[index] = { ...updatedPlayers[index], [field]: value };
    setTeamData({ ...teamData, players: updatedPlayers });
  };

  useEffect(() => {
    if (isOpen && !authLoading) {
      setIsSuccess(false); // Reset success screen if modal is reopened

      if (!user) {
        onClose();
        navigate("/login", { state: { message: "Login required to enlist." } });
        return;
      }
      const initialPlayers = [...teamData.players];
      initialPlayers[0] = {
        name: user.username || "",
        inGameId: "",
        email: user.email || "",
        phone: user.phone || "",
      };
      setTeamData({ teamName: "", players: initialPlayers });
    }
  }, [isOpen, user, authLoading, navigate, onClose]);

  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      await api.post(`/tournaments/${tournament._id}/register`, teamData);
      // 🚨 FIX: Removed toast, triggered success screen instead
      setIsSuccess(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Deployment failed.");
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
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
            {/* 🚨 CONDITIONAL RENDER: Form OR Success Screen */}
            {!isSuccess ? (
              <>
                <button
                  onClick={onClose}
                  className="absolute top-6 right-6 text-purple-500/50 hover:text-purple-500 text-xl z-50"
                >
                  <IoCloseOutline />
                </button>
                <h2 className="text-xl font-black uppercase text-white mb-6 pr-8">
                  Enlist: {tournament?.title}
                </h2>

                <form
                  onSubmit={handleRegisterSubmit}
                  className="space-y-6 max-h-[65vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-purple-600 pb-4"
                >
                  <div className="space-y-3 sticky top-0 bg-[#0a0a0a] z-10 pt-2 pb-4 border-b border-purple-500/20">
                    <div className="relative">
                      <IoPeopleOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 text-lg" />
                      <input
                        required
                        type="text"
                        placeholder="SQUAD NAME (e.g. Nexus Elite)"
                        value={teamData.teamName}
                        onChange={(e) =>
                          setTeamData({ ...teamData, teamName: e.target.value })
                        }
                        className="w-full bg-purple-900/20 border border-purple-500/40 rounded-xl pl-12 pr-4 py-3 outline-none focus:border-purple-500 text-sm font-black text-white shadow-[0_0_15px_rgba(168,85,247,0.1)]"
                      />
                    </div>
                  </div>

                  <div className="space-y-6">
                    {teamData.players.map((player, index) => (
                      <div
                        key={index}
                        className="bg-purple-900/5 p-4 rounded-xl border border-purple-500/10 space-y-3 relative overflow-hidden"
                      >
                        {index === 0 && (
                          <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                        )}
                        <h4
                          className={`text-[10px] font-black uppercase tracking-widest ${index === 0 ? "text-yellow-500" : "text-purple-400"}`}
                        >
                          {index === 0
                            ? "Player 1 (Captain)"
                            : `Player ${index + 1}`}
                        </h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="relative">
                            <IoPersonOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/60" />
                            <input
                              required
                              type="text"
                              placeholder="REAL NAME"
                              value={player.name}
                              onChange={(e) =>
                                handlePlayerChange(
                                  index,
                                  "name",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-black/50 border border-purple-500/20 rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-purple-500 text-xs font-bold text-gray-200"
                            />
                          </div>
                          <div className="relative">
                            <IoGameControllerOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/60" />
                            <input
                              required
                              type="text"
                              placeholder="IN-GAME ID"
                              value={player.inGameId}
                              onChange={(e) =>
                                handlePlayerChange(
                                  index,
                                  "inGameId",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-black/50 border border-purple-500/20 rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-purple-500 text-xs font-bold text-gray-200"
                            />
                          </div>
                          <div className="relative">
                            <IoMailOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/60" />
                            <input
                              required
                              type="email"
                              placeholder="EMAIL"
                              value={player.email}
                              onChange={(e) =>
                                handlePlayerChange(
                                  index,
                                  "email",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-black/50 border border-purple-500/20 rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-purple-500 text-xs font-bold text-gray-200"
                            />
                          </div>
                          <div className="relative">
                            <IoCallOutline className="absolute left-3 top-1/2 -translate-y-1/2 text-purple-500/60" />
                            <input
                              required
                              type="tel"
                              placeholder="PHONE"
                              value={player.phone}
                              onChange={(e) =>
                                handlePlayerChange(
                                  index,
                                  "phone",
                                  e.target.value,
                                )
                              }
                              className="w-full bg-black/50 border border-purple-500/20 rounded-lg pl-9 pr-3 py-2.5 outline-none focus:border-purple-500 text-xs font-bold text-gray-200"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="sticky bottom-0 bg-[#0a0a0a] pt-4 border-t border-purple-500/20">
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="w-full flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 py-4 rounded-xl font-black text-xs text-white uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(168,85,247,0.3)] disabled:opacity-50"
                    >
                      {actionLoading
                        ? "UPLOADING ROSTER..."
                        : "CONFIRM FULL ROSTER"}
                    </button>
                  </div>
                </form>
              </>
            ) : (
              // 🚨 SUCCESS SCREEN (Replaces form upon successful submission)
              <div className="text-center py-10 px-4">
                <IoCheckmarkCircleOutline className="text-[100px] text-purple-500 mx-auto drop-shadow-[0_0_30px_rgba(168,85,247,0.8)] mb-6" />
                <h2 className="text-3xl font-black uppercase text-white mb-2 tracking-tighter">
                  Squad <span className="text-purple-500">Enlisted</span>
                </h2>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest leading-relaxed mb-10">
                  Your roster has been successfully uploaded to the mainframe.
                  Get ready for deployment.
                </p>
                <button
                  onClick={() => window.location.reload()} // 🚨 Refreshes page to show new team
                  className="w-full bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-[0_10px_20px_rgba(168,85,247,0.3)] transition-all"
                >
                  Acknowledge & Refresh
                </button>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default TournamentRegistrationModal;
