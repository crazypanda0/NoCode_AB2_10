const Jimp = require('jimp');

async function redactImage(imagePath, piiData, selectedPII) {
  try {
    // Load image
    const image = await Jimp.read(imagePath);
    
    // Get PII items to redact
    const itemsToRedact = piiData.filter(item => 
      selectedPII.includes(item.type)
    );

    // Redact each detected PII area
    itemsToRedact.forEach(({ bbox }) => {
      const x = Math.max(0, bbox.x);
      const y = Math.max(0, bbox.y);
      const width = Math.min(image.bitmap.width - x, bbox.width);
      const height = Math.min(image.bitmap.height - y, bbox.height);

      if (width > 0 && height > 0) {
        // Draw black rectangle
        image.scan(x, y, width, height, (x, y, idx) => {
          image.bitmap.data[idx] = 0;     // R
          image.bitmap.data[idx + 1] = 0; // G
          image.bitmap.data[idx + 2] = 0; // B
        });
      }
    });

    return image;
  } catch (error) {
    console.error('Redaction error:', error);
    throw error;
  }
}

module.exports = { redactImage };