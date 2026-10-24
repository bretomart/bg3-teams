<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import type { CombatRole, AbilityName } from '../types/companion';
import { UserCog, Sparkles, RotateCcw, Save } from 'lucide-vue-next';

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const store = useTeamStore();

// Local copy for editing
const form = ref({ ...store.customTavConfig });
const savedMessage = ref(false);

const races = [
  'Githyanki',
  'High Elf',
  'Wood Elf',
  'Drow',
  'Human',
  'Lightfoot Halfling',
  'Strongheart Halfling',
  'Gold Dwarf',
  'Shield Dwarf',
  'Duergar',
  'Forest Gnome',
  'Rock Gnome',
  'Deep Gnome',
  'Half-Orc',
  'Tiefling (Asmodeus)',
  'Tiefling (Mephistopheles)',
  'Tiefling (Zariel)',
  'Dragonborn'
];

const backgrounds = [
  'Acolyte',
  'Charlatan',
  'Criminal',
  'Entertainer',
  'Folk Hero',
  'Guild Artisan',
  'Noble',
  'Outlander',
  'Sage',
  'Soldier',
  'Urchin'
];

const classes = [
  'Barbarian',
  'Bard',
  'Cleric',
  'Druid',
  'Fighter',
  'Monk',
  'Paladin',
  'Ranger',
  'Rogue',
  'Sorcerer',
  'Warlock',
  'Wizard'
];

const roles: CombatRole[] = [
  'Striker',
  'AoE Blaster',
  'Controller',
  'Support',
  'Tank',
  'Skill Monkey',
  'Party Face'
];

// Point buy calculation
// Scores 8-15 cost points: 8:0, 9:1, 10:2, 11:3, 12:4, 13:5, 14:7, 15:9
const pointCost = (val: number): number => {
  if (val <= 8) return 0;
  if (val === 9) return 1;
  if (val === 10) return 2;
  if (val === 11) return 3;
  if (val === 12) return 4;
  if (val === 13) return 5;
  if (val === 14) return 7;
  if (val >= 15) return 9;
  return 0;
};

const totalPointsSpent = computed(() => {
  return (
    pointCost(form.value.str) +
    pointCost(form.value.dex) +
    pointCost(form.value.con) +
    pointCost(form.value.int) +
    pointCost(form.value.wis) +
    pointCost(form.value.cha)
  );
});

const remainingPoints = computed(() => 27 - totalPointsSpent.value);

const adjustAbility = (stat: AbilityName, delta: number) => {
  const current = form.value[stat];
  const next = current + delta;
  if (next < 8 || next > 15) return;

  const currentCost = pointCost(current);
  const nextCost = pointCost(next);
  const costDiff = nextCost - currentCost;

  if (delta > 0 && remainingPoints.value < costDiff) return;

  form.value[stat] = next;
};

