import Container from "@mui/material/Container"
import Grid from "@mui/material/Unstable_Grid2"
import React, { useEffect } from "react"
import { AddItemForm } from "common/components"
import { Todolists } from "../features/todolists/ui/Todolists/Todolists"
import { useAppDispatch } from "common/hooks"
import { useNavigate } from "react-router"
import { Path } from "common/routing/routing"
import { authSlice } from "../features/auth/model/auth-reducer"
import { addTodolist } from "../features/todolists/model/todolists-reducer"

export const Main = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isLoggedIn = authSlice.selectors.selectIsLoggedIn

  useEffect(() => {
    if (!isLoggedIn) {
      navigate(Path.Login)
    }
  }, [isLoggedIn])

  const addTodolistHandler = (title: string) => {
    dispatch(addTodolist(title))
  }

  return (
    <Container fixed>
      <Grid container sx={{ mb: "30px" }}>
        <AddItemForm addItem={addTodolistHandler} />
      </Grid>

      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
