import CssBaseline from "@mui/material/CssBaseline"
import { ThemeProvider } from "@mui/material/styles"
import React, { useEffect } from "react"
import { Header } from "common/components"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { selectThemeMode } from "./appSelectors"
import { Main } from "./Main"
import { fetchTodolistsThunk } from "../features/todolists/model/todolists-reducer"

export const App = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const dispatch = useAppDispatch()
  useEffect(() => {
    dispatch(fetchTodolistsThunk)
  }, [])

  return (
    <ThemeProvider theme={getTheme(themeMode)}>
      <CssBaseline />
      <Header />
      <Main />
    </ThemeProvider>
  )
}
