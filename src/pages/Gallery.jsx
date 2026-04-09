import React, { useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

const Gallery = ({
  images = [
    "https://i.pinimg.com/736x/ff/0e/37/ff0e373273f5411d8d11eb79ff3c9220.jpg",
    "https://i.pinimg.com/736x/2d/fe/1e/2dfe1e8c53cca9a4ad43365884fc5125.jpg",
    "https://i.pinimg.com/736x/8b/0b/88/8b0b88056b187c198686a2c693aa6a93.jpg",
    "https://i.pinimg.com/1200x/26/94/7e/26947ea787fd66f1b67455cbe9604c6f.jpg",
    "https://i.pinimg.com/736x/4c/6b/b1/4c6bb1b9327b80fb04ae244f4d30a972.jpg",
    "https://i.pinimg.com/1200x/fd/b6/a1/fdb6a1673bc6b1cef2e5d7b3c9d6c270.jpg",
    "https://i.pinimg.com/736x/ff/a7/d7/ffa7d768904207513e1955b94afa8bf4.jpg",
    "https://i.pinimg.com/736x/80/ba/86/80ba86fa2e6bc3b83c2f47bb067b642a.jpg",
  ],
  noiseUrl = "https://grainy-gradients.vercel.app/noise.svg",
}) => {
  const { scrollY } = useScroll();
  const [dimensions, setDimensions] = useState({
    gridCols: 4,
    xRange: -600,
    yRange: -1200,
    scale: 1.6,
    itemCount: 32,
  });

  // 🚀 Logic: Dynamic adjustments based on viewport
  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 640) {
        // Mobile
        setDimensions({
          gridCols: 2,
          xRange: -200,
          yRange: -800,
          scale: 2.2,
          itemCount: 16,
        });
      } else if (width < 1024) {
        // Tablet
        setDimensions({
          gridCols: 3,
          xRange: -400,
          yRange: -1000,
          scale: 1.8,
          itemCount: 24,
        });
      } else {
        // Desktop
        setDimensions({
          gridCols: 4,
          xRange: -600,
          yRange: -1200,
          scale: 1.6,
          itemCount: 32,
        });
      }
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Smooth spring physics for fluid movement
  const smoothScroll = useSpring(scrollY, { stiffness: 50, damping: 20 });

  const xMovement = useTransform(
    smoothScroll,
    [0, 3000],
    [0, dimensions.xRange],
  );
  const yMovement = useTransform(
    smoothScroll,
    [0, 3000],
    [0, dimensions.yRange],
  );
  const colWidth = 100 / dimensions.gridCols;

  return (
    <div className="relative h-[450vh] bg-black overflow-hidden selection:bg-purple-500/30">
      {/* 🌫️ FIXED NOISE OVERLAY */}
      <div
        className="fixed inset-0 pointer-events-none z-40 opacity-15"
        style={{ backgroundImage: `url('${noiseUrl}')` }}
      />

      {/* 🛸 THE KINETIC GRID (Responsive) */}
      <motion.div
        className="absolute top-0 left-0 w-full flex flex-wrap content-start transform-gpu z-10"
        style={{
          rotate: -12,
          scale: dimensions.scale,
          x: xMovement,
          y: yMovement,
        }}
      >
        {Array.from({ length: dimensions.itemCount }).map((_, i) => (
          <div
            key={i}
            className="p-2 sm:p-4 aspect-3/4"
            style={{ width: `${colWidth}%` }}
          >
            <motion.div
              className="w-full h-full overflow-hidden shadow-2xl bg-[#0a0a0a] border border-white/5 rounded-sm"
              whileHover={{ scale: 0.96 }}
            >
              <img
                src={images[i % images.length]}
                loading="lazy"
                className="w-full h-full object-cover grayscale brightness-75 hover:grayscale-0 hover:brightness-110 transition-all duration-700 ease-out"
              />
            </motion.div>
          </div>
        ))}
      </motion.div>

      {/* 🏷️ FIXED BRANDING */}
      <div className="fixed bottom-8 right-6 sm:bottom-16 sm:right-16 z-50 mix-blend-difference pointer-events-none">
        <h2 className="text-5xl sm:text-8xl md:text-[10rem] font-black uppercase leading-[0.75] tracking-tighter text-white">
          NEXUS
          <br />
          ARMORY
        </h2>
        <div className="mt-4 flex items-center gap-3">
          <div className="w-8 h-px bg-white/40" />
          <span className="text-[8px] font-bold uppercase tracking-[0.4em] text-white/60">
            Kinetic Intel Archive v2.1
          </span>
        </div>
      </div>

      {/* 🖱️ INTERACTION HINT (Hidden on very small screens) */}
      <div className="fixed top-1/2 left-6 -translate-y-1/2 z-50 hidden sm:flex flex-col items-center gap-4 pointer-events-none">
        <div className="w-px h-24 bg-linear-to-b from-transparent via-purple-500 to-transparent" />
        <span className="[writing-mode:vertical-lr] text-[8px] font-black uppercase tracking-[1em] text-purple-400 opacity-50">
          Initiate Deep Scroll
        </span>
      </div>
    </div>
  );
};

export default Gallery;
