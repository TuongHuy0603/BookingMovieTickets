const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const User = require('../models/User')
const UserType = require('../models/UserType')
const verifyTokenAdmin = require('../middleware/auth1')
const verifyToken = require('../middleware/auth0')
const BookTicket = require('../models/BookTicket')
const ListSeatBook = require('../models/ListSeatBook')


//-------------------------------------------------
router.get('/LayDanhSachLoaiNguoiDung', async (req, res) => {
    console.log("LayDanhSachLoaiNguoiDung")
    try {
        const listUserTypes = await UserType.find({})
        var listJsonResult = new Array();
        listUserTypes.forEach(
            (element) => {
                listJsonResult.push(
                    {
                        maLoaiNguoiDung: element._id,
                        tenLoai: element.tenLoai
                    }
                )
            }
        )

        return res.
            status(200)
            .json({
                message: "Xử lý thành công",
                content: listJsonResult
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.post('/DangNhap', async (req, res) => {
    const { taiKhoan, matKhau } = req.body

    console.log("DangNhap")

    //Simple validation
    if (!taiKhoan || !matKhau) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Missing taiKhoan and/ or matKhau"
            })
    }

    try {
        // Check for existing user 
        const user = await User.findOne({ taiKhoan })
        if (!user) {
            return res
                .status(500)
                .json({
                    message: "Xử lý thất bại",
                    content: "Tài khoản hoặc mật khẩu không đúng!"
                })
        }

        // compare argon2 decryption
        const passwordValid = (user.matKhau == matKhau)

        if (!passwordValid) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "Tài khoản hoặc mật khẩu không đúng!"
                })

        }

        // All good
        // Return token
        const accessToken = jwt.sign({ userId: user._id }, process.env.ACCESS_TOKEN_SECRET)

        var jsonResult = {
            taiKhoan: user.taiKhoan,
            hoTen: user.hoTen,
            email: user.email,
            soDT: user.soDt,
            maLoaiNguoiDung: user.maLoaiNguoiDung,
            accessToken: accessToken
        }
        return res
            .status(200)
            .json({
                message: "Xử lý thành công",
                content: jsonResult
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.post('/DangKy', async (req, res) => {
    console.log("DangKy")
    const {
        taiKhoan,
        hoTen,
        email,
        soDt,
        matKhau
    } = req.body

    // Simple validation
    if (!taiKhoan || !matKhau) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Missing taiKhoan and/or matKhau"
            })
    }

    if (!hoTen || !soDt || !email) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Missing hoTen and/or soDt and/or email"
            })
    }

    try {
        // check for existing user TaiKhoan
        const user0 = await User.findOne({ taiKhoan })
        if (user0) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "Tài khoản đã được đăng ký"
                })
        }
        // check for existing user So dien thoai
        const user1 = await User.findOne({ soDt })
        if (user1) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "Số điện thoại đã được đăng ký"
                })
        }
        // check for existing user email
        const user2 = await User.findOne({ email })
        if (user2) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "Email đã được đăng ký"
                })
        }

        // All good
        const hashedPassword = matKhau
        const newUser = new User({
            taiKhoan,
            hoTen,
            email,
            soDt,
            matKhau: hashedPassword,
            maLoaiNguoiDung: "621e157542c18eb1e10d3272"
        })
        await newUser.save()

        var jsonResult = {
            taiKhoan: newUser.taiKhoan,
            matKhau: newUser.matKhau,
            email: newUser.email,
            soDt: newUser.soDt,
            maLoaiNguoiDung: newUser.maLoaiNguoiDung,
            hoTen: newUser.hoTen
        }

        return res
            .status(200)
            .json({
                message: "Xử lý thành công",
                content: jsonResult
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.get('/LayDanhSachNguoiDung', async (req, res) => {
    console.log("LayDanhSachNguoiDung")
    try {
        if (req.query.tuKhoa != null) {
            const listUsers = await User.find(
                {
                    $or: [
                        {
                            taiKhoan:
                            {
                                $regex: '.*' + req.query.tuKhoa + '.*',
                                $options: 'i'
                            }
                        },
                        { hoTen: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } },
                        { email: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } },
                        { soDt: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } },
                        { matKhau: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } }
                    ]
                }
            )
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: listUsers
                })
        }
        else {
            const listUsers = await User.find()
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: listUsers
                })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.get('/LayDanhSachNguoiDungPhanTrang', async (req, res) => {
    console.log("LayDanhSachNguoiDungPhanTrang")
    try {
        if (req.query.soPhanTuTrenTrang == null) {
            req.query.soPhanTuTrenTrang = 1
        }
        if (req.query.soTrang == null) {
            req.query.soTrang = 1
        }
        if (req.query.tuKhoa != null) {
            const listUsers = await User
                .find(
                    {
                        $or: [
                            {
                                taiKhoan:
                                {
                                    $regex: '.*' + req.query.tuKhoa + '.*',
                                    $options: 'i'
                                }
                            },
                            { hoTen: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } },
                            { email: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } },
                            { soDt: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } },
                            { matKhau: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } }
                        ]
                    }
                )
                .limit(req.query.soPhanTuTrenTrang)
                .skip((req.query.soTrang - 1) * req.query.soPhanTuTrenTrang)
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: listUsers
                })
        }
        else {
            const listUsers = await User
                .find()
                .limit(req.query.soPhanTuTrenTrang)
                .skip((req.query.soTrang - 1) * req.query.soPhanTuTrenTrang)
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: listUsers
                })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})


