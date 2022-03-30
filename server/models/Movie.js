const mongoose = require('mongoose')
const Schema = mongoose.Schema

const MovieSchema = new Schema({
    tenPhim: {
        type: String,
        required: true,
        unique: true
    },
    biDanh: {
        type: String
    },
    trailer: {
        type: String,
        required: true
    },
    hinhAnh: {
        type: String,
        required: true
    },
    moTa: {
        type: String,
        required: true
    },
    ngayKhoiChieu: {
        type: Date
    },
    danhGia: {
        type: Number
    },
    daXoa:{
        type: Boolean,
        default: false
    },
    thoiLuong:{
        type: Number,
        default: 120
    },
    dangChieu:{
        type: Boolean
    },
    sapChieu:{
        type: Boolean
    },
    hot:{
        type: Boolean
    }
})

module.exports = mongoose.model('movies', MovieSchema)