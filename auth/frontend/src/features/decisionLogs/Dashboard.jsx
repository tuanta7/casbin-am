import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

import Data from "../../components/Data";
import Table from "../../components/Table";
import Pagination from "../../components/Pagination";
import LogRow from "./LogRow";
import Breadcrumbs from "../../components/Breadcrumbs";

import { fetchWithCredentials } from "../../utils/fetchFn";

const Dashboard = () => {
  const [page, setPage] = useState(1);
  const { isPending, data, error } = useQuery({
    queryKey: ["logs", page],
    queryFn: () => fetchWithCredentials(`/logs?limit=6&page=${page}`, "GET"),
  });

  const content = (
    <Data isPending={isPending} error={error}>
      <Table headers={["User", "URL", "Method", "Time", "Effect"]}>
        {data?.logs?.map((log) => (
          <LogRow key={log.id} log={log} />
        ))}
      </Table>
      <Pagination
        current={page}
        setCurrent={setPage}
        total={data?.count || 1}
        limit={6}
      />
    </Data>
  );

  return (
    <div>
      <div className="flex justify-between mb-3 flex-wrap gap-3">
        <Breadcrumbs pages={["Logs"]} />
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
    </div>
  );
};
Dashboard.propTypes = {};

export default Dashboard;
