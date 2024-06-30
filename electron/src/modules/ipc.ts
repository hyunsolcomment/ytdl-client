import { ipcMain } from "electron";
import YTDL from "./ytdl";

ipcMain.handle('download-video', async (l: any, url: string) => {
    url = url[0];

    await YTDL.downloadVideo(url);
})

ipcMain.handle('download-music', async (l: any, url: string) => {
    url = url[0];

    await YTDL.downloadMusic(url);
})