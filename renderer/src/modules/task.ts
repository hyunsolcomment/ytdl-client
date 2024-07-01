import { RootState, store } from "../store/store";
import { taskInit, taskSlice } from "../store/task";
import { ITask } from "../types/ITask";

export class Task {
    static get() {
        return (state: RootState) => state.task;
    }

    static setTaskList(value: typeof taskInit.taskList) {
        store.dispatch(taskSlice.actions.setTaskList(value));
    }

    static editTask(task: ITask) {
        store.dispatch(taskSlice.actions.editTask(task))
    }

    static equals(task1: ITask, task2: ITask) {
        return (
            task1.type === task2.type &&
            task1.url === task2.url
        )
    }
}