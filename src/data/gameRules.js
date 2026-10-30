// Game configuration and rule constants
export const GAME_RULES = {
  START_SALARY: 2000,          // Salary credited on passing or landing on START
  JAIL_FINE: 500,              // Cost to pay out of jail
  MAX_JAIL_TURNS: 3,           // Max turns waiting in jail before forced fine
  MAX_CONSECUTIVE_DOUBLES: 3,  // 3 doubles sends directly to jail
  HOUSES_PER_HOTEL: 4,         // 4 houses required before hotel
  BANK_TOTAL_HOUSES: 32,       // Bank inventory of houses
  BANK_TOTAL_HOTELS: 12,       // Bank inventory of hotels
  MORTGAGE_RATE: 0.5,          // 50% of purchase price given on mortgage
  UNMORTGAGE_INTEREST: 0.1,    // 10% interest charged when unmortgaging (50% + 10% = 55% of price)
  DEFAULT_STARTING_CASH: 15000,// Default starting cash per player
  DEFAULT_MAX_ROUNDS: 0,       // 0 = unlimited, or configured number of rounds
  DEFAULT_TIME_LIMIT_MIN: 0,   // 0 = no time limit
  COLOR_GROUPS: {
    BROWN: { name: 'Brown / Guwahati-Bhubaneswar', color: '#8B4513', count: 2 },
    SKY: { name: 'Sky Blue / East Central', color: '#38BDF8', count: 3 },
    PINK: { name: 'Pink / Central India', color: '#F472B6', count: 3 },
    ORANGE: { name: 'Orange / Gujarat & Rajasthan', color: '#FB923C', count: 3 },
    RED: { name: 'Red / North & Coastal', color: '#EF4444', count: 3 },
    YELLOW: { name: 'Yellow / Deccan & South', color: '#FACC15', count: 3 },
    GREEN: { name: 'Green / Metro Capitals', color: '#22C55E', count: 3 },
    BLUE: { name: 'Dark Blue / Financial Capitals', color: '#3B82F6', count: 2 },
    RAILWAY: { name: 'Indian Railways', color: '#64748B', count: 4 },
    UTILITY: { name: 'Public Utilities', color: '#A855F7', count: 2 },
  },
  TOKENS: [
    { id: 'car', name: 'Vintage Ambassador', icon: 'Car', emoji: '🚗' },
    { id: 'auto', name: 'Auto Rickshaw', icon: 'Navigation', emoji: '🛺' },
    { id: 'train', name: 'Steam Engine', icon: 'Train', emoji: '🚂' },
    { id: 'plane', name: 'Air India Boeing', icon: 'Plane', emoji: '✈️' },
    { id: 'ship', name: 'Merchant Ship', icon: 'Anchor', emoji: '🚢' },
    { id: 'horse', name: 'Royal Elephant / Stallion', icon: 'Crown', emoji: '🐘' },
  ],
  PLAYER_COLORS: [
    { id: 'red', name: 'Ruby Red', hex: '#EF4444', border: '#B91C1C', text: '#FFFFFF' },
    { id: 'blue', name: 'Royal Blue', hex: '#3B82F6', border: '#1D4ED8', text: '#FFFFFF' },
    { id: 'green', name: 'Emerald Green', hex: '#10B981', border: '#047857', text: '#FFFFFF' },
    { id: 'yellow', name: 'Saffron Gold', hex: '#F59E0B', border: '#B45309', text: '#111827' },
    { id: 'purple', name: 'Imperial Violet', hex: '#8B5CF6', border: '#6D28D9', text: '#FFFFFF' },
    { id: 'pink', name: 'Rose Pink', hex: '#EC4899', border: '#BE185D', text: '#FFFFFF' },
  ],
};
