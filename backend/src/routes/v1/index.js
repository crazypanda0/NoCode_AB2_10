const express = require('express');
const upload = require('../../middleware/upload-middleware.js');
const {uploadFile} = require('../../controller/upload-controller.js');
const {signup,login} = require('../../controller/user-controller.js');

const router = express.Router();
const fs = require('fs');

router.post('/upload', upload.single('file'), uploadFile);

router.post('/signup',signup);
router.post('/login',login);

module.exports = router;
