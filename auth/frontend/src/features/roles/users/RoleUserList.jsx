import { Fragment, useState } from "react";
import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  TrashIcon,
  MagnifyingGlassIcon,
  DocumentMagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import Breadcrumbs from "../../../components/Breadcrumbs";
import Data from "../../../components/Data";
import NothingHere from "../../../components/NothingHere";
import Pagination from "../../../components/Pagination";
import UserPermissionList from "../users/UserPermissionList";
import { fetchWithCredentials } from "../../../utils/fetchFn";

const RoleUserList = () => {
  const { id } = useParams();

  const [selectedUser, setSelectedUser] = useState(null);

  const { isPending, error, data } = useQuery({
    queryKey: ["role-users", id],
    queryFn: () => fetchWithCredentials(`/roles/${id}/users`, "GET"),
  });

  const userTable = (
    <div className="overflow-auto max-h-[50vh] my-3 min-w-96">
      <div className="rounded-lg border border-base-content">
        <table className="table">
          <thead>
            <tr className="border-b border-base-content">
              <th>Role</th>
              <th className="flex items-center justify-between gap-6">
                User
                <div className="flex items-center border rounded-lg">
                  <input
                    type="text"
                    placeholder="Search"
                    className="input input-xs rounded-lg focus:border-none no-focus"
                  />
                  <button className="btn btn-ghost rounded-lg btn-xs">
                    <MagnifyingGlassIcon className="text-base-content w-3 h-3" />
                  </button>
                </div>
              </th>
            </tr>
          </thead>
          <tbody>
            {data?.users?.map((user) => (
              <tr key={user} className="border-t border-base-content">
                <td>{data.role.name}</td>
                <td className="flex justify-between items-center gap-6">
                  <span className="flex items-center gap-2">
                    {user}
                    <DocumentMagnifyingGlassIcon
                      className="w-4 h-4 hover:text-primary hover:cursor-pointer"
                      onClick={() => {
                        setSelectedUser(user); // user email
                      }}
                    />
                  </span>
                  <button className="btn btn-ghost btn-sm">
                    <TrashIcon className="text-red-600 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Pagination current={1} total={1} />
    </div>
  );

  return (
    <Fragment>
      <div className="flex justify-between mb-3 flex-wrap gap-3">
        <Breadcrumbs pages={["Roles", "Users"]} />
      </div>
      <div className="flex xl:flex-nowrap flex-wrap gap-6 overflow-auto">
        <div className="min-w-fit">
          <Data isPending={isPending} error={error}>
            <div className="border w-fit min-w-60 py-4 pl-3 pr-6 mb-6 rounded-lg">
              <h2 className="font-semibold">{data?.role?.display_name}</h2>
              <p className="text-neutral-400 text-sm">
                Description: {data?.role?.description || "No description yet"}
              </p>
            </div>
          </Data>
          <h2 className="font-semibold flex items-center gap-1 my-4">
            <img src="/casbin.svg" className="w-5" />
            <span className="text-cyan-600">Casbin</span> Role-Users
          </h2>
          {data?.users ? (
            userTable
          ) : (
            <NothingHere
              message={`There are no users assigned to the role ${data?.role?.display_name} yet.`}
            />
          )}
        </div>
        <UserPermissionList user={selectedUser} role={data?.role?.name} />
      </div>
    </Fragment>
  );
};

export default RoleUserList;
