<template>
  <div class="board-control mt-8 d-flex justify-center">
    <v-btn size="extra-large" class="px-4" variant="outlined" @click="$emit('openModalAdd')"
      >Добавить задачу</v-btn
    >
    <v-text-field
      class="board-control__search flex-grow-0 ml-6"
      label="Поиск по задачам"
      prepend-inner-icon="mdi-magnify"
      hide-details="auto"
      @input="(e) => changeFilterText(e.target.value)"
      >{{ filterText }}</v-text-field
    >
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useCardsScrumBoard } from '@/store/cardsScrumBoard'

const cardsScrumBoard = useCardsScrumBoard()
cardsScrumBoard.fakeFetchScrumBoardData()

let filterText = ref('')

function changeFilterText(newFilterText: string) {
  cardsScrumBoard.changeFilterText(newFilterText.toLowerCase())
}
</script>
<style lang="scss" scoped>
.board-control {
  &__search {
    width: 400px;
  }
}
</style>
