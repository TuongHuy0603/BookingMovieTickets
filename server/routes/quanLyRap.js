const express = require("express");
const router = express.Router();
const argon2 = require("argon2");
const jwt = require("jsonwebtoken");

const CinemaSystem = require("../models/CinemaSystem");
const CinemaCluster = require("../models/CinemaCluster");
const Cinema = require("../models/Cinema");
const MovieSchedule = require("../models/MovieSchedule");
const Movie = require("../models/Movie");
const e = require("express");
const { populate } = require("../models/CinemaSystem");

//-------------------------------------------------
router.get("/LayThongTinHeThongRap", async (req, res) => {
  console.log("LayThongTinHeThongRap");

  try {
    if (req.query.maHeThongRap == null) {
      const cinemaSystems = await CinemaSystem.find();
      var listJsonRespone = new Array();
      cinemaSystems.forEach((e) => {
        listJsonRespone.push({
          maHeThongRap: e._id,
          tenHeThongRap: e.tenHeThongRap,
          biDanh: e.biDanh,
          logo: e.logo,
        });
      });

      return res.status(200).json({
        message: "Xử lý thành công",
        content: listJsonRespone,
      });
    } else {
      const cinemaSystems = await CinemaSystem.find({
        _id: req.query.maHeThongRap,
      });
      return res.status(200).json({
        message: "Xử lý thành công",
        content: cinemaSystems,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Intenal server error" });
  }
});

router.get("/LayThongTinCumRapTheoHeThong", async (req, res) => {
  console.log("LayThongTinCumRapTheoHeThong");
  try {
    if (!req.query.maHeThongRap) {
      return res.status(200).json({
        message: "Xử lý thất bại",
        content: "Mã hệ thống rạp không tồn tại !",
      });
    } else {
      const cinemaClusters = await CinemaCluster.find({
        maHeThongRap: req.query.maHeThongRap,
      });
      var listJsonRespone = new Array();
      cinemaClusters.forEach((e) => {
        listJsonRespone.push({
          maCumRap: e._id,
          tenCumRap: e.tenCumRap,
          diaChi: e.diaChi,
        });
      });
      for (let index = 0; index < listJsonRespone.length; index++) {
        const danhSachRapById = await Cinema.find({
          maCumRap: listJsonRespone[index].maCumRap,
        });
        var listJsonRespone0 = new Array();
        danhSachRapById.forEach((p) => {
          listJsonRespone0.push({ maRap: p._id, tenRap: p.tenRap });
        });
        listJsonRespone[index].danhSachRap = listJsonRespone0;
      }

      return res.status(200).json({
        message: "Xử lý thành công",
        content: listJsonRespone,
      });
    }
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Intenal server error" });
  }
});

router.get("/LayThongTinLichChieuHeThongRap", async (req, res) => {
  console.log("LayThongTinLichChieuHeThongRap");
  try {
    if (!req.query.maHeThongRap) {
      // Tim he thong rap co lich chieu
      const condition2 = await MovieSchedule.find().distinct("cinema");
      const condition1 = await Cinema.find({ _id: condition2 }).distinct(
        "maCumRap"
      );
      const condition0 = await CinemaCluster.find({ _id: condition1 }).distinct(
        "maHeThongRap"
      );
      var jsonResponeList = new Array();
      for (let z = 0; z < condition0.length; z++) {
        const cinemaSystem = await CinemaSystem.findOne({ _id: condition0[z] });
        var lstCumRap = new Array();
        // cac id cum rap cua he thong co lich chieu
        const condition3 = await CinemaCluster.find({
          _id: condition1,
          maHeThongRap: cinemaSystem._id,
        }).distinct("_id");
        for (let x = 0; x < condition3.length; x++) {
          const cinemaCluster = await CinemaCluster.findOne({
            _id: condition3[x],
          });
          var danhSachPhim = new Array();
          // cac id rap co lich chieu theo cum rap
          const condition4 = await Cinema.find({
            _id: condition2,
            maCumRap: condition3[x],
          }).distinct("_id");
          // cac id phim co lich chieu theo cum rap
          const condition5 = await MovieSchedule.find({
            cinema: condition4,
          }).distinct("movie");
          for (let y = 0; y < condition5.length; y++) {
            const movie = await Movie.findOne({ _id: condition5[y] });
            var lstLichChieuTheoPhim = new Array();
            const listMovieSchedule = await MovieSchedule.find({
              movie: movie._id,
              cinema: condition4,
            });
            listMovieSchedule.forEach((e) => {
              lstLichChieuTheoPhim.push({
                maLichChieu: e._id,
                maRap: e.cinema._id,
                tenRap: e.cinema.tenRap,
                ngayChieuGioChieu: e.ngayChieuGioChieu,
                giaVe: e.giaVe,
              });
            });

            danhSachPhim.push({
              maPhim: movie._id,
              tenPhim: movie.tenPhim,
              hinhAnh: movie.hinhAnh,
              lstLichChieuTheoPhim: lstLichChieuTheoPhim,
            });
          }

          lstCumRap.push({
            maCumRap: cinemaCluster._id,
            tenCumRap: cinemaCluster.tenCumRap,
            diaChi: cinemaCluster.diaChi,
            danhSachPhim: danhSachPhim,
          });
        }

        jsonResponeList.push({
          maHeThongRap: cinemaSystem._id,
          tenHeThongRap: cinemaSystem.tenHeThongRap,
          logo: cinemaSystem.logo,
          lstCumRap: lstCumRap,
        });
      }

      return res.status(200).json({
        message: "Xử lý thành công",
        content: jsonResponeList,
      });
    } else {
      const idHeThongRap = req.query.maHeThongRap;
      // tim cac rap co lich chieu phim
      const conditionCinemas = await MovieSchedule.find().distinct("cinema");
      // tim cac cum rap co lich chieu phim
      const conditionCinemaClusters0 = await Cinema.find({
        _id: conditionCinemas,
      }).distinct("maCumRap");
      // tim cac cum rap co lich chieu phim theo he thong rap
      const conditionCinemaClusters1 = await CinemaCluster.find({
        _id: conditionCinemaClusters0,
        maHeThongRap: idHeThongRap,
      });
      // insertdata
      var lstCumRap = new Array();
      for (let x = 0; x < conditionCinemaClusters1.length; x++) {
        const cinemaCluster = conditionCinemaClusters1[x];
        lstCumRap[x] = new Object();
        lstCumRap[x].maCumRap = cinemaCluster._id;
        lstCumRap[x].tenCumRap = cinemaCluster.tenCumRap;
        lstCumRap[x].diaChi = cinemaCluster.diaChi;
        lstCumRap[x].danhSachPhim = new Array();
        // lay cac rap co lich chieu phim theo he thong rap
        const conditionCinemasByIdCinemaCluster = await Cinema.find({
          _id: conditionCinemas,
          maCumRap: cinemaCluster._id,
        }).distinct("_id");
        // lay cac phim co lich chieu theo he thong rap
        const listMovies = await MovieSchedule.find({
          cinema: conditionCinemasByIdCinemaCluster,
        }).distinct("movie");
        for (let y = 0; y < listMovies.length; y++) {
          const idMOVIE = listMovies[y];
          const movie = await Movie.findOne({ _id: idMOVIE });
          lstCumRap[x].danhSachPhim[y] = new Object();
          lstCumRap[x].danhSachPhim[y].maPhim = movie._id;
          lstCumRap[x].danhSachPhim[y].tenPhim = movie.tenPhim;
          lstCumRap[x].danhSachPhim[y].hinhAnh = movie.hinhAnh;
          lstCumRap[x].danhSachPhim[y].lstLichChieuTheoPhim = new Array();
          // lay cac lich chieu cua rap co lich chieu theo he thong rap
          const listMovieSchedule = await MovieSchedule.find({
            movie: movie._id,
            cinema: conditionCinemasByIdCinemaCluster,
          }).populate("cinema");
          listMovieSchedule.forEach((e) => {
            lstCumRap[x].danhSachPhim[y].lstLichChieuTheoPhim.push({
              maLichChieu: e._id,
              maRap: e.cinema._id,
              tenRap: e.cinema.tenRap,
              ngayChieuGioChieu: e.ngayChieuGioChieu,
              giaVe: e.giaVe,
            });
          });
        }
      }

      // lay CinemaSystem
      const cinemaSystem = await CinemaSystem.findOne({ _id: idHeThongRap });
      var jsonRespone = new Object();
      jsonRespone.maHeThongRap = cinemaSystem._id;
      jsonRespone.tenHeThongRap = cinemaSystem.tenHeThongRap;
      jsonRespone.logo = cinemaSystem.logo;
      jsonRespone.lstCumRap = lstCumRap;

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

router.get("/LayThongTinLichChieuPhim", async (req, res) => {
  console.log("LayThongTinLichChieuPhim");
  try {
    if (!req.query.maPhim) {
      return res.status(200).json({
        message: "Xử lý thất bại",
        content: "Mã phim không tồn tại !",
      });
    } else {
      // lay movie
      const movie = await Movie.findOne({ _id: req.query.maPhim });

      // tim ma rap co lich chieu phim
      const conditionCinemas = await MovieSchedule.find({
        movie: req.query.maPhim,
      }).distinct("cinema");
      // tim ma cac cum rap co lich chieu phim
      const conditionCinemaClusters = await Cinema.find({
        _id: conditionCinemas,
      }).distinct("maCumRap");
      // tim ma cac he thong rap co lich chieu phim
      const conditionCinemaSystems = await CinemaCluster.find({
        _id: conditionCinemaClusters,
      }).distinct("maHeThongRap");
      // insert data
      var heThongRapChieu = new Array();
      for (let x = 0; x < conditionCinemaSystems.length; x++) {
        const idSYSTEM = conditionCinemaSystems[x];
        const cinemaSystem = await CinemaSystem.find({ _id: idSYSTEM });
        heThongRapChieu[x] = new Object();
        heThongRapChieu[x].maHeThongRap = cinemaSystem._id;
        heThongRapChieu[x].tenHeThongRap = cinemaSystem.tenHeThongRap;
        heThongRapChieu[x].logo = cinemaSystem.logo;
        const listCLUSTER = await CinemaCluster.find({
          maHeThongRap: idSYSTEM,
          _id: conditionCinemaClusters,
        });
        heThongRapChieu[x].cumRapChieu = new Array(listCLUSTER.length);
        for (let y = 0; y < listCLUSTER.length; y++) {
          const idCLUSTER = listCLUSTER[y]._id;
          heThongRapChieu[x].cumRapChieu[y] = new Object();
          // xu ly lich chieu phim // code chua xong
          heThongRapChieu[x].cumRapChieu[y].maCumRap = listCLUSTER[y]._id;
          heThongRapChieu[x].cumRapChieu[y].tenCumRap =
            listCLUSTER[y].tenCumRap;
          heThongRapChieu[x].cumRapChieu[y].hinhAnh = listCLUSTER[y].hinhAnh;
          heThongRapChieu[x].cumRapChieu[y].lichChieuPhim = new Array();

          const condition0 = await Cinema.find({
            maCumRap: idCLUSTER,
          }).distinct("_id");
          const listCinema = await MovieSchedule.find({
            movie: movie._id,
            cinema: condition0,
          });
          for (let z = 0; z < listCinema.length; z++) {
            const movieScheduleCinema = await MovieSchedule.find({
              movie: req.query.maPhim,
            })
              .populate("movie")
              .populate("cinema")
              .find({ cinema: listCinema[z].cinema });
            if (movieScheduleCinema) {
              var listLichChieuTheoRap = new Array();
              movieScheduleCinema.forEach((e) => {
                listLichChieuTheoRap.push({
                  maLichChieu: e._id,
                  maRap: e.cinema._id,
                  tenRap: e.cinema.tenRap,
                  ngayChieuGioChieu: e.ngayChieuGioChieu,
                  giaVe: e.giaVe,
                  thoiLuong: e.movie.thoiLuong,
                });
              });
              heThongRapChieu[x].cumRapChieu[y].lichChieuPhim.push(
                listLichChieuTheoRap
              );
            }
          }
        }
      }
      var jsonRespone = new Object();
      jsonRespone.maPhim = movie._id;
      jsonRespone.tenPhim = movie.tenPhim;
      jsonRespone.biDanh = movie.biDanh;
      jsonRespone.trailer = movie.trailer;
      jsonRespone.hinhAnh = movie.hinhAnh;
      jsonRespone.moTa = movie.moTa;
      jsonRespone.ngayKhoiChieu = movie.ngayKhoiChieu;
      jsonRespone.danhGia = movie.danhGia;
      jsonRespone.heThongRapChieu = heThongRapChieu;
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

router.get("/LayRap", async (req, res) => {
  console.log("LayRap");
  const maCumRap = req.query.maCumRap;

  try {
    const cinemas = await Cinema.find({
      maCumRap: maCumRap,
    });

    var jsonRespone = new Array();

    cinemas.forEach((e) => {
      jsonRespone.push({
        maRap: e._id,
        tenRap: e.tenRap,
      });
    });

    return res.status(200).json({
      message: "Xử lý thành công",
      content: jsonRespone,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: "Intenal server error" });
  }
});

module.exports = router;
