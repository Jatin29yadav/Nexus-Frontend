import { Outlet, Link, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import Footer from "./Footer";
import CircularMenu from "./Navbar/CircluarNav";
import { IoPersonOutline, IoLogOutOutline } from "react-icons/io5";
import useApi from "../hooks/useApi"; // Added for logout request

const Layout = () => {
  const { user } = useContext(AuthContext);
  const api = useApi();
  const navigate = useNavigate();

  const isAdmin = user?.role === "Admin";

  // 🚨 SECURE LOGOUT LOGIC
  const handleLogout = async () => {
    try {
      await api.post("/users/logout");
      window.location.href = "/login"; // Force reload to clear all contexts
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-50 flex justify-between items-center p-6 md:px-10 pointer-events-none">
        <Link
          to="/"
          className="pointer-events-auto text-2xl md:text-3xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] hover:scale-105 transition-transform"
        >
          NEXUS <span className="text-purple-500">.</span>
        </Link>

        <div className="pointer-events-auto flex items-center gap-3">
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center justify-center bg-red-500/10 border border-red-500/30 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              <span className="hidden sm:block">Command Center</span>
              <span className="sm:hidden text-xs">CMD</span>
            </Link>
          )}

          {user ? (
            <div className="flex items-center gap-2">
              <Link
                to="/profile"
                className="flex items-center justify-center gap-3 bg-black/40 border border-white/10 p-1.5 sm:pr-4 sm:pl-1.5 rounded-xl hover:bg-black/60 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md"
              >
                <div className="w-8 h-8 rounded-lg shadow-[0_0_10px_rgba(168,85,247,0.5)] border border-purple-500/30 bg-purple-900/40 flex items-center justify-center font-black text-purple-400 uppercase">
                  {user.username?.charAt(0)}
                </div>
                <span className="text-xs font-bold tracking-widest uppercase hidden sm:block text-gray-200">
                  {user.username}
                </span>
              </Link>

              {/* 🚨 NEW LOGOUT BUTTON */}
              <button
                onClick={handleLogout}
                className="flex items-center justify-center bg-red-500/10 border border-red-500/30 p-2 sm:px-3 sm:py-2.5 rounded-xl text-red-500 hover:bg-red-600 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
                title="Logout"
              >
                <IoLogOutOutline className="text-lg" />
              </button>
            </div>
          ) : (
            <Link
              to="/login"
              className="flex items-center justify-center gap-3 bg-black/40 border border-white/10 p-1.5 sm:pr-4 sm:pl-1.5 rounded-xl hover:bg-black/60 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md group"
            >
              <div className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 group-hover:text-purple-400 group-hover:border-purple-500/30 transition-all">
                <IoPersonOutline className="text-lg" />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase hidden sm:block text-gray-300 group-hover:text-white transition-colors">
                Identify (Login)
              </span>
            </Link>
          )}
        </div>
      </header>

      <main className="grow">
        <Outlet />
      </main>

      <Footer />

      <CircularMenu />
    </div>
  );
};

export default Layout;
