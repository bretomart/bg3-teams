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
  <div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl backdrop-blur-md">
    <!-- Header -->
    <div class="flex items-center justify-between pb-4 border-b border-slate-800">
      <div>
        <div class="flex items-center gap-2">
          <Trophy class="w-5 h-5 text-amber-400" />
          <h2 class="text-xl font-bold font-serif text-slate-100 tracking-wide">
            Verified Honor Mode Meta Parties
          </h2>
        </div>
        <p class="text-xs text-slate-400 mt-1">
          One-click party loading for community-tested Honor Mode setups with complete round-by-round turn sequencing and item milestones.
        </p>
      </div>
    </div>

    <!-- Meta Teams Accordion List -->
    <div class="space-y-4 mt-5">
      <div
        v-for="team in store.metaTeams"
        :key="team.id"
        class="rounded-xl border border-slate-800 bg-slate-950/60 overflow-hidden transition-all duration-200"
      >
        <!-- Collapsed Bar / Summary Header -->
        <div
          @click="toggleExpand(team.id)"
          class="p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 cursor-pointer hover:bg-slate-900/60 transition-colors"
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
                  class="ring-2 ring-slate-900 shadow-md"
                />
              </template>
            </div>

            <div>
              <div class="flex items-center gap-2">
                <h3 class="text-base font-bold text-slate-100">{{ team.name }}</h3>
                <span class="px-2 py-0.5 text-[9px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  {{ team.difficultyTier }}
                </span>
              </div>
              <p class="text-xs text-slate-400 mt-0.5 line-clamp-1">
                {{ team.coreSynergyConcept }}
              </p>
            </div>
          </div>

          <!-- Right: Availability & Action Button -->
          <div class="flex items-center gap-3 self-end md:self-auto">
            <span
              v-if="!areAllRecruited(team)"
              class="text-[11px] text-amber-400/80 flex items-center gap-1 font-medium"
            >
              <AlertCircle class="w-3.5 h-3.5" />
              Recruitment Needed
            </span>

            <button
              @click.stop="store.loadMetaTeam(team.id)"
              :class="[
                'px-4 py-2 text-xs font-bold rounded-xl transition-all flex items-center gap-1.5',
                isPartyLoaded(team)
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-amber-500 hover:bg-amber-400 text-slate-950 shadow-lg shadow-amber-500/20'
              ]"
            >
              <Check v-if="isPartyLoaded(team)" class="w-3.5 h-3.5" />
              <span>{{ isPartyLoaded(team) ? 'Active Party' : 'Load Party' }}</span>
            </button>

            <button class="text-slate-400 p-1">
              <ChevronUp v-if="expandedTeamId === team.id" class="w-5 h-5" />
              <ChevronDown v-else class="w-5 h-5" />
            </button>
          </div>
        </div>

        <!-- Expanded Drawer Content -->
        <div
          v-if="expandedTeamId === team.id"
          class="p-5 border-t border-slate-800/80 bg-slate-900/40 space-y-5 animate-in fade-in duration-200"
        >
          <!-- Description Paragraph -->
          <p class="text-xs text-slate-300 leading-relaxed font-sans bg-slate-950/60 p-3.5 rounded-xl border border-slate-800">
            {{ team.description }}
          </p>

          <!-- 4 Slot Build Breakdown Matrix -->
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div
              v-for="b in team.slotBuilds"
              :key="b.companionId"
              class="p-3 rounded-xl bg-slate-950 border border-slate-800 flex flex-col justify-between"
            >
              <div>
                <div class="flex items-center gap-2 mb-2">
                  <CompanionAvatar
                    v-if="getCompanion(b.companionId)"
                    :avatar="getCompanion(b.companionId)!.avatar"
                    :name="getCompanion(b.companionId)!.name"
                    :origin-type="getCompanion(b.companionId)!.originType"
                    size="sm"
                  />
                  <div>
                    <h4 class="text-xs font-bold text-slate-200 truncate">
                      {{ getCompanion(b.companionId)?.name }}
                    </h4>
                    <span class="text-[10px] text-amber-400 font-semibold">{{ b.assignedRole }}</span>
                  </div>
                </div>

                <div class="space-y-1 text-[11px] text-slate-300">
                  <p><span class="text-slate-500 font-semibold">Split:</span> {{ b.classSplit }}</p>
                  <p><span class="text-slate-500 font-semibold">Feat:</span> {{ b.coreFeat }}</p>
                  <p><span class="text-slate-500 font-semibold">Key Gear:</span> {{ b.keyGear }}</p>
                </div>
              </div>
            </div>
          </div>

          <!-- Turn-by-Turn Sequencing Guide -->
          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <h4 class="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <Layers class="w-3.5 h-3.5" />
              Round 1 Tactical Turn Sequencing
            </h4>
            <ol class="space-y-1.5 text-xs text-slate-300">
              <li
                v-for="(turn, idx) in team.turnSequencing"
                :key="idx"
                class="flex items-start gap-2"
              >
                <span class="text-amber-400 font-bold shrink-0">{{ idx + 1 }}.</span>
                <span>{{ turn }}</span>
              </li>
            </ol>
          </div>

          <!-- Act Milestones & Key Power Spikes -->
          <div class="p-4 rounded-xl bg-slate-950/80 border border-slate-800">
            <h4 class="text-xs font-bold uppercase tracking-wider text-amber-400 mb-2 flex items-center gap-1.5">
              <ShieldCheck class="w-3.5 h-3.5" />
              Campaign Progression Milestones
            </h4>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div
                v-for="ms in team.progressionMilestones"
                :key="ms.act"
                class="p-2.5 rounded-lg bg-slate-900 border border-slate-800"
              >
                <span class="text-[10px] font-bold text-amber-400 uppercase block mb-0.5">{{ ms.act }}</span>
                <p class="font-semibold text-slate-200">{{ ms.objective }}</p>
                <p class="text-[11px] text-slate-400 mt-1">{{ ms.impact }}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
