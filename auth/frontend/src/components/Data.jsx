import PropTypes from "prop-types";

const Data = ({ children, isPending, error }) => {
  if (isPending) {
    return (
      <div className="flex flex-col justify-center items-center bg-base-100 h-[20vh]">
        <p className="text-md text-secondary font-semibold">Just a moment</p>
        <span className="loading loading-dots loading-md text-secondary" />
      </div>
    );
  }

  if (error) {
    return <p className="text-red-600">{error.message}</p>;
  }

  return children;
};

Data.propTypes = {
  isPending: PropTypes.bool,
  error: PropTypes.object,
  children: PropTypes.node,
};

export default Data;
