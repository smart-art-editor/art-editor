'use client'
import axios from "axios";
import {  fetchFile, toBlobURL } from '@ffmpeg/util';
import { FFmpeg } from '@ffmpeg/ffmpeg';
const apiKey = process.env.NEXT_PUBLIC_VIDEO_API_KEY;
const apiSecret = process.env.NEXT_PUBLIC_VIDEO_API_SECRET;
    
export const getvids = async () => {
    try {
      
        const response = await axios.get(`https://api.thetavideoapi.com/video/${apiKey}/list`, {
            headers: {
                'x-tva-sa-id': apiKey,
                'x-tva-sa-secret': apiSecret
            }
        });
        console.log('vidssssssssssssssss',response.data.body)
        return response.data.body;
    } catch (error) {
        console.error('Error fetching signed URL:', error);
    }
}




// // let ffmpeg: FFmpeg | null = null;

// // async function loadFFmpeg() {
// //   if (ffmpeg) return;
// //   ffmpeg = new FFmpeg();
// //   const baseURL = 'https://unpkg.com/@ffmpeg/core@0.11.0/dist/umd';
// //   await ffmpeg.load({
// //     coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
// //     wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
// //   });
// // }

// // export async function convertWebMtoMP4(webmBlob: Blob): Promise<Blob> {
// //   await loadFFmpeg();
// //   if (!ffmpeg) throw new Error('FFmpeg not loaded');

// //   const inputName = 'input.webm';
// //   const outputName = 'output.mp4';

// //   await ffmpeg.writeFile(inputName, await fetchFile(webmBlob));

// //   await ffmpeg.exec(['-i', inputName, '-c:v', 'libx264', '-crf', '23', '-c:a', 'aac', '-q:a', '128', outputName]);

// //   const data = await ffmpeg.readFile(outputName);
// //   return new Blob([data], { type: 'video/mp4' });
// // }

// let ffmpeg: FFmpeg | null = null;

// async function loadFFmpeg() {
//     console.log('loading')
//   if (ffmpeg) return ffmpeg;
  
//   ffmpeg = new FFmpeg();
//   const baseURL =  'https://unpkg.com/@ffmpeg/core@0.12.6/dist/umd';
//   await ffmpeg.load({
//     coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
//     wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
//   });
//   console.log('isloaded')
//   return ffmpeg;
// }

// export async function convertWebMtoMP4(webmBlob: Blob): Promise<Blob> {
//   const ffmpeg = await loadFFmpeg();
//   if (!ffmpeg) throw new Error('FFmpeg failed to load');

//   const inputName = 'input.webm';
//   const outputName = 'output.mp4';

//   await ffmpeg.writeFile(inputName, await fetchFile(webmBlob));

//   await ffmpeg.exec(['-i', inputName, '-c:v', 'libx264', '-crf', '23', '-c:a', 'aac', '-q:a', '128', outputName]);

//   const data = await ffmpeg.readFile(outputName);
//   console.log(new Blob([data], { type: 'video/mp4' }),'datablob')
//   return new Blob([data], { type: 'video/mp4' });
// }