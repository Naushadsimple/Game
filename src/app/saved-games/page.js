'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import {
  getSavedGamesList,
  loadGameSlot,
  saveGameSlot,
  deleteGameSlot,
  loadActiveGameFromStorage,
} from '@/utils/localStorage';
import { useGameStore } from '@/store/gameStore';
import { ArrowLeft, Save, Trash2, Play, FolderOpen, Clock } from 'lucide-react';

export function SavedGamesPage() {
  const router = useRouter();
  const [savedGames, setSavedGames] = useState([]);
  const [newSaveName, setNewSaveName] = useState('');
  const activeGameState = useGameStore((state) => state);

  const refreshList = () => {
    setSavedGames(getSavedGamesList());
  };

  useEffect(() => {
    refreshList();
  }, []);

  const handleSaveCurrentState = () => {
    if (!activeGameState.players || activeGameState.players.length === 0) {
      alert('No active game to save!');
      return;
    }
    const name = newSaveName.trim() || `Vyapar Match ${savedGames.length + 1}`;
    saveGameSlot(null, name, activeGameState);
    setNewSaveName('');
    refreshList();
  };

  const handleLoadGame = (id) => {
    const data = loadGameSlot(id);
    if (data) {
      useGameStore.setState({ ...data, status: 'PLAYING' });
      router.push('/game');
    }
  };

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this saved game?')) {
      deleteGameSlot(id);
      refreshList();
    }
  };

  return (
    <main className="min-h-screen p-4 sm:p-8 max-w-4xl mx-auto text-vyapar-navy">
      {/* Top Bar */}
      <div className="flex items-center justify-between pb-4 border-b-2 border-vyapar-navy/20 mb-6">
        <Link href="/">
          <Button variant="secondary" size="sm" icon={ArrowLeft}>
            Back to Home
          </Button>
        </Link>

        <h1 className="text-xl sm:text-2xl font-black tracking-tight text-vyapar-navy">
          Saved Games Archive
        </h1>

        <div className="w-16" />
      </div>

      <div className="space-y-6">
        {/* Save Current Active Game Card */}
        {activeGameState.players && activeGameState.players.length > 0 && (
          <div className="p-4 rounded-brutal bg-white border-3 border-vyapar-navy shadow-brutal flex flex-wrap items-center justify-between gap-3">
            <div>
              <h3 className="font-black text-sm text-vyapar-navy">
                Save Active Game Session
              </h3>
              <p className="text-xs text-slate-500">
                Snapshot your current match ({activeGameState.players.length} players, Round {activeGameState.round}) into a named slot.
              </p>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="text"
                placeholder="Game title..."
                value={newSaveName}
                onChange={(e) => setNewSaveName(e.target.value)}
                className="text-xs font-bold px-3 py-2 rounded-lg border-2 border-vyapar-navy bg-slate-50"
              />
              <Button variant="primary" size="sm" onClick={handleSaveCurrentState} icon={Save}>
                Save Slot
              </Button>
            </div>
          </div>
        )}

        {/* Saved Games List */}
        <div className="p-5 rounded-brutal-lg bg-white border-3 border-vyapar-navy shadow-brutal">
          <h2 className="text-sm font-black uppercase text-slate-500 tracking-wider mb-4 flex items-center gap-1.5">
            <FolderOpen className="w-4 h-4 text-amber-600" />
            LocalStorage Game Slots ({savedGames.length})
          </h2>

          {savedGames.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400 border-2 border-dashed border-slate-300 rounded-brutal font-semibold">
              No saved game slots found. Active games automatically auto-save after every turn!
            </div>
          ) : (
            <div className="space-y-3">
              {savedGames.map((slot) => (
                <div
                  key={slot.id}
                  className="p-3.5 rounded-brutal border-2 border-vyapar-navy bg-slate-50 flex flex-wrap items-center justify-between gap-3 shadow-xs"
                >
                  <div>
                    <h4 className="font-black text-sm text-vyapar-navy">{slot.name}</h4>
                    <div className="text-[11px] text-slate-500 flex items-center gap-3 mt-1">
                      <span>{slot.playersCount} Players</span>
                      <span>• Round {slot.round}</span>
                      <span>• {slot.moneyMode === 'PHYSICAL' ? 'Physical Cash' : 'Virtual Wallet'}</span>
                      <span className="flex items-center gap-1 text-slate-400">
                        <Clock className="w-3 h-3" />
                        {new Date(slot.savedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => handleLoadGame(slot.id)}
                      icon={Play}
                    >
                      Load Match
                    </Button>
                    <button
                      onClick={() => handleDelete(slot.id)}
                      className="p-2 rounded-lg border-2 border-vyapar-navy bg-white hover:bg-rose-100 text-rose-600 shadow-brutal-sm transition-transform active:translate-x-0.5 active:translate-y-0.5"
                      title="Delete slot"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}

export default SavedGamesPage;
