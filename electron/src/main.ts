import {app,BrowserWindow} from 'electron';
import path from 'path';
import { Global } from './global';
import './modules/ipc';
import { Logger, LoggerFile } from './util/logger';
import fs from 'fs-extra';

LoggerFile.startWrite();

async function init() {
    const logger = new Logger("main.init");

    async function mkdirIfNoExist(folder: string) {

        if(!await fs.pathExists(Global.FFMPEG_PATH)) {
            logger.error(`cannot found ffmpeg (FFMPEG_PATH: ${Global.FFMPEG_PATH})`);
            throw `${Global.FFMPEG_PATH}를 찾을 수 없어요. 프로그램을 재설치해주세요.`
        }

        if(!await fs.pathExists(folder)) {
            await fs.mkdir(folder);
            logger.info(`create folder: ${folder}`)        
        }
    }

    await mkdirIfNoExist(Global.OUTPUT_FOLDER);
    await mkdirIfNoExist(Global.TEMP_FOLDER);

    await fs.emptyDir(Global.TEMP_FOLDER);
    logger.info(`empty temp folder (${Global.TEMP_FOLDER})`);
}

function createMainWindow() {
    Global.MAIN_WINDOW = new BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            preload: path.join(Global.ROOT_FOLDER, 'preload.js')
        },
    })

    Global.MAIN_WINDOW.setMenuBarVisibility(false);

    if(app.isPackaged) {
        Global.MAIN_WINDOW.loadFile(path.join(Global.ROOT_FOLDER, 'index.html'));
    } else {
        Global.MAIN_WINDOW.loadURL('http://localhost:3000');
    }
}

app.whenReady().then(() => {

    init();

    createMainWindow();
    
    Logger.info('start');

    app.on('window-all-closed', () => {
        app.exit();
    })
})