const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Middleware to hash password before saving
userSchema.pre('save', async function (next) {
    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }
    this.updated_at = new Date();
    next();
});

userSchema.methods.comparePassword = function compare(password) {
    return bcrypt.compareSync(password,this.password);
}

userSchema.methods.genJWT = function generate(){
    return jwt.sign({id: this.id, email:this.email}, 'twitter_secret', {
        expiresIn:'1h'
    });
}

module.exports = mongoose.model('User', userSchema);
