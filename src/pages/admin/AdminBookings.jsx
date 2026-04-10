import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
  IoChevronDownOutline,
  IoShieldCheckmarkOutline,
  IoPeopleOutline,
} from "react-icons/io5";
import useApi from "../../hooks/useApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AdminBookings = () => {
  const api = useApi();
  const [activeTab, setActiveTab] = useState("stations"); // 'stations' | 'tournaments'

  const [bookings, setBookings] = useState([]);
  const [tournaments, setTournaments] = useState([]);

  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [expandedTeam, setExpandedTeam] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [bookingsRes, tourneysRes] = await Promise.all([
          api.get("/bookings"),
          api.get("/tournaments"),
        ]);

        if (bookingsRes.data.success) setBookings(bookingsRes.data.bookings);
        if (tourneysRes.data.success)
          setTournaments(tourneysRes.data.tournaments);
      } catch (error) {
        toast.error("Failed to fetch mainframe data.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [api]);

  // 🔴 STATION BOOKING CANCEL
  const handleForceCancel = async (bookingId) => {
    const confirm = window.confirm("WARNING: FORCE ABORT this deployment?");
    if (!confirm) return;
    setActionLoading(bookingId);
    try {
      await api.put(`/admin/booking/${bookingId}/cancel`);
      setBookings((prev) =>
        prev.map((b) =>
          b._id === bookingId ? { ...b, status: "Cancelled" } : b,
        ),
      );
      toast.success("Deployment forcefully aborted.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Abort failed.");
    } finally {
      setActionLoading(null);
    }
  };

  // 🟢 TOURNAMENT TEAM STATUS UPDATE (Accept/Reject)
  const handleTeamStatus = async (tournamentId, teamId, status) => {
    setActionLoading(teamId);
    try {
      await api.put(`/tournaments/${tournamentId}/team/${teamId}/status`, {
        status,
      });

      // Update local state smoothly
      setTournaments((prev) =>
        prev.map((t) => {
          if (t._id === tournamentId) {
            const updatedTeams = t.registeredTeams.map((team) =>
              team._id === teamId ? { ...team, status } : team,
            );
            return { ...t, registeredTeams: updatedTeams };
          }
          return t;
        }),
      );

      toast.success(`Squad ${status.toUpperCase()}!`);
    } catch (error) {
      toast.error(error.response?.data?.message || "Status update failed.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <span className="text-purple-500 font-black uppercase text-xs tracking-widest animate-pulse">
          Syncing Nexus Mainframe...
        </span>
      </div>
    );
  }

  // Extract all teams from all tournaments for easy mapping
  const allTeams = tournaments.flatMap((t) =>
    (t.registeredTeams || []).map((team) => ({
      ...team,
      tournamentId: t._id,
      tournamentName: t.title,
    })),
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-6xl mx-auto space-y-6 pb-20"
    >
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-8">
        <div>
          <h2 className="text-3xl md:text-4xl font-black uppercase tracking-tighter text-white">
            Command <span className="text-purple-500">Center</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Global Override Controls
          </p>
        </div>

        {/* 🚨 PREMIUM TAB SWITCHER */}
        <div className="flex bg-[#0a0a0a] border border-white/10 rounded-2xl p-1 shadow-[0_0_30px_rgba(168,85,247,0.05)]">
          <button
            onClick={() => setActiveTab("stations")}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "stations" ? "bg-purple-600 text-white shadow-lg" : "text-gray-500 hover:text-white"}`}
          >
            Station Logs
          </button>
          <button
            onClick={() => setActiveTab("tournaments")}
            className={`px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${activeTab === "tournaments" ? "bg-yellow-600 text-black shadow-lg" : "text-gray-500 hover:text-white"}`}
          >
            Circuit Squads
          </button>
        </div>
      </div>

      {/* ================= STATION DEPLOYMENTS TAB ================= */}
      {activeTab === "stations" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden"
        >
          <div className="overflow-x-auto scrollbar-hide">
            <table className="w-full text-left border-collapse min-w-175">
              <thead>
                <tr className="bg-white/5 border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                  <th className="p-4 pl-6">Mission ID</th>
                  <th className="p-4">Operative Info</th>
                  <th className="p-4">Stations</th>
                  <th className="p-4">Schedule</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 pr-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.length === 0 ? (
                  <tr>
                    <td
                      colSpan="6"
                      className="text-center py-10 text-gray-500 text-xs font-bold uppercase tracking-widest"
                    >
                      No Active Deployments.
                    </td>
                  </tr>
                ) : (
                  bookings.map((booking) => (
                    <tr
                      key={booking._id}
                      className="border-b border-white/5 hover:bg-white/5 transition-colors text-xs font-bold text-gray-300"
                    >
                      <td className="p-4 pl-6 font-mono text-purple-400">
                        {booking._id.slice(-6).toUpperCase()}
                      </td>
                      <td className="p-4">
                        <span className="block text-white uppercase tracking-wider">
                          {booking.user?.username || booking.name}
                        </span>
                        <span className="block text-[9px] text-gray-500 tracking-widest lowercase">
                          {booking.user?.email || booking.email}
                        </span>
                      </td>
                      <td className="p-4 uppercase tracking-wider text-purple-300">
                        {booking.stations?.join(", ")}
                      </td>
                      <td className="p-4 font-mono text-gray-400">
                        <span className="block">
                          {new Date(
                            booking.bookingTime.start,
                          ).toLocaleDateString()}
                        </span>
                        <span className="block text-[9px] text-gray-500">
                          {new Date(
                            booking.bookingTime.start,
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}{" "}
                          -
                          {new Date(booking.bookingTime.end).toLocaleTimeString(
                            [],
                            { hour: "2-digit", minute: "2-digit" },
                          )}
                        </span>
                      </td>
                      <td className="p-4">
                        <span
                          className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest border ${
                            booking.status === "Active"
                              ? "bg-green-500/10 text-green-400 border-green-500/20"
                              : booking.status === "Pending"
                                ? "bg-yellow-500/10 text-yellow-400 border-yellow-500/20"
                                : booking.status === "Completed"
                                  ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                                  : "bg-red-500/10 text-red-400 border-red-500/20"
                          }`}
                        >
                          {booking.status}
                        </span>
                      </td>
                      <td className="p-4 pr-6">
                        <div className="flex items-center justify-end gap-2">
                          {booking.status !== "Cancelled" &&
                            booking.status !== "Completed" && (
                              <button
                                onClick={() => handleForceCancel(booking._id)}
                                disabled={actionLoading === booking._id}
                                className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20 disabled:opacity-50"
                                title="Force Abort Deployment"
                              >
                                {actionLoading === booking._id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <IoCloseCircleOutline size={18} />
                                )}
                              </button>
                            )}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {/* ================= TOURNAMENT SQUADS TAB ================= */}
      {activeTab === "tournaments" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          {allTeams.length === 0 ? (
            <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-10 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
              No Squads Enlisted Yet.
            </div>
          ) : (
            allTeams.map((team) => (
              <div
                key={team._id}
                className="bg-[#0a0a0a] border border-white/10 rounded-2xl overflow-hidden shadow-[0_0_30px_rgba(234,179,8,0.02)] transition-all"
              >
                {/* ACCORDION HEADER */}
                <div
                  onClick={() =>
                    setExpandedTeam(expandedTeam === team._id ? null : team._id)
                  }
                  className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
                >
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-yellow-500/10 border border-yellow-500/30 rounded-xl flex items-center justify-center">
                      <IoShieldCheckmarkOutline className="text-2xl text-yellow-500" />
                    </div>
                    <div>
                      <h3 className="text-lg font-black text-white uppercase tracking-wider">
                        {team.teamName}
                      </h3>
                      <div className="flex flex-wrap items-center gap-2 mt-1">
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          Capt:{" "}
                          <span className="text-purple-400">
                            {team.players[0]?.name}
                          </span>
                        </span>
                        <span className="text-[10px] text-gray-600">•</span>
                        <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">
                          Mission:{" "}
                          <span className="text-yellow-500/80">
                            {team.tournamentName}
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0 mt-2 sm:mt-0">
                    <span
                      className={`px-4 py-1.5 rounded-lg text-[9px] uppercase tracking-widest font-black border ${
                        team.status === "Approved"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : team.status === "Rejected"
                            ? "bg-red-500/10 text-red-400 border-red-500/20"
                            : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                      }`}
                    >
                      {team.status || "Pending"}
                    </span>
                    <IoChevronDownOutline
                      className={`text-xl text-gray-500 transition-transform duration-300 ${expandedTeam === team._id ? "rotate-180" : ""}`}
                    />
                  </div>
                </div>

                {/* ACCORDION BODY (EXPANDED DETAILS) */}
                <AnimatePresence>
                  {expandedTeam === team._id && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      className="border-t border-white/5 bg-[#050505]"
                    >
                      <div className="p-5 sm:p-8">
                        <div className="flex items-center gap-2 mb-6 border-b border-white/5 pb-4">
                          <IoPeopleOutline className="text-yellow-500 text-xl" />
                          <h4 className="text-xs font-black text-gray-400 uppercase tracking-widest">
                            Full Roster Intel
                          </h4>
                        </div>

                        {/* Grid of Players */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                          {team.players.map((player, idx) => (
                            <div
                              key={idx}
                              className="bg-white/5 border border-white/10 rounded-xl p-4 relative overflow-hidden"
                            >
                              {idx === 0 && (
                                <div className="absolute top-0 left-0 w-1 h-full bg-yellow-500" />
                              )}
                              <span
                                className={`text-[8px] font-black uppercase tracking-widest mb-2 block ${idx === 0 ? "text-yellow-500" : "text-gray-500"}`}
                              >
                                {idx === 0
                                  ? "Operative 1 (Captain)"
                                  : `Operative ${idx + 1}`}
                              </span>
                              <div className="space-y-1">
                                <p className="text-sm font-black text-white uppercase truncate">
                                  {player.name || "N/A"}
                                </p>
                                <p className="text-[10px] font-mono text-purple-400 truncate">
                                  ID: {player.inGameId || "N/A"}
                                </p>
                                <p className="text-[10px] font-bold text-gray-400 truncate pt-2">
                                  {player.email || "N/A"}
                                </p>
                                <p className="text-[10px] font-bold text-gray-400">
                                  {player.phone || "N/A"}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>

                        {/* Admin Actions */}
                        <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
                          <button
                            onClick={() =>
                              handleTeamStatus(
                                team.tournamentId,
                                team._id,
                                "Approved",
                              )
                            }
                            disabled={
                              actionLoading === team._id ||
                              team.status === "Approved"
                            }
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-green-600 hover:bg-green-500 disabled:bg-green-900/20 disabled:text-green-500/50 text-white px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            {actionLoading === team._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <IoCheckmarkCircleOutline className="text-base" />{" "}
                                Approve Roster
                              </>
                            )}
                          </button>
                          <button
                            onClick={() =>
                              handleTeamStatus(
                                team.tournamentId,
                                team._id,
                                "Rejected",
                              )
                            }
                            disabled={
                              actionLoading === team._id ||
                              team.status === "Rejected"
                            }
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600 disabled:opacity-50 text-red-500 hover:text-white border border-red-500/20 px-8 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all"
                          >
                            {actionLoading === team._id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <IoCloseCircleOutline className="text-base" />{" "}
                                Reject
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))
          )}
        </motion.div>
      )}
    </motion.div>
  );
};

export default AdminBookings;
