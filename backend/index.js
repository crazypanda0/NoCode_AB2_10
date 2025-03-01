const express = require('express');
const app = express();
require('dotenv').config();

app.use(express.json())

app.get('/', (req, res) => {
    console.log("hello world");
})

app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
})