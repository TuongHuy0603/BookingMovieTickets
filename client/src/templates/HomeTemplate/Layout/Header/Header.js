import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { history } from "../../../../App";
import { Select } from "antd";

//Hook đa ngôn ngữ
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";
import _ from "lodash";
import { TOKEN, USER_LOGIN } from "../../../../util/settings/config";

const { Option } = Select;

export default function Header(props) {
  const { userLogin } = useSelector((state) => state.QuanLyNguoiDungReducer);

  const { t, i18n } = useTranslation();

  const handleChange = (value) => {
    i18n.changeLanguage(value);
  };

  const renderLogin = () => {
    if (_.isEmpty(userLogin)) {
      return (
        <Fragment>
          <button
            style={{
              backgroundImage:
                " linear-gradient(to right top,rgba(33,107,211,.9),rgba(27,94,187,.9),rgba(22,81,163,.9),rgba(19,70,143,.9),rgba(18,62,124,.9),rgba(19,59,116,.9))",
              boxSizing: "border-box",
              color: "#fff",
              textAlign: "center",
              lineHeight: "10px",
              width: "135px",
              fontWeight: "550",
              height: " 40px",
              display: "inline-block",
              borderRadius: "3px",
              boxShadow: " 0 0 4px rgb(0 0 0 / 50%)",
              fontSize: " 14px",
              cursor: "pointer",
            }}
            onClick={() => {
              history.push("/login");
            }}
            className="self-center px-8 py-3 rounded"
          >
            {t("signin")}
          </button>
          <button
            style={{
              marginLeft: "20px",
              marginRight: "20px",
              backgroundImage:
                " linear-gradient(to right top,rgba(33,107,211,.9),rgba(27,94,187,.9),rgba(22,81,163,.9),rgba(19,70,143,.9),rgba(18,62,124,.9),rgba(19,59,116,.9))",
              boxSizing: "border-box",
              color: "#fff",
              textAlign: "center",
              lineHeight: "10px",
              width: "135px",
              fontWeight: "550",
              height: " 40px",
              display: "inline-block",
              borderRadius: "3px",
              boxShadow: " 0 0 4px rgb(0 0 0 / 50%)",
              fontSize: " 14px",
              cursor: "pointer",
            }}
            onClick={() => {
              history.push("/register");
            }}
            className="self-center px-8 py-3 font-semibold rounded bg-violet-600 text-coolGray-50"
          >
            {t("signup")}
          </button>
        </Fragment>
      );
    }

    return (
      <Fragment>
        {" "}
        <button
          onClick={() => {
            history.push("/profile");
          }}
          className="self-center px-8 py-3 rounded"
        >
          Hello ! {userLogin.taiKhoan}
        </button>
        <button
          onClick={() => {
            localStorage.removeItem(USER_LOGIN);
            localStorage.removeItem(TOKEN);
            history.push("/home");
            window.location.reload();
          }}
          className="text-yellow-500 mr-5"
        >
          {t("logout")}
        </button>
      </Fragment>
    );
  };
  return (
    <header className="p-4 bg-coolGray-100  text-coolGray-800 bg-opacity-40 bg-black text-white fixed w-full top-0 z-10">
      <div className="container flex justify-between h-16 mx-auto">
        <NavLink
          to="/"
          aria-label="Back to homepage"
          className="flex items-center p-2"
        >
          <img src={require("../../../../assets/styles/logo.svg").default} />
        </NavLink>
        <ul className="items-stretch hidden space-x-3 lg:flex">
          <li className="flex">
            <NavLink
              to="/home"
              className="flex items-center  border-b-2 px-4 border-transparent text-violet-600 border-violet-600 text-white"
              activeClassName="border-b-2 border-white"
            >
              HOME
            </NavLink>
          </li>
          <li className="flex">
            <a
              href="#newin"
              className="flex items-center -mb-0.5 border-b-2 px-4 border-transparent text-white"
              activeClassName="border-b-2 border-white"
            >
              NEW IN
            </a>
          </li>
          <li className="flex">
            <a
              href="/home#news"
              className="flex items-center -mb-0.5 border-b-2 px-4 border-transparent text-white"
              activeClassName="border-b-2 border-white"
            >
              COMING SOON
            </a>
          </li>
          <li className="flex">
            <a
              href="/home#contact"
              className="flex items-center -mb-0.5 border-b-2 px-4 border-transparent text-white"
              activeClassName="border-b-2 border-white"
            >
              CONTACT
            </a>
          </li>
        </ul>
        <div className="items-center flex-shrink-0 hidden lg:flex">
          {renderLogin()}

          <Select
            defaultValue="chi"
            style={{ width: 100 }}
            onChange={handleChange}
          >
            <Option value="en">Eng</Option>
            <Option value="chi">Chi</Option>

            <Option value="vi">Vi</Option>
          </Select>
        </div>
        <button className="p-4 lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6 text-coolGray-800"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>

        {/* {t('hello.2')} */}
      </div>
    </header>
  );
}
