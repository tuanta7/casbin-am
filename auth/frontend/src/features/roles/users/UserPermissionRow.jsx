import PropTypes from "prop-types";
const UserPermissionRow = ({ permission, currentRole }) => {
  const [role, path, method, effect, service, domain] = permission;
  return (
    <tr>
      <td className={role === currentRole && "text-primary"}>{role}</td>
      <td className="max-2xl:hidden">{`${service}(${domain})`}</td>
      <td>{path}</td>
      <td>{method.toUpperCase()}</td>
      <td>{effect}</td>
    </tr>
  );
};
UserPermissionRow.propTypes = {
  permission: PropTypes.array.isRequired,
  currentRole: PropTypes.string.isRequired,
};

export default UserPermissionRow;
