<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import CompanionAvatar from './CompanionAvatar.vue';
import CustomTavModal from './CustomTavModal.vue';
import SlotAssignModal from './SlotAssignModal.vue';
import D20Icon from './D20Icon.vue';
import type { Companion } from '../types/companion';
import {
  Shield,
  Trash2,
  Sliders,
  Sword,
  Scroll,
  Layers,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  BookOpen
} from 'lucide-vue-next';

const store = useTeamStore();
const showTavModal = ref(false);
const activeAssignSlot = ref<number | null>(null);
const activeTab = ref<'gear' | 'stats' | 'rationale' | 'rotation'>('gear');
const isInspectorCollapsed = ref(false);

const activeCompanion = computed<Companion | null>(() => {
  return store.selectedCompanionDetail || store.teamCompanions[store.inspectingSlotIndex] || null;
});

const handleSlotClick = (index: number) => {
  const member = store.teamCompanions[index];
  if (!member) {
    // Empty slot: open slot assignment modal
    activeAssignSlot.value = index;
  } else {
    // Occupied slot: inspect
    store.setInspectingSlot(index);
    isInspectorCollapsed.value = false;
  }
};

const openSlotPicker = (index: number, event: MouseEvent) => {
  event.stopPropagation();
  activeAssignSlot.value = index;
};

const removeSlot = (index: number, event: MouseEvent) => {
  event.stopPropagation();
  store.removeCompanion(index);
};
</script>

