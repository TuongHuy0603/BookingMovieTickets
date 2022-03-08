import React, { useEffect } from "react";
import { Carousel } from "antd";
import { useSelector, useDispatch } from "react-redux";

import axios from "axios";
import { getCarouselAction } from "../../../../redux/actions/CarouselActions";
import "./HomeCarousel.css";

const contentStyle = {
  height: "900px",
  color: "#fff",
  lineHeight: "160px",
  textAlign: "center",
  backgroundPosition: "center",
  backgroundSize: "100%",
  backgroundRepeat: "no-repeat",
};

export default function HomeCarousel(props) {
  const { arrImg } = useSelector((state) => state.CarouselReducer);

  const dispatch = useDispatch();

  //Sẽ tự kích hoạt khi component load ra
  useEffect(() => {
    //1 action = {type:'',data}
    //2 (phải cài middleware): callBackFunction (dispatch)

    // const action = getCarouselAction(1);

    dispatch(getCarouselAction());
  }, []);

  const renderImg = () => {
    return arrImg.map((item, index) => {
      return (
        <div key={index}>
          <div
            style={{
              ...contentStyle,
              position: "relative",
              backgroundImage: `url(${item.hinhAnh})`,
            }}
          >
            <img src={item.hinhAnh} className="opacity-0" alt={item.hinhAnh} />
          </div>
          <div style={{ display: "flex" }}>
            <div className="movieCarousel__overlay"></div>
            <div className="container carousel-caption">
              <div
                style={{
                  position: "absolute",
                  left: "60px",
                  transform: "translatey(-260%)",
                }}
                className="col-12 col-lg-9 p-0"
              >
                <p
                  style={{ fontSize: "18px" }}
                  className="animate__animated animate__fadeInDown"
                >
                  ACTION, ADVENTURE, FANTASY
                </p>
                <h2
                  className="animate__animated animate__fadeInDown text-4xl "
                  style={{
                    color: "orange",
                    textTransform: "uppercase",
                    letterSpacing: "3px",
                    fontSize: "52px",
                  }}
                >
                  {item.tenPhim}
                </h2>
                <p
                  className="animate__animated animate__fadeInUp"
                  style={{ fontSize: "18px" }}
                >
                  {item.moTa}
                </p>
                <div
                  className="
                    movieCarousel__trailer
                    animate__animated animate__fadeInUp
                  "
                >
                  <span>PG</span>
                  <button className="btn">
                    <span>
                      <i className="fa fa-play"></i>
                      PLAY TRAILER
                    </span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      );
    });
  };

  return (
    <Carousel
      autoplay
      effect="fade"
      style={{ width: "100%", padding: 0, margin: 0 }}
    >
      {renderImg()}
    </Carousel>
  );
}
