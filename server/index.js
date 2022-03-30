require('dotenv').config()
const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')

const multer = require('multer');
const path = require('path');
const upload = multer();


// Cac route
const qlNguoiDungRouter = require('./routes/quanLyNguoiDung')
const qlPhimRouter = require('./routes/quanLyPhim')
const qlRapRouter = require('./routes/quanLyRap')
const qlDatVe = require('./routes/quanLyDatVe')
const qlPost = require('./routes/post')

const options = {
    autoIndex: false, // Don't build indexes
    maxPoolSize: 10, // Maintain up to 10 socket connections
    serverSelectionTimeoutMS: 5000, // Keep trying to send operations for 5 seconds
    socketTimeoutMS: 45000, // Close sockets after 45 seconds of inactivity
    family: 4 // Use IPv4, skip trying IPv6
}
// Kết nối cloud mongo db
const connectDB = async () => {
    try {
        await mongoose.connect(`mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@banverapphimwebjs.nn0hi.mongodb.net/BanVeRapPhimWebJS?retryWrites=true&w=majority`)
        console.log('MongoDB connected')
    } catch (error) {
        console.log(error.message)
        process.exit(1)
    }
}
connectDB()

const app = express()
app.use(cors())

app.use(express.json())
/*
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});
*/

app.use('/api/QuanLyNguoiDung', qlNguoiDungRouter)
app.use('/api/QuanLyPhim', qlPhimRouter)
app.use('/api/QuanLyRap', qlRapRouter)
app.use('/api/QuanLyDatVe', qlDatVe)
app.use('/api/posts', qlPost)

app.use(express.static(__dirname + '/public'));

const PORT = process.env.PORT || 5000 

app.listen(PORT, () => console.log(`Server started on port ${PORT}`))

