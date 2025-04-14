import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '../public');

// Base color for generated icons
const backgroundColor = '#5c64f4';
const textColor = '#ffffff';

// Create a simple svg with text as base
const createSvgIcon = (text, size) => {
  return `<svg width="${size}" height="${size}" xmlns="http://www.w3.org/2000/svg">
    <rect width="100%" height="100%" fill="${backgroundColor}"/>
    <text x="50%" y="50%" font-family="Arial" font-size="${size/3}px" 
          fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
      ${text}
    </text>
  </svg>`;
};

async function generateIcons() {
  // Create temporary SVG
  const baseSvg = createSvgIcon('AI', 512);
  const tempSvgPath = path.join(publicDir, 'temp-icon.svg');
  fs.writeFileSync(tempSvgPath, baseSvg);

  try {
    // Generate sizes
    const sizes = [192, 512];
    
    for (const size of sizes) {
      await sharp(tempSvgPath)
        .resize(size, size)
        .toFile(path.join(publicDir, `pwa-${size}x${size}.png`));
      console.log(`Generated ${size}x${size} icon`);
    }
    
    // Generate apple touch icon
    await sharp(tempSvgPath)
      .resize(180, 180)
      .toFile(path.join(publicDir, 'apple-touch-icon.png'));
    console.log('Generated apple-touch-icon.png');
    
    // Generate favicon
    await sharp(tempSvgPath)
      .resize(32, 32)
      .toFile(path.join(publicDir, 'favicon.ico'));
    console.log('Generated favicon.ico');
  } finally {
    // Clean up temporary SVG file
    if (fs.existsSync(tempSvgPath)) {
      fs.unlinkSync(tempSvgPath);
    }
  }
}

generateIcons().catch(console.error);