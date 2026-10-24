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

const sliderValue = computed({
  get: () => difficultyKeys.indexOf(store.currentDifficulty),
  set: (val: number) => {
    const key = difficultyKeys[val];
    if (key) {
      store.setDifficulty(key);
    }
  }
});

const selectDifficulty = (diff: GameDifficulty) => {
  store.setDifficulty(diff);
};

const getButtonTheme = (diff: GameDifficulty) => {
  const isSelected = store.currentDifficulty === diff;
  if (!isSelected) {
    return 'text-[#b5a07e] hover:text-[#fcedb6] hover:bg-[#231911] border-[#3d2c1d]';
  }

  switch (diff) {
    case 'Explorer':
      return 'bg-gradient-to-b from-[#064e3b]/80 to-[#043327]/90 text-[#a7f3d0] border-[#10b981] shadow-lg shadow-[#064e3b]/40 ring-1 ring-[#34d399]/40';
    case 'Balanced':
      return 'bg-gradient-to-b from-[#0c4a6e]/80 to-[#082f49]/90 text-[#bae6fd] border-[#38bdf8] shadow-lg shadow-[#0c4a6e]/40 ring-1 ring-[#38bdf8]/40';
    case 'Tactician':
      return 'bg-gradient-to-b from-[#78350f]/80 to-[#451a03]/90 text-[#fde68a] border-[#f59e0b] shadow-lg shadow-[#78350f]/40 ring-1 ring-[#fbbf24]/40';
    case 'Honor':
      return 'bg-gradient-to-b from-[#7f1d1d]/85 to-[#450a0a]/95 text-[#fecaca] border-[#ef4444] shadow-lg shadow-[#7f1d1d]/50 ring-1 ring-[#f87171]/50';
  }
};
</script>

