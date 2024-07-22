import { useState } from "react";
import PropTypes from "prop-types";
import { CheckBadgeIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import { formatISODate } from "../../utils/date";

import UserEdit from "./UserEdit";

const UserListRow = ({ user, span }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <tr>
        <td>{user.name}</td>
        <td className="flex gap-1">
          {user.email}
          {user.verified_email && (
            <div className="tooltip" data-tip="Verified Email">
              <CheckBadgeIcon className="w-4 text-primary" />
            </div>
          )}
        </td>
        <td>{user.provider.name}</td>
        <td>
          <img
            className="avatar rounded-xl w-7"
            src={user.avatar}
            onError={(e) => {
              e.onError = null;
              e.currentTarget.src = "/default.svg";
            }}
          />
        </td>
        <td>{formatISODate(user.created_at)}</td>
        <td>{formatISODate(user.updated_at)}</td>
        <td className="flex gap-3">
          <Link
            to={`${user.id}/roles`}
            className="btn btn-outline btn-ghost rounded-lg btn-sm"
          >
            Roles
          </Link>
          <button
            className="btn btn-outline btn-secondary rounded-lg btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            Edit
          </button>
        </td>
      </tr>
      {showForm && (
        <tr>
          <td colSpan={span}>
            <UserEdit setShowForm={setShowForm} userToEdit={user} />
          </td>
        </tr>
      )}
    </>
  );
};
UserListRow.propTypes = {
  user: PropTypes.object.isRequired,
  span: PropTypes.number.isRequired,
};

export default UserListRow;
