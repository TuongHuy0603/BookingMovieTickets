import { SET_CAROUSEL } from "../actions/types/CarouselType";

const stateDefault = {
  arrImg: [
    {
      maBanner: 1,
      maPhim: 1282,
      hinhAnh: "http://movieapi.cyberlearn.vn/hinhanh/ban-tay-diet-quy.png",
      tenPhim: "Bàn tay diệt quỷ",
      moTa: "Bàn Tay Diệt Quỷ - Evil Expeller (2021) kể về võ sĩ MMA Yong Hoo bỗng nhiên sở hữu 'Bàn tay diệt quỷ' có sức mạnh diệt trừ tà ma quỷ quái, từ đó anh dấn thân vào con đường trừ tà. Nhiệm vụ của Yong Hoo là trục quỷ dữ đối đầu trực diện với gã Giám Mụ Bóng Tối tàn ác.",
      trailer: "https://www.youtube.com/watch?v=8jraVtX821Q",
    },
    {
      maBanner: 2,
      maPhim: 1283,
      hinhAnh: "http://movieapi.cyberlearn.vn/hinhanh/lat-mat-48h.png",
      tenPhim: "Lật mặt 48h",
      moTa: "Một gia đình bị truy đuổi giữa vùng sông nước. Cơ hội nào cho người đàn ông cứu lấy vợ con khỏi bọn xã hội đen máu mặt? Trong phần 5 này, đạo diễn Lý Hải đã “mạnh tay” mời đạo diễn Kim Jung Min từ Hàn Quốc sang Việt Nam làm cố vấn hành động cho đoàn phim.",
      trailer: "https://www.youtube.com/watch?v=kBY2k3G6LsM",
    },
    {
      maBanner: 3,
      maPhim: 1284,
      hinhAnh: "http://movieapi.cyberlearn.vn/hinhanh/cuoc-chien-sinh-tu.png",
      tenPhim: "Cuộc chiến sinh tử",
      moTa: "Mortal Kombat: Cuộc chiến sinh tử là bộ phim điện ảnh thuộc thể loại hành động võ thuật xen lẫn giả tưởng sắp ra mắt của Mỹ. Phim do Simon McQuoid chịu trách nhiệm chỉ đạo, với phần kịch bản được chắp bút bởi Greg Russo và Dave Callaham, phát triển dựa trên cốt truyện của Oren Uziel và Russo. ",

      trailer: "https://www.youtube.com/watch?v=_rUC3-pNLyc",
    },
  ],
};

export const CarouselReducer = (state = stateDefault, action) => {
  switch (action.type) {
    case SET_CAROUSEL: {
      //   state.arrImg = action.arrImg;
      //   return { ...state };
    }

    default:
      return { ...state };
  }
};
