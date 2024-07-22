import { useState } from "react";
import PropTypes from "prop-types";
import GlobalContext from "../context/GlobalContext";

const GlobalProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState("");

  return (
    <GlobalContext.Provider
      value={{ user, setUser, accessToken, setAccessToken }}
    >
      {children}
    </GlobalContext.Provider>
  );
};

GlobalProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default GlobalProvider;
