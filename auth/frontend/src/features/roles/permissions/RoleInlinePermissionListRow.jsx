import PropTypes from "prop-types";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import InlinePermissionDelete from "./InlinePermissionDelete";

const RoleInlinePermissionListRow = ({ permission }) => {
  const [role, path, method, effect, service] = permission;
  return (
    <tr>
      <td>{role}</td>
      <td>{service}</td>
      <td className="link link-hover link-primary">{path}</td>
      <td>{method.toUpperCase()}</td>
      <td>{effect}</td>
      <td className="w-12">
        <button
          className="btn  btn-ghost btn-sm"
          // onClick={() => setIsEditing(!isEditing)}
        >
          <PencilSquareIcon className="text-green-600 w-4 h-4" />
        </button>
        <InlinePermissionDelete permission={permission} />
      </td>
    </tr>
  );
};
RoleInlinePermissionListRow.propTypes = {
  permission: PropTypes.array,
};

export default RoleInlinePermissionListRow;
