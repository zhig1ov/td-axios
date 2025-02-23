import { v1 } from "uuid"
import { Todolist } from "../api/todolistsApi.types"
import { Dispatch } from "redux"
import { RootState } from "../../../app/store"
import { todolistsApi } from "../api/todolistsApi"
import { tasksApi } from "../api/tasksApi"
import { addTaskAC } from "./tasks-reducer"

export type FilterValuesType = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValuesType
}

const initialState: DomainTodolist[] = []

export const todolistsReducer = (state: DomainTodolist[] = initialState, action: ActionsType): DomainTodolist[] => {
  switch (action.type) {
    case "SET-TODOLISTS": {
      return action.todolists.map(tl => ({ ...tl, filter: 'all' }))
    }

    case "REMOVE-TODOLIST": {
      return state.filter((tl) => tl.id !== action.payload.id)
    }

    case "ADD-TODOLIST": {
      const newTodolist: DomainTodolist = {
        id: action.payload.todolist.id,
        title: action.payload.todolist.title,
        filter: "all",
        addedDate: action.payload.todolist.addedDate,
        order: 0,
      }
      return [newTodolist, ...state]
    }

    case "CHANGE-TODOLIST-TITLE": {
      return state.map((tl) => (tl.id === action.payload.id ? { ...tl, title: action.payload.title } : tl))
    }

    case "CHANGE-TODOLIST-FILTER": {
      return state.map((tl) => (tl.id === action.payload.id ? { ...tl, filter: action.payload.filter } : tl))
    }

    default:
      return state
  }
}

// Action creators
export const removeTodolistAC = (id: string) => {
  return { type: "REMOVE-TODOLIST", payload: { id } } as const
}

export const addTodolistAC = (todolist: Todolist) => {
  return { type: "ADD-TODOLIST", payload: { todolist } } as const
}

export const changeTodolistTitleAC = (payload: { id: string; title: string }) => {
  return { type: "CHANGE-TODOLIST-TITLE", payload } as const
}

export const changeTodolistFilterAC = (payload: { id: string; filter: FilterValuesType }) => {
  return { type: "CHANGE-TODOLIST-FILTER", payload } as const
}

export const setTodolistsAC = (todolists: Todolist[]) => {
  return { type: "SET-TODOLISTS", todolists } as const
}

// Thunk creators

export const fetchTodolistsThunk = (dispatch: Dispatch, getState: () => RootState)=> {
  todolistsApi.getTodolists().then((res) => {
    dispatch(setTodolistsAC(res.data))
  })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  todolistsApi.createTodolist(title).then((res) => {
    dispatch(addTodolistAC(res.data.data.item))
  })
}

export const removeTodolistTC = (id: string) => (dispatch: Dispatch) => {
  todolistsApi.deleteTodolist(id).then((res) => {
    dispatch(removeTodolistAC(id))
  })
}

export const updateTodolistTitleTC =
  (arg: { id: string; title: string }) => (dispatch: Dispatch) => {
    todolistsApi.updateTodolist(arg).then((res) => {
      dispatch(changeTodolistTitleAC(arg))
    })
  }

// Actions types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>

type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType
  | SetTodolistActionType
