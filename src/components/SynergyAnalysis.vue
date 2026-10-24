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
  Award,
  Eye
} from 'lucide-vue-next';

const store = useTeamStore();
const report = computed(() => store.synergyReport);

const scoreColor = computed(() => {
  if (report.value.score >= 90) return 'text-[#6ee7b7] border-[#10b981] bg-gradient-to-b from-[#064e3b]/70 to-[#032e23]/90 shadow-emerald-950/50';
  if (report.value.score >= 75) return 'text-[#fde68a] border-[#d4af37] bg-gradient-to-b from-[#78350f]/70 to-[#451a03]/90 shadow-amber-950/50';
  if (report.value.score >= 55) return 'text-[#fed7aa] border-[#d97706] bg-gradient-to-b from-[#431407]/70 to-[#270b04]/90 shadow-orange-950/50';
  return 'text-[#fca5a5] border-[#dc2626] bg-gradient-to-b from-[#450a0a]/70 to-[#250505]/90 shadow-rose-950/50';
});
</script>

<template>
  <div class="grimoire-card rounded-2xl p-6 relative overflow-hidden space-y-6">
    <!-- Corner Filigree Ornaments -->
    <div class="absolute top-2 left-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
    <div class="absolute top-2 right-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
    <div class="absolute bottom-2 left-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>
    <div class="absolute bottom-2 right-2 text-[#8c6d37] text-xs pointer-events-none opacity-70">❖</div>

    <!-- Header with Overall Honor Mode Viability Score -->
    <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 pb-5 border-b border-[#443221]">
      <div>
        <div class="flex items-center gap-2.5">
          <Zap class="w-5 h-5 text-[#d4af37]" />
          <h2 class="text-xl font-bold font-['Cinzel'] text-[#fcedb6] tracking-wide">
            Party Synergy Diagnostics & Honor Mode Compliance
          </h2>
        </div>
        <p class="text-xs text-[#b5a07e] font-sans mt-1">
          Quantitative tactical metrics: Turn 1 initiative spread, item contention detection, concentration slots, and <span class="text-[#fcedb6] font-semibold font-sans">{{ report.difficultyRules.name }}</span> difficulty rules.
        </p>
      </div>

      <!-- Overall Score Seal -->
      <div :class="['px-5 py-2.5 rounded-2xl border-2 flex items-center gap-3.5 shadow-xl', scoreColor]">
        <Award class="w-7 h-7 shrink-0 text-[#d4af37]" />
        <div>
          <div class="flex items-baseline gap-1">
            <span class="text-3xl font-black font-sans tracking-tight">{{ report.score }}</span>
            <span class="text-xs text-[#c5b89a] font-sans">/ 100</span>
          </div>
          <span class="text-[10px] font-bold uppercase tracking-wider block font-sans">
            {{ report.partyCompositionHealth }} Composition
          </span>
        </div>
      </div>
    </div>

    <!-- ITEM CONTENTION WARNING BANNER -->
    <div
      v-if="report.itemContentions && report.itemContentions.length > 0"
      class="p-4 rounded-xl bg-gradient-to-r from-[#451a03]/80 via-[#271004]/90 to-[#180a02] border-2 border-[#f59e0b]/80 shadow-lg"
    >
      <div class="flex items-center justify-between gap-2 mb-2.5">
        <div class="flex items-center gap-2 text-[#fbbf24] text-xs font-bold font-sans tracking-wide">
          <AlertTriangle class="w-4 h-4 shrink-0 text-[#f59e0b]" />
          <span>Unique Item Contention Detected ({{ report.itemContentions.length }} Conflicts)</span>
        </div>
        <span class="text-[10px] text-[#fde68a] font-sans px-2 py-0.5 rounded bg-[#78350f]/60 border border-[#b45309]">
          Single Campaign Copy
        </span>
      </div>

      <div class="space-y-2 text-xs">
        <div
          v-for="item in report.itemContentions"
          :key="item.itemName"
          class="p-2.5 rounded-lg bg-[#140b05] border border-[#78350f] flex flex-col sm:flex-row sm:items-center justify-between gap-2"
        >
          <div class="flex items-center gap-2">
            <span class="font-bold text-[#fcedb6] font-sans">{{ item.itemName }}</span>
            <span class="text-[10px] text-[#8c785b] uppercase font-sans">({{ item.itemSlot }})</span>
            <span class="text-[#fca5a5] text-[11px] font-sans">
              Contenders: {{ item.conflictingMembers.map(m => m.companionName).join(' & ') }}
            </span>
          </div>
          <p class="text-[11px] text-[#e2d6b5] font-sans italic">
            {{ item.resolutionSuggestion }}
          </p>
        </div>
      </div>
    </div>

    <!-- TACTICAL HUD: TURN 1 INITIATIVE READINESS & CONCENTRATION ALLOCATION -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-4">
      <!-- Turn 1 Initiative Readiness -->
      <div class="lg:col-span-7 p-4 rounded-xl grimoire-inset flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <div class="flex items-center gap-2">
              <Zap class="w-4 h-4 text-[#d4af37]" />
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#fcedb6] font-sans">
                Turn 1 Initiative Readiness (1d4 Die Mechanics)
              </h3>
            </div>
            <span
              :class="[
                'text-[10px] font-bold px-2 py-0.5 rounded border font-sans',
                report.initiativeAnalysis.turn1DominanceTier.includes('Guaranteed')
                  ? 'bg-[#064e3b] text-[#a7f3d0] border-[#10b981]'
                  : 'bg-[#78350f] text-[#fde68a] border-[#f59e0b]'
              ]"
            >
              {{ report.initiativeAnalysis.turn1DominanceTier }}
            </span>
          </div>

          <div class="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <div
              v-for="init in report.initiativeAnalysis.initiativeList"
              :key="init.companionName"
              class="p-2 rounded bg-[#18110b] border border-[#3d2c1d] flex flex-col gap-0.5"
            >
              <span class="text-[11px] font-bold text-[#fcedb6] font-sans truncate">{{ init.companionName }}</span>
              <span class="text-sm font-black text-[#d4af37] font-sans">+{{ init.totalBonus }} Init</span>
              <span class="text-[9px] text-[#8c785b] font-sans truncate">{{ init.breakdown }}</span>
            </div>
          </div>
        </div>

        <p class="text-[11px] text-[#c5b89a] font-sans mt-3 pt-2 border-t border-[#38281a]">
          {{ report.initiativeAnalysis.d4RollSpread }}. Flat initiative bonuses reliably secure round 1 boss turn-denial in Honor Mode.
        </p>
      </div>

      <!-- Concentration Slot Allocation Tracker -->
      <div class="lg:col-span-5 p-4 rounded-xl grimoire-inset flex flex-col justify-between">
        <div>
          <div class="flex items-center justify-between gap-2 mb-3">
            <div class="flex items-center gap-2">
              <Eye class="w-4 h-4 text-[#d4af37]" />
              <h3 class="text-xs font-bold uppercase tracking-wider text-[#fcedb6] font-sans">
                Concentration Slots
              </h3>
            </div>
            <span
              :class="[
                'text-[10px] font-bold px-2 py-0.5 rounded border font-sans',
                report.concentrationAnalysis.saturationTier.includes('Optimal')
                  ? 'bg-[#064e3b] text-[#a7f3d0] border-[#10b981]'
                  : 'bg-[#450a0a] text-[#fca5a5] border-[#b91c1c]'
              ]"
            >
              {{ report.concentrationAnalysis.saturationTier }}
            </span>
          </div>

          <div class="space-y-1.5 text-xs">
            <div
              v-for="spell in report.concentrationAnalysis.competingSpells"
              :key="spell.companionName"
              class="p-1.5 rounded bg-[#18110b] border border-[#3d2c1d] flex items-center justify-between gap-2"
            >
              <span class="text-[11px] font-bold text-[#fcedb6] font-sans truncate">{{ spell.companionName }}</span>
              <span class="text-[10px] text-[#e6ca65] font-sans truncate">{{ spell.spellName }}</span>
            </div>
          </div>
        </div>

        <p v-if="report.concentrationAnalysis.conflictWarning" class="text-[10px] text-[#fca5a5] font-sans mt-2">
          {{ report.concentrationAnalysis.conflictWarning }}
        </p>
        <p v-else class="text-[11px] text-[#a7f3d0] font-sans mt-2">
          Concentration load safely balanced across party members.
        </p>
      </div>
    </div>

    <!-- Core Check Matrix: Face, Lockpicker, Sustain, Resting Viability -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
      <!-- Party Face -->
      <div class="p-4 rounded-xl grimoire-inset flex items-center gap-3.5">
        <Smile :class="['w-5 h-5 shrink-0', report.hasFace ? 'text-[#34d399]' : 'text-[#8c785b]']" />
        <div>
          <span class="text-[10px] font-bold text-[#8c785b] uppercase tracking-wider block font-sans">Dialogue Face</span>
          <span :class="['text-xs font-bold font-sans', report.hasFace ? 'text-[#6ee7b7]' : 'text-[#f87171]']">
            {{ report.hasFace ? 'Persuasion Ready' : 'Missing CHA Face' }}
          </span>
        </div>
      </div>

      <!-- Lockpicker & Traps -->
      <div class="p-4 rounded-xl grimoire-inset flex items-center gap-3.5">
        <Lock :class="['w-5 h-5 shrink-0', report.hasLockpicker ? 'text-[#34d399]' : 'text-[#8c785b]']" />
        <div>
          <span class="text-[10px] font-bold text-[#8c785b] uppercase tracking-wider block font-sans">Sleight of Hand</span>
          <span :class="['text-xs font-bold font-sans', report.hasLockpicker ? 'text-[#6ee7b7]' : 'text-[#f87171]']">
            {{ report.hasLockpicker ? 'DC 30 Ready' : 'No Roguish Utility' }}
          </span>
        </div>
      </div>

      <!-- Sustain & Healing -->
      <div class="p-4 rounded-xl grimoire-inset flex items-center gap-3.5">
        <HeartPulse :class="['w-5 h-5 shrink-0', report.hasSustain ? 'text-[#34d399]' : 'text-[#8c785b]']" />
        <div>
          <span class="text-[10px] font-bold text-[#8c785b] uppercase tracking-wider block font-sans">Healing & Wards</span>
          <span :class="['text-xs font-bold font-sans', report.hasSustain ? 'text-[#6ee7b7]' : 'text-[#f59e0b]']">
            {{ report.hasSustain ? 'Sustain Secured' : 'No Primary Healer' }}
          </span>
        </div>
      </div>

      <!-- Resting Economy -->
      <div class="p-4 rounded-xl grimoire-inset flex items-center gap-3.5">
        <Moon class="w-5 h-5 text-[#d4af37] shrink-0" />
        <div>
          <span class="text-[10px] font-bold text-[#8c785b] uppercase tracking-wider block font-sans">Resting Economy</span>
          <span class="text-xs font-bold text-[#e6ca65] font-sans">
            {{ report.restingViability }} ({{ report.shortRestAdvantageCount }} Short Rests)
          </span>
        </div>
      </div>
    </div>

    <!-- Detected S-Tier / A-Tier Combat Synergies -->
    <div class="grimoire-inset rounded-xl p-5">
      <div class="flex items-center justify-between pb-3.5 border-b border-[#38281a] mb-4">
        <div class="flex items-center gap-2">
          <Sparkles class="w-4 h-4 text-[#d4af37]" />
          <h3 class="text-xs font-bold uppercase tracking-wider text-[#fcedb6] font-sans">
            Detected Combat Synergies ({{ report.detectedSynergies.length }})
          </h3>
        </div>
        <span class="text-[10px] text-[#8c785b] font-sans italic">
          Calculated across equipped abilities and condition loops
        </span>
      </div>

      <div v-if="report.detectedSynergies.length === 0" class="text-xs text-[#a89476] font-sans italic py-3">
        No registered meta synergy loops detected yet. Assign complementary heroes (e.g. Shadowheart + Storm Sorcerer Durge, or Tavern Brawler Karlach + Astarion).
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-3.5">
        <div
          v-for="syn in report.detectedSynergies"
          :key="syn.title"
          class="p-4 rounded-xl bg-gradient-to-b from-[#1c140e] to-[#140e0a] border border-[#443221] flex flex-col justify-between shadow-md"
        >
          <div>
            <div class="flex items-center justify-between gap-2">
              <span class="text-xs font-bold text-[#fcedb6] font-sans">{{ syn.title }}</span>
              <span class="px-2 py-0.5 text-[9px] font-bold rounded bg-gradient-to-r from-[#d4af37]/20 to-[#aa8524]/30 text-[#fcedb6] border border-[#d4af37]/50 font-sans">
                {{ syn.tier }}
              </span>
            </div>
            <p class="text-xs text-[#c5b89a] mt-2 leading-relaxed font-sans">{{ syn.description }}</p>
          </div>

          <div class="mt-3.5 pt-2.5 border-t border-[#332417] flex items-center gap-2 text-[11px] text-[#8c785b] font-sans">
            <span class="font-semibold text-[#c5a059] font-sans text-[10px]">Enabling Heroes:</span>
            <span class="text-[#f4ebd9] font-medium">{{ syn.membersInvolved.join(', ') }}</span>
          </div>
        </div>
      </div>
    </div>

    <!-- Critical Gaps & Tactical Warnings -->
    <div v-if="report.criticalWarnings.length > 0" class="p-5 rounded-xl bg-gradient-to-b from-[#380e0e]/70 to-[#1f0707]/80 border-2 border-[#b91c1c]/70 shadow-lg shadow-black/60">
      <div class="flex items-center gap-2.5 text-[#fca5a5] text-xs font-bold mb-3 font-sans tracking-wide">
        <AlertTriangle class="w-4 h-4 shrink-0 text-[#ef4444]" />
        <span>Tactical Composition Vulnerabilities</span>
      </div>
      <ul class="space-y-2 text-xs text-[#fee2e2] font-sans list-disc list-inside">
        <li v-for="warn in report.criticalWarnings" :key="warn">{{ warn }}</li>
      </ul>
    </div>

    <!-- Tactical Advice & Damage Coverage Matrix -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-5">
      <!-- Tactical Master Advice -->
      <div class="lg:col-span-7 grimoire-inset p-5 rounded-xl">
        <h3 class="text-xs font-bold uppercase tracking-wider text-[#fcedb6] mb-3 flex items-center gap-2 font-sans">
          <Layers class="w-4 h-4 text-[#d4af37]" />
          Tactical Execution Notes
        </h3>
        <ul v-if="report.tacticalAdvice.length > 0" class="space-y-2 text-xs text-[#c5b89a] font-sans">
          <li v-for="adv in report.tacticalAdvice" :key="adv" class="flex items-start gap-2.5">
            <span class="text-[#d4af37] shrink-0 font-bold font-sans">✦</span>
            <span>{{ adv }}</span>
          </li>
        </ul>
        <p v-else class="text-xs text-[#8c785b] font-sans italic">
          Balanced composition. Follow standard round 1 high initiative alpha strikes.
        </p>
      </div>

      <!-- Damage Type Coverage Matrix -->
      <div class="lg:col-span-5 grimoire-inset p-5 rounded-xl">
        <h3 class="text-xs font-bold uppercase tracking-wider text-[#fcedb6] mb-3 flex items-center gap-2 font-sans">
          <Flame class="w-4 h-4 text-[#d4af37]" />
          Damage Type Coverage
        </h3>
        <div class="flex flex-wrap gap-2">
          <span
            v-for="dt in report.damageTypesCovered"
            :key="dt"
            class="px-2.5 py-1 text-[10px] font-bold rounded bg-[#18110b] border border-[#443221] text-[#f4ebd9] font-sans"
          >
            {{ dt }}
          </span>
        </div>

        <div v-if="report.missingCrucialDamageTypes.length > 0" class="mt-4 pt-3 border-t border-[#38281a]">
          <span class="text-[11px] text-[#fde68a] font-sans block">
            Missing Damage Elements: {{ report.missingCrucialDamageTypes.join('; ') }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>
