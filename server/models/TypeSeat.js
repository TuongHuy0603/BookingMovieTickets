const mongoose = require('mongoose')
const Schema = mongoose.Schema

const TypeSeatSchema = new Schema({
    tenLoaiGhe: {
        type: String,
        required: true
    }
})

module.exports = mongoose.model('typeSeats', TypeSeatSchema)