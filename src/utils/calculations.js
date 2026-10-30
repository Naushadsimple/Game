// Financial calculations and physical cash denomination breakdown
import { calculateCashTotal } from '../data/denominations';

/**
 * Calculates net worth of a player: cash + property purchase prices + building values
 */
export function calculatePlayerNetWorth(player, properties = {}) {
  if (!player) return 0;
  const cash = player.wallet;

  let propertyValue = 0;
  Object.values(properties).forEach((prop) => {
    if (prop.ownerId === player.id) {
      if (!prop.isMortgaged) {
        propertyValue += prop.price;
        if (prop.houses) {
          propertyValue += prop.houses * (prop.houseCost || 0);
        }
        if (prop.hasHotel) {
          propertyValue += (prop.hotelCost || 0);
        }
      } else {
        propertyValue += (prop.mortgageValue || prop.price / 2);
      }
    }
  });

  return cash + propertyValue;
}

/**
 * Validates whether a player can pay a specific amount
 */
export function canPlayerAfford(player, amount, moneyMode = 'VIRTUAL') {
  if (!player) return false;
  if (moneyMode === 'PHYSICAL') {
    const totalPhysical = calculateCashTotal(player.notes || {});
    return totalPhysical >= amount;
  }
  return player.wallet >= amount;
}

/**
 * Greedily determines optimal note combination from an inventory for a target amount.
 * Returns { exact: boolean, notes: { [denom]: count }, remaining: number }
 */
export function getGreedyNoteBreakdown(targetAmount, availableNotes = {}) {
  const denoms = Object.keys(availableNotes)
    .map(Number)
    .sort((a, b) => b - a);

  let remaining = targetAmount;
  const usedNotes = {};

  for (const denom of denoms) {
    if (remaining <= 0) break;
    const countAvailable = availableNotes[denom] || 0;
    if (countAvailable > 0 && denom <= remaining) {
      const needed = Math.min(Math.floor(remaining / denom), countAvailable);
      if (needed > 0) {
        usedNotes[denom] = needed;
        remaining -= needed * denom;
      }
    }
  }

  return {
    exact: remaining === 0,
    notes: usedNotes,
    remaining,
  };
}

/**
 * Break down change into available bank notes
 */
export function makeChangeFromBank(changeAmount, bankNotes = {}) {
  const denoms = [1000, 500, 200, 100, 50, 20, 10];
  let remaining = changeAmount;
  const changeNotes = {};

  for (const denom of denoms) {
    if (remaining <= 0) break;
    const available = bankNotes[denom] || 0;
    if (available > 0 && denom <= remaining) {
      const take = Math.min(Math.floor(remaining / denom), available);
      if (take > 0) {
        changeNotes[denom] = take;
        remaining -= take * denom;
      }
    }
  }

  return {
    success: remaining === 0,
    changeNotes,
    shortfall: remaining,
  };
}
