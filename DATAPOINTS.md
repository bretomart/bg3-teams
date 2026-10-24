# Baldur's Gate 3 Party Architect: Min-Maxing Foundations, Build Mechanics, and Tactical References

This document outlines the theoretical, mathematical, and community-sourced foundations underlying the build configurations, item assignments, and team synergies implemented in [`src/data/companions.json`](./src/data/companions.json) and [`src/data/metaTeams.json`](./src/data/metaTeams.json).

---

## 1. Core Optimization Principles for Honor Mode

In Baldur's Gate 3 Honor Mode, traditional D&D 5th Edition theorycrafting (which often models average damage per round against static targets) falls short. A single wiped encounter or cascaded legendary reaction terminates a 30 to 80 hour campaign.

Consequently, all builds in this tool are engineered around three core optimization pillars:
1. **Variance Elimination (Deterministic Guarantees)**: Replacing 60% to 70% probability checks with 95% to 100% mathematical certainty via mechanics like Tavern Brawler and Arcane Acuity.
2. **Turn 1 Action Dominance (The 1d4 Initiative Economy)**: Exploiting Baldur's Gate 3's 1d4 initiative die to guarantee that all four party members act before the enemy, preventing boss legendary actions from triggering.
3. **Multi-Condition Synergies (Saving Throw Bypass)**: Prioritizing mechanics that apply debilitating conditions (such as Wet vulnerability, Enraged Throw prone, and Radiant Orb attack penalties) without requiring enemy saving throws.

---

## 2. Comprehensive Build Breakdown and Mechanical Exploits

### 2.1 The "Control God" Swords Bard (10 Swords Bard / 1 Fighter / 1 Wizard)
* **Canonical Role**: Controller / Party Face / Ranged Striker
* **Community Origin**: Formulated, tested, and documented by **Prestigious_Juice** on r/BG3Builds; established as the premier solo and party carry in Patch 5 through Patch 7.
* **Class Split Rationale**:
  * **10 Swords Bard**: Unlocks full 6th-level spell slot progression, d10 Bardic Inspiration dice recharging on short rest, and Magical Secrets (*Command*, *Counterspell*, or *Banishing Smite*). Slashing Flourish (Ranged) targets two distinct enemies or the same enemy twice per attack, granting 4 arrow attacks on Turn 1 without spending bonus actions.
  * **1 Fighter**: Taken at Level 1 for Constitution saving throw proficiency (protecting concentration), heavy armor and shield proficiency, and the Archery Fighting Style (+2 flat attack bonus, offsetting the -5 penalty from the *Sharpshooter* feat).
  * **1 Wizard**: Enables scribing scrolls up to 6th level based on total character caster level. Grants access to *Shield*, *Misty Step*, *Globe of Invulnerability*, and *Otto's Irresistible Dance* using Intelligence gear (such as the Warped Headband of Intellect) or un-targeted utility spells.
* **The Synergy Loop**: **Helmet of Arcane Acuity + Band of the Mystic Scoundrel**.
  1. Attack 1 and 2 (Slashing Flourish): 4 arrow hits generate +8 to +10 stacks of Arcane Acuity (+8 to +10 bonus to Spell Save DC and spell attack rolls).
  2. The Band of the Mystic Scoundrel converts illusion and enchantment spells to **Bonus Actions**.
  3. The Bard casts an upcast *Hold Person*, *Hold Monster*, or *Command: Grovel* with an effective Spell Save DC of 24 to 28. Because Act 3 bosses rarely exceed a +11 saving throw bonus, the success probability reaches the hardcoded **100% ceiling**.
  4. The boss is paralyzed or incapacitated, granting automatic critical hits to all adjacent melee party members and completely preventing their Legendary Actions from firing.

---

### 2.2 The "Throwzerker" (5 Berserker Barbarian / 4 Thief Rogue / 3 Champion Fighter)
* **Canonical Role**: Physical Striker / Prone Enabler
* **Community Origin**: Standardized across the competitive speedrunning and solo Honor Mode community; detailed by **Sin Tee** and **Remlap**.
* **Class Split Rationale**:
  * **5 Berserker Barbarian**: Grants **Enraged Throw** (throwing items or weapons as a bonus action) and Extra Attack at level 5. Crucially, **Enraged Throw applies the Prone condition without a saving throw** if the thrown object has sufficient weight.
  * **4 Thief Rogue**: Grants **Fast Hands** (a permanent second bonus action every turn) and an essential feat at rogue level 4.
  * **3 Champion Fighter**: Grants a Fighting Style (Defense or Dueling), **Action Surge** for nova rounds, and reduces the critical strike threshold to 19.
