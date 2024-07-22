import PropTypes from "prop-types";
import { Fragment, useState } from "react";
import { formatISODate } from "../../utils/date";
import ProviderDelete from "./ProviderDelete";
import ProviderEdit from "./ProviderEdit";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";

const ProviderListRow = ({ provider, span }) => {
  const [showForm, setShowForm] = useState(false);
  const [showSecret, setShowSecret] = useState(false);

  const secret = (
    <Fragment>
      <span className="max-w-32 truncate">
        {provider.client_secret || "blank"}
      </span>
      <button
        className="btn btn-sm btn-ghost"
        onClick={() => setShowSecret(false)}
      >
        <EyeSlashIcon className="w-4 h-4 text-accent" />
      </button>
    </Fragment>
  );

  const hideIcon = (
    <button
      className="btn btn-sm btn-ghost"
      onClick={() => setShowSecret(true)}
    >
      <EyeIcon className="w-4 h-4 text-primary" />
    </button>
  );

  return (
    <Fragment>
      <tr>
        <td>{provider.name}</td>
        <td>{provider.url}</td>
        <td>
          <span className="text-neutral-500 flex">
            <span className="max-w-32 truncate">
              {provider.client_id || "blank"}
            </span>
          </span>
        </td>
        <td>
          <span className="text-neutral-500 flex items-center gap-3">
            {showSecret ? secret : hideIcon}
          </span>
        </td>
        <td>{formatISODate(provider.created_at)}</td>
        <td>{formatISODate(provider.updated_at)}</td>
        <td className="flex gap-3">
          <button
            className="btn btn-outline btn-secondary rounded-lg btn-sm"
            onClick={() => setShowForm(!showForm)}
          >
            Edit
          </button>
          <ProviderDelete id={provider.id} />
        </td>
      </tr>
      {showForm && (
        <tr>
          <td colSpan={span}>
            <ProviderEdit setShowForm={setShowForm} providerToEdit={provider} />
          </td>
        </tr>
      )}
    </Fragment>
  );
};
ProviderListRow.propTypes = {
  provider: PropTypes.object.isRequired,
  span: PropTypes.number.isRequired,
};

export default ProviderListRow;
