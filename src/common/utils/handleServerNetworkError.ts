import { Dispatch } from "redux"
import { setErrorAC, changeAppStatusAC } from "../../app/app-reducer"

export const handleServerNetworkError = (error: { message: string }, dispatch: Dispatch) => {
  dispatch(setErrorAC(error.message))
  dispatch(changeAppStatusAC("failed"))
}
