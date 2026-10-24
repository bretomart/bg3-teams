<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import CompanionAvatar from './CompanionAvatar.vue';
import CustomTavModal from './CustomTavModal.vue';
import SlotAssignModal from './SlotAssignModal.vue';
import D20Icon from './D20Icon.vue';
import GearIcon from './GearIcon.vue';
import type { Companion, BuildOption } from '../types/companion';
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
  BookOpen,
  Check,
  AlertTriangle,
  Sparkles
} from 'lucide-vue-next';

const store = useTeamStore();
const showTavModal = ref(false);
const activeAssignSlot = ref<number | null>(null);
const activeTab = ref<'gear' | 'rationale' | 'stats' | 'rotation'>('gear');
const isInspectorCollapsed = ref(false);

const activeCompanion = computed<Companion | null>(() => {
  return store.selectedCompanionDetail || store.teamCompanions[store.inspectingSlotIndex] || null;
});

const availableBuilds = computed<BuildOption[]>(() => {
  if (!activeCompanion.value) return [];
  const base = store.allCompanions.find((c) => c.id === activeCompanion.value?.id);
  return base?.builds || [];
});

const currentSelectedBuildId = computed(() => {
  if (!activeCompanion.value) return '';
  return store.selectedBuildIds[activeCompanion.value.id] || availableBuilds.value[0]?.id || '';
});

const activeBuildOption = computed<BuildOption | null>(() => {
  return availableBuilds.value.find((b) => b.id === currentSelectedBuildId.value) || availableBuilds.value[0] || null;
});

const handleSelectBuild = (buildId: string) => {
  if (activeCompanion.value) {
    store.setCompanionBuild(activeCompanion.value.id, buildId);
  }
};

