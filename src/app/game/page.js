'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { GameBoard } from '@/components/board/GameBoard';
import { PlayerCard } from '@/components/players/PlayerCard';
import { PlayerPortfolioModal } from '@/components/players/PlayerPortfolioModal';
import { PropertyTicketModal } from '@/components/properties/PropertyTicketModal';
import { RentModal } from '@/components/properties/RentModal';
import { CardModal } from '@/components/cards/CardModal';
import { JailModal } from '@/components/jail/JailModal';
import { TradeModal } from '@/components/trading/TradeModal';
import { BankDashboard } from '@/components/banking/BankDashboard';
import { PhysicalCashManager } from '@/components/banking/PhysicalCashManager';
import { WinnerModal } from '@/components/winner/WinnerModal';
import { Button } from '@/components/ui/Button';
import { formatRupees } from '@/utils/formatters';
import {
  Landmark,
  Coins,
  ArrowLeftRight,
  Volume2,
  VolumeX,
  Compass,
} from 'lucide-react';

export default function GamePage() {
  const router = useRouter();
  const store = useGameStore();

  const [selectedPortfolioPlayerId, setSelectedPortfolioPlayerId] = useState(null);
  const [inspectedTileId, setInspectedTileId] = useState(null);

  // Resume or redirect if no active game
  useEffect(() => {
    if (!store.players || store.players.length === 0) {
      const resumed = store.resumeSavedGame();
      if (!resumed) {
        router.push('/setup');
      }
    }
  }, [store, router]);

  if (!store.players || store.players.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-vyapar-softgrey text-vyapar-navy font-black text-sm">
        Loading Vyapar Session...
      </div>
    );
  }

  const currentPlayer = store.players[store.currentPlayerIndex];
  const isPhysicalMode = store.moneyMode === 'PHYSICAL';

  // Tile click handler from board
  const handleTileClick = (tileId) => {
    if (store.properties[tileId]) {
      setInspectedTileId(tileId);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F3F7FA] text-vyapar-navy overflow-x-hidden">
      {/* Top Header Bar - Optimized for both Android Mobile and Desktop */}
      <header className="px-3 sm:px-6 py-2 bg-white border-b-2 border-vyapar-navy shadow-xs flex items-center justify-between gap-2 sticky top-0 z-30">
        {/* Left: Branding & Round */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link href="/">
            <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-vyapar-yellow border-2 border-vyapar-navy shadow-brutal-sm flex items-center justify-center font-black text-xs sm:text-sm cursor-pointer">
              व्य
            </div>
          </Link>

          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-black text-xs sm:text-base text-vyapar-navy tracking-tight truncate max-w-[120px] sm:max-w-xs">
                {store.gameName}
              </span>
              <span
                className={`px-1.5 py-0.2 rounded text-[8px] sm:text-[9px] font-black uppercase border border-vyapar-navy/40 ${
                  isPhysicalMode ? 'bg-amber-100 text-amber-900' : 'bg-sky-100 text-sky-900'
                }`}
              >
                {isPhysicalMode ? 'Cash' : 'Wallet'}
              </span>
            </div>
            <div className="text-[10px] sm:text-[11px] font-bold text-slate-500">
              Round {store.round} {store.maxRounds > 0 ? `/ ${store.maxRounds}` : ''}
              {store.firstRoundTour && ' • Tour Active'}
            </div>
          </div>
        </div>

        {/* Right: Quick Action Hub */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* Central Bank */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => store.setActiveModal('BANK')}
            icon={Landmark}
            className="text-[11px] sm:text-xs py-1 px-2 sm:px-3"
          >
            Bank
          </Button>

          {/* Physical Cash Manager (if physical mode) */}
          {isPhysicalMode && (
            <Button
              variant="yellow"
              size="sm"
              onClick={() => store.setActiveModal('PHYSICAL_CASH')}
              icon={Coins}
              className="text-[11px] sm:text-xs py-1 px-2 sm:px-3"
            >
              Vault
            </Button>
          )}

          {/* Trade Button */}
          <Button
            variant="secondary"
            size="sm"
            onClick={() => store.setActiveModal('TRADE')}
            icon={ArrowLeftRight}
            className="text-[11px] sm:text-xs py-1 px-2 sm:px-3"
          >
            Trade
          </Button>

          {/* Sound Toggle */}
          <button
            onClick={() => store.setSoundMuted(!store.soundMuted)}
            className="p-1.5 sm:p-2 rounded-lg border-2 border-vyapar-navy bg-white hover:bg-slate-100 text-vyapar-navy shadow-brutal-sm transition-transform active:translate-x-0.5 active:translate-y-0.5"
            title={store.soundMuted ? 'Unmute Sound' : 'Mute Sound'}
          >
            {store.soundMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-red-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-700" />
            )}
          </button>
        </div>
      </header>

      {/* Main Game Arena */}
      <main className="flex-1 p-2 sm:p-4 max-w-[1550px] mx-auto w-full grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-start">
        {/* Left Column (3 cols on desktop): Active Player Focus */}
        <aside className="lg:col-span-3 space-y-3 order-2 lg:order-1">
          {/* Active Turn Card with high-impact "Abhi Meri Bari Hai" styling */}
          <div className="p-3 sm:p-4 rounded-brutal-lg bg-white border-2 sm:border-3 border-vyapar-navy shadow-brutal">
            <div className="text-[10px] font-black uppercase text-slate-500 tracking-wider mb-2 flex items-center justify-between">
              <span>CURRENT ACTIVE MERCHANT</span>
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <PlayerCard
              player={currentPlayer}
              isActive={true}
              properties={store.properties}
              onOpenPortfolio={() => setSelectedPortfolioPlayerId(currentPlayer.id)}
            />

            {/* Quick Action Hint */}
            <div className="mt-2.5 p-2 rounded-lg bg-vyapar-skyblue/30 border border-vyapar-navy/20 text-[11px] font-bold text-slate-700 leading-tight">
              {!store.hasRolled
                ? currentPlayer?.isAi
                  ? 'Computer merchant is calculating optimal moves...'
                  : 'Roll the dice in the board center to make your move!'
                : store.isMoving
                ? 'Moving token across the Indian cities...'
                : 'Turn complete! You may build or pass turn.'}
            </div>

            {/* First round tour banner if active */}
            {store.firstRoundTour && !currentPlayer?.hasCompletedFirstTour && (
              <div className="mt-2 p-2 rounded-lg bg-amber-50 border border-amber-300 text-[10px] font-black text-amber-900 flex items-center gap-1.5">
                <Compass className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                <span>1st Round Warm-up Tour: Cross START to unlock buying!</span>
              </div>
            )}
          </div>
        </aside>

        {/* Center Column (6 cols on desktop): The 40-Tile Responsive Board */}
        <section className="lg:col-span-6 flex flex-col items-center justify-center order-1 lg:order-2 w-full">
          <GameBoard onTileClick={handleTileClick} />
        </section>

        {/* Right Column (3 cols on desktop): All Other Merchants */}
        <aside className="lg:col-span-3 space-y-3 order-3">
          <div className="p-3 sm:p-4 rounded-brutal-lg bg-white border-2 sm:border-3 border-vyapar-navy shadow-brutal flex flex-col">
            <div className="text-[10px] sm:text-xs font-black uppercase tracking-wider text-slate-600 mb-2.5 pb-1.5 border-b border-slate-200 flex items-center justify-between">
              <span>MERCHANTS DIRECTORY</span>
              <span>{store.players.filter((p) => !p.isBankrupt).length} Active</span>
            </div>

            <div className="space-y-2">
              {store.players.map((p) => (
                <PlayerCard
                  key={p.id}
                  player={p}
                  isActive={p.id === currentPlayer?.id}
                  properties={store.properties}
                  onOpenPortfolio={() => setSelectedPortfolioPlayerId(p.id)}
                />
              ))}
            </div>
          </div>
        </aside>
      </main>

      {/* ============================================================ */}
      {/* ALL MODALS INTEGRATED */}
      {/* ============================================================ */}

      {/* 1. Property Deed & Rent Modal (When clicking tile or buy prompt) */}
      <PropertyTicketModal
        propertyId={store.pendingAction?.propertyId || inspectedTileId}
        isOpen={
          store.activeModal === 'BUY_PROPERTY' || inspectedTileId !== null
        }
        onClose={() => {
          setInspectedTileId(null);
          if (store.activeModal === 'BUY_PROPERTY') {
            store.closeModal();
          }
        }}
      />

      {/* 2. Visiting Rent Modal */}
      <RentModal
        isOpen={store.activeModal === 'RENT'}
        onClose={() => store.closeModal()}
      />

      {/* 3. Chance & Community Chest Card Modal */}
      <CardModal
        isOpen={store.activeModal === 'CARD'}
        onClose={() => store.closeModal()}
      />

      {/* 4. Central Jail Lockup Modal */}
      <JailModal
        isOpen={store.activeModal === 'JAIL' || (currentPlayer?.isInJail && !store.hasRolled)}
        onClose={() => store.closeModal()}
      />

      {/* 5. Player Trade Modal */}
      <TradeModal
        isOpen={store.activeModal === 'TRADE'}
        onClose={() => store.closeModal()}
      />

      {/* 6. Bank Dashboard & Ledger */}
      <BankDashboard
        isOpen={store.activeModal === 'BANK'}
        onClose={() => store.closeModal()}
      />

      {/* 7. Physical Cash Denominations Manager */}
      <PhysicalCashManager
        isOpen={store.activeModal === 'PHYSICAL_CASH'}
        onClose={() => store.closeModal()}
      />

      {/* 8. Player Portfolio Modal (Deeds list & building controls) */}
      <PlayerPortfolioModal
        playerId={selectedPortfolioPlayerId}
        isOpen={selectedPortfolioPlayerId !== null}
        onClose={() => setSelectedPortfolioPlayerId(null)}
      />

      {/* 9. Grand Winner Celebration Modal */}
      <WinnerModal
        isOpen={store.activeModal === 'WINNER' || store.status === 'GAME_OVER'}
        onClose={() => store.closeModal()}
      />
    </div>
  );
}
