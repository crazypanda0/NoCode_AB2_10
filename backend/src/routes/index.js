const express = require('express');
const router = express.Router();


const v1ApiRoutes = require('./v1/index.js');
router.use('/v1', v1ApiRoutes);//whenever we get the /v1 api routes map it to the v1ApiRoutes and inside v1ApiRoutes call to the './v1/index'

module.exports = router;