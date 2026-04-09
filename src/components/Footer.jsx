import { Link } from "react-router-dom";
import {
  IoArrowForwardOutline,
  IoCallOutline,
  IoMailOutline,
  IoLogoDiscord, // 🚨 Added Discord Icon
} from "react-icons/io5";

const Footer = () => {
  return (
    <footer className="bg-[#050505] text-white relative overflow-hidden border-t border-purple-500/20 pt-20 flex flex-col">
      <div className="max-w-7xl mx-auto px-6 lg:px-10 w-full relative z-10">
        {/* 🚀 Top Section: Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-16">
          {/* Left: Huge CTA (Updated to Discord) */}
          <div>
            <h2 className="text-4xl md:text-6xl font-black uppercase tracking-tighter leading-tight mb-6">
              Enter The Network.
              <br />
              <span className="text-[#5865F2]">Join Discord.</span>
            </h2>
            <a
              href="https://discord.gg/UkUvntnf"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 bg-white/5 hover:bg-[#5865F2] border border-white/10 hover:border-[#5865F2] text-white pl-6 pr-2 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all group shadow-[0_0_30px_rgba(88,101,242,0.1)] hover:shadow-[0_0_50px_rgba(88,101,242,0.4)]"
            >
              Access Comms
              <div className="bg-[#5865F2] text-white p-2 rounded-full group-hover:bg-white group-hover:text-[#5865F2] transition-colors">
                <IoLogoDiscord className="text-sm" />
              </div>
            </a>
          </div>

          {/* Right: Links & Info */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8">
            {/* Location */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Base Camp
              </h4>
              <p className="text-xs font-bold text-gray-300 leading-relaxed">
                Sector 7, Gaming District
                <br />
                New Delhi, India
              </p>
              <div className="space-y-2 mt-4">
                <a
                  href="tel:+919876543210"
                  className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <IoCallOutline className="text-purple-500" /> +91 98765 43210
                </a>
                <a
                  href="mailto:ops@nexus.com"
                  className="flex items-center gap-2 text-[10px] font-bold text-gray-400 hover:text-purple-400 transition-colors"
                >
                  <IoMailOutline className="text-purple-500" /> ops@nexus.com
                </a>
              </div>
            </div>

            {/* Socials (With square bullets) */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Network
              </h4>
              <ul className="space-y-3">
                {["Instagram", "Twitter / X", "YouTube"].map((social) => (
                  <li key={social}>
                    <a
                      href="#"
                      className="text-xs font-bold text-gray-300 hover:text-purple-400 flex items-center gap-2 transition-colors"
                    >
                      <div className="w-1.5 h-1.5 bg-purple-500 rounded-sm" />{" "}
                      {social}
                    </a>
                  </li>
                ))}
                <li>
                  <a
                    href="https://discord.gg/UkUvntnf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-bold text-gray-300 hover:text-[#5865F2] flex items-center gap-2 transition-colors"
                  >
                    <div className="w-1.5 h-1.5 bg-[#5865F2] rounded-sm" />{" "}
                    Discord
                  </a>
                </li>
              </ul>
            </div>

            {/* Links */}
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-gray-500 uppercase tracking-widest">
                Clearance
              </h4>
              <ul className="space-y-3">
                <li>
                  <Link
                    to="/tournament"
                    className="text-xs font-bold text-gray-300 hover:text-purple-400 flex items-center gap-2 transition-colors"
                  >
                    Pro Circuit
                  </Link>
                </li>
                <li>
                  <Link
                    to="/gallery"
                    className="text-xs font-bold text-gray-300 hover:text-purple-400 flex items-center gap-2 transition-colors"
                  >
                    Armory
                  </Link>
                </li>
                <li>
                  <a
                    href="#"
                    className="text-xs font-bold text-gray-300 hover:text-purple-400 flex items-center gap-2 transition-colors"
                  >
                    Privacy Policy
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Divider & Copyright */}
        <div className="border-t border-white/10 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase">
            © Nexus Operations 2026
          </div>

          <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase flex items-center gap-2">
            <div className="w-1.5 h-1.5 bg-purple-500 rounded-sm animate-pulse" />{" "}
            Made with passion in Delhi
          </div>

          <div className="text-[10px] font-bold text-gray-500 tracking-widest uppercase flex items-center gap-2">
            Created by <span className="text-white font-black">Legends</span>
          </div>
        </div>
      </div>

      {/* 🚀 GIANT TYPOGRAPHY */}
      <div className="w-full overflow-hidden flex justify-center items-end mt-[-8%] z-0 pointer-events-none select-none">
        <h1 className="text-[28vw] font-black uppercase leading-[0.75] tracking-tighter bg-linear-to-b from-purple-600/40 to-transparent bg-clip-text text-transparent m-0 p-0">
          NEXUS
        </h1>
      </div>
    </footer>
  );
};

export default Footer;
