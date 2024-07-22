import PropTypes from "prop-types";
const InputErrorMessage = ({ message }) => {
  return <p className="text-red-600 text-sm">{message}</p>;
};
InputErrorMessage.propTypes = {
  message: PropTypes.string,
};

export default InputErrorMessage;
