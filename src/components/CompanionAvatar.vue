<script setup lang="ts">
import { computed } from 'vue';
import type { OriginType, CombatRole } from '../types/companion';

const props = defineProps<{
  avatar: string;
  name: string;
  originType: OriginType;
  primaryRole?: CombatRole;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  highlighted?: boolean;
}>();

const badgeColor = computed(() => {
  switch (props.originType) {
    case 'origin':
      return 'bg-amber-500/20 text-amber-300 border-amber-500/40';
    case 'companion':
      return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40';
    case 'custom':
      return 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40';
    default:
      return 'bg-slate-500/20 text-slate-300 border-slate-500/40';
  }
});

const sizeClasses = computed(() => {
  switch (props.size) {
    case 'sm':
      return 'w-10 h-10';
    case 'lg':
      return 'w-20 h-20';
    case 'xl':
      return 'w-24 h-24 md:w-28 md:h-28';
    case 'md':
    default:
      return 'w-14 h-14';
  }
});
</script>

<template>
  <div class="relative inline-flex items-center justify-center select-none shrink-0">
    <div
      :class="[
        sizeClasses,
        'rounded-2xl overflow-hidden border transition-all duration-200 shadow-md bg-slate-900',
        highlighted
          ? 'border-amber-400 ring-2 ring-amber-400/40 scale-105'
          : 'border-slate-700/80 hover:border-slate-500'
      ]"
    >
      <img
        :src="avatar"
        :alt="name"
        class="w-full h-full object-cover object-top"
        loading="lazy"
      />
    </div>

    <!-- Origin Category Indicator -->
    <span
      v-if="originType"
      :class="[
        badgeColor,
        'absolute bottom-0 right-0 text-[8px] uppercase font-bold tracking-wider px-1.5 py-0.2 rounded-md border shadow-md backdrop-blur-sm pointer-events-none'
      ]"
    >
      {{ originType === 'custom' ? 'Tav' : originType }}
    </span>
  </div>
</template>
