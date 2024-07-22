import PropTypes from "prop-types";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useGlobalContext from "../../hooks/useGlobalContext";
import Data from "../../components/Data";
import { fetchWithCredentials } from "../../utils/fetchFn";
import redirect from "../../utils/redirect";

const ProtectedRoute = ({ children }) => {
  const { setUser } = useGlobalContext();

  const { isPending, error, data } = useQuery({
    queryKey: ["auth"],
    queryFn: () => fetchWithCredentials("/userinfo", "GET"),
    meta: { disableGlobalErrorHandling: true },
  });

  useEffect(() => {
    if (data) setUser(data.user);
    if (error) redirect("/login");
  }, [error, data, setUser]);

  return <Data isPending={isPending}>{children}</Data>;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
};

export default ProtectedRoute;
