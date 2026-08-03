import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const Login = () => {
  const [showPassword, setShowPassword] = useState(true);
  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="shadow-lg w-full max-w-md rounded-md p-8 bg-surface">
        <h1 className="text-center text-text-primary text-3xl">Login</h1>
        <form className="flex flex-col gap-4">
          <label htmlFor="email">Email </label>
          <input
            className="px-2 py-2 rounded-md border"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
          />
          <label htmlFor="password">Password </label>
          <div className=" flex items-center px-2 py-2 rounded-md border">
            <input
              className="w-full border-none outline-none"
              name="password"
              id="password"
              type={showPassword ? "password" : "text"}
              placeholder="Enter your password"
            />
            {showPassword ? (
              <EyeOff
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
                size={20}
              />
            ) : (
              <Eye
                onClick={() => setShowPassword(!showPassword)}
                className="cursor-pointer"
                size={20}
              />
            )}
          </div>
          <button
            type="submit"
            className="bg-primary hover:bg-primary-hover active:scale-95 text-white rounded-md px-2 py-2 cursor-pointer transition-all duration-200"
          >
            Login
          </button>
          <h2 className="text-center">
            Don't have an account?{" "}
            <NavLink to="/register" className="cursor-pointer text-blue-900 underline">
              register
            </NavLink>
          </h2>
        </form>
      </div>
    </div>
  );
};

export default Login;
