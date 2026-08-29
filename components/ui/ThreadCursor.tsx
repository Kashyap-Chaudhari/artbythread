"use client";

import React, { useEffect, useState } from "react";
import { motion, useSpring, useReducedMotion } from "framer-motion";

export const ThreadCursor: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();
  const [mounted, setMounted] = useState(false);
  const [isHoveringClickable, setIsHoveringClickable] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(true);

  const cursorX = useSpring(0, { damping: 28, stiffness: 250 });
  const cursorY = useSpring(0, { damping: 28, stiffness: 250 });

  const trailX = useSpring(0, { damping: 35, stiffness: 140 });
  const trailY = useSpring(0, { damping: 35, stiffness: 140 });

  useEffect(() => {
    setMounted(true);
    // Detect touch device
    const isTouch = window.matchMedia("(pointer: coarse)").matches;
    setIsTouchDevice(isTouch);

    if (isTouch || shouldReduceMotion) return;

    const handleMouseMove = (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);
      trailX.set(e.clientX);
      trailY.set(e.clientY);
    };

    const handleMouseOver = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;
      const isClickable = Boolean(
        target.closest("button, a, input, textarea, select, [role='button'], .clickable")
      );
      setIsHoveringClickable(isClickable);
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseover", handleMouseOver);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseover", handleMouseOver);
    };
  }, [cursorX, cursorY, trailX, trailY, shouldReduceMotion]);

  if (!mounted || isTouchDevice || shouldReduceMotion) return null;

  return (
    <div className="pointer-events-none fixed inset-0 z-50 overflow-hidden">
      {/* 1. Leading Tiny Needle Tip Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHoveringClickable ? 1.6 : 1,
          backgroundColor: isHoveringClickable ? "#C84B31" : "#3D342D",
        }}
        transition={{ duration: 0.15 }}
        className="w-2.5 h-2.5 rounded-full shadow-xs"
      />

      {/* 2. Soft Thread Ring Follower */}
      <motion.div
        style={{
          x: trailX,
          y: trailY,
          translateX: "-50%",
          translateY: "-50%",
        }}
        animate={{
          scale: isHoveringClickable ? 1.4 : 1,
          borderColor: isHoveringClickable ? "#C84B31" : "#D47A85",
          opacity: isHoveringClickable ? 0.7 : 0.4,
        }}
        transition={{ duration: 0.2 }}
        className="w-7 h-7 rounded-full border border-dashed"
      />
    </div>
  );
};
