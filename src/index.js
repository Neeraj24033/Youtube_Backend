// require('dotenv').config({path: './env'})
import dotenv from 'dotenv';
import connectDB from './db/index.js'


dotenv.config({
    path: "./env"
})

connectDB();

// import express from "express";           // We can do this but it's good to do this in seperate file index.js at db folder.
// import mongoose from 'mongoose';
// import {DB_NAME} from './constants.js'

// const app = express()
// ;( async () => {
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)           //IIFE !!!!
//         console.log(`DB connected successfully DB host:${connectionInstance.connection.host}`)
//         app.on("error", (error) => {
//             console.log("Error", error);
//             throw error
//         })

//         app.listen(process.env.PORT, (error) => {
//             console.log(`Listening at localhost:${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error("Error:", error)
//     }
// }) ()
