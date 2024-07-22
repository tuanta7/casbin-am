import { useState } from "react";
import PropTypes from "prop-types";
import GlobalContext from "../context/GlobalContext";

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState({});

  return (
    <GlobalContext.Provider value={{ user, setUser }}>
      {children}
    </GlobalContext.Provider>
  );
};

GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GlobalProvider;
