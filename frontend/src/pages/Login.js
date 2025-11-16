import React, { useContext } from 'react';
// Import useForm from react-hook-form
import { useForm } from 'react-hook-form';
import UseAxiosPublic from '../hook/UseAxiosPublic';
import UseAuth from '../hook/UseAuth';
import { AuthContext } from '../authprovider/AuthProvider';
import { useNavigate } from 'react-router-dom';

// A simple inline SVG for the ice cream cone icon
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

const Login = () => {
  // Initialize react-hook-form
  const { register, handleSubmit, formState: { errors } } = useForm();
  const axiosPublic = UseAxiosPublic();
  const {loginUser}=useContext(AuthContext);
  const navigate = useNavigate();

  // Handle form submission
  const onSubmit =async (data) => {
    console.log('Form data submitted:', data);
    // You would typically handle your login logic here
    // e.g., send data to your API
    const res=await loginUser(data.email,data.password);
    console.log(res);
    if(res.success){
        alert('Login Successful');
        navigate('/');
    }

  };

  return (
    // Main container: full screen height, centered, with a light pink background
    <div className="font-sans min-h-screen w-full flex items-center justify-center bg-pink-50 p-4">
      
      {/* Login Card:
          - On mobile: full width, max-width 2xl
          - On desktop (md): split into 2 columns
          - Rounded corners, shadow, and overflow-hidden for a clean card look
      */}
      <div className="w-full max-w-5xl md:grid md:grid-cols-2 bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Column 1: Branding & Welcome Message (The "Ice Cream" side)
            - This column has a vibrant gradient.
            - Hidden on mobile (hidden) and shown from medium screens up (md:block).
            - Oh wait, the user wants it to look like an app on mobile, so the branding should be on top.
            - Let's correct that: The grid will naturally stack on mobile.
        */}
        <div className="p-8 md:p-12 bg-gradient-to-br from-pink-400 via-red-400 to-orange-400 text-white flex flex-col items-center justify-center text-center">
          <div className="mb-6">
            <IceCreamIcon />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Welcome Back!
          </h1>
          <p className="text-lg md:text-xl px-4">
            Get ready for a scoop of happiness. Your favorite flavors are waiting for you!
          </p>
        </div>

        {/* Column 2: Login Form */}
        <div className="p-8 md:p-12 flex flex-col justify-center">
          {/* Form Header */}
          <h2 className="text-3xl font-bold text-gray-800 mb-2 text-center md:text-left">
            Log In to Scoops
          </h2>
          <p className="text-gray-600 mb-8 text-center md:text-left">
            Please enter your details
          </p>

          {/* Form: Updated with handleSubmit */}
          <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
            {/* Email Input */}
            <div>
              <label 
                htmlFor="email" 
                className="block text-sm font-medium text-gray-700 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="you@example.com"
                // Register the input with email validation
                {...register("email", { 
                  required: "Email is required", 
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: "Invalid email address"
                  } 
                })}
                className={`w-full p-3 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 ${errors.email ? 'ring-red-500' : 'focus:ring-pink-400'} transition`}
              />
              {/* Display error message */}
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>

            {/* Password Input */}
            <div>
              <div className="flex justify-between items-baseline">
                <label 
                  htmlFor="password" 
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Password
                </label>
                <a 
                  href="#" 
                  className="text-sm text-pink-500 hover:text-pink-600 font-medium transition"
                >
                  Forgot password?
                </a>
              </div>
              <input
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                // Register the input with validation
                {...register("password", { 
                  required: "Password is required"
                })}
                className={`w-full p-3 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'} focus:outline-none focus:ring-2 ${errors.password ? 'ring-red-500' : 'focus:ring-pink-400'} transition`}
              />
              {/* Display error message */}
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>

            {/* Login Button */}
            <button
              type="submit"
              className="w-full p-3 rounded-lg bg-pink-500 text-white font-bold text-lg hover:bg-pink-600 focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-offset-2 transition-transform transform hover:-translate-y-1 shadow-lg"
            >
              Log In
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <a 
                href="/signup" 
                className="text-pink-500 hover:text-pink-600 font-medium transition"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;