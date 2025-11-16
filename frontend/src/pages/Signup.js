import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import UseAxiosPublic from '../hook/UseAxiosPublic';

// Small SVG Icon
const IceCreamIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="80"
    height="80"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className="text-white"
  >
    <path d="M12 2.5c2.8 0 5 2.2 5 5 0 2.2-1.7 4-4 4.8V12h.5c.3 0 .5.2.5.5v.5c0 .3-.2.5-.5.5h-4c-.3 0-.5-.2-.5-.5v-.5c0-.3.2-.5.5-.5H9v-4.8c-2.3-.8-4-3-4-4.8 0-2.8 2.2-5 5-5z" />
    <path d="M8 14h8" />
    <path d="m12 14 1 9h-4l1-9" />
  </svg>
);

const Signup = () => {
  const { register, handleSubmit, formState: { errors }, watch, reset } = useForm();
  const axiosPublic = UseAxiosPublic();

  const [formMessage, setFormMessage] = useState(null);
  const password = watch('password');

  const onSubmit = async (data) => {
    setFormMessage(null);

    const formData = new FormData();
    formData.append('userName', data.userName);
    formData.append('email', data.email);
    formData.append('password', data.password);

    if (data.profileImage && data.profileImage[0]) {
      formData.append('profileImage', data.profileImage[0]);
    }

    try {
      const response = await axiosPublic.post(
        '/registerStaff',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );

      setFormMessage({
        type: 'success',
        text: 'Signup successful! Please log in.',
      });

      reset();

    } catch (error) {
      setFormMessage({
        type: 'error',
        text:
          error.response?.data?.message ||
          'Error during signup. Please try again.',
      });
    }
  };

  return (
    <div className="font-sans min-h-screen w-full flex items-center justify-center bg-pink-50 p-4">
      <div className="w-full max-w-5xl md:grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* Left Side */}
        <div className="p-8 md:p-12 bg-gradient-to-br from-pink-400 via-red-400 to-orange-400 text-white flex flex-col items-center justify-center text-center">
          <div className="mb-6"><IceCreamIcon /></div>

          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Join the Fun!
          </h1>
          <p className="text-lg md:text-xl px-4">
            Create an account to save your favorite flavors and get exclusive deals.
          </p>
        </div>

        {/* Right Side */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center md:text-left">
            Create an Account
          </h2>
          <p className="text-gray-600 mb-8 text-center md:text-left">
            Let's get you set up!
          </p>

          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>

            {/* Message */}
            {formMessage && (
              <div
                className={`p-3 rounded-lg ${
                  formMessage.type === 'success'
                    ? 'bg-green-100 text-green-800'
                    : 'bg-red-100 text-red-800'
                }`}
              >
                {formMessage.text}
              </div>
            )}

            {/* Username */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Username
              </label>
              <input
                type="text"
                placeholder="cherry_garcia"
                {...register("userName", { required: "Username is required" })}
                className={`w-full p-3 rounded-lg border ${
                  errors.userName ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 ${
                  errors.userName ? 'ring-red-500' : 'focus:ring-pink-400'
                } transition`}
              />
              {errors.userName && (
                <p className="text-red-500 text-xs mt-1">{errors.userName.message}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                type="email"
                placeholder="you@example.com"
                {...register("email", {
                  required: "Email is required",
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address",
                  },
                })}
                className={`w-full p-3 rounded-lg border ${
                  errors.email ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 ${
                  errors.email ? 'ring-red-500' : 'focus:ring-pink-400'
                } transition`}
              />
              {errors.email && (
                <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 8,
                    message: "Password must be at least 8 characters",
                  },
                })}
                className={`w-full p-3 rounded-lg border ${
                  errors.password ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 ${
                  errors.password ? 'ring-red-500' : 'focus:ring-pink-400'
                } transition`}
              />
              {errors.password && (
                <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Confirm Password
              </label>
              <input
                type="password"
                placeholder="••••••••"
                {...register("confirmPassword", {
                  required: "Please confirm your password",
                  validate: value =>
                    value === password || "The passwords do not match",
                })}
                className={`w-full p-3 rounded-lg border ${
                  errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                } focus:outline-none focus:ring-2 ${
                  errors.confirmPassword ? 'ring-red-500' : 'focus:ring-pink-400'
                } transition`}
              />
              {errors.confirmPassword && (
                <p className="text-red-500 text-xs mt-1">{errors.confirmPassword.message}</p>
              )}
            </div>

            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Profile Image
              </label>
              <input
                type="file"
                accept="image/*"
                {...register("profileImage", { required: "Profile image is required" })}
                className={`w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-pink-50 file:text-pink-600 hover:file:bg-pink-100 ${
                  errors.profileImage ? 'ring-2 ring-red-500 rounded-lg' : ''
                }`}
              />
              {errors.profileImage && (
                <p className="text-red-500 text-xs mt-1">{errors.profileImage.message}</p>
              )}
            </div>

            {/* Button */}
            <button
              type="submit"
              className="w-full p-3 rounded-lg bg-pink-500 text-white font-bold text-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-transform transform hover:-translate-y-1 shadow-lg"
            >
              Create Account
            </button>
          </form>

          {/* Login Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <a href="/login" className="text-pink-500 hover:text-pink-600 font-medium transition">
                Log in
              </a>
            </p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Signup;
