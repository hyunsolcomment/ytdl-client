import { useSelector } from 'react-redux';
import './TaskItem.css';
import { Task } from '../modules/task';
import { ITask } from '../types/ITask';

export default function TaskItem({task}: {task: ITask}) {

    const {taskList} = useSelector(Task.get());

    function onClick_DeleteButton() {
        Task.setTaskList( taskList.filter(t => !Task.equals(t, task)) );
    }

    function onClick_TypeToggle() {

        Task.editTask({...task, type: task.type === 'mp3' ? 'mp4' : 'mp3'})
    }

    return (
        <div className="task-item">

            <div className="left">
                <div className="chk">
                    <input type="checkbox" />
                </div>
                <div className="image">
                    {
                        task.thumbnail &&
                        <img src={task.thumbnail} />
                    }
                </div>
                <div className="title-and-author">
                    <div className="title">{task.title ?? "제목 없음"}</div>
                    <div className="author">
                        <div className="image"><img src={task.authorImage}/></div>
                        <div className='name'>{task.authorName}</div>
                    </div>
                </div>
            </div>

            <div className="right">
                <div className="type" onClick={onClick_TypeToggle}>{task.type.toUpperCase()}</div>
                <button className="del-btn" onClick={onClick_DeleteButton}>삭제</button>    
            </div>
        </div>
    )
}