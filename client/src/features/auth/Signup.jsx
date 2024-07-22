import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import InputErrorMessage from "../../components/InputErrorMessage";
import GoogleButton from "./GoogleButton";
import toast from "react-hot-toast";
import LoadingButton from "../../components/LoadingButton";

const Signup = () => {
  const navigate = useNavigate();
  const { handleSubmit, register, reset, formState, getValues } = useForm();
  const { errors } = formState;

  const { mutate, isPending } = useMutation({
    mutationFn: (data) =>
      fetch(`${import.meta.env.VITE_BE_URL}/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.status !== "success") throw new Error(data.message);
        }),
    onSuccess: () => {
      reset();
      toast.success("Đăng ký thành công");
      navigate("/");
    },
    onError: (error) => toast.error(error.message),
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-neutral flex justify-between items-center">
        Đăng ký tài khoản mới
        <Link to="/">
          <img src="/heimdall-2.png" className="w-12" />
        </Link>
      </h2>
      <form
        className="mt-3"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="on"
      >
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Họ và tên</span>
            <InputErrorMessage message={errors?.name?.message} />
          </div>
          <input
            type="name"
            className="input input-bordered"
            {...register("name", {
              required: "Họ và tên không được để trống",
            })}
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Email </span>
            <InputErrorMessage message={errors?.email?.message} />
          </div>
          <input
            type="email"
            className="input input-bordered"
            {...register("email", {
              required: "Email không được để trống",
            })}
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Mật khẩu</span>
            <InputErrorMessage message={errors?.password?.message} />
          </div>
          <input
            type="password"
            className=" input input-bordered"
            {...register("password", {
              required: "Mật khẩu không được để trống",
              minLength: {
                value: 8,
                message: "Mật khẩu phải có ít nhất 8 ký tự",
              },
            })}
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Nhập lại mật khẩu</span>
            <InputErrorMessage message={errors?.confirm_password?.message} />
          </div>
          <input
            type="password"
            className=" input input-bordered"
            {...register("confirm_password", {
              validate: (value) =>
                value === getValues("password") || "Mật khẩu không khớp",
            })}
          />
        </label>
        <button
          type="submit"
          className="btn btn-primary w-full rounded-xl mt-4"
        >
          <LoadingButton isLoading={isPending}>Đăng ký</LoadingButton>
        </button>
      </form>
      <p className="mt-3 text-center text-sm text-neutral">
        Đã có tài khoản?{" "}
        <Link to="/auth/login" className="font-semibold text-primary">
          Đăng nhập
        </Link>
      </p>
      <div className="mb-6 border-b border-base-content text-center">
        <div className="px-2 inline-block text-sm text-neutral bg-base-100 transform translate-y-1/2">
          Hoặc
        </div>
      </div>
      <GoogleButton />
    </>
  );
};

export default Signup;
