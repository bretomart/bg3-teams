import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTeamStore, DIFFICULTY_PROFILES } from '../src/stores/teamStore';
import type { CompanionId, GameDifficulty } from '../src/types/companion';

const SOURCE_CATEGORIES = ['Main Story & Vendors', 'Quest Locked', 'Optional Secret / Boss', 'Alternative Common'];
const MODES: GameDifficulty[] = ['Explorer', 'Balanced', 'Tactician', 'Honor'];

describe('BG3 Team Store & Synergy Engine', () => {
  beforeEach(() => {
    localStorage.clear();
    setActivePinia(createPinia());
  });

  describe('data invariants', () => {
    it('initializes with 12 unique companions and the default 4-member party', () => {
      const store = useTeamStore();
      expect(store.allCompanions.length).toBe(12);
      expect(new Set(store.allCompanions.map((c) => c.id)).size).toBe(12);
      expect(store.currentTeam).toEqual(['tav', 'shadowheart', 'astarion', 'karlach']);
      expect(store.currentDifficulty).toBe('Tactician');
    });

    it('gives every companion valid builds with sourced weapons', () => {
      const store = useTeamStore();
      for (const comp of store.allCompanions) {
        expect(comp.builds?.length).toBeGreaterThan(0);
        for (const build of comp.builds!) {
          expect(build.id).toBeTruthy();
          expect(build.name).toBeTruthy();
          expect(build.strengths.length).toBeGreaterThan(0);
          expect(build.drawbacks.length).toBeGreaterThan(0);
          expect(build.weapons.length).toBeGreaterThan(0);
          for (const weapon of build.weapons) {
            expect(SOURCE_CATEGORIES).toContain(weapon.sourceCategory);
            if (weapon.sourceCategory === 'Quest Locked') {
              expect(weapon.questLockWarning?.length).toBeGreaterThan(0);
            }
          }
        }
      }
    });

    it('references only existing companions in every meta team', () => {
      const store = useTeamStore();
      const ids = new Set(store.allCompanions.map((c) => c.id));
      expect(store.metaTeams.length).toBeGreaterThan(0);
      for (const team of store.metaTeams) {
        expect(team.slots.length).toBe(4);
        expect(new Set(team.slots).size).toBe(4);
        team.slots.forEach((id) => expect(ids.has(id)).toBe(true));
        team.slotBuilds.forEach((sb) => expect(ids.has(sb.companionId)).toBe(true));
      }
    });
  });

  describe('synergy detection', () => {
    it.each([
      ['Wet Engine', ['shadowheart', 'durge', 'astarion', 'karlach']],
      ['Tavern Brawler', ['karlach', 'astarion', 'laezel', 'tav']]
    ] as [string, CompanionId[]][])('detects the %s synergy', (title, team) => {
      const store = useTeamStore();
      store.currentTeam = team;
      const synergy = store.synergyReport.detectedSynergies.find((s) => s.title.includes(title));
      expect(synergy?.tier).toBe('S-Tier');
    });

    it('warns when party lacks dedicated support or healer', () => {
      const store = useTeamStore();
      store.currentTeam = ['laezel', 'karlach', 'astarion', 'minsc'];
      const report = store.synergyReport;
      expect(report.hasSustain).toBe(false);
      expect(report.criticalWarnings.some((w) => w.includes('No primary Support or Healer'))).toBe(true);
    });

    it('warns about empty slots', () => {
      const store = useTeamStore();
      store.clearTeam();
      expect(store.currentTeam).toEqual([null, null, null, null]);
      expect(store.synergyReport.criticalWarnings).toContain('Party has only 0 of 4 member slots assigned.');
    });

    it('reports item contention when two members want the same item', () => {
      const store = useTeamStore();
      const report = store.synergyReport;
      const counts: Record<string, number> = {};
      for (const c of store.teamCompanions) {
        const names = new Set(c?.optimalGear.weapons.map((w) => w.name.trim()));
        names.forEach((n) => (counts[n] = (counts[n] ?? 0) + 1));
      }
      for (const contention of report.itemContentions) {
        expect(contention.conflictingMembers.length).toBeGreaterThan(1);
        expect(contention.resolutionSuggestion).toContain(contention.conflictingMembers[0].companionName);
      }
      const sharedWeapons = Object.entries(counts).filter(([, n]) => n > 1).map(([name]) => name);
      sharedWeapons.forEach((name) => expect(report.itemContentions.some((ic) => ic.itemName === name)).toBe(true));
    });
  });

  describe('difficulty', () => {
    it.each(MODES)('applies %s rules with a bounded score', (mode) => {
      const store = useTeamStore();
      store.setDifficulty(mode);
      expect(store.currentDifficulty).toBe(mode);
      const report = store.synergyReport;
      expect(report.difficultyRules).toEqual(DIFFICULTY_PROFILES[mode]);
      expect(report.score).toBeGreaterThanOrEqual(10);
      expect(report.score).toBeLessThanOrEqual(100);
      expect(localStorage.getItem('bg3_selected_difficulty')).toBe(mode);
    });

    it.each([
      ['Tactician', 'criticalWarnings', '80 Camp Supplies'],
      ['Tactician', 'criticalWarnings', 'Heavy Resource Depletion Hazard'],
      ['Honor', 'criticalWarnings', 'Boss Legendary Actions Active'],
      ['Explorer', 'tacticalAdvice', '+100% maximum HP']
    ] as const)('%s adds %s containing "%s"', (mode, field, text) => {
      const store = useTeamStore();
      store.currentTeam = ['gale', 'shadowheart', 'durge', 'halsin'];
      store.setDifficulty(mode);
      expect(store.synergyReport[field].some((w) => w.includes(text))).toBe(true);
    });

    it('restores a saved difficulty and ignores invalid values', () => {
      localStorage.setItem('bg3_selected_difficulty', 'Honor');
      expect(useTeamStore().currentDifficulty).toBe('Honor');
      setActivePinia(createPinia());
      localStorage.setItem('bg3_selected_difficulty', 'Nightmare');
      expect(useTeamStore().currentDifficulty).toBe('Tactician');
    });
  });

  describe('builds and Tav', () => {
    it.each([
      ['shadowheart', 'light-cleric-radiant', '12 Light Cleric', 'Radiant Orb'],
      ['shadowheart', 'trickery-stealth-cleric', '12 Trickery Cleric', 'Stealth Advantage'],
      ['karlach', 'berserker-throwzerker', 'Berserker Barbarian', undefined],
      ['karlach', 'wildheart-tiger-bleed', 'Wildheart Barbarian', 'Tiger Cleave']
    ] as [CompanionId, string, string, string | undefined][])(
      'switches %s to build %s',
      (id, buildId, multiclass, tag) => {
        const store = useTeamStore();
        store.setCompanionBuild(id, buildId);
        const comp = store.teamCompanions.find((c) => c?.id === id);
        expect(comp?.recommendedMulticlass).toContain(multiclass);
        if (tag) expect(comp?.tags).toContain(tag);
        expect(JSON.parse(localStorage.getItem('bg3_companion_selected_builds')!)[id]).toBe(buildId);
      }
    );

    it('customizes Tav identity while keeping custom roles over build roles', () => {
      const store = useTeamStore();
      store.updateCustomTav({ name: 'Gorion Ward', canonicalClass: 'Paladin', primaryRole: 'Tank', cha: 18, gender: 'female' });
      const tav = store.teamCompanions[0];
      expect(tav?.name).toBe('Gorion Ward');
      expect(tav?.canonicalClass).toBe('Paladin');
      expect(tav?.primaryRole).toBe('Tank');
      expect(tav?.baseAbilities.cha).toBe(18);
      expect(tav?.avatar).toBe('/companions/tav-female.svg');
    });
  });

  describe('team actions', () => {
    it('loads a verified meta team and recruits its members', () => {
      const store = useTeamStore();
      store.recruitedIds = ['tav'];
      store.loadMetaTeam('wet-lightning-storm');
      expect(store.currentTeam).toEqual(['shadowheart', 'durge', 'tav', 'astarion']);
      expect(store.recruitedIds).toEqual(expect.arrayContaining(['shadowheart', 'durge', 'tav', 'astarion']));
    });

    it('swaps positions when assigning a companion already in the party', () => {
      const store = useTeamStore();
      store.assignCompanion(0, 'karlach');
      expect(store.currentTeam).toEqual(['karlach', 'shadowheart', 'astarion', 'tav']);
    });

    it.each([-1, 4])('ignores out-of-range slot %i', (slot) => {
      const store = useTeamStore();
      store.assignCompanion(slot, 'gale');
      store.removeCompanion(slot);
      expect(store.currentTeam).toEqual(['tav', 'shadowheart', 'astarion', 'karlach']);
    });

    it('un-recruiting a companion removes them from the party and persists', () => {
      const store = useTeamStore();
      store.toggleRecruited('astarion');
      expect(store.recruitedIds).not.toContain('astarion');
      expect(store.currentTeam[2]).toBeNull();
      store.toggleRecruited('astarion');
      expect(JSON.parse(localStorage.getItem('bg3_recruited_companions')!)).toContain('astarion');
    });

    it('filters the roster by query, role, and origin type', () => {
      const store = useTeamStore();
      store.searchQuery = 'astar';
      expect(store.filteredRoster.map((c) => c.id)).toEqual(['astarion']);
      store.searchQuery = '';
      store.filterOriginType = 'custom';
      expect(store.filteredRoster.every((c) => c.originType === 'custom')).toBe(true);
      store.filterOriginType = '';
      store.filterRole = 'Support';
      expect(store.filteredRoster.length).toBeGreaterThan(0);
      expect(store.filteredRoster.every((c) => c.primaryRole === 'Support' || c.secondaryRole === 'Support')).toBe(true);
    });
  });
});
