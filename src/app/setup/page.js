'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { GAME_RULES } from '@/data/gameRules';
import { useGameStore } from '@/store/gameStore';
import { formatRupees } from '@/utils/formatters';
import { ArrowLeft, Users, Coins, Bot, User, Play, Sparkles, Compass, CheckCircle2 } from 'lucide-react';

const INITIAL_NAMES = ['Kunal', 'Pooja', 'Vikram', 'Ananya', 'Rohan', 'Meera'];

export default function GameSetupPage() {
  const router = useRouter();
  const initNewGame = useGameStore((state) => state.initNewGame);

  const [gameName, setGameName] = useState('Vyapar Maha Utsav');
  const [playerCount, setPlayerCount] = useState(4);
  const [moneyMode, setMoneyMode] = useState('VIRTUAL'); // 'VIRTUAL' or 'PHYSICAL'
  const [startingCash, setStartingCash] = useState(15000);
  const [customCashInput, setCustomCashInput] = useState('15000');
  const [isCustomCash, setIsCustomCash] = useState(false);
  const [firstRoundTour, setFirstRoundTour] = useState(false);
  const [maxRounds, setMaxRounds] = useState(0); // 0 = unlimited

  // Players list state
  const [players, setPlayers] = useState(
    Array.from({ length: 6 }).map((_, idx) => ({
      id: `p_${idx + 1}`,
      name: INITIAL_NAMES[idx],
      token: GAME_RULES.TOKENS[idx % GAME_RULES.TOKENS.length].id,
      color: GAME_RULES.PLAYER_COLORS[idx % GAME_RULES.PLAYER_COLORS.length].hex,
      isAi: idx > 0,
      aiDifficulty: 'MEDIUM',
    }))
  );

  const updatePlayer = (index, field, value) => {
    setPlayers((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  const handleCashPreset = (amount) => {
    setIsCustomCash(false);
    setStartingCash(amount);
    setCustomCashInput(String(amount));
  };

  const handleCustomCashChange = (val) => {
    setIsCustomCash(true);
    setCustomCashInput(val);
    const num = parseInt(val, 10);
    if (!isNaN(num) && num > 0) {
      setStartingCash(num);
    }
  };

  const handleStartGame = () => {
    const finalStartingCash = isCustomCash
      ? Math.max(1000, parseInt(customCashInput, 10) || 15000)
      : startingCash;

    const selectedPlayers = players.slice(0, playerCount);
    initNewGame({
      gameName,
      moneyMode,
      firstRoundTour,
      startingCash: finalStartingCash,
      maxRounds: Number(maxRounds),
      players: selectedPlayers,
    });
    router.push('/game');
  };

  return (
    <main className="min-h-screen p-3 sm:p-8 max-w-4xl mx-auto text-vyapar-navy">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-3 border-b-2 border-vyapar-navy/20 mb-4 sm:mb-6">
        <Link href="/">
          <Button variant="secondary" size="sm" icon={ArrowLeft}>
            Back
          </Button>
        </Link>

        <h1 className="text-lg sm:text-2xl font-black tracking-tight text-vyapar-navy text-center">
          Vyapar Game Setup
        </h1>

        <div className="w-12 sm:w-16" />
      </div>

      <div className="space-y-4 sm:space-y-6">
        {/* Game Rules & Mode Card */}
        <div className="p-4 sm:p-5 rounded-brutal-lg bg-white border-2 sm:border-3 border-vyapar-navy shadow-brutal">
          <h2 className="text-xs sm:text-sm font-black uppercase text-slate-500 tracking-wider mb-3 flex items-center gap-1.5">
            <Coins className="w-4 h-4 text-emerald-600" />
            1. Game Rules & Economy
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            {/* Game Name */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Game Session Name
              </label>
              <input
                type="text"
                value={gameName}
                onChange={(e) => setGameName(e.target.value)}
                className="w-full text-xs font-bold p-2.5 rounded-lg border-2 border-vyapar-navy bg-slate-50 focus:bg-white"
                placeholder="e.g. Diwali Vyapar Championship"
              />
            </div>

            {/* Money Mode */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Currency Management Mode
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setMoneyMode('VIRTUAL')}
                  className={`p-2.5 rounded-lg border-2 border-vyapar-navy text-xs font-black transition-all ${
                    moneyMode === 'VIRTUAL'
                      ? 'bg-vyapar-blue text-vyapar-navy shadow-brutal-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Virtual Wallet
                </button>
                <button
                  type="button"
                  onClick={() => setMoneyMode('PHYSICAL')}
                  className={`p-2.5 rounded-lg border-2 border-vyapar-navy text-xs font-black transition-all ${
                    moneyMode === 'PHYSICAL'
                      ? 'bg-vyapar-yellow text-vyapar-navy shadow-brutal-sm'
                      : 'bg-slate-50 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  Physical Cash
                </button>
              </div>
            </div>

            {/* CUSTOM STARTING MONEY OPTION */}
            <div className="sm:col-span-2 p-3 rounded-brutal bg-slate-50 border-2 border-vyapar-navy/40">
              <label className="block text-xs font-black text-slate-800 mb-1.5 flex items-center justify-between">
                <span>Starting Capital per Player</span>
                <span className="text-emerald-700 font-extrabold text-sm">
                  {formatRupees(isCustomCash ? parseInt(customCashInput, 10) || 0 : startingCash)}
                </span>
              </label>

              {/* Preset buttons */}
              <div className="flex flex-wrap gap-2 mb-2">
                {[10000, 15000, 25000, 50000].map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleCashPreset(amt)}
                    className={`px-3 py-1.5 rounded-lg border border-vyapar-navy text-xs font-black transition-all ${
                      !isCustomCash && startingCash === amt
                        ? 'bg-emerald-600 text-white shadow-brutal-sm'
                        : 'bg-white text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {formatRupees(amt)}
                  </button>
                ))}
                <button
                  type="button"
                  onClick={() => setIsCustomCash(true)}
                  className={`px-3 py-1.5 rounded-lg border border-vyapar-navy text-xs font-black transition-all ${
                    isCustomCash
                      ? 'bg-yellow-400 text-vyapar-navy shadow-brutal-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  Custom Amount ✏️
                </button>
              </div>

              {/* Custom Money Input */}
              {isCustomCash && (
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-sm font-black text-slate-700">₹</span>
                  <input
                    type="number"
                    min="1000"
                    step="500"
                    placeholder="Enter custom starting cash..."
                    value={customCashInput}
                    onChange={(e) => handleCustomCashChange(e.target.value)}
                    className="w-full text-xs font-black p-2 rounded-lg border-2 border-vyapar-navy bg-white focus:outline-none"
                  />
                </div>
              )}
            </div>

            {/* FIRST ROUND TOUR OPTION (पहला चक्कर) */}
            <div className="sm:col-span-2 p-3 rounded-brutal bg-amber-50 border-2 border-amber-300">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-start gap-2">
                  <Compass className="w-5 h-5 text-amber-700 mt-0.5 shrink-0" />
                  <div>
                    <h4 className="font-black text-xs text-amber-950 uppercase tracking-tight">
                      First Round Tour Option (पहला चक्कर / Warm-up Lap)
                    </h4>
                    <p className="text-[11px] text-amber-900 mt-0.5 leading-relaxed">
                      Players must complete 1 full tour around the board and pass START before being allowed to purchase properties. In Round 1, players only explore and tour the cities without buying!
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setFirstRoundTour(!firstRoundTour)}
                  className={`px-3 py-1.5 rounded-lg border-2 border-vyapar-navy text-xs font-black transition-all shrink-0 ${
                    firstRoundTour
                      ? 'bg-emerald-500 text-white shadow-brutal-sm'
                      : 'bg-white text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  {firstRoundTour ? '✓ Active' : 'Off'}
                </button>
              </div>
            </div>

            {/* Max Rounds */}
            <div>
              <label className="block text-xs font-black text-slate-700 mb-1">
                Game Duration / Rounds
              </label>
              <select
                value={maxRounds}
                onChange={(e) => setMaxRounds(Number(e.target.value))}
                className="w-full text-xs font-bold p-2.5 rounded-lg border-2 border-vyapar-navy bg-white"
              >
                <option value={0}>Unlimited (Play till Bankruptcy)</option>
                <option value={15}>15 Rounds (Quick Match)</option>
                <option value={25}>25 Rounds (Medium Match)</option>
                <option value={40}>40 Rounds (Extended Championship)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Players Configuration Card */}
        <div className="p-4 sm:p-5 rounded-brutal-lg bg-white border-2 sm:border-3 border-vyapar-navy shadow-brutal">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <h2 className="text-xs sm:text-sm font-black uppercase text-slate-500 tracking-wider flex items-center gap-1.5">
              <Users className="w-4 h-4 text-sky-600" />
              2. Merchants Roster ({playerCount} Players)
            </h2>

            {/* Player Count Selector */}
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-bold text-slate-600">Total:</span>
              {[2, 3, 4, 5, 6].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setPlayerCount(count)}
                  className={`w-7 h-7 rounded-lg border-2 border-vyapar-navy text-xs font-black transition-all ${
                    playerCount === count
                      ? 'bg-vyapar-navy text-white shadow-brutal-sm'
                      : 'bg-white text-vyapar-navy hover:bg-slate-100'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Player Cards List */}
          <div className="space-y-2.5">
            {players.slice(0, playerCount).map((p, idx) => (
              <div
                key={p.id}
                className="p-2.5 sm:p-3 rounded-brutal border-2 border-vyapar-navy bg-slate-50 flex flex-wrap items-center justify-between gap-2 shadow-xs"
              >
                {/* Name & Token preview */}
                <div className="flex items-center gap-2 min-w-[170px]">
                  <div
                    style={{ backgroundColor: p.color }}
                    className="w-8 h-8 rounded-full border-2 border-vyapar-navy shadow-brutal-sm flex items-center justify-center text-sm shrink-0"
                  >
                    {GAME_RULES.TOKENS.find((t) => t.id === p.token)?.emoji || '🚗'}
                  </div>
                  <div>
                    <input
                      type="text"
                      value={p.name}
                      onChange={(e) => updatePlayer(idx, 'name', e.target.value)}
                      className="text-xs font-black p-1 rounded border border-vyapar-navy/40 bg-white w-28 sm:w-36"
                      placeholder={`Player ${idx + 1}`}
                    />
                  </div>
                </div>

                {/* Token Selector */}
                <div className="flex items-center gap-1">
                  {GAME_RULES.TOKENS.map((token) => (
                    <button
                      key={token.id}
                      type="button"
                      onClick={() => updatePlayer(idx, 'token', token.id)}
                      className={`w-6 h-6 sm:w-7 sm:h-7 rounded border border-vyapar-navy text-xs flex items-center justify-center transition-transform ${
                        p.token === token.id
                          ? 'bg-vyapar-yellow shadow-brutal-sm scale-110'
                          : 'bg-white hover:bg-slate-100'
                      }`}
                      title={token.name}
                    >
                      {token.emoji}
                    </button>
                  ))}
                </div>

                {/* Color Selector */}
                <div className="flex items-center gap-1">
                  {GAME_RULES.PLAYER_COLORS.map((color) => (
                    <button
                      key={color.id}
                      type="button"
                      onClick={() => updatePlayer(idx, 'color', color.hex)}
                      style={{ backgroundColor: color.hex }}
                      className={`w-4 h-4 sm:w-5 sm:h-5 rounded-full border-2 border-vyapar-navy transition-transform ${
                        p.color === color.hex ? 'scale-125 shadow-brutal-sm ring-1 ring-yellow-400' : 'opacity-70 hover:opacity-100'
                      }`}
                      title={color.name}
                    />
                  ))}
                </div>

                {/* Human vs AI Selector */}
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => updatePlayer(idx, 'isAi', !p.isAi)}
                    className={`px-2 py-1 rounded-lg border border-vyapar-navy text-xs font-black flex items-center gap-1 transition-colors ${
                      p.isAi
                        ? 'bg-amber-100 text-amber-900 border-amber-400'
                        : 'bg-emerald-100 text-emerald-900 border-emerald-400'
                    }`}
                  >
                    {p.isAi ? (
                      <>
                        <Bot className="w-3 h-3" /> AI
                      </>
                    ) : (
                      <>
                        <User className="w-3 h-3" /> Human
                      </>
                    )}
                  </button>

                  {p.isAi && (
                    <select
                      value={p.aiDifficulty}
                      onChange={(e) => updatePlayer(idx, 'aiDifficulty', e.target.value)}
                      className="text-[10px] font-bold p-1 rounded border border-vyapar-navy bg-white"
                    >
                      <option value="EASY">Easy</option>
                      <option value="MEDIUM">Med</option>
                      <option value="HARD">Hard</option>
                    </select>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Start Game Action */}
        <div className="flex justify-end pt-2 pb-4">
          <Button
            variant="success"
            size="lg"
            className="w-full sm:w-auto px-8 text-base py-3 sm:py-4 shadow-brutal-lg"
            onClick={handleStartGame}
            icon={Play}
          >
            Start Vyapar Game Now
          </Button>
        </div>
      </div>
    </main>
  );
}
