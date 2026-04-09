import React, { useState } from "react";
import { motion } from "framer-motion";

const Toggle = ({ enabled, setEnabled }) => (
  <button
    onClick={() => setEnabled(!enabled)}
    className={`relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center justify-center rounded-full border-2 border-transparent focus:outline-none transition-colors duration-300 ${enabled ? "bg-purple-600" : "bg-gray-700"}`}
  >
    <span
      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-300 ease-in-out ${enabled ? "translate-x-4" : "translate-x-0"}`}
    />
  </button>
);

const AdminSettings = () => {
  const [maintenance, setMaintenance] = useState(false);
  const [newSignups, setNewSignups] = useState(true);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-3xl mx-auto space-y-6"
    >
      <div className="mb-8">
        <h2 className="text-3xl font-black uppercase tracking-tighter text-white">
          System Config
        </h2>
        <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mt-1">
          Core Nexus Parameters & Settings
        </p>
      </div>

      <div className="space-y-6">
        {/* Toggle Settings */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 border-b border-white/5 pb-4">
            Security Overrides
          </h3>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-wider">
                Maintenance Mode
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                Lock down the entire platform. Only admins can enter.
              </p>
            </div>
            <Toggle enabled={maintenance} setEnabled={setMaintenance} />
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-bold text-white uppercase tracking-wider">
                Allow New Operatives
              </p>
              <p className="text-[10px] text-gray-500 uppercase tracking-widest mt-1">
                Accept new signups from the public facing port.
              </p>
            </div>
            <Toggle enabled={newSignups} setEnabled={setNewSignups} />
          </div>
        </div>

        {/* Value Settings */}
        <div className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-6 space-y-6">
          <h3 className="text-xs font-black uppercase tracking-widest text-purple-400 border-b border-white/5 pb-4">
            Pricing Parameters
          </h3>

          <div className="space-y-4">
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                Base Hourly Rate (₹)
              </label>
              <input
                type="number"
                defaultValue={150}
                className="w-full bg-[#050505] border border-white/10 rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all"
              />
            </div>
            <button className="w-full bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest text-[10px] py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)]">
              Update System Parameters
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default AdminSettings;
