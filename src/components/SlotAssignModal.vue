<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
    <div class="bg-gradient-to-b from-[#211913] to-[#140e0a] border-2 border-[#d4af37] w-full max-w-4xl rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[88vh] text-[#f4ebd9] relative">
      <!-- Corner Filigree Ornaments -->
      <div class="absolute top-2 left-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
      <div class="absolute top-2 right-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>

      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-[#443221] shrink-0">
        <div class="flex items-center gap-3">
          <div class="p-2.5 rounded-xl bg-[#2a1d13] border border-[#8c6d37] text-[#d4af37]">
            <D20Icon class="w-6 h-6 text-[#d4af37]" />
          </div>
          <div>
            <h3 class="text-xl font-bold font-['Cinzel'] text-[#fcedb6] tracking-wide flex items-center gap-2">
              Summon Hero for Party Slot {{ slotIndex + 1 }}
            </h3>
            <p class="text-xs text-[#b5a07e] font-sans">
              Showing recruited camp inventory. Click any companion to bind them to this slot.
            </p>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="text-[#8c785b] hover:text-[#fcedb6] p-1.5 rounded-lg hover:bg-[#261c14] transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Search & Category Filters -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3.5 pt-4 pb-2 shrink-0">
        <div class="md:col-span-7 relative">
          <Search class="w-4 h-4 text-[#8c785b] absolute left-3.5 top-3" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, class, subclass, or tag..."
            class="w-full pl-10 pr-3.5 py-2 text-xs rounded-xl bg-[#120d09] border border-[#3d2c1d] text-[#fcedb6] placeholder-[#7d6850] focus:outline-none focus:border-[#d4af37] font-sans"
          />
        </div>

        <div class="md:col-span-5 flex items-center gap-2">
          <SlidersHorizontal class="w-4 h-4 text-[#8c785b] shrink-0" />
          <select
            v-model="selectedRole"
            class="w-full px-3.5 py-2 text-xs rounded-xl bg-[#120d09] border border-[#3d2c1d] text-[#f4ebd9] focus:outline-none focus:border-[#d4af37] font-sans"
          >
            <option value="">All Combat Roles</option>
            <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>
      </div>

      <!-- Recruited vs All Toggle Buttons -->
      <div class="flex items-center gap-2 pt-1 pb-1 shrink-0">
        <button
          type="button"
          @click="showAllRoster = false"
          :class="[
            'px-3 py-1.5 text-xs rounded-lg border font-sans font-semibold transition-all',
            !showAllRoster
              ? 'bg-[#2a1d13] border-[#d4af37] text-[#fcedb6] shadow-sm'
              : 'border-[#3d2c1d] text-[#8c785b] hover:text-[#f4ebd9] hover:bg-[#1a120c]'
          ]"
        >
          Camp Recruits ({{ store.recruitedIds.length }})
        </button>
        <button
          type="button"
          @click="showAllRoster = true"
          :class="[
            'px-3 py-1.5 text-xs rounded-lg border font-sans font-semibold transition-all',
            showAllRoster
              ? 'bg-[#2a1d13] border-[#d4af37] text-[#fcedb6] shadow-sm'
              : 'border-[#3d2c1d] text-[#8c785b] hover:text-[#f4ebd9] hover:bg-[#1a120c]'
          ]"
        >
          All Roster ({{ store.allCompanions.length }})
        </button>
      </div>

      <!-- Scrollable Grid of Companions -->
      <div class="overflow-y-auto flex-1 mt-3 pr-1 space-y-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
          <div
            v-for="comp in candidateCompanions"
            :key="comp.id"
            @click="assign(comp.id)"
            :class="[
              'p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group shadow-md',
              isCurrentlySelected(comp.id)
                ? 'bg-gradient-to-b from-[#2a1d13] to-[#1c130c] border-[#d4af37] ring-1 ring-[#d4af37]/40 shadow-lg shadow-black/80'
                : 'bg-gradient-to-b from-[#18110b] to-[#120d09] border-[#3d2c1d] hover:border-[#8c6d37] hover:bg-[#201710]'
            ]"
          >
            <div class="flex items-start gap-3">
              <CompanionAvatar
                :avatar="comp.id === 'tav' ? (store.customTavConfig.gender === 'female' ? '/companions/tav-female.svg' : '/companions/tav-male.svg') : comp.avatar"
                :name="comp.id === 'tav' ? store.customTavConfig.name : comp.name"
                :origin-type="comp.originType"
                size="md"
              />

              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between gap-1">
                  <h4 class="text-sm font-bold text-[#fcedb6] truncate group-hover:text-[#fdedb6] transition-colors font-sans">
                    {{ comp.id === 'tav' ? store.customTavConfig.name : comp.name }}
                  </h4>
                  <Check v-if="isCurrentlySelected(comp.id)" class="w-4 h-4 text-[#d4af37] shrink-0" />
                </div>

                <p class="text-xs text-[#e6ca65] font-medium truncate mt-0.5 font-sans">
                  {{ comp.id === 'tav' ? store.customTavConfig.canonicalClass : comp.canonicalClass }}
                  <span class="text-[#8c785b]">({{ comp.id === 'tav' ? store.customTavConfig.canonicalSubclass : comp.canonicalSubclass }})</span>
                </p>

                <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span class="px-1.5 py-0.5 text-[9px] font-bold rounded bg-[#261c13] text-[#dfd1ba] border border-[#443221] font-sans">
                    {{ comp.id === 'tav' ? store.customTavConfig.primaryRole : comp.primaryRole }}
                  </span>
                  <span class="px-1.5 py-0.5 text-[9px] rounded bg-[#2a1e14] text-[#d4af37] border border-[#5d442e] truncate max-w-[120px] font-sans">
                    {{ comp.uniqueFeature.tag }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer indicator -->
            <div class="mt-3.5 pt-2 border-t border-[#332417] flex items-center justify-between text-[11px] text-[#8c785b] font-sans">
              <span class="truncate italic">{{ comp.title }}</span>
              <span class="font-bold text-[#d4af37] group-hover:underline font-sans">Summon</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex items-center justify-between pt-4 mt-3 border-t border-[#443221] shrink-0">
        <span class="text-xs text-[#8c785b] font-sans italic">
          Tip: You can modify recruitment status anytime in the camp roster below.
        </span>

        <button
          @click="emit('close')"
          class="px-5 py-2 text-xs font-semibold rounded-xl bg-[#261c14] hover:bg-[#38281a] text-[#b5a07e] border border-[#443221] transition-colors font-sans"
        >
          Close
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import type { CompanionId, CombatRole } from '../types/companion';
import CompanionAvatar from './CompanionAvatar.vue';
import D20Icon from './D20Icon.vue';
import { X, Search, SlidersHorizontal, Check } from 'lucide-vue-next';

const props = defineProps<{
  slotIndex: number;
}>();

const emit = defineEmits<{
  (e: 'close'): void;
}>();

const store = useTeamStore();
const searchQuery = ref('');
const selectedRole = ref<CombatRole | ''>('');

const roles: CombatRole[] = [
  'Striker',
  'AoE Blaster',
  'Controller',
  'Support',
  'Tank',
  'Skill Monkey',
  'Party Face'
];

const showAllRoster = ref(store.recruitedIds.length === 0);

const candidateCompanions = computed(() => {
  const base = (!showAllRoster.value && store.recruitedIds.length > 0)
    ? store.allCompanions.filter((c) => store.recruitedIds.includes(c.id))
    : store.allCompanions;
  return base
    .filter((comp) => {
      const name = comp.id === 'tav' ? store.customTavConfig.name : comp.name;
      const cls = comp.id === 'tav' ? store.customTavConfig.canonicalClass : comp.canonicalClass;
      const sub = comp.id === 'tav' ? store.customTavConfig.canonicalSubclass : comp.canonicalSubclass;
      const role = comp.id === 'tav' ? store.customTavConfig.primaryRole : comp.primaryRole;

      const q = searchQuery.value.toLowerCase();
      const matchesQuery =
        !q ||
        name.toLowerCase().includes(q) ||
        cls.toLowerCase().includes(q) ||
        sub.toLowerCase().includes(q) ||
        comp.uniqueFeature.tag.toLowerCase().includes(q);

      const matchesRole = !selectedRole.value || role === selectedRole.value;
      return matchesQuery && matchesRole;
    });
});

const isCurrentlySelected = (id: CompanionId) => {
  return store.currentTeam[props.slotIndex] === id;
};

const assign = (id: CompanionId) => {
  store.assignCompanion(props.slotIndex, id);
  store.setInspectingSlot(props.slotIndex);
  emit('close');
};
</script>
