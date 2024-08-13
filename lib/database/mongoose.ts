// 连接到我们的mongodb数据库

import mongoose, { Mongoose } from 'mongoose'
import { cache } from 'react';

const MONGODB_URL = process.env.MONGODB_URL

interface MongooseConnection {
    conn: Mongoose | null;
    promise: Promise<Mongoose> | null;
}

let cached: MongooseConnection = (global as any).mongoose

if(!cached) {
    cached = (global as any).mongoose = {
        conn: null, promise: null
    }
}

export const connectToDatabase = async () => {
    // 检查是否连接，连接了就立即退出
    if(cached.conn) return cached.conn;

    if(!MONGODB_URL) throw new Error('MONGODB_URL is not defined');

    // 如果没有，就尝试与数据库建立新的连接
    cached.promise = cached.promise || mongoose.connect(MONGODB_URL, {
        dbName: 'imaginify', 
        bufferCommands: false
    })

    cached.conn = await cached.promise;

    return cached.conn;
}