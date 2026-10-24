<script setup lang="ts">
import { ref, computed } from 'vue';
import type { OriginType, CombatRole } from '../types/companion';

const props = defineProps<{
  avatar: string;
  name: string;
  originType: OriginType;
  primaryRole?: CombatRole;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  highlighted?: boolean;
}>();

const imageError = ref(false);
const baseUrl = import.meta.env.BASE_URL || '/';

const resolvedAvatar = computed(() => {
  if (!props.avatar) return '';
  if (props.avatar.startsWith('http://') || props.avatar.startsWith('https://')) {
    return props.avatar;
  }
  const cleanPath = props.avatar.startsWith('/') ? props.avatar.slice(1) : props.avatar;
  return `${baseUrl}${cleanPath}`;
});

const initials = computed(() => {
  const parts = props.name.replace(/[^a-zA-Z\s]/g, '').trim().split(/\s+/);
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return props.name.slice(0, 2).toUpperCase();
});

const badgeColor = computed(() => {
  switch (props.originType) {
    case 'origin':
      return 'bg-gradient-to-r from-[#d4af37] to-[#aa8524] text-[#140e09] border-[#f5df86] font-bold shadow-md shadow-black/60';
    case 'companion':
      return 'bg-gradient-to-r from-[#064e3b] to-[#043327] text-[#a7f3d0] border-[#10b981]/70 font-bold shadow-md shadow-black/60';
    case 'custom':
      return 'bg-gradient-to-r from-[#78350f] to-[#451a03] text-[#fde68a] border-[#f59e0b]/80 font-bold shadow-md shadow-black/60';
    default:
      return 'bg-[#261c14] text-[#c5a059] border-[#443221] shadow-md shadow-black/60';
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
        'rounded-2xl overflow-hidden border-2 transition-all duration-200 shadow-xl bg-[#140e0a] flex items-center justify-center relative',
        highlighted
          ? 'border-[#d4af37] ring-2 ring-[#d4af37]/50 shadow-lg shadow-[#d4af37]/30 scale-105'
          : 'border-[#4a3622] hover:border-[#8c6d37]'
      ]"
    >
      <img
        v-if="!imageError"
        :src="resolvedAvatar"
        :alt="name"
        class="w-full h-full object-cover object-top filter contrast-[1.05]"
        loading="lazy"
        @error="imageError = true"
      />
      <!-- Fallback initials if image cannot load -->
      <span
        v-else
        class="font-sans font-black text-[#d4af37] text-xs tracking-wider"
      >
        {{ initials }}
      </span>
      <!-- Subtle inner vignette overlay -->
      <div class="absolute inset-0 ring-1 ring-inset ring-black/40 pointer-events-none rounded-2xl"></div>
    </div>

    <!-- Origin Category Indicator -->
    <span
      v-if="originType"
      :class="[
        badgeColor,
        'absolute -bottom-1 -right-1 text-[8px] uppercase tracking-wider px-1.5 py-0.2 rounded-md border font-sans font-bold pointer-events-none'
      ]"
    >
      {{ originType === 'custom' ? 'Tav' : originType }}
    </span>
  </div>
</template>
