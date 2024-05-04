import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import App from "./App.jsx";
import "./index.css";

// pages
import HomePage from "./page/home.jsx";
import LoginPage from "./page/login.jsx";
import RegisterPage from "./page/register.jsx";

import { deleteAction, loginAction, logoutAction, registerAction, uploadAction } from "./utils/actions.js";
import { loginLoader, userImageLoader } from "./utils/loaders.js";

export const router = createBrowserRouter([
  {
    id: "images",
    path: "/",
    element: <App />,
    loader: userImageLoader,
    children: [{ path: "/", Component: HomePage }],
  },
  { path: "/upload", action: uploadAction },
  { path: "/delete", action: deleteAction },

  { path: "/logout", action: logoutAction },
  { path: "/login", Component: LoginPage, loader: loginLoader, action: loginAction },
  { path: "/register", Component: RegisterPage, action: registerAction },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider
      router={router}
      fallbackElement={
        <div className="grid place-content-center min-h-dvh">
          <h1 className="text-3xl font-bold">Loading...</h1>
        </div>
      }
    />
  </React.StrictMode>
);
