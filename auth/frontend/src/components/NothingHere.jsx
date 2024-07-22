import PropTypes from "prop-types";
const NothingHere = ({ message }) => {
  return (
    <div className="flex flex-col justify-center gap-3 my-3">
      {/* <img src="/nothing.gif" className="w-44 rounded-lg" /> */}
      <p className="text-primary text-sm">{message}</p>
    </div>
  );
};
NothingHere.propTypes = {
  message: PropTypes.string,
};

export default NothingHere;
