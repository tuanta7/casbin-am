import { useState } from "react";
import PropTypes from "prop-types";
import { InformationCircleIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
import ServiceDelete from "./ServiceDelete";
import { formatISODate } from "../../utils/date";

import ServiceEdit from "./ServiceEdit";

const ServiceListRow = ({ service, span }) => {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <tr>
        <td>{service.name}</td>
        <td>{service.domain}</td>
        <td className="flex items-center gap-1">
          <p className="text-neutral-500 max-w-64 truncate inline-block">
            {service.description || "No description"}
          </p>
          {service.description && (
            <div className="dropdown dropdown-hover dropdown-top dropdown-end">
              <div
                tabIndex={0}
                role="button"
                className="btn btn-circle btn-ghost btn-xs align-super"
              >
                <InformationCircleIcon className="w-4 hover:text-primary " />
              </div>
              <div
                tabIndex={0}
                className="bg-base-200 dropdown-content z-[99] rounded-box w-64 text-wrap p-4"
              >
                {service.description}
              </div>
            </div>
          )}
        </td>

        <td>{formatISODate(service.created_at)}</td>
        <td>{formatISODate(service.updated_at)}</td>
        <td className="flex  gap-3">
          <Link
            to={`${service.id}/resources`}
            className="btn btn-outline btn-ghost rounded-lg btn-sm"
          >
            Resources
          </Link>
          <button
            className="btn btn-outline btn-secondary rounded-lg btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            Edit
          </button>
          <ServiceDelete id={service.id} />
        </td>
      </tr>
      {showForm && (
        <tr>
          <td colSpan={span}>
            <ServiceEdit setShowForm={setShowForm} serviceToEdit={service} />
          </td>
        </tr>
      )}
    </>
  );
};
ServiceListRow.propTypes = {
  service: PropTypes.object.isRequired,
  span: PropTypes.number.isRequired,
};

export default ServiceListRow;
