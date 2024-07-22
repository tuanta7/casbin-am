import { useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import Avatar from "../features/auth/Avatar";
import useGlobalContext from "../hooks/useGlobalContext";
import { useQuery } from "@tanstack/react-query";

const MainLayout = () => {
  const { user, setUser, accessToken } = useGlobalContext();
  const [showSidebar, setShowSidebar] = useState(true);

  const { data } = useQuery({
    queryKey: ["userinfo", accessToken],
    queryFn: () =>
      fetch(`${import.meta.env.VITE_BE_URL}/userinfo`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
        .then((res) => res.json())
        .then((resJson) => resJson.data)
        .then((data) => {
          setUser(data?.user);
          return data;
        })
        .catch((e) => {
          console.error(e);
          window.location.href = "/auth/login";
        }),
  });

  return (
    <div>
      <Navbar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        avatar={data?.user && <Avatar user={user} />}
      />
      <div className="flex">
        {showSidebar && (
          <div className="flex-none">
            <Sidebar />
          </div>
        )}
        <div className="w-full overflow-x-auto px-6 py-4">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
