import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Homepage from "./components/Homepage";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import Login from "./features/auth/Login";
import Signup from "./features/auth/Signup";
import NotFoundPage from "./components/404";
import Demo from "./features/demo/Demo";
import OauthComplete from "./features/auth/OauthComplete";
import Classes from "./features/demo/Classes";

function App() {
  return (
    <BrowserRouter>
      <Toaster
        position="top-center"
        gutter={12}
        containerStyle={{ margin: "8px", padding: "2px" }}
        toastOptions={{
          success: {
            duration: 3000,
          },
          error: {
            duration: 5000,
          },
          style: {
            fontSize: "16px",
          },
        }}
      />
      <Routes>
        <Route path="/" element={<MainLayout />}>
          <Route index element={<Homepage />} />
          <Route path="demo" element={<Demo />} />
          <Route path="classes" element={<Classes />} />
          <Route path="complete" element={<OauthComplete />} />
        </Route>
        <Route path="/auth" element={<AuthLayout />}>
          <Route index element={<Login />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
