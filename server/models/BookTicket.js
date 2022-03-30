const mongoose = require('mongoose')
const Schema = mongoose.Schema

const BookTicketSchema = new Schema({
    maLichChieu: {
        type: Schema.Types.ObjectId,
        ref: 'movieSchedules'
    },
    maNguoiDung:{
        type: Schema.Types.ObjectId,
        ref: 'users'
    },
    ngayDat:{
        type: Date,
        default: Date.now
    }
})

module.exports = mongoose.model('bookTickets', BookTicketSchema)