import { create } from 'zustand';
import { BOARD_TILES } from '../data/boardData';
import { CHANCE_CARDS, COMMUNITY_CARDS } from '../data/cardData';
import { GAME_RULES } from '../data/gameRules';
import { DEFAULT_PLAYER_NOTES, DEFAULT_BANK_NOTES, calculateCashTotal } from '../data/denominations';
import { saveActiveGameToStorage, loadActiveGameFromStorage, clearActiveGameFromStorage } from '../utils/localStorage';
import { sound } from '../engine/soundEngine';
import { canPlayerAfford, getGreedyNoteBreakdown, makeChangeFromBank } from '../utils/calculations';

// Shuffle helper
function shuffle(array) {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[j], arr[i]] = [arr[j], arr[i]];
  }
  return arr;
}

export const useGameStore = create((set, get) => ({
  // Core game setup
  gameId: null,
  gameName: 'Vyapar Maha Utsav',
  status: 'SETUP', // 'SETUP', 'PLAYING', 'PAUSED', 'GAME_OVER'
  moneyMode: 'VIRTUAL', // 'VIRTUAL' or 'PHYSICAL'
  firstRoundTour: false, // Warm-up lap: can only buy after completing 1 round
  maxRounds: 0, // 0 = unlimited
  round: 1,

  // Players
  players: [],
  currentPlayerIndex: 0,

  // Dice & Turn
  dice: [1, 1],
  isRolling: false,
  hasRolled: false,
  isDoubles: false,
  consecutiveDoubles: 0,
  isMoving: false,

  // Interactive Movement Tracker
  movementInfo: null, // { playerName, fromTileName, toTileName, spaces, fromIndex, toIndex, currentStepIndex }
  highlightedTileIndex: null,

  // Properties state map: { [propertyId]: { ownerId, houses, hasHotel, isMortgaged } }
  properties: {},

  // Central Bank
  bank: {
    cash: 500000,
    notes: { ...DEFAULT_BANK_NOTES },
    housesRemaining: GAME_RULES.BANK_TOTAL_HOUSES,
    hotelsRemaining: GAME_RULES.BANK_TOTAL_HOTELS,
    transactions: [],
  },

  // Decks
  chanceDeck: shuffle(CHANCE_CARDS),
  communityDeck: shuffle(COMMUNITY_CARDS),

  // Modals & Pending User Interactions
  activeModal: null, // 'BUY_PROPERTY', 'RENT', 'CARD', 'JAIL', 'TRADE', 'BANK', 'BUILD', 'PHYSICAL_CASH', 'SETTINGS', 'WINNER'
  pendingAction: null,
  drawnCard: null,
  viewingPropertyId: null,
  winner: null,

  // Activity logs (internal ledger)
  logs: [],

  // Audio mute
  soundMuted: false,

  // ==========================================
  // INITIALIZATION & GAME CREATION
  // ==========================================

  initNewGame: (config) => {
    const {
      gameName = 'Vyapar Game',
      moneyMode = 'VIRTUAL',
      firstRoundTour = false,
      startingCash = GAME_RULES.DEFAULT_STARTING_CASH,
      maxRounds = 0,
      players = [],
    } = config;

    const gameId = `vyapar_${Date.now()}`;
    const initialProperties = {};

    BOARD_TILES.forEach((tile) => {
      if (['PROPERTY', 'RAILWAY', 'UTILITY'].includes(tile.type)) {
        initialProperties[tile.id] = {
          id: tile.id,
          name: tile.name,
          type: tile.type,
          group: tile.group,
          price: tile.price,
          ownerId: null,
          houses: 0,
          hasHotel: false,
          isMortgaged: false,
          baseRent: tile.baseRent || 0,
          rentWith1: tile.rentWith1 || 0,
          rentWith2: tile.rentWith2 || 0,
          rentWith3: tile.rentWith3 || 0,
          rentWith4: tile.rentWith4 || 0,
          rentWithHotel: tile.rentWithHotel || 0,
          houseCost: tile.houseCost || 0,
          hotelCost: tile.hotelCost || 0,
          mortgageValue: tile.mortgageValue || tile.price / 2,
        };
      }
    });

    // Setup initial player records
    const initializedPlayers = players.map((p, idx) => {
      return {
        id: p.id || `p_${idx + 1}`,
        name: p.name || `Merchant ${idx + 1}`,
        token: p.token || GAME_RULES.TOKENS[idx % GAME_RULES.TOKENS.length].id,
        color: p.color || GAME_RULES.PLAYER_COLORS[idx % GAME_RULES.PLAYER_COLORS.length].hex,
        isAi: !!p.isAi,
        aiDifficulty: p.aiDifficulty || 'MEDIUM',
        position: 0,
        wallet: Number(startingCash) || GAME_RULES.DEFAULT_STARTING_CASH,
        notes: { ...DEFAULT_PLAYER_NOTES },
        isInJail: false,
        jailTurnsRemaining: 0,
        getOutOfJailCards: 0,
        isBankrupt: false,
        hasCompletedFirstTour: !firstRoundTour, // If tour rule is active, starts false
      };
    });

    const initialTransactions = [
      {
        id: `tx_${Date.now()}_init`,
        timestamp: new Date().toISOString(),
        sender: 'Central Reserve Bank',
        receiver: 'All Merchants',
        amount: (Number(startingCash) || GAME_RULES.DEFAULT_STARTING_CASH) * players.length,
        type: 'INITIAL_CAPITAL',
        description: `Starting capital of ₹${startingCash} distributed to each merchant.`,
      },
    ];

    const initialLogs = [
      `Grand Vyapar Bazaar opened! ${initializedPlayers.length} merchants have assembled.`,
    ];

    const newState = {
      gameId,
      gameName,
      status: 'PLAYING',
      moneyMode,
      firstRoundTour,
      maxRounds,
      round: 1,
      players: initializedPlayers,
      currentPlayerIndex: 0,
      dice: [1, 1],
      isRolling: false,
      hasRolled: false,
      isDoubles: false,
      consecutiveDoubles: 0,
      isMoving: false,
      movementInfo: null,
      highlightedTileIndex: null,
      properties: initialProperties,
      bank: {
        cash: 1000000,
        notes: { ...DEFAULT_BANK_NOTES },
        housesRemaining: GAME_RULES.BANK_TOTAL_HOUSES,
        hotelsRemaining: GAME_RULES.BANK_TOTAL_HOTELS,
        transactions: initialTransactions,
      },
      chanceDeck: shuffle(CHANCE_CARDS),
      communityDeck: shuffle(COMMUNITY_CARDS),
      activeModal: null,
      pendingAction: null,
      drawnCard: null,
      viewingPropertyId: null,
      winner: null,
      logs: initialLogs,
    };

    set(newState);
    saveActiveGameToStorage(newState);

    // If first player is AI, trigger turn
    setTimeout(() => {
      get().checkAiTurn();
    }, 600);
  },

  // Load from local storage
  resumeSavedGame: () => {
    const saved = loadActiveGameFromStorage();
    if (saved) {
      set({ ...saved, status: 'PLAYING' });
      return true;
    }
    return false;
  },

  setSoundMuted: (muted) => {
    sound.setMuted(muted);
    set({ soundMuted: muted });
  },

  setActiveModal: (modalName) => set({ activeModal: modalName }),
  closeModal: () => set({ activeModal: null, drawnCard: null, pendingAction: null }),
  setViewingPropertyId: (id) => set({ viewingPropertyId: id }),

  addLog: (message) => {
    set((state) => ({
      logs: [message, ...state.logs.slice(0, 49)],
    }));
  },

  // Record a transaction in central bank ledger
  recordBankTransaction: (tx) => {
    const transaction = {
      id: `tx_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
      timestamp: new Date().toISOString(),
      ...tx,
    };

    set((state) => {
      const updatedTransactions = [transaction, ...state.bank.transactions];
      return {
        bank: {
          ...state.bank,
          transactions: updatedTransactions,
        },
      };
    });
  },

  // ==========================================
  // DICE & MOVEMENT ENGINE WITH STEP ANIMATION
  // ==========================================

  rollDice: () => {
    const state = get();
    if (state.hasRolled || state.isRolling || state.isMoving) return;

    const currentPlayer = state.players[state.currentPlayerIndex];
    if (!currentPlayer || currentPlayer.isBankrupt) return;

    sound.playDiceRoll();
    set({ isRolling: true });

    // Simulate animated roll
    setTimeout(() => {
      const d1 = Math.floor(Math.random() * 6) + 1;
      const d2 = Math.floor(Math.random() * 6) + 1;
      const total = d1 + d2;
      const isDoubles = d1 === d2;
      const consecutiveDoubles = isDoubles ? state.consecutiveDoubles + 1 : 0;

      set({
        dice: [d1, d2],
        isRolling: false,
        hasRolled: true,
        isDoubles,
        consecutiveDoubles,
      });

      state.addLog(`${currentPlayer.name} rolled [${d1}] and [${d2}] (Total: ${total})${isDoubles ? ' - DOUBLES!' : ''}`);

      // Jail handling
      if (currentPlayer.isInJail) {
        if (isDoubles) {
          state.addLog(`Lucky roll! ${currentPlayer.name} rolled doubles and is released from Central Jail!`);
          get().releaseFromJail(currentPlayer.id);
          get().movePlayer(currentPlayer.id, total);
        } else {
          const remaining = currentPlayer.jailTurnsRemaining - 1;
          if (remaining <= 0) {
            state.addLog(`${currentPlayer.name} served maximum jail time. Mandatory fine of ₹${GAME_RULES.JAIL_FINE} charged.`);
            get().payJailFine(currentPlayer.id);
            get().movePlayer(currentPlayer.id, total);
          } else {
            set((s) => ({
              players: s.players.map((p) =>
                p.id === currentPlayer.id ? { ...p, jailTurnsRemaining: remaining } : p
              ),
            }));
            state.addLog(`${currentPlayer.name} did not roll doubles. ${remaining} turn(s) remaining in jail.`);
            get().autoSave();
            get().checkAiTurn();
          }
        }
        return;
      }

      // 3 consecutive doubles = Go to jail!
      if (consecutiveDoubles >= GAME_RULES.MAX_CONSECUTIVE_DOUBLES) {
        state.addLog(`Speeding violation! ${currentPlayer.name} rolled 3 consecutive doubles and is sent directly to Central Jail!`);
        get().sendToJail(currentPlayer.id);
        get().autoSave();
        return;
      }

      // Normal movement with step animation
      get().movePlayer(currentPlayer.id, total);
    }, 600);
  },

  // Move token smoothly around 40-tile perimeter with step-by-step visual feedback
  movePlayer: (playerId, spaces) => {
    const state = get();
    const player = state.players.find((p) => p.id === playerId);
    if (!player) return;

    const oldPos = player.position;
    const newPos = (oldPos + spaces) % 40;
    const fromTile = BOARD_TILES[oldPos];
    const toTile = BOARD_TILES[newPos];
    const passedStart = oldPos + spaces >= 40 && newPos !== 0;

    // Set active movement info for interactive banner & tile highlights
    set({
      isMoving: true,
      movementInfo: {
        playerName: player.name,
        fromTileName: fromTile.name,
        toTileName: toTile.name,
        spaces,
        fromIndex: oldPos,
        toIndex: newPos,
        currentStepIndex: oldPos,
      },
      highlightedTileIndex: oldPos,
    });

    let currentStep = 0;
    const stepInterval = setInterval(() => {
      sound.playTokenMove();
      currentStep++;
      const currentPos = (oldPos + currentStep) % 40;

      // Update token position and highlighted tile live on each step!
      set((s) => ({
        highlightedTileIndex: currentPos,
        players: s.players.map((p) =>
          p.id === playerId ? { ...p, position: currentPos } : p
        ),
        movementInfo: s.movementInfo
          ? { ...s.movementInfo, currentStepIndex: currentPos }
          : null,
      }));

      if (currentStep >= spaces) {
        clearInterval(stepInterval);

        // Arrived at destination
        setTimeout(() => {
          set({
            isMoving: false,
            movementInfo: null,
            highlightedTileIndex: null,
          });

          // Passed START salary reward
          if (passedStart) {
            get().awardStartSalary(playerId);
          }

          // Handle tile landing action
          get().handleTileLanding(playerId, newPos);
          get().autoSave();
        }, 300);
      }
    }, 140);
  },

  awardStartSalary: (playerId) => {
    const state = get();
    const player = state.players.find((p) => p.id === playerId);
    if (!player) return;

    const salary = GAME_RULES.START_SALARY;
    sound.playBuyProperty();

    const isFirstTourCompletion = state.firstRoundTour && !player.hasCompletedFirstTour;

    if (state.moneyMode === 'PHYSICAL') {
      const change = makeChangeFromBank(salary, state.bank.notes);
      const updatedPlayerNotes = { ...player.notes };
      const updatedBankNotes = { ...state.bank.notes };

      Object.entries(change.changeNotes).forEach(([d, count]) => {
        updatedPlayerNotes[d] = (updatedPlayerNotes[d] || 0) + count;
        updatedBankNotes[d] = Math.max(0, (updatedBankNotes[d] || 0) - count);
      });

      set((s) => ({
        players: s.players.map((p) =>
          p.id === playerId
            ? {
                ...p,
                wallet: p.wallet + salary,
                notes: updatedPlayerNotes,
                hasCompletedFirstTour: true,
              }
            : p
        ),
        bank: {
          ...s.bank,
          cash: s.bank.cash - salary,
          notes: updatedBankNotes,
        },
      }));
    } else {
      set((s) => ({
        players: s.players.map((p) =>
          p.id === playerId
            ? { ...p, wallet: p.wallet + salary, hasCompletedFirstTour: true }
            : p
        ),
        bank: { ...s.bank, cash: s.bank.cash - salary },
      }));
    }

    state.recordBankTransaction({
      sender: 'Central Bank',
      receiver: player.name,
      amount: salary,
      type: 'SALARY',
      description: `Passed START - Credited merchant salary of ₹${salary}.`,
    });

    state.addLog(`${player.name} passed START and collected ₹${salary} salary!`);

    if (isFirstTourCompletion) {
      state.addLog(`🎉 ${player.name} completed the 1st Round Tour! Property purchasing is now UNLOCKED.`);
    }
  },

  // ==========================================
  // TILE LANDING LOGIC
  // ==========================================

  handleTileLanding: (playerId, tileIndex) => {
    const state = get();
    const player = state.players.find((p) => p.id === playerId);
    const tile = BOARD_TILES[tileIndex];
    if (!player || !tile) return;

    state.addLog(`${player.name} landed on ${tile.name} (Tile ${tileIndex}).`);

    // START Tile
    if (tile.type === 'START') {
      get().awardStartSalary(playerId);
      get().checkAiTurn();
      return;
    }

    // PROPERTY / RAILWAY / UTILITY
    if (['PROPERTY', 'RAILWAY', 'UTILITY'].includes(tile.type)) {
      const property = state.properties[tile.id];
      if (!property) return;

      if (!property.ownerId) {
        // Check First Round Tour Rule:
        if (state.firstRoundTour && !player.hasCompletedFirstTour) {
          state.addLog(`Touring: ${player.name} is on 1st round warm-up tour. Buying unlocks after crossing START!`);
          get().checkAiTurn();
          return;
        }

        // Unowned property: prompt purchase or auction
        set({
          pendingAction: {
            type: 'BUY_OR_AUCTION',
            propertyId: tile.id,
            playerId,
          },
          activeModal: 'BUY_PROPERTY',
        });
        get().checkAiTurn();
      } else if (property.ownerId !== playerId && !property.isMortgaged) {
        // Owned by another merchant: calculate and pay visiting rent
        get().triggerRentPayment(playerId, property);
      } else if (property.isMortgaged) {
        state.addLog(`${property.name} is mortgaged. No visiting rent collected.`);
        get().checkAiTurn();
      } else {
        // Landed on own property
        state.addLog(`${player.name} is resting on their own estate at ${property.name}.`);
        get().checkAiTurn();
      }
      return;
    }

    // TAX TILE
    if (tile.type === 'TAX') {
      const taxAmount = tile.taxAmount || 1000;
      state.addLog(`${player.name} must pay ${tile.name} of ₹${taxAmount} to Central Bank.`);
      get().payTax(playerId, taxAmount, tile.name);
      return;
    }

    // CHANCE CARD
    if (tile.type === 'CHANCE') {
      get().drawCard('CHANCE', playerId);
      return;
    }

    // COMMUNITY CHEST
    if (tile.type === 'COMMUNITY') {
      get().drawCard('COMMUNITY', playerId);
      return;
    }

    // GO TO JAIL
    if (tile.type === 'GO_TO_JAIL') {
      sound.playJailSlam();
      state.addLog(`Alarm sounded! ${player.name} has been caught and sent directly to Central Jail!`);
      get().sendToJail(playerId);
      return;
    }

    // JAIL (JUST VISITING)
    if (tile.type === 'JAIL') {
      state.addLog(`${player.name} is just visiting fellow merchants in Central Jail.`);
      get().checkAiTurn();
      return;
    }

    // REST HOUSE / FREE PARKING
    if (tile.type === 'REST_HOUSE') {
      state.addLog(`${player.name} enjoys royal hospitality at the Rest House.`);
      get().checkAiTurn();
      return;
    }
  },

  // ==========================================
  // PROPERTY ACTIONS: BUY, AUCTION, MORTGAGE, BUILD
  // ==========================================

  buyProperty: (propertyId, playerId) => {
    const state = get();
    const player = state.players.find((p) => p.id === playerId);
    const property = state.properties[propertyId];
    if (!player || !property || property.ownerId) return false;

    if (!canPlayerAfford(player, property.price, state.moneyMode)) {
      sound.playError();
      state.addLog(`${player.name} has insufficient funds to purchase ${property.name}!`);
      return false;
    }

    sound.playBuyProperty();

    // Deduct cash from player
    if (state.moneyMode === 'PHYSICAL') {
      const breakdown = getGreedyNoteBreakdown(property.price, player.notes);
      const updatedNotes = { ...player.notes };
      const updatedBankNotes = { ...state.bank.notes };

      Object.entries(breakdown.notes).forEach(([d, count]) => {
        updatedNotes[d] = Math.max(0, (updatedNotes[d] || 0) - count);
        updatedBankNotes[d] = (updatedBankNotes[d] || 0) + count;
      });

      set((s) => ({
        players: s.players.map((p) =>
          p.id === playerId ? { ...p, wallet: p.wallet - property.price, notes: updatedNotes } : p
        ),
        bank: {
          ...s.bank,
          cash: s.bank.cash + property.price,
          notes: updatedBankNotes,
        },
        properties: {
          ...s.properties,
          [propertyId]: { ...property, ownerId: playerId },
        },
        activeModal: null,
        pendingAction: null,
      }));
    } else {
      set((s) => ({
        players: s.players.map((p) =>
          p.id === playerId ? { ...p, wallet: p.wallet - property.price } : p
        ),
        bank: {
          ...s.bank,
          cash: s.bank.cash + property.price,
        },
        properties: {
          ...s.properties,
          [propertyId]: { ...property, ownerId: playerId },
        },
        activeModal: null,
        pendingAction: null,
      }));
    }

    state.recordBankTransaction({
      sender: player.name,
      receiver: 'Central Bank',
      amount: property.price,
      type: 'PROPERTY_PURCHASE',
      description: `Bought deed title for ${property.name} for ₹${property.price}.`,
    });

    state.addLog(`Deed Signed! ${player.name} purchased ${property.name} for ₹${property.price}!`);
    get().autoSave();
    get().checkAiTurn();
    return true;
  },

  // Skip buying property (or prompt auction)
  skipBuyProperty: (propertyId) => {
    const state = get();
    const property = state.properties[propertyId];
    if (property) {
      state.addLog(`Deed for ${property.name} was passed by ${state.players[state.currentPlayerIndex].name}.`);
    }
    set({ activeModal: null, pendingAction: null });
    get().checkAiTurn();
  },

  // Building Houses / Hotels
  buildHouseOrHotel: (propertyId, playerId) => {
    const state = get();
    const player = state.players.find((p) => p.id === playerId);
    const property = state.properties[propertyId];
    if (!player || !property || property.ownerId !== playerId) return false;

    // Check color monopoly set
    const groupTiles = Object.values(state.properties).filter((p) => p.group === property.group);
    const ownsAllInGroup = groupTiles.every((p) => p.ownerId === playerId && !p.isMortgaged);

    if (!ownsAllInGroup) {
      sound.playError();
      state.addLog(`Cannot build: You must own all unmortgaged properties in the ${property.group} color group first!`);
      return false;
    }

    const currentCount = property.hasHotel ? 5 : property.houses;
    if (currentCount >= 5) {
      state.addLog(`Already built to maximum hotel level!`);
      return false;
    }

    const minHousesInGroup = Math.min(...groupTiles.map((p) => (p.hasHotel ? 5 : p.houses)));
    if (currentCount > minHousesInGroup) {
      sound.playError();
      state.addLog(`Even build rule: Build on other properties in the group before upgrading further.`);
      return false;
    }

    const isHotelUpgrade = property.houses === 4;
    const cost = isHotelUpgrade ? property.hotelCost : property.houseCost;

    if (!canPlayerAfford(player, cost, state.moneyMode)) {
      sound.playError();
      state.addLog(`Insufficient cash to construct on ${property.name}. Required: ₹${cost}`);
      return false;
    }

    // Check bank inventory
    if (isHotelUpgrade && state.bank.hotelsRemaining <= 0) {
      sound.playError();
      state.addLog(`Bank has no hotels left in inventory!`);
      return false;
    }
    if (!isHotelUpgrade && state.bank.housesRemaining <= 0) {
      sound.playError();
      state.addLog(`Bank has no houses left in inventory!`);
      return false;
    }

    sound.playBuyProperty();

    set((s) => ({
      players: s.players.map((p) =>
        p.id === playerId ? { ...p, wallet: p.wallet - cost } : p
      ),
      bank: {
        ...s.bank,
        cash: s.bank.cash + cost,
        housesRemaining: isHotelUpgrade ? s.bank.housesRemaining + 4 : s.bank.housesRemaining - 1,
        hotelsRemaining: isHotelUpgrade ? s.bank.hotelsRemaining - 1 : s.bank.hotelsRemaining,
      },
      properties: {
        ...s.properties,
        [propertyId]: {
          ...property,
          houses: isHotelUpgrade ? 0 : property.houses + 1,
          hasHotel: isHotelUpgrade ? true : property.hasHotel,
        },
      },
    }));

    state.recordBankTransaction({
      sender: player.name,
      receiver: 'Central Bank',
      amount: cost,
      type: 'DEVELOPMENT',
      description: `Constructed ${isHotelUpgrade ? 'Grand Hotel' : `House #${property.houses + 1}`} on ${property.name} for ₹${cost}.`,
    });

    state.addLog(`Construction complete: ${player.name} built a ${isHotelUpgrade ? 'Grand Hotel' : 'House'} on ${property.name}!`);
    get().autoSave();
    return true;
  },

  // Mortgage property to bank
  mortgageProperty: (propertyId, playerId) => {
    const state = get();
    const player = state.players.find((p) => p.id === playerId);
    const property = state.properties[propertyId];
    if (!player || !property || property.ownerId !== playerId || property.isMortgaged) return false;

    const groupProps = Object.values(state.properties).filter((p) => p.group === property.group);
    const hasAnyBuildings = groupProps.some((p) => p.houses > 0 || p.hasHotel);
    if (hasAnyBuildings) {
      sound.playError();
      state.addLog(`Cannot mortgage: All buildings in this color group must be sold back first.`);
      return false;
    }

    const mortgageValue = property.mortgageValue || property.price / 2;
    sound.playBuyProperty();

    set((s) => ({
      players: s.players.map((p) =>
        p.id === playerId ? { ...p, wallet: p.wallet + mortgageValue } : p
      ),
      bank: {
        ...s.bank,
        cash: s.bank.cash - mortgageValue,
      },
      properties: {
        ...s.properties,
        [propertyId]: { ...property, isMortgaged: true },
      },
    }));

    state.recordBankTransaction({
      sender: 'Central Bank',
      receiver: player.name,
      amount: mortgageValue,
      type: 'MORTGAGE',
      description: `Mortgaged ${property.name} for ₹${mortgageValue}.`,
    });

    state.addLog(`${player.name} mortgaged ${property.name} to the Bank for ₹${mortgageValue}.`);
    get().autoSave();
    return true;
  },

  // Unmortgage property from bank
  unmortgageProperty: (propertyId, playerId) => {
    const state = get();
    const player = state.players.find((p) => p.id === playerId);
    const property = state.properties[propertyId];
    if (!player || !property || property.ownerId !== playerId || !property.isMortgaged) return false;

    const baseVal = property.mortgageValue || property.price / 2;
    const repaymentCost = Math.round(baseVal * (1 + GAME_RULES.UNMORTGAGE_INTEREST));

    if (!canPlayerAfford(player, repaymentCost, state.moneyMode)) {
      sound.playError();
      state.addLog(`Insufficient funds to unmortgage. Need ₹${repaymentCost}`);
      return false;
    }

    sound.playRentPay();

    set((s) => ({
      players: s.players.map((p) =>
        p.id === playerId ? { ...p, wallet: p.wallet - repaymentCost } : p
      ),
      bank: {
        ...s.bank,
        cash: s.bank.cash + repaymentCost,
      },
      properties: {
        ...s.properties,
        [propertyId]: { ...property, isMortgaged: false },
      },
    }));

    state.recordBankTransaction({
      sender: player.name,
      receiver: 'Central Bank',
      amount: repaymentCost,
      type: 'MORTGAGE_REPAYMENT',
      description: `Repaid mortgage with interest on ${property.name} for ₹${repaymentCost}.`,
    });

    state.addLog(`${player.name} repaid mortgage on ${property.name} for ₹${repaymentCost}. Title deed restored!`);
    get().autoSave();
    return true;
  },

  // ==========================================
  // RENT CALCULATION & PAYMENT ENGINE
  // ==========================================

  calculateRent: (property, diceTotal = 7) => {
    const state = get();
    if (!property || property.isMortgaged) return 0;

    // Railway rent
    if (property.type === 'RAILWAY') {
      const allRailways = Object.values(state.properties).filter(
        (p) => p.type === 'RAILWAY' && p.ownerId === property.ownerId && !p.isMortgaged
      );
      const count = allRailways.length;
      if (count === 1) return 250;
      if (count === 2) return 500;
      if (count === 3) return 1000;
      if (count >= 4) return 2000;
      return 250;
    }

    // Utility rent
    if (property.type === 'UTILITY') {
      const allUtilities = Object.values(state.properties).filter(
        (p) => p.type === 'UTILITY' && p.ownerId === property.ownerId && !p.isMortgaged
      );
      const count = allUtilities.length;
      const multiplier = count === 2 ? 10 : 4;
      return multiplier * diceTotal * 10;
    }

    // Standard Property
    if (property.hasHotel) {
      return property.rentWithHotel;
    }
    if (property.houses === 4) return property.rentWith4;
    if (property.houses === 3) return property.rentWith3;
    if (property.houses === 2) return property.rentWith2;
    if (property.houses === 1) return property.rentWith1;

    const groupTiles = Object.values(state.properties).filter((p) => p.group === property.group);
    const ownsAllInGroup = groupTiles.every((p) => p.ownerId === property.ownerId);

    return ownsAllInGroup ? property.baseRent * 2 : property.baseRent;
  },

  triggerRentPayment: (payerId, property) => {
    const state = get();
    const diceTotal = state.dice[0] + state.dice[1];
    const rentAmount = get().calculateRent(property, diceTotal);
    const payer = state.players.find((p) => p.id === payerId);
    const owner = state.players.find((p) => p.id === property.ownerId);

    if (!payer || !owner || rentAmount <= 0) {
      get().checkAiTurn();
      return;
    }

    set({
      pendingAction: {
        type: 'PAY_RENT',
        payerId,
        ownerId: owner.id,
        propertyId: property.id,
        amount: rentAmount,
      },
      activeModal: 'RENT',
    });

    state.addLog(`Rent due! ${payer.name} owes ₹${rentAmount} visiting rent to ${owner.name} for ${property.name}.`);

    if (payer.isAi) {
      setTimeout(() => {
        get().executeRentPayment();
      }, 700);
    }
  },

  executeRentPayment: () => {
    const state = get();
    const action = state.pendingAction;
    if (!action || action.type !== 'PAY_RENT') return;

    const { payerId, ownerId, propertyId, amount } = action;
    const payer = state.players.find((p) => p.id === payerId);
    const owner = state.players.find((p) => p.id === ownerId);
    const property = state.properties[propertyId];

    if (!payer || !owner) return;

    if (!canPlayerAfford(payer, amount, state.moneyMode)) {
      state.addLog(`${payer.name} does not have enough liquid cash to pay ₹${amount} rent!`);
      get().handleDebtOrBankruptcy(payerId, ownerId, amount);
      return;
    }

    sound.playRentPay();

    set((s) => ({
      players: s.players.map((p) => {
        if (p.id === payerId) return { ...p, wallet: p.wallet - amount };
        if (p.id === ownerId) return { ...p, wallet: p.wallet + amount };
        return p;
      }),
      activeModal: null,
      pendingAction: null,
    }));

    state.recordBankTransaction({
      sender: payer.name,
      receiver: owner.name,
      amount,
      type: 'RENT',
      description: `Visiting rent paid for ${property ? property.name : 'Estate'}.`,
    });

    state.addLog(`Transaction recorded: ${payer.name} paid ₹${amount} visiting rent to ${owner.name}.`);
    get().autoSave();
    get().checkAiTurn();
  },

  // ==========================================
  // TAX, JAIL & CARDS ENGINE
  // ==========================================

  payTax: (playerId, amount, taxName) => {
    const state = get();
    const player = state.players.find((p) => p.id === playerId);
    if (!player) return;

    if (!canPlayerAfford(player, amount, state.moneyMode)) {
      state.addLog(`${player.name} cannot pay government taxes! Liquidation required.`);
      get().handleDebtOrBankruptcy(playerId, 'BANK', amount);
      return;
    }

    sound.playRentPay();

    set((s) => ({
      players: s.players.map((p) =>
        p.id === playerId ? { ...p, wallet: p.wallet - amount } : p
      ),
      bank: {
        ...s.bank,
        cash: s.bank.cash + amount,
      },
    }));

    state.recordBankTransaction({
      sender: player.name,
      receiver: 'Central Bank',
      amount,
      type: 'TAX',
      description: `${taxName} remitted to government treasury.`,
    });

    state.addLog(`${player.name} paid ₹${amount} ${taxName} to the Bank.`);
    get().autoSave();
    get().checkAiTurn();
  },

  sendToJail: (playerId) => {
    const state = get();
    sound.playJailSlam();

    set((s) => ({
      players: s.players.map((p) =>
        p.id === playerId
          ? {
              ...p,
              isInJail: true,
              jailTurnsRemaining: GAME_RULES.MAX_JAIL_TURNS,
              position: 10,
            }
          : p
      ),
      consecutiveDoubles: 0,
      activeModal: 'JAIL',
      pendingAction: { type: 'JAIL', playerId },
    }));

    state.addLog(`Lockup! ${state.players.find((p) => p.id === playerId)?.name} is behind bars in Central Jail!`);
    get().autoSave();
  },

  releaseFromJail: (playerId) => {
    set((s) => ({
      players: s.players.map((p) =>
        p.id === playerId
          ? { ...p, isInJail: false, jailTurnsRemaining: 0 }
          : p
      ),
      activeModal: null,
      pendingAction: null,
    }));
  },

  payJailFine: (playerId) => {
    const state = get();
    const player = state.players.find((p) => p.id === playerId);
    if (!player) return false;

    const fine = GAME_RULES.JAIL_FINE;
    if (!canPlayerAfford(player, fine, state.moneyMode)) {
      state.addLog(`${player.name} cannot afford ₹${fine} bail fine!`);
      return false;
    }

    sound.playRentPay();

    set((s) => ({
      players: s.players.map((p) =>
        p.id === playerId
          ? { ...p, wallet: p.wallet - fine, isInJail: false, jailTurnsRemaining: 0 }
          : p
      ),
      bank: {
        ...s.bank,
        cash: s.bank.cash + fine,
      },
      activeModal: null,
      pendingAction: null,
    }));

    state.recordBankTransaction({
      sender: player.name,
      receiver: 'Central Bank',
      amount: fine,
      type: 'FINE',
      description: 'Court bail fine paid for release from Central Jail.',
    });

    state.addLog(`${player.name} paid ₹${fine} bail fine and is released from Central Jail.`);
    get().autoSave();
    get().checkAiTurn();
    return true;
  },

  useJailCard: (playerId) => {
    const state = get();
    const player = state.players.find((p) => p.id === playerId);
    if (!player || player.getOutOfJailCards <= 0) return false;

    set((s) => ({
      players: s.players.map((p) =>
        p.id === playerId
          ? {
              ...p,
              getOutOfJailCards: p.getOutOfJailCards - 1,
              isInJail: false,
              jailTurnsRemaining: 0,
            }
          : p
      ),
      activeModal: null,
      pendingAction: null,
    }));

    state.addLog(`${player.name} utilized a 'Get Out of Jail Free' pass and walked out a free merchant!`);
    get().autoSave();
    get().checkAiTurn();
    return true;
  },

  // Draw Chance or Community Chest card
  drawCard: (deckType, playerId) => {
    const state = get();
    const player = state.players.find((p) => p.id === playerId);
    if (!player) return;

    sound.playCardDraw();

    const deckKey = deckType === 'CHANCE' ? 'chanceDeck' : 'communityDeck';
    const deck = [...state[deckKey]];
    const card = deck.shift();
    deck.push(card);

    set({
      [deckKey]: deck,
      drawnCard: { card, deckType },
      activeModal: 'CARD',
    });

    state.addLog(`${player.name} drew a ${deckType} card: "${card.title}"`);
    get().autoSave();

    if (player.isAi) {
      setTimeout(() => {
        get().applyCardEffect();
      }, 1200);
    }
  },

  applyCardEffect: () => {
    const state = get();
    const drawn = state.drawnCard;
    if (!drawn) return;

    const { card } = drawn;
    const player = state.players[state.currentPlayerIndex];
    if (!player) return;

    set({ activeModal: null, drawnCard: null });

    switch (card.actionType) {
      case 'MOVE_TILE':
        if (card.collectStart && card.targetTileIndex < player.position && card.targetTileIndex !== 0) {
          get().awardStartSalary(player.id);
        }
        get().movePlayer(player.id, (card.targetTileIndex - player.position + 40) % 40);
        break;

      case 'MOVE_SPACES':
        const newPos = (player.position + card.amount + 40) % 40;
        set((s) => ({
          players: s.players.map((p) =>
            p.id === player.id ? { ...p, position: newPos } : p
          ),
        }));
        get().handleTileLanding(player.id, newPos);
        break;

      case 'MONEY_BANK':
        if (card.amount > 0) {
          sound.playBuyProperty();
          set((s) => ({
            players: s.players.map((p) =>
              p.id === player.id ? { ...p, wallet: p.wallet + card.amount } : p
            ),
            bank: { ...s.bank, cash: s.bank.cash - card.amount },
          }));
          state.recordBankTransaction({
            sender: 'Central Bank',
            receiver: player.name,
            amount: card.amount,
            type: 'BONUS',
            description: card.title,
          });
          state.addLog(`${player.name} received ₹${card.amount} from Bank (${card.title}).`);
        } else {
          const amt = Math.abs(card.amount);
          get().payTax(player.id, amt, card.title);
        }
        get().checkAiTurn();
        break;

      case 'MONEY_PLAYERS':
        const activeOthers = state.players.filter((p) => p.id !== player.id && !p.isBankrupt);
        const perPlayerAmount = Math.abs(card.amount);

        if (card.amount > 0) {
          set((s) => ({
            players: s.players.map((p) => {
              if (p.id === player.id) {
                return { ...p, wallet: p.wallet + perPlayerAmount * activeOthers.length };
              }
              if (!p.isBankrupt) {
                return { ...p, wallet: Math.max(0, p.wallet - perPlayerAmount) };
              }
              return p;
            }),
          }));
          state.addLog(`${player.name} collected ₹${perPlayerAmount} gift from all merchants!`);
        } else {
          set((s) => ({
            players: s.players.map((p) => {
              if (p.id === player.id) {
                return { ...p, wallet: Math.max(0, p.wallet - perPlayerAmount * activeOthers.length) };
              }
              if (!p.isBankrupt) {
                return { ...p, wallet: p.wallet + perPlayerAmount };
              }
              return p;
            }),
          }));
          state.addLog(`${player.name} paid ₹${perPlayerAmount} felicitations to each merchant.`);
        }
        get().checkAiTurn();
        break;

      case 'GO_TO_JAIL':
        get().sendToJail(player.id);
        break;

      case 'GET_OUT_OF_JAIL':
        set((s) => ({
          players: s.players.map((p) =>
            p.id === player.id ? { ...p, getOutOfJailCards: p.getOutOfJailCards + 1 } : p
          ),
        }));
        state.addLog(`${player.name} obtained a valuable 'Get Out of Jail Free' pass!`);
        get().checkAiTurn();
        break;

      case 'REPAIRS':
        let houseCount = 0;
        let hotelCount = 0;
        Object.values(state.properties).forEach((p) => {
          if (p.ownerId === player.id) {
            if (p.hasHotel) hotelCount++;
            else houseCount += p.houses;
          }
        });
        const totalRepairs = houseCount * (card.houseCost || 200) + hotelCount * (card.hotelCost || 800);
        state.addLog(`${player.name} owes ₹${totalRepairs} repair taxes (${houseCount} houses, ${hotelCount} hotels).`);
        get().payTax(player.id, totalRepairs, 'Property Renovation Assessment');
        break;

      default:
        get().checkAiTurn();
        break;
    }
  },

  // ==========================================
  // TRADING ENGINE
  // ==========================================

  executeTrade: (proposal) => {
    const {
      senderId,
      receiverId,
      offeredPropertyIds = [],
      offeredCash = 0,
      requestedPropertyIds = [],
      requestedCash = 0,
    } = proposal;

    const state = get();
    const sender = state.players.find((p) => p.id === senderId);
    const receiver = state.players.find((p) => p.id === receiverId);

    if (!sender || !receiver) return false;

    if (sender.wallet < offeredCash || receiver.wallet < requestedCash) {
      sound.playError();
      state.addLog(`Trade rejected: Insufficient cash balance for proposal.`);
      return false;
    }

    const cannotTrade = [...offeredPropertyIds, ...requestedPropertyIds].some((pid) => {
      const prop = state.properties[pid];
      return prop && (prop.houses > 0 || prop.hasHotel);
    });

    if (cannotTrade) {
      sound.playError();
      state.addLog(`Trade rejected: Cannot trade properties with active houses or hotels.`);
      return false;
    }

    sound.playBuyProperty();

    const updatedProperties = { ...state.properties };
    offeredPropertyIds.forEach((pid) => {
      if (updatedProperties[pid]) updatedProperties[pid] = { ...updatedProperties[pid], ownerId: receiverId };
    });
    requestedPropertyIds.forEach((pid) => {
      if (updatedProperties[pid]) updatedProperties[pid] = { ...updatedProperties[pid], ownerId: senderId };
    });

    set((s) => ({
      properties: updatedProperties,
      players: s.players.map((p) => {
        if (p.id === senderId) {
          return { ...p, wallet: p.wallet - offeredCash + requestedCash };
        }
        if (p.id === receiverId) {
          return { ...p, wallet: p.wallet - requestedCash + offeredCash };
        }
        return p;
      }),
      activeModal: null,
    }));

    state.recordBankTransaction({
      sender: sender.name,
      receiver: receiver.name,
      amount: Math.abs(offeredCash - requestedCash),
      type: 'TRADE',
      description: `Bilateral property & cash trade agreement ratified.`,
    });

    state.addLog(`Deal Sealed! Trade finalized between ${sender.name} and ${receiver.name}.`);
    get().autoSave();
    return true;
  },

  // ==========================================
  // BANKRUPTCY & VICTORY ENGINE
  // ==========================================

  handleDebtOrBankruptcy: (debtorId, creditorId, amountOwed) => {
    const state = get();
    const debtor = state.players.find((p) => p.id === debtorId);
    if (!debtor) return;

    sound.playError();
    state.addLog(`Bankruptcy Alert! ${debtor.name} is declaring insolvency!`);

    const updatedProps = { ...state.properties };
    const targetOwner = creditorId === 'BANK' ? null : creditorId;

    Object.keys(updatedProps).forEach((pid) => {
      if (updatedProps[pid].ownerId === debtorId) {
        updatedProps[pid] = {
          ...updatedProps[pid],
          ownerId: targetOwner,
          houses: 0,
          hasHotel: false,
          isMortgaged: false,
        };
      }
    });

    set((s) => ({
      properties: updatedProps,
      players: s.players.map((p) =>
        p.id === debtorId ? { ...p, isBankrupt: true, wallet: 0 } : p
      ),
      activeModal: null,
      pendingAction: null,
    }));

    state.addLog(`${debtor.name} has gone BANKRUPT and surrendered all assets.`);

    const activePlayers = get().players.filter((p) => !p.isBankrupt);
    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      sound.playVictory();
      set({ winner, activeModal: 'WINNER', status: 'GAME_OVER' });
      state.addLog(`CONGRATULATIONS! ${winner.name} is crowned the Supreme Vyapar Tycoon!`);
    } else {
      get().endTurn();
    }
  },

  // ==========================================
  // TURN MANAGEMENT & ROUND ENGINE
  // ==========================================

  endTurn: () => {
    const state = get();
    if (!state.hasRolled && !state.players[state.currentPlayerIndex]?.isInJail) {
      return;
    }

    const currentPlayer = state.players[state.currentPlayerIndex];
    if (state.isDoubles && !currentPlayer.isInJail && !currentPlayer.isBankrupt && state.consecutiveDoubles < 3) {
      state.addLog(`${currentPlayer.name} gets an extra turn for rolling doubles!`);
      set({
        hasRolled: false,
        isDoubles: false,
        movementInfo: null,
        highlightedTileIndex: null,
      });
      get().autoSave();
      get().checkAiTurn();
      return;
    }

    let nextIdx = (state.currentPlayerIndex + 1) % state.players.length;
    let roundIncrement = nextIdx === 0 ? 1 : 0;

    let attempts = 0;
    while (state.players[nextIdx].isBankrupt && attempts < state.players.length) {
      nextIdx = (nextIdx + 1) % state.players.length;
      if (nextIdx === 0) roundIncrement = 1;
      attempts++;
    }

    const newRound = state.round + roundIncrement;
    if (state.maxRounds > 0 && newRound > state.maxRounds) {
      const active = state.players.filter((p) => !p.isBankrupt);
      let topPlayer = active[0];
      let maxWorth = -1;
      active.forEach((p) => {
        let worth = p.wallet;
        Object.values(state.properties).forEach((pr) => {
          if (pr.ownerId === p.id) worth += pr.price;
        });
        if (worth > maxWorth) {
          maxWorth = worth;
          topPlayer = p;
        }
      });
      sound.playVictory();
      set({ winner: topPlayer, activeModal: 'WINNER', status: 'GAME_OVER' });
      return;
    }

    set({
      currentPlayerIndex: nextIdx,
      round: newRound,
      hasRolled: false,
      isDoubles: false,
      consecutiveDoubles: 0,
      activeModal: null,
      pendingAction: null,
      movementInfo: null,
      highlightedTileIndex: null,
    });

    state.addLog(`Turn begins: ${state.players[nextIdx].name}'s turn (Round ${newRound}).`);
    get().autoSave();

    setTimeout(() => {
      get().checkAiTurn();
    }, 600);
  },

  // ==========================================
  // AI AUTOMATION ENGINE
  // ==========================================

  checkAiTurn: () => {
    const state = get();
    if (state.status !== 'PLAYING') return;

    const current = state.players[state.currentPlayerIndex];
    if (!current || !current.isAi || current.isBankrupt) return;

    if (current.isInJail) {
      setTimeout(() => {
        if (current.getOutOfJailCards > 0) {
          get().useJailCard(current.id);
        } else if (current.wallet >= 2000 && (current.aiDifficulty === 'HARD' || Math.random() > 0.5)) {
          get().payJailFine(current.id);
        } else if (!state.hasRolled) {
          get().rollDice();
        } else {
          get().endTurn();
        }
      }, 700);
      return;
    }

    if (state.pendingAction && state.pendingAction.type === 'BUY_OR_AUCTION') {
      const prop = state.properties[state.pendingAction.propertyId];
      if (prop) {
        setTimeout(() => {
          let shouldBuy = false;
          if (current.aiDifficulty === 'EASY') {
            shouldBuy = current.wallet > prop.price && Math.random() > 0.3;
          } else if (current.aiDifficulty === 'MEDIUM') {
            shouldBuy = current.wallet > prop.price * 1.5;
          } else {
            shouldBuy = current.wallet - prop.price >= 500;
          }

          if (shouldBuy) {
            get().buyProperty(prop.id, current.id);
          } else {
            get().skipBuyProperty(prop.id);
          }
        }, 800);
      }
      return;
    }

    if (state.pendingAction && state.pendingAction.type === 'PAY_RENT') {
      setTimeout(() => {
        get().executeRentPayment();
      }, 800);
      return;
    }

    if (!state.hasRolled && !state.isRolling && !state.isMoving) {
      setTimeout(() => {
        get().rollDice();
      }, 800);
      return;
    }

    if (state.hasRolled && !state.isMoving && !state.activeModal) {
      setTimeout(() => {
        if (['MEDIUM', 'HARD'].includes(current.aiDifficulty) && current.wallet > 3000) {
          const ownedProps = Object.values(state.properties).filter((p) => p.ownerId === current.id);
          for (const p of ownedProps) {
            if (!p.hasHotel && current.wallet > 2000) {
              const built = get().buildHouseOrHotel(p.id, current.id);
              if (built) break;
            }
          }
        }
        get().endTurn();
      }, 1000);
    }
  },

  // Save current game state to local storage
  autoSave: () => {
    saveActiveGameToStorage(get());
  },
}));
