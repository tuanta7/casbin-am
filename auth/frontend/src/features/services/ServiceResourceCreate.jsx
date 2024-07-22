import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingButton from "../../components/LoadingButton";
import InputLabel from "../../components/InputLabel";

import { fetchWithCredentials } from "../../utils/fetchFn";

const ServiceResourceCreate = ({ setShowForm }) => {
  const queryClient = useQueryClient();

  const { id } = useParams();
  const { register, handleSubmit, reset, formState } = useForm();
  const { errors } = formState;

  const { isPending: isCreating, mutate } = useMutation({
    mutationFn: (data) =>
      fetchWithCredentials(
        `/services/${id}/resources`,
        "POST",

        data
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resources", id], // service_id
      });
      toast.success("Resource created successfully");
      reset();
    },
    onError: (error) => toast.error(error.message),
  });

  const onSubmit = (data) => mutate(data);

  return (
    <div className="border border-base-content rounded-lg my-6">
      <h2 className="font-semibold px-6 mt-3">New Resource</h2>
      <form
        className="flex flex-col py-3 px-6 gap-2"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="on"
      >
        <InputLabel
          label={"Resource Name"}
          errorMessage={errors?.display_name?.message}
        >
          <input
            type="text"
            className="input input-sm input-bordered w-full input-primary"
            id="display_name"
            disabled={isCreating}
            {...register("display_name", {
              required: "This field is required",
              maxLength: {
                value: 100,
                message: "Resource name should not exceed 100 characters",
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

ServiceResourceCreate.propTypes = {
  setShowForm: PropTypes.func,
};

export default ServiceResourceCreate;
