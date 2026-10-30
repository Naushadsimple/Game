import React from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { formatRupees } from '../../utils/formatters';
import { PropertyLandmarkImage } from '../../utils/cityImages';
import { useGameStore } from '../../store/gameStore';
import { AlertCircle, IndianRupee } from 'lucide-react';

export function RentModal({ isOpen, onClose }) {
  const store = useGameStore();
  const action = store.pendingAction;

  if (!action || action.type !== 'PAY_RENT') return null;

  const { payerId, ownerId, propertyId, amount } = action;
  const payer = store.players.find((p) => p.id === payerId);
  const owner = store.players.find((p) => p.id === ownerId);
  const property = store.properties[propertyId];

  if (!payer || !owner || !property) return null;

  const canAfford = payer.wallet >= amount;

  return (
    <Modal
      isOpen={isOpen}
      onClose={() => {}}
      title="Visiting Rent Payment Due"
      maxWidth="max-w-md"
      showClose={false}
    >
      <div className="flex flex-col items-center text-center">
        {/* Landmark thumbnail */}
        <div className="w-full h-28 rounded-brutal border-2 border-vyapar-navy overflow-hidden shadow-brutal-sm mb-4">
          <PropertyLandmarkImage propertyId={property.id} className="w-full h-full object-cover" />
        </div>

        <div className="text-xs font-black uppercase tracking-wider text-slate-500">
          Landed on {property.name}
        </div>

        <h3 className="text-xl font-black text-vyapar-navy mt-1">
          {payer.name} owes Visiting Rent
        </h3>

        {/* Owner Pill */}
        <div className="mt-2 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 border-2 border-vyapar-navy shadow-brutal-sm">
          <span className="text-xs font-bold text-slate-600">Property Owner:</span>
          <span
            style={{ backgroundColor: owner.color }}
            className="w-3 h-3 rounded-full border border-vyapar-navy"
          />
          <span className="text-xs font-black text-vyapar-navy">{owner.name}</span>
        </div>

        {/* Rent amount card */}
        <div className="w-full mt-4 p-4 rounded-brutal bg-amber-50 border-2 border-amber-300 shadow-brutal text-center">
          <div className="text-xs font-bold text-amber-800 uppercase">Tariff Rent Due</div>
          <div className="text-3xl font-black text-amber-900 mt-1">
            {formatRupees(amount)}
          </div>
          <div className="text-[11px] text-amber-700 mt-1">
            {property.hasHotel
              ? 'Charged for Grand Hotel luxury stay.'
              : property.houses > 0
              ? `Charged for ${property.houses} developed houses.`
              : 'Charged for unimproved site visit.'}
          </div>
        </div>

        {/* Player balance status */}
        <div className="w-full mt-3 flex items-center justify-between text-xs px-2 font-bold text-slate-600">
          <span>{payer.name}&apos;s Current Balance:</span>
          <span className={`font-black ${canAfford ? 'text-emerald-700' : 'text-red-600'}`}>
            {formatRupees(payer.wallet)}
          </span>
        </div>

        {!canAfford && (
          <div className="w-full mt-2 p-2 rounded-lg bg-red-50 border border-red-300 text-red-700 text-xs flex items-center gap-2 text-left">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>
              Insufficient funds! Liquidating assets or declaring bankruptcy may be required.
            </span>
          </div>
        )}

        {/* Pay button */}
        <div className="w-full mt-5">
          <Button
            variant={canAfford ? 'success' : 'danger'}
            size="lg"
            className="w-full"
            onClick={() => store.executeRentPayment()}
            icon={IndianRupee}
          >
            {canAfford ? `Pay Rent (${formatRupees(amount)})` : 'Settle Debt / Bankruptcy'}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