router.get('/TimKiemNguoiDung', async (req, res) => {
    console.log("TimKiemNguoiDung")
    try {
        if (req.query.tuKhoa != null) {
            const listUsers = await User.find(
                {
                    $or: [
                        {
                            taiKhoan:
                            {
                                $regex: '.*' + req.query.tuKhoa + '.*',
                                $options: 'i'
                            }
                        },
                        { hoTen: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } },
                        { email: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } },
                        { soDt: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } },
                        { matKhau: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } }
                    ]
                }
            )
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: listUsers
                })
        }
        else {
            const listUsers = await User.find()
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: listUsers
                })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.get('/TimKiemNguoiDungPhanTrang', async (req, res) => {
    console.log("TimKiemNguoiDungPhanTrang")
    try {
        if (req.query.soPhanTuTrenTrang == null) {
            req.query.soPhanTuTrenTrang = 1
        }
        if (req.query.soTrang == null) {
            req.query.soTrang = 1
        }
        if (req.query.tuKhoa != null) {
            const listUsers = await User
                .find(
                    {
                        $or: [
                            {
                                taiKhoan:
                                {
                                    $regex: '.*' + req.query.tuKhoa + '.*',
                                    $options: 'i'
                                }
                            },
                            { hoTen: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } },
                            { email: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } },
                            { soDt: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } },
                            { matKhau: { $regex: '.*' + req.query.tuKhoa + '.*', $options: 'i' } }
                        ]
                    }
                )
                .limit(req.query.soPhanTuTrenTrang)
                .skip((req.query.soTrang - 1) * req.query.soPhanTuTrenTrang)
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: listUsers
                })
        }
        else {
            const listUsers = await User
                .find()
                .limit(req.query.soPhanTuTrenTrang)
                .skip((req.query.soTrang - 1) * req.query.soPhanTuTrenTrang)
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: listUsers
                })
        }

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.post('/ThongTinTaiKhoan', async (req, res) => {
    console.log("ThongTinTaiKhoan")
    const {
        taiKhoan
    } = req.body
    if (!taiKhoan) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Missing taiKhoan"
            })
    }

    // check for existing user TaiKhoan
    const user = await User.findOne({ taiKhoan }).populate("maLoaiNguoiDung")
    if (!user) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Tài khoản không tồn tại"
            })
    }
    console.log(req.body)
    try {
        var thongTinDatVe = new Array()
        const bookTickets = await BookTicket.find({ maNguoiDung: user._id })
            .populate({
                path: "maLichChieu",
                populate: {
                    path: "movie"
                }
            })
        console.log(0)
        for (let x = 0; x < bookTickets.length; x++) {
            const element = bookTickets[x];
            const listSeatBooks = await ListSeatBook.find({ maDatVe: element._id })
                .populate({
                    path: "maGhe",
                    populate: {
                        path: "maRap",
                        populate: {
                            path: "maCumRap",
                            populate: {
                                path: "maHeThongRap"
                            }
                        }
                    }
                })
            var newArray = new Array()
            for (let y = 0; y < listSeatBooks.length; y++) {
                const e = listSeatBooks[y];
                newArray.push({
                    maHeThongRap: e.maGhe.maRap.maCumRap.maHeThongRap._id,
                    tenHeThongRap: e.maGhe.maRap.maCumRap.maHeThongRap.tenHeThongRap,
                    maCumRap: e.maGhe.maRap.maCumRap._id,
                    tenCumRap: e.maGhe.maRap.maCumRap.tenCumRap,
                    maRap: e.maGhe.maRap._id,
                    tenRap: e.maGhe.maRap.tenRap,
                    maGhe: e.maGhe._id,
                    tenGhe: e.maGhe.tenGhe
                })
            }

            thongTinDatVe.push({
                maVe: element._id,
                ngayDat: element.ngayDat,
                tenPhim: element.maLichChieu.movie.tenPhim,
                giaVe: element.maLichChieu.giaVe,
                thoiLuongPhim: element.maLichChieu.movie.thoiLuong,
                danhSachGhe: newArray
            })
        }
        console.log(1)
        var dataResponse = new Object()
        dataResponse.taiKhoan = user.taiKhoan
        dataResponse.matKhau = user.matKhau
        dataResponse.hoTen = user.hoTen
        dataResponse.email = user.email
        dataResponse.soDT = user.soDT
        dataResponse.loaiNguoiDung = user.maLoaiNguoiDung.tenLoai
        dataResponse.thongTinDatVe = thongTinDatVe

        return res
            .status(200)
            .json({
                message: "Xử lý thành công",
                content: dataResponse
            })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }

})

