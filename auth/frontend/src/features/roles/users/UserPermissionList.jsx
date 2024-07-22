import PropTypes from "prop-types";
import { Fragment } from "react";

import { useQuery } from "@tanstack/react-query";

import Data from "../../../components/Data";

import { fetchWithCredentials } from "../../../utils/fetchFn";
import UserPermissionRow from "./UserPermissionRow";

const UserPermissionList = ({ user, role }) => {
  const { isPending, error, data } = useQuery({
    queryKey: ["user-permissions", user],
    queryFn: () => {
      if (user === null) return {};
      return fetchWithCredentials(`/permissions?q=${user}`, "GET");
    },
  });

  return (
    <div className="border rounded-xl w-full p-4">
      <h2 className="font-semibold flex items-center gap-1">
        <img src="/casbin.svg" className="w-5" />
        <span className="text-cyan-600">Casbin</span> User-Permissions
      </h2>
      <div className="my-3">
        {user === null ? (
          <p className="text-neutral-400 text-sm mb-3">
            Casbin permissions will be displayed here.
          </p>
        ) : (
          <Fragment>
            <h2 className="my-3 text-sm">Email: {user}</h2>
            <Data isPending={isPending} error={error}>
              <div className="overflow-auto max-h-[54vh] rounded-lg border border-base-content">
                <table className="table table-sm table-pin-rows table-pin-cols">
                  <thead>
                    <tr>
                      <td>Role/Policy</td>
                      <td className="max-2xl:hidden">Service</td>
                      <td>Route</td>
                      <td>Method</td>
                      <td>Effect</td>
                    </tr>
                  </thead>
                  <tbody>
                    {data?.permissions?.map((permission) => (
                      <UserPermissionRow
                        key={permission.reduce((acc, curr) => acc + curr, "")}
                        permission={permission}
                        currentRole={role}
                      />
                    ))}
                  </tbody>
                </table>
              </div>
            </Data>
          </Fragment>
        )}
      </div>
    </div>
  );
};
UserPermissionList.propTypes = {
  user: PropTypes.string,
  role: PropTypes.string,
};

export default UserPermissionList;
