import { ReactNode } from "react";

interface RouteConfig {
  key: string;
  name: string;
  path: string;
  element: ReactNode;
  visible?: boolean;
}
const routes: RouteConfig[] = [
  {
    key: "login",
    name: "Login",
    path: "/login",
    element: <></>,
  },
];

export default routes;
