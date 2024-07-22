import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster } from "react-hot-toast";

import {
  QueryClient,
  QueryCache,
  MutationCache,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import toast from "react-hot-toast";
import redirect from "./utils/redirect";

import MainLayout from "./layouts/MainLayout";
import Login from "./features/auth/Login";
import ServiceList from "./features/services/ServiceList";
import NotFoundPage from "./components/404";
import ServiceResourceList from "./features/services/ServiceResourceList";
import ProtectedRoute from "./features/auth/ProtectedRoute";
import Dashboard from "./features/decisionLogs/Dashboard";

import ProviderList from "./features/providers/ProviderList";

import RoleList from "./features/roles/RoleList";
import RolePermissionList from "./features/roles/RolePermissionList";
import RoleUserList from "./features/roles/users/RoleUserList";
import PolicyPermissionList from "./features/policies/PolicyPermissionList";

import UserList from "./features/users/UserList";
import UserRoleList from "./features/users/UserRoleList";

import PolicyList from "./features/policies/PolicyList";
import LoginWrapper from "./features/auth/LoginWrapper";

function App() {
  const queryClient = new QueryClient({
    queryCache: new QueryCache({
      onError: (error, query) => {
        if (query.meta.disableGlobalErrorHandling) return;
        if (error.code === 401) {
          redirect(
            `/login?error=${error.message}&redirect=${window.location.pathname}`
          );
        } else toast.error(error.message);
      },
    }),
    mutationCache: new MutationCache({
      onError: (error) => {
        if (error.code === 401 && !window.location.href.includes("/login")) {
          redirect(`/login?error=${error.message}`);
        } else toast.error(error.message);
      },
    }),
    defaultOptions: {
      queries: {
        staleTime: 3 * 60 * 1000, // 3 minutes
        retry: 1,
        refetchOnWindowFocus: "always",
      },
    },
  });

  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
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
              width: "max-content",
            },
          }}
        />
        <Routes>
          <Route
            path="/login"
            element={
              <LoginWrapper>
                <Login />
              </LoginWrapper>
            }
          />
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <MainLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="services" element={<ServiceList />} />
            <Route
              path="services/:id/resources"
              element={<ServiceResourceList />}
            />
            <Route path="providers" element={<ProviderList />} />
            <Route path="roles" element={<RoleList />} />
            <Route path="roles/:id/users" element={<RoleUserList />} />
            <Route
              path="roles/:id/permissions"
              element={<RolePermissionList />}
            />
            <Route path="users" element={<UserList />} />
            <Route path="users/:id/roles" element={<UserRoleList />} />
            <Route path="policies" element={<PolicyList />} />
            <Route
              path="policies/:id/permissions"
              element={<PolicyPermissionList />}
            />
          </Route>
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}

export default App;
