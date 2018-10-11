import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    tokens: {
        activation: [{
            type: String,
            default: [],
        }],
        passwordReset: [{
            type: String,
            default: [],
        }],
    },
    admin: {
        type: Boolean,
        default: false,
    },
    details: {
        firstName: String,
        lastName: String,
    }
});

export {
    userSchema,
};
