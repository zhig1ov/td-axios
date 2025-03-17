import { LoginArgs } from "../api/authApi.types"
import { authApi } from "../api/authApi"
import { ResultCode } from "common/enums"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { createSlice } from "@reduxjs/toolkit"
import { createSliceWithThunks } from "common/utils/createSliceWithThunks"
import { setAppStatus } from "../../../app/app-reducer"

export const authSlice = createSliceWithThunks({
  name: "auth",
  initialState: {
    isLoggedIn: false,
    isInitialized: false,
  },
  selectors: {
    selectIsLoggedIn: state => state.isLoggedIn,
    selectIsInitialized: state => state.isInitialized
  },
  reducers: (create) => {
    const createAThunk = create.asyncThunk.withTypes<{ rejectValue: null }>()

    return {
      initializeApp: createAThunk(
        async (_, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await authApi.me()
            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({ status: "succeeded" }))
              return { isLoggedIn: true }
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
          },
          settled: (state) => {
            state.isInitialized = true
          },
        },
      ),
      login: createAThunk(
        async (data: LoginArgs, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await authApi.login(data)
            if (res.data.resultCode === ResultCode.Success) {
              const { token } = res.data.data
              localStorage.setItem("token", token)
              dispatch(setAppStatus({ status: "succeeded" }))
              return { isLoggedIn: true }
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
          },
        },
      ),
      logout: createAThunk(
        async (_, { dispatch, rejectWithValue }) => {
          try {
            dispatch(setAppStatus({ status: "loading" }))
            const res = await authApi.logout()
            if (res.data.resultCode === ResultCode.Success) {
              localStorage.removeItem("token")
              dispatch(setAppStatus({ status: "succeeded" }))
              return { isLoggedIn: false }
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.isLoggedIn = action.payload.isLoggedIn
          },
        },
      ),
    }
  },
})

export const authSlice1 = createSlice({
  name: 'auth',
  initialState: {
    isLoggedIn: false,
    isInitialized: false,
  },
  selectors: {
    selectIsLoggedIn: state => state.isLoggedIn,
    selectIsInitialized: state => state.isInitialized
  },
  reducers: create =>({
    setLoggedqIn: create.reducer<{isLoggedIn: boolean}>((state,action) => {
      state.isLoggedIn = action.payload.isLoggedIn
    }),
    setIsInitialized: create.reducer<{isInitialized: boolean}>((state, action) => {
      state.isInitialized = action.payload.isInitialized
    })
  })
})

export const { login,logout, initializeApp } = authSlice.actions

export const authReducer = authSlice.reducer

// thunks
// export const loginTC = (data: LoginArgs) => (dispatch: Dispatch) => {
//   dispatch(changeAppStatusAC("loading"))
//   authApi
//     .login(data)
//     .then((res) => {
//     if (res.data.resultCode === ResultCode.Success) {
//       const { token } = res.data.data
//       localStorage.setItem("token", token)
//       dispatch(setIsLoggedInAC(true))
//       dispatch(changeAppStatusAC('succeeded'))
//
//     } else {
//       handleServerAppError(res.data, dispatch)
//     }
//   })
//     .catch((error) => {
//       handleServerNetworkError(error,dispatch)
//   })
// }

// export const logoutTC = () => (dispatch: Dispatch) => {
//   dispatch(changeAppStatusAC("loading"))
//   authApi
//     .logout()
//     .then((res) => {
//     if (res.data.resultCode === ResultCode.Success) {
//       dispatch(setIsLoggedInAC(false))
//       dispatch(changeAppStatusAC('succeeded'))
//       localStorage.removeItem("token")
//       dispatch(clearTodolistData())
//     } else {
//       handleServerAppError(res.data, dispatch)
//     }
//   })
//     .catch((error) => {
//       handleServerNetworkError(error,dispatch)
//     })
// }
//
// export const initializeAppTC = () => (dispatch: Dispatch) => {
//   dispatch(changeAppStatusAC("loading"))
//   authApi
//     .me()
//     .then((res) => {
//       if (res.data.resultCode === ResultCode.Success) {
//         dispatch(changeAppStatusAC("succeeded"))
//         dispatch(setIsLoggedInAC(true))
//       } else {
//         handleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch((error) => {
//       handleServerNetworkError(error, dispatch)
//     })
//     .finally(() => {
//       dispatch(setIsInitializedAC(true))
//     })
// }
