<script setup lang="ts">
import { ref } from 'vue';
import { useTeamStore } from './stores/teamStore';
import TeamSlots from './components/TeamSlots.vue';
import SynergyAnalysis from './components/SynergyAnalysis.vue';
import MetaTeamList from './components/MetaTeamList.vue';
import RosterPicker from './components/RosterPicker.vue';
import { RotateCcw } from 'lucide-vue-next';

const store = useTeamStore();
const activeView = ref<'builder' | 'meta'>('builder');
</script>

<template>
  <div class="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200">
    <!-- Top Navigation & Global Header -->
    <header class="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-slate-800">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <!-- Logo & Title -->
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 rounded-xl bg-slate-900 border border-amber-500/30 flex items-center justify-center p-1 shadow-lg shadow-amber-950/30 overflow-hidden group">
            <img
              src="/bg3-logo.png"
              alt="Baldur's Gate 3"
              class="w-full h-full object-contain filter drop-shadow group-hover:scale-105 transition-transform"
            />
          </div>
          <div>
            <h1 class="text-base sm:text-lg font-bold font-serif tracking-wider text-slate-100">
              Baldur's Gate 3 <span class="text-amber-400 font-normal">Party Architect</span>
            </h1>
            <p class="text-[10px] text-slate-400 font-medium">Honor Mode Strategy & Build Configurator</p>
          </div>
        </div>

        <!-- Navigation Tabs & Team Reset -->
        <div class="flex items-center gap-3">
          <div class="flex items-center bg-slate-900 p-1 rounded-xl border border-slate-800">
            <button
              @click="activeView = 'builder'"
              :class="[
                'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all',
                activeView === 'builder'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              ]"
            >
              Party Builder
            </button>
            <button
              @click="activeView = 'meta'"
              :class="[
                'px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all',
                activeView === 'meta'
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              ]"
            >
              Honor Meta Teams
            </button>
          </div>

          <button
            @click="store.clearTeam()"
            title="Reset Party Slots"
            class="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-rose-400 hover:border-slate-700 transition-all"
          >
            <RotateCcw class="w-4 h-4" />
          </button>
        </div>
      </div>
    </header>

    <!-- Main Content Body -->
    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <!-- Mode View: Party Builder -->
      <div v-show="activeView === 'builder'" class="space-y-8">
        <!-- 4-Party Active Slots & PCPartPicker Matrix -->
        <TeamSlots />

        <!-- Synergy Engine & Honor Viability Diagnostic -->
        <SynergyAnalysis />

        <!-- Camp Roster & Recruitment Inventory -->
        <RosterPicker />
      </div>

      <!-- Mode View: Verified Meta Compositions -->
      <div v-show="activeView === 'meta'" class="space-y-8">
        <MetaTeamList />
      </div>
    </main>

    <!-- Footer -->
    <footer class="border-t border-slate-900 bg-slate-950 py-6 text-center text-xs text-slate-500">
      <div class="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
        <p>Baldur's Gate 3 Party Architect. Engineered for Honor Mode tactical optimization.</p>
        <p>Baldur's Gate 3 is a registered trademark of Larian Studios and Wizards of the Coast.</p>
      </div>
    </footer>
  </div>
</template>
