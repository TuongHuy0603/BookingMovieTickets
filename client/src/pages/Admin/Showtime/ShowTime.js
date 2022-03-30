import React, { useEffect, useState } from "react";
import { Form, Input, Button, Checkbox, Select } from "antd";
import { Cascader } from "antd";
import { DatePicker } from "antd";
import { InputNumber } from "antd";
import { quanLyRapService } from "../../../services/QuanLyRapService";
import { useFormik } from "formik";
import moment from "moment";
import { quanLyDatVeService } from "../../../services/QuanLyDatVeService";

export default function ShowTime(props) {
  const formik = useFormik({
    initialValues: {
      maPhim: props.match.params.id,
      ngayChieuGioChieu: "",
      maRap: "",
      giaVe: "",
    },
    onSubmit: async (values) => {
      console.log("values", values);
      try {
        const result = await quanLyDatVeService.taoLichChieu(values);

        alert(result.data.content);
      } catch (error) {
        console.log("error", error.response?.data);
      }
    },
  });

  const [state, setState] = useState({
    heThongRapChieu: [],
    cumRapChieu: [],
    cumRap: [],
  });
  console.log(state.heThongRapChieu);

  useEffect(async () => {
    try {
      let result = await quanLyRapService.layThongTinHeThongRap();
      console.log("hii5", result);
      setState({
        ...state,
        heThongRapChieu: result.data.content,
      });
    } catch (error) {}
  }, []);

  const handleChangeHeThongRap = async (value) => {
    //từ hệ thống rạp call api lấy thông tin rạp
    try {
      let result = await quanLyRapService.layThongTinCumRap(value);
      console.log("nene", result);
      //Gán giá trị cụm rạp vào state.cumRap
      setState({
        ...state,
        cumRapChieu: result.data.content,
      });
      console.log("danhsach", state.cumRapChieu);
    } catch (error) {
      console.log("error", error.response?.data);
    }
  };

  const handleChangeCumRap = async (value) => {
    try {
      console.log("cumrapn", value);
      let result = await quanLyRapService.layThongTinRap(value);
      console.log("888", result);
      //Gán giá trị cụm rạp vào state.cumRap
      setState({
        ...state,
        cumRap: result.data.content,
      });
      console.log("danhsach", state.cumRap);
    } catch (error) {
      console.log("error", error.response?.data);
    }
  };
  const handleChangeRap = (value) => {
    formik.setFieldValue("maRap", value);
  };

  const onOk = (values) => {
    formik.setFieldValue(
      "ngayChieuGioChieu",
      moment(values).format("DD/MM/YYYY hh:mm:ss")
    );
    console.log("values", moment(values).format("DD/MM/YYYY hh:mm:ss"));
  };

  const onChangeDate = (values) => {
    formik.setFieldValue(
      "ngayChieuGioChieu",
      moment(values).format("DD/MM/YYYY hh:mm:ss")
    );
    console.log("values", moment(values).format("DD/MM/YYYY hh:mm:ss"));
  };
  const onchangeInputNumber = (value) => {
    formik.setFieldValue("giaVe", value);
  };

  const convertSelectHTR = () => {
    // state.heThongRapChieu?.map((htr, index) => ({ label: htr.tenHeThongRap, value: htr.tenHeThongRap }))
    return state.heThongRapChieu?.map((htr, index) => {
      return { label: htr.tenHeThongRap, value: htr.maHeThongRap };
    });
  };

  console.log(props.match.params);
  let film = {};
  if (localStorage.getItem("filmParams")) {
    film = JSON.parse(localStorage.getItem("filmParams"));
  }

  return (
    <div className="container">
      <Form
        name="basic"
        labelCol={{ span: 8 }}
        wrapperCol={{ span: 16 }}
        onSubmitCapture={formik.handleSubmit}
      >
        <h3 className="text-2xl">
          Tạo lịch chiếu - {props.match.params.tenphim}
        </h3>
        <img src={film.hinhAnh} alt="..." width={200} height={100} />
        <Form.Item label="Hệ thống rạp">
          <Select
            options={convertSelectHTR()}
            onChange={handleChangeHeThongRap}
            placeholder="Chọn hệ thống rạp"
          />
        </Form.Item>

        <Form.Item label="Cụm rạp">
          <Select
            options={state.cumRapChieu?.map((cumRap, index) => ({
              label: cumRap.tenCumRap,
              value: cumRap.maCumRap,
            }))}
            onChange={handleChangeCumRap}
            placeholder="Chọn cụm rạp"
          />
        </Form.Item>

        <Form.Item label="Rạp">
          <Select
            options={state.cumRap?.map((cRap, index) => ({
              label: cRap.tenRap,
              value: cRap.maRap,
            }))}
            onChange={handleChangeRap}
            placeholder="Chọn rạp"
          />
        </Form.Item>

        <Form.Item label="Ngày chiếu giờ chiếu">
          <DatePicker
            format="DD/MM/YYYY hh:mm:ss"
            showTime
            onChange={onChangeDate}
            onOk={onOk}
          />
        </Form.Item>

        <Form.Item label="Giá vé">
          <InputNumber onChange={onchangeInputNumber} />
        </Form.Item>
        <Form.Item label="Chức năng">
          <Button htmlType="submit">Tạo lịch chiếu</Button>
        </Form.Item>
      </Form>
    </div>
  );
}
