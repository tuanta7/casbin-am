import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import Data from "../../../components/Data";
import RoleInlinePermissionListRow from "./RoleInlinePermissionListRow";
import NothingHere from "../../../components/NothingHere";
import Table from "../../../components/Table";
import { fetchWithCredentials } from "../../../utils/fetchFn";

const RoleInlinePermissionList = () => {
  const { id } = useParams();

  const { isPending, error, data } = useQuery({
    queryKey: ["role-permissions", id],
    queryFn: () => fetchWithCredentials(`/roles/${id}/permissions`, "GET"),
  });

  const renderedPermissions = (
    <Data isPending={isPending} error={error}>
      <Table headers={["Role", "Service", "URL", "Method", "Effect"]}>
        {data?.permissions.map((permission) => (
          <RoleInlinePermissionListRow
            key={permission.reduce((acc, curr) => acc + curr, "")}
            permission={permission}
          />
        ))}
      </Table>
    </Data>
  );

  return (
    <Data isPending={isPending} error={error}>
      {data?.permissions?.length > 0 ? (
        <div className="max-h-[30vh] overflow-auto mt-3 mb-9">
          {renderedPermissions}
        </div>
      ) : (
        <NothingHere message={"There are no permissions yet"} />
      )}
    </Data>
  );
};
RoleInlinePermissionList.propTypes = {};

export default RoleInlinePermissionList;
