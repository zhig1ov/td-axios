import {
  addTaskAC,
  updateTaskAC,
  removeTaskAC,
  tasksReducer,
  TasksStateType,
} from "../tasks-reducer"
import { addTodolistAC, removeTodolistAC } from "../todolists-reducer"
import { DomainTask, UpdateTaskModel } from "../../api/tasksApi.types"

let startState: TasksStateType

beforeEach(() => {
  startState = {
    todolistId1: [
      { id: "1", title: "CSS", status: 0, todoListId: 'todolistId1', addedDate: '', order: 0, deadline: '', startDate: '', description: '', priority: 0},
      { id: "2", title: "JS", status: 2, todoListId: 'todolistId1', addedDate: '', order: 1, deadline: '', startDate: '', description: '', priority: 0 },
      { id: "3", title: "React", status: 0, todoListId: 'todolistId1', addedDate: '', order: 2, deadline: '', startDate: '', description: '', priority: 0 },
    ],
    todolistId2: [
      { id: "1", title: "bread", status: 0, todoListId: 'todolistId2', addedDate: '', order: 0, deadline: '', startDate: '', description: '', priority: 0 },
      { id: "2", title: "milk", status: 2, todoListId: 'todolistId2', addedDate: '', order: 0, deadline: '', startDate: '', description: '', priority: 0 },
      { id: "3", title: "tea", status: 0, todoListId: 'todolistId2', addedDate: '', order: 0, deadline: '', startDate: '', description: '', priority: 0 },
    ],
  }
})

test("correct task should be deleted from correct array", () => {
  const endState = tasksReducer(
    startState,
    removeTaskAC({
      taskId: "2",
      todolistId: "todolistId2",
    }),
  )

  expect(endState).toEqual({
    todolistId1: [
      { id: "1", title: "CSS", status: 0, todoListId: 'todolistId1', addedDate: '', order: 0, deadline: '', startDate: '', description: '', priority: 0},
      { id: "2", title: "JS", status: 2, todoListId: 'todolistId1', addedDate: '', order: 1, deadline: '', startDate: '', description: '', priority: 0 },
      { id: "3", title: "React", status: 0, todoListId: 'todolistId1', addedDate: '', order: 2, deadline: '', startDate: '', description: '', priority: 0 },
    ],
    todolistId2: [
      { id: "1", title: "bread", status: 0, todoListId: 'todolistId2', addedDate: '', order: 0, deadline: '', startDate: '', description: '', priority: 0 },
      { id: "3", title: "tea", status: 0, todoListId: 'todolistId2', addedDate: '', order: 0, deadline: '', startDate: '', description: '', priority: 0 },
    ],
  })
})

test("correct task should be added to correct array", () => {
  const model: DomainTask = { id: "4", title: "juice", status: 0, todoListId: 'todolistId2', addedDate: '', order: 0, deadline: '', startDate: '', description: '', priority: 0 }
  const endState = tasksReducer(startState, addTaskAC({task: model}))

  expect(endState["todolistId1"].length).toBe(3)
  expect(endState["todolistId2"].length).toBe(4)
  expect(endState["todolistId2"][0].id).toBeDefined()
  expect(endState["todolistId2"][0].title).toBe("juice")
  expect(endState["todolistId2"][0].status).toBe(0)
})

test("status of specified task should be changed", () => {
  const endState = tasksReducer(
    startState,
    updateTaskAC({
      taskId: "2",
      domainModel: {
        status: 0,
        title: '',
        deadline: '',
        description: '',
        priority: 0,
        startDate: '',
      },
      todolistId: "todolistId2",
    }),
  )

  expect(endState["todolistId2"][1].status).toBe(0)
  expect(endState["todolistId1"][1].status).toBe(2)
})

test("title of specified task should be changed", () => {
  const endState = tasksReducer(
    startState,
    updateTaskAC({
      taskId: "2",
      domainModel: {
        status: 2,
        title: 'coffee',
        deadline: '',
        description: '',
        priority: 0,
        startDate: '',
      },
      todolistId: "todolistId2",
    }),
  )

  expect(endState["todolistId2"][1].title).toBe("coffee")
  expect(endState["todolistId1"][1].title).toBe("JS")
})

test("new array should be added when new todolist is added", () => {
  const newTodolist = {
    id: 'todolistId3',
    title: "New Todolist",
    filter: "all",
    addedDate: '',
    order: 0,
  }

  const endState = tasksReducer(startState, addTodolistAC(newTodolist))

  const keys = Object.keys(endState)
  const newKey = keys.find((k) => k !== "todolistId1" && k !== "todolistId2")
  if (!newKey) {
    throw Error("new key should be added")
  }

  expect(keys.length).toBe(3)
  expect(endState[newKey]).toEqual([])
})

test("property with todolistId should be deleted", () => {
  const endState = tasksReducer(startState, removeTodolistAC("todolistId2"))

  const keys = Object.keys(endState)

  expect(keys.length).toBe(1)
  expect(endState["todolistId2"]).not.toBeDefined()
  // or
  expect(endState["todolistId2"]).toBeUndefined()
})
