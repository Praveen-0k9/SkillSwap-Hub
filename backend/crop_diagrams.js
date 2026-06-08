import * as JimpModule from 'jimp';
const Jimp = JimpModule.Jimp || JimpModule.default || JimpModule;
import fs from 'fs';
import path from 'path';

const part1 = "C:/Users/LENOVO/.gemini/antigravity-ide/brain/01c6e0ce-1051-4e1a-b918-070a39701789/full_page_part1_1780894718707.png";
const part2 = "C:/Users/LENOVO/.gemini/antigravity-ide/brain/01c6e0ce-1051-4e1a-b918-070a39701789/full_page_part2_1780894731881.png";
const destDir = path.join(process.cwd(), "screenshots");

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

// format: [name, source_path, [left, top, right, bottom]]
const diagrams = [
  ["architecture.png", part1, [24, 44, 730, 580]],
  ["flowchart_auth.png", part1, [24, 620, 730, 1180]],
  ["flowchart_chat.png", part1, [24, 1220, 730, 1780]],
  ["dfd_level_0.png", part1, [24, 1820, 730, 2380]],
  ["dfd_level_1.png", part1, [24, 2420, 730, 2980]],
  ["dfd_level_2.png", part1, [24, 3020, 730, 3580]],
  ["erd.png", part2, [24, 1620, 730, 2138]]
];

async function cropAll() {
  for (const [name, src, coords] of diagrams) {
    console.log(`Loading ${name} from ${src}...`);
    try {
      const img = await Jimp.read(src);
      // Device pixel ratio scale factor
      const scale = img.bitmap.width / 1268.0;
      
      const left = Math.round(coords[0] * scale);
      const top = Math.round(coords[1] * scale);
      const right = Math.round(coords[2] * scale);
      const bottom = Math.round(coords[3] * scale);
      
      const w = right - left;
      const h = bottom - top;
      
      console.log(`Cropping ${name}: x=${left}, y=${top}, w=${w}, h=${h} (scale: ${scale})`);
      
      img.crop({ x: left, y: top, w: w, h: h });
      const outputPath = path.join(destDir, name);
      await img.write(outputPath);
      console.log(`Successfully saved to ${outputPath}`);
    } catch (err) {
      console.error(`Error processing ${name}:`, err.message);
    }
  }
}

cropAll().then(() => {
  console.log("All diagram cropping jobs complete!");
});
