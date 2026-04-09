import React from "react";
import { motion } from "framer-motion";
import { IoShieldCheckmarkOutline, IoBanOutline } from "react-icons/io5";

const AdminUsers = () => {
  // Dummy data
  const users = [
    {
      id: "OP-001",
      name: "Jatin Yadav",
      email: "jatin@nexus.com",
      role: "Admin",
      joined: "15 Jan 2026",
      status: "Active",
    },
    {
      id: "OP-089",
      name: "Dhruv",
      email: "dhruv@nexus.com",
      role: "User",
      joined: "10 Mar 2026",
      status: "Active",
    },
    {
      id: "OP-102",
      name: "Kartik",
      email: "kartik@nexus.com",
      role: "User",
      joined: "27 Mar 2026",
      status: "Active",
    },
    {
      id: "OP-155",
      name: "RogueGamer",
      email: "rogue@example.com",
      role: "User",
      joined: "02 Apr 2026",
      status: "Banned",
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
            Operative Registry
          </h2>
          <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
            Database of all registered network users
          </p>
        </div>
      </div>

      <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-150">
            <thead>
              <tr className="bg-white/2 border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                <th className="p-4 pl-6">Operative ID</th>
                <th className="p-4">Identity</th>
                <th className="p-4">Clearance Level</th>
                <th className="p-4">Joined Date</th>
                <th className="p-4">Status</th>
                <th className="p-4 pr-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user, i) => (
                <tr
                  key={i}
                  className="border-b border-white/5 hover:bg-white/2 transition-colors text-xs font-bold text-gray-300"
                >
                  <td className="p-4 pl-6 font-mono text-purple-400">
                    {user.id}
                  </td>
                  <td className="p-4">
                    <span className="block text-white uppercase tracking-wider">
                      {user.name}
                    </span>
                    <span className="block text-[9px] text-gray-500 tracking-widest lowercase">
                      {user.email}
                    </span>
                  </td>
                  <td className="p-4">
                    <span
                      className={`flex w-max items-center gap-2 px-2 py-1 rounded text-[9px] uppercase tracking-widest ${user.role === "Admin" ? "text-red-400 bg-red-500/10 border border-red-500/20" : "text-gray-400"}`}
                    >
                      {user.role === "Admin" && <IoShieldCheckmarkOutline />}{" "}
                      {user.role}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-gray-400">{user.joined}</td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-[9px] uppercase tracking-widest border ${
                        user.status === "Active"
                          ? "bg-green-500/10 text-green-400 border-green-500/20"
                          : "bg-red-500/10 text-red-400 border-red-500/20"
                      }`}
                    >
                      {user.status}
                    </span>
                  </td>
                  <td className="p-4 pr-6">
                    <div className="flex items-center justify-end gap-2">
                      <button
                        className="p-2 bg-red-500/10 text-red-500 hover:bg-red-500 hover:text-white rounded-lg transition-colors border border-red-500/20"
                        title={user.status === "Banned" ? "Unban" : "Ban User"}
                      >
                        <IoBanOutline size={18} />
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

export default AdminUsers;
