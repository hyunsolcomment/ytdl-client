import { useSelector } from 'react-redux';
import './Input.css';
import { Task } from '../modules/task';
import React, { useEffect, useRef } from 'react';
import { Announce } from '../modules/announce';

export default function Input() {

    const {taskList} = useSelector(Task.get());

    const refType = useRef<HTMLSelectElement>(null);
    const refUrl  = useRef<HTMLInputElement>(null);

    useEffect(() => {
        if(!refUrl.current) {
            return;
        }

        async function onKeyDown(e: KeyboardEvent) {
            const key = e.key.toLowerCase();

            // Ctrl + V
            if(key === 'v' && e.ctrlKey) {
                e.preventDefault();
                const copiedText = await window.electron.invoke('get-clipboard-text', undefined);
                refUrl.current!.value = copiedText;
                refUrl.current!.focus();
            }

            // Ctrl + A
            else if(key === 'a' && e.ctrlKey) {
                e.preventDefault();
                refUrl.current!.select();
            }
        }

        window.addEventListener('keydown',onKeyDown);

        return () => {
            window.removeEventListener('keydown', onKeyDown);
        }
    },[refUrl]);

    function onKeyDown_UrlInput(e: React.KeyboardEvent<HTMLInputElement>) {
        switch(e.key.toLowerCase()) {
            case 'enter':
                e.preventDefault();
                onClick_SubmitButton();
                break;
        }
    }

    async function onClick_SubmitButton() {
        if(refType.current && refUrl.current) {
            let type:string = refType.current.value.toLowerCase();
            let url:string  = refUrl.current.value;

            // 올바르지 않은 타입
            if(!['mp3','mp4'].includes(type)) {
                Announce.show("올바르지 않은 타입의 요청입니다.")
                return;
            }

            // 이미 등록된 URL
            if(taskList.find(t => t.url === url)) {
                Announce.show("이미 등록된 URL입니다.")
                return;
            }

            const info = await window.electron.invoke('get-info', url);

            if(info) {
                Task.setTaskList([...taskList, {
                    title       : info.title,
                    desc        : info.desc,
                    thumbnail   : info.thumbnail,
                    channelId   : info.channelId,
                    authorName  : info.authorName,
                    authorImage : info.authorImage,
                    authorUrl   : info.authorUrl,
                    url, type
                }])

                refUrl.current.value = "";

            } else {
                Announce.show("올바르지 않은 URL입니다.")
            }
        }
    }

    return (
        <div className="url-input">
            <input type="text" placeholder="유튜브 URL를 입력해주세요." ref={refUrl} onKeyDown={onKeyDown_UrlInput}/>
            <select className="type-select" ref={refType}>
                <option>MP4</option>
                <option>MP3</option>
            </select>
            <button className="submit-btn" onClick={onClick_SubmitButton}>추가</button>
        </div>
    )
}