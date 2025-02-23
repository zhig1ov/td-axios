export type ThemeMode = "dark" | "light"

type InitialState = typeof initialState

const initialState = {
  themeMode: "light" as ThemeMode,
}

export const appReducer = (state: InitialState = initialState, action: ActionsType): InitialState => {
  switch (action.type) {
    case "CHANGE_THEME":
      return { ...state, themeMode: action.payload.themeMode }
    default:
      return state
  }
}

// Action creators
export const changeThemeAC = (themeMode: ThemeMode) => {
  return {
    type: "CHANGE_THEME",
    payload: { themeMode },
  } as const
}

// Actions types
type ChangeThemeActionType = ReturnType<typeof changeThemeAC>

type ActionsType = ChangeThemeActionType
