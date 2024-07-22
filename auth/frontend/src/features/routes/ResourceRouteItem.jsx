import PropTypes from "prop-types";
import { useEffect } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { TrashIcon, PencilSquareIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import HTTPMethod from "../../components/HTTPMethod";
import LoadingButton from "../../components/LoadingButton";
import ConfirmModal from "../../components/ConfirmModal";
import { fetchWithCredentials } from "../../utils/fetchFn";

const ResourceRouteItem = ({ route }) => {
  const client = useQueryClient();

  const {
    isPending: isDeleting,
    error,
    mutate,
  } = useMutation({
    mutationFn: () => fetchWithCredentials(`/routes/${route.id}`, "DELETE"),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["routes", route.resource_id],
      });
      toast.success("Route deleted successfully");
    },
    onError: (error) => {
      toast.error(error.message);
    },
  });

  useEffect(() => {
    if (error) {
      document.getElementById(`route_${route.id}`).close();
    }
  });

  const handleDelete = (id) => {
    mutate(id);
  };

  return (
    <div className="card flex-row items-center justify-between w-full shadow-md border-2 my-3 px-3">
      <div className="flex items-center gap-3">
        <HTTPMethod method={route.method} />
        <Link to="#">
          <button className="btn btn-link p-2">{route.path}</button>
        </Link>
      </div>
      <div className="flex items-center justify-end">
        <p className="mr-6 text-neutral-500/90 text-sm">
          {route.description || "No description"}
        </p>
        <button className="btn  btn-ghost btn-sm">
          <PencilSquareIcon className="text-green-600 w-4 h-4" />
        </button>
        <button
          className="btn btn-ghost btn-sm"
          onClick={() =>
            document.getElementById(`route_${route.id}`).showModal()
          }
          disabled={isDeleting}
        >
          <LoadingButton isLoading={isDeleting}>
            <TrashIcon className="text-red-600 w-4 h-4" />
          </LoadingButton>
        </button>
      </div>
      <ConfirmModal
        id={`route_${route.id}`}
        title="Delete Route"
        message="Are you sure you want to delete this Route?"
      >
        <button
          className="btn btn-sm btn-error rounded-lg bg-red-600 text-base-300"
          onClick={() => handleDelete(route.id)}
          disabled={isDeleting}
        >
          Confirm
        </button>
      </ConfirmModal>
    </div>
  );
};

ResourceRouteItem.propTypes = {
  route: PropTypes.object,
};

export default ResourceRouteItem;
