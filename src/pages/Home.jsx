import React, { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValue,
  useSpring,
} from "framer-motion";
import { Link } from "react-router-dom";
import {
  IoHardwareChipOutline,
  IoGameControllerOutline,
  IoGlassesOutline,
  IoCafeOutline,
} from "react-icons/io5";

// 🌫️ 1. Global Grain Overlay (403 Error Fixed with Local SVG Data)
const GrainOverlay = () => (
  <div
    className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-[0.04] mix-blend-overlay"
    style={{
      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
    }}
  />
);

// 🚀 2. Section 1: The HUD Hero
const HeroSection = () => {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 150]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0]);

  return (
    <section className="relative h-svh w-full flex items-center justify-center overflow-hidden px-5 sm:px-10 bg-[#050505]">
      <motion.div
        style={{ y: y1, opacity }}
        className="relative z-10 w-full max-w-70 sm:max-w-md aspect-3/4 sm:aspect-4/5 overflow-hidden grayscale contrast-[1.2] border border-white/10 rounded-4xl shadow-[0_0_50px_rgba(168,85,247,0.1)]"
      >
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=2000&auto=format&fit=crop"
          alt="Nexus Arena"
          className="h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay" />
      </motion.div>

      <div className="absolute inset-0 z-20 flex flex-col justify-between pt-32 pb-10 px-6 sm:p-12 pointer-events-none text-white max-w-350 mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.2, ease: "easeOut" }}
          className="font-black uppercase tracking-tighter leading-[0.85] text-[clamp(3.5rem,12vw,10rem)]"
        >
          NEXUS <br />
          <span className="text-purple-500 italic pr-4">ULTIMATE.</span>
          <span className="block text-[8px] sm:text-xs md:text-sm tracking-[0.5em] sm:tracking-[0.8em] font-bold text-gray-500 mt-6 ml-1 sm:ml-2 not-italic">
            OPERATIVE MAIN FRAME v2.0
          </span>
        </motion.h1>

        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-8 sm:gap-0 mt-auto pointer-events-auto">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, delay: 0.6 }}
            className="flex flex-col gap-3"
          >
            <span className="h-px w-12 bg-purple-500" />
            <p className="font-mono text-[9px] sm:text-[10px] max-w-45 sm:max-w-55 text-gray-400 uppercase tracking-widest font-bold leading-relaxed">
              State-of-the-art combat simulation. <br />
              Zero latency environments.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
          >
            <Link
              to="/booking"
              className="flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white px-6 py-3.5 sm:px-8 sm:py-4 rounded-full text-[9px] sm:text-xs font-black uppercase tracking-widest transition-all shadow-[0_0_30px_rgba(168,85,247,0.3)] hover:shadow-[0_0_50px_rgba(168,85,247,0.6)] hover:scale-105 active:scale-95 border border-purple-400/30"
            >
              Initiate Deployment
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// 📜 3. Section 2: Command Intel
const CommandIntel = () => {
  const text =
    "True gaming is the absence of latency. We build the ecosystem where champions are forged and legends are coded into history.";
  const words = text.split(" ");

  return (
    <section className="relative z-10 flex min-h-[60vh] sm:min-h-[80vh] items-center justify-center bg-[#050505] px-6 py-20">
      <div className="max-w-5xl mx-auto text-center">
        <span className="text-[10px] font-mono tracking-[0.8em] text-purple-500 uppercase block mb-8 sm:mb-12">
          Nexus Manifesto
        </span>
        <h2 className="font-black text-2xl sm:text-4xl md:text-6xl leading-[1.2] text-white uppercase tracking-tighter">
          {words.map((word, i) => (
            <motion.span
              key={i}
              initial={{ opacity: 0.1, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-10%" }}
              transition={{ duration: 0.5, delay: i * 0.05 }}
              className="inline-block mr-2 sm:mr-4"
            >
              {word === "latency." || word === "legends" ? (
                <span className="text-purple-500">{word}</span>
              ) : (
                word
              )}
            </motion.span>
          ))}
        </h2>
      </div>
    </section>
  );
};

// 🎮 4. Section 3: Deployment Zones (Revamped to Haiku/List Style)
const zones = [
  {
    title: "Alpha Zone",
    desc: "The Pro-Circuit PC Grid. 360Hz refresh, zero-lag environment.",
    icon: <IoHardwareChipOutline />,
    img: "https://i.pinimg.com/736x/53/93/a5/5393a5bb1ada8354ce40498bfef259c7.jpg",
  },
  {
    title: "Console HQ",
    desc: "Next-gen cinematic combat. PS5 & Xbox Series X Pro setups.",
    icon: <IoGameControllerOutline />,
    img: "https://i.pinimg.com/736x/dd/09/f6/dd09f6f3acaf37bfea95da07af19ba28.jpg",
  },
  {
    title: "VR Sanctum",
    desc: "Enter the simulation. Full-body haptic immersion bays.",
    icon: <IoGlassesOutline />,
    img: "https://i.pinimg.com/736x/40/79/86/4079868589b1c8234ef974c85061213b.jpg",
  },
  {
    title: "The Hub",
    desc: "Intel exchange. High-speed caffeine and operative lounge.",
    icon: <IoCafeOutline />,
    img: "https://i.pinimg.com/736x/33/b6/df/33b6df4bbac384e40a70d7728b0c1445.jpg",
  },
];

export const DeploymentZones = () => {
  const [activeZone, setActiveZone] = useState(0);

  return (
    <section className="relative z-10 min-h-screen flex items-center justify-center py-24 px-6 bg-[#0a0a0a] text-white border-t border-white/5">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-24 max-w-6xl w-full items-center">
        {/* LEFT COLUMN: The Interactive List */}
        <div className="space-y-8 md:space-y-12 order-2 md:order-1">
          <div className="mb-12">
            <span className="text-[10px] font-mono tracking-[0.5em] text-purple-500 uppercase block mb-4">
              Arena Sectors
            </span>
            <h2 className="font-black text-5xl md:text-6xl uppercase text-white leading-none tracking-tighter">
              Choose Your <br /> Battlefield.
            </h2>
          </div>

          {zones.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: i * 0.15 }}
              className="group cursor-pointer"
              onMouseEnter={() => setActiveZone(i)}
            >
              <div className="flex items-center gap-4 mb-3">
                <span
                  className={`text-xs font-mono transition-colors duration-300 ${activeZone === i ? "text-purple-400" : "text-gray-600"}`}
                >
                  0{i + 1}
                </span>
                <h3
                  className={`text-2xl md:text-3xl font-black uppercase transition-all duration-300 flex items-center gap-3 ${activeZone === i ? "text-white" : "text-gray-500 group-hover:text-gray-300"}`}
                >
                  {item.title}
                  <span
                    className={`transition-opacity duration-300 ${activeZone === i ? "opacity-100 text-purple-500" : "opacity-0"}`}
                  >
                    {item.icon}
                  </span>
                </h3>
              </div>
              <p
                className={`text-sm font-bold uppercase tracking-widest leading-relaxed transition-colors duration-300 border-l ml-1.5 pl-6 ${activeZone === i ? "text-gray-400 border-purple-500/50" : "text-gray-600 border-white/10 group-hover:border-white/30"}`}
              >
                {item.desc}
              </p>
            </motion.div>
          ))}
        </div>

        {/* RIGHT COLUMN: The Featured Image & Rotating SVG */}
        <div className="relative h-100 md:h-150 w-full flex items-center justify-center order-1 md:order-2">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            transition={{ duration: 1.5 }}
            className="relative w-full h-full"
          >
            {/* Dynamic Crossfading Images based on Hover */}
            {zones.map((zone, i) => (
              <img
                key={i}
                src={zone.img}
                alt={zone.title}
                className={`absolute inset-0 w-full h-full object-cover grayscale rounded-4xl transition-all duration-700 ease-in-out ${
                  activeZone === i
                    ? "opacity-60 scale-100 z-10"
                    : "opacity-0 scale-105 z-0"
                }`}
              />
            ))}

            {/* Ambient Purple Overlay */}
            <div className="absolute inset-0 bg-purple-900/20 mix-blend-overlay rounded-4xl z-20 pointer-events-none" />

            {/* Rotating Tech SVG Graphic */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-30">
              <svg
                viewBox="0 0 100 100"
                className="w-[85%] h-[85%] animate-[spin_40s_linear_infinite]"
              >
                <path
                  id="curve"
                  d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                  fill="transparent"
                />
                <text>
                  <textPath
                    xlinkHref="#curve"
                    className="text-[6.5px] font-bold uppercase tracking-[0.35em] fill-white/70"
                  >
                    NEXUS ULTIMATE • PRO CIRCUIT • ARENA SECTORS •
                  </textPath>
                </text>
              </svg>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

// 🏆 5. Section 4: Pro-Circuit Status
const ProCircuitStatus = () => (
  <section className="relative z-10 px-5 sm:px-10 py-16 sm:py-32 bg-[#050505]">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.8 }}
      className="max-w-6xl mx-auto bg-linear-to-br from-purple-900/30 to-[#0a0a0a] border border-purple-500/20 rounded-4xl p-8 sm:p-12 md:p-16 relative overflow-hidden shadow-[0_0_50px_rgba(168,85,247,0.1)]"
    >
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-purple-600/20 blur-[80px] rounded-full pointer-events-none" />
      <div className="relative z-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.8)]" />
            <span className="text-[10px] font-black tracking-[0.5em] text-red-400 uppercase">
              Live Mission
            </span>
          </div>
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black uppercase tracking-tighter text-white mb-3">
            Valorant{" "}
            <span className="text-transparent bg-clip-text bg-linear-to-r from-purple-400 to-purple-600">
              Prime
            </span>
          </h2>
          <p className="text-gray-400 font-bold text-[10px] sm:text-xs uppercase tracking-widest">
            Prize Pool: ₹50,000 &nbsp;|&nbsp; Deployment: Sunday 10:00 AM
          </p>
        </div>
        <Link
          to="/tournament"
          className="w-full md:w-auto text-center bg-white text-black hover:bg-purple-500 hover:text-white px-8 py-4 rounded-full font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all shadow-xl active:scale-95"
        >
          View Mission Details
        </Link>
      </div>
    </motion.div>
  </section>
);