* **The Mechanics Exploited**:
  * **Tavern Brawler (Feat)**: Larian's implementation of Tavern Brawler adds the Strength modifier **twice** to attack rolls and twice to damage rolls for thrown weapons and unarmed strikes. Paired with Hill Giant (21 STR) or Cloud Giant (27 STR) elixirs, the attack roll bonus reaches +10 to +16. This shatters 5e's bounded accuracy, raising hit rates from 65% to a guaranteed 95% ceiling (missing only on a natural 1).
  * **Weight and Crushing Damage**: Weapons like the *Returning Pike* (Act 1 Goblin Camp) and *Nyrulna* (Act 3 Circus) trigger crushing physical impact and area-of-effect thunder bursts upon returning. Paired with the *Ring of Flinging* (+1d4) and *Gloves of Uninhibited Kushigo* (+1d4), every throw delivers 35 to 55 damage with zero resource consumption.
  * **Total Turn Economy**: 2 main attacks + 2 enraged throw bonus action attacks = 4 throws per round, every round, knocking two targets prone without a save.

---

### 2.3 The "TB Pugilist" (8 Open Hand Monk / 4 Thief Rogue)
* **Canonical Role**: Sustained Melee Striker / Single-Target Boss Eraser
* **Community Origin**: Tested and popularized by **Cephalopocalypse** and **Colby (d4: D&D Deep Dive)**; widely recognized as the highest sustained single-target damage dealer in the game.
* **Class Split Rationale**:
  * **8 Open Hand Monk**: Grants *Manifestation of Body/Mind/Soul* (an extra 1d4 + WIS modifier necrotic, radiant, or psychic damage on every unarmed strike), *Wholeness of Body* (restores Ki and grants a third bonus action for 3 turns), and 2 feats.
  * **4 Thief Rogue**: Second permanent bonus action via Fast Hands. Because Monk's **Flurry of Blows** costs 1 bonus action and 1 Ki point, two bonus actions grant two Flurries of Blows (4 strikes) in addition to the 2 main action attacks.
* **The Mechanics Exploited**:
  * **6 to 8 Strikes per Round**: At Level 9+, with *Boots of Uninhibited Kushigo* (adding WIS mod to damage) and *Gloves of Soul Catching* (+1d10 force damage), each punch deals 30 to 45 damage. A full round delivers 200 to 320 damage without spending spell slots.
  * **Flurry of Blows: Topple / Stagger**: Incapacitates reactions or knocks targets prone without provoking opportunity attacks, neutralizing legendary actions on Turn 1.

---

### 2.4 The "Radiating Orb Lawnmower" (12 Light Cleric)
* **Canonical Role**: Defensive Debuffer / AoE Blaster / Anti-Undead Carry
* **Community Origin**: Pioneered by **Prestigious_Juice**; recognized as the primary defensive anchor for Act 2 and Act 3.
* **Class Split Rationale**:
  * **12 Light Cleric (or 11 Light / 1 Storm Sorcerer)**: Unlocks *Radiance of the Dawn* (massive Act 1 and 2 channel divinity clearing entire screens) and *Spirit Guardians*.
* **The Mechanics Exploited: The Radiating Orb and Reverberation Debuff Engine**:
  * **Luminous Armor** (Act 1 Selunite Outpost): Whenever radiant damage is dealt, it creates a radiant shockwave applying **Radiating Orb** to all nearby enemies. Each stack inflicts a flat **-1 penalty to enemy attack rolls** (capping at -10).
  * **Coruscation Ring + Callous Glow Ring**: Adds radiant damage to all spell attacks and applies 2 extra orb stacks to illuminated targets.
  * **Boots of Stormy Clamour + Gloves of Belligerent Skies**: Applies **Reverberation** whenever a condition or radiant damage is applied. At 5 stacks, Reverberation detonates for 1d4 thunder damage and forces a DC 10 Constitution check against falling Prone.
  * **Tactical Result**: By simply moving past enemies with *Spirit Guardians* active, enemies suffer -10 to attack rolls and fall prone. In Honor Mode, bosses with -10 to hit cannot reliably land attacks against a party with AC 20+.

---

### 2.5 The "Destructive Wrath Hydromancer" (11 Storm Sorcerer / 1 Tempest Cleric)
* **Canonical Role**: Burst Elemental Blaster / Screen Wiper
* **Community Origin**: Classic D&D 5e / BG3 adaptation analyzed by **Colby (d4: D&D Deep Dive)** and **Mortismal Gaming**.
* **Class Split Rationale**:
  * **1 Tempest Cleric**: Gives heavy armor proficiency and **Destructive Wrath** (Channel Divinity: maximize thunder or lightning damage rolls, turning all dice into maximum values).
  * **11 Storm Sorcerer**: Access to *Chain Lightning*, *Lightning Bolt*, Metamagic (Twinned Spell, Quickened Spell, Heightened Spell), and Tempestuous Magic (fly as a bonus action without opportunity attacks).
