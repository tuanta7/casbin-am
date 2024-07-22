import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  EllipsisHorizontalCircleIcon,
  MagnifyingGlassIcon,
  PlusCircleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import toast from "react-hot-toast";

import Breadcrumbs from "../../components/Breadcrumbs";
import Data from "../../components/Data";
import UserRoleAdd from "./UserRoleAdd";
import { formatISODate } from "../../utils/date";
import { fetchWithCredentials } from "../../utils/fetchFn";

const UserRoleList = () => {
  const client = useQueryClient();

  const [showForm, setShowForm] = useState(false);
  const [selectedRoles, setSelectedRoles] = useState({});
  const { id } = useParams();
  const { data, isPending, error } = useQuery({
    queryKey: ["users", id],
    queryFn: () => fetchWithCredentials(`/users/${id}/roles`, "GET"),
  });

  const { mutate } = useMutation({
    mutationFn: (payload) =>
      fetchWithCredentials(`/users/${id}/roles`, "DELETE", payload),
    onSuccess: () => {
      client.invalidateQueries(["users", id]);
      toast.success("Roles deleted successfully");
    },
  });

  const handleSelect = (e) => {
    const { checked, value } = e.target;
    setSelectedRoles({ ...selectedRoles, [value]: checked });
  };

  const handleDelete = () => {
    if (Object.values(selectedRoles).every((value) => value === false)) {
      return toast.error("Please select a role to delete");
    }

    const hasSelectedRoles = Object.values(selectedRoles).some(
      (value) => value === true
    );
    if (hasSelectedRoles) {
      const ids = Object.keys(selectedRoles)
        .filter((key) => selectedRoles[key])
        .map(Number);

      mutate({
        role_ids: ids,
      });
    }
  };

  const userinfo = (
    <div className="flex gap-3 p-2">
      <img
        src={data?.user.avatar || "/default.svg"}
        className="w-12 h-12 rounded-lg"
      />
      <div>
        <h2 className="text-lg font-semibold">{data?.user.name}</h2>
        <p className="text-sm">{data?.user.email}</p>
      </div>
    </div>
  );

  const content = (
    <Data isPending={isPending} error={error}>
      <table className="table">
        <thead>
          <tr>
            <th className="w-12 text-center">
              <button
                className="btn btn-sm btn-ghost btn-circle m-0"
                onClick={handleDelete}
              >
                <TrashIcon className="text-red-600 w-4 h-4" />
              </button>
            </th>
            <th>Role</th>
            <th>Last updated</th>
            <th>Description</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {data?.user?.roles?.map((role) => (
            <tr key={role.id}>
              <td>
                <input
                  type="checkbox"
                  className="checkbox checkbox-error rounded-lg -mb-1"
                  value={role.id}
                  onClick={(e) => handleSelect(e)}
                />
              </td>
              <td>{role.display_name}</td>
              <td>{formatISODate(role.updated_at)}</td>
              <td>
                {role.description || (
                  <span className="text-neutral-500">No description</span>
                )}
              </td>
              <td className="flex justify-end items-center pr-0">
                <Link
                  to={`/roles/${role.id}/permissions/`}
                  className="btn btn-ghost btn-sm"
                >
                  <EllipsisHorizontalCircleIcon className="w-5" />
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Data>
  );

  return (
    <Fragment>
      <div className="flex justify-between items-center mb-3 flex-wrap gap-3">
        <Breadcrumbs pages={["Users", "Roles"]} />
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
            Add Roles
            <PlusCircleIcon className="text-primary-content w-4 h-4" />
          </button>
        </div>
      </div>
      {userinfo}
      {showForm && (
        <UserRoleAdd
          currentRoles={data?.user.roles.map((role) => role.id)}
          setShowForm={setShowForm}
        />
      )}
      <div className="overflow-x-auto border border-base-content rounded-lg my-3">
        {content}
      </div>
    </Fragment>
  );
};

UserRoleList.propTypes = {
  roles: PropTypes.array,
};

export default UserRoleList;
