"use server";
import User from "../database/models/user.model";
import { connectToDatabase } from "../database/mongoose";
import { handleError } from "../utils";

 // This is a server action

// CREATE
export async function createUser(user: CreateUserParams) {
    try {
        // 连接到数据库
        await connectToDatabase();

        // 创建用户
        const newUser = await User.create(user);

        // 返回新创建的用户
        return JSON.parse(JSON.stringify(newUser));
    } catch (error) {
        // 处理错误
        handleError(error);
    }
}

// READ
export async function getUserById(userId: string) {
    try {
        // 连接到数据库
        await connectToDatabase();

        // 查找用户
        const user = await User.findOne({ clerkId: userId });

        // 如果用户不存在, 抛出错误
        if(!user) throw new Error("User not found");

        // 返回用户
        return JSON.parse(JSON.stringify(user));
    } catch (error) {
        // 处理错误
        handleError(error);
    }
}

// UPDATE
export async function updateUser(clerkId: string, user: UpdateUserParams) {
    try {
        // Connect to the database
        await connectToDatabase();

        // 查找用户并更新用户
        const updateUser = await User.findOneAndUpdate({ clerkId }, user, { new: true });

        // 如果用户不存在, 抛出错误
        if (!updateUser) throw new Error("User update failed");

        // 返回更新后的用户
        return JSON.parse(JSON.stringify(updateUser));
    } catch (error) {
        // 处理错误
        handleError(error);
    }
}

// DELETE
export async function deleteUser(clerkId: string) {
    try {
        // 连接到数据库
        await connectToDatabase();

        // 查找用户并删除用户
        const userToDelete = await User.findOne({clerkId});

        // 如果用户不存在, 抛出错误
        if(!userToDelete) {
            throw new Error("User not found");
        }

        // 删除用户
        const deletedUser = await User.findByIdAndDelete(userToDelete._id);

        // 返回删除后的用户或null
        return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null;
    } catch (error) {
        // 处理错误
        handleError(error);
    }
}




