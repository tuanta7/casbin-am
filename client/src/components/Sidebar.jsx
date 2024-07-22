import { Bars3Icon, ServerStackIcon } from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="border-r border-r-base-content min-h-[92vh] h-full pt-1 pr-9">
      <ul className="menu gap-2">
        <li>
          <NavLink to="/classes" className="rounded-lg">
            <Bars3Icon className="w-4 h-4" />
            Danh sách lớp
          </NavLink>
        </li>
        <li>
          <NavLink to="/demo" className="rounded-lg">
            <ServerStackIcon className="w-4 h-4" />
            HTTP
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
