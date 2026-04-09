import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/clerk-react"; //
import { toast } from "sonner"; //
import useApi from "../hooks/useApi"; //
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoPeopleOutline,
  IoHardwareChipOutline,
  IoTimeOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoRocketOutline,
  IoHomeOutline,
} from "react-icons/io5";

const BookingList = () => {
  const { user, isLoaded } = useUser(); //
  const api = useApi(); //

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  // 📡 Fetch deployments using secure API
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await api.get("/bookings"); //
        if (response.data.success) {
          setBookings(response.data.bookings);
        }
      } catch (error) {
        console.error("Failed to fetch deployments", error);
        toast.error("COULD NOT SYNC WITH MAINFRAME.");
      } finally {
        setLoading(false);
      }
    };
    if (isLoaded) fetchBookings();
  }, [api, isLoaded]);

  const initiateCancel = (id) => setCancelTarget(id);

  // 🗑️ Secure Delete function
  const confirmDelete = async () => {
    if (!cancelTarget) return;
    setActionLoading(cancelTarget);

    try {
      // Automatic token attachment via useApi interceptor
      await api.delete(`/bookings/${cancelTarget}`); //

      setBookings(bookings.filter((b) => b._id !== cancelTarget));
      toast.success("DEPLOYMENT ABORTED SUCCESSFULLY."); //
    } catch (error) {
      toast.error(error.response?.data?.message || "ABORT MISSION FAILED.");
    } finally {
      setActionLoading(null);
      setCancelTarget(null);
    }
  };

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-500 font-black animate-pulse uppercase tracking-widest">
          Syncing with Nexus Mainframe...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden">
      {/* Ambient Background Glows */}
      <div className="fixed top-1/4 -left-32 w-96 h-96 bg-purple-700/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="fixed bottom-1/4 -right-32 w-96 h-96 bg-purple-900/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="w-full mx-auto max-w-7xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter mb-2">
            Active <span className="text-purple-500">Deployments</span>
          </h1>
          <p className="text-purple-400/50 font-bold text-[10px] md:text-xs uppercase tracking-widest">
            Monitor all Nexus arena operations
          </p>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center bg-[#0a0a0a] border border-purple-500/20 rounded-2xl p-10 max-w-lg mx-auto"
          >
            <p className="text-purple-300/50 text-sm md:text-base font-bold uppercase tracking-widest mb-6">
              No active deployments found.
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 bg-purple-600 hover:bg-purple-500 px-6 py-3 rounded-xl text-xs md:text-sm font-black transition-all uppercase"
            >
              Initialize New Deployment <IoRocketOutline />
            </Link>
          </motion.div>
        ) : (
          <div className="grid gap-4 sm:gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence>
              {bookings.map((booking) => {
                // 🚨 Updated Clerk Auth & Permissions Logic
                const isAdmin = user?.publicMetadata?.role === "admin";
                const isOwner =
                  user?.primaryEmailAddress?.emailAddress === booking.email;
                const canManage = user && (isAdmin || isOwner);

                return (
                  <motion.div
                    key={booking._id}
                    layout
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[#0a0a0a] border border-purple-500/20 p-4 sm:p-6 rounded-3xl shadow-[0_0_50px_rgba(168,85,247,0.05)] hover:border-purple-500/40 transition-all flex flex-col h-full"
                  >
                    <div className="flex justify-between items-start mb-4 border-b border-purple-500/10 pb-3">
                      <h2 className="text-sm sm:text-base md:text-lg font-black text-white uppercase tracking-wide flex items-center gap-2 truncate pr-2">
                        <IoPersonOutline className="text-purple-500 shrink-0" />
                        <span className="truncate">{booking.name}</span>
                      </h2>
                      <div className="bg-purple-900/30 border border-purple-500/30 px-2 py-1 rounded text-[8px] sm:text-[10px] font-black text-purple-400 uppercase tracking-widest shrink-0">
                        {booking.bookingType}
                      </div>
                    </div>

                    <div className="space-y-2.5 text-[10px] sm:text-xs text-purple-100/70 font-bold tracking-wide grow">
                      <p className="flex items-center gap-3">
                        <IoMailOutline className="text-purple-500 text-sm shrink-0" />
                        <span className="truncate">{booking.email}</span>
                      </p>
                      <p className="flex items-center gap-3">
                        <IoCallOutline className="text-purple-500 text-sm shrink-0" />{" "}
                        {booking.phone}
                      </p>
                      <p className="flex items-center gap-3">
                        <IoPeopleOutline className="text-purple-500 text-sm shrink-0" />{" "}
                        Squad Size:{" "}
                        <span className="text-white ml-1">
                          {booking.membersCount}
                        </span>
                      </p>
                      {booking.stations?.length > 0 && (
                        <p className="flex items-start gap-3 pt-1">
                          <IoHardwareChipOutline className="text-purple-500 text-sm shrink-0 mt-0.5" />
                          <span className="flex flex-wrap gap-1">
                            {booking.stations.map((st) => (
                              <span
                                key={st}
                                className="bg-purple-500/10 border border-purple-500/20 px-1.5 py-0.5 rounded text-[9px] text-purple-300"
                              >
                                {st}
                              </span>
                            ))}
                          </span>
                        </p>
                      )}
                    </div>

                    <div className="mt-5 bg-purple-900/10 border border-purple-500/10 p-3 sm:p-4 rounded-xl">
                      <p className="text-[9px] sm:text-[10px] text-purple-500 font-black uppercase mb-2 flex items-center gap-1.5 tracking-widest">
                        <IoTimeOutline className="text-xs" /> Operational Window
                      </p>
                      <div className="flex flex-col gap-1 text-[10px] sm:text-xs font-bold text-gray-300">
                        <div className="flex justify-between">
                          <span className="text-purple-400/50">START:</span>
                          <span className="text-right">
                            {new Date(booking.bookingTime.start).toLocaleString(
                              "en-IN",
                              { dateStyle: "short", timeStyle: "short" },
                            )}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-purple-400/50">END:</span>
                          <span className="text-right">
                            {new Date(booking.bookingTime.end).toLocaleString(
                              "en-IN",
                              { dateStyle: "short", timeStyle: "short" },
                            )}
                          </span>
                        </div>
                      </div>
                    </div>

                    {canManage && (
                      <div className="mt-5 pt-4 border-t border-purple-500/10 flex gap-2">
                        <Link
                          to={`/booking/update/${booking._id}`}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-yellow-500/10 hover:bg-yellow-500/20 text-yellow-500 border border-yellow-500/20 py-2 sm:py-2.5 rounded-lg text-[9px] sm:text-[10px] font-black transition-all uppercase tracking-wider"
                        >
                          <IoCreateOutline className="text-sm" /> Update
                        </Link>
                        <button
                          onClick={() => initiateCancel(booking._id)}
                          disabled={actionLoading === booking._id}
                          className="flex-1 flex items-center justify-center gap-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-500 border border-red-500/20 py-2 sm:py-2.5 rounded-lg text-[9px] sm:text-[10px] font-black transition-all uppercase tracking-wider disabled:opacity-50"
                        >
                          <IoTrashOutline className="text-sm" /> Cancel
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}

        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
          <Link
            to="/booking"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-purple-600 hover:bg-purple-500 px-6 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-black transition-all uppercase tracking-widest shadow-[0_10px_20px_rgba(168,85,247,0.2)]"
          >
            <IoRocketOutline className="text-base" /> New Deployment
          </Link>
          <Link
            to="/"
            className="w-full sm:w-auto flex items-center justify-center gap-2 bg-[#1a1625] hover:bg-purple-900/40 border border-purple-500/20 px-6 py-3 sm:py-4 rounded-xl text-xs sm:text-sm font-black transition-all uppercase tracking-widest"
          >
            <IoHomeOutline className="text-base" /> Return to HQ
          </Link>
        </div>
      </div>

      {/* 🛑 CUSTOM DANGER MODAL */}
      <AnimatePresence>
        {cancelTarget && (
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
              className="bg-[#1a0f14] border border-red-500/40 w-full max-w-sm p-6 sm:p-8 rounded-4xl shadow-[0_0_80px_rgba(239,68,68,0.2)] text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-red-500 animate-pulse" />
              <IoTrashOutline className="text-6xl text-red-500 mx-auto mb-4 drop-shadow-[0_0_15px_rgba(239,68,68,0.8)]" />
              <h2 className="text-2xl font-black uppercase text-white mb-2">
                Abort Mission?
              </h2>
              <p className="text-red-400/70 text-xs font-bold uppercase tracking-widest mb-8">
                This action is irreversible. Your slots will be released.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setCancelTarget(null)}
                  disabled={actionLoading}
                  className="flex-1 bg-gray-800 hover:bg-gray-700 text-white py-3 sm:py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all"
                >
                  Keep Slot
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={actionLoading}
                  className="flex-1 flex items-center justify-center gap-2 bg-red-600 hover:bg-red-500 text-white py-3 sm:py-4 rounded-xl font-black text-xs uppercase tracking-widest shadow-[0_10px_20px_rgba(239,68,68,0.3)] transition-all"
                >
                  {actionLoading ? "Aborting..." : "Confirm"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default BookingList;
