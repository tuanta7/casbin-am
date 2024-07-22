import PropTypes from "prop-types";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  InformationCircleIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import { Link, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import LoadingButton from "../../components/LoadingButton";
import Data from "../../components/Data";

import { fetchWithCredentials } from "../../utils/fetchFn";

const UserRoleAdd = ({ currentRoles, setShowForm }) => {
  const client = useQueryClient();
  const { id } = useParams();

  const [searchRoleAdd, setSearchRoleAdd] = useState("");
  const [selectedRoles, setSelectedRoles] = useState(currentRoles);

  const { isPending, error, data } = useQuery({
    queryKey: ["roles"],
    queryFn: () => fetchWithCredentials("/roles", "GET"),
  });

  const { isPending: isCreating, mutate } = useMutation({
    mutationFn: (payload) =>
      fetchWithCredentials(`/users/${id}/roles`, "POST", payload),
    onSuccess: () => {
      client.invalidateQueries(["users", id]);
      toast.success("User roles added successfully");
    },
  });

  const handleSelect = (e) => {
    const { checked, value } = e.target;
    setSelectedRoles((prev) =>
      checked
        ? [...prev, parseInt(value)]
        : prev.filter((role_id) => role_id.toString() !== value)
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    mutate({
      role_ids: selectedRoles,
    });
  };

  return (
    <div className="border border-base-content max-h-80 overflow-auto rounded-lg my-3 py-3">
      <form className="px-6" onSubmit={(e) => handleSubmit(e)}>
        <div className="flex flex-wrap items-center justify-between">
          <h2 className="p-3 font-semibold">Role List</h2>
          <div className="flex items-center border rounded-lg">
            <input
              type="text"
              placeholder="Search"
              className="input input-sm rounded-lg focus:border-none no-focus"
              value={searchRoleAdd}
              onChange={(e) => setSearchRoleAdd(e.target.value.toLowerCase())}
            />
            <button className="btn btn-ghost rounded-lg btn-sm">
              <MagnifyingGlassIcon className="text-base-content w-4 h-4" />
            </button>
          </div>
        </div>

        <Data isPending={isPending} error={error}>
          <div className="grid md:grid-cols-2 2xl:grid-cols-3 md:gap-1">
            {data?.roles.map((role) => {
              if (
                role?.display_name?.toLowerCase().includes(searchRoleAdd) ||
                searchRoleAdd === ""
              )
                return (
                  <div key={role.id} className="flex max-w-max">
                    <label className="label cursor-pointer">
                      <input
                        type="checkbox"
                        className="checkbox mx-4 rounded-lg checkbox-primary"
                        defaultChecked={currentRoles.includes(role.id)}
                        disabled={currentRoles.includes(role.id)}
                        value={role.id}
                        onClick={(e) => handleSelect(e)}
                      />
                      <div>
                        <div className="flex items-center">
                          <span className="mr-1">{role.display_name}</span>
                          <Link to={`/roles/${role.id}/permissions`}>
                            <InformationCircleIcon className="w-4 h-4 hover:text-primary" />
                          </Link>
                        </div>
                        <p className="text-sm text-neutral-500/90">
                          {role.description || "No description"}
                        </p>
                      </div>
                    </label>
                  </div>
                );
            })}
          </div>
        </Data>
        <div className="flex flex-row-reverse mt-8 mb-3 px-4 gap-3">
          <button
            className="btn btn-primary rounded-lg btn-sm"
            type="submit"
            disabled={isCreating}
          >
            <LoadingButton isLoading={isCreating}>Save</LoadingButton>
          </button>
          <button
            className="btn btn-ghost rounded-lg btn-sm"
            type="reset"
            onClick={() => setShowForm(false)}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
UserRoleAdd.propTypes = {
  currentRoles: PropTypes.array,
  setShowForm: PropTypes.func,
};

export default UserRoleAdd;
