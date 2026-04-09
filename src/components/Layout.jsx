import { Outlet, Link } from "react-router-dom";
import { SignedIn, SignedOut, UserButton, useUser } from "@clerk/clerk-react";
import Footer from "./Footer";
import CircularMenu from "./Navbar/CircluarNav";
import { IoPersonOutline } from "react-icons/io5";

const Layout = () => {
  // Clerk's hook to get current user data (replaces your old AuthContext)
  const { user } = useUser();

  // 🚨 Note: In Clerk, admin roles are usually saved in publicMetadata.
  // Assuming you will set role: "admin" in Clerk's dashboard or via Webhook.
  const isAdmin = user?.publicMetadata?.role === "admin";

  return (
    <div className="relative min-h-screen bg-black text-white flex flex-col overflow-x-hidden">
      <header className="fixed top-0 left-0 w-full z-999 flex justify-between items-center p-6 md:px-10 pointer-events-none">
        <Link
          to="/"
          className="pointer-events-auto text-2xl md:text-3xl font-black tracking-tighter uppercase text-white drop-shadow-[0_0_20px_rgba(168,85,247,0.8)] hover:scale-105 transition-transform"
        >
          NEXUS <span className="text-purple-500">.</span>
        </Link>

        <div className="pointer-events-auto flex items-center gap-3">
          {/* Admin Command Center Link */}
          {isAdmin && (
            <Link
              to="/admin"
              className="flex items-center justify-center bg-red-500/10 border border-red-500/30 px-3 py-1.5 sm:px-4 sm:py-1.5 rounded-xl text-[10px] font-black tracking-widest uppercase text-red-500 hover:bg-red-500 hover:text-white transition-all shadow-[0_0_15px_rgba(239,68,68,0.2)]"
            >
              {/* Desktop text */}
              <span className="hidden sm:block">Command Center</span>
              {/* Mobile text */}
              <span className="sm:hidden text-xs">CMD</span>
            </Link>
          )}

          {/* 🟢 WHAT TO SHOW WHEN USER IS LOGGED IN */}
          <SignedIn>
            <div className="flex items-center justify-center gap-3 bg-black/40 border border-white/10 p-1.5 sm:pr-4 sm:pl-1.5 rounded-xl hover:bg-black/60 transition-colors shadow-[0_0_20px_rgba(0,0,0,0.5)] backdrop-blur-md">
              {/* Clerk's Native Profile Button styled to match your theme */}
              <UserButton
                afterSignOutUrl="/"
                appearance={{
                  elements: {
                    avatarBox:
                      "w-8 h-8 rounded-lg shadow-[0_0_10px_rgba(168,85,247,0.5)] border border-purple-500/30",
                  },
                }}
              />
              <span className="text-xs font-bold tracking-widest uppercase hidden sm:block text-gray-200">
                {user?.firstName || "OPERATIVE"}
              </span>
            </div>
          </SignedIn>

          {/* 🔴 WHAT TO SHOW WHEN USER IS LOGGED OUT */}
          <SignedOut>
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
          </SignedOut>
        </div>
      </header>

      {/* MAIN CONTENT AREA */}
      <main className="grow">
        <Outlet />
      </main>

      {/* FOOTER */}
      <Footer />

      {/* BOTTOM NAVBAR */}
      <CircularMenu />
    </div>
  );
};

export default Layout;
