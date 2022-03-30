const mongoose = require('mongoose')
const Schema = mongoose.Schema

const SeatSchema = new Schema({
    tenGhe: {
        type: String
    },
    maRap:{
        type: Schema.Types.ObjectId,
        ref:'cinemas'
    },
    maLoaiGhe:{
        type: Schema.Types.ObjectId,
        ref:'typeSeats'
    },
    stt: {
        type: String
    }
})

module.exports = mongoose.model('seats', SeatSchema)