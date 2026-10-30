import React from 'react';
import { motion } from 'framer-motion';
import { GAME_RULES } from '../../data/gameRules';

export function PlayerToken({
  token = 'car',
  color = '#EF4444',
  isActive = false,
  size = 'md', // 'sm', 'md', 'lg'
  name = '',
}) {
  const tokenConfig = GAME_RULES.TOKENS.find((t) => t.id === token) || GAME_RULES.TOKENS[0];

  const sizeClasses = {
    sm: 'w-5 h-5 sm:w-6 sm:h-6 text-[10px] sm:text-xs',
    md: 'w-8 h-8 text-sm',
    lg: 'w-11 h-11 text-lg',
  };

  return (
    <div className="relative inline-flex items-center justify-center" title={`${name} ${isActive ? "(Current Turn / Abhi Bari Hai!)" : ""}`}>
      {/* Active turn spotlight & bouncing indicator */}
      {isActive && (
        <>
          {/* Pulsing golden halo ring */}
          <motion.div
            animate={{ scale: [1, 1.5, 1], opacity: [0.9, 0.2, 0.9] }}
            transition={{ repeat: Infinity, duration: 1.2, ease: 'easeInOut' }}
            className="absolute -inset-2 rounded-full border-2 border-yellow-400 bg-yellow-300/40 z-0 pointer-events-none"
          />

          {/* Mini pointer indicator on top of goti */}
          <motion.div
            animate={{ y: [-3, 0, -3] }}
            transition={{ repeat: Infinity, duration: 0.8, ease: 'easeInOut' }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 z-30 pointer-events-none"
          >
            <span className="px-1 py-0.2 rounded-full bg-yellow-400 border border-vyapar-navy text-[7px] font-black text-vyapar-navy shadow-xs whitespace-nowrap leading-none flex items-center gap-0.5">
              <span>🎯</span>
              <span className="hidden sm:inline">BARI</span>
            </span>
          </motion.div>
        </>
      )}

      {/* The Goti / Token Avatar with lively jump animation when active */}
      <motion.div
        animate={
          isActive
            ? {
                y: [0, -6, 0],
                scale: [1, 1.15, 1],
              }
            : {}
        }
        transition={{
          repeat: Infinity,
          duration: 0.9,
          ease: 'easeInOut',
        }}
        style={{ backgroundColor: color }}
        className={`relative z-10 flex items-center justify-center rounded-full border border-vyapar-navy sm:border-2 shadow-brutal-sm font-black transition-transform select-none ${
          sizeClasses[size] || sizeClasses.md
        } ${isActive ? 'ring-2 ring-yellow-400' : ''}`}
      >
        <span>{tokenConfig.emoji}</span>
      </motion.div>
    </div>
  );
}
