const express = require("express");
const mongoose = require('mongoose')
const cors = require('cors');
const authRouter = require('./authRouter')
require('dotenv').config()

const app = express()
app.use(express.json())
app.use(cors());
app.use('/auth', authRouter)

const start = async () => {
    try {
        await mongoose.connect(process.env.DB_URL, {useUnifiedTopology: true});
        app.listen(process.env.PORT, () => console.log(`server started at ${process.env.PORT}`))
    } catch(e) {
        console.log(e);
    }
}

start()