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
import DetailTicketCustomer from "./pages/customer/DetailTicket";
import DetailTicketPartner from "./pages/partner/DetailTicket";
import ListCard from "./pages/admin/ListCard";
import ListCardWaitApprove from "./pages/admin/ListCardWaitApprove";
import MapAllLocation from "./pages/admin/MapAllLocation";
import ListLocation from "./pages/admin/ListLocation";
import ListLocationWaitApprove from "./pages/admin/ListLocationWaitApprove";
import ComponentDemo from "./pages/ComponentDemo";
import CardDetail from "./pages/admin/CardDetail";
import DetailLocation from "./pages/admin/DetailLocation";
import DetailLocationPublic from "./pages/Public/DetailLocation";
import DetailTicketPublic from "./pages/Public/DetailTicket";
import PartnerLayout from "./components/layout/partner";
import DashboardPartner from "./pages/partner/DashBoardPartner";
import AddLocation from "./pages/partner/AddLocation";
import ListLocationPartner from "./pages/partner/ListLocation";
import DetailLocationPartner from "./pages/partner/DetailLocation";
import AddTicket from "./pages/partner/AddTicket";
import ListTicketPartner from "./pages/partner/ListTicket";
import Authen from "./pages/Authen"
import CustomerLayout from "./components/layout/Customer";
import Introduce from "./pages/Public/Introduce";
import ChooseLocation from "./pages/Public/ChooseLocation";
import ChooseTicket from "./pages/Public/ChooseTicket";
import OrderTicket from "./pages/customer/OrderTicket";
import ConfirmOrder from "./pages/customer/ConfirmOrder";
import Payment from "./pages/customer/Payment";
import TicketList from "./pages/customer/TicketList";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { path: "/", element: <Introduce /> },
      { path: "/choose/location", element: <ChooseLocation />},
      { path: "/choose/ticket/:locationId", element: <ChooseTicket />},
      { path: "/location/:id", element: <DetailLocationPublic />},
      { path: "/ticket/:id", element: <DetailTicketPublic />},
      { path: "/order/confirm", element: <ConfirmOrder />},
      { path: "/order/:id", element: <OrderTicket />},
      { path: "/payment/:id", element: <Payment />},
      { path: "/list/ticket", element: <TicketList />},
      { path: "/ticket/detail/:id", element: <DetailTicketCustomer />},
    ]
  },
  { path: "authen", element: <Authen /> },
  { path: "register", element: <Authen /> },
  { path: "forget", element: <Authen /> },
  {
    path: "/admin",
    element: <AdminLayout />,
    children: [
      { path: "demo", element: <ComponentDemo /> },
      { index: true, element: <DashBoardAdmin /> },
      { path: "account/partner", element: <PartnerList /> },
      { path: "account/partner/:id", element: <PartnerInfo /> },
      { path: "account/customer/:id", element: <AccountCustomerInfo /> },
      { path: "account/create", element: <CreateAccount /> },
      { path: "account/*", element: <AccountCustomerList /> },

      { path: "ticket", element: <ListTicket /> },
      { path: "ticket/request", element: <RequestApproveTicket /> },
      { path: "ticket/detail/:isWaitRelease/:id", element: <DetailTicket /> },

      { path: "card", element: <ListCard /> },
      { path: "card/wait-approve", element: <ListCardWaitApprove /> },
      { path: "card/detail/:waiting/:id", element: <CardDetail /> },

      { path: "location", element: <ListLocation /> },
      { path: "location/detail/:tab/:id", element: <DetailLocation /> },
      { path: "location/wait-approve", element: <ListLocationWaitApprove /> },
      { path: "location/map/all", element: <MapAllLocation /> },
    ],
  }, 
  {
    path: "/partner",
    element: <PartnerLayout />,
    children: [
      { path: "demo", element: <ComponentDemo /> },
      { index: true, element: <DashboardPartner /> },
      { path: "location/add", element: <AddLocation isModify={false}/> },
      { path: "location/edit/:id", element: <AddLocation isModify={true}/> },
      { path: "location/list", element: <ListLocationPartner /> },
      { path: "location/detail/:tab/:id", element: <DetailLocationPartner /> },
      { path: "account/partner/:id", element: <PartnerInfo /> },
      { path: "account/customer/:id", element: <AccountCustomerInfo /> },

      { path: "ticket/add", element: <AddTicket waitRelease={false}/> },
      { path: "ticket/edit/:id", element: <AddTicket waitRelease={false}/> },
      { path: "ticket/list", element: <ListTicketPartner /> },
      { path: "ticket/detail/:isWaitRelease/:id", element: <DetailTicketPartner /> },
    ]
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
