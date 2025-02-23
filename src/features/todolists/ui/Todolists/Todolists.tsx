import Paper from "@mui/material/Paper"
import Grid from "@mui/material/Unstable_Grid2"
import React from "react"
import { useAppSelector } from "common/hooks"
import { selectTodolists } from "../../model/todolistsSelectors"
import { Todolist } from "./Todolist/Todolist"

export const Todolists = () => {
  const todolists = useAppSelector(selectTodolists)

  return (
    <>
      {todolists.map((tl) => {
        return (
          <Grid key={tl.id}>
            <Paper sx={{ p: "0 20px 20px 20px" }}>
              <Todolist key={tl.id} todolist={tl} />
            </Paper>
          </Grid>
        )
      })}
    </>
  )
}
