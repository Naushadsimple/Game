import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useGameStore } from '../../store/gameStore';
import { GAME_RULES } from '../../data/gameRules';
import { formatRupees } from '../../utils/formatters';
import { Lock, Dices, CreditCard, Key } from 'lucide-react';

export function JailModal({ isOpen, onClose }) {
  const store = useGameStore();
  const currentPlayer = store.players[store.currentPlayerIndex];

  if (!currentPlayer || !currentPlayer.isInJail) return null;

  const canAffordFine = currentPlayer.wallet >= GAME_RULES.JAIL_FINE;
  const hasJailCard = currentPlayer.getOutOfJailCards > 0;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Central Jail Lockup"
      maxWidth="max-w-md"
    >
      <div className="flex flex-col items-center text-center">
        {/* Cell Graphic */}
        <div className="w-20 h-20 rounded-full bg-slate-900 border-3 border-vyapar-navy shadow-brutal flex items-center justify-center mb-3">
          <Lock className="w-10 h-10 text-amber-400" />
        </div>

        <h3 className="text-xl font-black text-vyapar-navy">
          {currentPlayer.name} is in Central Jail!
        </h3>

        <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-red-100 border border-red-300 text-red-800 text-xs font-black">
          <span>Turns Remaining in Custody: {currentPlayer.jailTurnsRemaining}</span>
        </div>

        <p className="text-xs text-slate-600 mt-2 px-4 leading-relaxed">
          You cannot advance around the bazaar while incarcerated. Choose an option below to secure your freedom:
        </p>

        {/* Options */}
        <div className="w-full mt-4 flex flex-col gap-2.5">
          {/* Roll Doubles Option */}
          {!store.hasRolled && (
            <Button
              variant="yellow"
              size="md"
              className="w-full justify-between"
              onClick={() => store.rollDice()}
              icon={Dices}
            >
              <span>Attempt to Roll Doubles</span>
              <span className="text-xs font-bold opacity-80">(Free release if rolled)</span>
            </Button>
          )}

          {/* Pay Fine Option */}
          <Button
            variant={canAffordFine ? 'primary' : 'secondary'}
            size="md"
            disabled={!canAffordFine}
            className="w-full justify-between"
            onClick={() => store.payJailFine(currentPlayer.id)}
            icon={CreditCard}
          >
            <span>Pay Bail Fine</span>
            <span className="font-black">{formatRupees(GAME_RULES.JAIL_FINE)}</span>
          </Button>

          {/* Use Get Out of Jail Card Option */}
          {hasJailCard && (
            <Button
              variant="success"
              size="md"
              className="w-full justify-between"
              onClick={() => store.useJailCard(currentPlayer.id)}
              icon={Key}
            >
              <span>Use Free Bail Pass</span>
              <span className="text-xs font-bold">({currentPlayer.getOutOfJailCards} Available)</span>
            </Button>
          )}

          <Button variant="secondary" size="sm" onClick={onClose} className="mt-2 w-full">
            Remain in Cell (Wait Next Turn)
          </Button>
        </div>
      </div>
    </Modal>
  );
}
