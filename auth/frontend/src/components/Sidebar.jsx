import {
  ChartBarIcon,
  IdentificationIcon,
  QueueListIcon,
  ServerStackIcon,
  UserGroupIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { NavLink } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="border-r border-r-base-content-200 w-40 sm:w-56 min-h-[92vh] h-full">
      <ul className="menu gap-3 py-4">
        <li>
          <NavLink to="/" className="rounded-lg">
            <ChartBarIcon className="w-4 h-4" />
            Log History
          </NavLink>
        </li>
        <li>
          <NavLink to="services" className="rounded-lg">
            <ServerStackIcon className="w-4 h-4" />
            Services
          </NavLink>
        </li>
        <li>
          <NavLink to="policies" className="rounded-lg">
            <QueueListIcon className="w-4 h-4" />
            Policies
          </NavLink>
        </li>
        <li>
          <NavLink to="roles" className="rounded-lg">
            <UserGroupIcon className="w-4 h-4" />
            Roles
          </NavLink>
        </li>
        <li>
          <NavLink to="users" className="rounded-lg">
            <UserIcon className="w-4 h-4" />
            Users
          </NavLink>
        </li>
        <li>
          <NavLink to="providers" className="rounded-lg">
            <IdentificationIcon className="w-4 h-4" />
            Identity Providers
          </NavLink>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
