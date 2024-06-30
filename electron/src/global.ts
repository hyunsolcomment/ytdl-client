import { BrowserWindow } from 'electron';
import path from 'path';

export class Global {
    static ROOT_FOLDER   = __dirname;
    static FFMPEG_PATH   = path.join(Global.ROOT_FOLDER, "bin", "ffmpeg.exe");
    static TEMP_FOLDER   = path.join(Global.ROOT_FOLDER, "temp");
    static OUTPUT_FOLDER = path.join(Global.ROOT_FOLDER, "output");
    static MAIN_WINDOW: BrowserWindow;
}