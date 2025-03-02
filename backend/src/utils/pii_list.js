const express = require('express');
const multer = require('multer');
const Jimp = require('jimp');
const Tesseract = require('tesseract.js');
const { detectPII, calculateRiskScore } = require('./piiDetector');
const cors = require('cors');
const { compareTwoStrings } = require('string-similarity');
const fs = require('fs');
const path = require('path');
const pdf = require('pdf-poppler');
const { redactImage } = require('./imageProcessor');
const { embedHiddenData } = require('./steganography');

const app = express();


const upload = multer({
    dest: 'uploads/',
    fileFilter: (req, file, cb) => {
        const allowedTypes = ['image/jpeg', 'image/png', 'application/pdf'];
        if (allowedTypes.includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error('Invalid file type'));
        }
    },
});

app.use(cors({ origin: 'http://localhost:5173' }));

// Function to convert PDF to images
async function convertPdfToImages(pdfPath) {
    const outputDir = path.dirname(pdfPath);
    const opts = {
        format: 'png',
        out_dir: outputDir,
        out_prefix: path.basename(pdfPath, path.extname(pdfPath)),
        page: null, // Convert all pages
    };

    await pdf.convert(pdfPath, opts);
    return fs.readdirSync(outputDir).filter(file => file.endsWith('.png'));
}
// In index.js

app.post('/upload', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        console.log('File received:', req.file);  // Debugging
        const filePath = req.file.path;
        let images = [];

        if (req.file.mimetype === 'application/pdf') {
            images = await convertPdfToImages(filePath);
        } else {
            images = [filePath];
        }
        //ocr for image
        let text = '';
        for (const image of images) {
            const { data: { text: pageText } } = await Tesseract.recognize(image, 'eng+hin');
            text += pageText + '\n';
        }


        // Detect PII
        const piiData = detectPII(text);
        const riskScore = calculateRiskScore(piiData);

        // Send response
        res.json({ piiData, riskScore, extractedText: text });

        // Cleanup
        fs.unlinkSync(filePath);
    } catch (error) {
        console.error('Error processing file:', error);
        res.status(500).json({ error: 'Failed to process file' });
    }
});

app.post('/redact', upload.single('file'), async (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'No file uploaded' });

    try {
        console.log('File received for redaction:', req.file);
        const filePath = req.file.path;
        const { selectedPII } = req.body;

     
        // Perform OCR to get text and bounding boxes
       const { data: { text, blocks } } = await Tesseract.recognize(
            filePath,
            'eng+hin',
            { 
                logger: m => console.log(m),
                oem: 1,
                psm: 6, 
                tessedit_pageseg_mode: '6'
             }
        );

        console.log('OCR Text:', text);
        console.log('OCR Blocks:', blocks);

        // Detect PII with bounding boxes
        console.log('Detecting PII...');
        // Correct: Handle piiData as key-value pairs
        // In index.js (/redact endpoint)
        const piiData = Object.entries(detectPII(text))
        .flatMap(([piiType, matches]) => 
          matches.map(match => ({
            type: piiType,
            text: match,
            bbox: getBoundingBox(match, blocks || [])
          }))
        );

        // Redact selected PII from the image
        console.log('Redacting image...');


        // const image = await Jimp.read(filePath);
        // console.log('Image loaded successfully');

        const redactedImage = await redactImage(filePath, piiData, selectedPII);
        console.log('Redacted image created successfully');

        // Convert redacted image to buffer
        const redactedBuffer = await redactedImage.getBufferAsync(Jimp.MIME_PNG);
        console.log('Redacted image converted to buffer');

        // Embed hidden data (original PII) into the image
        console.log('Embedding hidden data...');
        const secretData = JSON.stringify(
            piiData.filter(item => selectedPII.includes(item.type))
        );
        const stegBuffer = await embedHiddenData(redactedBuffer, secretData);
        console.log('Hidden data embedded successfully');

        // Send the final redacted image
        res.set('Content-Type', 'image/png');
        res.send(stegBuffer);

        // Cleanup
        fs.unlinkSync(filePath);
        console.log('Temporary files cleaned up');
    } catch (error) {
        console.error('Error redacting image:', error);
        res.status(500).json({ error: 'Failed to redact image', details: error.message });
    }
});
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

// In all catch blocks// Instead of just error.message
// Add in getBoundingBox()

function getBoundingBox(targetText, blocks) {
    if (!blocks || !Array.isArray(blocks)) {
        console.error('Invalid OCR blocks:', blocks);
        return { x: 0, y: 0, width: 0, height: 0 };
    }

    // Fuzzy match blocks
    let bestMatch = null;
    let highestScore = 0;

    blocks.forEach(block => {
        const score = compareTwoStrings(
            block.text.toLowerCase(),
            targetText.toLowerCase()
        );
        if (score > highestScore && score > 0.6) {
            highestScore = score;
            bestMatch = block;
        }
    });

    return bestMatch?.bbox || { x: 0, y: 0, width: 0, height: 0 };
}
app.listen(3000, () => console.log('Server running on port 3000'));