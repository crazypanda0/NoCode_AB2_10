const express = require('express');
const bodyParser = require('body-parser');
const { PORT }  = require('./config/serverconfig.js');
const app = express();

app.use(express.json())

const setupAndStartServer = async() =>{
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended: true}));
    //app.use('/api',ApiRoutes);
    app.listen(PORT, async ()=>{
        console.log(`Server started at ${PORT}` )
    });
}
setupAndStartServer();