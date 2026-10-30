import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useGameStore } from '../../store/gameStore';
import { formatRupees } from '../../utils/formatters';
import { sound } from '../../engine/soundEngine';
import { ArrowLeftRight, Check, X, ShieldAlert } from 'lucide-react';

export function TradeModal({ isOpen, onClose }) {
  const store = useGameStore();
  const currentPlayer = store.players[store.currentPlayerIndex];
  const otherPlayers = (store.players || []).filter(
    (p) => p.id !== currentPlayer?.id && !p.isBankrupt
  );

  const [partnerId, setPartnerId] = useState(otherPlayers[0]?.id || '');
  const [offeredPropertyIds, setOfferedPropertyIds] = useState([]);
  const [offeredCash, setOfferedCash] = useState(0);
  const [requestedPropertyIds, setRequestedPropertyIds] = useState([]);
  const [requestedCash, setRequestedCash] = useState(0);

  if (!isOpen || !currentPlayer) return null;

  const partner = store.players.find((p) => p.id === partnerId) || otherPlayers[0];

  const myProperties = Object.values(store.properties).filter(
    (p) => p.ownerId === currentPlayer.id && !p.houses && !p.hasHotel
  );

  const partnerProperties = partner
    ? Object.values(store.properties).filter(
        (p) => p.ownerId === partner.id && !p.houses && !p.hasHotel
      )
    : [];

  const toggleOfferProperty = (id) => {
    setOfferedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const toggleRequestProperty = (id) => {
    setRequestedPropertyIds((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const handleSendProposal = () => {
    if (!partner) return;

    if (offeredCash > currentPlayer.wallet) {
      sound.playError();
      store.addLog('You cannot offer more cash than you own!');
      return;
    }

    if (requestedCash > partner.wallet) {
      sound.playError();
      store.addLog(`${partner.name} does not have enough cash for this request!`);
      return;
    }

    if (
      offeredPropertyIds.length === 0 &&
      offeredCash === 0 &&
      requestedPropertyIds.length === 0 &&
      requestedCash === 0
    ) {
      sound.playError();
      store.addLog('Empty trade proposal! Select properties or cash.');
      return;
    }

    // If partner is AI, simulate intelligent evaluation
    if (partner.isAi) {
      let offeredValue = offeredCash;
      offeredPropertyIds.forEach((pid) => {
        offeredValue += store.properties[pid]?.price || 0;
      });

      let requestedValue = requestedCash;
      requestedPropertyIds.forEach((pid) => {
        requestedValue += store.properties[pid]?.price || 0;
      });

      // AI decision logic:
      const isBeneficial =
        partner.aiDifficulty === 'EASY'
          ? offeredValue >= requestedValue * 0.8
          : partner.aiDifficulty === 'MEDIUM'
          ? offeredValue >= requestedValue * 1.1
          : offeredValue >= requestedValue * 1.35;

      if (isBeneficial) {
        store.executeTrade({
          senderId: currentPlayer.id,
          receiverId: partner.id,
          offeredPropertyIds,
          offeredCash,
          requestedPropertyIds,
          requestedCash,
        });
        store.addLog(`Deal Accepted! ${partner.name} (AI) evaluated the trade as advantageous and accepted.`);
        onClose();
      } else {
        sound.playError();
        store.addLog(`Trade Rejected! ${partner.name} (AI) calculated the proposal as unfavorable.`);
      }
      return;
    }

    // Human to human trade: instant execution for local hotseat play
    store.executeTrade({
      senderId: currentPlayer.id,
      receiverId: partner.id,
      offeredPropertyIds,
      offeredCash,
      requestedPropertyIds,
      requestedCash,
    });
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Merchant Trade Negotiation"
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-4 text-vyapar-navy">
        {/* Select Partner */}
        <div className="flex items-center justify-between p-3 rounded-brutal bg-slate-50 border-2 border-vyapar-navy">
          <label className="text-xs font-black uppercase text-slate-700">
            Select Trading Partner:
          </label>
          <select
            value={partner?.id || ''}
            onChange={(e) => {
              setPartnerId(e.target.value);
              setRequestedPropertyIds([]);
            }}
            className="text-xs font-bold px-3 py-1.5 rounded-lg border-2 border-vyapar-navy bg-white"
          >
            {otherPlayers.map((p) => (
              <option key={p.id} value={p.id}>
                {p.name} ({formatRupees(p.wallet)}) {p.isAi ? '[AI]' : ''}
              </option>
            ))}
          </select>
        </div>

        {/* Trade Columns: You Give vs You Receive */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* YOU OFFER */}
          <div className="p-3 rounded-brutal border-2 border-vyapar-navy bg-white shadow-brutal-sm flex flex-col">
            <div className="font-black text-xs uppercase tracking-wide text-emerald-800 pb-2 border-b border-slate-200">
              You Offer ({currentPlayer.name})
            </div>

            {/* Cash Input */}
            <div className="mt-2.5">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Cash Offer: (Max: {formatRupees(currentPlayer.wallet)})
              </label>
              <input
                type="number"
                min="0"
                max={currentPlayer.wallet}
                step="100"
                value={offeredCash}
                onChange={(e) => setOfferedCash(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full text-xs font-black p-2 rounded-lg border-2 border-vyapar-navy bg-slate-50"
              />
            </div>

            {/* Properties Select */}
            <div className="mt-3 flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                Properties to Offer ({myProperties.length}):
              </label>
              <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                {myProperties.length === 0 ? (
                  <div className="text-[11px] text-slate-400 italic">No eligible properties owned.</div>
                ) : (
                  myProperties.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-2 rounded text-xs border cursor-pointer transition-colors ${
                        offeredPropertyIds.includes(p.id)
                          ? 'bg-emerald-50 border-emerald-500 font-bold'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{p.name}</span>
                      <input
                        type="checkbox"
                        checked={offeredPropertyIds.includes(p.id)}
                        onChange={() => toggleOfferProperty(p.id)}
                        className="rounded"
                      />
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>

          {/* YOU REQUEST */}
          <div className="p-3 rounded-brutal border-2 border-vyapar-navy bg-white shadow-brutal-sm flex flex-col">
            <div className="font-black text-xs uppercase tracking-wide text-sky-800 pb-2 border-b border-slate-200">
              You Request (From {partner?.name})
            </div>

            {/* Cash Input */}
            <div className="mt-2.5">
              <label className="block text-[11px] font-bold text-slate-600 mb-1">
                Cash Request: (Max: {formatRupees(partner?.wallet || 0)})
              </label>
              <input
                type="number"
                min="0"
                max={partner?.wallet || 0}
                step="100"
                value={requestedCash}
                onChange={(e) => setRequestedCash(Math.max(0, parseInt(e.target.value) || 0))}
                className="w-full text-xs font-black p-2 rounded-lg border-2 border-vyapar-navy bg-slate-50"
              />
            </div>

            {/* Properties Select */}
            <div className="mt-3 flex-1">
              <label className="block text-[11px] font-bold text-slate-600 mb-1.5">
                Properties Requested ({partnerProperties.length}):
              </label>
              <div className="max-h-40 overflow-y-auto space-y-1 pr-1">
                {partnerProperties.length === 0 ? (
                  <div className="text-[11px] text-slate-400 italic">Partner owns no eligible properties.</div>
                ) : (
                  partnerProperties.map((p) => (
                    <label
                      key={p.id}
                      className={`flex items-center justify-between p-2 rounded text-xs border cursor-pointer transition-colors ${
                        requestedPropertyIds.includes(p.id)
                          ? 'bg-sky-50 border-sky-500 font-bold'
                          : 'bg-slate-50 border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      <span>{p.name}</span>
                      <input
                        type="checkbox"
                        checked={requestedPropertyIds.includes(p.id)}
                        onChange={() => toggleRequestProperty(p.id)}
                        className="rounded"
                      />
                    </label>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <Button variant="secondary" size="md" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="success" size="md" onClick={handleSendProposal} icon={ArrowLeftRight}>
            Propose Trade Agreement
          </Button>
        </div>
      </div>
    </Modal>
  );
}
