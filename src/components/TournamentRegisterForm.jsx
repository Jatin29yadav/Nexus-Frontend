import React, { useState, useEffect, useContext } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";
import { IoShieldCheckmarkOutline } from "react-icons/io5";
import useApi from "../hooks/useApi";
import { AuthContext } from "../context/AuthContext";
import { toast } from "sonner";

const tournamentSchema = z.object({
  teamName: z.string().min(3, "Squad/Team Name must be at least 3 characters"),
  email: z.string().email("Invalid Intel (Email format incorrect)"),
  discordId: z.string().min(3, "Discord ID required for secure comms"),
  gameId: z.string().min(3, "In-game ID (e.g., Riot ID#Tag) is required"),
  entryType: z.enum(["solo", "squad"], {
    required_error: "Select your deployment type",
  }),
  acceptRules: z.literal(true, {
    errorMap: () => ({ message: "You must accept rules to deploy" }),
  }),
});

const TournamentRegisterForm = ({
  tournamentName = "Valorant Prime Circuit",
  tournamentId,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const api = useApi();
  const { user } = useContext(AuthContext);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(tournamentSchema),
    defaultValues: { entryType: "squad" },
  });

  useEffect(() => {
    if (user) {
      setValue("email", user.email || "");
      if (watch("entryType") === "solo") {
        setValue("teamName", user.username || "");
      }
    }
  }, [user, setValue, watch("entryType")]);

  const entryType = watch("entryType");

  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSuccessMsg("");
    try {
      await api.post(`/tournaments/${tournamentId}/register`, data);
      setSuccessMsg("Registration Confirmed! Squad Enlisted.");
      toast.success("Registration Confirmed! Squad Enlisted.");
      reset();
    } catch (err) {
      toast.error(err.response?.data?.message || "Deployment failed.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-2xl w-full bg-[#0a0a0a] border border-white/10 rounded-4xl p-8 md:p-10 relative overflow-hidden shadow-[0_0_50px_rgba(239,68,68,0.05)] mx-auto"
    >
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-600/10 blur-[80px] rounded-full pointer-events-none" />

      <div className="relative z-10 mb-8">
        <span className="flex items-center gap-2 text-[10px] font-mono tracking-[0.5em] text-red-500 uppercase mb-4">
          <IoShieldCheckmarkOutline className="text-sm" /> Official Roster
        </span>
        <h2 className="text-3xl md:text-4xl font-black uppercase text-white tracking-tighter leading-tight">
          Register For <br />
          <span className="text-gray-500">{tournamentName}</span>
        </h2>
      </div>

      {successMsg && (
        <div className="mb-8 p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold tracking-widest uppercase rounded-xl flex items-center justify-center gap-2">
          <IoShieldCheckmarkOutline className="text-lg" /> {successMsg}
        </div>
      )}

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="space-y-6 relative z-10"
      >
        <div className="grid grid-cols-2 gap-4 p-1 bg-[#050505] border border-white/10 rounded-2xl">
          <label
            className={`text-center py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${entryType === "solo" ? "bg-white/10 text-white" : "text-gray-500 hover:text-gray-300"}`}
          >
            <input
              type="radio"
              value="solo"
              {...register("entryType")}
              className="hidden"
            />
            Solo Mercenary
          </label>
          <label
            className={`text-center py-3 rounded-xl text-xs font-bold uppercase tracking-widest cursor-pointer transition-all ${entryType === "squad" ? "bg-red-500/20 text-red-400 border border-red-500/20" : "text-gray-500 hover:text-gray-300"}`}
          >
            <input
              type="radio"
              value="squad"
              {...register("entryType")}
              className="hidden"
            />
            Full Squad
          </label>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
              {entryType === "squad" ? "Squad Name" : "Operative Alias"}
            </label>
            <input
              {...register("teamName")}
              type="text"
              placeholder={
                entryType === "squad" ? "e.g. Team Liquid" : "e.g. TenZ"
              }
              className={`w-full bg-[#050505] border ${errors.teamName ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all`}
            />
            {errors.teamName && (
              <p className="text-red-500 text-[9px] uppercase tracking-widest mt-2">
                {errors.teamName.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
              In-Game ID (#Tag)
            </label>
            <input
              {...register("gameId")}
              type="text"
              placeholder="e.g. Gamer#1234"
              className={`w-full bg-[#050505] border ${errors.gameId ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3 text-sm font-mono text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all`}
            />
            {errors.gameId && (
              <p className="text-red-500 text-[9px] uppercase tracking-widest mt-2">
                {errors.gameId.message}
              </p>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
              Captain's Email
            </label>
            <input
              {...register("email")}
              type="email"
              placeholder="captain@squad.com"
              className={`w-full bg-[#050505] border ${errors.email ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all`}
            />
            {errors.email && (
              <p className="text-red-500 text-[9px] uppercase tracking-widest mt-2">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
              Discord Username
            </label>
            <input
              {...register("discordId")}
              type="text"
              placeholder="e.g. discord_user"
              className={`w-full bg-[#050505] border ${errors.discordId ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3 text-sm font-bold text-white focus:border-red-500 focus:ring-1 focus:ring-red-500 outline-none transition-all`}
            />
            {errors.discordId && (
              <p className="text-red-500 text-[9px] uppercase tracking-widest mt-2">
                {errors.discordId.message}
              </p>
            )}
          </div>
        </div>

        <div className="pt-4 border-t border-white/5">
          <label className="flex items-start gap-3 cursor-pointer group">
            <div className="relative flex items-center justify-center mt-0.5">
              <input
                {...register("acceptRules")}
                type="checkbox"
                className="appearance-none w-5 h-5 border border-white/20 rounded bg-[#050505] checked:bg-red-500 checked:border-red-500 transition-colors peer cursor-pointer"
              />
              <IoShieldCheckmarkOutline className="absolute text-white opacity-0 peer-checked:opacity-100 text-xs pointer-events-none transition-opacity" />
            </div>
            <div className="flex-1">
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest group-hover:text-gray-300 transition-colors">
                I confirm that my squad will adhere to the official Nexus
                Pro-Circuit rules, avoid toxic comms, and arrive 15 minutes
                before deployment.
              </span>
              {errors.acceptRules && (
                <p className="text-red-500 text-[9px] uppercase tracking-widest mt-1">
                  {errors.acceptRules.message}
                </p>
              )}
            </div>
          </label>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex items-center justify-center gap-3 bg-red-600 hover:bg-red-500 text-white font-black uppercase tracking-[0.3em] text-xs py-5 rounded-xl transition-all shadow-[0_0_20px_rgba(239,68,68,0.2)] disabled:opacity-50 disabled:cursor-not-allowed mt-4"
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" /> Verifying Intel...
            </>
          ) : (
            "Confirm Deployment"
          )}
        </button>
      </form>
    </motion.div>
  );
};

export default TournamentRegisterForm;
