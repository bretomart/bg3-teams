# Architecture Decision Records (ADR) and Tactical Systems Rationale

This document records the architectural, tactical, and user-experience decisions implemented across the application. It serves as the primary technical reference for contributors and maintainers modifying the engine, data structures, or visual systems.

---

## 1. Visual Theme Evolution: Dark-Mode SaaS to High-Fantasy Grimoire

### Context
Early iterations of the party builder utilized generic dark-slate and modern SaaS container styling (similar to generic dashboard templates). This produced visual uniformity when evaluated alongside other applications in the workspace (such as Wuthering Waves or Eurozone monitors) and lacked thematic resonance with the setting of Baldur's Gate 3 and D&D 5th Edition.

### Decision
The user interface was overhauled into an immersive high-fantasy tactical grimoire:
* **Color Palette**: Replaced neutral cool slates with deep obsidian and dark mahogany backdrops (`#0a0705`, `#120d09`), warm leather card surfaces (`#1c140e`, `#211913`), and burnished brass / antique gold metallic borders (`#d4af37`, `#8c6d37`).
* **Ornamental Accents**: Integrated corner filigrees (`✦`, `❖`), gold-leaf header gradients, and subtle leather button gradients (`btn-grimoire-leather`, `btn-grimoire-gold`) defined in [`src/style.css`](./src/style.css).
* **Restraint in Application**: Structural containers retain clean CSS grid and flex layouts. Grimoire flourishes remain accents rather than skeuomorphic clutter that obstructs data reading.

---

## 2. Typography Strategy: Specificity and Legibility over Decorative Overuse

### Context
An early pass of the high-fantasy overhaul over-applied decorative Roman titling fonts (such as `Cinzel`) across buttons, companion names, status badges, and stat inputs. Because `Cinzel` is an all-caps titling serif with wide glyph spacing, it caused immediate eye fatigue, awkward letter-spacing, and text truncation on small mobile and desktop surfaces.

### Decision
A strict typographic hierarchy was established:
1. **Primary Title and Chapter Headers**: `Cinzel` is restricted strictly to the global banner title ("Baldur's Gate 3 Party Architect") and high-level chapter anchors.
2. **Interactive UI Controls, Companion Names, Badges, and Stats**: Switched to clean, high-contrast sans-serif typography (`Plus Jakarta Sans` / `system-ui`). This ensures instant readability for build titles, class splits, and stat scores.
3. **Parchment Expository Text and Lore**: Uses `EB Garamond` with calibrated font sizes (14px to 15px) for tactical rationale and quest notes.

---

## 3. High-Precision Mechanical Terminology vs. Roleplay Ambiguity

### Context
Feedback indicated a strong user preference for technical specificity over vague immersion. In a tactical team builder for Honor Mode, users need exact mechanical feedback rather than poetic roleplay labels.

### Decision
Vague terms across the interface were mapped to explicit D&D 5e / Baldur's Gate 3 mechanics:
* `Active Adventuring Party (4 Slots)` became **Active Party Configuration (4 Combat Slots)**.
* `Party Folio` became **Party Builder & Loadout**.
* `Proven Parties` became **Meta Team Compositions**.
* `Campaign Difficulty & Tactical Risk Calibration` became **Ruleset Lethality & Camp Supply Multipliers**.
* `Tier Dial` became **Ruleset Preset (Explorer / Balanced / Tactician / Honor)**.
* `Tactical Synergy & Combat Engine` became **Party Synergy Diagnostics & Honor Mode Compliance**.
* `Combat Rites & Turn Economy` became **Turn 1 Action Economy & Spells**.

---

## 4. Multi-Tier Equipment Iconography System

### Context
Equipment matrices in [`TeamSlots.vue`](./src/components/TeamSlots.vue) previously displayed raw item names without visual iconography, or relied on generic Lucide icons that lacked game-specific context (e.g., using a circle dot for a ring or a shirt for plate armor).

### Decision
A hybrid iconography architecture was implemented in [`GearIcon.vue`](./src/components/GearIcon.vue):
1. **Authentic In-Game Texture Extraction**:
   * Extracted transparent 128x128 `.webp` item icons directly from the canonical database for all 101 distinct equipment items specified in [`companions.json`](./src/data/companions.json).
   * Assets are stored locally in [`public/items/`](./public/items/) (total disk footprint approximately 2.2 MB) and mapped via [`src/data/itemIcons.json`](./src/data/itemIcons.json).
   * This guarantees 100% offline reliability with zero runtime network calls to external wikis.
2. **Responsive Fallback Glyphs**:
   * If an item lacks an exact match or fails to load, [`GearIcon.vue`](./src/components/GearIcon.vue) falls back to custom SVG paths representing equipment slots (helm, chest armor, gauntlets, boots, amulet, rings, cloak) and 18 weapon silhouettes (greatswords, hand crossbows, longbows, rapiers, staves, halberds, tridents, etc.).
   * The icons are styled using Tailwind classes (`text-[#d4af37]`) to integrate naturally into the dark leather slot rows.

---

## 5. Party-Wide Unique Item Contention Engine

### Context
In *Baldur's Gate 3*, premier gear items (such as the *Risky Ring*, *Markoheshkir*, *Helmet of Arcane Acuity*, *Band of the Mystic Scoundrel*, and *Bhaalist Armor*) exist as single instances per campaign. Standard character planners treat builds in isolation, leading players to build four party members that inadvertently compete for the same unique piece of gear.

