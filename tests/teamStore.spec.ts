import { describe, it, expect, beforeEach } from 'vitest';
import { setActivePinia, createPinia } from 'pinia';
import { useTeamStore } from '../src/stores/teamStore';

describe('BG3 Team Store & Synergy Engine', () => {
  beforeEach(() => {
    setActivePinia(createPinia());
  });

  it('initializes with 12 companions and standard 4-member party', () => {
    const store = useTeamStore();
    expect(store.allCompanions.length).toBe(12);
    expect(store.currentTeam.length).toBe(4);
    expect(store.currentTeam[0]).toBe('tav');
  });

  it('detects Hydromancy Wet synergy with Cleric and Lightning/Cold caster', () => {
    const store = useTeamStore();
    store.currentTeam = ['shadowheart', 'durge', 'astarion', 'karlach'];
    const report = store.synergyReport;

    const wetSynergy = report.detectedSynergies.find((s) => s.title.includes('Wet Engine'));
    expect(wetSynergy).toBeDefined();
    expect(wetSynergy?.tier).toBe('S-Tier');
  });

  it('detects Tavern Brawler synergy when brawler units are equipped', () => {
    const store = useTeamStore();
    store.currentTeam = ['karlach', 'astarion', 'laezel', 'tav'];
    const report = store.synergyReport;

    const brawlerSynergy = report.detectedSynergies.find((s) => s.title.includes('Tavern Brawler'));
    expect(brawlerSynergy).toBeDefined();
  });

  it('warns when party lacks dedicated support or healer', () => {
    const store = useTeamStore();
    // 4 strikers/fighters
    store.currentTeam = ['laezel', 'karlach', 'astarion', 'minsc'];
    const report = store.synergyReport;

    expect(report.hasSustain).toBe(false);
    expect(report.criticalWarnings.some((w) => w.includes('No primary Support or Healer'))).toBe(true);
  });

  it('loads verified meta team properly', () => {
    const store = useTeamStore();
    store.loadMetaTeam('wet-lightning-storm');
    expect(store.currentTeam).toEqual(['shadowheart', 'durge', 'tav', 'astarion']);
  });

  it('customizes Tav stats dynamically', () => {
    const store = useTeamStore();
    store.updateCustomTav({
      name: 'Gorion Ward',
      canonicalClass: 'Paladin',
      primaryRole: 'Tank',
      cha: 18
    });

    const activeTav = store.teamCompanions[0];
    expect(activeTav?.name).toBe('Gorion Ward');
    expect(activeTav?.canonicalClass).toBe('Paladin');
    expect(activeTav?.primaryRole).toBe('Tank');
  });
});
