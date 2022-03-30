const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')

const MovieSchedule = require('../models/MovieSchedule')
const BookTicket = require('../models/BookTicket')
const User = require('../models/User');
const verifyTokenAdmin = require('../middleware/auth1')
const verifyToken = require('../middleware/auth0')
const ListSeatBook = require('../models/ListSeatBook')
const Seat = require('../models/Seat')
const { populate } = require('../models/User')
const Movie = require('../models/Movie')

//-------------------------------------------------
router.get('/LayDanhSachPhongVe', async (req, res) => {
    console.log("LayDanhSachPhongVe")
    if (!req.query.MaLichChieu) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Missing MaLichChieu"
            })
    }

    try {
        var list0 = new Object()
        const lichChieu = await MovieSchedule.findOne({ _id: req.query.MaLichChieu })
            .populate({
                path: 'movie'
            })
            .populate({
                path: 'cinema',
                populate: {
                    path: 'maCumRap',
                    populate: {
                        path: 'maHeThongRap'
                    }
                }
            })
        list0.maLichChieu = lichChieu._id
        list0.tenCumRap = lichChieu.cinema.maCumRap.tenCumRap
        list0.tenRap = lichChieu.cinema.tenRap
        list0.diaChi = lichChieu.cinema.maCumRap.diaChi
        list0.tenPhim = lichChieu.movie.tenPhim
        list0.hinhAnh = lichChieu.movie.hinhAnh
        var ngayChieu0 = lichChieu.ngayChieuGioChieu
        list0.ngayChieu = ngayChieu0.getDate() +"/"+ ngayChieu0.getMonth() +"/"+ ngayChieu0.getFullYear()
        list0.gioChieu = ngayChieu0.getHours() +":"+ ngayChieu0.getMinutes() +":"+ ngayChieu0.getSeconds()


        const danhSachSeatCinemas = await Seat.find({ maRap: lichChieu.cinema._id })
            .populate({
                path: "maLoaiGhe"
            })
        const condion1 = await BookTicket.find({maLichChieu: req.query.MaLichChieu}).distinct("_id")
        var list1 = new Array()
        for (let x = 0; x < danhSachSeatCinemas.length; x++) {
            const seat = danhSachSeatCinemas[x]
            const temp = new Object()
            temp.maGhe = seat._id
            temp.tenGhe = seat.tenGhe
            temp.maRap = seat.maRap
            temp.loaiGhe = seat.maLoaiGhe.tenLoaiGhe
            temp.stt = seat.stt
            const gheDat = await ListSeatBook.findOne({ maDatVe: condion1, maGhe: seat._id })
            .populate({
                path: "maDatVe",
                populate:{
                    path: "maNguoiDung"
                }
            })
            if(!gheDat){
                if(seat.maLoaiGhe.tenLoaiGhe == "Vip"){
                    temp.giaVe = lichChieu.giaVe + 15000
                }
                else{
                    temp.giaVe = lichChieu.giaVe
                    
                }
                temp.daDat = false
                temp.taiKhoanNguoiDat = null
            }
            else{
                temp.giaVe = gheDat.giaVe
                temp.daDat = gheDat.daDat
                temp.taiKhoanNguoiDat = gheDat.maDatVe.maNguoiDung.taiKhoan
            }
            list1.push(temp)
        }
        var result = new Object()
        result.thongTinPhim = list0
        result.danhSachGhe = list1

        return res
            .status(200)
            .json({
                message: "Xử lý thành công",
                content: result
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }

})

