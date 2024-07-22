import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ChevronDownIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { useQuery } from "@tanstack/react-query";
import Breadcrumbs from "../../components/Breadcrumbs";
import Data from "../../components/Data";

import { fetchWithCredentials } from "../../utils/fetchFn";
import InlinePermissionCreate from "./permissions/InlinePermissionCreate";
import RoleInlinePermissionList from "./permissions/RoleInlinePermissionList";
import RolePolicyList from "./policies/RolePolicyList";
import RolePolicyAdd from "./policies/RolePolicyAdd";

const RolePermissionList = () => {
  const { id } = useParams();

  const [showPermissionForm, setShowPermissionForm] = useState(false);
  const [showPolicyForm, setShowPolicyForm] = useState(false);

  const { isPending, error, data } = useQuery({
    queryKey: ["roles", id],
    queryFn: () => fetchWithCredentials(`/roles/${id}`, "GET"),
  });

  return (
    <Fragment>
      <div className="flex justify-between mb-3 flex-wrap gap-3">
        <Breadcrumbs pages={["Roles", "Permissions"]} />
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
          <div className="dropdown dropdown-bottom dropdown-end">
            <div
              tabIndex={0}
              role="button"
              className="btn btn-primary rounded-lg btn-sm"
            >
              Add Permisisons
              <ChevronDownIcon className="text-primary-content w-3" />
            </div>
            <ul
              tabIndex={0}
              className="min-w-max menu dropdown-content z-[1] bg-base-100 rounded-box mt-3 border shadow"
            >
              <li className="mb-1">
                <button
                  className="rounded-lg flex items-center"
                  onClick={() => {
                    setShowPermissionForm(!showPermissionForm);
                    if (showPermissionForm == false) setShowPolicyForm(false);
                  }}
                >
                  Create new inline permission
                </button>
              </li>
              <li>
                <button
                  className="rounded-lg"
                  onClick={() => {
                    setShowPolicyForm(!showPolicyForm);
                    if (showPolicyForm == false) setShowPermissionForm(false);
                  }}
                >
                  Attach policies
                  <kbd className="kbd kbd-xs w-fit text-neutral-500">
                    Recommended
                  </kbd>
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
      <Data isPending={isPending} error={error}>
        <div className="border w-fit min-w-60 py-4 pl-3 pr-6 my-6 rounded-lg">
          <h2 className="font-semibold">
            {data?.role?.display_name}
            <span className="text-neutral-500 pl-1 text-sm">
              ({data?.role?.name})
            </span>
          </h2>
          <p className="text-neutral-400 text-sm">
            {data?.role?.description || "No description"}
          </p>
        </div>
      </Data>
      {showPermissionForm && (
        <InlinePermissionCreate setShowForm={setShowPermissionForm} />
      )}
      {showPolicyForm && <RolePolicyAdd setShowForm={setShowPolicyForm} />}
      <h2 className="font-semibold flex items-center gap-1">
        <img src="/casbin.svg" className="w-5" />
        <span className="text-cyan-600">Casbin</span> Policies (Implicit Roles)
      </h2>
      <RolePolicyList />
      <h2 className="font-semibold items-center flex gap-1">
        <img src="/casbin.svg" className="w-5" />
        <span className="text-cyan-600">Casbin</span> Inline Permissions
      </h2>
      <RoleInlinePermissionList />
    </Fragment>
  );
};

export default RolePermissionList;
