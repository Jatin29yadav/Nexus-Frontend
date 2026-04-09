import React, { useState } from "react";
import { NavLink, Outlet, Link } from "react-router-dom";
import {
  IoGridOutline,
  IoDesktopOutline,
  IoPeopleOutline,
  IoSettingsOutline,
  IoLogOutOutline,
  IoMenu,
  IoMailOutline,
  IoClose,
} from "react-icons/io5";
import { motion, AnimatePresence } from "framer-motion";

import CircularMenu from "../../components/Navbar/CircluarNav";

const AdminLayout = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { name: "HUD (Dashboard)", path: "/admin", icon: <IoGridOutline /> },
    {
      name: "Deployments",
      path: "/admin/bookings",
      icon: <IoDesktopOutline />,
    },
    { name: "Operatives", path: "/admin/users", icon: <IoPeopleOutline /> },
    {
      name: "Comms (Messages)",
      path: "/admin/messages",
      icon: <IoMailOutline />,
    },
    {
      name: "System Config",
      path: "/admin/settings",
      icon: <IoSettingsOutline />,
    },
  ];

  const closeMenu = () => setIsMobileMenuOpen(false);

  return (
    <div className="fixed inset-0 bg-[#050505] text-white flex z-100">
      {/* ⬛ DESKTOP SIDEBAR */}
      <aside className="w-64 bg-[#0a0a0a] border-r border-white/5 hidden md:flex flex-col shrink-0 h-full">
        <div className="p-8 border-b border-white/5 shrink-0">
          <Link
            to="/"
            className="text-2xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]"
          >
            NEXUS <span className="text-red-500">CMD.</span>
          </Link>
          <span className="block text-[8px] font-mono tracking-[0.5em] text-red-500 uppercase mt-2">
            Restricted Access
          </span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              end={item.path === "/admin"}
              className={({ isActive }) =>
                `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                  isActive
                    ? "bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                    : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                }`
              }
            >
              <span className="text-lg">{item.icon}</span>
              {item.name}
            </NavLink>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5 shrink-0">
          <button className="flex items-center gap-3 px-4 py-3 w-full rounded-xl text-xs font-bold uppercase tracking-widest text-gray-500 hover:text-red-500 hover:bg-red-500/10 transition-all">
            <IoLogOutOutline className="text-lg" />
            Evacuate (Exit)
          </button>
        </div>
      </aside>

      {/* 🔲 MAIN RIGHT AREA */}
      {/* 🚨 THE MAGIC FIX: Added 'min-w-0' so this flex child doesn't stretch infinitely! */}
      <main className="flex-1 flex flex-col h-full relative min-w-0">
        {/* 🚨 TOP ADMIN NAVBAR */}
        <header className="h-16 md:h-20 bg-[#0a0a0a] border-b border-white/5 flex items-center justify-between px-4 md:px-8 shrink-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(true)}
              className="md:hidden text-gray-300 hover:text-white p-2 -ml-2"
            >
              <IoMenu size={24} />
            </button>

            <h2 className="text-sm font-black uppercase tracking-widest text-gray-300 hidden sm:block">
              System Overview
            </h2>

            <Link
              to="/"
              className="text-lg font-black tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(239,68,68,0.8)] md:hidden"
            >
              NEXUS <span className="text-red-500">CMD.</span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2 text-[10px] font-bold text-gray-500 uppercase tracking-widest">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <span className="hidden sm:inline">Live Server</span>
            </span>
          </div>
        </header>

        {/* 📱 MOBILE MENU OVERLAY */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={closeMenu}
                className="fixed inset-0 bg-black/80 backdrop-blur-sm z-200 md:hidden"
              />
              <motion.div
                initial={{ x: "-100%" }}
                animate={{ x: 0 }}
                exit={{ x: "-100%" }}
                transition={{ type: "spring", bounce: 0, duration: 0.4 }}
                className="fixed top-0 left-0 bottom-0 w-[75vw] max-w-75 bg-[#0a0a0a] border-r border-white/5 z-201 flex flex-col md:hidden"
              >
                <div className="p-6 border-b border-white/5 flex justify-between items-center shrink-0">
                  <div>
                    <span className="text-xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(239,68,68,0.8)]">
                      NEXUS <span className="text-red-500">CMD.</span>
                    </span>
                  </div>
                  <button
                    onClick={closeMenu}
                    className="text-gray-400 hover:text-red-500 p-2"
                  >
                    <IoClose size={24} />
                  </button>
                </div>

                <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
                  {navItems.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.path}
                      end={item.path === "/admin"}
                      onClick={closeMenu}
                      className={({ isActive }) =>
                        `flex items-center gap-3 px-4 py-3 rounded-xl text-xs font-bold uppercase tracking-widest transition-all ${
                          isActive
                            ? "bg-red-500/10 text-red-500 border border-red-500/20 shadow-[0_0_15px_rgba(239,68,68,0.1)]"
                            : "text-gray-500 hover:text-gray-300 hover:bg-white/5"
                        }`
                      }
                    >
                      <span className="text-lg">{item.icon}</span>
                      {item.name}
                    </NavLink>
                  ))}
                </nav>
              </motion.div>
            </>
          )}
        </AnimatePresence>

        {/* 🚨 SCROLLABLE AREA */}
        <div
          className="flex-1 overflow-y-auto p-4 md:p-8 pb-32 scrollbar-hide"
          data-lenis-prevent
        >
          <Outlet />
        </div>

        {/* 🚨 BOTTOM SITE NAVBAR */}
        <div className="absolute bottom-0 left-0 w-full pointer-events-none z-50">
          <div className="pointer-events-auto">
            <CircularMenu />
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
