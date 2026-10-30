import React from 'react';
import { Flag, Lock, Coffee, AlertOctagon, Train, Zap, Droplets, Gift, Sparkles, Receipt, Crown } from 'lucide-react';
import { GAME_RULES } from '../../data/gameRules';
import { formatRupees } from '../../utils/formatters';
import { PlayerToken } from './PlayerToken';

export function BoardTile({
  tile,
  property,
  playersOnTile = [],
  activePlayerId,
  players = [],
  onClick,
  isHighlighted = false, // Highlighted when player is moving across this tile
}) {
  const isCorner = ['START', 'JAIL', 'REST_HOUSE', 'GO_TO_JAIL'].includes(tile.type);
  const owner = property?.ownerId ? players.find((p) => p.id === property.ownerId) : null;
  const groupConfig = tile.group ? GAME_RULES.COLOR_GROUPS[tile.group] : null;

  // Icon selector for special & utility tiles
  const renderIcon = () => {
    switch (tile.type) {
      case 'START':
        return <Flag className="w-5 h-5 sm:w-6 sm:h-6 text-emerald-700" />;
      case 'JAIL':
        return <Lock className="w-5 h-5 sm:w-6 sm:h-6 text-slate-800" />;
      case 'REST_HOUSE':
        return <Coffee className="w-5 h-5 sm:w-6 sm:h-6 text-amber-700" />;
      case 'GO_TO_JAIL':
        return <AlertOctagon className="w-5 h-5 sm:w-6 sm:h-6 text-red-600 animate-pulse" />;
      case 'RAILWAY':
        return <Train className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />;
      case 'UTILITY':
        return tile.id.includes('electric') ? (
          <Zap className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
        ) : (
          <Droplets className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-sky-600" />
        );
      case 'CHANCE':
        return <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-500" />;
      case 'COMMUNITY':
        return <Gift className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />;
      case 'TAX':
        return tile.id.includes('luxury') ? (
          <Crown className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-amber-600" />
        ) : (
          <Receipt className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-600" />
        );
      default:
        return null;
    }
  };

  // Corner Tiles Layout
  if (isCorner) {
    let cornerBg = 'bg-white';
    if (tile.type === 'START') cornerBg = 'bg-emerald-100';
    if (tile.type === 'JAIL') cornerBg = 'bg-slate-200';
    if (tile.type === 'REST_HOUSE') cornerBg = 'bg-amber-100';
    if (tile.type === 'GO_TO_JAIL') cornerBg = 'bg-rose-100';

    return (
      <div
        onClick={onClick}
        className={`relative w-full h-full ${cornerBg} border border-vyapar-navy sm:border-2 p-1 flex flex-col justify-between items-center text-center cursor-pointer select-none transition-all ${
          isHighlighted ? 'ring-2 sm:ring-4 ring-yellow-400 z-20 scale-105 bg-yellow-100' : 'hover:scale-[1.02]'
        } shadow-xs overflow-hidden`}
      >
        <div className="font-black text-[9px] sm:text-[11px] leading-tight text-vyapar-navy uppercase tracking-tighter">
          {tile.name}
        </div>

        <div className="my-auto flex items-center justify-center">{renderIcon()}</div>

        {tile.type === 'START' && (
          <span className="text-[8px] sm:text-[9px] font-extrabold text-emerald-800">
            +{formatRupees(tile.salary)}
          </span>
        )}

        {/* Players on this corner tile */}
        {playersOnTile.length > 0 && (
          <div className="absolute inset-0 z-20 flex flex-wrap items-center justify-center gap-0.5 sm:gap-1 p-0.5 bg-vyapar-navy/15 backdrop-blur-[1px]">
            {playersOnTile.map((p) => (
              <PlayerToken
                key={p.id}
                token={p.token}
                color={p.color}
                isActive={p.id === activePlayerId}
                size="sm"
                name={p.name}
              />
            ))}
          </div>
        )}
      </div>
    );
  }

  // Regular Property, Railway, Utility, Tax or Card Tile
  return (
    <div
      onClick={onClick}
      className={`relative w-full h-full bg-white border border-vyapar-navy flex flex-col justify-between text-center cursor-pointer select-none transition-all ${
        isHighlighted ? 'ring-2 sm:ring-4 ring-yellow-400 z-20 scale-105 bg-yellow-50' : 'hover:bg-vyapar-skyblue/20 hover:z-10'
      } group overflow-hidden`}
    >
      {/* Color Group Band for Properties */}
      {groupConfig && (
        <div
          style={{ backgroundColor: groupConfig.color }}
          className="w-full h-2.5 sm:h-3.5 border-b border-vyapar-navy flex items-center justify-center shrink-0"
        >
          {/* Building indicators */}
          {property && (
            <div className="flex items-center gap-0.5">
              {property.hasHotel ? (
                <span className="text-[8px] sm:text-[9px] text-white font-black drop-shadow-xs">★ HOTEL</span>
              ) : (
                Array.from({ length: property.houses || 0 }).map((_, i) => (
                  <span key={i} className="w-1.5 h-1.5 bg-white rounded-full border border-vyapar-navy" />
                ))
              )}
            </div>
          )}
        </div>
      )}

      {/* Tile Content - Name is prominently displayed and never hidden */}
      <div className="p-0.5 sm:p-1 flex-1 flex flex-col justify-between items-center w-full min-h-0">
        {/* Name - Bold, readable, high contrast */}
        <div className="w-full font-black text-[8px] sm:text-[10px] leading-[1.1] text-vyapar-navy px-0.5 text-center break-words">
          {tile.name}
        </div>

        {/* Middle: Icon (Rail, Utility, Tax, Card) or Landmark Indicator */}
        <div className="my-auto flex items-center justify-center">
          {['RAILWAY', 'UTILITY', 'CHANCE', 'COMMUNITY', 'TAX'].includes(tile.type) ? (
            renderIcon()
          ) : (
            <div className="hidden sm:block text-[8px] font-bold text-slate-400 uppercase tracking-tighter">
              {tile.state || 'City'}
            </div>
          )}
        </div>

        {/* Price / Tax or Owner Tag */}
        <div className="w-full mt-auto">
          {tile.price > 0 && !owner && (
            <div className="text-[8px] sm:text-[10px] font-black text-slate-800">
              {formatRupees(tile.price)}
            </div>
          )}
          {tile.taxAmount > 0 && (
            <div className="text-[8px] sm:text-[9px] font-black text-red-600">
              Pay {formatRupees(tile.taxAmount)}
            </div>
          )}

          {/* Owner pill if owned */}
          {owner && (
            <div
              style={{ backgroundColor: owner.color }}
              className="px-0.5 py-0.2 rounded text-[7px] sm:text-[8px] font-black text-white truncate shadow-xs border border-vyapar-navy/40"
              title={`Owner: ${owner.name}`}
            >
              {owner.name.split(' ')[0]}
              {property?.isMortgaged ? ' (M)' : ''}
            </div>
          )}
        </div>
      </div>

      {/* Players on this tile */}
      {playersOnTile.length > 0 && (
        <div className="absolute inset-0 z-20 flex flex-wrap items-center justify-center gap-0.5 p-0.5 bg-vyapar-navy/20 backdrop-blur-[1px]">
          {playersOnTile.map((p) => (
            <PlayerToken
              key={p.id}
              token={p.token}
              color={p.color}
              isActive={p.id === activePlayerId}
              size="sm"
              name={p.name}
            />
          ))}
        </div>
      )}
    </div>
  );
}
