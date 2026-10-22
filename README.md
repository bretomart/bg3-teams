# Baldur's Gate 3 Party Architect (`bg3-teams`)

A responsive, single-page application engineered for Honor Mode strategic theorycrafting, 4-person party synergy optimization, resting economy evaluation, and high-tier build planning in *Baldur's Gate 3*.

Live deployment: [https://bretomart.github.io/bg3-teams/](https://bretomart.github.io/bg3-teams/)

---

## Architectural Rationale and Scaffolding Justification

### Technical Stack Justification
* **Vue 3 Composition API (`<script setup lang="ts">`)**: The choice of Vue 3 with TypeScript guarantees component reactivity with minimal boilerplate. Complex state modifications (such as updating ability scores in the 27-point buy calculator or dynamically swapping members in the 4-party array) trigger instantaneous UI updates across all diagnostic panels without manual re-rendering.
* **Pinia Centralized Store**: Game state is split cleanly into reactive getters and actions inside [`src/stores/teamStore.ts`](./src/stores/teamStore.ts). The evaluation engine computes party synergy reports, resting viability, missing tactical benchmarks, and elemental coverage matrices in real time as single-source-of-truth computed derivations.
* **Tailwind CSS v4 & Lucide Icons**: Tailwind enables a dense, cohesive dark gaming aesthetic with low bundle overhead. Custom SVG icons (including high-resolution in-game portraits and polyhedral D20 dice components) maintain immersion while avoiding generic visual clutter.
* **Vite & Vitest**: Vite provides sub-second compilation and HMR during development, and produces a lean, highly optimized client bundle for static hosting. The automated Vitest suite validates data schema integrity, synergy evaluation rules, and custom character mutations before any deployment.

### System Architecture and Design Philosophy
1. **PCPartPicker-Style Component Matrix**:
   In *Baldur's Gate 3*, party success depends on component-level gear synergy and turn-by-turn action economy. The application provides transparent inspection matrices detailing weapon progression paths across Acts 1, 2, and 3, Best-in-Slot armor slots (Head, Chest, Gloves, Boots, Amulet, Rings, Cloaks), endgame ability score targets, and required feats.
2. **Progressive Disclosure UX Framework**:
   To prevent cognitive overload from presenting simultaneous stat blocks, spellbooks, and three campaign acts of equipment, the active 4-party strip maintains a clean glanceable macro overview. Deep build inspection is compartmentalized into tabbed workspaces (*Weapons & Equipment*, *Abilities & Feats*, *Build Strategy & Core Mechanics*, and *Combat Loop & Turn Economy*), letting users explore details strictly on demand.
3. **First-Class Protagonist (Tav) Integration**:
   Custom avatars are fully supported alongside origin companions. The custom Tav workbench features an authentic 27-point buy ability score calculator (scores 8 through 15 with non-linear point scaling) and distinct male/female static silhouette representations that persist locally across sessions.
4. **Tactical Synergy & Honor Mode Engine**:
   The engine continuously analyzes active party combinations to detect established high-performance synergy loops:
   * **Hydromancy Vulnerability Surge**: Detects Create Water / Wet application combined with Cold and Lightning bursts for 200% double damage.
   * **Tavern Brawler Absolute Accuracy Core**: Evaluates double Strength scaling on thrown weapons and unarmed flurries for 95% guaranteed hit rates.
   * **Radiating Orb Debuff Lawnmower**: Tracks radiant damage interactions applying up to -10 attack penalties and Reverberation prone knockdowns.
   * **Arcane Acuity Inescapable Control**: Evaluates rapid weapon flourish multi-hits generating +10 Spell Save DC for unshakeable bonus action crowd control.
   * **Umbral Veil (Darkness Bunker)**: Monitors magical darkness party zoning combined with Devil's Sight and blindness immunity equipment.
5. **Verified Honor Mode Meta Parties**:
   Curated catalog of tested Honor Mode team templates featuring one-click party loading, full round 1 turn sequencing, and campaign progression milestones.

---

## Local Development and Verification

### Prerequisites
* Node.js 20+ (tested on Node v22)
* npm 9+

### Installation
```bash
git clone https://github.com/bretomart/bg3-teams.git
cd bg3-teams
npm install
```

### Development Server
```bash
npm run dev
```

### Running Test Suite
Execute unit and integration tests powered by Vitest:
```bash
npm test
```

### Production Build
Compile TypeScript and generate optimized client assets:
```bash
npm run build
```

---

## License

This project is open-source under the MIT License. Baldur's Gate 3 and related assets are property of Larian Studios and Wizards of the Coast.
