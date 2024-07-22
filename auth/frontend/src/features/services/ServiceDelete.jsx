import PropTypes from "prop-types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import LoadingButton from "../../components/LoadingButton";
import ConfirmModal from "../../components/ConfirmModal";
import { fetchWithCredentials } from "../../utils/fetchFn";

const ServiceDelete = ({ id }) => {
  const queryClient = useQueryClient();

  const { isPending: isDeleting, mutate } = useMutation({
    mutationFn: (id) => fetchWithCredentials(`/services/${id}`, "DELETE"),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["services"],
      });
      toast.success("Service deleted successfully");
    },
  });

  const handleDelete = (id) => {
    mutate(id);
  };

  return (
    <>
      <button
        className="btn btn-outline btn-error rounded-lg btn-sm border-red-600 "
        onClick={() => document.getElementById(`service_${id}`).showModal()}
        disabled={isDeleting}
      >
        <LoadingButton isLoading={isDeleting}>
          <span className="text-red-600">Delete</span>
        </LoadingButton>
      </button>
      <ConfirmModal
        id={`service_${id}`}
        title="Delete Service"
        message="Are you sure you want to delete this Resource Service?"
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

ServiceDelete.propTypes = {
  id: PropTypes.number.isRequired,
};

export default ServiceDelete;
