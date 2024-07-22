import PropTypes from "prop-types";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import {
  ChevronUpIcon,
  ChevronDownIcon,
  TrashIcon,
  PencilSquareIcon,
} from "@heroicons/react/24/outline";

import ResourceRouteList from "../routes/ResourceRouteList";
import LoadingButton from "../../components/LoadingButton";
import ConfirmModal from "../../components/ConfirmModal";
import ServiceResourceEdit from "./ServiceResourceEdit";
import { fetchWithCredentials } from "../../utils/fetchFn";

const ServiceResourceItem = ({ resource }) => {
  const client = useQueryClient();

  const { id: serviceId } = useParams();
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const { isPending: isDeleting, mutate } = useMutation({
    mutationFn: () =>
      fetchWithCredentials(`/resources/${resource.id}`, "DELETE"),
    onSuccess: () => {
      client.invalidateQueries({
        queryKey: ["resources", serviceId],
      });
      toast.success("Resource deleted successfully");
    },
  });

  const modal = (
    <ConfirmModal
      id={`resources_${resource.id}`}
      title="Delete Resource"
      message="Are you sure you want to delete this resource and its routes?"
    >
      <button
        className="btn btn-sm btn-error rounded-lg bg-red-600 text-base-300"
        onClick={() => mutate()}
        disabled={isDeleting}
      >
        Confirm
      </button>
    </ConfirmModal>
  );

  return (
    <div
      tabIndex={0}
      className={
        `my-3 collapse border rounded-xl border-base-content min-w-fit ` +
        (open ? "collapse-open" : "collapse-close")
      }
    >
      <div className="collapse-title text-md font-medium flex items-center justify-between pr-4">
        {modal}
        <div className="flex items-center">
          <div className="flex items-center border rounded-xl">
            <button
              className="btn btn-ghost btn-sm"
              onClick={() =>
                document.getElementById(`resources_${resource.id}`).showModal()
              }
              disabled={isDeleting}
            >
              <LoadingButton isLoading={isDeleting}>
                <TrashIcon className="text-red-600 w-4 h-4" />
              </LoadingButton>
            </button>
            <button
              className="btn  btn-ghost btn-sm"
              onClick={() => setIsEditing(!isEditing)}
            >
              <PencilSquareIcon className="text-green-600 w-4 h-4" />
            </button>
          </div>

          {isEditing ? (
            <ServiceResourceEdit
              setShowForm={setIsEditing}
              resourceToEdit={resource}
            />
          ) : (
            <div className="px-3">
              <h2>
                {resource.display_name}{" "}
                <span className="text-neutral-500 text-sm font-normal">
                  ({resource.name})
                </span>
              </h2>
              <p className="text-neutral-500 text-xs font-normal">
                {resource.description || "No description"}
              </p>
            </div>
          )}
        </div>
        <button
          className="btn btn-xs btn-ghost min-w-fit flex "
          onClick={() => {
            setOpen(!open);
          }}
        >
          Routes
          {open ? (
            <ChevronUpIcon className="text-base-content w-3 h-4" />
          ) : (
            <ChevronDownIcon className="text-base-content w-3" />
          )}
        </button>
      </div>
      <div className="collapse-content">
        <ResourceRouteList resourceId={resource.id} />
      </div>
    </div>
  );
};
ServiceResourceItem.propTypes = {
  resource: PropTypes.object.isRequired,
};

export default ServiceResourceItem;
