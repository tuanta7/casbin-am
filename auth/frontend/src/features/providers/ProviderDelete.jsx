import { useMutation, useQueryClient } from "@tanstack/react-query";
import PropTypes from "prop-types";
import toast from "react-hot-toast";

import ConfirmModal from "../../components/ConfirmModal";
import LoadingButton from "../../components/LoadingButton";
import { fetchWithCredentials } from "../../utils/fetchFn";

const ProviderDelete = ({ id }) => {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate } = useMutation({
    mutationFn: (id) => fetchWithCredentials(`/providers/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["providers"],
      });
      toast.success("Provider deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  const handleDelete = (id) => {
    mutate(id);
  };

  return (
    <>
      <button
        className="btn btn-outline btn-error rounded-lg btn-sm border-red-600 "
        onClick={() => document.getElementById(`provider_${id}`).showModal()}
        disabled={isDeleting}
      >
        <LoadingButton isLoading={isDeleting}>
          <span className="text-red-600">Delete</span>
        </LoadingButton>
      </button>
      <ConfirmModal
        id={`provider_${id}`}
        title="Delete Identity Provider"
        message="Are you sure you want to delete this IdP?"
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
ProviderDelete.propTypes = {
  id: PropTypes.number.isRequired,
};

export default ProviderDelete;
