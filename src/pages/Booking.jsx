import { useState, useEffect, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import useApi from "../hooks/useApi";
import { useNavigate } from "react-router-dom";
import PlayerAmount from "../components/PlayerAmount";
import StationGrid from "../components/StationGrid";
import HUDTimePicker from "../components/HUDTimePicker";
import { AuthContext } from "../context/AuthContext"; // ✅ Custom Auth
import {
  IoCallOutline,
  IoChevronBackOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

const Booking = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useContext(AuthContext); // ✅ Clean Context
  const api = useApi();

  const [step, setStep] = useState(1);
  const [playerCount, setPlayerCount] = useState(0);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    startTime: "",
    duration: 1,
    totalPrice: 100,
    selectedDate: "Today",
  });

  // 🛡️ Sync user data once loaded
  useEffect(() => {
    if (!authLoading) {
      if (user) {
        setFormData((prev) => ({
          ...prev,
          name: user.username || "",
          email: user.email || "",
        }));
      } else {
        navigate("/login", {
          state: { message: "Access Denied! Login required." },
        });
      }
    }
  }, [user, authLoading, navigate]);

  const handleFinalSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const now = new Date();
      let targetDate = new Date();

      if (formData.selectedDate === "Tomorrow") {
        targetDate.setDate(now.getDate() + 1);
      } else if (formData.selectedDate !== "Today") {
        const [day, month] = formData.selectedDate.split(" ");
        const monthMap = { April: 3, May: 4 };
        targetDate.setDate(parseInt(day));
        targetDate.setMonth(monthMap[month]);
      }

      const [hours, minutes] = formData.startTime.split(":");
      targetDate.setHours(parseInt(hours), parseInt(minutes), 0, 0);

      const startISO = targetDate.toISOString();
      const endISO = new Date(
        targetDate.getTime() + formData.duration * 60 * 60 * 1000,
      ).toISOString();

      const payload = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        bookingType: selectedSeats[0]?.startsWith("C") ? "Console" : "PC",
        membersCount: playerCount,
        membersName: [formData.name],
        bookingTime: { start: startISO, end: endISO },
        stations: selectedSeats,
        totalAmount: formData.totalPrice,
      };

      const res = await api.post("/bookings", payload);

      if (res.data.success) setStep(4);
    } catch (err) {
      setError(err.response?.data?.message || "Deployment failed.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center font-black text-purple-500 animate-pulse">
        AUTHENTICATING SYSTEM...
      </div>
    );
  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={() => navigate("/")}
              className="fixed top-24 left-4 md:top-28 md:left-10 flex items-center gap-1 text-purple-500 font-black text-[10px] uppercase tracking-widest z-[999] bg-purple-500/10 px-4 py-2 rounded-full border border-purple-500/20 hover:bg-purple-500/20 transition-all"
            >
              <IoChevronBackOutline /> BACK TO HUB
            </button>
            <PlayerAmount
              onSelectionComplete={(size) => {
                setPlayerCount(size);
                setStep(2);
              }}
            />
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
          >
            <button
              onClick={() => setStep(1)}
              className="fixed top-24 left-4 md:top-28 md:left-10 flex items-center gap-1 text-purple-500 font-black text-[10px] uppercase tracking-widest z-50 bg-purple-500/10 px-3 py-2 rounded-full border border-purple-500/20"
            >
              <IoChevronBackOutline /> SQUAD SIZE
            </button>
            <StationGrid
              maxSelectable={playerCount}
              onFinalize={(seats) => {
                setSelectedSeats(seats);
                setStep(3);
              }}
            />
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            className="flex items-center justify-center min-h-[80vh] p-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <div className="w-full max-w-lg bg-[#0a0a0a] border border-purple-500/20 p-6 md:p-10 rounded-[2.5rem] shadow-[0_0_80px_rgba(168,85,247,0.1)] relative">
              <button
                onClick={() => setStep(2)}
                className="absolute top-6 left-6 text-purple-500 text-xl"
              >
                <IoChevronBackOutline />
              </button>
              <h2 className="text-xl md:text-2xl font-black mb-1 uppercase tracking-tighter text-center">
                Deploying to Base
              </h2>
              <form onSubmit={handleFinalSubmit} className="space-y-4">
                <div className="relative group mt-6">
                  <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500 text-lg" />
                  <input
                    required
                    type="tel"
                    placeholder="CONTACT NUMBER"
                    className="w-full bg-purple-900/10 border border-purple-500/20 rounded-xl pl-12 pr-4 py-4 outline-none focus:border-purple-500 text-sm font-bold text-white"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                </div>
                <HUDTimePicker
                  playerCount={playerCount}
                  onDataUpdate={(data) => setFormData({ ...formData, ...data })}
                />
                {error && (
                  <p className="text-red-500 text-[10px] font-black text-center uppercase animate-pulse">
                    {error}
                  </p>
                )}
                <button
                  disabled={loading}
                  type="submit"
                  className="w-full bg-purple-600 hover:bg-purple-500 py-4 rounded-2xl font-black text-sm md:text-lg shadow-[0_10px_20px_rgba(168,85,247,0.3)] mt-4 uppercase tracking-widest transition-all"
                >
                  {loading ? "UPLOADING..." : "FINALIZE DEPLOYMENT"}
                </button>
              </form>
            </div>
          </motion.div>
        )}

        {step === 4 && (
          <motion.div
            key="step4"
            className="fixed inset-0 flex items-center justify-center bg-black z-1000"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <div className="text-center">
              <IoCheckmarkCircleOutline className="text-[120px] text-purple-500 mx-auto drop-shadow-[0_0_30px_rgba(168,85,247,0.8)]" />
              <h1 className="text-3xl md:text-5xl font-black tracking-tighter italic mt-6 uppercase">
                MISSION ACCOMPLISHED
              </h1>
              <button
                onClick={() => navigate("/bookings")}
                className="mt-10 px-10 py-4 border-2 border-purple-500 rounded-full font-black text-xs hover:bg-purple-500 transition-all uppercase tracking-widest"
              >
                Return to Dashboard
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Booking;