// 📸 6. Section 5: Intelligence Archive
const IntelligenceArchive = () => {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y1 = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const y3 = useTransform(scrollYProgress, [0, 1], [0, -150]);

  const images = [
    "https://images.unsplash.com/photo-1542751371-adc38448a05e?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1511512578047-dfb367046420?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1538481199705-c710c4e965fc?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1560253023-3ec5d502959f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1550745165-9bc0b252726f?q=80&w=800&auto=format&fit=crop",
    "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?q=80&w=800&auto=format&fit=crop",
  ];

  return (
    <section
      ref={containerRef}
      className="relative z-10 py-20 sm:py-32 px-5 sm:px-10 bg-[#0a0a0a] border-t border-white/5 overflow-hidden"
    >
      <div className="max-w-7xl mx-auto mb-16 sm:mb-24 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.5em] text-purple-500 uppercase block mb-4">
            Visual Database
          </span>
          <h2 className="text-4xl sm:text-5xl md:text-7xl font-black uppercase text-white tracking-tighter leading-none">
            Intelligence <br />
            <span className="text-gray-700">Archive.</span>
          </h2>
        </div>
        <Link
          to="/gallery"
          className="text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-purple-400 transition-colors border-b border-gray-600 hover:border-purple-400 pb-1"
        >
          Access Full Vault
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8 max-w-7xl mx-auto">
        <motion.div
          style={{ y: y1 }}
          className="flex flex-col gap-4 sm:gap-8 mt-10 sm:mt-20"
        >
          <div className="rounded-3xl overflow-hidden group">
            <img
              src={images[0]}
              className="w-full object-cover aspect-4/5 grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
              alt="Intel 1"
            />
          </div>
          <div className="rounded-3xl overflow-hidden group">
            <img
              src={images[1]}
              className="w-full object-cover aspect-square grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
              alt="Intel 2"
            />
          </div>
        </motion.div>

        <motion.div style={{ y: y2 }} className="flex flex-col gap-4 sm:gap-8">
          <div className="rounded-3xl overflow-hidden group">
            <img
              src={images[2]}
              className="w-full object-cover aspect-square grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
              alt="Intel 3"
            />
          </div>
          <div className="aspect-4/5 flex flex-col items-center justify-center bg-purple-900/10 border border-purple-500/20 rounded-3xl p-6 text-center shadow-[0_0_30px_rgba(168,85,247,0.05)]">
            <h3 className="font-black text-2xl sm:text-3xl uppercase tracking-tighter text-purple-400">
              "Victory is
              <br />
              <span className="text-white italic">Designed</span>"
            </h3>
          </div>
          <div className="rounded-3xl overflow-hidden group">
            <img
              src={images[3]}
              className="w-full object-cover aspect-4/5 grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
              alt="Intel 4"
            />
          </div>
        </motion.div>

        <motion.div
          style={{ y: y3 }}
          className="hidden md:flex flex-col gap-4 sm:gap-8 mt-32"
        >
          <div className="rounded-3xl overflow-hidden group">
            <img
              src={images[4]}
              className="w-full object-cover aspect-4/5 grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
              alt="Intel 5"
            />
          </div>
          <div className="rounded-3xl overflow-hidden group">
            <img
              src={images[5]}
              className="w-full object-cover aspect-square grayscale hover:grayscale-0 transition-all duration-500 group-hover:scale-105"
              alt="Intel 6"
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
};

// 🧲 7. Section 6: Mobilize CTA (Magnetic Button)
const MagneticButton = ({ children }) => {
  const ref = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { stiffness: 150, damping: 15, mass: 0.1 });
  const springY = useSpring(y, { stiffness: 150, damping: 15, mass: 0.1 });

  const handleMouseMove = (e) => {
    const { clientX, clientY } = e;
    if (!ref.current) return;
    const { left, top, width, height } = ref.current.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.3);
    y.set((clientY - centerY) * 0.3);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ x: springX, y: springY }}
      className="inline-block"
    >
      {children}
    </motion.div>
  );
};

