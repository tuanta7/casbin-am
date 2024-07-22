import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrashIcon } from "@heroicons/react/24/outline";

import toast from "react-hot-toast";
import LoadingButton from "../../../components/LoadingButton";
import { fetchWithCredentials } from "../../../utils/fetchFn";

const InlinePermissionDelete = ({ permission }) => {
  const { id } = useParams();
  const client = useQueryClient();

  const { isPending, mutate } = useMutation({
    mutationFn: (payload) =>
      fetchWithCredentials(`/roles/${id}/permissions`, "DELETE", payload),
    onSuccess: () => {
      client.invalidateQueries(["role-permissions", id]);
      toast.success("Permission deleted");
    },
  });

  const handleDelete = () => {
    mutate(permission);
  };

  return (
    <button
      className="btn btn-ghost btn-sm"
      onClick={handleDelete}
      disabled={isPending}
    >
      <span className="text-red-600">
        <LoadingButton isLoading={isPending}>
          <TrashIcon className="w-4 h-4" />
        </LoadingButton>
      </span>
    </button>
  );
};
InlinePermissionDelete.propTypes = {
  permission: PropTypes.array.isRequired,
};

export default InlinePermissionDelete;
