import { useState, useEffect, useContext } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";
import useApi from "../hooks/useApi";
import {
  IoChevronBackOutline,
  IoHardwareChipOutline,
  IoTimeOutline,
  IoCalendarOutline,
  IoCallOutline,
  IoFlashOutline,
  IoSaveOutline,
} from "react-icons/io5";

const UpdateBooking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext);
  const api = useApi();

  const [loading, setLoading] = useState(true);
  const [updateLoading, setUpdateLoading] = useState(false);
  const [bookingData, setBookingData] = useState(null);

  const [formData, setFormData] = useState({
    phone: "",
    date: "Today",
    time: "09:00",
    period: "PM",
    duration: 1,
  });

  const timeSlots = [
    "01:00",
    "01:30",
    "02:00",
    "02:30",
    "03:00",
    "03:30",
    "04:00",
    "04:30",
    "05:00",
    "05:30",
    "06:00",
    "06:30",
    "07:00",
    "07:30",
    "08:00",
    "08:30",
    "09:00",
    "09:30",
    "10:00",
    "10:30",
    "11:00",
    "11:30",
    "12:00",
    "12:30",
  ];

  useEffect(() => {
    const fetchBookingDetails = async () => {
      try {
        const response = await api.get(`/bookings/${id}`);
        if (response.data.success) {
          const b = response.data.booking;
          setBookingData(b);

          // 🚨 SMART DATA EXTRACTION
          const startDate = new Date(b.bookingTime.start);
          const endDate = new Date(b.bookingTime.end);
          const diffHours = Math.round(
            (endDate - startDate) / (1000 * 60 * 60),
          );

          let hours = startDate.getHours();
          const minutes = startDate.getMinutes() === 0 ? "00" : "30";
          const period = hours >= 12 ? "PM" : "AM";
          hours = hours % 12 || 12;
          const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes}`;

          setFormData({
            phone: b.phone,
            date:
              new Date().getDate() === startDate.getDate()
                ? "Today"
                : "Tomorrow",
            time: formattedTime,
            period: period,
            duration: diffHours || 1,
          });
        }
      } catch (error) {
        toast.error(
          error.response?.data?.message || "ACCESS DENIED BY MAINFRAME.",
        );
        navigate("/bookings");
      } finally {
        setLoading(false);
      }
    };

    if (!authLoading && user) fetchBookingDetails();
  }, [id, authLoading, user, api, navigate]); // 🚨 Stable dependencies

  const handleUpdate = async (e) => {
    e.preventDefault();
    setUpdateLoading(true);
    try {
      const now = new Date();
      let targetDate = new Date();
      if (formData.date === "Tomorrow") targetDate.setDate(now.getDate() + 1);

      let [h, m] = formData.time.split(":");
      if (formData.period === "PM" && h !== "12") h = parseInt(h) + 12;
      if (formData.period === "AM" && h === "12") h = "00";
      targetDate.setHours(parseInt(h), parseInt(m), 0, 0);

      const startISO = targetDate.toISOString();
      const endISO = new Date(
        targetDate.getTime() + formData.duration * 60 * 60 * 1000,
      ).toISOString();

      await api.put(`/bookings/${id}`, {
        phone: formData.phone,
        bookingTime: { start: startISO, end: endISO },
        totalAmount: bookingData.membersCount * formData.duration * 100,
      });

      toast.success("DEPLOYMENT RE-CALIBRATED!");
      navigate("/bookings");
    } catch (err) {
      toast.error("RE-CALIBRATION FAILED.");
    } finally {
      setUpdateLoading(false);
    }
  };

  if (authLoading || loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-black text-purple-500 animate-pulse uppercase tracking-widest">
        Scanning Matrix...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 sm:px-6 relative overflow-hidden selection:bg-purple-500/30">
      <div className="max-w-2xl mx-auto relative z-10">
        <Link
          to="/bookings"
          className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-400 font-black text-xs uppercase tracking-widest bg-purple-900/20 px-4 py-2 rounded-full border border-purple-500/30 transition-all mb-8"
        >
          <IoChevronBackOutline /> Abort Mission
        </Link>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] border border-purple-500/30 p-6 sm:p-10 rounded-4xl shadow-[0_0_50px_rgba(168,85,247,0.1)]"
        >
          <div className="text-center mb-8">
            <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter text-white">
              Re-Calibrate <span className="text-purple-500">Deployment</span>
            </h1>
            <p className="text-purple-400/50 font-bold text-[10px] uppercase mt-1">
              Operative: {bookingData?.user?.username || bookingData?.name}
            </p>
          </div>

          <div className="flex flex-wrap gap-3 mb-8 pb-6 border-b border-purple-500/20">
            <div className="bg-purple-900/20 border border-purple-500/30 px-4 py-2 rounded-xl flex items-center gap-2 text-[10px] font-black text-purple-300 uppercase">
              <IoHardwareChipOutline /> {bookingData?.stations?.join(", ")}
            </div>
            <div className="bg-purple-900/20 border border-purple-500/30 px-4 py-2 rounded-xl text-[10px] font-black text-purple-300 uppercase">
              Squad: {bookingData?.membersCount}
            </div>
          </div>

          <form onSubmit={handleUpdate} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-purple-500 uppercase ml-2 flex items-center gap-2 tracking-widest">
                <IoCallOutline /> Contact Sync
              </label>
              <input
                required
                type="tel"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                className="w-full bg-purple-900/10 border border-purple-500/20 rounded-xl px-4 py-4 outline-none focus:border-purple-500 text-sm font-bold text-white transition-all"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black text-purple-500 uppercase ml-2 flex items-center gap-2 tracking-widest">
                <IoCalendarOutline /> New Date
              </label>
              <div className="flex gap-2">
                {["Today", "Tomorrow"].map((d) => (
                  <button
                    key={d}
                    type="button"
                    onClick={() => setFormData({ ...formData, date: d })}
                    className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${formData.date === d ? "bg-purple-600 border-purple-400 text-white shadow-lg" : "bg-purple-900/10 border-purple-500/20 text-purple-300/40"}`}
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
                  value={formData.time}
                  onChange={(e) =>
                    setFormData({ ...formData, time: e.target.value })
                  }
                  className="grow bg-purple-900/10 border border-purple-500/20 rounded-xl px-4 py-3 outline-none focus:border-purple-500 text-sm font-bold text-white appearance-none"
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
                      onClick={() => setFormData({ ...formData, period: p })}
                      className={`flex-1 rounded-lg text-[10px] font-black transition-all ${formData.period === p ? "bg-purple-600 text-white shadow-md" : "text-purple-400/40"}`}
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
                    onClick={() => setFormData({ ...formData, duration: h })}
                    className={`flex-1 py-3 rounded-xl border text-[10px] font-black uppercase transition-all ${formData.duration === h ? "bg-purple-600 border-purple-400 text-white" : "bg-purple-900/10 border-purple-500/20 text-purple-300/40"}`}
                  >
                    {h}H
                  </button>
                ))}
              </div>
            </div>

            <button
              type="submit"
              disabled={updateLoading}
              className="w-full flex items-center justify-center gap-3 bg-yellow-600 hover:bg-yellow-500 text-black py-4 rounded-xl font-black text-xs uppercase tracking-[0.2em] mt-6 transition-all shadow-[0_10px_30px_rgba(202,138,4,0.3)] disabled:opacity-50"
            >
              {updateLoading ? (
                "SYNCING..."
              ) : (
                <>
                  <IoSaveOutline className="text-lg" /> CONFIRM RE-CALIBRATION
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default UpdateBooking;
