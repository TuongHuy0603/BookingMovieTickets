import { baseService } from "./baseService";
// import { GROUPID } from "../util/settings/config";
export class QuanLyRapService extends baseService {
  constructor() {
    super();
  }

  layDanhSachHeThongRap = () => {
    return this.get(`/api/QuanLyRap/LayThongTinLichChieuHeThongRap`);
  };

  layThongTinLichChieuPhim = (maPhim) => {
    return this.get(`/api/QuanLyRap/LayThongTinLichChieuPhim?maPhim=${maPhim}`);
  };

  layThongTinHeThongRap = () => {
    return this.get(`/api/QuanLyRap/LayThongTinHeThongRap`);
  };
  layThongTinCumRap = (maHeThongRap) => {
    return this.get(
      `/api/QuanLyRap/LayThongTinCumRapTheoHeThong?maHeThongRap=${maHeThongRap}`
    );
  };

  layThongTinRap = (maCumRap) => {
    return this.get(`/api/QuanLyRap/LayRap?maCumRap=${maCumRap}`);
  };
}

export const quanLyRapService = new QuanLyRapService();
