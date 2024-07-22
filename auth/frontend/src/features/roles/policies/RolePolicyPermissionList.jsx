import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import UserPermissionRow from "../users/UserPermissionRow";
import Table from "../../../components/Table";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";

import Data from "../../../components/Data";
import { fetchWithCredentials } from "../../../utils/fetchFn";

const RolePolicyPermissionList = ({ policy, setPolicy }) => {
  const { isPending, error, data } = useQuery({
    queryKey: ["user-permissions", policy],
    queryFn: () => {
      if (policy === null) return {};
      return fetchWithCredentials(`/permissions?q=${policy}`, "GET");
    },
  });

  return (
    <div className="border border-base-content rounded-xl px-4 pb-6 pt-2 flex-1">
      <div className="font-semibold flex justify-between items-end mb-3">
        <div className="flex items-center gap-1">
          <img src="/casbin.svg" className="w-5" />
          <span className="text-cyan-600">Casbin</span> Policy-Permissions
        </div>
        <button
          className="btn btn-sm btn-circle btn-ghost"
          onClick={() => setPolicy(null)}
        >
          <XMarkIcon className="w-4 text-primary" />
        </button>
      </div>
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm">Policy: {policy}</h2>
        <div className="flex items-center border rounded-lg">
          <input
            type="text"
            placeholder="Route search"
            className="input input-xs rounded-lg focus:border-none no-focus"
          />
          <button className="btn btn-ghost rounded-lg btn-xs">
            <MagnifyingGlassIcon className="text-base-content w-3 h-3" />
          </button>
        </div>
      </div>
      <Data isPending={isPending} error={error}>
        <Table headers={["Policy", "Service", "URL", "Method", "Effect"]}>
          {data?.permissions?.map((permission) => (
            <UserPermissionRow
              key={permission.reduce((acc, curr) => acc + curr, "")}
              permission={permission}
            />
          ))}
        </Table>
      </Data>
    </div>
  );
};
RolePolicyPermissionList.propTypes = {
  policy: PropTypes.string.isRequired,
  setPolicy: PropTypes.func.isRequired,
};

export default RolePolicyPermissionList;
