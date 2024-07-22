import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Fragment, useState } from "react";
import RoleEdit from "./RoleEdit";
import RoleDelete from "./RoleDelete";
import { formatISODate } from "../../utils/date";

const RoleListRow = ({ role, span }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Fragment>
      <tr>
        <td>{role.display_name}</td>
        <td className="flex items-center gap-1">
          <span className="text-neutral-500 max-w-64 truncate inline-block">
            {role.description || "No description"}
          </span>
          {role.description && (
            <div className="dropdown dropdown-hover dropdown-top dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-circle btn-ghost btn-xs"
              >
                <InformationCircleIcon className="w-4 hover:text-primary" />
              </div>
              <div
                tabIndex={0}
                className="bg-base-200 dropdown-content z-[99] rounded-box w-64 text-wrap p-4"
              >
                {role.description}
              </div>
            </div>
          )}
        </td>
        <td>{formatISODate(role.created_at)}</td>
        <td>{formatISODate(role.updated_at)}</td>
        <td className="flex gap-3">
          <Link
            to={`${role.id}/permissions`}
            className="btn btn-outline btn-ghost rounded-lg btn-sm"
          >
            <img src="/casbin.svg" className="w-4" /> Permissions
          </Link>
          <Link
            to={`${role.id}/users`}
            className="btn btn-outline btn-ghost rounded-lg btn-sm"
          >
            <img src="/casbin.svg" className="w-4" /> Users
          </Link>
          <button
            className="btn btn-outline btn-secondary rounded-lg btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            Edit
          </button>
          <RoleDelete id={role.id} />
        </td>
      </tr>
      {showForm && (
        <tr>
          <td colSpan={span}>
            <RoleEdit setShowForm={setShowForm} roleToEdit={role} />
          </td>
        </tr>
      )}
    </Fragment>
  );
};
RoleListRow.propTypes = {
  role: PropTypes.object.isRequired,
  span: PropTypes.number.isRequired,
};

export default RoleListRow;