<template>
  <div class="grimoire-card rounded-2xl p-6 relative overflow-hidden">
    <!-- Ornamental Brass Corner Filigrees -->
    <div class="absolute top-2 left-2 text-[#8c6d37] text-xs select-none pointer-events-none opacity-70">❖</div>
    <div class="absolute top-2 right-2 text-[#8c6d37] text-xs select-none pointer-events-none opacity-70">❖</div>
    <div class="absolute bottom-2 left-2 text-[#8c6d37] text-xs select-none pointer-events-none opacity-70">❖</div>
    <div class="absolute bottom-2 right-2 text-[#8c6d37] text-xs select-none pointer-events-none opacity-70">❖</div>

    <!-- Header with Difficulty Selection Tabs and Slider -->
    <div class="flex flex-col lg:flex-row lg:items-center justify-between gap-5 pb-5 border-b border-[#443221]">
      <div>
        <div class="flex items-center gap-2.5">
          <D20Icon class="w-5 h-5 text-[#d4af37] shrink-0" />
          <h2 class="text-xl font-bold font-['Cinzel'] text-[#fcedb6] tracking-wide">
            Campaign Difficulty & Tactical Risk Calibration
          </h2>
        </div>
        <p class="text-xs text-[#b5a07e] font-['EB_Garamond'] text-[14px] mt-1">
          Adjust the difficulty seal to dynamically scale combat lethality, camp supply strain, and legendary actions.
        </p>
      </div>

      <!-- Segmented Difficulty Controller -->
      <div class="flex flex-col sm:flex-row items-center gap-3">
        <!-- Interactive Range Slider -->
        <div class="flex items-center gap-2.5 bg-[#120d09] px-3.5 py-2 rounded-xl border border-[#3d2c1d] w-full sm:w-auto shadow-inner">
          <span class="text-[10px] font-bold uppercase tracking-wider text-[#8c785b] font-['Cinzel']">Tier Dial</span>
          <input
            v-model.number="sliderValue"
            type="range"
            min="0"
            max="3"
            step="1"
            class="w-28 sm:w-32 h-2 bg-[#261c13] rounded-lg appearance-none cursor-pointer accent-[#d4af37]"
          />
        </div>

        <!-- Buttons styled as high fantasy seals -->
        <div class="flex items-center bg-[#120d09] p-1.5 rounded-xl border border-[#3d2c1d] gap-1.5 w-full sm:w-auto overflow-x-auto shadow-inner">
          <button
            v-for="diff in difficultyKeys"
            :key="diff"
            @click="selectDifficulty(diff)"
            :class="[
              'px-3.5 py-1.5 text-xs font-bold rounded-lg border transition-all flex items-center gap-1.5 whitespace-nowrap font-[\'Cinzel\'] tracking-wider',
              getButtonTheme(diff)
            ]"
          >
            <Heart v-if="diff === 'Explorer'" class="w-3.5 h-3.5 text-[#34d399] shrink-0" />
            <Shield v-else-if="diff === 'Balanced'" class="w-3.5 h-3.5 text-[#38bdf8] shrink-0" />
            <Swords v-else-if="diff === 'Tactician'" class="w-3.5 h-3.5 text-[#fbbf24] shrink-0" />
            <Skull v-else-if="diff === 'Honor'" class="w-3.5 h-3.5 text-[#f87171] shrink-0" />
            <span>{{ diff }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Active Difficulty Specification Grid -->
    <div class="grid grid-cols-1 md:grid-cols-4 gap-3.5 mt-5">
      <!-- Camp Supplies Requirement -->
      <div class="p-4 rounded-xl grimoire-inset flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-[#8c785b] uppercase tracking-wider block font-['Cinzel']">Long Rest Food</span>
          <span class="text-sm font-bold text-[#e6ca65] font-['Cinzel']">
            {{ currentProfile.campSuppliesPerLongRest }} Supplies
          </span>
        </div>
        <span
          :class="[
            'text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider font-[\'Cinzel\']',
            currentProfile.campSuppliesPerLongRest > 40
              ? 'bg-[#450a0a]/60 text-[#fca5a5] border-[#b91c1c]'
              : 'bg-[#064e3b]/50 text-[#a7f3d0] border-[#059669]'
          ]"
        >
          {{ currentProfile.campSuppliesPerLongRest > 40 ? '2x Heavy' : 'Standard' }}
        </span>
      </div>

      <!-- Enemy Vitality & Scaling -->
      <div class="p-4 rounded-xl grimoire-inset flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-[#8c785b] uppercase tracking-wider block font-['Cinzel']">Foe Vitality Scale</span>
          <span class="text-sm font-bold text-[#f4ebd9] font-['Cinzel']">
            {{ currentProfile.enemyHpScaling }}
          </span>
        </div>
        <span class="text-[10px] font-['Cinzel'] text-[#c5a059]">Modifier</span>
      </div>

      <!-- Multiclassing Rules -->
      <div class="p-4 rounded-xl grimoire-inset flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-[#8c785b] uppercase tracking-wider block font-['Cinzel']">Multiclassing</span>
          <span :class="['text-sm font-bold font-[\'Cinzel\']', currentProfile.multiclassAllowed ? 'text-[#34d399]' : 'text-[#f87171]']">
            {{ currentProfile.multiclassAllowed ? 'Unrestricted' : 'Locked in Engine' }}
          </span>
        </div>
        <span :class="['text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider font-[\'Cinzel\']', currentProfile.multiclassAllowed ? 'bg-[#064e3b]/50 text-[#a7f3d0] border-[#059669]' : 'bg-[#450a0a]/60 text-[#fca5a5] border-[#b91c1c]']">
          {{ currentProfile.multiclassAllowed ? 'Active' : 'Sealed' }}
        </span>
      </div>

      <!-- Permadeath / Single Save -->
      <div class="p-4 rounded-xl grimoire-inset flex items-center justify-between">
        <div>
          <span class="text-[10px] font-bold text-[#8c785b] uppercase tracking-wider block font-['Cinzel']">Save Scroll Rites</span>
          <span :class="['text-sm font-bold font-[\'Cinzel\']', currentProfile.permadeathOrSingleSave ? 'text-[#fca5a5]' : 'text-[#34d399]']">
            {{ currentProfile.permadeathOrSingleSave ? 'Single Save File' : 'Unlimited Reloads' }}
          </span>
        </div>
        <span :class="['text-[10px] font-bold px-2 py-0.5 rounded border uppercase tracking-wider font-[\'Cinzel\']', currentProfile.permadeathOrSingleSave ? 'bg-[#450a0a]/60 text-[#fca5a5] border-[#b91c1c]' : 'bg-[#064e3b]/50 text-[#a7f3d0] border-[#059669]']">
          {{ currentProfile.permadeathOrSingleSave ? 'Honor Rule' : 'Standard' }}
        </span>
      </div>
    </div>

    <!-- Mode Detailed Impact Banner -->
    <div
      :class="[
        'mt-4 p-4 rounded-xl border flex items-start gap-3.5 transition-colors',
        currentProfile.legendaryBossActions
          ? 'bg-gradient-to-r from-[#380e0e]/70 to-[#1e0a0a]/70 border-[#b91c1c]/70'
          : 'bg-[#120d09]/80 border-[#3d2c1d]'
      ]"
    >
      <Info
        :class="[
          'w-5 h-5 shrink-0 mt-0.5',
          currentProfile.legendaryBossActions ? 'text-[#ef4444]' : 'text-[#d4af37]'
        ]"
      />
      <div class="text-xs leading-relaxed text-[#dfd1ba] font-['EB_Garamond'] text-[14px]">
        <span class="font-bold font-['Cinzel'] text-[#fcedb6]">{{ currentProfile.name }}:</span> {{ currentProfile.summary }}
        <span v-if="currentProfile.legendaryBossActions" class="block text-[#fca5a5] font-semibold mt-1 font-['Cinzel'] text-xs">
          ⚠️ Crucial: Bosses gain Legendary Actions triggering reaction attacks outside standard initiative turns.
        </span>
      </div>
    </div>
  </div>
</template>
