// Indian Rupee currency denominations for Vyapar Physical Cash Mode
export const DENOMINATIONS = [
  { value: 10, label: '₹10', color: 'from-amber-600 to-amber-700', bg: '#D97706', text: '#FFF', border: '#92400E', name: 'Ten Rupees' },
  { value: 20, label: '₹20', color: 'from-lime-600 to-lime-700', bg: '#65A30D', text: '#FFF', border: '#3F6212', name: 'Twenty Rupees' },
  { value: 50, label: '₹50', color: 'from-cyan-600 to-cyan-700', bg: '#0891B2', text: '#FFF', border: '#155E75', name: 'Fifty Rupees' },
  { value: 100, label: '₹100', color: 'from-indigo-600 to-indigo-700', bg: '#4F46E5', text: '#FFF', border: '#3730A3', name: 'One Hundred Rupees' },
  { value: 200, label: '₹200', color: 'from-orange-500 to-orange-600', bg: '#EA580C', text: '#FFF', border: '#9A3412', name: 'Two Hundred Rupees' },
  { value: 500, label: '₹500', color: 'from-emerald-700 to-emerald-800', bg: '#047857', text: '#FFF', border: '#064E3B', name: 'Five Hundred Rupees' },
  { value: 1000, label: '₹1,000', color: 'from-fuchsia-700 to-fuchsia-800', bg: '#A21CAF', text: '#FFF', border: '#701A75', name: 'One Thousand Rupees' },
];

export const DEFAULT_PLAYER_NOTES = {
  1000: 5,  // 5,000
  500: 10,  // 5,000
  200: 10,  // 2,000
  100: 15,  // 1,500
  50: 14,   // 700
  20: 20,   // 400
  10: 40,   // 400
  // Total = ₹15,000 standard Vyapar starting cash
};

export const DEFAULT_BANK_NOTES = {
  1000: 200, // 200,000
  500: 300,  // 150,000
  200: 400,  // 80,000
  100: 600,  // 60,000
  50: 800,   // 40,000
  20: 1000,  // 20,000
  10: 1500,  // 15,000
};

export function calculateCashTotal(notes = {}) {
  return Object.entries(notes).reduce((total, [denom, count]) => {
    return total + (parseInt(denom, 10) * (count || 0));
  }, 0);
}
