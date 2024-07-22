import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  EllipsisHorizontalIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";

const Navbar = ({ showSidebar, setShowSidebar, avatar }) => {
  return (
    <div className="navbar border-b border-b-base-content min-h-[8vh]">
      <div className="navbar-start">
        <button
          className="btn btn-square btn-ghost rounded-lg"
          onClick={() => {
            setShowSidebar(!showSidebar);
          }}
        >
          <EllipsisHorizontalIcon className="w-5 h-5" />
        </button>
        <Link to="/" className="btn btn-ghost rounded-lg">
          <div className="flex gap-1">
            <div className="text-lg">Bifrost</div>
            <span className="text-xs px-1">Client</span>
          </div>
        </Link>
      </div>
      <div className="navbar-end gap-3">
        {avatar || (
          <Link
            to="/auth/login"
            className="btn btn-square btn-ghost rounded-lg min-w-fit p-3"
          >
            <span>Đăng nhập</span>
            <ArrowRightEndOnRectangleIcon className="w-5 h-5" />
          </Link>
        )}
      </div>
    </div>
  );
};

Navbar.propTypes = {
  showSidebar: PropTypes.bool,
  setShowSidebar: PropTypes.func,
  avatar: PropTypes.node,
};

export default Navbar;
