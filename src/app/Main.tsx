import Container from "@mui/material/Container"
import Grid from "@mui/material/Unstable_Grid2"
import React, { useEffect } from "react"
import { AddItemForm } from "common/components"
import { addTodolistTC } from "../features/todolists/model/todolists-reducer"
import { Todolists } from "../features/todolists/ui/Todolists/Todolists"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { useNavigate } from "react-router"
import { selectIsLoggedIn } from "../features/auth/model/authSelectors"
import { Path } from "common/routing/routing"

export const Main = () => {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)

  useEffect(() => {
    if(!isLoggedIn) {
      navigate(Path.Login)
    }
  }, [isLoggedIn])

  const addTodolist = (title: string) => {
    dispatch(addTodolistTC(title))
  }

  return (
    <Container fixed>
      <Grid container sx={{ mb: "30px" }}>
        <AddItemForm addItem={addTodolist} />
      </Grid>

      <Grid container spacing={4}>
        <Todolists />
      </Grid>
    </Container>
  )
}
