import { addTodolist, removeTodolist } from "./todolists-reducer"
import { tasksApi } from "../api/tasksApi"
import { DomainTask, UpdateTaskModel } from "../api/tasksApi.types"
import { ResultCode, TaskPriority, TaskStatus } from "common/enums"
import { RootState } from "../../../app/store"
import { setAppError, setAppStatus } from "../../../app/app-reducer"
import { handleServerAppError } from "common/utils/handleServerAppError"
import { handleServerNetworkError } from "common/utils/handleServerNetworkError"
import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit"
import { logout } from "../../auth/model/auth-reducer"

export type TasksStateType = {
  [key: string]: DomainTask[]
}

export type UpdateTaskDomainModel = {
  title?: string
  description?: string
  status?: TaskStatus
  priority?: TaskPriority
  startDate?: string
  deadline?: string
}

const createSliceWithThunks = buildCreateSlice({creators: {asyncThunk: asyncThunkCreator}})

export const tasksSlice = createSliceWithThunks({
  name: 'tasks',
  initialState: {} as TasksStateType,
  selectors: {
    selectTasks: state => state.tasks
  },
  reducers: create => {
    const createAThunk = create.asyncThunk.withTypes<{rejectValue: null}>()

    return {
      fetchTasks: createAThunk(
        async (todolistId: string, {dispatch, rejectWithValue}) => {
          try {
            dispatch(setAppStatus({status: 'loading'}))
            const res = await tasksApi.getTasks(todolistId)
            dispatch(setAppStatus({status: 'succeeded'}))
            return { todolistId, tasks: res.data.items }
          } catch (error) {
            handleServerNetworkError(error, dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            state[action.payload.todolistId] = action.payload.tasks
          },
        }
      ),
      updateTask: createAThunk(
        async (
          arg: { taskId: string; todolistId: string; domainModel: UpdateTaskDomainModel },
          {dispatch, rejectWithValue, getState}
        )=> {
          try {
            const { taskId, todolistId, domainModel } = arg

            const allTasksFromState = (getState() as RootState).tasks
            const tasksForCurrentTodolist = allTasksFromState[todolistId]
            const task = tasksForCurrentTodolist.find(t => t.id === taskId)

            if (!task) {
              dispatch(setAppError({error: 'Task not found'}))
              return rejectWithValue(null)
            }

            const model: UpdateTaskModel = {
              status: task.status,
              title: task.title,
              deadline: task.deadline,
              description: task.description,
              priority: task.priority,
              startDate: task.startDate,
              ...domainModel
            }

            dispatch((setAppStatus({status: 'loading'})))

            const res = await tasksApi.updateTask({ taskId, todolistId, model })

            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({status: 'succeeded'}))
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
          fulfilled: (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = tasks.findIndex(t => t.id === action.payload.taskId)
            if (index !== -1) {
              tasks[index] = {...tasks[index], ...action.payload.domainModel}
            }
          }
        }
      ),
      removeTask: createAThunk(
        async (
          arg: {todolistId: string, taskId: string},
          {dispatch, rejectWithValue}
        ) => {
          try {
            dispatch((setAppStatus({ status: 'loading' })))

            const res = await tasksApi.deleteTask(arg)

            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({status: 'succeeded'}))
              return arg
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error,dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            const tasks = state[action.payload.todolistId]
            const index = state[action.payload.todolistId].findIndex(t => t.id !== action.payload.taskId)
            if (index !== -1) {
              tasks.splice(index, 1)
            }
          }
        }
      ),
      addTask: createAThunk(
        async (arg: {todolistId: string, title: string}, {dispatch, rejectWithValue}) => {
          try {
            const {todolistId} = arg
            dispatch((setAppStatus({ status: 'loading' })))

            const res = await tasksApi.createTask(arg)

            if (res.data.resultCode === ResultCode.Success) {
              dispatch(setAppStatus({status: 'succeeded'}))
              return {todolistId, task: res.data.data.item}
            } else {
              handleServerAppError(res.data, dispatch)
              return rejectWithValue(null)
            }
          } catch (error) {
            handleServerNetworkError(error,dispatch)
            return rejectWithValue(null)
          }
        },
        {
          fulfilled: (state, action) => {
            const tasks = state[action.payload.task.todoListId]
            tasks.unshift(action.payload.task)
          }
        },
      ),
      clearTasks: create.reducer(() => {
        return {}
      })
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(addTodolist.fulfilled, (state, action) => {
        state[action.payload.todolist.id] = []
      })
      .addCase(removeTodolist.fulfilled, (state,action) => {
        delete state[action.payload.id]
      })
      .addCase(logout.fulfilled, (state, action) => {
        return {}
      })
  }
})


// export const tasksSlice1 = createSlice({
//   name: 'tasks',
//   initialState: {} as TasksStateType,
//   reducers: create => ({
//     setTasks: create.reducer<{ todolistId: string, tasks: DomainTask[] }>((state,action) => {
//       state[action.payload.todolistId] = action.payload.tasks
//     }),
//     removeTasks: create.reducer<{ taskId: string; todolistId: string }>((state, action) => {
//       const tasks = state[action.payload.todolistId]
//       const index = state[action.payload.todolistId].findIndex(t => t.id !== action.payload.taskId)
//       if (index !== -1) {
//         tasks.splice(index, 1)
//       }
//     }),
//     addTask: create.reducer<{ task: DomainTask }>((state, action) => {
//       const tasks = state[action.payload.task.todoListId]
//       tasks.unshift(action.payload.task)
//     }),
//     updateTask: create.reducer<{
//       taskId: string,
//       domainModel: UpdateTaskDomainModel,
//       todolistId: string
//     }>((state, action) => {
//       const tasks = state[action.payload.todolistId]
//       const index = tasks.findIndex(t => t.id === action.payload.taskId)
//       if (index !== -1) {
//         tasks[index]= {...tasks[index], ...action.payload.domainModel}
//       }
//     }),
//     clearTasks: create.reducer(() => {
//       return {}
//     })
//   }),
//   extraReducers: builder => {
//     builder
//       .addCase(addTodolist, (state, action) => {
//         state[action.payload.todolist.id] = []
//       })
//       .addCase(removeTodolist, (state,action) => {
//         delete state[action.payload.id]
//       })
//       .addCase(fetchTasks.fulfilled, (state, action) => {
//         state[action.payload.todolistId] = action.payload.tasks
//       })
//       .addCase(fetchTasks.rejected, (state, action) => {
//         // state.error = action.payload.error.message
//       })
//   }
// })

export const {addTask, clearTasks, removeTask, updateTask, fetchTasks} = tasksSlice.actions
export const tasksReducer = tasksSlice.reducer

// export const fetchTasks = createAppAsyncThunk<
//   { todolistId: string; tasks: DomainTask[] },
//   string
// >(
//   `${tasksSlice.name}/fetchTasks`,
//   async (todolistId: string, thunkAPI) => {
//     const dispatch = thunkAPI.dispatch
//     try {
//       dispatch(setAppStatus({status: 'loading'}))
//       const res = await tasksApi.getTasks(todolistId)
//       dispatch(setAppStatus({status: 'succeeded'}))
//       return { todolistId, tasks: res.data.items }
//     } catch (error) {
//       handleServerNetworkError(error,dispatch)
//       return thunkAPI.rejectWithValue(null)
//     }
//   }
// )

// export const removeTaskTC = (arg: {todolistId: string, taskId: string}) => (dispatch: Dispatch) => {
//   dispatch(changeAppStatusAC('loading'))
//   tasksApi.deleteTask(arg).then((res) => {
//       if (res.data.resultCode === ResultCode.Success) {
//         dispatch(removeTaskAC(arg))
//         dispatch(changeAppStatusAC('succeeded'))
//       } else {
//         handleServerAppError(res.data, dispatch)
//       }
//     })
//     .catch((error) => {
//     handleServerNetworkError(error,dispatch)
//   })
// }
//
// export const addTaskTC = (arg: {todolistId: string, title: string}) => (dispatch: Dispatch) => {
//   dispatch(changeAppStatusAC('loading'))
//   tasksApi.createTask(arg).then((res) => {
//     if (res.data.resultCode === ResultCode.Success) {
//       dispatch(addTaskAC({ task: res.data.data.item }))
//       dispatch(changeAppStatusAC('succeeded'))
//     } else {
//       handleServerAppError(res.data, dispatch)
//     }
//   })
//     .catch((error) => {
//     handleServerNetworkError(error,dispatch)
//   })
// }
//
// export const updateTaskTC =
//   (arg: { taskId: string; todolistId: string; domainModel: UpdateTaskDomainModel }) =>
//     (dispatch: Dispatch, getState: () => RootState) => {
//
//       const { taskId, todolistId } = arg
//
//       const allTasksFromState = getState().tasks
//       const tasksForCurrentTodolist = allTasksFromState[todolistId]
//       const task = tasksForCurrentTodolist.find(t => t.id === taskId)
//       if(task) {
//         const status = arg.domainModel.status !== undefined ? arg.domainModel.status : task.status
//         const title = arg.domainModel.title || task.title || ''
//         const model: UpdateTaskModel = {
//           status,
//           title,
//           deadline: task.deadline,
//           description: task.description,
//           priority: task.priority,
//           startDate: task.startDate,
//         }
//         dispatch(changeAppStatusAC('loading'))
//         tasksApi.updateTask({todolistId,taskId, model}).then((res) => {
//           if (res.data.resultCode === ResultCode.Success) {
//             dispatch(changeAppStatusAC('succeeded'))
//             dispatch(updateTaskAC({taskId, todolistId, domainModel: model}))
//           } else {
//             handleServerAppError(res.data, dispatch)
//           }
//         })
//           .catch(error => {
//             handleServerNetworkError(error,dispatch)
//         })
//       }
//     }
//
// // Actions types
//
// type ActionsType = any