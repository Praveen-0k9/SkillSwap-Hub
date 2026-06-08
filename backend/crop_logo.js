import * as JimpModule from "jimp";
const Jimp = JimpModule.Jimp || JimpModule.default || JimpModule;
import path from "path";

const imagePath = "C:/Users/LENOVO/.gemini/antigravity-ide/brain/01c6e0ce-1051-4e1a-b918-070a39701789/media__1780891100921.png";

Jimp.read(imagePath)
  .then(image => {
    const width = image.bitmap.width;
    const height = image.bitmap.height;
    console.log(`Image loaded. Dimensions: ${width}x${height}`);

    // Bounding box calculation for the university logo:
    // It's in the vertical center area (from roughly y = 30% to y = 50% of the page height)
    // and horizontal center (from roughly x = 28% to x = 72% of the page width).
    const x = Math.round(width * 0.28);
    const y = Math.round(height * 0.30);
    const w = Math.round(width * 0.44);
    const h = Math.round(height * 0.20);

    console.log(`Cropping area: x=${x}, y=${y}, w=${w}, h=${h}`);
    image.crop({ x, y, w, h });
    image.write("nsu_logo.png", () => {
      console.log("Logo successfully cropped and saved to nsu_logo.png");
    });
  })
  .catch(err => {
    console.error("Error loading image:", err);
  });
