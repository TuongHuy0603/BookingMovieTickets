import React, { useEffect, useState } from "react";
import HomeMenu from "./HomeMenu/HomeMenu";
//Kết nối redux
import { useSelector, useDispatch } from "react-redux";
import Film from "../../components/Film/Film";
import MultipleRowSlick from "../../components/RSlick/MultipleRowSlick";
import { layDanhSachPhimAction } from "../../redux/actions/QuanLyPhimActions";
import { layDanhSachHeThongRapAction } from "../../redux/actions/QuanLyRapActions";
import HomeCarousel from "../../templates/HomeTemplate/Layout/HomeCarousel/HomeCarousel";
import T from "./HomeMenu/t";
import { NavLink } from "react-router-dom";
import NewIn from "./HomeMenu/NewIn";

export default function Home(props) {
  const { arrFilm } = useSelector((state) => state.QuanLyPhimReducer);
  const { heThongRapChieu } = useSelector((state) => state.QuanLyRapReducer);
  const dispatch = useDispatch();
  console.log("propsHome", arrFilm);

  useEffect(() => {
    const action = layDanhSachPhimAction();
    dispatch(action);

    dispatch(layDanhSachHeThongRapAction());
  }, []);

  return (
    <div>
      <HomeCarousel />
      <div className="mt-10  text-4xl" id="newin">
        <div className="container">
          {" "}
          <h2 class="title">New In</h2>
          <div class="newIn__content">
            <div class="row">
              {arrFilm?.slice(4, 8).map((film, index) => {
                return (
                  <div key={index} class="col-6 col-md-3">
                    <div class="newIn__img">
                      <img
                        class="img-fluid"
                        style={{ height: "360px", width: "100%" }}
                        src={film.hinhAnh}
                        alt=""
                      />
                      <div class="newIn__overlay"></div>
                      <div class="newIn__play">
                        <div>
                          <NavLink to={`/detail/${film.maPhim}`}>
                            <i class="fa fa-play"></i>
                          </NavLink>
                          <NavLink to={`/detail/${film.maPhim}`}>
                            read more
                          </NavLink>
                          <p class="date">Released: 7 Mar, 2021</p>
                        </div>
                      </div>
                    </div>
                    <div class="newIn__title mb-3 mb-md-0">
                      <h3>{film.tenPhim}</h3>
                      <div>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                        <i class="fa fa-star"></i>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      <section className="text-gray-600 body-font">
        <div className="container px-5 py-24 mx-auto ">
          <MultipleRowSlick arrFilm={arrFilm} />
        </div>
      </section>

      <div className="mx-36">
        <HomeMenu heThongRapChieu={heThongRapChieu} />
      </div>
      <div
        style={{
          position: "relative",
          height: "600px",
          backgroundImage: "url(../assets/background.b46ef3a1ce082cecae80.jpg)",
        }}
      >
        <div
          id="news"
          style={{
            left: "30%",
            right: "30%",
            top: "40%",
            position: "absolute",
          }}
        >
          <h3 className="text-3xl text-white">
            Ứng dụng tiện lợi dành cho người yêu điện ảnh
            <br />
            <span>
              Không chỉ đặt vé, bạn còn có thể bình luận phim, chấm điểm rạp và
              đổi quà hấp dẫn.
            </span>
          </h3>
          <button
            style={{
              backgroundColor: "#fb4226",
              margin: "15px 0",
              color: "#fff",
              fontSize: "18px",
              padding: "15px",
              borderRadius: "5px",
            }}
          >
            Coming soon
          </button>
        </div>
        <div
          style={{
            right: "15%",
            top: "20%",
            position: "absolute",
          }}
        >
          <img style={{ width: "200px" }} src="../assets/phone.png" />
        </div>
      </div>
      <div
        onClick={() => {
          window.scrollTo({
            top: 0,
            behavior: "smooth",
          });
        }}
        style={{
          cursor: "pointer",
          position: "fixed",
          height: "50px",
          zIndex: 10,
          bottom: "5%",

          textAlign: "center",
          right: "5%",
          borderRadius: "5px",
          width: "50px",
          backgroundColor: "#f9c1b1",
          backgroundImage: "linear-gradient(315deg, #f9c1b1 0%, #fb8085 74%)",
        }}
      >
        <span style={{ lineHeight: "50px", fontSize: "35px" }}>⮝</span>
      </div>
    </div>
  );
}
