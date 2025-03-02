const Steg = require('steg');
const fs = require('fs').promises;
const path = require('path');

async function embedHiddenData(imageBuffer, secretData) {
    if (!imageBuffer || imageBuffer.length < 100) { // Minimum PNG size check
        throw new Error('Invalid image buffer');
      }
      const tempId = Date.now();
      const tempPath = path.join(__dirname, `temp_${tempId}_input.png`);
      const outputPath = path.join(__dirname, `temp_${tempId}_output.png`);
    
  try {
    // Write the image buffer to a temporary file
    await fs.writeFile(tempPath, imageBuffer);

    // Embed data using steganography
    await Steg.encode(tempPath, outputPath, secretData);

    // Read the steganographed image
    const stegBuffer = await fs.readFile(outputPath);

    // Cleanup temporary files
    await Promise.all([
      fs.unlink(tempPath),
      fs.unlink(outputPath)
    ]);

    return stegBuffer;
  } catch (error) {
    console.error('Error embedding hidden data:', error);

    // Cleanup temporary files in case of error
    await Promise.all([
      fs.unlink(tempPath).catch(() => {}),
      fs.unlink(outputPath).catch(() => {})
    ]);

    throw new Error('Failed to embed hidden data');
  }
}

module.exports = { embedHiddenData };