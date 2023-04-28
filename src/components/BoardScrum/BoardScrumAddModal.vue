<template>
  <v-card class="pa-3" width="300">
    <v-form ref="add_task" fast-fail @submit.prevent="onSubmit()">
      <v-text-field
        v-model="formAddTask.responsiblePerson"
        label="Исполнитель"
        :rules="rules"
      ></v-text-field>

      <v-text-field
        v-model="formAddTask.taskDescription"
        label="Описание задачи"
        :rules="rules"
      ></v-text-field>

      <v-btn type="submit" block class="mt-2">{{
        props.editedCard.status ? 'Сохранить' : 'Создать'
      }}</v-btn>
    </v-form>

    <v-divider></v-divider>
  </v-card>
</template>

<script setup lang="ts">
import { defineEmits, reactive, onMounted, defineProps } from 'vue'
import { v4 as uuidv4 } from 'uuid'
import { useCardsScrumBoard } from '@/store/cardsScrumBoard'
const cardsScrumBoard = useCardsScrumBoard()
import { IFormAddTask, Status } from '@/models/card.model'

const emit = defineEmits(['closeModal'])
const props = defineProps(['editedCard'])

let formAddTask: IFormAddTask = reactive({
  id: uuidv4(),
  responsiblePerson: '',
  taskDescription: '',
})

function onSubmit() {
  if (formAddTask.responsiblePerson && formAddTask.taskDescription) {
    if (props.editedCard.status) {
      cardsScrumBoard.updateScrumBoardTask(
        props.editedCard.status,
        props.editedCard.id,
        formAddTask
      )
      emit('closeModal')
      return
    }
    cardsScrumBoard.addScrumBoardTask(formAddTask)
    emit('closeModal')
  }
}

let rules = [
  (value: string) => {
    if (value.length > 0) return true
    return 'Поле не должно быть пустым.'
  },
]

onMounted(() => {
  if (props.editedCard.status) {
    let taskData = cardsScrumBoard.tasks[props.editedCard.status][props.editedCard.id]
    formAddTask.responsiblePerson = taskData.task_responsible_person
    formAddTask.taskDescription = taskData.task_description
    formAddTask.id = taskData.id
  }
})
</script>
