import { createBrowserRouter, RouterProvider } from "react-router-dom";
import FullPageLoading from "./components/FullPageLoading";
import AdminLayout from "./components/layout/admin";
import CustomerLayout from "./components/layout/Customer";
import NotFound from "./components/layout/NotFound";
import PartnerLayout from "./components/layout/partner";
import AccountCustomerInfo from "./pages/admin/AccountCustomerInfo";
import AccountCustomerList from "./pages/admin/AccountCustomerList";
import CardDetail from "./pages/admin/CardDetail";
import CreateAccount from "./pages/admin/CreateAccount";
import DashBoardAdmin from "./pages/admin/DashBoardAdmin";
import DetailLocation from "./pages/admin/DetailLocation";
import DetailTicket from "./pages/admin/DetailTicket";
import ListCard from "./pages/admin/ListCard";
import ListCardWaitApprove from "./pages/admin/ListCardWaitApprove";
import ListLocation from "./pages/admin/ListLocation";
import ListLocationWaitApprove from "./pages/admin/ListLocationWaitApprove";
import ListTicket from "./pages/admin/ListTicket";
import MapAllLocation from "./pages/admin/MapAllLocation";
import PartnerInfo from "./pages/admin/PartnerInfo";
import PartnerList from "./pages/admin/PartnerList";
import RequestApproveTicket from "./pages/admin/RequestApproveTicket";
import Authen from "./pages/Authen";
import ComponentDemo from "./pages/ComponentDemo";
import CardManager from "./pages/customer/CardManager";
import ConfirmOrder from "./pages/customer/ConfirmOrder";
import Deposit from "./pages/customer/Deposit";
import DetailTicketCustomer from "./pages/customer/DetailTicket";
import OrderTicket from "./pages/customer/OrderTicket";
import Payment from "./pages/customer/Payment";
import TicketList from "./pages/customer/TicketList";
import TransactionHistory from "./pages/customer/TransactionHistory";
import AddLocation from "./pages/partner/AddLocation";
import AddTicket from "./pages/partner/AddTicket";
import DashboardPartner from "./pages/partner/DashBoardPartner";
import DetailLocationPartner from "./pages/partner/DetailLocation";
import DetailTicketPartner from "./pages/partner/DetailTicket";
import ListLocationPartner from "./pages/partner/ListLocation";
import ListTicketPartner from "./pages/partner/ListTicket";
import ChooseLocation from "./pages/Public/ChooseLocation";
import ChooseTicket from "./pages/Public/ChooseTicket";
import DetailLocationPublic from "./pages/Public/DetailLocation";
import DetailTicketPublic from "./pages/Public/DetailTicket";
import Introduce from "./pages/Public/Introduce";
import ChangePassword from "./pages/common/ChangePassword";
import StatisticsBusiness from "./pages/admin/statistics/StatisticsBusiness";
import StatisticTicket from "./pages/admin/statistics/StatisticTicket";

const router = createBrowserRouter([
  {
    path: "/",
    element: <CustomerLayout />,
    children: [
      { path: "/", element: <Introduce /> },
      { path: "/choose/location", element: <ChooseLocation /> },
      { path: "/choose/ticket/:locationId", element: <ChooseTicket /> },
      { path: "/location/:id", element: <DetailLocationPublic /> },
      { path: "/ticket/:id", element: <DetailTicketPublic /> },
      { path: "/order/confirm", element: <ConfirmOrder /> },
      { path: "/order/:id", element: <OrderTicket /> },
      { path: "/payment/:id", element: <Payment /> },
      { path: "/list/ticket", element: <TicketList /> },
      { path: "/ticket/detail/:id", element: <DetailTicketCustomer /> },
      { path: "/card", element: <CardManager /> },
      { path: "/deposit", element: <Deposit /> },
      { path: "/account/transaction", element: <TransactionHistory /> },
      { path: "/account/change-password", element: <ChangePassword /> },
    ]
  },
  { path: "authen", element: <Authen /> },
  { path: "register", element: <Authen /> },
  { path: "confirm-regis", element: <Authen /> },
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

      { path: "statistics/business", element: <StatisticsBusiness /> },
      { path: "statistics/ticket", element: <StatisticTicket /> },
    ],
  },
  {
    path: "/partner",
    element: <PartnerLayout />,
    children: [
      { path: "demo", element: <ComponentDemo /> },
      { index: true, element: <DashboardPartner /> },
      { path: "location/add", element: <AddLocation isModify={false} /> },
      { path: "location/edit/:id", element: <AddLocation isModify={true} /> },
      { path: "location/list", element: <ListLocationPartner /> },
      { path: "location/detail/:tab/:id", element: <DetailLocationPartner /> },
      { path: "account/partner/:id", element: <PartnerInfo /> },
      { path: "account/customer/:id", element: <AccountCustomerInfo /> },

      { path: "ticket/add", element: <AddTicket waitRelease={false} /> },
      { path: "ticket/edit/:id", element: <AddTicket waitRelease={false} /> },
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
