import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import useApi from "../hooks/useApi";
import { AuthContext } from "../context/AuthContext";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoPeopleOutline,
  IoHardwareChipOutline,
  IoTrashOutline,
  IoCreateOutline,
  IoRocketOutline,
  IoCalendarOutline,
} from "react-icons/io5";

const BookingList = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const api = useApi();

  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [cancelTarget, setCancelTarget] = useState(null);

  // 📡 FETCH ALL BOOKINGS
  const fetchBookings = async () => {
    try {
      const response = await api.get("/bookings");
      if (response.data.success) {
        setBookings(response.data.bookings);
      }
    } catch (error) {
      toast.error("COULD NOT SYNC WITH MAINFRAME.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!authLoading && user) fetchBookings();
  }, [api, authLoading, user]);

  const initiateCancel = (id) => setCancelTarget(id);

  // ❌ DELETE / ABORT BOOKING
  const confirmDelete = async () => {
    if (!cancelTarget) return;
    setActionLoading(cancelTarget);

    try {
      // 🚨 RESTful DELETE route sync
      await api.delete(`/bookings/${cancelTarget}`);
      setBookings(bookings.filter((b) => b._id !== cancelTarget));
      toast.success("DEPLOYMENT ABORTED SUCCESSFULLY.");
    } catch (error) {
      toast.error(error.response?.data?.message || "ABORT MISSION FAILED.");
    } finally {
      setActionLoading(null);
      setCancelTarget(null);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-purple-500 font-black animate-pulse uppercase tracking-widest text-xs">
          Syncing with Nexus Mainframe...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden custom-scrollbar">
      <div className="w-full mx-auto max-w-7xl relative z-10">
        {/* 🚨 RESTORED HEADER WITH NEW DEPLOYMENT BUTTON */}
        <div className="flex flex-col sm:flex-row justify-between items-center mb-12 gap-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="text-3xl md:text-5xl font-black text-white uppercase tracking-tighter">
              Active <span className="text-purple-500">Deployments</span>
            </h1>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
              Live session tracking for{" "}
              {user?.role === "Admin" ? "All Units" : "Your Squad"}
            </p>
          </motion.div>

          <Link
            to="/booking"
            className="flex items-center gap-2 bg-purple-600 hover:bg-purple-500 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] transition-all shadow-[0_10px_30px_rgba(168,85,247,0.3)] active:scale-95"
          >
            <IoRocketOutline className="text-lg" /> New Deployment
          </Link>
        </div>

        {bookings.length === 0 ? (
          <div className="text-center bg-[#0a0a0a] border border-purple-500/10 rounded-3xl p-16 max-w-lg mx-auto">
            <p className="text-gray-500 text-xs font-black uppercase tracking-widest mb-8">
              Radar Clear. No active deployments detected.
            </p>
            <Link
              to="/booking"
              className="inline-flex items-center gap-2 text-purple-500 border border-purple-500/30 px-6 py-3 rounded-xl text-[10px] font-black hover:bg-purple-500/10 transition-all uppercase"
            >
              Initialize Radar <IoRocketOutline />
            </Link>
          </div>
        ) : (
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            <AnimatePresence mode="popLayout">
              {bookings.map((booking) => {
                const isAdmin = user?.role === "Admin";
                const isOwner = user?.email === booking.email;
                const canManage = isAdmin || isOwner;

                return (
                  <motion.div
                    key={booking._id}
                    layout
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="bg-[#0a0a0a] border border-white/5 p-6 sm:p-8 rounded-4xl flex flex-col h-full hover:border-purple-500/20 transition-all group"
                  >
                    <div className="flex justify-between items-start mb-6 border-b border-white/5 pb-4">
                      <div>
                        <h2 className="text-sm font-black text-white uppercase tracking-wider flex items-center gap-2">
                          <IoPersonOutline className="text-purple-500" />
                          {/* 🚨 Show populated username or fallback to name */}
                          {booking.user?.username || booking.name || "Unknown"}
                        </h2>
                        <span className="text-[9px] text-gray-500 font-mono mt-1 block uppercase">
                          ID: {booking._id.slice(-6).toUpperCase()}
                        </span>
                      </div>
                      <div className="bg-purple-900/20 border border-purple-500/30 px-2 py-1 rounded-md text-[8px] font-black text-purple-400 uppercase tracking-widest">
                        {booking.bookingType}
                      </div>
                    </div>

                    <div className="space-y-3 text-[10px] text-gray-400 font-bold tracking-wide grow">
                      <p className="flex items-center gap-3">
                        <IoMailOutline className="text-purple-500 text-sm" />{" "}
                        {booking.email}
                      </p>
                      <p className="flex items-center gap-3">
                        <IoCallOutline className="text-purple-500 text-sm" />{" "}
                        {booking.phone}
                      </p>
                      <p className="flex items-center gap-3">
                        <IoPeopleOutline className="text-purple-500 text-sm" />{" "}
                        SQUAD:{" "}
                        <span className="text-white">
                          {booking.membersCount} OPS
                        </span>
                      </p>
                      <p className="flex items-center gap-3">
                        <IoCalendarOutline className="text-purple-500 text-sm" />{" "}
                        DATE:{" "}
                        <span className="text-white">
                          {new Date(
                            booking.bookingTime.start,
                          ).toLocaleDateString()}
                        </span>
                      </p>

                      <div className="pt-2">
                        <span className="text-[9px] text-gray-500 uppercase block mb-2">
                          Assigned Stations
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {booking.stations?.map((st) => (
                            <span
                              key={st}
                              className="bg-white/5 border border-white/10 px-2 py-1 rounded-md text-[9px] text-gray-300 font-mono"
                            >
                              {st}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>

                    {canManage && (
                      <div className="mt-8 pt-6 border-t border-white/5 flex gap-3">
                        <Link
                          to={`/booking/update/${booking._id}`}
                          className="flex-1 flex items-center justify-center gap-2 bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 py-3 rounded-xl text-[9px] font-black uppercase hover:bg-yellow-500 hover:text-black transition-all"
                        >
                          <IoCreateOutline className="text-sm" /> Re-Calibrate
                        </Link>
                        <button
                          onClick={() => initiateCancel(booking._id)}
                          className="flex-1 flex items-center justify-center gap-2 bg-red-500/10 text-red-500 border border-red-500/20 py-3 rounded-xl text-[9px] font-black uppercase hover:bg-red-600 hover:text-white transition-all"
                        >
                          <IoTrashOutline className="text-sm" /> Abort
                        </button>
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>

      {/* 🚨 DANGER MODAL (CONFIRM ABORT) */}
      <AnimatePresence>
        {cancelTarget && (
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
                Abort Mission?
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed mb-8 px-4">
                This action will release all assigned stations back to the
                radar.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setCancelTarget(null)}
                  className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-white/10 transition-all"
                >
                  Hold Ops
                </button>
                <button
                  onClick={confirmDelete}
                  className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-[0_10px_20px_rgba(220,38,38,0.3)]"
                >
                  {actionLoading ? "Aborting..." : "Confirm Abort"}
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
