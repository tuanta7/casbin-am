import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";

import LoadingButton from "../../components/LoadingButton";
import InputLabel from "../../components/InputLabel";
import { fetchWithCredentials } from "../../utils/fetchFn";

const PolicyEdit = ({ setShowForm, policyToEdit = {} }) => {
  const queryClient = useQueryClient();
  const { id, ...editValues } = policyToEdit;

  const { register, handleSubmit, formState } = useForm({
    defaultValues: editValues,
  });
  const { errors } = formState;

  const { isPending, mutate } = useMutation({
    mutationFn: (data) =>
      fetchWithCredentials(`/policies/${id}`, "PATCH", data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["policies"],
      });
      toast.success("Policy updated successfully");
      setShowForm(false);
    },
  });

  function onSubmit(data) {
    mutate(data);
  }

  return (
    <div className="border border-base-content rounded-lg my-6 bg-base-100">
      <h2 className="font-semibold px-6 mt-3">Edit Policy</h2>
      <form
        className="flex flex-col py-3 px-6 gap-2"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="on"
      >
        <InputLabel
          label={"Policy Name"}
          errorMessage={errors?.display_name?.message}
        >
          <input
            type="text"
            className="input input-sm input-bordered w-full input-primary"
            id="display_name"
            disabled={isPending}
            {...register("display_name", {
              required: "This field is required",
              maxLength: {
                value: 100,
                message: "Policy name should not exceed 100 characters",
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
            disabled={isPending}
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
            disabled={isPending}
          >
            <LoadingButton isLoading={isPending}>Save</LoadingButton>
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

PolicyEdit.propTypes = {
  setShowForm: PropTypes.func.isRequired,
  policyToEdit: PropTypes.object,
};

export default PolicyEdit;