const MobilizeCTA = () => {
  return (
    <section className="relative z-10 flex flex-col items-center justify-center min-h-[70vh] px-6 py-32 bg-[#050505] border-t border-white/5 overflow-hidden text-center">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-150 max-h-150 bg-purple-600/20 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative z-10 flex flex-col items-center"
      >
        <span className="text-[10px] font-mono tracking-[0.8em] text-gray-500 uppercase block mb-6">
          Awaiting Orders
        </span>
        <h2 className="font-black uppercase tracking-tighter leading-[0.85] text-[clamp(3.5rem,10vw,12rem)] text-white mb-12">
          Ready To <br />
          <span className="text-purple-500">Deploy?</span>
        </h2>

        <MagneticButton>
          <Link
            to="/booking"
            className="group relative flex items-center justify-center rounded-full border border-purple-500/40 bg-purple-900/10 px-8 py-5 sm:px-12 sm:py-6 uppercase tracking-[0.3em] sm:tracking-[0.5em] text-white transition-colors hover:border-purple-500 hover:bg-purple-600 backdrop-blur-md font-black text-[10px] sm:text-xs shadow-[0_0_30px_rgba(168,85,247,0.15)] hover:shadow-[0_0_60px_rgba(168,85,247,0.5)] active:scale-95"
          >
            Book Your Station Now
          </Link>
        </MagneticButton>
      </motion.div>
    </section>
  );
};

// 🏛️ 8. MAIN HOME COMPONENT ASSEMBLY
export default function Home() {
  return (
    // 🚨 FIX: changed overflow-x-hidden to overflow-x-clip to allow CSS 'sticky' to work
    <div className="relative min-h-screen bg-[#050505] text-white selection:bg-purple-500/30 overflow-x-clip font-sans pb-32">
      <GrainOverlay />

      <main className="relative z-10">
        <HeroSection />
        <CommandIntel />
        <DeploymentZones />
        <ProCircuitStatus />
        <IntelligenceArchive />
        <MobilizeCTA />
      </main>
    </div>
  );
}
