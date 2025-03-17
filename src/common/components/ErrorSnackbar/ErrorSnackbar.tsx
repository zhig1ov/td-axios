import { SyntheticEvent, useEffect } from "react"
import Alert from "@mui/material/Alert"
import Snackbar from "@mui/material/Snackbar"
import { selectAppError } from "../../../app/appSelectors"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { setAppError } from "../../../app/app-reducer"

export const ErrorSnackbar = () => {
  const error = useAppSelector(selectAppError)
  const dispatch = useAppDispatch()
  const handleClose = (event: SyntheticEvent | Event, reason?: string) => {
    if (reason === "clickaway") {
      return
    }
    dispatch(setAppError({error: null }))
  }

  useEffect(() => {
    setTimeout(handleClose, 3000)
  },[])

  return (
    <Snackbar open={error !== null} autoHideDuration={6000} onClose={handleClose}>
      <Alert onClose={handleClose} severity="error" variant="filled" sx={{ width: "100%" }}>
        {error}
      </Alert>
    </Snackbar>
  )
}
