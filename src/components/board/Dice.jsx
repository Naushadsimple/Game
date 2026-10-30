import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const DOT_POSITIONS = {
  1: [{ top: '50%', left: '50%' }],
  2: [
    { top: '25%', left: '25%' },
    { top: '75%', left: '75%' },
  ],
  3: [
    { top: '25%', left: '25%' },
    { top: '50%', left: '50%' },
    { top: '75%', left: '75%' },
  ],
  4: [
    { top: '25%', left: '25%' },
    { top: '25%', left: '75%' },
    { top: '75%', left: '25%' },
    { top: '75%', left: '75%' },
  ],
  5: [
    { top: '25%', left: '25%' },
    { top: '25%', left: '75%' },
    { top: '50%', left: '50%' },
    { top: '75%', left: '25%' },
    { top: '75%', left: '75%' },
  ],
  6: [
    { top: '25%', left: '25%' },
    { top: '25%', left: '75%' },
    { top: '50%', left: '25%' },
    { top: '50%', left: '75%' },
    { top: '75%', left: '25%' },
    { top: '75%', left: '75%' },
  ],
};

function SingleDie({ value, isRolling }) {
  const dots = DOT_POSITIONS[value] || DOT_POSITIONS[1];

  return (
    <motion.div
      animate={
        isRolling
          ? {
              rotate: [0, -25, 25, -15, 15, 0],
              scale: [1, 1.15, 0.95, 1.1, 1],
              x: [0, -6, 6, -3, 3, 0],
              y: [0, -10, 2, -6, 0],
            }
          : {}
      }
      transition={{ duration: 0.6, ease: 'easeInOut' }}
      className="relative w-14 h-14 bg-white rounded-xl border-3 border-vyapar-navy shadow-brutal flex items-center justify-center p-2"
    >
      {dots.map((dot, idx) => (
        <span
          key={idx}
          style={{
            position: 'absolute',
            top: dot.top,
            left: dot.left,
            transform: 'translate(-50%, -50%)',
          }}
          className="w-2.5 h-2.5 bg-vyapar-navy rounded-full"
        />
      ))}
    </motion.div>
  );
}

export function Dice({ dice = [1, 1], isRolling = false, isDoubles = false, consecutiveDoubles = 0 }) {
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-3">
        <SingleDie value={dice[0]} isRolling={isRolling} />
        <SingleDie value={dice[1]} isRolling={isRolling} />
      </div>

      {isDoubles && !isRolling && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-vyapar-yellow border-2 border-vyapar-navy text-vyapar-navy text-xs font-black shadow-brutal-sm uppercase tracking-wider"
        >
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          <span>Doubles! (Extra Turn)</span>
        </motion.div>
      )}

      {consecutiveDoubles > 1 && (
        <span className="text-xs font-bold text-red-600">
          Doubles Streak: {consecutiveDoubles}/3
        </span>
      )}
    </div>
  );
}
