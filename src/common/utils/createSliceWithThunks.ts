import { asyncThunkCreator, buildCreateSlice } from "@reduxjs/toolkit"


export const createSliceWithThunks = buildCreateSlice({creators: {asyncThunk: asyncThunkCreator}})

