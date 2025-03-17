import { Todolist } from "../api/todolistsApi.types"
import { todolistsApi } from "../api/todolistsApi"
import { RequestStatus, setAppStatus } from "../../../app/app-reducer"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { ResultCode } from "common/enums"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit"
import { logout } from "../../auth/model/auth-reducer"

export type FilterValuesType = "all" | "active" | "completed"

export type DomainTodolist = Todolist & {
  filter: FilterValuesType
  entityStatus: RequestStatus
}

const createSliceWithThunks = buildCreateSlice({ creators: { asyncThunk: asyncThunkCreator } })

export const todolistsSlice = createSliceWithThunks({
  name: 'todolists',
  initialState: [] as DomainTodolist[],
  reducers: (create) => {
    const createAThunk = create.asyncThunk.withTypes<{rejectValue: null }>()

    return {
      fetchTodolists: createAThunk(
        async (_, {dispatch, rejectWithValue}) => {
          try {
            dispatch(setAppStatus({status: 'loading'}))

            const res = await todolistsApi.getTodolists()
            dispatch(setAppStatus({status: 'succeeded' }))
            return {todolists: res.data}

          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
             return action.payload.todolists.map(tl => ({ ...tl, filter: 'all' , entityStatus: "idle"}))
          }
        }
      ),
      addTodolist: createAThunk(
        async (title: string, {dispatch, rejectWithValue})=> {
          try {
            dispatch(setAppStatus({status: 'loading'}))

            const res = await todolistsApi.createTodolist(title)

            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({status: 'succeeded' }))
              return {todolist: res.data.data.item}
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state.unshift({...action.payload.todolist, filter: 'all', entityStatus: 'idle'})
          },
        },
      ) ,
      updateTodolistTitle: createAThunk(
        async (arg: { id: string; title: string }, {dispatch, rejectWithValue}) => {
          try {
            dispatch(setAppStatus({status: 'loading'}))

            const res = await todolistsApi.updateTodolist(arg)

            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({status: 'succeeded' }))
              return arg
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state,action) => {
            const index = state.findIndex(td => td.id === action.payload.id)
            if (index !== -1) {
              state[index].title = action.payload.title
            }
          }
        }
      ),
      removeTodolist: createAThunk(
        async (id: string, {dispatch, rejectWithValue}) => {
          try {
            dispatch(setAppStatus({status: 'loading'}))

            const res = await todolistsApi.deleteTodolist(id)

            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({status: 'succeeded' }))
              return {id}
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            const index = state.findIndex(td => td.id === action.payload.id)
            if (index !== -1) {
              state.splice(index, 1)
            }
          }
        }
      ),
      clearTodolists: create.reducer(() => {
        return []
      })
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(logout.fulfilled, () => {
        return []
      })
  }
})

export const {removeTodolist, addTodolist, updateTodolistTitle, clearTodolists, fetchTodolists} = todolistsSlice.actions
export const todolistsReducer = todolistsSlice.reducer

