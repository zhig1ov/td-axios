import { tasksReducer, tasksSlice } from "../features/todolists/model/tasks-reducer"
import { todolistsReducer, todolistsSlice } from "../features/todolists/model/todolists-reducer"
import { appReducer, appSlice } from "./app-reducer"
import { authReducer, authSlice } from "../features/auth/model/auth-reducer"
import { configureStore } from "@reduxjs/toolkit"
import { baseApi } from "./baseApi"

const rootReducer = {
  [tasksSlice.name]: tasksReducer,
  [todolistsSlice.name]: todolistsReducer,
  [appSlice.name]: appReducer,
  [authSlice.name]: authReducer,
  [baseApi.reducerPath]: baseApi.reducer
}

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => getDefaultMiddleware().concat(baseApi.middleware)
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// @ts-ignore
window.store = store
