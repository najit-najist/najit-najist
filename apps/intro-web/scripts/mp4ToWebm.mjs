import path from 'path';
import { execa } from 'execa';
import { existsSync } from 'fs';

const inputFilePath = 'src/assets/our-story.mp4';
const bin = 'scripts/ffmpeg.exe';
const video = '1000k';
const audio = '128k';
let muted = audio == '0' ? '-an' : '';

console.log(path.resolve('apps/intro-web'));

try {
  await execa(
    `${bin} -i "${inputFilePath}" -f webm -vcodec libvpx -acodec libvorbis -b:v ${video} ${muted} -ar 44100 -ab ${audio} -ac 2 -y "our-story.webm"`,
    [],
    {
      cwd: path.resolve('apps/intro-web'),
    }
  );
} catch (e) {
  console.log('Failed: ');
  console.log(e.message);
}
