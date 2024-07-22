import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { UserCircleIcon } from "@heroicons/react/24/outline";

const Avatar = ({ user }) => {
  if (user === null) return null;

  return (
    <details className="dropdown dropdown-bottom dropdown-end hover:cursor-pointer">
      <summary className="m-1 flex gap-6 items-center">
        <p>{user.name}</p>
        <div className="avatar online">
          <div className="w-8 rounded-full ring-2 ring-secondary ring-offset-base-100 ring-offset-2">
            <img src={user.avatar || "/default.svg"} />
          </div>
        </div>
      </summary>
      <ul className="shadow menu dropdown-content z-[1] bg-base-100 rounded-box min-w-max">
        <p className="mx-4 mt-2 mb-4">{`🫡 Xin chào, ${user.name}`}</p>
        <li>
          <Link to="/info" className="pr-12 rounded-lg ">
            <UserCircleIcon className="w-5" /> Thông tin cá nhân
          </Link>
        </li>
      </ul>
    </details>
  );
};
Avatar.propTypes = {
  user: PropTypes.object.isRequired,
};

export default Avatar;
