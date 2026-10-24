<script setup lang="ts">
import { ref } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import type { MetaTeam } from '../types/companion';
import CompanionAvatar from './CompanionAvatar.vue';
import {
  Trophy,
  Check,
  ChevronDown,
  ChevronUp,
  Layers,
  ShieldCheck,
  AlertCircle
} from 'lucide-vue-next';

const store = useTeamStore();
const expandedTeamId = ref<string | null>(store.metaTeams[0]?.id || null);

const isPartyLoaded = (team: MetaTeam) => {
  return team.slots.every((id, idx) => store.currentTeam[idx] === id);
};

const areAllRecruited = (team: MetaTeam) => {
  return team.slots.every((id) => store.recruitedIds.includes(id));
};

const toggleExpand = (id: string) => {
  expandedTeamId.value = expandedTeamId.value === id ? null : id;
};

const getCompanion = (id: string) => {
  return store.allCompanions.find((c) => c.id === id);
};
</script>

<template>
  <div class="grimoire-card rounded-2xl p-6 relative overflow-hidden">
    <!-- Corner Filigree Ornaments -->
    <div class="absolute top-2 left-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
    <div class="absolute top-2 right-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
    <div class="absolute bottom-2 left-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
    <div class="absolute bottom-2 right-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>

    <!-- Header -->
    <div class="flex items-center justify-between pb-5 border-b border-[#443221]">
      <div>
        <div class="flex items-center gap-2.5">
          <Trophy class="w-5 h-5 text-[#d4af37]" />
          <h2 class="text-xl font-bold font-['Cinzel'] text-[#fcedb6] tracking-wide">
            Verified Honor Mode Meta Parties
          </h2>
        </div>
        <p class="text-xs text-[#b5a07e] font-sans mt-1">
          One-click party loading for community battle-tested Honor Mode setups with complete round-by-round turn sequencing and item milestones.
        </p>
      </div>
    </div>

    <!-- Meta Teams Accordion List -->
    <div class="space-y-4 mt-6">
      <div
        v-for="team in store.metaTeams"
        :key="team.id"
        class="rounded-xl border border-[#443221] bg-gradient-to-b from-[#1c140e] to-[#120d09] overflow-hidden transition-all duration-200 shadow-md"
      >
        <!-- Collapsed Bar / Summary Header -->
        <div
          @click="toggleExpand(team.id)"
          class="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-[#251b12]/60 transition-colors"
        >
          <!-- Left: Team Identity & 4 Avatars -->
          <div class="flex items-center gap-4">
            <div class="flex -space-x-3">
              <template v-for="slotId in team.slots" :key="slotId">
                <CompanionAvatar
                  v-if="getCompanion(slotId)"
                  :avatar="getCompanion(slotId)!.avatar"
                  :name="getCompanion(slotId)!.name"
                  :origin-type="getCompanion(slotId)!.originType"
                  size="sm"
                  class="ring-2 ring-[#120d09] shadow-md"
                />
              </template>
            </div>

            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold text-[#fcedb6] font-sans">{{ team.name }}</h3>
                <span class="px-2 py-0.5 text-[10px] font-bold rounded bg-[#2a1e14] text-[#e6ca65] border border-[#5d442e] font-sans">
                  {{ team.difficultyTier }}
                </span>
              </div>
              <p class="text-xs text-[#b5a07e] mt-0.5 line-clamp-1 font-sans">
                {{ team.coreSynergyConcept }}
              </p>
            </div>
          </div>

          <!-- Right: Availability & Action Button -->
          <div class="flex items-center gap-3 self-end md:self-auto">
            <span
              v-if="!areAllRecruited(team)"
              class="text-[11px] text-[#fbbf24] flex items-center gap-1 font-medium font-sans"
            >
              <AlertCircle class="w-3.5 h-3.5" />
              Recruitment Needed
            </span>

            <button
              @click.stop="store.loadMetaTeam(team.id)"
              :class="[
                'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5 font-sans tracking-wide shadow-md',
                isPartyLoaded(team)
                  ? 'bg-gradient-to-r from-[#064e3b] to-[#043327] text-[#a7f3d0] border border-[#10b981]'
                  : 'btn-grimoire-gold'
              ]"
            >
              <Check v-if="isPartyLoaded(team)" class="w-3.5 h-3.5" />
              <span>{{ isPartyLoaded(team) ? 'Active Party' : 'Summon Party' }}</span>
            </button>

            <button class="text-[#8c785b] hover:text-[#d4af37] p-1">
              <ChevronUp v-if="expandedTeamId === team.id" class="w-5 h-5" />
              <ChevronDown v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Expanded Drawer Content -->
        <div
          v-if="expandedTeamId === team.id"
          class="p-5 border-t border-[#38281a] bg-[#140e0a]/80 space-y-5 animate-in fade-in duration-200"
        >
          <!-- Description Paragraph -->
          <p class="text-xs text-[#dfd1ba] leading-relaxed font-sans grimoire-inset p-4 rounded-xl">
            {{ team.description }}
          </p>

          <!-- 4 Slot Build Breakdown Matrix -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
            <div
              v-for="b in team.slotBuilds"
              :key="b.companionId"
              class="p-3.5 rounded-xl grimoire-inset flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center gap-2.5 mb-2.5">
                  <CompanionAvatar
                    v-if="getCompanion(b.companionId)"
                    :avatar="getCompanion(b.companionId)!.avatar"
                    :name="getCompanion(b.companionId)!.name"
                    :origin-type="getCompanion(b.companionId)!.originType"
                    size="sm"
                  />
                  <div>
                    <h4 class="text-xs font-bold text-[#fcedb6] truncate font-sans">
                      {{ getCompanion(b.companionId)?.name }}
                    </h4>
                    <span class="text-[10px] text-[#d4af37] font-semibold font-sans">{{ b.assignedRole }}</span>
                  </div>
                </div>

                <div class="space-y-1 text-xs text-[#c5b89a] font-sans">
                  <p><span class="text-[#8c785b] font-semibold font-sans text-[10px]">Split:</span> {{ b.classSplit }}</p>
                  <p><span class="text-[#8c785b] font-semibold font-sans text-[10px]">Feat:</span> {{ b.coreFeat }}</p>
                  <p><span class="text-[#8c785b] font-semibold font-sans text-[10px]">Key Gear:</span> {{ b.keyGear }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Turn-by-Turn Sequencing Guide -->
          <div class="p-5 rounded-xl grimoire-inset">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-3 flex items-center gap-2 font-sans">
              <Layers class="w-4 h-4" />
              Round 1 Tactical Turn Sequencing
            </h4>
            <ol class="space-y-2 text-xs text-[#dfd1ba] font-sans">
              <li
                v-for="(turn, idx) in team.turnSequencing"
                :key="idx"
                class="flex items-start gap-2.5"
              >
                <span class="text-[#d4af37] font-bold shrink-0 font-sans">{{ idx + 1 }}.</span>
                <span>{{ turn }}</span>
              </li>
            </ol>
          </div>

          <!-- Act Milestones & Key Power Spikes -->
          <div class="p-5 rounded-xl grimoire-inset">
            <h4 class="text-xs font-bold uppercase tracking-wider text-[#d4af37] mb-3 flex items-center gap-2 font-sans">
              <ShieldCheck class="w-4 h-4" />
              Campaign Progression Milestones
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3.5 text-xs">
              <div
                v-for="ms in team.progressionMilestones"
                :key="ms.act"
                class="p-3.5 rounded-lg bg-[#18110b] border border-[#3d2c1d]"
              >
                <span class="text-[10px] font-bold text-[#e6ca65] uppercase block mb-1 font-sans">{{ ms.act }}</span>
                <p class="font-semibold text-[#fcedb6] font-sans text-xs">{{ ms.objective }}</p>
                <p class="text-xs text-[#c5b89a] mt-1.5 font-sans">{{ ms.impact }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
