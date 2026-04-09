import React from "react";
import { motion } from "framer-motion";
import {
  IoMailOpenOutline,
  IoTrashBinOutline,
  IoCheckmarkDoneOutline,
} from "react-icons/io5";

const AdminMessages = () => {
  // Dummy data for contact messages
  const messages = [
    {
      id: "MSG-001",
      name: "Rahul Sharma",
      email: "rahul.s@example.com",
      subject: "Tournament Registration Issue",
      date: "28 Oct 2026",
      status: "New",
    },
    {
      id: "MSG-002",
      name: "Aman Gaming",
      email: "aman.g@example.com",
      subject: "Collaboration Inquiry",
      date: "27 Oct 2026",
      status: "Read",
    },
    {
      id: "MSG-003",
      name: "Priya Singh",
      email: "priya99@example.com",
      subject: "Payment failed for PC-12",
      date: "27 Oct 2026",
      status: "Replied",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-6 pb-10"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
            Comms Relay
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Incoming transmissions from operatives
          </p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden w-full">
        <div className="w-full overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-[700px]">
            <thead>
              <tr className="bg-white/[0.02] border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                <th className="p-4 pl-6">Transmission ID</th>
                <th className="p-4">Sender Intel</th>
                <th className="p-4">Subject</th>
                <th className="p-4">Timestamp</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {messages.map((msg, i) => (
                <tr
                  key={i}
                  className={`border-b border-white/5 transition-colors text-xs font-bold text-gray-300 ${msg.status === "New" ? "bg-white/[0.04]" : "hover:bg-white/[0.02]"}`}
                >
                  <td className="p-4 pl-6 font-mono text-purple-400">
                    {msg.id}
                  </td>
                  <td className="p-4">
                    <span className="block text-white uppercase tracking-wider">
                      {msg.name}
                    </span>
                    <span className="block text-[9px] text-gray-500 tracking-widest lowercase">
                      {msg.email}
                    </span>
                  </td>
                  <td className="p-4 text-white">{msg.subject}</td>
                  <td className="p-4 font-mono text-gray-400">{msg.date}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest border ${
                        msg.status === "New"
                          ? "bg-blue-500/10 text-blue-400 border-blue-500/20"
                          : msg.status === "Replied"
                            ? "bg-green-500/10 text-green-400 border-green-500/20"
                            : "bg-gray-500/10 text-gray-400 border-gray-500/20"
                      }`}
                    >
                      {msg.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      {msg.status === "New" && (
                        <button
                          className="p-2 bg-blue-500/10 text-blue-500 hover:bg-blue-500 hover:text-white rounded-lg transition-colors border border-blue-500/20"
                          title="Mark as Read"
                        >
                          <IoCheckmarkDoneOutline size={18} />
                        </button>
                      )}
                      <button
                        className="p-2 bg-purple-500/10 text-purple-400 hover:bg-purple-500 hover:text-white rounded-lg transition-colors border border-purple-500/20"
                        title="Read Message"
                      >
                        <IoMailOpenOutline size={18} />
                      </button>
                      <button
                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                        title="Delete"
                      >
                        <IoTrashBinOutline size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminMessages;
