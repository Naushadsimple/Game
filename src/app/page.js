'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { loadActiveGameFromStorage } from '@/utils/localStorage';
import { useGameStore } from '@/store/gameStore';
import { Play, RotateCcw, FolderOpen, Coins, Landmark, ShieldCheck, Sparkles } from 'lucide-react';

export default function LandingPage() {
  const router = useRouter();
  const [hasSavedGame, setHasSavedGame] = useState(false);
  const resumeSavedGame = useGameStore((state) => state.resumeSavedGame);

  useEffect(() => {
    const active = loadActiveGameFromStorage();
    if (active && active.players && active.players.length > 0) {
      setHasSavedGame(true);
    }
  }, []);

  const handleResume = () => {
    const success = resumeSavedGame();
    if (success) {
      router.push('/game');
    }
  };

  return (
    <main className="min-h-screen flex flex-col justify-between p-4 sm:p-8 max-w-5xl mx-auto">
      {/* Top Bar */}
      <header className="flex items-center justify-between py-2 border-b-2 border-vyapar-navy/20">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-vyapar-yellow border-2 border-vyapar-navy shadow-brutal-sm flex items-center justify-center font-black text-sm">
            व्य
          </div>
          <span className="font-black text-lg tracking-tight text-vyapar-navy">
            VYAPAR
          </span>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/saved-games">
            <Button variant="secondary" size="sm" icon={FolderOpen}>
              Saved Games
            </Button>
          </Link>
        </div>
      </header>

      {/* Hero Section */}
      <section className="my-auto py-8 sm:py-12 flex flex-col items-center text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-vyapar-yellow border-2 border-vyapar-navy shadow-brutal-sm text-xs font-black text-vyapar-navy uppercase tracking-wider mb-4 animate-bounce">
          <Sparkles className="w-3.5 h-3.5 text-amber-700" />
          <span>India&apos;s Iconic Property Trading Board Game</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black text-vyapar-navy tracking-tight leading-tight max-w-2xl">
          Buy, Trade & Build Empires Across India.
        </h1>

        <p className="mt-4 text-sm sm:text-base text-slate-600 max-w-xl font-medium leading-relaxed">
          Roll the dice, tour the metropolitan cities from Mumbai to Guwahati, collect visiting rent, construct grand hotels, and trade your way to becoming the supreme Vyapar Tycoon!
        </p>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-4 w-full max-w-md">
          <Link href="/setup" className="w-full sm:w-auto flex-1">
            <Button variant="primary" size="lg" className="w-full text-base py-4" icon={Play}>
              Start New Game
            </Button>
          </Link>

          {hasSavedGame && (
            <Button
              variant="yellow"
              size="lg"
              className="w-full sm:w-auto flex-1 text-base py-4"
              onClick={handleResume}
              icon={RotateCcw}
            >
              Resume Game
            </Button>
          )}
        </div>
      </section>

      {/* Feature Highlights Grid */}
      <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-6">
        {/* Mode A & B */}
        <div className="p-4 rounded-brutal bg-white border-2 border-vyapar-navy shadow-brutal">
          <div className="w-9 h-9 rounded-lg bg-sky-100 border-2 border-vyapar-navy shadow-brutal-sm flex items-center justify-center mb-2.5">
            <Coins className="w-5 h-5 text-sky-700" />
          </div>
          <h3 className="font-black text-sm text-vyapar-navy">
            Dual Money Modes
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Choose between <strong>Virtual Cash</strong> for instant automatic transfers or <strong>Physical Cash</strong> with authentic Indian denominations (₹10 to ₹1,000 notes).
          </p>
        </div>

        {/* Banking */}
        <div className="p-4 rounded-brutal bg-white border-2 border-vyapar-navy shadow-brutal">
          <div className="w-9 h-9 rounded-lg bg-emerald-100 border-2 border-vyapar-navy shadow-brutal-sm flex items-center justify-center mb-2.5">
            <Landmark className="w-5 h-5 text-emerald-700" />
          </div>
          <h3 className="font-black text-sm text-vyapar-navy">
            Central Bank Ledger
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Every single rupee is tracked. The Central Bank manages house and hotel inventories, mortgaging, and immutable transaction audit trails.
          </p>
        </div>

        {/* Offline & AI */}
        <div className="p-4 rounded-brutal bg-white border-2 border-vyapar-navy shadow-brutal">
          <div className="w-9 h-9 rounded-lg bg-amber-100 border-2 border-vyapar-navy shadow-brutal-sm flex items-center justify-center mb-2.5">
            <ShieldCheck className="w-5 h-5 text-amber-700" />
          </div>
          <h3 className="font-black text-sm text-vyapar-navy">
            Smart AI & 100% Offline
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            Play against 2 to 6 human friends or smart AI opponents with configurable difficulty (Easy, Medium, Hard). Works fully offline.
          </p>
        </div>
      </section>

      {/* Footer */}
      <footer className="text-center py-4 border-t border-slate-200 text-xs font-bold text-slate-500">
        Vyapar Property Trading Game • Designed with Neo-Brutalism & Modern Minimalism
      </footer>
    </main>
  );
}
