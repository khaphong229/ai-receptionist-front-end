import { FFmpeg } from '@ffmpeg/ffmpeg';
import { fetchFile } from '@ffmpeg/util';
import { toBlobURL } from '@ffmpeg/util';

export async function convertWebmToWav(webmBlob: Blob): Promise<Blob> {
  const ffmpeg = new FFmpeg();
  
  try {
    // Load ffmpeg with correct configuration
    const baseURL = 'https://unpkg.com/@ffmpeg/core@0.12.4/dist/umd'
    await ffmpeg.load({
      coreURL: await toBlobURL(`${baseURL}/ffmpeg-core.js`, 'text/javascript'),
      wasmURL: await toBlobURL(`${baseURL}/ffmpeg-core.wasm`, 'application/wasm'),
    });
    
    // Write webm file to memory
    const inputData = await fetchFile(webmBlob);
    await ffmpeg.writeFile('input.webm', inputData);
    
    // Convert to WAV
    await ffmpeg.exec([
      '-i', 'input.webm',
      '-acodec', 'pcm_s16le',  // 16-bit PCM
      '-ar', '16000',          // 16kHz sample rate
      '-ac', '1',              // mono
      'output.wav'
    ]);
    
    // Read the output file
    const data = await ffmpeg.readFile('output.wav');
    return new Blob([data], { type: 'audio/wav' });
  } finally {
    await ffmpeg.terminate();
  }
} 