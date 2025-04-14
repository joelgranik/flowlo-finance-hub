
import { Outlet } from "react-router-dom";
import DataEntryNav from "@/components/DataEntryNav";

const DataEntryPage = () => {
  return (
    <div>
      <DataEntryNav />
      <Outlet />
    </div>
  );
};

export default DataEntryPage;
