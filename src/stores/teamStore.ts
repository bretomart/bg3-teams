import { defineStore } from 'pinia';
import companionsData from '../data/companions.json';
import metaTeamsData from '../data/metaTeams.json';
import type {
  Companion,
  CompanionId,
  CombatRole,
  DamageType,
  MetaTeam
} from '../types/companion';

const STORAGE_KEY_RECRUITED = 'bg3_recruited_companions';
const STORAGE_KEY_CUSTOM_TAV = 'bg3_custom_tav_config';

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

    let storedRecruited: CompanionId[] = initialRecruited;
    try {
      const saved = localStorage.getItem(STORAGE_KEY_RECRUITED);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          storedRecruited = parsed;
        }
      }
    } catch {
      // Ignore local storage error
    }

    let customTav: CustomTavConfig = {
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
      cha: 16
    };

    try {
      const savedTav = localStorage.getItem(STORAGE_KEY_CUSTOM_TAV);
      if (savedTav) {
        customTav = { ...customTav, ...JSON.parse(savedTav) };
      }
    } catch {
      // Ignore
    }

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
        if (comp.id === 'tav') {
          return {
            ...comp,
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
        return comp;
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
        roleCoverage[comp.primaryRole] = (roleCoverage[comp.primaryRole] || 0) + 1;
        roleCoverage[comp.secondaryRole] = (roleCoverage[comp.secondaryRole] || 0) + 0.5;
        comp.damageTypes.forEach((dt) => damageTypesCovered.add(dt));
        if (comp.shortRestRecharge) {
          shortRestCount++;
        }
      });

      const missingRoles: CombatRole[] = [];
      const criticalRoles: CombatRole[] = ['Striker', 'Support', 'Controller', 'Party Face', 'Skill Monkey'];
      criticalRoles.forEach((role) => {
        if ((roleCoverage[role] || 0) < 0.5) {
          missingRoles.push(role);
        }
      });

      const hasFace = (roleCoverage['Party Face'] || 0) >= 0.5;
      const hasLockpicker = (roleCoverage['Skill Monkey'] || 0) >= 0.5;
      const hasSustain = (roleCoverage['Support'] || 0) >= 0.5;
      const hasHighControl = (roleCoverage['Controller'] || 0) >= 0.5;

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

      // Warnings
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
      score = Math.max(10, Math.min(100, score));

      let partyCompositionHealth: TeamSynergyReport['partyCompositionHealth'] = 'Balanced';
      if (score >= 90) partyCompositionHealth = 'Transcendent';
      else if (score >= 75) partyCompositionHealth = 'Balanced';
      else if (score >= 55) partyCompositionHealth = 'Specialized';
      else partyCompositionHealth = 'Deficient';

      let restingViability: TeamSynergyReport['restingViability'] = 'Moderate';
      if (shortRestCount >= 3 || (hasBard && shortRestCount >= 2)) {
        restingViability = 'Excellent';
      } else if (shortRestCount <= 1) {
        restingViability = 'Resource Heavy';
      }

      if (restingViability === 'Resource Heavy') {
        tacticalAdvice.push('Heavy reliance on Long Rests detected. Stock up on camp supplies and avoid consecutive boss encounters without resting.');
      }

      return {
        score,
        partyCompositionHealth,
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
        tacticalAdvice
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
      try {
        localStorage.setItem(STORAGE_KEY_RECRUITED, JSON.stringify(this.recruitedIds));
      } catch {
        // Ignore
      }
    },

    updateCustomTav(newConfig: Partial<CustomTavConfig>) {
      this.customTavConfig = { ...this.customTavConfig, ...newConfig };
      try {
        localStorage.setItem(STORAGE_KEY_CUSTOM_TAV, JSON.stringify(this.customTavConfig));
      } catch {
        // Ignore
      }
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

    clearTeam() {
      this.currentTeam = [null, null, null, null];
    },

    setInspectingSlot(index: number) {
      this.inspectingSlotIndex = index;
      const comp = this.teamCompanions[index];
      this.selectedCompanionDetail = comp;
    }
  }
});
