import { TOKEN, USER_LOGIN } from "../../util/settings/config";
import {
  DANG_NHAP_ACTION,
  GET_THONG_TIN_DAT_VE,
  GET_THONG_TIN_NGUOI_DUNG,
  SET_THONG_TIN_NGUOI_DUNG,
} from "../actions/types/QuanLyNguoiDungType";

let user = {};
if (localStorage.getItem(USER_LOGIN)) {
  user = JSON.parse(localStorage.getItem(USER_LOGIN));
}

const stateDefault = {
  userLogin: user,
  thongTinNguoiDung: {},
  quanLyThongTin: [],
  thongTinDatVe: [],
};

export const QuanLyNguoiDungReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case DANG_NHAP_ACTION: {
      const { thongTinDangNhap } = action;
      localStorage.setItem(USER_LOGIN, JSON.stringify(thongTinDangNhap));
      localStorage.setItem(TOKEN, thongTinDangNhap.accessToken);
      return { ...state, userLogin: thongTinDangNhap };
    }

    case SET_THONG_TIN_NGUOI_DUNG: {
      state.thongTinNguoiDung = action.thongTinNguoiDung;
      return { ...state };
    }
    case GET_THONG_TIN_NGUOI_DUNG: {
      state.quanLyThongTin = action.quanLyThongTin;
      console.log(state.quanLyThongTin);
      return { ...state };
    }
    case GET_THONG_TIN_DAT_VE: {
      state.thongTinDatVe = action.thongTinDatVe;

      return { ...state };
      console.log("af", state.thongTinDatVe);
    }

    default:
      return { ...state };
  }
};
