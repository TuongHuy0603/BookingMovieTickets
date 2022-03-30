import { baseService } from "./baseService";
import { GROUPID } from "../util/settings/config";
export class QuanLyNguoiDungService extends baseService {
  constructor() {
    super();
  }

  dangNhap = (thongTinDangNhap) => {
    // {taiKhoan:'',matKhau:''}
    return this.post(`/api/QuanLyNguoiDung/DangNhap`, thongTinDangNhap);
  };
  dangKy = (thongTinDangKy) => {
    return this.post(`/api/QuanLyNguoiDung/DangKy`, thongTinDangKy);
  };

  layThongTinNguoiDung = (taiKhoan) => {
    return this.post(`/api/QuanLyNguoiDung/ThongTinTaiKhoan`, { taiKhoan: taiKhoan });
  };
  
  layUsers = () => {
    return this.get("/api/QuanLyNguoiDung/LayDanhSachNguoiDung");
  };
}

export const quanLyNguoiDungService = new QuanLyNguoiDungService();
