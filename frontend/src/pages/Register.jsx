import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hook/useAuth";

const Register = () => {
  const [showPassword, setShowPassword] = useState(true);
  const navigate = useNavigate();
  const { registerHandler, loading } = useAuth();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
    setError,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await registerHandler(
        data.username,
        data.email,
        data.password,
      );
      reset();
      navigate("/dashboard");
    } catch (err) {
      const message = "something went wrong. please try again.";
      setError("root", {
        type: "manual",
        message: err.response?.data?.message ?? message,
      });
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="shadow-lg w-full max-w-md rounded-md p-8 bg-surface">
        <h1 className="text-center text-text-primary text-3xl">Register</h1>
        {errors.root && (
          <p className="text-danger mt-2 mb-2 text-center">
            {errors.root.message}
          </p>
        )}
        <form
          noValidate
          className="flex flex-col gap-4"
          onSubmit={handleSubmit(onSubmit)}
        >
          <label htmlFor="username">Username </label>
          <input
            className="px-2 py-2 rounded-md border"
            type="text"
            name="username"
            id="username"
            placeholder="Enter your username"
            {...register("username", {
              required: "*Username is required",
              minLength: {
                value: 4,
                message: "Username must be at least 4 characters.",
              },
              maxLength: {
                value: 16,
                message: "maximum 16 character's",
              },
            })}
          />
          {errors.username && (
            <p className="text-danger">{errors.username.message}</p>
          )}
          <label htmlFor="email">Email </label>
          <input
            className="px-2 py-2 rounded-md border"
            type="email"
            name="email"
            id="email"
            placeholder="Enter your email"
            {...register("email", {
              required: "*Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            })}
          />
          {errors.email && (
            <p className="text-danger">{errors.email.message}</p>
          )}
          <label htmlFor="password">Password </label>
          <div className=" flex items-center px-2 py-2 rounded-md border">
            <input
              className="w-full border-none outline-none mr-4"
              name="password"
              id="password"
              type={showPassword ? "password" : "text"}
              placeholder="Enter your password"
              {...register("password", {
                required: "*Password is required",
                minLength: {
                  value: 6,
                  message: "Password must be at least 6 characters.",
                },
              })}
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
          {errors.password && (
            <p className="text-danger">{errors.password.message}</p>
          )}
          <button
            disabled={loading}
            type="submit"
            className={
              loading
                ? "cursor-not-allowed bg-primary text-white rounded-md px-2 py-2"
                : "bg-primary hover:bg-primary-hover active:scale-95 text-white rounded-md px-2 py-2 cursor-pointer transition-all duration-200"
            }
          >
            {loading ? "Registering..." : "Register"}
          </button>
          <h2 className="text-center">
            Already have an account?{" "}
            <NavLink
              to="/login"
              className="cursor-pointer text-blue-900 underline"
            >
              login
            </NavLink>
          </h2>
        </form>
      </div>
    </div>
  );
};

export default Register;