### Decision
Implemented real-time item conflict detection in [`src/stores/teamStore.ts`](./src/stores/teamStore.ts):
1. **Detection Algorithm**:
   * The store inspects all active companion weapons, armor slots, and rings.
   * Duplicate item assignments across distinct party slots are flagged in `report.itemContentions`.
2. **Visual Indicators**:
   * Slot cards display an amber conflict alert pill: `[!] X Item Conflict`.
   * A diagnostic banner in [`SynergyAnalysis.vue`](./src/components/SynergyAnalysis.vue) lists conflicting contenders and provides tactical allocation advice (e.g., giving *Risky Ring* to a sneak-attacking Rogue/Bard rather than a high-strength thrower).

---

## 6. Turn 1 Initiative Readiness Engine (The 1d4 Initiative Die)

### Context
A critical difference between tabletop D&D 5e and Baldur's Gate 3 is the initiative roll die. While tabletop uses a `1d20` die (creating high roll variance), Baldur's Gate 3 uses a `1d4` die. Because the die roll ranges strictly from 1 to 4, flat bonuses (such as +5 from the *Alert* feat or +3 to +4 from high Dexterity) virtually guarantee acting first. In Honor Mode, going first prevents enemy alpha-strikes and total party wipes.

### Decision
Added an Initiative Readiness module to [`src/stores/teamStore.ts`](./src/stores/teamStore.ts) and [`SynergyAnalysis.vue`](./src/components/SynergyAnalysis.vue):
* Calculates each active member's initiative modifier: `DEX Modifier + Alert Feat (+5) + Gear Bonuses`.
* Derives the party roll spread: `Roll Window = Average Init + 1 to Average Init + 4`.
* Categorizes party initiative into readiness tiers:
  * `Guaranteed Turn 1 (Honor Safe)` (Average >= +7): The party out-rolls virtually all encounter bosses.
  * `High Probability` (Average +4 to +6.9): Solid reliability, occasional contested turns against high-dexterity assassins.
  * `Ambush Risk` (Average < +4): High risk of enemy alpha strikes and legendary action cascading wipes.

---

## 7. Concentration Slot Allocation Tracker

### Context
In D&D 5e mechanics, a spellcaster can only sustain one concentration spell at a time. In party compositions, having three or four members dependent on concentration spells creates severe tactical friction and leaves the party vulnerable to area-of-effect disruption spells like *Sleet Storm*.

### Decision
Integrated a dedicated Concentration Allocation tracker in [`SynergyAnalysis.vue`](./src/components/SynergyAnalysis.vue):
* Maps active builds to their primary sustained spells (e.g., Shadowheart on *Spirit Guardians*, Gale on *Hypnotic Pattern* or *Haste*, Wyll on *Hunger of Hadar*, Tav on *Hold Monster*).
* Evaluates party concentration saturation:
  * `Optimal Distribution` (0 to 1 active concentration casters).
  * `Balanced` (2 concentration casters).
  * `Concentration Contention Hazard` (3 or more concentration casters), triggering an alert recommending defensive contingencies such as *War Caster* or *Peerless Focus* elixirs.

---

## 8. Act Progression & Power Spike Roadmap

### Context
Players and tacticians widely report that build guides only showing a static "Level 12 final build" are of limited use in Honor Mode, because the most dangerous encounters occur during early-to-mid levels (Levels 3 to 7: Grym, Inquisitor W'wargaz, Creche Y'llek).

### Decision
Added an **Act Progression Roadmap** tab to the hero inspector in [`TeamSlots.vue`](./src/components/TeamSlots.vue):
* **Act 1: The Wilderness & Underdark (Levels 1 to 5)**:
  * Documents the Level 4 feat spike (*Tavern Brawler*, *Alert*, or *Sharpshooter*).
  * Highlights Level 5 Extra Attack and 3rd-level spells.
  * Tracks essential early item acquisitions (*Returning Pike*, *Titanstring Bow*, *Phalar Aluve*).
* **Act 2: The Shadow-Cursed Lands (Levels 6 to 9)**:
  * Highlights multiclassing splits coming online at Levels 7 and 8.
  * Details critical gear checkpoints (*Helmet of Arcane Acuity*, *Risky Ring*).
  * Notes radiant damage requirements for overcoming shadow curse regeneration.
* **Act 3: Baldur's Gate City & Endgame (Levels 10 to 12)**:
  * Highlights capstone synergy items (*Band of the Mystic Scoundrel*, *Markoheshkir*).
  * Outlines 100% DC *Hold Monster* boss turn-denial loops before legendary reactions trigger.

---

## 9. Testing & Quality Assurance Contracts

When contributing changes to the engine or UI, maintain the following test and build standards:
1. **Wide Validation Suite**: Ensure [`tests/wideValidation.spec.ts`](./tests/wideValidation.spec.ts) passes across all 12 origin/custom companions, all modular weapon options, and all 4 difficulty presets.
2. **Store Logic Verification**: Ensure [`tests/teamStore.spec.ts`](./tests/teamStore.spec.ts) confirms synergy detection, hydromancy double-damage multipliers, item contention calculations, and supply scaling.
3. **Build Integrity**: Ensure `npm run build` (`vue-tsc -b && vite build`) executes cleanly with zero type errors.
