import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "@heroicons/react/24/outline";

import toast from "react-hot-toast";
import LoadingButton from "../../components/LoadingButton";
import ConfirmModal from "../../components/ConfirmModal";
import { fetchWithCredentials } from "../../utils/fetchFn";
import { useEffect } from "react";

const PolicyPermissionDelete = ({ permission }) => {
  const { id } = useParams();
  const client = useQueryClient();

  const { isPending, error, mutate } = useMutation({
    mutationFn: (payload) =>
      fetchWithCredentials(`/policies/${id}/permissions`, "DELETE", payload),
    onSuccess: () => {
      client.invalidateQueries(["policy-permissions", id]);
      toast.success("Policy deleted");
    },
  });

  useEffect(() => {
    if (error) {
      document.getElementById(`policy_permission_${permission}`).close();
    }
  });

  const handleDelete = () => {
    mutate(permission);
  };

  return (
    <>
      <button
        className="btn btn-ghost btn-sm"
        onClick={() =>
          document.getElementById(`policy_permission_${permission}`).showModal()
        }
        disabled={isPending}
      >
        <span className="text-red-600">
          <LoadingButton isLoading={isPending}>
            <TrashIcon className="w-4 h-4" />
          </LoadingButton>
        </span>
      </button>
      <ConfirmModal
        id={`policy_permission_${permission}`}
        title="Delete permission confirmation"
        message="Are you sure you want to delete this permission ?"
      >
        <button
          className="btn btn-sm btn-error rounded-lg bg-red-600 text-base-300"
          onClick={() => handleDelete(id)}
          disabled={isPending}
        >
          Confirm
        </button>
      </ConfirmModal>
    </>
  );
};

PolicyPermissionDelete.propTypes = {
  permission: PropTypes.array.isRequired,
};

export default PolicyPermissionDelete;
