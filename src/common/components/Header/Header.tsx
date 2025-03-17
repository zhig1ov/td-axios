import MenuIcon from "@mui/icons-material/Menu"
import AppBar from "@mui/material/AppBar"
import IconButton from "@mui/material/IconButton"
import Switch from "@mui/material/Switch"
import Toolbar from "@mui/material/Toolbar"
import React from "react"
import { changeTheme } from "../../../app/app-reducer"
import { selectAppStatus, selectThemeMode } from "../../../app/appSelectors"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { MenuButton } from "common/components"
import { LinearProgress } from "@mui/material"
import { authSlice, logout } from "../../../features/auth/model/auth-reducer"
import { useNavigate } from "react-router"

export const Header = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const themeMode = useAppSelector(selectThemeMode)
  const appStatus = useAppSelector(selectAppStatus)
  const isLoggedIn = useAppSelector(authSlice.selectors.selectIsLoggedIn)

  const theme = getTheme(themeMode)

  const changeModeHandler = () => {
    dispatch(changeTheme({themeMode: themeMode === "light" ? "dark" : "light"}))
  }

  const onLogoutHandler = () => {
    dispatch(logout())
  }

  return (
    <AppBar position="static" sx={{ mb: "30px" }}>
      <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
        <IconButton color="inherit">
          <MenuIcon />
        </IconButton>
        <div>
          {isLoggedIn && <MenuButton onClick={onLogoutHandler}>Logout</MenuButton>}
          {!isLoggedIn && <MenuButton onClick={() => navigate("/login")}>Login</MenuButton>}
          <MenuButton background={theme.palette.primary.dark}>Faq</MenuButton>
          <Switch color={"default"} onChange={changeModeHandler} />
        </div>
      </Toolbar>
      {appStatus === "loading" && <LinearProgress />}
    </AppBar>
  )
}
