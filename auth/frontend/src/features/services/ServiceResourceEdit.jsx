import PropTypes from "prop-types";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

import InputErrorMessage from "../../components/InputErrorMessage";
import LoadingButton from "../../components/LoadingButton";
import { fetchWithCredentials } from "../../utils/fetchFn";

const ServiceResourceEdit = ({ setShowForm, resourceToEdit = {} }) => {
  const queryClient = useQueryClient();
  const { id: serviceId } = useParams();
  const { id, ...editValues } = resourceToEdit;

  const { register, handleSubmit, formState } = useForm({
    defaultValues: editValues,
  });
  const { errors } = formState;

  const { isPending: isUpdating, mutate } = useMutation({
    mutationFn: (data) =>
      fetchWithCredentials(`/resources/${id}/`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["resources", serviceId],
      });
      toast.success("Resources updated successfully");
      setShowForm(false);
    },
    onError: (error) => toast.error(error.message),
  });

  const onSubmit = (data) => {
    mutate(data);
  };

  return (
    <form className="flex items-center" onSubmit={handleSubmit(onSubmit)}>
      <div className="px-3 flex flex-col min-w-80">
        <div className="border rounded-lg mb-2">
          <input
            type="text"
            placeholder="Resource Name"
            className="input input-sm no-focus w-full"
            id="display_name"
            {...register("display_name", {
              required: "Resource name is required",
              maxLength: {
                value: 200,
                message:
                  "Service:Resource name should not exceed 200 characters",
              },
            })}
          />
        </div>
        <div className="border rounded-lg">
          <input
            type="text"
            placeholder="Description"
            className="input input-xs no-focus w-full "
            id="description"
            {...register("description", {
              maxLength: {
                value: 100,
                message: "Description should not exceed 100 characters",
              },
            })}
          />
        </div>
      </div>
      <div>
        <button
          className="btn btn-ghost btn-circle rounded-lg btn-sm"
          type="submit"
          disabled={isUpdating}
        >
          <LoadingButton isLoading={isUpdating}>
            <CheckCircleIcon className="text-primary w-5 h-5" />
          </LoadingButton>
        </button>
        <button
          className="btn btn-ghost btn-circle rounded-lg btn-sm"
          type="reset"
          onClick={() => setShowForm(false)}
        >
          <XCircleIcon className="text-base-content w-5 h-5" />
        </button>
        <InputErrorMessage message={errors?.name?.message} />
        <InputErrorMessage message={errors?.description?.message} />
      </div>
    </form>
  );
};
ServiceResourceEdit.propTypes = {
  setShowForm: PropTypes.func.isRequired,
  resourceToEdit: PropTypes.object,
};

export default ServiceResourceEdit;
