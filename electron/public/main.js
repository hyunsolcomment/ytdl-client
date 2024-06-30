"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path_1 = __importDefault(require("path"));
const global_1 = require("./global");
require("./modules/ipc");
const logger_1 = require("./util/logger");
const fs_extra_1 = __importDefault(require("fs-extra"));
logger_1.LoggerFile.startWrite();
async function init() {
    const logger = new logger_1.Logger("main.init");
    async function mkdirIfNoExist(folder) {
        if (!await fs_extra_1.default.pathExists(global_1.Global.FFMPEG_PATH)) {
            logger.error(`cannot found ffmpeg (FFMPEG_PATH: ${global_1.Global.FFMPEG_PATH})`);
            throw `${global_1.Global.FFMPEG_PATH}를 찾을 수 없어요. 프로그램을 재설치해주세요.`;
        }
        if (!await fs_extra_1.default.pathExists(folder)) {
            await fs_extra_1.default.mkdir(folder);
            logger.info(`create folder: ${folder}`);
        }
    }
    await mkdirIfNoExist(global_1.Global.OUTPUT_FOLDER);
    await mkdirIfNoExist(global_1.Global.TEMP_FOLDER);
    await fs_extra_1.default.emptyDir(global_1.Global.TEMP_FOLDER);
    logger.info(`empty temp folder (${global_1.Global.TEMP_FOLDER})`);
}
function createMainWindow() {
    global_1.Global.MAIN_WINDOW = new electron_1.BrowserWindow({
        webPreferences: {
            nodeIntegration: true,
            preload: path_1.default.join(global_1.Global.ROOT_FOLDER, 'preload.js')
        },
    });
    global_1.Global.MAIN_WINDOW.setMenuBarVisibility(false);
    if (electron_1.app.isPackaged) {
        global_1.Global.MAIN_WINDOW.loadFile(path_1.default.join(global_1.Global.ROOT_FOLDER, 'index.html'));
    }
    else {
        global_1.Global.MAIN_WINDOW.loadURL('http://localhost:3000');
    }
}
electron_1.app.whenReady().then(() => {
    init();
    createMainWindow();
    logger_1.Logger.info('start');
    electron_1.app.on('window-all-closed', () => {
        electron_1.app.exit();
    });
});
