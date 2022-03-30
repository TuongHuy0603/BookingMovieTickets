const mongoose = require('mongoose')
const Schema = mongoose.Schema

const CinemaSchema = new Schema({
    tenRap: {
        type: String,
        required: true
    },
    maCumRap: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'cinemaClusters'
    }
})

module.exports = mongoose.model('cinemas', CinemaSchema)