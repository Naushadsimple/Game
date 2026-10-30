# VYAPAR — Classic Indian Property Trading Game

A modern, fully playable, offline-first digital board game inspired by the traditional Indian game **Vyapar**. Built with **Next.js App Router**, **React**, **Tailwind CSS**, **Framer Motion**, **Zustand**, and **LocalStorage**.

---

## 🌟 Key Features

### 1. Dual Currency Management Modes
- **Mode A: Virtual Wallet**
  - Instant digital ledger transactions.
  - Automatic rent transfers, salary crediting on START, and tax deductions.
  - Real-time balances and net worth calculations.
- **Mode B: Physical Cash**
  - Authentic Indian Rupee currency note simulation:
    - **₹10**, **₹20**, **₹50**, **₹100**, **₹200**, **₹500**, **₹1,000**
  - Tracks player and bank note inventories.
  - Interactive **Bank Cash Exchange Desk** to break large denominations or consolidate smaller notes.
  - Identical underlying game economy across both modes.

### 2. 40-Tile Indian Property Trading Board
- **Indian Metros & Capitals**:
  - Mumbai (Nariman Point & Suburbs), Delhi NCR, Kolkata, Chennai, Bengaluru, Hyderabad, Pune, Ahmedabad, Jaipur, Surat, Chandigarh, Kochi, Goa, Bhopal, Indore, Nagpur, Patna, Varanasi, Lucknow, Bhubaneswar, Guwahati.
- **Indian Railways (4 Terminals)**:
  - Howrah Station (Eastern Railway)
  - CSMT Mumbai Terminal (Central Railway)
  - New Delhi Station (Northern Railway)
  - Chennai Central (Southern Railway)
- **Public Utilities**:
  - Electric Power Grid & Jal Board Water Works.
- **Special Tiles**:
  - START (Aarambh) with ₹2,000 salary
  - Central Tihar Jail / Just Visiting
  - Rest House / Club
  - Go To Jail!
  - Income Tax & Wealth/Luxury Tax
  - Chance & Community Chest Decks

### 3. Title Deed Tickets & Proper Landmarks
- Every property has a dedicated **Title Deed Card** featuring:
  - **High-Resolution Vector Landmark Illustrations** (Hawa Mahal, India Gate, Victoria Memorial, Howrah Bridge, Charminar, Bandra-Worli Sea Link, Marine Drive, Vidhana Soudha, etc.)
  - Full **Visiting Rent Schedule**:
    - Site alone (Base rent)
    - With 1 House, 2 Houses, 3 Houses, 4 Houses
    - With Grand Hotel
    - Color Group Monopoly double rent rule
    - House & Hotel construction costs
    - Mortgage value & repayment tariffs

### 4. Property Development & Trading
- **Even-Build Rule**: Build houses evenly across complete unmortgaged color groups.
- **Grand Hotels**: Upgrade to a luxury hotel after 4 houses.
- **Player-to-Player Trading**: Exchange properties and cash bilaterally with validation and AI valuation.
- **Mortgage Desk**: Mortgage properties for 50% value and unmortgage with 10% interest.

### 5. Central Reserve Bank of Vyapar
- Complete treasury balance tracking.
- Physical note reserves and house/hotel inventory management.
- **Immutable Transaction Audit Trail**: Every transaction records timestamp, sender, receiver, type, amount, and description with category filtering and search.

### 6. Central Jail System
- Incarceration on Go To Jail, 3 consecutive doubles, or arrest cards.
- 3 Exit pathways:
  1. Roll Doubles (up to 3 turns)
  2. Pay Bail Fine (₹500)
  3. Use Get Out of Jail Free Pass

### 7. Smart AI Opponents
- Play with 2 to 6 players: any combination of Humans and Computers.
- 3 AI Difficulty levels:
  - **Easy**: Casual play and relaxed liquidity.
  - **Medium**: Evaluates property groups and maintains balanced capital.
  - **Hard**: Aggressive monopoly pursuit, strategic mortgaging, and proactive trading.

### 8. Neo-Brutalist + Modern Minimalist UI/UX
- High-contrast 2px/3px borders with hard offset shadows.
- Cohesive color scheme: `#A9D9FF`, `#14283F`, `#FFE58A`, `#A9E8C0`, `#FF9C9C`.
- Responsive layout adapting from mobile screens to desktop widescreen.
- Procedural Web Audio API sound effects (dice rolls, token steps, cash chimes, jail clangs, victory fanfares) with mute toggle.

### 9. 100% Offline & LocalStorage Persistence
- Automatic background saves after every action.
- "Resume Match" after browser refresh or tab close.
- Saved Games archive supporting multi-slot saving, renaming, loading, and deletion.

---

## 🚀 Running the Game

The game is running locally:
```bash
# Development server
npm run dev

# Or production server
npm run build
npm start
```

Access in your browser:
**`http://localhost:3000`**
