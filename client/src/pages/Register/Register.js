import { useFormik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { dangKyAction } from "../../redux/actions/QuanLyNguoiDungAction";
import styleLogin from "../Login/Login.module.css";
export default function Register(props) {
  const dispatch = useDispatch();

  const formik = useFormik({
    initialValues: {
      taiKhoan: "",
      matKhau: "",
      email: "",
      soDt: "",
      hoTen: "",
    },
    onSubmit: (values) => {
      // const action = dangNhapAction(values);
      // dispatch(action);
      console.log("val", values);
      dispatch(dangKyAction(values));
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{
        height: "100%",
        margin: "0 auto",
      }}
      className={`w-1/3  ${styleLogin.form}`}
    >
      <div
        style={{ margin: "0 auto" }}
        className="mt-10 px-12 sm:px-24 md:px-48 lg:px-12 lg:mt-16 xl:px-24 xl:max-w-2xl"
      >
        <h2
          className="text-center text-4xl text-indigo-900 font-display font-semibold lg:text-left xl:text-5xl
      xl:text-bold"
        >
          Đăng ký
        </h2>
        <div className="mt-12">
          <div>
            <div>
              <div className="text-xl font-bold text-gray-700 tracking-wide">
                Tài khoản
              </div>
              <input
                name="taiKhoan"
                onChange={formik.handleChange}
                className={`w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500 ${styleLogin.forminput}`}
                placeholder="Nhập vào tài khoản"
              />
            </div>
            <div className="">
              <div className="text-xl font-bold text-gray-700 tracking-wide">
                <div className="text-xl font-bold text-gray-700 tracking-wide">
                  Mật khẩu
                </div>
              </div>
              <input
                type="password"
                name="matKhau"
                onChange={formik.handleChange}
                className={`w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500 ${styleLogin.forminput}`}
                placeholder="Nhập vào mật khẩu"
              />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-700 tracking-wide">
                Email
              </div>
              <input
                name="email"
                onChange={formik.handleChange}
                className={`w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500 ${styleLogin.forminput}`}
                placeholder="Nhập email"
              />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-700 tracking-wide">
                SDT
              </div>
              <input
                name="soDt"
                onChange={formik.handleChange}
                className={`w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500 ${styleLogin.forminput}`}
                placeholder="Nhập vào sdt"
              />
            </div>
            <div>
              <div className="text-xl font-bold text-gray-700 tracking-wide">
                Họ Tên
              </div>
              <input
                name="hoTen"
                onChange={formik.handleChange}
                className={`w-full text-lg py-2 border-b border-gray-300 focus:outline-none focus:border-indigo-500 ${styleLogin.forminput}`}
                placeholder="Nhập họ tên"
              />
            </div>
            <div className="mt-10">
              <button
                className="bg-indigo-500 text-gray-100 p-4 w-full rounded-full tracking-wide
                  font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                  shadow-lg"
              >
                Đăng ký
              </button>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
