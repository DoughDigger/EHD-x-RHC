/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React, { useMemo } from 'react';
import { motion } from 'framer-motion';
import { useMobile } from '../hooks/useMobile';

const StarField = () => {
  const isMobile = useMobile();
  // Reduced star count further for mobile
  const stars = useMemo(() => {
    return Array.from({ length: isMobile ? 8 : 15 }).map((_, i) => ({
      id: i,
      size: Math.random() * 2 + 1,
      x: Math.random() * 100,
      y: Math.random() * 100,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
      opacity: Math.random() * 0.7 + 0.3
    }));
  }, [isMobile]);

  return (
    <div className="absolute inset-0 z-0 pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white will-change-[opacity,transform]"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: star.size,
            height: star.size,
            transform: 'translateZ(0)'
          }}
          initial={{ opacity: star.opacity, scale: 1 }}
          animate={{
            opacity: [star.opacity, 1, star.opacity],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration * 2,
            repeat: Infinity,
            ease: "easeInOut",
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

const FluidBackground: React.FC = () => {
  const isMobile = useMobile();

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-gradient-to-br from-[#31326f] via-[#28295c] to-[#1f2048]">
      
      <StarField />

      {/* Blob 1: Mint - Smaller blur on mobile for perf */}
      <motion.div
        className="absolute top-[-10%] left-[-10%] w-[120vw] md:w-[90vw] h-[120vw] md:h-[90vw] bg-[#a8fbd3] rounded-full mix-blend-screen opacity-20 md:opacity-30 will-change-transform"
        style={{ 
          filter: isMobile ? 'blur(30px)' : 'blur(40px)',
          transform: 'translateZ(0)' 
        }}
        animate={{
          x: [0, 50, -25, 0],
          y: [0, -25, 25, 0],
        }}
        transition={{
          duration: isMobile ? 35 : 25, // Slower on mobile
          repeat: Infinity,
          ease: "linear"
        }}
      />

      {/* Blob 2: Teal - Only render complex blobs if not on ultra-low end or mobile if needed, 
          but here we'll keep 2 simplified ones for mobile */}
      <motion.div
        className="absolute top-[20%] right-[-20%] w-[120vw] md:w-[100vw] h-[100vw] md:h-[80vw] bg-[#4fb7b3] rounded-full mix-blend-screen opacity-15 md:opacity-20 will-change-transform"
        style={{ 
          filter: isMobile ? 'blur(30px)' : 'blur(40px)',
          transform: 'translateZ(0)' 
        }}
        animate={{
          x: [0, -50, 25, 0],
          y: [0, 50, -25, 0],
        }}
        transition={{
          duration: isMobile ? 40 : 30,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      {/* Hide Blob 3 on mobile for performance */}
      {!isMobile && (
        <motion.div
          className="absolute bottom-[-20%] left-[20%] w-[80vw] h-[80vw] bg-[#637ab9] rounded-full mix-blend-screen filter blur-[40px] opacity-20 will-change-transform"
          animate={{
            x: [0, 75, -75, 0],
            y: [0, -50, 50, 0],
          }}
          transition={{
            duration: 35,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{ transform: 'translateZ(0)' }}
        />
      )}

      {/* Static Grain Overlay - Less visible on mobile */}
      <div className={`absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] ${isMobile ? 'opacity-5' : 'opacity-10'} mix-blend-overlay pointer-events-none`}></div>
      
      {/* Vignette */}
      <div className="absolute inset-0 bg-radial-gradient from-transparent via-black/10 to-black/60 pointer-events-none" />
    </div>
  );
};

export default FluidBackground;