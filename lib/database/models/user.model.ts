import { Schema, model, models } from "mongoose";

// clerkId, email, username, photo, firstName, lastName, planId, creditBalance
const UserSchema = new Schema({
    clerkId: {
        type: String,
        // 必填项
        required: true,
        // 唯一性
        unique: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    username: {
        type: String,
        required: true,
        unique: true,
    },
    photo: {
        type: String,
        required: String
    },
    firstName: {
        type: String,
    },
    lastName: {
        type: String,
    },
    planId: {
        type: Number,
        // 默认值
        default: 1,
    },
    createBalance: {
        type: Number,
        default: 10,
    },
})

const User = models?.User || model("User", UserSchema);

export default User