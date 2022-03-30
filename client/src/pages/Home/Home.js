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
    </div>
  );
}
