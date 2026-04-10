import { motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { Loader2 } from "lucide-react";
import useApi from "../../hooks/useApi";

const AdminHUD = () => {
  const api = useApi();

  const { data, isLoading, isError } = useQuery({
    queryKey: ["adminDashboardStats"],
    queryFn: async () => {
      const response = await api.get("/admin/dashboard");
      return response.data.data;
    },
  });

  if (isLoading) {
    return (
      <div className="max-w-6xl min-h-[60vh] mx-auto flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-red-500 animate-spin" />
        <p className="text-[10px] font-mono tracking-[0.5em] text-gray-500 uppercase">
          Decrypting Server Data...
        </p>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="max-w-6xl mx-auto p-6 bg-red-500/10 border border-red-500/30 rounded-3xl text-center">
        <p className="text-xs font-bold tracking-widest text-red-400 uppercase">
          Connection to Mainframe Lost. Check Backend Server.
        </p>
      </div>
    );
  }

  const stats = [
    {
      label: "Active Deployments",
      value: data?.activeBookingsCount || "0",
      status: "Live",
      color: "text-green-400",
    },
    {
      label: "Total Stations",
      value: data?.totalStations || "0",
      status: "Online",
      color: "text-purple-400",
    },
    {
      label: "Pending Requests",
      value: "0",
      status: "Action Req.",
      color: "text-red-400",
    },
    {
      label: "Total Operatives",
      value: data?.totalGamers || "0",
      status: "Steady",
      color: "text-blue-400",
    },
  ];

  const recentBookings = data?.activeBookingsData || [];

  return (
    <div className="max-w-6xl mx-auto space-y-6 md:space-y-8 pb-10">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: i * 0.1 }}
            className="bg-[#0a0a0a] border border-white/5 rounded-3xl p-5 md:p-6 relative overflow-hidden group"
          >
            <div className="absolute top-0 right-0 p-4 opacity-20 group-hover:opacity-100 transition-opacity">
              <span
                className={`text-[10px] font-black uppercase tracking-widest ${stat.color}`}
              >
                {stat.status}
              </span>
            </div>
            <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1 md:mb-2">
              {stat.label}
            </p>
            <h3 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
              {stat.value}
            </h3>
          </motion.div>
        ))}
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        className="bg-[#0a0a0a] border border-white/5 rounded-3xl overflow-hidden w-full"
      >
        <div className="p-5 md:p-6 border-b border-white/5 flex justify-between items-center">
          <h3 className="text-xs font-black uppercase tracking-widest text-white">
            Live Deployments Matrix
          </h3>
        </div>

        <div className="w-full overflow-x-auto scrollbar-hide">
          <table className="w-full text-left border-collapse min-w-175">
            <thead>
              <tr className="bg-white/2 border-b border-white/5 text-[9px] font-black uppercase tracking-[0.2em] text-gray-500">
                <th className="p-4 pl-6">Mission ID</th>
                <th className="p-4">Operative</th>
                <th className="p-4">Stations</th>
                <th className="p-4">Time Window</th>
                <th className="p-4 pr-6">Status</th>
              </tr>
            </thead>
            <tbody>
              {recentBookings.length > 0 ? (
                recentBookings.map((booking, i) => (
                  <tr
                    key={i}
                    className="border-b border-white/5 hover:bg-white/2 transition-colors text-xs font-bold text-gray-300"
                  >
                    <td className="p-4 pl-6 font-mono text-purple-400">
                      {booking._id
                        ? booking._id.slice(-6).toUpperCase()
                        : "N/A"}
                    </td>
                    <td className="p-4 uppercase tracking-wider text-white">
                      {booking.user?.username || "Unknown"}
                    </td>
                    <td className="p-4 uppercase tracking-wider text-purple-300">
                      {booking.stations?.join(", ") || "N/A"}
                    </td>
                    <td className="p-4 font-mono text-gray-400">
                      {new Date(booking.bookingTime.start).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                        },
                      )}
                    </td>
                    <td className="p-4 pr-6">
                      <span className="px-3 py-1 rounded-full text-[9px] uppercase tracking-widest border bg-green-500/10 text-green-400 border-green-500/20">
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="p-8 text-center text-xs font-bold text-gray-500 uppercase tracking-widest"
                  >
                    No active deployments found in the database.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminHUD;
