import { BaseResponse } from "common/types"
import { Dispatch } from "redux"
import { setErrorAC, changeAppStatusAC } from "../../app/app-reducer"

export const handleServerAppError = <T>(data: BaseResponse<T>, dispatch: Dispatch) => {
  if (data.messages.length) {
    dispatch(setErrorAC(data.messages[0]))
  } else {
    dispatch(setErrorAC("Some error occurred"))
  }
  dispatch(changeAppStatusAC("failed"))
}
