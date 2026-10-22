<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import type { CombatRole } from '../types/companion';
import CompanionAvatar from './CompanionAvatar.vue';
import { Search, CheckCircle2, Circle, SlidersHorizontal, Users, Sparkles } from 'lucide-vue-next';

const store = useTeamStore();
const activeTab = ref<'all' | 'recruited'>('all');

const roles: CombatRole[] = [
  'Striker',
  'AoE Blaster',
  'Controller',
  'Support',
  'Tank',
  'Skill Monkey',
  'Party Face'
];

const originCategories = [
  { id: '', label: 'All Types' },
  { id: 'origin', label: 'Origin Companions' },
  { id: 'companion', label: 'Non-Origin Companions' },
  { id: 'custom', label: 'Custom (Tav)' }
];

const displayedList = computed(() => {
  const base = store.filteredRoster;
  if (activeTab.value === 'recruited') {
    return base.filter((c) => store.recruitedIds.includes(c.id));
  }
  return base;
});

const isAssigned = (id: string) => store.currentTeam.includes(id as any);
const isRecruited = (id: string) => store.recruitedIds.includes(id as any);

const handleCardClick = (id: any) => {
  // If not currently assigned, assign to next free slot or slot 0
  if (!isAssigned(id)) {
    const firstFreeIndex = store.currentTeam.findIndex((m) => m === null);
    if (firstFreeIndex !== -1) {
      store.assignCompanion(firstFreeIndex, id);
      store.setInspectingSlot(firstFreeIndex);
    } else {
      store.assignCompanion(store.inspectingSlotIndex, id);
    }
  } else {
    const index = store.currentTeam.indexOf(id);
    if (index !== -1) {
      store.setInspectingSlot(index);
    }
  }
};
</script>

<template>
  <div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-2xl backdrop-blur-md">
    <!-- Header with Roster Status and Recruited Toggle -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
      <div>
        <div class="flex items-center gap-2">
          <Users class="w-5 h-5 text-amber-400" />
          <h2 class="text-xl font-bold font-serif text-slate-100 tracking-wide">Camp Roster & Companions</h2>
        </div>
        <p class="text-xs text-slate-400 mt-1">
          Toggle recruitment status to match your save file, or click any hero to assign them to your active party.
        </p>
      </div>

      <div class="flex items-center gap-2 self-stretch sm:self-auto bg-slate-950 p-1 rounded-xl border border-slate-800">
        <button
          @click="activeTab = 'all'"
          :class="[
            'flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all',
            activeTab === 'all'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          ]"
        >
          All Roster ({{ store.allCompanions.length }})
        </button>
        <button
          @click="activeTab = 'recruited'"
          :class="[
            'flex-1 sm:flex-none px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all',
            activeTab === 'recruited'
              ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
              : 'text-slate-400 hover:text-slate-200'
          ]"
        >
          Recruited in Camp ({{ store.recruitedIds.length }})
        </button>
      </div>
    </div>

    <!-- Filters & Search Bar -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4">
      <div class="md:col-span-5 relative">
        <Search class="w-4 h-4 text-slate-500 absolute left-3 top-3" />
        <input
          v-model="store.searchQuery"
          type="text"
          placeholder="Filter by name, class, subclass, or signature feature..."
          class="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
        />
      </div>

      <div class="md:col-span-4 flex items-center gap-2">
        <SlidersHorizontal class="w-4 h-4 text-slate-500 shrink-0" />
        <select
          v-model="store.filterRole"
          class="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-400"
        >
          <option value="">All Combat Roles</option>
          <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>

      <div class="md:col-span-3">
        <select
          v-model="store.filterOriginType"
          class="w-full px-3 py-2 text-xs rounded-xl bg-slate-950/80 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-400"
        >
          <option v-for="cat in originCategories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
        </select>
      </div>
    </div>

    <!-- Companion Grid Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 mt-5">
      <div
        v-for="comp in displayedList"
        :key="comp.id"
        @click="handleCardClick(comp.id)"
        :class="[
          'relative p-3.5 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer group',
          isAssigned(comp.id)
            ? 'bg-amber-950/20 border-amber-500/60 shadow-lg shadow-amber-950/20'
            : isRecruited(comp.id)
            ? 'bg-slate-950/60 border-slate-800 hover:border-slate-600 hover:bg-slate-950/90'
            : 'bg-slate-950/30 border-slate-900 opacity-60 hover:opacity-90'
        ]"
      >
        <div class="flex items-start gap-3">
          <CompanionAvatar
            :avatar="comp.avatar"
            :name="comp.id === 'tav' ? store.customTavConfig.name : comp.name"
            :origin-type="comp.originType"
            size="md"
            :highlighted="isAssigned(comp.id)"
          />

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
              <h3 class="text-sm font-bold text-slate-100 truncate group-hover:text-amber-300 transition-colors">
                {{ comp.id === 'tav' ? store.customTavConfig.name : comp.name }}
              </h3>

              <button
                @click.stop="store.toggleRecruited(comp.id)"
                :title="isRecruited(comp.id) ? 'Recruited (click to mark absent)' : 'Absent (click to recruit)'"
                class="p-0.5 rounded text-slate-400 hover:text-amber-400 transition-colors"
              >
                <CheckCircle2 v-if="isRecruited(comp.id)" class="w-4 h-4 text-emerald-400" />
                <Circle v-else class="w-4 h-4 text-slate-600" />
              </button>
            </div>

            <p class="text-[11px] text-amber-400/90 font-medium truncate mt-0.5">
              {{ comp.id === 'tav' ? store.customTavConfig.canonicalClass : comp.canonicalClass }}
              <span class="text-slate-400">({{ comp.id === 'tav' ? store.customTavConfig.canonicalSubclass : comp.canonicalSubclass }})</span>
            </p>

            <div class="flex items-center gap-1.5 mt-2 flex-wrap">
              <span class="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-slate-800/80 text-slate-300 border border-slate-700/50">
                {{ comp.id === 'tav' ? store.customTavConfig.primaryRole : comp.primaryRole }}
              </span>
              <span v-if="comp.secondaryRole" class="px-1.5 py-0.5 text-[9px] rounded bg-slate-800/40 text-slate-400 border border-slate-800">
                {{ comp.id === 'tav' ? store.customTavConfig.secondaryRole : comp.secondaryRole }}
              </span>
            </div>
          </div>
        </div>

        <!-- Signature Mechanic Banner -->
        <div class="mt-3 pt-2.5 border-t border-slate-800/60 flex items-center justify-between text-[10px]">
          <span class="text-slate-400 flex items-center gap-1 truncate max-w-[190px]">
            <Sparkles class="w-3 h-3 text-amber-400 shrink-0" />
            <span class="truncate">{{ comp.uniqueFeature.tag }}</span>
          </span>

          <span
            v-if="isAssigned(comp.id)"
            class="text-[9px] font-bold uppercase tracking-wider text-amber-400 bg-amber-500/10 px-1.5 py-0.5 rounded border border-amber-500/30 shrink-0"
          >
            In Party
          </span>
          <span
            v-else-if="!isRecruited(comp.id)"
            class="text-[9px] text-slate-500 italic shrink-0"
          >
            Not in Camp
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
