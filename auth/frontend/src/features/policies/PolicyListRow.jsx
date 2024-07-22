import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { Link } from "react-router-dom";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { formatISODate } from "../../utils/date";
import PolicyDelete from "./PolicyDelete";
import PolicyEdit from "./PolicyEdit";

const PolicyListRow = ({ policy, span }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <Fragment>
      <tr>
        <td>{policy.display_name}</td>
        <td className="flex items-center gap-1">
          <span className="text-neutral-500 max-w-64 truncate inline-block">
            {policy.description || "No description"}
          </span>
          {policy.description && (
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
                {policy.description}
              </div>
            </div>
          )}
        </td>
        <td>{formatISODate(policy.created_at)}</td>
        <td>{formatISODate(policy.updated_at)}</td>
        <td className="flex gap-3">
          <Link
            to={`${policy.id}/permissions`}
            className="btn btn-outline btn-ghost rounded-lg btn-sm"
          >
            <img src="/casbin.svg" className="w-4" /> Permissions
          </Link>
          <button
            className="btn btn-outline btn-secondary rounded-lg btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            Edit
          </button>
          <PolicyDelete id={policy.id} />
        </td>
      </tr>
      {showForm && (
        <tr>
          <td colSpan={span}>
            <PolicyEdit setShowForm={setShowForm} policyToEdit={policy} />
          </td>
        </tr>
      )}
    </Fragment>
  );
};
PolicyListRow.propTypes = {
  policy: PropTypes.object.isRequired,
  span: PropTypes.number.isRequired,
};

export default PolicyListRow;
