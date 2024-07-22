import PropTypes from "prop-types";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  MagnifyingGlassIcon,
  EllipsisHorizontalCircleIcon,
} from "@heroicons/react/24/outline";

import Data from "../../../components/Data";
import Table from "../../../components/Table";
import Pagination from "../../../components/Pagination";
import LoadingButton from "../../../components/LoadingButton";
import { fetchWithCredentials } from "../../../utils/fetchFn";
import toast from "react-hot-toast";

const RolePolicyAdd = ({ setShowForm }) => {
  const { id } = useParams();
  const client = useQueryClient();
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [selectedPolicies, setSelectedPolicies] = useState([]);
  const [selectedObjectPolicies, setSelectedObjectPolicies] = useState([]);

  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["policies", page],
    queryFn: () => {
      let url = `/policies?limit=10&page=${page}`;
      if (search) {
        url = `/policies?limit=10&page=${page}&search=${search}`;
      }
      return fetchWithCredentials(url, "GET");
    },
  });

  const { isPending: isCreating, mutate } = useMutation({
    mutationFn: () =>
      fetchWithCredentials(`/roles/${id}/policies`, "POST", {
        policy_ids: selectedPolicies,
      }),
    onSuccess: () => {
      client.invalidateQueries(["role-policies", id]);
      toast.success("Policies added successfully");
      setShowForm(false);
      setSelectedPolicies([]);
    },
  });

  const handleSelect = (e) => {
    const val = parseInt(e.target.value);

    if (e.target.checked) {
      setSelectedPolicies([...selectedPolicies, val]);
      setSelectedObjectPolicies([
        ...selectedObjectPolicies,
        data.policies.find((policy) => policy.id === val),
      ]);
    } else {
      setSelectedPolicies(selectedPolicies.filter((id) => id !== val));
      setSelectedObjectPolicies(
        selectedObjectPolicies.filter((policy) => policy.id !== val)
      );
    }
  };

  return (
    <div className="flex flex-col justify-between gap-3 border border-base-content rounded-xl p-4 mb-6">
      <div>
        <div className="flex items-start justify-between mb-3">
          <h2 className="font-semibold">Add Policies</h2>
          <div className="flex items-center border rounded-lg">
            <input
              type="text"
              placeholder="Policy Search"
              className="input input-sm rounded-lg focus:border-none no-focus"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button
              className="btn btn-ghost rounded-lg btn-sm"
              onClick={() => refetch()}
            >
              <MagnifyingGlassIcon className="text-base-content w-4 h-4" />
            </button>
          </div>
        </div>
        <Data isPending={isPending} error={error}>
          <Table headers={["", "Policy", "Display name", "Description"]}>
            {data?.policies?.map((policy) => (
              <tr key={policy.id}>
                <td className="w-12">
                  <input
                    type="checkbox"
                    className="checkbox checkbox-primary rounded-lg -mb-1"
                    value={policy.id}
                    onClick={(e) => handleSelect(e)}
                  />
                </td>
                <td>{policy.name}</td>
                <td>{policy.display_name}</td>
                <td>{policy.description}</td>
                <td className="flex justify-end items-center">
                  <button className="btn btn-sm btn-ghost btn-circle">
                    <EllipsisHorizontalCircleIcon className="w-5" />
                  </button>
                </td>
              </tr>
            ))}
          </Table>
        </Data>
        <Pagination
          current={page}
          setCurrent={setPage}
          total={data?.count || 1}
        />
      </div>
      <div>
        <h3 className="font-semibold mb-2">Selected Policies</h3>
        {selectedObjectPolicies.length === 0 ? (
          <p className="text-neutral-500 text-sm">No policies selected</p>
        ) : (
          <div className="rounded-lg flex flex-wrap gap-3">
            {selectedObjectPolicies.map((policy) => (
              <div
                key={policy.id}
                className="card border border-success py-2 px-4 text-sm min-w-80"
              >
                <h3 className="font-semibold">{policy.display_name}</h3>
                <p className="text-neutral-500">
                  {policy.description || "No description"}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <button
          className="btn btn-ghost rounded-lg btn-sm"
          type="reset"
          onClick={() => setShowForm(false)}
        >
          Cancel
        </button>
        <button
          className="btn btn-primary rounded-lg btn-sm"
          disabled={isCreating}
          onClick={(e) => {
            e.preventDefault();
            mutate();
          }}
        >
          <LoadingButton isLoading={isCreating}>Save</LoadingButton>
        </button>
      </div>
    </div>
  );
};
RolePolicyAdd.propTypes = {
  setShowForm: PropTypes.func,
};

export default RolePolicyAdd;
