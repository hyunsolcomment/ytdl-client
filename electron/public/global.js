"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Global = void 0;
const path_1 = __importDefault(require("path"));
class Global {
}
exports.Global = Global;
Global.ROOT_FOLDER = __dirname;
Global.FFMPEG_PATH = path_1.default.join(Global.ROOT_FOLDER, "bin", "ffmpeg.exe");
Global.TEMP_FOLDER = path_1.default.join(Global.ROOT_FOLDER, "temp");
Global.OUTPUT_FOLDER = path_1.default.join(Global.ROOT_FOLDER, "output");
