import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Data from "../../components/Data";
import Table from "../../components/Table";

import {
  ArrowUturnLeftIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

import Pagination from "../../components/Pagination";
import ServiceListRow from "./ServiceListRow";
import ServiceCreate from "./ServiceCreate";
import Breadcrumbs from "../../components/Breadcrumbs";
import { fetchWithCredentials } from "../../utils/fetchFn";

const ServiceList = () => {
  const [showForm, setShowForm] = useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: ["services"],
    queryFn: () => fetchWithCredentials("/services", "GET"),
  });

  const content = (
    <Data isPending={isPending} error={error}>
      <Table
        headers={[
          "Service Name",
          "Domain",
          "Description",
          "Created At",
          "Updated At",
        ]}
      >
        {data?.services?.map((service) => (
          <ServiceListRow key={service.id} service={service} span={7} />
        ))}
      </Table>
    </Data>
  );

  return (
    <>
      <div className="flex justify-between mb-3 flex-wrap gap-3">
        <Breadcrumbs pages={["Services"]} />
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center border rounded-lg">
            <input
              type="text"
              placeholder="Search"
              className="input input-sm rounded-lg focus:border-none no-focus "
            />
            <button className="btn btn-ghost rounded-lg btn-sm">
              <MagnifyingGlassIcon className="text-base-content w-4 h-4" />
            </button>
          </div>
          <div className="flex gap-3">
            <button className="btn btn-secondary rounded-lg btn-sm">
              Restore
              <ArrowUturnLeftIcon className="text-secondary-content w-3 h-4" />
            </button>
            <button
              className="btn btn-primary rounded-lg btn-sm"
              onClick={() => setShowForm(!showForm)}
            >
              Add <PlusCircleIcon className="text-primary-content w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
      {showForm && <ServiceCreate setShowForm={setShowForm} />}
      {content}
      <Pagination current={1} />
    </>
  );
};

export default ServiceList;
