import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import LoadingButton from "../../components/LoadingButton";
import ConfirmModal from "../../components/ConfirmModal";
import { fetchWithCredentials } from "../../utils/fetchFn";

const RoleDelete = ({ id }) => {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate } = useMutation({
    mutationFn: (id) => fetchWithCredentials(`/roles/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["roles"],
      });
      toast.success("Role deleted successfully");
    },
  });

  const handleDelete = (id) => {
    mutate(id);
  };

  return (
    <>
      <button
        className="btn btn-outline btn-error rounded-lg btn-sm border-red-600"
        onClick={() => document.getElementById(`role_${id}`).showModal()}
        disabled={isDeleting}
      >
        <LoadingButton isLoading={isDeleting}>
          <span className="text-red-600">Delete</span>
        </LoadingButton>
      </button>
      <ConfirmModal
        id={`role_${id}`}
        title="Delete role"
        message="Are you sure you want to delete this role?"
      >
        <button
          className="btn btn-sm btn-error rounded-lg bg-red-600 text-base-300"
          onClick={() => handleDelete(id)}
          disabled={isDeleting}
        >
          Confirm
        </button>
      </ConfirmModal>
    </>
  );
};

RoleDelete.propTypes = {
  id: PropTypes.number.isRequired,
};

export default RoleDelete;
