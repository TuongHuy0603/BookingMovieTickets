require("dotenv").config();
const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");
const verifyTokenAdmin = require("../middleware/auth1");
//const fs = require('node:fs')
//const buffer = require('node:buffer')

const Movie = require("../models/Movie");
const MovieSchedule = require("../models/MovieSchedule");
const CinemaCluster = require("../models/CinemaCluster");
const UserType = require("../models/UserType");

//-------------------------------------------------
router.get("/LayDanhSachPhim", async (req, res) => {
  console.log("LayDanhSachPhim");
  try {
    const movies = await Movie.find({ daXoa: false });
    var movies0 = movies.map(function (model) {
      return model.toObject();
    });
    var listJsonRespone = new Array();
    //var link = "http://localhost:5000/"+goc
    for (let x = 0; x < movies0.length; x++) {
      const e = movies0[x];
      /*
            var goc = e.hinhAnh
            //console.log(e.hinhAnh)
            if (goc.substring(0, 8) == "https://" || goc.substring(0, 7) == "http://") {
                link0 = goc
            }
            else {
                link0 = process.env.HTTPSERVER + process.env.PORT + "/" + goc.substring(7, goc.length)
            }*/
      listJsonRespone.push({
        maPhim: e._id,
        tenPhim: e.tenPhim,
        biDanh: e.biDanh,
        trailer: e.trailer,
        hinhAnh: e.hinhAnh,
        moTa: e.moTa,
        ngayKhoiChieu: e.ngayKhoiChieu,
        danhGia: e.danhGia,
      });
    }

    return res.status(200).json({
      message: "Xử lý thành công",
      content: listJsonRespone,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Intenal server error" });
  }
});

router.get("/LayDanhSachPhimPhanTrang", async (req, res) => {
  console.log("LayDanhSachPhimPhanTrang");
  try {
    if (req.query.soPhanTuTrenTrang == null) {
      req.query.soPhanTuTrenTrang = 2;
    }
    if (req.query.soTrang == null) {
      req.query.soTrang = 1;
    }
    if (req.query.tenPhim) {
      const list = await Movie.find({
        tenPhim: {
          $regex: ".*" + req.query.tenPhim + ".*",
          $options: "i",
        },
        daXoa: false,
      });
      var start = (req.query.soTrang - 1) * req.query.soPhanTuTrenTrang;
      var end =
        list.length > start + req.query.soPhanTuTrenTrang
          ? start + req.query.soPhanTuTrenTrang
          : list.length;
      var jsonRespone = new Object();
      jsonRespone.currentPage = req.query.soTrang;
      jsonRespone.count = list.slice(start, end).length;
      jsonRespone.totalPages = parseInt(
        list.length % req.query.soPhanTuTrenTrang != 0
          ? list.length / req.query.soPhanTuTrenTrang + 1
          : list.length / req.query.soPhanTuTrenTrang
      );
      jsonRespone.totalCount = list.length;
      var newArray = new Array();
      list.slice(start, end).forEach((e) => {
        newArray.push({
          maPhim: e._id,
          tenPhim: e.tenPhim,
          biDanh: e.biDanh,
          trailer: e.trailer,
          hinhAnh: e.hinhAnh,
          moTa: e.moTa,
          ngayKhoiChieu: e.ngayKhoiChieu,
          danhGia: e.danhGia,
        });
      });
      jsonRespone.items = newArray;
      return res.status(200).json({
        message: "Xử lý thành công",
        content: jsonRespone,
      });
    } else {
      const list = await Movie.find({ daXoa: false });
      var start = (req.query.soTrang - 1) * req.query.soPhanTuTrenTrang;
      var end =
        list.length > start + req.query.soPhanTuTrenTrang
          ? start + req.query.soPhanTuTrenTrang
          : list.length;
      var jsonRespone = new Object();
      jsonRespone.currentPage = req.query.soTrang;
      jsonRespone.count = list.slice(start, end).length;
      jsonRespone.totalPages = parseInt(
        list.length % req.query.soPhanTuTrenTrang != 0
          ? list.length / req.query.soPhanTuTrenTrang + 1
          : list.length / req.query.soPhanTuTrenTrang
      );
      jsonRespone.totalCount = list.length;
      var newArray = new Array();
      list.slice(start, end).forEach((e) => {
        newArray.push({
          maPhim: e._id,
          tenPhim: e.tenPhim,
          biDanh: e.biDanh,
          trailer: e.trailer,
          hinhAnh: e.hinhAnh,
          moTa: e.moTa,
          ngayKhoiChieu: e.ngayKhoiChieu,
          danhGia: e.danhGia,
        });
      });
      jsonRespone.items = newArray;
      return res.status(200).json({
        message: "Xử lý thành công",
        content: jsonRespone,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Intenal server error" });
  }
});

router.get("/LayDanhSachPhimTheoNgay", async (req, res) => {
  console.log("LayDanhSachPhimTheoNgay");
  try {
    if (req.query.soPhanTuTrenTrang == null) {
      req.query.soPhanTuTrenTrang = 2;
    }
    if (req.query.soTrang == null) {
      req.query.soTrang = 1;
    }
    if (req.query.tenPhim) {
      var list, start0, end0;
      if (req.query.tuNgay) {
        const regex =
          /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
        if (req.query.tuNgay.match(regex) === null) {
          return res.status(200).json({
            message: "Xử lý thất bại",
            content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy !",
          });
        }
        start0 = new Date(
          parseInt(req.query.tuNgay.substring(6, 10), 0),
          parseInt(req.query.tuNgay.substring(3, 5), 0),
          parseInt(req.query.tuNgay.substring(0, 2), 0)
        );
      } else {
        start0 = new Date();
      }
      if (req.query.denNgay) {
        const regex =
          /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
        if (req.query.denNgay.match(regex) === null) {
          return res.status(200).json({
            message: "Xử lý thất bại",
            content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy !",
          });
        }
        end0 = new Date(
          parseInt(req.query.denNgay.substring(6, 10), 0),
          parseInt(req.query.denNgay.substring(3, 5), 0),
          parseInt(req.query.denNgay.substring(0, 2), 0)
        );

        list = await Movie.find({
          tenPhim: {
            $regex: ".*" + req.query.tenPhim + ".*",
            $options: "i",
          },
          ngayKhoiChieu: {
            $gte: start0,
            $lte: end0,
          },
          daXoa: false,
        });
      } else {
        list = await Movie.find({
          tenPhim: {
            $regex: ".*" + req.query.tenPhim + ".*",
            $options: "i",
          },
          ngayKhoiChieu: {
            $gte: start0,
          },
          daXoa: false,
        });
      }

      var start = (req.query.soTrang - 1) * req.query.soPhanTuTrenTrang;
      var end =
        list.length > start + req.query.soPhanTuTrenTrang
          ? start + req.query.soPhanTuTrenTrang
          : list.length;
      var jsonRespone = new Object();
      jsonRespone.currentPage = req.query.soTrang;
      jsonRespone.count = list.slice(start, end).length;
      jsonRespone.totalPages = parseInt(
        list.length % req.query.soPhanTuTrenTrang != 0
          ? list.length / req.query.soPhanTuTrenTrang + 1
          : list.length / req.query.soPhanTuTrenTrang
      );
      jsonRespone.totalCount = list.length;
      var newArray = new Array();
      list.slice(start, end).forEach((e) => {
        newArray.push({
          maPhim: e._id,
          tenPhim: e.tenPhim,
          biDanh: e.biDanh,
          trailer: e.trailer,
          hinhAnh: e.hinhAnh,
          moTa: e.moTa,
          ngayKhoiChieu: e.ngayKhoiChieu,
          danhGia: e.danhGia,
        });
      });
      jsonRespone.items = newArray;
      return res.status(200).json({
        message: "Xử lý thành công",
        content: newArray,
      });
    } else {
      var list, start0, end0;
      if (req.query.tuNgay) {
        const regex =
          /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
        if (req.query.tuNgay.match(regex) === null) {
          return res.status(200).json({
            message: "Xử lý thất bại",
            content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy !",
          });
        }
        start0 = new Date(
          parseInt(req.query.tuNgay.substring(6, 10), 0),
          parseInt(req.query.tuNgay.substring(3, 5), 0),
          parseInt(req.query.tuNgay.substring(0, 2), 0)
        );
      } else {
        start0 = new Date();
      }
      if (req.query.denNgay) {
        const regex =
          /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
        if (req.query.denNgay.match(regex) === null) {
          return res.status(200).json({
            message: "Xử lý thất bại",
            content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy !",
          });
        }
        end0 = new Date(
          parseInt(req.query.denNgay.substring(6, 10), 0),
          parseInt(req.query.denNgay.substring(3, 5), 0),
          parseInt(req.query.denNgay.substring(0, 2), 0)
        );

        list = await Movie.find({
          tenPhim: {
            $regex: ".*" + req.query.tenPhim + ".*",
            $options: "i",
          },
          ngayKhoiChieu: {
            $gte: start0,
            $lte: end0,
          },
          daXoa: false,
        });
      } else {
        list = await Movie.find({
          tenPhim: {
            $regex: ".*" + req.query.tenPhim + ".*",
            $options: "i",
          },
          ngayKhoiChieu: {
            $gte: start0,
          },
          daXoa: false,
        });
      }

      var start = (req.query.soTrang - 1) * req.query.soPhanTuTrenTrang;
      var end =
        list.length > start + req.query.soPhanTuTrenTrang
          ? start + req.query.soPhanTuTrenTrang
          : list.length;
      var jsonRespone = new Object();
      jsonRespone.currentPage = req.query.soTrang;
      jsonRespone.count = list.slice(start, end).length;
      jsonRespone.totalPages = parseInt(
        list.length % req.query.soPhanTuTrenTrang != 0
          ? list.length / req.query.soPhanTuTrenTrang + 1
          : list.length / req.query.soPhanTuTrenTrang
      );
      jsonRespone.totalCount = list.length;
      var newArray = new Array();
      list.slice(start, end).forEach((e) => {
        newArray.push({
          maPhim: e._id,
          tenPhim: e.tenPhim,
          biDanh: e.biDanh,
          trailer: e.trailer,
          hinhAnh: e.hinhAnh,
          moTa: e.moTa,
          ngayKhoiChieu: e.ngayKhoiChieu,
          danhGia: e.danhGia,
        });
      });
      jsonRespone.items = newArray;
      return res.status(200).json({
        message: "Xử lý thành công",
        content: newArray,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Intenal server error" });
  }
});
router.post("/ThemPhim", verifyTokenAdmin, async (req, res) => {
  console.log("ThemPhim");
  const { tenPhim, biDanh, trailer, hinhAnh, moTa, ngayKhoiChieu, danhGia } =
    req.body;
  try {
    // Simple validation
    if (!tenPhim) {
      return res.status(400).json({
        success: false,
        message: "Missing tenPhim",
      });
    }
    // check for existing user
    const movie = await Movie.findOne({ tenPhim, daXoa: false });
    if (movie) {
      return res.status(400).json({
        success: false,
        message: "tenPhim already taken",
      });
    }

    const regex =
      /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    if (ngayKhoiChieu.match(regex) === null) {
      return res.status(200).json({
        message: "Xử lý thất bại",
        content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy !",
      });
    }
    var ngayMMddYYYY = new Date(
      parseInt(ngayKhoiChieu.substring(6, 10), 0),
      parseInt(ngayKhoiChieu.substring(3, 5), 0),
      parseInt(ngayKhoiChieu.substring(0, 2), 0)
    );

    const regexHinhAnh = /[^"']+\.(?:(?:pn|jpe?)g|gif)\b/;
    if (hinhAnh.match(regexHinhAnh) === null) {
      return res.status(200).json({
        message: "Xử lý thất bại",
        content: "Link hình ảnh không hợp lệ, định dạng là png,jpg,jpeg,gif !",
      });
    }

    const newMovie = new Movie({
      tenPhim,
      biDanh,
      trailer,
      hinhAnh,
      moTa,
      ngayKhoiChieu: ngayMMddYYYY,
      danhGia,
      daXoa,
      thoiLuong,
    });
    await newMovie.save();

    var result = new Object();
    result.maPhim = newMovie._id;
    result.tenPhim = newMovie.tenPhim;
    result.biDanh = newMovie.biDanh;
    result.trailer = newMovie.trailer;
    result.hinhAnh = newMovie.hinhAnh;
    result.moTa = newMovie.moTa;
    result.ngayKhoiChieu = newMovie.ngayKhoiChieu;
    result.danhGia = newMovie.danhGia;
    result.daXoa = newMovie.daXoa;

    return res.status(200).json({
      message: "Xử lý thành công",
      content: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Intenal server error" });
  }
});

router.post("/CapNhatPhim", verifyTokenAdmin, async (req, res) => {
  console.log("CapNhatPhim");
  const { tenPhim, biDanh, trailer, hinhAnh, moTa, ngayKhoiChieu, danhGia } =
    req.body;
  try {
    // Simple validation
    if (!tenPhim) {
      return res.status(
        (400).json({
          success: false,
          message: "Missing tenPhim",
        })
      );
    }
    // check for existing user
    const movie = await Movie.findOne({ tenPhim, daXoa: false });
    if (movie) {
      return res.status(400).json({
        success: false,
        message: "tenPhim already taken",
      });
    }

    const regex =
      /^(0?[1-9]|[12][0-9]|3[01])[\/\-](0?[1-9]|1[012])[\/\-]\d{4}$/;
    if (ngayKhoiChieu.match(regex) === null) {
      return res.status(200).json({
        message: "Xử lý thất bại",
        content: "Ngày không hợp lệ, Ngày có định dạng dd/MM/yyyy !",
      });
    }
    var ngayMMddYYYY = new Date(
      parseInt(ngayKhoiChieu.substring(6, 10), 0),
      parseInt(ngayKhoiChieu.substring(3, 5), 0),
      parseInt(ngayKhoiChieu.substring(0, 2), 0)
    );

    const regexHinhAnh = /[^"']+\.(?:(?:pn|jpe?)g|gif)\b/;
    if (hinhAnh.match(regexHinhAnh) === null) {
      return res.status(200).json({
        message: "Xử lý thất bại",
        content: "Link hình ảnh không hợp lệ, định dạng là png,jpg,jpeg,gif !",
      });
    }

    const newMovie = new Movie({
      tenPhim,
      biDanh,
      trailer,
      hinhAnh,
      moTa,
      ngayKhoiChieu: ngayMMddYYYY,
      danhGia,
      daXoa,
      thoiLuong,
    });
    await newMovie.save();

    var result = new Object();
    result.maPhim = newMovie._id;
    result.tenPhim = newMovie.tenPhim;
    result.biDanh = newMovie.biDanh;
    result.trailer = newMovie.trailer;
    result.hinhAnh = newMovie.hinhAnh;
    result.moTa = newMovie.moTa;
    result.ngayKhoiChieu = newMovie.ngayKhoiChieu;
    result.danhGia = newMovie.danhGia;
    result.daXoa = newMovie.daXoa;

    return res.status(200).json({
      message: "Xử lý thành công",
      content: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Intenal server error" });
  }
});

router.delete("/XoaPhim", verifyTokenAdmin, async (req, res) => {
  console.log("XoaPhim");
  try {
    const moviedeleted = await Movie.findOneAndUpdate(
      { _id: req.query.MaPhim, daXoa: false },
      { daXoa: true },
      { new: true }
    );
    // xoa thuc su
    //const moviedeleted = await Movie.findOneAndDelete({ _id: req.query.MaPhim, daXoa: false })
    if (!moviedeleted) {
      return res.status(401).json({
        success: false,
        message: "Phim not found or user not authorised",
      });
    } else {
      return res.status(200).json({
        message: "Xử lý thành công",
        content: "Xóa thành công !",
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Intenal server error" });
  }
});

router.get("/LayThongTinPhim", async (req, res) => {
  console.log("LayThongTinPhim");
  try {
    if (!req.query.MaPhim) {
      return res.status(401).json({
        success: "Xử lý thất bại",
        message: "Value MaPhim is invalid",
      });
    } else {
      const movieFind = await Movie.findOne({
        daXoa: false,
        _id: req.query.MaPhim,
      });
      if (!movieFind) {
        return res.status(401).json({
          success: false,
          message: "Phim not found",
        });
      } else {
        var newArray = new Array();
        const listLichChieu = await MovieSchedule.find({ movie: movieFind._id })
          .populate("movie")
          .populate({
            path: "cinema",
            populate: {
              path: "maCumRap",
              populate: {
                path: "maHeThongRap",
              },
            },
          });

        for (let x = 0; x < listLichChieu.length; x++) {
          newArray[x] = new Object();
          newArray[x].maLichChieu = listLichChieu[x]._id;
          newArray[x].maRap = listLichChieu[x].cinema._id;
          newArray[x].maPhim = listLichChieu[x].movie._id;
          newArray[x].tenPhim = listLichChieu[x].movie.tenPhim;
          newArray[x].ngayChieuGioChieu = listLichChieu[x].ngayChieuGioChieu;
          newArray[x].giaVe = listLichChieu[x].giaVe;
          newArray[x].thoiLuong = listLichChieu[x].movie.thoiLuong;
          newArray[x].thongTinRap = new Object();
          newArray[x].thongTinRap.maRap = listLichChieu[x].cinema._id;
          newArray[x].thongTinRap.tenRap = listLichChieu[x].cinema.tenRap;
          newArray[x].thongTinRap.maCumRap =
            listLichChieu[x].cinema.maCumRap._id;
          newArray[x].thongTinRap.tenCumRap =
            listLichChieu[x].cinema.maCumRap.tenCumRap;
          newArray[x].thongTinRap.maHeThongRap =
            listLichChieu[x].cinema.maCumRap.maHeThongRap._id;
          newArray[x].thongTinRap.tenHeThongRap =
            listLichChieu[x].cinema.maCumRap.maHeThongRap.tenHeThongRap;
        }

        var responseResult = new Object();
        responseResult.maPhim = movieFind._id;
        responseResult.tenPhim = movieFind.tenPhim;
        responseResult.biDanh = movieFind.biDanh;
        responseResult.trailer = movieFind.biDanh;
        responseResult.hinhAnh = movieFind.hinhAnh;
        responseResult.moTa = movieFind.moTa;
        responseResult.hot = movieFind.hot;
        responseResult.dangChieu = movieFind.dangChieu;
        responseResult.sapChieu = movieFind.sapChieu;
        responseResult.ngayKhoiChieu = movieFind.ngayKhoiChieu;
        responseResult.danhGia = movieFind.danhGia;
        responseResult.lichChieu = newArray;

        return res.status(200).json({
          message: "Xử lý thành công",
          content: responseResult,
        });
      }
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Intenal server error" });
  }
});

///--------------------------------------------------
var fileupload = require("express-fileupload");
router.use(fileupload());
router.use(express.urlencoded({ extended: true }));
router.post("/ThemPhimUploadHinh", async (req, res) => {
  const {
    tenPhim,
    trailer,
    moTa,
    ngayKhoiChieu,
    danhGia,
    dangChieu,
    sapChieu,
    hot,
  } = req.body;

  console.log("ThemPhimUploadHinh");

  const biDanh0 = tenPhim
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/ /g, "");

  var ngayMMddYYYY = new Date(
    parseInt(ngayKhoiChieu.substring(6, 10), 0),
    parseInt(ngayKhoiChieu.substring(3, 5), 0),
    parseInt(ngayKhoiChieu.substring(0, 2), 0)
  );

  const file = req.files.File;
  var data = file.data.toString("base64");
  var hinh = "data:" + req.files.File.mimetype + ";base64," + data;

  try {
    const newMovie = new Movie({
      tenPhim,
      biDanh: biDanh0,
      trailer,
      hinhAnh: hinh,
      moTa,
      ngayKhoiChieu: ngayMMddYYYY,
      danhGia,
      daXoa: false,
      thoiLuong: 120,
      dangChieu,
      sapChieu,
      hot,
    });
    await newMovie.save();

    var result = new Object();
    result.maPhim = newMovie._id;
    result.tenPhim = newMovie.tenPhim;
    result.biDanh = newMovie.biDanh;
    result.trailer = newMovie.trailer;
    result.hinhAnh = newMovie.hinhAnh;
    result.moTa = newMovie.moTa;
    result.ngayKhoiChieu = newMovie.ngayKhoiChieu;
    result.danhGia = newMovie.danhGia;
    result.daXoa = newMovie.daXoa;

    return res.status(200).json({
      message: "Xử lý thành công",
      content: result,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Intenal server error(lỗi lưu trùng dữ liệu)",
    });
  }
});

router.post("/CapNhatPhimUpload", verifyTokenAdmin, async (req, res) => {
  const {
    maPhim,
    tenPhim,
    trailer,
    moTa,
    ngayKhoiChieu,
    danhGia,
    dangChieu,
    sapChieu,
    hot,
  } = req.body;
  console.log("CapNhatPhimUpload");

  const biDanh0 = tenPhim
    .toString()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .replace(/ /g, "");

  var ngayMMddYYYY = new Date(
    parseInt(ngayKhoiChieu.substring(6, 10), 0),
    parseInt(ngayKhoiChieu.substring(3, 5), 0),
    parseInt(ngayKhoiChieu.substring(0, 2), 0)
  );
  const existFilm = await Movie.findOne({
    _id: maPhim,
  });
  var hinh;
  if (!req.files) {
    hinh = existFilm.hinhAnh;
  } else {
    const file = req.files.File;
    var data = file.data.toString("base64");
    hinh = "data:" + req.files.File.mimetype + ";base64," + data;
  }

  try {
    const updated = await Movie.findOneAndUpdate(
      { _id: maPhim },
      {
        tenPhim,
        biDanh: biDanh0,
        trailer,
        hinhAnh: hinh,
        moTa,
        ngayKhoiChieu: ngayMMddYYYY,
        danhGia,
        daXoa: false,
        thoiLuong: 120,
        dangChieu,
        sapChieu,
        hot,
      },
      { new: true }
    );

    if (!updated) {
      return res.status(401).json({
        success: false,
        message: "Cập nhật Phim thất bại",
      });
    } else {
      var result = {
        maPhim,
        tenPhim,
        biDanh: biDanh0,
        trailer,
        hinhAnh: hinh,
        moTa,
        ngayKhoiChieu,
        danhGia,
        daXoa: false,
      };

      return res.status(200).json({
        message: "Xử lý thành công",
        content: result,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Intenal server error(lỗi lưu trùng dữ liệu)",
    });
  }
});

module.exports = router;

/////////////////////////////////////////////////////////////////////////////////////////////
/*
code bug lỗi sự cố
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/images/');
    },
    // By default, multer removes file extensions so let's add them back
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const imageFilter = function (req, file, cb) {
    // Accept images only
    if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
        req.fileValidationError = 'Only image files are allowed!';
        return cb(new Error('Only image files are allowed!'), false);
    }
    cb(null, true);
};

const multer = require("multer");
const path = require('path');
// const bodyParser = require('body-parser')
// const e = require('express')
// for parsing application/json
// app.use(bodyParser.json());
// for parsing application/xwww-
// app.use(bodyParser.urlencoded({ extended: true }));
// var urlencodedParser = bodyParser.urlencoded({ extended: false })
// for parsing multipart/form-data
// var upload = multer();
// app.use(upload.array());
// const formdataParser = up0.array();
// http://localhost:5000/uploads/images/1.png
//cấu hình lưu trữ file khi upload xong
//router.use(bodyParser.urlencoded({ extended: true }))

router.post('/ThemPhimUploadHinh2', async (req, res) => {
    const {
        tenPhim,
        trailer,
        moTa,
        ngayKhoiChieu,
        danhGia,
        dangChieu,
        sapChieu,
        hot
    } = req.body

    const file = req.files.File

    if (!tenPhim) {
        return res
            .status(400
                .json({
                    success: false,
                    message: 'Missing tenPhim'
                })
            )
    }

    let upload = multer({ storage: storage, fileFilter: imageFilter }).single('File');
    upload(req, res, async function (err) {
        // req.file contains information of uploaded file
        // req.body contains information of text fields, if there were any
        if (req.fileValidationError) {
            return res.send(req.fileValidationError);
        }
        else if (!req.file) {
            return res.send('Please select an image to upload');
        }
        else if (err instanceof multer.MulterError) {
            return res.send(err);
        }
        else if (err) {
            return res.send(err);
        }

        // Display uploaded image for user validation
        // res.send(`You have uploaded this image: <hr/><img src="${req.file.path.substring(7,req.file.path.length)}" width="500"><hr /><a href="./">Upload another image</a><h1>${ req.body.text }</h1>`);

        const {
            tenPhim,
            trailer,
            moTa,
            ngayKhoiChieu,
            danhGia,
            dangChieu,
            sapChieu,
            hot
        } = req.body

        const biDanh0 = tenPhim.toString()
            .toLowerCase().normalize("NFD")
            .replace(/[\u0300-\u036f]/g, "")
            .replace(/đ/g, "d")
            .replace(/Đ/g, "D")
            .replace(/ /g, "")

        var ngayMMddYYYY = new Date(
            parseInt(ngayKhoiChieu.substring(6, 10), 0),
            parseInt(ngayKhoiChieu.substring(3, 5), 0),
            parseInt(ngayKhoiChieu.substring(0, 2), 0)
        )

        const {
            path
        } = req.file

        var duongDan = path.replace("\\", "/").replace("\\", "/").replace("\\", "/")
        try {
            const newMovie = new Movie({
                tenPhim,
                biDanh: biDanh0,
                trailer,
                hinhAnh: duongDan,
                moTa,
                ngayKhoiChieu: ngayMMddYYYY,
                danhGia,
                daXoa: false,
                thoiLuong: 120,
                dangChieu,
                sapChieu,
                hot
            })
            await newMovie.save()

            var result = new Object
            result.maPhim = newMovie._id
            result.tenPhim = newMovie.tenPhim
            result.biDanh = newMovie.biDanh
            result.trailer = newMovie.trailer
            result.hinhAnh = newMovie.hinhAnh
            result.moTa = newMovie.moTa
            result.ngayKhoiChieu = newMovie.ngayKhoiChieu
            result.danhGia = newMovie.danhGia
            result.daXoa = newMovie.daXoa

            return res
                .status(200)
                .json({
                    message: "Xử lý thành công",
                    content: result
                })
        } catch (error) {
            console.log(error)
            res.status(500).json({ success: false, message: 'Intenal server error(lỗi lưu trùng dữ liệu)' })
        }
    });
})
//var upload = multer();
//router.use(upload.array());
// router.use(express.urlencoded({ extended: false }));

router.post('/ThemPhimUploadHinh00', async (req, res) => {
    const {
        tenPhim,
        trailer,
        moTa,
        ngayKhoiChieu,
        danhGia,
        dangChieu,
        sapChieu,
        hot
    } = req.body

    console.log("ten phim " + tenPhim)
    console.log(req.body)
    console.log(req.files.File)
    var data = req.files.File.data.toString('base64')
    console.log("data:" + req.files.File.mimetype + ";base64," + data)
    //console.log(req)


    res.status(501).json({ test: "s" })
})
*/
//--------------------------------------------------------------
