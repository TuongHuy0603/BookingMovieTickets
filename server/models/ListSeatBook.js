const mongoose = require('mongoose')
const Schema = mongoose.Schema

const ListSeatBookSchema = new Schema({
    maDatVe: {
        type: Schema.Types.ObjectId,
        ref: 'bookTickets'
    },
    maGhe:{
        type: Schema.Types.ObjectId,
        ref: 'seats'
    },
    giaVe:{
        type: Number,
        required: true
    },
    daDat:{
        type: Boolean,
        default: true
    }
})

module.exports = mongoose.model('listSeatBooks', ListSeatBookSchema)