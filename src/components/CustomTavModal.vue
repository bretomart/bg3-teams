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
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
    <div class="bg-slate-900 border border-amber-500/40 w-full max-w-2xl rounded-2xl shadow-2xl p-6 overflow-y-auto max-h-[90vh] text-slate-100">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <div class="flex items-center gap-2.5">
          <div class="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <UserCog class="w-5 h-5" />
          </div>
          <div>
            <h3 class="text-lg font-bold font-serif text-slate-100 tracking-wide">Custom Character (Tav) Workbench</h3>
            <p class="text-xs text-slate-400">Configure your personal protagonist, 27 point-buy ability scores, and tactical role.</p>
          </div>
        </div>
        <button
          @click="emit('close')"
          class="text-slate-400 hover:text-slate-200 p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          ✕
        </button>
      </div>

      <!-- Identity & Role Matrix -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Character Name</label>
          <input
            v-model="form.name"
            type="text"
            class="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Avatar Model / Silhouette</label>
          <div class="grid grid-cols-2 gap-2">
            <button
              type="button"
              @click="form.gender = 'male'"
              :class="[
                'flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-xl border transition-all',
                form.gender === 'male'
                  ? 'bg-sky-500/20 text-sky-300 border-sky-400/50 ring-1 ring-sky-400/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              ]"
            >
              <span>Male Outline</span>
            </button>
            <button
              type="button"
              @click="form.gender = 'female'"
              :class="[
                'flex items-center justify-center gap-2 px-3 py-2 text-xs font-bold rounded-xl border transition-all',
                form.gender === 'female'
                  ? 'bg-fuchsia-500/20 text-fuchsia-300 border-fuchsia-400/50 ring-1 ring-fuchsia-400/30'
                  : 'bg-slate-950 text-slate-400 border-slate-800 hover:border-slate-700'
              ]"
            >
              <span>Female Outline</span>
            </button>
          </div>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Race</label>
          <select
            v-model="form.race"
            class="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
          >
            <option v-for="r in races" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Background</label>
          <select
            v-model="form.background"
            class="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
          >
            <option v-for="b in backgrounds" :key="b" :value="b">{{ b }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Base Class</label>
          <select
            v-model="form.canonicalClass"
            class="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
          >
            <option v-for="c in classes" :key="c" :value="c">{{ c }}</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Subclass or Build Title</label>
          <input
            v-model="form.canonicalSubclass"
            type="text"
            placeholder="e.g. College of Swords"
            class="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
          />
        </div>

        <div>
          <label class="block text-xs font-semibold text-slate-300 mb-1">Primary Combat Role</label>
          <select
            v-model="form.primaryRole"
            class="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400"
          >
            <option v-for="role in roles" :key="role" :value="role">{{ role }}</option>
          </select>
        </div>
      </div>

      <!-- Point Buy Ability Score Allocator -->
      <div class="mt-6 p-4 rounded-xl bg-slate-950/80 border border-slate-800">
        <div class="flex items-center justify-between pb-3 border-b border-slate-800">
          <div class="flex items-center gap-2">
            <Sparkles class="w-4 h-4 text-amber-400" />
            <h4 class="text-sm font-bold text-slate-200">Point-Buy Ability Scores (27 Points Max)</h4>
          </div>
          <span
            :class="[
              'px-2.5 py-0.5 text-xs font-bold rounded-full border',
              remainingPoints === 0
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                : remainingPoints > 0
                ? 'bg-amber-500/20 text-amber-300 border-amber-500/40'
                : 'bg-rose-500/20 text-rose-300 border-rose-500/40'
            ]"
          >
            Points Remaining: {{ remainingPoints }}
          </span>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
          <!-- STR -->
          <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-slate-400 block uppercase">STR</span>
              <span class="text-base font-bold text-amber-300">{{ form.str }}</span>
            </div>
            <div class="flex items-center gap-1">
              <button
                @click="adjustAbility('str', -1)"
                :disabled="form.str <= 8"
                class="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold"
              >
                -
              </button>
              <button
                @click="adjustAbility('str', 1)"
                :disabled="form.str >= 15 || remainingPoints <= 0"
                class="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold text-amber-400"
              >
                +
              </button>
            </div>
          </div>

          <!-- DEX -->
          <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-slate-400 block uppercase">DEX</span>
              <span class="text-base font-bold text-amber-300">{{ form.dex }}</span>
            </div>
            <div class="flex items-center gap-1">
              <button
                @click="adjustAbility('dex', -1)"
                :disabled="form.dex <= 8"
                class="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold"
              >
                -
              </button>
              <button
                @click="adjustAbility('dex', 1)"
                :disabled="form.dex >= 15 || remainingPoints <= 0"
                class="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold text-amber-400"
              >
                +
              </button>
            </div>
          </div>

          <!-- CON -->
          <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-slate-400 block uppercase">CON</span>
              <span class="text-base font-bold text-amber-300">{{ form.con }}</span>
            </div>
            <div class="flex items-center gap-1">
              <button
                @click="adjustAbility('con', -1)"
                :disabled="form.con <= 8"
                class="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold"
              >
                -
              </button>
              <button
                @click="adjustAbility('con', 1)"
                :disabled="form.con >= 15 || remainingPoints <= 0"
                class="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold text-amber-400"
              >
                +
              </button>
            </div>
          </div>

          <!-- INT -->
          <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-slate-400 block uppercase">INT</span>
              <span class="text-base font-bold text-amber-300">{{ form.int }}</span>
            </div>
            <div class="flex items-center gap-1">
              <button
                @click="adjustAbility('int', -1)"
                :disabled="form.int <= 8"
                class="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold"
              >
                -
              </button>
              <button
                @click="adjustAbility('int', 1)"
                :disabled="form.int >= 15 || remainingPoints <= 0"
                class="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold text-amber-400"
              >
                +
              </button>
            </div>
          </div>

          <!-- WIS -->
          <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-slate-400 block uppercase">WIS</span>
              <span class="text-base font-bold text-amber-300">{{ form.wis }}</span>
            </div>
            <div class="flex items-center gap-1">
              <button
                @click="adjustAbility('wis', -1)"
                :disabled="form.wis <= 8"
                class="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold"
              >
                -
              </button>
              <button
                @click="adjustAbility('wis', 1)"
                :disabled="form.wis >= 15 || remainingPoints <= 0"
                class="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold text-amber-400"
              >
                +
              </button>
            </div>
          </div>

          <!-- CHA -->
          <div class="p-3 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-between">
            <div>
              <span class="text-xs font-bold text-slate-400 block uppercase">CHA</span>
              <span class="text-base font-bold text-amber-300">{{ form.cha }}</span>
            </div>
            <div class="flex items-center gap-1">
              <button
                @click="adjustAbility('cha', -1)"
                :disabled="form.cha <= 8"
                class="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold"
              >
                -
              </button>
              <button
                @click="adjustAbility('cha', 1)"
                :disabled="form.cha >= 15 || remainingPoints <= 0"
                class="w-7 h-7 rounded bg-slate-800 hover:bg-slate-700 disabled:opacity-30 text-xs font-bold text-amber-400"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex items-center justify-between pt-5 mt-5 border-t border-slate-800">
        <button
          @click="resetToDefaults"
          class="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 transition-colors"
        >
          <RotateCcw class="w-3.5 h-3.5" />
          Reset Defaults
        </button>

        <div class="flex items-center gap-3">
          <button
            @click="emit('close')"
            class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            Cancel
          </button>
          <button
            @click="saveAndApply"
            class="flex items-center gap-2 px-5 py-2 text-xs font-bold rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20 transition-all"
          >
            <Save class="w-4 h-4" />
            {{ savedMessage ? 'Saved!' : 'Apply to Party' }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
