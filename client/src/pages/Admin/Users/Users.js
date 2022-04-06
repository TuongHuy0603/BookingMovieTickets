import React, { Fragment, useEffect } from "react";
import { Button, Table } from "antd";

import { Input, Space } from "antd";
import {
  AudioOutlined,
  EditOutlined,
  SearchOutlined,
  DeleteOutlined,
  CalendarOutlined,
} from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";
import QuanLyNguoiDungReducer from "../../../redux/configStore";

import { NavLink } from "react-router-dom";
import { history } from "../../../App";
import {
  layThongTinNguoiDungAction,
  layUsersAction,
  xoaUserAction,
} from "../../../redux/actions/QuanLyNguoiDungAction";
const { Search } = Input;
export default function Users() {
  const { quanLyThongTin } = useSelector(
    (state) => state.QuanLyNguoiDungReducer
  );

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(layUsersAction(quanLyThongTin.taiKhoan));
  }, []);

  const columns = [
    {
      title: "Tài Khoản",
      dataIndex: "taiKhoan",
      sorter: (a, b) => a.taiKhoan - b.taiKhoan,
      sortDirections: ["descend", "ascend"],
      width: "15%",

      // sortOrder:'descend'
    },
    {
      title: "Họ Tên",
      dataIndex: "hoTen",

      width: "15%",
      // sorter: (a, b) => a.age - b.age,
    },
    {
      title: "email",
      dataIndex: "email",

      width: "10%",
    },
    {
      title: "Số ĐT",
      dataIndex: "soDt",

      width: "10%",
    },
    {
      title: "Mật khẩu",
      dataIndex: "matKhau",

      width: "10%",
    },
    {
      title: "Loại người dùng",
      dataIndex: "maLoaiNguoiDung",

      width: "10%",
    },
    {
      title: "Hành động",

      render: (text, user) => {
        return (
          <Fragment>
            <NavLink
              key={1}
              className=" mr-2  text-2xl"
              to={`/admin/films/edit/${user.taiKhoan}`}
            >
              <EditOutlined style={{ color: "blue" }} />{" "}
            </NavLink>
            <span
              style={{ cursor: "pointer" }}
              key={2}
              className="text-2xl"
              onClick={() => {
                //Gọi action xoá
                if (
                  window.confirm(
                    "Bạn có chắc muốn xoá tài khoản " + user.taiKhoan
                  )
                ) {
                  dispatch(xoaUserAction(user));
                }
              }}
            >
              <DeleteOutlined style={{ color: "red" }} />{" "}
            </span>
          </Fragment>
        );
      },
      sortDirections: ["descend", "ascend"],
      width: "20%",
    },
  ];
  const data = quanLyThongTin;

  const onSearch = (value) => {
    console.log(value);

    dispatch(layThongTinNguoiDungAction(value));
  };

  function onChange(pagination, filters, sorter, extra) {
    console.log("params", pagination, filters, sorter, extra);
  }

  return (
    <div>
      <h3 className="text-4xl">Quản lý người dùng</h3>
      <Button
        className="mb-5"
        onClick={() => {
          // history.push("/admin/users/addnew");
        }}
      >
        Thêm người dùng
      </Button>

      <Search
        className="mb-5"
        placeholder="input search text"
        enterButton={<SearchOutlined />}
        size="large"
        onSearch={onSearch}
      />

      <Table
        columns={columns}
        dataSource={data}
        onChange={onChange}
        rowKey={"taiKhoan"}
      />
    </div>
  );
}
