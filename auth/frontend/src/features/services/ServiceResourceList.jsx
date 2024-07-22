import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { PlusCircleIcon } from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";

import Data from "../../components/Data";
import Breadcrumbs from "../../components/Breadcrumbs";
import ServiceResourceItem from "./ServiceResourceItem";
import ServiceResourceCreate from "./ServiceResourceCreate";
import NothingHere from "../../components/NothingHere";
import { fetchWithCredentials } from "../../utils/fetchFn";

const ServiceResourceList = () => {
  const { id } = useParams();

  const [currentResource, setCurrentResource] = useState({ id: -1, index: -1 });
  const [showForm, setShowForm] = useState(false);

  const {
    isPending: serviceIsPending,
    error: serviceError,
    data: service,
  } = useQuery({
    queryKey: ["service", id],
    queryFn: () =>
      fetchWithCredentials(`/services/${id}`, "GET").then(
        (data) => data.service
      ),
  });

  const {
    isPending,
    error,
    data: resourcesData,
  } = useQuery({
    queryKey: ["resources", id],
    queryFn: () => fetchWithCredentials(`/services/${id}/resources`, "GET"),
  });

  const menu = (
    <label className="form-control w-full max-w-max mb-3">
      <div className="flex items-center gap-3">
        <select
          className="select select-bordered rounded-lg select-sm pr-12 min-w-fit"
          defaultValue={-1}
          onChange={(e) => {
            if (e.target.value === "-1") {
              setCurrentResource({ id: -1, index: -1 });
              return;
            }
            setCurrentResource({
              id: resourcesData.resources[parseInt(e.target.value)].id,
              index: parseInt(e.target.value),
            });
          }}
        >
          <option value={-1}>All Resources</option>
          {resourcesData?.resources?.map((resource, index) => (
            <option key={resource.id} value={index}>
              {resource.display_name}
            </option>
          ))}
        </select>
      </div>
    </label>
  );

  const renderedResoures = (
    <Fragment>
      {currentResource.id === -1 ? (
        resourcesData?.resources?.map((resource) => (
          <ServiceResourceItem key={resource.id} resource={resource} />
        ))
      ) : (
        <ServiceResourceItem
          resource={resourcesData?.resources[currentResource.index]}
        />
      )}
    </Fragment>
  );

  const content = (
    <Data isPending={isPending} error={error}>
      {resourcesData?.resources?.length > 0 ? (
        renderedResoures
      ) : (
        <NothingHere message={"There are no resources in this service yet"} />
      )}
    </Data>
  );

  return (
    <>
      <div className="flex justify-between mb-3 flex-wrap gap-3">
        <Breadcrumbs pages={["Services", "Resources"]} />
        <div className="flex flex-wrap gap-3">
          {menu}
          <button
            className="btn btn-primary rounded-lg btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            New <PlusCircleIcon className="text-primary-content w-4 h-4" />
          </button>
        </div>
      </div>
      <Data isPending={serviceIsPending} error={serviceError}>
        <div className="border w-fit min-w-60 py-4 pl-3 pr-10 mb-6 rounded-lg">
          <h2 className="font-semibold">{service?.name}</h2>
          <p className="text-neutral-400 text-sm">
            {service?.description || "No description"}
          </p>
        </div>
      </Data>
      {showForm && <ServiceResourceCreate setShowForm={setShowForm} />}
      {content}
    </>
  );
};

export default ServiceResourceList;
