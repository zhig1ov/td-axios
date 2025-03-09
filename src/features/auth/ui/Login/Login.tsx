import Button from "@mui/material/Button"
import Checkbox from "@mui/material/Checkbox"
import FormControl from "@mui/material/FormControl"
import FormGroup from "@mui/material/FormGroup"
import FormLabel from "@mui/material/FormLabel"
import Grid from "@mui/material/Grid"
import TextField from "@mui/material/TextField"
import { useAppDispatch, useAppSelector } from "common/hooks"
import { getTheme } from "common/theme"
import { selectThemeMode } from "../../../../app/appSelectors"
import { Controller, SubmitHandler, useForm } from "react-hook-form"
import s from "./Login.module.css"
import { loginTC } from "features/auth/model/auth-reducer"
import { selectIsLoggedIn } from "../../model/authSelectors"
import { useNavigate } from "react-router"
import { Path } from "common/routing/routing"
import { useEffect } from "react"
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';

type Inputs = {
  email: string
  password: string
  rememberMe: boolean
}

export const Login = () => {
  const themeMode = useAppSelector(selectThemeMode)
  const theme = getTheme(themeMode)
  const {control} = useForm()
  const dispatch = useAppDispatch()
  const isLoggedIn = useAppSelector(selectIsLoggedIn)
  const navigate = useNavigate()

  useEffect(() => {
    if (isLoggedIn) {
      navigate(Path.Main)
    }
  }, [isLoggedIn])

  const schema = yup.object().shape({
    email: yup
      .string()
      .required("Email is required")
      .matches(/^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/, "Incorrect email address")
    ,
    password: yup
      .string()
      .required("Password is required")
      .min(3, 'Password must be at least 3 characters long'),
      rememberMe: yup.boolean().required("Remember me"),
  })

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<Inputs>({ defaultValues: { email: "", password: "", rememberMe: false }, resolver: yupResolver(schema) })

  const onSubmit: SubmitHandler<Inputs> = (data) => {
    dispatch(loginTC(data))
    reset()
  }



  return (
    <Grid container justifyContent={"center"}>
      <Grid item justifyContent={"center"}>
        <FormControl>
          <FormLabel>
            <p>
              To login get registered
              <a
                style={{ color: theme.palette.primary.main, marginLeft: "5px" }}
                href={"https://social-network.samuraijs.com/"}
                target={"_blank"}
                rel="noreferrer"
              >
                here
              </a>
            </p>
            <p>or use common test account credentials:</p>
            <p>
              <b>Email:</b> free@samuraijs.com
            </p>
            <p>
              <b>Password:</b> free
            </p>
          </FormLabel>
          <form onSubmit={handleSubmit(onSubmit)}>
            <FormGroup>
              <TextField label="Email" margin="normal" {...register("email")} />
              {errors.email && <span className={s.errorMessage}>{errors.email.message}</span>}
              <TextField type="password" label="Password" margin="normal" {...register("password")} />
              {errors.password && <span className={s.errorMessage}>{errors.password.message}</span>}
              <Controller
                name={"rememberMe"}
                control={control}
                render={({ field: { onChange, value } }) => (
                  <Checkbox onChange={(e) => onChange(e.target.checked)} checked={value} />
                )}
              >
              </Controller>
              <Button type={"submit"} variant={"contained"} color={"primary"}>
                Login
              </Button>
            </FormGroup>
          </form>
        </FormControl>
      </Grid>
    </Grid>
  )
}
