import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="bg-bifrost bg-cover bg-no-repeat h-screen flex justify-center sm:items-center overflow-auto">
      <div className="p-6 w-full sm:max-w-md border shadow-xl rounded-xl bg-base-100 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
