import PropTypes from "prop-types";

const Data = ({ children, isPending, error }) => {
  if (isPending) {
    return (
      <div className="flex justify-center items-center">
        <span className="loading loading-dots loading-md text-secondary" />
      </div>
    );
  }

  if (error) return "Có lỗi xảy ra: " + error.message;

  return children;
};

Data.propTypes = {
  isPending: PropTypes.bool,
  error: PropTypes.object,
  children: PropTypes.node,
};

export default Data;