const resetToDefaults = () => {
  form.value = {
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
};

const saveAndApply = () => {
  store.updateCustomTav(form.value);
  savedMessage.value = true;
  setTimeout(() => {
    savedMessage.value = false;
    emit('close');
  }, 600);
};
</script>

<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
    <div class="bg-gradient-to-b from-[#211913] to-[#140e0a] border-2 border-[#d4af37] w-full max-w-2xl rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] text-[#f4ebd9] relative">
      <!-- Corner Filigree Ornaments -->
      <div class="absolute top-2 left-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
      <div class="absolute top-2 right-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>

      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-[#443221]">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-[#2a1d13] border border-[#8c6d37] text-[#d4af37]">
            <UserCog class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-xl font-bold font-['Cinzel'] text-[#fcedb6] tracking-wide">Custom Character (Tav) Workbench</h3>
            <p class="text-xs text-[#b5a07e] font-['EB_Garamond'] text-[14px]">Inscribe your protagonist, 27 point-buy ability scores, and tactical role.</p>
          </div>
        </div>
        <button
          @click="emit('close')"
          class="text-[#8c785b] hover:text-[#fcedb6] p-1.5 rounded-lg hover:bg-[#261c14] transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Identity & Role Matrix -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <div>
          <label class="block text-xs font-semibold text-[#c5a059] mb-1 font-['Cinzel']">Character Name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#120d09] border border-[#3d2c1d] text-[#fcedb6] focus:outline-none focus:border-[#d4af37] font-['Cinzel']"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-[#c5a059] mb-1 font-['Cinzel']">Avatar Silhouette</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="form.gender = 'male'"
              :class="[
                'flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-xl border transition-all font-[\'Cinzel\']',
                form.gender === 'male'
                  ? 'bg-gradient-to-r from-[#0c4a6e]/70 to-[#082f49]/80 text-[#bae6fd] border-[#38bdf8] ring-1 ring-[#38bdf8]/40'
                  : 'bg-[#120d09] text-[#8c785b] border-[#3d2c1d] hover:border-[#6b5238]'
              ]"
            >
              <span>Male Outline</span>
            </button>
            <button
              type="button"
              @click="form.gender = 'female'"
              :class="[
                'flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-xl border transition-all font-[\'Cinzel\']',
                form.gender === 'female'
                  ? 'bg-gradient-to-r from-[#701a75]/70 to-[#4a044e]/80 text-[#f5d0fe] border-[#c026d3] ring-1 ring-[#c026d3]/40'
                  : 'bg-[#120d09] text-[#8c785b] border-[#3d2c1d] hover:border-[#6b5238]'
              ]"
            >
              <span>Female Outline</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-[#c5a059] mb-1 font-['Cinzel']">Race</label>
          <select
            v-model="form.race"
            class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#120d09] border border-[#3d2c1d] text-[#f4ebd9] focus:outline-none focus:border-[#d4af37] font-['Cinzel']"
          >
            <option v-for="r in races" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-[#c5a059] mb-1 font-['Cinzel']">Background</label>
          <select
            v-model="form.background"
            class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#120d09] border border-[#3d2c1d] text-[#f4ebd9] focus:outline-none focus:border-[#d4af37] font-['Cinzel']"
          >
            <option v-for="b in backgrounds" :key="b" :value="b">{{ b }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-[#c5a059] mb-1 font-['Cinzel']">Base Class</label>
          <select
            v-model="form.canonicalClass"
            class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#120d09] border border-[#3d2c1d] text-[#f4ebd9] focus:outline-none focus:border-[#d4af37] font-['Cinzel']"
          >
            <option v-for="c in classes" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-[#c5a059] mb-1 font-['Cinzel']">Subclass or Build Title</label>
          <input
            v-model="form.canonicalSubclass"
            type="text"
            placeholder="e.g. College of Swords"
            class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#120d09] border border-[#3d2c1d] text-[#f4ebd9] focus:outline-none focus:border-[#d4af37] font-['EB_Garamond'] text-[14px]"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-xs font-semibold text-[#c5a059] mb-1 font-['Cinzel']">Primary Combat Role</label>
          <select
            v-model="form.primaryRole"
            class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#120d09] border border-[#3d2c1d] text-[#f4ebd9] focus:outline-none focus:border-[#d4af37] font-['Cinzel']"
          >
            <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
          </select>
        </div>
      </div>

      <!-- Point Buy Ability Score Allocator -->
      <div class="mt-6 p-5 rounded-xl grimoire-inset">
        <div class="flex items-center justify-between pb-3.5 border-b border-[#38281a]">
          <div class="flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-[#d4af37]" />
            <h4 class="text-sm font-bold text-[#fcedb6] font-['Cinzel']">Point-Buy Ability Scores (27 Points Max)</h4>
          </div>
          <span
            :class="[
              'px-3 py-0.5 text-xs font-bold rounded-full border font-[\'Cinzel\']',
              remainingPoints === 0
                ? 'bg-[#064e3b]/50 text-[#a7f3d0] border-[#059669]'
                : remainingPoints > 0
                ? 'bg-[#78350f]/50 text-[#fde68a] border-[#d97706]'
                : 'bg-[#450a0a]/60 text-[#fca5a5] border-[#b91c1c]'
            ]"
          >
            Points Remaining: {{ remainingPoints }}
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3.5 mt-4">
          <!-- STR -->
          <div class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-[#8c785b] block uppercase font-['Cinzel']">STR</span>
              <span class="text-base font-bold text-[#fcedb6] font-['Cinzel']">{{ form.str }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button
                @click="adjustAbility('str', -1)"
                :disabled="form.str <= 8"
                class="w-7 h-7 rounded bg-[#261c14] hover:bg-[#38281a] disabled:opacity-30 text-xs font-bold font-['Cinzel'] text-[#f4ebd9]"
              >
                -
              </button>
              <button
                @click="adjustAbility('str', 1)"
                :disabled="form.str >= 15 || remainingPoints <= 0"
                class="w-7 h-7 rounded bg-[#261c14] hover:bg-[#38281a] disabled:opacity-30 text-xs font-bold font-['Cinzel'] text-[#d4af37]"
              >
                +
              </button>
            </div>
          </div>

          <!-- DEX -->
          <div class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-[#8c785b] block uppercase font-['Cinzel']">DEX</span>
              <span class="text-base font-bold text-[#fcedb6] font-['Cinzel']">{{ form.dex }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button
                @click="adjustAbility('dex', -1)"
                :disabled="form.dex <= 8"
                class="w-7 h-7 rounded bg-[#261c14] hover:bg-[#38281a] disabled:opacity-30 text-xs font-bold font-['Cinzel'] text-[#f4ebd9]"
              >
                -
              </button>
              <button
                @click="adjustAbility('dex', 1)"
                :disabled="form.dex >= 15 || remainingPoints <= 0"
                class="w-7 h-7 rounded bg-[#261c14] hover:bg-[#38281a] disabled:opacity-30 text-xs font-bold font-['Cinzel'] text-[#d4af37]"
              >
                +
              </button>
            </div>
          </div>

          <!-- CON -->
          <div class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-[#8c785b] block uppercase font-['Cinzel']">CON</span>
              <span class="text-base font-bold text-[#fcedb6] font-['Cinzel']">{{ form.con }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button
                @click="adjustAbility('con', -1)"
                :disabled="form.con <= 8"
                class="w-7 h-7 rounded bg-[#261c14] hover:bg-[#38281a] disabled:opacity-30 text-xs font-bold font-['Cinzel'] text-[#f4ebd9]"
              >
                -
              </button>
              <button
                @click="adjustAbility('con', 1)"
                :disabled="form.con >= 15 || remainingPoints <= 0"
                class="w-7 h-7 rounded bg-[#261c14] hover:bg-[#38281a] disabled:opacity-30 text-xs font-bold font-['Cinzel'] text-[#d4af37]"
              >
                +
              </button>
            </div>
          </div>

          <!-- INT -->
          <div class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-[#8c785b] block uppercase font-['Cinzel']">INT</span>
              <span class="text-base font-bold text-[#fcedb6] font-['Cinzel']">{{ form.int }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button
                @click="adjustAbility('int', -1)"
                :disabled="form.int <= 8"
                class="w-7 h-7 rounded bg-[#261c14] hover:bg-[#38281a] disabled:opacity-30 text-xs font-bold font-['Cinzel'] text-[#f4ebd9]"
              >
                -
              </button>
              <button
                @click="adjustAbility('int', 1)"
                :disabled="form.int >= 15 || remainingPoints <= 0"
                class="w-7 h-7 rounded bg-[#261c14] hover:bg-[#38281a] disabled:opacity-30 text-xs font-bold font-['Cinzel'] text-[#d4af37]"
              >
                +
              </button>
            </div>
          </div>

          <!-- WIS -->
          <div class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-[#8c785b] block uppercase font-['Cinzel']">WIS</span>
              <span class="text-base font-bold text-[#fcedb6] font-['Cinzel']">{{ form.wis }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button
                @click="adjustAbility('wis', -1)"
                :disabled="form.wis <= 8"
                class="w-7 h-7 rounded bg-[#261c14] hover:bg-[#38281a] disabled:opacity-30 text-xs font-bold font-['Cinzel'] text-[#f4ebd9]"
              >
                -
              </button>
              <button
                @click="adjustAbility('wis', 1)"
                :disabled="form.wis >= 15 || remainingPoints <= 0"
                class="w-7 h-7 rounded bg-[#261c14] hover:bg-[#38281a] disabled:opacity-30 text-xs font-bold font-['Cinzel'] text-[#d4af37]"
              >
                +
              </button>
            </div>
          </div>

          <!-- CHA -->
          <div class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-[#8c785b] block uppercase font-['Cinzel']">CHA</span>
              <span class="text-base font-bold text-[#fcedb6] font-['Cinzel']">{{ form.cha }}</span>
            </div>
            <div class="flex items-center gap-1.5">
              <button
                @click="adjustAbility('cha', -1)"
                :disabled="form.cha <= 8"
                class="w-7 h-7 rounded bg-[#261c14] hover:bg-[#38281a] disabled:opacity-30 text-xs font-bold font-['Cinzel'] text-[#f4ebd9]"
              >
                -
              </button>
              <button
                @click="adjustAbility('cha', 1)"
                :disabled="form.cha >= 15 || remainingPoints <= 0"
                class="w-7 h-7 rounded bg-[#261c14] hover:bg-[#38281a] disabled:opacity-30 text-xs font-bold font-['Cinzel'] text-[#d4af37]"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex items-center justify-between pt-5 mt-5 border-t border-[#443221]">
        <button
          @click="resetToDefaults"
          class="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#8c785b] hover:text-[#fcedb6] transition-colors font-['Cinzel']"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          Reset Defaults
        </button>

        <div class="flex items-center gap-3">
          <button
            @click="emit('close')"
            class="px-4 py-2 text-xs font-semibold rounded-xl bg-[#261c14] hover:bg-[#38281a] text-[#b5a07e] border border-[#443221] transition-colors font-['Cinzel']"
          >
            Cancel
          </button>
          <button
            @click="saveAndApply"
            class="flex items-center gap-2 px-6 py-2 text-xs font-bold rounded-xl btn-grimoire-gold shadow-lg shadow-[#d4af37]/20 transition-all font-['Cinzel']"
          >
            <Save class="w-4 h-4" />
            {{ savedMessage ? 'Inscribed!' : 'Inscribe to Party' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
