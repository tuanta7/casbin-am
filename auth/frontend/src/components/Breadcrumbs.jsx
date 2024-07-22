import PropTypes from "prop-types";
import { Link } from "react-router-dom";

const Breadcrumbs = ({ pages = [] }) => {
  const rendered = pages.map((page, index) => {
    if (index === pages.length - 1) {
      return (
        <li key={index} className="text-primary">
          {page}
        </li>
      );
    }
    return (
      <li key={index}>
        <Link to={`/${page.toLowerCase()}`}>{page}</Link>
      </li>
    );
  });

  return (
    <div className="text-sm breadcrumbs">
      <ul>
        <li>
          <Link to="/">Home</Link>
        </li>
        {rendered}
      </ul>
    </div>
  );
};
Breadcrumbs.propTypes = {
  pages: PropTypes.array.isRequired,
};

export default Breadcrumbs;
