import fs from 'node:fs';

const companionsPath = './src/data/companions.json';
const companions = JSON.parse(fs.readFileSync(companionsPath, 'utf8'));

// Define selectable builds for each character with distinct trade-offs, strengths, drawbacks, modular weapons, and combat loops
const buildsMap = {
  tav: [
    {
      id: 'swords-bard-controller',
      name: 'College of Swords (Acuity Controller)',
      classSplit: '10 Swords Bard / 1 Fighter / 1 Wizard',
      primaryRole: 'Party Face',
      secondaryRole: 'Controller',
      shortRestRecharge: true,
      damageTypes: ['Piercing', 'Slashing', 'Psychic', 'Thunder'],
      tags: ['Arcane Acuity', 'Face', 'Dual Wielder', 'Extra Short Rest'],
      description: 'Fires Slashing Flourishes to max out Arcane Acuity (+10 Spell DC in round 1), then casts 100% DC Hold Monster or Command as a bonus action via Band of the Mystic Scoundrel.',
      strengths: [
        'Guaranteed turn denial against any boss with 100% spell save DC',
        'Exceptional dialogue mastery with Bard expertise in Persuasion and Deception',
        'Song of Rest provides a third Short Rest each day'
      ],
      drawbacks: [
        'Vulnerable if disarmed or silenced before building Arcane Acuity stacks',
        'Mystic Scoundrel ring is in Act 3 Circus: requires early-game patience',
        'Consumes Bardic Inspiration charges rapidly in multi-wave battles'
      ],
      combatLoopBreakdown: {
        action: 'Ranged Slashing Flourish x2 (4 hits for +8 to +10 Arcane Acuity DC)',
        bonusAction: 'Band of the Mystic Scoundrel bonus action: cast 100% DC Hold Monster, Hold Person, or Command',
        reaction: 'Shield spell (+5 AC) or Counterspell to shut down enemy casters'
      },
      keyFeats: ['Sharpshooter', 'Alert', 'Ability Score Improvement (+2 CHA)'],
      statGoals: { str: 8, dex: 16, con: 14, int: 10, wis: 10, cha: 20 },
      weapons: [
        { name: 'Titanstring Bow', act: 1, type: 'Longbow', sourceCategory: 'Main Story & Vendors', description: 'Adds STR modifier to damage. Extremely consistent with Elixirs of Hill Giant Strength.' },
        { name: 'Hand Crossbow +2', act: 2, type: 'Hand Crossbow', sourceCategory: 'Main Story & Vendors', description: 'Dual wield for reliable bonus action attacks during leveling.' },
        { name: 'Dead Shot', act: 3, type: 'Longbow', sourceCategory: 'Main Story & Vendors', description: 'Doubles proficiency bonus to ranged attacks and lowers critical roll requirement by 1.' },
        { name: 'Gontr Mael', act: 3, type: 'Longbow', sourceCategory: 'Optional Secret / Boss', questLockWarning: 'Locked behind defeating the Steel Watch Titan in the Foundry.', description: 'Inflicts Guiding Bolt and grants Celestial Haste with zero lethargy penalty.' }
      ],
      armor: {
        head: 'Helmet of Arcane Acuity',
        chest: 'Bhaalist Armor',
        gloves: 'Gloves of Dexterity',
        boots: 'Boots of Speed',
        amulet: 'Amulet of Greater Health',
        rings: ['Band of the Mystic Scoundrel', 'Caustic Band'],
        cloak: 'Cloak of Protection'
      },
      spellRecommendations: ['Healing Word', 'Hold Person', 'Hypnotic Pattern', 'Counterspell', 'Otto\'s Irresistible Dance']
    },
    {
      id: 'oath-ancients-paladin',
      name: 'Oath of the Ancients (Aura Sentinel)',
      classSplit: '7 Ancients Paladin / 5 Sorcerer',
      primaryRole: 'Tank',
      secondaryRole: 'Support',
      shortRestRecharge: false,
      damageTypes: ['Radiant', 'Slashing', 'Thunder', 'Fire'],
      tags: ['Aura of Protection', 'Smite Nova', 'Healing Radiance', 'Warding Aura'],
      description: 'Anchors the party with +5 to all saving throws (Aura of Protection) and halves all incoming spell damage (Aura of Warding), while converting Sorcerer slots into Divine Smites.',
      strengths: [
        'Immense team protection: +5 to all ally saving throws prevents disastrous crowd control wipes',
        'Aura of Warding permanently halves incoming spell damage for adjacent party members',
        'Devastating burst damage on high-priority targets using upcast Divine Smites'
      ],
      drawbacks: [
        'Strict Oath conditions: breaking your oath locks key auras until paying 1,000+ gold to the Oathbreaker Knight',
        'Melee-locked: enemies on distant ledges require Misty Step or ranged party assistance',
        'Spell slot hungry: Divine Smites burn through spell resources quickly in long dungeons'
      ],
      combatLoopBreakdown: {
        action: 'Extra Attack: 2 Great Weapon strikes combined with Level 3/4 Divine Smites',
        bonusAction: 'Quickened Metamagic spell (Misty Step or Hold Person) or Healing Radiance pulse',
        reaction: 'Divine Smite on critical hit confirmation, or Hellish Rebuke retaliation'
      },
      keyFeats: ['Great Weapon Master', 'Savage Attacker', 'Alert'],
      statGoals: { str: 20, dex: 10, con: 16, int: 8, wis: 10, cha: 18 },
      weapons: [
        { name: 'Sword of Justice', act: 1, type: 'Greatsword', sourceCategory: 'Main Story & Vendors', description: 'Grants Tyr\'s Protection (+2 AC concentration shield), excellent for Act 1 frontlining.' },
        { name: 'Halberd of Vigilance', act: 2, type: 'Halberd', sourceCategory: 'Main Story & Vendors', description: 'Bought from Lann Tarv at Moonrise. Adds +1 to Initiative and advantage on Perception.' },
        { name: 'Balduran\'s Giantslayer', act: 3, type: 'Greatsword', sourceCategory: 'Optional Secret / Boss', questLockWarning: 'Locked behind the Ansur Wyrmway Trials under the city.', description: 'Doubles Strength modifier on damage rolls and grants Giant Form enrage.' },
        { name: 'Foebreaker', act: 3, type: 'Warhammer', sourceCategory: 'Main Story & Vendors', description: 'Bypasses bludgeoning resistance and ignores sturdy wall properties, reliable vendor purchase.' }
      ],
      armor: {
        head: 'Helm of Balduran',
        chest: 'Armour of Persistence',
        gloves: 'Legacy of the Masters',
        boots: 'Boots of Striding',
        amulet: 'Broodmother\'s Revenge',
        rings: ['Ring of Protection', 'Callous Glow Ring'],
        cloak: 'Cloak of Protection'
      },
      spellRecommendations: ['Divine Smite', 'Misty Step', 'Shield of Faith', 'Healing Radiance', 'Counterspell']
    }
  ],

  shadowheart: [
    {
      id: 'light-cleric-radiant',
      name: 'Light Domain (Radiant Orb Lawnmower)',
      classSplit: '12 Light Cleric',
      primaryRole: 'Support',
      secondaryRole: 'AoE Blaster',
      shortRestRecharge: false,
      damageTypes: ['Radiant', 'Fire', 'Thunder', 'Force'],
      tags: ['Radiant Orb', 'Reverberation', 'Warding Flare', 'Mass Bless'],
      description: 'Sprints through enemy frontlines with Spirit Guardians (Radiant), stacking -10 to enemy hit rolls via Luminous Armor and triggering Reverberation knockdowns, while firing Radiance of the Dawn and Fireball.',
      strengths: [
        'Neutralizes enemy offensive threat by stacking -1 to -10 attack penalties on all nearby foes',
        'Radiance of the Dawn vaporizes swarms of Act 2 undead without expending spell slots',
        'Warding Flare reaction imposes disadvantage on attack rolls targeting Shadowheart or allies'
      ],
      drawbacks: [
        'Vulnerable to Radiant Retort (such as Sharran Sanctuary in Act 3) which redirects 200% damage back',
        'Heavy Long Rest dependency: burning spell slots on Spirit Guardians drains supplies',
        'Lacks martial weapon proficiency without racial or feat investment'
      ],
      combatLoopBreakdown: {
        action: 'Spirit Guardians (Radiant) or Radiance of the Dawn Channel Divinity AoE',
        bonusAction: 'Mass Healing Word (procs Whispering Promise team-wide Bless and Blade Ward)',
        reaction: 'Warding Flare to force enemy attack rolls to miss at disadvantage'
      },
      keyFeats: ['War Caster', 'Resilient (Constitution)', 'Alert'],
      statGoals: { str: 8, dex: 14, con: 16, int: 10, wis: 20, cha: 8 },
      weapons: [
        { name: 'Blood of Lathander', act: 1, type: 'Mace', sourceCategory: 'Optional Secret / Boss', questLockWarning: 'Requires solving the Rosymorn Monastery crest puzzle or disarming the lance trap.', description: 'Blinds fiends/undead, auto-revives from 0 HP once per long rest, and fires Sunbeam.' },
        { name: 'Phalar Aluve', act: 1, type: 'Longsword', sourceCategory: 'Main Story & Vendors', description: 'Found in the Underdark. Shriek aura adds 1d4 thunder damage and -1d4 save penalty to all affected enemies.' },
        { name: 'Devotee\'s Mace', act: 3, type: 'Mace', sourceCategory: 'Main Story & Vendors', description: 'Acquired through Divine Intervention at Cleric level 10. Emits an AoE healing aura for 10 turns.' },
        { name: 'Markoheshkir', act: 3, type: 'Quarterstaff', sourceCategory: 'Optional Secret / Boss', questLockWarning: 'Locked inside Ramazith\'s Tower lower globe barrier.', description: 'Provides Arcane Battery and elemental damage boosts for spellcasting mode.' }
      ],
      armor: {
        head: 'Holy Lance Helm',
        chest: 'Luminous Armor',
        gloves: 'Gloves of Belligerent Skies',
        boots: 'Boots of Stormy Clamour',
        amulet: 'The Whispering Promise',
        rings: ['Coruscation Ring', 'Callous Glow Ring'],
        cloak: 'Cloak of the Weave'
      },
      spellRecommendations: ['Spirit Guardians', 'Radiance of the Dawn', 'Fireball', 'Bless', 'Mass Healing Word', 'Sanctuary']
    },
    {
      id: 'life-cleric-sustain',
      name: 'Life Domain (Unkillable Combat Medic)',
      classSplit: '11 Life Cleric / 1 Storm Sorcerer',
      primaryRole: 'Support',
      secondaryRole: 'Tank',
      shortRestRecharge: false,
      damageTypes: ['Radiant', 'Bludgeoning', 'Thunder'],
      tags: ['Preserve Life', 'Blade Ward Healing', 'Heavy Armor', 'Fly Disengage'],
      description: 'The ultimate survival safety net. Disciple of Life boosts all healing, Preserve Life restores 40+ party HP with a Channel Divinity charge, and Tempestuous Magic allows flying without opportunity attacks.',
      strengths: [
        'Near-impossible for the party to wipe: huge reactive AoE healing resets low HP emergencies',
        'Every heal distributes 2 turns of Blade Ward (50% physical resistance) and 1d4 Bless to attack/saves',
        'Heavy armor and shield proficiency allows reaching 22+ AC with minimal equipment conflict'
      ],
      drawbacks: [
        'Lower personal offensive DPR compared to Light Cleric or Tempest Cleric',
        'Can lead to passive play if encounters do not stress party health pools',
        'Requires 1 level in Storm Sorcerer to solve Cleric mobility deficits'
      ],
      combatLoopBreakdown: {
        action: 'Preserve Life Channel Divinity (huge burst heal) or cast Sanctuary on endangered allies',
        bonusAction: 'Healing Word or Mass Healing Word, followed by Tempestuous Magic free fly move',
        reaction: 'Shield spell (via Sorcerer) or War Caster opportunity spell'
      },
      keyFeats: ['War Caster', 'Alert', 'Ability Score Improvement (+2 WIS)'],
      statGoals: { str: 10, dex: 12, con: 16, int: 8, wis: 20, cha: 12 },
      weapons: [
        { name: 'The Whispering Promise (Dagger/Staff alternative)', act: 1, type: 'Mace', sourceCategory: 'Main Story & Vendors', description: 'Equip with any standard 1H weapon while Whispering Promise ring/amulet handles buffing.' },
        { name: 'Selûne\'s Spear of Night', act: 2, type: 'Spear', sourceCategory: 'Quest Locked', questLockWarning: 'Requires sparing Nightsong and rejecting the dark path in the Shadowfell.', description: 'Grants advantage on Wisdom saves and Moonmote zone illumination.' },
        { name: 'Shar\'s Spear of Evening', act: 2, type: 'Spear', sourceCategory: 'Quest Locked', questLockWarning: 'Requires slaying Nightsong and committing to Shar, locking out Selûnite rewards.', description: 'Grants total blindness immunity, at-will Darkness, and bonus damage against obscured targets.' },
        { name: 'Ketheric\'s Warhammer', act: 2, type: 'Warhammer', sourceCategory: 'Main Story & Vendors', description: 'Looted from Ketheric Thorm upon defeat, provides solid bludgeoning and radiant bonus.' }
      ],
      armor: {
        head: 'Wapira\'s Crown',
        chest: 'Armour of Persistence',
        gloves: 'Hellrider\'s Pride',
        boots: 'Boots of Aid and Comfort',
        amulet: 'Amulet of the Devout',
        rings: ['The Whispering Promise', 'Ring of Salving'],
        cloak: 'Cloak of Protection'
      },
      spellRecommendations: ['Preserve Life', 'Mass Healing Word', 'Aid (Upcast)', 'Heroes\' Feast', 'Death Ward']
    },
    {
      id: 'trickery-stealth-cleric',
      name: 'Trickery Domain (Canonical Shadow Infiltrator)',
      classSplit: '12 Trickery Cleric (Canonical Origin)',
      primaryRole: 'Controller',
      secondaryRole: 'Support',
      shortRestRecharge: false,
      damageTypes: ['Radiant', 'Poison', 'Psychic'],
      tags: ['Pass Without Trace', 'Invoke Duplicity', 'Stealth Advantage', 'Shar Canon'],
      description: 'Shadowheart\'s canonical origin path. Utilizes Invoke Duplicity to grant advantage to melee companions, and Pass Without Trace (+10 Stealth) to initiate guaranteed surprise rounds.',
      strengths: [
        'Pass Without Trace (+10 Stealth to entire party) guarantees initiating combat with Surprise rounds',
        'Invoke Duplicity clone grants permanent attack advantage to martial allies in a 3m radius',
        'Domain spells include Dimension Door and Polymorph for high exploratory utility'
      ],
      drawbacks: [
        'Channel Divinity Invoke Duplicity requires concentration, competing directly with Spirit Guardians and Bless',
        'Significantly lower damage and burst healing than Light or Life domains',
        'Poison and psychic domain spells face widespread damage resistance in Acts 2 and 3'
      ],
      combatLoopBreakdown: {
        action: 'Cast Pass Without Trace before combat, then drop Fear or Bestow Curse during battle',
        bonusAction: 'Invoke Duplicity illusion to grant melee companions automatic attack advantage',
        reaction: 'Shield of Faith reaction or standard opportunity attack'
      },
      keyFeats: ['War Caster', 'Alert', 'Resilient (Constitution)'],
      statGoals: { str: 10, dex: 14, con: 16, int: 10, wis: 18, cha: 8 },
      weapons: [
        { name: 'Dagger of Shar', act: 1, type: 'Dagger', sourceCategory: 'Main Story & Vendors', description: 'Standard finesse weapon for stealth engagement.' },
        { name: 'Shar\'s Spear of Evening', act: 2, type: 'Spear', sourceCategory: 'Quest Locked', questLockWarning: 'Requires completing Shar\'s Gauntlet and killing Nightsong.', description: 'Canonical Sharran artifact granting Darkness sight immunity and Shar\'s Darkness.' },
        { name: 'Knife of the Undermountain King', act: 1, type: 'Shortsword', sourceCategory: 'Main Story & Vendors', description: 'Purchased in Crèche Y\'llek. Lowers crit threshold and rerolls low damage dice.' }
      ],
      armor: {
        head: 'Dark Justiciar Helm',
        chest: 'Dark Justiciar Half-Plate',
        gloves: 'Dark Justiciar Gauntlets',
        boots: 'Dark Justiciar Boots',
        amulet: 'Surgeon\'s Subjugation Amulet',
        rings: ['Shadow-Cloaked Ring', 'Crypt Lord Ring'],
        cloak: 'Shade-Slayer Cloak'
      },
      spellRecommendations: ['Pass Without Trace', 'Dimension Door', 'Spirit Guardians', 'Mirror Image', 'Fear']
    }
  ],

  karlach: [
    {
      id: 'berserker-throwzerker',
      name: 'Berserker Throwzerker (Honor Mode S-Tier)',
      classSplit: '5 Berserker Barbarian / 4 Thief Rogue / 3 Champion Fighter',
      primaryRole: 'Tank',
      secondaryRole: 'Striker',
      shortRestRecharge: true,
      damageTypes: ['Bludgeoning', 'Piercing', 'Fire', 'Thunder'],
      tags: ['Throwzerker', 'Prone on Hit', 'Tavern Brawler', 'Soul Coin Fire'],
      description: 'The premier ranged physical carry in the game. Tavern Brawler adds double Strength modifier (+10 to +12) to attack and damage rolls with thrown weapons. Fast Hands gives two bonus actions for Enraged Throws that knock bosses prone without a saving throw.',
      strengths: [
        '95% guaranteed hit accuracy against 25+ AC bosses due to double Strength scaling',
        'Enraged Throw inflicts the Prone status condition with zero saving throw',
        'Soul Coins add +2d4 fire damage to every attack while raging',
        'Exceptional resource longevity: relies on Short Rests and weapon durability'
      ],
      drawbacks: [
        'Requires line-of-sight and clear ballistic arc: low ceilings or overhanging beams can obstruct throws',
        'Thrown weapons occasionally fail to return if combat ends immediately upon throwing',
        'Soul Coins are finite consumables across the campaign'
      ],
      combatLoopBreakdown: {
        action: 'Extra Attack: throw pike/trident twice with Tavern Brawler double STR bonus',
        bonusAction: 'Fast Hands gives 2 bonus actions: Enraged Throw (inflicts prone) followed by Frenzied Strike',
        reaction: 'Riposte or Opportunity Attack'
      },
      keyFeats: ['Tavern Brawler (+1 STR)', 'Alert', 'Great Weapon Master'],
      statGoals: { str: 22, dex: 14, con: 16, int: 8, wis: 12, cha: 8 },
      weapons: [
        { name: 'Returning Pike', act: 1, type: 'Pike', sourceCategory: 'Main Story & Vendors', description: 'Bought from Grat the Trader in Goblin Camp. Automatically returns to hand when thrown.' },
        { name: 'Lightning Jabber', act: 2, type: 'Spear', sourceCategory: 'Optional Secret / Boss', questLockWarning: 'Looted from the Kuo-Toa ambush in Reithwin. Does not auto-return unless bound by Eldritch Knight.', description: 'Deals 1d4 additional lightning damage and can shock targets.' },
        { name: 'Nyrulna', act: 3, type: 'Trident', sourceCategory: 'Optional Secret / Boss', questLockWarning: 'Won from Akabi the Djinni at the Circus by pickpocketing his cheating ring.', description: 'Returns automatically, deals +3d4 thunder splash, and boosts movement speed by 3m.' },
        { name: 'Dwarven Thrower', act: 3, type: 'Warhammer', sourceCategory: 'Main Story & Vendors', description: 'Sold by Ferg Drogher in Rivington. Deals bonus damage when thrown by dwarves or disguise self users.' }
      ],
      armor: {
        head: 'Helm of Balduran',
        chest: 'Bonespike Garb',
        gloves: 'Kushigo Gloves',
        boots: 'Boots of Striding',
        amulet: 'Broodmother\'s Revenge',
        rings: ['Ring of Flinging', 'Caustic Band'],
        cloak: 'Fleshmelter Cloak'
      },
      spellRecommendations: ['Soul Coin Overdrive', 'Enraged Throw', 'Frenzy Rage', 'Action Surge']
    },
    {
      id: 'wildheart-tiger-bleed',
      name: 'Wildheart (Tiger Aspect Cleave & Bleed)',
      classSplit: '8 Wildheart Barbarian / 4 Champion Fighter',
      primaryRole: 'Tank',
      secondaryRole: 'Striker',
      shortRestRecharge: true,
      damageTypes: ['Slashing', 'Fire', 'Thunder'],
      tags: ['Tiger Cleave', 'Maim on Bleed', 'Wolverine Aspect', 'Melee Swarm'],
      description: 'Tiger\'s Bloodlust attacks 3 adjacent targets in a wide arc every swing, inflicting Bleeding. Paired with Aspect of the Wolverine, bleeding targets are automatically Maimed (movement reduced to 0), pinning entire frontlines in place.',
      strengths: [
        'Infinite multi-target cleave without expending resources or spell slots',
        'Maim reduces enemy movement speed to 0 with no saving throw, locking bosses in place',
        'High natural Barbarian HP and damage resistances keep Karlach in combat indefinitely'
      ],
      drawbacks: [
        'Requires grouping enemies in close proximity to maximize cleave effectiveness',
        'Lower single-target boss burst than the Throwzerker setup',
        'Bleed-immune constructs and undead in Act 3 bypass the Maim lockdown'
      ],
      combatLoopBreakdown: {
        action: 'Tiger\'s Bloodlust Cleave x2 (hitting up to 6 targets to inflict Bleed and Maim)',
        bonusAction: 'Rage: Tiger Heart activation, or Great Weapon Master bonus attack on kill/crit',
        reaction: 'Relentless Retaliation or Opportunity Attack'
      },
      keyFeats: ['Great Weapon Master', 'Alert', 'Savage Attacker'],
      statGoals: { str: 20, dex: 14, con: 16, int: 8, wis: 12, cha: 8 },
      weapons: [
        { name: 'Sword of Justice', act: 1, type: 'Greatsword', sourceCategory: 'Main Story & Vendors', description: 'Early Act 1 greatsword granting Tyr\'s Protection for defensive frontline tanking.' },
        { name: 'Sorrow', act: 1, type: 'Glaive', sourceCategory: 'Main Story & Vendors', description: 'Reward from Rath in the Emerald Grove. Grants Sorrowful Lash bonus action whip.' },
        { name: 'Voss\' Silver Sword', act: 1, type: 'Greatsword', sourceCategory: 'Optional Secret / Boss', questLockWarning: 'Requires disarming Kith\'rak Voss at the Mountain Pass encounter.', description: 'Deals bonus psychic damage and wrath on kill.' },
        { name: 'Balduran\'s Giantslayer', act: 3, type: 'Greatsword', sourceCategory: 'Optional Secret / Boss', questLockWarning: 'Requires defeating Ansur in the Wyrmway under the city.', description: 'Doubles Strength modifier on damage and grants Giant Form.' }
      ],
      armor: {
        head: 'Sarevok\'s Horned Helmet',
        chest: 'Armour of Agility',
        gloves: 'Enervating Gloves',
        boots: 'Helldusk Boots',
        amulet: 'Amulet of Greater Health',
        rings: ['Killer\'s Sweetheart', 'Ring of Protection'],
        cloak: 'Cloak of Displacement'
      },
      spellRecommendations: ['Tiger\'s Bloodlust', 'Rage: Tiger Heart', 'Reckless Attack', 'Dash']
    }
  ],

  astarion: [
    {
      id: 'open-hand-monk-thief',
      name: 'Way of the Open Hand (Tavern Brawler Pugilist)',
      classSplit: '8 Open Hand Monk / 4 Thief Rogue',
      primaryRole: 'Striker',
      secondaryRole: 'Skill Monkey',
      shortRestRecharge: true,
      damageTypes: ['Bludgeoning', 'Necrotic', 'Force', 'Radiant'],
      tags: ['Tavern Brawler', 'Fast Hands', 'Happy Buff', 'Stunning Strike'],
      description: 'The highest single-target melee damage build in BG3. Combines Tavern Brawler with high Strength and Open Hand Manifestations. Thief Rogue grants two bonus actions, delivering 6 attacks per round dealing over 200 DPR.',
      strengths: [
        'Highest single-target DPR in the game, easily toppling high-HP Honor Mode bosses',
        'Stunning Strike incapacitates targets, forcing them to skip entire combat rounds',
        'Happy buff (+1 to all checks) and Ascended Bite (+1d10 necrotic) maximize hit and damage consistency'
      ],
      drawbacks: [
        'Requires Strength investment or daily consumption of Elixirs of Hill/Cloud Giant Strength',
        'High Ki point consumption during lengthy multi-round boss encounters',
        'Melee range requirement exposes Astarion to close-range area hazards'
      ],
      combatLoopBreakdown: {
        action: 'Unarmed Strike x2 (or Stunning Strike to lock down the priority boss)',
        bonusAction: 'Fast Hands provides 2 bonus actions: Flurry of Blows (Topple) followed by Flurry of Blows (Stagger)',
        reaction: 'Deflect Missiles to reduce incoming ranged projectile damage to 0'
      },
      keyFeats: ['Tavern Brawler (+1 CON)', 'Alert', 'Mobile'],
      statGoals: { str: 8, dex: 16, con: 16, int: 8, wis: 16, cha: 8 },
      weapons: [
        { name: 'Corellon\'s Grace', act: 1, type: 'Quarterstaff', sourceCategory: 'Main Story & Vendors', description: 'Bought from Auntie Ethel in the Grove. Grants +1 to unarmed attack rolls and saves.' },
        { name: 'Club of Hill Giant Strength', act: 1, type: 'Club', sourceCategory: 'Main Story & Vendors', description: 'Found in the Arcane Tower. Sets Strength to 19 when held in the off-hand.' },
        { name: 'Knife of the Undermountain King', act: 1, type: 'Shortsword', sourceCategory: 'Main Story & Vendors', description: 'Lowers critical roll requirement by 1 when stat-sticking in weapon slots.' },
        { name: 'Bloodthirst', act: 3, type: 'Dagger', sourceCategory: 'Quest Locked', questLockWarning: 'Looted from Orin the Red in the Temple of Bhaal.', description: 'Lowers crit threshold and inflicts piercing vulnerability on main-hand strike.' }
      ],
      armor: {
        head: 'Mask of Soul Perception',
        chest: 'Vest of Soul Revitalization',
        gloves: 'Gloves of Soul Catching',
        boots: 'Boots of Uninhibited Kushigo',
        amulet: 'Sentient Amulet',
        rings: ['Ring of Regeneration', 'Caustic Band'],
        cloak: 'Shade-Slayer Cloak'
      },
      spellRecommendations: ['Vampire Bite', 'Flurry of Blows: Topple', 'Stunning Strike', 'Wholeness of Body']
    },
    {
      id: 'gloom-stalker-assassin',
      name: 'Gloom Stalker Assassin (Turn-1 Terminator)',
      classSplit: '5 Gloom Stalker / 4 Assassin / 3 Battle Master',
      primaryRole: 'Striker',
      secondaryRole: 'Skill Monkey',
      shortRestRecharge: true,
      damageTypes: ['Piercing', 'Slashing', 'Poison'],
      tags: ['Dread Ambusher', 'Auto-Crit on Surprise', 'Sharpshooter', 'Alpha Strike'],
      description: 'The master of surprise rounds. Fires up to 7 attacks in round 1 with Action Surge and Dread Ambusher. Automatically scores critical hits against surprised targets, wiping out elite encounters before enemies act.',
      strengths: [
        'Guaranteed 100% critical hits against all surprised enemies in opening turns',
        'Highest round 1 burst damage from stealth in the entire game',
        'Expertise in Stealth and Sleight of Hand handles all DC 30 lockpicking and trap disarming'
      ],
      drawbacks: [
        'Noticeably lower sustained DPR in long extended battles after round 1',
        'Honor Mode legendary bosses with Alert perk or cutscene triggers cannot be surprised',
        'Sharpshooter -5 attack penalty requires advantage sources (like Risky Ring) to maintain hit rate'
      ],
      combatLoopBreakdown: {
        action: 'Extra Attack x2 with Dread Ambusher bonus strike and Action Surge (6-7 ranged shots)',
        bonusAction: 'Hunter\'s Mark target, or Hide to re-engage stealth advantage',
        reaction: 'Riposte or standard opportunity attack'
      },
      keyFeats: ['Sharpshooter', 'Alert', 'Ability Score Improvement (+2 DEX)'],
      statGoals: { str: 8, dex: 20, con: 14, int: 8, wis: 16, cha: 10 },
      weapons: [
        { name: 'Titanstring Bow', act: 1, type: 'Longbow', sourceCategory: 'Main Story & Vendors', description: 'Adds Strength modifier to damage, scaling drastically with Elixirs.' },
        { name: 'The Dead Shot', act: 3, type: 'Longbow', sourceCategory: 'Main Story & Vendors', description: 'Bought from Fytz the Firecracker. Doubles proficiency bonus to ranged rolls and lowers crit threshold.' },
        { name: 'Gontr Mael', act: 3, type: 'Longbow', sourceCategory: 'Optional Secret / Boss', questLockWarning: 'Looted from the Steel Watch Foundry boss titan.', description: 'Inflicts Guiding Bolt and grants Celestial Haste.' },
        { name: 'Bows of the Banshee', act: 1, type: 'Shortbow', sourceCategory: 'Main Story & Vendors', description: 'Sold by Corsair Greymon on the Underdark skiff. Inflicts Frightened on hit.' }
      ],
      armor: {
        head: 'Sarevok\'s Horned Helmet',
        chest: 'Bhaalist Armor',
        gloves: 'Craterflesh Gloves',
        boots: 'Disintegrating Night Walkers',
        amulet: 'Surgeon\'s Subjugation Amulet',
        rings: ['Risky Ring', 'Killer\'s Sweetheart'],
        cloak: 'Deathstalker Mantle'
      },
      spellRecommendations: ['Dread Ambusher: Ranged', 'Hunter\'s Mark', 'Misty Step', 'Pass Without Trace']
    }
  ]
};

