import React, { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import { formatError } from "../common/error";

const Signup = () => {
  const { registerWithEmailPassword, registerWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });


  const [isProcessing, setIsProcessing] = useState(false);

  const updateField = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleGoogleSignUp = async () => {
    try {
      await registerWithGoogle();
      toast.success("Signed up with Google!");
      navigate("/");
    } catch (err: any) {
      toast.error(formatError(err));
    }
  };

  const submitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    const { name, email, password } = formData;

    if (!name || !email || !password) {
      toast.error("All fields are required.");
      return;
    }

    setIsProcessing(true);
    try {
      await registerWithEmailPassword(email, password, name);
      toast.success("Account successfully created!");
      navigate("/");
    } catch (err: any) {
      toast.error(formatError(err));
    } finally {
      setIsProcessing(false);
    }
  };



  return (
    <div className="flex justify-center items-center min-h-screen px-4">
      <div className="bg-gray-100 p-6 rounded-sm shadow-lg w-full max-w-lg">
        <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
          Sign Up
        </h2>
        <p className="text-gray-600 flex justify-center mb-4">Register Using</p>
        <div className="flex justify-center mb-4">
          <svg onClick={handleGoogleSignUp} className="justify-self-center cursor-pointer" height={40} width={40} viewBox="-0.5 0 48 48" version="1.1" xmlns="http://www.w3.org/2000/svg"  fill="#000000"><g id="SVGRepo_bgCarrier" strokeWidth="0"></g><g id="SVGRepo_tracerCarrier" strokeLinecap="round" strokeLinejoin="round"></g><g id="SVGRepo_iconCarrier"> <title>Google-color</title> <desc>Created with Sketch.</desc> <defs> </defs> <g id="Icons" stroke="none" strokeWidth="1" fill="none" fill-rule="evenodd"> <g id="Color-" transform="translate(-401.000000, -860.000000)"> <g id="Google" transform="translate(401.000000, 860.000000)"> <path d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24" id="Fill-1" fill="#FBBC05"> </path> <path d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333" id="Fill-2" fill="#EB4335"> </path> <path d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667" id="Fill-3" fill="#34A853"> </path> <path d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24" id="Fill-4" fill="#4285F4"> </path> </g> </g> </g> </g></svg>

        </div>

        <div className="flex items-center justify-center w-full my-4">
      <div className="flex-grow border-t border-gray-300"></div>
      <span className="flex-shrink mx-4 text-gray-500 text-sm font-medium">OR</span>
      <div className="flex-grow border-t border-gray-300"></div>
    </div>
        <form onSubmit={submitRegistration}>
          <div className="mb-4">
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={updateField}
              className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Name"
              required
            />
          </div>

          <div className="mb-4">
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={updateField}
              className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Email"
              required
            />
          </div>

          <div className="mb-4 relative">
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={updateField}
              className="border border-gray-300 p-2 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Password"
              required
            />
            </div>

         
          <button
            type="submit"
            disabled={isProcessing}
            className={`bg-gray-600 text-white p-2 rounded-md w-full transition ${
              isProcessing ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
            }`}
          >
            Register
          </button>
        </form>



        {/* Login Redirect */}
        <p className="text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-gray-600 hover:underline font-medium"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

// Eye Icons Components
const EyeIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth="1.5"
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z"
    />
  </svg>
);

const EyeOffIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    strokeWidth={1.5}
    stroke="currentColor"
    className="size-6"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21"
    />
  </svg>
);

export default Signup;
