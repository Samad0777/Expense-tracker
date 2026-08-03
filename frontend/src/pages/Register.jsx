import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";

const Register = () => {
  const [showPassword, setShowPassword] = useState(true);
  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="shadow-lg w-full max-w-md rounded-md p-8 bg-surface">
        <h1 className="text-center text-text-primary text-3xl">Register</h1>
        <form className="flex flex-col gap-4">
          <label htmlFor="username">Username </label>
          <input
            className="px-2 py-2 rounded-md border"
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
          />
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
            Register
          </button>
          <h2 className="text-center">
            Already have an account?{" "}
            <span className="cursor-pointer text-blue-900 underline">
              login
            </span>
          </h2>
        </form>
      </div>
    </div>
  );
}

export default Register