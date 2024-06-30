"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ytdl = require("ytdl-core");
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const global_1 = require("../global");
const logger_1 = require("../util/logger");
fluent_ffmpeg_1.default.setFfmpegPath(global_1.Global.FFMPEG_PATH);
class YTDL {
    static async downloadVideo(url, outputFolder = global_1.Global.OUTPUT_FOLDER) {
        const logger = new logger_1.Logger("YTDL.downloadVideo");
        logger.info(`start download video (url: ${url}, outputFolder: ${outputFolder})`);
        try {
            const info = await ytdl.getInfo(url);
            logger.info(`get info complete`);
            const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
            const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
            const videoFilePath = path_1.default.join(global_1.Global.TEMP_FOLDER, `${info.videoDetails.title}.mp4`);
            const audioFilePath = path_1.default.join(global_1.Global.TEMP_FOLDER, `${info.videoDetails.title}.mp3`);
            const outputFilePath = path_1.default.join(outputFolder, `${info.videoDetails.title}.mp4`);
            const videoStream = ytdl(url, { quality: videoFormat.itag });
            const audioStream = ytdl(url, { quality: audioFormat.itag });
            const videoWriteStream = fs_extra_1.default.createWriteStream(videoFilePath);
            const audioWriteStream = fs_extra_1.default.createWriteStream(audioFilePath);
            videoStream.pipe(videoWriteStream);
            audioStream.pipe(audioWriteStream);
            await new Promise((resolve, reject) => {
                videoWriteStream.on('finish', resolve);
                videoWriteStream.on('error', reject);
            });
            await new Promise((resolve, reject) => {
                audioWriteStream.on('finish', resolve);
                audioWriteStream.on('error', reject);
            });
            await new Promise((resolve, reject) => {
                (0, fluent_ffmpeg_1.default)()
                    .input(videoFilePath)
                    .input(audioFilePath)
                    .outputOptions('-c:v copy')
                    .outputOptions('-c:a aac')
                    .outputOptions('-strict experimental')
                    .outputOptions('-metadata', `title=${info.videoDetails.title}`)
                    .outputOptions('-metadata', `artist=${info.videoDetails.author.name}`)
                    .outputOptions('-metadata', `album=${info.videoDetails.title}`)
                    .save(outputFilePath)
                    .on('end', async () => {
                    await fs_extra_1.default.remove(videoFilePath);
                    await fs_extra_1.default.remove(audioFilePath);
                    logger.info(`video download complete. (url: ${url})`);
                    resolve();
                })
                    .on('progress', (progress) => {
                    console.log({
                        bytes: progress.targetSize * 1024,
                        percent: progress.percent
                    });
                })
                    .on('error', (err) => {
                    logger.error(err);
                    reject(err);
                });
            });
        }
        catch (error) {
            logger.error(error);
        }
    }
    static async downloadMusic(url, outputFolder = global_1.Global.OUTPUT_FOLDER) {
        const logger = new logger_1.Logger("YTDL.downloadMusic");
        logger.info(`start download music (url: ${url}, outputFolder: ${outputFolder})`);
        try {
            const info = await ytdl.getInfo(url);
            logger.info("get info complete");
            const outputFilePath = path_1.default.join(outputFolder, `${info.videoDetails.title}.mp3`);
            const audio = ytdl(url, { quality: 'highestaudio' });
            await new Promise((resolve, reject) => {
                (0, fluent_ffmpeg_1.default)(audio)
                    .audioBitrate(128)
                    .outputOptions('-metadata', `title=${info.videoDetails.title}`)
                    .outputOptions('-metadata', `artist=${info.videoDetails.author.name}`)
                    .save(outputFilePath)
                    .on('progress', (progress) => {
                    console.log({
                        bytes: progress.targetSize * 1024,
                        percent: progress.percent,
                        quality: 'highestaudio'
                    });
                })
                    .on('end', () => {
                    logger.info(`download music complete. (url: ${url})`);
                    resolve();
                })
                    .on('progress', (progress) => {
                    console.log({
                        bytes: progress.targetSize * 1024,
                        percent: progress.percent
                    });
                })
                    .on('error', (err) => {
                    logger.error(err);
                    reject(err);
                });
            });
        }
        catch (error) {
            logger.error(error);
        }
    }
}
exports.default = YTDL;
