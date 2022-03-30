const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CinemaSystemSchema = new Schema({
    tenHeThongRap: {
        type: String,
        required: true,
        unique: true
    },
    biDanh: {
        type: String,
        required: true
    },
    logo:{
        type: String,
        required: true
    }
})

module.exports = mongoose.model('cinemaSystems', CinemaSystemSchema)