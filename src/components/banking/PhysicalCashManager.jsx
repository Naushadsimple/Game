import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useGameStore } from '../../store/gameStore';
import { DENOMINATIONS, calculateCashTotal } from '../../data/denominations';
import { formatRupees } from '../../utils/formatters';
import { sound } from '../../engine/soundEngine';
import { Wallet, Landmark, RefreshCw, ArrowRightLeft, CheckCircle2 } from 'lucide-react';

export function PhysicalCashManager({ isOpen, onClose }) {
  const store = useGameStore();
  const currentPlayer = store.players[store.currentPlayerIndex];
  const bank = store.bank;

  const [fromDenom, setFromDenom] = useState(500);
  const [toDenom, setToDenom] = useState(100);

  if (!isOpen || !currentPlayer) return null;

  const playerNotes = currentPlayer.notes || {};
  const bankNotes = bank.notes || {};
  const playerTotalCash = calculateCashTotal(playerNotes);
  const bankTotalCash = calculateCashTotal(bankNotes);

  // Exchange handler (e.g. exchange 1x ₹500 note for 5x ₹100 notes)
  const handleExchange = () => {
    if (fromDenom === toDenom) return;

    const fromVal = parseInt(fromDenom, 10);
    const toVal = parseInt(toDenom, 10);

    // If breaking into smaller notes (e.g. 500 into 100s)
    if (fromVal > toVal && fromVal % toVal === 0) {
      const neededNotes = fromVal / toVal;
      if ((playerNotes[fromVal] || 0) < 1) {
        sound.playError();
        store.addLog(`You do not have any ₹${fromVal} notes to exchange.`);
        return;
      }
      if ((bankNotes[toVal] || 0) < neededNotes) {
        sound.playError();
        store.addLog(`Bank does not have enough ₹${toVal} notes in inventory (${bankNotes[toVal] || 0} available, ${neededNotes} required).`);
        return;
      }

      // Execute exchange
      sound.playBuyProperty();
      const updatedPlayerNotes = {
        ...playerNotes,
        [fromVal]: playerNotes[fromVal] - 1,
        [toVal]: (playerNotes[toVal] || 0) + neededNotes,
      };
      const updatedBankNotes = {
        ...bankNotes,
        [fromVal]: (bankNotes[fromVal] || 0) + 1,
        [toVal]: bankNotes[toVal] - neededNotes,
      };

      useGameStore.setState((s) => ({
        players: s.players.map((p) =>
          p.id === currentPlayer.id ? { ...p, notes: updatedPlayerNotes } : p
        ),
        bank: { ...s.bank, notes: updatedBankNotes },
      }));

      store.recordBankTransaction({
        sender: currentPlayer.name,
        receiver: 'Central Bank',
        amount: fromVal,
        type: 'CURRENCY_EXCHANGE',
        description: `Exchanged 1x ₹${fromVal} note for ${neededNotes}x ₹${toVal} notes.`,
      });
      store.addLog(`Currency exchanged: 1x ₹${fromVal} for ${neededNotes}x ₹${toVal} notes.`);
    } else if (toVal > fromVal && toVal % fromVal === 0) {
      // Combining smaller notes into larger note (e.g. 5x 100 into 1x 500)
      const neededNotes = toVal / fromVal;
      if ((playerNotes[fromVal] || 0) < neededNotes) {
        sound.playError();
        store.addLog(`You need ${neededNotes}x ₹${fromVal} notes to exchange for 1x ₹${toVal} note.`);
        return;
      }
      if ((bankNotes[toVal] || 0) < 1) {
        sound.playError();
        store.addLog(`Bank does not have any ₹${toVal} notes in inventory.`);
        return;
      }

      sound.playBuyProperty();
      const updatedPlayerNotes = {
        ...playerNotes,
        [fromVal]: playerNotes[fromVal] - neededNotes,
        [toVal]: (playerNotes[toVal] || 0) + 1,
      };
      const updatedBankNotes = {
        ...bankNotes,
        [fromVal]: (bankNotes[fromVal] || 0) + neededNotes,
        [toVal]: bankNotes[toVal] - 1,
      };

      useGameStore.setState((s) => ({
        players: s.players.map((p) =>
          p.id === currentPlayer.id ? { ...p, notes: updatedPlayerNotes } : p
        ),
        bank: { ...s.bank, notes: updatedBankNotes },
      }));

      store.recordBankTransaction({
        sender: currentPlayer.name,
        receiver: 'Central Bank',
        amount: toVal,
        type: 'CURRENCY_EXCHANGE',
        description: `Exchanged ${neededNotes}x ₹${fromVal} notes for 1x ₹${toVal} note.`,
      });
      store.addLog(`Currency consolidated: ${neededNotes}x ₹${fromVal} for 1x ₹${toVal} note.`);
    } else {
      sound.playError();
      store.addLog(`Invalid exchange pair. Denominations must divide evenly.`);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Physical Cash & Denominations Vault"
      maxWidth="max-w-xl"
    >
      <div className="flex flex-col gap-4 text-vyapar-navy">
        {/* Merchant Wallet Notes Grid */}
        <div className="p-4 rounded-brutal bg-slate-50 border-2 border-vyapar-navy shadow-brutal-sm">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <Wallet className="w-5 h-5 text-emerald-700" />
              <h4 className="font-black text-sm text-vyapar-navy">
                {currentPlayer.name}&apos;s Physical Note Wallet
              </h4>
            </div>
            <span className="font-black text-emerald-800 text-sm">
              Total: {formatRupees(playerTotalCash)}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {DENOMINATIONS.map((d) => {
              const count = playerNotes[d.value] || 0;
              return (
                <div
                  key={d.value}
                  style={{ borderColor: d.border }}
                  className="p-2 rounded-lg border-2 bg-white flex flex-col justify-between shadow-xs"
                >
                  <div className="flex items-center justify-between">
                    <span
                      style={{ backgroundColor: d.bg, color: d.text }}
                      className="px-1.5 py-0.5 rounded font-black text-[10px]"
                    >
                      {d.label}
                    </span>
                    <span className="font-extrabold text-xs text-slate-700">
                      × {count}
                    </span>
                  </div>
                  <div className="text-[10px] text-right font-black text-slate-500 mt-1">
                    {formatRupees(count * d.value)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Currency Denomination Exchange with Bank */}
        <div className="p-4 rounded-brutal bg-amber-50 border-2 border-amber-300 shadow-brutal-sm">
          <div className="flex items-center gap-2 mb-2 font-black text-sm text-amber-950">
            <ArrowRightLeft className="w-4 h-4 text-amber-700" />
            <span>Bank Cash Exchange Desk</span>
          </div>
          <p className="text-xs text-amber-900 mb-3 leading-relaxed">
            Trade high denominations for change (or combine small notes) directly with the Central Bank.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Give Denomination:
              </label>
              <select
                value={fromDenom}
                onChange={(e) => setFromDenom(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border-2 border-vyapar-navy bg-white font-bold"
              >
                {DENOMINATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label} (You have: {playerNotes[d.value] || 0})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-center">
              <Button variant="primary" size="sm" onClick={handleExchange} icon={RefreshCw}>
                Exchange
              </Button>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Receive Denomination:
              </label>
              <select
                value={toDenom}
                onChange={(e) => setToDenom(Number(e.target.value))}
                className="w-full text-xs p-2 rounded-lg border-2 border-vyapar-navy bg-white font-bold"
              >
                {DENOMINATIONS.map((d) => (
                  <option key={d.value} value={d.value}>
                    {d.label} (Bank has: {bankNotes[d.value] || 0})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Bank Note Inventory */}
        <div className="p-3 rounded-lg border border-slate-200 bg-white text-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="font-bold text-slate-600 flex items-center gap-1.5">
              <Landmark className="w-3.5 h-3.5" /> Central Bank Physical Inventory
            </span>
            <span className="font-black text-slate-700">Total: {formatRupees(bankTotalCash)}</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {DENOMINATIONS.map((d) => (
              <span
                key={d.value}
                className="px-2 py-1 rounded bg-slate-100 text-[10px] font-bold border border-slate-300"
              >
                {d.label}: {bankNotes[d.value] || 0} notes
              </span>
            ))}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="md" onClick={onClose}>
            Done
          </Button>
        </div>
      </div>
    </Modal>
  );
}
