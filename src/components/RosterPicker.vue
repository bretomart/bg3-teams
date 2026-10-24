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
  { id: '', label: 'All Origins' },
  { id: 'origin', label: 'Origin Heroes' },
  { id: 'companion', label: 'Camp Companions' },
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
  <div class="grimoire-card rounded-2xl p-6 relative overflow-hidden">
    <!-- Corner Filigree Ornaments -->
    <div class="absolute top-2 left-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
    <div class="absolute top-2 right-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
    <div class="absolute bottom-2 left-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
    <div class="absolute bottom-2 right-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>

    <!-- Header with Roster Status and Recruited Toggle -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-5 border-b border-[#443221]">
      <div>
        <div class="flex items-center gap-2.5">
          <Users class="w-5 h-5 text-[#d4af37]" />
          <h2 class="text-xl font-bold font-['Cinzel'] text-[#fcedb6] tracking-wide">Camp Roster & Companions</h2>
        </div>
        <p class="text-xs text-[#b5a07e] font-['EB_Garamond'] text-[14px] mt-1">
          Inscribe recruitment status to mirror your campaign save, or select any hero to summon into your active party.
        </p>
      </div>

      <div class="flex items-center gap-2 self-stretch sm:self-auto bg-[#120d09] p-1.5 rounded-xl border border-[#3d2c1d] shadow-inner">
        <button
          @click="activeTab = 'all'"
          :class="[
            'flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all font-[\'Cinzel\'] tracking-wider',
            activeTab === 'all'
              ? 'bg-gradient-to-b from-[#d4af37] to-[#aa8524] text-[#140e09] border border-[#f5df86] shadow-sm font-black'
              : 'text-[#b5a07e] hover:text-[#fcedb6]'
          ]"
        >
          All Roster ({{ store.allCompanions.length }})
        </button>
        <button
          @click="activeTab = 'recruited'"
          :class="[
            'flex-1 sm:flex-none px-4 py-1.5 text-xs font-bold rounded-lg transition-all font-[\'Cinzel\'] tracking-wider',
            activeTab === 'recruited'
              ? 'bg-gradient-to-b from-[#d4af37] to-[#aa8524] text-[#140e09] border border-[#f5df86] shadow-sm font-black'
              : 'text-[#b5a07e] hover:text-[#fcedb6]'
          ]"
        >
          Camp Recruits ({{ store.recruitedIds.length }})
        </button>
      </div>
    </div>

    <!-- Filters & Search Bar -->
    <div class="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-5">
      <div class="md:col-span-5 relative">
        <Search class="w-4 h-4 text-[#8c785b] absolute left-3.5 top-3" />
        <input
          v-model="store.searchQuery"
          type="text"
          placeholder="Filter by name, class, subclass, or signature feature..."
          class="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl bg-[#140e0a] border border-[#3d2c1d] text-[#f4ebd9] placeholder-[#7d6850] focus:outline-none focus:border-[#d4af37] focus:ring-1 focus:ring-[#d4af37]/50 font-['EB_Garamond'] text-[14px]"
        />
      </div>

      <div class="md:col-span-4 flex items-center gap-2">
        <SlidersHorizontal class="w-4 h-4 text-[#8c785b] shrink-0" />
        <select
          v-model="store.filterRole"
          class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#140e0a] border border-[#3d2c1d] text-[#f4ebd9] focus:outline-none focus:border-[#d4af37] font-['Cinzel']"
        >
          <option value="">All Combat Roles</option>
          <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
        </select>
      </div>

      <div class="md:col-span-3">
        <select
          v-model="store.filterOriginType"
          class="w-full px-3.5 py-2.5 text-xs rounded-xl bg-[#140e0a] border border-[#3d2c1d] text-[#f4ebd9] focus:outline-none focus:border-[#d4af37] font-['Cinzel']"
        >
          <option v-for="cat in originCategories" :key="cat.id" :value="cat.id">{{ cat.label }}</option>
        </select>
      </div>
    </div>

    <!-- Companion Grid Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-6">
      <div
        v-for="comp in displayedList"
        :key="comp.id"
        @click="handleCardClick(comp.id)"
        :class="[
          'relative p-4 rounded-xl border transition-all duration-200 flex flex-col justify-between cursor-pointer group shadow-md',
          isAssigned(comp.id)
            ? 'bg-gradient-to-b from-[#2a1d13] to-[#1c130c] border-[#d4af37] ring-1 ring-[#d4af37]/40 shadow-xl shadow-black/80'
            : isRecruited(comp.id)
            ? 'bg-gradient-to-b from-[#1c140e] to-[#140e0a] border-[#443221] hover:border-[#8c6d37] hover:bg-[#211811]'
            : 'bg-[#120d09]/40 border-[#261c14] opacity-50 hover:opacity-85'
        ]"
      >
        <div class="flex items-start gap-3.5">
          <CompanionAvatar
            :avatar="comp.avatar"
            :name="comp.id === 'tav' ? store.customTavConfig.name : comp.name"
            :origin-type="comp.originType"
            size="md"
            :highlighted="isAssigned(comp.id)"
          />

          <div class="flex-1 min-w-0">
            <div class="flex items-center justify-between gap-1">
              <h3 class="text-sm font-bold text-[#fcedb6] truncate font-['Cinzel'] group-hover:text-[#fdedb6] transition-colors">
                {{ comp.id === 'tav' ? store.customTavConfig.name : comp.name }}
              </h3>

              <button
                @click.stop="store.toggleRecruited(comp.id)"
                :title="isRecruited(comp.id) ? 'Recruited (click to mark absent)' : 'Absent (click to recruit)'"
                class="p-0.5 rounded text-[#8c785b] hover:text-[#d4af37] transition-colors"
              >
                <CheckCircle2 v-if="isRecruited(comp.id)" class="w-4 h-4 text-[#34d399]" />
                <Circle v-else class="w-4 h-4 text-[#5a422d]" />
              </button>
            </div>

            <p class="text-[12px] text-[#e6ca65] font-medium truncate mt-0.5 font-['EB_Garamond']">
              {{ comp.id === 'tav' ? store.customTavConfig.canonicalClass : comp.canonicalClass }}
              <span class="text-[#8c785b]">({{ comp.id === 'tav' ? store.customTavConfig.canonicalSubclass : comp.canonicalSubclass }})</span>
            </p>

            <div class="flex items-center gap-1.5 mt-2 flex-wrap">
              <span class="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#261c13] text-[#dfd1ba] border border-[#443221] font-['Cinzel']">
                {{ comp.id === 'tav' ? store.customTavConfig.primaryRole : comp.primaryRole }}
              </span>
              <span v-if="comp.secondaryRole" class="px-1.5 py-0.5 text-[9px] rounded bg-[#18110b] text-[#8c785b] border border-[#332417] font-['Cinzel']">
                {{ comp.id === 'tav' ? store.customTavConfig.secondaryRole : comp.secondaryRole }}
              </span>
            </div>
          </div>
        </div>

        <!-- Signature Mechanic Banner -->
        <div class="mt-3.5 pt-2.5 border-t border-[#332417] flex items-center justify-between text-[11px] font-['EB_Garamond']">
          <span class="text-[#b5a07e] flex items-center gap-1.5 truncate max-w-[190px]">
            <Sparkles class="w-3 h-3 text-[#d4af37] shrink-0" />
            <span class="truncate italic">{{ comp.uniqueFeature.tag }}</span>
          </span>

          <span
            v-if="isAssigned(comp.id)"
            class="text-[9px] font-bold uppercase tracking-wider text-[#140e09] bg-gradient-to-r from-[#d4af37] to-[#aa8524] px-2 py-0.5 rounded border border-[#f5df86] shrink-0 font-['Cinzel']"
          >
            In Party
          </span>
          <span
            v-else-if="!isRecruited(comp.id)"
            class="text-[10px] text-[#7d6850] italic shrink-0"
          >
            Not in Camp
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
