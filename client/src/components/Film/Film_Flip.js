import React from "react";
import { PlayCircleOutlined } from "@ant-design/icons";
import "./Flim_Flip.css";
import { NavLink } from "react-router-dom";
import { history } from "../../App";
import { useTranslation } from "react-i18next";

export default function Film_Flip(props) {
  const { item } = props;

  const { t, i18n } = useTranslation();

  const handleChange = (value) => {
    i18n.changeLanguage(value);
  };
  return (
    <div className="flip-card ">
      <div className="flip-card-inner ">
        <div className="flip-card-front">
          <img
            src={item.hinhAnh}
            alt="Avatar"
            style={{ width: 300, height: 300 }}
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://picsum.photos/300/300";
            }}
          />
        </div>
        <div
          className="flip-card-back"
          style={{ position: "relative", backgroundColor: "rgba(0,0,0,.9)" }}
        >
          <div style={{ position: "absolute", top: 0, left: 0 }}>
            <img
              src={item.hinhAnh}
              alt="Avatar"
              style={{ width: 300, height: 300 }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = "https://picsum.photos/300/300";
              }}
            />
          </div>
          <div
            className="w-full h-full"
            style={{
              position: "absolute",
              backgroundColor: "rgba(0,0,0,.5)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <div>
              <div className="rounded-full cursor-pointer">
                <PlayCircleOutlined style={{ fontSize: "50px" }} />
              </div>
              <div className="text-2xl mt-2 font-bold">{item.tenPhim}</div>
            </div>
          </div>
        </div>
      </div>
      <div
        onClick={() => {
          history.push(`/detail/${item.maPhim}`);
        }}
        style={{
          backgroundColor: "#f7b42c",

          backgroundImage: "linear-gradient(315deg, #f7b42c 0%, #fc575e 74%)",
        }}
        className="rounded-sm text-center cursor-pointer py-2 bg-indigo-300 my-2 text-success-50 font-bold"
      >
        {t("book")}
      </div>
      <br />
    </div>
  );
}
