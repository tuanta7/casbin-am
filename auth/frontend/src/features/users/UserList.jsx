import { Fragment } from "react";
import { useQuery } from "@tanstack/react-query";
import Data from "../../components/Data";
import Table from "../../components/Table";
import Breadcrumbs from "../../components/Breadcrumbs";
import Pagination from "../../components/Pagination";
import UserListRow from "./UserListRow";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import { fetchWithCredentials } from "../../utils/fetchFn";

const UserList = () => {
  const { isPending, error, data } = useQuery({
    queryKey: ["users"],
    queryFn: () => fetchWithCredentials("/users", "GET"),
  });

  const content = (
    <Data isPending={isPending} error={error}>
      <Table
        headers={[
          
          "Display Name",
          "Email/Username",
          "Identity Provider",
          "Avatar",
          "Created At",
          "Updated At",
        ]}
      >
        {data?.users?.map((user) => (
          <UserListRow key={user.id} user={user} span={8} />
        ))}
      </Table>
    </Data>
  );

  return (
    <Fragment>
      <div className="flex justify-between mb-3 flex-wrap gap-3">
        <Breadcrumbs pages={["Users"]} />
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
      </div>
      {content}
      <Pagination current={1} />
    </Fragment>
  );
};

export default UserList;
