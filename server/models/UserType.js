const mongoose = require('mongoose')
const Schema = mongoose.Schema

const UserTypeSchema = new Schema({
    tenLoai: {
        type: String,
        required: true,
        unique: true
    }
})

module.exports = mongoose.model('userTypes', UserTypeSchema)