const handleSlotClick = (index: number) => {
  const member = store.teamCompanions[index];
  if (!member) {
    activeAssignSlot.value = index;
  } else {
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
    <div class="grimoire-card rounded-2xl p-6 relative overflow-hidden">
      <!-- Corner Filigree Ornaments -->
      <div class="absolute top-2 left-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
      <div class="absolute top-2 right-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
      <div class="absolute bottom-2 left-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
      <div class="absolute bottom-2 right-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>

      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-5 border-b border-[#443221] gap-4">
        <div>
          <h2 class="text-xl font-bold font-['Cinzel'] text-[#fcedb6] tracking-wide flex items-center gap-2.5">
            <D20Icon class="w-5 h-5 text-[#d4af37] shrink-0" />
            <span>Active Adventuring Party (4 Slots)</span>
          </h2>
          <p class="text-xs text-[#b5a07e] font-sans mt-1">
            Click any active folio slot to inscribe builds, alter modular weapons, or review tactical synergy.
          </p>
        </div>

        <button
          @click="showTavModal = true"
          class="flex items-center gap-2 px-4 py-2 rounded-xl btn-grimoire-leather text-xs font-bold transition-all shadow-md group"
        >
          <Sliders class="w-3.5 h-3.5 text-[#d4af37] group-hover:rotate-45 transition-transform" />
          <span>Inscribe Custom Tav</span>
        </button>
      </div>

      <!-- 4 Party Member Cards Grid -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-5">
        <div
          v-for="(member, index) in store.teamCompanions"
          :key="index"
          @click="handleSlotClick(index)"
          :class="[
            'relative rounded-2xl border p-4 transition-all duration-200 cursor-pointer flex flex-col justify-between min-h-[156px] group',
            store.inspectingSlotIndex === index && member
              ? 'border-[#d4af37] bg-gradient-to-b from-[#2a1d13] to-[#1c130c] ring-2 ring-[#d4af37]/40 shadow-xl shadow-black/80'
              : member
              ? 'border-[#443221] bg-gradient-to-b from-[#1c140e] to-[#120d09] hover:border-[#8c6d37] hover:bg-[#211811] shadow-lg shadow-black/50'
              : 'border-dashed border-[#5a432d] bg-[#120d09]/40 hover:border-[#d4af37] hover:bg-[#1a120b]/70'
          ]"
        >
          <!-- Corner Accents on Card -->
          <span class="absolute top-1.5 left-2 text-[9px] text-[#8c6d37]/50 pointer-events-none">✦</span>
          <span class="absolute top-1.5 right-2 text-[9px] text-[#8c6d37]/50 pointer-events-none">✦</span>

          <!-- Empty Slot -->
          <div v-if="!member" class="h-full flex flex-col items-center justify-center text-center p-3">
            <div class="w-11 h-11 rounded-full border border-dashed border-[#8c6d37] flex items-center justify-center text-[#8c6d37] group-hover:text-[#d4af37] group-hover:border-[#d4af37] mb-2 font-bold text-sm transition-all shadow-inner">
              <D20Icon class="w-5 h-5" />
            </div>
            <span class="text-xs font-bold text-[#c5a059] group-hover:text-[#fcedb6] uppercase tracking-wider font-sans transition-colors">
              Party Slot {{ index + 1 }}
            </span>
            <span class="text-[11px] text-[#8c785b] group-hover:text-[#c5a059] mt-0.5 font-sans italic">
              Click to summon hero
            </span>
          </div>

          <!-- Occupied Slot -->
          <template v-else>
            <div class="flex items-start justify-between gap-2.5">
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
                    <span class="text-[10px] font-bold text-[#d4af37] uppercase tracking-wider font-sans">
                      Slot {{ index + 1 }}
                    </span>
                  </div>
                  <h3 class="text-sm font-bold text-[#fcedb6] truncate font-sans" :title="member.name">
                    {{ member.name }}
                  </h3>
                  <p class="text-xs text-[#c5b89a] truncate font-sans" :title="`${member.canonicalClass} (${member.canonicalSubclass})`">
                    {{ member.canonicalClass }} <span class="text-[#8c785b]">({{ member.canonicalSubclass }})</span>
                  </p>
                </div>
              </div>

              <div class="flex items-center gap-1 shrink-0">
                <button
                  @click="openSlotPicker(index, $event)"
                  class="text-[#8c6d37] hover:text-[#d4af37] p-1.5 rounded-lg hover:bg-[#2a1d13] transition-colors"
                  title="Swap hero"
                >
                  <RotateCcw class="w-3.5 h-3.5" />
                </button>
                <button
                  @click="removeSlot(index, $event)"
                  class="text-[#8c6d37] hover:text-[#ef4444] p-1.5 rounded-lg hover:bg-[#2a1d13] transition-colors"
                  title="Dismiss companion from party"
                >
                  <Trash2 class="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <!-- Role & Tag Badges -->
            <div class="mt-3 pt-2.5 border-t border-[#38281a] flex items-center justify-between gap-1.5 min-w-0">
              <span class="px-2 py-0.5 text-[9px] font-bold rounded bg-[#2a1e14] text-[#fcedb6] border border-[#5d442e] shrink-0 font-sans">
                {{ member.primaryRole }}
              </span>

              <span class="text-[11px] text-[#a89476] truncate text-right flex-1 min-w-0 font-sans italic" :title="member.uniqueFeature.tag">
                {{ member.uniqueFeature.tag }}
              </span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <!-- Collapsible Component Inspection Folio for Inspected Slot -->
    <div
      v-if="activeCompanion"
      class="grimoire-card rounded-2xl overflow-hidden transition-all shadow-2xl relative"
    >
      <!-- Corner Filigree Ornaments -->
      <div class="absolute top-2 left-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
      <div class="absolute top-2 right-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>

      <!-- Collapsible Header Banner -->
      <div
        @click="isInspectorCollapsed = !isInspectorCollapsed"
        class="p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4 cursor-pointer hover:bg-[#261d15]/50 transition-colors border-b border-[#443221]"
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
              <span class="text-xs font-bold uppercase tracking-wider text-[#d4af37] font-sans flex items-center gap-1.5">
                <D20Icon class="w-3.5 h-3.5 text-[#d4af37]" />
                Slot {{ store.inspectingSlotIndex + 1 }} Hero Folio
              </span>
              <span class="text-[#6b5238]">✦</span>
              <span class="text-xs font-semibold text-[#c5b89a] font-sans">{{ activeCompanion.title }}</span>
            </div>
            <h2 class="text-2xl font-bold font-sans text-[#fcedb6] tracking-tight mt-1">
              {{ activeCompanion.name }}
            </h2>
            <p class="text-xs text-[#c5b89a] font-['IM_Fell_English'] italic text-[15px] mt-0.5">
              "{{ activeCompanion.quote }}"
            </p>
          </div>
        </div>

        <div class="flex items-center gap-3.5 self-end lg:self-auto">
          <!-- Active Build Badge Indicator -->
          <div class="bg-[#120d09] px-4 py-2 rounded-xl border border-[#443221] text-right shadow-inner">
            <span class="text-[10px] font-bold text-[#8c785b] uppercase tracking-wider block font-sans">Current Inscription</span>
            <span class="text-xs font-bold text-[#e6ca65] font-sans">{{ activeCompanion.recommendedMulticlass }}</span>
          </div>

          <button
            v-if="activeCompanion.id === 'tav'"
            @click.stop="showTavModal = true"
            class="px-4 py-2 rounded-xl btn-grimoire-gold text-xs font-bold transition-all shadow-md"
          >
            Modify Tav
          </button>

          <button class="text-[#c5a059] p-2 rounded-lg hover:bg-[#2a1d13] transition-colors">
            <ChevronUp v-if="!isInspectorCollapsed" class="w-5 h-5" />
            <ChevronDown v-else class="w-5 h-5" />
          </button>
        </div>
      </div>

      <!-- Collapsible Body with Tabbed Progressive Disclosure -->
      <div v-show="!isInspectorCollapsed" class="p-6 space-y-6">
        <!-- Interactive Build Path Selector for Origin / Custom Characters -->
        <div v-if="availableBuilds.length > 1" class="p-5 rounded-xl grimoire-inset">
          <div class="flex items-center justify-between pb-3 border-b border-[#3d2c1d] mb-4">
            <div class="flex items-center gap-2">
              <Sparkles class="w-4 h-4 text-[#d4af37]" />
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#fcedb6] font-sans">
                Inscribe {{ activeCompanion.name }}'s Build Archetype
              </h3>
            </div>
            <span class="text-[11px] text-[#8c785b] font-sans italic">
              Updates synergies, weapons, and drawbacks immediately
            </span>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
            <button
              v-for="b in availableBuilds"
              :key="b.id"
              @click="handleSelectBuild(b.id)"
              :class="[
                'p-3.5 rounded-xl border text-left transition-all flex flex-col justify-between relative group',
                currentSelectedBuildId === b.id
                  ? 'bg-gradient-to-b from-[#2d1f14] to-[#1e150e] border-[#d4af37] ring-1 ring-[#d4af37]/40 shadow-lg shadow-black/60'
                  : 'bg-[#150f0a] border-[#38281a] hover:border-[#8c6d37] hover:bg-[#1c140e]'
              ]"
            >
              <div>
                <div class="flex items-center justify-between gap-1">
                  <h4 class="text-xs font-bold text-[#fcedb6] font-sans">{{ b.name }}</h4>
                  <Check v-if="currentSelectedBuildId === b.id" class="w-4 h-4 text-[#d4af37] shrink-0" />
                </div>
                <p class="text-xs text-[#e6ca65] font-semibold mt-1 font-sans">{{ b.classSplit }}</p>
                <p class="text-xs text-[#b5a07e] mt-1.5 line-clamp-2 font-sans leading-snug">{{ b.description }}</p>
              </div>

              <div class="mt-3 pt-2.5 border-t border-[#332417] flex items-center justify-between text-[10px]">
                <span class="px-2 py-0.5 rounded bg-[#261c13] text-[#dfd1ba] font-bold font-sans">{{ b.primaryRole }}</span>
                <span class="text-[#8c785b] font-sans italic">{{ b.shortRestRecharge ? 'Short Rest' : 'Long Rest' }}</span>
              </div>
            </button>
          </div>
        </div>

        <!-- Tabbed Navigation Bar -->
        <div class="flex items-center gap-2 border-b border-[#443221] pb-3 flex-wrap">
          <button
            @click="activeTab = 'gear'"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all font-sans tracking-wide',
              activeTab === 'gear'
                ? 'bg-gradient-to-b from-[#d4af37] to-[#aa8524] text-[#140e09] border border-[#f5df86] shadow-md shadow-[#d4af37]/20 font-black'
                : 'text-[#b5a07e] hover:text-[#fcedb6] hover:bg-[#231911]'
            ]"
          >
            <Sword class="w-3.5 h-3.5" />
            Weapons & Modular Arsenal
          </button>

          <button
            @click="activeTab = 'rationale'"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all font-sans tracking-wide',
              activeTab === 'rationale'
                ? 'bg-gradient-to-b from-[#d4af37] to-[#aa8524] text-[#140e09] border border-[#f5df86] shadow-md shadow-[#d4af37]/20 font-black'
                : 'text-[#b5a07e] hover:text-[#fcedb6] hover:bg-[#231911]'
            ]"
          >
            <BookOpen class="w-3.5 h-3.5" />
            Build Strategy & Drawbacks
          </button>

          <button
            @click="activeTab = 'stats'"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all font-sans tracking-wide',
              activeTab === 'stats'
                ? 'bg-gradient-to-b from-[#d4af37] to-[#aa8524] text-[#140e09] border border-[#f5df86] shadow-md shadow-[#d4af37]/20 font-black'
                : 'text-[#b5a07e] hover:text-[#fcedb6] hover:bg-[#231911]'
            ]"
          >
            <Scroll class="w-3.5 h-3.5" />
            Abilities & Feats
          </button>

          <button
            @click="activeTab = 'rotation'"
            :class="[
              'flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all font-sans tracking-wide',
              activeTab === 'rotation'
                ? 'bg-gradient-to-b from-[#d4af37] to-[#aa8524] text-[#140e09] border border-[#f5df86] shadow-md shadow-[#d4af37]/20 font-black'
                : 'text-[#b5a07e] hover:text-[#fcedb6] hover:bg-[#231911]'
            ]"
          >
            <Layers class="w-3.5 h-3.5" />
            Combat Rites & Turn Economy
          </button>
        </div>

        <!-- TAB 1: WEAPONS & MODULAR ARSENAL -->
        <div v-show="activeTab === 'gear'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <!-- Modular Progression Weapons & Quest Alternatives -->
          <div class="lg:col-span-6 grimoire-inset p-5 rounded-xl">
            <div class="flex items-center justify-between mb-4">
              <div class="flex items-center gap-2">
                <Sword class="w-4 h-4 text-[#d4af37]" />
                <h3 class="text-xs font-bold uppercase tracking-wider text-[#fcedb6] font-sans">
                  Weapon Options & Quest Alternatives
                </h3>
              </div>
              <span class="text-[10px] text-[#8c785b] font-['EB_Garamond'] italic">Story, vendor, & secret drops</span>
            </div>

            <div class="space-y-3">
              <div
                v-for="wpn in activeCompanion.optimalGear.weapons"
                :key="wpn.name"
                class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex flex-col gap-1.5 shadow-sm"
              >
                <div class="flex items-center justify-between gap-2 flex-wrap">
                  <div class="flex items-center gap-2">
                    <GearIcon :name="wpn.type" class="w-4 h-4 text-[#d4af37]" />
                    <span class="text-xs font-bold text-[#fcedb6] font-sans">{{ wpn.name }}</span>
                    <span class="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#2a1e14] text-[#e6ca65] border border-[#5d442e] font-sans">
                      Act {{ wpn.act }}
                    </span>
                    <span class="text-[11px] text-[#8c785b] font-['EB_Garamond']">{{ wpn.type }}</span>
                  </div>

                  <span
                    v-if="wpn.sourceCategory"
                    :class="[
                      'text-[9px] font-semibold px-2 py-0.5 rounded border font-[\'Cinzel\'] uppercase tracking-wider',
                      wpn.sourceCategory === 'Quest Locked'
                        ? 'bg-[#450a0a]/70 text-[#fca5a5] border-[#b91c1c]'
                        : wpn.sourceCategory === 'Optional Secret / Boss'
                        ? 'bg-[#3b0764]/70 text-[#d8b4fe] border-[#9333ea]'
                        : 'bg-[#211811] text-[#c5a059] border-[#443221]'
                    ]"
                  >
                    {{ wpn.sourceCategory }}
                  </span>
                </div>

                <p class="text-[13px] text-[#c5b89a] leading-snug font-['EB_Garamond']">{{ wpn.description }}</p>

                <div
                  v-if="wpn.questLockWarning"
                  class="mt-1 p-2 rounded bg-[#331808]/70 border border-[#b45309]/50 flex items-start gap-2 text-[12px] text-[#fde68a] font-['EB_Garamond']"
                >
                  <AlertTriangle class="w-3.5 h-3.5 text-[#f59e0b] shrink-0 mt-0.5" />
                  <span>{{ wpn.questLockWarning }}</span>
                </div>
              </div>
            </div>
          </div>

          <!-- Recommended Armor & Wards Matrix -->
          <div class="lg:col-span-6 grimoire-inset p-5 rounded-xl">
            <div class="flex items-center gap-2 mb-4">
              <Shield class="w-4 h-4 text-[#d4af37]" />
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#fcedb6] font-sans">
                Recommended Armor & Relic Matrix
              </h3>
            </div>

            <div class="grid grid-cols-2 gap-2.5 text-xs">
              <div class="p-2.5 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex items-center gap-2.5">
                <GearIcon name="head" class="w-4 h-4 text-[#d4af37]" />
                <div class="min-w-0">
                  <span class="text-[10px] font-bold text-[#8c785b] uppercase block font-sans">Headgear</span>
                  <span class="font-semibold text-[#f4ebd9] truncate block font-['EB_Garamond'] text-[14px]">{{ activeCompanion.optimalGear.armor.head }}</span>
                </div>
              </div>

              <div class="p-2.5 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex items-center gap-2.5">
                <GearIcon name="chest" class="w-4 h-4 text-[#d4af37]" />
                <div class="min-w-0">
                  <span class="text-[10px] font-bold text-[#8c785b] uppercase block font-sans">Chest Armor</span>
                  <span class="font-semibold text-[#f4ebd9] truncate block font-['EB_Garamond'] text-[14px]">{{ activeCompanion.optimalGear.armor.chest }}</span>
                </div>
              </div>

              <div class="p-2.5 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex items-center gap-2.5">
                <GearIcon name="gloves" class="w-4 h-4 text-[#d4af37]" />
                <div class="min-w-0">
                  <span class="text-[10px] font-bold text-[#8c785b] uppercase block font-sans">Gloves</span>
                  <span class="font-semibold text-[#f4ebd9] truncate block font-['EB_Garamond'] text-[14px]">{{ activeCompanion.optimalGear.armor.gloves }}</span>
                </div>
              </div>

              <div class="p-2.5 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex items-center gap-2.5">
                <GearIcon name="boots" class="w-4 h-4 text-[#d4af37]" />
                <div class="min-w-0">
                  <span class="text-[10px] font-bold text-[#8c785b] uppercase block font-sans">Boots</span>
                  <span class="font-semibold text-[#f4ebd9] truncate block font-['EB_Garamond'] text-[14px]">{{ activeCompanion.optimalGear.armor.boots }}</span>
                </div>
              </div>

              <div class="p-2.5 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex items-center gap-2.5">
                <GearIcon name="amulet" class="w-4 h-4 text-[#d4af37]" />
                <div class="min-w-0">
                  <span class="text-[10px] font-bold text-[#8c785b] uppercase block font-sans">Amulet</span>
                  <span class="font-semibold text-[#f4ebd9] truncate block font-['EB_Garamond'] text-[14px]">{{ activeCompanion.optimalGear.armor.amulet }}</span>
                </div>
              </div>

              <div class="p-2.5 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex items-center gap-2.5">
                <GearIcon name="rings" class="w-4 h-4 text-[#d4af37]" />
                <div class="min-w-0">
                  <span class="text-[10px] font-bold text-[#8c785b] uppercase block font-sans">Rings</span>
                  <span class="font-semibold text-[#f4ebd9] truncate block font-['EB_Garamond'] text-[14px]">{{ activeCompanion.optimalGear.armor.rings.join(', ') }}</span>
                </div>
              </div>
            </div>

            <div v-if="activeCompanion.optimalGear.armor.cloak" class="mt-2.5 p-2.5 rounded-lg bg-[#18110b] border border-[#3d2c1d] text-xs flex items-center gap-2.5">
              <GearIcon name="cloak" class="w-4 h-4 text-[#d4af37]" />
              <div class="min-w-0">
                <span class="text-[10px] font-bold text-[#8c785b] uppercase block font-sans">Cloak</span>
                <span class="font-semibold text-[#e6ca65] font-['EB_Garamond'] text-[14px]">{{ activeCompanion.optimalGear.armor.cloak }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: DETAILED STRATEGY, POSITIVES & DRAWBACKS -->
        <div v-show="activeTab === 'rationale'" class="space-y-4">
          <div class="p-5 rounded-xl grimoire-inset">
            <h3 class="text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-2 flex items-center gap-2 font-sans">
              <BookOpen class="w-4 h-4" />
              Build Overview: {{ activeCompanion.recommendedMulticlass }}
            </h3>
            <p class="text-sm text-[#dfd1ba] leading-relaxed font-['EB_Garamond'] text-[15px]">
              {{ activeCompanion.optimizationRationale || 'This build maximizes single round action economy, accuracy scaling, and status condition amplification to reliably overcome Honor Mode legendary actions.' }}
            </p>
          </div>

          <!-- Strengths vs Drawbacks Grid -->
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- Strengths -->
            <div class="p-5 rounded-xl bg-gradient-to-b from-[#064e3b]/30 to-[#032e23]/40 border border-[#059669]/50 shadow-md">
              <span class="text-xs font-bold uppercase tracking-wider text-[#6ee7b7] block mb-3 flex items-center gap-2 font-sans">
                <Check class="w-4 h-4 text-[#34d399]" />
                Tactical Strengths & Upsides
              </span>
              <ul class="space-y-2 text-xs text-[#d1fae5] font-['EB_Garamond'] text-[14px] list-disc list-inside">
                <li v-for="str in (activeBuildOption?.strengths || ['High synergy output with party'])" :key="str">
                  {{ str }}
                </li>
              </ul>
            </div>

            <!-- Drawbacks & Vulnerabilities -->
            <div class="p-5 rounded-xl bg-gradient-to-b from-[#450a0a]/35 to-[#240505]/45 border border-[#dc2626]/50 shadow-md">
              <span class="text-xs font-bold uppercase tracking-wider text-[#fca5a5] block mb-3 flex items-center gap-2 font-sans">
                <AlertTriangle class="w-4 h-4 text-[#f87171]" />
                Tactical Drawbacks & Vulnerabilities
              </span>
              <ul class="space-y-2 text-xs text-[#fee2e2] font-['EB_Garamond'] text-[14px] list-disc list-inside">
                <li v-for="drw in (activeBuildOption?.drawbacks || ['Requires standard rest and resource pacing'])" :key="drw">
                  {{ drw }}
                </li>
              </ul>
            </div>
          </div>
        </div>

        <!-- TAB 3: ABILITIES & FEATS -->
        <div v-show="activeTab === 'stats'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-5 grimoire-inset p-5 rounded-xl">
            <span class="text-xs font-bold uppercase tracking-wider text-[#fcedb6] block mb-4 font-sans">
              Target Ability Scores (Level 12)
            </span>
            <div class="grid grid-cols-3 gap-2.5 text-center">
              <div class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d]">
                <span class="text-[10px] font-bold text-[#8c785b] block uppercase font-sans">STR</span>
                <span class="text-lg font-bold text-[#fcedb6] font-sans">{{ activeCompanion.skillPriority.statGoals.str }}</span>
              </div>
              <div class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d]">
                <span class="text-[10px] font-bold text-[#8c785b] block uppercase font-sans">DEX</span>
                <span class="text-lg font-bold text-[#fcedb6] font-sans">{{ activeCompanion.skillPriority.statGoals.dex }}</span>
              </div>
              <div class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d]">
                <span class="text-[10px] font-bold text-[#8c785b] block uppercase font-sans">CON</span>
                <span class="text-lg font-bold text-[#fcedb6] font-sans">{{ activeCompanion.skillPriority.statGoals.con }}</span>
              </div>
              <div class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d]">
                <span class="text-[10px] font-bold text-[#8c785b] block uppercase font-sans">INT</span>
                <span class="text-lg font-bold text-[#fcedb6] font-sans">{{ activeCompanion.skillPriority.statGoals.int }}</span>
              </div>
              <div class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d]">
                <span class="text-[10px] font-bold text-[#8c785b] block uppercase font-sans">WIS</span>
                <span class="text-lg font-bold text-[#fcedb6] font-sans">{{ activeCompanion.skillPriority.statGoals.wis }}</span>
              </div>
              <div class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d]">
                <span class="text-[10px] font-bold text-[#8c785b] block uppercase font-sans">CHA</span>
                <span class="text-lg font-bold text-[#fcedb6] font-sans">{{ activeCompanion.skillPriority.statGoals.cha }}</span>
              </div>
            </div>
          </div>

          <div class="lg:col-span-7 grimoire-inset p-5 rounded-xl">
            <span class="text-xs font-bold uppercase tracking-wider text-[#fcedb6] block mb-4 font-sans">
              Mandatory Feats for Honor Mode
            </span>
            <ul class="space-y-2.5 text-xs text-[#f4ebd9]">
              <li
                v-for="feat in activeCompanion.skillPriority.keyFeats"
                :key="feat"
                class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex items-center gap-3"
              >
                <D20Icon class="w-4 h-4 text-[#d4af37] shrink-0" />
                <span class="font-semibold text-[#fcedb6] font-sans text-xs">{{ feat }}</span>
              </li>
            </ul>
          </div>
        </div>

        <!-- TAB 4: ROTATIONS & SPELLS -->
        <div v-show="activeTab === 'rotation'" class="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div class="lg:col-span-6 grimoire-inset p-5 rounded-xl">
            <span class="text-xs font-bold uppercase tracking-wider text-[#fcedb6] block mb-4 font-sans">
              Action & Spell Priority Sequence
            </span>
            <ol class="space-y-2.5 text-xs text-[#dfd1ba]">
              <li
                v-for="(action, idx) in activeCompanion.skillPriority.order"
                :key="action"
                class="p-3 rounded-lg bg-[#18110b] border border-[#3d2c1d] flex items-center gap-3"
              >
                <span class="text-xs font-bold text-[#140e09] bg-[#d4af37] w-5 h-5 rounded flex items-center justify-center font-sans font-black">
                  {{ idx + 1 }}
                </span>
                <span class="font-medium text-[#f4ebd9] font-['EB_Garamond'] text-[14px]">{{ action }}</span>
              </li>
            </ol>
          </div>

          <div class="lg:col-span-6 grimoire-inset p-5 rounded-xl">
            <span class="text-xs font-bold uppercase tracking-wider text-[#fcedb6] block mb-4 font-sans">
              Core Prepared Spells & Invocations
            </span>
            <div class="flex flex-wrap gap-2">
              <span
                v-for="spell in activeCompanion.skillPriority.spellRecommendations"
                :key="spell"
                class="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#18110b] border border-[#5d442e] text-[#e6ca65] font-sans"
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
