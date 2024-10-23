import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FieldInput from "../components/FieldInput";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { registerUserApi } from "../apis/userApi";

const schema = yup.object().shape({
  username: yup
    .string()
    .min(3, "Username must be at least 3 characters long.")
    .max(20, "Username must be at most 20 characters long.")
    .required("Username is required."),
  email: yup
    .string()
    .email("Invalid email format.")
    .required("Email is required.")
    .lowercase("Email must be in lowercase."),
  password: yup
    .string()
    .min(6, "Password must be at least 6 characters long.")
    .max(20, "Password must be at most 20 characters long.")
    .required("Password is required."),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match.")
    .required("Password confirmation is required."),
});

const Signup = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onchange",
    resolver: yupResolver(schema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const navigate = useNavigate();

  const onRegister = async (values) => {
    try {
      const response = await registerUserApi({ ...values });
      if (response) {
        toast.success(response.message);
        navigate("/sign-in");
      }
    } catch (error) {
      console.log("Failed to sign up:", error);
      toast.error(error.message);
    } finally {
      reset();
    }
  };

  return (
    <div className="mt-10 mb-20">
      <form
        onSubmit={handleSubmit(onRegister)}
        className="w-full max-w-xl mx-auto"
      >
        <h1 className="text-5xl text-center font-semibold mb-5">
          Create an account
        </h1>
        <div className="space-y-5">
          <FieldInput
            label="Username"
            name="username"
            register={register}
            errorMessage={errors?.username?.message}
            placeholder="Enter your username..."
          />

          <FieldInput
            label="Email"
            type="email"
            name="email"
            register={register}
            errorMessage={errors?.email?.message}
            placeholder="Enter your email..."
          />

          <FieldInput
            label="Password"
            type="password"
            name="password"
            register={register}
            errorMessage={errors?.password?.message}
            placeholder="Enter your password..."
          />

          <FieldInput
            label="Confirm password"
            type="password"
            name="confirmPassword"
            register={register}
            errorMessage={errors?.confirmPassword?.message}
            placeholder="Enter your confirm password..."
          />
        </div>

        <Button
          className="w-full mt-5"
          type="submit"
          label="Register"
          disabled={isSubmitting}
          loading={isSubmitting}
        />

        <div className="flex items-center justify-between mt-5">
          <p className="text-gray-400">Already have an account?</p>
          <Link to="/sign-in">
            <Button type="button" label="Login" text raised />
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signup;
