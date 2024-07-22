import PropTypes from "prop-types";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import useGlobalContext from "../../hooks/useGlobalContext";
import { fetchWithCredentials } from "../../utils/fetchFn";
import toast from "react-hot-toast";

const LoginWrapper = ({ children }) => {
  const [searchParams] = useSearchParams();
  const prev = searchParams.get("redirect");
  const isLogout = searchParams.get("logged_out");

  const navigate = useNavigate();
  const { setUser } = useGlobalContext();

  const { error, data, refetch } = useQuery({
    queryKey: ["auth"],
    queryFn: () => fetchWithCredentials("/userinfo", "GET"),
    retry: false,
    meta: { disableGlobalErrorHandling: true },
  });

  useEffect(() => {
    if (isLogout) return;
    if (data) {
      setUser(data.user);
      navigate(prev || "/");
    }
    if (error) toast.error(error?.message);
  }, [data, error, isLogout, navigate, prev, refetch, setUser]);

  return children;
};
LoginWrapper.propTypes = {
  children: PropTypes.node.isRequired,
};

export default LoginWrapper;
