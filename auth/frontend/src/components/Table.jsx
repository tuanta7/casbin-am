import PropTypes from "prop-types";
const Table = ({ children, headers }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-base-content">
      <table className="table table-pin-rows table-pin-cols">
        <thead>
          <tr>
            {headers.map((header) => (
              <td key={header}>{header}</td>
            ))}
            <td></td>
          </tr>
        </thead>
        <tbody>{children}</tbody>
      </table>
    </div>
  );
};
Table.propTypes = {
  headers: PropTypes.array.isRequired,
  children: PropTypes.node,
};

export default Table;
