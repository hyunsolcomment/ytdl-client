import { PayloadAction, createSlice } from "@reduxjs/toolkit"
import { ITask } from "../types/ITask";

interface init {
    taskList: ITask[]
}

export const taskInit: init = {
    taskList: []
}

export const taskSlice = createSlice({
    name: 'task',
    initialState: taskInit,
    reducers: {
        setTaskList(state, action: PayloadAction<typeof taskInit.taskList>) {
            state.taskList = action.payload;
        },

        editTask(state, action: PayloadAction<ITask>) {
            let task = state.taskList.find(t => t.url === action.payload.url);

            if(task) {
                task.type = action.payload.type;
            }
        }
    }
})