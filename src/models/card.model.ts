export interface IScrumCard {
  id: string
  task_responsible_person: string
  task_description: string
}

export interface IFormAddTask {
  id: string
  responsiblePerson: string
  taskDescription: string
}
export type Status =
  | 'statusBacklog'
  | 'statusTodo'
  | 'statusWorking'
  | 'statusTesting'
  | 'statusCompleted'

export interface IScrumData {
  statusBacklog: IScrumCard[]
  statusTodo: IScrumCard[]
  statusWorking: IScrumCard[]
  statusTesting: IScrumCard[]
  statusCompleted: IScrumCard[]
}
