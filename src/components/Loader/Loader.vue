<script setup lang="ts">
import type { Slot } from 'vue'
import { AvIcon, MDI_ICONS } from '@avenirs-esr/avenirs-dsav'

export type LoaderColor = 'primary' | 'accent' | 'success' | 'info' | 'warn' | 'error' | 'neutral'
export type LoaderSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '4xl'

export interface LoaderProps {
  color?: LoaderColor
  size?: LoaderSize
  isLoading?: boolean
}

const {
  color = 'primary',
  size = 'md',
} = defineProps<LoaderProps>()

defineSlots<{
  default?: Slot
}>()

const colorVariableMap: Record<LoaderColor, string> = {
  primary: 'var(--dark-background-primary1)',
  accent: 'var(--dark-background-accent)',
  success: 'var(--dark-background-success)',
  info: 'var(--dark-background-info)',
  warn: 'var(--dark-background-warn)',
  error: 'var(--dark-background-error)',
  neutral: 'var(--dark-background-neutral)',
}

const sizeMap: Record<LoaderSize, number> = {
  'xs': 1,
  'sm': 1.5,
  'md': 2,
  'lg': 2.5,
  'xl': 3,
  '2xl': 4,
  '4xl': 5,
}

const loaderColor = computed(() => colorVariableMap[color])
const loaderSize = computed(() => sizeMap[size])
</script>

<template>
  <div
    v-if="isLoading"
    v-bind="$attrs"
    class="loader av-row av-justify-center av-p-xs"
  >
    <AvIcon
      animation="spin"
      :name="MDI_ICONS.LOADING"
      :size="loaderSize"
      :color="loaderColor"
    />
  </div>
  <slot v-else>
    <div data-testid="loader-slot-alt" />
  </slot>
</template>
