import PropTypes from "prop-types";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

import ConfirmModal from "../../../components/ConfirmModal";
import { fetchWithCredentials } from "../../../utils/fetchFn";

const RolePolicyDelete = ({ policy }) => {
  const client = useQueryClient();
  const { id } = useParams();

  const { isPending, error, mutate } = useMutation({
    mutationFn: () =>
      fetchWithCredentials(`/roles/${id}/policies`, "DELETE", policy),
    onSuccess: () => {
      client.invalidateQueries(["role-policies", id]);
      toast.success("Policy deleted successfully");
    },
  });

  useEffect(() => {
    if (error) {
      document.getElementById(`role_policies_${id}`).close();
    }
  });

  return (
    <>
      <button
        className="btn btn-ghost btn-sm"
        onClick={() =>
          document.getElementById(`role_policies_${id}`).showModal()
        }
        disabled={isPending}
      >
        <TrashIcon className="text-red-600 w-4" />
      </button>
      <ConfirmModal
        id={`role_policies_${id}`}
        title="Delete role policy"
        message={`Are you sure to delete this policy: ${policy}?`}
      >
        <button
          className="btn btn-sm btn-error rounded-lg bg-red-600 text-base-300"
          onClick={() => mutate()}
          disabled={isPending}
        >
          Confirm
        </button>
      </ConfirmModal>
    </>
  );
};
RolePolicyDelete.propTypes = {
  policy: PropTypes.string.isRequired,
};

export default RolePolicyDelete;
