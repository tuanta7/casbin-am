import PropTypes from "prop-types";

const ConfirmModal = ({ id, title, message, children }) => {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-3 font-normal">{message}</p>
        <div className="modal-action">
          <form method="dialog">
            <button className="btn btn-sm btn-ghost">Cancel</button>
          </form>
          {children}
        </div>
      </div>
    </dialog>
  );
};
ConfirmModal.propTypes = {
  id: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
  message: PropTypes.string.isRequired,
  children: PropTypes.any,
};

export default ConfirmModal;
