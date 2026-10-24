<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTeamStore } from './stores/teamStore';
import TeamSlots from './components/TeamSlots.vue';
import DifficultySlider from './components/DifficultySlider.vue';
import SynergyAnalysis from './components/SynergyAnalysis.vue';
import MetaTeamList from './components/MetaTeamList.vue';
import RosterPicker from './components/RosterPicker.vue';
import { RotateCcw, BookOpen, Sparkles } from 'lucide-vue-next';

const store = useTeamStore();
const activeView = ref<'builder' | 'meta'>('builder');
const baseUrl = import.meta.env.BASE_URL || '/';
const bg3LogoSrc = computed(() => `${baseUrl}bg3-logo.png`);
</script>

<template>
  <div class="min-h-screen text-[#f4ebd9] flex flex-col font-sans selection:bg-[#d4af37]/30 selection:text-[#fcedb6]">
    <!-- Top Grimoire Navigation & Header -->
    <header class="sticky top-0 z-40 bg-[#120d09]/95 backdrop-blur-md border-b border-[#4d3926] shadow-xl shadow-black/80">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
        <!-- Logo & Title -->
        <div class="flex items-center gap-3.5">
          <div class="w-12 h-12 rounded-xl bg-[#1c150f] border-2 border-[#b89127] flex items-center justify-center p-1.5 shadow-lg shadow-black/60 group relative overflow-hidden">
            <div class="absolute inset-0 bg-gradient-to-tr from-[#d4af37]/15 to-transparent pointer-events-none"></div>
            <img
              :src="bg3LogoSrc"
              alt="Baldur's Gate 3"
              class="w-full h-full object-contain filter drop-shadow-md group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <div class="flex items-center gap-2">
              <span class="text-[10px] tracking-widest text-[#c5a059] uppercase font-bold font-sans">D&D 5e Tactician Grimoire</span>
              <span class="text-[10px] text-[#8c6d37]">✦</span>
              <span class="text-[10px] tracking-widest text-[#d97706] font-bold font-sans">Honor Mode</span>
            </div>
            <h1 class="text-lg sm:text-xl font-bold font-['Cinzel'] tracking-wide text-[#fcedb6] flex items-center gap-2">
              Baldur's Gate 3 <span class="text-[#d4af37] font-semibold">Party Architect</span>
            </h1>
            <p class="text-[11px] text-[#b5a07e] font-sans font-medium">Synergy Engine, Build Configurator & Tactical Compendium</p>
          </div>
        </div>

        <!-- Navigation Tabs & Party Reset -->
        <div class="flex items-center gap-3">
          <div class="flex items-center bg-[#18110b] p-1 rounded-xl border border-[#443221] shadow-inner">
            <button
              @click="activeView = 'builder'"
              :class="[
                'px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 font-sans tracking-wide',
                activeView === 'builder'
                  ? 'bg-gradient-to-b from-[#d4af37] to-[#aa8524] text-[#140e09] border border-[#f5df86] shadow-md shadow-[#d4af37]/20 font-black'
                  : 'text-[#c5b89a] hover:text-[#fcedb6] hover:bg-[#251b12]'
              ]"
            >
              <Sparkles class="w-3.5 h-3.5" />
              <span>Party Builder & Loadout</span>
            </button>
            <button
              @click="activeView = 'meta'"
              :class="[
                'px-4 py-1.5 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5 font-sans tracking-wide',
                activeView === 'meta'
                  ? 'bg-gradient-to-b from-[#d4af37] to-[#aa8524] text-[#140e09] border border-[#f5df86] shadow-md shadow-[#d4af37]/20 font-black'
                  : 'text-[#c5b89a] hover:text-[#fcedb6] hover:bg-[#251b12]'
              ]"
            >
              <BookOpen class="w-3.5 h-3.5" />
              <span>Meta Team Compositions</span>
            </button>
          </div>

          <button
            @click="store.clearTeam()"
            title="Reset Active Party Slots"
            class="p-2.5 rounded-xl bg-[#1c140e] border border-[#443221] text-[#c5a059] hover:text-[#ef4444] hover:border-[#b91c1c] transition-all shadow-md group"
          >
            <RotateCcw class="w-4 h-4 group-hover:rotate-180 transition-transform duration-300" />
          </button>
        </div>
      </div>

      <!-- Golden Trim Accent Line -->
      <div class="h-[1px] bg-gradient-to-r from-transparent via-[#d4af37]/50 to-transparent"></div>
    </header>

    <!-- Main Grimoire Content Surface -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Mode View: Party Builder -->
      <div v-show="activeView === 'builder'" class="space-y-8">
        <!-- Campaign Difficulty Calibration -->
        <DifficultySlider />

        <!-- 4-Party Active Slots & Component Matrix -->
        <TeamSlots />

        <!-- Synergy Engine & Diagnostic Matrix -->
        <SynergyAnalysis />

        <!-- Camp Roster & Recruitment Inventory -->
        <RosterPicker />
      </div>

      <!-- Mode View: Verified Meta Compositions -->
      <div v-show="activeView === 'meta'" class="space-y-8">
        <MetaTeamList />
      </div>
    </main>

    <!-- Grimoire Footer -->
    <footer class="border-t border-[#3d2c1d] bg-[#0c0805] py-8 text-center text-xs text-[#9d896e]">
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        <div class="flex items-center gap-2">
          <span class="text-[#d4af37] text-sm font-sans">❖</span>
          <p class="font-sans text-xs text-[#c5b89a]">
            Baldur's Gate 3 Party Architect: Immersive tactical optimizer for Honor Mode runs.
          </p>
        </div>
        <p class="text-[11px] text-[#7d6850] font-sans">
          Baldur's Gate 3 is a registered trademark of Larian Studios and Wizards of the Coast.
        </p>
      </div>
    </footer>
  </div>
</template>
