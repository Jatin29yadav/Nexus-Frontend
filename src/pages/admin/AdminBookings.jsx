import React from "react";
import { motion } from "framer-motion";
import {
  IoCheckmarkCircleOutline,
  IoCloseCircleOutline,
} from "react-icons/io5";

const AdminBookings = () => {
  // Dummy data (Ready for backend fetch)
  const bookings = [
    {
      id: "NX-8821",
      user: "Jatin Yadav",
      email: "jatin@nexus.com",
      station: "PC-12 (Alpha Zone)",
      time: "14:00 - 17:00",
      date: "28 Oct 2026",
      status: "Active",
    },
    {
      id: "NX-8822",
      user: "Kartik",
      email: "kartik@nexus.com",
      station: "PS5-02 (Console HQ)",
      time: "15:00 - 16:00",
      date: "28 Oct 2026",
      status: "Pending",
    },
    {
      id: "NX-8823",
      user: "Dhruv",
      email: "dhruv@nexus.com",
      station: "VR-01 (Sanctum)",
      time: "12:00 - 14:00",
      date: "27 Oct 2026",
      status: "Completed",
    },
    {
      id: "NX-8824",
      user: "Rhythm",
      email: "rhythm@nexus.com",
      station: "PC-05 (Alpha Zone)",
      time: "18:00 - 21:00",
      date: "29 Oct 2026",
      status: "Cancelled",
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto space-y-6"
    >
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-4 mb-8">
        <div>
          <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
            Deployments Log
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Manage all operative station bookings
          </p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="bg-white/2 border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                <th className="p-4 pl-6">Mission ID</th>
                <th className="p-4">Operative Info</th>
                <th className="p-4">Station</th>
                <th className="p-4">Schedule</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking, i) => (
                <tr
                  key={i}
                  className="border-b border-white/5 hover:bg-white/2 transition-colors text-xs font-bold text-gray-300"
                >
                  <td className="p-4 pl-6 font-mono text-purple-400">
                    {booking.id}
                  </td>
                  <td className="p-4">
                    <span className="block text-white uppercase tracking-wider">
                      {booking.user}
                    </span>
                    <span className="block text-[9px] text-gray-500 tracking-widest lowercase">
                      {booking.email}
                    </span>
                  </td>
                  <td className="p-4 uppercase tracking-wider">
                    {booking.station}
                  </td>
                  <td className="p-4 font-mono text-gray-400">
                    <span className="block">{booking.date}</span>
                    <span className="block text-[9px] text-gray-500">
                      {booking.time}
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
                      {booking.status === "Pending" && (
                        <button
                          className="p-2 bg-green-500/10 text-green-500 hover:bg-green-500 hover:text-white rounded-lg transition-colors border border-green-500/20"
                          title="Approve"
                        >
                          <IoCheckmarkCircleOutline size={18} />
                        </button>
                      )}
                      {booking.status !== "Cancelled" &&
                        booking.status !== "Completed" && (
                          <button
                            className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                            title="Cancel"
                          >
                            <IoCloseCircleOutline size={18} />
                          </button>
                        )}
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

export default AdminBookings;
