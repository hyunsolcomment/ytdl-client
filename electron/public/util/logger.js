"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Logger = exports.LoggerFile = exports.TextStyle = exports.BackColor = exports.ForeColor = void 0;
const fs = __importStar(require("fs-extra"));
const path = __importStar(require("path"));
var ForeColor;
(function (ForeColor) {
    ForeColor["Black"] = "\u001B[30m";
    ForeColor["Red"] = "\u001B[31m";
    ForeColor["Green"] = "\u001B[32m";
    ForeColor["Yellow"] = "\u001B[33m";
    ForeColor["Blue"] = "\u001B[34m";
    ForeColor["Magenta"] = "\u001B[35m";
    ForeColor["Cyan"] = "\u001B[36m";
    ForeColor["Purple"] = "\u001B[35m";
    ForeColor["Orange"] = "\u001B[38;5;208m";
    ForeColor["White"] = "\u001B[37m";
    ForeColor["LightBlack"] = "\u001B[90m";
    ForeColor["LightRed"] = "\u001B[91m";
    ForeColor["LightGreen"] = "\u001B[92m";
    ForeColor["LightYellow"] = "\u001B[93m";
    ForeColor["LightBlue"] = "\u001B[94m";
    ForeColor["LightMagenta"] = "\u001B[95m";
    ForeColor["LightPurple"] = "\u001B[95m";
    ForeColor["LightCyan"] = "\u001B[96m";
    ForeColor["LightWhite"] = "\u001B[97m";
    ForeColor["Reset"] = "\u001B[0m";
})(ForeColor || (exports.ForeColor = ForeColor = {}));
var BackColor;
(function (BackColor) {
    BackColor["Black"] = "\u001B[40m";
    BackColor["Red"] = "\u001B[41m";
    BackColor["Green"] = "\u001B[42m";
    BackColor["Yellow"] = "\u001B[43m";
    BackColor["Blue"] = "\u001B[44m";
    BackColor["Magenta"] = "\u001B[45m";
    BackColor["Cyan"] = "\u001B[46m";
    BackColor["Purple"] = "\u001B[45m";
    BackColor["Orange"] = "\u001B[48;5;208m";
    BackColor["White"] = "\u001B[47m";
    BackColor["LightBlack"] = "\u001B[100m";
    BackColor["LightRed"] = "\u001B[101m";
    BackColor["LightGreen"] = "\u001B[102m";
    BackColor["LightYellow"] = "\u001B[103m";
    BackColor["LightBlue"] = "\u001B[104m";
    BackColor["LightMagenta"] = "\u001B[105m";
    BackColor["LightPurple"] = "\u001B[105m";
    BackColor["LightCyan"] = "\u001B[106m";
    BackColor["LightWhite"] = "\u001B[107m";
    BackColor["Reset"] = "\u001B[0m";
})(BackColor || (exports.BackColor = BackColor = {}));
var TextStyle;
(function (TextStyle) {
    TextStyle["Bold"] = "\u001B[1m";
    TextStyle["Dim"] = "\u001B[2m";
    TextStyle["Italic"] = "\u001B[3m";
    TextStyle["Underline"] = "\u001B[4m";
    TextStyle["Blink"] = "\u001B[5m";
    TextStyle["Inverse"] = "\u001B[7m";
    TextStyle["Hidden"] = "\u001B[8m";
    TextStyle["Strikethrough"] = "\u001B[9m";
    TextStyle["Reset"] = "\u001B[0m";
})(TextStyle || (exports.TextStyle = TextStyle = {}));
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
};
async function appendFile(path, str) {
    return new Promise((resolve, reject) => {
        fs.appendFile(path, str, (err) => {
            if (err) {
                reject(err);
            }
            else {
                resolve(null);
            }
        });
    });
}
class LoggerFile {
    static createNewLogFile(folder, file) {
        if (!fs.existsSync(folder)) {
            fs.mkdirSync(folder, { recursive: true });
        }
        if (file) {
            if (!file.includes(".")) {
                file = file + '.log';
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
        let finalLogFile = path.join(folder, fileName);
        while (fs.existsSync(finalLogFile = path.join(folder, fileName))) {
            fileName = `${baseName}-${counter}${extension}`;
            counter++;
        }
        fs.writeFileSync(finalLogFile, '');
        return finalLogFile;
    }
    static startWrite(file) {
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
    static async append(str) {
        if (LoggerFile.path && !LoggerFile.pause) {
            appendFile(LoggerFile.path, str + "\n");
        }
    }
}
exports.LoggerFile = LoggerFile;
LoggerFile.pause = false;
class Logger {
    constructor(prefix, params) {
        this.prefix = "";
        this.params = {};
        this.prefix = prefix;
        this.params = params;
    }
    str2log(message) {
        return `[${this.prefix}] ${message}${this.params ? ` (${Logger.obj2str(this.params)})` : ''}`;
    }
    static msg2str(...message) {
        const arr = [];
        for (let m of message[0]) {
            if (typeof m === 'object') {
                arr.push(Logger.obj2str(m));
            }
            else {
                arr.push(m + "");
            }
        }
        return arr.join(" ");
    }
    info(...message) {
        Logger.info(this.str2log(Logger.msg2str(message)));
    }
    warn(...message) {
        Logger.warn(this.str2log(Logger.msg2str(message)));
    }
    error(...message) {
        Logger.error(this.str2log(Logger.msg2str(message)));
    }
    static obj2str(obj) {
        const work = (obj) => typeof obj !== 'object' || obj === null
            ? String(obj)
            : `{ ${Object.entries(obj).map(([key, value]) => `${key}: ${work(value)}`).join(", ")} }`;
        return work(obj);
    }
    static date2str(date) {
        const dateStr = new Date().toISOString().slice(0, 10);
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${dateStr} ${hours}:${minutes}:${seconds}`;
    }
    static now2str() {
        return Logger.date2str(new Date());
    }
    static rgb2color(r, g, b) {
        return `\x1b[${r};${g};${b}m`;
    }
    static write(str, color = false) {
        if (color) {
            for (let key of Object.keys(colorTable)) {
                //@ts-ignore
                str = str.replaceAll(key, colorTable[key]);
            }
        }
        //@ts-ignore
        process.stdout.write(str + ForeColor.Reset);
    }
    static newline() {
        //@ts-ignore
        process.stdout.write("\n");
    }
    static writeLine(str) {
        //@ts-ignore
        process.stdout.write("\n" + str);
    }
    static info(...message) {
        const str = `[${Logger.now2str()}] [INFO] ${Logger.msg2str(message)}`;
        console.log(`${ForeColor.Reset}${str}${ForeColor.Reset}`);
        LoggerFile.append(str);
    }
    static warn(...message) {
        const str = `[${Logger.now2str()}] [WARN] ${Logger.msg2str(message)}`;
        console.log(`${ForeColor.Yellow}${str}${ForeColor.Reset}`);
        LoggerFile.append(str);
    }
    static error(...message) {
        const str = `[${Logger.now2str()}] [ERROR] ${Logger.msg2str(message)}`;
        console.log(`${ForeColor.Red}${str}${ForeColor.Reset}`);
        LoggerFile.append(str);
    }
}
exports.Logger = Logger;
