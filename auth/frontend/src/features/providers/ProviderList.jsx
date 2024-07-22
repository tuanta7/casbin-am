import { useState, Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUturnLeftIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

import Data from "../../components/Data";
import Table from "../../components/Table";
import Breadcrumbs from "../../components/Breadcrumbs";
import Pagination from "../../components/Pagination";
import ProviderListRow from "./ProviderListRow";
import ProviderCreate from "./ProviderCreate";
import { fetchWithCredentials } from "../../utils/fetchFn";

const ProviderList = () => {
  const [showForm, setShowForm] = useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: ["providers"],
    queryFn: () => fetchWithCredentials("/providers", "GET"),
  });

  const content = (
    <Data isPending={isPending} error={error}>
      <Table
        headers={[
          "Display Name",
          "Provider URL",
          "Client ID",
          "Client Secret",
          "Created At",
          "Updated At",
        ]}
      >
        {data &&
          data.providers.map((provider) => (
            <ProviderListRow key={provider.id} provider={provider} span={8} />
          ))}
      </Table>
    </Data>
  );
  return (
    <Fragment>
      <div className="flex justify-between mb-3 flex-wrap gap-3">
        <Breadcrumbs pages={["Providers"]} />
        <div className="flex flex-wrap gap-3 items-center">
          <div className="flex items-center border rounded-lg">
            <input
              type="text"
              placeholder="Search"
              className="input input-sm rounded-lg focus:border-none no-focus"
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
      {showForm && <ProviderCreate setShowForm={setShowForm} />}
      {content}
      <Pagination current={1} />
    </Fragment>
  );
};

export default ProviderList;
