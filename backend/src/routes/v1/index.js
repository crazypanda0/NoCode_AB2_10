const express = require('express');
const upload = require('../../middleware/upload-middleware.js');
const {uploadFile,fetchDocument} = require('../../controller/upload-controller.js');
const {signup,login} = require('../../controller/user-controller.js');
const authenticateUser = require('../../middleware/user-middleware.js');

const router = express.Router();
const fs = require('fs');

router.post('/upload',authenticateUser, upload.single('file'), uploadFile);
router.get('/documents',authenticateUser,fetchDocument);

router.post('/signup',signup);
router.post('/login',login);



module.exports = router;