// Update companions with the new selectable builds
for (const comp of companions) {
  if (buildsMap[comp.id]) {
    comp.builds = buildsMap[comp.id];
  } else {
    // Default single build fallback matching current properties
    comp.builds = [
      {
        id: `${comp.id}-canonical`,
        name: `${comp.canonicalClass} (${comp.canonicalSubclass})`,
        classSplit: comp.recommendedMulticlass,
        primaryRole: comp.primaryRole,
        secondaryRole: comp.secondaryRole,
        shortRestRecharge: comp.shortRestRecharge,
        damageTypes: comp.damageTypes,
        tags: comp.tags,
        description: comp.optimizationRationale || `${comp.name}'s primary optimized build template.`,
        strengths: ['High performance synergy with core party compositions', 'Reliable resource recovery', 'Strong thematic narrative fit'],
        drawbacks: ['Requires standard itemization milestones', 'Specific situational resistances apply'],
        combatLoopBreakdown: comp.combatLoopBreakdown || {
          action: 'Standard class actions and primary attack sequences',
          bonusAction: 'Class bonus utility and spells',
          reaction: 'Defensive reaction spells and counter-attacks'
        },
        keyFeats: comp.skillPriority.keyFeats,
        statGoals: comp.skillPriority.statGoals,
        weapons: comp.optimalGear.weapons,
        armor: comp.optimalGear.armor,
        spellRecommendations: comp.skillPriority.spellRecommendations
      }
    ];
  }
}

fs.writeFileSync(companionsPath, JSON.stringify(companions, null, 2), 'utf8');
console.log('Successfully updated companions.json with modular builds and quest-aware weapons.');
