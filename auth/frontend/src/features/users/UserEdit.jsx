import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import LoadingButton from "../../components/LoadingButton";
import { fetchWithCredentials } from "../../utils/fetchFn";
import InputLabel from "../../components/InputLabel";

const UserEdit = ({ setShowForm, userToEdit = {} }) => {
  const queryClient = useQueryClient();

  const { id, name, email, provider } = userToEdit;

  const { register, handleSubmit, formState } = useForm({
    defaultValues: { name },
  });
  const { errors } = formState;

  const { isPending: isCreating, mutate } = useMutation({
    mutationFn: (data) => {
      // TODO: upload avatar
      return fetchWithCredentials(`/users/${id}`, "PATCH", {
        name: data.name,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
      toast.success("Users updated successfully");
      setShowForm(false);
    },
  });

  function onSubmit(data) {
    mutate(data);
  }

  return (
    <div className="border border-base-content rounded-lg my-6 bg-base-100">
      <h2 className="font-semibold px-6 mt-3">Edit User</h2>
      <form
        className="flex flex-col py-3 px-6 gap-2"
        onSubmit={handleSubmit(onSubmit)}
        autoComplete="on"
      >
        <InputLabel label={"Display Name"} errorMessage={errors?.name?.message}>
          <input
            type="text"
            className="input input-sm input-bordered w-full input-primary"
            id="name"
            disabled={isCreating}
            {...register("name", {
              required: "This field is required",
              maxLength: {
                value: 100,
                message: "Server name should not exceed 100 characters",
              },
            })}
          />
        </InputLabel>
        <InputLabel label={"Email"}>
          <input
            type="text"
            className="input input-sm input-bordered w-full input-primary"
            id="email"
            value={email}
            disabled
          />
        </InputLabel>
        <InputLabel label={"Identity Provider"}>
          <input
            type="text"
            className="input input-sm input-bordered w-full input-primary"
            id="provider"
            value={provider.name}
            disabled
          />
        </InputLabel>
        <InputLabel label={"Avatar"} errorMessage={errors?.avatar?.message}>
          <input
            type="file"
            className="file-input file-input-sm file-input-bordered file-input-primary w-full"
            accept="image/*"
            id="avatar"
            disabled={isCreating}
            {...register("avatar", {
              required: false,
            })}
          />
        </InputLabel>
        <div className="flex xl:flex-row-reverse gap-3 mt-4">
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

UserEdit.propTypes = {
  setShowForm: PropTypes.func.isRequired,
  userToEdit: PropTypes.object.isRequired,
};

export default UserEdit;
