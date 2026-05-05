const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 3,
        maxLength: 30
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: [/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Please enter a valid email"]
    },
    password: {
        type: String,
        required: function() {
            return this.provider === "email";
        },
        minLength: 8
    },
    isPasswordSet: {
        type: Boolean,
        default: false
    },
    age: {
        type: Number,
        // required: true,
        default: undefined
    },
    height: Number,
    weight: Number,
    gender: {
        type: String,
        // required: true,
        enum: ["male", "female", "other"]
    },
    location: {
        type: String,
        // required: true,
        maxLength: 100,
        default: "Not Specified"
    },
    bio: {
        type: String,
        // required: true,
        maxLength: 1000,
        default: ""
    },
    avatar: {
        url: String, // Cloudinary URL
        publicId: String // For delete/updation later
    },
    memberSince: {
        type: String,
        // required: true,
        default: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    },
    streakCount: {
        type: Number,
        default: 0
    },
    isNewUser: {
        type: Boolean,
        // required: true,
        default: true
    },
    hasHistory: {
        type: Boolean,
        // required: true,
        default: false
    },
    resetPasswordToken: {
        type: String,
        // required: true,
        default: ""
    },
    resetTokenExpiry: {
        type: Date,
        // required: true,
        default: null
    },
    provider: {
        type: String,
        required: true,
        default: "email",
        enum: ["email", "google"]
    },
    providerId: {
        type: String,
        sparse: true
        // default: "",
        // unique: true
    },
    transformationPhotos: [
        {
            url: String,
            publicId: String,
            uploadedAt: String
        }
    ]
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);