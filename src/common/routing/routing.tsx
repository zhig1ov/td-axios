import { Route, Routes } from "react-router"
import { App } from "../../app/App"
import { Login } from "../../features/auth/ui/Login/Login"
import { Page404 } from "common/components"

export const Path = {
  Main: "/",
  Login: "/login",
  NotFound: "*",
} as const

export const Routing = () => {
  return (
    <Routes>
      <Route path={Path.Main} element={<App />}></Route>
      <Route path={Path.Login} element={<Login />}></Route>
      <Route path={Path.NotFound} element={<Page404 />}></Route>
    </Routes>
  )
}