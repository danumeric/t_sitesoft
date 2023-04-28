import { mockScrumBoardData } from '@/mocks/mockScrumBoardData'
import { IScrumCard, Status, IFormAddTask, IScrumData } from '@/models/card.model'

import { defineStore } from 'pinia'
import { reactive, ref } from 'vue'

export const useCardsScrumBoard = defineStore({
  id: 'cardsScrumBoard',
  state: () => {
    return {
      statuses: [
        'statusBacklog',
        'statusTodo',
        'statusWorking',
        'statusTesting',
        'statusCompleted',
      ] as Status[],

      filterText: ref(''),

      tasks: reactive({
        statusBacklog: reactive([]) as IScrumCard[],
        statusTodo: reactive([]) as IScrumCard[],
        statusWorking: reactive([]) as IScrumCard[],
        statusTesting: reactive([]) as IScrumCard[],
        statusCompleted: reactive([]) as IScrumCard[],
      }) as IScrumData,

      filteredTasks: reactive({
        statusBacklog: reactive([]) as IScrumCard[],
        statusTodo: reactive([]) as IScrumCard[],
        statusWorking: reactive([]) as IScrumCard[],
        statusTesting: reactive([]) as IScrumCard[],
        statusCompleted: reactive([]) as IScrumCard[],
      }) as IScrumData,
    }
  },
  getters: {
    getFilteredTasks: (state): IScrumData => {
      if (state.filterText === '') return state.tasks
      for (const property in state.tasks as IScrumData) {
        state.filteredTasks[property as Status] = state.tasks[property as Status].filter((t) =>
          t.task_description.toLowerCase().includes(state.filterText)
        )
      }
      return state.filteredTasks
    },
  },

  actions: {
    fakeFetchScrumBoardData() {
      const storageData = sessionStorage.getItem('scrumBoard')
      if (storageData !== null) {
        this.tasks = JSON.parse(storageData)
        return
      }

      this.tasks = JSON.parse(JSON.stringify(mockScrumBoardData))
      this.updateSessionStorage()
    },

    addScrumBoardTask(newTask: IFormAddTask) {
      this.tasks.statusTodo.push({
        id: newTask.id,
        task_responsible_person: newTask.responsiblePerson,
        task_description: newTask.taskDescription,
      })
      this.updateSessionStorage()
    },

    removeScrumBoardTask(status: Status, oldDraggableIndex: number) {
      this.tasks[status].splice(oldDraggableIndex, 1)
      this.updateSessionStorage()
    },

    changeStatusScrumBoardTask(
      newStatus: Status,
      newDraggableIndex: number,
      oldStatus: Status,
      oldDraggableIndex: number
    ) {
      this.tasks[newStatus].splice(newDraggableIndex, 0, this.tasks[oldStatus][oldDraggableIndex])
    },

    moveScrumBoardTask(status: Status, oldIndex: number, newIndex: number) {
      const movingTask = this.tasks[status].splice(oldIndex, 1)[0]
      this.tasks[status].splice(newIndex, 0, movingTask)
      this.updateSessionStorage()
    },

    updateScrumBoardTask(status: Status, id: number, formAddTask: IFormAddTask) {
      const editedTask: IScrumCard = this.tasks[status].splice(id, 1)[0]
      editedTask.task_responsible_person = formAddTask.responsiblePerson
      editedTask.task_description = formAddTask.taskDescription
      this.tasks[status].splice(id, 0, editedTask)
      this.updateSessionStorage()
    },

    changeFilterText(newFilterText: string) {
      this.filterText = newFilterText
    },

    updateSessionStorage() {
      sessionStorage.scrumBoard = JSON.stringify(this.tasks)
    },
  },
})
