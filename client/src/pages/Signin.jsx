import React from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FieldInput from "../components/FieldInput";
import { Button } from "primereact/button";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { loginUserApi } from "../apis/userApi";
import { userStore } from "../zustand/userStore";

const schema = yup.object().shape({
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
});

const Signin = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    mode: "onchange",
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const navigate = useNavigate();
  const setCurrentUser = userStore((state) => state.setCurrentUser);

  const onLogin = async (values) => {
    try {
      const response = await loginUserApi({ ...values });
      if (response) {
        setCurrentUser(response.results);
        toast.success(response.message);
        navigate("/");
      }
    } catch (error) {
      console.log("Failed to sign in:", error);
      toast.error(error.message);
    } finally {
      reset();
    }
  };

  return (
    <div className="mt-32 mb-40">
      <form
        onSubmit={handleSubmit(onLogin)}
        className="w-full max-w-xl mx-auto"
      >
        <h1 className="text-5xl text-center font-semibold mb-5">Login</h1>
        <div className="space-y-5">
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
        </div>

        <Button
          className="w-full mt-5"
          type="submit"
          label="Login"
          disabled={isSubmitting}
          loading={isSubmitting}
        />

        <div className="flex items-center justify-between mt-5 flex-wrap">
          <div className="flex items-center flex-wrap">
            <p className="text-gray-400">Not have an account?</p>
            <Link to="/sign-up">
              <Button type="button" label="Register" text raised />
            </Link>
          </div>

          <Link to="/reset-password">
            <Button
              type="button"
              label="Forgot password?"
              text
              raised
              severity="danger"
            />
          </Link>
        </div>
      </form>
    </div>
  );
};

export default Signin;
