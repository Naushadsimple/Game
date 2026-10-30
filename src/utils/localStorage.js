// LocalStorage game persistence and multi-save management

const ACTIVE_GAME_KEY = 'vyapar_active_game_v1';
const SAVED_GAMES_LIST_KEY = 'vyapar_saved_games_manifest_v1';

export function saveActiveGameToStorage(gameState) {
  if (typeof window === 'undefined') return;
  try {
    const payload = {
      version: 1,
      updatedAt: new Date().toISOString(),
      state: gameState,
    };
    window.localStorage.setItem(ACTIVE_GAME_KEY, JSON.stringify(payload));
  } catch (err) {
    console.error('Failed to auto-save game:', err);
  }
}

export function loadActiveGameFromStorage() {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(ACTIVE_GAME_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed && parsed.state) {
      return parsed.state;
    }
  } catch (err) {
    console.error('Failed to load active game:', err);
  }
  return null;
}

export function clearActiveGameFromStorage() {
  if (typeof window === 'undefined') return;
  try {
    window.localStorage.removeItem(ACTIVE_GAME_KEY);
  } catch (err) {
    console.error('Failed to clear active game:', err);
  }
}

export function getSavedGamesList() {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(SAVED_GAMES_LIST_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch (err) {
    console.error('Failed to get saved games manifest:', err);
    return [];
  }
}

export function saveGameSlot(id, name, gameState) {
  if (typeof window === 'undefined') return false;
  try {
    const list = getSavedGamesList();
    const existingIdx = list.findIndex((item) => item.id === id);
    const meta = {
      id: id || `game_${Date.now()}`,
      name: name || `Saved Game ${list.length + 1}`,
      savedAt: new Date().toISOString(),
      playersCount: gameState.players ? gameState.players.length : 0,
      round: gameState.round || 1,
      moneyMode: gameState.moneyMode || 'VIRTUAL',
    };

    if (existingIdx >= 0) {
      list[existingIdx] = meta;
    } else {
      list.unshift(meta);
    }

    // Save manifest and full game state
    window.localStorage.setItem(SAVED_GAMES_LIST_KEY, JSON.stringify(list));
    window.localStorage.setItem(`vyapar_save_data_${meta.id}`, JSON.stringify(gameState));
    return meta;
  } catch (err) {
    console.error('Failed to save game slot:', err);
    return false;
  }
}

export function loadGameSlot(id) {
  if (typeof window === 'undefined') return null;
  try {
    const raw = window.localStorage.getItem(`vyapar_save_data_${id}`);
    return raw ? JSON.parse(raw) : null;
  } catch (err) {
    console.error('Failed to load saved game slot:', err);
    return null;
  }
}

export function deleteGameSlot(id) {
  if (typeof window === 'undefined') return false;
  try {
    const list = getSavedGamesList().filter((item) => item.id !== id);
    window.localStorage.setItem(SAVED_GAMES_LIST_KEY, JSON.stringify(list));
    window.localStorage.removeItem(`vyapar_save_data_${id}`);
    return true;
  } catch (err) {
    console.error('Failed to delete game slot:', err);
    return false;
  }
}
