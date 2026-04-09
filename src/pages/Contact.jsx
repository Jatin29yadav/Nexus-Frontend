import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { motion } from "framer-motion";
import { Loader2 } from "lucide-react";

// 🛡️ 1. Define the Strict Zod Schema
const contactSchema = z.object({
  name: z.string().min(2, "Identity must be at least 2 characters long"),
  email: z.string().email("Invalid email format detected"),
  subject: z.string().min(5, "Subject needs more detail (min 5 chars)"),
  message: z.string().min(15, "Transmission too short. Provide more intel."),
});

const Contact = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  // 🚀 2. Initialize React Hook Form with Zod
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(contactSchema),
  });

  // 📡 3. Form Submit Handler
  const onSubmit = async (data) => {
    setIsSubmitting(true);
    setSuccessMsg("");

    // Simulate Backend API Call
    await new Promise((resolve) => setTimeout(resolve, 2000));

    console.log("Transmission Sent:", data);
    setSuccessMsg("Transmission successful. HQ will contact you shortly.");
    setIsSubmitting(false);
    reset(); // Clear the form
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-[#050505] pt-32 pb-20 px-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl w-full bg-[#0a0a0a] border border-white/10 rounded-3xl p-8 md:p-12 relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.05)]"
      >
        <div className="mb-8 text-center">
          <span className="text-[10px] font-mono tracking-[0.5em] text-purple-500 uppercase block mb-4">
            Secure Channel
          </span>
          <h2 className="text-3xl md:text-5xl font-black uppercase text-white tracking-tighter">
            Establish <br /> Comms.
          </h2>
        </div>

        {/* Success Message Alert */}
        {successMsg && (
          <div className="mb-6 p-4 bg-green-500/10 border border-green-500/30 text-green-400 text-xs font-bold tracking-widest uppercase rounded-xl text-center">
            {successMsg}
          </div>
        )}

        {/* 📝 The Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* NAME FIELD */}
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                Operative Name
              </label>
              <input
                {...register("name")}
                type="text"
                placeholder="John Doe"
                className={`w-full bg-[#050505] border ${errors.name ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all`}
              />
              {errors.name && (
                <p className="text-red-500 text-[9px] uppercase tracking-widest mt-2">
                  {errors.name.message}
                </p>
              )}
            </div>

            {/* EMAIL FIELD */}
            <div>
              <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
                Email Address
              </label>
              <input
                {...register("email")}
                type="email"
                placeholder="operative@nexus.com"
                className={`w-full bg-[#050505] border ${errors.email ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all`}
              />
              {errors.email && (
                <p className="text-red-500 text-[9px] uppercase tracking-widest mt-2">
                  {errors.email.message}
                </p>
              )}
            </div>
          </div>

          {/* SUBJECT FIELD */}
          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
              Transmission Subject
            </label>
            <input
              {...register("subject")}
              type="text"
              placeholder="e.g. Pro-Circuit Inquiry"
              className={`w-full bg-[#050505] border ${errors.subject ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all`}
            />
            {errors.subject && (
              <p className="text-red-500 text-[9px] uppercase tracking-widest mt-2">
                {errors.subject.message}
              </p>
            )}
          </div>

          {/* MESSAGE FIELD */}
          <div>
            <label className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold mb-2">
              Encrypted Intel (Message)
            </label>
            <textarea
              {...register("message")}
              rows="5"
              placeholder="Type your message here..."
              className={`w-full bg-[#050505] border ${errors.message ? "border-red-500" : "border-white/10"} rounded-xl px-4 py-3 text-sm text-white focus:border-purple-500 focus:ring-1 focus:ring-purple-500 outline-none transition-all resize-none`}
            />
            {errors.message && (
              <p className="text-red-500 text-[9px] uppercase tracking-widest mt-2">
                {errors.message.message}
              </p>
            )}
          </div>

          {/* SUBMIT BUTTON */}
          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-500 text-white font-black uppercase tracking-widest text-xs py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(168,85,247,0.2)] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" /> Transmitting...
              </>
            ) : (
              "Send Transmission"
            )}
          </button>
        </form>
      </motion.div>
    </div>
  );
};

export default Contact;
