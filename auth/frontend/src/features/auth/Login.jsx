import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingButton from "../../components/LoadingButton";
import { fetchWithCredentials } from "../../utils/fetchFn";
import InuptLabel from "../../components/InputLabel";

const Login = () => {
  const navigate = useNavigate();
  const { handleSubmit, register, reset, formState } = useForm();
  const { errors } = formState;

  const { mutate, isPending } = useMutation({
    mutationFn: (data) => fetchWithCredentials(`/login`, "POST", data),
    onSuccess: () => {
      reset();
      toast.success("Logged in successfully");
      navigate("/");
    },
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <div className="bg-bifrost bg-cover bg-no-repeat h-screen flex justify-center sm:items-center overflow-auto">
      <div className="p-6 w-full sm:max-w-md border shadow-xl rounded-xl bg-base-100 overflow-auto">
        <h2 className="text-2xl font-bold text-neutral">Login</h2>
        <form
          className="mt-3"
          onSubmit={handleSubmit(onSubmit)}
          autoComplete="on"
        >
          <InuptLabel label="Username" errorMessage={errors?.username?.message}>
            <input
              className="input input-bordered"
              type="text"
              required
              {...register("username", {
                required: "Username is required",
              })}
            />
          </InuptLabel>
          <InuptLabel
            label={"Password"}
            errorMessage={errors?.password?.message}
          >
            <input
              className=" input input-bordered"
              type="password"
              required
              {...register("password", {
                required: "Password is required",
                minLength: {
                  value: 8,
                  message: "Password must be at least 8 characters",
                },
                maxLength: {
                  value: 32,
                  message: "Password must not exceed 20 characters",
                },
              })}
            />
            <div className="label">
              <div className="text-sm">
                <Link to="/forgot" className="font-semibold text-primary">
                  Forgot password?
                </Link>
              </div>
            </div>
          </InuptLabel>
          <button
            type="submit"
            className="btn btn-primary w-full rounded-xl mt-4"
          >
            <LoadingButton isLoading={isPending}>Login</LoadingButton>
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;
