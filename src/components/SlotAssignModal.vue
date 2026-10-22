<template>
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
    <div class="bg-slate-900 border border-amber-500/40 w-full max-w-4xl rounded-2xl shadow-2xl p-6 overflow-hidden flex flex-col max-h-[88vh] text-slate-100">
      <!-- Modal Header -->
      <div class="flex items-center justify-between pb-4 border-b border-slate-800 shrink-0">
        <div class="flex items-center gap-3">
          <div class="p-2 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-400">
            <D20Icon class="w-6 h-6 text-amber-400" />
          </div>
          <div>
            <h3 class="text-lg font-bold font-serif text-slate-100 tracking-wide flex items-center gap-2">
              Select Hero for Party Slot {{ slotIndex + 1 }}
            </h3>
            <p class="text-xs text-slate-400">
              Showing recruited camp inventory. Click any hero to assign to this party slot.
            </p>
          </div>
        </div>

        <button
          @click="emit('close')"
          class="text-slate-400 hover:text-slate-200 p-1.5 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X class="w-5 h-5" />
        </button>
      </div>

      <!-- Search & Category Filters -->
      <div class="grid grid-cols-1 md:grid-cols-12 gap-3 pt-4 pb-2 shrink-0">
        <div class="md:col-span-7 relative">
          <Search class="w-4 h-4 text-slate-500 absolute left-3 top-3" />
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search by name, class, subclass, or tag..."
            class="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-100 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400/50"
          />
        </div>

        <div class="md:col-span-5 flex items-center gap-2">
          <SlidersHorizontal class="w-4 h-4 text-slate-500 shrink-0" />
          <select
            v-model="selectedRole"
            class="w-full px-3 py-2 text-xs rounded-xl bg-slate-950 border border-slate-800 text-slate-200 focus:outline-none focus:border-amber-400"
          >
            <option value="">All Combat Roles</option>
            <option v-for="r in roles" :key="r" :value="r">{{ r }}</option>
          </select>
        </div>
      </div>

      <!-- Scrollable Grid of Companions -->
      <div class="overflow-y-auto flex-1 mt-3 pr-1 space-y-2">
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          <div
            v-for="comp in candidateCompanions"
            :key="comp.id"
            @click="assign(comp.id)"
            :class="[
              'p-3.5 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between group',
              isCurrentlySelected(comp.id)
                ? 'bg-amber-950/30 border-amber-500/80 shadow-md ring-1 ring-amber-400/40'
                : 'bg-slate-950/70 border-slate-800 hover:border-slate-600 hover:bg-slate-950'
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
                  <h4 class="text-sm font-bold text-slate-100 truncate group-hover:text-amber-300 transition-colors">
                    {{ comp.id === 'tav' ? store.customTavConfig.name : comp.name }}
                  </h4>
                  <Check v-if="isCurrentlySelected(comp.id)" class="w-4 h-4 text-amber-400 shrink-0" />
                </div>

                <p class="text-[11px] text-amber-400 font-medium truncate mt-0.5">
                  {{ comp.id === 'tav' ? store.customTavConfig.canonicalClass : comp.canonicalClass }}
                  <span class="text-slate-400">({{ comp.id === 'tav' ? store.customTavConfig.canonicalSubclass : comp.canonicalSubclass }})</span>
                </p>

                <div class="flex items-center gap-1.5 mt-2 flex-wrap">
                  <span class="px-1.5 py-0.5 text-[9px] font-semibold rounded bg-slate-800/80 text-slate-300 border border-slate-700/50">
                    {{ comp.id === 'tav' ? store.customTavConfig.primaryRole : comp.primaryRole }}
                  </span>
                  <span class="px-1.5 py-0.5 text-[9px] rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 truncate max-w-[120px]">
                    {{ comp.uniqueFeature.tag }}
                  </span>
                </div>
              </div>
            </div>

            <!-- Footer indicator -->
            <div class="mt-3 pt-2 border-t border-slate-800/60 flex items-center justify-between text-[10px] text-slate-400">
              <span class="truncate italic">{{ comp.title }}</span>
              <span class="font-bold text-amber-400 group-hover:underline">Select</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Action Footer -->
      <div class="flex items-center justify-between pt-4 mt-3 border-t border-slate-800 shrink-0">
        <span class="text-xs text-slate-400">
          Tip: You can customize your camp roster at any time in the camp inventory below.
        </span>

        <button
          @click="emit('close')"
          class="px-4 py-2 text-xs font-semibold rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
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

const candidateCompanions = computed(() => {
  return store.allCompanions
    .filter((c) => store.recruitedIds.includes(c.id))
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
