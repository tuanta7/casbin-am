import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import InputLabel from "../../components/InputLabel";
import LoadingButton from "../../components/LoadingButton";
import { fetchWithCredentials } from "../../utils/fetchFn";

const ProviderCreate = ({ setShowForm }) => {
  const queryClient = useQueryClient();
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  const { isPending: isCreating, mutate } = useMutation({
    mutationFn: (data) => fetchWithCredentials("/providers", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries(["providers"]);
      toast.success("Provider added successfully");
      reset();
    },
    onError: (error) => toast.error(error.message),
  });

  const onSubmit = (data) => mutate(data);

  return (
    <div className="border border-base-content  rounded-lg my-6">
      <h2 className="font-semibold px-6 mt-3">New Identity Provider</h2>
      <form
        className="flex flex-col py-3 px-6 gap-2"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="on"
      >
        <InputLabel label={"Display Name"} errorMessage={errors?.name?.message}>
          <input
            type="text"
            className="input input-bordered w-full input-primary"
            id="name"
            disabled={isCreating}
            {...register("name", {
              required: "This field is required",
            })}
          />
        </InputLabel>
        <InputLabel label={"Provider URL"} errorMessage={errors?.url?.message}>
          <input
            type="url"
            className="input input-bordered w-full input-primary"
            id="url"
            disabled={isCreating}
            {...register("url", {
              required: "This field is required",
            })}
          />
        </InputLabel>
        <InputLabel
          label={"Client ID"}
          errorMessage={errors?.client_id?.message}
        >
          <input
            type="text"
            className="input  input-bordered w-full input-primary"
            id="client_id"
            disabled={isCreating}
            {...register("client_id")}
          />
        </InputLabel>
        <InputLabel
          label={"Client Secret"}
          errorMessage={errors?.client_id?.message}
        >
          <input
            type="text"
            className="input input-bordered w-full input-primary"
            id="client_secret"
            disabled={isCreating}
            {...register("client_secret")}
          />
        </InputLabel>
        <div className="flex flex-row-reverse gap-3 mt-4">
          <button
            className="btn btn-primary rounded-lg btn-sm"
            type="submit"
            disabled={isCreating}
          >
            <LoadingButton isLoading={isCreating}>Save</LoadingButton>
          </button>
          <button
            className="btn btn-ghost rounded-lg btn-sm"
            type="reset"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

ProviderCreate.propTypes = {
  setShowForm: PropTypes.func,
};

export default ProviderCreate;
