import React from "react";
import { useSelector } from "react-redux";

export default function Profile() {
  const { userLogin } = useSelector((state) => state.QuanLyNguoiDungReducer);
  return (
    <div class="min-h-screen flex items-center justify-center px-4">
      <div class="max-w-4xl  bg-white w-full rounded-lg shadow-xl">
        <div class="p-4 border-b">
          <h2 class="text-2xl ">Profile Information</h2>
          <p class="text-sm text-gray-500">Personal details and application.</p>
        </div>
        <div>
          <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p class="text-gray-600">Full name</p>
            <p>{userLogin.hoTen}</p>
          </div>
          <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p class="text-gray-600">Application for</p>
            <p>Product Manager</p>
          </div>
          <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p class="text-gray-600">Email Address</p>
            <p>{userLogin.email}</p>
          </div>
          <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p class="text-gray-600">Account</p>
            <p>{userLogin.taiKhoan}</p>
          </div>
          <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4 border-b">
            <p class="text-gray-600">PhoneNumber</p>
            <p>{userLogin.soDT}</p>
          </div>
        </div>
      </div>

      <a
        href="https://www.buymeacoffee.com/danimai"
        target="_blank"
        class="bg-purple-600 p-2 rounded-lg text-white fixed right-0 bottom-0"
      >
        Support me
      </a>
    </div>
  );
}
