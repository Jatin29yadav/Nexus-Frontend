import React, { useState, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import {
  IoPersonOutline,
  IoMailOutline,
  IoCallOutline,
  IoSettingsOutline,
  IoWarningOutline,
  IoChevronBackOutline,
  IoSaveOutline,
  IoTrashOutline,
} from "react-icons/io5";

const Profile = () => {
  const navigate = useNavigate();
  const { user, logout, token } = useContext(AuthContext);

  const [isEditing, setIsEditing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    username: user?.username || "",
    phone: user?.phone || "",
  });

  const api = axios.create({
    baseURL: "http://localhost:3005/api",
    headers: { Authorization: `Bearer ${token}` },
  });

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.put("/users/profile", formData);
      toast.success("PROFILE RECALIBRATED SUCCESSFULLY");
      setIsEditing(false);
    } catch (err) {
      toast.error(err.response?.data?.message || "Update Failed");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await api.delete("/users/profile");
      toast.success("OPERATIVE DATA PURGED. GOODBYE.");
      logout();
      navigate("/");
    } catch (err) {
      toast.error(err.response?.data?.message || "Deletion Failed");
    } finally {
      setLoading(false);
    }
  };

  if (!user) return null;

  return (
    <div className="min-h-screen bg-black text-white pt-24 pb-16 px-4 relative overflow-x-hidden overflow-y-auto selection:bg-purple-500/30">
      <div className="absolute top-1/4 -left-32 w-72 md:w-96 h-72 md:h-96 bg-purple-700/20 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-72 md:w-96 h-72 md:h-96 bg-purple-900/20 rounded-full blur-[100px] md:blur-[120px] pointer-events-none" />

      <div className="max-w-xl mx-auto relative z-10">
        <button
          onClick={() => navigate("/")}
          className="inline-flex items-center gap-2 text-purple-500 hover:text-purple-400 font-black text-[10px] md:text-xs uppercase tracking-widest bg-purple-900/20 px-3 md:px-4 py-2 rounded-full border border-purple-500/30 transition-all mb-6 md:mb-8"
        >
          <IoChevronBackOutline /> COMMAND CENTER
        </button>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#0a0a0a] border border-purple-500/30 p-5 sm:p-8 md:p-10 rounded-3xl md:rounded-[2.5rem] shadow-[0_0_50px_rgba(168,85,247,0.1)]"
        >
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 border-b border-purple-500/20 pb-6 mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 bg-purple-900/40 border border-purple-500/50 rounded-2xl flex items-center justify-center text-3xl sm:text-4xl font-black text-purple-400 uppercase shadow-[0_0_20px_rgba(168,85,247,0.2)] shrink-0">
              {user.username?.charAt(0)}
            </div>
            <div className="text-center sm:text-left flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-tighter truncate">
                {user.username}
              </h1>
              <span className="inline-block bg-purple-500/20 text-purple-400 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-md mt-2 border border-purple-500/30">
                Nexus {user.role || "Operative"}
              </span>
            </div>
            {!isEditing && (
              <button
                onClick={() => setIsEditing(true)}
                className="p-3 bg-purple-900/20 text-purple-400 hover:text-white hover:bg-purple-600 rounded-xl transition-all border border-purple-500/30"
              >
                <IoSettingsOutline className="text-xl" />
              </button>
            )}
          </div>

          <AnimatePresence mode="wait">
            {!isEditing ? (
              <motion.div
                key="view"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="space-y-4"
              >
                <div className="bg-purple-900/10 border border-purple-500/10 p-4 rounded-xl flex items-center gap-4 break-all sm:break-normal">
                  <IoMailOutline className="text-purple-500 text-xl shrink-0" />
                  <div className="min-w-0">
                    <p className="text-[9px] sm:text-[10px] font-black text-purple-500/60 uppercase tracking-widest">
                      Secure Comms (Email)
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-300 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>

                <div className="bg-purple-900/10 border border-purple-500/10 p-4 rounded-xl flex items-center gap-4">
                  <IoCallOutline className="text-purple-500 text-xl shrink-0" />
                  <div>
                    <p className="text-[9px] sm:text-[10px] font-black text-purple-500/60 uppercase tracking-widest">
                      Encrypted Line (Phone)
                    </p>
                    <p className="text-xs sm:text-sm font-bold text-gray-300">
                      {user.phone || "Not Provided"}
                    </p>
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="edit"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
              >
                <form onSubmit={handleUpdate} className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-purple-500 uppercase tracking-widest ml-1">
                      Operative Alias
                    </label>
                    <div className="relative">
                      <IoPersonOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/60" />
                      <input
                        type="text"
                        value={formData.username}
                        onChange={(e) =>
                          setFormData({ ...formData, username: e.target.value })
                        }
                        className="w-full bg-purple-900/10 border border-purple-500/30 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-purple-500 text-xs sm:text-sm font-bold text-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black text-purple-500 uppercase tracking-widest ml-1">
                      Contact Number
                    </label>
                    <div className="relative">
                      <IoCallOutline className="absolute left-4 top-1/2 -translate-y-1/2 text-purple-500/60" />
                      <input
                        type="tel"
                        value={formData.phone}
                        onChange={(e) =>
                          setFormData({ ...formData, phone: e.target.value })
                        }
                        className="w-full bg-purple-900/10 border border-purple-500/30 rounded-xl pl-11 pr-4 py-3 outline-none focus:border-purple-500 text-xs sm:text-sm font-bold text-white transition-all"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 pt-4">
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="flex-1 py-3 border border-purple-500/30 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-purple-900/20 transition-all"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="flex-1 py-3 bg-purple-600 hover:bg-purple-500 rounded-xl text-[10px] sm:text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 transition-all shadow-[0_5px_15px_rgba(168,85,247,0.3)] disabled:opacity-50"
                    >
                      <IoSaveOutline className="text-lg" />{" "}
                      {loading ? "Syncing..." : "Save Changes"}
                    </button>
                  </div>
                </form>
              </motion.div>
            )}
          </AnimatePresence>

          {!isEditing && (
            <div className="mt-8 pt-8 border-t border-red-500/10">
              {!showDeleteConfirm ? (
                <button
                  onClick={() => setShowDeleteConfirm(true)}
                  className="w-full flex items-center justify-center gap-2 py-4 rounded-xl border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all text-[10px] sm:text-xs font-black uppercase tracking-widest"
                >
                  <IoTrashOutline className="text-lg" /> Purge Operative Data
                </button>
              ) : (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-red-950/30 border border-red-500/30 p-4 sm:p-5 rounded-xl text-center"
                >
                  <IoWarningOutline className="text-3xl sm:text-4xl text-red-500 mx-auto mb-2" />
                  <h4 className="text-red-500 font-black uppercase tracking-widest text-[10px] sm:text-xs mb-4 leading-relaxed">
                    Warning: This action is irreversible. All bookings and
                    records will be wiped.
                  </h4>
                  <div className="flex flex-col sm:flex-row gap-3">
                    <button
                      onClick={() => setShowDeleteConfirm(false)}
                      className="flex-1 py-3 bg-transparent border border-red-500/30 text-red-400 rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest hover:bg-red-900/30"
                    >
                      Abort
                    </button>
                    <button
                      onClick={handleDelete}
                      disabled={loading}
                      className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white rounded-lg text-[10px] sm:text-xs font-black uppercase tracking-widest flex justify-center items-center gap-2 shadow-[0_0_15px_rgba(239,68,68,0.4)]"
                    >
                      {loading ? "Purging..." : "Confirm Purge"}
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Profile;
