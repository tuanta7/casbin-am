import PropTypes from "prop-types";
const HTTPMethod = ({ method }) => {
  let color = "";
  switch (method.toUpperCase()) {
    case "GET":
      color = "text-green-600 border-green-600";
      break;
    case "POST":
      color = "text-yellow-600 border-yellow-600";
      break;
    case "DELETE":
      color = "text-red-600 border-red-600";
      break;
    case "*":
      color = "text-blue-600 border-blue-600";
      break;
    default:
      color = "text-purple-600 border-purple-600";
      break;
  }

  return (
    <span
      className={`border ${color} rounded-lg text-center py-1 w-16 px-3 text-xs font-semibold`}
    >
      {method === "*" ? "ALL" : method}
    </span>
  );
};
HTTPMethod.propTypes = {
  method: PropTypes.string,
};

export default HTTPMethod;