router.get('/ThemNguoiDung', verifyTokenAdmin, async (req, res) => {
    console.log("ThemNguoiDung")
    const {
        taiKhoan,
        hoTen,
        email,
        soDt,
        matKhau,
        maLoaiNguoiDung
    } = req.body

    // Simple validation
    if (!taiKhoan || !matKhau) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Missing taiKhoan and/or matKhau"
            })
    }

    if (!hoTen || !email || !maLoaiNguoiDung) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Missing hoTen and/or email and/or maLoaiNguoiDung"
            })
    }

    try {
        // check for existing user TaiKhoan
        const user0 = await User.findOne({ taiKhoan })
        if (user0) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "Tài khoản đã được đăng ký"
                })
        }
        // check for existing user So dien thoai
        const user1 = await User.findOne({ soDt })
        if (user1) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "Số điện thoại đã được đăng ký"
                })
        }
        // check for existing user email
        const user2 = await User.findOne({ email })
        if (user2) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "Email đã được đăng ký"
                })
        }

        // All good
        const hashedPassword = matKhau

        const newUser = new User({
            taiKhoan,
            hoTen,
            email,
            soDt,
            matKhau: hashedPassword,
            maLoaiNguoiDung
        })
        await newUser.save()

        var jsonResult = {
            taiKhoan: newUser.taiKhoan,
            matKhau: newUser.matKhau,
            email: newUser.email,
            soDt: newUser.soDt,
            maLoaiNguoiDung: newUser.maLoaiNguoiDung,
            hoTen: newUser.hoTen
        }

        return res
            .status(200)
            .json({
                message: "Xử lý thành công",
                content: jsonResult
            })

    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.get('/CapNhatThongTinNguoiDung', verifyToken, async (req, res) => {
    console.log("CapNhatThongTinNguoiDung")
    const {
        taiKhoan,
        hoTen,
        email,
        soDt,
        matKhau,
        maLoaiNguoiDung
    } = req.body

    // Simple validation
    if (!taiKhoan || !matKhau) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Missing taiKhoan and/or matKhau"
            })
    }

    if (!hoTen || !email || !maLoaiNguoiDung) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Missing hoTen and/or email and/or maLoaiNguoiDung"
            })
    }

    try {

        // check for existing user TaiKhoan
        const user0 = await User.findOne({ taiKhoan })
        if (user0) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "Tài khoản đã được đăng ký"
                })
        }
        // check for existing user So dien thoai
        const user1 = await User.findOne({ soDt })
        if (user1) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "Số điện thoại đã được đăng ký"
                })
        }
        // check for existing user email
        const user2 = await User.findOne({ email })
        if (user2) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "Email đã được đăng ký"
                })
        }

        // All good
        const hashedPassword = matKhau
        const userUpdated = await User.findOneAndUpdate(
            { _id: req.userId },
            {
                taiKhoan,
                hoTen,
                email,
                soDt,
                matKhau: hashedPassword,
                maLoaiNguoiDung
            }
            , { new: true })

        if (!userUpdated) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'User not found or user not authorised'
                })
        }
        else {
            var jsonResult = {
                taiKhoan,
                matKhau,
                email,
                soDt,
                maLoaiNguoiDung,
                hoTen,
                thongTinDatVe: null
            }

            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: jsonResult
                })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.delete('/XoaNguoiDung', verifyTokenAdmin, async (req, res) => {
    console.log("XoaNguoiDung")
    try {
        const taiKhoan = req.query.TaiKhoan
        const userdeleted = await Movie.findOneAndDelete({ taiKhoan: taiKhoan })
        if (!userdeleted) {
            return res
                .status(401)
                .json({
                    success: false,
                    message: 'User not found or user not authorised or user book ticket'
                })
        }
        else {
            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: "Xóa thành công !"
                })
        }
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})


module.exports = router