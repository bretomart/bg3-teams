import { defineStore } from 'pinia';
import companionsData from '../data/companions.json';
import metaTeamsData from '../data/metaTeams.json';
import type {
  Companion,
  CompanionId,
  CombatRole,
  DamageType,
  MetaTeam,
  GameDifficulty,
  DifficultyRuleProfile,
  ItemContention,
  InitiativeAnalysis,
  ConcentrationAnalysis
} from '../types/companion';

const STORAGE_KEY_RECRUITED = 'bg3_recruited_companions';
const STORAGE_KEY_CUSTOM_TAV = 'bg3_custom_tav_config';
const STORAGE_KEY_DIFFICULTY = 'bg3_selected_difficulty';
const STORAGE_KEY_SELECTED_BUILDS = 'bg3_companion_selected_builds';

function readStorage(key: string): string | null {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function readJSON(key: string): unknown {
  try {
    const raw = readStorage(key);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function writeStorage(key: string, value: string) {
  try {
    localStorage.setItem(key, value);
  } catch {
    // Ignore local storage error
  }
}

export const DIFFICULTY_PROFILES: Record<GameDifficulty, DifficultyRuleProfile> = {
  Explorer: {
    id: 'Explorer',
    name: 'Explorer (Story Mode)',
    badge: 'Relaxed Rules & +100% Player HP',
    campSuppliesPerLongRest: 40,
    enemyHpScaling: '-30% Enemy Vitality',
    enemyTacticsLevel: 'Standard basic targeting',
    multiclassAllowed: false,
    permadeathOrSingleSave: false,
    legendaryBossActions: false,
    traderMarkupPercent: 0,
    summary: 'Narrative focused. Enemies have 30% reduced HP and characters gain +100% bonus HP. Multiclassing is disabled by game rules.'
  },
  Balanced: {
    id: 'Balanced',
    name: 'Balanced (Standard D&D)',
    badge: 'Standard 5e Rules Baseline',
    campSuppliesPerLongRest: 40,
    enemyHpScaling: '100% Standard Vitality',
    enemyTacticsLevel: 'Standard tactical targeting',
    multiclassAllowed: true,
    permadeathOrSingleSave: false,
    legendaryBossActions: false,
    traderMarkupPercent: 0,
    summary: 'The developer-intended standard playthrough. Balanced enemy health, standard 40 camp supply requirements, and unrestricted multiclassing.'
  },
  Tactician: {
    id: 'Tactician',
    name: 'Tactician (Hardcore Combat)',
    badge: 'Aggressive AI & 80 Camp Supplies',
    campSuppliesPerLongRest: 80,
    enemyHpScaling: '+30% Vitality & Attack Boosts',
    enemyTacticsLevel: 'Aggressive AI: hunts low-AC casters and executes downed allies',
    multiclassAllowed: true,
    permadeathOrSingleSave: false,
    legendaryBossActions: false,
    traderMarkupPercent: 20,
    summary: 'Punishing tactical challenge. Camp supply consumption doubles to 80 per long rest, merchant trade prices are inflated, and enemies prioritize squishy backliners.'
  },
  Honor: {
    id: 'Honor',
    name: 'Honor Mode (Ironman & Legendary Actions)',
    badge: 'Single Save File & Legendary Actions',
    campSuppliesPerLongRest: 80,
    enemyHpScaling: '+30% Vitality & Legendary Actions',
    enemyTacticsLevel: 'Deadly AI with Boss Legendary Actions and Reaction Attacks',
    multiclassAllowed: true,
    permadeathOrSingleSave: true,
    legendaryBossActions: true,
    traderMarkupPercent: 25,
    summary: 'The ultimate survival test. Major bosses feature non-negotiable Legendary Actions. Permadeath enforces a single save file with zero reloads on wipe.'
  }
};

export interface CustomTavConfig {
  name: string;
  gender: 'male' | 'female';
  race: string;
  subrace: string;
  background: string;
  canonicalClass: string;
  canonicalSubclass: string;
  primaryRole: CombatRole;
  secondaryRole: CombatRole;
  str: number;
  dex: number;
  con: number;
  int: number;
  wis: number;
  cha: number;
}

export interface TeamSynergyReport {
  score: number; // 0 to 100
  partyCompositionHealth: 'Transcendent' | 'Balanced' | 'Specialized' | 'Deficient';
  difficultyRules: DifficultyRuleProfile;
  roleCoverage: Record<CombatRole, number>;
  missingRoles: CombatRole[];
  shortRestAdvantageCount: number;
  restingViability: 'Excellent' | 'Moderate' | 'Resource Heavy';
  damageTypesCovered: DamageType[];
  missingCrucialDamageTypes: string[];
  hasFace: boolean;
  hasLockpicker: boolean;
  hasSustain: boolean;
  hasHighControl: boolean;
  detectedSynergies: {
    title: string;
    description: string;
    tier: 'S-Tier' | 'A-Tier' | 'B-Tier';
    membersInvolved: string[];
  }[];
  criticalWarnings: string[];
  tacticalAdvice: string[];
  itemContentions: ItemContention[];
  initiativeAnalysis: InitiativeAnalysis;
  concentrationAnalysis: ConcentrationAnalysis;
}

export const useTeamStore = defineStore('team', {
  state: () => {
    // Default: Tav, Shadowheart, Astarion, Karlach
    const initialRecruited: CompanionId[] = [
      'tav',
      'durge',
      'astarion',
      'gale',
      'karlach',
      'laezel',
      'shadowheart',
      'wyll',
      'minthara',
      'halsin',
      'jaheira',
      'minsc'
    ];

    const parsedRecruited = readJSON(STORAGE_KEY_RECRUITED);
    const storedRecruited: CompanionId[] =
      Array.isArray(parsedRecruited) && parsedRecruited.length > 0 ? parsedRecruited : initialRecruited;

    const customTav: CustomTavConfig = {
      name: 'Custom Tav',
      gender: 'male',
      race: 'Githyanki',
      subrace: '',
      background: 'Guild Artisan',
      canonicalClass: 'Bard',
      canonicalSubclass: 'College of Swords',
      primaryRole: 'Party Face',
      secondaryRole: 'Controller',
      str: 8,
      dex: 16,
      con: 14,
      int: 10,
      wis: 10,
      cha: 16,
      ...(readJSON(STORAGE_KEY_CUSTOM_TAV) as Partial<CustomTavConfig> | null)
    };

    const storedDiff = readStorage(STORAGE_KEY_DIFFICULTY) as GameDifficulty | null;
    const savedDifficulty: GameDifficulty = storedDiff && DIFFICULTY_PROFILES[storedDiff] ? storedDiff : 'Tactician';

    const savedBuilds: Record<string, string> = {
      tav: 'swords-bard-controller',
      shadowheart: 'light-cleric-radiant',
      karlach: 'berserker-throwzerker',
      astarion: 'open-hand-monk-thief',
      ...(readJSON(STORAGE_KEY_SELECTED_BUILDS) as Record<string, string> | null)
    };

    return {
      allCompanions: companionsData as Companion[],
      metaTeams: metaTeamsData as MetaTeam[],
      recruitedIds: storedRecruited,
      currentTeam: [
        'tav',
        'shadowheart',
        'astarion',
        'karlach'
      ] as (CompanionId | null)[],
      customTavConfig: customTav,
      currentDifficulty: savedDifficulty,
      selectedBuildIds: savedBuilds,
      searchQuery: '',
      filterRole: '' as CombatRole | '',
      filterOriginType: '' as string,
      selectedCompanionDetail: null as Companion | null,
      inspectingSlotIndex: 0 as number
    };
  },

  getters: {
    teamCompanions(state): (Companion | null)[] {
      return state.currentTeam.map((id) => {
        if (!id) return null;
        const comp = state.allCompanions.find((c) => c.id === id);
        if (!comp) return null;

        // Clone base companion
        let companionClone: Companion = { ...comp };

        // If custom Tav, apply identity fields
        if (comp.id === 'tav') {
          companionClone = {
            ...companionClone,
            name: state.customTavConfig.name,
            avatar: state.customTavConfig.gender === 'female' ? '/companions/tav-female.svg' : '/companions/tav-male.svg',
            race: state.customTavConfig.race,
            background: state.customTavConfig.background,
            canonicalClass: state.customTavConfig.canonicalClass,
            canonicalSubclass: state.customTavConfig.canonicalSubclass,
            primaryRole: state.customTavConfig.primaryRole,
            secondaryRole: state.customTavConfig.secondaryRole,
            baseAbilities: {
              str: state.customTavConfig.str,
              dex: state.customTavConfig.dex,
              con: state.customTavConfig.con,
              int: state.customTavConfig.int,
              wis: state.customTavConfig.wis,
              cha: state.customTavConfig.cha
            }
          };
        }

        // Apply active build override if available (unless custom Tav customizes their own role)
        const activeBuildId = state.selectedBuildIds[comp.id];
        const activeBuild = comp.builds?.find((b) => b.id === activeBuildId) || comp.builds?.[0];
        if (activeBuild) {
          companionClone.recommendedMulticlass = activeBuild.classSplit;
          if (comp.id !== 'tav') {
            companionClone.primaryRole = activeBuild.primaryRole;
            companionClone.secondaryRole = activeBuild.secondaryRole;
          }
          companionClone.shortRestRecharge = activeBuild.shortRestRecharge;
          companionClone.damageTypes = activeBuild.damageTypes;
          companionClone.tags = activeBuild.tags;
          companionClone.optimizationRationale = activeBuild.description;
          companionClone.combatLoopBreakdown = activeBuild.combatLoopBreakdown;
          companionClone.optimalGear = {
            weapons: activeBuild.weapons,
            armor: activeBuild.armor
          };
          companionClone.skillPriority = {
            order: activeBuild.combatLoopBreakdown
              ? [activeBuild.combatLoopBreakdown.action, activeBuild.combatLoopBreakdown.bonusAction, activeBuild.combatLoopBreakdown.reaction]
              : companionClone.skillPriority.order,
            keyFeats: activeBuild.keyFeats,
            statGoals: activeBuild.statGoals,
            spellRecommendations: activeBuild.spellRecommendations
          };
        }

        return companionClone;
      });
    },

    filteredRoster(state): Companion[] {
      return state.allCompanions.filter((companion) => {
        const matchesQuery =
          companion.name.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          companion.canonicalClass.toLowerCase().includes(state.searchQuery.toLowerCase()) ||
          companion.uniqueFeature.name.toLowerCase().includes(state.searchQuery.toLowerCase());

        const matchesRole =
          !state.filterRole ||
          companion.primaryRole === state.filterRole ||
          companion.secondaryRole === state.filterRole;

        const matchesOrigin =
          !state.filterOriginType ||
          companion.originType === state.filterOriginType;

        return matchesQuery && matchesRole && matchesOrigin;
      });
    },

    synergyReport(): TeamSynergyReport {
      const active = this.teamCompanions.filter((c): c is Companion => c !== null);
      const activeIds = active.map((c) => c.id);
      const currentDiff = this.currentDifficulty;
      const diffRules = DIFFICULTY_PROFILES[currentDiff];

      const roleCoverage: Record<CombatRole, number> = {
        'Striker': 0,
        'AoE Blaster': 0,
        'Controller': 0,
        'Support': 0,
        'Tank': 0,
        'Skill Monkey': 0,
        'Party Face': 0
      };

      const damageTypesCovered = new Set<DamageType>();
      let shortRestCount = 0;

      active.forEach((comp) => {
        roleCoverage[comp.primaryRole] = roleCoverage[comp.primaryRole] + 1;
        roleCoverage[comp.secondaryRole] = roleCoverage[comp.secondaryRole] + 0.5;
        comp.damageTypes.forEach((dt) => damageTypesCovered.add(dt));
        if (comp.shortRestRecharge) {
          shortRestCount++;
        }
      });

      const criticalRoles: CombatRole[] = ['Striker', 'Support', 'Controller', 'Party Face', 'Skill Monkey'];
      const missingRoles = criticalRoles.filter((role) => roleCoverage[role] < 0.5);

      const hasFace = roleCoverage['Party Face'] >= 0.5;
      const hasLockpicker = roleCoverage['Skill Monkey'] >= 0.5;
      const hasSustain = roleCoverage['Support'] >= 0.5;
      const hasHighControl = roleCoverage['Controller'] >= 0.5;

      const detectedSynergies: TeamSynergyReport['detectedSynergies'] = [];
      const criticalWarnings: string[] = [];
      const tacticalAdvice: string[] = [];

      // 1. Wet Nuke Combo
      const hasWetApplier = activeIds.includes('shadowheart') || active.some((c) => c.canonicalClass === 'Cleric' || c.canonicalClass === 'Druid');
      const hasLightningCold = activeIds.includes('durge') || active.some((c) => c.damageTypes.includes('Lightning') || c.damageTypes.includes('Cold'));
      if (hasWetApplier && hasLightningCold) {
        detectedSynergies.push({
          title: 'Hydromancy Vulnerability Surge (Wet Engine)',
          description: 'Create Water applies 100% vulnerability (double damage) to Cold and Lightning spells with zero save DC roll.',
          tier: 'S-Tier',
          membersInvolved: active.filter((c) => ['shadowheart', 'durge'].includes(c.id) || c.damageTypes.includes('Lightning')).map((c) => c.name)
        });
      }

      // 2. Tavern Brawler Core
      const brawlerCount = active.filter((c) => ['karlach', 'astarion', 'halsin'].includes(c.id) || c.tags.includes('Tavern Brawler')).length;
      if (brawlerCount >= 1) {
        detectedSynergies.push({
          title: 'Tavern Brawler Absolute Accuracy Core',
          description: 'Double Strength modifier applied to thrown attacks and unarmed flurries guarantees 95% hit accuracy against Honor Mode bosses.',
          tier: 'S-Tier',
          membersInvolved: active.filter((c) => ['karlach', 'astarion', 'halsin'].includes(c.id)).map((c) => c.name)
        });
      }

      // 3. Radiant Orb and Reverb Loop
      const hasRadiant = active.some((c) => c.damageTypes.includes('Radiant') || c.tags.includes('Radiant Orb'));
      if (hasRadiant) {
        detectedSynergies.push({
          title: 'Radiating Orb Debuff Lawnmower',
          description: 'Applies up to -10 to all enemy attack rolls and triggers continuous Reverberation knockdowns.',
          tier: 'S-Tier',
          membersInvolved: active.filter((c) => c.damageTypes.includes('Radiant')).map((c) => c.name)
        });
      }

      // 4. Arcane Acuity & Scoundrel Lockdown
      const hasBardOrAcuity = active.some((c) => c.tags.includes('Arcane Acuity') || c.canonicalClass === 'Bard');
      if (hasBardOrAcuity) {
        detectedSynergies.push({
          title: 'Arcane Acuity Inescapable Control',
          description: 'Rapid multi-attacks generate +10 spell save DC, allowing bonus action Hold Monster and Command with 100% reliability.',
          tier: 'S-Tier',
          membersInvolved: active.filter((c) => c.tags.includes('Arcane Acuity') || c.canonicalClass === 'Bard').map((c) => c.name)
        });
      }

      // 5. Darkness & Devil's Sight Bunker
      const darknessUsers = active.filter((c) => ['wyll', 'minthara'].includes(c.id) || c.tags.includes('Darkness'));
      if (darknessUsers.length >= 2) {
        detectedSynergies.push({
          title: 'Umbral Veil (Darkness Invulnerability)',
          description: 'Blinds enemy melee and ranged targeting while granting your team permanent attack advantage from within darkness.',
          tier: 'A-Tier',
          membersInvolved: darknessUsers.map((c) => c.name)
        });
      }

      // 6. Song of Rest & Short Rest Engine
      const hasBard = active.some((c) => c.canonicalClass === 'Bard');
      if (hasBard) {
        tacticalAdvice.push('Song of Rest provides an extra third Short Rest each adventuring day, doubling the efficiency of Fighters, Warlocks, and Monks.');
      }

      // Base Warnings
      if (active.length < 4) {
        criticalWarnings.push(`Party has only ${active.length} of 4 member slots assigned.`);
      }

      if (!hasSustain) {
        criticalWarnings.push('No primary Support or Healer allocated: lacks Mass Healing Word, Bless, and emergency revival.');
      }

      if (!hasFace) {
        criticalWarnings.push('Missing a dedicated Party Face: Charisma checks, trade discounts, and peaceful bypasses will be severely impaired.');
      }

      if (!hasLockpicker) {
        criticalWarnings.push('No high Dexterity Sleight of Hand specialist: disarming DC 30 traps and picking high tier locks will require extensive inspiration burn.');
      }

      const missingCrucialDamageTypes: string[] = [];
      if (!damageTypesCovered.has('Radiant')) {
        missingCrucialDamageTypes.push('Radiant (essential for Act 2 undead and preventing shadow rejuvenation)');
      }
      if (!damageTypesCovered.has('Force')) {
        missingCrucialDamageTypes.push('Force (bypasses all resistances and breaks sturdy environmental objects)');
      }

      // 7. DIFFICULTY-SPECIFIC DOWNSIDES AND ADAPTIVE WARNINGS
      if (currentDiff === 'Explorer') {
        tacticalAdvice.push('Explorer Mode grants party +100% maximum HP and a +2 proficiency bonus to all checks. Multiclassing is disabled by game engine rules, so single-class progression (levels 1-12) is mandatory.');
      } else if (currentDiff === 'Balanced') {
        tacticalAdvice.push('Standard Balanced difficulty rules applied. Standard 40 camp supplies consumed per Long Rest. Full multiclass freedom enabled.');
      } else if (currentDiff === 'Tactician') {
        criticalWarnings.push('Tactician Rule Strain: Long Rests demand 80 Camp Supplies (double normal cost). Conserve full spell slots by prioritizing Short Rest martial engines.');
        if (shortRestCount < 2) {
          criticalWarnings.push('Heavy Resource Depletion Hazard: With only ' + shortRestCount + ' Short-Rest combatant(s) and 80 Camp Supplies per Long Rest, this party will rapidly exhaust food supplies.');
        }
        if (!hasSustain) {
          criticalWarnings.push('Tactician AI Vulnerability: Enemies aggressively target low-AC spellcasters and execute downed allies before they can be stabilized.');
        }
        tacticalAdvice.push('Vendors apply a 20% price penalty on Tactician. Having a high Charisma Party Face with Persuasion expertise is vital to offset expensive potion and gear purchases.');
      } else if (currentDiff === 'Honor') {
        criticalWarnings.push('Honor Mode Single Save Threat: Total party wipe immediately deletes the save file. Zero tactical reloads permitted on wipe.');
        criticalWarnings.push('Boss Legendary Actions Active: Major encounters react outside turn order with devastating legendary counter-moves. High initiative (Alert feat) and round-1 turn denial (Hold/Command) are mandatory.');
        if (shortRestCount < 2) {
          criticalWarnings.push('Camp Supply Pressure: 80 Camp Supplies per Long Rest. Short Rest units (Monk, Fighter, Warlock) are strongly advised over 4-caster spell burn.');
        }
        if (!hasHighControl) {
          criticalWarnings.push('Missing Inescapable Turn Denial: Lacks high Spell Save DC controllers (Arcane Acuity / Divination) to neutralize legendary boss actions in round 1.');
        }
        tacticalAdvice.push('Ensure at least 3 party members possess the Alert feat (+5 Initiative) to guarantee acting before enemy legendary alpha strikes.');
      }

      // Calculate score
      let score = 30;
      score += active.length * 10;
      if (hasSustain) score += 10;
      if (hasFace) score += 5;
      if (hasLockpicker) score += 5;
      if (hasHighControl) score += 5;
      score += Math.min(detectedSynergies.length * 6, 20);
      if (shortRestCount >= 2) score += 5;
      if (missingRoles.length > 2) score -= 10;

      // Difficulty penalty adjustments
      if (currentDiff === 'Tactician' || currentDiff === 'Honor') {
        if (shortRestCount < 2) score -= 8;
        if (!hasSustain) score -= 8;
        if (currentDiff === 'Honor' && !hasHighControl) score -= 10;
      }
      score = Math.max(10, Math.min(100, score));

      const partyCompositionHealth: TeamSynergyReport['partyCompositionHealth'] =
        score >= 90 ? 'Transcendent' : score >= 75 ? 'Balanced' : score >= 55 ? 'Specialized' : 'Deficient';

      let restingViability: TeamSynergyReport['restingViability'] = 'Moderate';
      if (shortRestCount >= 3 || (hasBard && shortRestCount >= 2)) {
        restingViability = 'Excellent';
      } else if (shortRestCount <= 1) {
        restingViability = 'Resource Heavy';
      }

      // --- ITEM CONTENTION ENGINE ---
      const comps = active;
      const itemOccurrences: Record<string, { companionId: CompanionId; companionName: string; slotIndex: number; assignedRole: string }[]> = {};
      const itemSlotMap: Record<string, string> = {};

      comps.forEach((c, i) => {
        if (!c.optimalGear) return;
        const addItem = (slotName: string, itemName: string | undefined) => {
          const trimmed = itemName?.trim();
          if (!trimmed) return;
          itemSlotMap[trimmed] = slotName;
          (itemOccurrences[trimmed] ??= []).push({
            companionId: c.id,
            companionName: c.name,
            slotIndex: i,
            assignedRole: c.primaryRole
          });
        };

        // Collect weapons
        for (const w of c.optimalGear.weapons || []) addItem('Weapon', w.name);

        // Collect armor and accessories
        const armor = c.optimalGear.armor;
        if (armor) {
          addItem('Headwear', armor.head);
          addItem('Chest Armor', armor.chest);
          addItem('Gloves', armor.gloves);
          addItem('Footwear', armor.boots);
          addItem('Amulet', armor.amulet);
          addItem('Cloak', armor.cloak);
          for (const ring of armor.rings || []) addItem('Ring', ring);
        }
      });

      const itemContentions: ItemContention[] = [];
      for (const [itemName, users] of Object.entries(itemOccurrences)) {
        if (users.length > 1) {
          const slot = itemSlotMap[itemName] || 'Gear';
          itemContentions.push({
            itemName,
            itemSlot: slot,
            conflictingMembers: users,
            resolutionSuggestion: `Prioritize on ${users[0].companionName} (${users[0].assignedRole}) for primary combat loop efficiency; equip secondary alternative on ${users.slice(1).map(u => u.companionName).join(', ')}.`
          });
        }
      }

      // --- TURN 1 INITIATIVE READINESS (+d4 CALCULATION) ---
      const initiativeList = comps.map((c) => {
        const dex = c.skillPriority?.statGoals?.dex || 14;
        const dexMod = Math.floor((dex - 10) / 2);
        // Alert feat grant or high dex synergy
        const hasAlert = c.tags?.includes('Alert Feat') || dexMod >= 4;
        const bonus = dexMod + (hasAlert ? 5 : 0);
        return {
          companionName: c.name,
          totalBonus: bonus,
          breakdown: `+${dexMod} DEX${hasAlert ? ', +5 Alert Feat' : ''}`
        };
      });

      const avgInit = initiativeList.length > 0
        ? Number((initiativeList.reduce((acc, curr) => acc + curr.totalBonus, 0) / initiativeList.length).toFixed(1))
        : 0;

      const spreadMin = Math.round(avgInit + 1);
      const spreadMax = Math.round(avgInit + 4);
      let turn1DominanceTier: InitiativeAnalysis['turn1DominanceTier'] = 'High Probability';
      if (avgInit >= 7) turn1DominanceTier = 'Guaranteed Turn 1 (Honor Safe)';
      else if (avgInit < 4) turn1DominanceTier = 'Ambush Risk';

      const initiativeAnalysis: InitiativeAnalysis = {
        averageInitiative: avgInit,
        d4RollSpread: `Average ${avgInit} (Roll Window: ${spreadMin} - ${spreadMax})`,
        turn1DominanceTier,
        initiativeList
      };

      // --- CONCENTRATION SLOT TRACKER ---
      const spellMapping: Record<string, string> = {
        shadowheart: 'Spirit Guardians (Radiant Lawnmower)',
        gale: 'Hypnotic Pattern / Haste (Mass Control)',
        wyll: 'Hunger of Hadar (Choke Denial)',
        tav: 'Hold Monster / Extended Command (Boss Turn Denial)',
        durge: 'Hold Monster / Extended Command (Boss Turn Denial)',
        halsin: 'Call Lightning / Spike Growth',
        jaheira: 'Moonbeam / Ice Storm Control',
        minthara: 'Bless / Compelled Duel'
      };

      const competingSpells = comps.filter(c => spellMapping[c.id]).map(c => ({
        companionName: c.name,
        spellName: spellMapping[c.id],
        targetRole: c.primaryRole
      }));

      let saturationTier: ConcentrationAnalysis['saturationTier'] = 'Optimal Distribution';
      let concWarning: string | undefined = undefined;

      if (competingSpells.length >= 3) {
        saturationTier = 'Concentration Contention Hazard';
        concWarning = `${competingSpells.length} active party members rely on sustained concentration simultaneously. Protect concentration with War Caster or Peerless Focus elixirs to avoid cascades.`;
      } else if (competingSpells.length === 2) {
        saturationTier = 'Balanced';
      }

      const concentrationAnalysis: ConcentrationAnalysis = {
        activeCastersCount: competingSpells.length,
        competingSpells,
        saturationTier,
        conflictWarning: concWarning
      };

      return {
        score,
        partyCompositionHealth,
        difficultyRules: diffRules,
        roleCoverage,
        missingRoles,
        shortRestAdvantageCount: shortRestCount,
        restingViability,
        damageTypesCovered: Array.from(damageTypesCovered),
        missingCrucialDamageTypes,
        hasFace,
        hasLockpicker,
        hasSustain,
        hasHighControl,
        detectedSynergies,
        criticalWarnings,
        tacticalAdvice,
        itemContentions,
        initiativeAnalysis,
        concentrationAnalysis
      };
    }
  },

  actions: {
    assignCompanion(slotIndex: number, companionId: CompanionId | null) {
      if (slotIndex < 0 || slotIndex > 3) return;

      // Avoid duplicates
      if (companionId) {
        const existingIndex = this.currentTeam.indexOf(companionId);
        if (existingIndex !== -1 && existingIndex !== slotIndex) {
          // Swap positions
          this.currentTeam[existingIndex] = this.currentTeam[slotIndex];
        }
      }
      this.currentTeam[slotIndex] = companionId;
    },

    removeCompanion(slotIndex: number) {
      if (slotIndex >= 0 && slotIndex <= 3) {
        this.currentTeam[slotIndex] = null;
      }
    },

    toggleRecruited(companionId: CompanionId) {
      const idx = this.recruitedIds.indexOf(companionId);
      if (idx !== -1) {
        this.recruitedIds.splice(idx, 1);
        // Also remove from active team if present
        const teamIdx = this.currentTeam.indexOf(companionId);
        if (teamIdx !== -1) {
          this.currentTeam[teamIdx] = null;
        }
      } else {
        this.recruitedIds.push(companionId);
      }
      this.persistRecruited();
    },

    persistRecruited() {
      writeStorage(STORAGE_KEY_RECRUITED, JSON.stringify(this.recruitedIds));
    },

    updateCustomTav(newConfig: Partial<CustomTavConfig>) {
      this.customTavConfig = { ...this.customTavConfig, ...newConfig };
      writeStorage(STORAGE_KEY_CUSTOM_TAV, JSON.stringify(this.customTavConfig));
    },

    loadMetaTeam(teamId: string) {
      const meta = this.metaTeams.find((t) => t.id === teamId);
      if (!meta) return;

      this.currentTeam = [...meta.slots];

      // Auto recruit team members if not already
      meta.slots.forEach((id) => {
        if (!this.recruitedIds.includes(id)) {
          this.recruitedIds.push(id);
        }
      });
      this.persistRecruited();
    },

    setDifficulty(difficulty: GameDifficulty) {
      if (DIFFICULTY_PROFILES[difficulty]) {
        this.currentDifficulty = difficulty;
        writeStorage(STORAGE_KEY_DIFFICULTY, difficulty);
      }
    },

    setCompanionBuild(companionId: string, buildId: string) {
      this.selectedBuildIds[companionId] = buildId;
      writeStorage(STORAGE_KEY_SELECTED_BUILDS, JSON.stringify(this.selectedBuildIds));
      // Refresh inspection if current
      if (this.inspectingSlotIndex >= 0) {
        this.setInspectingSlot(this.inspectingSlotIndex);
      }
    },

    clearTeam() {
      this.currentTeam = [null, null, null, null];
    },

    setInspectingSlot(index: number) {
      this.inspectingSlotIndex = index;
      this.selectedCompanionDetail = this.teamCompanions[index];
    }
  }
});
