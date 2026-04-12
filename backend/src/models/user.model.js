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
        type: String,
        required: true,
        default: "https://ui-avatars.com/api/?name=John+Doe&background=random"
    },
    memberSince: {
        type: String,
        // required: true,
        default: new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
    },
    isPro: {
        type: Boolean,
        // required: true,
        default: false
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
    }
}, { timestamps: true });

module.exports = mongoose.model("User", userSchema);