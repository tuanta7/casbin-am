import { Fragment, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  MagnifyingGlassIcon,
  PlusCircleIcon,
} from "@heroicons/react/24/outline";

import Breadcrumbs from "../../components/Breadcrumbs";
import Data from "../../components/Data";
import NothingHere from "../../components/NothingHere";
import Table from "../../components/Table";
import { fetchWithCredentials } from "../../utils/fetchFn";
import { useParams } from "react-router-dom";
import PolicyPermissionCreate from "./PolicyPermissionCreate";
import PolicyPermissionListRow from "./PolicyPermissionListRow";

const PolicyPermissionList = () => {
  const { id } = useParams();
  const [showForm, setShowForm] = useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: ["policy-permissions", id],
    queryFn: () => fetchWithCredentials(`/policies/${id}/permissions`, "GET"),
  });

  const {
    isPending: policyPending,
    error: policyError,
    data: policyData,
  } = useQuery({
    queryKey: ["policies", id],
    queryFn: () => fetchWithCredentials(`/policies/${id}`, "GET"),
  });

  const renderedPermissions = (
    <Data isPending={isPending} error={error}>
      <Table headers={["Policy Name", "Service", "URL", "Method", "Effect"]}>
        {data?.permissions.map((permission) => (
          <PolicyPermissionListRow
            key={permission.reduce((acc, curr) => acc + curr, "")}
            permission={permission}
          />
        ))}
      </Table>
    </Data>
  );

  const content = (
    <Data isPending={isPending} error={error}>
      {data?.permissions?.length > 0 ? (
        <div className="max-h-1/3 overflow-auto my-3">
          {renderedPermissions}
        </div>
      ) : (
        <NothingHere message={"There are no permissions yet"} />
      )}
    </Data>
  );

  return (
    <Fragment>
      <div className="flex justify-between mb-3 flex-wrap gap-3">
        <Breadcrumbs pages={["Policies", "Permissions"]} />
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
          <button
            className="btn btn-primary rounded-lg btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            Add <PlusCircleIcon className="text-primary-content w-4 h-4" />
          </button>
        </div>
      </div>
      <Data isPending={policyPending} error={policyError}>
        <div className="border w-fit min-w-60 py-4 pl-3 pr-6 my-6 rounded-lg">
          <h2 className="font-semibold">
            {policyData?.policy?.display_name}
            <span className="text-neutral-500 pl-1 text-sm">
              ({policyData?.policy?.name})
            </span>
          </h2>
          <p className="text-neutral-400 text-sm">
            {policyData?.policy?.description || "No description"}
          </p>
        </div>
      </Data>
      <h2 className="font-semibold flex items-center gap-1 mt-6">
        <img src="/casbin.svg" className="w-5" />
        <span className="text-cyan-600">Casbin</span> Permissions
      </h2>
      {showForm && <PolicyPermissionCreate setShowForm={setShowForm} />}
      {content}
    </Fragment>
  );
};

export default PolicyPermissionList;
