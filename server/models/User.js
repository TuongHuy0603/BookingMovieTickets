const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserSchema = new Schema({
    taiKhoan: {
        type: String,
        required: true,
        unique: true
    },
    hoTen: {
        type: String,
        required: true
    },
    email: {
        type: String,
        unique: true
    },
    soDt: {
        type: String,
        required: true,
        unique: true
    },
    matKhau: {
        type: String,
        required: true
    },
    dateCreated: {
        type: Date,
        default: Date.now
    },
    maLoaiNguoiDung: {
        type: Schema.Types.ObjectId,
        ref: 'userTypes'
    }
})

module.exports = mongoose.model('users', UserSchema)