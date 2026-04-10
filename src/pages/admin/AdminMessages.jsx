import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  IoMailOpenOutline,
  IoTrashBinOutline,
  IoCheckmarkDoneOutline,
  IoChevronDownOutline,
  IoPersonOutline,
  IoMailOutline,
  IoTimeOutline,
} from "react-icons/io5";
import useApi from "../../hooks/useApi"; // Adjust path if needed
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const AdminMessages = () => {
  const api = useApi();
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedMsg, setExpandedMsg] = useState(null);
  const [actionLoading, setActionLoading] = useState(null);

  // 🚨 NEW STATE: Track which message is being deleted
  const [deleteTarget, setDeleteTarget] = useState(null);

  // 📡 FETCH MESSAGES FROM BACKEND
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await api.get("/messages");
        if (response.data.success) {
          setMessages(response.data.messages || response.data.data || []);
        }
      } catch (error) {
        toast.error("Failed to fetch comms from mainframe.");
      } finally {
        setLoading(false);
      }
    };
    fetchMessages();
  }, [api]);

  // 🟢 MARK AS READ
  const handleMarkRead = async (id) => {
    setActionLoading(`read-${id}`);
    try {
      await api.put(`/messages/${id}/read`);
      setMessages((prev) =>
        prev.map((msg) => (msg._id === id ? { ...msg, status: "Read" } : msg)),
      );
      toast.success("Transmission marked as Read.");
    } catch (error) {
      toast.error("Action failed.");
    } finally {
      setActionLoading(null);
    }
  };

  // 🔴 CONFIRM DELETE LOGIC
  const confirmDelete = async () => {
    if (!deleteTarget) return;
    setActionLoading(`delete-${deleteTarget}`);

    try {
      await api.delete(`/messages/${deleteTarget}`);
      setMessages((prev) => prev.filter((msg) => msg._id !== deleteTarget));
      toast.success("Transmission deleted from logs.");
    } catch (error) {
      toast.error("Deletion failed.");
    } finally {
      setActionLoading(null);
      setDeleteTarget(null); // Close the modal
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <Loader2 className="w-10 h-10 text-purple-500 animate-spin" />
        <span className="text-purple-500 font-black uppercase text-xs tracking-widest animate-pulse">
          Decrypting Comms...
        </span>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-6 pb-20 relative"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
            Comms <span className="text-purple-500">Relay</span>
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Incoming transmissions from operatives
          </p>
        </div>
      </div>

      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-10 text-center text-gray-500 text-xs font-bold uppercase tracking-widest">
            Inbox Empty. No incoming transmissions.
          </div>
        ) : (
          messages.map((msg) => (
            <div
              key={msg._id}
              className={`bg-[#0a0a0a] border rounded-2xl overflow-hidden transition-all ${
                msg.status === "New" || msg.status === "Unread"
                  ? "border-blue-500/30 shadow-[0_0_20px_rgba(59,130,246,0.05)]"
                  : "border-white/10"
              }`}
            >
              {/* 🎯 ACCORDION HEADER (Highlight Details) */}
              <div
                onClick={() =>
                  setExpandedMsg(expandedMsg === msg._id ? null : msg._id)
                }
                className="p-5 sm:p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 cursor-pointer hover:bg-white/5 transition-colors"
              >
                <div className="flex items-center gap-4 w-full sm:w-auto overflow-hidden">
                  <div
                    className={`shrink-0 w-12 h-12 rounded-xl flex items-center justify-center border ${
                      msg.status === "New" || msg.status === "Unread"
                        ? "bg-blue-500/10 border-blue-500/30 text-blue-500"
                        : "bg-white/5 border-white/10 text-gray-500"
                    }`}
                  >
                    <IoMailOutline className="text-2xl" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h3 className="text-sm md:text-base font-black text-white uppercase tracking-wider truncate">
                      {msg.subject || "No Subject"}
                    </h3>
                    <div className="flex flex-wrap items-center gap-2 mt-1">
                      <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest truncate">
                        From:{" "}
                        <span className="text-purple-400">{msg.name}</span>
                      </span>
                      <span className="text-[10px] text-gray-600 hidden sm:inline">
                        •
                      </span>
                      <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest flex items-center gap-1">
                        <IoTimeOutline />
                        {new Date(
                          msg.createdAt || Date.now(),
                        ).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-4 w-full sm:w-auto border-t sm:border-t-0 border-white/5 pt-4 sm:pt-0">
                  <span
                    className={`px-4 py-1.5 rounded-lg text-[9px] uppercase tracking-widest font-black border ${
                      msg.status === "New" || msg.status === "Unread"
                        ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                        : "bg-gray-800/50 text-gray-400 border-gray-700/50"
                    }`}
                  >
                    {msg.status || "Unread"}
                  </span>
                  <IoChevronDownOutline
                    className={`text-xl text-gray-500 transition-transform duration-300 ${
                      expandedMsg === msg._id ? "rotate-180" : ""
                    }`}
                  />
                </div>
              </div>

              {/* 📖 ACCORDION BODY (Full Message & Actions) */}
              <AnimatePresence>
                {expandedMsg === msg._id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="border-t border-white/5 bg-[#050505]"
                  >
                    <div className="p-5 sm:p-8">
                      <div className="flex flex-col sm:flex-row gap-6 mb-8">
                        {/* Sender Details Box */}
                        <div className="bg-white/5 border border-white/10 rounded-xl p-4 sm:w-64 shrink-0 h-fit">
                          <span className="text-[8px] font-black uppercase tracking-widest text-purple-500 mb-3 block border-b border-white/5 pb-2">
                            Operative Intel
                          </span>
                          <div className="space-y-3">
                            <p className="text-[10px] font-bold text-gray-400 flex items-center gap-2 truncate">
                              <IoPersonOutline className="text-gray-500" />{" "}
                              {msg.name}
                            </p>
                            <p className="text-[10px] font-bold text-gray-400 flex items-center gap-2 truncate">
                              <IoMailOutline className="text-gray-500" />{" "}
                              {msg.email}
                            </p>
                            {msg.phone && (
                              <p className="text-[10px] font-bold text-gray-400 flex items-center gap-2 truncate">
                                <IoPersonOutline className="text-gray-500" />{" "}
                                {msg.phone}
                              </p>
                            )}
                          </div>
                        </div>

                        {/* Message Content */}
                        <div className="flex-1">
                          <span className="text-[8px] font-black uppercase tracking-widest text-purple-500 mb-3 block">
                            Transmission Content
                          </span>
                          <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap font-medium">
                            {msg.message}
                          </p>
                        </div>
                      </div>

                      {/* 🛠️ ACTION BUTTONS */}
                      <div className="flex flex-wrap gap-4 pt-6 border-t border-white/5">
                        {(msg.status === "New" || msg.status === "Unread") && (
                          <button
                            onClick={() => handleMarkRead(msg._id)}
                            disabled={actionLoading === `read-${msg._id}`}
                            className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-blue-600/10 hover:bg-blue-600 text-blue-500 hover:text-white border border-blue-500/20 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                          >
                            {actionLoading === `read-${msg._id}` ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <>
                                <IoCheckmarkDoneOutline className="text-base" />{" "}
                                Mark Read
                              </>
                            )}
                          </button>
                        )}

                        <button
                          // 🚨 Triggers Modal Instead of Alert
                          onClick={() => setDeleteTarget(msg._id)}
                          className="flex-1 sm:flex-none flex items-center justify-center gap-2 bg-red-600/10 hover:bg-red-600 text-red-500 hover:text-white border border-red-500/20 px-6 py-3 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all disabled:opacity-50"
                        >
                          <IoTrashBinOutline className="text-base" /> Delete
                        </button>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))
        )}
      </div>

      {/* 🚨 PREMIUM DANGER MODAL (Replaces window.confirm) */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[1000] flex items-center justify-center bg-black/95 backdrop-blur-sm p-4"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="bg-[#0a0a0a] border border-red-500/30 w-full max-w-sm p-8 rounded-[2.5rem] text-center shadow-[0_0_50px_rgba(239,68,68,0.1)]"
            >
              <div className="w-20 h-20 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6 border border-red-500/20">
                <IoTrashBinOutline className="text-4xl text-red-500" />
              </div>
              <h2 className="text-2xl font-black uppercase text-white mb-2 tracking-tighter">
                Delete Comms?
              </h2>
              <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest leading-relaxed mb-8 px-4">
                This transmission will be permanently erased from the mainframe.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="flex-1 bg-white/5 text-white py-4 rounded-2xl font-black text-[10px] uppercase hover:bg-white/10 transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  disabled={actionLoading === `delete-${deleteTarget}`}
                  className="flex-1 bg-red-600 text-white py-4 rounded-2xl font-black text-[10px] uppercase shadow-[0_10px_20px_rgba(220,38,38,0.3)] disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {actionLoading === `delete-${deleteTarget}` ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    "Confirm"
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default AdminMessages;
