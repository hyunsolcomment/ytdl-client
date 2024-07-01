import { useSelector } from 'react-redux';
import './TaskItem.css';
import { Task } from '../modules/task';
import { ITask, ITaskInfo } from '../types/ITask';
import { useEffect, useState } from 'react';
import { Announce } from '../modules/announce';
import { FileSize } from '../util/file-size';

export default function TaskItem({task}: {task: ITask}) {

    const {taskList} = useSelector(Task.get());
    const [info,setInfo] = useState<ITaskInfo | undefined>();
    const [progress,setProgress] = useState<string>("정보 준비 중");
    
    useEffect(() => {
        start();
        startListenBackend();
    },[]);

    async function start() {
        await loadInfo();
        await startDownload();
    }

    /**
     * 1. 동영상 정보 얻고 출력하기
     */
    async function loadInfo() {

        const info = await window.electron.invoke('get-info', task.url);

        if(info) {

            setInfo(info);

        } else {
            Announce.show("동영상 정보를 가져올 수 없습니다.")
            Task.setTaskList(taskList.filter(t => t.url !== task.url));
        }
    }

    /**
     * 2. 다운로드 시작
     */
    async function startDownload() {
        setProgress("다운로드 준비 중");

        switch(task.type.toLowerCase()) {
            case 'mp4':
                window.electron.send('download-video', task.url);
                break;

            case 'mp3':
                window.electron.send('download-music', task.url);
                break;
        }
    }

    /**
     * 3. 백엔드 작업 신호 받기
     */
    function startListenBackend() {
        window.electron.receive('progress', (l: any, {url,message}: { url: string, message: string }) => {
            if(url === task.url) {
                setProgress(message);
            }
        })

        window.electron.receive('done', (l: any, {url}: {url: string}) => {
            if(url === task.url) {
                setProgress(`${task.type.toLocaleUpperCase()} 다운로드 완료`);
            }
        })
    }

    return (
        <div className="task-item" data-loading={info === undefined}>

            <div className="left">
                <div className="chk">
                    <input type="checkbox" />
                </div>
                <div className="image">
                    {
                        info?.thumbnail &&
                        <img src={info.thumbnail} />
                    }
                </div>
                <div className="title-and-author">
                    <div className="title">{info?.title}</div>
                    <div className="author">
                        <div className="image">
                            {
                                info &&
                                <img src={info.authorImage}/>
                            }
                        </div>
                        <div className='name'>{info?.authorName ?? ""}</div>
                    </div>
                </div>
            </div>

            <div className="right">
                <div className="progress">
                    {progress}
                </div>
            </div>
        </div>
    )
}