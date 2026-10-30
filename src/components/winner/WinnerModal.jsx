import React, { useEffect } from 'react';
import confetti from 'canvas-confetti';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatRupees } from '../../utils/formatters';
import { calculatePlayerNetWorth } from '../../utils/calculations';
import { useGameStore } from '../../store/gameStore';
import { Crown, Trophy, RotateCcw, Home } from 'lucide-react';

export function WinnerModal({ isOpen, onClose }) {
  const store = useGameStore();
  const winner = store.winner;

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 120,
          spread: 80,
          origin: { y: 0.6 },
        });
      } catch (err) {
        // ignore
      }
    }
  }, [isOpen]);

  if (!isOpen || !winner) return null;

  const netWorth = calculatePlayerNetWorth(winner, store.properties);
  const propertiesOwned = Object.values(store.properties).filter(
    (p) => p.ownerId === winner.id
  ).length;

  return (
    <Modal isOpen={isOpen} onClose={() => {}} title="Victory Celebration!" maxWidth="max-w-md" showClose={false}>
      <div className="flex flex-col items-center text-center">
        {/* Crown & Trophy Graphic */}
        <div className="relative mb-3">
          <div className="w-20 h-20 rounded-full bg-amber-400 border-3 border-vyapar-navy shadow-brutal flex items-center justify-center">
            <Trophy className="w-10 h-10 text-vyapar-navy" />
          </div>
          <Crown className="w-8 h-8 text-amber-500 absolute -top-3 -right-2 drop-shadow-md animate-bounce" />
        </div>

        <div className="text-xs font-black uppercase tracking-widest text-amber-700">
          Vyapar Maha Tycoon
        </div>

        <h2 className="text-2xl font-black text-vyapar-navy mt-1">
          {winner.name} Wins!
        </h2>

        <p className="text-xs text-slate-600 mt-2 px-4 leading-relaxed">
          Through strategic trading, bold acquisitions, and shrewd business acumen, {winner.name} has outperformed all rival merchants to dominate the Indian market!
        </p>

        {/* Stats card */}
        <div className="w-full mt-4 p-4 rounded-brutal bg-amber-50 border-2 border-amber-300 shadow-brutal flex flex-col gap-2 text-xs">
          <div className="flex justify-between items-center pb-1 border-b border-amber-200">
            <span className="font-bold text-amber-900">Final Net Worth:</span>
            <span className="text-base font-black text-amber-950">{formatRupees(netWorth)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-amber-900">Cash Reserves:</span>
            <span className="font-bold text-amber-950">{formatRupees(winner.wallet)}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="font-bold text-amber-900">Total Properties Controlled:</span>
            <span className="font-bold text-amber-950">{propertiesOwned} Estates</span>
          </div>
        </div>

        <div className="w-full mt-6 flex flex-col gap-2">
          <Button
            variant="success"
            size="lg"
            className="w-full"
            onClick={() => {
              window.location.href = '/setup';
            }}
            icon={RotateCcw}
          >
            Play Another Game
          </Button>

          <Button
            variant="secondary"
            size="md"
            className="w-full"
            onClick={() => {
              window.location.href = '/';
            }}
            icon={Home}
          >
            Back to Welcome Screen
          </Button>
        </div>
      </div>
    </Modal>
  );
}
