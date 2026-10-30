import React from 'react';
import { motion } from 'framer-motion';
import { PlayerToken } from '../board/PlayerToken';
import { formatRupees } from '../../utils/formatters';
import { calculatePlayerNetWorth } from '../../utils/calculations';
import { Lock, Building2, Wallet, Bot, Sparkles } from 'lucide-react';

export function PlayerCard({ player, isActive = false, properties = {}, onOpenPortfolio }) {
  if (!player) return null;

  const netWorth = calculatePlayerNetWorth(player, properties);
  const ownedProps = Object.values(properties).filter((p) => p.ownerId === player.id);

  return (
    <div
      onClick={onOpenPortfolio}
      className={`relative p-3 rounded-brutal border-2 transition-all cursor-pointer select-none ${
        isActive
          ? 'bg-gradient-to-r from-amber-50 via-sky-50 to-emerald-50 border-vyapar-navy shadow-brutal-lg ring-2 ring-yellow-400 scale-[1.02]'
          : 'bg-white border-vyapar-navy shadow-brutal-sm hover:bg-slate-50'
      } ${player.isBankrupt ? 'opacity-40 grayscale pointer-events-none' : ''}`}
    >
      {/* Top Banner when it is this player's turn */}
      {isActive && (
        <div className="mb-2 flex items-center justify-between px-2 py-0.5 rounded-full bg-yellow-400 border border-vyapar-navy shadow-xs">
          <span className="text-[9px] font-black uppercase tracking-wider text-vyapar-navy flex items-center gap-1">
            <Sparkles className="w-3 h-3 text-amber-900" />
            <span>ABHI MERI BARI HAI! (YOUR TURN)</span>
          </span>
          <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
        </div>
      )}

      {/* Top Row: Token & Name */}
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <PlayerToken
            token={player.token}
            color={player.color}
            isActive={isActive}
            size="md"
            name={player.name}
          />
          <div>
            <div className="flex items-center gap-1 font-black text-xs sm:text-sm text-vyapar-navy truncate max-w-[130px]">
              <span>{player.name}</span>
              {player.isAi && (
                <span className="p-0.5 rounded bg-slate-200 text-slate-700 text-[9px] flex items-center gap-0.5 font-bold" title={`AI (${player.aiDifficulty})`}>
                  <Bot className="w-3 h-3" />
                  <span className="text-[8px]">{player.aiDifficulty}</span>
                </span>
              )}
            </div>
            <div className="text-[10px] font-bold text-slate-500">
              Net Worth: {formatRupees(netWorth)}
            </div>
          </div>
        </div>

        {/* Status badges */}
        {player.isInJail ? (
          <span className="px-1.5 py-0.5 rounded bg-red-100 text-red-700 text-[9px] font-black flex items-center gap-0.5 border border-red-300">
            <Lock className="w-2.5 h-2.5" /> JAIL
          </span>
        ) : null}
      </div>

      {/* Financials & Assets Bar */}
      <div className="mt-2.5 pt-2 border-t border-slate-200 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-emerald-800 font-black">
          <Wallet className="w-3.5 h-3.5 text-emerald-600" />
          <span>{formatRupees(player.wallet)}</span>
        </div>

        <div className="flex items-center gap-1 text-slate-600 font-extrabold text-[11px]">
          <Building2 className="w-3.5 h-3.5 text-slate-500" />
          <span>{ownedProps.length} Deeds</span>
        </div>
      </div>
    </div>
  );
}
