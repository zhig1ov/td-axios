import { Todolist } from "../api/todolistsApi.types"
import { Dispatch } from "redux"
import { RootState } from "../../../app/store"
import { todolistsApi } from "../api/todolistsApi"
import { changeAppStatusAC, RequestStatus } from "../../../app/app-reducer"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { ResultCode } from "common/enums"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { removeTaskAC } from "./tasks-reducer"

export type FilterValuesType = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValuesType
  entityStatus: RequestStatus
}

const initialState: DomainTodolist[] = []

export const todolistsReducer = (state: DomainTodolist[] = initialState, action: ActionsType): DomainTodolist[] => {
  switch (action.type) {
    case "SET-TODOLISTS": {
      return action.todolists.map(tl => ({ ...tl, filter: 'all' , entityStatus: "idle"}))
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
        entityStatus: "idle"
      }
      return [newTodolist, ...state]
    }

    case "CHANGE-TODOLIST-TITLE": {
      return state.map((tl) => (tl.id === action.payload.id ? { ...tl, title: action.payload.title } : tl))
    }

    case "CHANGE-TODOLIST-FILTER": {
      return state.map((tl) => (tl.id === action.payload.id ? { ...tl, filter: action.payload.filter } : tl))
    }

    case "CHANGE-TODOLIST-ENTITY-STATUS":
      return state.map(tl => tl.id === action.payload.id ? { ...tl, entityStatus: action.payload.entityStatus } : tl)
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

export const setTodolistEntityStatusAC = (payload: {id: string, entityStatus: RequestStatus}) => {
  return { type: "CHANGE-TODOLIST-ENTITY-STATUS", payload } as const
}

// Thunk creators

export const fetchTodolistsThunk = (dispatch: Dispatch, getState: () => RootState)=> {
  dispatch(changeAppStatusAC('loading'))
  todolistsApi.getTodolists().then((res) => {
    dispatch(changeAppStatusAC('succeeded'))
    dispatch(setTodolistsAC(res.data))
  })
}

export const addTodolistTC = (title: string) => (dispatch: Dispatch) => {
  dispatch(changeAppStatusAC('loading'))
  todolistsApi.createTodolist(title).then((res) => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(changeAppStatusAC('succeeded'))
      dispatch(addTodolistAC(res.data.data.item))
    } else {
      handleServerAppError(res.data, dispatch)
    }
  })
    .catch((error) => {
      handleServerNetworkError(error,dispatch)
    })
}

export const removeTodolistTC = (id: string) => (dispatch: Dispatch) => {
  dispatch(changeAppStatusAC('loading'))
  dispatch(setTodolistEntityStatusAC({id, entityStatus: 'loading'}))
  todolistsApi.deleteTodolist(id).then((res) => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(changeAppStatusAC('succeeded'))
      dispatch(removeTodolistAC(id))
    } else {
      handleServerAppError(res.data, dispatch)
      dispatch(setTodolistEntityStatusAC({id, entityStatus: 'failed'}))
    }
  })
    .catch((error) => {
      handleServerNetworkError(error,dispatch)
      dispatch(setTodolistEntityStatusAC({id, entityStatus: 'failed'}))
    })
}

export const updateTodolistTitleTC =
  (arg: { id: string; title: string }) => (dispatch: Dispatch) => {
    dispatch(changeAppStatusAC('loading'))
    todolistsApi.updateTodolist(arg).then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(changeAppStatusAC('succeeded'))
        dispatch(changeTodolistTitleAC(arg))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
      .catch((error) => {
        handleServerNetworkError(error,dispatch)
      })
  }

// Actions types
export type RemoveTodolistActionType = ReturnType<typeof removeTodolistAC>
export type AddTodolistActionType = ReturnType<typeof addTodolistAC>
export type ChangeTodolistTitleActionType = ReturnType<typeof changeTodolistTitleAC>
export type ChangeTodolistFilterActionType = ReturnType<typeof changeTodolistFilterAC>
export type SetTodolistActionType = ReturnType<typeof setTodolistsAC>
export type SetTodolistEntityStatusActionType = ReturnType<typeof setTodolistEntityStatusAC>

type ActionsType =
  | RemoveTodolistActionType
  | AddTodolistActionType
  | ChangeTodolistTitleActionType
  | ChangeTodolistFilterActionType
  | SetTodolistActionType
  | SetTodolistEntityStatusActionType
