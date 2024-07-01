import { clipboard, ipcMain } from "electron";
import YTDL from "./ytdl";
import ytdl from "ytdl-core";
import { Logger } from "../util/logger";

ipcMain.handle('download-video', async (l: any, url: string) => {
    await YTDL.downloadVideo(url);
})

ipcMain.handle('download-music', async (l: any, url: string) => {
    await YTDL.downloadMusic(url);
})

ipcMain.handle('get-info', async (l: any, url: string) => {
    try {
        const {videoDetails} = await ytdl.getInfo(url)
        const {thumbnails,title,description,channelId,author} = videoDetails;
        
        let thumbnail = thumbnails?.[thumbnails.length-1].url;
        console.log(thumbnail);

        return {
            thumbnail  : thumbnail,
            title      : title,
            desc       : description,
            channelId  : channelId,
            authorName : author.name,
            authorImage: author.thumbnails?.[author.thumbnails.length-1].url,
            authorUrl  : author.channel_url
        }
    } catch (err) {
        Logger.error(`[ipc.get-info]`,err)
        return undefined;
    }
})

ipcMain.handle('get-clipboard-text', () => {
    return clipboard.readText();
})