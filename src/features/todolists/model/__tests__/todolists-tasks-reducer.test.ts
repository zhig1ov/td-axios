import { tasksReducer, TasksStateType } from "../tasks-reducer"
import { addTodolistAC, todolistsReducer, DomainTodolist } from "../todolists-reducer"

test("ids should be equals", () => {
  const startTasksState: TasksStateType = {}
  const startTodolistsState: DomainTodolist[] = []

  const newTodolist = {
    id: 'todolistId3',
    title: "New Todolist",
    filter: "all",
    addedDate: '',
    order: 0,
  }

  const action = addTodolistAC(newTodolist)

  const endTasksState = tasksReducer(startTasksState, action)
  const endTodolistsState = todolistsReducer(startTodolistsState, action)

  const keys = Object.keys(endTasksState)
  const idFromTasks = keys[0]
  const idFromTodolists = endTodolistsState[0].id

  expect(idFromTasks).toBe(action.payload.todolist.id)
  expect(idFromTodolists).toBe(action.payload.todolist.id)
})
