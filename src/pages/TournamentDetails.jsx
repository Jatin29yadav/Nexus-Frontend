import { useState, useEffect, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import useApi from "../hooks/useApi";
import TournamentRegistrationModal from "../components/TournamentRegistrationModal";
import { toast } from "sonner";
import {
  IoChevronBackOutline,
  IoCalendarOutline,
  IoPeopleOutline,
  IoAlertCircleOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoCloseOutline,
  IoTimeOutline,
  IoCheckmarkCircleOutline,
  IoHourglassOutline,
} from "react-icons/io5";

const TournamentDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const api = useApi();

  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const isAdmin = user?.role === "Admin";
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [editForm, setEditForm] = useState({});

  // 🚨 DELETE MODAL STATES
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [deleteLoading, setDeleteLoading] = useState(false);

  const upcomingDays = Array.from({ length: 14 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() + i);
    return d;
  });

  const timeSlots = Array.from({ length: 48 }, (_, i) => {
    const hours = Math.floor(i / 2)
      .toString()
      .padStart(2, "0");
    const minutes = i % 2 === 0 ? "00" : "30";
    return `${hours}:${minutes}`;
  });

  const fetchTournamentDetails = async () => {
    try {
      const response = await api.get(`/tournaments/${id}`);
      if (response.data.success) {
        setTournament(response.data.tournament);

        const start = new Date(response.data.tournament.eventTime.start);
        const end = new Date(response.data.tournament.eventTime.end);

        setEditForm({
          title: response.data.tournament.title,
          game: response.data.tournament.game,
          description: response.data.tournament.description,
          maxTeams: response.data.tournament.maxTeams,
          status: response.data.tournament.status,
          selectedDate: start,
          startTime: start.toTimeString().substring(0, 5),
          endTime: end.toTimeString().substring(0, 5),
        });
      }
    } catch (error) {
      toast.error("Failed to fetch intel");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTournamentDetails();
  }, [id, api]);

  const confirmDelete = async () => {
    setDeleteLoading(true);
    try {
      await api.delete(`/tournaments/${id}`);
      toast.success("Tournament Aborted Permanently!");
      navigate("/tournament");
    } catch (error) {
      toast.error("Failed to abort tournament");
    } finally {
      setDeleteLoading(false);
      setShowDeleteModal(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      const start = new Date(editForm.selectedDate);
      const [sH, sM] = editForm.startTime.split(":");
      start.setHours(parseInt(sH), parseInt(sM), 0);

      const end = new Date(editForm.selectedDate);
      const [eH, eM] = editForm.endTime.split(":");
      end.setHours(parseInt(eH), parseInt(eM), 0);

      await api.put(`/tournaments/${id}`, {
        ...editForm,
        eventTime: { start: start.toISOString(), end: end.toISOString() },
      });

      toast.success("Tournament Intel Updated!");
      setIsEditOpen(false);
      fetchTournamentDetails();
    } catch (error) {
      toast.error("Update failed");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-purple-500 font-black uppercase animate-pulse">
        Fetching Intel...
      </div>
    );
  if (!tournament) return null;

  const filledSlots = tournament.registeredTeams?.length || 0;

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 pb-20">
      <div className="relative h-64 sm:h-96 w-full bg-purple-900/10 flex items-center justify-center">
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent z-10" />
        <h1 className="text-8xl opacity-10 font-black tracking-tighter uppercase absolute z-0">
          {tournament.game}
        </h1>

        {isAdmin && (
          <div className="absolute top-24 right-4 sm:right-10 z-20 flex gap-2">
            <button
              onClick={() => setIsEditOpen(true)}
              className="flex items-center gap-1 bg-yellow-500/10 border border-yellow-500/30 text-yellow-500 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-yellow-500 hover:text-black transition-all"
            >
              <IoCreateOutline className="text-sm" /> Edit Intel
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center gap-1 bg-red-500/10 border border-red-500/30 text-red-500 px-3 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest hover:bg-red-500 hover:text-white transition-all"
            >
              <IoTrashOutline className="text-sm" /> Abort
            </button>
          </div>
        )}

        <Link
          to="/tournament"
          className="absolute top-24 left-4 sm:left-10 z-20 flex items-center gap-1 text-purple-400 font-black text-[10px] sm:text-xs uppercase tracking-widest bg-black/50 px-3 py-2 rounded-full border border-purple-500/30 hover:bg-purple-500/20 transition-all backdrop-blur-md"
        >
          <IoChevronBackOutline /> Back to Circuit
        </Link>

        <div className="absolute bottom-6 sm:bottom-10 left-4 sm:left-10 z-20">
          <span className="bg-purple-600 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border border-purple-400 mb-3 inline-block shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            {tournament.game}
          </span>
          <h1 className="text-2xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight drop-shadow-2xl">
            {tournament.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 relative z-20">
        <div className="lg:col-span-2 space-y-10">
          <section className="bg-[#0a0a0a] border border-purple-500/20 p-6 sm:p-8 rounded-4xl shadow-[0_0_30px_rgba(168,85,247,0.05)]">
            <h2 className="text-xl font-black uppercase text-purple-400 mb-6 flex items-center gap-2 border-b border-purple-500/20 pb-3">
              <IoAlertCircleOutline className="text-2xl" /> Briefing
            </h2>
            <p className="text-gray-300 font-bold text-sm leading-relaxed whitespace-pre-wrap">
              {tournament.description || "No intel provided."}
            </p>
          </section>

          <section>
            <h2 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-2 pl-2">
              <IoPeopleOutline className="text-purple-500 text-2xl" /> Enlisted
              Squads ({filledSlots})
            </h2>

            {/* 🚨 DYNAMIC STATUS UI FOR TEAMS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tournament.registeredTeams?.length > 0 ? (
                tournament.registeredTeams.map((team, idx) => {
                  const isApproved = team.status === "Approved";
                  return (
                    <div
                      key={idx}
                      className={`border p-4 rounded-2xl flex items-center gap-4 transition-all ${
                        isApproved
                          ? "bg-green-500/5 border-green-500/20 hover:border-green-500/50"
                          : "bg-yellow-500/5 border-yellow-500/20 hover:border-yellow-500/50"
                      }`}
                    >
                      <div
                        className={`w-12 h-12 rounded-xl flex items-center justify-center font-black text-lg border ${
                          isApproved
                            ? "bg-green-500/10 border-green-500/30 text-green-500"
                            : "bg-yellow-500/10 border-yellow-500/30 text-yellow-500"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <div>
                        <h3 className="text-sm font-black uppercase tracking-wider text-white">
                          {team.teamName}
                        </h3>
                        <p
                          className={`flex items-center gap-1 text-[10px] font-black uppercase tracking-widest mt-1 ${
                            isApproved ? "text-green-400" : "text-yellow-500"
                          }`}
                        >
                          {isApproved ? (
                            <IoCheckmarkCircleOutline />
                          ) : (
                            <IoHourglassOutline />
                          )}
                          {team.status}
                        </p>
                      </div>
                    </div>
                  );
                })
              ) : (
                <p className="text-gray-500 font-bold uppercase tracking-widest text-xs p-4 bg-white/5 rounded-2xl border border-white/5">
                  No squads enlisted yet. Radar is clear.
                </p>
              )}
            </div>
          </section>
        </div>

        <div className="relative">
          <div className="sticky top-24 bg-[#0a0a0a] border border-purple-500/30 p-6 sm:p-8 rounded-4xl shadow-[0_0_50px_rgba(168,85,247,0.1)]">
            <h3 className="text-[10px] font-black uppercase text-purple-500 tracking-widest border-b border-purple-500/20 pb-2 mb-6">
              Mission Details
            </h3>
            <div className="space-y-6 mb-8">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Deployment Date
                </p>
                <p className="text-lg font-black text-gray-200 flex items-center gap-2">
                  <IoCalendarOutline className="text-purple-500" />{" "}
                  {new Date(tournament.eventTime.start).toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="bg-black/50 border border-purple-500/20 rounded-xl p-4 mb-6 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Squads Enlisted
              </p>
              <div className="text-2xl font-black text-white">
                <span className="text-purple-500">{filledSlots}</span> /{" "}
                {tournament.maxTeams}
              </div>
            </div>
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              disabled={
                filledSlots >= tournament.maxTeams ||
                tournament.status !== "Registration Open"
              }
              className="w-full text-center bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {filledSlots >= tournament.maxTeams
                ? "Roster Full"
                : tournament.status === "Upcoming"
                  ? "Registration Opening Soon"
                  : tournament.status === "Registration Open"
                    ? "Enlist Squad Now"
                    : "Registrations Closed"}
            </button>
          </div>
        </div>
      </div>

      <TournamentRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        tournament={tournament}
      />

      {/* 🛡️ PREMIUM ADMIN MODAL: UPDATE TOURNAMENT */}
      <AnimatePresence>
        {isEditOpen && isAdmin && (
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
              className="bg-[#0a0a0a] border border-yellow-500/30 w-full max-w-2xl p-6 sm:p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(234,179,8,0.1)] relative max-h-[90vh] overflow-y-auto custom-scrollbar"
            >
              <button
                onClick={() => setIsEditOpen(false)}
                className="absolute top-6 right-6 text-yellow-500/50 hover:text-yellow-500 text-2xl transition-colors"
              >
                <IoCloseOutline />
              </button>

              <div className="mb-8">
                <h2 className="text-2xl font-black uppercase text-yellow-500 tracking-tighter flex items-center gap-3">
                  <IoCreateOutline /> Update Intel
                </h2>
                <p className="text-gray-500 font-bold text-xs uppercase tracking-[0.2em] mt-1">
                  Modify Pro-Circuit Deployment
                </p>
              </div>

              <form onSubmit={handleUpdate} className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Tournament Title
                    </label>
                    <input
                      required
                      type="text"
                      value={editForm.title}
                      onChange={(e) =>
                        setEditForm({ ...editForm, title: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-yellow-500 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) =>
                        setEditForm({ ...editForm, status: e.target.value })
                      }
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-yellow-500 outline-none appearance-none cursor-pointer"
                    >
                      <option value="Upcoming" className="bg-black">
                        Upcoming
                      </option>
                      <option value="Registration Open" className="bg-black">
                        Registration Open
                      </option>
                      <option value="Live" className="bg-black">
                        Live
                      </option>
                      <option value="Completed" className="bg-black">
                        Completed
                      </option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black text-gray-500 uppercase tracking-widest ml-1">
                    Briefing
                  </label>
                  <textarea
                    required
                    value={editForm.description}
                    onChange={(e) =>
                      setEditForm({ ...editForm, description: e.target.value })
                    }
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-5 py-4 text-sm text-white focus:border-yellow-500 outline-none transition-all"
                    rows="3"
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black text-yellow-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                    <IoCalendarOutline /> Deployment Date
                  </label>
                  <div className="flex gap-3 overflow-x-auto pb-4 scrollbar-hide">
                    {upcomingDays.map((date, idx) => {
                      const isSelected =
                        editForm.selectedDate?.toDateString() ===
                        date.toDateString();
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() =>
                            setEditForm({ ...editForm, selectedDate: date })
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black text-yellow-500 uppercase tracking-widest ml-1 flex items-center gap-2">
                      <IoTimeOutline /> Start Sync
                    </label>
                    <select
                      value={editForm.startTime}
                      onChange={(e) =>
                        setEditForm({ ...editForm, startTime: e.target.value })
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
                      value={editForm.endTime}
                      onChange={(e) =>
                        setEditForm({ ...editForm, endTime: e.target.value })
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
                  {actionLoading ? "SYNCING INTEL..." : "CONFIRM UPDATE"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showDeleteModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-1000 flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0a0a0a] border border-red-500/30 w-full max-w-sm p-8 rounded-[2.5rem] text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <IoTrashOutline className="text-4xl text-red-500" />
              </div>
              <h2 className="text-2xl font-black uppercase text-white mb-2 tracking-tighter">
                Abort Tournament?
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed mb-8 px-4">
                This action is permanent. All registered squads will be cleared.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-white/10 transition-all"
                >
                  Hold Ops
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={deleteLoading}
                  className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-[0_10px_20px_rgba(220,38,38,0.3)] disabled:opacity-50"
                >
                  {deleteLoading ? "Aborting..." : "Confirm Abort"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default TournamentDetails;
