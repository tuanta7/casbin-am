import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import {
  EllipsisHorizontalIcon,
  ArrowRightEndOnRectangleIcon,
} from "@heroicons/react/24/outline";
import ThemeToggle from "./ThemeToggle";

const Navbar = ({ showSidebar, setShowSidebar, avatar }) => {
  return (
    <div className="navbar sticky top-0 z-50 bg-base-200 border-b border-b-base-content-200 min-h-[8vh]">
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
          <div className="flex">
            <div className="text-lg">Heimdall</div>
            <span className="text-xs px-2">Admin</span>
          </div>
        </Link>
      </div>
      <div className="navbar-end gap-3">
        <ThemeToggle
          theme="forest"
          isDark={localStorage.getItem("default-dark") == "true"}
        />
        {avatar || (
          <Link
            to="/login"
            className="btn btn-square btn-ghost rounded-lg min-w-fit p-3"
          >
            <span>Login</span>
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
