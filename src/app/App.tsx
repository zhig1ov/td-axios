import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import React, { useEffect } from "react"
import { ErrorSnackbar, Header } from "common/components"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { selectThemeMode } from "./appSelectors"
import { Main } from "./Main"
import { fetchTodolistsTC } from "../features/todolists/model/todolists-reducer"
import { initializeAppTC } from "../features/auth/model/auth-reducer"
import { selectIsInitialized } from "../features/auth/model/authSelectors"
import { CircularProgress } from "@mui/material"
import s from "./App.module.css"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const isInitialized = useAppSelector(selectIsInitialized)

  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(initializeAppTC())
    dispatch(fetchTodolistsTC)
  }, [])

  if (!isInitialized) {
    return (
      <div className={s.circularProgressContainer}>
        <CircularProgress size={150} thickness={3} />
      </div>
    )
  }

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      <Header />
      <Main />
      <ErrorSnackbar />
    </ThemeProvider>
  )
}
