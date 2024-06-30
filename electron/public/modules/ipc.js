"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const ytdl_1 = __importDefault(require("./ytdl"));
electron_1.ipcMain.handle('download-video', async (l, url) => {
    url = url[0];
    await ytdl_1.default.downloadVideo(url);
});
electron_1.ipcMain.handle('download-music', async (l, url) => {
    url = url[0];
    await ytdl_1.default.downloadMusic(url);
});
