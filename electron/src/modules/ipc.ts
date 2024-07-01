import { clipboard, ipcMain } from "electron";
import YTDL from "./ytdl";
import ytdl from "ytdl-core";
import { Logger } from "../util/logger";
import { Global } from "../global";

export function send(ev: string, args: any) {
    Global.MAIN_WINDOW.webContents.send(ev, args)
}

ipcMain.on('download-video', async (l: any, url: string) => {
    return await YTDL.downloadVideo(url);
})

ipcMain.on('download-music', async (l: any, url: string) => {
    return await YTDL.downloadMusic(url);
})

ipcMain.handle('check-url', (l: any, url: string) => {
    return ytdl.validateURL(url);
})

ipcMain.handle('get-info', async (l: any, url: string) => {
    try {
        const {videoDetails} = await ytdl.getInfo(url)
        const {thumbnails,title,description,channelId,author} = videoDetails;
        
        let thumbnail = thumbnails?.[thumbnails.length-1].url;

        return {
            thumbnail,
            title,
            channelId,
            desc: description,
            authorName: author.name,
            authorImage: author.thumbnails?.[author.thumbnails.length-1].url,
            authorUrl: author.channel_url
        }
    } catch (err) {
        Logger.error(`[ipc.get-info]`,err)
        return undefined;
    }
})

ipcMain.handle('get-clipboard-text', () => {
    return clipboard.readText();
})