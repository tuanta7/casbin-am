import {
  ChevronDoubleLeftIcon,
  ChevronDoubleRightIcon,
} from "@heroicons/react/24/outline";
import PropTypes from "prop-types";

const Pagination = ({ current, setCurrent, total = 1, limit = 10 }) => {
  const handlePrev = () => {
    setCurrent(current - 1);
  };

  const handleNext = () => {
    setCurrent(current + 1);
  };

  return (
    <div className="join mt-4 flex justify-center">
      <button
        className="join-item btn btn-xs"
        disabled={current === 1}
        onClick={handlePrev}
      >
        <ChevronDoubleLeftIcon className="w-3 h-3" />
      </button>
      <button className="join-item btn btn-xs px-6">
        Page {current} / {Math.ceil(total / limit)}
      </button>
      <button
        className="join-item btn btn-xs"
        onClick={handleNext}
        disabled={current === Math.ceil(total / limit)}
      >
        <ChevronDoubleRightIcon className="w-3 h-3" />
      </button>
    </div>
  );
};

Pagination.propTypes = {
  current: PropTypes.number.isRequired,
  setCurrent: PropTypes.func,
  total: PropTypes.number,
  limit: PropTypes.number,
};

export default Pagination;
