const express = require('express');
const upload = require('../../middleware/upload-middleware.js');
const {uploadFile} = require('../../controller/upload-controller.js');

const router = express.Router();
const fs = require('fs');

//route to upload the file
// router.post('/upload', upload.single('file'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).json({ 
//         error: 'Invalid file type. Upload a valid document or image.' 
//     });
//   }
//   res.json({ message: 'File uploaded successfully!', filename: req.file.filename });
// });

router.post('/upload', upload.single('file'), uploadFile);

//route to get all the uploaded files
// router.get('/uploads', (req, res) => {
//     fs.readdir('uploads/', (err, files) => {
//       if (err) return res.status(500).json({ error: 'Unable to read files' });
//       res.json({ files });
//     });
//   });

//router.get('/uploads', uploadController.getUploadedFiles);
module.exports = router;
