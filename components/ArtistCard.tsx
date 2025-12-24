/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
*/


import React from 'react';
import { motion } from 'framer-motion';
import { Artist } from '../types';
import { ArrowUpRight } from 'lucide-react';
import { useMobile } from '../hooks/useMobile';

interface ArtistCardProps {
  artist: Artist;
  onClick: () => void;
}

const ArtistCard: React.FC<ArtistCardProps> = ({ artist, onClick }) => {
  const isMobile = useMobile();

  return (
    <motion.div
      className="group relative h-[25vh] md:h-[750px] w-full overflow-hidden border-b md:border-r border-white/20 bg-black cursor-pointer"
      initial="rest"
      whileHover={isMobile ? "rest" : "hover"}
      whileTap="hover"
      animate="rest"
      data-hover="true"
      onClick={onClick}
    >
      {/* Image Background with Zoom */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.img 
          src={artist.image} 
          alt={artist.name} 
          className="h-full w-full object-cover will-change-transform"
          variants={{
            rest: { scale: 1, opacity: 0.6, filter: 'brightness(0.8)' },
            hover: { scale: 1.05, opacity: 0.9, filter: 'brightness(1.1)' }
          }}
          transition={{ duration: 0.6, ease: [0.33, 1, 0.68, 1] }}
        />
        {/* Dark gradient for text visibility - adjusted for better contrast with brighter images */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent transition-opacity duration-500 group-hover:opacity-60" />
      </div>

      {/* Overlay Info */}
      <div className="absolute inset-0 p-4 md:p-8 flex flex-col justify-between pointer-events-none">
        <div className="flex justify-end items-start">
           <motion.div
             variants={{
               rest: { opacity: isMobile ? 1 : 0, x: isMobile ? 0 : 20, y: isMobile ? 0 : -20 },
               hover: { opacity: 1, x: 0, y: 0 }
             }}
             className="bg-white text-black rounded-full p-2 md:p-3 will-change-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]"
           >
             <ArrowUpRight className="w-4 h-4 md:w-6 md:h-6" />
           </motion.div>
        </div>

        <div className="relative z-10">
          <div className="overflow-hidden">
            <motion.h3 
              className="font-heading text-2xl md:text-4xl font-bold uppercase text-white drop-shadow-[0_4px_12px_rgba(0,0,0,1)] will-change-transform"
              variants={{
                rest: { y: 0 },
                hover: { y: -5 }
              }}
              transition={{ duration: 0.4 }}
            >
              {artist.name}
            </motion.h3>
          </div>
          <motion.p 
            className="text-[12px] md:text-base font-bold uppercase tracking-[0.3em] text-[#a8fbd3] mt-2 md:mt-3 drop-shadow-[0_2px_8px_rgba(0,0,0,1)] will-change-transform"
            variants={{
              rest: { opacity: 1, y: 0 },
              hover: { opacity: 1, y: -2 }
            }}
            transition={{ duration: 0.4, delay: 0.1 }}
          >
            {artist.genre}
          </motion.p>
        </div>
      </div>
      
      {/* Subtle Inner Glow on Hover */}
      <motion.div 
        className="absolute inset-0 border-2 border-[#a8fbd3]/0 pointer-events-none z-20"
        variants={{
          rest: { borderColor: 'rgba(168, 251, 211, 0)' },
          hover: { borderColor: 'rgba(168, 251, 211, 0.3)' }
        }}
      />
    </motion.div>
  );
};

export default ArtistCard;