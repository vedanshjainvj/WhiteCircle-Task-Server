// -------------------- PACKAGE IMPORT FILES -------------------- //
import mongoose from "mongoose"
import { envProvider } from "../constants.js"

mongoose.connection.on('connecting', () => {
    console.log('db connecting, Status:', mongoose.connection.readyState)
})
mongoose.connection.on('connected', () => {
    console.log('db connected, Status:', mongoose.connection.readyState)
})
mongoose.connection.on('disconnecting', () => {
    console.log('db disconnecting, Status:', mongoose.connection.readyState)
})
mongoose.connection.on('disconnected', () => {
    console.log('db disconnected, Status:', mongoose.connection.readyState)
})

export const connectDB = async () => {
    try {
        const db = await mongoose.connect(envProvider.DB_URI, {
            dbName: "whitecircleTask",
        })
        return db
    } catch (error) {
        throw new Error(error)
    }
}