import { quanLyNguoiDungService } from "../../services/QuanLyNguoiDung";
import {
  DANG_KY_ACTION,
  DANG_NHAP_ACTION,
  GET_THONG_TIN_NGUOI_DUNG,
  SET_THONG_TIN_NGUOI_DUNG,
} from "./types/QuanLyNguoiDungType";
import { history } from "../../App";

export const dangNhapAction = (thongTinDangNhap) => {
  return async (dispatch) => {
    try {
      const result = await quanLyNguoiDungService.dangNhap(thongTinDangNhap);

      dispatch({
        type: DANG_NHAP_ACTION,
        thongTinDangNhap: result.data.content,
      });
      //Chuyển hướng đăng nhập về trang trước đó
      history.goBack();

      history.push("/");
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};

export const layThongTinNguoiDungAction = (thongTinDangNhap) => {
  return async (dispatch) => {
    try {
      console.log("action "+ thongTinDangNhap)
      const result = await quanLyNguoiDungService.layThongTinNguoiDung(thongTinDangNhap);
      console.log("8888888"+result);
      dispatch({
        type: SET_THONG_TIN_NGUOI_DUNG,
        thongTinNguoiDung: result.data.content,
      });

      console.log("result", result);
    } catch (error) {
      console.log("error", error.response.data);
    }
  };
};
export const dangKyAction = (thongTinDangKy) => {
  return async (dispatch) => {
    try {
      const result = await quanLyNguoiDungService.dangKy(thongTinDangKy);

      alert("Đăng Ký thành công!!!");
      history.push("/login");
    } catch (error) {
      alert(error.response.data.content);
      console.log("error");
    }
  };
};

export const layUsersAction = () => {
  return async (dispatch) => {
    try {
      const result = await quanLyNguoiDungService.layUsers();
      console.log("user", result);

      dispatch({
        type: GET_THONG_TIN_NGUOI_DUNG,
        quanLyThongTin: result.data.content,
      });
    } catch (error) {
      console.log("error", error.response?.data);
    }
  };
};
