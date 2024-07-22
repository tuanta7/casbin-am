import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import LoadingButton from "../../components/LoadingButton";
import InputLabel from "../../components/InputLabel";
import { fetchWithCredentials } from "../../utils/fetchFn";

const ServiceEdit = ({ setShowForm, serviceToEdit = {} }) => {
  const queryClient = useQueryClient();

  const { id, ...editValues } = serviceToEdit;

  const { register, handleSubmit, formState } = useForm({
    defaultValues: editValues,
  });
  const { errors } = formState;

  const { isPending: isUpdating, mutate } = useMutation({
    mutationFn: (data) =>
      fetchWithCredentials(`/services/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
      toast.success("Service updated successfully");
      setShowForm(false);
    },
  });

  function onSubmit(data) {
    mutate(data);
  }

  return (
    <div className="border border-base-content rounded-lg my-6 bg-base-100">
      <h2 className="font-semibold px-6 mt-3">Edit Service</h2>
      <form
        className="flex flex-col py-3 px-6 gap-2"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="on"
      >
        <InputLabel label={"Domain"} errorMessage={errors?.domain?.message}>
          <input
            type="url"
            className="input input-sm input-bordered w-full input-primary"
            id="domain"
            disabled={isUpdating}
            {...register("domain", {
              required: "This field is required",
            })}
          />
        </InputLabel>
        <InputLabel label={"Service Name"} errorMessage={errors?.name?.message}>
          <input
            type="text"
            className="input input-sm input-bordered w-full input-primary"
            id="name"
            disabled={isUpdating}
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
            className="input input-sm input-bordered w-full input-primary"
            id="description"
            disabled={isUpdating}
            {...register("description", {
              maxLength: {
                value: 100,
                message: "Description should not exceed 100 characters",
              },
            })}
          />
        </InputLabel>
        <div className="flex xl:flex-row-reverse gap-3 mt-4">
          <button
            className="btn btn-primary rounded-lg btn-sm"
            type="submit"
            disabled={isUpdating}
          >
            <LoadingButton isLoading={isUpdating}>Save</LoadingButton>
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
ServiceEdit.propTypes = {
  setShowForm: PropTypes.func.isRequired,
  serviceToEdit: PropTypes.object,
};

export default ServiceEdit;