router.post('/DatVe', verifyToken, async (req, res) => {
    console.log("DatVe")
    const {
        maLichChieu,
        danhSachVe,
        taiKhoanNguoiDung
    } = req.body

    if (!maLichChieu || !danhSachVe) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Missing maLichChieu and/ or danhSachVe and/ or taiKhoanNguoiDung"
            })
    }

    try {
        const userId = await User.findOne({ _id: req.userId })
        if (!userId) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "taiKhoanNguoiDung không tồn tại"
                })
        }
        const movieScheduleId = await MovieSchedule.find({ _id: maLichChieu })
        if (!movieScheduleId) {
            return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "maLichChieu không tồn tại"
                })
        }
        const bookTicketId = await BookTicket.findOne({
            maLichChieu: maLichChieu,
            maNguoiDung: userId._id
        })
        var dateNow = Date.now()
        if (!bookTicketId) {
            const newBookTicket = new BookTicket({
                maLichChieu: maLichChieu,
                maNguoiDung: userId._id,
                ngayDat: dateNow
            })
            await newBookTicket.save()
            for (let x = 0; x < danhSachVe.length; x++) {
                const newListSeatBook = new ListSeatBook({
                    maDatVe: newBookTicket._id,
                    maGhe: danhSachVe[x].maGhe,
                    giaVe: danhSachVe[x].giaVe,
                    daDat: true
                })
                await newListSeatBook.save()
            }
        }
        else {
            const update = await BookTicket.findOneAndUpdate({_id: bookTicketId._id},{ngayDat: Date.now()},{new: true})
            for (let x = 0; x < danhSachVe.length; x++) {
                const existListSeatBook = await ListSeatBook.findOne({
                    maDatVe: bookTicketId._id,
                    maGhe: danhSachVe[x].maGhe
                })
                const newListSeatBook = new ListSeatBook({
                    maDatVe: bookTicketId._id,
                    maGhe: danhSachVe[x].maGhe,
                    giaVe: danhSachVe[x].giaVe,
                    daDat: true
                })
                if (!existListSeatBook) {
                    await newListSeatBook.save()
                }
                else{
                    const update0 = await ListSeatBook.findOneAndUpdate({_id: existListSeatBook._id},{
                        maDatVe: bookTicketId._id,
                        maGhe: danhSachVe[x].maGhe,
                        giaVe: danhSachVe[x].giaVe,
                        daDat: true
                    },{new: true})
                }
            }
        }
        return res
            .status(200)
            .json({
                message: "Xử lý thành công",
                content: "Đặt vé thành công"
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})
router.post('/TaoLichChieu', verifyTokenAdmin, async (req, res) => {
    console.log("TaoLichChieu")
    const {
        maPhim,
        ngayChieuGioChieu,
        maRap,
        giaVe
    } = req.body

    if (!maPhim || !ngayChieuGioChieu || !maRap || !giaVe) {
        return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Missing maPhim and/ or ngayChieuGioChieu, maRap and/ or giaVe"
            })
    }

    try {
        if(!(75000<=giaVe && giaVe <=200000)){
            return res
            .status(400)
            .json({
                message: "Xử lý thất bại",
                content: "Giá vé phải từ 75000 -> 200000"
            })
        }

        const regex = /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4} ([0-1]?[0-9]|2?[0-3]):([0-5]\d):([0-5]\d)$/
        if (ngayChieuGioChieu.match(regex) === null) {
            return res
                .status(200)
                .json({
                    message: "Xử lý thất bại",
                    content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy hh:mm:ss!"
                })
        }
        var ngayMMddYYYYhhmmss = new Date(
            parseInt(ngayChieuGioChieu.substring(6, 10),0),
            parseInt(ngayChieuGioChieu.substring(3, 5),0),
            parseInt(ngayChieuGioChieu.substring(0, 2),0),
            parseInt(ngayChieuGioChieu.substring(11, 13),0),
            parseInt(ngayChieuGioChieu.substring(14, 16),0),
            parseInt(ngayChieuGioChieu.substring(17, 19),0)
        )

        console.log("start"+parseInt(ngayChieuGioChieu.substring(6, 10),0))
        console.log(parseInt(ngayChieuGioChieu.substring(3, 5),0))
        console.log(parseInt(ngayChieuGioChieu.substring(0, 2),0))
        console.log(parseInt(ngayChieuGioChieu.substring(11, 13),0))
        console.log(parseInt(ngayChieuGioChieu.substring(14, 16),0))
        console.log(parseInt(ngayChieuGioChieu.substring(17, 19),0))
        
        const timePhim = await Movie.findOne({_id: maPhim}).distinct("thoiLuong")
        var start0 = new Date(ngayMMddYYYYhhmmss)
        var end0 = new Date(ngayMMddYYYYhhmmss)
        end0.setHours(ngayMMddYYYYhhmmss.getHours()+(timePhim/60))
        const movieSchedule = await MovieSchedule.find({
            maRap: maRap
        }).populate("movie")
        for (let x = 0; x < movieSchedule.length; x++) {
            const e = movieSchedule[x];
            const start1 = new Date(e.ngayChieuGioChieu)
            const condionTime0 = (start0<= start1 && start1 <= end0)
            const end1 = new Date(start1.setHours(start1.getHours()+(e.movie.thoiLuong/60))) 
            const condionTime1 = (start0<= end1 && end1 <= end0) 
            if(condionTime0 || condionTime1){
                return res
                .status(400)
                .json({
                    message: "Xử lý thất bại",
                    content: "Lịch chiếu đã bị trùng với /"+e._id+"/"+e.ngayChieuGioChieu 
                })
            }
        }
        const newMovieSchedule = new MovieSchedule({
            movie: maPhim,
            ngayChieuGioChieu: ngayMMddYYYYhhmmss,
            giaVe,
            cinema: maRap
        })
        newMovieSchedule.save()

        return res
            .status(200)
            .json({
                message: "Xử lý thành công",
                content: "Thêm lịch chiếu thành công"
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})


module.exports = router