const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CinemaClusterSchema = new Schema({
    tenCumRap: {
        type: String,
        required: true,
        unique: true
    },
    hinhAnh: {
        type: String
    },
    diaChi:{
        type: String,
        required: true
    },
    maHeThongRap:{
        type: Schema.Types.ObjectId,
        ref: 'cinemaSystems',
        required: true
    }
})

module.exports = mongoose.model('cinemaClusters', CinemaClusterSchema)