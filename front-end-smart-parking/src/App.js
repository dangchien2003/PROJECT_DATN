import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./components/layout/admin";
import DashBoardAdmin from "./pages/DashBoardAdmin";
import AccountCustomerList from "./pages/AccountCustomerList";
import AccountCustomerInfo from "./pages/AccountCustomerInfo";
import FullPageLoading from "./components/FullPageLoading";
import PartnerList from "./pages/PartnerList";
import PartnerInfo from "./pages/PartnerInfo";
import CreateAccount from "./pages/CreateAccount";

const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { index: true, element: <DashBoardAdmin /> },
      { path: "/account/partner", element: <PartnerList /> },
      { path: "/account/partner/:id", element: <PartnerInfo /> },
      { path: "/account/customer/:id", element: <AccountCustomerInfo /> },
      { path: "/account/create", element: <CreateAccount /> },
      { path: "/account/*", element: <AccountCustomerList /> },
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
  return (
    <div>
      <FullPageLoading />
      <RouterProvider router={router} />
    </div>
  );
}

export default App;
