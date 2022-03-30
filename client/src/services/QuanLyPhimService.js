import { baseService } from "./baseService";
import { GROUPID } from "../util/settings/config";
export class QuanLyPhimService extends baseService {
  constructor() {
    super();
  }

  layDanhSachBanner = () => {
    return this.get(`/api/QuanLyPhim/LayDanhSachBanner`);
  };

  layDanhSachPhim = (tenPhim = "") => {
    if (tenPhim.trim() != "") {
      return this.get(`/api/QuanLyPhim/LayDanhSachPhim`);
    }
    return this.get(`/api/QuanLyPhim/LayDanhSachPhim`);
  };

  themPhimUploadHinh = (formData) => {
    console.log("formhinhanh666", formData.get("tenPhim"));
    return this.post0(`/api/QuanLyPhim/ThemPhimUploadHinh`, formData);
  };

  layThongTinPhim = (maPhim) => {
    return this.get(`/api/QuanLyPhim/LayThongTinPhim?MaPhim=${maPhim}`);
  };

  capNhatPhimUpload = (formData) => {
    console.log("formhinhanh666", formData.get("tenPhim"));
    return this.post0(`/api/QuanLyPhim/CapNhatPhimUpload`, formData);
  };

  xoaPhim = (maPhim) => {
    return this.delete(`/api/QuanLyPhim/XoaPhim?MaPhim=${maPhim}`);
  };
}

export const quanLyPhimService = new QuanLyPhimService();
