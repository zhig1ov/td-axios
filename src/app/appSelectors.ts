import { RootState } from "./store"

export const selectThemeMode = (state: RootState) => state.app.themeMode
export const selectAppStatus = (state: RootState) => state.app.status
export const selectAppError = (state: RootState) => state.app.error
