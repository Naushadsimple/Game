import React, { useState } from 'react';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { useGameStore } from '../../store/gameStore';
import { formatRupees, formatDateTime } from '../../utils/formatters';
import { Landmark, Home, Hotel, ArrowDownUp, Receipt, Search, Filter } from 'lucide-react';

export function BankDashboard({ isOpen, onClose }) {
  const store = useGameStore();
  const bank = store.bank;
  const [filterType, setFilterType] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  // Filter transactions
  const filteredTxs = (bank.transactions || []).filter((tx) => {
    const matchesFilter = filterType === 'ALL' || tx.type === filterType;
    const matchesQuery =
      searchQuery === '' ||
      tx.sender?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.receiver?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tx.description?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesQuery;
  });

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Central Reserve Bank of Vyapar"
      maxWidth="max-w-2xl"
    >
      <div className="flex flex-col gap-4 text-vyapar-navy">
        {/* Bank Reserves Overview Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          <div className="p-3 rounded-brutal bg-emerald-50 border-2 border-emerald-300 shadow-brutal-sm">
            <span className="text-[10px] font-black uppercase text-emerald-800 flex items-center gap-1">
              <Landmark className="w-3.5 h-3.5" /> Treasury Cash
            </span>
            <div className="text-lg font-black text-emerald-950 mt-1">
              {formatRupees(bank.cash)}
            </div>
          </div>

          <div className="p-3 rounded-brutal bg-sky-50 border-2 border-sky-300 shadow-brutal-sm">
            <span className="text-[10px] font-black uppercase text-sky-800 flex items-center gap-1">
              <ArrowDownUp className="w-3.5 h-3.5" /> Total Ledgers
            </span>
            <div className="text-lg font-black text-sky-950 mt-1">
              {bank.transactions?.length || 0} Records
            </div>
          </div>

          <div className="p-3 rounded-brutal bg-amber-50 border-2 border-amber-300 shadow-brutal-sm">
            <span className="text-[10px] font-black uppercase text-amber-800 flex items-center gap-1">
              <Home className="w-3.5 h-3.5" /> Houses Left
            </span>
            <div className="text-lg font-black text-amber-950 mt-1">
              {bank.housesRemaining} / 32
            </div>
          </div>

          <div className="p-3 rounded-brutal bg-rose-50 border-2 border-rose-300 shadow-brutal-sm">
            <span className="text-[10px] font-black uppercase text-rose-800 flex items-center gap-1">
              <Hotel className="w-3.5 h-3.5" /> Hotels Left
            </span>
            <div className="text-lg font-black text-rose-950 mt-1">
              {bank.hotelsRemaining} / 12
            </div>
          </div>
        </div>

        {/* Filters & Search */}
        <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-slate-200">
          <div className="flex items-center gap-1.5 flex-1 min-w-[200px]">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search sender, merchant or city..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs px-2.5 py-1.5 rounded-lg border-2 border-vyapar-navy bg-slate-50 focus:outline-none focus:bg-white"
            />
          </div>

          <div className="flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-slate-500" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="text-xs px-2 py-1.5 rounded-lg border-2 border-vyapar-navy bg-white font-bold"
            >
              <option value="ALL">All Categories</option>
              <option value="PROPERTY_PURCHASE">Property Purchases</option>
              <option value="RENT">Visiting Rents</option>
              <option value="SALARY">Salaries</option>
              <option value="TAX">Taxes</option>
              <option value="FINE">Jail Fines</option>
              <option value="MORTGAGE">Mortgages</option>
              <option value="DEVELOPMENT">Developments</option>
              <option value="TRADE">Trades</option>
            </select>
          </div>
        </div>

        {/* Transaction History Ledger Table */}
        <div className="border-2 border-vyapar-navy rounded-brutal overflow-hidden shadow-brutal-sm">
          <div className="bg-vyapar-navy text-white px-3 py-2 text-xs font-black flex items-center justify-between">
            <span>OFFICIAL TRANSACTION AUDIT TRAIL</span>
            <span>{filteredTxs.length} Transactions</span>
          </div>

          <div className="max-h-64 overflow-y-auto divide-y divide-slate-200 bg-white">
            {filteredTxs.length === 0 ? (
              <div className="p-6 text-center text-xs text-slate-500 font-semibold">
                No matching transactions recorded in bank ledger.
              </div>
            ) : (
              filteredTxs.map((tx) => (
                <div key={tx.id} className="p-2.5 hover:bg-slate-50 flex items-start justify-between text-xs gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">{tx.sender}</span>
                      <span className="text-[10px] text-slate-400">→</span>
                      <span className="font-black text-slate-900">{tx.receiver}</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-slate-200 text-slate-800">
                        {tx.type}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-600 mt-0.5">{tx.description}</div>
                    <div className="text-[9px] text-slate-400 mt-0.5">{formatDateTime(tx.timestamp)}</div>
                  </div>

                  <div className="font-black text-sm text-emerald-800 whitespace-nowrap">
                    {formatRupees(tx.amount)}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <Button variant="secondary" size="md" onClick={onClose}>
            Close Bank Dashboard
          </Button>
        </div>
      </div>
    </Modal>
  );
}
