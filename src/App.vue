<script setup lang="ts">
import MainLayout from '@/layouts/MainLayout/MainLayout.vue'
import { useToasterStore } from '@/store'
import { AvToaster } from '@avenirs-esr/avenirs-dsav'

const toasterStore = useToasterStore()
const { messages } = storeToRefs(toasterStore)
const { removeMessage } = toasterStore
</script>

<template>
  <MainLayout />
  <AvToaster
    :messages="messages"
    :on-remove-message="removeMessage"
  />
</template>
