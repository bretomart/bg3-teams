<template>
  <div class="relative inline-flex items-center justify-center shrink-0">
    <!-- Authentic in-game item texture thumbnail if available -->
    <img
      v-if="itemIconUrl && !imgError"
      :src="itemIconUrl"
      :alt="props.itemName || props.name"
      class="object-contain filter drop-shadow rounded-sm"
      :class="props.class || 'w-5 h-5'"
      loading="lazy"
      @error="imgError = true"
    />

    <!-- Fallback thematic SVG glyph -->
    <svg
      v-else
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      :class="props.class || 'w-4 h-4 text-[#d4af37] shrink-0'"
      aria-hidden="true"
    >
      <!-- Slot: Headgear (Helmet) -->
      <path
        v-if="normalizedName === 'head' || normalizedName === 'headgear' || normalizedName === 'helmet'"
        d="M12 2a7 7 0 0 0-7 7v4a2 2 0 0 0 1 1.73V19a2 2 0 0 0 2 2h8a2 2 0 0 0 2-2v-4.27A2 2 0 0 0 19 13V9a7 7 0 0 0-7-7zm-4 8h8v2h-3v2h-2v-2H8v-2zm-1 4.5V13h1v2H7.5a.5.5 0 0 1-.5-.5zm9.5.5H16v-2h1v1.5a.5.5 0 0 1-.5.5z"
      />

      <!-- Slot: Chest Armor (Breastplate) -->
      <path
        v-else-if="normalizedName === 'chest' || normalizedName === 'chest armor' || normalizedName === 'armor' || normalizedName === 'cuirass'"
        d="M12 2 9 4H6l-3 5 3 2v8l6 3 6-3v-8l3-2-3-5h-3l-3-2zm0 3.5c1.4 0 2.5 1.1 2.5 2.5S13.4 10.5 12 10.5 9.5 9.4 9.5 8 10.6 5.5 12 5.5zM8 12h8v5.5l-4 2-4-2V12z"
      />

      <!-- Slot: Gloves / Gauntlets -->
      <path
        v-else-if="normalizedName === 'gloves' || normalizedName === 'gauntlets' || normalizedName === 'hand'"
        d="M19 8a2 2 0 0 0-2-2h-1V3a1 1 0 0 0-2 0v3h-1V2a1 1 0 0 0-2 0v4h-1V4a1 1 0 0 0-2 0v5.5L7.4 9A1.5 1.5 0 0 0 5 10.5L7 16l2 5h8l2-7V8z"
      />

      <!-- Slot: Boots / Greaves -->
      <path
        v-else-if="normalizedName === 'boots' || normalizedName === 'footwear' || normalizedName === 'shoes'"
        d="M16 2H9v11.5a2 2 0 0 1-.6 1.4L6 17v4h13v-3l-1.5-2H16V2zm-2 10h-3V4h3v8z"
      />

      <!-- Slot: Amulet / Necklace / Pendant -->
      <path
        v-else-if="normalizedName === 'amulet' || normalizedName === 'necklace' || normalizedName === 'pendant'"
        d="M12 2C8.7 2 6 4.7 6 8c0 2.2 1.2 4.1 3 5.1V15l3 6 3-6v-1.9c1.8-1 3-2.9 3-5.1 0-3.3-2.7-6-6-6zm0 14.5-1.5-3h3L12 16.5zM12 4c2.2 0 4 1.8 4 4 0 1.4-.7 2.6-1.8 3.3L12 9.5 9.8 11.3C8.7 10.6 8 9.4 8 8c0-2.2 1.8-4 4-4z"
      />

      <!-- Slot: Ring / Finger -->
      <path
        v-else-if="normalizedName === 'rings' || normalizedName === 'ring'"
        d="M12 3a9 9 0 1 0 0 18 9 9 0 0 0 0-18zm0 15a6 6 0 1 1 0-12 6 6 0 0 1 0 12zm0-10a4 4 0 1 0 0 8 4 4 0 0 0 0-8z"
      />

      <!-- Slot: Cloak / Cape -->
      <path
        v-else-if="normalizedName === 'cloak' || normalizedName === 'cape'"
        d="M12 2a4 4 0 0 0-4 4c0 .7.2 1.4.5 2L4 12v9l5-2 3 2 3-2 5 2v-9l-4.5-4c.3-.6.5-1.3.5-2a4 4 0 0 0-4-4zm0 2a2 2 0 0 1 2 2c0 .5-.2.9-.4 1.3L12 6.5l-1.6.8c-.2-.4-.4-.8-.4-1.3a2 2 0 0 1 2-2zm-5 8.5 3-2.5v7l-3 1.2v-5.7zm10 5.7-3-1.2v-7l3 2.5v5.7z"
      />

      <!-- Weapons: Greatsword / Two-Handed Sword -->
      <path
        v-else-if="normalizedName === 'greatsword' || normalizedName === 'two-handed sword'"
        d="M13 1.5 11 3.5l1.5 1.5-5 5L6 8.5 4.5 10l1.5 1.5-3.5 3.5 1.5 1.5 3.5-3.5 1.5 1.5 1.5-1.5-1.5-1.5 5-5L15 8l2-2-1.5-1.5L17 3l-1.5-1.5L13 1.5zM20 20l-4-4 1.5-1.5 4 4L20 20z"
      />

      <!-- Weapons: Rapier / Estoc -->
      <path
        v-else-if="normalizedName === 'rapier'"
        d="M21 2.5 19.5 4l-9 9c-.5-.2-1.2-.2-1.8.2L7 14.9 5.5 13.4 4 14.9l1.5 1.5-3 3 1.6 1.6 3-3 1.5 1.5 1.5-1.5-1.5-1.5 1.7-1.7c.4-.6.4-1.3.2-1.8l9-9L21 2.5z"
      />

      <!-- Weapons: Scimitar / Shortsword / Dagger -->
      <path
        v-else-if="normalizedName === 'scimitar' || normalizedName === 'shortsword' || normalizedName === 'dagger'"
        d="M19.5 2.5c-3 1.5-6.5 4.5-9 7.5L8 9 6.5 10.5 8 12l-5 5 2 2 5-5 1.5 1.5 1.5-1.5-1-2.5c3-2.5 6-6 7.5-9z"
      />

      <!-- Weapons: Bow / Longbow / Shortbow -->
      <path
        v-else-if="normalizedName === 'longbow' || normalizedName === 'shortbow' || normalizedName === 'bow'"
        d="M19 2a1 1 0 0 0-.7.3L3.3 17.3a1 1 0 0 0 0 1.4l2 2a1 1 0 0 0 1.4 0L21.7 5.7A1 1 0 0 0 22 5a3 3 0 0 0-3-3zm-1 3.4L18.6 6 6 18.6 5.4 18 18 5.4z"
      />

      <!-- Weapons: Hand Crossbow / Crossbow -->
      <path
        v-else-if="normalizedName === 'hand crossbow' || normalizedName === 'crossbow'"
        d="M12 2 9 6h6l-3-4zM4 7l4 3v2l-5 1v-3l1-3zm16 0-1 3v3l-5-1v-2l4-3h2zM11 7h2v10h2v4l-3-2-3 2v-4h2V7z"
      />

      <!-- Weapons: Quarterstaff / Staff -->
      <path
        v-else-if="normalizedName === 'quarterstaff' || normalizedName === 'staff'"
        d="m18 2-2 2 1 1-13 13-1-1-2 2 3 3 2-2-1-1 13-13 1 1 2-2-4-4zm-1 3 1 1L6 18l-1-1L17 5z"
      />

      <!-- Weapons: Warhammer / Mace / Club -->
      <path
        v-else-if="normalizedName === 'warhammer' || normalizedName === 'mace' || normalizedName === 'club'"
        d="M15 2 9 6l2 3-7 7 2 2 7-7 3 2 4-6-5-5zm-1.5 4.5 2-1.3 1.3 2-2 1.3-1.3-2z"
      />

      <!-- Weapons: Polearms: Pike / Halberd / Glaive / Spear / Trident -->
      <path
        v-else-if="normalizedName === 'pike' || normalizedName === 'halberd' || normalizedName === 'glaive' || normalizedName === 'spear' || normalizedName === 'trident'"
        d="M21 2.5 17 4l1 2-12 12-2-1L2 19l3 3 2-2-1-2 12-12 2 1 1.5-4.5zM18 6.5l.8-.8-1.5-1.5-.8.8 1.5 1.5z"
      />

      <!-- Default Generic Sword / Weapon Fallback -->
      <path
        v-else
        d="M6.9 2.5 5.5 3.9l6.6 6.6-4.5 4.5-1.4-.7-2.1 2.1 2.8 2.8-2.8 2.8 1.4 1.4 2.8-2.8 2.8 2.8 2.1-2.1-.7-1.4 4.5-4.5 6.6 6.6 1.4-1.4L6.9 2.5z"
      />
    </svg>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import itemIconsManifest from '../data/itemIcons.json';

const props = defineProps<{
  name: string;
  itemName?: string;
  class?: string;
}>();

const imgError = ref(false);
const baseUrl = import.meta.env.BASE_URL || '/';

const itemIconUrl = computed(() => {
  const target = props.itemName ? props.itemName.trim() : props.name.trim();
  const manifestPath = (itemIconsManifest as Record<string, string>)[target];
  if (!manifestPath) return null;
  const clean = manifestPath.startsWith('/') ? manifestPath.slice(1) : manifestPath;
  return `${baseUrl}${clean}`;
});

const normalizedName = computed(() => {
  return (props.name || '').trim().toLowerCase();
});
</script>
