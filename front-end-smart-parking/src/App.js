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
import NotFound from "./components/layout/NotFound";
import RequestApproveTicket from "./pages/admin/RequestApproveTicket";
import DetailTicket from "./pages/admin/DetailTicket";
import ListCard from "./pages/admin/ListCard";
import ListCardWaitApprove from "./pages/admin/ListCardWaitApprove";
import MapAllLocation from "./pages/admin/MapAllLocation";
import ListLocation from "./pages/admin/ListLocation";
import ListLocationWaitApprove from "./pages/admin/ListLocationWaitApprove";
const router = createBrowserRouter([
  {
    path: "/",
    element: <AdminLayout />,
    children: [
      { index: true, path: "/", element: <DashBoardAdmin /> },
      { path: "/account/partner", element: <PartnerList /> },
      { path: "/account/partner/:id", element: <PartnerInfo /> },
      { path: "/account/customer/:id", element: <AccountCustomerInfo /> },
      { path: "/account/create", element: <CreateAccount /> },
      { path: "/account/*", element: <AccountCustomerList /> },

      { path: "/ticket", element: <ListTicket /> },
      { path: "/ticket/request", element: <RequestApproveTicket /> },
      { path: "/ticket/detail/:isIdModify/:tabStatus/:id", element: <DetailTicket /> },

      { path: "/card", element: <ListCard /> },
      { path: "/card/wait-approve", element: <ListCardWaitApprove /> },

      { path: "/location", element: <ListLocation /> },
      { path: "/location/wait-approve", element: <ListLocationWaitApprove /> },
      { path: "/location/map/all", element: <MapAllLocation /> },
      
    
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
  {
    path: "/*",
    element: <NotFound />,
  }
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
