import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingButton from "../../components/LoadingButton";
import InputLabel from "../../components/InputLabel";
import { fetchWithCredentials } from "../../utils/fetchFn";

const ServiceCreate = ({ setShowForm }) => {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  const { isPending: isCreating, mutate } = useMutation({
    mutationFn: (data) => fetchWithCredentials("/services", "POST", data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
      toast.success("Service added successfully");
      reset();
    },
  });

  const onSubmit = (data) => mutate(data);

  return (
    <div className="border border-base-content rounded-lg my-6">
      <h2 className="font-semibold px-6 mt-3">New Service</h2>
      <form
        className="flex flex-col py-3 px-6 gap-2"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="on"
      >
        <InputLabel label={"Domain"} errorMessage={errors?.domain?.message}>
          <input
            type="url"
            className="input input-bordered w-full input-primary"
            id="domain"
            disabled={isCreating}
            {...register("domain", {
              required: "This field is required",
            })}
          />
        </InputLabel>
        <InputLabel label={"Service Name"} errorMessage={errors?.name?.message}>
          <input
            type="text"
            className="input input-bordered w-full input-primary"
            id="name"
            disabled={isCreating}
            {...register("name", {
              required: "This field is required",
              maxLength: {
                value: 100,
                message: "Service name should not exceed 100 characters",
              },
            })}
          />
        </InputLabel>
        <InputLabel
          label={"Description"}
          errorMessage={errors?.description?.message}
        >
          <input
            type="text"
            className="input input-bordered w-full input-primary"
            id="description"
            disabled={isCreating}
            {...register("description", {
              maxLength: {
                value: 100,
                message: "Description should not exceed 100 characters",
              },
            })}
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

ServiceCreate.propTypes = {
  setShowForm: PropTypes.func,
};

export default ServiceCreate;
