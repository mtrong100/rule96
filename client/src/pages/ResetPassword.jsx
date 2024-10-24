import React, { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import FieldInput from "../components/FieldInput";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import toast from "react-hot-toast";
import { resetPasswordApi, sendOtpApi } from "../apis/userApi";
import { useNavigate } from "react-router-dom";

const schema = yup.object().shape({
  email: yup.string().email("Invalid email").required("Email is required"),
  password: yup
    .string()
    .min(8, "Password must be at least 8 characters long")
    .required("Password is required"),
  confirmPassword: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match")
    .required("Confirm password is required"),
  otp: yup.string().required("OTP is required").max(6, "OTP must be 6 digits"),
});

const ResetPassword = () => {
  const {
    register,
    handleSubmit,
    reset,
    getValues,
    trigger,
    formState: { isSubmitting, errors },
  } = useForm({
    mode: "onchange",
    resolver: yupResolver(schema),
    defaultValues: {
      email: "",
      password: "",
      confirmPassword: "",
      otp: "",
    },
  });

  const navigate = useNavigate();

  const handleSendOtp = async () => {
    try {
      await trigger("email");
      const email = getValues("email");
      const response = await sendOtpApi({ email });
      if (response) toast.success(response.message);
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    }
  };

  const handleResetPassword = async (values) => {
    try {
      const req = { ...values };
      const response = await resetPasswordApi(req);
      if (response) {
        toast.success(response.message);
        navigate("/sign-in");
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      reset();
    }
  };

  // FIX SCROLL BUG
  useEffect(() => {
    document.body.scrollIntoView({ behavior: "smooth", block: "start" });
  }, []);

  return (
    <div className="mt-10">
      <form
        onSubmit={handleSubmit(handleResetPassword)}
        className="w-full max-w-xl mx-auto"
      >
        <h1 className="text-3xl md:text-4xl font-bold mb-5 text-center">
          Reset password
        </h1>

        <div className="space-y-5">
          <div className="flex flex-col gap-2">
            <label className="capitalize">email</label>
            <div className="flex items-center justify-between gap-1 md:flex-row flex-col gap-2">
              <InputText
                {...register("email")}
                label="Email"
                className="w-full"
                placeholder="Enter your email"
              />
              <Button
                type="button"
                label="Send code"
                icon="pi pi-send"
                onClick={handleSendOtp}
                className="w-full md:w-[180px] h-[50px]"
              />
            </div>
            {errors && (
              <p className="mt-1 text-red-500 font-medium text-sm">
                {errors.email?.message}
              </p>
            )}
          </div>

          <FieldInput
            label=" OTP code"
            register={register}
            name="otp"
            errorMessage={errors?.otp?.message}
            placeholder="Enter your otp code"
          />

          <FieldInput
            label="password"
            register={register}
            name="password"
            type="password"
            errorMessage={errors?.password?.message}
            placeholder="Enter your password"
          />
          <FieldInput
            label="Confirm password"
            register={register}
            name="confirmPassword"
            type="password"
            errorMessage={errors?.confirmPassword?.message}
            placeholder="Enter your confirm password"
          />

          <Button
            className="w-full"
            type="submit"
            label="Reset password"
            disabled={isSubmitting}
            loading={isSubmitting}
          />
        </div>
      </form>
    </div>
  );
};

export default ResetPassword;
