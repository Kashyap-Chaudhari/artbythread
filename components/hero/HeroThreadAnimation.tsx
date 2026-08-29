"use client";

import React from "react";
import { motion, useReducedMotion, type Variants } from "framer-motion";

export const HeroThreadAnimation: React.FC = () => {
  const shouldReduceMotion = useReducedMotion();

  // Animation variants
  const threadDraw: Variants = {
    hidden: { pathLength: shouldReduceMotion ? 1 : 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        pathLength: { duration: 3.2, ease: "easeInOut" },
        opacity: { duration: 0.4 },
      },
    },
  };

  const leafStemDraw: Variants = {
    hidden: { pathLength: shouldReduceMotion ? 1 : 0, opacity: 0 },
    visible: {
      pathLength: 1,
      opacity: 1,
      transition: {
        delay: shouldReduceMotion ? 0 : 1.2,
        duration: 2.2,
        ease: "easeInOut",
      },
    },
  };

  const floralBloomDraw: Variants = {
    hidden: { pathLength: shouldReduceMotion ? 1 : 0, opacity: 0, scale: shouldReduceMotion ? 1 : 0.95 },
    visible: {
      pathLength: 1,
      opacity: 1,
      scale: 1,
      transition: {
        delay: shouldReduceMotion ? 0 : 2.0,
        duration: 2.0,
        ease: "easeOut",
      },
    },
  };

  const frenchKnotsStitch: Variants = {
    hidden: { scale: 0, opacity: 0 },
    visible: (i: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: shouldReduceMotion ? 0 : 2.8 + i * 0.08,
        type: "spring" as const,
        stiffness: 300,
        damping: 20,
      },
    }),
  };

  const fillGlow: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 0.85,
      transition: { delay: shouldReduceMotion ? 0 : 3.4, duration: 1.2 },
    },
  };

  return (
    <div className="relative w-full max-w-[580px] aspect-square mx-auto flex items-center justify-center select-none">
      {/* Background Wooden Embroidery Hoop */}
      <svg
        viewBox="0 0 500 500"
        className="w-full h-full drop-shadow-[0_12px_32px_rgba(61,52,45,0.08)]"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Subtle Fabric Grain & Gradients */}
          <radialGradient id="hoopFabric" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#FFFDF9" />
            <stop offset="85%" stopColor="#F9F4EB" />
            <stop offset="100%" stopColor="#EFE6D8" />
          </radialGradient>

          <linearGradient id="woodRing" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#D9B78F" />
            <stop offset="50%" stopColor="#C49F75" />
            <stop offset="100%" stopColor="#A88155" />
          </linearGradient>

          <linearGradient id="brassScrew" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E8C872" />
            <stop offset="50%" stopColor="#D4AF37" />
            <stop offset="100%" stopColor="#AA820A" />
          </linearGradient>

          <linearGradient id="crimsonThreadGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#C84B31" />
            <stop offset="50%" stopColor="#D95C42" />
            <stop offset="100%" stopColor="#E4929A" />
          </linearGradient>

          <linearGradient id="sageStemGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#5E7A68" />
            <stop offset="100%" stopColor="#7D9D8B" />
          </linearGradient>

          <linearGradient id="rosePetalGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#E4929A" />
            <stop offset="100%" stopColor="#D47A85" />
          </linearGradient>

          <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="3" stdDeviation="4" floodColor="#3D342D" floodOpacity="0.12" />
          </filter>
        </defs>

        {/* 1. Hoop Brass Screw Clasp at Top */}
        <g transform="translate(235, 16)">
          <rect x="0" y="0" width="30" height="12" rx="2" fill="url(#brassScrew)" stroke="#8A6805" strokeWidth="0.75" />
          <line x1="8" y1="2" x2="8" y2="10" stroke="#FFF" strokeWidth="0.75" strokeOpacity="0.6" />
          <circle cx="15" cy="6" r="3" fill="#8A6805" />
          <rect x="12" y="-6" width="6" height="8" rx="1" fill="url(#brassScrew)" />
        </g>

        {/* 2. Wooden Hoop Outer and Inner Rings */}
        <circle cx="250" cy="260" r="215" stroke="url(#woodRing)" strokeWidth="18" fill="none" opacity="0.95" />
        <circle cx="250" cy="260" r="206" stroke="#8C673B" strokeWidth="1.5" fill="none" opacity="0.4" />
        <circle cx="250" cy="260" r="224" stroke="#8C673B" strokeWidth="1" fill="none" opacity="0.3" />

        {/* 3. Stretched Linen Fabric Canvas inside Hoop */}
        <circle cx="250" cy="260" r="202" fill="url(#hoopFabric)" />

        {/* 4. Subtle Perimeter Embroidery Stitch Marks */}
        <circle
          cx="250"
          cy="260"
          r="192"
          stroke="#D8CCBE"
          strokeWidth="1.5"
          strokeDasharray="4 8"
          fill="none"
          opacity="0.7"
        />

        {/* 5. Delicate Petal Satin Glow (Fills in after stitches) */}
        <motion.g variants={fillGlow} initial="hidden" animate="visible">
          {/* Main Rose Soft Fill */}
          <path
            d="M 230 220 C 210 200, 260 170, 280 200 C 300 230, 260 270, 230 250 C 200 230, 250 240, 230 220 Z"
            fill="#FBE8EB"
            opacity="0.7"
          />
          {/* Daisy Petal Fills */}
          <circle cx="290" cy="290" r="16" fill="#FEF8E7" opacity="0.8" />
          <circle cx="195" cy="275" r="14" fill="#F0EAF5" opacity="0.8" />
        </motion.g>

        {/* 6. SAGE GREEN STEMS & BOTANICAL LEAF BRANCHES */}
        <motion.path
          d="M 170 330 C 190 300, 220 280, 245 255 C 265 235, 275 195, 260 165"
          stroke="url(#sageStemGrad)"
          strokeWidth="3"
          strokeLinecap="round"
          fill="none"
          variants={leafStemDraw}
          initial="hidden"
          animate="visible"
        />

        <motion.path
          d="M 245 255 C 270 275, 310 285, 335 270 C 350 260, 360 240, 350 220"
          stroke="url(#sageStemGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          variants={leafStemDraw}
          initial="hidden"
          animate="visible"
        />

        {/* Leaf 1 (Left) */}
        <motion.path
          d="M 205 290 C 180 285, 175 260, 195 255 C 215 250, 215 275, 205 290 Z"
          stroke="#5E7A68"
          strokeWidth="1.75"
          fill="#E5EDE8"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={leafStemDraw}
          initial="hidden"
          animate="visible"
        />

        {/* Leaf 2 (Right Upper) */}
        <motion.path
          d="M 260 210 C 285 200, 305 205, 300 225 C 295 245, 270 230, 260 210 Z"
          stroke="#5E7A68"
          strokeWidth="1.75"
          fill="#E5EDE8"
          strokeLinecap="round"
          strokeLinejoin="round"
          variants={leafStemDraw}
          initial="hidden"
          animate="visible"
        />

        {/* Leaf 3 (Bottom Branch) */}
        <motion.path
          d="M 285 275 C 305 295, 325 305, 335 290 C 340 275, 315 265, 285 275 Z"
          stroke="#5E7A68"
          strokeWidth="1.75"
          fill="#E5EDE8"
          strokeLinecap="round"
          variants={leafStemDraw}
          initial="hidden"
          animate="visible"
        />

        {/* 7. HAND-STITCHED BLOOMING ROSE PETALS (Crimson & Rose Threads) */}
        <motion.path
          d="M 235 190 C 248 175, 275 178, 285 195 C 295 212, 280 235, 255 240 C 230 245, 215 225, 222 205 C 228 190, 250 190, 260 200 C 270 210, 260 225, 248 222 C 240 220, 242 208, 250 208"
          stroke="url(#crimsonThreadGrad)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          filter="url(#softShadow)"
          variants={floralBloomDraw}
          initial="hidden"
          animate="visible"
        />

        {/* Outer Rose Petals */}
        <motion.path
          d="M 220 185 C 200 170, 185 200, 205 225 C 215 238, 200 260, 230 265 C 260 270, 290 255, 295 230 C 300 200, 310 180, 280 170"
          stroke="url(#rosePetalGrad)"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeDasharray="1 0"
          fill="none"
          variants={floralBloomDraw}
          initial="hidden"
          animate="visible"
        />

        {/* 8. LAVENDER SPRIG & DAISY PETAL ACCENTS */}
        {/* Lavender Spire on Left */}
        <motion.g variants={floralBloomDraw} initial="hidden" animate="visible">
          <path d="M 165 240 C 170 225, 178 215, 185 200" stroke="#8476A0" strokeWidth="1.8" strokeLinecap="round" />
          <ellipse cx="168" cy="235" rx="4" ry="7" transform="rotate(-25 168 235)" fill="#DCD7E8" stroke="#8476A0" strokeWidth="1.2" />
          <ellipse cx="178" cy="225" rx="4" ry="7" transform="rotate(25 178 225)" fill="#DCD7E8" stroke="#8476A0" strokeWidth="1.2" />
          <ellipse cx="175" cy="210" rx="3.5" ry="6" transform="rotate(-20 175 210)" fill="#DCD7E8" stroke="#8476A0" strokeWidth="1.2" />
          <ellipse cx="184" cy="200" rx="3" ry="5" fill="#DCD7E8" stroke="#8476A0" strokeWidth="1.2" />
        </motion.g>

        {/* Daisy Petals on Right */}
        <motion.g variants={floralBloomDraw} initial="hidden" animate="visible">
          <circle cx="310" cy="280" r="7" fill="#E9C46A" stroke="#C5A880" strokeWidth="1.5" />
          <path d="M 310 273 C 310 260, 315 260, 315 273" stroke="#D6C7B7" strokeWidth="2" strokeLinecap="round" />
          <path d="M 317 277 C 328 270, 332 276, 317 282" stroke="#D6C7B7" strokeWidth="2" strokeLinecap="round" />
          <path d="M 315 285 C 325 295, 320 300, 311 287" stroke="#D6C7B7" strokeWidth="2" strokeLinecap="round" />
          <path d="M 305 286 C 298 296, 292 292, 303 283" stroke="#D6C7B7" strokeWidth="2" strokeLinecap="round" />
          <path d="M 303 277 C 292 272, 295 266, 306 275" stroke="#D6C7B7" strokeWidth="2" strokeLinecap="round" />
        </motion.g>

        {/* 9. FRENCH KNOT EMBROIDERY STITCHES (Sequential pop animation) */}
        {[
          { cx: 242, cy: 205, color: "#C84B31", r: 3 },
          { cx: 252, cy: 215, color: "#D95C42", r: 2.8 },
          { cx: 260, cy: 202, color: "#E9C46A", r: 3.2 },
          { cx: 236, cy: 218, color: "#E4929A", r: 2.5 },
          { cx: 268, cy: 212, color: "#E9C46A", r: 3 },
          { cx: 248, cy: 196, color: "#C84B31", r: 2.5 },
          { cx: 310, cy: 280, color: "#AA820A", r: 2.5 },
          { cx: 210, cy: 275, color: "#7D9D8B", r: 2.5 },
          { cx: 280, cy: 245, color: "#E4929A", r: 2.6 },
        ].map((knot, index) => (
          <motion.circle
            key={index}
            cx={knot.cx}
            cy={knot.cy}
            r={knot.r}
            fill={knot.color}
            stroke="#FFFDF9"
            strokeWidth="0.75"
            variants={frenchKnotsStitch}
            custom={index}
            initial="hidden"
            animate="visible"
          />
        ))}

        {/* 10. THE SIGNATURE TRAVELING THREAD (The Thread Becoming Art) */}
        <motion.path
          d="M 30 110 C 90 90, 110 180, 160 150 C 200 125, 230 140, 245 170 C 260 200, 230 260, 210 270 C 190 280, 175 320, 220 350 C 270 385, 330 360, 360 310 C 390 260, 420 280, 465 240"
          stroke="url(#crimsonThreadGrad)"
          strokeWidth="2.8"
          strokeLinecap="round"
          strokeDasharray={shouldReduceMotion ? "none" : "6 4"}
          fill="none"
          variants={threadDraw}
          initial="hidden"
          animate="visible"
        />

        {/* Trailing Thread Bow / Tail at bottom */}
        <motion.path
          d="M 220 350 C 200 375, 170 395, 150 425 C 130 455, 120 480, 135 495 C 150 510, 180 470, 205 450 C 230 430, 280 440, 320 475"
          stroke="#C84B31"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeDasharray="4 4"
          fill="none"
          variants={threadDraw}
          initial="hidden"
          animate="visible"
        />

        {/* 11. EMBROIDERY NEEDLE (At the leading tip) */}
        {!shouldReduceMotion && (
          <motion.g
            initial={{ opacity: 0, x: 440, y: 220, rotate: -25 }}
            animate={{
              opacity: [0, 1, 1, 0.85],
              x: [420, 465, 465, 465],
              y: [260, 240, 240, 240],
              rotate: [-45, -20, -20, -15],
            }}
            transition={{
              delay: 3.0,
              duration: 1.2,
              ease: "easeOut",
            }}
          >
            {/* Vintage Silver Needle Body */}
            <path
              d="M 465 240 L 490 215 L 493 218 L 468 243 Z"
              fill="#D9D9DE"
              stroke="#8A8A94"
              strokeWidth="0.75"
            />
            {/* Needle Tip */}
            <polygon points="465,240 460,245 468,243" fill="#A4A4AF" />
            {/* Needle Eye */}
            <ellipse cx="488" cy="217" rx="1" ry="3" transform="rotate(-45 488 217)" fill="#3D342D" />
            {/* Golden Thread through Needle Eye */}
            <path d="M 488 217 C 495 210, 505 215, 510 205" stroke="#C84B31" strokeWidth="1.8" strokeLinecap="round" />
          </motion.g>
        )}

        {/* 12. ARTBYTHREAD.7 SUBTLE BRAND SIGNATURE STAMP ON CANVAS */}
        <motion.g
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 0.7, y: 0 }}
          transition={{ delay: shouldReduceMotion ? 0 : 3.6, duration: 1.0 }}
        >
          <text
            x="250"
            y="390"
            textAnchor="middle"
            fill="#5C4F46"
            fontSize="12"
            fontFamily="var(--font-serif), 'Playfair Display', serif"
            letterSpacing="3"
            fontWeight="500"
          >
            ARTBYTHREAD.7
          </text>
          <text
            x="250"
            y="405"
            textAnchor="middle"
            fill="#A3968B"
            fontSize="8.5"
            fontFamily="var(--font-sans), 'Plus Jakarta Sans', sans-serif"
            letterSpacing="2"
          >
            HANDMADE STUDIO
          </text>
        </motion.g>
      </svg>
    </div>
  );
};
