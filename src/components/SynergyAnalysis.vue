<script setup lang="ts">
import { computed } from 'vue';
import { useTeamStore } from '../stores/teamStore';
import {
  Sparkles,
  AlertTriangle,
  Flame,
  Zap,
  Moon,
  Smile,
  Lock,
  Layers,
  HeartPulse,
  Award
} from 'lucide-vue-next';

const store = useTeamStore();
const report = computed(() => store.synergyReport);

const scoreColor = computed(() => {
  if (report.value.score >= 90) return 'text-emerald-400 border-emerald-500/40 bg-emerald-500/10';
  if (report.value.score >= 75) return 'text-amber-300 border-amber-500/40 bg-amber-500/10';
  if (report.value.score >= 55) return 'text-orange-400 border-orange-500/40 bg-orange-500/10';
  return 'text-rose-400 border-rose-500/40 bg-rose-500/10';
});
</script>

<template>
  <div class="bg-slate-900/90 rounded-2xl border border-slate-800 p-6 shadow-2xl backdrop-blur-md space-y-6">
    <!-- Header with Overall Honor Mode Viability Score -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-5 border-b border-slate-800">
      <div>
        <div class="flex items-center gap-2">
          <Zap class="w-5 h-5 text-amber-400" />
          <h2 class="text-xl font-bold font-serif text-slate-100 tracking-wide">
            Tactical Synergy & Honor Mode Engine
          </h2>
        </div>
        <p class="text-xs text-slate-400 mt-1">
          Real-time dynamic analysis of crowd control DC, resting economy, damage vulnerability loops, and skill proficiencies.
        </p>
      </div>

      <!-- Overall Score Badge -->
      <div :class="['px-4 py-2 rounded-2xl border flex items-center gap-3', scoreColor]">
        <Award class="w-6 h-6 shrink-0" />
        <div>
          <div class="flex items-baseline gap-1">
            <span class="text-2xl font-black">{{ report.score }}</span>
            <span class="text-xs text-slate-400">/ 100</span>
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider block">
            {{ report.partyCompositionHealth }} Composition
          </span>
        </div>
      </div>
    </div>

    <!-- Core Check Matrix: Face, Lockpicker, Sustain, Resting Viability -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      <!-- Party Face -->
      <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
        <Smile :class="['w-5 h-5', report.hasFace ? 'text-emerald-400' : 'text-slate-600']" />
        <div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Dialogue Face</span>
          <span :class="['text-xs font-bold', report.hasFace ? 'text-emerald-300' : 'text-rose-400']">
            {{ report.hasFace ? 'Persuasion Ready' : 'Missing CHA Face' }}
          </span>
        </div>
      </div>

      <!-- Lockpicker & Traps -->
      <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
        <Lock :class="['w-5 h-5', report.hasLockpicker ? 'text-emerald-400' : 'text-slate-600']" />
        <div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Sleight of Hand</span>
          <span :class="['text-xs font-bold', report.hasLockpicker ? 'text-emerald-300' : 'text-rose-400']">
            {{ report.hasLockpicker ? 'DC 30 Ready' : 'No Roguish Utility' }}
          </span>
        </div>
      </div>

      <!-- Sustain & Healing -->
      <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
        <HeartPulse :class="['w-5 h-5', report.hasSustain ? 'text-emerald-400' : 'text-slate-600']" />
        <div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Healing & Wards</span>
          <span :class="['text-xs font-bold', report.hasSustain ? 'text-emerald-300' : 'text-amber-400']">
            {{ report.hasSustain ? 'Sustain Secured' : 'No Primary Healer' }}
          </span>
        </div>
      </div>

      <!-- Resting Economy -->
      <div class="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center gap-3">
        <Moon class="w-5 h-5 text-amber-400" />
        <div>
          <span class="text-[10px] font-bold text-slate-500 uppercase tracking-wider block">Resting Economy</span>
          <span class="text-xs font-bold text-amber-300">
            {{ report.restingViability }} ({{ report.shortRestAdvantageCount }} Short Rests)
          </span>
        </div>
      </div>
    </div>

    <!-- Detected S-Tier / A-Tier Combat Synergies -->
    <div class="bg-slate-950/80 rounded-xl border border-slate-800 p-4">
      <div class="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
        <div class="flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-amber-400" />
          <h3 class="text-xs font-bold uppercase tracking-wider text-slate-200">
            Detected Honor Mode Synergies ({{ report.detectedSynergies.length }})
          </h3>
        </div>
        <span class="text-[10px] text-slate-400">Calculated across equipped abilities and status interactions</span>
      </div>

      <div v-if="report.detectedSynergies.length === 0" class="text-xs text-slate-500 italic py-2">
        No registered meta synergy loops detected yet. Try assigning complementary characters (e.g. Shadowheart + Storm Sorcerer Durge, or Tavern Brawler Karlach + Astarion).
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="syn in report.detectedSynergies"
          :key="syn.title"
          class="p-3 rounded-lg bg-slate-900 border border-slate-800 flex flex-col justify-between"
        >
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-bold text-amber-300">{{ syn.title }}</span>
              <span class="px-1.5 py-0.5 text-[9px] font-bold rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                {{ syn.tier }}
              </span>
            </div>
            <p class="text-[11px] text-slate-400 mt-1 leading-relaxed">{{ syn.description }}</p>
          </div>

          <div class="mt-2.5 pt-2 border-t border-slate-800/80 flex items-center gap-1.5 text-[10px] text-slate-400">
            <span class="font-semibold text-slate-500">Enabling Heroes:</span>
            <span class="text-slate-300 font-medium">{{ syn.membersInvolved.join(', ') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Critical Gaps & Tactical Warnings -->
    <div v-if="report.criticalWarnings.length > 0" class="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30">
      <div class="flex items-center gap-2 text-rose-300 text-xs font-bold mb-2">
        <AlertTriangle class="w-4 h-4 shrink-0" />
        <span>Tactical Composition Vulnerabilities</span>
      </div>
      <ul class="space-y-1.5 text-xs text-rose-200/90 list-disc list-inside">
        <li v-for="warn in report.criticalWarnings" :key="warn">{{ warn }}</li>
      </ul>
    </div>

    <!-- Tactical Advice & Damage Coverage Matrix -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Tactical Master Advice -->
      <div class="lg:col-span-7 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
          <Layers class="w-4 h-4 text-amber-400" />
          Tactical Execution Notes
        </h3>
        <ul v-if="report.tacticalAdvice.length > 0" class="space-y-1.5 text-xs text-slate-400">
          <li v-for="adv in report.tacticalAdvice" :key="adv" class="flex items-start gap-2">
            <span class="text-amber-400 shrink-0 font-bold">•</span>
            <span>{{ adv }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-slate-500 italic">
          Balanced composition. Follow standard round 1 high-initiative alpha strikes.
        </p>
      </div>

      <!-- Damage Type Coverage Matrix -->
      <div class="lg:col-span-5 bg-slate-950/70 p-4 rounded-xl border border-slate-800">
        <h3 class="text-xs font-bold uppercase tracking-wider text-slate-300 mb-2 flex items-center gap-2">
          <Flame class="w-4 h-4 text-amber-400" />
          Damage Type Coverage
        </h3>
        <div class="flex flex-wrap gap-1.5">
          <span
            v-for="dt in report.damageTypesCovered"
            :key="dt"
            class="px-2 py-0.5 text-[10px] font-semibold rounded bg-slate-900 border border-slate-700 text-slate-200"
          >
            {{ dt }}
          </span>
        </div>

        <div v-if="report.missingCrucialDamageTypes.length > 0" class="mt-3 pt-2 border-t border-slate-800/80">
          <span class="text-[10px] text-amber-400/90 font-medium block">
            Missing Damage Elements: {{ report.missingCrucialDamageTypes.join('; ') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
