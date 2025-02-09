import { createBrowserRouter, RouterProvider } from "react-router-dom";
import AdminLayout from "./components/layout/admin";
import DashBoardAdmin from "./pages/admin/DashBoardAdmin";
import AccountCustomerList from "./pages/admin/AccountCustomerList";
import AccountCustomerInfo from "./pages/admin/AccountCustomerInfo";
import FullPageLoading from "./components/FullPageLoading";
import PartnerList from "./pages/admin/PartnerList";
import PartnerInfo from "./pages/admin/PartnerInfo";
import CreateAccount from "./pages/admin/CreateAccount";
import ListTicket from "./pages/admin/ListTicket";
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

      { path: "/ticket", element: <ListTicket /> },
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
