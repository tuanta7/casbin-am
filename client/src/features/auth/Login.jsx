import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import InputErrorMessage from "../../components/InputErrorMessage";
import GoogleButton from "./GoogleButton";
import toast from "react-hot-toast";
import LoadingButton from "../../components/LoadingButton";
import useGlobalContext from "../../hooks/useGlobalContext";

const Login = () => {
  const navigate = useNavigate();
  const { setAccessToken } = useGlobalContext();
  const { handleSubmit, register, reset, formState } = useForm();
  const { errors } = formState;

  const { mutate, isPending } = useMutation({
    mutationFn: (payload) =>
      fetch(`${import.meta.env.VITE_BE_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      })
        .then((res) => res.json())
        .then((data) => {
          console.log(data);
          if (data.status !== "success") throw new Error(data.message);
          setAccessToken(data.data.access_token);
        }),
    onSuccess: () => {
      reset();
      toast.success("Đăng nhập thành công");
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
        Đăng nhập
        <Link to="/">
          <img src="/logo.png" className="w-12" />
        </Link>
      </h2>
      <form
        className="mt-3"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="on"
      >
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Email</span>
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
            <span className="label-text font-semibold">Password</span>
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
          <div className="label">
            <div className="text-sm">
              <Link to="forgot" className="font-semibold text-primary">
                Quên mật khẩu?
              </Link>
            </div>
          </div>
        </label>
        <button
          type="submit"
          className="btn btn-primary w-full rounded-xl mt-4"
        >
          <LoadingButton isLoading={isPending}>Đăng nhập</LoadingButton>
        </button>
      </form>
      <p className="mt-3 text-center text-sm text-neutral">
        Chưa có tài khoản?{" "}
        <Link to="/auth/signup" className="font-semibold text-primary">
          Đăng ký ngay
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

export default Login;
