import * as fs from 'fs-extra';
import * as path from 'path';

export enum ForeColor {
    Black        = "\x1b[30m",
    Red          = "\x1b[31m",
    Green        = "\x1b[32m",
    Yellow       = "\x1b[33m",
    Blue         = "\x1b[34m",
    Magenta      = "\x1b[35m",
    Cyan         = "\x1b[36m",
    Purple       = "\x1b[35m",
    Orange       = "\x1b[38;5;208m",
    White        = "\x1b[37m",
    LightBlack   = "\x1b[90m",
    LightRed     = "\x1b[91m",
    LightGreen   = "\x1b[92m",
    LightYellow  = "\x1b[93m",
    LightBlue    = "\x1b[94m",
    LightMagenta = "\x1b[95m",
    LightPurple  = "\x1b[95m",
    LightCyan    = "\x1b[96m",
    LightWhite   = "\x1b[97m",
    Reset        = "\x1b[0m"
}

export enum BackColor {
    Black        = "\x1b[40m",
    Red          = "\x1b[41m",
    Green        = "\x1b[42m",
    Yellow       = "\x1b[43m",
    Blue         = "\x1b[44m",
    Magenta      = "\x1b[45m",
    Cyan         = "\x1b[46m",
    Purple       = "\x1b[45m",
    Orange       = "\x1b[48;5;208m",
    White        = "\x1b[47m",
    LightBlack   = "\x1b[100m",
    LightRed     = "\x1b[101m",
    LightGreen   = "\x1b[102m",
    LightYellow  = "\x1b[103m",
    LightBlue    = "\x1b[104m",
    LightMagenta = "\x1b[105m",
    LightPurple  = "\x1b[105m",
    LightCyan    = "\x1b[106m",
    LightWhite   = "\x1b[107m",
    Reset        = "\x1b[0m"
}

export enum TextStyle {
    Bold          = "\x1b[1m",
    Dim           = "\x1b[2m",
    Italic        = "\x1b[3m",
    Underline     = "\x1b[4m",
    Blink         = "\x1b[5m",
    Inverse       = "\x1b[7m",
    Hidden        = "\x1b[8m",
    Strikethrough = "\x1b[9m",
    Reset         = "\x1b[0m"
}

const colorTable = {
    "&x": ForeColor.Reset,
    "&0": ForeColor.LightBlack,
    "&1": ForeColor.Blue,
    "&2": ForeColor.Green,
    "&3": ForeColor.LightBlue,
    "&4": ForeColor.Red,
    "&5": ForeColor.Purple,
    "&6": ForeColor.Yellow,
    "&7": ForeColor.LightWhite,
    "&8": ForeColor.LightBlack,
    "&9": ForeColor.LightBlue,
    "&a": ForeColor.LightGreen,
    "&b": ForeColor.LightBlue,
    "&c": ForeColor.LightRed,
    "&d": ForeColor.LightPurple,
    "&e": ForeColor.LightYellow,
    "&f": ForeColor.LightWhite,
    "<b>": TextStyle.Bold,
    "<i>": TextStyle.Italic,
}

interface KV { [key: string]: any }

async function appendFile(path: string, str: string) {
    return new Promise((resolve, reject) => {
        fs.appendFile(path, str, (err) => {
            if(err) {
                reject(err);
            } else {
                resolve(null);
            }
        })
    })
}

export class LoggerFile {

    private static path: string | undefined;
    private static pause: boolean = false;

    private static createNewLogFile(folder: string, file?: string) {

        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }

        if(file) {
            if(!file.includes(".")) {
                file = file+'.log';
            }

            const _path = path.join(folder, file);
            fs.writeFileSync(_path, '');
            return _path;
        }

        const now = new Date();
        const baseName = now.toISOString().slice(0, 10);
        const extension = '.log';
        
        let fileName = file !== undefined ? file : `${baseName}${extension}`;
        let counter = 1;
    
        let finalLogFile = path.join(folder,fileName);

        while (fs.existsSync(finalLogFile = path.join(folder,fileName))) {
            fileName = `${baseName}-${counter}${extension}`;
            counter++;
        }

        fs.writeFileSync(finalLogFile, '');

        return finalLogFile;
    }

    static startWrite(file?: { folder?: string, name?: string }) {

        const filePath = LoggerFile.createNewLogFile(file?.folder ?? 'logs', file?.name);
        
        LoggerFile.path = filePath;
    }

    static stopWrite() {
        LoggerFile.path = undefined;
    }

    static pauseWrite() {
        LoggerFile.pause = true;
    }

    static resumeWrite() {
        LoggerFile.pause = false;
    }

    static async append(str: string) {
        if(LoggerFile.path && !LoggerFile.pause) {
            appendFile(LoggerFile.path, str+"\n");   
        }
    }
}

export class Logger {

    private prefix: string = "";
    private params?: KV    = {};
    
    constructor(prefix: string, params?: KV) {
        this.prefix = prefix;
        this.params = params;
    }

    private str2log(message: string) {
        return `[${this.prefix}] ${message}${this.params ? ` (${Logger.obj2str(this.params)})` : ''}`
    }

    private static msg2str(...message: any) {
        const arr: string[] = [];

        for(let m of message[0]) {
            
            if(typeof m === 'object') {
                arr.push(Logger.obj2str(m));
            } else {
                arr.push(m+"");
            }
        }

        return arr.join(" ");
    }

    info(...message: any) {
        Logger.info(this.str2log(Logger.msg2str(message)));
    }

    warn(...message: any) {
        Logger.warn(this.str2log(Logger.msg2str(message)));
    }

    error(...message: any) {
        Logger.error(this.str2log(Logger.msg2str(message)));
    }

    static obj2str(obj: object): string {
        const work = (obj: any): string => 
            typeof obj !== 'object' || obj === null 
                ? String(obj) 
                : `{ ${Object.entries(obj).map(([key, value]) => `${key}: ${work(value)}`).join(", ")} }`;
    
        return work(obj);
    }

    static date2str(date: Date) {
        const dateStr = new Date().toISOString().slice(0, 10);
        const hours   = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');

        return `${dateStr} ${hours}:${minutes}:${seconds}`;
    }

    static now2str() {
        return Logger.date2str(new Date());
    }

    static rgb2color(r: number, g: number, b: number) {
        return `\x1b[${r};${g};${b}m`
    }

    static write(str: string, color: boolean = false) {

        if(color) {
            for(let key of Object.keys(colorTable)) {

                //@ts-ignore
                str = str.replaceAll(key, colorTable[key]);
            }
        }

        //@ts-ignore
        process.stdout.write(str+ForeColor.Reset);
    }

    static newline() {
        //@ts-ignore
        process.stdout.write("\n");
    }

    static writeLine(str: string) {
        //@ts-ignore
        process.stdout.write("\n"+str);
    }

    static info(...message: any[]) {
        const str = `[${Logger.now2str()}] [INFO] ${Logger.msg2str(message)}`;
        console.log(`${ForeColor.Reset}${str}${ForeColor.Reset}`)
        LoggerFile.append(str);
    }

    static warn(...message: any[]) {
        const str = `[${Logger.now2str()}] [WARN] ${Logger.msg2str(message)}`;
        console.log(`${ForeColor.Yellow}${str}${ForeColor.Reset}`)
        LoggerFile.append(str);
    }

    static error(...message: any[]) {
        const str = `[${Logger.now2str()}] [ERROR] ${Logger.msg2str(message)}`;
        console.log(`${ForeColor.Red}${str}${ForeColor.Reset}`)
        LoggerFile.append(str);
    }
}