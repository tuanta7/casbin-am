import { useState } from "react";

import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import UserAvatar from "../features/auth/UserAvatar";

const MainLayout = () => {
  const [showSidebar, setShowSidebar] = useState(true);

  return (
    <div>
      <Navbar
        showSidebar={showSidebar}
        setShowSidebar={setShowSidebar}
        avatar={<UserAvatar />}
      />
      <div className="flex">
        {showSidebar && (
          <div className="flex-none">
            <Sidebar />
          </div>
        )}
        <div className="w-full overflow-x-auto px-6 pt-4">
          <Outlet />
          <div className="pb-12"></div>
        </div>
      </div>
    </div>
  );
};

export default MainLayout;
