import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useUser } from "@clerk/clerk-react"; // ✅ Import useUser
import TournamentRegistrationModal from "../components/TournamentRegistrationModal";
import {
  IoChevronBackOutline,
  IoCashOutline,
  IoCalendarOutline,
  IoHardwareChipOutline,
  IoPeopleOutline,
  IoAlertCircleOutline,
  IoCheckmarkCircleOutline,
} from "react-icons/io5";

const TournamentDetails = () => {
  const { id } = useParams();
  const { user } = useUser(); // ✅ Clerk State
  const [tournament, setTournament] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);

  const isAdmin = user?.publicMetadata?.role === "admin";

  useEffect(() => {
    setTimeout(() => {
      setTournament({
        _id: id,
        title: "Valorant Radiant Cup",
        game: "Valorant",
        prize: "₹50,000",
        entryFee: "₹500 / Team",
        date: "10th May 2026",
        format: "5v5 Bracket",
        slots: 16,
        filled: 12,
        thumbnail: "https://images.unsplash.com/photo-1542751371-adc38448a05e",
        rules: ["Rule 1", "Rule 2"],
        registeredTeams: [{ teamName: "Elite", captain: "Jatin" }],
      });
      setLoading(false);
    }, 800);
  }, [id]);

  if (loading)
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-purple-500 font-black uppercase">
        Fetching Intel...
      </div>
    );

  return (
    <div className="min-h-screen bg-black text-white selection:bg-purple-500/30 pb-20">
      {/* 🚀 Hero Section */}
      <div className="relative h-64 sm:h-96 w-full">
        <div className="absolute inset-0 bg-linear-to-t from-black via-black/60 to-transparent z-10" />
        <img
          src={tournament.thumbnail}
          alt={tournament.title}
          className="w-full h-full object-cover opacity-60"
        />

        <Link
          to="/tournament"
          className="absolute top-24 sm:top-28 left-4 sm:left-10 z-20 flex items-center gap-1 text-purple-400 font-black text-[10px] sm:text-xs uppercase tracking-widest bg-black/50 px-3 py-2 rounded-full border border-purple-500/30 hover:bg-purple-500/20 transition-all backdrop-blur-md"
        >
          <IoChevronBackOutline /> Back to Circuit
        </Link>

        <div className="absolute bottom-6 sm:bottom-10 left-4 sm:left-10 z-20">
          <span className="bg-purple-600 px-3 py-1 rounded text-[10px] font-black uppercase tracking-widest border border-purple-400 mb-3 inline-block shadow-[0_0_15px_rgba(168,85,247,0.5)]">
            {tournament.game}
          </span>
          <h1 className="text-2xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter leading-tight drop-shadow-2xl">
            {tournament.title}
          </h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 mt-8 sm:mt-12 grid grid-cols-1 lg:grid-cols-3 gap-8 sm:gap-12 relative z-20">
        {/* 🛡️ Left Column: Info & Teams */}
        <div className="lg:col-span-2 space-y-10">
          {/* Rules & Requirements */}
          <section className="bg-[#0a0a0a] border border-purple-500/20 p-6 sm:p-8 rounded-4xl shadow-[0_0_30px_rgba(168,85,247,0.05)]">
            <h2 className="text-xl font-black uppercase text-purple-400 mb-6 flex items-center gap-2 border-b border-purple-500/20 pb-3">
              <IoAlertCircleOutline className="text-2xl" /> Rules of Engagement
            </h2>
            <ul className="space-y-4">
              {tournament.rules.map((rule, idx) => (
                <li
                  key={idx}
                  className="flex items-start gap-3 text-sm font-bold text-gray-300"
                >
                  <IoCheckmarkCircleOutline className="text-purple-500 text-lg shrink-0 mt-0.5" />
                  {rule}
                </li>
              ))}
            </ul>
            <div className="mt-8 bg-purple-900/20 border border-purple-500/30 p-4 rounded-xl text-xs font-black text-purple-300 tracking-widest uppercase text-center flex flex-col sm:flex-row justify-center items-center gap-2">
              <IoHardwareChipOutline className="text-lg" /> Brackets &
              Leaderboards are hosted strictly on our Discord Server.
            </div>
          </section>

          {/* Registered Teams */}
          <section>
            <h2 className="text-xl font-black uppercase text-white mb-6 flex items-center gap-2 pl-2">
              <IoPeopleOutline className="text-purple-500 text-2xl" /> Enlisted
              Squads ({tournament.filled})
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {tournament.registeredTeams.map((team, idx) => (
                <div
                  key={idx}
                  className="bg-purple-900/10 border border-purple-500/20 p-4 rounded-xl flex items-center gap-4 hover:border-purple-500/50 transition-colors"
                >
                  <div className="w-10 h-10 rounded-lg bg-black flex items-center justify-center font-black text-purple-500 border border-purple-500/30 text-lg shadow-[0_0_10px_rgba(168,85,247,0.2)]">
                    {idx + 1}
                  </div>
                  <div>
                    <h3 className="text-sm font-black uppercase tracking-wider text-white">
                      {team.teamName}
                    </h3>
                    <p className="text-[10px] font-bold text-purple-400 uppercase tracking-widest mt-0.5">
                      Capt: {team.captain}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ⚔️ Right Column: Sticky Stats Panel */}
        <div className="relative">
          <div className="sticky top-24 bg-[#0a0a0a] border border-purple-500/30 p-6 sm:p-8 rounded-4xl shadow-[0_0_50px_rgba(168,85,247,0.1)]">
            <h3 className="text-[10px] font-black uppercase text-purple-500 tracking-widest border-b border-purple-500/20 pb-2 mb-6">
              Mission Details
            </h3>

            <div className="space-y-6 mb-8">
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Total Prize Pool
                </p>
                <p className="text-3xl font-black text-white flex items-center gap-2">
                  <IoCashOutline className="text-purple-500" />{" "}
                  {tournament.prize}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                  Deployment Date
                </p>
                <p className="text-lg font-black text-gray-200 flex items-center gap-2">
                  <IoCalendarOutline className="text-purple-500" />{" "}
                  {tournament.date}
                </p>
              </div>
              <div className="grid grid-cols-2 gap-4 pt-4 border-t border-purple-500/10">
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Entry Fee
                  </p>
                  <p className="text-sm font-black text-purple-400">
                    {tournament.entryFee}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-1">
                    Format
                  </p>
                  <p className="text-sm font-black text-purple-400">
                    {tournament.format}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-black/50 border border-purple-500/20 rounded-xl p-4 mb-6 text-center">
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">
                Slots Remaining
              </p>
              <div className="text-2xl font-black text-white">
                <span className="text-purple-500">
                  {tournament.slots - tournament.filled}
                </span>{" "}
                / {tournament.slots}
              </div>
            </div>

            {/* 🚨 Updated Link to Button for Modal */}
            <button
              onClick={() => setIsRegisterModalOpen(true)}
              disabled={tournament.filled >= tournament.slots}
              className="w-full text-center bg-purple-600 hover:bg-purple-500 text-white py-4 rounded-xl font-black text-xs uppercase tracking-widest transition-all shadow-[0_10px_20px_rgba(168,85,247,0.3)] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {tournament.filled >= tournament.slots
                ? "Roster Full"
                : "Enlist Squad Now"}
            </button>
          </div>
        </div>
      </div>

      {/* 🚨 Render Modal */}
      <TournamentRegistrationModal
        isOpen={isRegisterModalOpen}
        onClose={() => setIsRegisterModalOpen(false)}
        tournament={tournament}
      />
    </div>
  );
};

export default TournamentDetails;
