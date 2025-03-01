import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SignIn = () => {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [valid, setValid] = useState(true);

  const handleSignIn = async () => {
    try {
      const res = await axios.post("http://localhost:3000/", {
        username,
        password
      });
      if (res.status === 200) {
        navigate("/books");
      } else {
        setValid(false);
      }
    } catch (error) {
      setValid(false);
    }
  };

  return (
    <div className="h-[100vh] items-center flex justify-center px-5 lg:px-0">
      <div className="max-w-screen-xl bg-white border shadow sm:rounded-lg flex justify-center flex-1">
        <div className="flex-1 bg-blue-900 text-center hidden md:flex">
          <div
            className="m-12 xl:m-16 w-full bg-contain bg-center bg-no-repeat"
            style={{
              backgroundImage: `url(src/assets/image.jpg)`,
            }}
          ></div>
        </div>
        <div className="lg:w-1/2 xl:w-5/12 p-6 sm:p-12">
          <div className=" flex flex-col items-center">
            <div className="text-center">
              <h1 className="text-2xl xl:text-4xl font-extrabold text-blue-900">
                Demo
              </h1>
              <p className="text-[12px] text-gray-500">
                Hey enter your details to sign in
              </p>
            </div>
            <div className="w-full flex-1 mt-8">
              <div className="mx-auto max-w-xs flex flex-col gap-4">
                <input
                  onChange={(e) => {
                    setUsername(e.target.value);
                    if (!valid) setValid(true); // Reset valid state on input change
                  }}
                  className={`w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border ${
                    valid ? "border-gray-200" : "border-red-500"
                  } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                  type="text"
                  placeholder="Enter username"
                />
                <input
                  className={`w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border ${
                    valid ? "border-gray-200" : "border-red-500"
                  } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                  type="email"
                  placeholder="Enter your email"
                />
                <input
                  onChange={(e) => {
                    setPassword(e.target.value);
                    if (!valid) setValid(true); // Reset valid state on input change
                  }}
                  className={`w-full px-5 py-3 rounded-lg font-medium bg-gray-100 border ${
                    valid ? "border-gray-200" : "border-red-500"
                  } placeholder-gray-500 text-sm focus:outline-none focus:border-gray-400 focus:bg-white`}
                  type="password"
                  placeholder="Password"
                />
                <button
                  onClick={handleSignIn}
                  className="mt-5 tracking-wide font-semibold bg-blue-900 text-gray-100 w-full py-4 rounded-lg hover:bg-indigo-700 transition-all duration-300 ease-in-out flex items-center justify-center focus:shadow-outline focus:outline-none"
                >
                  <span>Sign In</span>
                </button>
                <p className="mt-6 text-xs text-gray-600 text-center">
                  Do not have an account?{" "}
                  <span className="text-blue-900 font-semibold">
                    <button
                      onClick={() => {
                        navigate("/signup");
                      }}
                      className="underline"
                    >
                      Sign up
                    </button>
                  </span>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignIn;

