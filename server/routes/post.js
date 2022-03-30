const express = require('express')
const router = express.Router()
const argon2 = require('argon2')
const jwt = require('jsonwebtoken')
const verifyToken = require('../middleware/auth1')

const Seat = require('../models/Seat')
const TypeSeat = require('../models/TypeSeat')
const UserType = require('../models/UserType')
const User = require('../models/User')
const Movie = require('../models/Movie')
const MovieSchedule = require('../models/MovieSchedule')
const Cinema = require('../models/Cinema')
const CinemaCluster = require('../models/CinemaCluster')
const CinemaSystem = require('../models/CinemaSystem')
const BookTicket = require('../models/BookTicket')


router.get('/TypeSeat/1', async (req, res) => {
    const data0 = await TypeSeat.find()
    if (data0.length > 0) {
        return res.status(200).json({ message: "Đã có data", content: data0 })
    }
    else {
        var data = new Array()
        var loaiGhe1 = new TypeSeat()
        loaiGhe1.tenLoaiGhe = "Vip"
        data.push(loaiGhe1)
        var loaiGhe2 = new TypeSeat() 
        loaiGhe2.tenLoaiGhe = "Thuong"
        data.push(loaiGhe2)
        TypeSeat.collection.insertMany(data)
        return res.status(200).json({ message: "Đã bổ sung data" })
    }
})

router.get('/Seat/1', async (req, res) => {
    //var idCinema = "621f84ae1dbca3e2bd522e24"
    //var idCinema = "621f84ae1dbca3e2bd522e24"
    //var idCinema = "621f84b31dbca3e2bd522e27"
    //var idCinema = "621f84edbea3bb3bd17157f3"
    //var idCinema = "621f84f2bea3bb3bd17157f6"
    //var idCinema = "621f855326b6a26342ff7419"
    //var idCinema = "621f855726b6a26342ff741c"
    //var idCinema = "621f857326b6a26342ff7420"
    var idCinema = "621f857826b6a26342ff7423"
    const data0 = await Seat.find({ maRap: idCinema })
    if (data0.length > 0) {
        return res.status(200).json({ message: "Đã có data", content: data0 })
    }
    else {
        var data = new Array()
        for (let x = 0; x < 160; x++) {
            var temp = new Seat()
            temp.tenGhe = (x + 1).toString()
            temp.maRap = idCinema
            const conditionGheVip =
                (35 <= (x + 1) && (x + 1) <= 46) ||
                (51 <= (x + 1) && (x + 1) <= 62) ||
                (67 <= (x + 1) && (x + 1) <= 78) ||
                (83 <= (x + 1) && (x + 1) <= 94) ||
                (99 <= (x + 1) && (x + 1) <= 110) ||
                (115 <= (x + 1) && (x + 1) <= 126)
            if (conditionGheVip) {
                // khoang ghe Vip
                temp.maLoaiGhe = "62397e0bec4a75b2cb1776af"
            }
            else {
                // khoang ghe thuong
                temp.maLoaiGhe = "62397e0bec4a75b2cb1776b0"
            }
            temp.stt = (x + 1).toString()
            data.push(temp)
        }
        Seat.collection.insertMany(data)
        return res.status(200).json({ message: "Đã bổ sung data"})
    }
})



router.post('/UserType', async (req, res) => {
    const {
        tenLoai
    } = req.body
    try {
        const newUserType = new UserType({
            tenLoai
        })
        await newUserType.save()
        return res
            .status(200)
            .json({
                success: true,
                message: 'UserType created successfully'
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.post('/Movie', async (req, res) => {

    const {
        tenPhim,
        biDanh,
        trailer,
        hinhAnh,
        moTa,
        ngayKhoiChieu,
        danhGia
    } = req.body

    try {
        // Simple validation
        if (!tenPhim || !trailer || !hinhAnh || !moTa) {
            return res
                .status(400
                    .json({
                        success: false,
                        message: 'Missing tenPhim and/or trailer and/or hinhAnh and/or moTa'
                    })
                )
        }
        // check for existing user
        const movie = await Movie.findOne({ tenPhim })
        if (movie) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'tenPhim already taken'
                })
        }
        const newMovie = new Movie({
            tenPhim,
            biDanh,
            trailer,
            hinhAnh,
            moTa,
            ngayKhoiChieu,
            danhGia
        })
        await newMovie.save()
        return res
            .status(200)
            .json({
                success: true,
                message: 'Movie created successfully'
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.post('/CinemaSystem', async (req, res) => {

    const {
        tenHeThongRap,
        biDanh,
        logo
    } = req.body

    try {
        // Simple validation
        if (!tenHeThongRap || !biDanh || !logo) {
            return res
                .status(400
                    .json({
                        success: false,
                        message: 'Missing tenHeThongRap and/or biDanh and/or logo'
                    })
                )
        }
        // check for existing user
        const cinemaSystem = await CinemaSystem.findOne({ tenHeThongRap })
        if (cinemaSystem) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'tenHeThongRap already taken'
                })
        }
        const newCinemaSystem = new CinemaSystem({
            tenHeThongRap,
            biDanh,
            logo
        })
        await newCinemaSystem.save()
        return res
            .status(200)
            .json({
                success: true,
                message: 'CinemaSystem created successfully'
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.post('/CinemaCluster', async (req, res) => {

    const {
        tenCumRap,
        hinhAnh,
        diaChi,
        maHeThongRap
    } = req.body

    try {
        // Simple validation
        if (!maHeThongRap || !diaChi || !tenCumRap) {
            return res
                .status(400
                    .json({
                        success: false,
                        message: 'Missing maHeThongRap and/or diaChi and/or tenCumRap'
                    })
                )
        }
        // check for existing user
        const cinemaCluster = await CinemaCluster.findOne({ tenCumRap })
        if (cinemaCluster) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'tenCumRap already taken'
                })
        }
        const newCinemaCluster = new CinemaCluster({
            tenCumRap,
            hinhAnh,
            diaChi,
            maHeThongRap
        })
        await newCinemaCluster.save()
        return res
            .status(200)
            .json({
                success: true,
                message: 'CinemaCluster created successfully'
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

router.post('/Cinema', async (req, res) => {

    const {
        tenRap,
        maCumRap
    } = req.body

    try {
        // Simple validation
        if (!tenRap || !maCumRap) {
            return res
                .status(400
                    .json({
                        success: false,
                        message: 'Missing tengRap and/or maCumRap'
                    })
                )
        }
        // check for existing user
        const cinema = await Cinema.findOne({ tenRap, maCumRap })
        if (cinema) {
            return res
                .status(400)
                .json({
                    success: false,
                    message: 'tenRap and maCumRap already taken'
                })
        }
        const newCinema = new Cinema({
            tenRap,
            maCumRap
        })
        await newCinema.save()
        return res
            .status(200)
            .json({
                success: true,
                message: 'Cinema created successfully'
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})

//------------------------------------------------------
router.post('/MovieSchedule', async (req, res) => {

    const {
        movie,
        ngayChieuGioChieu,
        giaVe,
        cinema,
        thoiLuong
    } = req.body

    try {

        const newMovieSchedule = new MovieSchedule({
            movie,
            ngayChieuGioChieu,
            giaVe,
            cinema,
            thoiLuong
        })
        await newMovieSchedule.save()
        return res
            .status(200)
            .json({
                success: true,
                message: 'MovieSchedule created successfully'
            })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Intenal server error' })
    }
})



module.exports = router