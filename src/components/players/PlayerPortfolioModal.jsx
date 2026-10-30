import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useGameStore } from '../../store/gameStore';
import { GAME_RULES } from '../../data/gameRules';
import { formatRupees } from '../../utils/formatters';
import { calculatePlayerNetWorth } from '../../utils/calculations';
import { PropertyLandmarkImage } from '../../utils/cityImages';
import { Building2, Home, Hotel, ShieldAlert } from 'lucide-react';

export function PlayerPortfolioModal({ playerId, isOpen, onClose }) {
  const store = useGameStore();
  const player = store.players.find((p) => p.id === playerId);
  const currentPlayer = store.players[store.currentPlayerIndex];
  const isCurrentPlayer = player && currentPlayer && player.id === currentPlayer.id;

  if (!isOpen || !player) return null;

  const ownedProperties = Object.values(store.properties).filter(
    (p) => p.ownerId === player.id
  );
  const netWorth = calculatePlayerNetWorth(player, store.properties);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`${player.name}'s Vyapar Portfolio`}
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col gap-4 text-vyapar-navy">
        {/* Merchant Summary Header */}
        <div className="p-3 rounded-brutal bg-slate-50 border-2 border-vyapar-navy flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span
              style={{ backgroundColor: player.color }}
              className="w-4 h-4 rounded-full border border-vyapar-navy"
            />
            <span className="font-black text-sm">{player.name}</span>
          </div>

          <div className="flex items-center gap-4 text-xs font-black">
            <span>Cash: {formatRupees(player.wallet)}</span>
            <span className="text-emerald-800">Net Worth: {formatRupees(netWorth)}</span>
          </div>
        </div>

        {/* Deeds Grid */}
        <div className="space-y-2">
          <div className="text-xs font-black uppercase text-slate-500 tracking-wider">
            Title Deeds Owned ({ownedProperties.length})
          </div>

          {ownedProperties.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-300 rounded-brutal font-semibold">
              No properties purchased yet. Travel the board to acquire prime Indian real estate!
            </div>
          ) : (
            <div className="max-h-72 overflow-y-auto space-y-2 pr-1">
              {ownedProperties.map((prop) => {
                const groupConfig = prop.group ? GAME_RULES.COLOR_GROUPS[prop.group] : null;
                return (
                  <div
                    key={prop.id}
                    className="p-2.5 rounded-lg border-2 border-vyapar-navy bg-white shadow-xs flex items-center justify-between gap-3"
                  >
                    <div className="flex items-center gap-2.5">
                      {/* Color indicator bar */}
                      <div
                        style={{ backgroundColor: groupConfig ? groupConfig.color : '#475569' }}
                        className="w-2.5 h-10 rounded border border-vyapar-navy"
                      />

                      <div>
                        <div className="font-black text-xs text-vyapar-navy flex items-center gap-1.5">
                          <span>{prop.name}</span>
                          {prop.isMortgaged && (
                            <span className="px-1 py-0.2 rounded bg-red-100 text-red-700 text-[9px] font-black">
                              MORTGAGED
                            </span>
                          )}
                        </div>

                        <div className="text-[10px] text-slate-500 flex items-center gap-2 mt-0.5">
                          <span>Value: {formatRupees(prop.price)}</span>
                          {prop.houses > 0 && <span>• {prop.houses} Houses</span>}
                          {prop.hasHotel && <span className="font-bold text-red-600">• Grand Hotel</span>}
                        </div>
                      </div>
                    </div>

                    {/* Quick controls if it's the current player's portfolio */}
                    {isCurrentPlayer && (
                      <div className="flex items-center gap-1.5">
                        {prop.type === 'PROPERTY' && !prop.isMortgaged && (
                          <Button
                            variant="yellow"
                            size="sm"
                            onClick={() => store.buildHouseOrHotel(prop.id, player.id)}
                            className="text-[10px] py-1 px-2"
                          >
                            Build
                          </Button>
                        )}

                        {!prop.isMortgaged ? (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => store.mortgageProperty(prop.id, player.id)}
                            className="text-[10px] py-1 px-2"
                          >
                            Mortgage
                          </Button>
                        ) : (
                          <Button
                            variant="primary"
                            size="sm"
                            onClick={() => store.unmortgageProperty(prop.id, player.id)}
                            className="text-[10px] py-1 px-2"
                          >
                            Unmortgage
                          </Button>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close Portfolio
          </Button>
        </div>
      </div>
    </Modal>
  );
}
