import PropTypes from "prop-types";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import LoadingButton from "../../components/LoadingButton";
import ConfirmModal from "../../components/ConfirmModal";
import { fetchWithCredentials } from "../../utils/fetchFn";

const PolicyDelete = ({ id }) => {
  const queryClient = useQueryClient();

  const {
    isPending: isDeleting,
    error,
    mutate,
  } = useMutation({
    mutationFn: (id) => fetchWithCredentials(`/policies/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries(["policies"]);
      queryClient.invalidateQueries(["role-policies"]);
      toast.success("Policy deleted successfully");
    },
  });

  useEffect(() => {
    if (error) {
      document.getElementById(`policy_permission_${id}`).close();
    }
  });

  const handleDelete = (id) => {
    mutate(id);
  };

  return (
    <>
      <button
        className="btn btn-outline btn-error rounded-lg btn-sm border-red-600"
        onClick={() => document.getElementById(`policy_${id}`).showModal()}
        disabled={isDeleting}
      >
        <LoadingButton isLoading={isDeleting}>
          <span className="text-red-600">Delete</span>
        </LoadingButton>
      </button>
      <ConfirmModal
        id={`policy_${id}`}
        title="Delete policy"
        message="Are you sure to delete this policy?"
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
PolicyDelete.propTypes = {
  id: PropTypes.number.isRequired,
};

export default PolicyDelete;
