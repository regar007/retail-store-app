import React from "react";
import { Navigate, redirect, Route, Routes } from "react-router-dom";
import { AdminHome } from "./pages/AdminHome";
import SignIn from "./pages/SignIn";
import { useDispatch, useSelector } from "react-redux";
import { UserInitialState } from "./redux-store/user.reducer";
import ProtectedRoute from "./auth-route/AuthenticatedRoute";
import { EmployeeHome } from "./pages/EmployeeHome";
import { UserType } from "./types/type";
import axios, { AxiosError, AxiosInstance, AxiosResponse } from "axios";
import localStorageUtils from "./utils/localStorage.utils";
import { NotificationContainer } from "react-notifications";
import { Button, ButtonGroup, Stack } from "@mui/material";

export function setupInterceptorsTo(
  axiosInstance: AxiosInstance
): AxiosInstance {
  axiosInstance.interceptors.response.use(onResponse, onResponseError);
  return axiosInstance;
}

const onResponse = (response: AxiosResponse): AxiosResponse => {
  console.info(`[response] [${JSON.stringify(response)}]`);
  return response;
};

const onResponseError = (error: AxiosError): Promise<AxiosError> => {
  console.log(`[response error] [${error}]`);
  const data = JSON.parse(JSON.stringify(error));
  if ([401, 403].includes(data.status || 0)) {
    console.log("not authenticated");
    localStorageUtils.clearSession();
  }
  return Promise.reject(error);
};

setupInterceptorsTo(axios);

const App: React.FC = () => {
  const user: UserInitialState = useSelector((state: any) => state.user);
  console.log("user ", user);
  return (
    <>
      <Stack columnGap={2} direction={'row-reverse'}>
        <ButtonGroup>
          <Button onClick={() => localStorageUtils.clearSession()}>
            Logout
          </Button>
        </ButtonGroup>
      </Stack>
      <Routes>
        <Route path="/login" element={<SignIn />} />
        <Route
          path="/admin"
          element={
            <AuthenticatedRoute userType={UserType.Admin}>
              <AdminHome />
            </AuthenticatedRoute>
          }
        />
        <Route
          path="/employee"
          element={
            <AuthenticatedRoute userType={UserType.Employee}>
              <EmployeeHome />
            </AuthenticatedRoute>
          }
        />
      </Routes>
    </>
  );
};

const AuthenticatedRoute = ({ children, userType }: any) => {
  const user: UserInitialState = useSelector((state: any) => state.user);
  console.log("aaa ", user.user?.type === `${userType}`);
  if (user.user?.type === userType) {
    return children;
  }
  return <Navigate to="/login" />;
};

export default App;
