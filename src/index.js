// require('dotenv').config({path: './env'})    // After using this the code will run smootly but there is a better approach.
import dotenv from 'dotenv';
import connectDB from './db/index.js'
import { app } from './app.js';

dotenv.config({
    path: "./env"       //The better approach for dotenv import is this.
})

connectDB()
.then(() => {
    app.on("error", (error) => {
        console.log("ERROR:",error);
        throw error;
    })
    
    app.listen(process.env.PORT || 8000, () => {
        console.log(`Server listening at localhost:${process.env.PORT}`)
    })
})
.catch((err) => {
    console.log(`ERROR while connecting MONGODB`, err)
})




// import express from "express";           // We can do this but it's good to do this in seperate file index.js at db folder.
// import mongoose from 'mongoose';
// import {DB_NAME} from './constants.js'

// const app = express()
// ;( async () => {
//     try {
//         const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)           //IIFE !!!!
//         console.log(`DB connected successfully DB host:${connectionInstance.connection.host}`)

//         app.on("error", (error) => {
//             console.log("Error", error);     //Listen for error before listening at port. Good Practice
//             throw error
//         })

//         app.listen(process.env.PORT, (error) => {
//             console.log(`Listening at localhost:${process.env.PORT}`);
//         })
//     } catch (error) {
//         console.error("Error:", error)
//     }
// }) ()
