import { AddTodolistActionType, RemoveTodolistActionType } from "./todolists-reducer"
import { Dispatch } from "redux"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskModel } from "../api/tasksApi.types"
import { ResultCode, TaskPriority, TaskStatus } from "common/enums"
import { RootState } from "../../../app/store"
import { changeAppStatusAC } from "../../../app/app-reducer"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"

export type TasksStateType = {
  [key: string]: DomainTask[]
}

export type UpdateTaskDomainModel = {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  startDate?: string
  deadline?: string
}

const initialState: TasksStateType = {}

export const tasksReducer = (state: TasksStateType = initialState, action: ActionsType): TasksStateType => {
  switch (action.type) {
    case "REMOVE-TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].filter((t) => t.id !== action.payload.taskId),
      }
    }

    case "ADD-TASK": {
      const newTask = action.payload.task
      return { ...state, [newTask.todoListId]: [newTask, ...state[newTask.todoListId]] }
    }

    case "UPDATE_TASK": {
      return {
        ...state,
        [action.payload.todolistId]: state[action.payload.todolistId].map((t) =>
          t.id === action.payload.taskId
            ? {
                ...t,
                ...action.payload.domainModel
              }
            : t,
        ),
      }
    }

    case "ADD-TODOLIST":
      return { ...state, [action.payload.todolist.id]: [] }

    case "REMOVE-TODOLIST": {
      let copyState = { ...state }
      delete copyState[action.payload.id]
      return copyState
    }

    case "SET_TASKS": {
      const stateCopy = { ...state }
      stateCopy[action.payload.todolistId] = action.payload.tasks
      return stateCopy
    }

    default:
      return state
  }
}

// Action creators
export const removeTaskAC = (payload: { taskId: string; todolistId: string }) => {
  return {
    type: "REMOVE-TASK",
    payload,
  } as const
}

export const addTaskAC = (payload: { task: DomainTask }) => {
  return {
    type: "ADD-TASK",
    payload,
  } as const
}

export const updateTaskAC = (payload: { taskId: string; domainModel: UpdateTaskDomainModel, todolistId: string }) => {
  return {
    type: "UPDATE_TASK",
    payload,
  } as const
}

export const setTasksAC = (payload: { todolistId: string, tasks: DomainTask[] }) => {
  return {
    type: "SET_TASKS",
    payload,
  } as const
}

export const fetchTasksTC = (todolistId: string) => (dispatch: Dispatch) => {
  dispatch(changeAppStatusAC('loading'))
  tasksApi.getTasks(todolistId).then((res) => {
    dispatch(changeAppStatusAC('succeeded'))
    const tasks = res.data.items
    dispatch(setTasksAC({todolistId, tasks}))
  })
}

export const removeTaskTC = (arg: {todolistId: string, taskId: string}) => (dispatch: Dispatch) => {
  dispatch(changeAppStatusAC('loading'))
  tasksApi.deleteTask(arg).then(() => {
    dispatch(changeAppStatusAC('succeeded'))
    dispatch(removeTaskAC(arg))
  })
}

export const addTaskTC = (arg: {todolistId: string, title: string}) => (dispatch: Dispatch) => {
  dispatch(changeAppStatusAC('loading'))
  tasksApi.createTask(arg).then((res) => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(addTaskAC({ task: res.data.data.item }))
      dispatch(changeAppStatusAC('succeeded'))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  }
  ).catch((error) => {
    handleServerNetworkError(error,dispatch)
  })
}

export const updateTaskTC =
  (arg: { taskId: string; todolistId: string; domainModel: UpdateTaskDomainModel }) =>
    (dispatch: Dispatch, getState: () => RootState) => {

      const { taskId, todolistId } = arg

      const allTasksFromState = getState().tasks
      const tasksForCurrentTodolist = allTasksFromState[todolistId]
      const task = tasksForCurrentTodolist.find(t => t.id === taskId)
      if(task) {
        const status = arg.domainModel.status !== undefined ? arg.domainModel.status : task.status
        const title = arg.domainModel.title || task.title || ''
        const model: UpdateTaskModel = {
          status,
          title,
          deadline: task.deadline,
          description: task.description,
          priority: task.priority,
          startDate: task.startDate,
        }
        dispatch(changeAppStatusAC('loading'))
        tasksApi.updateTask({todolistId,taskId, model}).then((res) => {
          if (res.data.resultCode === ResultCode.Success) {
            dispatch(changeAppStatusAC('succeeded'))
            dispatch(updateTaskAC({taskId, todolistId, domainModel: model}))
          } else {
            handleServerAppError(res.data, dispatch)
          }
        })
          .catch(error => {
            handleServerNetworkError(error,dispatch)
        })
      }
    }

// Actions types
export type RemoveTaskActionType = ReturnType<typeof removeTaskAC>
export type AddTaskActionType = ReturnType<typeof addTaskAC>
export type UpdateTaskActionType = ReturnType<typeof updateTaskAC>
export type SetTasksActionType = ReturnType<typeof setTasksAC>

type ActionsType =
  | RemoveTaskActionType
  | AddTaskActionType
  | UpdateTaskActionType
  | AddTodolistActionType
  | RemoveTodolistActionType
  | SetTasksActionType
