import { EyeOff, Eye } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useAuth } from "../hook/useAuth";
import { toast } from "sonner";
import Button from "../components/Ui/Button";
import PasswordInput from "../components/Ui/PasswordInput";
import FormInput from "../components/Ui/FormInput";
import logo from "../../public/spendly-favicon.png";

const Register = () => {
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
      toast.success("Register successfully.");
    } catch (err) {
      const message = "something went wrong. please try again.";
      toast.error(err.response?.data?.message ?? message);
      setError("root", {
        type: "manual",
        message: err.response?.data?.message ?? message,
      });
    }
  };

  return (
    <div className="bg-background min-h-screen flex items-center justify-center">
      <div className="shadow-lg w-full max-w-md rounded-md p-8 bg-surface">
        <div>
          <img src={logo} alt="brand-logo" className="w-14 h-14 mx-auto rounded-2xl" />
        <h1 className="text-center text-text-primary text-3xl pb-4 pt-2">Register in Spendly</h1>
        </div>
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
          <FormInput
            label="Username"
            name="username"
            placeholder="Enter your username"
            register={register}
            rules={{
              required: "*Username is required",
              minLength: {
                value: 4,
                message: "Username must be at least 4 characters.",
              },
              maxLength: {
                value: 16,
                message: "maximum 16 character's",
              },
            }}
            error={errors.username}
          />

          <FormInput
            label="Email"
            type="email"
            placeholder="Enter your email"
            name="email"
            register={register}
            rules={{
              required: "*Email is required",
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: "Invalid email address",
              },
            }}
            error={errors.email}
          />

          <PasswordInput
            label="Password"
            name="password"
            placeholder="Enter your password"
            register={register}
            rules={{
              required: "Password is required",
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message:
                  "Password must contain 8+ characters, uppercase, lowercase, number and special character.",
              },
            }}
            error={errors.password}
          />

          <Button disabled={loading} type="submit">
            {loading ? "Registering..." : "Register"}
          </Button>
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
