import { useMutation } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingButton from "../../components/LoadingButton";
import InputLabel from "../../components/InputLabel";

const ChangePassword = () => {
  const { handleSubmit, register, reset, formState, getValues } = useForm();
  const { errors } = formState;

  const { mutate, isPending } = useMutation({
    mutationFn: (data) =>
      fetch(`${import.meta.env.VITE_BE_BASE_URL}/reset`, {
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
    },
    onError: (error) => toast.error(error.message),
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <>
      <h2 className="text-2xl font-bold text-neutral flex justify-between items-center">
        Change password
      </h2>
      <form
        className="mt-3"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="on"
      >
        <InputLabel label={"Password"} errorMessage={errors?.password?.message}>
          <input
            type="password"
            className=" input input-bordered"
            {...register("password", {
              required: "Password is required",
              minLength: {
                value: 8,
                message: "Password must be at least 8 characters",
              },
            })}
          />
        </InputLabel>
        <InputLabel
          label={"Confirm Password"}
          errorMessage={errors?.confirm_password?.message}
        >
          <input
            type="password"
            className=" input input-bordered"
            {...register("confirm_password", {
              validate: (value) =>
                value === getValues("password") || "Passwords do not match",
            })}
          />
        </InputLabel>
        <button type="submit" className="btn btn-primary rounded-xl mt-4">
          <LoadingButton isLoading={isPending}>Save</LoadingButton>
        </button>
      </form>
    </>
  );
};

export default ChangePassword;
