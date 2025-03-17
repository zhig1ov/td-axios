import DeleteIcon from "@mui/icons-material/Delete"
import Checkbox from "@mui/material/Checkbox"
import IconButton from "@mui/material/IconButton"
import ListItem from "@mui/material/ListItem"
import { ChangeEvent } from "react"
import { EditableSpan } from "common/components"
import { useAppDispatch } from "common/hooks/useAppDispatch"
import { removeTask, updateTask } from "../../../../../model/tasks-reducer"
import { DomainTodolist } from "../../../../../model/todolists-reducer"
import { getListItemSx } from "./Task.styles"
import { DomainTask } from "../../../../../api/tasksApi.types"
import { TaskStatus } from "common/enums"

type Props = {
  task: DomainTask
  todolist: DomainTodolist
}

export const Task = ({ task, todolist }: Props) => {
  const dispatch = useAppDispatch()

  const removeTaskHandler = () => {
    dispatch(removeTask({ taskId: task.id, todolistId: todolist.id }))
  }

  const changeTaskStatusHandler = (e: ChangeEvent<HTMLInputElement>) => {
    let status = e.currentTarget.checked ? TaskStatus.Completed : TaskStatus.New
    //dispatch(changeTaskStatusTC({ taskId: task.id, status, todolistId: todolist.id }))
    dispatch(updateTask({ taskId: task.id, domainModel: {status}, todolistId: todolist.id }))
  }

  const changeTaskTitleHandler = (title: string) => {
    //dispatch(changeTaskTitleTC({ taskId: task.id, title, todolistId: todolist.id }))
    dispatch(updateTask({ taskId: task.id, domainModel: {title}, todolistId: todolist.id }))
  }

  return (
    <ListItem key={task.id} sx={getListItemSx(task.status === TaskStatus.Completed)}>
      <div>
        <Checkbox checked={task.status === TaskStatus.Completed} onChange={changeTaskStatusHandler} disabled={todolist.entityStatus === 'loading'}/>
        <EditableSpan value={task.title} onChange={changeTaskTitleHandler} disabled={todolist.entityStatus === 'loading'}/>
      </div>
      <IconButton onClick={removeTaskHandler} disabled={todolist.entityStatus === 'loading'}>
        <DeleteIcon />
      </IconButton>
    </ListItem>
  )
}
