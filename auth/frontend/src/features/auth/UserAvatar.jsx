import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import {
  ArrowRightStartOnRectangleIcon,
  LockClosedIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import useGlobalContext from "../../hooks/useGlobalContext";
import LoadingButton from "../../components/LoadingButton";
import { fetchWithCredentials } from "../../utils/fetchFn";
import greet from "../../utils/greet";

const UserAvatar = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user, setUser } = useGlobalContext();

  const { mutate, isPending } = useMutation({
    mutationFn: () => fetchWithCredentials("/logout", "POST"),
    onSuccess: () => {
      setUser({});
      queryClient.invalidateQueries({
        queryKey: ["auth"],
      });
      navigate("/login?logged_out=true");
    },
  });

  const handleLogout = () => {
    mutate();
  };

  if (!user) return null;

  return (
    <details className="dropdown dropdown-end hover:cursor-pointer">
      <summary className="p-0 m-0">
        <div className="avatar px-3">
          <div className="w-9 rounded-xl ring-2 ring-primary ring-offset-base-100 ring-offset ">
            <img
              src={user.avatar}
              onError={(e) => {
                e.onError = null;
                e.currentTarget.src = "/default.svg";
              }}
            />
          </div>
        </div>
      </summary>
      <ul className="min-w-64 py-4 shadow menu dropdown-content z-[1] bg-base-100 rounded-box border">
        <p className="ml-4 mb-4">{`${greet()}, ${user.name}`}</p>
        <li>
          <Link className="pr-12 rounded-lg">
            <UserCircleIcon className="w-4" /> Profile
          </Link>
        </li>
        <li>
          <Link className="pr-12 rounded-lg">
            <LockClosedIcon className="w-4" /> Change password
          </Link>
        </li>
        <li>
          <button
            className="text-red-600 pr-12 rounded-lg"
            onClick={handleLogout}
          >
            <LoadingButton isLoading={isPending}>
              <ArrowRightStartOnRectangleIcon className="w-4" />
            </LoadingButton>
            Logout
          </button>
        </li>
      </ul>
    </details>
  );
};

export default UserAvatar;
