import { changeAppStatusAC } from "../../../app/app-reducer"
import { LoginArgs } from "../api/authApi.types"
import { Dispatch } from "redux"
import { authApi } from "../api/authApi"
import { ResultCode } from "common/enums"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { clearTodolistData } from "../../todolists/model/todolists-reducer"

type InitialStateType = typeof initialState

const initialState = {
  isLoggedIn: false,
  isInitialized: false,
}

export const authReducer = (state: InitialStateType = initialState, action: ActionsType): InitialStateType => {
  switch (action.type) {
    case "SET_IS_LOGGED_IN":
      return { ...state, isLoggedIn: action.payload.isLoggedIn }
    case "SET_IS_INITIALIZED":
      return { ...state, isInitialized: action.payload.isInitialized }
    default:
      return state
  }
}
// Action creators
const setIsInitializedAC  = (isInitialized: boolean) => {
  return { type: "SET_IS_INITIALIZED", payload: { isInitialized } } as const
}

const setIsLoggedInAC = (isLoggedIn: boolean) => {
  return { type: "SET_IS_LOGGED_IN", payload: { isLoggedIn } } as const
}

// Actions types
type setIsInitializedActionType = ReturnType<typeof setIsInitializedAC>
type setIsLoggedInActionType = ReturnType<typeof setIsLoggedInAC>
type ActionsType = setIsInitializedActionType | setIsLoggedInActionType

// thunks
export const loginTC = (data: LoginArgs) => (dispatch: Dispatch) => {
  dispatch(changeAppStatusAC("loading"))
  authApi
    .login(data)
    .then((res) => {
    if (res.data.resultCode === ResultCode.Success) {
      const { token } = res.data.data
      localStorage.setItem("token", token)
      dispatch(setIsLoggedInAC(true))
      dispatch(changeAppStatusAC('succeeded'))

    } else {
      handleServerAppError(res.data, dispatch)
    }
  })
    .catch((error) => {
      handleServerNetworkError(error,dispatch)
  })
}

export const logoutTC = () => (dispatch: Dispatch) => {
  dispatch(changeAppStatusAC("loading"))
  authApi
    .logout()
    .then((res) => {
    if (res.data.resultCode === ResultCode.Success) {
      dispatch(setIsLoggedInAC(false))
      dispatch(changeAppStatusAC('succeeded'))
      localStorage.removeItem("token")
      dispatch(clearTodolistData())
    } else {
      handleServerAppError(res.data, dispatch)
    }
  })
    .catch((error) => {
      handleServerNetworkError(error,dispatch)
    })
}

export const initializeAppTC = () => (dispatch: Dispatch) => {
  dispatch(changeAppStatusAC("loading"))
  authApi
    .me()
    .then((res) => {
      if (res.data.resultCode === ResultCode.Success) {
        dispatch(changeAppStatusAC("succeeded"))
        dispatch(setIsLoggedInAC(true))
      } else {
        handleServerAppError(res.data, dispatch)
      }
    })
    .catch((error) => {
      handleServerNetworkError(error, dispatch)
    })
    .finally(() => {
      dispatch(setIsInitializedAC(true))
    })
}
