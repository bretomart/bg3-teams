<script setup lang="ts">
import { computed } from 'vue';
import { useTeamStore, DIFFICULTY_PROFILES } from '../stores/teamStore';
import type { GameDifficulty } from '../types/companion';
import D20Icon from './D20Icon.vue';
import {
  Skull,
  Shield,
  Swords,
  Heart,
  Info
} from 'lucide-vue-next';

const store = useTeamStore();
const currentProfile = computed(() => DIFFICULTY_PROFILES[store.currentDifficulty]);

const difficultyKeys: GameDifficulty[] = ['Explorer', 'Balanced', 'Tactician', 'Honor'];

const selectDifficulty = (diff: GameDifficulty) => {
  store.setDifficulty(diff);
};

const getButtonTheme = (diff: GameDifficulty) => {
  const isSelected = store.currentDifficulty === diff;
  if (!isSelected) {
    return 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border-transparent';
  }

  switch (diff) {
    case 'Explorer':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-emerald-950/40 shadow-sm';
    case 'Balanced':
      return 'bg-sky-500/20 text-sky-300 border-sky-500/50 shadow-sky-950/40 shadow-sm';
    case 'Tactician':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/50 shadow-amber-950/40 shadow-sm';
    case 'Honor':
      return 'bg-rose-500/25 text-rose-300 border-rose-500/60 shadow-rose-950/50 shadow-sm';
  }
};
</script>

<template>
  <div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-2xl backdrop-blur-md">
    <!-- Header with Difficulty Selection Tabs -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <div class="flex items-center gap-2">
          <D20Icon class="w-5 h-5 text-amber-400 shrink-0" />
          <h2 class="text-lg font-bold font-serif text-slate-100 tracking-wide">
            Campaign Difficulty Rules & Strain Calibration
          </h2>
        </div>
        <p class="text-xs text-slate-400 mt-1">
          Adjust the campaign difficulty to evaluate enemy aggression levels, camp supply consumption, and permadeath constraints.
        </p>
      </div>

      <!-- Segmented Difficulty Controller -->
      <div class="flex items-center bg-slate-950 p-1.5 rounded-xl border border-slate-800 gap-1 self-stretch lg:self-auto overflow-x-auto">
        <button
          v-for="diff in difficultyKeys"
          :key="diff"
          @click="selectDifficulty(diff)"
          :class="[
            'px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 whitespace-nowrap',
            getButtonTheme(diff)
          ]"
        >
          <Heart v-if="diff === 'Explorer'" class="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <Shield v-else-if="diff === 'Balanced'" class="w-3.5 h-3.5 text-sky-400 shrink-0" />
          <Swords v-else-if="diff === 'Tactician'" class="w-3.5 h-3.5 text-amber-400 shrink-0" />
          <Skull v-else-if="diff === 'Honor'" class="w-3.5 h-3.5 text-rose-400 shrink-0" />
          <span>{{ diff }}</span>
        </button>
      </div>
    </div>

    <!-- Active Difficulty Specification Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3 mt-4">
      <!-- Camp Supplies Requirement -->
      <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Long Rest Supplies</span>
          <span class="text-sm font-bold text-amber-300">
            {{ currentProfile.campSuppliesPerLongRest }} Food Supplies
          </span>
        </div>
        <span
          :class="[
            'text-[10px] font-semibold px-2 py-0.5 rounded border',
            currentProfile.campSuppliesPerLongRest > 40
              ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
              : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
          ]"
        >
          {{ currentProfile.campSuppliesPerLongRest > 40 ? '2x Heavy' : 'Standard' }}
        </span>
      </div>

      <!-- Enemy Vitality & Scaling -->
      <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Enemy Health Scaling</span>
          <span class="text-sm font-bold text-slate-200">
            {{ currentProfile.enemyHpScaling }}
          </span>
        </div>
      </div>

      <!-- Multiclassing Rules -->
      <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Multiclassing</span>
          <span :class="['text-sm font-bold', currentProfile.multiclassAllowed ? 'text-emerald-300' : 'text-rose-400']">
            {{ currentProfile.multiclassAllowed ? 'Unrestricted' : 'Disabled in Engine' }}
          </span>
        </div>
      </div>

      <!-- Permadeath / Single Save -->
      <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Save Rules</span>
          <span :class="['text-sm font-bold', currentProfile.permadeathOrSingleSave ? 'text-rose-400' : 'text-emerald-300']">
            {{ currentProfile.permadeathOrSingleSave ? 'Single Save File' : 'Unlimited Reloads' }}
          </span>
        </div>
      </div>
    </div>

    <!-- Mode Detailed Impact Banner -->
    <div class="mt-3 p-3.5 rounded-xl bg-slate-950/50 border border-slate-800 flex items-start gap-3">
      <Info class="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
      <div class="text-xs leading-relaxed text-slate-300">
        <span class="font-bold text-amber-300">{{ currentProfile.name }}:</span> {{ currentProfile.summary }}
        <span v-if="currentProfile.legendaryBossActions" class="block text-rose-300 font-semibold mt-1">
          ⚠️ Major bosses feature non-negotiable Legendary Actions that trigger outside standard initiative turn order.
        </span>
      </div>
    </div>
  </div>
</template>
