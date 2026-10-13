# QuerySuspense

Composant de suspension pour les requêtes TanStack Query. Gère les états de chargement, d'erreur et de liste vide de façon déclarative.

## Utilisation avec TanStack Query

```vue
<script setup lang="ts">
import { QuerySuspense } from '@/components'
import { useMyQuery } from '@/queries/use-my.query/use-my.query'

const { data, error, isLoading } = useMyQuery()
const isEmpty = computed(() => !data.value?.length)
</script>

<template>
  <QuerySuspense
    :error="error"
    :is-loading="isLoading"
    :is-empty="isEmpty"
  >
    <MyList :items="data" />
  </QuerySuspense>
</template>
```

## Props

| Prop | Type | Défaut | Description |
|------|------|--------|-------------|
| `isEmpty` | `boolean` | `undefined` | Liste vide après le chargement |
| `isLoading` | `boolean` | `false` | Affiche le spinner pendant le chargement |
| `error` | `BaseApiException \| null` | `null` | Erreur retournée par la query |
| `errorTitle` | `string` | `"Une erreur est survenue lors du chargement des données"` | Titre du message d'erreur |
| `errorDescription` | `string` | `"Veuillez réessayer plus tard."` | Description du message d'erreur |
| `emptyStateMessage` | `string` | `"Aucune donnée à afficher"` | Message de l'état vide |

## Slots

| Slot | Description |
|------|-------------|
| `default` | Contenu affiché quand il n'y a pas d'erreur et que la liste n'est pas vide |
| `error` | Remplace le `ErrorMessage` par défaut |
| `empty` | Remplace le `EmptyState` par défaut |

## Personnalisation des slots

```vue
<QuerySuspense :error="error" :is-loading="isLoading" :is-empty="isEmpty">
  <template #error>
    <MonErreurPersonnalisee />
  </template>
  <template #empty>
    <MonEtatVidePersonnalise />
  </template>
  <MaListe :items="data" />
</QuerySuspense>
```