* **The Mechanics Exploited: The Wet Condition Vulnerability Loop**:
  * Applying the *Wet* status (via *Create Water*, throwing a water bottle, or water elementals) gives targets **100% Damage Vulnerability to Lightning and Cold**. They take double damage with no saving throw.
  * A 6th-level *Chain Lightning* deals 10d8 (average 45). Destructive Wrath maximizes this to 80 damage. The Wet condition doubles it to **160 flat damage per target** across 4 targets. Twinned or Quickened, it eliminates entire boss encounters in round 1.

---

### 2.6 The "Turn 1 Assassin" (5 Gloom Stalker Ranger / 4 Assassin Rogue / 3 Battle Master Fighter)
* **Canonical Role**: Stealth Infiltrator / Surprise Round Eliminator
* **Community Origin**: Popularized by **Sin Tee** and **Aestus RPG**.
* **Class Split Rationale**:
  * **5 Gloom Stalker**: Dread Ambusher grants +3 initiative and an extra attack on Turn 1 with +1d8 damage; Extra Attack at level 5.
  * **4 Assassin**: Critical hits are guaranteed against surprised creatures; all actions and bonus actions refresh when combat begins from stealth.
  * **3 Battle Master**: *Precision Attack* and *Menacing Attack*, Action Surge, and +2 Archery style.
* **The Mechanics Exploited: The Surprise Round Alpha Strike**:
  * Combined with *Titanstring Bow* (which adds both Dexterity and Strength modifiers to damage) and *Bhaalist Armor* (which inflicts Piercing Vulnerability, doubling all bow damage within 2 meters), this character can fire 6 to 7 auto-critical arrows on Turn 1 before enemies even enter turn order, dealing upwards of 350 to 500 damage.

---

## 3. Party Composition Matrix and Encounter Counters

The 8 preset parties in [`metaTeams.json`](./src/data/metaTeams.json) were constructed to counter specific failure modes in Honor Mode:

| Preset Name | Tactical Doctrine | Failure Mode Addressed | Key Mechanical Synergy |
| :--- | :--- | :--- | :--- |
| **Tempest Cascade** | High-burst elemental elimination | Bosses that must be eliminated before Phase 2 | Wet status (2x Lightning/Cold) + Destructive Wrath maximization + Acuity crowd control. |
| **Radiant Orb Lawnmower** | Extreme defensive debuffing | Swarms of enemies and Act 2 Shadow-Cursed encounters | Luminous Armor + Spirit Guardians applying -10 attack penalties and Reverberation knockdowns. |
| **Umbral Vanguard** | Complete sight denial and advantage locking | High-accuracy ranged bosses (Gortash, Sarevok) | Hunger of Hadar + Darkness party bunker with Devil's Sight and blindness-immune gear. |
| **Brawler Alpha Strike** | Unbounded physical accuracy | High AC bosses that evade standard spell attacks | Dual Tavern Brawler engine (Throwzerker + Monk) with a 95% guaranteed hit ceiling. |
| **Arcane Acuity Dominion** | Total single-target turn denial | Bosses with catastrophic Legendary Actions (Raphael, Myrkul) | +10 Spell Save DC via weapon multi-attacks, enabling 100% bonus action Hold Monster. |
| **Verdant Hazard Lockdown** | Spatial restriction and difficult terrain | Melee swarms that wipe low-AC parties | Plant Growth (non-concentration 1/4 movement) + Sleet Storm + Repelling Blast knockback. |
| **Gloom Assassin Protocol** | Stealth initiation and turn 1 decimation | Creche Y'llek and ambush encounters | Dread Ambusher + Assassin auto-crits + Deathstalker Mantle invisibility re-triggers. |
| **Ignition Protocol** | Ranged Acuity stacking with fire spell penetration | Fire-vulnerable encounters and massive crowds | Hat of Fire Acuity + Scorching Ray stacking +10 DC, into Extended Command: Grovel. |

---

## 4. Key References and Community Acknowledgments

1. **Prestigious_Juice (Reddit / r/BG3Builds)**: Definitive guides on the 10/1/1 Control Swords Bard, Radiant Orb Light Cleric, and party itemization allocation.
2. **Sin Tee (YouTube)**: Tactician and Honor Mode build blueprints, including the 5/4/3 Berserker Throwzerker and Gloom Stalker Assassin.
3. **Colby / d4: D&D Deep Dive (YouTube)**: Mechanical evaluations of multiclassing break-points, DPR calculations, and bounded accuracy interactions.
4. **Cephalopocalypse (YouTube)**: Comprehensive class tier lists, Tavern Brawler Monk deep-dives, and Act 1 survival strategies.
5. **Remlap & r/BG3Builds Community**: Damage Rider Source (DRS) patch documentation and Honor Mode mechanical changes.
