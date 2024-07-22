import PropTypes from "prop-types";
import InputErrorMessage from "./InputErrorMessage";

const InputLabel = ({ label, errorMessage, children }) => {
  return (
    <label className="form-control">
      <div className="label">
        <span className="label-text">{label}</span>
        <InputErrorMessage message={errorMessage} />
      </div>
      {children}
    </label>
  );
};
InputLabel.propTypes = {
  label: PropTypes.string,
  children: PropTypes.node,
  errorMessage: PropTypes.string,
};

export default InputLabel;
