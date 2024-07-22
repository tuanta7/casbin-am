import { useQuery } from "@tanstack/react-query";
import { useParams } from "react-router-dom";
import { useState } from "react";
import {
  DocumentMagnifyingGlassIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";

import Data from "../../../components/Data";
import NothingHere from "../../../components/NothingHere";
import RolePolicyPermissionList from "./RolePolicyPermissionList";
import { fetchWithCredentials } from "../../../utils/fetchFn";
import RolePolicyDelete from "./RolePolicyDelete";

const RolePolicyList = () => {
  const [selectedPolicy, setSelectedPolicy] = useState(null);
  const { id } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["role-policies", id],
    queryFn: () => fetchWithCredentials(`/roles/${id}/policies`, "GET"),
  });

  const policiesTable = (
    <Data isPending={isPending} error={error}>
      <div className="max-h-[40vh] rounded-lg border border-base-content">
        <table className="table">
          <thead>
            <tr>
              <th>Role</th>
              <th className="flex items-center justify-between gap-6 min-w-80">
                Policy
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
            {data?.policies?.map((policy) => (
              <tr key={policy}>
                <td>{data.role.name}</td>
                <td className="flex justify-between items-center gap-6">
                  <span className="flex items-center gap-2">
                    <span
                      className={policy === selectedPolicy && "text-secondary"}
                    >
                      {policy}
                    </span>
                    <DocumentMagnifyingGlassIcon
                      className="w-4 h-4 hover:text-primary hover:cursor-pointer"
                      onClick={() => {
                        setSelectedPolicy(policy);
                      }}
                    />
                  </span>
                  <RolePolicyDelete policy={policy} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </Data>
  );

  return (
    <>
      {data?.policies?.length > 0 ? (
        <div className="flex flex-wrap gap-3 mt-3 mb-6">
          <div>{policiesTable}</div>
          {selectedPolicy && (
            <RolePolicyPermissionList
              policy={selectedPolicy}
              setPolicy={setSelectedPolicy}
            />
          )}
        </div>
      ) : (
        <NothingHere message={"There are no policies yet"} />
      )}
    </>
  );
};

export default RolePolicyList;
