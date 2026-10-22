export type OriginType = 'origin' | 'companion' | 'custom';

export type CompanionId =
  | 'tav'
  | 'durge'
  | 'astarion'
  | 'gale'
  | 'karlach'
  | 'laezel'
  | 'shadowheart'
  | 'wyll'
  | 'halsin'
  | 'jaheira'
  | 'minsc'
  | 'minthara';

export type CombatRole =
  | 'Striker'
  | 'AoE Blaster'
  | 'Controller'
  | 'Support'
  | 'Tank'
  | 'Skill Monkey'
  | 'Party Face';

export type DamageType =
  | 'Slashing'
  | 'Piercing'
  | 'Bludgeoning'
  | 'Fire'
  | 'Cold'
  | 'Lightning'
  | 'Thunder'
  | 'Acid'
  | 'Poison'
  | 'Radiant'
  | 'Necrotic'
  | 'Force'
  | 'Psychic';

export type AbilityName = 'str' | 'dex' | 'con' | 'int' | 'wis' | 'cha';

export interface AbilityScoreAllocation {
  base: Record<AbilityName, number>;
  bonusPlusTwo: AbilityName;
  bonusPlusOne: AbilityName;
}

export interface WeaponOption {
  name: string;
  act: 1 | 2 | 3;
  type: string;
  description: string;
}

export interface OptimalGear {
  weapons: WeaponOption[];
  armor: {
    head: string;
    chest: string;
    gloves: string;
    boots: string;
    amulet: string;
    rings: string[];
    cloak?: string;
  };
}

export interface SkillPriority {
  order: string[];
  keyFeats: string[];
  statGoals: Record<AbilityName, number>;
  spellRecommendations?: string[];
}

export interface Companion {
  id: CompanionId;
  name: string;
  title: string;
  originType: OriginType;
  race: string;
  subrace?: string;
  background: string;
  canonicalClass: string;
  canonicalSubclass: string;
  primaryRole: CombatRole;
  secondaryRole: CombatRole;
  avatar: string;
  quote: string;
  uniqueFeature: {
    name: string;
    description: string;
    tag: string;
  };
  baseAbilities: Record<AbilityName, number>;
  recommendedMulticlass: string;
  optimizationRationale?: string;
  combatLoopBreakdown?: {
    action: string;
    bonusAction: string;
    reaction: string;
  };
  optimalGear: OptimalGear;
  skillPriority: SkillPriority;
  damageTypes: DamageType[];
  shortRestRecharge: boolean;
  tags: string[];
}

export interface MetaTeamSlot {
  companionId: CompanionId;
  assignedRole: CombatRole;
  buildTitle: string;
  classSplit: string;
  coreFeat: string;
  keyGear: string;
}

export interface MetaTeam {
  id: string;
  name: string;
  difficultyTier: 'Honor Mode S-Tier' | 'Honor Mode A-Tier' | 'Balanced Tactician';
  coreSynergyConcept: string;
  slots: [CompanionId, CompanionId, CompanionId, CompanionId];
  slotBuilds: MetaTeamSlot[];
  description: string;
  strengths: string[];
  weaknesses: string[];
  turnSequencing: string[];
  progressionMilestones: {
    act: string;
    objective: string;
    impact: string;
  }[];
}
