import { configureStore } from '@reduxjs/toolkit'
import { taskSlice } from './task'
import { announceSlice } from './announce'

export const store = configureStore({
    reducer: {
        task: taskSlice.reducer,
        announce: announceSlice.reducer
    }
})

export type RootState = ReturnType<typeof store.getState>