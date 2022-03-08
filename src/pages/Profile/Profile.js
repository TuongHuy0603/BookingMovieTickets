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
          <div class="md:grid md:grid-cols-2 hover:bg-gray-50 md:space-y-0 space-y-1 p-4">
            <p class="text-gray-600">Attachments</p>
            <div class="space-y-2">
              <div class="border-2 flex items-center p-2 rounded justify-between space-x-2">
                <div class="space-x-2 truncate">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="fill-current inline text-gray-500"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 5v12c0 2.757-2.243 5-5 5s-5-2.243-5-5v-12c0-1.654 1.346-3 3-3s3 1.346 3 3v9c0 .551-.449 1-1 1s-1-.449-1-1v-8h-2v8c0 1.657 1.343 3 3 3s3-1.343 3-3v-9c0-2.761-2.239-5-5-5s-5 2.239-5 5v12c0 3.866 3.134 7 7 7s7-3.134 7-7v-12h-2z" />
                  </svg>
                  <span>resume_for_manager.pdf</span>
                </div>
                <a href="#" class="text-purple-700 hover:underline">
                  Download
                </a>
              </div>

              <div class="border-2 flex items-center p-2 rounded justify-between space-x-2">
                <div class="space-x-2 truncate">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="fill-current inline text-gray-500"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                  >
                    <path d="M17 5v12c0 2.757-2.243 5-5 5s-5-2.243-5-5v-12c0-1.654 1.346-3 3-3s3 1.346 3 3v9c0 .551-.449 1-1 1s-1-.449-1-1v-8h-2v8c0 1.657 1.343 3 3 3s3-1.343 3-3v-9c0-2.761-2.239-5-5-5s-5 2.239-5 5v12c0 3.866 3.134 7 7 7s7-3.134 7-7v-12h-2z" />
                  </svg>
                  <span>resume_for_manager.pdf</span>
                </div>
                <a href="#" class="text-purple-700 hover:underline">
                  Download
                </a>
              </div>
            </div>
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
