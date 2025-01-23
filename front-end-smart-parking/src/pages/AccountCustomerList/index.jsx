import Search from "./Search";
import DividerCustom from "@/components/DividerCustom";
import TableCustomListAccountCustomer from "@/components/TableCustomListAccountCustomer";

const AccountCustomerList = () => {
  return (
    <div>
      <Search />
      <DividerCustom style={{ width: "80%" }} />
      <TableCustomListAccountCustomer />
    </div>
  );
};

export default AccountCustomerList;
