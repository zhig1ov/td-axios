import { tasksReducer, tasksSlice } from "../features/todolists/model/tasks-reducer"
import { todolistsReducer, todolistsSlice } from "../features/todolists/model/todolists-reducer"
import { appReducer, appSlice } from "./app-reducer"
import { authReducer, authSlice } from "../features/auth/model/auth-reducer"
import { configureStore } from "@reduxjs/toolkit"

const rootReducer = {
  [tasksSlice.name]: tasksReducer,
  [todolistsSlice.name]: todolistsReducer,
  [appSlice.name]: appReducer,
  [authSlice.name]: authReducer,
}

export const store = configureStore({reducer: rootReducer})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch

// @ts-ignore
window.store = store
