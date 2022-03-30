const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MovieScheduleSchema = new Schema({
    movie: {
        type: Schema.Types.ObjectId,
        ref: 'movies'
    },
    ngayChieuGioChieu: {
        type: Date,
        required: true
    },
    giaVe: {
        type: Number,
        required: true
    },
    cinema:{
        type: Schema.Types.ObjectId,
        ref: 'cinemas'
    }
})

module.exports = mongoose.model('movieSchedules', MovieScheduleSchema)