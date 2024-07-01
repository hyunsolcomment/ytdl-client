import ytdl from 'ytdl-core';
import fsExtra from 'fs-extra';
import path from 'path';
import ffmpeg from 'fluent-ffmpeg';
import { Global } from '../global';
import { Logger } from '../util/logger';
import { send } from './ipc';
import { FileSize } from '../util/file-size';

ffmpeg.setFfmpegPath(Global.FFMPEG_PATH);

class YTDL {
    static async downloadVideo(url: string, outputFolder: string = Global.OUTPUT_FOLDER): Promise<void> {
        const logger = new Logger("YTDL.downloadVideo", { url, outputFolder });

        logger.info(`start download video (url: ${url}, outputFolder: ${outputFolder})`);

        try {

            send(`progress`, { url, message: '정보를 가져오는 중'})

            const info = await ytdl.getInfo(url);
            logger.info(`get info complete`);

            const videoFormat = ytdl.chooseFormat(info.formats, { quality: 'highestvideo' });

            const videoFilePath = path.join(Global.TEMP_FOLDER, `${info.videoDetails.title}.mp4`);
            const outputFilePath = path.join(outputFolder, `${info.videoDetails.title}.mp4`);
            
            const videoStream = ytdl(url, { quality: videoFormat.itag });
            
            const videoWriteStream = fsExtra.createWriteStream(videoFilePath);

            videoStream.pipe(videoWriteStream);
            
            let videoBytes = 0;
            let audioBytes = 0;

            videoStream.on('data', (chunk) => {
                videoBytes += chunk.length;

                let size = FileSize.toString(videoBytes);

                logger.info(`write video (${size})`)
                
                send(`progress`, { url, message: `비디오 다운로드 중 (${size})`})
            })

            send(`progress`, { url, message: '비디오 다운로드 중'})

            await new Promise<void>((resolve, reject) => {
                videoWriteStream.on('finish', resolve);
                videoWriteStream.on('error', reject);
            });

            logger.info('video write complete');

            send(`progress`, { url, message: '오디오 다운로드 중'})

            const audioFormat      = ytdl.chooseFormat(info.formats, { quality: 'highestaudio' });
            const audioFilePath    = path.join(Global.TEMP_FOLDER, `${info.videoDetails.title}.mp3`);
            const audioStream      = ytdl(url, { quality: audioFormat.itag });
            const audioWriteStream = fsExtra.createWriteStream(audioFilePath);

            audioStream.pipe(audioWriteStream);
            
            audioStream.on('data', (chunk) => {
                audioBytes += chunk.length;

                let size = FileSize.toString(audioBytes);

                logger.info(`write audio (${size})`)

                send(`progress`, { url, message: `오디오 다운로드 중 (${size})`})
            })

            await new Promise<void>((resolve, reject) => {
                audioWriteStream.on('finish', resolve);
                audioWriteStream.on('error', reject);
            });
            
            logger.info('audio write complete');

            send(`progress`, { url, message: '파일 파합 중'})

            await new Promise<void>((resolve, reject) => {
                ffmpeg()
                    .input(videoFilePath)
                    .input(audioFilePath)
                    .outputOptions('-c:v copy')
                    .outputOptions('-c:a aac')
                    .outputOptions('-strict experimental')
                    .outputOptions('-metadata', `title=${info.videoDetails.title}`)
                    .outputOptions('-metadata', `publisher=${info.videoDetails.author.name}`)
                    .outputOptions('-metadata', `comment=${info.videoDetails.description}`)
                    .save(outputFilePath)
                    .on('end', async () => {
                        await fsExtra.remove(videoFilePath);
                        await fsExtra.remove(audioFilePath);
                        send('done', { url })
                        logger.info(`done`);
                        resolve();
                    })
                    .on('progress', (progress) => {

                        const bytes   = progress.targetSize * 1024;
                        const size    = FileSize.toString(bytes);

                        send('progress', {
                            url,
                            message: `파일 파합 중 (${size})`
                        })
    
                        logger.info(`merge (${size}, ${bytes})`)
                      })
                    .on('error', (err) => {
                        logger.error(err);
                        reject(err);
                    });
            });

            send(`done`, {url});

        } catch (error) {
            logger.error(error);
        }
    }

    static async downloadMusic(url: string, outputFolder: string = Global.OUTPUT_FOLDER): Promise<void> {

        const logger = new Logger("YTDL.downloadMusic", { url, outputFolder });

        logger.info(`start download music (url: ${url}, outputFolder: ${outputFolder})`);

        try {
            const info = await ytdl.getInfo(url);
            logger.info("get info complete");

            const outputFilePath = path.join(outputFolder, `${info.videoDetails.title}.mp3`);

            const audio = ytdl(url, { quality: 'highestaudio' });

            await new Promise<void>((resolve, reject) => {
                ffmpeg(audio)
                    .audioBitrate(320)
                    .outputOptions('-metadata', `title=${info.videoDetails.title}`)
                    .outputOptions('-metadata', `publisher=${info.videoDetails.author.name}`)
                    .save(outputFilePath)
                    .on('progress', (progress) => {
                        const bytes   = progress.targetSize * 1024;
                        const size    = FileSize.toString(bytes);

                        send('progress', {
                            url,
                            message: `파일 설정 중 (${size})`
                        })

                        logger.info(`merge (${size}, ${bytes})`)
                    })
                    .on('end', () => {
                        logger.info(`done`);
                        send('done', { url })
                        resolve();
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

    static verifyURL(url: string) {
        return ytdl.validateURL(url);
    }
}

export default YTDL;
