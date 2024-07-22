import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowUturnLeftIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

import Data from "../../components/Data";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import Breadcrumbs from "../../components/Breadcrumbs";
import RoleListRow from "./RoleListRow";
import RoleCreate from "./RoleCreate";
import { fetchWithCredentials } from "../../utils/fetchFn";

const RoleList = () => {
  const [showForm, setShowForm] = useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: ["roles"],
    queryFn: () => fetchWithCredentials("/roles", "GET"),
  });

  const content = (
    <Data isPending={isPending} error={error}>
      <Table
        headers={["Display Name", "Description", "Created At", "Updated At"]}
      >
        {data?.roles?.map((role) => (
          <RoleListRow key={role.id} role={role} span={6} />
        ))}
      </Table>
    </Data>
  );

  return (
    <>
      <div className="flex justify-between mb-3 flex-wrap gap-3">
        <Breadcrumbs pages={["Roles"]} />
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
      {showForm && <RoleCreate setShowForm={setShowForm} />}
      {content}
      <Pagination current={1} />
    </>
  );
};

export default RoleList;
