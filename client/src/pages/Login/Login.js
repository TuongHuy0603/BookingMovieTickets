import { useFormik } from "formik";
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink } from "react-router-dom";
import { dangNhapAction } from "../../redux/actions/QuanLyNguoiDungAction";
import styleLogin from "./Login.module.css";
export default function Login(props) {
  const dispatch = useDispatch();

  const { userLogin } = useSelector((state) => state.QuanLyNguoiDungReducer);

  const formik = useFormik({
    initialValues: {
      taiKhoan: "",
      matKhau: "",
    },
    onSubmit: (values) => {
      const action = dangNhapAction(values);
      dispatch(action);
    },
  });

  return (
    <form
      onSubmit={formik.handleSubmit}
      style={{ transform: " translate(10px, 40%)" }}
      className={`w-6/12 h-2/3 mx-auto flex items-center ${styleLogin.form}`}
    >
      <div className="flex items-center" style={{ margin: "0 auto" }}>
        <div className="mt-1/2">
          <div>
            <div>
              <div>
                <div>
                  <p>Đăng Nhập</p>
                  <label
                    className="text-xl"
                    style={{ display: "block", marginRight: "10px" }}
                  >
                    Tài khoản
                  </label>
                  <input
                    className={`${styleLogin.forminput}`}
                    name="taiKhoan"
                    onChange={formik.handleChange}
                  />
                  <br />
                  <label
                    className="text-xl"
                    style={{ display: "block", marginRight: "10px" }}
                  >
                    Mật khẩu{" "}
                  </label>
                  <input
                    className={`${styleLogin.forminput}`}
                    type="password"
                    name="matKhau"
                    onChange={formik.handleChange}
                  />
                  <br />
                  <button
                    className="bg-indigo-500 text-gray-100  w-2/3 p-2  rounded-full tracking-wide
                  font-semibold font-display focus:outline-none focus:shadow-outline hover:bg-indigo-600
                  shadow-lg"
                  >
                    Đăng nhập
                  </button>
                  <br />
                  <div className="mt-12 text-sm font-display font-semibold text-gray-700 text-center">
                    Bạn chưa có tài khoản ?{" "}
                    <NavLink
                      to="register"
                      className="cursor-pointer text-white hover:text-indigo-800"
                    >
                      Đăng ký
                    </NavLink>
                  </div>
                </div>
                <div className="drops">
                  <div className="drop drop-1" />
                  <div className="drop drop-2" />
                  <div className="drop drop-3" />
                  <div className="drop drop-4" />
                  <div className="drop drop-5" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  );
}
