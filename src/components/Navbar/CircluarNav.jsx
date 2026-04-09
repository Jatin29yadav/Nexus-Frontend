import React, { useState, useEffect, useRef, useMemo } from "react";
import { gsap } from "gsap";
import { Link, useNavigate } from "react-router-dom";
import "./CircularNav.css";

// 🚨 Updated Icons for the new links
import {
  IoHomeSharp,
  IoTrophySharp,
  IoCalendarSharp,
  IoMailSharp,
  IoLogInSharp,
  IoImagesSharp,
} from "react-icons/io5";

// 🚨 Updated Menu Items as per your request
const menuItems = [
  { label: "Home", icon: <IoHomeSharp />, href: "/" },
  { label: "Tournament", icon: <IoTrophySharp />, href: "/tournament" },
  { label: "Bookings", icon: <IoCalendarSharp />, href: "/bookings" },
  { label: "Contact", icon: <IoMailSharp />, href: "/contact" },
  { label: "Login", icon: <IoLogInSharp />, href: "/login" },
  { label: "Gallery", icon: <IoImagesSharp />, href: "/gallery" },
];

const CircularMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [config, setConfig] = useState(null);
  const navigate = useNavigate();

  const overlayRef = useRef(null);
  const joystickRef = useRef(null);
  const navRef = useRef(null);
  const segmentsContainerRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const getResponsiveConfig = () => {
    if (typeof window === "undefined") return null;
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;

    const isMobile = viewportWidth < 768;
    const maxSize = Math.min(viewportWidth, viewportHeight) * 0.9;

    const menuSize = isMobile ? Math.min(maxSize, 480) : 700;

    return {
      menuSize: menuSize,
      center: menuSize / 2,
      innerRadius: menuSize * 0.08,
      outerRadius: menuSize * 0.42,
      contentRadius: menuSize * 0.28,
      isMobile: isMobile,
    };
  };

  useEffect(() => {
    setConfig(getResponsiveConfig());
    const handleResize = () => setConfig(getResponsiveConfig());
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const segments = useMemo(() => {
    if (!config) return [];
    const total = menuItems.length;
    const anglePerSegment = 360 / total;

    return menuItems.map((item, index) => {
      const baseStartAngle = anglePerSegment * index;
      const centerAngle = baseStartAngle + anglePerSegment / 2;
      const startAngle = baseStartAngle + 0.19;
      const endAngle = baseStartAngle + anglePerSegment - 0.19;

      const toRad = (angle) => ((angle - 90) * Math.PI) / 180;

      const innerStartX =
        config.center + config.innerRadius * Math.cos(toRad(startAngle));
      const innerStartY =
        config.center + config.innerRadius * Math.sin(toRad(startAngle));
      const outerStartX =
        config.center + config.outerRadius * Math.cos(toRad(startAngle));
      const outerStartY =
        config.center + config.outerRadius * Math.sin(toRad(startAngle));

      const innerEndX =
        config.center + config.innerRadius * Math.cos(toRad(endAngle));
      const innerEndY =
        config.center + config.innerRadius * Math.sin(toRad(endAngle));
      const outerEndX =
        config.center + config.outerRadius * Math.cos(toRad(endAngle));
      const outerEndY =
        config.center + config.outerRadius * Math.sin(toRad(endAngle));

      const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;

      const pathData = `M ${innerStartX} ${innerStartY} L ${outerStartX} ${outerStartY} A ${config.outerRadius} ${config.outerRadius} 0 ${largeArcFlag} 1 ${outerEndX} ${outerEndY} L ${innerEndX} ${innerEndY} A ${config.innerRadius} ${config.innerRadius} 0 ${largeArcFlag} 0 ${innerStartX} ${innerStartY} Z`;

      const contentX =
        config.center + config.contentRadius * Math.cos(toRad(centerAngle));
      const contentY =
        config.center + config.contentRadius * Math.sin(toRad(centerAngle));

      const offsetX = contentX - config.center;
      const offsetY = contentY - config.center;

      return { ...item, pathData, offsetX, offsetY };
    });
  }, [config]);

  const toggleMenu = () => {
    if (isAnimatingRef.current || !config) return;
    isAnimatingRef.current = true;

    const segmentsDOM = segmentsContainerRef.current.children;

    if (!isOpen) {
      setIsOpen(true);
      try {
        new Audio("/menu-open.mp3").play().catch(() => {});
      } catch (e) {}

      gsap.to(overlayRef.current, {
        opacity: 1,
        duration: 0.3,
        ease: "power2.out",
        onStart: () => (overlayRef.current.style.pointerEvents = "all"),
      });

      gsap.to(joystickRef.current, {
        scale: 1,
        duration: 0.4,
        delay: 0.2,
        ease: "back.out(1.7)",
      });

      gsap.set(navRef.current, { opacity: 0 });
      gsap.to(navRef.current, {
        opacity: 1,
        duration: 0.075,
        delay: 0.3,
        repeat: 3,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () => gsap.set(navRef.current, { opacity: 1 }),
      });

      const shuffledIndices = [...Array(segmentsDOM.length).keys()].sort(
        () => Math.random() - 0.5,
      );
      shuffledIndices.forEach((origIdx, pos) => {
        const seg = segmentsDOM[origIdx];
        gsap.set(seg, { opacity: 0 });
        gsap.to(seg, {
          opacity: 1,
          duration: 0.075,
          delay: pos * 0.075,
          repeat: 3,
          yoyo: true,
          ease: "power2.inOut",
          onComplete: () => {
            gsap.set(seg, { opacity: 1 });
            if (origIdx === segmentsDOM.length - 1)
              isAnimatingRef.current = false;
          },
        });
      });
    } else {
      setIsOpen(false);
      try {
        new Audio("/menu-open.mp3").play().catch(() => {});
      } catch (e) {}

      gsap.to(navRef.current, {
        opacity: 0,
        duration: 0.05,
        repeat: 2,
        yoyo: true,
        ease: "power2.inOut",
        onComplete: () => gsap.set(navRef.current, { opacity: 0 }),
      });

      gsap.to(joystickRef.current, {
        scale: 0,
        duration: 0.3,
        delay: 0.2,
        ease: "back.in(1.7)",
      });

      const shuffledIndices = [...Array(segmentsDOM.length).keys()].sort(
        () => Math.random() - 0.5,
      );
      shuffledIndices.forEach((origIdx, pos) => {
        gsap.to(segmentsDOM[origIdx], {
          opacity: 0,
          duration: 0.05,
          delay: pos * 0.05,
          repeat: 2,
          yoyo: true,
          ease: "power2.inOut",
          onComplete: () => gsap.set(segmentsDOM[origIdx], { opacity: 0 }),
        });
      });

      gsap.to(overlayRef.current, {
        opacity: 0,
        duration: 0.3,
        delay: 0.6,
        ease: "power2.out",
        onComplete: () => {
          overlayRef.current.style.pointerEvents = "none";
          isAnimatingRef.current = false;
        },
      });
    }
  };

  useEffect(() => {
    if (!joystickRef.current || !isOpen || !config) return;

    gsap.set(joystickRef.current, { xPercent: -50, yPercent: -50 });

    const joystick = joystickRef.current;
    let isDragging = false;
    let currentX = 0,
      currentY = 0,
      targetX = 0,
      targetY = 0;
    let activeSegment = null;
    let animationFrame;

    const animate = () => {
      currentX += (targetX - currentX) * 0.15;
      currentY += (targetY - currentY) * 0.15;
      gsap.set(joystick, { x: currentX, y: currentY });

      if (
        isDragging &&
        Math.sqrt(currentX * currentX + currentY * currentY) > 20
      ) {
        const angle = Math.atan2(currentY, currentX) * (180 / Math.PI);
        const segmentIndex =
          Math.floor(((angle + 90 + 360) % 360) / (360 / menuItems.length)) %
          menuItems.length;
        const segment = segmentsContainerRef.current.children[segmentIndex];

        if (segment !== activeSegment) {
          if (activeSegment) {
            activeSegment.style.animation = "";
            activeSegment.querySelector(".segment-content").style.animation =
              "";
            activeSegment.style.zIndex = "1";
          }
          activeSegment = segment;
          activeSegment.style.animation =
            "flickerHover 350ms ease-in-out forwards";
          activeSegment.querySelector(".segment-content").style.animation =
            "contentFlickerHover 350ms ease-in-out forwards";
          activeSegment.style.zIndex = "10";
          try {
            new Audio("/menu-select.mp3").play().catch(() => {});
          } catch (e) {}
        }
      } else {
        if (activeSegment) {
          activeSegment.style.animation = "";
          activeSegment.querySelector(".segment-content").style.animation = "";
          activeSegment.style.zIndex = "1";
          activeSegment = null;
        }
      }
      animationFrame = requestAnimationFrame(animate);
    };

    const handleDown = (e) => {
      isDragging = true;
      const rect = joystick.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const drag = (eMove) => {
        if (!isDragging) return;
        const clientX = eMove.touches
          ? eMove.touches[0].clientX
          : eMove.clientX;
        const clientY = eMove.touches
          ? eMove.touches[0].clientY
          : eMove.clientY;

        const deltaX = clientX - centerX;
        const deltaY = clientY - centerY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);
        const maxDrag = 100 * 0.25;

        if (distance <= 20) {
          targetX = 0;
          targetY = 0;
        } else if (distance > maxDrag) {
          const ratio = maxDrag / distance;
          targetX = deltaX * ratio;
          targetY = deltaY * ratio;
        } else {
          targetX = deltaX;
          targetY = deltaY;
        }
      };

      const endDrag = () => {
        isDragging = false;
        targetX = 0;
        targetY = 0;

        if (activeSegment) {
          activeSegment.style.animation = "";
          activeSegment.querySelector(".segment-content").style.animation = "";
          activeSegment.style.zIndex = "1";

          const targetHref = activeSegment.getAttribute("href");
          if (targetHref) {
            navigate(targetHref);
            toggleMenu();
          }
          activeSegment = null;
        }
        document.removeEventListener("mousemove", drag);
        document.removeEventListener("touchmove", drag);
        document.removeEventListener("mouseup", endDrag);
        document.removeEventListener("touchend", endDrag);
      };

      document.addEventListener("mousemove", drag);
      document.addEventListener("touchmove", drag, { passive: false });
      document.addEventListener("mouseup", endDrag);
      document.addEventListener("touchend", endDrag);
    };

    joystick.addEventListener("mousedown", handleDown);
    joystick.addEventListener("touchstart", handleDown, { passive: true });

    animate();

    return () => {
      cancelAnimationFrame(animationFrame);
      joystick.removeEventListener("mousedown", handleDown);
      joystick.removeEventListener("touchstart", handleDown);
    };
  }, [isOpen, config, navigate]);

  useEffect(() => {
    if (joystickRef.current) {
      gsap.set(joystickRef.current, { scale: 0, xPercent: -50, yPercent: -50 });
    }
  }, []);

  if (!config) return null;

  return (
    <>
      <div
        className="menu-toggle-btn"
        onClick={toggleMenu}
        style={{
          background: "rgba(255, 255, 255, 0.05)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderTop: "1px solid rgba(255, 255, 255, 0.1)",
        }}
      >
        <div
          className="hamburger-bar"
          style={{ backgroundColor: "#fff" }}
        ></div>
        <div
          className="hamburger-bar"
          style={{ backgroundColor: "#fff" }}
        ></div>
      </div>

      <div ref={overlayRef} className="menu-overlay">
        <div
          className="menu-bg"
          style={{
            background: "rgba(10, 10, 10, 0.95)",
            backdropFilter: "blur(10px)",
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        ></div>

        <div ref={navRef} className="menu-overlay-nav">
          <div
            className="close-btn"
            onClick={toggleMenu}
            style={{
              backgroundColor: "rgba(255, 255, 255, 0.1)",
              width: "48px",
              height: "48px",
              borderRadius: "50%",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              marginTop: "3rem",
            }}
          >
            <div
              className="close-btn-bar"
              style={{ left: "12px", width: "24px" }}
            ></div>
            <div
              className="close-btn-bar"
              style={{ left: "12px", width: "24px" }}
            ></div>
          </div>
        </div>

        <div
          className="circular-menu"
          style={{ width: config.menuSize, height: config.menuSize }}
        >
          <div
            ref={segmentsContainerRef}
            style={{ width: "100%", height: "100%", position: "absolute" }}
          >
            {segments.map((seg, i) => (
              <Link
                key={i}
                to={seg.href}
                className="menu-segment"
                onClick={() => {
                  toggleMenu();
                }}
                style={{
                  clipPath: `path('${seg.pathData}')`,
                  width: config.menuSize,
                  height: config.menuSize,
                  position: "absolute",
                  top: 0,
                  left: 0,
                  opacity: 0,
                }}
                onMouseEnter={() => {
                  if (isOpen) {
                    try {
                      new Audio("/menu-select.mp3").play().catch(() => {});
                    } catch (e) {}
                  }
                }}
              >
                <div
                  className="segment-content"
                  style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: `translate(-50%, -50%) translate(${seg.offsetX}px, ${seg.offsetY}px)`,
                  }}
                >
                  <div
                    style={{
                      fontSize: config.isMobile ? "24px" : "40px",
                      marginBottom: config.isMobile ? "5px" : "10px",
                    }}
                  >
                    {seg.icon}
                  </div>
                  <div
                    className="label"
                    style={{
                      fontSize: config.isMobile ? "12px" : "15px",
                    }}
                  >
                    {seg.label}
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div
            ref={joystickRef}
            className="joystick"
            style={{
              width: config.isMobile ? "60px" : "100px",
              height: config.isMobile ? "60px" : "100px",
              overflow: "hidden",
            }}
          >
            <img
              src="../../../../Images/img3.jpg"
              alt="Menu Center Logo"
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                pointerEvents: "none",
              }}
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default CircularMenu;
