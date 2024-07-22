import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import { CheckCircleIcon, XCircleIcon } from "@heroicons/react/24/outline";

import LoadingButton from "../../components/LoadingButton";
import InputErrorMessage from "../../components/InputErrorMessage";
import { fetchWithCredentials } from "../../utils/fetchFn";

const ResourceRouteCreate = ({ setShowForm, resourceId }) => {
  const queryClient = useQueryClient();

  const { register, handleSubmit, reset, formState } = useForm({
    defaultValues: {
      method_id: 0,
    },
  });
  const { errors } = formState;

  const { isPending: isCreating, mutate } = useMutation({
    mutationFn: (payload) =>
      fetchWithCredentials(
        `/resources/${resourceId}/routes`,
        "POST",

        payload
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["routes", resourceId],
      });
      toast.success("Route added successfully");
      reset();
    },
  });

  const onSubmit = (data) => {
    data.method_id = parseInt(data.method_id);
    mutate(data);
  };

  const content = (
    <select
      className="select select-bordered select-sm max-w-xs"
      id="method"
      {...register("method", {
        validate: (value) => value.toString() !== "0" || "Method is required",
      })}
    >
      <option disabled value={0}>
        Method
      </option>
      {["GET", "POST", "PUT", "PATCH", "DELETE", "*"].map((method) => (
        <option key={method} value={method}>
          {method}
        </option>
      ))}
    </select>
  );

  return (
    <>
      <InputErrorMessage message={errors?.path?.message} />
      <InputErrorMessage message={errors?.description?.message} />
      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex gap-3 border border-secondary p-3 mt-2 mb-4 rounded-lg"
      >
        {content}
        <div className="border border-base-content rounded-lg w-full">
          <input
            type="text"
            placeholder="Path: /api/resource"
            className="input input-sm no-focus w-full"
            id="name"
            {...register("path", {
              required: "Route path is required",
              pattern: {
                value: /^(?!.*\/\/)[a-zA-Z0-9:*/{}]*$/,
                message:
                  "Only alphanumeric, :, *, { } and single / are allowed in route path",
              },
              maxLength: {
                value: 100,
                message: "Route path should not exceed 100 characters",
              },
            })}
          />
        </div>
        <div className="border border-base-content rounded-lg w-full">
          <input
            type="text"
            placeholder="Description: read resource"
            className="input input-sm no-focus w-full"
            id="description"
            {...register("description", {
              maxLength: {
                value: 100,
                message: "Description should not exceed 100 characters",
              },
            })}
          />
        </div>
        <div className="flex">
          <button
            className="btn btn-ghost btn-circle rounded-lg btn-sm"
            type="submit"
            disabled={isCreating}
          >
            <LoadingButton isLoading={isCreating}>
              <CheckCircleIcon className="text-secondary w-5 h-5" />
            </LoadingButton>
          </button>
          <button
            className="btn btn-ghost btn-circle rounded-lg btn-sm"
            type="reset"
            onClick={() => setShowForm(false)}
          >
            <XCircleIcon className="text-base-content w-5 h-5" />
          </button>
        </div>
      </form>
    </>
  );
};

ResourceRouteCreate.propTypes = {
  setShowForm: PropTypes.func,
  resourceId: PropTypes.number,
};

export default ResourceRouteCreate;
