import PropTypes from "prop-types";
import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PlusIcon } from "@heroicons/react/24/outline";

import Data from "../../components/Data";
import ResourceRouteCreate from "./ResourceRouteCreate";
import ResourceRouteItem from "./ResourceRouteItem";
import { fetchWithCredentials } from "../../utils/fetchFn";

const ResourceRouteList = ({ resourceId }) => {
  const [showForm, setShowForm] = useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: ["routes", resourceId],
    queryFn: () =>
      fetchWithCredentials(`/resources/${resourceId}/routes`, "GET"),
  });

  const content = (
    <Data isPending={isPending} error={error}>
      {data?.routes?.map((route) => (
        <ResourceRouteItem key={route.id} route={route} />
      ))}
    </Data>
  );

  return (
    <div>
      <div className="flex justify-between items-center">
        <h2 className="font-semibold px-1">Routes List</h2>
        <button
          className="btn btn-secondary rounded-lg btn-sm"
          onClick={() => {
            setShowForm(!showForm);
          }}
        >
          New Route <PlusIcon className="text-secondary-content w-4 h-4" />
        </button>
      </div>
      {showForm && (
        <ResourceRouteCreate
          setShowForm={setShowForm}
          resourceId={resourceId}
        />
      )}
      <div className="py-2">{content}</div>
    </div>
  );
};

ResourceRouteList.propTypes = {
  resourceId: PropTypes.number,
};

export default ResourceRouteList;
