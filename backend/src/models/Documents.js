const mongoose = require('mongoose');

const documentSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User', // Reference to Users collection
        required: true
    },
    file_name: {
        type: String,
        required: true
    },
    file_url: {
        type: String,
        required: true
    },
    file_type: {
        type: String,
        enum: ["application/pdf", "image/jpeg", "image/png"], // Allowed file types
        required: true
    },
    status: {
        type: String,
        enum: ['pending', 'processed', 'redacted'],
        default: 'pending'
    },
    risk_score: {
        type: Number,
        min: 0,
        max: 100,
        default: 0
    },
    uploaded_at: {
        type: Date,
        default: Date.now
    },
    updated_at: {
        type: Date,
        default: Date.now
    }
});

// Middleware to update 'updated_at' on document update
documentSchema.pre('save', function (next) {
    this.updated_at = new Date();
    next();
});

module.exports = mongoose.model('Document', documentSchema);
