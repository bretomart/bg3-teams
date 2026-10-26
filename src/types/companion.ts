export type OriginType = 'origin' | 'companion' | 'custom';

export type GameDifficulty = 'Explorer' | 'Balanced' | 'Tactician' | 'Honor';

export interface DifficultyRuleProfile {
  id: GameDifficulty;
  name: string;
  badge: string;
  campSuppliesPerLongRest: number;
  enemyHpScaling: string;
  enemyTacticsLevel: string;
  multiclassAllowed: boolean;
  permadeathOrSingleSave: boolean;
  legendaryBossActions: boolean;
  traderMarkupPercent: number;
  summary: string;
}

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

export interface WeaponOption {
  name: string;
  act: 1 | 2 | 3;
  type: string;
  sourceCategory?: 'Main Story & Vendors' | 'Quest Locked' | 'Optional Secret / Boss' | 'Alternative Common';
  questLockWarning?: string;
  description: string;
}

export interface BuildOption {
  id: string;
  name: string;
  classSplit: string;
  primaryRole: CombatRole;
  secondaryRole: CombatRole;
  shortRestRecharge: boolean;
  damageTypes: DamageType[];
  tags: string[];
  description: string;
  strengths: string[];
  drawbacks: string[];
  combatLoopBreakdown: {
    action: string;
    bonusAction: string;
    reaction: string;
  };
  keyFeats: string[];
  statGoals: Record<AbilityName, number>;
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
  spellRecommendations?: string[];
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
  builds?: BuildOption[];
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

export interface ItemContention {
  itemName: string;
  itemSlot: string;
  conflictingMembers: {
    companionId: CompanionId;
    companionName: string;
    slotIndex: number;
    assignedRole: string;
  }[];
  resolutionSuggestion: string;
}

export interface InitiativeAnalysis {
  averageInitiative: number;
  d4RollSpread: string;
  turn1DominanceTier: 'Guaranteed Turn 1 (Honor Safe)' | 'High Probability' | 'Ambush Risk';
  initiativeList: {
    companionName: string;
    totalBonus: number;
    breakdown: string;
  }[];
}

export interface ConcentrationAnalysis {
  activeCastersCount: number;
  competingSpells: {
    companionName: string;
    spellName: string;
    targetRole: string;
  }[];
  saturationTier: 'Optimal Distribution' | 'Balanced' | 'Concentration Contention Hazard';
  conflictWarning?: string;
}
