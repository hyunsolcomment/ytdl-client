const ytdl = require("ytdl-core");
import fsExtra from 'fs-extra';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { Global } from '../global';
import { Logger } from '../util/logger';

ffmpeg.setFfmpegPath(Global.FFMPEG_PATH);

class YTDL {
    static async downloadVideo(url: string, outputFolder: string = Global.OUTPUT_FOLDER): Promise<void> {
        const logger = new Logger("YTDL.downloadVideo");

        logger.info(`start download video (url: ${url}, outputFolder: ${outputFolder})`);

        try {
            const info = await ytdl.getInfo(url);
            logger.info(`get info complete`);

            const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });
            const audioFormat = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
            
            const videoFilePath = path.join(Global.TEMP_FOLDER, `${info.videoDetails.title}.mp4`);
            const audioFilePath = path.join(Global.TEMP_FOLDER, `${info.videoDetails.title}.mp3`);
            const outputFilePath = path.join(outputFolder, `${info.videoDetails.title}.mp4`);
            
            const videoStream = ytdl(url, { quality: videoFormat.itag });
            const audioStream = ytdl(url, { quality: audioFormat.itag });
            
            const videoWriteStream = fsExtra.createWriteStream(videoFilePath);
            const audioWriteStream = fsExtra.createWriteStream(audioFilePath);
            
            videoStream.pipe(videoWriteStream);
            audioStream.pipe(audioWriteStream);
            
            await new Promise<void>((resolve, reject) => {
                videoWriteStream.on('finish', resolve);
                videoWriteStream.on('error', reject);
            });
          
            await new Promise<void>((resolve, reject) => {
                audioWriteStream.on('finish', resolve);
                audioWriteStream.on('error', reject);
            });
          
            await new Promise<void>((resolve, reject) => {
                ffmpeg()
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
                        await fsExtra.remove(videoFilePath);
                        await fsExtra.remove(audioFilePath);
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
        } catch (error) {
            logger.error(error);
        }
    }

    static async downloadMusic(url: string, outputFolder: string = Global.OUTPUT_FOLDER): Promise<void> {

        const logger = new Logger("YTDL.downloadMusic");

        logger.info(`start download music (url: ${url}, outputFolder: ${outputFolder})`);

        try {
            const info = await ytdl.getInfo(url);
            logger.info("get info complete");

            const outputFilePath = path.join(outputFolder, `${info.videoDetails.title}.mp3`);

            const audio = ytdl(url, { quality: 'highestaudio' });

            await new Promise<void>((resolve, reject) => {
                ffmpeg(audio)
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
        } catch (error) {
            logger.error(error);
        }
    }
}

export default YTDL;
