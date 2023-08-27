import mongoose from "mongoose";

export const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Please Provide Unique Username"],
        unique: [true, "Username Exists"]
    },
    password: {
        type: String,
        required: [true, "Please Provide a Password"],
        unique: false,
        select: false
    },
    email: {
        type: String,
        required: [true, "Please Provide Unique Email"],
        unique: true,
    },
    firstName: String,
    lastName: String,
    mobile: Number,
    address: String,
    profile: String
});

export default mongoose.model.Users || mongoose.model('User', UserSchema);