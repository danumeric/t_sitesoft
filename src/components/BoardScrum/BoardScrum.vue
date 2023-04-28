<template>
  <BoardScrumControl @openModalAdd="openModalAdd()" />
  <v-container>
    <v-row justify="center" class="mt-2">
      <v-col v-for="status in cardsScrumBoard.statuses" :key="`title_${status}`">
        <p class="text-h5">
          {{ statusesRu[status] }}: {{ cardsScrumBoard.getFilteredTasks[status].length }}
        </p>
      </v-col></v-row
    >

    <v-row justify="center" class="row">
      <v-col v-for="status in cardsScrumBoard.statuses" :key="status" :id="status">
        <v-card
          v-for="(taskCard, id) in cardsScrumBoard.getFilteredTasks[status]"
          :key="taskCard"
          variant="outlined"
          min-width="200"
          max-width="300"
          class="mt-3 board-card"
          :subtitle="taskCard.task_description"
          :title="taskCard.task_responsible_person"
        >
          <div class="board-card__control">
            <v-btn
              size="small"
              variant="plain"
              class="board-scrum__card-close"
              @click="editTask(status, id)"
              icon="mdi-pencil"
            ></v-btn
            ><v-btn
              size="small"
              variant="plain"
              class="board-scrum__card-btn board-scrum__card-btn_close"
              @click="removeTask(status, id)"
              icon="mdi-delete"
            ></v-btn>
          </div>
        </v-card>
      </v-col> </v-row
    ><v-dialog v-model="isModalOpen" width="auto">
      <v-card>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn @click="isModalOpen = false" icon="mdi-close"></v-btn> </v-card-actions
        ><BoardScrumAddModal :editedCard="editedCard" @closeModal="isModalOpen = false" />
      </v-card>
    </v-dialog>
  </v-container>
</template>

<script setup lang="ts">
import Sortable from 'sortablejs'
import { ref, onMounted, reactive } from 'vue'
import BoardScrumControl from '@/components/BoardScrum/BoardScrumControl.vue'
import BoardScrumAddModal from '@/components/BoardScrum/BoardScrumAddModal.vue'
import { useCardsScrumBoard } from '@/store/cardsScrumBoard'
import { Status } from '@/models/card.model'

const cardsScrumBoard = useCardsScrumBoard()
cardsScrumBoard.fakeFetchScrumBoardData()

let isModalOpen = ref(false)

let editedCard = reactive({ status: '', id: 0 })
const statusesRu = {
  statusBacklog: 'Бэклог',
  statusTodo: 'Надо сделать',
  statusWorking: 'В работе',
  statusTesting: 'Проверка',
  statusCompleted: 'Сделано',
}

onMounted(() => {
  for (let status of cardsScrumBoard.statuses) {
    let containerTasks = document.getElementById(status) as HTMLElement
    Sortable.create(containerTasks, {
      group: {
        name: 'shared1',
        pull: true,
      },
      sort: true,
      onAdd: function (evt) {
        cardsScrumBoard.changeStatusScrumBoardTask(
          evt.to.id as Status,
          evt.newDraggableIndex as number,
          evt.from.id as Status,
          evt.oldDraggableIndex as number
        )
      },

      onUpdate: function (evt) {
        cardsScrumBoard.moveScrumBoardTask(
          evt.to.id as Status,
          evt.oldIndex as number,
          evt.newIndex as number
        )
      },

      onRemove: function (evt) {
        removeTask(evt.from.id as Status, evt.oldDraggableIndex as number)
      },
    })
  }
})

function removeTask(status: Status, id: number) {
  cardsScrumBoard.removeScrumBoardTask(status, id)
}

function editTask(status: Status, id: number) {
  isModalOpen.value = true
  editedCard = { status, id }
}

function openModalAdd() {
  isModalOpen.value = true
  editedCard = { status: '', id: 0 }
}
</script>

<style lang="scss" scoped>
.board-card {
  position: relative;

  &__control {
    position: absolute;
    top: 0;
    right: 0;
  }
}
</style>
