const jwt = require('jsonwebtoken')
const User = require('../models/User')
const UserType = require('../models/UserType')

const verifyTokenAdmin = async (req, res, next) => {
    const authHeader = req.header('Authorization')
    const token = authHeader && authHeader.split(' ')[1]

    if (!token) {
        return res
            .status(401)
            .json({ success: false, message: 'Accesstoken not found' })
    }

    try {
        const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        req.userId = decoded.userId

        const user = await User.findOne({ _id: req.userId }).populate('maLoaiNguoiDung')
        if (user.maLoaiNguoiDung.tenLoai != "Quản trị") {
            return res
                .status(401)
                .json({ success: false, message: 'Accesstoken have not permission admin'})
        }
        next()
    } catch (error) {
        console.log(error)
        return res
            .status(403)
            .json({ success: false, message: 'Invalid token' })
    }

}

module.exports = verifyTokenAdmin