<template>
  <div class="space-y-6">
    <!-- Active 4-Member Party Strip -->
    <div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-5 shadow-2xl backdrop-blur-md">
      <div class="flex items-center justify-between pb-4 border-b border-slate-800">
        <div>
          <h2 class="text-xl font-bold font-serif text-slate-100 tracking-wide flex items-center gap-2.5">
            <D20Icon class="w-5 h-5 text-amber-400 shrink-0" />
            <span>Active Adventuring Party (4 Slots)</span>
          </h2>
          <p class="text-xs text-slate-400 mt-1">
            Click any active party slot to inspect optimized builds and combat synergies below. Click empty slots to assign from your camp inventory.
          </p>
        </div>

        <button
          @click="showTavModal = true"
          class="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-semibold transition-all shadow-sm"
        >
          <Sliders class="w-3.5 h-3.5" />
          Customize Tav Build
        </button>
      </div>

      <!-- 4 Party Member Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        <div
          v-for="(member, index) in store.teamCompanions"
          :key="index"
          @click="handleSlotClick(index)"
          :class="[
            'relative rounded-2xl border p-3.5 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[148px] group',
            store.inspectingSlotIndex === index && member
              ? 'border-amber-400 bg-amber-950/20 ring-2 ring-amber-400/30 shadow-xl shadow-amber-950/30'
              : member
              ? 'border-slate-800 bg-slate-950/60 hover:border-slate-700 hover:bg-slate-950/90'
              : 'border-dashed border-slate-800 bg-slate-950/20 hover:border-amber-500/50 hover:bg-slate-900/50'
          ]"
        >
          <!-- Empty Slot -->
          <div v-if="!member" class="h-full flex flex-col items-center justify-center text-center p-3">
            <div class="w-10 h-10 rounded-full border border-dashed border-slate-700 flex items-center justify-center text-slate-500 group-hover:text-amber-400 group-hover:border-amber-400 mb-2 font-bold text-sm transition-all">
              <D20Icon class="w-4 h-4" />
            </div>
            <span class="text-xs font-bold text-slate-300 group-hover:text-amber-300 uppercase tracking-wider transition-colors">
              Party Slot {{ index + 1 }}
            </span>
            <span class="text-[11px] text-amber-400/80 mt-0.5 font-medium">Click to choose hero</span>
          </div>

          <!-- Occupied Slot -->
          <template v-else>
            <div class="flex items-start justify-between gap-2">
              <div class="flex items-center gap-3 min-w-0">
                <CompanionAvatar
                  :avatar="member.avatar"
                  :name="member.name"
                  :origin-type="member.originType"
                  size="md"
                  :highlighted="store.inspectingSlotIndex === index"
                />
                <div class="min-w-0 flex-1">
                  <div class="flex items-center gap-1.5">
                    <span class="text-[10px] font-bold text-amber-400 uppercase tracking-wider">Slot {{ index + 1 }}</span>
                  </div>
                  <h3 class="text-sm font-bold text-slate-100 truncate" :title="member.name">{{ member.name }}</h3>
                  <p class="text-[11px] text-slate-400 truncate" :title="`${member.canonicalClass} (${member.canonicalSubclass})`">
                    {{ member.canonicalClass }} <span class="text-slate-500">({{ member.canonicalSubclass }})</span>
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-1 shrink-0">
                <button
                  @click="openSlotPicker(index, $event)"
                  class="text-slate-500 hover:text-amber-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Swap or choose different hero"
                >
                  <RotateCcw class="w-3.5 h-3.5" />
                </button>
                <button
                  @click="removeSlot(index, $event)"
                  class="text-slate-500 hover:text-rose-400 p-1 rounded-lg hover:bg-slate-800 transition-colors"
                  title="Remove companion from active party"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- Role & Tag Badges -->
            <div class="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center justify-between gap-1.5 min-w-0">
              <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-amber-500/10 text-amber-300 border border-amber-500/30 shrink-0">
                {{ member.primaryRole }}
              </span>

              <span class="text-[10px] text-slate-400 truncate text-right flex-1 min-w-0" :title="member.uniqueFeature.tag">
                {{ member.uniqueFeature.tag }}
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Collapsible Component Inspection Matrix for Inspected Slot -->
    <div
      v-if="activeCompanion"
      class="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-2xl backdrop-blur-md overflow-hidden transition-all"
    >
      <!-- Collapsible Header Banner -->
      <div
        @click="isInspectorCollapsed = !isInspectorCollapsed"
        class="p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-slate-800/30 transition-colors border-b border-slate-800/80"
      >
        <div class="flex items-center gap-4">
          <CompanionAvatar
            :avatar="activeCompanion.avatar"
            :name="activeCompanion.name"
            :origin-type="activeCompanion.originType"
            size="lg"
            :highlighted="true"
          />
          <div>
            <div class="flex items-center gap-2 flex-wrap">
              <span class="text-xs font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
                <D20Icon class="w-3.5 h-3.5 text-amber-400" />
                Slot {{ store.inspectingSlotIndex + 1 }} Build Inspector
              </span>
              <span class="text-slate-600">•</span>
              <span class="text-xs font-semibold text-slate-300">{{ activeCompanion.title }}</span>
            </div>
            <h2 class="text-xl font-bold font-serif text-slate-100 tracking-wide mt-0.5">
              {{ activeCompanion.name }}
            </h2>
            <p class="text-xs text-slate-400 italic mt-0.5">"{{ activeCompanion.quote }}"</p>
          </div>
        </div>

        <div class="flex items-center gap-3 self-end lg:self-auto">
          <div class="bg-slate-950 px-3 py-2 rounded-xl border border-slate-800 text-right">
            <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Meta Multiclass</span>
            <span class="text-xs font-bold text-amber-300">{{ activeCompanion.recommendedMulticlass }}</span>
          </div>

          <button
            v-if="activeCompanion.id === 'tav'"
            @click.stop="showTavModal = true"
            class="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 text-xs font-bold transition-all shadow-md shadow-amber-500/20"
          >
            Edit Custom Tav
          </button>

          <button class="text-slate-400 p-1.5 rounded-lg hover:bg-slate-800 transition-colors">
            <ChevronUp v-if="!isInspectorCollapsed" class="w-5 h-5" />
            <ChevronDown v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Collapsible Body with Tabbed Progressive Disclosure -->
      <div v-show="!isInspectorCollapsed" class="p-6 space-y-6">
        <!-- Tabbed Navigation Bar -->
        <div class="flex items-center gap-2 border-b border-slate-800 pb-3 flex-wrap">
          <button
            @click="activeTab = 'gear'"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
              activeTab === 'gear'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            ]"
          >
            <Sword class="w-3.5 h-3.5" />
            Weapons & Equipment Matrix
          </button>

          <button
            @click="activeTab = 'rationale'"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
              activeTab === 'rationale'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            ]"
          >
            <BookOpen class="w-3.5 h-3.5" />
            Optimization Rationale & Mechanics
          </button>

          <button
            @click="activeTab = 'stats'"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
              activeTab === 'stats'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            ]"
          >
            <Scroll class="w-3.5 h-3.5" />
            Abilities & Feats
          </button>

          <button
            @click="activeTab = 'rotation'"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all',
              activeTab === 'rotation'
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
            ]"
          >
            <Layers class="w-3.5 h-3.5" />
            Combat Loop & Turn Economy
          </button>
        </div>

        <!-- TAB 1: WEAPONS & EQUIPMENT -->
        <div v-show="activeTab === 'gear'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Optimal Weapons by Act -->
          <div class="lg:col-span-6 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div class="flex items-center gap-2 mb-3">
              <Sword class="w-4 h-4 text-amber-400" />
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">
                Progression Weapon Arsenal (Acts 1-3)
              </h3>
            </div>

            <div class="space-y-2.5">
              <div
                v-for="wpn in activeCompanion.optimalGear.weapons"
                :key="wpn.name"
                class="p-2.5 rounded-lg bg-slate-900 border border-slate-800/80 flex items-start justify-between gap-3"
              >
                <div>
                  <div class="flex items-center gap-2">
                    <span class="text-xs font-bold text-slate-200">{{ wpn.name }}</span>
                    <span class="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/10 text-amber-300 border border-amber-500/30">
                      Act {{ wpn.act }}
                    </span>
                    <span class="text-[10px] text-slate-500">{{ wpn.type }}</span>
                  </div>
                  <p class="text-[11px] text-slate-400 mt-1 leading-snug">{{ wpn.description }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Best in Slot Armor Matrix -->
          <div class="lg:col-span-6 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <div class="flex items-center gap-2 mb-3">
              <Shield class="w-4 h-4 text-amber-400" />
              <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">
                Best-in-Slot Armor & Jewelry Matrix
              </h3>
            </div>

            <div class="grid grid-cols-2 gap-2 text-xs">
              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <span class="text-[10px] font-bold text-slate-500 uppercase block">Headgear</span>
                <span class="font-semibold text-slate-200 truncate block">{{ activeCompanion.optimalGear.armor.head }}</span>
              </div>

              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <span class="text-[10px] font-bold text-slate-500 uppercase block">Chest Armor</span>
                <span class="font-semibold text-slate-200 truncate block">{{ activeCompanion.optimalGear.armor.chest }}</span>
              </div>

              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <span class="text-[10px] font-bold text-slate-500 uppercase block">Gloves</span>
                <span class="font-semibold text-slate-200 truncate block">{{ activeCompanion.optimalGear.armor.gloves }}</span>
              </div>

              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <span class="text-[10px] font-bold text-slate-500 uppercase block">Boots</span>
                <span class="font-semibold text-slate-200 truncate block">{{ activeCompanion.optimalGear.armor.boots }}</span>
              </div>

              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <span class="text-[10px] font-bold text-slate-500 uppercase block">Amulet</span>
                <span class="font-semibold text-slate-200 truncate block">{{ activeCompanion.optimalGear.armor.amulet }}</span>
              </div>

              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800/80">
                <span class="text-[10px] font-bold text-slate-500 uppercase block">Rings</span>
                <span class="font-semibold text-slate-200 truncate block">{{ activeCompanion.optimalGear.armor.rings.join(', ') }}</span>
              </div>
            </div>

            <div v-if="activeCompanion.optimalGear.armor.cloak" class="mt-2 p-2 rounded-lg bg-slate-900 border border-slate-800/80 text-xs">
              <span class="text-[10px] font-bold text-slate-500 uppercase block">Cloak</span>
              <span class="font-semibold text-amber-300">{{ activeCompanion.optimalGear.armor.cloak }}</span>
            </div>
          </div>
        </div>

        <!-- TAB 2: DETAILED OPTIMIZATION RATIONALE -->
        <div v-show="activeTab === 'rationale'" class="space-y-4">
          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <h3 class="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-2">
              <BookOpen class="w-4 h-4" />
              Build Strategy & Core Mechanics
            </h3>
            <p class="text-xs text-slate-300 leading-relaxed font-sans">
              {{ activeCompanion.optimizationRationale || 'This build maximizes single-round action economy, accuracy scaling, and status condition amplification to reliably overcome Honor Mode legendary actions.' }}
            </p>
          </div>

          <!-- Combat Action Breakdown -->
          <div v-if="activeCompanion.combatLoopBreakdown" class="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">Standard Action</span>
              <p class="text-xs text-slate-300 leading-snug">{{ activeCompanion.combatLoopBreakdown.action }}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">Bonus Action Economy</span>
              <p class="text-xs text-slate-300 leading-snug">{{ activeCompanion.combatLoopBreakdown.bonusAction }}</p>
            </div>
            <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800">
              <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400 block mb-1">Reaction Triggers</span>
              <p class="text-xs text-slate-300 leading-snug">{{ activeCompanion.combatLoopBreakdown.reaction }}</p>
            </div>
          </div>
        </div>

        <!-- TAB 3: ABILITIES & FEATS -->
        <div v-show="activeTab === 'stats'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-5 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-3">
              Target Endgame Ability Scores
            </span>
            <div class="grid grid-cols-3 gap-2 text-center">
              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span class="text-[10px] font-bold text-slate-400 block">STR</span>
                <span class="text-base font-bold text-amber-300">{{ activeCompanion.skillPriority.statGoals.str }}</span>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span class="text-[10px] font-bold text-slate-400 block">DEX</span>
                <span class="text-base font-bold text-amber-300">{{ activeCompanion.skillPriority.statGoals.dex }}</span>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span class="text-[10px] font-bold text-slate-400 block">CON</span>
                <span class="text-base font-bold text-amber-300">{{ activeCompanion.skillPriority.statGoals.con }}</span>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span class="text-[10px] font-bold text-slate-400 block">INT</span>
                <span class="text-base font-bold text-amber-300">{{ activeCompanion.skillPriority.statGoals.int }}</span>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span class="text-[10px] font-bold text-slate-400 block">WIS</span>
                <span class="text-base font-bold text-amber-300">{{ activeCompanion.skillPriority.statGoals.wis }}</span>
              </div>
              <div class="p-2 rounded-lg bg-slate-900 border border-slate-800">
                <span class="text-[10px] font-bold text-slate-400 block">CHA</span>
                <span class="text-base font-bold text-amber-300">{{ activeCompanion.skillPriority.statGoals.cha }}</span>
              </div>
            </div>
          </div>

          <div class="lg:col-span-7 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-3">
              Mandatory Honor Mode Feats
            </span>
            <ul class="space-y-2 text-xs text-slate-300">
              <li
                v-for="feat in activeCompanion.skillPriority.keyFeats"
                :key="feat"
                class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2.5"
              >
                <D20Icon class="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span class="font-semibold text-slate-100">{{ feat }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- TAB 4: ROTATIONS & SPELLS -->
        <div v-show="activeTab === 'rotation'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-6 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-3">
              Action & Spell Priority Sequence
            </span>
            <ol class="space-y-2 text-xs text-slate-300">
              <li
                v-for="(action, idx) in activeCompanion.skillPriority.order"
                :key="action"
                class="p-2.5 rounded-lg bg-slate-900 border border-slate-800 flex items-center gap-2.5"
              >
                <span class="text-xs font-bold text-amber-400 bg-amber-500/10 w-5 h-5 rounded flex items-center justify-center">
                  {{ idx + 1 }}
                </span>
                <span class="font-medium text-slate-200">{{ action }}</span>
              </li>
            </ol>
          </div>

          <div class="lg:col-span-6 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
            <span class="text-xs font-bold uppercase tracking-wider text-slate-300 block mb-3">
              Core Prepared Spells & Utility
            </span>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="spell in activeCompanion.skillPriority.spellRecommendations"
                :key="spell"
                class="px-2.5 py-1 text-xs font-semibold rounded-lg bg-slate-900 border border-slate-800 text-amber-300"
              >
                {{ spell }}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Tav Customization Modal Dialog -->
    <CustomTavModal v-if="showTavModal" @close="showTavModal = false" />

    <!-- Slot Hero Picker Popout Modal -->
    <SlotAssignModal
      v-if="activeAssignSlot !== null"
      :slot-index="activeAssignSlot"
      @close="activeAssignSlot = null"
    />
  </div>
</template>
