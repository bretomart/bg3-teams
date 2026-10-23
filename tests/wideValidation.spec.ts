import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTeamStore } from '../src/stores/teamStore';

describe('Wide Validation Tests: Archetypes, Weapons, Difficulty & Mechanics', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('verifies all 12 companions have valid builds and modular weapons', () => {
    const store = useTeamStore();
    expect(store.allCompanions.length).toBe(12);

    for (const comp of store.allCompanions) {
      expect(comp.builds).toBeDefined();
      expect(comp.builds!.length).toBeGreaterThan(0);

      // Verify each build option has strengths, drawbacks, and weapons
      for (const build of comp.builds!) {
        expect(build.id).toBeTruthy();
        expect(build.name).toBeTruthy();
        expect(build.strengths.length).toBeGreaterThan(0);
        expect(build.drawbacks.length).toBeGreaterThan(0);
        expect(build.weapons.length).toBeGreaterThan(0);

        // Verify weapons have sourceCategory
        for (const weapon of build.weapons) {
          expect(['Main Story & Vendors', 'Quest Locked', 'Optional Secret / Boss', 'Alternative Common']).toContain(
            weapon.sourceCategory
          );
          if (weapon.sourceCategory === 'Quest Locked') {
            expect(weapon.questLockWarning).toBeDefined();
            expect(weapon.questLockWarning!.length).toBeGreaterThan(0);
          }
        }
      }
    }
  });

  it('switches Shadowheart archetype reactively between Light and Trickery', () => {
    const store = useTeamStore();
    store.currentTeam = ['shadowheart', 'laezel', 'gale', 'astarion'];

    // Select Light Domain build
    store.setCompanionBuild('shadowheart', 'light-cleric-radiant');
    let sh = store.teamCompanions.find((c) => c?.id === 'shadowheart');
    expect(sh?.recommendedMulticlass).toBe('12 Light Cleric');
    expect(sh?.primaryRole).toBe('Support');
    expect(sh?.tags).toContain('Radiant Orb');

    // Select Trickery Domain build
    store.setCompanionBuild('shadowheart', 'trickery-stealth-cleric');
    sh = store.teamCompanions.find((c) => c?.id === 'shadowheart');
    expect(sh?.recommendedMulticlass).toBe('12 Trickery Cleric (Canonical Origin)');
    expect(sh?.tags).toContain('Stealth Advantage');
  });

  it('switches Karlach archetype between Throwzerker and Bleed Tiger', () => {
    const store = useTeamStore();
    store.setCompanionBuild('karlach', 'berserker-throwzerker');
    let karlach = store.teamCompanions.find((c) => c?.id === 'karlach');
    expect(karlach?.recommendedMulticlass).toContain('Berserker Barbarian');

    store.setCompanionBuild('karlach', 'wildheart-tiger-bleed');
    karlach = store.teamCompanions.find((c) => c?.id === 'karlach');
    expect(karlach?.recommendedMulticlass).toContain('Wildheart Barbarian');
    expect(karlach?.tags).toContain('Tiger Cleave');
  });

  it('calculates difficulty scaling across all 4 modes without crashing', () => {
    const store = useTeamStore();
    const modes = ['Explorer', 'Balanced', 'Tactician', 'Honor'] as const;

    for (const mode of modes) {
      store.setDifficulty(mode);
      expect(store.currentDifficulty).toBe(mode);
      const report = store.synergyReport;
      expect(report.difficultyRules.id).toBe(mode);
      expect(typeof report.score).toBe('number');
      expect(report.score).toBeGreaterThanOrEqual(0);
      expect(report.score).toBeLessThanOrEqual(100);
    }
  });

  it('flags Tactician and Honor supply strain when party lacks short rest sustain', () => {
    const store = useTeamStore();
    // 4 long rest dependent casters/characters with low short rest recovery
    store.currentTeam = ['gale', 'shadowheart', 'durge', 'halsin'];
    store.setDifficulty('Tactician');

    const report = store.synergyReport;
    expect(report.difficultyRules.campSuppliesPerLongRest).toBe(80);
    expect(report.criticalWarnings.some((w) => w.includes('80 Camp Supplies'))).toBe(true);
    expect(report.criticalWarnings.some((w) => w.includes('Heavy Resource Depletion Hazard'))).toBe(true);
  });
});
