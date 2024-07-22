import PropTypes from "prop-types";

const LogRow = ({ log }) => {
  return (
    <tr>
      <td>
        {log.email || <span className="text-neutral-400">No information</span>}
      </td>
      <td>{log.url}</td>
      <td>{log.method}</td>
      <td>
        {new Date(log.created_at).toLocaleString("en-us", {
          day: "numeric",
          month: "long",
          year: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        })}
      </td>
      <td>
        {log.allowed ? (
          <span className="text-green-600 font-semibold">Allow</span>
        ) : (
          <span className="text-red-600 font-semibold">Deny</span>
        )}
      </td>
      <td>
        {log.deny_reason || (
          <span className="text-neutral-400">No information</span>
        )}
      </td>
    </tr>
  );
};

LogRow.propTypes = {
  log: PropTypes.object.isRequired,
};

export default LogRow;
