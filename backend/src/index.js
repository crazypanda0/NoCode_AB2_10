const express = require('express');
const fs = require('fs');
const cors = require('cors'); 
const path = require('path');
const { connect } = require('./config/database.js');
const apiRoutes = require('./routes/index.js');
const { PORT }  = require('./config/serverconfig.js');
const User = require('./models/user.js'); 

const app = express();

app.use(express.json());  
app.use(express.urlencoded({ extended: true }));  

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, './uploads')));

app.use(cors());


app.post("/api/user", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Validate input
        if (!name || !email || !password) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Create user
        const newUser = await User.create({ name, email, password });

        res.status(201).json({
            success: true,
            data: newUser,
            message: "User created successfully!",
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message,
            message: "Failed to create user.",
        });
    }
});
app.use('/api', apiRoutes);

const setupAndStartServer = async () => {
    try {
        await connect();
        app.listen(PORT, () => {
            console.log(` Server started at port ${PORT}`);
        });
    } catch (error) {
        console.error("❌ Error starting server:", error);
    }
};

setupAndStartServer();
