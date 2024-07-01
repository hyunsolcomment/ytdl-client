import { useSelector } from 'react-redux';
import './TaskList.css';
import TaskItem from './TaskItem';
import uuidv4 from '../util/uuid';
import { Task } from '../modules/task';

export default function TaskList() {

    const {taskList} = useSelector(Task.get());

    return (
        <div className='task-list'>
            {
                taskList &&
                taskList.map(task => (
                    <TaskItem key={uuidv4()} task={task} />
                ))
            }
        </div>
    )
}