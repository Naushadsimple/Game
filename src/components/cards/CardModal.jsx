import React from 'react';
import { motion } from 'framer-motion';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useGameStore } from '../../store/gameStore';
import { Sparkles, Gift, ArrowRight } from 'lucide-react';

export function CardModal({ isOpen, onClose }) {
  const store = useGameStore();
  const drawn = store.drawnCard;

  if (!drawn) return null;

  const { card, deckType } = drawn;
  const isChance = deckType === 'CHANCE';

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title={isChance ? 'Chance Card Drawn' : 'Community Chest Card Drawn'}
      maxWidth="max-w-md"
      showClose={false}
    >
      <div className="flex flex-col items-center text-center">
        <motion.div
          initial={{ rotateY: 90, scale: 0.8 }}
          animate={{ rotateY: 0, scale: 1 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className={`w-full p-6 rounded-brutal-lg border-3 border-vyapar-navy shadow-brutal-lg flex flex-col items-center ${
            isChance ? 'bg-amber-100 text-amber-950' : 'bg-rose-100 text-rose-950'
          }`}
        >
          {/* Card Icon */}
          <div
            className={`w-14 h-14 rounded-full border-2 border-vyapar-navy flex items-center justify-center mb-3 shadow-brutal-sm ${
              isChance ? 'bg-vyapar-yellow' : 'bg-vyapar-red'
            }`}
          >
            {isChance ? (
              <Sparkles className="w-8 h-8 text-vyapar-navy" />
            ) : (
              <Gift className="w-8 h-8 text-white" />
            )}
          </div>

          <div className="text-xs font-black uppercase tracking-widest opacity-80">
            {isChance ? 'Vyapar Chance Directive' : 'Community Chest Trust'}
          </div>

          <h3 className="text-xl font-black mt-2 leading-tight">
            {card.title}
          </h3>

          <p className="text-sm font-semibold mt-3 text-slate-800 leading-relaxed bg-white/70 p-3 rounded-lg border border-vyapar-navy/20 w-full">
            {card.description}
          </p>
        </motion.div>

        <div className="w-full mt-5">
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => store.applyCardEffect()}
            icon={ArrowRight}
          >
            Acknowledge & Continue
          </Button>
        </div>
      </div>
    </Modal>
  );
}
