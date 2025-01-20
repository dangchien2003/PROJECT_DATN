import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./components/layout/admin";
import DashBoardAdmin from "./pages/DashBoardAdmin";
import CardCustom from "./components/CardCustom";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashBoardAdmin /> },
      { path: "/account", element: <CardCustom /> },
      { path: "/dashboard", element: <DashBoardAdmin /> },
      // {
      //   path: "dashboard",
      //   element: <DashboardLayout />,
      //   children: [
      //     { index: true, element: <Overview /> },
      //     { path: "overview", element: <Overview /> },
      //     { path: "settings", element: <Settings /> },
      //   ],
      // },
    ],
  },
]);
function App() {
  return <RouterProvider router={router} />;
}

export default App;
