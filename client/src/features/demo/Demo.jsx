import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import ReactJson from "@vahagn13/react-json-view";
import InputErrorMessage from "../../components/InputErrorMessage";
import Data from "../../components/Data";
import useGlobalContext from "../../hooks/useGlobalContext";

const Demo = () => {
  const { accessToken } = useGlobalContext();
  const { register, handleSubmit, formState, getValues } = useForm({
    defaultValues: {
      url: "http://localhost:",
      method: "GET",
      access_token: accessToken,
    },
  });
  const { errors } = formState;

  const { mutate, data, isPending, error } = useMutation({
    mutationFn: () =>
      fetch(getValues("url"), {
        method: getValues("method"),
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getValues("access_token")}`,
        },
      }).then((res) => res.json()),
  });

  const onSubmit = () => {
    console.log(
      getValues("access_token"),
      getValues("url"),
      getValues("method")
    );
    mutate();
  };

  return (
    <div className="grid grid-cols-2 gap-6">
      <form
        className="mt-3"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="on"
      >
        <h2 className="text-2xl mb-3">Demo chức năng</h2>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Đường dẫn</span>
            <InputErrorMessage message={errors?.url?.message} />
          </div>
          <input
            type="url"
            className="input input-bordered"
            {...register("url", {
              required: "URL is required",
            })}
          />
        </label>
        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Phương thức</span>
            <InputErrorMessage message={errors?.method?.message} />
          </div>
          <select
            className="select select-bordered"
            id="method"
            {...register("method", {
              validate: (value) =>
                value.toString() !== "0" || "Phương thức không được để trống",
            })}
          >
            <option disabled value={0}>
              Method
            </option>
            {["GET", "POST", "PUT", "PATCH", "DELETE"].map((method) => (
              <option key={method} value={method}>
                {method}
              </option>
            ))}
          </select>
        </label>

        <label className="form-control w-full">
          <div className="label">
            <span className="label-text font-semibold">Access Token</span>
            <InputErrorMessage message={errors?.access_token?.message} />
          </div>
          <input
            type="access_token"
            className="input input-bordered"
            disabled
            {...register("access_token", {
              required: "Access token is required",
            })}
          />
        </label>
        <button type="submit" className="btn btn-primary mt-6">
          Gửi
        </button>
      </form>
      <div className="border border-base-content rounded-xl p-4">
        <Data isPending={isPending} error={error}>
          <p>Request: {`${getValues("method")} ${getValues("url")}`}</p>
          <div className="max-w-64 break-words">
            Dữ liệu trả về: {<ReactJson src={data} indentWidth={2} />}
          </div>
        </Data>
      </div>
    </div>
  );
};
Demo.propTypes = {};

export default Demo;
