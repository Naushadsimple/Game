import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { GAME_RULES } from '../../data/gameRules';
import { formatRupees } from '../../utils/formatters';
import { PropertyLandmarkImage } from '../../utils/cityImages';
import { useGameStore } from '../../store/gameStore';
import { Home, Hotel, CheckCircle2, XCircle, Building2, Wallet } from 'lucide-react';

export function PropertyTicketModal({ propertyId, isOpen, onClose }) {
  const store = useGameStore();
  const property = store.properties[propertyId];

  if (!property) return null;

  const groupConfig = property.group ? GAME_RULES.COLOR_GROUPS[property.group] : null;
  const owner = property.ownerId ? store.players.find((p) => p.id === property.ownerId) : null;
  const currentPlayer = store.players[store.currentPlayerIndex];
  const isCurrentPlayerOwner = owner && currentPlayer && owner.id === currentPlayer.id;

  const isBuyPrompt =
    store.pendingAction?.type === 'BUY_OR_AUCTION' &&
    store.pendingAction?.propertyId === propertyId;

  const canAfford = currentPlayer ? currentPlayer.wallet >= property.price : false;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="max-w-md"
      title={isBuyPrompt ? "Acquire Property Deed" : "Title Deed & Visiting Rent"}
    >
      <div className="flex flex-col">
        {/* TOP ALERT: If this is an active purchase prompt, show prominent buy banner */}
        {isBuyPrompt && (
          <div className="mb-3 p-2.5 rounded-brutal bg-emerald-50 border-2 border-emerald-400 flex items-center justify-between">
            <div>
              <span className="text-[10px] font-black uppercase text-emerald-800 tracking-wider block">
                FOR SALE • UNOWNED
              </span>
              <span className="text-sm font-black text-emerald-950">
                Price: {formatRupees(property.price)}
              </span>
            </div>
            <div className="text-right">
              <span className="text-[10px] font-bold text-slate-500 block">Your Balance:</span>
              <span className={`text-xs font-black ${canAfford ? 'text-emerald-700' : 'text-red-600'}`}>
                {formatRupees(currentPlayer?.wallet || 0)}
              </span>
            </div>
          </div>
        )}

        {/* Title Deed Card Ticket Container */}
        <div className="w-full bg-white rounded-brutal border-2 border-vyapar-navy shadow-brutal overflow-hidden flex flex-col">
          {/* Header Banner */}
          <div
            style={{ backgroundColor: groupConfig ? groupConfig.color : '#334155' }}
            className="w-full px-3 py-2 text-center text-white border-b-2 border-vyapar-navy"
          >
            <div className="text-[9px] font-black uppercase tracking-widest opacity-90">
              Title Deed / Malkiyat Patra
            </div>
            <div className="text-lg sm:text-xl font-black tracking-tight drop-shadow-sm uppercase">
              {property.name}
            </div>
            {property.landmark && (
              <div className="text-[10px] sm:text-xs font-semibold opacity-90">
                {property.landmark}
              </div>
            )}
          </div>

          {/* Proper Landmark Illustration Image (compact height for mobile) */}
          <div className="w-full h-24 sm:h-28 bg-slate-100 border-b border-vyapar-navy overflow-hidden relative">
            <PropertyLandmarkImage propertyId={property.id} className="w-full h-full object-cover" />
            {property.isMortgaged && (
              <div className="absolute inset-0 bg-red-950/70 backdrop-blur-xs flex items-center justify-center">
                <span className="px-3 py-1 rounded border-2 border-white bg-red-600 text-white font-black text-xs uppercase tracking-widest shadow-brutal">
                  MORTGAGED
                </span>
              </div>
            )}
          </div>

          {/* Visiting Rent Schedule Body */}
          <div className="p-3 flex flex-col gap-1.5 text-xs text-vyapar-navy">
            {property.type === 'PROPERTY' && (
              <>
                <div className="flex items-center justify-between py-1 border-b border-slate-200 font-bold">
                  <span>RENT (Visiting Site Only):</span>
                  <span className="text-sm font-black">{formatRupees(property.baseRent)}</span>
                </div>

                <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-[11px] text-slate-700">
                  <div className="flex justify-between">
                    <span>1 House:</span>
                    <span className="font-bold">{formatRupees(property.rentWith1)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>2 Houses:</span>
                    <span className="font-bold">{formatRupees(property.rentWith2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>3 Houses:</span>
                    <span className="font-bold">{formatRupees(property.rentWith3)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>4 Houses:</span>
                    <span className="font-bold">{formatRupees(property.rentWith4)}</span>
                  </div>
                </div>

                <div className="flex items-center justify-between font-extrabold text-red-600 pt-1 border-t border-slate-100">
                  <span className="flex items-center gap-1">
                    <Hotel className="w-3.5 h-3.5 text-red-600" />
                    <span>With Grand Hotel:</span>
                  </span>
                  <span className="text-sm font-black">{formatRupees(property.rentWithHotel)}</span>
                </div>

                {/* Construction & Mortgage Rates */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-200 text-[10px]">
                  <div>
                    <span className="text-slate-500">House Cost: </span>
                    <span className="font-bold text-slate-800">{formatRupees(property.houseCost)}</span>
                  </div>
                  <div>
                    <span className="text-slate-500">Mortgage: </span>
                    <span className="font-bold text-slate-800">{formatRupees(property.mortgageValue)}</span>
                  </div>
                </div>
              </>
            )}

            {property.type === 'RAILWAY' && (
              <div className="space-y-1 text-xs">
                <div className="font-bold text-slate-800 pb-0.5 border-b border-slate-200">
                  Railway Transport Rent Tariff:
                </div>
                <div className="grid grid-cols-2 gap-1 text-[11px]">
                  <div className="flex justify-between"><span>1 Station:</span><span className="font-bold">{formatRupees(250)}</span></div>
                  <div className="flex justify-between"><span>2 Stations:</span><span className="font-bold">{formatRupees(500)}</span></div>
                  <div className="flex justify-between"><span>3 Stations:</span><span className="font-bold">{formatRupees(1000)}</span></div>
                  <div className="flex justify-between font-black text-emerald-700"><span>4 Stations:</span><span>{formatRupees(2000)}</span></div>
                </div>
              </div>
            )}

            {property.type === 'UTILITY' && (
              <div className="p-2 rounded bg-amber-50 border border-amber-200 text-[11px] text-amber-950">
                <p>1 Utility owned: <strong>4× dice roll</strong></p>
                <p>Both Utilities owned: <strong>10× dice roll</strong></p>
              </div>
            )}

            {/* Current Ownership Status */}
            <div className="mt-1 pt-1 border-t border-slate-200 flex items-center justify-between text-[11px]">
              <span className="text-slate-500 font-bold">Status:</span>
              {owner ? (
                <div className="flex items-center gap-1.5 font-black">
                  <span style={{ backgroundColor: owner.color }} className="w-2.5 h-2.5 rounded-full border border-vyapar-navy" />
                  <span>{owner.name}</span>
                </div>
              ) : (
                <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 font-black text-[10px]">
                  Available For Sale
                </span>
              )}
            </div>
          </div>
        </div>

        {/* ALWAYS-ON-SCREEN ACTION BUTTONS (NO SCROLLING NEEDED) */}
        <div className="sticky bottom-0 z-30 pt-3 mt-3 bg-white border-t-2 border-vyapar-navy/15 flex flex-col gap-2">
          {isBuyPrompt && (
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={canAfford ? "success" : "secondary"}
                size="md"
                disabled={!canAfford}
                onClick={() => store.buyProperty(property.id, currentPlayer.id)}
                icon={CheckCircle2}
                className="w-full py-3"
              >
                {canAfford ? `Buy (${formatRupees(property.price)})` : 'Cannot Afford'}
              </Button>

              <Button
                variant="secondary"
                size="md"
                onClick={() => store.skipBuyProperty(property.id)}
                icon={XCircle}
                className="w-full py-3"
              >
                Skip / Pass
              </Button>
            </div>
          )}

          {isCurrentPlayerOwner && !isBuyPrompt && (
            <div className="grid grid-cols-2 gap-2">
              {property.type === 'PROPERTY' && !property.isMortgaged && (
                <Button
                  variant="yellow"
                  size="sm"
                  onClick={() => store.buildHouseOrHotel(property.id, currentPlayer.id)}
                  icon={Building2}
                >
                  Build ({formatRupees(property.houses === 4 ? property.hotelCost : property.houseCost)})
                </Button>
              )}

              {!property.isMortgaged ? (
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => store.mortgageProperty(property.id, currentPlayer.id)}
                >
                  Mortgage (+{formatRupees(property.mortgageValue)})
                </Button>
              ) : (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => store.unmortgageProperty(property.id, currentPlayer.id)}
                >
                  Unmortgage ({formatRupees(Math.round(property.mortgageValue * 1.1))})
                </Button>
              )}
            </div>
          )}

          <Button variant="secondary" size="sm" onClick={onClose} className="w-full">
            Close Deed
          </Button>
        </div>
      </div>
    </Modal>
  );
}
