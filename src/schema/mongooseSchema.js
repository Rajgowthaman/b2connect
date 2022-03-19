const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
    firstName: String,
    lastName: String,
    email: String,
    password: { type: String },
    displayName: String,
    role: String,
    created: {
        type: Date,
        default: Date.now
    },
    updated: {
        type: Date,
        default: Date.now
    }
});
exports.users = mongoose.model("user", userSchema);

const sessionSchema = mongoose.Schema({
    appGuid: String,
    email: String,
    role: String,
    accessTokenRandomValue: String,
    refreshTokenRandomValue: String,
    loginTime: {
        type: Date,
        default: Date.now
    },
    accessTime: {
        type: Date,
        default: Date.now
    }
});
exports.sessions = mongoose.model("session", sessionSchema);