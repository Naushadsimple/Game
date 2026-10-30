import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '../../store/gameStore';
import { BOARD_TILES } from '../../data/boardData';
import { BoardTile } from './BoardTile';
import { Dice } from './Dice';
import { Button } from '../ui/Button';
import { Dices, Check, Volume2, VolumeX, Sparkles, Gift, ArrowRight } from 'lucide-react';
import { formatRupees } from '../../utils/formatters';

function getGridPosition(index) {
  if (index === 0) return { gridRow: 11, gridColumn: 11 };
  if (index >= 1 && index <= 9) return { gridRow: 11, gridColumn: 11 - index };
  if (index === 10) return { gridRow: 11, gridColumn: 1 };
  if (index >= 11 && index <= 19) return { gridRow: 11 - (index - 10), gridColumn: 1 };
  if (index === 20) return { gridRow: 1, gridColumn: 1 };
  if (index >= 21 && index <= 29) return { gridRow: 1, gridColumn: 1 + (index - 20) };
  if (index === 30) return { gridRow: 1, gridColumn: 11 };
  if (index >= 31 && index <= 39) return { gridRow: 1 + (index - 30), gridColumn: 11 };
  return { gridRow: 1, gridColumn: 1 };
}

export function GameBoard({ onTileClick }) {
  const store = useGameStore();
  const currentPlayer = store.players[store.currentPlayerIndex];
  const canRoll =
    currentPlayer &&
    !currentPlayer.isAi &&
    !store.hasRolled &&
    !store.isRolling &&
    !store.isMoving;

  const canEndTurn =
    currentPlayer &&
    !currentPlayer.isAi &&
    store.hasRolled &&
    !store.isMoving &&
    !store.activeModal &&
    !store.pendingAction;

  return (
    <div className="relative w-full max-w-[850px] aspect-square mx-auto bg-[#F4F9FD] rounded-brutal sm:rounded-brutal-lg border-2 sm:border-3 border-vyapar-navy shadow-brutal-lg sm:shadow-brutal-xl p-1 sm:p-2 select-none overflow-hidden">
      {/* 11x11 Board Grid */}
      <div
        className="w-full h-full grid"
        style={{
          gridTemplateColumns:
            'minmax(48px, 1.25fr) repeat(9, minmax(26px, 1fr)) minmax(48px, 1.25fr)',
          gridTemplateRows:
            'minmax(48px, 1.25fr) repeat(9, minmax(26px, 1fr)) minmax(48px, 1.25fr)',
          gap: '1.5px',
        }}
      >
        {/* Render 40 Board Tiles */}
        {BOARD_TILES.map((tile) => {
          const style = getGridPosition(tile.index);
          const property = store.properties[tile.id];
          const playersOnTile = store.players.filter(
            (p) => !p.isBankrupt && p.position === tile.index
          );
          const isHighlighted = store.highlightedTileIndex === tile.index;

          return (
            <div key={tile.id} style={style} className="w-full h-full">
              <BoardTile
                tile={tile}
                property={property}
                playersOnTile={playersOnTile}
                activePlayerId={currentPlayer?.id}
                players={store.players}
                onClick={() => onTileClick(tile.id)}
                isHighlighted={isHighlighted}
              />
            </div>
          );
        })}

        {/* Center Board Arena (Row 2-10, Col 2-10) */}
        <div
          style={{
            gridRow: '2 / span 9',
            gridColumn: '2 / span 9',
          }}
          className="relative w-full h-full bg-[#EBF4FA] border border-vyapar-navy/40 sm:border-2 rounded-brutal flex flex-col justify-between items-center p-2 sm:p-4 overflow-hidden"
        >
          {/* Subtle patterned Indian rangoli watermark */}
          <div className="absolute inset-0 opacity-[0.03] pointer-events-none flex items-center justify-center">
            <svg viewBox="0 0 100 100" className="w-[80%] h-[80%]">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#14283F" strokeWidth="2" />
              <circle cx="50" cy="50" r="30" fill="none" stroke="#14283F" strokeWidth="2" />
              <polygon points="50,5 95,50 50,95 5,50" fill="none" stroke="#14283F" strokeWidth="2" />
            </svg>
          </div>

          {/* Top Center: Game Branding & Turn Announcement */}
          <div className="flex flex-col items-center text-center z-10 pt-1">
            <div className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white border border-vyapar-navy shadow-xs text-[9px] sm:text-[10px] font-black tracking-widest text-vyapar-navy uppercase">
              <span>व्यापार</span>
              <span>•</span>
              <span>VYAPAR</span>
            </div>

            {/* HIGH-IMPACT TURN NOTIFICATION ("ABHI MERI BARI HAI") */}
            {currentPlayer && (
              <motion.div
                key={currentPlayer.id}
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="mt-1 sm:mt-1.5 flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400 border-2 border-vyapar-navy shadow-brutal-sm"
              >
                <span
                  style={{ backgroundColor: currentPlayer.color }}
                  className="w-3 h-3 rounded-full border border-vyapar-navy animate-pulse"
                />
                <span className="text-[11px] sm:text-xs font-black text-vyapar-navy uppercase tracking-wider">
                  {currentPlayer.name} - ABHI AAPKI BARI HAI!
                </span>
                {currentPlayer.isAi && (
                  <span className="text-[9px] bg-slate-800 text-white px-1.5 py-0.2 rounded font-bold">[AI]</span>
                )}
              </motion.div>
            )}

            <div className="text-[10px] font-bold text-slate-500 mt-0.5">
              Round {store.round} {store.maxRounds > 0 ? `/ ${store.maxRounds}` : ''}
              {store.firstRoundTour && ' • [First Round Tour Active]'}
            </div>
          </div>

          {/* Interactive Movement Trail Animation Overlay */}
          <AnimatePresence>
            {store.movementInfo && (
              <motion.div
                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="z-20 px-3 py-1.5 rounded-brutal bg-gradient-to-r from-amber-400 via-yellow-300 to-amber-400 border-2 border-vyapar-navy shadow-brutal flex items-center gap-2 text-xs font-black text-vyapar-navy"
              >
                <motion.span animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: 'linear' }}>
                  🎲
                </motion.span>
                <span>
                  {store.movementInfo.playerName} moving: {store.movementInfo.fromTileName}
                </span>
                <ArrowRight className="w-4 h-4 text-vyapar-navy" />
                <span className="text-emerald-900 underline">
                  {store.movementInfo.toTileName}
                </span>
                <span className="px-1.5 py-0.2 rounded bg-white text-[10px]">
                  +{store.movementInfo.spaces}
                </span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Middle Center: Card Decks & Dice Hub */}
          <div className="w-full flex flex-col items-center justify-center gap-2 sm:gap-3 z-10">
            {/* Card decks indicators */}
            <div className="flex items-center gap-4 sm:gap-6">
              {/* Chance Deck Box */}
              <div
                onClick={() => {
                  if (currentPlayer && !currentPlayer.isAi) {
                    store.drawCard('CHANCE', currentPlayer.id);
                  }
                }}
                className="w-16 h-11 sm:w-20 sm:h-14 bg-amber-100 rounded-lg border-2 border-vyapar-navy shadow-brutal-sm flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                title="Chance Deck"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600 mb-0.5" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-amber-900">
                  Chance
                </span>
              </div>

              {/* Community Chest Deck Box */}
              <div
                onClick={() => {
                  if (currentPlayer && !currentPlayer.isAi) {
                    store.drawCard('COMMUNITY', currentPlayer.id);
                  }
                }}
                className="w-16 h-11 sm:w-20 sm:h-14 bg-rose-100 rounded-lg border-2 border-vyapar-navy shadow-brutal-sm flex flex-col items-center justify-center cursor-pointer hover:scale-105 transition-transform"
                title="Community Chest Deck"
              >
                <Gift className="w-3.5 h-3.5 text-rose-600 mb-0.5" />
                <span className="text-[9px] sm:text-[10px] font-black uppercase text-rose-900">
                  Community
                </span>
              </div>
            </div>

            {/* Dice Display with 3D animation */}
            <Dice
              dice={store.dice}
              isRolling={store.isRolling}
              isDoubles={store.isDoubles}
              consecutiveDoubles={store.consecutiveDoubles}
            />
          </div>

          {/* Bottom Center: Touch-Optimized Action Controller */}
          <div className="w-full flex items-center justify-center gap-2 z-10 pb-1">
            {canRoll && (
              <Button
                variant="yellow"
                size="md"
                onClick={() => store.rollDice()}
                icon={Dices}
                className="w-full sm:w-auto px-6 py-2.5 text-sm sm:text-base animate-pulse"
              >
                Roll Dice (Goti Chalao)
              </Button>
            )}

            {canEndTurn && (
              <Button
                variant="success"
                size="md"
                onClick={() => store.endTurn()}
                icon={Check}
                className="w-full sm:w-auto px-6 py-2.5 text-sm sm:text-base"
              >
                End Turn (Bari Samapt)
              </Button>
            )}

            {/* Sound toggle button */}
            <button
              onClick={() => store.setSoundMuted(!store.soundMuted)}
              className="p-2 rounded-lg border-2 border-vyapar-navy bg-white hover:bg-slate-100 text-vyapar-navy shadow-brutal-sm transition-transform active:translate-x-0.5 active:translate-y-0.5 shrink-0"
              title={store.soundMuted ? 'Unmute Sound' : 'Mute Sound'}
            >
              {store.soundMuted ? (
                <VolumeX className="w-4 h-4 text-red-500" />
              ) : (
                <Volume2 className="w-4 h-4 text-slate-700" />
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
